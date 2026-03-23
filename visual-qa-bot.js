/**
 * FREAKMATH 시각화 QA 봇
 * 
 * 각 공식 페이지를 Puppeteer로 열고, 스크린샷을 찍고,
 * 눈에 보이는 문제를 자동 감지합니다.
 * 
 * 사용법:
 *   cd C:\Users\ADMIN\OneDrive\Desktop\freakmath
 *   npm install puppeteer
 *   node visual-qa-bot.js
 * 
 * 선행 조건: dev 서버가 localhost:3000에서 돌고 있어야 함
 *   npm run dev
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ============================================================
// 설정
// ============================================================
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = './qa-screenshots';
const REPORT_PATH = './qa-report.json';
const VIEWPORT = { width: 1280, height: 900 };

// 공식 ID 목록 생성
function generateFormulaIds() {
  const ids = [];
  // 초등 E001 ~ E050
  for (let i = 1; i <= 50; i++) {
    ids.push(`E${String(i).padStart(3, '0')}`);
  }
  // 중등 M001 ~ M076
  for (let i = 1; i <= 76; i++) {
    ids.push(`M${String(i).padStart(3, '0')}`);
  }
  // 고등 H001 ~ H070
  for (let i = 1; i <= 70; i++) {
    ids.push(`H${String(i).padStart(3, '0')}`);
  }
  return ids;
}

// ============================================================
// 감지 규칙들 (브라우저 안에서 실행됨)
// ============================================================
function detectIssuesInBrowser() {
  const issues = [];

  // 1. NaN 텍스트 감지
  const bodyText = document.body.innerText;
  const nanMatches = bodyText.match(/NaN/g);
  if (nanMatches) {
    issues.push({
      type: 'NaN_DETECTED',
      severity: 'HIGH',
      message: `화면에 NaN이 ${nanMatches.length}개 표시됨`,
      count: nanMatches.length,
    });
  }

  // 2. undefined 텍스트 감지
  const undefMatches = bodyText.match(/undefined/gi);
  if (undefMatches) {
    issues.push({
      type: 'UNDEFINED_DETECTED',
      severity: 'HIGH',
      message: `화면에 undefined가 ${undefMatches.length}개 표시됨`,
      count: undefMatches.length,
    });
  }

  // 3. [object Object] 감지
  const objMatches = bodyText.match(/\[object Object\]/g);
  if (objMatches) {
    issues.push({
      type: 'OBJECT_OBJECT',
      severity: 'HIGH',
      message: `[object Object]가 ${objMatches.length}개 표시됨`,
      count: objMatches.length,
    });
  }

  // 4. Canvas 크기 검사
  const canvases = document.querySelectorAll('canvas');
  canvases.forEach((canvas, idx) => {
    const rect = canvas.getBoundingClientRect();

    // 너무 작은 캔버스 (기본 300x150 그대로인 경우)
    if (canvas.width === 300 && canvas.height === 150) {
      issues.push({
        type: 'CANVAS_DEFAULT_SIZE',
        severity: 'MEDIUM',
        message: `Canvas #${idx}: 기본 크기 300x150 그대로 (리사이즈 안 됨)`,
      });
    }

    // 캔버스가 화면에 안 보이는 경우
    if (rect.width === 0 || rect.height === 0) {
      issues.push({
        type: 'CANVAS_INVISIBLE',
        severity: 'HIGH',
        message: `Canvas #${idx}: 크기가 0 (화면에 안 보임)`,
      });
    }

    // 캔버스가 컨테이너를 벗어나는 경우
    const parent = canvas.parentElement;
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      if (rect.width > parentRect.width + 5) {
        issues.push({
          type: 'CANVAS_OVERFLOW',
          severity: 'MEDIUM',
          message: `Canvas #${idx}: 부모보다 넓음 (${Math.round(rect.width)} > ${Math.round(parentRect.width)})`,
        });
      }
    }

    // 캔버스가 완전히 빈 상태인지 검사
    try {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const w = Math.min(canvas.width, 200);
        const h = Math.min(canvas.height, 200);
        if (w > 0 && h > 0) {
          const imageData = ctx.getImageData(0, 0, w, h);
          const pixels = imageData.data;
          let nonEmpty = 0;
          for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] > 0) nonEmpty++;
          }
          if (nonEmpty === 0) {
            issues.push({
              type: 'CANVAS_EMPTY',
              severity: 'HIGH',
              message: `Canvas #${idx}: 완전히 비어있음 (아무것도 안 그려짐)`,
            });
          }
        }
      }
    } catch (e) {
      // CORS 등으로 getImageData 실패 시 무시
    }
  });

  // 5. 캔버스가 아예 없는 경우 (시각화 섹션인데)
  const vizSection = document.querySelector('[data-section="visualization"], .visualization, #visualization, [class*="visual"], [class*="canvas"]');
  if (vizSection && canvases.length === 0) {
    // SVG도 확인
    const svgs = vizSection.querySelectorAll('svg');
    if (svgs.length === 0) {
      issues.push({
        type: 'NO_VISUALIZATION',
        severity: 'HIGH',
        message: '시각화 영역에 Canvas/SVG가 없음',
      });
    }
  }

  // 6. 에러 메시지 감지
  const errorElements = document.querySelectorAll('[class*="error"], [class*="Error"], .text-red-500, .text-red-600');
  errorElements.forEach((el, idx) => {
    const text = el.innerText.trim();
    if (text && text.length > 0) {
      issues.push({
        type: 'ERROR_MESSAGE_VISIBLE',
        severity: 'HIGH',
        message: `에러 UI 요소 발견: "${text.slice(0, 80)}"`,
      });
    }
  });

  // 7. 이미지 깨짐 감지
  const images = document.querySelectorAll('img');
  images.forEach((img, idx) => {
    if (!img.complete || img.naturalWidth === 0) {
      issues.push({
        type: 'BROKEN_IMAGE',
        severity: 'MEDIUM',
        message: `이미지 #${idx} 로딩 실패: ${img.src.slice(0, 60)}`,
      });
    }
  });

  // 8. 텍스트 오버플로 감지 (잘리는 텍스트)
  const allElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, li');
  let overflowCount = 0;
  allElements.forEach((el) => {
    if (el.scrollWidth > el.clientWidth + 20 && el.clientWidth > 0) {
      overflowCount++;
    }
  });
  if (overflowCount > 3) {
    issues.push({
      type: 'TEXT_OVERFLOW',
      severity: 'LOW',
      message: `텍스트 오버플로 요소 ${overflowCount}개 감지`,
    });
  }

  // 9. KaTeX 렌더링 에러 감지
  const katexErrors = document.querySelectorAll('.katex-error');
  if (katexErrors.length > 0) {
    issues.push({
      type: 'KATEX_ERROR',
      severity: 'HIGH',
      message: `KaTeX 렌더링 에러 ${katexErrors.length}개`,
      details: Array.from(katexErrors).map(e => e.title || e.innerText).slice(0, 3),
    });
  }

  // 10. 빈 페이지 감지
  if (bodyText.trim().length < 50) {
    issues.push({
      type: 'EMPTY_PAGE',
      severity: 'CRITICAL',
      message: '페이지가 거의 비어있음 (텍스트 50자 미만)',
    });
  }

  // 11. 중복 콘텐츠 감지 (같은 텍스트가 3번 이상 반복)
  const paragraphs = document.querySelectorAll('p');
  const textCounts = {};
  paragraphs.forEach((p) => {
    const t = p.innerText.trim();
    if (t.length > 20) {
      textCounts[t] = (textCounts[t] || 0) + 1;
    }
  });
  Object.entries(textCounts).forEach(([text, count]) => {
    if (count >= 3) {
      issues.push({
        type: 'DUPLICATE_CONTENT',
        severity: 'MEDIUM',
        message: `같은 텍스트가 ${count}번 반복: "${text.slice(0, 50)}..."`,
      });
    }
  });

  return issues;
}

// ============================================================
// 콘솔 에러 수집
// ============================================================
function setupConsoleCapture(page) {
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  return consoleErrors;
}

// ============================================================
// 메인 실행
// ============================================================
async function runQA() {
  console.log('🔍 FREAKMATH 시각화 QA 봇 시작\n');

  // 스크린샷 폴더 생성
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const formulaIds = generateFormulaIds();
  const results = [];
  let totalIssues = 0;

  console.log(`📋 총 ${formulaIds.length}개 공식 검사 예정\n`);

  for (let i = 0; i < formulaIds.length; i++) {
    const id = formulaIds[i];
    const progress = `[${i + 1}/${formulaIds.length}]`;

    try {
      const page = await browser.newPage();
      await page.setViewport(VIEWPORT);
      const consoleErrors = setupConsoleCapture(page);

      // ★ 여기서 URL 패턴을 프로젝트에 맞게 수정해야 할 수 있음
      // 가능한 패턴들:
      //   /formula/E001
      //   /formulas/E001
      //   /elementary/E001
      //   /formula/[id]
      const url = `${BASE_URL}/formula/${id}`;

      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Canvas 애니메이션이 그려질 시간 대기
      await new Promise(r => setTimeout(r, 2000));

      // 브라우저 내에서 문제 감지
      const pageIssues = await page.evaluate(detectIssuesInBrowser);

      // 콘솔 에러 추가
      if (consoleErrors.length > 0) {
        pageIssues.push({
          type: 'CONSOLE_ERRORS',
          severity: 'MEDIUM',
          message: `콘솔 에러 ${consoleErrors.length}개`,
          details: consoleErrors.slice(0, 5),
        });
      }

      // 문제가 있으면 스크린샷 저장
      if (pageIssues.length > 0) {
        const screenshotPath = path.join(SCREENSHOT_DIR, `${id}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
      }

      const result = {
        id,
        url,
        issues: pageIssues,
        issueCount: pageIssues.length,
        timestamp: new Date().toISOString(),
      };

      results.push(result);
      totalIssues += pageIssues.length;

      // 진행 상태 출력
      if (pageIssues.length > 0) {
        const severities = pageIssues.map(i => i.severity);
        const hasCritical = severities.includes('CRITICAL');
        const hasHigh = severities.includes('HIGH');
        const icon = hasCritical ? '🔴' : hasHigh ? '🟠' : '🟡';
        console.log(`${progress} ${icon} ${id}: ${pageIssues.length}개 문제`);
        pageIssues.forEach(issue => {
          console.log(`       ${issue.severity}: ${issue.message}`);
        });
      } else {
        console.log(`${progress} ✅ ${id}: OK`);
      }

      await page.close();
    } catch (err) {
      console.log(`${progress} 💀 ${id}: 페이지 로딩 실패 - ${err.message.slice(0, 60)}`);
      results.push({
        id,
        url: `${BASE_URL}/formula/${id}`,
        issues: [{
          type: 'PAGE_LOAD_FAILED',
          severity: 'CRITICAL',
          message: err.message.slice(0, 200),
        }],
        issueCount: 1,
        timestamp: new Date().toISOString(),
      });
      totalIssues++;
    }
  }

  await browser.close();

  // ============================================================
  // 리포트 생성
  // ============================================================
  const problemFormulas = results.filter(r => r.issueCount > 0);
  const report = {
    summary: {
      total: formulaIds.length,
      passed: results.filter(r => r.issueCount === 0).length,
      failed: problemFormulas.length,
      totalIssues,
      byType: {},
      bySeverity: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
    },
    problems: problemFormulas,
    allResults: results,
  };

  // 이슈 타입별 집계
  results.forEach(r => {
    r.issues.forEach(issue => {
      report.summary.byType[issue.type] = (report.summary.byType[issue.type] || 0) + 1;
      report.summary.bySeverity[issue.severity] = (report.summary.bySeverity[issue.severity] || 0) + 1;
    });
  });

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');

  // ============================================================
  // 최종 요약 출력
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('📊 FREAKMATH QA 리포트');
  console.log('='.repeat(60));
  console.log(`✅ 통과: ${report.summary.passed}개`);
  console.log(`❌ 문제: ${report.summary.failed}개`);
  console.log(`📸 스크린샷: ${SCREENSHOT_DIR}/`);
  console.log(`📄 상세 리포트: ${REPORT_PATH}`);
  console.log('');
  console.log('이슈 유형별:');
  Object.entries(report.summary.byType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}개`);
    });
  console.log('');
  console.log('심각도별:');
  Object.entries(report.summary.bySeverity)
    .filter(([, count]) => count > 0)
    .forEach(([severity, count]) => {
      console.log(`  ${severity}: ${count}개`);
    });

  // Claude Code에 바로 넘길 수 있는 요약
  console.log('\n' + '='.repeat(60));
  console.log('📋 Claude Code에 붙여넣을 수정 목록:');
  console.log('='.repeat(60));
  problemFormulas
    .sort((a, b) => {
      const sevOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      const aMax = Math.min(...a.issues.map(i => sevOrder[i.severity] ?? 3));
      const bMax = Math.min(...b.issues.map(i => sevOrder[i.severity] ?? 3));
      return aMax - bMax;
    })
    .forEach(r => {
      console.log(`\n${r.id}:`);
      r.issues.forEach(issue => {
        console.log(`  - [${issue.severity}] ${issue.message}`);
      });
    });
}

runQA().catch(console.error);

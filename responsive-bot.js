/**
 * FREAKMATH 반응형 디자인 검증 봇
 * 
 * 검증 항목:
 * 1. 모바일(375px), 태블릿(768px), 데스크탑(1280px)에서 레이아웃
 * 2. 가로 스크롤 발생 여부
 * 3. Canvas가 뷰포트에 맞게 리사이즈되는지
 * 4. 터치 타겟 크기 (버튼/링크가 너무 작지 않은지)
 * 5. 텍스트 가독성 (너무 작거나 큰 폰트)
 * 
 * 사용법:
 *   node responsive-bot.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://freakmath.vercel.app';
const SCREENSHOT_DIR = './qa-responsive-screenshots';
const REPORT_PATH = './qa-responsive-report.json';

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

function generateFormulaIds() {
  const ids = [];
  for (let i = 1; i <= 50; i++) ids.push(`E${String(i).padStart(3, '0')}`);
  for (let i = 1; i <= 76; i++) ids.push(`M${String(i).padStart(3, '0')}`);
  for (let i = 1; i <= 75; i++) ids.push(`H${String(i).padStart(3, "0")}`);
  return ids;
}

function checkResponsive(viewportName) {
  const issues = [];
  const body = document.body;
  const html = document.documentElement;

  // 1. 가로 스크롤 감지
  if (body.scrollWidth > html.clientWidth + 5) {
    issues.push({
      type: 'HORIZONTAL_SCROLL',
      severity: 'HIGH',
      message: `가로 스크롤 발생 (body: ${body.scrollWidth}px > viewport: ${html.clientWidth}px)`,
      overflow: body.scrollWidth - html.clientWidth,
    });

    // 어떤 요소가 넘치는지 찾기
    const allElements = document.querySelectorAll('*');
    const overflowing = [];
    allElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > html.clientWidth + 5 && rect.width > 0) {
        const tag = el.tagName.toLowerCase();
        const cls = el.className ? `.${String(el.className).split(' ')[0]}` : '';
        overflowing.push(`${tag}${cls} (right: ${Math.round(rect.right)}px)`);
      }
    });
    if (overflowing.length > 0) {
      issues.push({
        type: 'OVERFLOW_ELEMENTS',
        severity: 'MEDIUM',
        message: `넘치는 요소: ${overflowing.slice(0, 5).join(', ')}`,
      });
    }
  }

  // 2. Canvas 크기 vs 뷰포트
  const canvases = document.querySelectorAll('canvas');
  canvases.forEach((canvas, idx) => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width > html.clientWidth) {
      issues.push({
        type: 'CANVAS_OVERFLOW_VIEWPORT',
        severity: 'HIGH',
        message: `Canvas #${idx}: 뷰포트보다 넓음 (${Math.round(rect.width)}px > ${html.clientWidth}px)`,
      });
    }
    // 모바일에서 Canvas가 너무 작은 경우
    if (viewportName === 'mobile' && rect.width < 200 && rect.width > 0) {
      issues.push({
        type: 'CANVAS_TOO_SMALL_MOBILE',
        severity: 'MEDIUM',
        message: `Canvas #${idx}: 모바일에서 너무 작음 (${Math.round(rect.width)}px)`,
      });
    }
  });

  // 3. 터치 타겟 크기 (모바일에서 44px 미만이면 문제)
  if (viewportName === 'mobile') {
    const interactive = document.querySelectorAll('a, button, input, [role="button"], [onclick]');
    let smallTargets = 0;
    interactive.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
        smallTargets++;
      }
    });
    if (smallTargets > 5) {
      issues.push({
        type: 'SMALL_TOUCH_TARGETS',
        severity: 'MEDIUM',
        message: `44px 미만 터치 타겟 ${smallTargets}개 (모바일 사용성 문제)`,
      });
    }
  }

  // 4. 텍스트 잘림/겹침 감지
  const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, li, td, th, label');
  let overlapping = 0;
  const rects = [];
  textElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    // 같은 위치에 겹치는 요소 감지
    rects.forEach(prevRect => {
      if (Math.abs(rect.top - prevRect.top) < 5 &&
          Math.abs(rect.left - prevRect.left) < 5 &&
          rect.width > 10 && prevRect.width > 10) {
        overlapping++;
      }
    });
    rects.push(rect);
  });

  if (overlapping > 3) {
    issues.push({
      type: 'OVERLAPPING_TEXT',
      severity: 'MEDIUM',
      message: `겹치는 텍스트 요소 ${overlapping}개 감지`,
    });
  }

  // 5. 이미지/미디어가 뷰포트를 넘는지
  const media = document.querySelectorAll('img, video, iframe, svg');
  media.forEach((el, idx) => {
    const rect = el.getBoundingClientRect();
    if (rect.width > html.clientWidth + 5) {
      issues.push({
        type: 'MEDIA_OVERFLOW',
        severity: 'MEDIUM',
        message: `${el.tagName} #${idx}: 뷰포트보다 넓음 (${Math.round(rect.width)}px)`,
      });
    }
  });

  // 6. 폰트 크기 검사
  if (viewportName === 'mobile') {
    const bodyStyle = window.getComputedStyle(document.body);
    const bodyFontSize = parseFloat(bodyStyle.fontSize);
    if (bodyFontSize < 12) {
      issues.push({
        type: 'FONT_TOO_SMALL',
        severity: 'LOW',
        message: `본문 폰트가 ${bodyFontSize}px (모바일에서 최소 14px 권장)`,
      });
    }
  }

  return issues;
}

async function runResponsiveBot() {
  console.log('📱 FREAKMATH 반응형 디자인 검증 봇 시작\n');

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const formulaIds = generateFormulaIds();
  // 전수 검사 대신 샘플링 (빠른 실행을 위해)
  // 초등 10개, 중등 10개 랜덤 + 문제 있었던 공식 포함
  const sampleIds = [
    'E001', 'E002', 'E005', 'E010', 'E020', 'E025', 'E030', 'E040', 'E046', 'E050',
    'M001', 'M010', 'M020', 'M030', 'M040', 'M053', 'M056', 'M060', 'M070', 'M076',
  ];

  const results = [];
  let totalIssues = 0;

  console.log(`📋 ${sampleIds.length}개 공식 × ${VIEWPORTS.length}개 뷰포트 = ${sampleIds.length * VIEWPORTS.length}회 검사\n`);

  for (let i = 0; i < sampleIds.length; i++) {
    const id = sampleIds[i];

    for (const viewport of VIEWPORTS) {
      const progress = `[${id}/${viewport.name}]`;

      try {
        const page = await browser.newPage();
        await page.setViewport({ width: viewport.width, height: viewport.height });

        const url = `${BASE_URL}/formula/${id}`;
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 1000));

        const pageIssues = await page.evaluate(checkResponsive, viewport.name);

        if (pageIssues.length > 0) {
          // 문제 있으면 스크린샷
          const screenshotPath = path.join(SCREENSHOT_DIR, `${id}_${viewport.name}.png`);
          await page.screenshot({ path: screenshotPath, fullPage: true });
        }

        results.push({
          id,
          viewport: viewport.name,
          viewportSize: `${viewport.width}x${viewport.height}`,
          issues: pageIssues,
          issueCount: pageIssues.length,
        });
        totalIssues += pageIssues.length;

        if (pageIssues.length > 0) {
          const hasHigh = pageIssues.some(i => i.severity === 'HIGH');
          console.log(`${progress} ${hasHigh ? '🟠' : '🟡'} ${pageIssues.length}개 문제`);
          pageIssues.forEach(issue => console.log(`         ${issue.severity}: ${issue.message}`));
        } else {
          console.log(`${progress} ✅ OK`);
        }

        await page.close();
      } catch (err) {
        console.log(`${progress} 💀 실패`);
        results.push({
          id, viewport: viewport.name, issues: [{ type: 'LOAD_FAILED', severity: 'CRITICAL', message: err.message.slice(0, 80) }], issueCount: 1,
        });
        totalIssues++;
      }
    }
  }

  await browser.close();

  // 뷰포트별 요약
  const byViewport = {};
  VIEWPORTS.forEach(v => {
    const vpResults = results.filter(r => r.viewport === v.name);
    byViewport[v.name] = {
      tested: vpResults.length,
      passed: vpResults.filter(r => r.issueCount === 0).length,
      failed: vpResults.filter(r => r.issueCount > 0).length,
    };
  });

  const report = {
    botName: 'responsive',
    summary: { totalTests: results.length, totalIssues, byViewport },
    problems: results.filter(r => r.issueCount > 0),
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log('\n' + '='.repeat(50));
  console.log('📱 반응형 디자인 리포트');
  VIEWPORTS.forEach(v => {
    const s = byViewport[v.name];
    console.log(`  ${v.name} (${v.width}px): ✅${s.passed} ❌${s.failed}`);
  });
  console.log(`📄 리포트: ${REPORT_PATH}`);
  console.log('='.repeat(50));
}

runResponsiveBot().catch(console.error);

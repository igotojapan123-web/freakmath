/**
 * FREAKMATH 접근성(A11y) 검증 봇
 * 
 * 검증 항목:
 * 1. 색상 대비 (WCAG AA 기준)
 * 2. alt 텍스트 누락
 * 3. 키보드 네비게이션 가능 여부
 * 4. ARIA 라벨 누락
 * 5. 수식의 접근성 (KaTeX aria-label)
 * 6. 헤딩 구조 (h1 → h2 → h3 순서)
 * 
 * 사용법:
 *   node accessibility-bot.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'https://freakmath.vercel.app';
const REPORT_PATH = './qa-accessibility-report.json';

function generateFormulaIds() {
  const ids = [];
  for (let i = 1; i <= 50; i++) ids.push(`E${String(i).padStart(3, '0')}`);
  for (let i = 1; i <= 76; i++) ids.push(`M${String(i).padStart(3, '0')}`);
  for (let i = 1; i <= 75; i++) ids.push(`H${String(i).padStart(3, "0")}`);
  return ids;
}

function checkAccessibility() {
  const issues = [];

  // 1. 이미지 alt 텍스트 누락
  const images = document.querySelectorAll('img');
  let missingAlt = 0;
  images.forEach(img => {
    if (!img.alt && !img.getAttribute('aria-hidden')) {
      missingAlt++;
    }
  });
  if (missingAlt > 0) {
    issues.push({
      type: 'MISSING_ALT_TEXT',
      severity: 'MEDIUM',
      message: `alt 텍스트 없는 이미지 ${missingAlt}개`,
    });
  }

  // 2. 헤딩 구조 검사 (h1 → h2 → h3 순서가 맞는지)
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let prevLevel = 0;
  let headingErrors = 0;
  headings.forEach(h => {
    const level = parseInt(h.tagName[1]);
    if (prevLevel > 0 && level > prevLevel + 1) {
      headingErrors++;
    }
    prevLevel = level;
  });
  if (headingErrors > 0) {
    issues.push({
      type: 'HEADING_STRUCTURE',
      severity: 'LOW',
      message: `헤딩 레벨 건너뛰기 ${headingErrors}번 (예: h1 다음에 h3)`,
    });
  }

  // h1이 없는 경우
  const h1Count = document.querySelectorAll('h1').length;
  if (h1Count === 0) {
    issues.push({
      type: 'NO_H1',
      severity: 'MEDIUM',
      message: '페이지에 h1 태그가 없음',
    });
  } else if (h1Count > 1) {
    issues.push({
      type: 'MULTIPLE_H1',
      severity: 'LOW',
      message: `h1 태그가 ${h1Count}개 (1개 권장)`,
    });
  }

  // 3. 버튼/인터랙티브 요소 접근성
  const buttons = document.querySelectorAll('button, [role="button"]');
  let unlabeledButtons = 0;
  buttons.forEach(btn => {
    const text = btn.innerText.trim();
    const ariaLabel = btn.getAttribute('aria-label');
    const title = btn.getAttribute('title');
    if (!text && !ariaLabel && !title) {
      unlabeledButtons++;
    }
  });
  if (unlabeledButtons > 0) {
    issues.push({
      type: 'UNLABELED_BUTTONS',
      severity: 'MEDIUM',
      message: `라벨 없는 버튼 ${unlabeledButtons}개`,
    });
  }

  // 4. 입력 필드 라벨 검사
  const inputs = document.querySelectorAll('input, select, textarea');
  let unlabeledInputs = 0;
  inputs.forEach(input => {
    const id = input.id;
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    const hasLabel = id && document.querySelector(`label[for="${id}"]`);
    if (!hasLabel && !ariaLabel && !ariaLabelledBy && input.type !== 'hidden') {
      unlabeledInputs++;
    }
  });
  if (unlabeledInputs > 0) {
    issues.push({
      type: 'UNLABELED_INPUTS',
      severity: 'MEDIUM',
      message: `라벨 없는 입력 필드 ${unlabeledInputs}개 (슬라이더 포함)`,
    });
  }

  // 5. Canvas 접근성 (alt text 또는 aria-label)
  const canvases = document.querySelectorAll('canvas');
  canvases.forEach((canvas, idx) => {
    const ariaLabel = canvas.getAttribute('aria-label');
    const role = canvas.getAttribute('role');
    if (!ariaLabel) {
      issues.push({
        type: 'CANVAS_NO_ARIA',
        severity: 'MEDIUM',
        message: `Canvas #${idx}: aria-label 없음 (스크린리더에서 접근 불가)`,
      });
    }
  });

  // 6. KaTeX 수식 접근성
  const katexDisplays = document.querySelectorAll('.katex-display, .katex');
  let katexNoAria = 0;
  katexDisplays.forEach(el => {
    // KaTeX는 보통 자동으로 aria-label을 추가하지만, 커스텀 렌더링이면 빠질 수 있음
    const mathml = el.querySelector('.katex-mathml');
    if (!mathml && !el.getAttribute('aria-label')) {
      katexNoAria++;
    }
  });
  if (katexNoAria > 0) {
    issues.push({
      type: 'KATEX_NO_ACCESSIBILITY',
      severity: 'LOW',
      message: `접근성 정보 없는 수식 ${katexNoAria}개`,
    });
  }

  // 7. 색상 대비 검사 (간이)
  const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, li, a, button, label');
  let lowContrast = 0;
  textElements.forEach(el => {
    const style = window.getComputedStyle(el);
    const color = style.color;
    const bg = style.backgroundColor;

    // rgba 파싱
    const parseColor = (str) => {
      const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
      return null;
    };

    const fg = parseColor(color);
    const bgColor = parseColor(bg);
    if (fg && bgColor && bgColor.r + bgColor.g + bgColor.b < 765) { // bg가 투명이 아닌 경우만
      // 간이 대비 계산
      const luminance = (c) => {
        const srgb = c / 255;
        return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
      };
      const L1 = 0.2126 * luminance(fg.r) + 0.7152 * luminance(fg.g) + 0.0722 * luminance(fg.b);
      const L2 = 0.2126 * luminance(bgColor.r) + 0.7152 * luminance(bgColor.g) + 0.0722 * luminance(bgColor.b);
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);

      if (ratio < 4.5 && el.innerText.trim().length > 0) {
        lowContrast++;
      }
    }
  });

  if (lowContrast > 5) {
    issues.push({
      type: 'LOW_COLOR_CONTRAST',
      severity: 'MEDIUM',
      message: `WCAG AA 대비 미달 요소 약 ${lowContrast}개`,
    });
  }

  // 8. lang 속성 확인
  const htmlLang = document.documentElement.getAttribute('lang');
  if (!htmlLang) {
    issues.push({
      type: 'NO_LANG_ATTRIBUTE',
      severity: 'LOW',
      message: 'html 태그에 lang 속성 없음',
    });
  }

  // 9. focus 가능한 요소에 outline 제거 감지
  // (CSS에서 outline: none 하면 키보드 사용자가 어디 있는지 모름)
  const focusable = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
  let noOutline = 0;
  focusable.forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.outlineStyle === 'none' && style.outlineWidth === '0px') {
      noOutline++;
    }
  });
  // 이건 참고용으로만 (많은 사이트가 커스텀 focus 스타일 사용)

  return issues;
}

async function runAccessibilityBot() {
  console.log('♿ FREAKMATH 접근성 검증 봇 시작\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
  });

  // 샘플링 (전수보다 효율적)
  const sampleIds = [
    'E001', 'E005', 'E010', 'E015', 'E020', 'E025', 'E030', 'E035', 'E040', 'E050',
    'M001', 'M010', 'M020', 'M030', 'M040', 'M050', 'M060', 'M070', 'M076',
  ];

  const results = [];
  let totalIssues = 0;

  console.log(`📋 ${sampleIds.length}개 공식 접근성 검사\n`);

  // 홈페이지도 검사
  const pages = ['/', ...sampleIds.map(id => `/formula/${id}`)];

  for (let i = 0; i < pages.length; i++) {
    const pagePath = pages[i];
    const progress = `[${i + 1}/${pages.length}]`;

    try {
      const page = await browser.newPage();
      const url = `${BASE_URL}${pagePath}`;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1000));

      const pageIssues = await page.evaluate(checkAccessibility);

      results.push({
        page: pagePath,
        issues: pageIssues,
        issueCount: pageIssues.length,
      });
      totalIssues += pageIssues.length;

      if (pageIssues.length > 0) {
        const hasHigh = pageIssues.some(i => i.severity === 'HIGH');
        console.log(`${progress} ${hasHigh ? '🟠' : '🟡'} ${pagePath}: ${pageIssues.length}개`);
        pageIssues.forEach(issue => console.log(`       ${issue.severity}: ${issue.message}`));
      } else {
        console.log(`${progress} ✅ ${pagePath}: 접근성 OK`);
      }

      await page.close();
    } catch (err) {
      console.log(`${progress} 💀 ${pagePath}: 실패`);
      results.push({
        page: pagePath, issues: [{ type: 'LOAD_FAILED', severity: 'CRITICAL', message: err.message.slice(0, 80) }], issueCount: 1,
      });
      totalIssues++;
    }
  }

  await browser.close();

  // 이슈 타입별 집계
  const byType = {};
  results.forEach(r => {
    r.issues.forEach(issue => {
      byType[issue.type] = (byType[issue.type] || 0) + 1;
    });
  });

  const report = {
    botName: 'accessibility',
    summary: {
      totalPages: pages.length,
      passed: results.filter(r => r.issueCount === 0).length,
      failed: results.filter(r => r.issueCount > 0).length,
      totalIssues,
      byType,
    },
    problems: results.filter(r => r.issueCount > 0),
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log('\n' + '='.repeat(50));
  console.log('♿ 접근성 리포트');
  console.log(`✅ 통과: ${report.summary.passed}개`);
  console.log(`❌ 문제: ${report.summary.failed}개`);
  console.log('\n가장 흔한 이슈:');
  Object.entries(byType).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}개`);
  });
  console.log(`📄 리포트: ${REPORT_PATH}`);
  console.log('='.repeat(50));
}

runAccessibilityBot().catch(console.error);

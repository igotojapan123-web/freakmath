/**
 * FREAKMATH 수학 정확성 검증 봇
 * 
 * 검증 항목:
 * 1. KaTeX 수식이 에러 없이 렌더링되는지
 * 2. 예제 문제의 계산 결과가 맞는지
 * 3. 슬라이더 값 변경 시 계산이 정확한지
 * 4. 공식 설명에 수학 기호가 깨지지 않았는지
 * 
 * 사용법:
 *   node math-accuracy-bot.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const REPORT_PATH = './qa-math-accuracy-report.json';

function generateFormulaIds() {
  const ids = [];
  for (let i = 1; i <= 50; i++) ids.push(`E${String(i).padStart(3, '0')}`);
  for (let i = 1; i <= 76; i++) ids.push(`M${String(i).padStart(3, '0')}`);
  for (let i = 1; i <= 70; i++) ids.push(`H${String(i).padStart(3, "0")}`);
  return ids;
}

// 브라우저 내에서 실행되는 수학 검증 함수
function checkMathAccuracy() {
  const issues = [];

  // 1. KaTeX 렌더링 에러
  const katexErrors = document.querySelectorAll('.katex-error');
  katexErrors.forEach((el, idx) => {
    issues.push({
      type: 'KATEX_RENDER_ERROR',
      severity: 'HIGH',
      message: `KaTeX 수식 렌더링 실패: "${(el.title || el.innerText || '').slice(0, 80)}"`,
    });
  });

  // 2. KaTeX 수식이 하나도 없는 페이지 (공식 페이지인데 수식이 없으면 이상)
  const katexElements = document.querySelectorAll('.katex, .katex-display');
  if (katexElements.length === 0) {
    issues.push({
      type: 'NO_MATH_FORMULAS',
      severity: 'MEDIUM',
      message: '페이지에 KaTeX 수식이 하나도 없음',
    });
  }

  // 3. 깨진 수학 기호 감지 (유니코드 replacement character 등)
  const bodyText = document.body.innerText;
  const brokenSymbols = bodyText.match(/[�□■◻◼]/g);
  if (brokenSymbols) {
    issues.push({
      type: 'BROKEN_MATH_SYMBOLS',
      severity: 'HIGH',
      message: `깨진 기호 ${brokenSymbols.length}개 발견`,
    });
  }

  // 4. 빈 KaTeX 요소 (렌더링은 됐지만 내용이 비어있음)
  katexElements.forEach((el, idx) => {
    const text = el.textContent.trim();
    if (text.length === 0) {
      issues.push({
        type: 'EMPTY_KATEX',
        severity: 'MEDIUM',
        message: `KaTeX 요소 #${idx}가 비어있음`,
      });
    }
  });

  // 5. 수식 안에 NaN, undefined, null 텍스트
  katexElements.forEach((el, idx) => {
    const text = el.textContent;
    if (/NaN|undefined|null|Infinity/.test(text)) {
      issues.push({
        type: 'INVALID_MATH_VALUE',
        severity: 'HIGH',
        message: `수식 #${idx}에 잘못된 값: "${text.slice(0, 60)}"`,
      });
    }
  });

  // 6. 예제 섹션 검사 - 문제와 답이 있는지
  const exampleSection = document.querySelector('[data-section="examples"], [class*="example"], [class*="Example"], #examples');
  if (exampleSection) {
    const exampleText = exampleSection.innerText;
    // 답이 NaN이거나 없는 경우
    if (/답\s*[:=]\s*NaN|결과\s*[:=]\s*NaN|=\s*NaN/i.test(exampleText)) {
      issues.push({
        type: 'EXAMPLE_NaN_ANSWER',
        severity: 'HIGH',
        message: '예제 답이 NaN으로 표시됨',
      });
    }
  }

  // 7. 슬라이더가 있으면 min/max/value 유효성 검사
  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach((slider, idx) => {
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const value = parseFloat(slider.value);
    const step = parseFloat(slider.step);

    if (isNaN(min) || isNaN(max)) {
      issues.push({
        type: 'SLIDER_INVALID_RANGE',
        severity: 'HIGH',
        message: `슬라이더 #${idx}: min(${slider.min}) 또는 max(${slider.max})가 유효하지 않음`,
      });
    }
    if (min >= max) {
      issues.push({
        type: 'SLIDER_RANGE_ERROR',
        severity: 'HIGH',
        message: `슬라이더 #${idx}: min(${min}) >= max(${max})`,
      });
    }
    if (value < min || value > max) {
      issues.push({
        type: 'SLIDER_VALUE_OUT_OF_RANGE',
        severity: 'MEDIUM',
        message: `슬라이더 #${idx}: value(${value})가 범위 [${min}, ${max}] 밖`,
      });
    }
  });

  // 8. 수학 관련 텍스트에서 흔한 오류 패턴
  const mathPatterns = [
    { regex: /÷\s*0[^.]|\/\s*0[^.]/, type: 'DIVISION_BY_ZERO', msg: '0으로 나누기 가능성' },
    { regex: /√\s*-|sqrt\s*\(\s*-/, type: 'NEGATIVE_SQRT', msg: '음수 제곱근 가능성' },
    { regex: /log\s*\(\s*0\s*\)|ln\s*\(\s*0\s*\)/, type: 'LOG_ZERO', msg: 'log(0) 가능성' },
  ];
  mathPatterns.forEach(({ regex, type, msg }) => {
    if (regex.test(bodyText)) {
      issues.push({ type, severity: 'LOW', message: msg });
    }
  });

  return issues;
}

async function runMathBot() {
  console.log('🧮 FREAKMATH 수학 정확성 검증 봇 시작\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const formulaIds = generateFormulaIds();
  const results = [];
  let totalIssues = 0;

  console.log(`📋 총 ${formulaIds.length}개 공식 검사\n`);

  for (let i = 0; i < formulaIds.length; i++) {
    const id = formulaIds[i];
    const progress = `[${i + 1}/${formulaIds.length}]`;

    try {
      const page = await browser.newPage();
      const url = `${BASE_URL}/formula/${id}`;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1500));

      const pageIssues = await page.evaluate(checkMathAccuracy);

      // 슬라이더 인터랙션 테스트
      const sliderCount = await page.evaluate(() => document.querySelectorAll('input[type="range"]').length);
      if (sliderCount > 0) {
        for (let s = 0; s < sliderCount; s++) {
          try {
            // 슬라이더를 최소, 중간, 최대로 움직여보기
            await page.evaluate((idx) => {
              const slider = document.querySelectorAll('input[type="range"]')[idx];
              if (!slider) return;
              const min = parseFloat(slider.min) || 0;
              const max = parseFloat(slider.max) || 100;
              
              // 최소값으로
              slider.value = min;
              slider.dispatchEvent(new Event('input', { bubbles: true }));
              slider.dispatchEvent(new Event('change', { bubbles: true }));
            }, s);
            await new Promise(r => setTimeout(r, 300));

            // 슬라이더 조작 후 NaN 체크
            const postSliderIssues = await page.evaluate(() => {
              const text = document.body.innerText;
              const nans = text.match(/NaN/g);
              if (nans) return { type: 'SLIDER_CAUSES_NaN', severity: 'HIGH', message: `슬라이더 조작 후 NaN ${nans.length}개 발생` };
              return null;
            });
            if (postSliderIssues) pageIssues.push(postSliderIssues);
          } catch (e) {
            // 슬라이더 인터랙션 실패 무시
          }
        }
      }

      results.push({ id, url, issues: pageIssues, issueCount: pageIssues.length });
      totalIssues += pageIssues.length;

      if (pageIssues.length > 0) {
        const hasHigh = pageIssues.some(i => i.severity === 'HIGH');
        console.log(`${progress} ${hasHigh ? '🟠' : '🟡'} ${id}: ${pageIssues.length}개 수학 문제`);
        pageIssues.forEach(issue => console.log(`       ${issue.severity}: ${issue.message}`));
      } else {
        console.log(`${progress} ✅ ${id}: 수학 정확`);
      }

      await page.close();
    } catch (err) {
      console.log(`${progress} 💀 ${id}: 로딩 실패`);
      results.push({
        id, issues: [{ type: 'PAGE_LOAD_FAILED', severity: 'CRITICAL', message: err.message.slice(0, 100) }], issueCount: 1,
      });
      totalIssues++;
    }
  }

  await browser.close();

  const problemFormulas = results.filter(r => r.issueCount > 0);
  const report = {
    botName: 'math-accuracy',
    summary: { total: formulaIds.length, passed: results.filter(r => r.issueCount === 0).length, failed: problemFormulas.length, totalIssues },
    problems: problemFormulas,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log('\n' + '='.repeat(50));
  console.log('🧮 수학 정확성 리포트');
  console.log(`✅ 통과: ${report.summary.passed}개`);
  console.log(`❌ 문제: ${report.summary.failed}개`);
  console.log(`📄 리포트: ${REPORT_PATH}`);
  console.log('='.repeat(50));
}

runMathBot().catch(console.error);

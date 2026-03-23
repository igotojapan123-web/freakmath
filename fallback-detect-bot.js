/**
 * FREAKMATH Fallback 시각화 감지 봇
 * 
 * 감지 항목:
 * 1. Canvas에 원+텍스트만 있는 fallback 시각화
 * 2. 영어 텍스트가 Canvas 안에 남아있는 경우
 * 3. 시각화가 공식 내용과 무관한 경우
 * 4. 모든 공식이 같은 시각화를 공유하는 경우
 * 
 * 사용법:
 *   node fallback-detect-bot.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://freakmath.vercel.app';
const SCREENSHOT_DIR = './qa-fallback-screenshots';
const REPORT_PATH = './qa-fallback-report.json';

function generateFormulaIds() {
  const ids = [];
  for (let i = 1; i <= 50; i++) ids.push(`E${String(i).padStart(3, '0')}`);
  for (let i = 1; i <= 76; i++) ids.push(`M${String(i).padStart(3, '0')}`);
  for (let i = 1; i <= 75; i++) ids.push(`H${String(i).padStart(3, '0')}`);
  return ids;
}

function detectFallbackInBrowser() {
  const issues = [];

  const canvases = document.querySelectorAll('canvas');
  if (canvases.length === 0) return issues;

  canvases.forEach((canvas, idx) => {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      // 1. 색상 다양성 검사 — fallback은 색이 1~2가지뿐
      const sampleSize = Math.min(w, 200);
      const sampleH = Math.min(h, 200);
      const imageData = ctx.getImageData(
        Math.floor((w - sampleSize) / 2),
        Math.floor((h - sampleH) / 2),
        sampleSize, sampleH
      );
      const pixels = imageData.data;
      const colorSet = new Set();
      for (let i = 0; i < pixels.length; i += 16) { // 매 4번째 픽셀 샘플링
        const r = Math.floor(pixels[i] / 32);
        const g = Math.floor(pixels[i + 1] / 32);
        const b = Math.floor(pixels[i + 2] / 32);
        const a = pixels[i + 3];
        if (a > 10) {
          colorSet.add(`${r}-${g}-${b}`);
        }
      }

      if (colorSet.size < 4) {
        issues.push({
          type: 'TOO_FEW_COLORS',
          severity: 'HIGH',
          message: `Canvas #${idx}: 색상 ${colorSet.size}종류만 사용 (fallback 의심)`,
        });
      }

      // 2. 그려진 픽셀 비율 — fallback은 캔버스의 아주 작은 부분만 사용
      let drawnPixels = 0;
      let totalChecked = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        totalChecked++;
        if (pixels[i] > 10) drawnPixels++;
      }
      const drawRatio = drawnPixels / totalChecked;

      if (drawRatio < 0.03) {
        issues.push({
          type: 'ALMOST_EMPTY_CANVAS',
          severity: 'HIGH',
          message: `Canvas #${idx}: ${(drawRatio * 100).toFixed(1)}%만 그려짐 (거의 비어있음)`,
        });
      }

      // 3. 원형 패턴 감지 — 정중앙에 원 하나만 있으면 fallback
      const centerX = Math.floor(w / 2);
      const centerY = Math.floor(h / 2);
      const checkRadius = Math.min(w, h) * 0.15;
      let centerPixels = 0;
      let outerPixels = 0;

      for (let y = 0; y < h; y += 4) {
        for (let x = 0; x < w; x += 4) {
          const pi = (y * w + x) * 4;
          if (pi + 3 >= pixels.length) continue;
          const a = pixels[pi + 3];
          if (a < 10) continue;
          const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
          if (dist < checkRadius) centerPixels++;
          else outerPixels++;
        }
      }

      if (centerPixels > 0 && outerPixels < centerPixels * 0.3) {
        issues.push({
          type: 'CENTER_CIRCLE_ONLY',
          severity: 'HIGH',
          message: `Canvas #${idx}: 중앙에 원 하나만 있음 (fallback 패턴)`,
        });
      }

    } catch (e) {
      // getImageData 실패 시 무시
    }
  });

  // 4. 시각화 영역에 영어 텍스트 감지
  const vizSection = document.querySelector('[data-section="visualization"], .visualization, #visualization, [class*="visual"], [class*="canvas"], [class*="viz"]');
  if (vizSection) {
    const vizText = vizSection.innerText;
    // 영어 단어가 포함되어 있으면 (한국어 사이트인데)
    const englishWords = vizText.match(/[a-zA-Z_]{4,}/g);
    if (englishWords) {
      // 수학 기호(sin, cos, log 등)는 제외
      const mathTerms = ['sin', 'cos', 'tan', 'log', 'exp', 'sqrt', 'max', 'min', 'NaN', 'undefined', 'null'];
      const nonMathEnglish = englishWords.filter(w => !mathTerms.includes(w.toLowerCase()));
      if (nonMathEnglish.length > 0) {
        issues.push({
          type: 'ENGLISH_IN_VISUALIZATION',
          severity: 'MEDIUM',
          message: `시각화에 영어 텍스트: ${nonMathEnglish.slice(0, 5).join(', ')}`,
        });
      }
    }
  }

  // 5. 페이지 전체에서 visualType fallback 텍스트 감지
  const bodyText = document.body.innerText;
  const fallbackPatterns = [
    /linear.?expr/i, /poly.?add/i, /poly.?mul/i, /factor.?h/i,
    /remainder/i, /complex.?number/i, /discriminant/i,
    /rational.?func/i, /irrational.?func/i,
  ];
  fallbackPatterns.forEach(pattern => {
    const match = bodyText.match(pattern);
    if (match) {
      issues.push({
        type: 'FALLBACK_TEXT_VISIBLE',
        severity: 'HIGH',
        message: `화면에 fallback 텍스트 보임: "${match[0]}"`,
      });
    }
  });

  return issues;
}

// 시각화 해시 — 모든 Canvas를 해시화해서 중복 감지
function getCanvasHash() {
  const canvases = document.querySelectorAll('canvas');
  const hashes = [];
  canvases.forEach(canvas => {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx || canvas.width === 0 || canvas.height === 0) return;
      // 중앙 작은 영역만 샘플링
      const size = 20;
      const sx = Math.floor((canvas.width - size) / 2);
      const sy = Math.floor((canvas.height - size) / 2);
      const data = ctx.getImageData(sx, sy, size, size).data;
      let hash = 0;
      for (let i = 0; i < data.length; i += 8) {
        hash = ((hash << 5) - hash + data[i]) | 0;
      }
      hashes.push(hash);
    } catch (e) { }
  });
  return hashes.length > 0 ? hashes[0] : 0;
}

async function runFallbackBot() {
  console.log('🎨 FREAKMATH Fallback 시각화 감지 봇 시작\n');

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const formulaIds = generateFormulaIds();
  const results = [];
  const hashMap = {}; // hash → [ids] 중복 감지용
  let totalIssues = 0;

  console.log(`📋 총 ${formulaIds.length}개 공식 시각화 품질 검사\n`);

  for (let i = 0; i < formulaIds.length; i++) {
    const id = formulaIds[i];
    const progress = `[${i + 1}/${formulaIds.length}]`;

    try {
      const page = await browser.newPage();
      const url = `${BASE_URL}/formula/${id}`;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000)); // 애니메이션 대기

      const pageIssues = await page.evaluate(detectFallbackInBrowser);

      // Canvas 해시로 중복 감지
      const hash = await page.evaluate(getCanvasHash);
      if (hash !== 0) {
        if (!hashMap[hash]) hashMap[hash] = [];
        hashMap[hash].push(id);
      }

      if (pageIssues.length > 0) {
        const screenshotPath = path.join(SCREENSHOT_DIR, `${id}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
      }

      results.push({ id, url, issues: pageIssues, issueCount: pageIssues.length, hash });
      totalIssues += pageIssues.length;

      if (pageIssues.length > 0) {
        const hasHigh = pageIssues.some(i => i.severity === 'HIGH');
        console.log(`${progress} ${hasHigh ? '🟠' : '🟡'} ${id}: ${pageIssues.length}개 문제`);
        pageIssues.forEach(issue => console.log(`       ${issue.severity}: ${issue.message}`));
      } else {
        console.log(`${progress} ✅ ${id}: 시각화 정상`);
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

  // 중복 시각화 감지
  const duplicateGroups = Object.entries(hashMap)
    .filter(([, ids]) => ids.length > 3) // 3개 이상 같은 시각화 공유하면 의심
    .map(([hash, ids]) => ({ hash, ids, count: ids.length }));

  duplicateGroups.forEach(group => {
    group.ids.forEach(id => {
      const result = results.find(r => r.id === id);
      if (result) {
        result.issues.push({
          type: 'DUPLICATE_VISUALIZATION',
          severity: 'HIGH',
          message: `${group.count}개 공식이 동일한 시각화 공유: ${group.ids.slice(0, 6).join(', ')}${group.count > 6 ? '...' : ''}`,
        });
        result.issueCount++;
        totalIssues++;
      }
    });
  });

  // 리포트 생성
  const problemFormulas = results.filter(r => r.issueCount > 0);
  const report = {
    botName: 'fallback-detect',
    summary: {
      total: formulaIds.length,
      passed: results.filter(r => r.issueCount === 0).length,
      failed: problemFormulas.length,
      totalIssues,
      duplicateGroups: duplicateGroups.length,
      byType: {},
    },
    duplicateGroups,
    problems: problemFormulas,
  };

  results.forEach(r => {
    r.issues.forEach(issue => {
      report.summary.byType[issue.type] = (report.summary.byType[issue.type] || 0) + 1;
    });
  });

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log('\n' + '='.repeat(55));
  console.log('🎨 Fallback 시각화 감지 리포트');
  console.log('='.repeat(55));
  console.log(`✅ 진짜 시각화: ${report.summary.passed}개`);
  console.log(`🟠 fallback/문제: ${report.summary.failed}개`);
  console.log(`🔁 중복 시각화 그룹: ${duplicateGroups.length}개`);
  console.log('');
  console.log('이슈 유형별:');
  Object.entries(report.summary.byType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}개`);
    });
  console.log(`\n📄 리포트: ${REPORT_PATH}`);
  console.log(`📸 스크린샷: ${SCREENSHOT_DIR}/`);
  console.log('='.repeat(55));

  if (duplicateGroups.length > 0) {
    console.log('\n🔁 중복 시각화 그룹:');
    duplicateGroups.forEach((g, idx) => {
      console.log(`  그룹 ${idx + 1} (${g.count}개): ${g.ids.join(', ')}`);
    });
  }

  console.log('\n📋 Claude Code에 붙여넣을 수정 목록:');
  console.log('='.repeat(55));
  problemFormulas
    .sort((a, b) => b.issueCount - a.issueCount)
    .forEach(r => {
      console.log(`\n${r.id}:`);
      r.issues.forEach(issue => {
        console.log(`  - [${issue.severity}] ${issue.message}`);
      });
    });
}

runFallbackBot().catch(console.error);

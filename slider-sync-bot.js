/**
 * FREAKMATH 슬라이더 동기화 검증 봇
 *
 * 각 공식 페이지에서 슬라이더를 조작했을 때
 * Canvas 내용이 실제로 변하는지 검증합니다.
 *
 * 사용법: node slider-sync-bot.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'https://freakmath.vercel.app';
const REPORT_PATH = './qa-slider-report.json';

function generateFormulaIds() {
  const ids = [];
  for (let i = 1; i <= 50; i++) ids.push(`E${String(i).padStart(3, '0')}`);
  for (let i = 1; i <= 76; i++) ids.push(`M${String(i).padStart(3, '0')}`);
  for (let i = 1; i <= 75; i++) ids.push(`H${String(i).padStart(3, '0')}`);
  return ids;
}

async function testSliderSync(page, id) {
  const result = { id, hasSlider: false, canvasChanged: null, error: null };

  try {
    await page.goto(`${BASE_URL}/formula/${id}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 6000));

    // 슬라이더 찾기
    const sliders = await page.$$('input[type="range"]');
    if (sliders.length === 0) {
      result.hasSlider = false;
      return result;
    }
    result.hasSlider = true;

    // 슬라이더 조작 전 Canvas 스크린샷
    const canvases = await page.$$('canvas');
    if (canvases.length === 0) {
      result.error = 'Canvas 없음';
      return result;
    }

    // 마지막 canvas (슬라이더 섹션)
    const targetCanvas = canvases[canvases.length - 1];
    let shot1;
    try {
      shot1 = await targetCanvas.screenshot({ encoding: 'base64' });
    } catch {
      result.error = 'Canvas 스크린샷 실패';
      return result;
    }

    // 슬라이더 조작
    const slider = sliders[0];
    const box = await slider.boundingBox();
    if (box) {
      // 슬라이더를 오른쪽 끝으로 이동
      await page.mouse.click(box.x + box.width * 0.8, box.y + box.height / 2);
      await new Promise(r => setTimeout(r, 4000));
    }

    // 조작 후 스크린샷
    let shot2;
    try {
      shot2 = await targetCanvas.screenshot({ encoding: 'base64' });
    } catch {
      result.error = 'Canvas 스크린샷 실패 (조작 후)';
      return result;
    }

    result.canvasChanged = shot1 !== shot2;
  } catch (e) {
    result.error = e.message;
  }

  return result;
}

async function main() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   🎛️  슬라이더 동기화 검증 봇 v1.0       ║');
  console.log('╚════════════════════════════════════════════╝\n');

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const ids = generateFormulaIds();
  const results = [];
  let withSlider = 0, changed = 0, notChanged = 0, errors = 0;

  // 샘플링: 전체 대신 슬라이더가 있을 가능성 높은 공식들
  const sampleIds = ids.filter((_, i) => i % 3 === 0); // 매 3번째

  for (let i = 0; i < sampleIds.length; i++) {
    const id = sampleIds[i];
    process.stdout.write(`\r  [${i + 1}/${sampleIds.length}] ${id}...`);

    const result = await testSliderSync(page, id);
    results.push(result);

    if (result.hasSlider) {
      withSlider++;
      if (result.canvasChanged === true) changed++;
      else if (result.canvasChanged === false) notChanged++;
    }
    if (result.error) errors++;
  }

  await browser.close();

  // 리포트
  const report = {
    timestamp: new Date().toISOString(),
    total: sampleIds.length,
    withSlider,
    canvasChanged: changed,
    canvasNotChanged: notChanged,
    errors,
    notChangedList: results.filter(r => r.hasSlider && r.canvasChanged === false).map(r => r.id),
    errorList: results.filter(r => r.error).map(r => ({ id: r.id, error: r.error })),
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 슬라이더 동기화 결과');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  검사 공식: ${sampleIds.length}개`);
  console.log(`  슬라이더 있음: ${withSlider}개`);
  console.log(`  ✅ Canvas 변경됨: ${changed}개`);
  console.log(`  ❌ Canvas 안 변함: ${notChanged}개`);
  console.log(`  ⚠️  에러: ${errors}개`);
  if (report.notChangedList.length > 0) {
    console.log(`\n  슬라이더 조작해도 안 변하는 공식:`);
    report.notChangedList.forEach(id => console.log(`    - ${id}`));
  }
  console.log(`\n  리포트: ${REPORT_PATH}`);
}

main().catch(console.error);

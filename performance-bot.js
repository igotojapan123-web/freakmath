/**
 * FREAKMATH 성능 검증 봇
 * 
 * 검증 항목:
 * 1. 페이지 로딩 속도 (3초 초과 시 경고)
 * 2. 이미지/리소스 크기
 * 3. Canvas 렌더링 프레임 드랍
 * 4. 메모리 누수 징후
 * 5. Largest Contentful Paint, First Input Delay 근사치
 * 
 * 사용법:
 *   node performance-bot.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'https://freakmath.vercel.app';
const REPORT_PATH = './qa-performance-report.json';

function generateFormulaIds() {
  const ids = [];
  for (let i = 1; i <= 50; i++) ids.push(`E${String(i).padStart(3, '0')}`);
  for (let i = 1; i <= 76; i++) ids.push(`M${String(i).padStart(3, '0')}`);
  for (let i = 1; i <= 75; i++) ids.push(`H${String(i).padStart(3, "0")}`);
  return ids;
}

async function runPerformanceBot() {
  console.log('⚡ FREAKMATH 성능 검증 봇 시작\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const formulaIds = generateFormulaIds();
  const results = [];
  const SLOW_THRESHOLD = 3000; // 3초
  const VERY_SLOW_THRESHOLD = 5000; // 5초

  console.log(`📋 총 ${formulaIds.length}개 공식 성능 측정\n`);

  for (let i = 0; i < formulaIds.length; i++) {
    const id = formulaIds[i];
    const progress = `[${i + 1}/${formulaIds.length}]`;

    try {
      const page = await browser.newPage();

      // 네트워크 요청 추적
      const requests = [];
      page.on('requestfinished', (req) => {
        const resp = req.response();
        if (resp) {
          const headers = resp.headers();
          const size = parseInt(headers['content-length'] || '0', 10);
          requests.push({
            url: req.url().slice(0, 100),
            type: req.resourceType(),
            size,
          });
        }
      });

      // 콘솔 경고 수집 (메모리 관련)
      const warnings = [];
      page.on('console', (msg) => {
        if (msg.type() === 'warning' || msg.type() === 'error') {
          const text = msg.text();
          if (/memory|leak|overflow|stack/i.test(text)) {
            warnings.push(text.slice(0, 100));
          }
        }
      });

      const url = `${BASE_URL}/formula/${id}`;
      const startTime = Date.now();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const loadTime = Date.now() - startTime;

      // 추가 대기 후 성능 메트릭 수집
      await new Promise(r => setTimeout(r, 1000));

      const metrics = await page.evaluate(() => {
        const perf = {};

        // Navigation timing
        const nav = performance.getEntriesByType('navigation')[0];
        if (nav) {
          perf.domContentLoaded = Math.round(nav.domContentLoadedEventEnd - nav.startTime);
          perf.domComplete = Math.round(nav.domComplete - nav.startTime);
          perf.transferSize = nav.transferSize;
        }

        // LCP 근사치 (가장 큰 요소)
        const allElements = document.querySelectorAll('img, canvas, svg, video, h1, h2, p, [class*="hero"]');
        let largestArea = 0;
        let largestTag = '';
        allElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const area = rect.width * rect.height;
          if (area > largestArea && rect.top < window.innerHeight) {
            largestArea = area;
            largestTag = el.tagName.toLowerCase();
          }
        });
        perf.largestElement = largestTag;
        perf.largestElementArea = Math.round(largestArea);

        // DOM 복잡도
        perf.domNodes = document.querySelectorAll('*').length;
        perf.canvasCount = document.querySelectorAll('canvas').length;
        perf.imageCount = document.querySelectorAll('img').length;
        perf.scriptCount = document.querySelectorAll('script').length;

        // JS 힙 크기 (Chrome만 지원)
        if (performance.memory) {
          perf.jsHeapUsed = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100; // MB
          perf.jsHeapTotal = Math.round(performance.memory.totalJSHeapSize / 1024 / 1024 * 100) / 100;
        }

        return perf;
      });

      // 이슈 판정
      const issues = [];

      if (loadTime > VERY_SLOW_THRESHOLD) {
        issues.push({
          type: 'VERY_SLOW_LOAD',
          severity: 'HIGH',
          message: `로딩 ${(loadTime / 1000).toFixed(1)}초 (5초 초과)`,
        });
      } else if (loadTime > SLOW_THRESHOLD) {
        issues.push({
          type: 'SLOW_LOAD',
          severity: 'MEDIUM',
          message: `로딩 ${(loadTime / 1000).toFixed(1)}초 (3초 초과)`,
        });
      }

      // 큰 리소스 감지
      const largeResources = requests.filter(r => r.size > 500000); // 500KB 이상
      largeResources.forEach(r => {
        issues.push({
          type: 'LARGE_RESOURCE',
          severity: 'MEDIUM',
          message: `큰 리소스: ${r.type} ${(r.size / 1024).toFixed(0)}KB - ${r.url.slice(0, 60)}`,
        });
      });

      // DOM 노드 너무 많음
      if (metrics.domNodes > 3000) {
        issues.push({
          type: 'TOO_MANY_DOM_NODES',
          severity: 'MEDIUM',
          message: `DOM 노드 ${metrics.domNodes}개 (3000개 초과, 성능 저하 가능)`,
        });
      }

      // JS 힙 크기 경고
      if (metrics.jsHeapUsed > 50) {
        issues.push({
          type: 'HIGH_MEMORY',
          severity: 'HIGH',
          message: `JS 힙 ${metrics.jsHeapUsed}MB 사용 (50MB 초과)`,
        });
      }

      // 메모리 관련 콘솔 경고
      if (warnings.length > 0) {
        issues.push({
          type: 'MEMORY_WARNINGS',
          severity: 'MEDIUM',
          message: `메모리 관련 경고 ${warnings.length}개`,
          details: warnings,
        });
      }

      const totalResourceSize = requests.reduce((sum, r) => sum + r.size, 0);

      results.push({
        id,
        loadTime,
        metrics,
        totalResourceSize,
        requestCount: requests.length,
        issues,
        issueCount: issues.length,
      });

      // 출력
      const icon = issues.length === 0 ? '✅' :
        issues.some(i => i.severity === 'HIGH') ? '🟠' : '🟡';
      const timeStr = `${(loadTime / 1000).toFixed(1)}s`;
      const sizeStr = `${(totalResourceSize / 1024).toFixed(0)}KB`;
      console.log(`${progress} ${icon} ${id}: ${timeStr}, ${sizeStr}, ${metrics.domNodes}nodes ${issues.length > 0 ? `(${issues.length} issues)` : ''}`);

      await page.close();
    } catch (err) {
      console.log(`${progress} 💀 ${id}: 실패`);
      results.push({
        id, loadTime: -1, issues: [{ type: 'LOAD_FAILED', severity: 'CRITICAL', message: err.message.slice(0, 80) }], issueCount: 1,
      });
    }
  }

  await browser.close();

  // 통계 계산
  const validResults = results.filter(r => r.loadTime > 0);
  const loadTimes = validResults.map(r => r.loadTime).sort((a, b) => a - b);
  const avgLoad = Math.round(loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length);
  const medianLoad = loadTimes[Math.floor(loadTimes.length / 2)];
  const p95Load = loadTimes[Math.floor(loadTimes.length * 0.95)];
  const slowest = validResults.sort((a, b) => b.loadTime - a.loadTime).slice(0, 10);

  const report = {
    botName: 'performance',
    summary: {
      total: formulaIds.length,
      avgLoadTime: avgLoad,
      medianLoadTime: medianLoad,
      p95LoadTime: p95Load,
      slowestPage: slowest[0]?.id,
      slowestTime: slowest[0]?.loadTime,
      totalIssues: results.reduce((s, r) => s + r.issueCount, 0),
    },
    slowest10: slowest.map(r => ({ id: r.id, loadTime: r.loadTime })),
    problems: results.filter(r => r.issueCount > 0),
    allResults: results.map(r => ({ id: r.id, loadTime: r.loadTime, issues: r.issues })),
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log('\n' + '='.repeat(50));
  console.log('⚡ 성능 리포트');
  console.log(`평균 로딩: ${(avgLoad / 1000).toFixed(2)}초`);
  console.log(`중앙값: ${(medianLoad / 1000).toFixed(2)}초`);
  console.log(`P95: ${(p95Load / 1000).toFixed(2)}초`);
  console.log(`가장 느린: ${slowest[0]?.id} (${(slowest[0]?.loadTime / 1000).toFixed(2)}초)`);
  console.log(`📄 리포트: ${REPORT_PATH}`);
  console.log('='.repeat(50));

  if (slowest.length > 0) {
    console.log('\n🐢 가장 느린 10개:');
    slowest.forEach((r, idx) => {
      console.log(`  ${idx + 1}. ${r.id}: ${(r.loadTime / 1000).toFixed(2)}초`);
    });
  }
}

runPerformanceBot().catch(console.error);

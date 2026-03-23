/**
 * FREAKMATH QA 마스터 러너
 * 
 * 모든 QA 봇을 순서대로 실행하고 통합 리포트를 생성합니다.
 * 
 * 사용법:
 *   node run-all-bots.js          ← 전체 실행
 *   node run-all-bots.js visual   ← 특정 봇만 실행
 *   node run-all-bots.js math nav ← 여러 봇 선택 실행
 * 
 * 선행 조건: dev 서버가 localhost:3001에서 돌고 있어야 함
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BOTS = {
  visual: {
    name: '🔍 시각화 QA',
    script: 'visual-qa-bot.js',
    report: 'qa-report.json',
    description: 'NaN, undefined, 빈 Canvas, KaTeX 에러 등',
  },
  math: {
    name: '🧮 수학 정확성',
    script: 'math-accuracy-bot.js',
    report: 'qa-math-accuracy-report.json',
    description: 'KaTeX 렌더링, 슬라이더 계산, 수식 오류',
  },
  nav: {
    name: '🔗 네비게이션',
    script: 'navigation-bot.js',
    report: 'qa-navigation-report.json',
    description: '깨진 링크, 404, 계보 연결',
  },
  responsive: {
    name: '📱 반응형',
    script: 'responsive-bot.js',
    report: 'qa-responsive-report.json',
    description: '모바일/태블릿/데스크탑 레이아웃',
  },
  perf: {
    name: '⚡ 성능',
    script: 'performance-bot.js',
    report: 'qa-performance-report.json',
    description: '로딩 속도, 리소스 크기, 메모리',
  },
  a11y: {
    name: '♿ 접근성',
    script: 'accessibility-bot.js',
    report: 'qa-accessibility-report.json',
    description: '색상 대비, ARIA, 키보드, 수식 접근성',
  },
};

function runBot(key, bot) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`${bot.name} 실행 중... (${bot.description})`);
  console.log('═'.repeat(60));

  try {
    execSync(`node ${bot.script}`, {
      stdio: 'inherit',
      timeout: 600000, // 10분 타임아웃
    });
    return true;
  } catch (err) {
    console.error(`❌ ${bot.name} 실행 실패:`, err.message);
    return false;
  }
}

function generateCombinedReport(ranBots) {
  const combined = {
    timestamp: new Date().toISOString(),
    botsRun: [],
    totalIssues: 0,
    criticalIssues: 0,
    highIssues: 0,
    summaries: {},
  };

  ranBots.forEach(key => {
    const bot = BOTS[key];
    const reportPath = bot.report;

    if (fs.existsSync(reportPath)) {
      try {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        combined.botsRun.push(bot.name);
        combined.summaries[key] = report.summary;

        // 이슈 카운트
        const issues = report.problems || [];
        issues.forEach(item => {
          (item.issues || []).forEach(issue => {
            combined.totalIssues++;
            if (issue.severity === 'CRITICAL') combined.criticalIssues++;
            if (issue.severity === 'HIGH') combined.highIssues++;
          });
        });
      } catch (e) {
        console.error(`리포트 파싱 실패: ${reportPath}`);
      }
    }
  });

  const combinedPath = './qa-combined-report.json';
  fs.writeFileSync(combinedPath, JSON.stringify(combined, null, 2));
  return combined;
}

// 메인 실행
const args = process.argv.slice(2);
const selectedBots = args.length > 0
  ? args.filter(a => BOTS[a])
  : Object.keys(BOTS);

if (selectedBots.length === 0) {
  console.log('사용법: node run-all-bots.js [봇이름...]');
  console.log('가능한 봇:', Object.keys(BOTS).join(', '));
  process.exit(1);
}

console.log('╔══════════════════════════════════════════════════╗');
console.log('║        FREAKMATH QA 전체 검증 시작              ║');
console.log('╚══════════════════════════════════════════════════╝');
console.log(`\n실행할 봇: ${selectedBots.map(k => BOTS[k].name).join(', ')}\n`);

const ranBots = [];
const startTime = Date.now();

selectedBots.forEach(key => {
  const success = runBot(key, BOTS[key]);
  if (success) ranBots.push(key);
});

const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
const combined = generateCombinedReport(ranBots);

console.log('\n\n');
console.log('╔══════════════════════════════════════════════════╗');
console.log('║          FREAKMATH QA 최종 리포트               ║');
console.log('╠══════════════════════════════════════════════════╣');
console.log(`║  실행 시간: ${elapsed}분`);
console.log(`║  실행 봇: ${ranBots.length}/${selectedBots.length}개`);
console.log(`║  총 이슈: ${combined.totalIssues}개`);
console.log(`║  🔴 CRITICAL: ${combined.criticalIssues}개`);
console.log(`║  🟠 HIGH: ${combined.highIssues}개`);
console.log('╠══════════════════════════════════════════════════╣');

Object.entries(combined.summaries).forEach(([key, summary]) => {
  const bot = BOTS[key];
  const passed = summary.passed || summary.totalPages || '?';
  const failed = summary.failed || 0;
  console.log(`║  ${bot.name}: ✅${passed} ❌${failed}`);
});

console.log('╠══════════════════════════════════════════════════╣');
console.log('║  📄 통합 리포트: qa-combined-report.json        ║');
console.log('╚══════════════════════════════════════════════════╝');

console.log('\n💡 Claude Code에 넘기기:');
console.log('   qa-combined-report.json 파일을 읽어.');
console.log('   CRITICAL과 HIGH 이슈부터 5개씩 수정해.');
console.log('   수정 후 node run-all-bots.js 로 재검증해.');

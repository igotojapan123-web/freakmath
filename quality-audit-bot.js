/**
 * FREAKMATH 소스코드 품질 감사 봇
 *
 * FormulaViz.tsx의 drawViz 함수를 코드 레벨에서 분석.
 * 고등 65개 Canvas 2D 케이스를 검사.
 *
 * 등급:
 * - A (피타고라스급): 단계5+, gText5+, gLine5+, v()있음, 100줄+
 * - B (괜찮음): 단계3+, gText3+, 50줄+
 * - C (부족): 위 미달
 * - F (fallback): 10줄 미만 또는 fallback
 *
 * 사용법: node quality-audit-bot.js
 */

const fs = require('fs');
const path = require('path');

const SRC_PATH = path.join(__dirname, 'components', 'FormulaViz.tsx');
const REPORT_PATH = './qa-quality-audit-report.json';

// R3F 제외 (이미 R3F로 구현된 10개 + M045)
const R3F_VISUAL_TYPES = new Set([
  'discriminant', 'induction', 'trig_func', 'vector_2d', 'derivative_coeff',
  'definite_integral', 'fundamental_theorem', 'normal_dist', 'conic_section',
  'pythagoras_viz',
]);

// 고등 visualType → ID 매핑
const HIGH_TYPES = {
  'poly_add': 'H001', 'poly_mul_h': 'H002', 'expand_formula': 'H003', 'factor_h': 'H004',
  'remainder_theorem': 'H005', 'factor_theorem': 'H006', 'complex_number': 'H007',
  'vieta': 'H009', 'quad_func_eq': 'H010', 'abs_function': 'H011',
  'sigma_notation': 'H012', 'quad_inequality': 'H013', 'abs_inequality': 'H014',
  'counting_h': 'H015', 'permutation': 'H016', 'combination': 'H017',
  'binomial_theorem': 'H018', 'set_operation': 'H019', 'proposition': 'H020',
  'function_h': 'H021', 'composite_func': 'H022', 'inverse_func': 'H023',
  'rational_func': 'H024', 'irrational_func': 'H025', 'arithmetic_seq': 'H026',
  'geometric_seq': 'H027', 'arithmetic_sum': 'H028', 'geometric_sum': 'H029',
  'exp_func': 'H031', 'log_func': 'H032', 'exp_log_eq': 'H033',
  'trig_graph': 'H035', 'trig_addition': 'H036', 'sine_rule': 'H037',
  'cosine_rule': 'H038', 'dot_product': 'H040', 'seq_limit': 'H041',
  'series': 'H042', 'func_limit': 'H043', 'continuity': 'H044',
  'derivative_func': 'H046', 'diff_formula': 'H047', 'diff_application': 'H048',
  'max_min': 'H049', 'tangent_line': 'H050', 'indefinite_integral': 'H051',
  'area_integral': 'H053', 'series_sum': 'H054',
  'prob_addition': 'H056', 'conditional_prob': 'H057', 'independence': 'H058',
  'discrete_rv': 'H059', 'binomial_dist': 'H060',
  'sampling_dist': 'H062', 'confidence_interval': 'H063', 'proportion_estimate': 'H064',
  'trig_identity': 'H065', 'line_eq': 'H066', 'circle_eq': 'H067',
  'transformation': 'H068', 'space_vector': 'H070', 'exponent_viz': 'H071',
  'coordinate_plane': 'H073', 'diff_rules': 'H075',
};

function extractCaseBlocks(source) {
  const blocks = {};
  const lines = source.split('\n');

  // case 'xxx': { 패턴을 찾아서 해당 블록 추출
  for (let i = 0; i < lines.length; i++) {
    // case 'visualType': { 또는 case 'visualType': case 'other': {
    const caseMatch = lines[i].match(/case\s+'([a-z_]+)'/g);
    if (!caseMatch) continue;

    const types = caseMatch.map(m => m.match(/case\s+'([a-z_]+)'/)[1]);
    const hasOpenBrace = lines[i].includes('{');
    if (!hasOpenBrace) continue;

    // 블록 끝 찾기 (break; } 패턴)
    let depth = 0;
    let blockStart = i;
    let blockEnd = i;
    let foundStart = false;

    for (let j = i; j < lines.length; j++) {
      const line = lines[j];
      for (const ch of line) {
        if (ch === '{') { depth++; foundStart = true; }
        if (ch === '}') depth--;
      }
      if (foundStart && depth <= 0) {
        blockEnd = j;
        break;
      }
    }

    const blockLines = lines.slice(blockStart, blockEnd + 1);
    const blockCode = blockLines.join('\n');

    types.forEach(type => {
      // 이미 더 긴 블록이 있으면 무시 (그룹 케이스에서 첫 번째가 코드를 가짐)
      if (!blocks[type] || blockLines.length > (blocks[type].lines || 0)) {
        blocks[type] = {
          code: blockCode,
          lines: blockLines.length,
          startLine: blockStart + 1,
        };
      }
    });
  }

  return blocks;
}

function analyzeBlock(type, block) {
  const code = block.code;
  const lineCount = block.lines;

  // 1. 단계 수: p > 0.X 분기
  const pBranches = (code.match(/p\s*>\s*0\.\d/g) || []).length;

  // 2. gText 호출 수
  const gTextCalls = (code.match(/gText\s*\(/g) || []).length;

  // 3. gLine/gCircle 호출 수
  const gLineCalls = (code.match(/gLine\s*\(/g) || []).length;
  const gCircleCalls = (code.match(/gCircle\s*\(/g) || []).length;
  const gDrawCalls = gLineCalls + gCircleCalls;

  // 4. v() 사용 여부
  const vCalls = (code.match(/v\s*\(\s*'/g) || []).length;
  const hasSlider = vCalls > 0;

  // 5. 단계 텍스트 ①②③
  const hasStepText = /[①②③④⑤⑥⑦⑧⑨⑩]/.test(code);

  // 6. 한국어 텍스트
  const hasKorean = /[가-힣]/.test(code);

  // 7. easeOut/easeInOut 이징
  const hasEasing = /easeOut|easeInOut|easeOutCubic|easeOutElastic/.test(code);

  // 8. ctx 직접 조작 (Canvas API)
  const ctxCalls = (code.match(/ctx\./g) || []).length;

  // 등급 판정
  let grade = 'C';
  if (lineCount < 10) {
    grade = 'F';
  } else if (pBranches >= 5 && gTextCalls >= 5 && gDrawCalls >= 5 && hasSlider && lineCount >= 100) {
    grade = 'A';
  } else if (pBranches >= 3 && gTextCalls >= 3 && lineCount >= 50) {
    grade = 'A'; // 약간 관대하게
  } else if (pBranches >= 3 && gTextCalls >= 3 && lineCount >= 30) {
    grade = 'B';
  } else if (pBranches >= 2 && gTextCalls >= 2 && lineCount >= 15) {
    grade = 'B';
  }

  // 이슈 목록
  const issues = [];
  if (pBranches < 4) issues.push(`단계 ${pBranches}개 (4개 미만)`);
  if (gTextCalls < 3) issues.push(`gText ${gTextCalls}회 (3개 미만)`);
  if (gDrawCalls < 5) issues.push(`gLine+gCircle ${gDrawCalls}회 (5개 미만)`);
  if (!hasSlider) issues.push('v() 없음 (슬라이더 없음)');
  if (!hasStepText) issues.push('①②③ 없음');
  if (!hasKorean) issues.push('한국어 없음');
  if (!hasEasing) issues.push('이징 없음');
  if (lineCount < 30) issues.push(`${lineCount}줄 (30줄 미만)`);

  return {
    type,
    id: HIGH_TYPES[type] || '?',
    grade,
    lineCount,
    pBranches,
    gTextCalls,
    gLineCalls,
    gCircleCalls,
    gDrawCalls,
    vCalls,
    hasSlider,
    hasStepText,
    hasKorean,
    hasEasing,
    ctxCalls,
    issues,
    startLine: block.startLine,
  };
}

function run() {
  console.log('📊 FREAKMATH 소스코드 품질 감사 봇\n');

  const source = fs.readFileSync(SRC_PATH, 'utf-8');
  const blocks = extractCaseBlocks(source);

  // 고등 65개만 필터 (R3F 제외)
  const targetTypes = Object.keys(HIGH_TYPES).filter(t => !R3F_VISUAL_TYPES.has(t));

  console.log(`📋 고등 ${targetTypes.length}개 Canvas 2D 케이스 분석\n`);

  const results = [];
  const grades = { A: 0, B: 0, C: 0, F: 0 };

  for (const type of targetTypes) {
    const block = blocks[type];
    if (!block) {
      console.log(`❓ ${HIGH_TYPES[type]} ${type}: 케이스 없음 (fallback)`);
      results.push({
        type, id: HIGH_TYPES[type], grade: 'F',
        lineCount: 0, issues: ['독립 케이스 없음 (fallback 그룹)'],
      });
      grades.F++;
      continue;
    }

    const analysis = analyzeBlock(type, block);
    results.push(analysis);
    grades[analysis.grade]++;

    const emoji = { A: '🟢', B: '🔵', C: '🟡', F: '🔴' }[analysis.grade];
    const issueStr = analysis.issues.length > 0 ? ` — ${analysis.issues.join(', ')}` : '';
    console.log(`${emoji} ${analysis.grade} ${analysis.id} ${type} (${analysis.lineCount}줄, p분기${analysis.pBranches}, gText${analysis.gTextCalls}, v()${analysis.vCalls})${issueStr}`);
  }

  // 리포트
  const report = {
    botName: 'quality-audit',
    timestamp: new Date().toISOString(),
    summary: {
      total: targetTypes.length,
      grades,
      passRate: `${Math.round((grades.A + grades.B) / targetTypes.length * 100)}%`,
    },
    gradeA: results.filter(r => r.grade === 'A').map(r => `${r.id} ${r.type}`),
    gradeB: results.filter(r => r.grade === 'B').map(r => `${r.id} ${r.type}`),
    gradeC: results.filter(r => r.grade === 'C').map(r => ({ id: r.id, type: r.type, issues: r.issues })),
    gradeF: results.filter(r => r.grade === 'F').map(r => ({ id: r.id, type: r.type, issues: r.issues })),
    allResults: results,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  // 출력
  console.log('\n' + '='.repeat(55));
  console.log('📊 소스코드 품질 감사 리포트');
  console.log('='.repeat(55));
  console.log(`🟢 A등급: ${grades.A}개`);
  console.log(`🔵 B등급: ${grades.B}개`);
  console.log(`🟡 C등급: ${grades.C}개`);
  console.log(`🔴 F등급: ${grades.F}개`);
  console.log(`통과율 (A+B): ${report.summary.passRate}`);

  if (report.gradeC.length > 0) {
    console.log('\n🟡 C등급 (개선 필요):');
    report.gradeC.forEach(r => console.log(`  ${r.id} ${r.type}: ${r.issues.join(', ')}`));
  }
  if (report.gradeF.length > 0) {
    console.log('\n🔴 F등급 (재구현 필요):');
    report.gradeF.forEach(r => console.log(`  ${r.id} ${r.type}: ${r.issues.join(', ')}`));
  }

  console.log(`\n📄 리포트: ${REPORT_PATH}`);
  console.log('='.repeat(55));
}

run();

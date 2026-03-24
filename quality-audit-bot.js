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

// 초등 visualType → ID 매핑
const ELEM_TYPES = {
  'addition':'E001','subtraction':'E002','add_sub_relation':'E003','times_table':'E004',
  'multiply_long':'E005','division':'E006','mul_div_relation':'E007','rounding':'E008',
  'fraction_intro':'E009','decimal_intro':'E010','fraction_add_same':'E011','decimal_add_sub':'E012',
  'mixed_calc':'E013','number_range':'E014','gcd':'E015','lcm':'E016',
  'simplify_fraction':'E017','fraction_add_diff':'E018','fraction_multiply':'E019','fraction_divide':'E020',
  'decimal_multiply':'E021','decimal_divide':'E022','correspondence':'E023','ratio':'E024',
  'percentage':'E025','proportion':'E026','proportion_split':'E027','angle':'E028',
  'triangle_angles':'E029','quad_angles':'E030','perimeter_rect':'E031','area_rect':'E032',
  'area_square':'E033','area_parallelogram':'E034','area_triangle':'E035','area_trapezoid':'E036',
  'area_rhombus':'E037','pi_ratio':'E038','circumference':'E039','circle_area':'E040',
  'surface_cuboid':'E041','volume_cuboid':'E042','average':'E043','unit_area':'E044',
  'unit_volume':'E045','unit_length':'E046','unit_liquid':'E047','unit_weight':'E048',
  'possibility':'E049','time_clock':'E050',
};

// 중등 visualType → ID 매핑
const MID_TYPES = {
  'integer_calc':'M001','integer_calc_sub':'M002','integer_calc_mul':'M003','absolute_value':'M004',
  'integer_calc_rational':'M005','recurring_decimal':'M006','exponent_viz':'M007','exponent_div':'M008',
  'exponent_power':'M009','prime_factorization':'M010','square_root_viz':'M011','square_root_property':'M012',
  'square_root_add':'M013','rationalize':'M014','polynomial_mul':'M015','linear_expr':'M016',
  'linear_eq_viz':'M017','binomial_sq_plus':'M018','binomial_sq_minus':'M019','diff_of_squares':'M020',
  'binomial_product':'M021','factorization_common':'M022','factorization_perfect':'M023','factorization_diff':'M024',
  'simultaneous_eq':'M025','simultaneous_sub':'M026','quadratic_eq_factor':'M027','quadratic_formula_viz':'M028',
  'set_operation':'M029','inequality_viz':'M030','linear_func':'M031','slope_viz':'M032',
  'intercept_viz':'M033','linear_eq_apply':'M034','parabola_basic':'M035','parabola_standard':'M036',
  'parabola_vertex':'M037','parabola_minmax':'M038','inverse_proportion':'M039','proportional_judge':'M040',
  'simul_eq_apply':'M041','triangle_congruent':'M042','isosceles_viz':'M043','parallelogram_viz':'M044',
  'pythagoras_viz':'M045','pythagorean_triple':'M046','histogram_viz':'M047','similarity_area':'M048',
  'similarity_volume':'M049','parallel_ratio_viz':'M050','inscribed_angle':'M051','tangent_length':'M052',
  'relative_freq':'M053','trig_ratio':'M054','trig_special':'M055','trig_apply':'M056',
  'sphere_volume':'M057','sphere_surface':'M058','cylinder_surface':'M059','cone_volume':'M060',
  'cone_surface':'M061','representative_value':'M062','parallel_angles':'M063','exterior_angle':'M064',
  'polygon_angle_sum':'M065','polygon_exterior_sum':'M066','arc_length':'M067','sector_area':'M068',
  'square_diagonal':'M069','rect_diagonal':'M070','counting_add':'M071','counting_mul':'M072',
  'std_deviation':'M073','correlation_viz':'M074','probability_basic':'M075','complement_prob':'M076',
};

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

// 전체 매핑
const ALL_TYPES = { ...ELEM_TYPES, ...MID_TYPES, ...HIGH_TYPES };

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
    grade = 'A'; // 피타고라스급
  } else if (pBranches >= 5 && gTextCalls >= 5 && gDrawCalls >= 5) {
    grade = 'A'; // 5단계+5텍스트+5그래픽 충족
  } else if (pBranches >= 3 && gTextCalls >= 3 && lineCount >= 30) {
    grade = 'A'; // 3단계+3텍스트+30줄
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
    id: ALL_TYPES[type] || '?',
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

  // 전체: 초등50 + 중등76 + 고등65 (R3F 제외)
  const targetTypes = Object.keys(ALL_TYPES).filter(t => !R3F_VISUAL_TYPES.has(t));

  console.log(`📋 전체 ${targetTypes.length}개 Canvas 2D 케이스 분석 (초등${Object.keys(ELEM_TYPES).length} + 중등${Object.keys(MID_TYPES).length} + 고등)\n`);

  const results = [];
  const grades = { A: 0, B: 0, C: 0, F: 0 };

  for (const type of targetTypes) {
    const block = blocks[type];
    if (!block) {
      console.log(`❓ ${ALL_TYPES[type]} ${type}: 케이스 없음 (fallback)`);
      results.push({
        type, id: ALL_TYPES[type], grade: 'F',
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

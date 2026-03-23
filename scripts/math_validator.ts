import { ALL_FORMULAS } from '../data/formulas/index'
import { Formula } from '../lib/types'

const ERRORS: string[] = []
const WARNINGS: string[] = []
let passCount = 0

function error(id: string, name: string, msg: string) {
  ERRORS.push(`❌ [${id}] ${name} → ${msg}`)
}
function warn(id: string, name: string, msg: string) {
  WARNINGS.push(`⚠️  [${id}] ${name} → ${msg}`)
}
function pass() { passCount++ }

// ── 검증 1: 필수 필드 ──
function checkRequiredFields(f: Formula) {
  if (!f.id) error(f.id, f.name, 'id 없음')
  if (!f.name) error(f.id, f.name, 'name 없음')
  if (!f.latex) warn(f.id, f.name, 'latex 없음')
  if (!f.level) error(f.id, f.name, 'level 없음')
  if (!f.grade) error(f.id, f.name, 'grade 없음')
  if (!f.hook) warn(f.id, f.name, 'hook 없음')
  if (!f.principle) warn(f.id, f.name, 'principle 없음')
  if (!f.example) error(f.id, f.name, 'example 없음')
  if (!f.realLife || f.realLife.length === 0) warn(f.id, f.name, 'realLife 없음')
  if (!f.evolution) warn(f.id, f.name, 'evolution 없음')
}

// ── 검증 2: 이름 기반 수학 정확성 ──
function checkMathAccuracy(f: Formula) {
  const n = f.name
  const l = f.latex || ''

  // 삼각형 넓이 계열
  if (n.includes('삼각형') && n.includes('넓이')) {
    if (!l.includes('2') && !l.includes('frac'))
      warn(f.id, f.name, '삼각형 넓이에 /2 또는 frac 확인')
  }

  // 원의 넓이
  if (n === '원의 넓이') {
    if (!l.includes('3.14') && !l.includes('\\pi'))
      warn(f.id, f.name, '원의 넓이에 3.14 또는 π 확인')
  }

  // 삼각형 내각의 합
  if (n.includes('삼각형') && n.includes('내각')) {
    if (!l.includes('180'))
      error(f.id, f.name, '삼각형 내각의 합: 180° 없음')
  }

  // 피타고라스
  if (n.includes('피타고라스') && n.includes('정리')) {
    if (!l.includes('c^2') && !l.includes('c²'))
      error(f.id, f.name, '피타고라스: c² 없음')
    if (!l.includes('a^2') && !l.includes('a²'))
      error(f.id, f.name, '피타고라스: a² 없음')
  }

  // 근의 공식
  if (n === '근의 공식') {
    if (!l.includes('-b') && !l.includes('−b'))
      error(f.id, f.name, '근의 공식: -b 없음')
    if (!l.includes('2a'))
      error(f.id, f.name, '근의 공식: 2a 없음')
    if (!l.includes('\\sqrt') && !l.includes('sqrt'))
      error(f.id, f.name, '근의 공식: √ 없음')
    if (!l.includes('4ac'))
      error(f.id, f.name, '근의 공식: 4ac 없음')
  }

  // 구의 부피
  if (n.includes('구') && n.includes('부피')) {
    if (!l.includes('4') && !l.includes('frac'))
      warn(f.id, f.name, '구의 부피: 4/3 확인')
  }

  // 기울기
  if (n.includes('기울기')) {
    if (!l.includes('y_') && !l.includes('y₂') && !l.includes('\\frac'))
      warn(f.id, f.name, '기울기 공식 형식 확인')
  }

  // 다각형 내각의 합
  if (n.includes('다각형') && n.includes('내각')) {
    if (!l.includes('180') || (!l.includes('n-2') && !l.includes('n - 2')))
      error(f.id, f.name, '다각형 내각의 합: 180(n-2) 형식 아님')
  }
}

// ── 검증 3: 레벨/학년 적절성 ──
function checkLevelAppropriateness(f: Formula) {
  if (f.level === 'elementary') {
    const advancedTerms = ['극한', '적분', '미분', '행렬', '벡터', '복소수', '허수']
    advancedTerms.forEach(term => {
      if (f.principle?.includes(term) || f.story?.includes(term))
        warn(f.id, f.name, `초등 공식에 고급 개념 "${term}" 포함`)
    })
  }

  if (f.level === 'middle') {
    if (f.name === '근의 공식' && f.grade !== '중3')
      error(f.id, f.name, `근의 공식은 중3인데 grade: ${f.grade}`)
    if (f.name.includes('삼각비') && f.grade !== '중3')
      error(f.id, f.name, `삼각비는 중3인데 grade: ${f.grade}`)
    if (f.name.includes('피타고라스') && f.name.includes('정리') && f.grade !== '중3')
      warn(f.id, f.name, `피타고라스 정리 grade 확인: ${f.grade}`)
  }
}

// ── 검증 4: 예제 ──
function checkExampleAnswers(f: Formula) {
  if (!f.example) return
  if (f.example.hints && f.example.hints.length < 3)
    warn(f.id, f.name, `힌트가 ${f.example.hints.length}개 (권장: 3개)`)
  if (f.example.question && f.example.question.length < 10)
    warn(f.id, f.name, '예제 질문이 너무 짧음')
}

// ── 검증 5: ID 중복 ──
function checkDuplicateIds(formulas: Formula[]) {
  const ids = formulas.map(f => f.id)
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
  duplicates.forEach(id => error(id, '?', `ID 중복: ${id}`))
}

// ── 검증 6: evolution 연결 ──
function checkEvolutionLinks(formulas: Formula[]) {
  const allIds = new Set(formulas.map(f => f.id))
  formulas.forEach(f => {
    if (!f.evolution) return
    if (f.evolution.prev && !allIds.has(f.evolution.prev))
      warn(f.id, f.name, `evolution.prev '${f.evolution.prev}' 가 DB에 없음`)
    if (f.evolution.next && !allIds.has(f.evolution.next))
      warn(f.id, f.name, `evolution.next '${f.evolution.next}' 가 DB에 없음`)
  })
}

// ── 메인 ──
console.log('\n')
console.log('╔════════════════════════════════════════════╗')
console.log('║   🤖 미니 아인슈타인 수학 오류 검증 봇    ║')
console.log('║      FREAKMATH Formula Validator v2.0      ║')
console.log('╚════════════════════════════════════════════╝')
console.log(`\n📊 총 공식 수: ${ALL_FORMULAS.length}개`)
console.log(`   초등: ${ALL_FORMULAS.filter(f=>f.level==='elementary').length}개`)
console.log(`   중등: ${ALL_FORMULAS.filter(f=>f.level==='middle').length}개\n`)

checkDuplicateIds(ALL_FORMULAS)
checkEvolutionLinks(ALL_FORMULAS)

ALL_FORMULAS.forEach(f => {
  checkRequiredFields(f)
  checkMathAccuracy(f)
  checkLevelAppropriateness(f)
  checkExampleAnswers(f)
  if (ERRORS.filter(e => e.includes(f.id)).length === 0 &&
      WARNINGS.filter(w => w.includes(f.id)).length === 0) {
    pass()
  }
})

console.log('━'.repeat(50))
console.log('📋 검증 결과')
console.log('━'.repeat(50))

if (ERRORS.length === 0) {
  console.log('\n✅ 수학 오류 없음!')
} else {
  console.log(`\n❌ 오류 ${ERRORS.length}개 발견:`)
  ERRORS.forEach(e => console.log('  ' + e))
}

if (WARNINGS.length === 0) {
  console.log('\n✅ 경고 없음!')
} else {
  console.log(`\n⚠️  경고 ${WARNINGS.length}개:`)
  WARNINGS.forEach(w => console.log('  ' + w))
}

console.log('\n' + '━'.repeat(50))
console.log('📈 통계')
console.log('━'.repeat(50))
console.log(`  ✅ 통과: ${passCount}개`)
console.log(`  ❌ 오류: ${ERRORS.length}개`)
console.log(`  ⚠️  경고: ${WARNINGS.length}개`)
console.log(`  📊 정확도: ${Math.round(passCount/ALL_FORMULAS.length*100)}%`)
console.log('\n')

if (ERRORS.length > 0) {
  console.log('🔧 위 오류들을 수정한 후 다시 실행해줘.')
  process.exit(1)
} else {
  console.log('🎉 미니 아인슈타인 검증 완료!')
  process.exit(0)
}

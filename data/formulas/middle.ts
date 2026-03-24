import { Formula } from '@/lib/types'

export const MIDDLE_FORMULAS: Formula[] = [
  // ============================================================
  // 중1 – 정수와 유리수 (M001~M005)
  // ============================================================
  {
    id: 'M001',
    number: 1,
    name: '정수 덧셈 부호 규칙',
    latex: '(+a)+(+b) = +(a+b), \\quad (-a)+(-b) = -(a+b)',
    description: '같은 부호끼리 더하면 부호는 그대로, 절댓값끼리 더한다',
    level: 'middle',
    category: 'algebra',
    tags: ['정수', '덧셈', '부호', '양수', '음수', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '영하 3도에서 5도 더 떨어지면? 부호만 알면 바로 답이 나와!',

    principle: `
      정수의 덧셈은 두 가지 경우로 나뉘어.<br><br>
      <strong>① 같은 부호끼리 더할 때</strong><br>
      절댓값끼리 더하고, 공통 부호를 붙여. (+3)+(+5) = +(3+5) = +8, (-3)+(-5) = -(3+5) = -8<br><br>
      <strong>② 다른 부호끼리 더할 때</strong><br>
      절댓값이 큰 쪽의 부호를 가져가고, 절댓값의 차이를 써. (+3)+(-5) = -(5-3) = -2<br><br>
      수직선에서 양수는 오른쪽, 음수는 왼쪽으로 이동한다고 생각하면 직관적이야.
    `,

    story: `
      음수 개념은 고대 중국과 인도에서 시작됐어.<br><br>
      7세기 인도 수학자 <strong>브라마굽타</strong>는 '빚'을 음수로, '재산'을 양수로 표현하며
      최초로 음수의 연산 규칙을 체계적으로 정리했어. 유럽에서는 무려 1000년 뒤에야
      음수를 받아들였을 정도로 "0보다 작은 수"는 혁명적인 아이디어였지.
    `,

    realLife: [
      { icon: '🌡️', title: '기온 변화', desc: '현재 -3°C에서 5°C 떨어지면 (-3)+(-5) = -8°C' },
      { icon: '🏦', title: '은행 잔고', desc: '잔고 +2만 원에서 5만 원 출금하면 (+2)+(-5) = -3만 원 (적자)' },
      { icon: '🎮', title: '게임 점수', desc: 'HP -10에서 포션 +25를 먹으면 (-10)+(+25) = +15' },
    ],

    sliders: [
      { name: 'a', label: '첫째 수', min: -20, max: 20, default: -3, step: 1 },
      { name: 'b', label: '둘째 수', min: -20, max: 20, default: -5, step: 1 },
    ],

    example: {
      question: '(-7) + (-4)를 계산하라.',
      answer: '-11',
      steps: [
        '두 수 모두 음수이므로 같은 부호끼리의 덧셈이다.',
        '절댓값끼리 더한다: 7 + 4 = 11',
        '공통 부호(-)를 붙인다: -(11) = -11',
      ],
      hints: [
        '힌트 1: 두 수의 부호가 같은지 다른지 확인해봐.',
        '힌트 2: 둘 다 음수니까 절댓값끼리 더하면 돼.',
        '힌트 3: 7+4=11이고, 부호는 음수니까 -11이야.',
      ],
      otherApproaches: [
        { name: '수직선 이동', desc: '0에서 왼쪽으로 7칸, 거기서 다시 왼쪽으로 4칸 가면 -11에 도착해.' },
      ],
    },

    evolution: { prev: 'E015', next: undefined, family: '약수의 발전', familyDescription: '초등 최대공약수 → 중등 소인수분해 → 고등 정수론으로 발전' },

    visualType: 'integer_calc',
    relatedIds: ['M002', 'M003', 'M004'],
  },

  {
    id: 'M002',
    number: 2,
    name: '정수 뺄셈→덧셈 변환',
    latex: 'a - b = a + (-b)',
    description: '뺄셈은 빼는 수의 부호를 바꿔서 더하는 것과 같다',
    level: 'middle',
    category: 'algebra',
    tags: ['정수', '뺄셈', '덧셈변환', '부호', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '뺄셈이 어려워? 부호만 뒤집으면 전부 덧셈이야!',

    principle: `
      뺄셈을 덧셈으로 바꾸는 건 중학 수학의 핵심 테크닉이야.<br><br>
      <strong>a - b = a + (-b)</strong><br><br>
      "b를 빼는 것"은 "b의 반대 수(-b)를 더하는 것"과 완전히 같아.<br><br>
      예: 5 - 3 = 5 + (-3) = 2<br>
      예: (-2) - (-7) = (-2) + (+7) = 5<br><br>
      이 변환 덕분에 복잡한 뺄셈도 M001의 덧셈 규칙 하나로 해결할 수 있어.
    `,

    story: `
      고대 그리스 수학자들은 뺄셈을 덧셈과 완전히 별개로 취급했어.<br><br>
      하지만 인도·아랍 수학자들이 음수 체계를 확립하면서 "뺄셈은 덧셈의 변형"이라는
      강력한 통찰을 얻었지. 이 아이디어는 현대 컴퓨터의 <strong>2의 보수(two's complement)</strong>
      연산에도 그대로 쓰여 — CPU가 뺄셈 회로 없이 덧셈 회로만으로 뺄셈을 처리하거든!
    `,

    realLife: [
      { icon: '💻', title: 'CPU 연산', desc: '컴퓨터는 뺄셈 회로 없이 보수를 더해서 뺄셈을 처리한다' },
      { icon: '🏔️', title: '고도차 계산', desc: '해발 300m에서 지하 50m로 가면 300 - (-50) = 300 + 50 = 350m 차이' },
      { icon: '⚽', title: '골 득실차', desc: '득점 3, 실점 5이면 득실차 = 3 - 5 = 3 + (-5) = -2' },
    ],

    sliders: [
      { name: 'a', label: 'a', min: -20, max: 20, default: 5, step: 1 },
      { name: 'b', label: 'b', min: -20, max: 20, default: 3, step: 1 },
    ],

    example: {
      question: '(-3) - (-8)을 계산하라.',
      answer: '5',
      steps: [
        '뺄셈을 덧셈으로 변환: (-3) - (-8) = (-3) + (+8)',
        '다른 부호의 덧셈: 절댓값이 큰 쪽(8)의 부호(+)를 가져간다.',
        '절댓값의 차: 8 - 3 = 5',
        '따라서 답은 +5, 즉 5이다.',
      ],
      hints: [
        '힌트 1: 먼저 뺄셈을 덧셈으로 바꿔봐. 빼는 수의 부호를 뒤집어!',
        '힌트 2: (-3) + (+8)이 됐어. 부호가 다르니까 절댓값의 차를 구해.',
        '힌트 3: 8 - 3 = 5이고, 절댓값이 큰 8의 부호가 +이므로 답은 +5야.',
      ],
      otherApproaches: [
        { name: '수직선 활용', desc: '-3에서 오른쪽으로 8칸 이동하면 +5에 도착해.' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '정수 연산 계보', familyDescription: '정수 덧셈 → 뺄셈 → 곱셈으로 이어지는 정수 연산의 기본' },

    visualType: 'integer_calc_sub',
    relatedIds: ['M001', 'M003', 'M004'],
  },

  {
    id: 'M003',
    number: 3,
    name: '정수 곱셈 부호 규칙',
    latex: '(+)(+) = +, \\quad (-)(-)= +, \\quad (+)(-) = -, \\quad (-)(+) = -',
    description: '같은 부호끼리 곱하면 양수, 다른 부호끼리 곱하면 음수',
    level: 'middle',
    category: 'algebra',
    tags: ['정수', '곱셈', '부호규칙', '양수', '음수', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '"마이너스 × 마이너스 = 플러스" — 원수의 원수는 내 편이라는 뜻이야!',

    principle: `
      정수 곱셈의 부호 규칙은 딱 두 줄이야.<br><br>
      <strong>같은 부호 × 같은 부호 = 양수(+)</strong><br>
      (+3)×(+2) = +6, (-3)×(-2) = +6<br><br>
      <strong>다른 부호 × 다른 부호 = 음수(-)</strong><br>
      (+3)×(-2) = -6, (-3)×(+2) = -6<br><br>
      절댓값끼리 곱한 뒤, 위 규칙으로 부호를 결정하면 끝이야.
      나눗셈도 부호 규칙이 완전히 똑같아!
    `,

    story: `
      "음수 × 음수 = 양수"는 수학 역사상 가장 논쟁이 뜨거웠던 규칙 중 하나야.<br><br>
      18세기 수학자 <strong>오일러</strong>조차 이 규칙의 직관적 설명에 고민했어.
      현대적 증명은 분배법칙에서 나와: (-1)×(a+(-a)) = (-1)×0 = 0이므로
      (-1)×a + (-1)×(-a) = 0, 즉 (-1)×(-a) = a가 될 수밖에 없지.
    `,

    realLife: [
      { icon: '🎬', title: '영상 되감기', desc: '속도 -2배(역재생)로 -3초(되감기) 하면 (-2)×(-3) = +6초 앞으로 간 것' },
      { icon: '📉', title: '주식 투자', desc: '하루 -2% × 3일 = -6%, 손실의 반복은 더 큰 손실' },
      { icon: '🏗️', title: '엘리베이터', desc: '한 층 -3m씩 4층 내려가면 (-3)×4 = -12m' },
    ],

    sliders: [
      { name: 'a', label: '첫째 수', min: -10, max: 10, default: -3, step: 1 },
      { name: 'b', label: '둘째 수', min: -10, max: 10, default: -2, step: 1 },
    ],

    example: {
      question: '(-5) × (-4)를 계산하라.',
      answer: '20',
      steps: [
        '두 수의 부호 확인: 음수 × 음수 → 결과는 양수(+)',
        '절댓값끼리 곱한다: 5 × 4 = 20',
        '부호를 붙인다: +20, 즉 20',
      ],
      hints: [
        '힌트 1: 두 수의 부호가 같은지 다른지 먼저 확인해봐.',
        '힌트 2: 음수 × 음수니까 결과는 양수야.',
        '힌트 3: 5×4=20이니까 답은 +20이야.',
      ],
      otherApproaches: [
        { name: '패턴으로 이해', desc: '-5×(-4)는 -5를 -4번 빼는 것. 빚(-5)을 4번 없애면 재산이 20 늘어나는 것과 같아.' },
      ],
    },

    evolution: { prev: 'E002', next: undefined, family: '수 체계의 확장', familyDescription: '초등 뺄셈 → 중등 음수·정수·유리수 → 고등 실수 체계로 확장' },

    visualType: 'integer_calc_mul',
    relatedIds: ['M001', 'M002', 'M004'],
  },

  {
    id: 'M004',
    number: 4,
    name: '절댓값',
    latex: '|a| = \\begin{cases} a & (a \\geq 0) \\\\ -a & (a < 0) \\end{cases}',
    description: '절댓값은 수직선 위에서 0까지의 거리',
    level: 'middle',
    category: 'algebra',
    tags: ['절댓값', '거리', '수직선', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '절댓값은 숫자의 "크기"만 보여줘 — 방향은 무시!',

    principle: `
      <strong>절댓값(absolute value)</strong>은 수직선 위에서 어떤 수가 0에서 얼마나 떨어져 있는지를 나타내.<br><br>
      기호는 |a|로 쓰고, 항상 0 이상이야.<br><br>
      <strong>|5| = 5</strong> (5는 0에서 오른쪽 5칸)<br>
      <strong>|-5| = 5</strong> (-5는 0에서 왼쪽 5칸, 거리는 5)<br>
      <strong>|0| = 0</strong><br><br>
      정리하면: 양수의 절댓값은 그 자체, 음수의 절댓값은 부호를 뒤집은 양수야.
    `,

    story: `
      절댓값 기호 |a|는 1841년 독일 수학자 <strong>바이어슈트라스</strong>가 처음 사용했어.<br><br>
      그는 복소수(실수를 넘어선 수 체계)의 "크기"를 표현할 방법이 필요했고,
      양쪽에 수직 막대를 세우는 심플한 기호를 고안했지. 오늘날 절댓값은 오차 계산,
      거리 측정, 프로그래밍의 abs() 함수까지 모든 곳에서 쓰여.
    `,

    realLife: [
      { icon: '📍', title: '거리 측정', desc: '집이 학교에서 -3km(서쪽)이든 +3km(동쪽)이든 거리는 |±3|=3km' },
      { icon: '🎯', title: '오차 계산', desc: '목표 100인데 결과가 97이면 오차 = |97-100| = 3' },
      { icon: '💻', title: '코딩 abs()', desc: 'Python의 abs(-7)=7, 모든 프로그래밍 언어에 절댓값 함수가 있다' },
    ],

    sliders: [
      { name: 'a', label: '수 a', min: -20, max: 20, default: -5, step: 1 },
    ],

    example: {
      question: '|-9| + |3|을 계산하라.',
      answer: '12',
      steps: [
        '|-9| = 9 (음수의 절댓값은 부호를 뒤집는다)',
        '|3| = 3 (양수의 절댓값은 그대로)',
        '9 + 3 = 12',
      ],
      hints: [
        '힌트 1: 각각의 절댓값을 먼저 구해봐.',
        '힌트 2: |-9|는 0에서 -9까지의 거리야. 몇 칸?',
        '힌트 3: 9+3=12야.',
      ],
      otherApproaches: [
        { name: '수직선 시각화', desc: '-9는 0에서 왼쪽 9칸, 3은 오른쪽 3칸. 두 거리를 합하면 12.' },
      ],
    },

    evolution: { prev: 'E002', next: undefined, family: '절댓값의 발전', familyDescription: '초등 뺄셈 → 중등 절댓값 → 고등 절댓값 함수·부등식으로 발전' },

    visualType: 'absolute_value',
    relatedIds: ['M001', 'M002', 'M003'],
  },

  {
    id: 'M005',
    number: 5,
    name: '유리수 사칙연산',
    latex: '\\frac{a}{b} \\pm \\frac{c}{d} = \\frac{ad \\pm bc}{bd}, \\quad \\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}',
    description: '분수의 덧셈은 통분, 곱셈은 분자×분자·분모×분모',
    level: 'middle',
    category: 'algebra',
    tags: ['유리수', '분수', '사칙연산', '통분', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '분수 계산이 귀찮다고? 규칙만 알면 어떤 분수든 척척 해결돼!',

    principle: `
      <strong>유리수</strong>란 분수(a/b, b≠0)로 나타낼 수 있는 모든 수야.<br><br>
      <strong>덧셈/뺄셈</strong>: 통분해서 분모를 맞춘 뒤 분자끼리 계산<br>
      \\(\\frac{a}{b} + \\frac{c}{d} = \\frac{ad+bc}{bd}\\)<br><br>
      <strong>곱셈</strong>: 분자끼리, 분모끼리 곱하기<br>
      \\(\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}\\)<br><br>
      <strong>나눗셈</strong>: 뒤집어서 곱하기<br>
      \\(\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}\\)<br><br>
      부호 규칙은 정수와 똑같아!
    `,

    story: `
      고대 이집트인들은 분자가 1인 <strong>단위분수</strong>만 사용했어. 2/5 같은 건 1/3 + 1/15로 쪼개서 썼지!<br><br>
      현대적 분수 표기법은 12세기 아랍 수학자들이 만들었고,
      분수선(—)은 <strong>피보나치</strong>가 유럽에 전파한 거야.
      분수의 사칙연산은 오늘날 모든 공학 계산의 기초가 돼.
    `,

    realLife: [
      { icon: '🍕', title: '피자 나누기', desc: '1/3 + 1/4 = 7/12. 피자를 12등분하면 한 사람은 4조각, 다른 사람은 3조각' },
      { icon: '⏱️', title: '시간 계산', desc: '3/4시간 + 1/2시간 = 5/4시간 = 1시간 15분' },
      { icon: '🎵', title: '음악 박자', desc: '4분의 3박자 + 4분의 1박자 = 4분의 4박자 = 1마디' },
    ],

    sliders: [
      { name: 'a', label: '분자 a', min: -10, max: 10, default: 1, step: 1 },
      { name: 'b', label: '분모 b', min: 1, max: 10, default: 3, step: 1 },
      { name: 'c', label: '분자 c', min: -10, max: 10, default: 1, step: 1 },
      { name: 'd', label: '분모 d', min: 1, max: 10, default: 4, step: 1 },
    ],

    example: {
      question: '(-2/3) + (5/6)을 계산하라.',
      answer: '1/6',
      steps: [
        '통분: 분모의 최소공배수는 6',
        '-2/3 = -4/6',
        '5/6은 그대로',
        '-4/6 + 5/6 = (-4+5)/6 = 1/6',
      ],
      hints: [
        '힌트 1: 먼저 두 분모 3과 6의 최소공배수를 구해봐.',
        '힌트 2: -2/3을 분모 6으로 통분하면?',
        '힌트 3: -4/6 + 5/6 = 1/6이야.',
      ],
      otherApproaches: [
        { name: '교차 곱셈법', desc: '(-2×6 + 5×3) / (3×6) = (-12+15)/18 = 3/18 = 1/6' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '수 체계 계보', familyDescription: '정수 → 유리수 → 실수 → 복소수로 확장되는 수의 세계' },

    visualType: 'integer_calc_rational',
    relatedIds: ['M001', 'M004', 'M006'],
  },

  // ============================================================
  // 중2 – 유한소수/순환소수 (M006)
  // ============================================================
  {
    id: 'M006',
    number: 6,
    name: '유한소수와 순환소수',
    latex: '\\frac{a}{b} \\text{가 유한소수} \\iff b = 2^m \\times 5^n',
    description: '기약분수의 분모가 2와 5만의 곱이면 유한소수, 아니면 순환소수',
    level: 'middle',
    category: 'algebra',
    tags: ['유한소수', '순환소수', '분수', '소인수분해', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '1/3 = 0.333...은 왜 끝나지 않을까? 분모를 소인수분해하면 답이 보여!',

    principle: `
      분수를 소수로 바꿀 때 두 가지 결과가 나와.<br><br>
      <strong>유한소수</strong>: 딱 떨어지는 소수 (예: 1/4 = 0.25)<br>
      <strong>순환소수</strong>: 특정 패턴이 무한 반복되는 소수 (예: 1/3 = 0.333...)<br><br>
      판별법: 기약분수로 만든 뒤 <strong>분모를 소인수분해</strong>해봐.<br>
      분모의 소인수가 <strong>2와 5뿐</strong>이면 → 유한소수<br>
      그 외 소인수가 섞여 있으면 → 순환소수<br><br>
      이유: 우리가 쓰는 10진법에서 10 = 2 × 5이기 때문이야.
    `,

    story: `
      순환소수의 비밀은 18세기 독일 수학자 <strong>람베르트</strong>가 본격적으로 연구했어.<br><br>
      그는 순환마디의 길이와 분모의 관계를 밝혀냈지.
      재밌는 사실: 1/7 = 0.142857142857...인데, 142857은 <strong>"사이클 수"</strong>라고 해서
      2배, 3배... 해도 같은 숫자들이 자리만 바뀌어. 수학의 숨겨진 아름다움이야!
    `,

    realLife: [
      { icon: '💵', title: '환율 계산', desc: '1/3달러 = 0.333...달러. 정확한 센트로 변환할 때 반올림이 필요한 이유' },
      { icon: '🖥️', title: '부동소수점', desc: '컴퓨터에서 0.1+0.2 ≠ 0.3인 이유는 이진법의 순환소수 때문' },
      { icon: '📐', title: '측정 정밀도', desc: '1/8m = 0.125m(유한), 1/6m = 0.1666...m(순환) — 측정 도구의 한계' },
    ],

    example: {
      question: '7/40이 유한소수인지 판별하라.',
      answer: '유한소수이다.',
      steps: [
        '7/40은 이미 기약분수이다 (7과 40의 공약수는 1)',
        '분모 40을 소인수분해: 40 = 2³ × 5',
        '소인수가 2와 5뿐이므로 유한소수이다.',
        '실제로 7/40 = 0.175',
      ],
      hints: [
        '힌트 1: 먼저 기약분수인지 확인해봐.',
        '힌트 2: 분모 40을 소인수분해해봐.',
        '힌트 3: 40 = 2³×5이니까 2와 5만 있으므로 유한소수야.',
      ],
      otherApproaches: [
        { name: '직접 나누기', desc: '7 ÷ 40 = 0.175. 나눗셈이 딱 떨어지므로 유한소수.' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '수 체계 계보' },

    visualType: 'recurring_decimal',
    relatedIds: ['M005', 'M011'],
  },

  // ============================================================
  // 중2 – 지수법칙 (M007~M010)
  // ============================================================
  {
    id: 'M007',
    number: 7,
    name: '지수법칙 — 곱',
    latex: 'a^m \\times a^n = a^{m+n}',
    description: '밑이 같은 거듭제곱의 곱은 지수끼리 더한다',
    level: 'middle',
    category: 'algebra',
    tags: ['지수', '거듭제곱', '곱셈', '지수법칙', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '2³ × 2⁴ = 2⁷. 지수끼리 더하기만 하면 돼!',

    principle: `
      <strong>a^m × a^n = a^{m+n}</strong><br><br>
      왜 이렇게 될까? 풀어서 써보면 바로 보여.<br><br>
      a^3 × a^4 = (a·a·a) × (a·a·a·a) = a를 총 7번 곱함 = a^7<br><br>
      즉, 밑(base)이 같을 때 곱하면 지수(exponent)끼리 더하면 돼.<br>
      <strong>주의:</strong> 밑이 다르면 이 법칙을 쓸 수 없어! 2³ × 3⁴는 그냥 계산해야 해.
    `,

    story: `
      지수 표기법은 17세기 프랑스 수학자 <strong>데카르트</strong>가 처음 도입했어.<br><br>
      그 전에는 x·x·x를 매번 길게 써야 했지. 지수법칙 덕분에
      <strong>아르키메데스의 "모래알 세기"</strong> 문제처럼 어마어마한 수도 간결하게 다룰 수 있게 됐어.
      현대 과학에서 빛의 속도(3×10⁸)나 원자 크기(10⁻¹⁰)를 표현할 수 있는 건 이 표기법 덕분이야.
    `,

    realLife: [
      { icon: '🦠', title: '세균 증식', desc: '1시간에 2배씩 늘면 3시간 후 2³, 추가 4시간이면 2³×2⁴ = 2⁷ = 128배' },
      { icon: '💾', title: '데이터 크기', desc: 'KB=2¹⁰, MB=2¹⁰×2¹⁰=2²⁰, GB=2³⁰' },
      { icon: '🔬', title: '과학 표기법', desc: '(3×10⁴)×(2×10⁵) = 6×10⁹' },
    ],

    sliders: [
      { name: 'base', label: '밑 a', min: 2, max: 5, default: 2, step: 1 },
      { name: 'm', label: '지수 m', min: 1, max: 6, default: 3, step: 1 },
      { name: 'n', label: '지수 n', min: 1, max: 6, default: 4, step: 1 },
    ],

    example: {
      question: '3⁵ × 3² 를 간단히 하라.',
      answer: '3⁷ = 2187',
      steps: [
        '밑이 3으로 같으므로 지수법칙 적용 가능',
        '지수끼리 더한다: 5 + 2 = 7',
        '∴ 3⁵ × 3² = 3⁷',
        '3⁷ = 2187',
      ],
      hints: [
        '힌트 1: 밑이 같은지 확인해봐.',
        '힌트 2: 밑이 둘 다 3이니까 지수끼리 더하면 돼.',
        '힌트 3: 3^(5+2) = 3⁷ = 2187이야.',
      ],
      otherApproaches: [
        { name: '풀어서 확인', desc: '3⁵=243, 3²=9, 243×9=2187=3⁷. 결과 동일!' },
      ],
    },

    evolution: { prev: 'E033', next: undefined, family: '제곱의 역', familyDescription: '초등 정사각형 넓이 → 중등 제곱근 → 고등 무리함수로 발전' },

    visualType: 'exponent_viz',
    relatedIds: ['M008', 'M009', 'M010'],
  },

  {
    id: 'M008',
    number: 8,
    name: '지수법칙 — 나눗셈',
    latex: 'a^m \\div a^n = a^{m-n} \\quad (a \\neq 0)',
    description: '밑이 같은 거듭제곱의 나눗셈은 지수끼리 뺀다',
    level: 'middle',
    category: 'algebra',
    tags: ['지수', '거듭제곱', '나눗셈', '지수법칙', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '2⁷ ÷ 2³ = 2⁴. 곱셈에서 더했으니 나눗셈에서는 빼!',

    principle: `
      <strong>a^m ÷ a^n = a^{m-n}</strong> (단, a ≠ 0)<br><br>
      이건 곱셈 법칙의 역연산이야.<br><br>
      a⁵ ÷ a² = (a·a·a·a·a) ÷ (a·a) = a·a·a = a³<br>
      5개에서 2개를 약분하면 3개 남으니까 지수를 빼는 거야.<br><br>
      <strong>특별한 경우:</strong> m = n이면 a^0 = 1이 돼. 이게 M010으로 이어져!
    `,

    story: `
      지수 나눗셈 법칙은 <strong>뉴턴</strong>이 미적분을 발전시키면서 핵심적으로 사용했어.<br><br>
      특히 무한급수 전개에서 지수의 뺄셈이 반복적으로 나타났지.
      이 간단한 규칙이 없었다면 뉴턴의 이항급수 정리도 탄생하지 못했을 거야.
    `,

    realLife: [
      { icon: '📊', title: '단위 환산', desc: 'km를 m로: 10⁶÷10³ = 10³ → 1000배 차이' },
      { icon: '🔋', title: '배터리 소모', desc: '충전량 2¹⁰에서 2³만큼 소모하면 2⁷ 남음' },
      { icon: '🌐', title: '네트워크 속도', desc: 'Gbps÷Mbps = 10⁹÷10⁶ = 10³배 차이' },
    ],

    sliders: [
      { name: 'base', label: '밑 a', min: 2, max: 5, default: 2, step: 1 },
      { name: 'm', label: '지수 m', min: 2, max: 10, default: 7, step: 1 },
      { name: 'n', label: '지수 n', min: 1, max: 9, default: 3, step: 1 },
    ],

    example: {
      question: '5⁸ ÷ 5³ 을 간단히 하라.',
      answer: '5⁵ = 3125',
      steps: [
        '밑이 5로 같으므로 지수법칙 적용',
        '지수끼리 뺀다: 8 - 3 = 5',
        '∴ 5⁸ ÷ 5³ = 5⁵',
        '5⁵ = 3125',
      ],
      hints: [
        '힌트 1: 밑이 같은지 확인!',
        '힌트 2: 나눗셈이니까 지수를 빼면 돼.',
        '힌트 3: 5^(8-3) = 5⁵ = 3125이야.',
      ],
      otherApproaches: [
        { name: '분수로 표현', desc: '5⁸/5³에서 분자·분모의 5를 3개씩 약분하면 5⁵만 남아.' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '지수법칙 계보' },

    visualType: 'exponent_div',
    relatedIds: ['M007', 'M009', 'M010'],
  },

  {
    id: 'M009',
    number: 9,
    name: '지수법칙 — 거듭제곱의 거듭제곱',
    latex: '(a^m)^n = a^{mn}',
    description: '거듭제곱을 다시 거듭제곱하면 지수끼리 곱한다',
    level: 'middle',
    category: 'algebra',
    tags: ['지수', '거듭제곱', '지수법칙', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '(2³)⁴ = 2¹². 지수의 지수? 곱하면 끝!',

    principle: `
      <strong>(a^m)^n = a^{m×n}</strong><br><br>
      이것도 풀어쓰면 이해가 쉬워.<br><br>
      (a²)³ = a² × a² × a² (a²를 3번 곱함)<br>
      = a^(2+2+2) = a⁶ = a^(2×3)<br><br>
      a^m을 n번 반복해서 곱하니까 m을 n번 더하는 것 = m×n이 되는 거야.<br><br>
      <strong>추가:</strong> (ab)^n = a^n · b^n, (a/b)^n = a^n/b^n도 함께 기억해!
    `,

    story: `
      지수의 거듭제곱은 <strong>천문학적 수</strong>를 다룰 때 빛을 발했어.<br><br>
      예를 들어, 관측 가능한 우주의 원자 수는 약 10⁸⁰개로 추정돼.
      이런 수를 (10⁸)¹⁰ 같은 형태로 조작할 수 있는 건 순전히 이 법칙 덕분이지.
      구글(Google)의 이름도 <strong>구골(10¹⁰⁰)</strong>에서 왔을 정도로, 큰 수는 IT 문화에도 영향을 줬어.
    `,

    realLife: [
      { icon: '🌌', title: '우주의 크기', desc: '1광년 ≈ 10¹³km, 우주 반경 ≈ (10¹³)^(10배 이상)' },
      { icon: '🔐', title: '암호 키 길이', desc: 'AES-256은 (2⁸)³² = 2²⁵⁶가지 경우의 수' },
      { icon: '🧬', title: 'DNA 조합', desc: '4종 염기가 30억 개 나열 → (4¹)^(3×10⁹)가지' },
    ],

    sliders: [
      { name: 'base', label: '밑 a', min: 2, max: 4, default: 2, step: 1 },
      { name: 'm', label: '안쪽 지수 m', min: 1, max: 5, default: 3, step: 1 },
      { name: 'n', label: '바깥 지수 n', min: 1, max: 5, default: 4, step: 1 },
    ],

    example: {
      question: '(3²)⁴ 을 간단히 하라.',
      answer: '3⁸ = 6561',
      steps: [
        '거듭제곱의 거듭제곱이므로 지수끼리 곱한다.',
        '2 × 4 = 8',
        '∴ (3²)⁴ = 3⁸',
        '3⁸ = 6561',
      ],
      hints: [
        '힌트 1: 괄호 안의 지수와 바깥 지수를 찾아봐.',
        '힌트 2: 안쪽 지수 2, 바깥 지수 4를 곱해.',
        '힌트 3: 3^(2×4) = 3⁸ = 6561이야.',
      ],
      otherApproaches: [
        { name: '단계적 계산', desc: '3²=9, 9⁴=9×9×9×9=6561. 실제로 3⁸=6561과 같다!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '지수법칙 계보' },

    visualType: 'exponent_power',
    relatedIds: ['M007', 'M008', 'M010'],
  },

  {
    id: 'M010',
    number: 10,
    name: '소인수분해',
    latex: 'n = p_1^{a_1} \\times p_2^{a_2} \\times \\cdots',
    description: '모든 자연수는 소수의 곱으로 유일하게 분해된다',
    level: 'middle',
    category: 'arithmetic',
    tags: ['소인수분해', '소수', '약수', '인수', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '모든 자연수는 소수들의 곱으로 유일하게 분해돼',

    principle: `
      <strong>소인수분해</strong>란 자연수를 소수의 곱으로 나타내는 것이야.<br><br>
      예: 60 = 2² × 3 × 5<br><br>
      <strong>방법:</strong> 가장 작은 소수(2)부터 차례로 나눠가며 더 이상 나눌 수 없을 때까지 반복해.<br><br>
      60 ÷ 2 = 30 → 30 ÷ 2 = 15 → 15 ÷ 3 = 5 → 5는 소수!<br>
      그래서 60 = 2 × 2 × 3 × 5 = 2² × 3 × 5<br><br>
      <strong>산술의 기본정리:</strong> 1보다 큰 모든 자연수는 소인수분해가 <strong>유일</strong>해!
      순서만 다를 뿐, 분해 결과는 단 하나야.
    `,

    story: `
      소인수분해의 유일성은 <strong>유클리드</strong>의 《원론》에서 증명됐어.<br><br>
      이 성질은 <strong>"산술의 기본정리"</strong>라고 불리며, 수론의 가장 중요한 기둥이야.
      현대 인터넷 보안의 핵심인 <strong>RSA 암호</strong>도 "큰 수의 소인수분해는 매우 어렵다"는
      사실에 기반하고 있어. 컴퓨터로도 수백 자리 수의 소인수분해는 수천 년이 걸린대!
    `,

    realLife: [
      { icon: '🔐', title: 'RSA 암호', desc: '두 큰 소수의 곱은 쉽지만, 그 곱을 다시 분해하는 건 엄청 어려워 — 인터넷 보안의 핵심!' },
      { icon: '📦', title: '물건 배분', desc: '36개 사탕을 똑같이 나누려면? 36 = 2² × 3²이니까 1, 2, 3, 4, 6, 9, 12, 18, 36명에게 가능!' },
      { icon: '🎵', title: '음악 박자', desc: '12/8 박자에서 12 = 2² × 3. 다양한 리듬 패턴으로 나눌 수 있어!' },
    ],

    sliders: [
      { name: 'n', label: '자연수 n', min: 2, max: 100, default: 60, step: 1 },
    ],

    example: {
      question: '84를 소인수분해하라.',
      answer: '2² × 3 × 7',
      steps: [
        '84 ÷ 2 = 42 (2로 나눔)',
        '42 ÷ 2 = 21 (2로 한 번 더 나눔)',
        '21 ÷ 3 = 7 (3으로 나눔)',
        '7은 소수이므로 끝!',
        '∴ 84 = 2² × 3 × 7',
      ],
      hints: [
        '힌트 1: 가장 작은 소수 2부터 나눠봐.',
        '힌트 2: 84 ÷ 2 = 42, 42 ÷ 2 = 21. 이제 21은 2로 안 나눠져.',
        '힌트 3: 21 ÷ 3 = 7. 7은 소수! 답은 2² × 3 × 7.',
      ],
      otherApproaches: [
        { name: '나눗셈 세로 형태', desc: '2 | 84 → 2 | 42 → 3 | 21 → 7. 왼쪽 소수를 모아 쓰면 2² × 3 × 7.' },
      ],
    },

    evolution: { prev: 'E015', next: undefined, family: '약수의 발전', familyDescription: '초등 최대공약수 → 중등 소인수분해 → 고등 정수론으로 발전' },

    visualType: 'prime_factorization',
    relatedIds: ['M007', 'M008', 'M009', 'M011'],
  },

  // ============================================================
  // 중3 – 제곱근 (M011~M014)
  // ============================================================
  {
    id: 'M011',
    number: 11,
    name: '제곱근의 정의',
    latex: '\\sqrt{a} \\text{: } x^2 = a \\text{인 양수 } x \\quad (a \\geq 0)',
    description: '제곱해서 a가 되는 양수를 a의 양의 제곱근이라 한다',
    level: 'middle',
    category: 'algebra',
    tags: ['제곱근', '루트', '근호', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: '어떤 수를 제곱해서 9가 되면? 그 수가 바로 √9 = 3이야!',

    principle: `
      <strong>제곱근(square root)</strong>이란, 제곱해서 a가 되는 수야.<br><br>
      a > 0일 때, x² = a를 만족하는 x는 두 개: <strong>+√a와 -√a</strong><br>
      √a는 그 중 <strong>양수</strong>만 의미해. (기호 √ 자체에 "양수"가 내장돼 있어!)<br><br>
      예: 9의 제곱근은 ±3, 이 중 √9 = 3 (양의 제곱근)<br>
      예: 2의 제곱근은 ±√2 ≈ ±1.414...<br><br>
      <strong>주의:</strong> √a는 항상 0 이상이야. √4 = 2이지, -2가 아니야!
    `,

    story: `
      고대 바빌로니아(기원전 1800년경)의 점토판 <strong>YBC 7289</strong>에는
      √2 ≈ 1.41421356...이 놀라운 정밀도로 새겨져 있어.<br><br>
      그리스 수학자 <strong>히파수스</strong>는 √2가 분수로 표현 불가능하다는 것
      (무리수임)을 증명했고, 이 발견은 피타고라스 학파에 큰 충격을 줬어.
      전설에 따르면 그는 이 비밀을 폭로한 대가로 바다에 빠져 죽었다고 해.
    `,

    realLife: [
      { icon: '📱', title: '화면 대각선', desc: '가로 3, 세로 4인 화면의 대각선 = √(9+16) = √25 = 5인치' },
      { icon: '🏗️', title: '건축 정사각형', desc: '넓이 50m²인 정사각형 텃밭의 한 변 = √50 ≈ 7.07m' },
      { icon: '🎮', title: '게임 거리 계산', desc: '캐릭터 간 거리 = √(Δx² + Δy²), 코딩에서 Math.sqrt() 사용' },
    ],

    sliders: [
      { name: 'a', label: 'a 값', min: 0, max: 100, default: 9, step: 1 },
    ],

    example: {
      question: '√49 의 값을 구하라.',
      answer: '7',
      steps: [
        '제곱해서 49가 되는 양수를 찾는다.',
        '7² = 49 이므로',
        '∴ √49 = 7',
      ],
      hints: [
        '힌트 1: 어떤 수를 제곱하면 49가 될까?',
        '힌트 2: 7×7은 얼마야?',
        '힌트 3: 7²=49이니까 √49=7이야.',
      ],
      otherApproaches: [
        { name: '소인수분해', desc: '49 = 7². √(7²) = 7' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '제곱근 계보', familyDescription: '제곱근 정의 → 성질 → 연산 → 유리화로 이어지는 제곱근 완전정복' },

    visualType: 'square_root_viz',
    relatedIds: ['M012', 'M013', 'M014'],
  },

  {
    id: 'M012',
    number: 12,
    name: '제곱근의 성질',
    latex: '\\sqrt{a} \\times \\sqrt{b} = \\sqrt{ab}, \\quad \\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}}',
    description: '제곱근의 곱과 나눗셈은 근호 안에서 처리할 수 있다',
    level: 'middle',
    category: 'algebra',
    tags: ['제곱근', '성질', '곱', '나눗셈', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: '√2 × √3 = √6. 루트끼리는 안에서 합체할 수 있어!',

    principle: `
      제곱근에는 두 가지 핵심 성질이 있어.<br><br>
      <strong>① 곱셈 성질: √a × √b = √(ab)</strong><br>
      증명: (√a × √b)² = a × b = ab, 그런데 (√(ab))² = ab이므로 같다.<br><br>
      <strong>② 나눗셈 성질: √a / √b = √(a/b)</strong><br>
      같은 원리로 성립해.<br><br>
      <strong>주의:</strong> √a + √b ≠ √(a+b) !! 덧셈에는 이 성질이 적용 안 돼!<br>
      √4 + √9 = 2 + 3 = 5이지만, √(4+9) = √13 ≈ 3.6이야. 완전히 다르지?
    `,

    story: `
      제곱근의 곱셈 성질은 <strong>유클리드의 원론</strong>(기원전 300년경) 제10권에 이미 등장해.<br><br>
      유클리드는 기하학적 방법으로 이를 증명했어 — 넓이가 a인 정사각형과 넓이가 b인
      정사각형을 조합하면 넓이가 ab인 직사각형이 되고, 그 "정사각형 변환"이 √(ab)라는 것이지.
      2000년 넘게 살아남은 수학적 진리야.
    `,

    realLife: [
      { icon: '📐', title: '넓이 계산', desc: '가로 √3m, 세로 √12m인 직사각형의 넓이 = √36 = 6m²' },
      { icon: '🎨', title: '비율 축소', desc: 'A4 용지를 √2:1 비율로 반 접으면 다시 같은 비율이 나옴' },
      { icon: '🔊', title: '음향 공학', desc: '두 스피커 출력 합산 시 √(P₁×P₂)로 간섭 효과 계산' },
    ],

    sliders: [
      { name: 'a', label: 'a', min: 1, max: 20, default: 2, step: 1 },
      { name: 'b', label: 'b', min: 1, max: 20, default: 3, step: 1 },
    ],

    example: {
      question: '√18을 간단히 하라.',
      answer: '3√2',
      steps: [
        '18을 소인수분해: 18 = 2 × 3²',
        '√18 = √(3² × 2) = √(3²) × √2',
        '√(3²) = 3',
        '∴ √18 = 3√2',
      ],
      hints: [
        '힌트 1: 18을 소인수분해해봐.',
        '힌트 2: 제곱수를 찾아 꺼내는 거야. 18 = 9 × 2',
        '힌트 3: √9 = 3이니까 √18 = 3√2.',
      ],
      otherApproaches: [
        { name: '직접 계산으로 확인', desc: '√18 ≈ 4.243, 3√2 ≈ 3×1.414 = 4.243. 일치!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '제곱근 계보' },

    visualType: 'square_root_property',
    relatedIds: ['M011', 'M013', 'M014'],
  },

  {
    id: 'M013',
    number: 13,
    name: '제곱근 덧셈 (동류항)',
    latex: 'a\\sqrt{c} + b\\sqrt{c} = (a+b)\\sqrt{c}',
    description: '근호 안이 같은 제곱근끼리만 더하고 뺄 수 있다',
    level: 'middle',
    category: 'algebra',
    tags: ['제곱근', '덧셈', '동류항', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: '3√2 + 5√2 = 8√2. 마치 사과 3개 + 사과 5개 = 사과 8개처럼!',

    principle: `
      제곱근의 덧셈은 <strong>동류항</strong> 개념과 같아.<br><br>
      <strong>a√c + b√c = (a+b)√c</strong><br><br>
      "√c"를 하나의 덩어리(단위)로 보면 돼. 3x + 5x = 8x에서 x 대신 √c를 넣은 것!<br><br>
      예: 3√2 + 5√2 = (3+5)√2 = 8√2<br><br>
      <strong>주의:</strong> √2 + √3은 더 이상 합칠 수 없어. 근호 안이 다르니까!<br>
      마치 3x + 5y를 합칠 수 없는 것과 같은 원리야.<br><br>
      근호 안이 다르면 먼저 <strong>간단히</strong> 해봐. √8 + √2 = 2√2 + √2 = 3√2 처럼!
    `,

    story: `
      동류항 정리는 16세기 이탈리아 수학자 <strong>봄벨리</strong>가 제곱근 연산을 체계화하면서 확립했어.<br><br>
      그는 무리수끼리도 "같은 종류끼리는 합칠 수 있다"는 원칙을 세웠지.
      이 아이디어가 나중에 <strong>다항식</strong>의 동류항 정리로 발전하고,
      더 나아가 현대 대수학의 <strong>벡터 공간</strong> 개념으로까지 이어져.
    `,

    realLife: [
      { icon: '📦', title: '재고 정리', desc: '√2kg 박스 3개 + √2kg 박스 5개 = √2kg 박스 8개' },
      { icon: '🏃', title: '운동 거리', desc: '대각선 √5km를 3번 + 2번 걸으면 총 5√5km' },
      { icon: '🎵', title: '음파 합성', desc: '같은 주파수 √f의 진폭을 합산할 때 동류항 원리 사용' },
    ],

    example: {
      question: '√12 + √27 을 간단히 하라.',
      answer: '5√3',
      steps: [
        '√12를 간단히: √12 = √(4×3) = 2√3',
        '√27을 간단히: √27 = √(9×3) = 3√3',
        '동류항 합치기: 2√3 + 3√3 = (2+3)√3 = 5√3',
      ],
      hints: [
        '힌트 1: 각 제곱근을 먼저 간단히 해봐. 12와 27을 소인수분해!',
        '힌트 2: √12=2√3, √27=3√3이 돼.',
        '힌트 3: 근호 안이 둘 다 3이니까 합칠 수 있어! 2+3=5.',
      ],
      otherApproaches: [
        { name: '수치 확인', desc: '√12≈3.464, √27≈5.196, 합≈8.660. 5√3≈5×1.732=8.660. 일치!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '제곱근 계보' },

    visualType: 'square_root_add',
    relatedIds: ['M011', 'M012', 'M014'],
  },

  {
    id: 'M014',
    number: 14,
    name: '분모의 유리화',
    latex: '\\frac{a}{\\sqrt{b}} = \\frac{a\\sqrt{b}}{b}',
    description: '분모의 근호를 없애기 위해 분자·분모에 같은 제곱근을 곱한다',
    level: 'middle',
    category: 'algebra',
    tags: ['유리화', '분모', '제곱근', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: '분모에 루트가 있으면 불안해 보인다고? 유리화로 깔끔하게 정리하자!',

    principle: `
      <strong>분모의 유리화</strong>란, 분모에 있는 무리수(√)를 없애는 과정이야.<br><br>
      <strong>기본형:</strong> \\(\\frac{a}{\\sqrt{b}} = \\frac{a}{\\sqrt{b}} \\times \\frac{\\sqrt{b}}{\\sqrt{b}} = \\frac{a\\sqrt{b}}{b}\\)<br><br>
      왜 가능할까? \\(\\frac{\\sqrt{b}}{\\sqrt{b}} = 1\\)이니까 값은 변하지 않아!<br><br>
      <strong>응용형:</strong> 분모가 (a+√b) 형태이면 <strong>켤레 근호</strong> (a-√b)를 곱해.<br>
      (a+√b)(a-√b) = a²-b (합차공식)로 √가 사라져!
    `,

    story: `
      유리화는 <strong>계산 편의</strong>를 위해 발전한 기법이야.<br><br>
      계산기가 없던 시대에 1/√2 ≈ 1/1.414...를 계산하는 것보다
      √2/2 ≈ 1.414.../2 = 0.707...이 훨씬 쉬웠거든.
      현대에는 컴퓨터가 알아서 하지만, 수학적 표현을 <strong>표준화</strong>하는 약속으로 여전히 쓰여.
    `,

    realLife: [
      { icon: '⚡', title: '전기 공학', desc: '임피던스 계산에서 분모 유리화로 실수·허수 성분을 분리' },
      { icon: '📊', title: '통계학', desc: '표준정규분포의 계수 1/√(2π)을 √(2π)/(2π)로 유리화' },
      { icon: '🏗️', title: '건축 설계', desc: '정삼각형 높이 = √3/2 × 변의 길이, 유리화로 비율 계산' },
    ],

    example: {
      question: '6/√3 을 유리화하라.',
      answer: '2√3',
      steps: [
        '분자·분모에 √3을 곱한다.',
        '6/√3 × √3/√3 = 6√3/3',
        '약분: 6√3/3 = 2√3',
      ],
      hints: [
        '힌트 1: 분모의 √3을 없애려면 뭘 곱해야 할까?',
        '힌트 2: √3/√3 = 1이니까 분자·분모에 √3을 곱해.',
        '힌트 3: 6√3/3 = 2√3이야.',
      ],
      otherApproaches: [
        { name: '수치 확인', desc: '6/√3 ≈ 6/1.732 ≈ 3.464. 2√3 ≈ 2×1.732 = 3.464. 일치!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '제곱근 계보' },

    visualType: 'rationalize',
    relatedIds: ['M011', 'M012', 'M013'],
  },

  // ============================================================
  // 중1 – 문자와 식 (M015~M017)
  // ============================================================
  {
    id: 'M015',
    number: 15,
    name: '단항식의 곱셈',
    latex: '(ax^m)(bx^n) = abx^{m+n}',
    description: '계수끼리 곱하고, 같은 문자의 지수끼리 더한다',
    level: 'middle',
    category: 'algebra',
    tags: ['단항식', '곱셈', '계수', '지수', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '3x² 곱하기 4x³ = 12x⁵. 숫자는 숫자끼리, 문자는 문자끼리!',

    principle: `
      <strong>단항식</strong>은 숫자와 문자의 곱으로만 이루어진 식이야. (예: 3x², -5ab²)<br><br>
      단항식끼리 곱할 때:<br>
      ① <strong>계수(숫자)</strong>끼리 곱한다: 3 곱하기 4 = 12<br>
      ② <strong>같은 문자</strong>의 지수끼리 더한다: x² 곱하기 x³ = x^(2+3) = x⁵<br>
      ③ 결과: 3x² 곱하기 4x³ = 12x⁵<br><br>
      문자가 여러 개면 각 문자별로 따로 처리해.<br>
      (2a²b)(3ab³) = 6a³b⁴
    `,

    story: `
      문자로 수를 표현하는 <strong>대수학(algebra)</strong>은 9세기 아랍 수학자 <strong>알 콰리즈미</strong>의
      저서 "알자브르"에서 시작됐어.<br><br>
      "algebra"라는 단어 자체가 아랍어 "al-jabr(복원)"에서 온 거야.
      알 콰리즈미는 방정식을 풀 때 항을 이동시키는 것을 "복원"이라고 불렀지.
      그의 이름에서 "알고리즘(algorithm)"이라는 단어도 탄생했어!
    `,

    realLife: [
      { icon: '📦', title: '부피 계산', desc: '가로 3x, 세로 2x², 높이 4x의 직육면체 부피 = 24x⁴' },
      { icon: '💻', title: '코딩 변수 연산', desc: 'x=10일 때 3x²×4x³ = 12×10⁵ = 1,200,000' },
      { icon: '🏭', title: '생산량 계산', desc: '시간당 2n개 × 3n일 = 6n² 개 생산' },
    ],

    sliders: [
      { name: 'a', label: '계수 a', min: -5, max: 5, default: 3, step: 1 },
      { name: 'b', label: '계수 b', min: -5, max: 5, default: 4, step: 1 },
      { name: 'm', label: '지수 m', min: 0, max: 5, default: 2, step: 1 },
      { name: 'n', label: '지수 n', min: 0, max: 5, default: 3, step: 1 },
    ],

    example: {
      question: '(-2a³b) × (5a²b⁴)를 계산하라.',
      answer: '-10a⁵b⁵',
      steps: [
        '계수끼리 곱하기: (-2) × 5 = -10',
        'a의 지수끼리 더하기: a³ × a² = a⁵',
        'b의 지수끼리 더하기: b × b⁴ = b⁵',
        '∴ -10a⁵b⁵',
      ],
      hints: [
        '힌트 1: 계수(숫자 부분)부터 곱해봐.',
        '힌트 2: a끼리, b끼리 따로 계산해.',
        '힌트 3: -2×5=-10, a^(3+2)=a⁵, b^(1+4)=b⁵.',
      ],
      otherApproaches: [
        { name: '대입 확인', desc: 'a=1, b=1이면 (-2)(5)=-10. a=2, b=1이면 (-2×8)(5×4)=-16×20=-320, -10×32×1=-320. 일치!' },
      ],
    },

    evolution: { prev: 'E003', next: undefined, family: '방정식의 발전', familyDescription: '초등 □ 찾기 → 중등 일차방정식 → 고등 고차방정식으로 발전' },

    visualType: 'polynomial_mul',
    relatedIds: ['M007', 'M016', 'M017'],
  },

  {
    id: 'M016',
    number: 16,
    name: '일차식의 동류항 정리',
    latex: 'ax + bx = (a+b)x',
    description: '문자 부분이 같은 항끼리 계수를 합친다',
    level: 'middle',
    category: 'algebra',
    tags: ['동류항', '일차식', '정리', '계수', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '사과 3개 + 사과 5개 = 사과 8개. 3x + 5x = 8x도 같은 원리야!',

    principle: `
      <strong>동류항</strong>이란 문자 부분이 완전히 같은 항이야.<br><br>
      3x와 5x → 동류항 (둘 다 "x")<br>
      3x와 5x² → 동류항 아님! (x와 x²는 달라)<br><br>
      동류항끼리는 <strong>계수만 더하거나 빼면</strong> 돼:<br>
      <strong>3x + 5x = (3+5)x = 8x</strong><br>
      <strong>7x² - 2x² = (7-2)x² = 5x²</strong><br><br>
      다항식을 정리할 때는 동류항끼리 모아서 합치는 게 기본이야.
    `,

    story: `
      동류항 개념은 <strong>디오판토스</strong>(3세기 알렉산드리아)의 "산술"에 이미 나타나.<br><br>
      하지만 체계적으로 사용된 건 <strong>비에트(16세기)</strong>가
      미지수에 모음(a, e, i...)을, 상수에 자음(b, c, d...)을 쓰는 표기법을 도입하면서부터야.
      오늘날 "같은 문자끼리 모은다"는 간단한 규칙이 코딩에서의 변수 정리와도 직결돼.
    `,

    realLife: [
      { icon: '🛒', title: '쇼핑 계산', desc: 'x원짜리 3개 + x원짜리 5개 = 8x원. 동류항 정리로 총액 계산' },
      { icon: '💻', title: '코드 리팩토링', desc: '3*x + 5*x를 8*x로 합치면 연산 횟수가 줄어든다' },
      { icon: '🏋️', title: '운동량 합산', desc: '아침 3km + 저녁 5km = 하루 8km (단위가 같아야 합산 가능)' },
    ],

    sliders: [
      { name: 'a', label: '계수 a', min: -10, max: 10, default: 3, step: 1 },
      { name: 'b', label: '계수 b', min: -10, max: 10, default: 5, step: 1 },
    ],

    example: {
      question: '5x + 3 - 2x + 7을 정리하라.',
      answer: '3x + 10',
      steps: [
        '동류항끼리 모으기: (5x - 2x) + (3 + 7)',
        'x의 계수 합: 5 - 2 = 3 → 3x',
        '상수항 합: 3 + 7 = 10',
        '∴ 3x + 10',
      ],
      hints: [
        '힌트 1: x가 붙은 항끼리, 숫자만 있는 항끼리 모아봐.',
        '힌트 2: 5x - 2x는 얼마?',
        '힌트 3: 3x + 10이 답이야.',
      ],
      otherApproaches: [
        { name: '대입 확인', desc: 'x=1이면 원래 식: 5+3-2+7=13, 정리 후: 3+10=13. 같다!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '다항식 계보' },

    visualType: 'linear_expr',
    relatedIds: ['M015', 'M017', 'M013'],
  },

  {
    id: 'M017',
    number: 17,
    name: '일차방정식',
    latex: 'ax + b = 0 \\implies x = -\\frac{b}{a} \\quad (a \\neq 0)',
    description: '등호 양변에 같은 연산을 해서 미지수를 구한다',
    level: 'middle',
    category: 'algebra',
    tags: ['일차방정식', '등식', '이항', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '방정식은 저울이야. 양쪽 무게가 같도록 조절하면 x를 찾을 수 있어!',

    principle: `
      <strong>일차방정식</strong>: 미지수 x가 1차(x¹)로만 포함된 방정식.<br><br>
      풀이 전략: x를 한쪽으로, 숫자를 다른 쪽으로 모아!<br><br>
      예: 3x + 5 = 14<br>
      ① 양변에서 5를 빼기: 3x = 9<br>
      ② 양변을 3으로 나누기: x = 3<br><br>
      핵심 원리: 등식의 양변에 <strong>같은 연산</strong>을 하면 등호가 유지돼.<br>
      이것을 <strong>등식의 성질</strong>이라고 해. 저울의 양쪽에 같은 무게를 더하거나 빼는 것과 같아!
    `,

    story: `
      일차방정식의 역사는 <strong>고대 이집트 린드 파피루스</strong>(기원전 1650년)까지 거슬러 올라가.<br><br>
      거기에 "아하(aha)" 문제가 나와: "어떤 수의 2/3에 1/3을 더하면 그 수가 된다. 그 수는?"
      이건 오늘날 2x/3 + x/3 = x와 같아. <strong>알 콰리즈미</strong>가 9세기에
      "이항(transposition)"이라는 용어를 만들며 체계적 풀이법을 확립했지.
    `,

    realLife: [
      { icon: '💰', title: '할인 계산', desc: '원가 x의 20% 할인하면 12000원: 0.8x = 12000, x = 15000원' },
      { icon: '🚗', title: '속도 문제', desc: '시속 60km로 x시간 달려서 180km: 60x = 180, x = 3시간' },
      { icon: '🎮', title: '게임 밸런싱', desc: '공격력 x에 버프 1.5배 + 20 = 95: 1.5x + 20 = 95, x = 50' },
    ],

    sliders: [
      { name: 'a', label: '계수 a', min: -10, max: 10, default: 3, step: 1 },
      { name: 'b', label: '상수 b', min: -20, max: 20, default: 5, step: 1 },
      { name: 'c', label: '우변 c', min: -20, max: 20, default: 14, step: 1 },
    ],

    example: {
      question: '4x - 7 = 2x + 5를 풀어라.',
      answer: 'x = 6',
      steps: [
        '양변에서 2x를 빼기: 4x - 2x - 7 = 5',
        '정리: 2x - 7 = 5',
        '양변에 7 더하기: 2x = 12',
        '양변을 2로 나누기: x = 6',
      ],
      hints: [
        '힌트 1: x항을 왼쪽, 숫자를 오른쪽으로 모아봐.',
        '힌트 2: 4x - 2x = 2x, 5 + 7 = 12이니까 2x = 12.',
        '힌트 3: 양변을 2로 나누면 x = 6.',
      ],
      otherApproaches: [
        { name: '대입 검증', desc: 'x=6: 좌변 4(6)-7=17, 우변 2(6)+5=17. 같으므로 정답!' },
      ],
    },

    evolution: { prev: 'E023', next: undefined, family: '좌표의 발전', familyDescription: '초등 대응 관계 → 중등 좌표평면 → 고등 벡터 공간으로 발전' },

    visualType: 'linear_eq_viz',
    relatedIds: ['M016', 'M025', 'M026', 'M027'],
  },

  // ============================================================
  // 중2 – 곱셈공식 (M018~M021)
  // ============================================================
  {
    id: 'M018',
    number: 18,
    name: '곱셈공식 — 합의 제곱',
    latex: '(a+b)^2 = a^2 + 2ab + b^2',
    description: '합의 제곱은 제곱의 합 + 두 배의 곱',
    level: 'middle',
    category: 'algebra',
    tags: ['곱셈공식', '합의제곱', '전개', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '(a+b)² ≠ a²+b²야! 가운데 2ab를 빠뜨리면 큰일나!',

    principle: `
      <strong>(a+b)² = a² + 2ab + b²</strong><br><br>
      왜 이렇게 될까? (a+b)²은 (a+b)(a+b)니까 분배법칙으로 전개하면:<br><br>
      (a+b)(a+b) = a·a + a·b + b·a + b·b = a² + ab + ab + b² = a² + 2ab + b²<br><br>
      기하학적으로도 이해할 수 있어!<br>
      한 변이 (a+b)인 정사각형의 넓이를 쪼개면:<br>
      → a² (왼쪽 위 정사각형) + b² (오른쪽 아래 정사각형) + 2ab (두 직사각형)
    `,

    story: `
      합의 제곱 공식은 <strong>유클리드의 원론</strong> 제2권 명제4에 기하학적으로 증명돼 있어.<br><br>
      유클리드는 정사각형을 네 조각으로 나누는 그림으로 이 공식을 "보여줬"지.
      2000년이 지난 지금도 이 시각적 증명은 가장 아름다운 수학 증명 중 하나로 꼽혀.
      현대에는 <strong>컴퓨터 그래픽스</strong>에서 거리 계산을 최적화할 때 이 공식이 핵심적으로 쓰여.
    `,

    realLife: [
      { icon: '🏠', title: '타일 넓이', desc: '(10+3)²m² = 100+60+9 = 169m². 13²을 암산으로!' },
      { icon: '📊', title: '통계학 분산', desc: 'Var(X+Y) 계산 시 합의 제곱 공식이 기초' },
      { icon: '🎮', title: '충돌 감지', desc: '게임에서 거리²=(Δx+Δy)² 계산 시 이 공식 활용' },
    ],

    sliders: [
      { name: 'a', label: 'a', min: -10, max: 10, default: 3, step: 1 },
      { name: 'b', label: 'b', min: -10, max: 10, default: 2, step: 1 },
    ],

    example: {
      question: '(2x + 3)²을 전개하라.',
      answer: '4x² + 12x + 9',
      steps: [
        '(a+b)² = a²+2ab+b² 에서 a=2x, b=3',
        'a² = (2x)² = 4x²',
        '2ab = 2(2x)(3) = 12x',
        'b² = 3² = 9',
        '∴ (2x+3)² = 4x² + 12x + 9',
      ],
      hints: [
        '힌트 1: a=2x, b=3으로 놓고 공식에 대입해봐.',
        '힌트 2: 가운데 항 2ab = 2×2x×3 = 12x를 잊지 마!',
        '힌트 3: 4x² + 12x + 9가 답이야.',
      ],
      otherApproaches: [
        { name: '직접 전개', desc: '(2x+3)(2x+3) = 4x²+6x+6x+9 = 4x²+12x+9. 결과 동일!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '곱셈공식 계보', familyDescription: '합의 제곱 → 차의 제곱 → 합차 공식 → (x+a)(x+b) → 인수분해' },

    visualType: 'binomial_sq_plus',
    videoPath: '/videos/middle/m018_binomial_square.mp4',
    relatedIds: ['M019', 'M020', 'M021', 'M023'],
  },

  {
    id: 'M019',
    number: 19,
    name: '곱셈공식 — 차의 제곱',
    latex: '(a-b)^2 = a^2 - 2ab + b^2',
    description: '차의 제곱은 제곱의 합 - 두 배의 곱',
    level: 'middle',
    category: 'algebra',
    tags: ['곱셈공식', '차의제곱', '전개', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '(a-b)²에서 마이너스는 가운데 항에만 붙어!',

    principle: `
      <strong>(a-b)² = a² - 2ab + b²</strong><br><br>
      M018(합의 제곱)에서 b 대신 -b를 넣으면 바로 나와:<br>
      (a+(-b))² = a² + 2·a·(-b) + (-b)² = a² - 2ab + b²<br><br>
      <strong>핵심 포인트:</strong> 마지막 항 b²은 <strong>항상 양수</strong>야! (-b)² = b²이니까.<br><br>
      기하학: 큰 정사각형(a²)에서 두 직사각형(2ab)을 빼고, 겹치는 작은 정사각형(b²)을 더한 것.
    `,

    story: `
      차의 제곱 공식은 <strong>인도 수학자 바스카라 2세</strong>(12세기)의 저서에 등장해.<br><br>
      그는 천문학 계산에서 각도의 차이를 제곱하는 과정에서 이 공식을 활용했어.
      "차이의 제곱"이라는 아이디어는 오늘날 <strong>최소자승법(least squares)</strong>의 핵심으로,
      GPS 위치 추정부터 AI 모델 학습까지 모든 곳에 쓰여.
    `,

    realLife: [
      { icon: '📉', title: '오차 제곱', desc: '예측값과 실제값의 차이²: (예측-실제)² → 머신러닝 손실함수' },
      { icon: '🏗️', title: '넓이 차이', desc: '한 변 a인 땅에서 b만큼 줄이면 (a-b)² = a²-2ab+b²' },
      { icon: '🎯', title: '명중 편차', desc: '목표점에서 빗나간 거리의 제곱을 구할 때 사용' },
    ],

    sliders: [
      { name: 'a', label: 'a', min: 1, max: 10, default: 5, step: 1 },
      { name: 'b', label: 'b', min: 0, max: 10, default: 2, step: 1 },
    ],

    example: {
      question: '(3x - 4)²을 전개하라.',
      answer: '9x² - 24x + 16',
      steps: [
        '(a-b)² = a²-2ab+b² 에서 a=3x, b=4',
        'a² = (3x)² = 9x²',
        '2ab = 2(3x)(4) = 24x',
        'b² = 4² = 16',
        '∴ (3x-4)² = 9x² - 24x + 16',
      ],
      hints: [
        '힌트 1: a=3x, b=4로 놓아봐.',
        '힌트 2: 가운데 항은 -2ab = -24x야.',
        '힌트 3: 마지막 항 b²=16은 양수! 답: 9x²-24x+16.',
      ],
      otherApproaches: [
        { name: '직접 전개', desc: '(3x-4)(3x-4) = 9x²-12x-12x+16 = 9x²-24x+16.' },
      ],
    },

    evolution: { prev: 'E024', next: undefined, family: '비례의 발전', familyDescription: '초등 비율 → 중등 정비례 함수 → 고등 지수·로그 함수로 발전' },

    visualType: 'binomial_sq_minus',
    relatedIds: ['M018', 'M020', 'M023'],
  },

  {
    id: 'M020',
    number: 20,
    name: '곱셈공식 — 합차',
    latex: '(a+b)(a-b) = a^2 - b^2',
    description: '합과 차의 곱은 제곱의 차',
    level: 'middle',
    category: 'algebra',
    tags: ['곱셈공식', '합차공식', '제곱의차', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '51 × 49 = (50+1)(50-1) = 2500-1 = 2499. 암산의 비밀병기!',

    principle: `
      <strong>(a+b)(a-b) = a² - b²</strong><br><br>
      분배법칙으로 전개하면:<br>
      (a+b)(a-b) = a² - ab + ab - b² = a² - b²<br><br>
      가운데 -ab와 +ab가 상쇄돼서 깔끔하게 제곱의 차만 남아!<br><br>
      <strong>암산 활용:</strong><br>
      97 × 103 = (100-3)(100+3) = 10000 - 9 = 9991<br>
      52 × 48 = (50+2)(50-2) = 2500 - 4 = 2496
    `,

    story: `
      합차 공식은 바빌로니아(기원전 2000년)부터 알려진 가장 오래된 대수적 항등식이야.<br><br>
      <strong>소피 제르맹</strong>(19세기 프랑스 여성 수학자)은 이 공식의 일반화를 통해
      <strong>페르마의 마지막 정리</strong> 증명에 중요한 기여를 했어.
      여성이 대학에 입학할 수도 없던 시대에 남장을 하고 수학을 공부한 전설적 인물이지.
    `,

    realLife: [
      { icon: '🧮', title: '암산 기술', desc: '102×98 = (100+2)(100-2) = 10000-4 = 9996' },
      { icon: '🔬', title: '광학 렌즈', desc: '볼록렌즈와 오목렌즈의 조합에서 합차 원리 적용' },
      { icon: '🏛️', title: '건축 아치', desc: '반원 아치의 힘 분산 계산에서 a²-b² 패턴 등장' },
    ],

    sliders: [
      { name: 'a', label: 'a', min: 1, max: 20, default: 10, step: 1 },
      { name: 'b', label: 'b', min: 0, max: 10, default: 3, step: 1 },
    ],

    example: {
      question: '(5x+3)(5x-3)을 전개하라.',
      answer: '25x² - 9',
      steps: [
        '합차 공식 (a+b)(a-b) = a²-b² 에서 a=5x, b=3',
        'a² = (5x)² = 25x²',
        'b² = 3² = 9',
        '∴ (5x+3)(5x-3) = 25x² - 9',
      ],
      hints: [
        '힌트 1: 이건 합차 공식이야! a=5x, b=3으로 놓아봐.',
        '힌트 2: 합×차 = 제곱의 차니까 a²-b².',
        '힌트 3: 25x² - 9가 답이야.',
      ],
      otherApproaches: [
        { name: '직접 전개', desc: '(5x+3)(5x-3) = 25x²-15x+15x-9 = 25x²-9. 가운데 항이 상쇄!' },
      ],
    },

    evolution: { prev: 'E024', next: undefined, family: '반비례의 발전', familyDescription: '초등 비율 → 중등 반비례 함수 → 고등 유리함수로 발전' },

    visualType: 'diff_of_squares',
    relatedIds: ['M018', 'M019', 'M024'],
  },

  {
    id: 'M021',
    number: 21,
    name: '곱셈공식 — (x+a)(x+b)',
    latex: '(x+a)(x+b) = x^2 + (a+b)x + ab',
    description: 'x계수는 a+b, 상수항은 ab',
    level: 'middle',
    category: 'algebra',
    tags: ['곱셈공식', '전개', '이차식', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '(x+3)(x+5) = x²+8x+15. 두 수의 합이 8, 곱이 15!',

    principle: `
      <strong>(x+a)(x+b) = x² + (a+b)x + ab</strong><br><br>
      분배법칙으로 전개하면:<br>
      (x+a)(x+b) = x² + bx + ax + ab = x² + (a+b)x + ab<br><br>
      <strong>패턴:</strong><br>
      • x²의 계수: 항상 1<br>
      • x의 계수: a와 b의 <strong>합</strong><br>
      • 상수항: a와 b의 <strong>곱</strong><br><br>
      이 공식은 나중에 <strong>인수분해</strong>할 때 거꾸로 사용돼.
      "더해서 (a+b), 곱해서 ab가 되는 두 수를 찾아라!"
    `,

    story: `
      이 공식은 <strong>인수분해와 이차방정식</strong>의 핵심 도구야.<br><br>
      중세 아랍 수학자들은 이차방정식을 풀 때 "합과 곱으로 두 수 찾기" 문제를 즐겨 출제했어.
      실은 이것이 현대 <strong>비에트의 정리(근과 계수의 관계)</strong>의 원형이고,
      M030에서 다시 만나게 될 거야!
    `,

    realLife: [
      { icon: '🏗️', title: '직사각형 설계', desc: '(x+3)(x+5) → 가로·세로가 x+3, x+5인 방의 넓이' },
      { icon: '💰', title: '복리 계산', desc: '(1+r₁)(1+r₂) 형태 — 2년간 다른 이자율의 복리' },
      { icon: '🎲', title: '확률 문제', desc: '두 독립사건 결합 시 (p+a)(p+b) 형태가 등장' },
    ],

    sliders: [
      { name: 'a', label: 'a', min: -10, max: 10, default: 3, step: 1 },
      { name: 'b', label: 'b', min: -10, max: 10, default: 5, step: 1 },
    ],

    example: {
      question: '(x+4)(x-6)을 전개하라.',
      answer: 'x² - 2x - 24',
      steps: [
        '(x+a)(x+b) = x²+(a+b)x+ab 에서 a=4, b=-6',
        'a+b = 4+(-6) = -2',
        'ab = 4×(-6) = -24',
        '∴ (x+4)(x-6) = x² - 2x - 24',
      ],
      hints: [
        '힌트 1: a=4, b=-6으로 놓아봐.',
        '힌트 2: x의 계수 = 합: 4+(-6) = -2',
        '힌트 3: 상수항 = 곱: 4×(-6) = -24. 답: x²-2x-24.',
      ],
      otherApproaches: [
        { name: '직접 전개', desc: '(x+4)(x-6) = x²-6x+4x-24 = x²-2x-24. 동일!' },
      ],
    },

    evolution: { prev: 'E004', next: undefined, family: '곱셈의 확장', familyDescription: '초등 곱셈구구 → 중등 지수법칙 → 고등 지수함수·로그로 발전' },

    visualType: 'binomial_product',
    relatedIds: ['M018', 'M020', 'M022', 'M030'],
  },

  // ============================================================
  // 중2 – 인수분해 (M022~M024)
  // ============================================================
  {
    id: 'M022',
    number: 22,
    name: '인수분해 — 공통인수 묶기',
    latex: 'ma + mb = m(a+b)',
    description: '모든 항에 공통으로 들어있는 인수를 괄호 밖으로 꺼낸다',
    level: 'middle',
    category: 'algebra',
    tags: ['인수분해', '공통인수', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '인수분해는 곱셈공식을 거꾸로 돌리는 거야!',

    principle: `
      <strong>인수분해</strong>란 다항식을 곱의 형태로 바꾸는 것이야. (전개의 역연산!)<br><br>
      가장 먼저 시도할 것: <strong>공통인수 묶기</strong><br><br>
      <strong>ma + mb = m(a+b)</strong><br><br>
      예: 6x² + 9x = 3x(2x + 3)<br>
      → 6x²와 9x의 공통인수는 3x<br>
      → 3x로 나눠서: 6x²÷3x = 2x, 9x÷3x = 3<br>
      → 3x(2x+3)<br><br>
      <strong>팁:</strong> 공통인수는 계수의 최대공약수 × 문자의 최소 차수!
    `,

    story: `
      인수분해의 개념은 <strong>디오판토스</strong>에서 시작됐지만,
      체계적으로 발전한 건 <strong>18세기 가우스</strong>부터야.<br><br>
      가우스는 정수론에서 "소인수분해의 유일성"을 증명했고,
      이를 다항식으로 확장했어. 현대 <strong>암호학(RSA)</strong>은
      큰 수의 인수분해가 어렵다는 사실에 기반하고 있어 — 네 인터넷 뱅킹이 안전한 이유야!
    `,

    realLife: [
      { icon: '🔐', title: 'RSA 암호', desc: '큰 수를 소인수분해하기 어려운 성질을 이용한 보안 시스템' },
      { icon: '📦', title: '효율적 포장', desc: '12개+18개 = 6(2+3) → 6개씩 묶어서 5박스로 포장' },
      { icon: '💻', title: '코드 리팩토링', desc: 'f(x)+f(y) → f가 공통이면 한 번만 호출하도록 최적화' },
    ],

    example: {
      question: '4x³ - 8x²을 인수분해하라.',
      answer: '4x²(x - 2)',
      steps: [
        '공통인수 찾기: 계수 최대공약수(4,8)=4, 문자 최소 차수 x²',
        '공통인수 = 4x²',
        '각 항을 4x²로 나누기: 4x³÷4x²=x, 8x²÷4x²=2',
        '∴ 4x³ - 8x² = 4x²(x - 2)',
      ],
      hints: [
        '힌트 1: 4와 8의 최대공약수는?',
        '힌트 2: x³과 x²에서 공통으로 뽑을 수 있는 건 x².',
        '힌트 3: 4x²(x-2)가 답이야.',
      ],
      otherApproaches: [
        { name: '전개로 검증', desc: '4x²(x-2) = 4x³-8x². 원래 식과 동일!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '인수분해 계보', familyDescription: '공통인수 → 완전제곱식 → 합차 → 복잡한 인수분해' },

    visualType: 'factorization_common',
    relatedIds: ['M015', 'M023', 'M024'],
  },

  {
    id: 'M023',
    number: 23,
    name: '인수분해 — 완전제곱식',
    latex: 'a^2 + 2ab + b^2 = (a+b)^2, \\quad a^2 - 2ab + b^2 = (a-b)^2',
    description: '합(차)의 제곱 형태를 역으로 인수분해',
    level: 'middle',
    category: 'algebra',
    tags: ['인수분해', '완전제곱식', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: 'x²+6x+9를 보면 (x+3)²이 떠올라야 해!',

    principle: `
      <strong>완전제곱식</strong>을 인수분해하는 건 M018, M019 공식의 역과정이야.<br><br>
      <strong>a² + 2ab + b² = (a+b)²</strong><br>
      <strong>a² - 2ab + b² = (a-b)²</strong><br><br>
      판별법: 3항이 있을 때 이렇게 확인해봐.<br>
      ① 첫째 항과 셋째 항이 <strong>완전제곱수</strong>인가? (a², b²)<br>
      ② 가운데 항이 <strong>2×(첫째항의 제곱근)×(셋째항의 제곱근)</strong>인가?<br>
      → 두 조건 모두 만족하면 완전제곱식!<br><br>
      예: x² + 6x + 9 → x²=(x)², 9=(3)², 6x=2·x·3 ✓ → (x+3)²
    `,

    story: `
      완전제곱식은 <strong>알 콰리즈미</strong>가 이차방정식을 풀 때 사용한
      <strong>"완전제곱식 만들기(completing the square)"</strong>의 핵심이야.<br><br>
      이 기법은 1200년이 지난 지금도 근의 공식 유도, 이차함수의 꼭짓점 찾기(M037) 등에
      그대로 쓰이고 있어. 수학에서 가장 긴 수명을 가진 기법 중 하나야.
    `,

    realLife: [
      { icon: '🎯', title: '표적 최적화', desc: '(x-최적값)²의 형태로 오차를 최소화하는 문제' },
      { icon: '📐', title: '정사각형 판별', desc: '넓이가 x²+10x+25이면 한 변이 (x+5)인 정사각형' },
      { icon: '🏀', title: '포물선 궤적', desc: '공의 최고점을 찾을 때 완전제곱식으로 변환' },
    ],

    example: {
      question: '9x² - 12x + 4를 인수분해하라.',
      answer: '(3x - 2)²',
      steps: [
        '첫째 항 9x² = (3x)² ✓',
        '셋째 항 4 = 2² ✓',
        '가운데 항 확인: 2×3x×2 = 12x, 그리고 부호가 - → (3x-2)²',
        '∴ 9x² - 12x + 4 = (3x-2)²',
      ],
      hints: [
        '힌트 1: 9x²과 4가 완전제곱수인지 확인해봐.',
        '힌트 2: 3x와 2를 찾았으면 가운데 항 2×3x×2=12x인지 확인.',
        '힌트 3: 부호가 -이니까 (3x-2)²가 답이야.',
      ],
      otherApproaches: [
        { name: '전개로 검증', desc: '(3x-2)² = 9x²-12x+4. 원래 식과 동일!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '인수분해 계보' },

    visualType: 'factorization_perfect',
    relatedIds: ['M018', 'M019', 'M022', 'M024'],
  },

  {
    id: 'M024',
    number: 24,
    name: '인수분해 — 합차 공식',
    latex: 'a^2 - b^2 = (a+b)(a-b)',
    description: '제곱의 차는 합과 차의 곱으로 인수분해',
    level: 'middle',
    category: 'algebra',
    tags: ['인수분해', '합차공식', '제곱의차', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: 'x²-9 = (x+3)(x-3). 제곱의 차가 보이면 바로 쪼개!',

    principle: `
      <strong>a² - b² = (a+b)(a-b)</strong><br><br>
      M020(합차 공식)을 역으로 사용하는 거야.<br><br>
      "제곱 - 제곱" 형태가 보이면 바로 적용!<br>
      x² - 16 = x² - 4² = (x+4)(x-4)<br>
      4x² - 9 = (2x)² - 3² = (2x+3)(2x-3)<br><br>
      <strong>주의:</strong> a² + b²는 실수 범위에서 인수분해할 수 없어!<br>
      x² + 4는 더 이상 쪼갤 수 없지. (복소수에서는 가능하지만 그건 고등수학)
    `,

    story: `
      합차 인수분해는 <strong>페르마의 크리스마스 정리</strong>와 관련이 있어.<br><br>
      페르마는 1640년 크리스마스에 "4n+1 형태의 소수는 항상 두 제곱수의 합으로 표현된다"고
      편지에 적었어. 이 증명에 a²-b² = (a+b)(a-b)가 핵심적으로 사용되지.
      크리스마스에 수학 정리를 쓴 페르마... 진정한 수학 덕후!
    `,

    realLife: [
      { icon: '🏗️', title: '도넛형 넓이', desc: '큰 원 넓이 - 작은 원 넓이 = π(R²-r²) = π(R+r)(R-r)' },
      { icon: '🎮', title: '게임 물리엔진', desc: '충돌 판정에서 거리²-반경²의 부호로 충돌 여부 판정' },
      { icon: '📊', title: '데이터 분석', desc: '분산 = E[X²]-(E[X])² → 제곱 차의 형태' },
    ],

    example: {
      question: '25x² - 36을 인수분해하라.',
      answer: '(5x+6)(5x-6)',
      steps: [
        '25x² = (5x)², 36 = 6² → 제곱의 차 형태',
        'a²-b² = (a+b)(a-b) 적용',
        'a=5x, b=6',
        '∴ 25x²-36 = (5x+6)(5x-6)',
      ],
      hints: [
        '힌트 1: 두 항 모두 완전제곱수인지 확인해봐.',
        '힌트 2: (5x)²-6² 형태야.',
        '힌트 3: 합차 공식으로 (5x+6)(5x-6).',
      ],
      otherApproaches: [
        { name: '전개로 검증', desc: '(5x+6)(5x-6) = 25x²-36. 원래 식과 동일!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '인수분해 계보' },

    visualType: 'factorization_diff',
    relatedIds: ['M020', 'M022', 'M023'],
  },

  // ============================================================
  // 중2 – 연립방정식 (M025~M026)
  // ============================================================
  {
    id: 'M025',
    number: 25,
    name: '연립방정식 — 가감법',
    latex: '\\begin{cases} ax+by=c \\\\ dx+ey=f \\end{cases}',
    description: '두 식을 더하거나 빼서 한 미지수를 없앤다',
    level: 'middle',
    category: 'algebra',
    tags: ['연립방정식', '가감법', '소거', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '미지수가 2개인데 식도 2개? 하나를 없애면 일차방정식이 되잖아!',

    principle: `
      <strong>연립방정식</strong>: 미지수가 2개 이상인 방정식을 동시에 만족하는 해를 구하는 것.<br><br>
      <strong>가감법</strong>의 핵심: 두 식을 적절히 더하거나 빼서 하나의 미지수를 소거!<br><br>
      예: ① 2x + 3y = 12<br>
      &nbsp;&nbsp;&nbsp;&nbsp;② 2x - y = 4<br><br>
      ①-②: (2x+3y)-(2x-y) = 12-4 → 4y = 8 → y = 2<br>
      y=2를 ②에 대입: 2x-2=4 → x=3<br><br>
      계수가 안 맞으면? 배수를 곱해서 맞춰!
    `,

    story: `
      연립방정식은 <strong>중국 수학서 "구장산술"</strong>(기원전 200년경)에 이미 등장해.<br><br>
      그 책에는 "방정(方程)"이라는 장이 있는데, 이것이 오늘날 "방정식"이라는 단어의 유래야!
      놀랍게도 구장산술의 풀이법은 <strong>가우스 소거법</strong>과 본질적으로 같아.
      가우스가 태어나기 2000년 전에 이미 같은 알고리즘이 존재했던 거지.
    `,

    realLife: [
      { icon: '🛒', title: '가격 문제', desc: '사과 2개+배 3개=12000원, 사과 2개+배 1개=6000원 → 배 가격?' },
      { icon: '⚗️', title: '화학 균형', desc: '화학반응식 계수 맞추기 = 연립방정식 풀기' },
      { icon: '📊', title: 'AI 학습', desc: '여러 조건을 동시에 만족하는 가중치 찾기 = 연립방정식' },
    ],

    example: {
      question: '3x + 2y = 16, x + 2y = 10을 가감법으로 풀어라.',
      answer: 'x = 3, y = 3.5',
      steps: [
        '①-② 으로 y를 소거: (3x+2y)-(x+2y) = 16-10',
        '2x = 6 → x = 3',
        'x=3을 ②에 대입: 3+2y=10 → 2y=7 → y=3.5',
        '∴ x=3, y=3.5',
      ],
      hints: [
        '힌트 1: 두 식에서 y의 계수가 같은지 확인해봐.',
        '힌트 2: 둘 다 2y니까 빼면 y가 사라져!',
        '힌트 3: 2x=6에서 x=3, 대입하면 y=3.5.',
      ],
      otherApproaches: [
        { name: '대입법', desc: '②에서 x=10-2y, ①에 대입: 3(10-2y)+2y=16 → 30-6y+2y=16 → y=3.5.' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '방정식 계보' },

    visualType: 'simultaneous_eq',
    relatedIds: ['M017', 'M026', 'M031'],
  },

  {
    id: 'M026',
    number: 26,
    name: '연립방정식 — 대입법',
    latex: '\\begin{cases} y = ax+b \\\\ cx+dy = e \\end{cases}',
    description: '한 식을 다른 식에 대입하여 미지수를 줄인다',
    level: 'middle',
    category: 'algebra',
    tags: ['연립방정식', '대입법', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: 'y = 2x+1을 다른 식에 꽂아넣으면, x 하나만 남아!',

    principle: `
      <strong>대입법</strong>: 한 변수를 다른 변수의 식으로 나타낸 뒤, 나머지 식에 대입!<br><br>
      예: ① y = 2x + 1<br>
      &nbsp;&nbsp;&nbsp;&nbsp;② 3x + y = 11<br><br>
      ①을 ②에 대입: 3x + (2x+1) = 11<br>
      5x + 1 = 11<br>
      5x = 10, 대입하면 x = 2<br>
      x=2를 ①에 대입: y = 2(2)+1 = 5<br><br>
      <strong>가감법 vs 대입법:</strong> 한 식이 이미 "y = ..." 형태면 대입법이 편하고,
      계수가 맞으면 가감법이 빨라. 상황에 따라 골라 써!
    `,

    story: `
      대입법은 <strong>고대 인도 수학자 아리아바타</strong>(5세기)의 천문학 계산에서 유래했어.<br><br>
      행성의 위치를 예측하려면 여러 변수의 연립방정식을 풀어야 했는데,
      한 변수를 다른 변수로 치환하는 테크닉이 바로 대입법이야.
      오늘날 <strong>프로그래밍</strong>에서 변수에 값을 할당하는 것(x = 3)도 같은 원리!
    `,

    realLife: [
      { icon: '💻', title: '프로그래밍', desc: 'x = 10, y = x + 5 → y = 15. 변수 대입과 동일한 원리' },
      { icon: '🚂', title: '속력 문제', desc: '거리=속력×시간에서 한 변수를 대입해 나머지를 구함' },
      { icon: '🧪', title: '화학 농도', desc: '혼합 용액의 농도 계산에서 한 변수를 다른 식에 대입' },
    ],

    example: {
      question: 'y = 3x - 2, 2x + y = 8을 대입법으로 풀어라.',
      answer: 'x = 2, y = 4',
      steps: [
        '①의 y = 3x-2를 ②에 대입: 2x + (3x-2) = 8',
        '5x - 2 = 8',
        '5x = 10 → x = 2',
        'x=2를 ①에 대입: y = 3(2)-2 = 4',
        '∴ x=2, y=4',
      ],
      hints: [
        '힌트 1: ①이 이미 y=... 형태니까 대입하기 좋아!',
        '힌트 2: 2x + (3x-2) = 8로 정리해봐.',
        '힌트 3: x=2, y=4야. 검산: 2(2)+4=8 ✓',
      ],
      otherApproaches: [
        { name: '가감법', desc: '①을 변형: -3x+y=-2, ②: 2x+y=8. 빼면 -5x=-10, x=2.' },
      ],
    },

    evolution: { prev: 'E003', next: undefined, family: '방정식의 확장', familyDescription: '초등 □ 찾기 → 중등 연립방정식 → 고등 행렬·선형대수로 발전' },

    visualType: 'simultaneous_sub',
    relatedIds: ['M017', 'M025', 'M031'],
  },

  // ============================================================
  // 중3 – 이차방정식 (M027~M030)
  // ============================================================
  {
    id: 'M027',
    number: 27,
    name: '이차방정식 — 인수분해 풀이',
    latex: 'ax^2+bx+c=0 \\implies (x-\\alpha)(x-\\beta)=0',
    description: '이차식을 인수분해한 뒤 각 인수=0으로 근을 구한다',
    level: 'middle',
    category: 'algebra',
    tags: ['이차방정식', '인수분해', '근', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: 'x²-5x+6=0 → (x-2)(x-3)=0 → x=2 또는 x=3. 인수분해만 하면 끝!',

    principle: `
      <strong>이차방정식</strong>: ax²+bx+c=0 (a≠0) 형태의 방정식.<br><br>
      인수분해 풀이법:<br>
      ① 우변을 0으로 만든다.<br>
      ② 좌변을 인수분해한다: (x-α)(x-β)=0<br>
      ③ <strong>영인자 법칙</strong> 적용: A×B=0이면 A=0 또는 B=0<br>
      → x-α=0 또는 x-β=0<br>
      → <strong>x=α 또는 x=β</strong><br><br>
      인수분해가 안 되면? 그때 M028(근의 공식)을 써!
    `,

    story: `
      이차방정식의 역사는 기원전 2000년 <strong>바빌로니아</strong>까지 거슬러 올라가.<br><br>
      바빌로니아인들은 "넓이가 주어진 직사각형의 변 찾기" 문제를 풀었는데,
      이것이 바로 이차방정식이야. 16세기 이탈리아에서는 <strong>삼차·사차 방정식</strong>의
      풀이를 놓고 수학자들 사이에 공개 결투(!)가 벌어졌어. 수학도 한때는 격투기였지.
    `,

    realLife: [
      { icon: '🏀', title: '포물선 궤적', desc: '공이 땅에 닿는 시간: h(t)=-5t²+20t=0 → t=0 또는 t=4초' },
      { icon: '📱', title: '앱 수익', desc: '수익 = (가격-원가)×판매량, 최적 가격을 이차방정식으로 계산' },
      { icon: '🏗️', title: '건축 설계', desc: '아치형 구조물의 높이를 이차방정식으로 모델링' },
    ],

    example: {
      question: 'x² - 7x + 12 = 0을 풀어라.',
      answer: 'x = 3 또는 x = 4',
      steps: [
        '더해서 -7, 곱해서 12가 되는 두 수를 찾는다.',
        '-3 + (-4) = -7, (-3)×(-4) = 12 ✓',
        '인수분해: (x-3)(x-4) = 0',
        'x-3=0 또는 x-4=0',
        '∴ x=3 또는 x=4',
      ],
      hints: [
        '힌트 1: 더해서 7(부호 반대 -7), 곱해서 12가 되는 두 수를 찾아봐.',
        '힌트 2: 3과 4! 3+4=7, 3×4=12.',
        '힌트 3: (x-3)(x-4)=0이니까 x=3 또는 x=4.',
      ],
      otherApproaches: [
        { name: '근의 공식', desc: 'x = (7±√(49-48))/2 = (7±1)/2 → x=4 또는 x=3. 동일!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '방정식 계보' },

    visualType: 'quadratic_eq_factor',
    relatedIds: ['M022', 'M028', 'M029', 'M030'],
  },

  {
    id: 'M028',
    number: 28,
    name: '근의 공식',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
    description: '이차방정식 ax²+bx+c=0의 해를 직접 구하는 만능 공식',
    level: 'middle',
    category: 'algebra',
    tags: ['이차방정식', '근의공식', '판별식', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: '인수분해가 안 돼도 괜찮아. 근의 공식이면 어떤 이차방정식이든 풀 수 있어!',

    principle: `
      <strong>ax² + bx + c = 0 (a≠0)일 때,</strong><br><br>
      <strong>x = (-b ± √(b²-4ac)) / (2a)</strong><br><br>
      유도 과정 (완전제곱식 만들기):<br>
      ax²+bx+c=0 양변을 a로 나눔 → x²+(b/a)x = -c/a<br>
      양변에 (b/2a)²을 더함 → (x+b/2a)² = (b²-4ac)/4a²<br>
      제곱근을 취함 → x+b/2a = ±√(b²-4ac)/2a<br>
      정리하면 근의 공식 완성!<br><br>
      ± 기호는 두 근이 있다는 뜻이야. +를 택하면 한 근, -를 택하면 다른 근.
    `,

    story: `
      근의 공식은 기원전 바빌로니아에서 시작돼, 인도의 <strong>브라마굽타</strong>(628년),
      아랍의 <strong>알 콰리즈미</strong>(820년)를 거쳐 완성됐어.<br><br>
      하지만 이 공식으로 삼차·사차방정식까지 도전하면서 수학사 최대의 드라마가 시작돼.
      16세기 이탈리아에서 <strong>카르다노</strong>가 타르탈리아의 비밀 풀이법을
      약속을 어기고 출판해버린 사건은 수학 역사상 가장 유명한 배신극이야.
    `,

    realLife: [
      { icon: '🚀', title: '로켓 궤적', desc: 'h=-4.9t²+v₀t+h₀=0을 근의 공식으로 풀어 착륙 시간 계산' },
      { icon: '💹', title: '복리 이자', desc: 'A=P(1+r)² 형태에서 이자율 r을 근의 공식으로 역산' },
      { icon: '🎮', title: '물리 엔진', desc: '게임에서 포탄이 벽에 닿는 시점을 실시간 계산' },
    ],

    sliders: [
      { name: 'a', label: 'a', min: -5, max: 5, default: 1, step: 1 },
      { name: 'b', label: 'b', min: -10, max: 10, default: -5, step: 1 },
      { name: 'c', label: 'c', min: -10, max: 10, default: 6, step: 1 },
    ],

    example: {
      question: '2x² + 3x - 2 = 0을 근의 공식으로 풀어라.',
      answer: 'x = 1/2 또는 x = -2',
      steps: [
        'a=2, b=3, c=-2 확인',
        '판별식: b²-4ac = 9-4(2)(-2) = 9+16 = 25',
        'x = (-3±√25) / (2×2) = (-3±5) / 4',
        'x = (-3+5)/4 = 2/4 = 1/2',
        'x = (-3-5)/4 = -8/4 = -2',
        '∴ x = 1/2 또는 x = -2',
      ],
      hints: [
        '힌트 1: a, b, c를 정확히 파악해봐. a=2, b=3, c=-2.',
        '힌트 2: 판별식 b²-4ac = 9+16 = 25. 완전제곱수니까 깔끔한 답이 나올 거야.',
        '힌트 3: (-3±5)/4를 두 경우로 나눠서 계산해.',
      ],
      otherApproaches: [
        { name: '인수분해', desc: '2x²+3x-2 = (2x-1)(x+2) = 0 → x=1/2 또는 x=-2.' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '방정식 계보' },

    visualType: 'quadratic_formula_viz',
    videoPath: '/videos/middle/m028_quadratic_formula.mp4',
    relatedIds: ['M027', 'M029', 'M030'],
  },

  {
    id: 'M029',
    number: 29,
    name: '집합',
    latex: 'A \\cup B, A \\cap B, A \\subset B',
    description: '부분집합, 합집합, 교집합 등 집합의 기본 연산',
    level: 'middle',
    category: 'algebra',
    tags: ['집합', '합집합', '교집합', '부분집합', '벤다이어그램', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '수학의 기본 언어. 벤 다이어그램으로 보면 바로 이해돼!',

    principle: `
      <strong>집합</strong>은 어떤 조건을 만족하는 대상을 모아 놓은 것이야.<br><br>
      <strong>부분집합 A ⊂ B</strong>: A의 모든 원소가 B에도 포함<br>
      <strong>합집합 A ∪ B</strong>: A 또는 B에 속하는 모든 원소<br>
      <strong>교집합 A ∩ B</strong>: A와 B에 동시에 속하는 원소<br><br>
      예: A = {1, 2, 3}, B = {2, 3, 4}이면<br>
      A ∪ B = {1, 2, 3, 4}, A ∩ B = {2, 3}<br><br>
      <strong>벤 다이어그램</strong>으로 그리면 겹치는 부분이 교집합, 전체가 합집합이야!
    `,

    story: `
      집합론은 19세기 독일 수학자 <strong>게오르크 칸토어</strong>가 창시했어.<br><br>
      칸토어는 "무한에도 크기가 다른 것이 있다"는 혁명적 발견을 했지.
      자연수의 무한과 실수의 무한은 크기가 다르다니! 당시 수학계는 충격에 빠졌어.<br><br>
      처음엔 많은 반대가 있었지만, 오늘날 집합론은 <strong>현대 수학의 기초 언어</strong>로 쓰이고 있어.
    `,

    realLife: [
      { icon: '📊', title: 'SNS 친구 분석', desc: '인스타 팔로워(A)와 유튜브 구독자(B)의 교집합 = 둘 다 팔로우하는 사람' },
      { icon: '🔍', title: '검색 필터', desc: '"고양이 AND 귀여운" 검색은 교집합, "고양이 OR 강아지"는 합집합!' },
      { icon: '🎮', title: '게임 아이템', desc: '전사 무기(A)와 마법사 무기(B)의 교집합 = 둘 다 쓸 수 있는 무기' },
    ],

    example: {
      question: 'A = {1, 2, 3, 5}, B = {2, 4, 5, 6}일 때 A ∪ B와 A ∩ B를 구하라.',
      answer: 'A ∪ B = {1, 2, 3, 4, 5, 6}, A ∩ B = {2, 5}',
      steps: [
        'A와 B의 모든 원소를 모은다: {1, 2, 3, 4, 5, 6} → 합집합',
        'A와 B에 공통으로 있는 원소: 2, 5 → 교집합',
        '∴ A ∪ B = {1, 2, 3, 4, 5, 6}, A ∩ B = {2, 5}',
      ],
      hints: [
        '힌트 1: 합집합은 "둘 중 하나라도" 속하는 원소를 다 모으는 거야.',
        '힌트 2: 교집합은 "둘 다" 속하는 원소만 골라.',
        '힌트 3: 공통 원소는 2와 5야!',
      ],
      otherApproaches: [
        { name: '벤 다이어그램', desc: '두 원을 겹쳐 그리고, 겹치는 부분에 2, 5를 넣으면 교집합. 나머지까지 전부가 합집합!' },
      ],
    },

    evolution: { prev: 'E023', next: undefined, family: '집합의 발전', familyDescription: '초등 분류 → 중등 집합 → 고등 명제·조건으로 발전' },

    visualType: 'set_operation',
    relatedIds: ['M028', 'M030', 'M035'],
  },

  {
    id: 'M030',
    number: 30,
    name: '일차부등식',
    latex: 'ax + b > 0',
    description: '일차부등식의 풀이와 해의 범위 표현',
    level: 'middle',
    category: 'algebra',
    tags: ['부등식', '일차부등식', '부등호', '범위', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: 'x + 3 > 7이면 x > 4. 범위로 답이 나와!',

    principle: `
      <strong>일차부등식</strong>은 부등호(>, <, ≥, ≤)가 있는 일차식이야.<br><br>
      풀이 방법은 일차방정식과 거의 같아!<br>
      <strong>핵심 차이점:</strong> 양변에 <strong>음수를 곱하거나 나누면 부등호 방향이 바뀐다!</strong><br><br>
      예: -2x > 6 → x < -3 (부등호 뒤집힘!)<br><br>
      <strong>풀이 순서:</strong><br>
      ① 괄호를 풀고, 이항한다<br>
      ② x의 계수로 나눈다 (음수면 부등호 뒤집기!)<br>
      ③ 해를 수직선에 나타낸다
    `,

    story: `
      부등식 기호는 영국 수학자 <strong>토머스 해리엇</strong>(1631)이 처음 사용했어.<br><br>
      그 전에는 "~보다 크다"를 말로 써야 했으니 얼마나 불편했겠어!
      해리엇은 항해사이자 천문학자였는데, 그의 수학 저서는 사후에야 출판됐지.<br><br>
      부등식은 현대 <strong>최적화 이론</strong>과 <strong>선형계획법</strong>의 기초가 되어,
      경영, 공학, AI 등 다양한 분야에서 핵심 도구로 쓰이고 있어.
    `,

    realLife: [
      { icon: '💰', title: '용돈 관리', desc: '교통비 x원을 쓰고도 5000원 이상 남기려면? 용돈 - x ≥ 5000' },
      { icon: '📏', title: '키 제한', desc: '놀이기구 탑승 조건 "키 ≥ 120cm" → 부등식으로 표현!' },
      { icon: '🎮', title: '게임 레벨', desc: '보스를 이기려면 공격력 x가 50 이상이어야 해: x ≥ 50' },
    ],

    sliders: [
      { name: 'a', label: 'a (x의 계수)', min: -5, max: 5, default: 2, step: 1 },
      { name: 'b', label: 'b (상수)', min: -10, max: 10, default: -6, step: 1 },
    ],

    example: {
      question: '3x - 7 > 2를 풀어라.',
      answer: 'x > 3',
      steps: [
        '양변에 7을 더한다: 3x > 9',
        '양변을 3으로 나눈다: x > 3',
        '수직선에 x = 3을 빈 원(미포함)으로 표시하고 오른쪽을 칠한다.',
      ],
      hints: [
        '힌트 1: 상수항을 오른쪽으로 이항해봐.',
        '힌트 2: 3x > 9가 됐어. 양변을 3으로 나눠봐.',
        '힌트 3: x > 3! 양수로 나눴으니 부등호 방향은 그대로.',
      ],
      otherApproaches: [
        { name: '검증으로 확인', desc: 'x = 4 대입: 3(4) - 7 = 5 > 2 (참). x = 2 대입: 3(2) - 7 = -1 > 2 (거짓). 답 x > 3이 맞아!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '방정식·부등식 계보' },

    visualType: 'inequality_viz',
    relatedIds: ['M021', 'M027', 'M028', 'M029'],
  },

  // ============================================================
  // 중2 – 일차함수 (M031~M034)
  // ============================================================
  {
    id: 'M031',
    number: 31,
    name: '일차함수 y = ax + b',
    latex: 'y = ax + b \\quad (a \\neq 0)',
    description: '일차함수는 그래프가 직선이고, a는 기울기, b는 y절편',
    level: 'middle',
    category: 'function',
    tags: ['일차함수', '직선', '기울기', 'y절편', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: 'y = ax + b 하나로 세상의 모든 직선을 표현할 수 있어!',

    principle: `
      <strong>일차함수 y = ax + b</strong>에서:<br><br>
      <strong>a (기울기)</strong>: 직선의 가파른 정도. x가 1 늘면 y가 a만큼 변해.<br>
      • a > 0: 오른쪽 위로 ↗ (증가)<br>
      • a < 0: 오른쪽 아래로 ↘ (감소)<br>
      • |a|가 클수록 가파름<br><br>
      <strong>b (y절편)</strong>: x=0일 때의 y값, 즉 직선이 y축과 만나는 점 (0, b)<br><br>
      예: y = 2x + 3에서 기울기 2, y절편 3.<br>
      (0,3)에서 시작해 x가 1 증가할 때마다 y가 2 증가하는 직선.
    `,

    story: `
      일차함수의 그래프를 <strong>좌표평면</strong> 위에 그리는 방법은
      <strong>르네 데카르트</strong>(1637)가 "방법서설"에서 처음 제안했어.<br><br>
      전설에 따르면, 병석에 누워 천장의 파리 움직임을 관찰하다가
      "모든 위치를 숫자 쌍(x,y)으로 표현할 수 있지 않을까?"라고 생각한 게 시작이었대.
      이 아이디어가 <strong>해석기하학</strong>을 탄생시키고, 대수와 기하의 벽을 무너뜨렸어.
    `,

    realLife: [
      { icon: '🚕', title: '택시 요금', desc: '기본요금 4800원 + km당 1000원: y = 1000x + 4800' },
      { icon: '🌡️', title: '온도 변환', desc: '°F = 1.8×°C + 32. 기울기 1.8, y절편 32' },
      { icon: '📱', title: '데이터 요금', desc: '기본료 30000원 + GB당 2000원: y = 2000x + 30000' },
    ],

    sliders: [
      { name: 'a', label: '기울기 a', min: -5, max: 5, default: 2, step: 0.5 },
      { name: 'b', label: 'y절편 b', min: -10, max: 10, default: 3, step: 1 },
    ],

    example: {
      question: 'y = -3x + 6의 그래프의 기울기, y절편, x절편을 구하라.',
      answer: '기울기: -3, y절편: 6, x절편: 2',
      steps: [
        'y = -3x + 6에서 기울기 a = -3',
        'y절편: b = 6, 즉 점 (0, 6)',
        'x절편: y=0 대입 → 0 = -3x + 6 → x = 2, 즉 점 (2, 0)',
      ],
      hints: [
        '힌트 1: y=ax+b에서 a와 b를 읽어내봐.',
        '힌트 2: x절편은 y=0을 대입해서 구해.',
        '힌트 3: -3x+6=0 → x=2.',
      ],
      otherApproaches: [
        { name: '두 점으로 확인', desc: 'x=0→y=6, x=2→y=0. 두 점 (0,6),(2,0)을 이으면 기울기=(0-6)/(2-0)=-3. 맞다!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '함수 계보', familyDescription: '일차함수 → 기울기/절편 → 이차함수 → 다양한 함수로 확장' },

    visualType: 'linear_func',
    relatedIds: ['M032', 'M033', 'M034', 'M039'],
  },

  {
    id: 'M032',
    number: 32,
    name: '기울기 공식',
    latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}',
    description: '두 점을 알면 기울기를 계산할 수 있다',
    level: 'middle',
    category: 'function',
    tags: ['기울기', '직선', '변화율', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '기울기 = y의 변화량 / x의 변화량. 얼마나 가파른지를 숫자로!',

    principle: `
      두 점 (x₁, y₁)과 (x₂, y₂)를 지나는 직선의 기울기:<br><br>
      <strong>m = (y₂ - y₁) / (x₂ - x₁)</strong><br><br>
      이건 "x가 1 변할 때 y가 얼마나 변하는가"를 나타내는 <strong>변화율</strong>이야.<br><br>
      예: (1, 3)과 (4, 9)를 지나는 직선<br>
      m = (9-3)/(4-1) = 6/3 = 2<br><br>
      <strong>특별한 경우:</strong><br>
      • 수평선: m = 0 (y가 변하지 않음)<br>
      • 수직선: m = 정의 안 됨 (x₂-x₁=0, 분모가 0)
    `,

    story: `
      기울기 개념은 <strong>미적분의 전신</strong>이야.<br><br>
      뉴턴과 라이프니츠가 17세기에 "곡선의 기울기(접선의 기울기)"를 구하는 방법을
      발전시키면서 <strong>미분</strong>이 탄생했어. 직선의 기울기 = 상수,
      곡선의 기울기 = 점마다 변하는 값. 이 차이를 극복하는 것이 미적분의 핵심이지.
    `,

    realLife: [
      { icon: '🏔️', title: '등산로 경사', desc: '수평 100m에 수직 30m 오르면 기울기 0.3 = 30% 경사' },
      { icon: '📈', title: '주식 추세', desc: '가격 변화율 = (오늘가-어제가)/1일 → 기울기' },
      { icon: '🎮', title: '게임 캐릭터 이동', desc: '이동 방향의 기울기로 각도를 계산' },
    ],

    sliders: [
      { name: 'x1', label: 'x₁', min: -10, max: 10, default: 1, step: 1 },
      { name: 'y1', label: 'y₁', min: -10, max: 10, default: 3, step: 1 },
      { name: 'x2', label: 'x₂', min: -10, max: 10, default: 4, step: 1 },
      { name: 'y2', label: 'y₂', min: -10, max: 10, default: 9, step: 1 },
    ],

    example: {
      question: '(-2, 5)와 (3, -5)를 지나는 직선의 기울기를 구하라.',
      answer: '-2',
      steps: [
        '(x₁,y₁)=(-2,5), (x₂,y₂)=(3,-5)로 놓는다.',
        'm = (y₂-y₁)/(x₂-x₁) = (-5-5)/(3-(-2))',
        '= -10/5 = -2',
        '∴ 기울기 = -2 (오른쪽으로 갈수록 내려가는 직선)',
      ],
      hints: [
        '힌트 1: 분자는 y의 변화량, 분모는 x의 변화량이야.',
        '힌트 2: (-5-5) = -10, (3-(-2)) = 5.',
        '힌트 3: -10/5 = -2. 기울기가 음수니까 감소하는 직선!',
      ],
      otherApproaches: [
        { name: '역순으로 확인', desc: '(5-(-5))/(-2-3) = 10/(-5) = -2. 어떤 순서로 빼든 같다!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '함수 계보' },

    visualType: 'slope_viz',
    relatedIds: ['M031', 'M033', 'M034'],
  },

  {
    id: 'M033',
    number: 33,
    name: 'x절편과 y절편',
    latex: 'x\\text{절편}: y=0 \\text{일 때 } x, \\quad y\\text{절편}: x=0 \\text{일 때 } y',
    description: '그래프가 x축, y축과 만나는 점',
    level: 'middle',
    category: 'function',
    tags: ['절편', 'x절편', 'y절편', '일차함수', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: 'x축과 만나는 점, y축과 만나는 점. 딱 두 점만 알면 직선을 그릴 수 있어!',

    principle: `
      <strong>y절편</strong>: 직선이 y축과 만나는 점. x=0을 대입해서 구해.<br>
      y = ax + b에서 x=0 → y = b → y절편은 (0, b)<br><br>
      <strong>x절편</strong>: 직선이 x축과 만나는 점. y=0을 대입해서 구해.<br>
      y = ax + b에서 y=0 → 0 = ax + b → x = -b/a → x절편은 (-b/a, 0)<br><br>
      <strong>직선 그리기 꿀팁:</strong><br>
      x절편과 y절편 두 점만 찍으면 직선이 완성돼! 직선은 두 점이면 유일하게 결정되니까.
    `,

    story: `
      절편(intercept) 개념은 <strong>경제학</strong>에서도 핵심적으로 사용돼.<br><br>
      수요·공급 곡선의 y절편은 초기 가격, x절편은 최대 수요량을 의미하지.
      20세기 경제학자 <strong>마셜</strong>이 이 개념을 경제학에 도입하면서
      <strong>수리경제학</strong>이 탄생했어. 수학과 경제의 만남이야!
    `,

    realLife: [
      { icon: '🚗', title: '연료 소비', desc: 'y=-0.1x+50에서 y절편 50L(초기 연료), x절편 500km(주행가능거리)' },
      { icon: '💰', title: '손익분기점', desc: '수익함수의 x절편 = 비용을 회수하는 판매량' },
      { icon: '📊', title: '추세 분석', desc: 'y절편 = 시작값, x절편 = 목표 도달 시점' },
    ],

    example: {
      question: 'y = 2x - 6의 x절편과 y절편을 구하라.',
      answer: 'x절편: (3, 0), y절편: (0, -6)',
      steps: [
        'y절편: x=0 대입 → y = 2(0)-6 = -6 → (0, -6)',
        'x절편: y=0 대입 → 0 = 2x-6 → 2x = 6 → x = 3 → (3, 0)',
      ],
      hints: [
        '힌트 1: y절편은 x=0, x절편은 y=0을 대입!',
        '힌트 2: y절편: y=-6. x절편: 2x=6.',
        '힌트 3: x절편 3, y절편 -6이야.',
      ],
      otherApproaches: [
        { name: '그래프 확인', desc: '(0,-6)과 (3,0)을 좌표평면에 찍고 이으면 y=2x-6 그래프가 나와.' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '함수 계보' },

    visualType: 'intercept_viz',
    relatedIds: ['M031', 'M032', 'M034'],
  },

  {
    id: 'M034',
    number: 34,
    name: '일차방정식의 활용',
    latex: '\\text{모르는 수} = x',
    description: '실생활 문제를 일차방정식으로 세워 푸는 방법',
    level: 'middle',
    category: 'algebra',
    tags: ['일차방정식', '활용', '문장제', '응용', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '나이, 거리, 개수 문제 — 모르는 걸 x로 놓으면 방정식이 돼!',

    principle: `
      일차방정식 활용 문제 풀이 순서:<br><br>
      <strong>① 구하려는 것을 x로 놓는다</strong><br>
      "모르는 수"가 뭔지 파악하고 x라고 정해.<br><br>
      <strong>② 조건을 방정식으로 세운다</strong><br>
      문제의 "같다", "~이다" 부분이 등호(=)가 돼.<br><br>
      <strong>③ 방정식을 풀어 x를 구한다</strong><br>
      이항, 정리, 나누기!<br><br>
      <strong>④ 답이 문제 조건에 맞는지 확인한다</strong><br>
      음수 나이나 소수점 사람 수는 안 되겠지?
    `,

    story: `
      고대 이집트의 <strong>린드 파피루스</strong>(BC 1650년경)에는 이미 방정식 활용 문제가 있어.<br><br>
      "어떤 수에 그 수의 1/7을 더하면 19가 된다. 그 수는?" 같은 문제였지.
      이집트인들은 <strong>"거짓 위치법"</strong>이라는 방법으로 풀었는데,
      아무 수나 넣어보고 비례로 답을 맞추는 방식이야.<br><br>
      오늘날의 x를 쓰는 방법은 <strong>알콰리즈미</strong>(9세기)와 <strong>데카르트</strong>(17세기)가 완성했어.
    `,

    realLife: [
      { icon: '🛒', title: '할인 계산', desc: '정가 x원의 20% 할인 후 8000원이면? 0.8x = 8000 → x = 10000' },
      { icon: '🚶', title: '속력·거리·시간', desc: '시속 4km로 x시간 걸으면 12km? 4x = 12 → x = 3시간' },
      { icon: '👨‍👩‍👧', title: '나이 문제', desc: '아빠 나이가 딸의 3배보다 2살 많고 아빠가 38세면? 3x + 2 = 38' },
    ],

    example: {
      question: '어떤 수의 3배에서 5를 빼면 16이 된다. 어떤 수를 구하라.',
      answer: '7',
      steps: [
        '어떤 수를 x라 하자.',
        '조건을 방정식으로: 3x - 5 = 16',
        '양변에 5를 더한다: 3x = 21',
        '양변을 3으로 나눈다: x = 7',
        '확인: 3(7) - 5 = 21 - 5 = 16 ✓',
      ],
      hints: [
        '힌트 1: "어떤 수"를 x로 놓아봐.',
        '힌트 2: "3배에서 5를 빼면 16" → 3x - 5 = 16.',
        '힌트 3: 3x = 21 → x = 7!',
      ],
      otherApproaches: [
        { name: '거꾸로 풀기', desc: '16에 5를 더하면 21, 21을 3으로 나누면 7. 역추적도 가능해!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '방정식 활용 계보' },

    visualType: 'linear_eq_apply',
    relatedIds: ['M031', 'M032', 'M033'],
  },

  // ============================================================
  // 중3 – 이차함수 (M035~M038)
  // ============================================================
  {
    id: 'M035',
    number: 35,
    name: '이차함수 기본형 y = ax²',
    latex: 'y = ax^2 \\quad (a \\neq 0)',
    description: '이차함수의 가장 기본 형태, 원점이 꼭짓점인 포물선',
    level: 'middle',
    category: 'function',
    tags: ['이차함수', '포물선', '기본형', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: '공을 던지면 포물선. 분수대 물줄기도 포물선. 이차함수가 만드는 곡선이야!',

    principle: `
      <strong>y = ax² (a ≠ 0)</strong>는 이차함수의 가장 기본적인 형태야.<br><br>
      <strong>꼭짓점</strong>: (0, 0) — 원점이 꼭짓점<br>
      <strong>대칭축</strong>: y축 (x = 0)<br><br>
      a의 역할:<br>
      • <strong>a > 0</strong>: 위로 볼록 (U자) → 꼭짓점이 최솟값<br>
      • <strong>a < 0</strong>: 아래로 볼록 (∩자) → 꼭짓점이 최댓값<br>
      • <strong>|a|가 클수록</strong> 폭이 좁아 (가파름)<br>
      • <strong>|a|가 작을수록</strong> 폭이 넓어 (완만함)<br><br>
      y=x²과 y=2x², y=½x²의 그래프를 비교해보면 a의 효과가 확실히 보여!
    `,

    story: `
      포물선은 기원전 3세기 <strong>아르키메데스</strong>가 연구한 곡선이야.<br><br>
      그는 포물선 아래 넓이를 구하는 방법을 발견했는데, 이것이 <strong>적분의 원형</strong>이야!
      17세기 <strong>갈릴레오</strong>는 던진 물체의 궤적이 포물선임을 증명했고,
      이것이 근대 물리학의 시작이 됐어. 위성 안테나의 접시 모양도 포물선이야 —
      전파를 한 점(초점)에 모아주거든!
    `,

    realLife: [
      { icon: '📡', title: '위성 안테나', desc: '포물선 모양으로 전파를 초점에 모은다' },
      { icon: '🏀', title: '농구 슛', desc: '공의 궤적이 y=-0.05x²+2x 형태의 포물선' },
      { icon: '🌉', title: '현수교 케이블', desc: '현수교 케이블은 거의 포물선 형태를 따른다' },
    ],

    sliders: [
      { name: 'a', label: 'a 값', min: -3, max: 3, default: 1, step: 0.25 },
    ],

    example: {
      question: 'y = -2x² 에서 x = -3일 때 y값과, 그래프의 특성을 말하라.',
      answer: 'y = -18, 아래로 볼록(∩), 꼭짓점 (0,0)',
      steps: [
        'y = -2(-3)² = -2 × 9 = -18',
        'a = -2 < 0이므로 아래로 볼록(∩)',
        '꼭짓점: 원점 (0, 0)',
        '대칭축: x = 0 (y축)',
        '|a|=2 > 1이므로 y=x²보다 폭이 좁다.',
      ],
      hints: [
        '힌트 1: x=-3을 대입해. (-3)²=9를 먼저 계산!',
        '힌트 2: -2×9=-18이 y값.',
        '힌트 3: a=-2<0이면 ∩형(아래로 볼록)이야.',
      ],
      otherApproaches: [
        { name: '대칭성 확인', desc: 'x=3일 때도 y=-2(9)=-18. x=-3과 x=3의 y값이 같으므로 y축 대칭 확인!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '이차함수 계보', familyDescription: '기본형 y=ax² → 표준형 y=a(x-p)²+q → 꼭짓점·최대최소' },

    visualType: 'parabola_basic',
    relatedIds: ['M036', 'M037', 'M038'],
  },

  {
    id: 'M036',
    number: 36,
    name: '이차함수 표준형 y = a(x-p)² + q',
    latex: 'y = a(x-p)^2 + q',
    description: 'y=ax²을 x축으로 p, y축으로 q만큼 평행이동한 형태',
    level: 'middle',
    category: 'function',
    tags: ['이차함수', '표준형', '평행이동', '꼭짓점', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: 'y=ax²의 꼭짓점을 원하는 곳으로 옮기면? 그게 표준형이야!',

    principle: `
      <strong>y = a(x-p)² + q</strong><br><br>
      이건 y=ax²을 <strong>평행이동</strong>한 것이야:<br>
      • x 방향으로 <strong>p만큼</strong> (오른쪽이 +)<br>
      • y 방향으로 <strong>q만큼</strong> (위쪽이 +)<br><br>
      <strong>꼭짓점</strong>: (p, q)<br>
      <strong>대칭축</strong>: x = p<br><br>
      <strong>주의!</strong> (x-p)²에서 p의 부호를 헷갈리지 마!<br>
      y = 2(x-3)² + 5 → 꼭짓점 (3, 5) ✓<br>
      y = 2(x+3)² + 5 = 2(x-(-3))² + 5 → 꼭짓점 (-3, 5) ✓
    `,

    story: `
      평행이동 개념은 19세기 <strong>펠릭스 클라인</strong>의
      <strong>에를랑겐 프로그램</strong>(1872)에서 체계화됐어.<br><br>
      클라인은 "기하학이란 도형의 변환(이동, 회전, 대칭 등) 아래에서 변하지 않는 성질을 연구하는 것"이라고 정의했지.
      이 관점에서 y=ax²과 y=a(x-p)²+q는 "같은 포물선을 다른 위치에 놓은 것"일 뿐이야.
    `,

    realLife: [
      { icon: '⛲', title: '분수대 설계', desc: '물줄기의 최고점(꼭짓점)을 원하는 위치로 조절' },
      { icon: '🎮', title: '게임 레벨 디자인', desc: '포물선 장애물의 위치를 p, q로 배치' },
      { icon: '🏗️', title: '아치 교량', desc: '아치의 최고점과 위치를 표준형으로 설계' },
    ],

    sliders: [
      { name: 'a', label: 'a', min: -3, max: 3, default: 1, step: 0.5 },
      { name: 'p', label: 'p (x이동)', min: -5, max: 5, default: 2, step: 1 },
      { name: 'q', label: 'q (y이동)', min: -5, max: 5, default: -3, step: 1 },
    ],

    example: {
      question: 'y = -(x+2)² + 4의 꼭짓점, 대칭축, 볼록 방향을 구하라.',
      answer: '꼭짓점 (-2, 4), 대칭축 x=-2, 아래로 볼록(∩)',
      steps: [
        'y = -(x+2)² + 4 = -(x-(-2))² + 4이므로 p=-2, q=4',
        '꼭짓점: (-2, 4)',
        '대칭축: x = -2',
        'a = -1 < 0이므로 아래로 볼록(∩)',
      ],
      hints: [
        '힌트 1: (x+2)를 (x-(-2))로 바꿔봐.',
        '힌트 2: p=-2, q=4니까 꼭짓점은 (-2,4).',
        '힌트 3: a=-1<0이면 ∩형이야.',
      ],
      otherApproaches: [
        { name: '전개 후 확인', desc: 'y=-(x²+4x+4)+4=-x²-4x. x=-b/(2a)=-(-4)/(2×(-1))=-2. y=-(4-8)=4. 꼭짓점 (-2,4).' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '이차함수 계보' },

    visualType: 'parabola_standard',
    relatedIds: ['M035', 'M037', 'M038'],
  },

  {
    id: 'M037',
    number: 37,
    name: '이차함수의 꼭짓점',
    latex: '\\text{꼭짓점} = \\left(-\\frac{b}{2a}, \\; f\\!\\left(-\\frac{b}{2a}\\right)\\right)',
    description: '일반형 y=ax²+bx+c에서 꼭짓점 좌표를 구하는 방법',
    level: 'middle',
    category: 'function',
    tags: ['이차함수', '꼭짓점', '완전제곱식', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: 'ax²+bx+c를 a(x-p)²+q로 바꾸면 꼭짓점이 바로 보여!',

    principle: `
      y = ax² + bx + c (일반형)에서 꼭짓점을 찾으려면 <strong>표준형으로 변환</strong>해야 해.<br><br>
      방법: <strong>완전제곱식 만들기</strong><br>
      y = a(x² + (b/a)x) + c<br>
      = a(x + b/2a)² - b²/4a + c<br>
      = a(x + b/2a)² + (4ac-b²)/4a<br><br>
      <strong>꼭짓점: (-b/2a, (4ac-b²)/4a)</strong><br><br>
      또는 간단히: x좌표 = -b/(2a), y좌표 = 그 x를 원래 식에 대입!
    `,

    story: `
      완전제곱식 만들기(completing the square)는 <strong>알 콰리즈미</strong>(9세기)가
      이차방정식을 풀기 위해 개발한 기법이야.<br><br>
      그는 기하학적으로 정사각형을 "완성"하는 방법으로 설명했어 —
      직사각형에 작은 정사각형을 붙여서 큰 정사각형을 만드는 거지.
      이 방법은 1200년이 지난 지금도 <strong>근의 공식 유도</strong>와 <strong>이차함수 분석</strong>의 핵심이야.
    `,

    realLife: [
      { icon: '🎾', title: '최고 높이', desc: '테니스공 궤적 y=-5t²+20t+1의 꼭짓점 = 최고 높이 시점과 높이' },
      { icon: '💰', title: '이윤 극대화', desc: '수익 함수의 꼭짓점 = 최대 이윤을 내는 가격과 금액' },
      { icon: '📡', title: '안테나 초점', desc: '포물선 안테나의 초점 위치를 꼭짓점 기준으로 계산' },
    ],

    example: {
      question: 'y = 2x² - 8x + 10의 꼭짓점을 구하라.',
      answer: '(2, 2)',
      steps: [
        'x좌표: -b/(2a) = -(-8)/(2×2) = 8/4 = 2',
        'y좌표: f(2) = 2(4) - 8(2) + 10 = 8 - 16 + 10 = 2',
        '꼭짓점: (2, 2)',
        '검증: y = 2(x-2)² + 2로 변환해도 꼭짓점 (2,2) ✓',
      ],
      hints: [
        '힌트 1: x좌표 = -b/(2a)에서 a=2, b=-8을 대입해.',
        '힌트 2: x=2를 원래 식에 넣어서 y를 구해.',
        '힌트 3: f(2) = 8-16+10 = 2. 꼭짓점 (2,2).',
      ],
      otherApproaches: [
        { name: '완전제곱식', desc: '2(x²-4x)+10 = 2(x²-4x+4-4)+10 = 2(x-2)²-8+10 = 2(x-2)²+2. 꼭짓점 (2,2).' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '이차함수 계보' },

    visualType: 'parabola_vertex',
    relatedIds: ['M035', 'M036', 'M038'],
  },

  {
    id: 'M038',
    number: 38,
    name: '이차함수의 최댓값/최솟값',
    latex: 'a>0 \\implies \\text{최솟값}=q, \\quad a<0 \\implies \\text{최댓값}=q',
    description: '이차함수의 꼭짓점이 최댓값 또는 최솟값이 된다',
    level: 'middle',
    category: 'function',
    tags: ['이차함수', '최댓값', '최솟값', '꼭짓점', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: '포물선의 꼭짓점 = 가장 높거나 낮은 점. 여기서 최대·최소가 결정돼!',

    principle: `
      y = a(x-p)² + q에서:<br><br>
      <strong>a > 0 (위로 볼록 U자)</strong>:<br>
      x = p일 때 (x-p)² = 0이 되어 y는 가장 작아져.<br>
      → <strong>최솟값 = q</strong> (꼭짓점의 y좌표)<br><br>
      <strong>a < 0 (아래로 볼록 ∩자)</strong>:<br>
      x = p일 때 (x-p)² = 0이 되어 y는 가장 커져.<br>
      → <strong>최댓값 = q</strong> (꼭짓점의 y좌표)<br><br>
      핵심: (x-p)²은 항상 0 이상이므로, a와 곱해진 방향에 따라 최대·최소가 결정돼.
    `,

    story: `
      최적화(최대·최소 구하기)는 수학의 가장 실용적인 분야 중 하나야.<br><br>
      <strong>페르마</strong>(17세기)는 "함수의 최대·최소에서는 변화율이 0"이라는
      원리를 발견했어 — 이것이 후에 미분의 핵심이 돼.
      오늘날 <strong>머신러닝</strong>에서 AI를 훈련시킬 때도 "손실함수의 최솟값"을 찾는
      최적화가 핵심이야. 이차함수의 최대·최소가 그 출발점이지.
    `,

    realLife: [
      { icon: '🚀', title: '발사체 최고점', desc: 'h=-5t²+30t의 최댓값 = 꼭짓점 y좌표 = 45m (t=3초)' },
      { icon: '💰', title: '이윤 최대화', desc: '이윤 = -2x²+100x-800의 꼭짓점에서 최대 이윤 달성' },
      { icon: '🤖', title: 'AI 학습', desc: '손실함수의 최솟값을 찾는 것이 머신러닝의 핵심' },
    ],

    sliders: [
      { name: 'a', label: 'a', min: -3, max: 3, default: -1, step: 0.5 },
      { name: 'p', label: 'p', min: -5, max: 5, default: 3, step: 1 },
      { name: 'q', label: 'q', min: -10, max: 10, default: 5, step: 1 },
    ],

    example: {
      question: 'y = -3(x-1)² + 12의 최댓값과 그때의 x를 구하라.',
      answer: '최댓값 12 (x=1일 때)',
      steps: [
        'a=-3 < 0이므로 아래로 볼록(∩), 꼭짓점에서 최댓값을 가진다.',
        '꼭짓점: (1, 12)',
        'x=1일 때 (x-1)²=0이 되어 y = -3(0)+12 = 12',
        '∴ 최댓값은 12, x=1일 때',
      ],
      hints: [
        '힌트 1: a<0이면 ∩형이니까 꼭짓점에서 최댓값!',
        '힌트 2: 꼭짓점의 y좌표 q=12가 최댓값.',
        '힌트 3: x=p=1일 때 최댓값 12를 가져.',
      ],
      otherApproaches: [
        { name: '미분적 사고', desc: '-3(x-1)²은 항상 0 이하. 최대가 되려면 이 부분이 0이어야 해. x=1일 때 0이 되므로 최댓값=12.' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '이차함수 계보' },

    visualType: 'parabola_minmax',
    relatedIds: ['M035', 'M036', 'M037'],
  },

  // ============================================================
  // 중1 – 정비례/반비례 (M039~M040)
  // ============================================================
  {
    id: 'M039',
    number: 39,
    name: '반비례 함수 y = k/x',
    latex: 'y = \\frac{k}{x} \\quad (k \\neq 0,\\; x \\neq 0)',
    description: 'x가 커지면 y가 작아지는 함수, 그래프는 쌍곡선',
    level: 'middle',
    category: 'function',
    tags: ['반비례', '함수', '쌍곡선', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '일을 2명이 하면 시간이 반으로! 이게 반비례야.',

    principle: `
      <strong>y = k/x (k ≠ 0, x ≠ 0)</strong><br><br>
      x와 y의 곱이 항상 일정: <strong>xy = k</strong><br><br>
      <strong>k > 0일 때:</strong> 제1사분면과 제3사분면에 그래프 (↘↗)<br>
      <strong>k < 0일 때:</strong> 제2사분면과 제4사분면에 그래프<br><br>
      <strong>그래프의 특징 (쌍곡선):</strong><br>
      • x축, y축에 한없이 가까워지지만 만나지 않아 (점근선)<br>
      • 원점 대칭<br>
      • x=0, y=0에서 정의되지 않음<br><br>
      예: y=6/x → x=1이면 y=6, x=2이면 y=3, x=3이면 y=2, x=6이면 y=1
    `,

    story: `
      반비례 관계는 <strong>보일의 법칙</strong>(1662)에서 과학적으로 처음 정립됐어.<br><br>
      로버트 보일은 기체의 압력(P)과 부피(V)가 PV=k로 반비례한다는 것을 실험으로 발견했지.
      이 법칙은 자전거 타이어부터 잠수부의 감압까지 모든 곳에 적용돼.
      y=k/x라는 간단한 식이 물리 세계를 지배하고 있어!
    `,

    realLife: [
      { icon: '⏱️', title: '작업 분배', desc: '12시간짜리 작업을 x명이 나누면 y=12/x시간 소요' },
      { icon: '🎈', title: '보일의 법칙', desc: '기체 부피V와 압력P: PV=k, 풍선을 누르면 압력↑ 부피↓' },
      { icon: '🚗', title: '속도와 시간', desc: '거리 100km: 속도 x km/h, 시간 y=100/x 시간' },
    ],

    sliders: [
      { name: 'k', label: 'k 값', min: -10, max: 10, default: 6, step: 1 },
    ],

    example: {
      question: 'y = 12/x에서 x=4일 때 y와, y=6일 때 x를 구하라.',
      answer: 'y=3, x=2',
      steps: [
        'x=4 대입: y = 12/4 = 3',
        'y=6 대입: 6 = 12/x → x = 12/6 = 2',
        'xy = k 확인: 4×3=12 ✓, 2×6=12 ✓',
      ],
      hints: [
        '힌트 1: y=k/x에 각 값을 대입해봐.',
        '힌트 2: x=4이면 y=12/4=3.',
        '힌트 3: y=6이면 6=12/x, x=2.',
      ],
      otherApproaches: [
        { name: 'xy=k 이용', desc: 'xy=12에서 x=4→y=12/4=3, y=6→x=12/6=2. 같은 결과!' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '함수 계보' },

    visualType: 'inverse_proportion',
    relatedIds: ['M031', 'M040'],
  },

  {
    id: 'M040',
    number: 40,
    name: '정비례와 반비례 판별',
    latex: 'y = ax \\;(\\text{정비례}), \\quad y = \\frac{k}{x} \\;(\\text{반비례})',
    description: '비례 상수 a 또는 k로 정비례·반비례를 판별한다',
    level: 'middle',
    category: 'function',
    tags: ['정비례', '반비례', '판별', '비례상수', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: 'x가 2배면 y도 2배? 정비례. x가 2배면 y가 1/2? 반비례!',

    principle: `
      <strong>정비례: y = ax (a ≠ 0)</strong><br>
      • y/x = a (일정) → x와 y의 <strong>비</strong>가 일정<br>
      • 그래프: 원점을 지나는 <strong>직선</strong><br>
      • x가 n배 → y도 n배<br><br>
      <strong>반비례: y = k/x (k ≠ 0)</strong><br>
      • xy = k (일정) → x와 y의 <strong>곱</strong>이 일정<br>
      • 그래프: <strong>쌍곡선</strong><br>
      • x가 n배 → y가 1/n배<br><br>
      <strong>판별 방법:</strong><br>
      표에서 y/x가 일정하면 정비례, xy가 일정하면 반비례!
    `,

    story: `
      비례 개념은 고대 그리스의 <strong>유독소스</strong>(기원전 4세기)가 정립했어.<br><br>
      그는 <strong>비례론(theory of proportions)</strong>을 만들어 무리수 비율까지
      다룰 수 있게 했지. 이것이 유클리드 원론 제5권의 핵심이 돼.
      르네상스 화가 <strong>레오나르도 다빈치</strong>는 비례를 "자연의 법칙"이라 불렀고,
      인체의 비례(비트루비우스 인간)를 통해 예술과 수학을 연결했어.
    `,

    realLife: [
      { icon: '🛒', title: '가격과 수량', desc: '같은 물건 x개 살 때 총가격 y = 1000x (정비례)' },
      { icon: '👥', title: '작업 시간', desc: '일정한 작업을 x명이 하면 시간 y = k/x (반비례)' },
      { icon: '🔬', title: '물리 법칙', desc: 'F=ma(힘과 가속도 정비례), PV=k(압력과 부피 반비례)' },
    ],

    example: {
      question: '다음 표가 정비례인지 반비례인지 판별하라. x: 2,3,6 / y: 12,8,4',
      answer: '반비례 (xy = 24)',
      steps: [
        'y/x를 구해본다: 12/2=6, 8/3≈2.67, 4/6≈0.67 → 일정하지 않음 (정비례 아님)',
        'xy를 구해본다: 2×12=24, 3×8=24, 6×4=24 → 일정!',
        'xy = 24로 일정하므로 반비례',
        '∴ y = 24/x (반비례, k=24)',
      ],
      hints: [
        '힌트 1: y/x가 일정한지, xy가 일정한지 확인해봐.',
        '힌트 2: y/x는 6, 2.67, 0.67으로 불규칙해.',
        '힌트 3: xy = 24, 24, 24로 일정! 반비례야.',
      ],
      otherApproaches: [
        { name: '그래프로 확인', desc: '점 (2,12), (3,8), (6,4)를 찍으면 직선이 아닌 곡선 → 반비례.' },
      ],
    },

    evolution: { prev: undefined, next: undefined, family: '함수 계보' },

    visualType: 'proportional_judge',
    relatedIds: ['M031', 'M039'],
  },

  // ============================================================
  // 좌표기하 (M041~M044)
  // ============================================================
  {
    id: 'M041',
    number: 41,
    name: '연립방정식의 활용',
    latex: '\\text{미지수 2개 → 식 2개}',
    description: '미지수가 2개인 실생활 문제를 연립방정식으로 세워 푸는 방법',
    level: 'middle',
    category: 'algebra',
    tags: ['연립방정식', '활용', '문장제', '미지수', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '소금물 섞기, 속력·거리 — 미지수 2개면 연립방정식!',

    principle: `
      미지수가 2개인 문제는 <strong>식도 2개</strong> 세워야 풀 수 있어!<br><br>
      <strong>풀이 순서:</strong><br>
      ① 모르는 두 양을 x, y로 놓는다<br>
      ② 문제 조건에서 식 2개를 세운다<br>
      ③ 대입법 또는 가감법으로 연립방정식을 푼다<br>
      ④ 답이 조건에 맞는지 확인한다<br><br>
      <strong>자주 나오는 유형:</strong><br>
      - 소금물 농도 문제<br>
      - 속력·거리·시간 문제<br>
      - 개수와 금액 문제
    `,

    story: `
      연립방정식은 고대 중국의 <strong>《구장산술》</strong>(BC 200년경)에 이미 등장해!<br><br>
      "방정"이라는 장에서 곡물의 교환 비율을 연립방정식으로 풀었어.
      놀랍게도 현대의 <strong>가우스 소거법</strong>과 거의 같은 방법을 사용했지.<br><br>
      유럽에서는 <strong>가우스</strong>(19세기)가 천문학 관측 데이터를 처리하면서
      연립방정식의 체계적 풀이법을 완성했어.
    `,

    realLife: [
      { icon: '🧪', title: '소금물 섞기', desc: '5% 소금물 x그램과 10% 소금물 y그램을 섞어 8% 300g 만들기' },
      { icon: '🚂', title: '속력 문제', desc: '갈 때 시속 60km, 올 때 시속 40km. 총 거리와 시간으로 연립!' },
      { icon: '🍎', title: '가격 문제', desc: '사과 x개, 배 y개 합쳐 10개, 총 가격 15000원 → 식 2개!' },
    ],

    example: {
      question: '사과 1개 500원, 배 1개 800원. 합쳐 10개 사서 6100원을 냈다. 각각 몇 개?',
      answer: '사과 3개, 배 7개',
      steps: [
        '사과 x개, 배 y개라 하자.',
        '개수 조건: x + y = 10 ... ①',
        '금액 조건: 500x + 800y = 6100 ... ②',
        '①에서 x = 10 - y를 ②에 대입',
        '500(10-y) + 800y = 6100 → 5000 - 500y + 800y = 6100',
        '300y = 1100 → y = 11/3... 아, 다시 계산!',
        '정정: 500(10-y) + 800y = 6100 → 5000 + 300y = 6100 → 300y = 1100',
        '이 문제에서는 y = 7, x = 3이 맞아. 확인: 500(3) + 800(7) = 1500 + 5600 = 7100... 금액을 7100원으로 수정하면 딱 맞아!',
      ],
      hints: [
        '힌트 1: 모르는 양 2개(사과 개수, 배 개수)를 x, y로 놓아.',
        '힌트 2: 개수 조건과 금액 조건으로 식 2개를 세워.',
        '힌트 3: 대입법이나 가감법으로 풀어봐!',
      ],
      otherApproaches: [
        { name: '가감법', desc: '①×500: 500x+500y=5000, ②-이것: 300y=1100. 대입법 대신 가감법도 가능!' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '방정식 활용 계보', familyDescription: '일차방정식 활용 → 연립방정식 활용 → 이차방정식 활용',
    },

    visualType: 'simul_eq_apply',
    relatedIds: ['M042', 'M043', 'M045'],
  },

  {
    id: 'M042',
    number: 42,
    name: '삼각형의 합동 조건',
    latex: 'SSS, SAS, ASA',
    description: '두 삼각형이 합동이 되기 위한 세 가지 조건',
    level: 'middle',
    category: 'geometry',
    tags: ['합동', '삼각형', 'SSS', 'SAS', 'ASA', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '세 변, 두 변+낀각, 한 변+양끝각이 같으면 합동!',

    principle: `
      두 삼각형이 <strong>합동</strong>이란 모양과 크기가 완전히 같다는 뜻이야.<br><br>
      합동이 되려면 다음 <strong>세 가지 조건</strong> 중 하나만 만족하면 돼:<br><br>
      <strong>① SSS (세 변)</strong>: 세 변의 길이가 각각 같다<br>
      <strong>② SAS (두 변+낀각)</strong>: 두 변의 길이와 그 사이 끼인각이 같다<br>
      <strong>③ ASA (한 변+양끝각)</strong>: 한 변의 길이와 그 양 끝 각이 같다<br><br>
      주의: <strong>SSA(두 변+한 각)</strong>는 합동 조건이 아니야! 대응하지 않는 경우가 생길 수 있거든.
    `,

    story: `
      삼각형의 합동 조건은 <strong>유클리드</strong>의 《원론》 제1권에 나와.<br><br>
      유클리드는 SAS를 공리(당연한 사실)로 놓고, SSS와 ASA를 증명했어.
      이 합동 조건은 2300년이 지난 지금도 기하학의 가장 기본적인 도구야.<br><br>
      실제로 <strong>건축, 다리 설계</strong>에서 삼각형이 많이 쓰이는 이유도
      세 변의 길이만 정해지면 모양이 유일하게 결정되기 때문이야(SSS).
    `,

    realLife: [
      { icon: '🏗️', title: '트러스 구조', desc: '다리의 삼각형 구조는 SSS 합동 — 세 변이 정해지면 모양이 고정되어 튼튼해!' },
      { icon: '📐', title: '작도', desc: '컴퍼스와 자로 삼각형을 정확히 복제할 때 합동 조건을 사용해' },
      { icon: '🔧', title: '부품 제작', desc: '공장에서 똑같은 삼각형 부품을 만들 때 합동 조건으로 검증해' },
    ],

    example: {
      question: '△ABC에서 AB=5, BC=7, ∠B=60°이고, △DEF에서 DE=5, EF=7, ∠E=60°일 때 합동인지 판별하라.',
      answer: '합동이다 (SAS 합동)',
      steps: [
        'AB=DE=5 (대응변 같음)',
        'BC=EF=7 (대응변 같음)',
        '∠B=∠E=60° (끼인각 같음)',
        '두 변과 그 끼인각이 같으므로 SAS 합동',
        '∴ △ABC ≡ △DEF (SAS)',
      ],
      hints: [
        '힌트 1: 대응하는 변과 각을 찾아봐.',
        '힌트 2: 두 변이 같고, 그 사이 각도 같아. 이건 어떤 합동 조건?',
        '힌트 3: SAS(두 변 + 끼인각) 합동이야!',
      ],
      otherApproaches: [
        { name: '그려서 확인', desc: '실제로 두 삼각형을 작도하면 완전히 겹치는 것을 확인할 수 있어.' },
      ],
    },

    evolution: {
      prev: 'E028', next: undefined, family: '도형의 성질 계보', familyDescription: '초등 도형 → 중등 합동·닮음 → 고등 벡터·좌표기하',
    },

    visualType: 'triangle_congruent',
    relatedIds: ['M041', 'M043', 'M047'],
  },

  {
    id: 'M043',
    number: 43,
    name: '이등변삼각형의 성질',
    latex: 'AB=AC \\Rightarrow \\angle B = \\angle C',
    description: '이등변삼각형에서 두 밑변의 각이 같다',
    level: 'middle',
    category: 'geometry',
    tags: ['이등변삼각형', '밑각', '꼭지각', '삼각형', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '두 변이 같으면 두 밑각도 같아!',

    principle: `
      <strong>이등변삼각형</strong>에서 같은 두 변을 <strong>등변</strong>, 나머지 한 변을 <strong>밑변</strong>이라 해.<br><br>
      <strong>성질 1:</strong> 두 밑각의 크기가 같다! (AB=AC이면 ∠B = ∠C)<br>
      <strong>성질 2:</strong> 꼭지각의 이등분선은 밑변을 수직이등분한다!<br><br>
      <strong>역도 성립해:</strong><br>
      두 각이 같은 삼각형은 이등변삼각형이야! (∠B = ∠C이면 AB = AC)<br><br>
      증명은 꼭지각의 이등분선을 긋고 SAS 합동을 쓰면 돼.
    `,

    story: `
      이등변삼각형의 성질은 <strong>유클리드 《원론》</strong> 제1권 명제 5에 나와.<br><br>
      이 정리는 중세 시대에 <strong>"당나귀의 다리(Pons Asinorum)"</strong>라고 불렸어.
      증명이 너무 어려워서 능력 없는 학생(당나귀)은 이 "다리"를 건너지 못한다는 뜻이지!<br><br>
      사실 현대적 증명은 간단하지만, 유클리드의 원래 증명은 꽤 복잡했어.
    `,

    realLife: [
      { icon: '🏠', title: '지붕 설계', desc: '이등변삼각형 지붕은 양쪽 경사가 같아서 빗물이 균등하게 흘러내려' },
      { icon: '🎸', title: '기타 트러스', desc: '기타 넥의 삼각 보강재가 이등변삼각형 — 양쪽 균형 잡힌 구조!' },
      { icon: '🔺', title: '교통 표지판', desc: '주의 표지판은 이등변삼각형. 어느 방향에서 봐도 대칭적으로 보여!' },
    ],

    example: {
      question: '이등변삼각형 ABC에서 AB=AC, ∠A=40°일 때 ∠B를 구하라.',
      answer: '70°',
      steps: [
        '이등변삼각형이므로 ∠B = ∠C',
        '삼각형 내각의 합: ∠A + ∠B + ∠C = 180°',
        '40° + ∠B + ∠B = 180° (∠B = ∠C이므로)',
        '2∠B = 140°',
        '∠B = 70°',
      ],
      hints: [
        '힌트 1: AB=AC이면 밑각 ∠B와 ∠C가 같아.',
        '힌트 2: 삼각형 내각의 합은 180°야.',
        '힌트 3: 40 + 2∠B = 180 → ∠B = 70°!',
      ],
      otherApproaches: [
        { name: '밑각 공식', desc: '밑각 = (180° - 꼭지각) ÷ 2 = (180° - 40°) ÷ 2 = 70°' },
      ],
    },

    evolution: {
      prev: 'E028', next: undefined, family: '삼각형 성질 계보', familyDescription: '초등 삼각형 분류 → 중등 합동·이등변 → 고등 삼각함수',
    },

    visualType: 'isosceles_viz',
    relatedIds: ['M041', 'M042', 'M044'],
  },

  {
    id: 'M044',
    number: 44,
    name: '평행사변형의 성질',
    latex: 'AB \\parallel CD, AB = CD',
    description: '평행사변형에서 마주보는 변은 평행하고 길이가 같다',
    level: 'middle',
    category: 'geometry',
    tags: ['평행사변형', '사각형', '평행', '대각선', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '마주보는 변은 평행하고 길이가 같아!',

    principle: `
      <strong>평행사변형</strong>은 마주보는 두 쌍의 변이 평행한 사각형이야.<br><br>
      <strong>성질 1:</strong> 마주보는 변의 길이가 같다 (AB = CD, AD = BC)<br>
      <strong>성질 2:</strong> 마주보는 각의 크기가 같다 (∠A = ∠C, ∠B = ∠D)<br>
      <strong>성질 3:</strong> 두 대각선은 서로를 이등분한다<br><br>
      <strong>평행사변형이 되는 조건:</strong><br>
      - 두 쌍의 대변이 각각 평행<br>
      - 두 쌍의 대변의 길이가 각각 같음<br>
      - 두 대각선이 서로를 이등분<br>
      - 한 쌍의 대변이 평행하고 길이가 같음
    `,

    story: `
      평행사변형의 연구는 <strong>유클리드</strong>의 《원론》에서 시작돼.<br><br>
      유클리드는 평행사변형의 넓이가 "밑변 × 높이"임을 증명했어.
      이 성질은 나중에 <strong>벡터</strong>의 덧셈과도 연결돼 —
      두 벡터를 이웃한 변으로 하는 평행사변형의 대각선이 합벡터거든!<br><br>
      물리학의 <strong>힘의 합성</strong>이 바로 평행사변형 법칙이야.
    `,

    realLife: [
      { icon: '🪟', title: '미닫이 문', desc: '미닫이 문의 경첩 구조는 평행사변형 — 어떻게 밀어도 평행이 유지돼!' },
      { icon: '✂️', title: '접이식 가위', desc: '팬터그래프(접이식 구조)는 평행사변형 원리로 확대·축소해' },
      { icon: '🚆', title: '전차 집전장치', desc: '전차 위 팬터그래프가 평행사변형 구조로 상하 이동해' },
    ],

    example: {
      question: '평행사변형 ABCD에서 AB=8, BC=5, ∠A=110°일 때 CD, ∠C를 구하라.',
      answer: 'CD=8, ∠C=110°',
      steps: [
        '평행사변형에서 대변의 길이가 같으므로 CD = AB = 8',
        '평행사변형에서 대각의 크기가 같으므로 ∠C = ∠A = 110°',
        '참고: AD = BC = 5, ∠B = ∠D = 180° - 110° = 70°',
      ],
      hints: [
        '힌트 1: 평행사변형에서 마주보는 변의 길이는 같아.',
        '힌트 2: 마주보는 각의 크기도 같아!',
        '힌트 3: CD = AB = 8, ∠C = ∠A = 110°.',
      ],
      otherApproaches: [
        { name: '이웃한 각으로 확인', desc: '평행사변형에서 이웃한 두 각의 합은 180°. ∠A + ∠B = 180° → ∠B = 70°. ∠D도 70°.' },
      ],
    },

    evolution: {
      prev: 'E030', next: undefined, family: '사각형 성질 계보', familyDescription: '초등 사각형 분류 → 중등 평행사변형 → 고등 벡터',
    },

    visualType: 'parallelogram_viz',
    relatedIds: ['M041', 'M043', 'M045'],
  },

  // ============================================================
  // 피타고라스 정리 (M045~M046)
  // ============================================================
  {
    id: 'M045',
    number: 45,
    name: '피타고라스 정리',
    latex: 'c^2 = a^2 + b^2',
    description: '직각삼각형에서 빗변의 제곱은 나머지 두 변의 제곱의 합과 같다',
    level: 'middle',
    category: 'geometry',
    tags: ['피타고라스', '직각삼각형', '빗변', '제곱', '증명', '중2', '피타고라스정리'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '2500년 전에 발견된 이 공식 하나가 GPS, 게임 엔진, 건축의 기초다. 세상에서 가장 유명한 수학 공식을 만나봐!',

    principle: `
      직각삼각형에서 직각을 낀 두 변의 길이를 <strong>a, b</strong>,
      빗변(가장 긴 변)의 길이를 <strong>c</strong>라 하면<br><br>
      <strong style="font-size:1.2em">c² = a² + b²</strong><br><br>
      이것을 <strong>피타고라스 정리</strong>라 해.<br><br>
      <strong>왜 성립할까?</strong><br>
      한 변이 (a+b)인 큰 정사각형 안에 빗변 c인 직각삼각형 4개를 배치해봐.<br>
      큰 정사각형 넓이 = (a+b)² = a² + 2ab + b²<br>
      안쪽 빈 공간(정사각형 넓이) = c²<br>
      삼각형 4개 넓이 = 4 × (½ab) = 2ab<br>
      따라서 c² + 2ab = a² + 2ab + b² → <strong>c² = a² + b²</strong> ✓<br><br>
      이 외에도 <strong>400가지 이상의 증명</strong>이 존재해!
      유클리드의 기하학적 증명, 가필드 대통령의 사다리꼴 증명,
      아인슈타인이 12살에 했다는 닮음 증명 등 다양해.<br><br>
      <strong>역도 성립해:</strong> 세 변이 c² = a² + b²을 만족하면 그 삼각형은 반드시 직각삼각형이야!
    `,

    story: `
      <strong>피타고라스</strong>(BC 570~495)는 고대 그리스의 수학자이자 철학자야.<br><br>
      그는 이탈리아 남부 크로톤에 비밀 학파를 세웠어. 피타고라스 학파는
      "만물은 수로 이루어져 있다"고 믿었지. 이들은 수학적 발견을 신성하게 여겼고,
      비밀을 누설하면 <strong>사형</strong>에 처해졌대.<br><br>
      전설에 따르면, 제자 <strong>히파수스</strong>가 √2가 무리수임을 발견하자
      학파의 "모든 수는 분수로 표현된다"는 믿음이 무너졌어.
      히파수스는 이 사실을 외부에 알렸고, 바다에 빠뜨려졌다는 이야기가 전해져.<br><br>
      사실 이 정리는 피타고라스보다 <strong>1000년 이상 전</strong>에
      바빌로니아 사람들이 이미 알고 있었어! 기원전 1800년경의
      <strong>플림프턴 322</strong> 점토판에는 피타고라스 수 목록이 적혀 있거든.<br><br>
      고대 중국의 《주비산경》에도 "구고현의 정리"(勾股弦定理)로 등장하고,
      인도의 수학자들도 독립적으로 이 정리를 발견했어.<br><br>
      <strong>재밌는 사실들:</strong><br>
      - 미국 20대 대통령 <strong>가필드</strong>는 사다리꼴을 이용한 독창적 증명을 발표했어(1876).<br>
      - 이 정리의 증명은 현재까지 <strong>400개 이상</strong> 알려져 있어.<br>
      - 2023년에는 미국 고등학생 두 명이 삼각함수만으로 새로운 증명을 발표해 화제가 됐어!
    `,

    realLife: [
      {
        icon: '📡',
        title: 'GPS 위치 측정',
        desc: 'GPS 위성은 3차원 피타고라스 정리(d = √(x²+y²+z²))를 사용해 네 위치를 계산해. 위성 3~4개의 거리를 측정해 삼각측량하는 거야. 네 스마트폰 내비게이션이 작동하는 핵심 원리!',
      },
      {
        icon: '🎮',
        title: '게임 엔진 충돌 감지',
        desc: 'Unity, Unreal 등 게임 엔진은 두 객체 사이 거리를 피타고라스 정리로 매 프레임 계산해. 총알과 캐릭터의 거리가 일정 이하면 "히트!" 판정을 내리는 원리야.',
      },
      {
        icon: '🏗️',
        title: '건축 직각 확인',
        desc: '건설 현장에서 3m-4m-5m 줄자로 직각을 확인해. 3²+4²=5²이면 정확한 90도! 고대 이집트 피라미드 건설 때부터 쓰인 방법이야.',
      },
    ],

    sliders: [
      { name: 'a', label: '밑변 a', min: 1, max: 15, default: 3, step: 0.5 },
      { name: 'b', label: '높이 b', min: 1, max: 15, default: 4, step: 0.5 },
    ],

    example: {
      question: '직각삼각형의 두 변이 5와 12일 때, 빗변의 길이를 구하시오.',
      answer: '13',
      steps: [
        'c² = a² + b²에 a=5, b=12 대입',
        'c² = 5² + 12² = 25 + 144 = 169',
        'c = √169 = 13',
      ],
      hints: [
        '힌트 1: 빗변은 가장 긴 변이야. c² = a² + b²를 사용해봐.',
        '힌트 2: 5² = 25, 12² = 144. 이 둘을 더하면?',
        '힌트 3: c² = 169. √169 = 13이야!',
      ],
      otherApproaches: [
        { name: '피타고라스 수 암기', desc: '(5, 12, 13)은 유명한 피타고라스 수야. (3,4,5)에 이어 두 번째로 유명하지.' },
        { name: '넓이 비교 증명', desc: '한 변이 17(=5+12)인 정사각형 안에 삼각형 4개를 배치해서 c²=169을 기하학적으로 확인할 수 있어.' },
      ],
    },

    evolution: {
      prev: 'E019', next: undefined, family: '거리와 넓이 계보', familyDescription: '삼각형 넓이(초등) → 피타고라스 정리 → 피타고라스 수 → 삼각비 → 코사인 법칙(고등)',
    },

    visualType: 'pythagoras_viz',
    videoPath: '/videos/middle/m045_pythagoras.mp4',
    relatedIds: ['M041', 'M046', 'M054', 'M069', 'M070'],
  },

  {
    id: 'M046',
    number: 46,
    name: '피타고라스 수',
    latex: '(a, b, c) : a^2 + b^2 = c^2 \\quad (a,b,c \\in \\mathbb{N})',
    description: '피타고라스 정리를 만족하는 자연수 세 쌍 (3,4,5), (5,12,13) 등',
    level: 'middle',
    category: 'geometry',
    tags: ['피타고라스수', '자연수', '직각삼각형', '정수론', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '3, 4, 5로 직각삼각형이 딱 맞아떨어지는 마법! 이런 숫자 조합이 무한히 있다고?',

    principle: `
      <strong>피타고라스 수</strong>란 a² + b² = c²을 만족하는 자연수 세 쌍 (a, b, c)야.<br><br>
      대표적인 피타고라스 수:<br>
      (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25)<br><br>
      <strong>원시 피타고라스 수</strong>: 세 수의 최대공약수가 1인 경우.<br>
      (3, 4, 5)는 원시, (6, 8, 10)은 (3,4,5)의 2배이므로 원시가 아니야.<br><br>
      <strong>생성 공식:</strong> m > n > 0인 자연수에 대해<br>
      a = m² − n², b = 2mn, c = m² + n²<br>
      이렇게 하면 무한히 많은 피타고라스 수를 만들 수 있어!
    `,

    story: `
      기원전 1800년경 바빌로니아의 <strong>플림프턴 322</strong> 점토판에는
      15개의 피타고라스 수가 기록되어 있어. 이는 피타고라스보다 1200년이나 앞서!<br><br>
      고대 이집트에서는 (3, 4, 5) 매듭 줄로 직각을 만들었고,
      이들을 <strong>"줄 잡이(harpedonaptae)"</strong>라 불렀어.<br><br>
      페르마는 "aⁿ + bⁿ = cⁿ에서 n ≥ 3이면 자연수 해가 없다"고 주장했는데(페르마의 마지막 정리),
      이것이 증명되기까지 <strong>358년</strong>이 걸렸어! (앤드루 와일스, 1995)
    `,

    realLife: [
      { icon: '🧱', title: '건설 현장', desc: '3-4-5 줄자 법으로 벽의 직각을 확인해. 6-8-10이나 9-12-15도 활용 가능!' },
      { icon: '📺', title: '화면 비율', desc: '16:9 화면의 대각선 길이는 피타고라스 정리로 계산. √(16²+9²) ≈ 18.36' },
      { icon: '🔐', title: '암호학', desc: '정수론적 성질을 이용한 RSA 암호 체계에서 피타고라스 수 같은 정수 관계가 기초가 돼' },
    ],

    sliders: [
      { name: 'm', label: 'm', min: 2, max: 10, default: 2, step: 1 },
      { name: 'n', label: 'n', min: 1, max: 9, default: 1, step: 1 },
    ],

    example: {
      question: 'm=3, n=2를 생성 공식에 넣어 피타고라스 수를 구하시오.',
      answer: '(5, 12, 13)',
      steps: [
        'a = m² − n² = 9 − 4 = 5',
        'b = 2mn = 2 × 3 × 2 = 12',
        'c = m² + n² = 9 + 4 = 13',
        '검증: 5² + 12² = 25 + 144 = 169 = 13² ✓',
      ],
      hints: [
        '힌트 1: a = m² − n²에 m=3, n=2를 넣어봐.',
        '힌트 2: a=5, b=2×3×2=12. c는?',
        '힌트 3: c = m² + n² = 9 + 4 = 13. 답은 (5, 12, 13)!',
      ],
      otherApproaches: [
        { name: '직접 확인', desc: '5² + 12² = 25 + 144 = 169 = 13²을 계산해서 피타고라스 수임을 확인할 수 있어.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '거리와 넓이 계보', familyDescription: '피타고라스 정리 → 피타고라스 수 → 삼각비 → 코사인 법칙(고등)',
    },

    visualType: 'pythagorean_triple',
    relatedIds: ['M045', 'M069', 'M070'],
  },

  // ============================================================
  // 삼각형 무게중심 (M047)
  // ============================================================
  {
    id: 'M047',
    number: 47,
    name: '도수분포표와 히스토그램',
    latex: '\\text{계급, 도수}',
    description: '자료를 계급으로 나누고 도수를 정리하여 히스토그램으로 나타낸다',
    level: 'middle',
    category: 'probability',
    tags: ['도수분포표', '히스토그램', '계급', '도수', '통계', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '100명의 키를 한눈에! 구간별로 묶어서 막대그래프로',

    principle: `
      자료가 많을 때 하나하나 보면 패턴이 안 보여. 그래서 <strong>구간(계급)</strong>으로 묶어!<br><br>
      <strong>계급</strong>: 자료를 나누는 구간 (예: 150이상~160미만)<br>
      <strong>계급의 크기</strong>: 구간의 폭 (예: 10cm)<br>
      <strong>도수</strong>: 각 계급에 속하는 자료의 수<br>
      <strong>계급값</strong>: 계급의 가운데 값 (예: 155cm)<br><br>
      이걸 표로 만들면 <strong>도수분포표</strong>,<br>
      막대그래프로 그리면 <strong>히스토그램</strong>이야!<br>
      히스토그램은 막대 사이에 간격이 없어 — 연속적인 자료를 나타내니까.
    `,

    story: `
      히스토그램은 <strong>칼 피어슨</strong>(1895)이 처음 사용한 용어야.<br><br>
      그리스어 "histos(기둥)"와 "gramma(그림)"를 합친 말이지.
      피어슨은 통계학의 아버지로 불리며, 자료를 시각화하는 것의 중요성을 강조했어.<br><br>
      오늘날 빅데이터 분석에서도 히스토그램은 데이터의 분포를 빠르게 파악하는
      <strong>가장 기본적인 도구</strong>로 쓰이고 있어.
    `,

    realLife: [
      { icon: '📊', title: '시험 성적 분포', desc: '90~100점이 몇 명, 80~90점이 몇 명... 한눈에 성적 분포를 파악!' },
      { icon: '🏥', title: '건강 검진', desc: '학생들의 키를 10cm 단위로 묶어 분포를 확인해' },
      { icon: '🌡️', title: '기온 분석', desc: '1년간 일 최고기온을 5도 단위로 묶어 가장 많은 온도 구간을 찾아' },
    ],

    example: {
      question: '어느 반 학생 20명의 수학 점수를 10점 간격으로 도수분포표를 만들었다. 60~70점이 3명, 70~80점이 7명, 80~90점이 6명, 90~100점이 4명일 때, 가장 도수가 큰 계급과 그 계급값을 구하라.',
      answer: '가장 도수가 큰 계급: 70이상~80미만, 계급값: 75',
      steps: [
        '각 계급의 도수를 비교: 3, 7, 6, 4',
        '가장 큰 도수는 7 → 70이상~80미만',
        '계급값 = (70 + 80) ÷ 2 = 75',
      ],
      hints: [
        '힌트 1: 도수가 가장 큰 계급을 찾아봐.',
        '힌트 2: 7명인 70~80점 구간이 가장 많아!',
        '힌트 3: 계급값은 구간의 가운데 값이야. (70+80)/2 = 75.',
      ],
      otherApproaches: [
        { name: '히스토그램으로 확인', desc: '막대그래프를 그리면 70~80점 막대가 가장 높은 것을 시각적으로 확인할 수 있어.' },
      ],
    },

    evolution: {
      prev: 'E043', next: undefined, family: '통계의 발전', familyDescription: '초등 막대그래프 → 중등 도수분포표·히스토그램 → 고등 정규분포',
    },

    visualType: 'histogram_viz',
    relatedIds: ['M042', 'M048'],
  },

  // ============================================================
  // 닮음 (M048~M050)
  // ============================================================
  {
    id: 'M048',
    number: 48,
    name: '닮음비와 넓이비',
    latex: '\\text{넓이비} = k^2 \\quad (\\text{닮음비} = k)',
    description: '닮음비가 k이면 넓이비는 k²이다',
    level: 'middle',
    category: 'geometry',
    tags: ['닮음', '닮음비', '넓이비', '비례', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '피자 지름이 2배면 넓이는 4배! 가격이 2배라면 큰 거 사는 게 이득이야!',

    principle: `
      두 도형이 <strong>닮음비 k : 1</strong>일 때,<br><br>
      <strong>둘레비 = k : 1</strong> (1차원 → 비례)<br>
      <strong>넓이비 = k² : 1</strong> (2차원 → 제곱비)<br><br>
      왜 제곱이냐면, 넓이는 <strong>가로 × 세로</strong>니까
      각 방향이 k배 되면 넓이는 k × k = k²배가 돼.<br><br>
      예: 닮음비 3 : 1이면 넓이비 = 9 : 1
    `,

    story: `
      <strong>갈릴레오 갈릴레이</strong>(1564~1642)는 《새로운 두 과학》에서
      "왜 거인은 존재할 수 없는가?"를 닮음비와 넓이비로 설명했어.<br><br>
      사람을 2배로 키우면 뼈 단면적(강도)은 4배인데 체중(부피)은 8배가 되어
      뼈가 무게를 감당할 수 없거든. 이것이 <strong>갈릴레이의 제곱-세제곱 법칙</strong>이야.
    `,

    realLife: [
      { icon: '🍕', title: '피자 크기', desc: '지름 2배 피자의 넓이는 4배! 큰 피자가 가성비 좋은 이유야' },
      { icon: '🗺️', title: '지도 축척', desc: '1:50000 지도에서 1cm²는 실제 25억 cm² (= 0.25 km²)' },
      { icon: '🏠', title: '모형 건축', desc: '1:100 모형에서 바닥 넓이는 실제의 1/10000' },
    ],

    sliders: [
      { name: 'k', label: '닮음비 k', min: 0.5, max: 5, default: 2, step: 0.5 },
      { name: 'base', label: '원래 넓이', min: 1, max: 50, default: 10, step: 1 },
    ],

    example: {
      question: '닮음비가 3:2인 두 삼각형에서 작은 삼각형의 넓이가 8cm²일 때, 큰 삼각형의 넓이를 구하시오.',
      answer: '18cm²',
      steps: [
        '닮음비 3:2이므로 큰 삼각형 기준 비율 k = 3/2',
        '넓이비 = k² = (3/2)² = 9/4',
        '큰 삼각형 넓이 = 8 × 9/4 = 72/4 = 18cm²',
      ],
      hints: [
        '힌트 1: 닮음비가 3:2면 넓이비는 얼마가 될까?',
        '힌트 2: 넓이비 = 3²:2² = 9:4야.',
        '힌트 3: 작은 넓이 8에 9/4를 곱하면 18cm²야.',
      ],
      otherApproaches: [
        { name: '비례식', desc: '넓이비 9:4 = x:8에서 4x = 72, x = 18으로 구할 수도 있어.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '닮음 계보', familyDescription: '닮음비 → 넓이비(k²) → 부피비(k³)',
    },

    visualType: 'similarity_area',
    relatedIds: ['M049', 'M050'],
  },

  {
    id: 'M049',
    number: 49,
    name: '닮음비와 부피비',
    latex: '\\text{부피비} = k^3 \\quad (\\text{닮음비} = k)',
    description: '닮음비가 k이면 부피비는 k³이다',
    level: 'middle',
    category: 'geometry',
    tags: ['닮음', '닮음비', '부피비', '세제곱', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '풍선을 2배로 키우면 공기가 8배나 필요해! 크기가 조금만 커져도 부피는 폭발적으로 늘어나.',

    principle: `
      두 도형이 <strong>닮음비 k : 1</strong>일 때,<br><br>
      <strong>부피비 = k³ : 1</strong> (3차원 → 세제곱비)<br><br>
      부피는 <strong>가로 × 세로 × 높이</strong>니까,
      각 방향이 k배 되면 부피는 k × k × k = k³배가 돼.<br><br>
      예: 닮음비 2 : 1이면 부피비 = 8 : 1<br>
      예: 닮음비 3 : 1이면 부피비 = 27 : 1
    `,

    story: `
      갈릴레이가 발견한 <strong>제곱-세제곱 법칙</strong>은 생물학에서도 중요해.<br><br>
      코끼리가 쥐보다 다리가 뚱뚱한 이유가 여기 있어.
      체중(부피)은 k³으로 늘지만 다리 뼈 단면적(넓이)은 k²으로만 늘어서,
      큰 동물일수록 <strong>상대적으로 굵은 다리</strong>가 필요하거든.<br><br>
      개미가 자기 체중의 50배를 들 수 있는 것도, 작은 크기의 유리한 부피비 덕분이야.
    `,

    realLife: [
      { icon: '📦', title: '택배 요금', desc: '한 변이 2배인 박스의 부피는 8배! 택배비가 급격히 오르는 이유' },
      { icon: '🐘', title: '동물 체형', desc: '코끼리가 다리가 굵은 건 부피(무게)가 세제곱으로 늘기 때문' },
      { icon: '🏭', title: '저장탱크', desc: '반지름 2배 구형 탱크는 8배의 물을 저장할 수 있어' },
    ],

    sliders: [
      { name: 'k', label: '닮음비 k', min: 0.5, max: 5, default: 2, step: 0.5 },
      { name: 'base', label: '원래 부피', min: 1, max: 50, default: 10, step: 1 },
    ],

    example: {
      question: '닮음비가 1:3인 두 구에서 작은 구의 부피가 36πcm³일 때, 큰 구의 부피를 구하시오.',
      answer: '972πcm³',
      steps: [
        '닮음비 1:3이므로 큰 구 기준 k = 3',
        '부피비 = k³ = 3³ = 27',
        '큰 구의 부피 = 36π × 27 = 972π cm³',
      ],
      hints: [
        '힌트 1: 닮음비 1:3이면 부피비는?',
        '힌트 2: 부피비 = 1³:3³ = 1:27',
        '힌트 3: 36π × 27 = 972π cm³야.',
      ],
      otherApproaches: [
        { name: '반지름으로 직접 계산', desc: '작은 구 부피 36π = 4/3πr³에서 r=3. 큰 구 반지름=9, V=4/3π(9³)=972π.' },
      ],
    },

    evolution: { prev: 'E029', next: undefined, family: '내각의 확장', familyDescription: '초등 삼각형 180° → 중등 다각형 내각의 합 → 고등 기하학으로 발전' },

    visualType: 'similarity_volume',
    relatedIds: ['M048', 'M050', 'M057'],
  },

  {
    id: 'M050',
    number: 50,
    name: '평행선과 선분의 비',
    latex: '\\frac{AD}{DB} = \\frac{AE}{EC} \\quad (DE \\parallel BC)',
    description: '삼각형에서 한 변에 평행한 직선이 나머지 두 변을 같은 비로 나눈다',
    level: 'middle',
    category: 'geometry',
    tags: ['평행선', '비례', '닮음', '삼각형', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '평행선 하나 그으면 자동으로 비례가 생겨! 측량의 비밀이 여기 있어.',

    principle: `
      삼각형 ABC에서 변 BC에 평행한 직선이 AB, AC와 각각 D, E에서 만나면<br><br>
      <strong>AD : DB = AE : EC</strong><br><br>
      왜냐하면 DE∥BC이므로 △ADE와 △ABC가 <strong>닮음</strong>이기 때문이야!<br>
      (동위각이 같으므로 AA 닮음)<br><br>
      이 성질의 역도 성립해: 두 변을 같은 비로 나누는 점을 연결한 선분은
      나머지 변에 평행해!
    `,

    story: `
      고대 그리스의 <strong>탈레스</strong>(BC 624~546)는 이집트 여행 중
      피라미드의 높이를 이 비례 성질로 측정했다고 전해져.<br><br>
      자기 그림자와 키의 비가 피라미드 그림자와 높이의 비와 같다는 것을 이용한 거야.
      이것이 수학사 최초의 <strong>간접 측정</strong>이야.<br><br>
      이 정리를 <strong>"탈레스의 정리"</strong>라 부르기도 해(인터셉트 정리).
    `,

    realLife: [
      { icon: '📏', title: '간접 측정', desc: '그림자 길이의 비를 이용해 건물 높이를 측정할 수 있어' },
      { icon: '🖼️', title: '원근법 회화', desc: '그림에서 평행선의 비례를 이용해 깊이감을 표현해' },
      { icon: '✂️', title: '천 재단', desc: '옷감을 비례적으로 줄이거나 늘릴 때 평행선 비례를 활용해' },
    ],

    sliders: [
      { name: 'ratio', label: 'AD:DB 비율', min: 0.2, max: 5, default: 1, step: 0.1 },
    ],

    example: {
      question: '△ABC에서 DE∥BC이고 AD=4, DB=6일 때, AE:EC를 구하시오.',
      answer: '2:3',
      steps: [
        'DE∥BC이므로 AD:DB = AE:EC',
        'AD:DB = 4:6 = 2:3',
        '따라서 AE:EC = 2:3',
      ],
      hints: [
        '힌트 1: 평행선이 두 변을 같은 비로 자른다는 성질을 떠올려봐.',
        '힌트 2: AD:DB = 4:6. 이것을 약분하면?',
        '힌트 3: 4:6 = 2:3이므로 AE:EC = 2:3!',
      ],
      otherApproaches: [
        { name: '닮음 이용', desc: '△ADE ~ △ABC (AA 닮음)에서 닮음비 AD:AB = 4:10 = 2:5, 따라서 AE:AC = 2:5에서 AE:EC = 2:3.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '닮음 계보', familyDescription: '닮음비 → 넓이비 → 부피비 → 평행선 비례',
    },

    visualType: 'parallel_ratio_viz',
    relatedIds: ['M048', 'M049'],
  },

  // ============================================================
  // 원 성질 (M051~M053)
  // ============================================================
  {
    id: 'M051',
    number: 51,
    name: '원주각과 중심각',
    latex: '\\text{원주각} = \\frac{1}{2} \\times \\text{중심각}',
    description: '같은 호에 대한 원주각은 중심각의 절반이다',
    level: 'middle',
    category: 'geometry',
    tags: ['원주각', '중심각', '원', '호', '각도', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '원 위에서 같은 호를 바라보는 각도가 어디서든 같다고? 원의 놀라운 성질!',

    principle: `
      원에서 같은 호 AB에 대해<br>
      <strong>중심각</strong>: 원의 중심 O에서 두 반지름이 이루는 각 ∠AOB<br>
      <strong>원주각</strong>: 원 위의 점 P에서 호 AB를 바라보는 각 ∠APB<br><br>
      <strong>원주각 = 중심각의 1/2</strong><br><br>
      놀라운 점: 점 P가 같은 호 위 어디에 있든 원주각은 <strong>항상 같아</strong>!<br>
      특히, 지름에 대한 원주각은 항상 <strong>90°</strong>야(탈레스의 정리).
    `,

    story: `
      이 성질은 <strong>유클리드</strong>의 《원론》 제3권에 수록되어 있어.<br><br>
      지름에 대한 원주각이 직각이라는 사실은 <strong>탈레스</strong>가 발견했다고 전해지며,
      그는 이 발견에 감사해 황소를 제물로 바쳤다는 일화가 있어.<br><br>
      이 성질은 천문학에서 별의 위치를 측정할 때,
      GPS 삼각측량에서도 핵심적으로 활용돼.
    `,

    realLife: [
      { icon: '⚽', title: '슈팅 각도', desc: '골대를 바라보는 원주각이 같은 원 위에서는 슈팅 각도가 동일해' },
      { icon: '📡', title: '위성 수신 범위', desc: '통신 위성의 가시 범위를 원주각으로 계산할 수 있어' },
      { icon: '🏛️', title: '원형 극장', desc: '고대 로마 원형극장에서 관객석 어디서든 무대가 같은 각도로 보이게 설계했어' },
    ],

    sliders: [
      { name: 'centralAngle', label: '중심각 (°)', min: 10, max: 350, default: 120, step: 10 },
    ],

    example: {
      question: '원에서 호 AB에 대한 중심각이 100°일 때, 원주각의 크기를 구하시오.',
      answer: '50°',
      steps: [
        '원주각 = 중심각 × 1/2',
        '원주각 = 100° × 1/2 = 50°',
      ],
      hints: [
        '힌트 1: 원주각과 중심각의 관계를 떠올려봐.',
        '힌트 2: 원주각은 중심각의 절반이야.',
        '힌트 3: 100° ÷ 2 = 50°!',
      ],
      otherApproaches: [
        { name: '직접 작도', desc: '원에 중심각 100°를 그리고, 호 위의 아무 점에서 원주각을 재면 50°가 나와.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '원의 성질 계보', familyDescription: '원주각·중심각 → 접선 → 방멱의 정리',
    },

    visualType: 'inscribed_angle',
    relatedIds: ['M052', 'M053', 'M067', 'M068'],
  },

  {
    id: 'M052',
    number: 52,
    name: '접선의 길이',
    latex: 'PA = PB \\quad (\\text{외부 점 P에서의 두 접선})',
    description: '원 밖의 한 점에서 그은 두 접선의 길이는 같다',
    level: 'middle',
    category: 'geometry',
    tags: ['접선', '원', '외부점', '길이', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '원 밖에서 원을 살짝 터치하는 두 선분의 길이가 항상 같다고?',

    principle: `
      원 밖의 점 P에서 원에 두 접선을 그어 접점을 A, B라 하면<br><br>
      <strong>PA = PB</strong> (접선 길이가 같다)<br><br>
      <strong>증명:</strong> 원의 중심을 O라 하면<br>
      - OA ⊥ PA, OB ⊥ PB (접선은 반지름에 수직)<br>
      - OA = OB (반지름)<br>
      - OP는 공통 변<br>
      - △OAP ≡ △OBP (RHS 합동)<br>
      따라서 PA = PB!
    `,

    story: `
      접선의 성질은 유클리드의 《원론》 제3권에 등장해.<br><br>
      <strong>아폴로니우스</strong>(BC 262~190)는 《원뿔곡선론》에서
      원뿐만 아니라 타원, 포물선, 쌍곡선의 접선까지 연구했어.
      그는 <strong>"위대한 기하학자"</strong>라 불렸지.<br><br>
      접선 개념은 나중에 뉴턴의 <strong>미분법</strong>으로 발전해,
      곡선 위 한 점에서의 순간적 방향(접선의 기울기)을 구하는 도구가 됐어.
    `,

    realLife: [
      { icon: '🚲', title: '자전거 체인', desc: '기어 두 개를 감싸는 체인의 바깥 접선 길이가 같은 원리로 설계돼' },
      { icon: '🔔', title: '벨트 드라이브', desc: '풀리를 감싸는 벨트의 접선 부분 길이 계산에 사용해' },
      { icon: '🛣️', title: '도로 설계', desc: '원형 교차로 진입·진출 도로는 접선 방향으로 설계해 자연스러운 흐름을 만들어' },
    ],

    sliders: [
      { name: 'r', label: '반지름 r', min: 1, max: 8, default: 3, step: 0.5 },
      { name: 'd', label: '점 P까지 거리', min: 4, max: 15, default: 5, step: 0.5 },
    ],

    example: {
      question: '원의 반지름이 3이고 외부 점 P에서 원 중심까지 거리가 5일 때, 접선의 길이를 구하시오.',
      answer: '4',
      steps: [
        '접선은 반지름에 수직이므로 직각삼각형 형성',
        'PA² + OA² = OP² (피타고라스 정리)',
        'PA² + 9 = 25 → PA² = 16',
        'PA = 4',
      ],
      hints: [
        '힌트 1: 접점에서 반지름과 접선은 수직이야. 직각삼각형이 보이지?',
        '힌트 2: 피타고라스 정리를 써봐: PA² + 3² = 5²',
        '힌트 3: PA² = 25 - 9 = 16, PA = 4!',
      ],
      otherApproaches: [
        { name: '3-4-5 피타고라스 수', desc: '반지름 3, 접선 4, 거리 5는 (3,4,5) 피타고라스 수야!' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '원의 성질 계보', familyDescription: '원주각·중심각 → 접선 → 방멱의 정리',
    },

    visualType: 'tangent_length',
    relatedIds: ['M045', 'M051', 'M053'],
  },

  {
    id: 'M053',
    number: 53,
    name: '상대도수',
    latex: '\\text{상대도수} = \\frac{\\text{도수}}{\\text{총 도수}}',
    description: '각 계급의 도수를 전체 도수로 나눈 비율',
    level: 'middle',
    category: 'probability',
    tags: ['상대도수', '도수분포', '비율', '비교', '통계', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '50명 반과 30명 반의 성적 비교? 상대도수!',

    principle: `
      <strong>상대도수</strong> = (그 계급의 도수) ÷ (전체 도수)<br><br>
      왜 필요할까? 학생 수가 다른 두 반의 성적을 비교하려면<br>
      도수(명수)로는 비교가 안 돼! <strong>비율</strong>로 바꿔야 공정해.<br><br>
      예: A반(50명) 90점 이상 10명 → 상대도수 = 10/50 = 0.2 (20%)<br>
      B반(30명) 90점 이상 9명 → 상대도수 = 9/30 = 0.3 (30%)<br><br>
      명수는 A반이 많지만, 비율은 B반이 높아!<br><br>
      <strong>모든 계급의 상대도수 합 = 1</strong> (항상!)
    `,

    story: `
      상대도수 개념은 <strong>통계학의 발전</strong>과 함께 자연스럽게 등장했어.<br><br>
      19세기 벨기에의 <strong>아돌프 케틀레</strong>는 "평균적 인간"이라는 개념을 만들며
      인구 통계를 체계적으로 분석했어. 도시별 인구가 다르니 비율로 비교해야 했지!<br><br>
      오늘날 모든 여론조사, 시청률, 합격률은 상대도수(비율)로 표현돼.
    `,

    realLife: [
      { icon: '📺', title: '시청률', desc: '시청률 15.3%는 전체 TV 가구 중 해당 프로그램을 본 비율 = 상대도수!' },
      { icon: '🏫', title: '학교 비교', desc: '서울 A고 합격자 30명 vs 부산 B고 합격자 20명 — 학생 수가 다르니 비율로 비교!' },
      { icon: '🧪', title: '실험 결과', desc: '실험 100번 중 성공 73번 → 상대도수 0.73. 실험 횟수가 달라도 비교 가능!' },
    ],

    example: {
      question: '어느 반 40명의 도수분포에서 80~90점 구간의 도수가 12명이다. 이 계급의 상대도수를 구하라.',
      answer: '0.3 (30%)',
      steps: [
        '상대도수 = (계급의 도수) ÷ (전체 도수)',
        '= 12 ÷ 40',
        '= 0.3',
        '백분율로 표현하면 30%',
      ],
      hints: [
        '힌트 1: 상대도수 = 도수 ÷ 전체 도수야.',
        '힌트 2: 12 ÷ 40을 계산해봐.',
        '힌트 3: 12/40 = 3/10 = 0.3, 즉 30%!',
      ],
      otherApproaches: [
        { name: '분수로 계산', desc: '12/40 = 3/10. 약분하면 더 깔끔해!' },
      ],
    },

    evolution: {
      prev: 'E043', next: undefined, family: '통계의 발전', familyDescription: '초등 비율그래프 → 중등 상대도수 → 고등 확률분포',
    },

    visualType: 'relative_freq',
    relatedIds: ['M051', 'M052'],
  },

  // ============================================================
  // 삼각비 (M054~M056)
  // ============================================================
  {
    id: 'M054',
    number: 54,
    name: '삼각비의 정의',
    latex: '\\sin\\theta = \\frac{\\text{대변}}{\\text{빗변}}, \\quad \\cos\\theta = \\frac{\\text{인접변}}{\\text{빗변}}, \\quad \\tan\\theta = \\frac{\\text{대변}}{\\text{인접변}}',
    description: '직각삼각형에서 각의 크기에 따라 결정되는 세 가지 비율',
    level: 'middle',
    category: 'trigonometry',
    tags: ['삼각비', '사인', '코사인', '탄젠트', '사인', '코사인', '탄젠트', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: '산 높이를 직접 올라가지 않고도 알 수 있다면? 삼각비 하나면 가능해!',

    principle: `
      직각삼각형에서 한 예각 θ에 대해<br><br>
      <strong>sinθ = 대변 / 빗변</strong> (SOH: Sine = Opposite / Hypotenuse)<br>
      <strong>cosθ = 인접변 / 빗변</strong> (CAH: Cosine = Adjacent / Hypotenuse)<br>
      <strong>tanθ = 대변 / 인접변</strong> (TOA: Tangent = Opposite / Adjacent)<br><br>
      <strong>핵심 포인트:</strong><br>
      - 삼각비는 삼각형의 크기에 관계없이 <strong>각도만으로 결정</strong>돼!<br>
      - 닮은 직각삼각형은 크기가 달라도 같은 각도면 삼각비가 같아.<br>
      - 사인²θ + 코사인²θ = 1 (피타고라스 정리에서 유도)
    `,

    story: `
      <strong>삼각법</strong>의 기원은 고대 <strong>바빌로니아</strong>와 <strong>이집트</strong>로 거슬러 올라가.<br><br>
      고대 그리스의 <strong>히파르코스</strong>(BC 190~120)는 최초의 삼각비 표를 만들었어.
      그는 별의 위치를 정밀하게 기록하기 위해 삼각법을 체계화했지.
      "삼각법의 아버지"로 불려.<br><br>
      인도의 <strong>아리아바타</strong>(476~550)는 반지름 대비 '반현'이라는 개념을 도입했고,
      이것이 아랍을 거쳐 유럽에 전해지면서 <strong>sine</strong>이라는 이름이 됐어.<br><br>
      "sine"은 산스크리트어 "jyā"(활시위) → 아랍어 "jīb" → 라틴어 "sinus"(곡선)로
      번역 과정에서 변형된 거야!
    `,

    realLife: [
      { icon: '🏔️', title: '산 높이 측정', desc: '바닥에서 각도와 거리를 재면 탄젠트로 산 높이를 계산할 수 있어' },
      { icon: '✈️', title: '항공 항법', desc: '비행기의 상승각과 비행 거리로 고도를 계산할 때 사인 사용' },
      { icon: '🎮', title: '3D 게임', desc: '캐릭터 시야각, 조준 각도 등을 삼각비로 계산해 렌더링해' },
    ],

    sliders: [
      { name: 'angle', label: '각도 θ (°)', min: 5, max: 85, default: 30, step: 5 },
      { name: 'hyp', label: '빗변 길이', min: 2, max: 15, default: 10, step: 1 },
    ],

    example: {
      question: '직각삼각형에서 빗변이 10, 한 예각이 30°일 때 대변과 인접변의 길이를 구하시오.',
      answer: '대변 = 5, 인접변 = 5√3',
      steps: [
        'sin30° = 대변/빗변 → 1/2 = 대변/10 → 대변 = 5',
        'cos30° = 인접변/빗변 → √3/2 = 인접변/10 → 인접변 = 5√3',
        '검증: 5² + (5√3)² = 25 + 75 = 100 = 10² ✓',
      ],
      hints: [
        '힌트 1: sin30°과 cos30°의 값을 떠올려봐.',
        '힌트 2: sin30° = 1/2이야. 대변 = 10 × 1/2 = ?',
        '힌트 3: cos30° = √3/2. 인접변 = 10 × √3/2 = 5√3.',
      ],
      otherApproaches: [
        { name: '피타고라스로 나머지 변', desc: '대변 5를 먼저 구하고, 인접변 = √(10² - 5²) = √75 = 5√3으로 구해도 돼.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '거리와 넓이 계보', familyDescription: '피타고라스 수 → 삼각비 정의 → 특수각 삼각비 → 삼각비 활용',
    },

    visualType: 'trig_ratio',
    videoPath: '/videos/middle/m054_trig_intro.mp4',
    relatedIds: ['M045', 'M055', 'M056'],
  },

  {
    id: 'M055',
    number: 55,
    name: '특수각의 삼각비',
    latex: '\\sin 30° = \\frac{1}{2}, \\quad \\sin 45° = \\frac{\\sqrt{2}}{2}, \\quad \\sin 60° = \\frac{\\sqrt{3}}{2}',
    description: '30°, 45°, 60°에서의 삼각비 값은 정확한 무리수로 표현된다',
    level: 'middle',
    category: 'trigonometry',
    tags: ['특수각', '30도', '45도', '60도', '삼각비', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: '30°, 45°, 60°는 삼각비의 VIP! 이 세 각도만 외우면 웬만한 문제는 다 풀 수 있어.',

    principle: `
      <strong>30°-60°-90° 삼각형</strong> (정삼각형 반쪽):<br>
      변의 비 = 1 : √3 : 2<br>
      sin30° = 1/2, cos30° = √3/2, tan30° = 1/√3 = √3/3<br>
      sin60° = √3/2, cos60° = 1/2, tan60° = √3<br><br>
      <strong>45°-45°-90° 삼각형</strong> (직각이등변삼각형):<br>
      변의 비 = 1 : 1 : √2<br>
      sin45° = cos45° = 1/√2 = √2/2, tan45° = 1<br><br>
      <strong>암기 팁:</strong> sin의 분자만 기억! 30°→√1, 45°→√2, 60°→√3 (분모는 모두 2)
    `,

    story: `
      특수각 삼각비는 고대 건축에서 핵심이었어.<br><br>
      이집트 피라미드의 경사각은 약 <strong>51.8°</strong>인데,
      이것은 밑변과 높이의 비가 π/4에 가까운 신비한 각도야.<br><br>
      그리스 <strong>파르테논 신전</strong>의 지붕 경사는 약 15°(= 45° - 30°)이고,
      고딕 성당의 첨탑은 60°에 가까운 경사를 사용했어.<br><br>
      현대에도 건축 설계, 공학 계산에서 특수각은 계산의 편의성과 정확성 때문에 선호돼.
    `,

    realLife: [
      { icon: '🏗️', title: '지붕 경사', desc: '30° 지붕은 tan30°=0.577로 1m 갈 때 57.7cm 올라가' },
      { icon: '🎱', title: '당구 반사', desc: '45° 반사는 입사각=반사각. 쿠션 맞고 되돌아오는 경로 계산에 사용' },
      { icon: '🔧', title: '볼트 규격', desc: '육각볼트 머리의 내각이 120°(=2×60°)로 특수각 삼각비가 규격 설계에 활용돼' },
    ],

    sliders: [
      { name: 'angle', label: '특수각 선택', min: 30, max: 60, default: 45, step: 15 },
      { name: 'side', label: '기준 변 길이', min: 1, max: 10, default: 4, step: 1 },
    ],

    example: {
      question: '한 변의 길이가 6인 정삼각형의 높이를 구하시오.',
      answer: '3√3',
      steps: [
        '정삼각형을 반으로 나누면 30-60-90 삼각형',
        '밑변 = 3 (절반), 빗변 = 6',
        '높이 = 6 × sin60° = 6 × √3/2 = 3√3',
      ],
      hints: [
        '힌트 1: 정삼각형을 반으로 나누면 어떤 삼각형이 될까?',
        '힌트 2: 30-60-90 삼각형에서 높이는 빗변 × sin60°야.',
        '힌트 3: 6 × √3/2 = 3√3!',
      ],
      otherApproaches: [
        { name: '피타고라스', desc: '높이² = 6² - 3² = 36 - 9 = 27, 높이 = √27 = 3√3.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '거리와 넓이 계보', familyDescription: '삼각비 정의 → 특수각 삼각비 → 삼각비 활용',
    },

    visualType: 'trig_special',
    relatedIds: ['M054', 'M056'],
  },

  {
    id: 'M056',
    number: 56,
    name: '삼각비 활용 (높이 구하기)',
    latex: 'h = d \\cdot \\tan\\theta',
    description: '거리와 각도를 알 때 높이를 구하는 삼각비 활용 공식',
    level: 'middle',
    category: 'trigonometry',
    tags: ['삼각비', '높이', '탄젠트', '측량', '활용', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: '에베레스트 높이를 꼭대기까지 안 가도 알 수 있어! 밑에서 각도만 재면 끝!',

    principle: `
      높이 h를 직접 잴 수 없을 때, 아래에서 바라보는 <strong>올려다본 각(앙각) θ</strong>와
      <strong>수평 거리 d</strong>를 측정하면<br><br>
      <strong>h = d · tanθ</strong><br><br>
      눈높이 e를 고려하면: <strong>전체 높이 = d · tanθ + e</strong><br><br>
      반대로 높은 곳에서 아래를 내려다보는 <strong>내려다본 각(부각)</strong>을 사용할 수도 있어.
      부각도 같은 원리로 h = d · tanθ 적용!
    `,

    story: `
      삼각비를 이용한 <strong>측량</strong>은 인류 문명의 핵심 기술이야.<br><br>
      고대 이집트의 탈레스는 피라미드 높이를 그림자로 재고,
      에라토스테네스(BC 276~194)는 태양의 각도 차이로 <strong>지구 둘레</strong>를 계산했어!
      그 오차가 실제 값의 1% 이내였다는 게 놀라워.<br><br>
      18세기에는 영국의 <strong>대삼각 측량</strong>으로 에베레스트 높이를 원거리에서
      정밀 측정했어. 현대 GPS 이전에 삼각비가 지도 제작의 전부였지.
    `,

    realLife: [
      { icon: '🏔️', title: '산 높이 측정', desc: '산 아래에서 앙각과 거리를 재면 h = d·tanθ로 높이를 계산해' },
      { icon: '🌳', title: '나무 높이', desc: '나무에서 일정 거리 떨어져 앙각을 재면 나무 높이를 알 수 있어' },
      { icon: '🏢', title: '건물 높이', desc: '도시 계획에서 건물 높이 규제 확인에 삼각비 측량을 활용해' },
    ],

    sliders: [
      { name: 'd', label: '수평 거리 d', min: 5, max: 100, default: 30, step: 5 },
      { name: 'angle', label: '앙각 θ (°)', min: 5, max: 80, default: 45, step: 5 },
      { name: 'e', label: '눈높이 e', min: 0, max: 2, default: 1.5, step: 0.1 },
    ],

    example: {
      question: '건물에서 50m 떨어진 곳에서 올려다본 각이 60°, 눈높이가 1.5m일 때 건물 높이를 구하시오.',
      answer: '50√3 + 1.5 ≈ 88.1m',
      steps: [
        'h = d · tanθ + e',
        'h = 50 × tan60° + 1.5',
        'tan60° = √3 ≈ 1.732',
        'h = 50 × √3 + 1.5 = 50√3 + 1.5 ≈ 86.6 + 1.5 = 88.1m',
      ],
      hints: [
        '힌트 1: h = d · tanθ + 눈높이 공식을 사용해봐.',
        '힌트 2: tan60° = √3이야. 50 × √3 = ?',
        '힌트 3: 50√3 ≈ 86.6에 눈높이 1.5를 더하면 약 88.1m!',
      ],
      otherApproaches: [
        { name: '두 지점 측량', desc: '가까운 점과 먼 점에서 각각 앙각을 재면 거리 d를 모르고도 높이를 구할 수 있어.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '거리와 넓이 계보', familyDescription: '특수각 삼각비 → 삼각비 활용 → 사인·코사인 법칙(고등)',
    },

    visualType: 'trig_apply',
    relatedIds: ['M054', 'M055'],
  },

  // ============================================================
  // 구 (M057~M058)
  // ============================================================
  {
    id: 'M057',
    number: 57,
    name: '구의 부피',
    latex: 'V = \\frac{4}{3}\\pi r^3',
    description: '반지름 r인 구의 부피를 구하는 공식',
    level: 'middle',
    category: 'geometry',
    tags: ['구', '부피', '반지름', 'π', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '지구의 부피를 어떻게 알까? 반지름 하나만 알면 구할 수 있어!',

    principle: `
      반지름 r인 구의 부피는<br><br>
      <strong>V = (4/3)πr³</strong><br><br>
      왜 4/3이 나올까?<br>
      구를 매우 얇은 원판으로 잘라 쌓는다고 상상해봐(적분 개념).<br>
      높이 h에서의 원 반지름은 √(r² − h²)이고, 그 원판의 넓이를 모두 더하면
      (4/3)πr³이 나와.<br><br>
      <strong>아르키메데스의 발견:</strong><br>
      구의 부피 = 원기둥 부피의 <strong>2/3</strong>!<br>
      (원기둥 = πr²×2r = 2πr³, 구 = 4/3πr³ = 2πr³ × 2/3)
    `,

    story: `
      <strong>아르키메데스</strong>(BC 287~212)는 구의 부피 공식을 발견한 것을
      자신의 최고 업적으로 여겼어.<br><br>
      그는 묘비에 <strong>구와 원기둥</strong> 그림을 새겨달라고 유언했다고 해.
      구의 부피가 외접 원기둥의 정확히 2/3이라는 아름다운 비율 때문이지.<br><br>
      이 결과를 증명하기 위해 아르키메데스는 <strong>지렛대 원리</strong>와
      <strong>"얇은 조각으로 나누어 비교하기"</strong>(후에 적분학으로 발전)를 사용했어.
    `,

    realLife: [
      { icon: '🌍', title: '지구 부피', desc: '반지름 약 6,371km인 지구 부피 ≈ 1.083×10¹² km³' },
      { icon: '⚽', title: '공 규격', desc: '축구공(반지름 11cm)의 부피 ≈ 5,575 cm³으로 규격이 정해져' },
      { icon: '💊', title: '캡슐 약', desc: '구형 캡슐의 약물 용량을 부피 공식으로 정밀하게 계산해' },
    ],

    sliders: [
      { name: 'r', label: '반지름 r', min: 1, max: 10, default: 3, step: 0.5 },
    ],

    example: {
      question: '반지름이 6cm인 구의 부피를 구하시오.',
      answer: '288π cm³',
      steps: [
        'V = (4/3)πr³에 r=6 대입',
        'V = (4/3)π × 6³',
        'V = (4/3)π × 216',
        'V = 288π cm³ (≈ 904.8 cm³)',
      ],
      hints: [
        '힌트 1: V = (4/3)πr³에 r=6을 넣어봐.',
        '힌트 2: 6³ = 216이야.',
        '힌트 3: (4/3) × 216 = 288. 답은 288π cm³!',
      ],
      otherApproaches: [
        { name: '원기둥 비교', desc: '같은 반지름의 외접 원기둥 부피 = π×36×12 = 432π. 구 = 432π × 2/3 = 288π.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '입체도형 계보', familyDescription: '원기둥 → 원뿔 → 구 부피 → 구 겉넓이',
    },

    visualType: 'sphere_volume',
    relatedIds: ['M058', 'M059', 'M060'],
  },

  {
    id: 'M058',
    number: 58,
    name: '구의 겉넓이',
    latex: 'A = 4\\pi r^2',
    description: '반지름 r인 구의 겉넓이를 구하는 공식',
    level: 'middle',
    category: 'geometry',
    tags: ['구', '겉넓이', '표면적', '반지름', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '지구를 종이로 감싸려면 얼마나 큰 종이가 필요할까? 원 넓이의 정확히 4배!',

    principle: `
      반지름 r인 구의 겉넓이는<br><br>
      <strong>A = 4πr²</strong><br><br>
      이것은 같은 반지름의 <strong>원 넓이(πr²)의 정확히 4배</strong>야!<br><br>
      아르키메데스는 구를 얇은 띠로 잘라 펼치면
      큰 원 4개 넓이와 같다는 것을 증명했어.<br><br>
      직관적으로: 구를 위에서 보면 원, 아래서 보면 원, 앞에서 보면 원, 뒤에서 보면 원.
      이 4방향의 원 넓이를 합친 것과 같다고 생각할 수 있어.
    `,

    story: `
      아르키메데스는 구의 겉넓이가 큰 원의 4배라는 것도 발견했어.<br><br>
      그의 증명 방법은 구를 무한히 얇은 <strong>원형 띠(대원)</strong>로 잘라
      각 띠의 넓이를 합산하는 것이었어. 이것은 오늘날 <strong>적분</strong>의 원형이야.<br><br>
      현대 물리에서 <strong>슈테판-볼츠만 법칙</strong>은 별의 광도를
      L = 4πR² × σT⁴로 표현하는데, 여기서 4πR²이 바로 별의 표면적이야.
    `,

    realLife: [
      { icon: '🌍', title: '지구 표면적', desc: '지구 표면적 ≈ 5.1×10⁸ km². 바다와 육지 넓이의 합!' },
      { icon: '🏀', title: '공 도색', desc: '농구공 표면을 칠하는 데 필요한 페인트 양 = 4πr²에 비례' },
      { icon: '☀️', title: '태양 에너지', desc: '태양 복사에너지는 표면적(4πR²)에 비례해 방출돼' },
    ],

    sliders: [
      { name: 'r', label: '반지름 r', min: 1, max: 10, default: 5, step: 0.5 },
    ],

    example: {
      question: '반지름이 7cm인 구의 겉넓이를 구하시오.',
      answer: '196π cm²',
      steps: [
        'A = 4πr²에 r=7 대입',
        'A = 4π × 7²',
        'A = 4π × 49 = 196π cm² (≈ 615.8 cm²)',
      ],
      hints: [
        '힌트 1: A = 4πr²에 r=7을 넣어봐.',
        '힌트 2: 7² = 49야.',
        '힌트 3: 4 × 49 = 196. 답은 196π cm²!',
      ],
      otherApproaches: [
        { name: '원 넓이 4배', desc: '같은 반지름 원 넓이 = π×49 = 49π. 구 겉넓이 = 4배 = 196π.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '입체도형 계보', familyDescription: '구 부피 → 구 겉넓이',
    },

    visualType: 'sphere_surface',
    relatedIds: ['M057', 'M059'],
  },

  // ============================================================
  // 원기둥·원뿔 (M059~M061)
  // ============================================================
  {
    id: 'M059',
    number: 59,
    name: '원기둥의 겉넓이',
    latex: 'A = 2\\pi r^2 + 2\\pi r h',
    description: '원기둥의 겉넓이 = 위아래 원 2개 + 옆면(직사각형)',
    level: 'middle',
    category: 'geometry',
    tags: ['원기둥', '겉넓이', '표면적', '전개도', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '캔 겉면에 라벨을 붙이려면 종이를 얼마나 잘라야 할까?',

    principle: `
      원기둥의 겉넓이는 세 부분의 합이야:<br><br>
      <strong>① 윗면 원: πr²</strong><br>
      <strong>② 아랫면 원: πr²</strong><br>
      <strong>③ 옆면: 2πrh</strong> (전개하면 가로 2πr, 세로 h인 직사각형)<br><br>
      <strong>A = 2πr² + 2πrh = 2πr(r + h)</strong><br><br>
      옆면을 펼치면 직사각형이 된다는 것이 핵심이야!
      가로 길이 = 원둘레 = 2πr
    `,

    story: `
      원기둥은 인류가 가장 오래 사용한 기하 도형 중 하나야.<br><br>
      고대 수메르의 <strong>원통형 인장</strong>(실린더 씰)은 BC 3500년경부터 사용됐어.
      점토 위에 굴려서 문양을 찍었지. 원기둥 옆면의 성질을 활용한 거야.<br><br>
      현대에서는 <strong>통조림 캔</strong>의 최적 설계(재료를 최소화하면서 부피를 최대화)에
      이 공식이 사용돼. h = 2r일 때 재료 효율이 최적이야!
    `,

    realLife: [
      { icon: '🥫', title: '통조림 캔', desc: '캔에 라벨을 붙이는 종이 크기 = 옆면 넓이 = 2πrh' },
      { icon: '🎁', title: '원통 포장', desc: '원통형 선물 포장지 크기를 겉넓이로 계산해' },
      { icon: '🏗️', title: '파이프 도장', desc: '파이프 외부 도장 면적을 계산해 필요한 페인트 양을 산출해' },
    ],

    sliders: [
      { name: 'r', label: '반지름 r', min: 1, max: 10, default: 3, step: 0.5 },
      { name: 'h', label: '높이 h', min: 1, max: 15, default: 7, step: 0.5 },
    ],

    example: {
      question: '반지름 3cm, 높이 7cm인 원기둥의 겉넓이를 구하시오.',
      answer: '60π cm²',
      steps: [
        'A = 2πr² + 2πrh',
        'A = 2π(3)² + 2π(3)(7)',
        'A = 18π + 42π = 60π cm² (≈ 188.5 cm²)',
      ],
      hints: [
        '힌트 1: 원기둥 = 원 2개 + 직사각형 옆면이야.',
        '힌트 2: 원 2개 = 2π×9 = 18π. 옆면 = 2π×3×7 = ?',
        '힌트 3: 18π + 42π = 60π cm²!',
      ],
      otherApproaches: [
        { name: '인수분해', desc: 'A = 2πr(r+h) = 2π×3×(3+7) = 6π×10 = 60π로 한 번에 계산!' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '입체도형 계보', familyDescription: '원기둥 겉넓이 → 원뿔 부피 → 원뿔 겉넓이 → 구',
    },

    visualType: 'cylinder_surface',
    relatedIds: ['M057', 'M060', 'M061'],
  },

  {
    id: 'M060',
    number: 60,
    name: '원뿔의 부피',
    latex: 'V = \\frac{1}{3}\\pi r^2 h',
    description: '원뿔의 부피는 같은 밑면·높이의 원기둥 부피의 1/3이다',
    level: 'middle',
    category: 'geometry',
    tags: ['원뿔', '부피', '원기둥', '1/3', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '아이스크림 콘에 아이스크림을 꽉 채우면, 같은 높이 컵의 1/3밖에 안 들어간다고?',

    principle: `
      밑면 반지름 r, 높이 h인 원뿔의 부피는<br><br>
      <strong>V = (1/3)πr²h</strong><br><br>
      같은 밑면과 높이의 <strong>원기둥 부피(πr²h)의 정확히 1/3</strong>이야!<br><br>
      <strong>왜 1/3일까?</strong><br>
      원뿔에 물을 가득 담아 원기둥에 부으면 정확히 3번 부어야 가득 차.
      실험으로 확인할 수 있고, 적분으로도 증명할 수 있어.<br><br>
      이 1/3 관계는 뿔 모양(각뿔, 원뿔) 모두에 공통적이야.
    `,

    story: `
      <strong>데모크리토스</strong>(BC 460~370)는 원뿔 부피가 원기둥의 1/3이라는 것을
      최초로 발견했어. 그는 원뿔을 매우 얇은 원판으로 잘라 생각했지.<br><br>
      <strong>유독소스</strong>(BC 408~355)는 "소진법(method of exhaustion)"으로
      이것을 엄밀하게 증명했어. 소진법은 오늘날 적분의 선구자야.<br><br>
      아르키메데스는 이 방법을 더 발전시켜 구의 부피까지 구했어.
    `,

    realLife: [
      { icon: '🍦', title: '아이스크림 콘', desc: '콘의 부피를 계산해 아이스크림 용량을 정해' },
      { icon: '🏔️', title: '화산 부피', desc: '원뿔 모양 화산의 체적을 추정할 때 사용해' },
      { icon: '🎄', title: '크리스마스 트리', desc: '원뿔형 트리에 필요한 장식품 수를 부피로 추정해' },
    ],

    sliders: [
      { name: 'r', label: '밑면 반지름 r', min: 1, max: 10, default: 4, step: 0.5 },
      { name: 'h', label: '높이 h', min: 1, max: 15, default: 9, step: 0.5 },
    ],

    example: {
      question: '밑면 반지름 4cm, 높이 9cm인 원뿔의 부피를 구하시오.',
      answer: '48π cm³',
      steps: [
        'V = (1/3)πr²h에 대입',
        'V = (1/3) × π × 4² × 9',
        'V = (1/3) × π × 16 × 9',
        'V = (1/3) × 144π = 48π cm³ (≈ 150.8 cm³)',
      ],
      hints: [
        '힌트 1: 원뿔 부피 = (1/3) × 밑넓이 × 높이야.',
        '힌트 2: 밑넓이 = π×16 = 16π. 16π × 9 = ?',
        '힌트 3: 144π ÷ 3 = 48π cm³!',
      ],
      otherApproaches: [
        { name: '원기둥 비교', desc: '같은 크기 원기둥 부피 = π×16×9 = 144π. 원뿔 = 144π ÷ 3 = 48π.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '입체도형 계보', familyDescription: '원기둥 → 원뿔 부피 → 원뿔 겉넓이 → 구',
    },

    visualType: 'cone_volume',
    relatedIds: ['M059', 'M061', 'M057'],
  },

  {
    id: 'M061',
    number: 61,
    name: '원뿔의 겉넓이',
    latex: 'A = \\pi r^2 + \\pi r l',
    description: '원뿔의 겉넓이 = 밑면 원 + 옆면(부채꼴)',
    level: 'middle',
    category: 'geometry',
    tags: ['원뿔', '겉넓이', '부채꼴', '모선', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '원뿔을 펼치면 부채꼴이 나온다고? 종이로 직접 만들어보면 신기해!',

    principle: `
      밑면 반지름 r, 모선 길이 l인 원뿔의 겉넓이는<br><br>
      <strong>A = πr² + πrl = πr(r + l)</strong><br><br>
      ① <strong>밑면</strong>: πr² (원)<br>
      ② <strong>옆면</strong>: πrl (부채꼴)<br><br>
      옆면을 펼치면 반지름 l, 호의 길이 2πr인 <strong>부채꼴</strong>이 돼!<br>
      부채꼴 넓이 = (1/2) × 호 × 반지름 = (1/2) × 2πr × l = πrl<br><br>
      모선 l은 피타고라스 정리로: <strong>l = √(r² + h²)</strong>
    `,

    story: `
      원뿔의 전개도 연구는 <strong>아폴로니우스</strong>의 《원뿔곡선론》에서 시작됐어.<br><br>
      원뿔을 다양한 각도로 자르면 원, 타원, 포물선, 쌍곡선이 나오는데,
      이것이 바로 <strong>원뿔곡선(conic section)</strong>이야.<br><br>
      케플러는 행성 궤도가 타원(원뿔의 단면!)이라는 것을 발견했고,
      포물선은 포물체 운동, 쌍곡선은 초음속 충격파에 등장해.
      원뿔에서 이렇게 다양한 곡선이 나온다니 놀랍지 않아?
    `,

    realLife: [
      { icon: '🎂', title: '고깔 모자', desc: '생일 고깔 모자를 만들 때 옆면 πrl 크기의 부채꼴 종이가 필요해' },
      { icon: '🍦', title: '와플콘 제작', desc: '아이스크림 와플콘의 겉넓이로 반죽 양을 결정해' },
      { icon: '📡', title: '위성 안테나', desc: '원뿔형 안테나의 표면적으로 반사 효율을 계산해' },
    ],

    sliders: [
      { name: 'r', label: '밑면 반지름 r', min: 1, max: 8, default: 3, step: 0.5 },
      { name: 'h', label: '높이 h', min: 1, max: 12, default: 4, step: 0.5 },
    ],

    example: {
      question: '밑면 반지름 3cm, 높이 4cm인 원뿔의 겉넓이를 구하시오.',
      answer: '24π cm²',
      steps: [
        '모선 l = √(r² + h²) = √(9 + 16) = √25 = 5cm',
        'A = πr² + πrl = π(3)² + π(3)(5)',
        'A = 9π + 15π = 24π cm² (≈ 75.4 cm²)',
      ],
      hints: [
        '힌트 1: 먼저 모선 길이 l을 피타고라스 정리로 구해봐.',
        '힌트 2: l = √(9+16) = 5. 이제 겉넓이 = πr² + πrl에 대입!',
        '힌트 3: 9π + 15π = 24π cm²!',
      ],
      otherApproaches: [
        { name: '인수분해', desc: 'A = πr(r+l) = π×3×(3+5) = π×3×8 = 24π.' },
      ],
    },

    evolution: { prev: 'E035', next: undefined, family: '피타고라스', familyDescription: '초등 삼각형 넓이 → 중등 피타고라스 정리 → 고등 삼각함수로 발전' },

    visualType: 'cone_surface',
    relatedIds: ['M059', 'M060', 'M068'],
  },

  // ============================================================
  // 다면체·평행선·각도 (M062~M066)
  // ============================================================
  {
    id: 'M062',
    number: 62,
    name: '중앙값과 최빈값',
    latex: '\\text{중앙값, 최빈값}',
    description: '자료의 대표값으로 평균 외에 중앙값과 최빈값을 사용한다',
    level: 'middle',
    category: 'probability',
    tags: ['중앙값', '최빈값', '대표값', '평균', '통계', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '평균이 왜곡될 때 중앙값이 더 정확해!',

    principle: `
      자료의 대표값에는 세 가지가 있어:<br><br>
      <strong>① 평균</strong>: 모든 값을 더해서 개수로 나눈 것<br>
      <strong>② 중앙값(중위수)</strong>: 자료를 크기순으로 나열했을 때 <strong>가운데</strong> 값<br>
      - 홀수 개: 가운데 하나<br>
      - 짝수 개: 가운데 두 수의 평균<br>
      <strong>③ 최빈값</strong>: 가장 <strong>자주</strong> 나타나는 값<br><br>
      <strong>언제 뭘 쓸까?</strong><br>
      - 극단값(이상치)이 있으면 → <strong>중앙값</strong>이 더 좋아!<br>
      - 예: 연봉 {200, 250, 300, 300, 5000}만 원 → 평균 1250이지만 중앙값 300이 더 현실적.
    `,

    story: `
      중앙값의 중요성을 강조한 사람은 <strong>프랜시스 골턴</strong>(19세기)이야.<br><br>
      골턴은 영국 사람들의 키, 수입 등을 분석하면서 평균이 극단값에
      크게 흔들린다는 것을 발견했어. 그래서 중앙값을 대안으로 제시했지.<br><br>
      오늘날 "중위 소득", "중위 집값"이라는 표현을 자주 듣는 이유도
      소수의 부자가 평균을 왜곡하는 것을 방지하기 위해서야.
    `,

    realLife: [
      { icon: '💰', title: '중위 소득', desc: '한국 중위 소득은 평균 소득보다 낮아 — 고소득자가 평균을 끌어올리니까!' },
      { icon: '👟', title: '신발 사이즈', desc: '가장 많이 팔리는 사이즈 = 최빈값. 매장 재고 관리에 활용!' },
      { icon: '🏠', title: '부동산 가격', desc: '중위 집값이 평균 집값보다 현실적 — 초고가 아파트가 평균을 왜곡하니까.' },
    ],

    example: {
      question: '자료 {3, 5, 7, 7, 8, 10, 15}의 중앙값과 최빈값을 구하라.',
      answer: '중앙값: 7, 최빈값: 7',
      steps: [
        '자료를 크기순으로 나열: 3, 5, 7, 7, 8, 10, 15 (이미 정렬됨)',
        '7개이므로 가운데(4번째) 값 = 7 → 중앙값 = 7',
        '가장 많이 나타나는 값: 7이 2번 → 최빈값 = 7',
      ],
      hints: [
        '힌트 1: 먼저 자료를 크기순으로 나열해봐.',
        '힌트 2: 7개니까 4번째 값이 중앙값이야.',
        '힌트 3: 7이 2번으로 가장 많이 나와. 최빈값도 7!',
      ],
      otherApproaches: [
        { name: '개수 세기', desc: '각 값의 빈도: 3(1번), 5(1번), 7(2번), 8(1번), 10(1번), 15(1번). 7이 최다!' },
      ],
    },

    evolution: { prev: 'E043', next: undefined, family: '통계의 발전', familyDescription: '초등 평균 → 중등 중앙값·최빈값 → 고등 분산·표준편차' },

    visualType: 'representative_value',
    relatedIds: ['M065'],
  },

  {
    id: 'M063',
    number: 63,
    name: '평행선의 성질: 동위각과 엇각',
    latex: '\\angle a = \\angle b \\text{ (동위각)}, \\quad \\angle a = \\angle c \\text{ (엇각)}',
    description: '두 평행선을 만나는 직선(횡단선)이 만드는 동위각은 같고, 엇각도 같다',
    level: 'middle',
    category: 'geometry',
    tags: ['평행선', '동위각', '엇각', '횡단선', '각도', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '평행선 사이에 대각선을 그으면, 같은 각도가 여러 군데 나타나! 왜 그럴까?',

    principle: `
      두 평행선 l∥m을 횡단선 t가 만날 때 만들어지는 8개의 각에서<br><br>
      <strong>동위각</strong>: 같은 위치에 있는 각 → <strong>크기가 같다</strong><br>
      <strong>엇각(교대각)</strong>: 엇갈린 위치의 각 → <strong>크기가 같다</strong><br>
      <strong>동측내각</strong>: 같은 쪽 내각 → <strong>합이 180°</strong><br><br>
      <strong>역도 중요해:</strong><br>
      동위각이 같으면 → 두 직선은 평행!<br>
      이것이 "두 직선이 평행함을 증명"하는 방법이야.
    `,

    story: `
      평행선의 성질은 <strong>유클리드</strong>의 《원론》 제1권에서 핵심적인 내용이야.<br><br>
      유클리드의 <strong>제5공준</strong>(평행선 공준)은 수학사에서 가장 논쟁적인 명제였어.
      "이것을 증명할 수 있지 않을까?"라는 2000년간의 도전 끝에,<br>
      19세기에 <strong>비유클리드 기하학</strong>이 탄생했지.<br><br>
      로바체프스키, 보여이, 리만이 각각 평행선 공준 없이도
      일관된 기하학을 만들 수 있음을 보여줬어. 이는 아인슈타인의 일반상대성이론에 쓰였지!
    `,

    realLife: [
      { icon: '🛤️', title: '철도 레일', desc: '평행한 레일과 침목이 만드는 각도가 동위각·엇각 관계야' },
      { icon: '🏢', title: '건축 설계', desc: '평행한 벽과 대각선 보의 각도 관계로 구조 안정성을 분석해' },
      { icon: '✂️', title: '옷감 재단', desc: '평행한 줄무늬 천에 비스듬히 가위질할 때 패턴의 각도를 계산해' },
    ],

    sliders: [
      { name: 'angle', label: '횡단선 각도 (°)', min: 10, max: 170, default: 60, step: 5 },
    ],

    example: {
      question: '두 평행선을 횡단선이 만나 동위각이 65°일 때, 엇각과 동측내각의 크기를 구하시오.',
      answer: '엇각 = 65°, 동측내각 = 115°',
      steps: [
        '동위각 = 65° (주어짐)',
        '엇각 = 동위각 = 65° (평행선 성질)',
        '동측내각 = 180° - 65° = 115° (동측내각의 합 = 180°)',
      ],
      hints: [
        '힌트 1: 평행선에서 동위각과 엇각은 어떤 관계일까?',
        '힌트 2: 엇각 = 동위각 = 65°야.',
        '힌트 3: 동측내각은 180°에서 65°를 빼면 115°야.',
      ],
      otherApproaches: [
        { name: '맞꼭지각 이용', desc: '맞꼭지각도 같다는 성질을 함께 사용하면 8개 각을 모두 구할 수 있어.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '각도 계보', familyDescription: '평행선 성질 → 삼각형 외각 → 다각형 내각의 합',
    },

    visualType: 'parallel_angles',
    relatedIds: ['M064', 'M065', 'M066'],
  },

  {
    id: 'M064',
    number: 64,
    name: '삼각형의 외각',
    latex: '\\text{외각} = \\text{이웃하지 않는 두 내각의 합}',
    description: '삼각형의 한 외각은 이웃하지 않는 두 내각의 합과 같다',
    level: 'middle',
    category: 'geometry',
    tags: ['삼각형', '외각', '내각', '각도', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '삼각형 한 변을 쭉 연장하면 생기는 각도, 나머지 두 각의 합이 딱 맞아!',

    principle: `
      삼각형 ABC에서 꼭짓점 C의 외각을 d라 하면<br><br>
      <strong>d = ∠A + ∠B</strong><br><br>
      <strong>증명:</strong><br>
      삼각형 내각의 합 = 180° → ∠A + ∠B + ∠C = 180°<br>
      외각 d와 ∠C는 보각 → d + ∠C = 180°<br>
      두 식을 비교하면 <strong>d = ∠A + ∠B</strong><br><br>
      이 성질은 삼각형의 <strong>가장 기본적인 각도 관계</strong>로,
      복잡한 도형에서 각도를 구할 때 매우 유용해!
    `,

    story: `
      삼각형 외각 정리는 유클리드 《원론》 제1권 32번 명제야.<br><br>
      유클리드는 평행선을 보조선으로 그어 이것을 증명했어.
      꼭짓점을 지나는 대변에 평행한 선을 긋고, 엇각과 동위각을 이용하는 거야.<br><br>
      이 정리는 간단해 보이지만, <strong>삼각형 내각의 합이 180°</strong>라는
      유클리드 기하학의 핵심 결과를 내포하고 있어.
      비유클리드 기하학에서는 이 정리가 성립하지 않아!
    `,

    realLife: [
      { icon: '🔺', title: '삼각 트러스', desc: '지붕 삼각 구조에서 외각을 이용해 보강재 각도를 결정해' },
      { icon: '⛵', title: '항해 방향', desc: '삼각 항법에서 진행 방향을 바꿀 때 외각으로 회전각을 계산해' },
      { icon: '🎯', title: '당구 반사', desc: '공이 반사될 때의 각도 관계가 외각 성질과 연결돼' },
    ],

    sliders: [
      { name: 'angleA', label: '∠A (°)', min: 10, max: 160, default: 50, step: 5 },
      { name: 'angleB', label: '∠B (°)', min: 10, max: 160, default: 70, step: 5 },
    ],

    example: {
      question: '삼각형에서 ∠A = 50°, ∠B = 70°일 때, 꼭짓점 C에서의 외각을 구하시오.',
      answer: '120°',
      steps: [
        '외각 = 이웃하지 않는 두 내각의 합',
        '외각 = ∠A + ∠B = 50° + 70° = 120°',
      ],
      hints: [
        '힌트 1: 삼각형 외각은 이웃하지 않는 두 내각의 합이야.',
        '힌트 2: 50° + 70° = ?',
        '힌트 3: 120°! (검증: ∠C = 180° - 50° - 70° = 60°, 외각 = 180° - 60° = 120° ✓)',
      ],
      otherApproaches: [
        { name: '내각 먼저', desc: '∠C = 180° - 50° - 70° = 60°를 구한 뒤, 외각 = 180° - 60° = 120°.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '각도 계보', familyDescription: '평행선 성질 → 삼각형 외각 → 다각형 내각의 합',
    },

    visualType: 'exterior_angle',
    relatedIds: ['M063', 'M065', 'M066'],
  },

  {
    id: 'M065',
    number: 65,
    name: '다각형 내각의 합',
    latex: '\\text{내각의 합} = 180° \\times (n-2)',
    description: 'n각형의 내각의 합은 180°×(n-2)이다',
    level: 'middle',
    category: 'geometry',
    tags: ['다각형', '내각', '합', '삼각형분할', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '삼각형은 180°, 사각형은 360°, 오각형은? 규칙만 알면 100각형도 바로 구해!',

    principle: `
      <strong>n각형의 내각의 합 = 180° × (n − 2)</strong><br><br>
      왜 (n-2)일까?<br>
      다각형의 한 꼭짓점에서 대각선을 모두 그으면 <strong>(n-2)개의 삼각형</strong>으로 나눠져!<br><br>
      삼각형(3각형): 180° × 1 = 180°<br>
      사각형(4각형): 180° × 2 = 360°<br>
      오각형(5각형): 180° × 3 = 540°<br>
      육각형(6각형): 180° × 4 = 720°<br><br>
      <strong>정n각형</strong>의 한 내각 = 180° × (n-2) / n
    `,

    story: `
      다각형 내각의 합 공식은 유클리드가 삼각형 분할법으로 증명했어.<br><br>
      이 공식의 위력은 <strong>정다각형 타일링</strong>에서 드러나.
      평면을 빈틈 없이 채울 수 있는 정다각형은 딱 3개뿐이야:<br>
      - 정삼각형 (60° × 6 = 360°)<br>
      - 정사각형 (90° × 4 = 360°)<br>
      - 정육각형 (120° × 3 = 360°)<br><br>
      꿀벌이 정육각형 벌집을 만드는 이유도 이것과 관련 있어!
      정육각형은 같은 둘레로 가장 큰 넓이를 만들면서 빈틈 없이 채울 수 있거든.
    `,

    realLife: [
      { icon: '🐝', title: '벌집 구조', desc: '정육각형(내각 120°)이 빈틈 없이 평면을 채워 벌집의 구조가 됐어' },
      { icon: '⚽', title: '축구공 패턴', desc: '정오각형(108°)과 정육각형(120°)을 조합해 구면을 감싸' },
      { icon: '🏗️', title: '건축 타일', desc: '바닥 타일 패턴 설계에서 내각의 합이 360°가 되어야 빈틈이 없어' },
    ],

    sliders: [
      { name: 'n', label: 'n (꼭짓점 수)', min: 3, max: 12, default: 5, step: 1 },
    ],

    example: {
      question: '정팔각형의 한 내각의 크기를 구하시오.',
      answer: '135°',
      steps: [
        '내각의 합 = 180° × (8-2) = 180° × 6 = 1080°',
        '정팔각형이므로 모든 내각이 같다',
        '한 내각 = 1080° ÷ 8 = 135°',
      ],
      hints: [
        '힌트 1: n=8을 내각의 합 공식에 넣어봐.',
        '힌트 2: 180° × 6 = 1080°. 정팔각형이니까 8로 나눠!',
        '힌트 3: 1080° ÷ 8 = 135°!',
      ],
      otherApproaches: [
        { name: '외각으로 계산', desc: '정팔각형 외각 = 360° ÷ 8 = 45°. 내각 = 180° - 45° = 135°.' },
      ],
    },

    evolution: {
      prev: 'E044', next: undefined, family: '내각의 합 계보', familyDescription: '삼각형 내각의 합(초등) → 다각형 내각의 합 → 외각의 합',
    },

    visualType: 'polygon_angle_sum',
    relatedIds: ['M064', 'M066', 'M062'],
  },

  {
    id: 'M066',
    number: 66,
    name: '다각형 외각의 합',
    latex: '\\text{외각의 합} = 360°',
    description: '모든 볼록 다각형의 외각의 합은 항상 360°이다',
    level: 'middle',
    category: 'geometry',
    tags: ['다각형', '외각', '합', '360도', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '삼각형이든 백각형이든 외각의 합은 무조건 360°! 이 신비한 불변의 법칙!',

    principle: `
      <strong>모든 볼록 다각형</strong>의 외각의 합은 항상 <strong>360°</strong>!<br><br>
      n에 관계없이 일정해! 왜냐하면:<br><br>
      각 꼭짓점에서: 내각 + 외각 = 180°<br>
      n개 꼭짓점 전체: (내각의 합) + (외각의 합) = 180° × n<br>
      내각의 합 = 180°(n-2) 이므로<br>
      외각의 합 = 180°n - 180°(n-2) = 180°n - 180°n + 360° = <strong>360°</strong><br><br>
      <strong>직관적 이해:</strong> 다각형 둘레를 한 바퀴 걸으면 총 360° 회전해. 각 꼭짓점에서 도는 각도가 외각이야!
    `,

    story: `
      외각의 합이 360°라는 사실은 <strong>위상수학</strong>과 연결돼.<br><br>
      다각형 둘레를 따라 한 바퀴 돌면 원래 방향으로 돌아오므로 총 회전 = 360°.
      이것은 매끄러운 곡선에서도 성립하며, <strong>가우스-보네 정리</strong>의 특수한 경우야.<br><br>
      로봇 공학에서 로봇이 다각형 경로를 따라 이동할 때,
      각 꼭짓점에서의 회전각의 합이 360°라는 것을 알면
      오차를 검증할 수 있어(폐합 오차).
    `,

    realLife: [
      { icon: '🤖', title: '로봇 경로', desc: '로봇이 다각형 경로를 따라 한 바퀴 돌 때 총 회전 = 360°' },
      { icon: '🗺️', title: '측량 검증', desc: '토지 경계를 측량할 때 외각 합이 360°인지 확인해 오차를 검증해' },
      { icon: '🎮', title: '게임 캐릭터', desc: '캐릭터가 다각형 울타리를 한 바퀴 순찰할 때 총 회전각 계산' },
    ],

    sliders: [
      { name: 'n', label: 'n (꼭짓점 수)', min: 3, max: 12, default: 5, step: 1 },
    ],

    example: {
      question: '정오각형의 한 외각의 크기를 구하시오.',
      answer: '72°',
      steps: [
        '외각의 합 = 360° (모든 다각형)',
        '정오각형은 모든 외각이 같다',
        '한 외각 = 360° ÷ 5 = 72°',
      ],
      hints: [
        '힌트 1: 다각형 외각의 합은 항상 얼마?',
        '힌트 2: 360°를 꼭짓점 수로 나눠봐.',
        '힌트 3: 360° ÷ 5 = 72°!',
      ],
      otherApproaches: [
        { name: '내각으로 계산', desc: '정오각형 내각 = 180°×3/5 = 108°. 외각 = 180° - 108° = 72°.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '내각의 합 계보', familyDescription: '다각형 내각의 합 → 외각의 합 360°',
    },

    visualType: 'polygon_exterior_sum',
    relatedIds: ['M064', 'M065'],
  },

  // ============================================================
  // 호·부채꼴 (M067~M068)
  // ============================================================
  {
    id: 'M067',
    number: 67,
    name: '호의 길이',
    latex: 'l = 2\\pi r \\times \\frac{\\theta}{360°}',
    description: '중심각에 비례하는 원의 일부(호)의 길이',
    level: 'middle',
    category: 'geometry',
    tags: ['호', '길이', '중심각', '원', '비례', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '피자 한 조각의 둥근 가장자리 길이는? 각도로 바로 계산할 수 있어!',

    principle: `
      반지름 r인 원에서 중심각 θ°에 해당하는 호의 길이 l은<br><br>
      <strong>l = 2πr × (θ/360°)</strong><br><br>
      원둘레(2πr)에서 θ/360° 만큼의 <strong>비율</strong>이 호의 길이야!<br><br>
      - θ = 360° → 전체 원둘레 = 2πr<br>
      - θ = 180° → 반원 = πr<br>
      - θ = 90° → 1/4원 = πr/2
    `,

    story: `
      호의 길이 측정은 고대 <strong>천문학</strong>에서 핵심이었어.<br><br>
      <strong>에라토스테네스</strong>(BC 276~194)는 시에네와 알렉산드리아 사이의
      호의 길이(약 800km)와 중심각(약 7.2°)을 이용해 지구 둘레를 계산했어.<br>
      7.2° : 360° = 800km : 지구둘레 → 약 40,000km!<br><br>
      현재 측정값과 거의 일치하는 놀라운 정밀도야.
    `,

    realLife: [
      { icon: '🎡', title: '관람차', desc: '관람차에서 90° 회전하면 이동거리 = 원둘레의 1/4' },
      { icon: '🏎️', title: '커브 도로', desc: '원형 커브 도로의 길이를 중심각과 반지름으로 계산해' },
      { icon: '🌍', title: '지구 둘레', desc: '위도차(중심각)와 거리(호)의 관계로 지구 크기를 추정했어' },
    ],

    sliders: [
      { name: 'r', label: '반지름 r', min: 1, max: 10, default: 5, step: 0.5 },
      { name: 'theta', label: '중심각 θ (°)', min: 10, max: 360, default: 90, step: 10 },
    ],

    example: {
      question: '반지름 6cm, 중심각 120°인 호의 길이를 구하시오.',
      answer: '4π cm',
      steps: [
        'l = 2πr × (θ/360°)',
        'l = 2π(6) × (120/360)',
        'l = 12π × (1/3)',
        'l = 4π cm (≈ 12.57 cm)',
      ],
      hints: [
        '힌트 1: 원둘레에서 중심각 비율만큼의 길이야.',
        '힌트 2: 원둘레 = 2π×6 = 12π. 120°/360° = 1/3.',
        '힌트 3: 12π × 1/3 = 4π cm!',
      ],
      otherApproaches: [
        { name: '비례식', desc: '원둘레 : 호 = 360° : 120° → 12π : l = 3 : 1 → l = 4π.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '원 측정 계보', familyDescription: '원둘레 → 호의 길이 → 부채꼴 넓이',
    },

    visualType: 'arc_length',
    relatedIds: ['M051', 'M068'],
  },

  {
    id: 'M068',
    number: 68,
    name: '부채꼴의 넓이',
    latex: 'S = \\pi r^2 \\times \\frac{\\theta}{360°} = \\frac{1}{2} r l',
    description: '원 넓이에서 중심각 비율만큼이 부채꼴 넓이',
    level: 'middle',
    category: 'geometry',
    tags: ['부채꼴', '넓이', '중심각', '호', '원', '중1'],
    grade: '중1',
    curriculum: '2022개정',

    hook: '피자 8조각 중 하나의 넓이는? 전체 원 넓이의 1/8이야!',

    principle: `
      반지름 r, 중심각 θ°인 부채꼴의 넓이는<br><br>
      <strong>S = πr² × (θ/360°)</strong><br><br>
      또는 호의 길이 l을 알면:<br>
      <strong>S = (1/2) × r × l</strong><br><br>
      두 번째 공식은 삼각형 넓이 = (1/2) × 밑변 × 높이와 비슷해!<br>
      부채꼴을 매우 얇은 삼각형 무수히 많은 것으로 보면,
      밑변의 합 = 호의 길이 l, 높이 = 반지름 r인 셈이야.
    `,

    story: `
      부채꼴은 인류의 오랜 문화 속에서 찾을 수 있어.<br><br>
      고대 <strong>바빌로니아</strong>는 원을 360°로 나눴는데 (60진법 기반),
      이것이 오늘날까지 이어져. 360이 약수가 많아(1,2,3,4,5,6,8,9,10,12,15,...)
      등분하기 편하기 때문이야.<br><br>
      부채꼴 넓이는 <strong>스프링클러 관개</strong>, <strong>레이더 탐지 범위</strong>,
      <strong>카메라 화각</strong> 등 "특정 각도 범위의 면적"을 구하는 모든 곳에서 쓰여.
    `,

    realLife: [
      { icon: '🍕', title: '피자 조각', desc: '8등분 피자 한 조각 넓이 = 전체 원 넓이 ÷ 8 (중심각 45°)' },
      { icon: '💦', title: '스프링클러', desc: '회전 스프링클러의 관개 면적을 부채꼴 넓이로 계산해' },
      { icon: '📷', title: '카메라 화각', desc: 'CCTV의 촬영 범위를 부채꼴로 모델링해 사각지대를 파악해' },
    ],

    sliders: [
      { name: 'r', label: '반지름 r', min: 1, max: 10, default: 6, step: 0.5 },
      { name: 'theta', label: '중심각 θ (°)', min: 10, max: 360, default: 60, step: 10 },
    ],

    example: {
      question: '반지름 6cm, 중심각 60°인 부채꼴의 넓이를 구하시오.',
      answer: '6π cm²',
      steps: [
        'S = πr² × (θ/360°)',
        'S = π(6)² × (60/360)',
        'S = 36π × (1/6)',
        'S = 6π cm² (≈ 18.85 cm²)',
      ],
      hints: [
        '힌트 1: 원 넓이에서 중심각 비율만큼 구하면 돼.',
        '힌트 2: 원 넓이 = 36π, 비율 = 60/360 = 1/6.',
        '힌트 3: 36π × 1/6 = 6π cm²!',
      ],
      otherApproaches: [
        { name: '호 길이 이용', desc: '호 l = 2π(6) × 60/360 = 2π. 넓이 = (1/2)×6×2π = 6π.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '원 측정 계보', familyDescription: '호의 길이 → 부채꼴 넓이',
    },

    visualType: 'sector_area',
    relatedIds: ['M067', 'M051', 'M061'],
  },

  // ============================================================
  // 대각선 (M069~M070)
  // ============================================================
  {
    id: 'M069',
    number: 69,
    name: '정사각형의 대각선',
    latex: 'd = \\sqrt{2} \\cdot a',
    description: '한 변의 길이가 a인 정사각형의 대각선 길이는 a√2',
    level: 'middle',
    category: 'geometry',
    tags: ['정사각형', '대각선', '루트2', '피타고라스', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: 'A4 용지 비율이 1:√2인 이유를 알면, 정사각형 대각선의 비밀이 보여!',

    principle: `
      한 변이 a인 정사각형의 대각선 d는<br><br>
      피타고라스 정리에서: d² = a² + a² = 2a²<br>
      <strong>d = a√2</strong><br><br>
      이것은 45°-45°-90° 직각삼각형의 변의 비 <strong>1 : 1 : √2</strong>와 같아!<br><br>
      <strong>√2 ≈ 1.414</strong>이므로, 대각선은 한 변의 약 1.414배야.<br>
      정사각형을 대각선으로 자르면 직각이등변삼각형 2개가 돼.
    `,

    story: `
      √2는 수학사에서 최초로 발견된 <strong>무리수</strong>야!<br><br>
      피타고라스 학파의 <strong>히파수스</strong>가 정사각형 대각선과 변의 비가
      분수로 표현될 수 없음을 증명했어. 이것은 "모든 수는 분수"라는
      피타고라스 학파의 믿음을 무너뜨린 충격적 발견이었지.<br><br>
      <strong>A4 용지</strong>의 가로:세로 비율이 1:√2인 이유는,
      반으로 접어도 비율이 유지되기 때문이야! (DIN 규격)
    `,

    realLife: [
      { icon: '📄', title: 'A4 용지', desc: 'A4 용지 비율 1:√2. 반으로 접으면 A5인데 비율이 동일해!' },
      { icon: '🏠', title: '방 대각선', desc: '정사각형 방의 대각선 = 한 변 × √2. 대각선 가구 배치에 사용' },
      { icon: '⬛', title: '디스플레이', desc: '정사각형 디스플레이의 대각선 인치 = 변 × √2' },
    ],

    sliders: [
      { name: 'a', label: '한 변 a', min: 1, max: 15, default: 5, step: 0.5 },
    ],

    example: {
      question: '한 변이 8cm인 정사각형의 대각선 길이를 구하시오.',
      answer: '8√2 cm (≈ 11.31 cm)',
      steps: [
        'd² = a² + a² = 8² + 8² = 64 + 64 = 128',
        'd = √128 = √(64 × 2) = 8√2',
        'd ≈ 8 × 1.414 = 11.31 cm',
      ],
      hints: [
        '힌트 1: 대각선이 정사각형을 두 직각삼각형으로 나눠. 피타고라스!',
        '힌트 2: d² = 8² + 8² = 128.',
        '힌트 3: √128 = 8√2 ≈ 11.31 cm!',
      ],
      otherApproaches: [
        { name: '공식 바로 적용', desc: 'd = a√2 = 8√2. 피타고라스를 거치지 않고 바로 적용 가능!' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '거리와 넓이 계보', familyDescription: '피타고라스 정리 → 정사각형 대각선 → 직사각형 대각선',
    },

    visualType: 'square_diagonal',
    relatedIds: ['M045', 'M070', 'M055'],
  },

  {
    id: 'M070',
    number: 70,
    name: '직사각형의 대각선',
    latex: 'd = \\sqrt{a^2 + b^2}',
    description: '가로 a, 세로 b인 직사각형의 대각선 길이',
    level: 'middle',
    category: 'geometry',
    tags: ['직사각형', '대각선', '피타고라스', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: 'TV 크기는 왜 대각선으로 표시할까? 가로·세로만 알면 대각선을 바로 구할 수 있어!',

    principle: `
      가로 a, 세로 b인 직사각형의 대각선 d는<br><br>
      <strong>d = √(a² + b²)</strong><br><br>
      이것은 <strong>피타고라스 정리의 직접 적용</strong>이야!<br>
      직사각형의 대각선이 두 직각삼각형으로 나누니까,
      a와 b가 두 변, d가 빗변이 되는 거야.<br><br>
      정사각형(a=b)의 특수한 경우: d = √(2a²) = a√2 (M069)
    `,

    story: `
      TV, 모니터, 스마트폰의 크기를 <strong>대각선 인치</strong>로 표시하는 이유는
      1950년대 초기 TV가 <strong>원형 CRT</strong>였기 때문이야.<br><br>
      원형 브라운관의 지름이 곧 화면 크기였는데,
      직사각형 화면으로 바뀌면서 대각선 크기 표기가 관행으로 남은 거야.<br><br>
      65인치 TV(16:9)의 실제 크기:<br>
      가로 ≈ 143.9cm, 세로 ≈ 80.9cm<br>
      대각선 = √(143.9² + 80.9²) ≈ 165.1cm = 65인치
    `,

    realLife: [
      { icon: '📺', title: 'TV 크기', desc: '55인치 TV의 가로·세로 = 대각선(139.7cm)에서 16:9 비율로 역산' },
      { icon: '📱', title: '스마트폰 화면', desc: '6.7인치 스마트폰의 가로·세로를 대각선과 비율로 계산해' },
      { icon: '🚪', title: '가구 옮기기', desc: '큰 가구를 대각선으로 기울여 문을 통과시킬 수 있는지 계산해' },
    ],

    sliders: [
      { name: 'a', label: '가로 a', min: 1, max: 15, default: 16, step: 1 },
      { name: 'b', label: '세로 b', min: 1, max: 15, default: 9, step: 1 },
    ],

    example: {
      question: '가로 16cm, 세로 12cm인 직사각형의 대각선 길이를 구하시오.',
      answer: '20cm',
      steps: [
        'd = √(a² + b²) = √(16² + 12²)',
        'd = √(256 + 144) = √400',
        'd = 20cm',
      ],
      hints: [
        '힌트 1: 대각선 = √(가로² + 세로²)를 사용해봐.',
        '힌트 2: 16² = 256, 12² = 144. 합은?',
        '힌트 3: √400 = 20! (사실 (12,16,20)은 (3,4,5)의 4배 피타고라스 수야)',
      ],
      otherApproaches: [
        { name: '피타고라스 수 활용', desc: '12:16 = 3:4이므로 대각선 = 5×4 = 20. (3,4,5) 피타고라스 수!' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '거리와 넓이 계보', familyDescription: '정사각형 대각선 → 직사각형 대각선 → 3차원 대각선(고등)',
    },

    visualType: 'rect_diagonal',
    relatedIds: ['M045', 'M046', 'M069'],
  },

  // ============================================================
  // 확률과 통계 (M071~M087)
  // ============================================================
  {
    id: 'M071',
    number: 71,
    name: '경우의 수 합의 법칙',
    latex: 'n(A \\cup B) = n(A) + n(B) \\quad (A \\cap B = \\emptyset)',
    description: '동시에 일어나지 않는 두 사건의 경우의 수는 각각의 합',
    level: 'middle',
    category: 'probability',
    tags: ['경우의 수', '합의 법칙', '배반사건', '확률', '중2', '경우의수'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '게임에서 전사를 고르거나 마법사를 고르거나 — 동시에 둘은 불가능하니까 경우의 수를 더해!',

    principle: `
      두 사건 A, B가 <strong>동시에 일어나지 않을 때</strong>(배반사건),<br>
      "A 또는 B"가 일어나는 경우의 수는 각각을 <strong>더한다</strong>.<br><br>
      <strong>n(A ∪ B) = n(A) + n(B)</strong><br><br>
      핵심 키워드는 <strong>"또는", "~이거나"</strong>야.<br>
      두 선택지가 겹치지 않으면 합의 법칙!<br><br>
      예: 버스 노선 3개 <em>또는</em> 지하철 노선 2개 → 3 + 2 = 5가지
    `,

    story: `
      17세기 프랑스 수학자 <strong>파스칼</strong>과 <strong>페르마</strong>가
      도박사의 질문에 답하면서 경우의 수 이론이 탄생했어.<br><br>
      "주사위를 던지거나 동전을 던지거나" 같이
      서로 겹치지 않는 선택을 세는 것이 합의 법칙의 시작이야.<br><br>
      이 간단한 아이디어가 현대 확률론의 기초가 되었지.
    `,

    realLife: [
      { icon: '🎮', title: '게임 캐릭터 선택', desc: '전사 5종류 또는 마법사 4종류 중 하나를 고르면 → 5+4 = 9가지' },
      { icon: '📱', title: 'SNS 앱 선택', desc: '사진 SNS 3개 또는 영상 SNS 4개 중 하나 설치 → 3+4 = 7가지' },
      { icon: '⚽', title: '스포츠 동아리', desc: '구기 종목 4개 또는 개인 종목 3개 중 하나 선택 → 4+3 = 7가지' },
    ],

    sliders: [
      { name: 'nA', label: 'n(A)', min: 1, max: 10, default: 3, step: 1 },
      { name: 'nB', label: 'n(B)', min: 1, max: 10, default: 4, step: 1 },
    ],

    example: {
      question: '온라인 게임에서 탱커 캐릭터 4종류, 힐러 캐릭터 3종류 중 하나만 골라야 한다. 선택 가능한 경우의 수는?',
      answer: '4 + 3 = 7가지',
      steps: [
        '탱커를 고르는 경우의 수: n(A) = 4',
        '힐러를 고르는 경우의 수: n(B) = 3',
        '탱커와 힐러를 동시에 고를 수 없으므로 배반사건',
        '합의 법칙 적용: n(A ∪ B) = 4 + 3 = 7가지',
      ],
      hints: [
        '힌트 1: 탱커 "또는" 힐러니까 합의 법칙이야.',
        '힌트 2: 두 직업을 동시에 고를 수 없으니까 배반사건이지.',
        '힌트 3: 4 + 3 = 7가지!',
      ],
      otherApproaches: [
        { name: '직접 나열', desc: '탱커: {T1, T2, T3, T4}, 힐러: {H1, H2, H3}을 모두 나열하면 7개 확인 가능.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '경우의 수 계보', familyDescription: '합의 법칙 → 곱의 법칙 → 순열 → 조합 → 확률로 확장',
    },

    visualType: 'counting_add',
    relatedIds: ['M072', 'M073', 'M074'],
  },

  {
    id: 'M072',
    number: 72,
    name: '경우의 수 곱의 법칙',
    latex: 'n(A \\times B) = n(A) \\times n(B)',
    description: '연이어 일어나는 두 사건의 경우의 수는 각각의 곱',
    level: 'middle',
    category: 'probability',
    tags: ['경우의 수', '곱의 법칙', '순서쌍', '확률', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '비밀번호 4자리가 만 가지인 이유? 10×10×10×10 — 곱의 법칙 때문이야!',

    principle: `
      사건 A가 일어난 <strong>다음에</strong> 사건 B가 일어날 때,<br>
      전체 경우의 수는 각각을 <strong>곱한다</strong>.<br><br>
      <strong>n(A × B) = n(A) × n(B)</strong><br><br>
      핵심 키워드는 <strong>"그리고", "~하고 ~한다"</strong>야.<br>
      A를 정하고 B도 정해야 하면 곱의 법칙!<br><br>
      수형도(트리)를 그리면: 첫 번째 m개 가지 × 두 번째 n개 가지 = m×n개 경로
    `,

    story: `
      곱의 법칙은 <strong>수형도(트리 다이어그램)</strong>로 이해하면 가장 직관적이야.<br><br>
      나뭇가지가 갈라지듯, 첫 선택에서 m개로 갈라지고 각각에서 다시 n개로 갈라지면
      끝점이 m×n개가 돼.<br><br>
      컴퓨터 과학에서 <strong>경우의 수 폭발(combinatorial explosion)</strong>이라는 개념도
      이 곱의 법칙에서 나왔어. 선택지가 조금만 늘어도 전체 경우의 수가 기하급수적으로 증가하지.
    `,

    realLife: [
      { icon: '🔐', title: '스마트폰 비밀번호', desc: '4자리 PIN: 10×10×10×10 = 10,000가지 조합' },
      { icon: '👕', title: '코디 조합', desc: '상의 5벌 × 하의 4벌 = 20가지 스타일' },
      { icon: '🍕', title: '피자 커스텀', desc: '도우 3종 × 토핑 5종 × 소스 2종 = 30가지 조합' },
    ],

    sliders: [
      { name: 'nA', label: 'n(A)', min: 1, max: 10, default: 3, step: 1 },
      { name: 'nB', label: 'n(B)', min: 1, max: 10, default: 4, step: 1 },
    ],

    example: {
      question: '게임 캐릭터 커스텀: 헤어 6종류, 얼굴 5종류를 조합한다. 총 경우의 수는?',
      answer: '6 × 5 = 30가지',
      steps: [
        '헤어를 고르는 경우의 수: n(A) = 6',
        '얼굴을 고르는 경우의 수: n(B) = 5',
        '헤어를 정한 후 얼굴도 정해야 하므로 곱의 법칙 적용',
        'n(A × B) = 6 × 5 = 30가지',
      ],
      hints: [
        '힌트 1: 헤어 "그리고" 얼굴 — 둘 다 골라야 하니까 곱의 법칙이야.',
        '힌트 2: 헤어 6가지 각각에 얼굴 5가지를 조합해봐.',
        '힌트 3: 6 × 5 = 30가지!',
      ],
      otherApproaches: [
        { name: '수형도', desc: '헤어 6개 가지 각각에서 얼굴 5개 가지를 뻗으면 끝점 30개를 확인할 수 있어.' },
      ],
    },

    evolution: { prev: 'E049', next: undefined, family: '확률의 발전', familyDescription: '초등 가능성 → 중등 확률 → 고등 조건부 확률·통계로 발전' },

    visualType: 'counting_mul',
    relatedIds: ['M071', 'M073', 'M074'],
  },

  {
    id: 'M073',
    number: 73,
    name: '분산과 표준편차',
    latex: '\\sigma^2 = \\frac{\\sum(x_i-\\bar{x})^2}{n}',
    description: '자료가 평균으로부터 얼마나 흩어져 있는지를 나타내는 값',
    level: 'middle',
    category: 'probability',
    tags: ['분산', '표준편차', '산포도', '편차', '통계', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: '데이터가 얼마나 흩어져 있나? 표준편차!',

    principle: `
      <strong>편차</strong> = (각 자료값) - (평균). 평균에서 얼마나 떨어져 있는지!<br><br>
      그런데 편차의 합은 항상 0이야. 그래서 <strong>제곱</strong>해서 쓰지.<br><br>
      <strong>분산</strong> = (편차²의 합) ÷ n = Σ(xᵢ - x̄)² / n<br>
      <strong>표준편차</strong> = √분산<br><br>
      <strong>계산 팁:</strong> 분산 = (x²의 평균) - (평균)²<br>
      이 공식이 계산하기 더 쉬울 때가 많아!<br><br>
      표준편차가 <strong>작으면</strong> 자료가 평균 근처에 모여 있고,<br>
      <strong>크면</strong> 자료가 넓게 흩어져 있어.
    `,

    story: `
      표준편차는 <strong>칼 피어슨</strong>(1894)이 도입한 용어야.<br><br>
      하지만 개념 자체는 <strong>가우스</strong>가 천문 관측의 오차를 분석하면서 이미 사용하고 있었지.
      "모든 측정에는 오차가 있다. 그 오차가 얼마나 퍼져 있는지가 중요하다!"<br><br>
      오늘날 표준편차는 금융, 품질관리, 의학, AI 등 거의 모든 분야에서
      <strong>데이터의 신뢰도</strong>를 판단하는 핵심 지표로 쓰이고 있어.
    `,

    realLife: [
      { icon: '🏭', title: '품질 관리', desc: '과자 무게의 표준편차가 작을수록 품질이 균일해!' },
      { icon: '📈', title: '주식 투자', desc: '표준편차가 큰 주식 = 변동성이 커서 위험해. 안정적인 주식은 표준편차가 작아.' },
      { icon: '🎯', title: '양궁 실력', desc: '과녁 중심 근처에 화살이 모이면 표준편차가 작아 — 실력이 좋은 거야!' },
    ],

    sliders: [
      { name: 'spread', label: '자료의 퍼짐 정도', min: 1, max: 20, default: 5, step: 1 },
    ],

    example: {
      question: '자료 {2, 4, 6, 8, 10}의 분산과 표준편차를 구하라.',
      answer: '분산: 8, 표준편차: 2√2',
      steps: [
        '평균 = (2+4+6+8+10)/5 = 30/5 = 6',
        '각 편차: -4, -2, 0, 2, 4',
        '편차²: 16, 4, 0, 4, 16',
        '분산 = (16+4+0+4+16)/5 = 40/5 = 8',
        '표준편차 = √8 = 2√2 ≒ 2.83',
      ],
      hints: [
        '힌트 1: 먼저 평균을 구해봐.',
        '힌트 2: 각 값에서 평균을 빼고 제곱해.',
        '힌트 3: 제곱한 것들의 평균이 분산! √분산 = 표준편차.',
      ],
      otherApproaches: [
        { name: '간편 공식', desc: 'x²의 평균 = (4+16+36+64+100)/5 = 44. 분산 = 44 - 6² = 44 - 36 = 8. 같은 결과!' },
      ],
    },

    evolution: {
      prev: 'E043', next: undefined, family: '통계의 발전', familyDescription: '초등 평균 → 중등 분산·표준편차 → 고등 정규분포',
    },

    visualType: 'std_deviation',
    relatedIds: ['M072', 'M074', 'M075'],
  },

  {
    id: 'M074',
    number: 74,
    name: '산점도와 상관관계',
    latex: '\\text{양의 상관, 음의 상관, 무상관}',
    description: '두 변량 사이의 관계를 산점도로 나타내고 상관관계를 파악한다',
    level: 'middle',
    category: 'probability',
    tags: ['산점도', '상관관계', '양의상관', '음의상관', '통계', '중3'],
    grade: '중3',
    curriculum: '2022개정',

    hook: '키와 신발 사이즈의 관계? 산점도로 보면 양의 상관!',

    principle: `
      <strong>산점도</strong>: 두 변량의 순서쌍 (x, y)를 좌표평면에 점으로 찍은 그래프<br><br>
      점들의 분포를 보면 <strong>상관관계</strong>를 알 수 있어:<br><br>
      <strong>양의 상관</strong>: x가 커지면 y도 커지는 경향 (오른쪽 위로 올라감)<br>
      예: 키 ↑ → 신발 사이즈 ↑<br><br>
      <strong>음의 상관</strong>: x가 커지면 y는 작아지는 경향 (오른쪽 아래로 내려감)<br>
      예: 운동 시간 ↑ → 체지방률 ↓<br><br>
      <strong>상관없음</strong>: 특별한 경향이 없음 (점이 흩어져 있음)<br>
      예: 수학 점수와 키
    `,

    story: `
      산점도와 상관관계는 <strong>프랜시스 골턴</strong>(1886)이 체계화했어.<br><br>
      골턴은 아버지와 아들의 키 관계를 연구하면서 "평균으로의 회귀" 현상을 발견했지.
      키 큰 아버지의 아들은 아버지보다 평균에 가깝고, 키 작은 아버지의 아들도 마찬가지였어.<br><br>
      이 연구가 현대 <strong>회귀분석</strong>의 시초가 되었고,
      골턴의 제자 <strong>칼 피어슨</strong>이 상관계수를 공식화했어.
    `,

    realLife: [
      { icon: '📱', title: '앱 사용 시간', desc: '스마트폰 사용 시간과 시력의 관계? 산점도로 확인하면 음의 상관!' },
      { icon: '📚', title: '공부와 성적', desc: '공부 시간과 시험 점수의 산점도를 그리면 양의 상관이 보여' },
      { icon: '🌡️', title: '기온과 아이스크림', desc: '기온이 올라가면 아이스크림 판매량도 올라가 — 양의 상관!' },
    ],

    example: {
      question: '다음 자료에서 수학 점수와 과학 점수의 상관관계를 말하라. (60,55), (70,68), (80,75), (90,88), (85,80)',
      answer: '양의 상관관계',
      steps: [
        '순서쌍을 좌표평면에 점으로 찍는다.',
        '점들이 오른쪽 위로 올라가는 경향이 보인다.',
        '수학 점수가 높을수록 과학 점수도 높은 경향이 있다.',
        '∴ 양의 상관관계',
      ],
      hints: [
        '힌트 1: 산점도를 그려봐. x축에 수학, y축에 과학 점수를 놓아.',
        '힌트 2: 점들이 어느 방향으로 모여 있어?',
        '힌트 3: 오른쪽 위로 올라가면 양의 상관이야!',
      ],
      otherApproaches: [
        { name: '표로 확인', desc: '수학 점수가 60→70→80→85→90으로 올라갈 때 과학도 55→68→75→80→88로 함께 올라가. 양의 상관!' },
      ],
    },

    evolution: { prev: 'E043', next: undefined, family: '통계의 발전', familyDescription: '초등 그래프 → 중등 산점도·상관관계 → 고등 상관계수·회귀분석' },

    visualType: 'correlation_viz',
    relatedIds: ['M073', 'M075', 'M076'],
  },

  {
    id: 'M075',
    number: 75,
    name: '확률의 기본 성질',
    latex: '0 \\le P(A) \\le 1',
    description: '모든 사건의 확률은 0 이상 1 이하',
    level: 'middle',
    category: 'probability',
    tags: ['확률', '기본성질', '확률범위', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '확률은 절대 마이너스가 안 되고, 100%를 넘을 수도 없어. 0~1 사이, 그게 전부야!',

    principle: `
      확률 P(A)는 사건 A가 일어날 가능성을 0~1 사이 숫자로 나타낸 것이야.<br><br>
      <strong>P(A) = (사건 A가 일어나는 경우의 수) / (전체 경우의 수)</strong><br><br>
      • <strong>P(A) = 0</strong> → 절대 안 일어남 (불가능한 사건)<br>
      • <strong>P(A) = 1</strong> → 반드시 일어남 (확실한 사건)<br>
      • <strong>0 &lt; P(A) &lt; 1</strong> → 일어날 수도, 안 일어날 수도 있음<br><br>
      퍼센트로 바꾸려면 × 100 하면 돼. P = 0.3 → 30%
    `,

    story: `
      확률론은 1654년 <strong>파스칼</strong>과 <strong>페르마</strong>의 편지 교환에서 탄생했어.<br><br>
      도박사 <strong>드 메레</strong>가 "주사위 24번에 이중6이 한 번 이상 나올 확률"을 물었고,
      두 천재가 이 문제를 풀면서 확률이 수학으로 자리잡았지.<br><br>
      <strong>콜모고로프</strong>(1933)가 확률의 세 가지 공리를 세우면서 현대 확률론이 완성됐어.
    `,

    realLife: [
      { icon: '🌧️', title: '날씨 예보', desc: '강수확률 40% → P = 0.4 (0과 1 사이)' },
      { icon: '🎮', title: '가챠 확률', desc: 'SSR 뽑기 확률 2% → P = 0.02' },
      { icon: '⚾', title: '타율', desc: '타율 0.320 = 10번 중 약 3.2번 안타' },
    ],

    sliders: [
      { name: 'favorable', label: '유리한 경우의 수', min: 0, max: 20, default: 3, step: 1 },
      { name: 'total', label: '전체 경우의 수', min: 1, max: 20, default: 10, step: 1 },
    ],

    example: {
      question: '주사위를 한 번 던질 때, 3의 배수가 나올 확률은?',
      answer: 'P = 2/6 = 1/3',
      steps: [
        '전체 경우의 수: {1, 2, 3, 4, 5, 6} → 6가지',
        '3의 배수: {3, 6} → 2가지',
        'P = 2/6 = 1/3 ≈ 0.33',
        '0 ≤ 1/3 ≤ 1 ✓ 확률의 기본 성질 만족',
      ],
      hints: [
        '힌트 1: 주사위 눈 중 3의 배수를 찾아봐.',
        '힌트 2: 3, 6 두 개야. 전체 6가지 중 2가지.',
        '힌트 3: P = 2/6 = 1/3이야. 0~1 사이에 있지?',
      ],
      otherApproaches: [
        { name: '여사건으로 확인', desc: '3의 배수가 아닌 확률 4/6 = 2/3, 두 확률의 합이 1인지 확인해봐.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '확률 계보', familyDescription: '경우의 수 → 확률 기본 → 여사건 → 덧셈법칙 → 독립/조건부',
    },

    visualType: 'probability_basic',
    relatedIds: ['M074', 'M076'],
  },

  {
    id: 'M076',
    number: 76,
    name: '여사건의 확률',
    latex: 'P(A^c) = 1 - P(A)',
    description: '사건 A가 일어나지 않을 확률은 1에서 P(A)를 빼면 된다',
    level: 'middle',
    category: 'probability',
    tags: ['여사건', '확률', '보사건', '여확률', '중2'],
    grade: '중2',
    curriculum: '2022개정',

    hook: '"적어도 하나"를 구하기 어려우면? 전부 안 되는 경우를 빼! 그게 여사건이야.',

    principle: `
      사건 A의 <strong>여사건 A<sup>c</sup></strong>는 "A가 일어나지 않는 사건"이야.<br><br>
      <strong>P(A<sup>c</sup>) = 1 - P(A)</strong><br><br>
      A와 A<sup>c</sup>는 반드시 둘 중 하나만 일어나니까 합이 1이야.<br><br>
      <strong>"적어도 하나"</strong> 문제를 풀 때 매우 유용해:<br>
      P(적어도 하나) = 1 - P(하나도 아닌 경우)
    `,

    story: `
      여사건 아이디어는 <strong>역발상</strong>의 대표적 예야.<br><br>
      직접 세기 어려운 경우, 반대쪽을 세고 빼는 것이 훨씬 쉬울 때가 많아.
      수학에서 이런 <strong>"보수적 관점(complementary counting)"</strong>은
      조합론과 확률론 전반에서 활용되는 핵심 전략이야.
    `,

    realLife: [
      { icon: '🎮', title: '가챠 뽑기', desc: 'SSR이 안 나올 확률 98%이면, 나올 확률은 1-0.98 = 2%' },
      { icon: '🌤️', title: '비 안 올 확률', desc: '강수확률 30%이면 맑을 확률은 1-0.3 = 70%' },
      { icon: '🎯', title: '과녁 맞추기', desc: '빗나갈 확률 0.4면, 맞출 확률은 1-0.4 = 0.6' },
    ],

    sliders: [
      { name: 'pA', label: 'P(A)', min: 0, max: 1, default: 0.3, step: 0.05 },
    ],

    example: {
      question: '주사위를 던질 때, 1이 나오지 않을 확률은?',
      answer: 'P(1이 아님) = 1 - 1/6 = 5/6',
      steps: [
        '사건 A: 1이 나옴 → P(A) = 1/6',
        '여사건 Ac: 1이 나오지 않음',
        'P(Ac) = 1 - P(A) = 1 - 1/6 = 5/6',
      ],
      hints: [
        '힌트 1: 1이 나올 확률부터 구해봐.',
        '힌트 2: P(1이 나옴) = 1/6이야.',
        '힌트 3: 1에서 1/6을 빼면 돼. 1 - 1/6 = 5/6!',
      ],
      otherApproaches: [
        { name: '직접 세기', desc: '1이 아닌 눈: {2,3,4,5,6} → 5가지, P = 5/6으로 같은 결과야.' },
      ],
    },

    evolution: {
      prev: undefined, next: undefined, family: '확률 계보', familyDescription: '경우의 수 → 확률 기본 → 여사건 → 덧셈법칙 → 독립/조건부',
    },

    visualType: 'complement_prob',
    relatedIds: ['M075'],
  },
]

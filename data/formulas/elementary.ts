import { Formula } from '@/lib/types'

export const ELEMENTARY_FORMULAS: Formula[] = [

// ══════════════════════════════════════════
// 1~2학년 — 수와 연산
// ══════════════════════════════════════════

{
  id: 'E001', number: 1,
  name: '덧셈',
  latex: 'a + b = c',
  description: '두 수를 합쳐서 전체 개수를 구해',
  level: 'elementary', grade: '1~2학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['덧셈', '합', '1학년'],
  visualType: 'addition',

  hook: '사탕 3개 + 사탕 5개 = 몇 개? 더하기 하나면 세상 모든 합을 구할 수 있어! 🍬',

  principle: `
    사과 3개와 사과 5개를 합치면 몇 개일까?<br><br>
    하나씩 세어보면: 1, 2, 3 ... 4, 5, 6, 7, <strong style="color:#00ffcc">8</strong><br><br>
    더하기(+)는 두 양을 합치는 거야.<br>
    <strong>3 + 5 = 8</strong>
  `,

  story: `수천 년 전 이집트 상인들이 물건 개수를 셀 때<br>
    돌멩이를 한쪽에 모아두던 것에서 덧셈이 시작됐어.<br><br>
    나중에 독일 수학자들이 + 기호를 만들었는데,<br>
    라틴어 "et(그리고)"에서 왔다고 해!`,

  realLife: [
    { icon: '🍎', title: '과일 합치기', desc: '사과 3개 + 배 4개 = 7개. 바구니에 몇 개인지 알 수 있어.' },
    { icon: '🎮', title: '점수 더하기', desc: '1판 점수 50 + 2판 점수 30 = 총점 80점.' },
    { icon: '💰', title: '돈 계산', desc: '100원 + 50원 = 150원. 내 돈이 얼마인지 알 수 있어.' },
  ],

  sliders: [
    { name: 'a', label: 'a', min: 0, max: 10, default: 3, step: 1 },
    { name: 'b', label: 'b', min: 0, max: 10, default: 5, step: 1 },
  ],

  example: {
    question: '놀이터에 어린이가 4명 있었어요. 3명이 더 왔어요. 모두 몇 명인가요?',
    answer: '7명',
    steps: ['처음 어린이: 4명', '더 온 어린이: 3명', '4 + 3 = 7', '모두 7명!'],
    hints: [
      '힌트 1: 처음 어린이 수 4명, 더 온 어린이 수 3명이야.',
      '힌트 2: 더하기(+)를 써봐. 4 + 3 = ?',
      '힌트 3: 손가락으로 세어봐. 4에서 3을 더 세면 5, 6, 7!',
    ],
    otherApproaches: [
      { name: '손가락으로 세기', desc: '손가락 4개 펴고, 3개 더 세면 5, 6, 7 — 7명!' }
    ],
  },

  evolution: { prev: undefined, next: 'M013', family: '덧셈의 발전', familyDescription: '초등 덧셈 → 중등 문자식의 덧셈 → 고등 벡터·행렬 덧셈으로 확장' },
  relatedIds: ['E002', 'E003'],
},

{
  id: 'E002', number: 2,
  name: '뺄셈',
  latex: 'a - b = c',
  description: '전체에서 일부를 빼면 나머지가 나와',
  level: 'elementary', grade: '1~2학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['뺄셈', '차', '1학년'],
  visualType: 'subtraction',

  hook: '먹고 남은 피자가 몇 조각인지, 거스름돈이 얼마인지 — 뺄셈이면 바로 알 수 있어! 🍕',

  principle: `
    사탕 8개 중에서 3개를 먹으면 몇 개 남을까?<br><br>
    8개에서 3개를 없애면: <strong style="color:#00ffcc">5개</strong> 남아!<br><br>
    뺄셈(-)은 전체에서 일부를 없애는 거야.<br>
    <strong>8 - 3 = 5</strong>
  `,

  story: `덧셈이 생기자마자 뺄셈도 같이 생겼어.<br><br>
    고대 상인들이 팔고 남은 물건을 셀 때,<br>
    전체에서 판 것을 빼는 방법이 바로 뺄셈이야!<br><br>
    - 기호는 + 기호에서 가로선만 남긴 것이래.`,

  realLife: [
    { icon: '🍬', title: '사탕 남은 것', desc: '사탕 10개 중 4개를 먹으면 10 - 4 = 6개 남아.' },
    { icon: '💵', title: '거스름돈', desc: '1000원짜리로 700원짜리 사면 1000 - 700 = 300원 거스름돈.' },
    { icon: '🎯', title: '남은 시도', desc: '3번 시도 중 1번 성공하면 3 - 1 = 2번 남았어.' },
  ],

  sliders: [
    { name: 'a', label: 'a', min: 1, max: 15, default: 8, step: 1 },
    { name: 'b', label: 'b', min: 0, max: 10, default: 3, step: 1 },
  ],

  example: {
    question: '과자가 9개 있었는데 4개를 먹었어요. 남은 과자는 몇 개인가요?',
    answer: '5개',
    steps: ['처음 과자: 9개', '먹은 과자: 4개', '9 - 4 = 5', '남은 과자는 5개!'],
    hints: [
      '힌트 1: 처음 개수 9에서 먹은 개수 4를 빼봐.',
      '힌트 2: 9 - 4 = ? 손가락으로 세어봐도 돼.',
      '힌트 3: 9에서 4개를 없애면 5개가 남아!',
    ],
    otherApproaches: [
      { name: '거꾸로 세기', desc: '9에서 거꾸로 4번 세봐. 8, 7, 6, 5 — 5개!' }
    ],
  },

  evolution: { prev: undefined, next: 'M003', family: '뺄셈의 발전', familyDescription: '초등 뺄셈 → 중등 음수와 정수의 뺄셈 → 고등 절댓값·벡터 차로 발전' },
  relatedIds: ['E001', 'E003'],
},

{
  id: 'E003', number: 3,
  name: '덧셈과 뺄셈의 관계',
  latex: 'a + b = c \\Leftrightarrow c - b = a',
  description: '덧셈식을 알면 뺄셈식도 바로 알 수 있어',
  level: 'elementary', grade: '1~2학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['덧셈', '뺄셈', '관계', '역연산', '1학년'],
  visualType: 'add_sub_relation',

  hook: '7 - 3 = ?가 헷갈리면 3 + ? = 7로 바꿔봐. 덧셈으로 뺄셈을 풀 수 있어! 🔄',

  principle: `
    접시 위 사과 3개 + 사과 4개 = 7개<br><br>
    이걸 거꾸로 생각하면:<br>
    사과 7개 - 4개 = 3개<br>
    사과 7개 - 3개 = 4개<br><br>
    <strong>덧셈식 하나에서 뺄셈식 두 개가 나와!</strong>
  `,

  story: `옛날 상인들이 창고 재고를 관리할 때<br>
    "넣었다 뺐다"를 계속 기록했는데,<br>
    덧셈과 뺄셈이 서로 반대라는 걸 깨달았어.<br><br>
    이 관계 덕분에 모르는 수를 □로 놓고<br>
    쉽게 구할 수 있게 됐어!`,

  realLife: [
    { icon: '🎒', title: '가방 속 물건', desc: '5개 넣고 2개 꺼내면 3개. 2 + 3 = 5 이기도 해!' },
    { icon: '🧩', title: '퍼즐', desc: '□ + 4 = 9 → 9 - 4 = 5. □ = 5야!' },
    { icon: '💡', title: '모르는 수 찾기', desc: '3 + □ = 7이면 □ = 7 - 3 = 4!' },
  ],

  sliders: [
    { name: 'a', label: 'a', min: 1, max: 10, default: 3, step: 1 },
    { name: 'b', label: 'b', min: 1, max: 10, default: 4, step: 1 },
  ],

  example: {
    question: '□ + 5 = 12일 때, □는 얼마인가요?',
    answer: '7',
    steps: ['□ + 5 = 12', '12 - 5 = □', '12 - 5 = 7', '□ = 7!'],
    hints: [
      '힌트 1: □ + 5 = 12에서 □를 구하려면 뺄셈으로 바꿔봐.',
      '힌트 2: 12에서 5를 빼면 □가 나와.',
      '힌트 3: 12 - 5 = 7이야!',
    ],
    otherApproaches: [
      { name: '확인하기', desc: '7 + 5 = 12. 맞아! 덧셈으로 확인할 수 있어.' }
    ],
  },

  evolution: { prev: undefined, next: 'M015', family: '역연산의 발전', familyDescription: '초등 □ 찾기 → 중등 일차방정식 → 고등 역함수 개념으로 발전' },
  relatedIds: ['E001', 'E002'],
},

{
  id: 'E004', number: 4,
  name: '곱셈구구',
  latex: 'a \\times b = c',
  description: '같은 수를 여러 번 더하는 빠른 방법',
  level: 'elementary', grade: '1~2학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['곱셈', '구구단', '곱셈구구', '2학년'],
  visualType: 'times_table',

  hook: '3을 4번 더하면? 3+3+3+3=12 — 이걸 3×4=12로 순식간에 계산해! 곱셈구구가 있으면 계산이 엄청 빨라져 🚀',

  principle: `
    귤 3개씩 담은 봉지가 4봉지 있어.<br><br>
    하나씩 세면: 3 + 3 + 3 + 3 = 12<br>
    곱셈으로 하면: <strong style="color:#00ffcc">3 × 4 = 12</strong><br><br>
    곱셈은 같은 수를 여러 번 더하는 걸 빠르게 계산하는 방법이야!
  `,

  story: `곱셈구구는 중국에서 2,000년 전에 만들어졌어.<br><br>
    "구구팔십일(9×9=81)"처럼 외웠기 때문에<br>
    "구구단"이라고 부르게 됐어.<br><br>
    지금도 전 세계 어린이들이 곱셈구구를 외우고 있어! 🌍`,

  realLife: [
    { icon: '🍫', title: '초콜릿 개수', desc: '한 줄에 4개씩 3줄 = 4 × 3 = 12개.' },
    { icon: '🪑', title: '의자 개수', desc: '한 줄에 5개씩 6줄 = 5 × 6 = 30개.' },
    { icon: '💰', title: '가격 계산', desc: '500원짜리 과자 4개 = 500 × 4 = 2000원.' },
  ],

  sliders: [
    { name: 'a', label: 'a', min: 1, max: 9, default: 3, step: 1 },
    { name: 'b', label: 'b', min: 1, max: 9, default: 4, step: 1 },
  ],

  example: {
    question: '한 상자에 사과가 6개씩 들어있어요. 5상자에는 사과가 모두 몇 개인가요?',
    answer: '30개',
    steps: ['한 상자: 6개', '5상자니까 6을 5번 더해야 해', '6 × 5 = 30', '사과는 모두 30개!'],
    hints: [
      '힌트 1: 6개씩 5상자는 곱셈으로 쓰면 6 × 5야.',
      '힌트 2: 6단 곱셈구구에서 6 × 5를 찾아봐.',
      '힌트 3: 6 × 5 = 30이야!',
    ],
    otherApproaches: [
      { name: '더하기로 확인', desc: '6+6+6+6+6 = 30. 곱셈이 훨씬 빠르지?' }
    ],
  },

  evolution: { prev: undefined, next: 'M012', family: '곱셈의 발전', familyDescription: '초등 곱셈구구 → 중등 문자식·다항식 곱셈 → 고등 행렬 곱셈으로 발전' },
  relatedIds: ['E005', 'E006'],
},

// ══════════════════════════════════════════
// 3~4학년 — 수와 연산
// ══════════════════════════════════════════

{
  id: 'E005', number: 5,
  name: '곱셈',
  latex: 'a \\times b = c',
  description: '두 자리 수끼리도 자릿값으로 나누면 쉽게 곱할 수 있어',
  level: 'elementary', grade: '3~4학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['곱셈', '두자리곱셈', '자릿값', '3학년'],
  visualType: 'multiply_long',

  hook: '23×4처럼 큰 수도 자릿값으로 나눠서 계산하면 쉬워! 🧮',

  principle: `
    23 × 4를 어떻게 계산할까?<br><br>
    23을 20과 3으로 나눠보자!<br>
    20 × 4 = <strong>80</strong><br>
    3 × 4 = <strong>12</strong><br>
    80 + 12 = <strong style="color:#00ffcc">92</strong><br><br>
    큰 수도 자릿값으로 쪼개면 쉽게 곱할 수 있어!
  `,

  story: `고대 이집트에서는 곱셈을 할 때<br>
    수를 두 배씩 늘려가며 계산했어.<br><br>
    이 방법은 "러시아 농민 곱셈법"이라고도 불려.<br>
    지금은 자릿값을 이용해서 더 빠르게 계산해! ✨`,

  realLife: [
    { icon: '📦', title: '택배 박스', desc: '한 박스에 24개씩 3박스 = 24 × 3 = 72개.' },
    { icon: '🪴', title: '화분 배열', desc: '한 줄에 15개씩 4줄 = 15 × 4 = 60개.' },
    { icon: '🎫', title: '표 계산', desc: '입장료 3500원 × 2명 = 7000원.' },
  ],

  sliders: [
    { name: 'a', label: 'a', min: 10, max: 50, default: 23, step: 1 },
    { name: 'b', label: 'b', min: 1, max: 9, default: 4, step: 1 },
  ],

  example: {
    question: '한 박스에 24개씩 들어있는 연필이 3박스 있어요. 연필은 모두 몇 개인가요?',
    answer: '72개',
    steps: ['한 박스: 24개, 3박스', '24를 20과 4로 나눠', '20 × 3 = 60', '4 × 3 = 12', '60 + 12 = 72', '연필은 모두 72개!'],
    hints: [
      '힌트 1: 24 × 3을 계산해야 해.',
      '힌트 2: 24를 20 + 4로 나눠서 각각 곱해봐.',
      '힌트 3: 20×3=60, 4×3=12, 합치면 72!',
    ],
    otherApproaches: [
      { name: '세로 곱셈', desc: '24를 세로로 쓰고 3을 곱해. 일의 자리부터 계산하면 72!' }
    ],
  },

  evolution: { prev: undefined, next: 'M022', family: '곱셈의 발전', familyDescription: '초등 자연수 곱셈 → 중등 다항식 곱셈 → 고등 이항정리로 발전' },
  relatedIds: ['E004', 'E006', 'E007'],
},

{
  id: 'E006', number: 6,
  name: '나눗셈',
  latex: 'a \\div b = c',
  description: '똑같이 나누면 한 몫이 얼마인지 알 수 있어',
  level: 'elementary', grade: '3~4학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['나눗셈', '몫', '3학년'],
  visualType: 'division',

  hook: '12개 과자를 3명이 나눠가지면? 12÷3=4 — 나눗셈이면 바로! 🍪',

  principle: `
    사탕 12개를 3명에게 똑같이 나눠주자!<br><br>
    한 명에게 1개씩 주면 3개 사용 → 남은 9개<br>
    또 1개씩 주면 3개 사용 → 남은 6개<br>
    또 1개씩 → 남은 3개<br>
    또 1개씩 → 남은 0개!<br><br>
    한 명에게 <strong style="color:#00ffcc">4개씩</strong> 나눠줄 수 있어.<br>
    <strong>12 ÷ 3 = 4</strong>
  `,

  story: `고대 로마 군대에서는 식량을 병사들에게<br>
    똑같이 나눠줘야 했어.<br><br>
    100개의 빵을 20명에게 나누면?<br>
    이런 문제를 풀기 위해 나눗셈이 발달했어! 🏛️`,

  realLife: [
    { icon: '🍰', title: '케이크 나누기', desc: '케이크 1개를 8명이 나누면 1 ÷ 8 = 한 조각씩!' },
    { icon: '👨‍👩‍👧‍👦', title: '간식 나누기', desc: '사탕 20개를 5명이 나누면 20 ÷ 5 = 4개씩.' },
    { icon: '📚', title: '책 정리', desc: '책 28권을 7칸에 나누면 28 ÷ 7 = 4권씩.' },
  ],

  sliders: [
    { name: 'a', label: 'a (나눠질 수)', min: 1, max: 50, default: 12, step: 1 },
    { name: 'b', label: 'b (나누는 수)', min: 1, max: 10, default: 3, step: 1 },
  ],

  example: {
    question: '초콜릿 28개를 4명이 똑같이 나누면 한 명에게 몇 개씩 줄 수 있나요?',
    answer: '7개씩',
    steps: ['전체 초콜릿: 28개', '나누는 사람: 4명', '28 ÷ 4 = 7', '한 명에게 7개씩!'],
    hints: [
      '힌트 1: 28개를 4명에게 똑같이 나눠야 해.',
      '힌트 2: 28 ÷ 4 = ? 4단 곱셈구구를 거꾸로 생각해봐.',
      '힌트 3: 4 × 7 = 28이니까 28 ÷ 4 = 7이야!',
    ],
    otherApproaches: [
      { name: '곱셈으로 확인', desc: '4 × 7 = 28. 맞아! 나눗셈은 곱셈의 반대야.' }
    ],
  },

  evolution: { prev: undefined, next: 'M015', family: '나눗셈의 발전', familyDescription: '초등 나눗셈 → 중등 방정식 풀이 → 고등 다항식 나눗셈으로 발전' },
  relatedIds: ['E004', 'E005', 'E007'],
},

{
  id: 'E007', number: 7,
  name: '곱셈과 나눗셈의 관계',
  latex: 'a \\div b = c \\Leftrightarrow a = b \\times c',
  description: '곱셈식을 알면 나눗셈식도 바로 알 수 있어',
  level: 'elementary', grade: '3~4학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['곱셈', '나눗셈', '관계', '역연산', '3학년'],
  visualType: 'mul_div_relation',

  hook: '6÷2=?가 헷갈리면 2×?=6으로 바꿔봐. 2단에서 찾으면 돼! 🔄',

  principle: `
    과일 12개를 3개씩 담으면 4봉지가 돼.<br><br>
    곱셈으로 쓰면: 3 × 4 = 12<br>
    나눗셈으로 쓰면: 12 ÷ 3 = 4, 12 ÷ 4 = 3<br><br>
    <strong>곱셈식 하나에서 나눗셈식 두 개가 나와!</strong><br>
    나눗셈이 어려우면 곱셈으로 바꿔서 생각해봐.
  `,

  story: `덧셈↔뺄셈처럼 곱셈↔나눗셈도 서로 반대야.<br><br>
    옛날 장사꾼들은 물건을 묶음으로 팔았어.<br>
    "5개씩 묶으면 몇 묶음?" → 나눗셈<br>
    "5개씩 6묶음은 몇 개?" → 곱셈<br><br>
    이 관계를 알면 □가 있는 문제도 쉽게 풀 수 있어!`,

  realLife: [
    { icon: '🎁', title: '선물 포장', desc: '리본 42cm를 6cm씩 자르면? 6 × ? = 42 → 7도막!' },
    { icon: '🏫', title: '줄 세우기', desc: '35명을 5줄로 세우면? 5 × ? = 35 → 한 줄에 7명!' },
    { icon: '🧮', title: '모르는 수 찾기', desc: '□ × 8 = 56이면 □ = 56 ÷ 8 = 7!' },
  ],

  sliders: [
    { name: 'a', label: 'a (전체)', min: 1, max: 81, default: 12, step: 1 },
    { name: 'b', label: 'b (한 묶음)', min: 1, max: 9, default: 3, step: 1 },
  ],

  example: {
    question: '□ ÷ 6 = 7일 때, □는 얼마인가요?',
    answer: '42',
    steps: ['□ ÷ 6 = 7', '나눗셈을 곱셈으로 바꾸면: □ = 6 × 7', '6 × 7 = 42', '□ = 42!'],
    hints: [
      '힌트 1: □ ÷ 6 = 7을 곱셈으로 바꿔봐.',
      '힌트 2: □ = 6 × 7로 바꿀 수 있어.',
      '힌트 3: 6 × 7 = 42이야!',
    ],
    otherApproaches: [
      { name: '확인하기', desc: '42 ÷ 6 = 7. 맞아! 곱셈으로 확인할 수 있어.' }
    ],
  },

  evolution: { prev: undefined, next: 'M015', family: '역연산의 발전', familyDescription: '초등 □ 찾기 → 중등 방정식 → 고등 역함수 개념으로 발전' },
  relatedIds: ['E005', 'E006'],
},

{
  id: 'E008', number: 8,
  name: '어림셈',
  latex: '\\text{올림, 버림, 반올림}',
  description: '정확하지 않아도 대략 얼마인지 빠르게 알 수 있어',
  level: 'elementary', grade: '3~4학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['어림셈', '올림', '버림', '반올림', '4학년'],
  visualType: 'rounding',

  hook: '450원짜리 과자 살 때 500원이 필요해 — 이런 게 올림이야! 🪙',

  principle: `
    <strong>올림</strong>: 숫자를 올려서 크게 만들어.<br>
    450 → 500 (백의 자리 올림)<br><br>
    <strong>버림</strong>: 숫자를 내려서 작게 만들어.<br>
    479 → 400 (백의 자리 버림)<br><br>
    <strong>반올림</strong>: 5 이상이면 올리고, 4 이하면 버려.<br>
    <strong style="color:#00ffcc">450 → 500</strong> (십의 자리가 5이니까 올림!)<br>
    <strong>430 → 400</strong> (십의 자리가 3이니까 버림!)
  `,

  story: `옛날 시장 상인들은 계산기가 없었어.<br><br>
    물건 가격을 대충 어림해서 계산했지.<br>
    "이건 약 500원, 저건 약 300원, 합하면 약 800원!"<br><br>
    이렇게 빠르게 어림하는 것이 바로 어림셈이야! 🏪`,

  realLife: [
    { icon: '🛒', title: '장보기', desc: '1280원 + 3450원 ≈ 1300 + 3500 = 4800원 정도 필요해.' },
    { icon: '🚗', title: '거리 계산', desc: '서울에서 부산까지 325km ≈ 약 300km.' },
    { icon: '👥', title: '인구수', desc: '51,780,000명 → 약 5천만 명이라고 말해.' },
  ],

  sliders: [
    { name: 'a', label: '수', min: 100, max: 999, default: 450, step: 1 },
  ],

  example: {
    question: '357을 백의 자리에서 반올림하면 얼마인가요?',
    answer: '400',
    steps: ['357에서 백의 자리 아래 숫자를 봐: 57', '십의 자리 숫자가 5야', '5 이상이면 올림!', '357 → 400!'],
    hints: [
      '힌트 1: 반올림은 5 이상이면 올리고, 4 이하면 버려.',
      '힌트 2: 357에서 십의 자리 숫자 5를 봐.',
      '힌트 3: 5 이상이니까 올림해서 400!',
    ],
    otherApproaches: [
      { name: '수직선으로 생각', desc: '357은 300과 400 사이에서 400에 더 가까워. 그래서 400!' }
    ],
  },

  evolution: { prev: undefined, next: 'M009', family: '어림의 발전', familyDescription: '초등 올림·버림·반올림 → 중등 실수의 대소 비교 → 고등 극한·근삿값으로 발전' },
  relatedIds: ['E005', 'E006'],
},

{
  id: 'E009', number: 9,
  name: '분수',
  latex: '\\frac{a}{b}',
  description: '전체를 똑같이 나눈 것 중 일부를 나타내는 수',
  level: 'elementary', grade: '3~4학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['분수', '진분수', '가분수', '대분수', '3학년'],
  visualType: 'fraction_intro',

  hook: '피자를 4조각으로 자르면 한 조각은 1/4! 분수는 나눈 것의 일부야 🍕',

  principle: `
    피자를 8조각으로 똑같이 잘랐어.<br>
    내가 3조각을 먹었다면?<br><br>
    <strong>분모</strong> = 전체 조각 수 = 8<br>
    <strong>분자</strong> = 내 조각 수 = 3<br><br>
    내가 먹은 양은 <strong style="color:#00ffcc">3/8</strong>이야!<br><br>
    분수는 전체를 똑같이 나눈 것 중 일부를 나타내는 수야.
  `,

  story: `고대 이집트에서는 분수를 아주 특별하게 썼어.<br><br>
    분자가 1인 분수만 사용했지! (1/2, 1/3, 1/4...)<br>
    이걸 "단위분수"라고 불러.<br><br>
    지금 우리가 쓰는 분수 표기법은<br>
    인도와 아라비아 수학자들이 만들었어! ✍️`,

  realLife: [
    { icon: '🍕', title: '피자 나누기', desc: '피자 8조각 중 3조각 먹으면 3/8을 먹은 거야.' },
    { icon: '🎂', title: '케이크', desc: '케이크 1/4 조각은 4등분 중 하나야.' },
    { icon: '⏰', title: '시간', desc: '30분은 1시간의 1/2이야.' },
  ],

  sliders: [
    { name: 'a', label: '분자', min: 1, max: 10, default: 3, step: 1 },
    { name: 'b', label: '분모', min: 2, max: 10, default: 8, step: 1 },
  ],

  example: {
    question: '피자를 8조각으로 나눴어요. 민수가 3조각을 먹었어요. 민수가 먹은 양을 분수로 나타내면?',
    answer: '3/8',
    steps: ['전체 조각 수(분모): 8', '먹은 조각 수(분자): 3', '분수로 쓰면: 3/8', '민수가 먹은 양은 3/8!'],
    hints: [
      '힌트 1: 분모는 전체를 몇 조각으로 나눴는지야.',
      '힌트 2: 분자는 그 중 몇 조각인지야.',
      '힌트 3: 8조각 중 3조각이니까 3/8!',
    ],
    otherApproaches: [
      { name: '그림으로 이해', desc: '원을 8칸으로 나누고 3칸을 색칠하면 3/8이야!' }
    ],
  },

  evolution: { prev: undefined, next: 'M005', family: '분수의 발전', familyDescription: '초등 분수 → 중등 유리수와 유리식 → 고등 유리함수로 발전' },
  relatedIds: ['E010', 'E011'],
},

{
  id: 'E010', number: 10,
  name: '소수',
  latex: '0.1, 0.01, 0.001',
  description: '1보다 작은 양을 점(.)으로 나타내는 수',
  level: 'elementary', grade: '3~4학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['소수', '소수점', '4학년'],
  visualType: 'decimal_intro',

  hook: '1을 10칸으로 나누면 한 칸이 0.1이야. 온도계 숫자가 소수야! 🌡️',

  principle: `
    1m를 10칸으로 똑같이 나누면<br>
    한 칸은 <strong style="color:#00ffcc">0.1m</strong>야!<br><br>
    0.1이 10개 모이면 1이 돼.<br>
    0.01이 10개 모이면 0.1이 돼.<br><br>
    소수점(.) 오른쪽 숫자가 작은 단위를 나타내!
  `,

  story: `17세기 네덜란드 수학자 스테빈이<br>
    소수점을 발명했어.<br><br>
    그 전에는 분수로만 나타냈는데,<br>
    소수점 덕분에 계산이 훨씬 편해졌어!<br><br>
    돈 계산할 때 3500.50원처럼 쓰는 것도 소수야 💡`,

  realLife: [
    { icon: '🌡️', title: '체온', desc: '체온 36.5°C에서 0.5가 소수야.' },
    { icon: '📏', title: '키 재기', desc: '키 142.3cm에서 0.3이 소수 부분이야.' },
    { icon: '⚖️', title: '무게', desc: '사과 0.3kg은 300g이야.' },
  ],

  sliders: [
    { name: 'a', label: '정수 부분', min: 0, max: 10, default: 1, step: 1 },
    { name: 'b', label: '소수 첫째 자리', min: 0, max: 9, default: 5, step: 1 },
  ],

  example: {
    question: '0.1이 7개이면 얼마인가요?',
    answer: '0.7',
    steps: ['0.1이 1개 = 0.1', '0.1이 7개 = 0.1 × 7', '= 0.7', '0.1이 7개이면 0.7!'],
    hints: [
      '힌트 1: 0.1이 1개면 0.1이야.',
      '힌트 2: 0.1이 7개면 0.1을 7번 더해봐.',
      '힌트 3: 0.1 + 0.1 + ... = 0.7!',
    ],
    otherApproaches: [
      { name: '분수로 바꾸기', desc: '0.1 = 1/10이니까, 7개면 7/10 = 0.7!' }
    ],
  },

  evolution: { prev: undefined, next: 'M006', family: '소수의 발전', familyDescription: '초등 소수 → 중등 순환소수와 무한소수 → 고등 실수 체계로 발전' },
  relatedIds: ['E009', 'E012'],
},

{
  id: 'E011', number: 11,
  name: '분수의 덧셈과 뺄셈 (같은 분모)',
  latex: '\\frac{a}{n} \\pm \\frac{b}{n} = \\frac{a \\pm b}{n}',
  description: '분모가 같으면 분자끼리만 더하거나 빼면 돼',
  level: 'elementary', grade: '3~4학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['분수', '덧셈', '뺄셈', '같은분모', '4학년'],
  visualType: 'fraction_add_same',

  hook: '피자 8조각 중 2조각 + 3조각 = 5조각 → 2/8 + 3/8 = 5/8 바로! 🍕',

  principle: `
    같은 피자에서 조각을 세는 거야.<br><br>
    2/7 + 3/7 = ?<br>
    분모(7)는 그대로!<br>
    분자끼리만 더해: 2 + 3 = 5<br><br>
    <strong style="color:#00ffcc">2/7 + 3/7 = 5/7</strong><br><br>
    분모가 같으면 분자끼리만 계산하면 돼!
  `,

  story: `분수를 더하는 건 같은 크기 조각을 세는 거야.<br><br>
    피자를 7등분하면 조각 크기가 같으니까<br>
    2조각 + 3조각 = 5조각!<br><br>
    분모가 같다 = 조각 크기가 같다는 뜻이야 🧩`,

  realLife: [
    { icon: '🍕', title: '피자', desc: '피자 1/8 + 2/8 = 3/8. 조각을 세는 거야!' },
    { icon: '🥤', title: '음료', desc: '주스 2/5L + 1/5L = 3/5L.' },
    { icon: '📏', title: '리본', desc: '리본 3/10m + 4/10m = 7/10m.' },
  ],

  sliders: [
    { name: 'a', label: '분자 a', min: 1, max: 8, default: 2, step: 1 },
    { name: 'b', label: '분자 b', min: 1, max: 8, default: 3, step: 1 },
    { name: 'n', label: '분모 n', min: 2, max: 10, default: 7, step: 1 },
  ],

  example: {
    question: '3/7 + 2/7은 얼마인가요?',
    answer: '5/7',
    steps: ['분모가 같은지 확인: 둘 다 7 ✅', '분자끼리 더해: 3 + 2 = 5', '분모는 그대로: 7', '3/7 + 2/7 = 5/7!'],
    hints: [
      '힌트 1: 분모가 같은 분수의 덧셈은 분자끼리만 더해.',
      '힌트 2: 3 + 2 = 5, 분모는 7 그대로.',
      '힌트 3: 답은 5/7이야!',
    ],
    otherApproaches: [
      { name: '그림으로 확인', desc: '7칸 중 3칸 색칠 + 2칸 색칠 = 5칸 색칠 = 5/7!' }
    ],
  },

  evolution: { prev: undefined, next: 'M013', family: '분수 계산의 발전', familyDescription: '초등 분수 덧셈 → 중등 일차식 덧셈 → 고등 유리식의 덧셈으로 발전' },
  relatedIds: ['E009', 'E018'],
},

{
  id: 'E012', number: 12,
  name: '소수의 덧셈과 뺄셈',
  latex: 'a.b + c.d',
  description: '소수점 자리를 맞춰서 더하거나 빼면 돼',
  level: 'elementary', grade: '3~4학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['소수', '덧셈', '뺄셈', '4학년'],
  visualType: 'decimal_add_sub',

  hook: '1.5 + 2.3은 자릿수 맞춰서 더하면 돼. 소수점 위치가 핵심이야! 🎯',

  principle: `
    2.4 + 1.7 = ?<br><br>
    소수점을 세로로 맞추자!<br>
    &nbsp;&nbsp;2.4<br>
    + 1.7<br>
    ────<br>
    소수 부분: 4 + 7 = 11 → 1을 올려!<br>
    정수 부분: 2 + 1 + 1(올림) = 4<br><br>
    <strong style="color:#00ffcc">2.4 + 1.7 = 4.1</strong>
  `,

  story: `소수 계산도 자연수 계산과 똑같아!<br><br>
    딱 하나만 기억해:<br>
    <strong>소수점 위치를 맞추자!</strong><br><br>
    마트 영수증에 나오는 가격 계산이<br>
    바로 소수의 덧셈이야 🧾`,

  realLife: [
    { icon: '📏', title: '키 비교', desc: '내 키 142.5cm, 친구 키 145.3cm. 차이는 145.3 - 142.5 = 2.8cm!' },
    { icon: '⚖️', title: '무게 합산', desc: '사과 0.3kg + 배 0.5kg = 0.8kg.' },
    { icon: '💧', title: '물 양', desc: '물 1.5L + 0.7L = 2.2L.' },
  ],

  sliders: [
    { name: 'a', label: '첫째 수', min: 0, max: 10, default: 2, step: 0.1 },
    { name: 'b', label: '둘째 수', min: 0, max: 10, default: 1, step: 0.1 },
  ],

  example: {
    question: '2.4 + 1.7은 얼마인가요?',
    answer: '4.1',
    steps: ['소수점을 맞춰 세로로 써', '소수 부분: 4 + 7 = 11, 1 쓰고 1 올림', '정수 부분: 2 + 1 + 1(올림) = 4', '2.4 + 1.7 = 4.1!'],
    hints: [
      '힌트 1: 소수점 자리를 맞춰서 세로로 쓰면 돼.',
      '힌트 2: 0.4 + 0.7 = 1.1이야. 1을 올려!',
      '힌트 3: 2 + 1 + 1(올림) = 4. 답은 4.1!',
    ],
    otherApproaches: [
      { name: '분수로 바꾸기', desc: '2.4 = 24/10, 1.7 = 17/10. (24+17)/10 = 41/10 = 4.1!' }
    ],
  },

  evolution: { prev: undefined, next: 'M013', family: '소수 계산의 발전', familyDescription: '초등 소수 덧셈 → 중등 유리수 계산 → 고등 실수 계산으로 발전' },
  relatedIds: ['E010', 'E011'],
},

// ══════════════════════════════════════════
// 5~6학년 — 수와 연산
// ══════════════════════════════════════════

{
  id: 'E013', number: 13,
  name: '자연수의 혼합 계산',
  latex: '(), \\times, \\div, +, -',
  description: '괄호 → 곱셈·나눗셈 → 덧셈·뺄셈 순서로 계산해',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['혼합계산', '계산순서', '괄호', '5학년'],
  visualType: 'mixed_calc',

  hook: '2 + 3 × 4 = 20? 아니야 14야! 순서를 지켜야 해 📏',

  principle: `
    계산에는 순서가 있어!<br><br>
    <strong>1단계</strong>: 괄호 ( ) 안을 먼저!<br>
    <strong>2단계</strong>: 곱셈(×)과 나눗셈(÷)을 먼저!<br>
    <strong>3단계</strong>: 덧셈(+)과 뺄셈(-)은 나중에!<br><br>
    예시: 2 + 3 × 4<br>
    → 곱셈 먼저: 3 × 4 = 12<br>
    → 그다음 덧셈: 2 + 12 = <strong style="color:#00ffcc">14</strong>
  `,

  story: `옛날에는 사람마다 계산 순서가 달라서<br>
    같은 식인데 답이 달랐어!<br><br>
    수학자들이 모여서 약속을 정했어:<br>
    "괄호 먼저, 곱셈·나눗셈 먼저!"<br><br>
    이 약속 덕분에 전 세계 누구나 같은 답을 얻어! 🌍`,

  realLife: [
    { icon: '🛒', title: '장보기', desc: '사과 3개(500원) + 배 2개(800원) = 3×500 + 2×800 = 3100원.' },
    { icon: '🎮', title: '게임 점수', desc: '기본 10점 + 보너스 3×5 = 10 + 15 = 25점.' },
    { icon: '🍱', title: '도시락', desc: '(밥 + 반찬) × 3인분. 괄호 안부터 계산!' },
  ],

  sliders: undefined,

  example: {
    question: '3 + 4 × 2 - 1은 얼마인가요?',
    answer: '10',
    steps: ['곱셈 먼저: 4 × 2 = 8', '왼쪽부터: 3 + 8 = 11', '11 - 1 = 10', '답은 10!'],
    hints: [
      '힌트 1: 곱셈을 먼저 계산해야 해.',
      '힌트 2: 4 × 2 = 8을 먼저 계산해.',
      '힌트 3: 3 + 8 - 1 = 10!',
    ],
    otherApproaches: [
      { name: '밑줄 치기', desc: '곱셈 부분에 밑줄을 치고 먼저 계산하면 실수가 줄어!' }
    ],
  },

  evolution: { prev: undefined, next: 'M012', family: '계산 규칙의 발전', familyDescription: '초등 혼합계산 순서 → 중등 문자식 계산 → 고등 함수의 합성으로 발전' },
  relatedIds: ['E005', 'E006'],
},

{
  id: 'E014', number: 14,
  name: '수의 범위',
  latex: 'a \\leq x, x < b',
  description: '이상, 이하, 초과, 미만으로 수의 범위를 나타내',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['수의범위', '이상', '이하', '초과', '미만', '5학년'],
  visualType: 'number_range',

  hook: '키 130cm 이상이어야 놀이기구 탈 수 있어 — 이게 수의 범위야! 🎢',

  principle: `
    <strong>이상</strong>: 그 수를 포함해서 크거나 같은 수 (5 이상 → 5, 6, 7...)<br>
    <strong>이하</strong>: 그 수를 포함해서 작거나 같은 수 (5 이하 → 5, 4, 3...)<br>
    <strong>초과</strong>: 그 수는 빼고 큰 수 (5 초과 → 6, 7, 8...)<br>
    <strong>미만</strong>: 그 수는 빼고 작은 수 (5 미만 → 4, 3, 2...)<br><br>
    <strong style="color:#00ffcc">"이상/이하"는 포함 ✅, "초과/미만"은 불포함 ❌</strong>
  `,

  story: `놀이공원에서 키를 재는 것처럼<br>
    우리 생활에는 범위가 가득해!<br><br>
    "12세 이상 관람가", "30km/h 이하로 운전"<br>
    이 모두 수의 범위를 나타내는 거야.<br><br>
    수직선 위에 동그라미(●)와 빈 동그라미(○)로 표시해! 📐`,

  realLife: [
    { icon: '🎢', title: '놀이기구', desc: '키 120cm 이상만 탑승 가능! 120cm도 탈 수 있어.' },
    { icon: '🚗', title: '속도 제한', desc: '30km/h 이하로 운전 = 30km/h까지 OK.' },
    { icon: '🎬', title: '영화 등급', desc: '15세 이상 관람가 = 15세부터 볼 수 있어.' },
  ],

  sliders: [
    { name: 'a', label: '시작', min: 1, max: 20, default: 10, step: 1 },
    { name: 'b', label: '끝', min: 5, max: 30, default: 20, step: 1 },
  ],

  example: {
    question: '10 이상 20 미만인 자연수를 모두 써봐요.',
    answer: '10, 11, 12, 13, 14, 15, 16, 17, 18, 19',
    steps: ['이상: 10을 포함해서 크거나 같은 수', '미만: 20은 포함하지 않고 작은 수', '10부터 19까지!', '10, 11, 12, 13, 14, 15, 16, 17, 18, 19'],
    hints: [
      '힌트 1: "이상"은 그 수를 포함해. 10 이상 → 10부터!',
      '힌트 2: "미만"은 그 수를 포함하지 않아. 20 미만 → 19까지!',
      '힌트 3: 10부터 19까지 쓰면 돼!',
    ],
    otherApproaches: [
      { name: '수직선 그리기', desc: '수직선에서 10에 ● 표시, 20에 ○ 표시하면 범위가 보여!' }
    ],
  },

  evolution: { prev: undefined, next: 'M024', family: '범위의 발전', familyDescription: '초등 이상·이하·초과·미만 → 중등 일차부등식 → 고등 이차부등식으로 발전' },
  relatedIds: ['E008'],
},

{
  id: 'E015', number: 15,
  name: '최대공약수',
  latex: '\\gcd(a, b)',
  description: '두 수의 공통 약수 중 가장 큰 수',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['약수', '공약수', '최대공약수', '5학년'],
  visualType: 'gcd',

  hook: '12개 사탕을 3명, 4명, 6명으로 나눌 수 있어 — 12의 약수야! 🍬',

  principle: `
    12의 약수: 1, 2, 3, <strong>4</strong>, <strong>6</strong>, 12<br>
    18의 약수: 1, 2, 3, <strong>6</strong>, 9, 18<br><br>
    공통으로 있는 약수(공약수): 1, 2, 3, 6<br>
    그중 가장 큰 수 = <strong style="color:#00ffcc">6</strong><br><br>
    12와 18의 최대공약수는 <strong>6</strong>이야!
  `,

  story: `옛날 이집트에서 정사각형 타일로 바닥을 붙일 때<br>
    가장 큰 타일 크기를 정해야 했어.<br><br>
    가로 12m, 세로 18m인 방에는<br>
    6m × 6m 타일이 딱 맞았지!<br><br>
    이게 바로 최대공약수 활용이야! 🏛️`,

  realLife: [
    { icon: '🎁', title: '선물 나누기', desc: '사탕 12개, 과자 18개를 최대한 많은 봉지에 똑같이 → 6봉지!' },
    { icon: '🧱', title: '타일 붙이기', desc: '12cm × 18cm에 가장 큰 정사각형 타일 = 6cm!' },
    { icon: '✂️', title: '리본 자르기', desc: '36cm, 24cm 리본을 같은 길이로 최대한 길게 → 12cm씩!' },
  ],

  sliders: [
    { name: 'a', label: 'a', min: 2, max: 50, default: 12, step: 1 },
    { name: 'b', label: 'b', min: 2, max: 50, default: 18, step: 1 },
  ],

  example: {
    question: '12와 18의 최대공약수는 얼마인가요?',
    answer: '6',
    steps: ['12의 약수: 1, 2, 3, 4, 6, 12', '18의 약수: 1, 2, 3, 6, 9, 18', '공약수: 1, 2, 3, 6', '최대공약수: 6!'],
    hints: [
      '힌트 1: 먼저 12의 약수를 모두 구해봐.',
      '힌트 2: 18의 약수도 구해서 공통인 것을 찾아.',
      '힌트 3: 공통인 것 중 가장 큰 수는 6!',
    ],
    otherApproaches: [
      { name: '나누기로 찾기', desc: '12와 18을 2로 나누고, 3으로 나누면 2×3=6 → 최대공약수 6!' }
    ],
  },

  evolution: { prev: undefined, next: 'M002', family: '최대공약수의 발전', familyDescription: '초등 배수 나열법 → 중등 소인수분해 이용 → 고등 유클리드 호제법으로 발전' },
  relatedIds: ['E016', 'E017'],
},

{
  id: 'E016', number: 16,
  name: '최소공배수',
  latex: '\\text{lcm}(a, b)',
  description: '두 수의 공통 배수 중 가장 작은 수',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['배수', '공배수', '최소공배수', '5학년'],
  visualType: 'lcm',

  hook: '버스 A는 4분마다, 버스 B는 6분마다 와. 동시에 오는 건 언제? 🚌',

  principle: `
    4의 배수: 4, 8, <strong>12</strong>, 16, 20, <strong>24</strong>...<br>
    6의 배수: 6, <strong>12</strong>, 18, <strong>24</strong>, 30...<br><br>
    공통으로 있는 배수(공배수): 12, 24, 36...<br>
    그중 가장 작은 수 = <strong style="color:#00ffcc">12</strong><br><br>
    4와 6의 최소공배수는 <strong>12</strong>야!
  `,

  story: `두 버스가 동시에 출발했어.<br>
    A버스는 4분마다, B버스는 6분마다 정류장에 와.<br><br>
    다시 동시에 오려면 4와 6의 공배수 시간이야!<br>
    12분 후에 처음으로 같이 와! 🕐`,

  realLife: [
    { icon: '🚌', title: '버스 시간표', desc: '4분마다, 6분마다 오는 버스가 동시에 오는 건 12분 후!' },
    { icon: '🔔', title: '종 치기', desc: '3분마다, 5분마다 종이 울리면 15분 후에 동시에!' },
    { icon: '🏃', title: '달리기', desc: '한 바퀴 4분, 6분인 두 사람이 다시 만나는 시간!' },
  ],

  sliders: [
    { name: 'a', label: 'a', min: 2, max: 20, default: 4, step: 1 },
    { name: 'b', label: 'b', min: 2, max: 20, default: 6, step: 1 },
  ],

  example: {
    question: '4와 6의 최소공배수는 얼마인가요?',
    answer: '12',
    steps: ['4의 배수: 4, 8, 12, 16, 20...', '6의 배수: 6, 12, 18, 24...', '공배수: 12, 24, 36...', '최소공배수: 12!'],
    hints: [
      '힌트 1: 4의 배수를 순서대로 써봐.',
      '힌트 2: 6의 배수도 순서대로 써봐.',
      '힌트 3: 둘 다 나오는 수 중 가장 작은 것은 12!',
    ],
    otherApproaches: [
      { name: '곱하기로 구하기', desc: '4 × 6 = 24. 최대공약수 2로 나누면 24 ÷ 2 = 12!' }
    ],
  },

  evolution: { prev: undefined, next: 'M002', family: '최소공배수의 발전', familyDescription: '초등 배수 나열법 → 중등 소인수분해 이용 → 고등 분수식 통분에 활용' },
  relatedIds: ['E015', 'E017'],
},

{
  id: 'E017', number: 17,
  name: '약분과 통분',
  latex: '\\frac{a}{b} = \\frac{a \\times n}{b \\times n}',
  description: '분수의 크기를 바꾸지 않고 분모를 같게 만들어',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['약분', '통분', '크기가같은분수', '5학년'],
  visualType: 'simplify_fraction',

  hook: '1/2 = 2/4 = 3/6 — 다 같은 크기야! 약분하면 간단해져 ✂️',

  principle: `
    피자 반쪽(1/2)과 4조각 중 2조각(2/4)은 같아!<br><br>
    <strong>약분</strong>: 분자와 분모를 같은 수로 나누기<br>
    4/8 → 4÷4 / 8÷4 = <strong style="color:#00ffcc">1/2</strong><br><br>
    <strong>통분</strong>: 분모를 같게 만들기<br>
    1/2과 1/3 → 3/6과 2/6<br><br>
    분모를 같게 만들면 크기를 비교하거나 더할 수 있어!
  `,

  story: `분수를 처음 배울 때는 복잡해 보여.<br>
    하지만 같은 크기인 분수를 찾는 게<br>
    약분과 통분이야!<br><br>
    피자 그림으로 보면 쉽게 이해돼.<br>
    반쪽 = 2/4 = 3/6 = 4/8... 전부 같은 양이야! 🍕`,

  realLife: [
    { icon: '🍕', title: '피자', desc: '피자 1/2조각 = 2/4조각 = 3/6조각. 같은 양이야!' },
    { icon: '📊', title: '비교하기', desc: '2/3와 3/4 중 뭐가 클까? 통분하면 8/12 < 9/12!' },
    { icon: '✂️', title: '간단하게', desc: '6/8 → 약분하면 3/4. 더 깔끔하지?' },
  ],

  sliders: [
    { name: 'a', label: '분자', min: 1, max: 12, default: 2, step: 1 },
    { name: 'b', label: '분모', min: 2, max: 12, default: 4, step: 1 },
  ],

  example: {
    question: '6/9를 약분하면 얼마인가요?',
    answer: '2/3',
    steps: ['6과 9의 공약수를 찾아: 1, 3', '최대공약수: 3', '분자, 분모를 3으로 나눠: 6÷3 / 9÷3', '= 2/3!'],
    hints: [
      '힌트 1: 분자 6과 분모 9를 같은 수로 나눌 수 있어.',
      '힌트 2: 6과 9의 최대공약수는 3이야.',
      '힌트 3: 6÷3=2, 9÷3=3 → 2/3!',
    ],
    otherApproaches: [
      { name: '그림으로 확인', desc: '9칸 중 6칸 = 3칸 중 2칸. 같은 양이야!' }
    ],
  },

  evolution: { prev: undefined, next: 'M005', family: '분수 변환의 발전', familyDescription: '초등 약분·통분 → 중등 유리수 계산 → 고등 유리식 통분으로 발전' },
  relatedIds: ['E015', 'E016', 'E018'],
},

{
  id: 'E018', number: 18,
  name: '분모가 다른 분수의 덧셈과 뺄셈',
  latex: '\\frac{a}{b} + \\frac{c}{d} = \\frac{ad+bc}{bd}',
  description: '분모를 같게 만든 다음 분자끼리 더하거나 빼',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['분수', '덧셈', '뺄셈', '다른분모', '5학년'],
  visualType: 'fraction_add_diff',

  hook: '1/2 + 1/3을 더하려면? 통분해서 분모를 같게 만들면 돼! 🧩',

  principle: `
    1/4 + 1/6 = ?<br><br>
    분모가 다르면 바로 더할 수 없어!<br>
    통분하자 → 4와 6의 최소공배수 = 12<br><br>
    1/4 = 3/12<br>
    1/6 = 2/12<br><br>
    3/12 + 2/12 = <strong style="color:#00ffcc">5/12</strong>
  `,

  story: `피자 반쪽(1/2)과 피자 3분의 1(1/3)을 합치면<br>
    얼마나 될까?<br><br>
    조각 크기가 다르니까 바로 더할 수 없어.<br>
    같은 크기로 다시 자르면(통분) 계산할 수 있어!<br><br>
    1/2 = 3/6, 1/3 = 2/6 → 합하면 5/6! 🍕`,

  realLife: [
    { icon: '🥤', title: '주스 섞기', desc: '오렌지주스 1/3L + 사과주스 1/4L = 7/12L.' },
    { icon: '📏', title: '길이 합치기', desc: '리본 1/2m + 1/3m = 5/6m.' },
    { icon: '🍰', title: '케이크', desc: '1/4 + 1/6 먹으면 총 5/12만큼 먹은 거야.' },
  ],

  sliders: [
    { name: 'a', label: '분자 a', min: 1, max: 5, default: 1, step: 1 },
    { name: 'b', label: '분모 b', min: 2, max: 10, default: 4, step: 1 },
    { name: 'c', label: '분자 c', min: 1, max: 5, default: 1, step: 1 },
    { name: 'd', label: '분모 d', min: 2, max: 10, default: 6, step: 1 },
  ],

  example: {
    question: '1/4 + 1/6은 얼마인가요?',
    answer: '5/12',
    steps: ['분모 4와 6의 최소공배수: 12', '1/4 = 3/12', '1/6 = 2/12', '3/12 + 2/12 = 5/12!'],
    hints: [
      '힌트 1: 분모가 다르면 통분부터 해야 해.',
      '힌트 2: 4와 6의 최소공배수는 12야.',
      '힌트 3: 3/12 + 2/12 = 5/12!',
    ],
    otherApproaches: [
      { name: '공식 사용', desc: '(1×6 + 1×4) / (4×6) = 10/24 = 5/12.' }
    ],
  },

  evolution: { prev: undefined, next: 'M013', family: '분수 계산의 발전', familyDescription: '초등 통분 후 덧셈 → 중등 유리수 덧셈 → 고등 유리함수 덧셈으로 발전' },
  relatedIds: ['E011', 'E017'],
},

{
  id: 'E019', number: 19,
  name: '분수의 곱셈',
  latex: '\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}',
  description: '분자끼리 곱하고, 분모끼리 곱하면 돼',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['분수', '곱셈', '5학년'],
  visualType: 'fraction_multiply',

  hook: '피자 3/4판의 1/2는? → 3/8이야. 분자끼리, 분모끼리 곱해! 🍕',

  principle: `
    1/2 × 3/4 = ?<br><br>
    직사각형을 그려보자!<br>
    세로를 2등분(1/2), 가로를 4등분(3/4) 색칠하면<br>
    전체 8칸 중 3칸이 겹쳐!<br><br>
    분자끼리: 1 × 3 = 3<br>
    분모끼리: 2 × 4 = 8<br>
    <strong style="color:#00ffcc">1/2 × 3/4 = 3/8</strong>
  `,

  story: `"전체의 일부의 또 일부"를 구하는 게 분수의 곱셈이야.<br><br>
    피자 3/4가 남았는데, 그 중 1/2만 먹으면?<br>
    남은 양의 절반 = 전체의 3/8이야!<br><br>
    분수의 곱셈은 "~의 ~"를 계산하는 거야 ✨`,

  realLife: [
    { icon: '🍕', title: '피자', desc: '피자 3/4의 1/2 = 3/8. 남은 것의 절반!' },
    { icon: '📏', title: '천 자르기', desc: '2/3m 천의 3/4를 사용하면 2/3 × 3/4 = 1/2m!' },
    { icon: '🎨', title: '그림', desc: '도화지 1/2의 2/3를 색칠하면 1/3만큼!' },
  ],

  sliders: [
    { name: 'a', label: '분자 a', min: 1, max: 5, default: 2, step: 1 },
    { name: 'b', label: '분모 b', min: 2, max: 8, default: 3, step: 1 },
    { name: 'c', label: '분자 c', min: 1, max: 5, default: 3, step: 1 },
    { name: 'd', label: '분모 d', min: 2, max: 8, default: 4, step: 1 },
  ],

  example: {
    question: '2/3 × 3/4는 얼마인가요?',
    answer: '1/2',
    steps: ['분자끼리 곱해: 2 × 3 = 6', '분모끼리 곱해: 3 × 4 = 12', '6/12 = 약분하면 1/2', '2/3 × 3/4 = 1/2!'],
    hints: [
      '힌트 1: 분자끼리 곱하고, 분모끼리 곱해.',
      '힌트 2: 2×3=6, 3×4=12 → 6/12야.',
      '힌트 3: 6/12를 약분하면 1/2!',
    ],
    otherApproaches: [
      { name: '약분 먼저', desc: '2/3 × 3/4에서 분자 3과 분모 3을 약분 → 2/4 = 1/2. 더 빠르지!' }
    ],
  },

  evolution: { prev: undefined, next: 'M023', family: '분수 곱셈의 발전', familyDescription: '초등 분수 곱셈 → 중등 단항식 곱셈 → 고등 유리식의 곱셈으로 발전' },
  relatedIds: ['E018', 'E020'],
},

{
  id: 'E020', number: 20,
  name: '분수의 나눗셈',
  latex: '\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}',
  description: '나누는 분수를 뒤집어서 곱하면 돼',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['분수', '나눗셈', '6학년'],
  visualType: 'fraction_divide',

  hook: '나누는 분수를 뒤집어서 곱하면 돼 — 이유가 있어! 🔄',

  principle: `
    2/3 ÷ 2 = ?<br>
    2/3을 2등분하면 1/3이야!<br>
    2/3 × 1/2 = 1/3 ✅<br><br>
    <strong>나눗셈 → 뒤집어서 곱셈!</strong><br><br>
    3/4 ÷ 3/8 = ?<br>
    3/4 × 8/3 = 24/12 = <strong style="color:#00ffcc">2</strong>
  `,

  story: `"분수로 나눈다"는 건 어려워 보이지만<br>
    사실 곱셈으로 바꿀 수 있어!<br><br>
    나누는 수를 뒤집으면(역수) 곱셈이 돼.<br>
    이 방법을 알면 분수 나눗셈도 쉬워! 💪`,

  realLife: [
    { icon: '🍰', title: '케이크 나누기', desc: '케이크 3/4를 1/8조각씩 나누면 3/4 ÷ 1/8 = 6조각!' },
    { icon: '📏', title: '끈 자르기', desc: '끈 2/3m를 1/6m씩 자르면 2/3 ÷ 1/6 = 4도막!' },
    { icon: '🥤', title: '음료 나누기', desc: '주스 3/4L를 3/8L 컵에 나누면 2컵!' },
  ],

  sliders: [
    { name: 'a', label: '분자 a', min: 1, max: 5, default: 3, step: 1 },
    { name: 'b', label: '분모 b', min: 2, max: 8, default: 4, step: 1 },
    { name: 'c', label: '분자 c', min: 1, max: 5, default: 3, step: 1 },
    { name: 'd', label: '분모 d', min: 2, max: 8, default: 8, step: 1 },
  ],

  example: {
    question: '3/4 ÷ 3/8은 얼마인가요?',
    answer: '2',
    steps: ['나누는 분수 3/8을 뒤집어: 8/3', '곱셈으로 바꿔: 3/4 × 8/3', '분자끼리: 3×8=24, 분모끼리: 4×3=12', '24/12 = 2!'],
    hints: [
      '힌트 1: 나누는 분수를 뒤집어서 곱해.',
      '힌트 2: 3/4 × 8/3으로 바꿔봐.',
      '힌트 3: 24/12 = 2야!',
    ],
    otherApproaches: [
      { name: '약분 먼저', desc: '3/4 × 8/3에서 3끼리 약분, 4와 8에서 4 약분 → 1×2=2!' }
    ],
  },

  evolution: { prev: undefined, next: 'M023', family: '분수 나눗셈의 발전', familyDescription: '초등 분수 나눗셈 → 중등 유리수 나눗셈 → 고등 유리식 나눗셈으로 발전' },
  relatedIds: ['E019', 'E021'],
},

{
  id: 'E021', number: 21,
  name: '소수의 곱셈',
  latex: '0.a \\times 0.b',
  description: '소수점 아래 자릿수만큼 소수점을 옮겨',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['소수', '곱셈', '5학년'],
  visualType: 'decimal_multiply',

  hook: '1.2 × 3 = 3.6. 소수점 위치만 잘 보면 돼! ✨',

  principle: `
    0.3 × 4 = ?<br>
    0.3은 3이 소수점 뒤에 1자리 → 3 × 4 = 12<br>
    소수점 뒤 1자리이니까 → <strong style="color:#00ffcc">1.2</strong><br><br>
    2.5 × 4 = ?<br>
    25 × 4 = 100<br>
    소수점 뒤 1자리이니까 → <strong style="color:#00ffcc">10.0</strong><br><br>
    자연수로 곱한 뒤, 소수점 자릿수만큼 옮기면 돼!
  `,

  story: `소수의 곱셈은 자연수 곱셈에서 한 단계 더 나간 거야!<br><br>
    소수점을 잠깐 없애고 자연수처럼 곱한 다음,<br>
    소수점을 원래 자리에 돌려놓으면 끝!<br><br>
    마트에서 "1.5kg에 1kg당 3000원"일 때<br>
    가격을 계산하는 게 바로 이거야 💰`,

  realLife: [
    { icon: '⚖️', title: '무게 계산', desc: '사과 1개 0.3kg × 5개 = 1.5kg!' },
    { icon: '💰', title: '가격', desc: '1.5L 우유 × 2병 = 3.0L.' },
    { icon: '📐', title: '길이', desc: '한 변 2.5cm인 정사각형 둘레 = 2.5 × 4 = 10cm.' },
  ],

  sliders: [
    { name: 'a', label: '소수', min: 0.1, max: 5, default: 2.5, step: 0.1 },
    { name: 'b', label: '곱하는 수', min: 1, max: 10, default: 4, step: 1 },
  ],

  example: {
    question: '2.5 × 4는 얼마인가요?',
    answer: '10.0',
    steps: ['소수점을 없애고: 25 × 4 = 100', '소수점 아래 자릿수: 1자리', '100에서 소수점 1자리 옮기면: 10.0', '2.5 × 4 = 10.0!'],
    hints: [
      '힌트 1: 소수점을 없애고 자연수처럼 곱해봐.',
      '힌트 2: 25 × 4 = 100이야.',
      '힌트 3: 소수점 1자리 옮기면 10.0!',
    ],
    otherApproaches: [
      { name: '분수로 바꾸기', desc: '2.5 = 25/10. 25/10 × 4 = 100/10 = 10!' }
    ],
  },

  evolution: { prev: undefined, next: 'M023', family: '소수 곱셈의 발전', familyDescription: '초등 소수 곱셈 → 중등 유리수 곱셈 → 고등 실수 계산으로 발전' },
  relatedIds: ['E012', 'E022'],
},

{
  id: 'E022', number: 22,
  name: '소수의 나눗셈',
  latex: 'a.b \\div c',
  description: '소수를 자연수처럼 나눈 뒤 소수점을 내려',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['소수', '나눗셈', '6학년'],
  visualType: 'decimal_divide',

  hook: '7.2 ÷ 4는 72 ÷ 4 = 18에서 소수점만 옮기면 1.8! 🎯',

  principle: `
    8.4 ÷ 4 = ?<br><br>
    소수점을 없애고 생각하면: 84 ÷ 4 = 21<br>
    소수점을 다시 넣으면: <strong style="color:#00ffcc">2.1</strong><br><br>
    또는 세로 나눗셈에서<br>
    소수점을 그대로 내려 찍으면 돼!
  `,

  story: `소수의 나눗셈도 자연수 나눗셈과 원리가 같아!<br><br>
    소수점 위치만 잘 기억하면 돼.<br>
    나누는 수가 소수일 때는<br>
    소수점을 옮겨서 자연수로 만들면 쉬워! 🧠`,

  realLife: [
    { icon: '🍫', title: '나누기', desc: '초콜릿 8.4m를 4명이 나누면 8.4 ÷ 4 = 2.1m씩!' },
    { icon: '⛽', title: '주유', desc: '15.6L를 3일에 나누면 하루 5.2L!' },
    { icon: '💰', title: '더치페이', desc: '24.6만원을 3명이 나누면 8.2만원씩!' },
  ],

  sliders: [
    { name: 'a', label: '나눠질 소수', min: 1, max: 20, default: 8.4, step: 0.1 },
    { name: 'b', label: '나누는 수', min: 1, max: 10, default: 4, step: 1 },
  ],

  example: {
    question: '8.4 ÷ 4는 얼마인가요?',
    answer: '2.1',
    steps: ['84 ÷ 4 = 21로 생각해', '소수점 위치를 맞춰: 2.1', '확인: 2.1 × 4 = 8.4 ✅', '8.4 ÷ 4 = 2.1!'],
    hints: [
      '힌트 1: 소수점을 없애고 자연수처럼 나눠봐.',
      '힌트 2: 84 ÷ 4 = 21이야.',
      '힌트 3: 소수점을 다시 넣으면 2.1!',
    ],
    otherApproaches: [
      { name: '세로 나눗셈', desc: '세로로 쓰고 소수점을 그대로 내려 찍으면 2.1!' }
    ],
  },

  evolution: { prev: undefined, next: 'M023', family: '소수 나눗셈의 발전', familyDescription: '초등 소수 나눗셈 → 중등 유리수 나눗셈 → 고등 실수 계산으로 발전' },
  relatedIds: ['E021', 'E012'],
},

// ══════════════════════════════════════════
// 5~6학년 — 변화와 관계
// ══════════════════════════════════════════

{
  id: 'E023', number: 23,
  name: '대응 관계',
  latex: '\\triangle = \\square + 2',
  description: '두 양 사이의 규칙을 식으로 나타내',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'algebra',
  tags: ['대응관계', '규칙', '식', '6학년'],
  visualType: 'correspondence',

  hook: '□가 1이면 △는 3, □가 2이면 △는 4 — 규칙을 식으로 쓸 수 있어! 📊',

  principle: `
    표를 만들어보자!<br><br>
    □ | 1 | 2 | 3 | 4 | 5<br>
    △ | 3 | 4 | 5 | 6 | 7<br><br>
    규칙이 보여? △는 항상 □보다 2 커!<br>
    <strong style="color:#00ffcc">△ = □ + 2</strong><br><br>
    이렇게 두 양의 관계를 식으로 쓸 수 있어!
  `,

  story: `대응 관계는 중학교에서 배울 "함수"의 씨앗이야!<br><br>
    "몸무게가 늘면 키도 큰다?"<br>
    "시간이 지나면 거리가 늘어난다?"<br><br>
    두 양이 어떻게 변하는지 규칙을 찾는 것이<br>
    바로 대응 관계야! 🌱`,

  realLife: [
    { icon: '🍦', title: '아이스크림', desc: '1개 1000원, 2개 2000원... 가격 = 개수 × 1000!' },
    { icon: '🎂', title: '나이', desc: '올해 12살이면 5년 후엔 17살. 나이 = 12 + 지난 해!' },
    { icon: '📐', title: '정사각형', desc: '한 변이 □cm이면 둘레는 □×4cm!' },
  ],

  sliders: [
    { name: 'a', label: '□', min: 1, max: 10, default: 3, step: 1 },
  ],

  example: {
    question: '□ × 3 = △일 때, □가 5이면 △는 얼마인가요?',
    answer: '15',
    steps: ['규칙: △ = □ × 3', '□ = 5를 넣으면', '△ = 5 × 3', '△ = 15!'],
    hints: [
      '힌트 1: □에 5를 넣어봐.',
      '힌트 2: 5 × 3 = ?',
      '힌트 3: 5 × 3 = 15야!',
    ],
    otherApproaches: [
      { name: '표 만들기', desc: '□가 1→3, 2→6, 3→9, 4→12, 5→15. 규칙이 보이지?' }
    ],
  },

  evolution: { prev: undefined, next: 'M028', family: '함수 개념의 발전', familyDescription: '초등 □→△ 대응 관계 → 중등 함수 y=f(x) → 고등 다양한 함수로 발전' },
  relatedIds: ['E024', 'E026'],
},

{
  id: 'E024', number: 24,
  name: '비율',
  latex: '\\text{비율} = \\frac{\\text{비교하는 양}}{\\text{기준량}}',
  description: '기준량에 대한 비교하는 양의 크기',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['비', '비율', '6학년'],
  visualType: 'ratio',

  hook: '우리 반 남자 12명 여자 8명. 여자가 전체의 얼마야? → 8/20 = 0.4 = 40%! 📊',

  principle: `
    <strong>비</strong>: 두 양을 비교하는 것 (예: 남자 : 여자 = 12 : 8)<br><br>
    <strong>비율</strong>: 기준량에 대한 비교하는 양의 크기<br>
    비율 = 비교하는 양 ÷ 기준량<br><br>
    40명 중 합격자 16명이면<br>
    합격률 = 16 ÷ 40 = <strong style="color:#00ffcc">0.4 = 40%</strong>
  `,

  story: `옛날 탐험가들은 지도를 만들 때<br>
    실제 거리를 줄여서 그렸어.<br><br>
    "1:50000" 이런 축척이 바로 비율이야!<br>
    지도에서 1cm = 실제 500m.<br><br>
    야구 타율, 세일 할인율도 전부 비율이야! ⚾`,

  realLife: [
    { icon: '⚾', title: '타율', desc: '10번 타석에서 3번 안타 → 타율 0.300 (3할)!' },
    { icon: '🏷️', title: '할인율', desc: '10000원짜리 3000원 할인 → 할인율 30%!' },
    { icon: '🗺️', title: '지도 축척', desc: '1:50000 지도에서 2cm = 실제 1km!' },
  ],

  sliders: [
    { name: 'a', label: '비교하는 양', min: 1, max: 50, default: 16, step: 1 },
    { name: 'b', label: '기준량', min: 1, max: 100, default: 40, step: 1 },
  ],

  example: {
    question: '40명 중 합격자가 16명이에요. 합격률은 몇 %인가요?',
    answer: '40%',
    steps: ['비율 = 비교하는 양 ÷ 기준량', '= 16 ÷ 40', '= 0.4', '백분율 = 0.4 × 100 = 40%!'],
    hints: [
      '힌트 1: 합격자 수(16)를 전체 수(40)로 나눠.',
      '힌트 2: 16 ÷ 40 = 0.4야.',
      '힌트 3: 0.4 × 100 = 40%!',
    ],
    otherApproaches: [
      { name: '분수로 생각', desc: '16/40 = 4/10 = 40/100 = 40%!' }
    ],
  },

  evolution: { prev: undefined, next: 'M019', family: '비율의 발전', familyDescription: '초등 비율 → 중등 정비례·반비례 → 고등 지수·로그로 발전' },
  relatedIds: ['E025', 'E026'],
},

{
  id: 'E025', number: 25,
  name: '백분율',
  latex: '\\text{백분율(\\%)} = \\text{비율} \\times 100',
  description: '비율을 100을 기준으로 나타낸 것',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['백분율', '퍼센트', '6학년'],
  visualType: 'percentage',

  hook: '배터리 60%? 1000원짜리 30% 할인? 백분율은 생활 속에 넘쳐나! 🔋',

  principle: `
    비율 0.3은 백분율로 바꾸면?<br>
    0.3 × 100 = <strong style="color:#00ffcc">30%</strong><br><br>
    100칸 중 30칸이 색칠되어 있는 것과 같아!<br><br>
    <strong>백분율 = 비율 × 100</strong><br>
    100을 기준으로 나타내니까 비교하기 쉬워!
  `,

  story: `"percent"는 라틴어 "per centum(100당)"에서 왔어.<br><br>
    100을 기준으로 하면 비교가 쉽지!<br>
    "3/5보다 잘했어" 보다<br>
    "60%야"가 더 직관적이잖아?<br><br>
    우리 생활에서 가장 많이 쓰는 비율 표현이야 📱`,

  realLife: [
    { icon: '🔋', title: '배터리', desc: '배터리 75% = 100칸 중 75칸 충전됨!' },
    { icon: '🏷️', title: '할인', desc: '500원짜리 20% 할인 = 500 × 0.2 = 100원 할인 → 400원!' },
    { icon: '📊', title: '투표율', desc: '100명 중 65명 투표 = 투표율 65%.' },
  ],

  sliders: [
    { name: 'a', label: '비율', min: 0, max: 1, default: 0.3, step: 0.01 },
  ],

  example: {
    question: '500원짜리 물건을 20% 할인하면 얼마인가요?',
    answer: '400원',
    steps: ['20% = 0.2', '할인 금액 = 500 × 0.2 = 100원', '할인 후 가격 = 500 - 100', '= 400원!'],
    hints: [
      '힌트 1: 20%는 비율로 0.2야.',
      '힌트 2: 500 × 0.2 = 100원이 할인돼.',
      '힌트 3: 500 - 100 = 400원!',
    ],
    otherApproaches: [
      { name: '바로 계산', desc: '20% 할인 = 80% 지불. 500 × 0.8 = 400원!' }
    ],
  },

  evolution: { prev: undefined, next: 'M070', family: '백분율의 발전', familyDescription: '초등 백분율 → 중등 상대도수 → 고등 확률로 발전' },
  relatedIds: ['E024', 'E026'],
},

{
  id: 'E026', number: 26,
  name: '비례식',
  latex: 'a : b = c : d \\Rightarrow a \\times d = b \\times c',
  description: '두 비가 같을 때 안쪽 곱 = 바깥쪽 곱',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['비례식', '비', '6학년'],
  visualType: 'proportion',

  hook: '지도에서 2cm가 실제 1km이면, 5cm는 몇 km? 비례식으로 풀어! 🗺️',

  principle: `
    비례식: 두 비가 같다는 뜻!<br><br>
    3 : 4 = 6 : □<br><br>
    <strong>안쪽 곱 = 바깥쪽 곱</strong><br>
    4 × 6 = 3 × □<br>
    24 = 3 × □<br>
    □ = 24 ÷ 3 = <strong style="color:#00ffcc">8</strong>
  `,

  story: `고대 그리스 건축가들은 건물을 지을 때<br>
    아름다운 비율을 사용했어.<br><br>
    파르테논 신전은 가로:세로의 비가 일정했대!<br>
    이처럼 비례식은 건축, 요리, 지도 등<br>
    생활 곳곳에서 쓰이고 있어! 🏛️`,

  realLife: [
    { icon: '🗺️', title: '지도', desc: '2cm:1km = 5cm:□km → □ = 2.5km!' },
    { icon: '🍳', title: '요리', desc: '2인분에 밀가루 200g이면 5인분에는? 500g!' },
    { icon: '📷', title: '사진 확대', desc: '가로:세로 = 4:3 비율을 유지하면서 확대!' },
  ],

  sliders: [
    { name: 'a', label: 'a', min: 1, max: 10, default: 3, step: 1 },
    { name: 'b', label: 'b', min: 1, max: 10, default: 4, step: 1 },
    { name: 'c', label: 'c', min: 1, max: 20, default: 6, step: 1 },
  ],

  example: {
    question: '3 : 4 = 6 : □에서 □는 얼마인가요?',
    answer: '8',
    steps: ['비례식에서 안쪽 곱 = 바깥쪽 곱', '4 × 6 = 3 × □', '24 = 3 × □', '□ = 24 ÷ 3 = 8!'],
    hints: [
      '힌트 1: 비례식에서 안쪽 곱 = 바깥쪽 곱 성질을 써봐.',
      '힌트 2: 4 × 6 = 24, 3 × □ = 24.',
      '힌트 3: □ = 24 ÷ 3 = 8!',
    ],
    otherApproaches: [
      { name: '배수로 생각', desc: '3 → 6은 2배. 4도 2배 하면 4 × 2 = 8!' }
    ],
  },

  evolution: { prev: undefined, next: 'M060', family: '비례의 발전', familyDescription: '초등 비례식 → 중등 닮음과 비 → 고등 삼각비·벡터 비율로 발전' },
  relatedIds: ['E024', 'E025', 'E027'],
},

{
  id: 'E027', number: 27,
  name: '비례배분',
  latex: '\\text{전체} \\times \\frac{a}{a+b}',
  description: '전체를 주어진 비로 나누는 방법',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['비례배분', '비', '6학년'],
  visualType: 'proportion_split',

  hook: '24개 사탕을 3:1로 나누면 형은 18개, 동생은 6개! 🍬',

  principle: `
    사탕 30개를 2 : 3으로 나누면?<br><br>
    전체 비 = 2 + 3 = 5<br><br>
    첫째: 30 × 2/5 = <strong>12개</strong><br>
    둘째: 30 × 3/5 = <strong>18개</strong><br><br>
    확인: 12 + 18 = <strong style="color:#00ffcc">30개</strong> ✅
  `,

  story: `옛날부터 유산이나 이익을 나눌 때<br>
    비례배분을 사용했어.<br><br>
    "일한 만큼 받는다"는 원칙이<br>
    바로 비례배분이야!<br><br>
    공정하게 나누는 수학적 방법이지 ⚖️`,

  realLife: [
    { icon: '🍬', title: '간식 나누기', desc: '사탕 20개를 1:3으로 → 5개, 15개!' },
    { icon: '💰', title: '용돈 배분', desc: '형:동생 = 3:2로 10000원 나누면 6000원, 4000원!' },
    { icon: '🎨', title: '물감 섞기', desc: '빨강:파랑 = 2:1로 섞으면 보라색 만들기!' },
  ],

  sliders: [
    { name: 'total', label: '전체', min: 10, max: 100, default: 30, step: 1 },
    { name: 'a', label: '비 a', min: 1, max: 9, default: 2, step: 1 },
    { name: 'b', label: '비 b', min: 1, max: 9, default: 3, step: 1 },
  ],

  example: {
    question: '사탕 30개를 2:3으로 나누면 각각 몇 개인가요?',
    answer: '12개, 18개',
    steps: ['전체 비: 2 + 3 = 5', '첫째 몫: 30 × 2/5 = 12개', '둘째 몫: 30 × 3/5 = 18개', '확인: 12 + 18 = 30 ✅'],
    hints: [
      '힌트 1: 비의 합을 먼저 구해. 2 + 3 = 5.',
      '힌트 2: 30을 5로 나누면 한 몫이 6이야.',
      '힌트 3: 2몫 = 12개, 3몫 = 18개!',
    ],
    otherApproaches: [
      { name: '한 몫 구하기', desc: '30 ÷ 5 = 6(한 몫). 2몫=12, 3몫=18!' }
    ],
  },

  evolution: { prev: undefined, next: 'M019', family: '비례배분의 발전', familyDescription: '초등 비례배분 → 중등 정비례 함수 → 고등 비율 응용으로 발전' },
  relatedIds: ['E024', 'E025', 'E026'],
},

// ══════════════════════════════════════════
// 3~4학년 — 도형과 측정
// ══════════════════════════════════════════

{
  id: 'E028', number: 28,
  name: '각도',
  latex: '\\text{각도 단위: 도(°)}',
  description: '두 직선이 만나서 벌어진 정도를 숫자로 나타내',
  level: 'elementary', grade: '3~4학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['각도', '직각', '예각', '둔각', '4학년'],
  visualType: 'angle',

  hook: '시계 바늘이 12시에서 3시까지 돌면 90°야. 직각! 🕒',

  principle: `
    각도는 두 선이 벌어진 정도야!<br><br>
    <strong>직각</strong> = 90° (ㄱ자 모양)<br>
    <strong>평각</strong> = 180° (일직선)<br>
    <strong>한 바퀴</strong> = 360°<br><br>
    90° 미만 → 예각 (뾰족!)<br>
    90° 초과 180° 미만 → 둔각 (넓적!)<br>
    <strong style="color:#00ffcc">각도기</strong>로 재면 돼!
  `,

  story: `바빌로니아 사람들이 한 바퀴를 360°로 정했어.<br><br>
    왜 360일까?<br>
    1년이 약 360일이라 생각했고,<br>
    360은 2, 3, 4, 5, 6, 8, 9, 10... 으로 잘 나눠지거든!<br><br>
    그래서 계산하기 편한 360이 선택됐어! 🌍`,

  realLife: [
    { icon: '🕒', title: '시계', desc: '시계 바늘이 1시간마다 30° 움직여 (360÷12=30).' },
    { icon: '📐', title: '삼각자', desc: '삼각자의 각도는 30°, 60°, 90° 또는 45°, 45°, 90°야.' },
    { icon: '🚪', title: '문 열기', desc: '문을 활짝 열면 약 90°(직각)!' },
  ],

  sliders: [
    { name: 'angle', label: '각도', min: 0, max: 360, default: 90, step: 1 },
  ],

  example: {
    question: '시계에서 3시일 때 시침과 분침이 이루는 각도는 몇 도인가요?',
    answer: '90°',
    steps: ['12시 방향에서 3시 방향까지', '한 바퀴 360°를 12등분: 360÷12=30°', '3칸 이동: 30° × 3 = 90°', '3시의 각도는 90°(직각)!'],
    hints: [
      '힌트 1: 시계를 12등분하면 한 칸이 몇 도일까?',
      '힌트 2: 360 ÷ 12 = 30°야.',
      '힌트 3: 12시에서 3시까지 3칸 → 30° × 3 = 90°!',
    ],
    otherApproaches: [
      { name: '직각으로 생각', desc: '3시에 시침과 분침은 ㄱ자 모양이야. 직각 = 90°!' }
    ],
  },

  evolution: { prev: undefined, next: 'M049', family: '각도의 발전', familyDescription: '초등 각도(°) → 중등 다각형 내각의 합 → 고등 라디안으로 발전' },
  relatedIds: ['E029', 'E030'],
},

{
  id: 'E029', number: 29,
  name: '삼각형의 내각의 합',
  latex: '\\angle A + \\angle B + \\angle C = 180°',
  description: '어떤 삼각형이든 세 각의 합은 항상 180°',
  level: 'elementary', grade: '3~4학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['삼각형', '내각의합', '180도', '4학년'],
  visualType: 'triangle_angles',

  hook: '어떤 삼각형이든 세 각을 뜯어서 붙이면 직선이 돼! 항상 180°야 📐',

  principle: `
    종이로 삼각형을 만들어봐!<br><br>
    세 꼭짓점을 찢어서 한 곳에 붙이면...<br>
    <strong>일직선</strong>이 돼! → 180°<br><br>
    큰 삼각형이든, 작은 삼각형이든,<br>
    뾰족하든 납작하든<br>
    <strong style="color:#00ffcc">세 각의 합은 항상 180°!</strong>
  `,

  story: `삼각형의 내각의 합이 180°라는 사실은<br>
    고대 그리스 수학자 유클리드가 처음 증명했어.<br><br>
    직접 해봐! 종이 삼각형의 세 꼭짓점을<br>
    가위로 잘라서 한 점에 모으면<br>
    정말 일직선(180°)이 돼! ✂️`,

  realLife: [
    { icon: '🔺', title: '표지판', desc: '삼각형 교통표지판의 세 각의 합도 180°야.' },
    { icon: '🏔️', title: '산 모양', desc: '산 모양 삼각형의 세 각을 재면 합이 180°!' },
    { icon: '🎪', title: '텐트', desc: '텐트 단면의 삼각형도 세 각의 합이 180°야.' },
  ],

  sliders: [
    { name: 'a', label: '각 A', min: 10, max: 160, default: 50, step: 1 },
    { name: 'b', label: '각 B', min: 10, max: 160, default: 70, step: 1 },
  ],

  example: {
    question: '삼각형의 두 각이 50°와 70°일 때, 나머지 한 각은 몇 도인가요?',
    answer: '60°',
    steps: ['세 각의 합 = 180°', '나머지 각 = 180° - 50° - 70°', '= 180° - 120°', '= 60°!'],
    hints: [
      '힌트 1: 삼각형 세 각의 합은 항상 180°야.',
      '힌트 2: 180에서 알고 있는 두 각을 빼면 돼.',
      '힌트 3: 180 - 50 - 70 = 60°!',
    ],
    otherApproaches: [
      { name: '종이 접기', desc: '삼각형을 그려서 세 꼭짓점을 찢어 붙여봐. 180°가 돼!' }
    ],
  },

  evolution: { prev: undefined, next: 'M049', family: '내각의 발전', familyDescription: '초등 삼각형 180° → 중등 다각형 내각의 합 → 고등 코사인 법칙으로 발전' },
  relatedIds: ['E028', 'E030'],
},

{
  id: 'E030', number: 30,
  name: '사각형의 내각의 합',
  latex: '\\angle A + \\angle B + \\angle C + \\angle D = 360°',
  description: '어떤 사각형이든 네 각의 합은 항상 360°',
  level: 'elementary', grade: '3~4학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['사각형', '내각의합', '360도', '4학년'],
  visualType: 'quad_angles',

  hook: '사각형을 대각선으로 자르면 삼각형 2개! 180° × 2 = 360° 🔷',

  principle: `
    사각형에 대각선을 하나 그으면?<br>
    삼각형 2개가 돼!<br><br>
    삼각형 1개 = 180°<br>
    삼각형 2개 = 180° × 2 = <strong style="color:#00ffcc">360°</strong><br><br>
    어떤 사각형이든 네 각의 합은 항상 360°야!
  `,

  story: `삼각형의 내각의 합이 180°라는 걸 알면<br>
    사각형도 쉽게 알 수 있어!<br><br>
    사각형을 대각선으로 나누면<br>
    삼각형 2개이니까 360°.<br><br>
    오각형은? 삼각형 3개 → 540°! 🔢`,

  realLife: [
    { icon: '🏠', title: '방', desc: '직사각형 방의 네 모서리 각도 합 = 360°!' },
    { icon: '📱', title: '스마트폰', desc: '스마트폰 화면(직사각형)의 네 각 = 90°×4 = 360°!' },
    { icon: '🪁', title: '연', desc: '마름모 연의 네 각의 합도 360°야!' },
  ],

  sliders: [
    { name: 'a', label: '각 A', min: 30, max: 170, default: 90, step: 1 },
    { name: 'b', label: '각 B', min: 30, max: 170, default: 80, step: 1 },
    { name: 'c', label: '각 C', min: 30, max: 170, default: 70, step: 1 },
  ],

  example: {
    question: '사각형의 세 각이 90°, 80°, 70°일 때, 나머지 한 각은 몇 도인가요?',
    answer: '120°',
    steps: ['네 각의 합 = 360°', '나머지 각 = 360° - 90° - 80° - 70°', '= 360° - 240°', '= 120°!'],
    hints: [
      '힌트 1: 사각형 네 각의 합은 항상 360°야.',
      '힌트 2: 360에서 세 각을 빼면 돼.',
      '힌트 3: 360 - 90 - 80 - 70 = 120°!',
    ],
    otherApproaches: [
      { name: '삼각형으로 생각', desc: '대각선으로 나눠서 삼각형 2개로 확인해봐!' }
    ],
  },

  evolution: { prev: undefined, next: 'M049', family: '내각의 발전', familyDescription: '초등 사각형 360° → 중등 다각형 내각의 합 → 고등 기하학으로 발전' },
  relatedIds: ['E028', 'E029'],
},

// ══════════════════════════════════════════
// 5~6학년 — 도형과 측정 (넓이·부피)
// ══════════════════════════════════════════

{
  id: 'E031', number: 31,
  name: '직사각형의 둘레',
  latex: 'L = 2 \\times (\\text{가로} + \\text{세로})',
  description: '가로와 세로를 더한 뒤 2배하면 둘레가 나와',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['직사각형', '둘레', '5학년'],
  visualType: 'perimeter_rect',

  hook: '방 주변 벽에 몰딩을 붙이려면 둘레가 얼마인지 알아야 해! 🏠',

  principle: `
    직사각형의 둘레 = 네 변의 합<br><br>
    가로 5cm, 세로 3cm이면:<br>
    5 + 3 + 5 + 3 = 16cm<br><br>
    간단히: (가로 + 세로) × 2<br>
    = (5 + 3) × 2<br>
    = <strong style="color:#00ffcc">16cm</strong>
  `,

  story: `울타리를 치거나 리본을 두르려면<br>
    둘레를 알아야 해!<br><br>
    직사각형은 마주보는 변의 길이가 같으니까<br>
    (가로 + 세로) × 2로 빠르게 구할 수 있어.<br><br>
    정사각형이면? 한 변 × 4! 🎀`,

  realLife: [
    { icon: '🖼️', title: '액자', desc: '가로 30cm, 세로 20cm 액자 테두리 = (30+20)×2 = 100cm!' },
    { icon: '🏃', title: '운동장', desc: '운동장 한 바퀴 달리기 = 둘레만큼 뛰는 거야.' },
    { icon: '🎀', title: '리본', desc: '선물 상자에 리본을 두르려면 둘레를 알아야 해!' },
  ],

  sliders: [
    { name: 'w', label: '가로', min: 1, max: 20, default: 5, step: 1 },
    { name: 'h', label: '세로', min: 1, max: 20, default: 3, step: 1 },
  ],

  example: {
    question: '가로 5cm, 세로 3cm인 직사각형의 둘레는 몇 cm인가요?',
    answer: '16cm',
    steps: ['공식: 둘레 = (가로 + 세로) × 2', '= (5 + 3) × 2', '= 8 × 2', '= 16cm!'],
    hints: [
      '힌트 1: 직사각형은 마주보는 변의 길이가 같아.',
      '힌트 2: 가로 + 세로 = 5 + 3 = 8.',
      '힌트 3: 8 × 2 = 16cm!',
    ],
    otherApproaches: [
      { name: '네 변 더하기', desc: '5 + 3 + 5 + 3 = 16cm. 직접 다 더해도 돼!' }
    ],
  },

  evolution: { prev: undefined, next: 'M053', family: '둘레의 발전', familyDescription: '초등 직사각형 둘레 → 중등 부채꼴 호 → 고등 곡선의 길이로 발전' },
  relatedIds: ['E032', 'E033'],
},

{
  id: 'E032', number: 32,
  name: '직사각형의 넓이',
  latex: 'A = \\text{가로} \\times \\text{세로}',
  description: '가로 × 세로 = 직사각형 넓이',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['직사각형', '넓이', '5학년'],
  visualType: 'area_rect',

  hook: '방 크기, 스마트폰 화면 — 가로×세로면 끝! 📱',

  principle: `
    가로 8cm, 세로 5cm인 직사각형에<br>
    1cm × 1cm 타일을 깔면 몇 개 들어갈까?<br><br>
    한 줄에 8개씩, 5줄!<br>
    8 × 5 = <strong style="color:#00ffcc">40개 = 40cm²</strong><br><br>
    <strong>넓이 = 가로 × 세로</strong>
  `,

  story: `고대 이집트에서는 나일강이 매년 범람했어.<br><br>
    물이 빠지면 농지 경계가 사라져서<br>
    다시 넓이를 재야 했어!<br><br>
    이때 "가로 × 세로"로 넓이를 구하는<br>
    방법이 발달했어 🌊`,

  realLife: [
    { icon: '🏠', title: '방 크기', desc: '가로 4m, 세로 3m 방 = 12m².' },
    { icon: '📱', title: '화면 크기', desc: '스마트폰 화면 넓이 = 가로 × 세로.' },
    { icon: '🧱', title: '바닥 타일', desc: '방에 필요한 타일 수 = 방 넓이 ÷ 타일 넓이!' },
  ],

  sliders: [
    { name: 'w', label: '가로', min: 1, max: 20, default: 8, step: 1 },
    { name: 'h', label: '세로', min: 1, max: 20, default: 5, step: 1 },
  ],

  example: {
    question: '가로 8cm, 세로 5cm인 직사각형의 넓이는 몇 cm²인가요?',
    answer: '40cm²',
    steps: ['공식: 넓이 = 가로 × 세로', '= 8 × 5', '= 40', '넓이는 40cm²!'],
    hints: [
      '힌트 1: 직사각형의 넓이는 가로 × 세로야.',
      '힌트 2: 8 × 5 = ?',
      '힌트 3: 8 × 5 = 40cm²!',
    ],
    otherApproaches: [
      { name: '타일 세기', desc: '1cm² 타일을 깔면 한 줄 8개 × 5줄 = 40개!' }
    ],
  },

  evolution: { prev: undefined, next: 'M053', family: '넓이의 발전', familyDescription: '초등 직사각형 넓이 → 중등 입체도형 겉넓이 → 고등 적분으로 넓이 계산' },
  relatedIds: ['E031', 'E033', 'E034'],
},

{
  id: 'E033', number: 33,
  name: '정사각형의 넓이',
  latex: 'A = a \\times a = a^2',
  description: '한 변의 길이를 자기 자신과 곱하면 넓이',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['정사각형', '넓이', '제곱', '5학년'],
  visualType: 'area_square',

  hook: '한 변이 5cm인 정사각형 넓이? 5×5=25cm²! 🟧',

  principle: `
    정사각형은 가로 = 세로야!<br><br>
    한 변이 a cm이면:<br>
    넓이 = a × a = a²<br><br>
    한 변이 7cm이면:<br>
    넓이 = 7 × 7 = <strong style="color:#00ffcc">49cm²</strong><br><br>
    "a²"는 "a의 제곱"이라고 읽어!
  `,

  story: `"제곱"이라는 말은 정사각형에서 왔어!<br><br>
    영어로 "square(정사각형)"가 곧 "제곱"이야.<br>
    5² = 5 × 5 = 25는<br>
    "한 변이 5인 정사각형의 넓이"라는 뜻이지!<br><br>
    수학 기호에도 이야기가 있어 📖`,

  realLife: [
    { icon: '🟫', title: '타일', desc: '한 변 30cm 정사각형 타일의 넓이 = 30 × 30 = 900cm².' },
    { icon: '🏫', title: '교실', desc: '한 변 8m 정사각형 교실 = 64m²!' },
    { icon: '📸', title: '사진', desc: '10cm × 10cm 정사각형 사진 = 100cm².' },
  ],

  sliders: [
    { name: 'a', label: '한 변', min: 1, max: 15, default: 7, step: 1 },
  ],

  example: {
    question: '한 변이 7cm인 정사각형의 넓이는 몇 cm²인가요?',
    answer: '49cm²',
    steps: ['공식: 넓이 = 한 변 × 한 변', '= 7 × 7', '= 49', '넓이는 49cm²!'],
    hints: [
      '힌트 1: 정사각형은 네 변의 길이가 모두 같아.',
      '힌트 2: 넓이 = 한 변 × 한 변 = 7 × 7.',
      '힌트 3: 7 × 7 = 49cm²!',
    ],
    otherApproaches: [
      { name: '직사각형으로 생각', desc: '가로 7, 세로 7인 직사각형과 같아. 7 × 7 = 49!' }
    ],
  },

  evolution: { prev: undefined, next: 'M053', family: '넓이의 발전', familyDescription: '초등 정사각형 넓이 → 중등 닮음비와 넓이비 → 고등 적분으로 발전' },
  relatedIds: ['E032', 'E034'],
},

{
  id: 'E034', number: 34,
  name: '평행사변형의 넓이',
  latex: 'A = \\text{밑변} \\times \\text{높이}',
  description: '비스듬한 도형도 잘라 붙이면 직사각형이 돼',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['평행사변형', '넓이', '5학년'],
  visualType: 'area_parallelogram',

  hook: '비스듬한 도형도 잘라 붙이면 직사각형이 돼 → 밑변×높이! ✂️',

  principle: `
    평행사변형의 삐뚤어진 부분을 잘라서<br>
    반대쪽에 붙이면?<br><br>
    → 직사각형이 돼!<br><br>
    그래서 넓이 = 밑변 × 높이<br>
    밑변 6cm, 높이 4cm이면:<br>
    넓이 = 6 × 4 = <strong style="color:#00ffcc">24cm²</strong>
  `,

  story: `평행사변형은 직사각형을 비스듬히 밀어놓은 모양이야.<br><br>
    비스듬해도 밑변과 높이가 같으면<br>
    넓이도 같아!<br><br>
    가위로 잘라서 붙여보면 정말 직사각형이 돼 🪄`,

  realLife: [
    { icon: '🏗️', title: '건물', desc: '비스듬한 벽면의 넓이도 밑변 × 높이로 구해.' },
    { icon: '🎨', title: '무늬', desc: '마름모꼴 타일도 밑변 × 높이로 넓이를 구해!' },
    { icon: '📐', title: '도형 변환', desc: '잘라 붙이면 직사각형! 같은 넓이야.' },
  ],

  sliders: [
    { name: 'base', label: '밑변', min: 1, max: 15, default: 6, step: 1 },
    { name: 'height', label: '높이', min: 1, max: 15, default: 4, step: 1 },
  ],

  example: {
    question: '밑변 6cm, 높이 4cm인 평행사변형의 넓이는 몇 cm²인가요?',
    answer: '24cm²',
    steps: ['공식: 넓이 = 밑변 × 높이', '= 6 × 4', '= 24', '넓이는 24cm²!'],
    hints: [
      '힌트 1: 평행사변형을 잘라 붙이면 직사각형이 돼.',
      '힌트 2: 넓이 = 밑변 × 높이야.',
      '힌트 3: 6 × 4 = 24cm²!',
    ],
    otherApproaches: [
      { name: '직사각형으로 변환', desc: '삼각형 부분을 잘라서 붙이면 6×4 직사각형!' }
    ],
  },

  evolution: { prev: undefined, next: 'M053', family: '넓이의 발전', familyDescription: '초등 평행사변형 넓이 → 중등 도형 넓이 응용 → 고등 벡터로 넓이 계산' },
  relatedIds: ['E032', 'E035'],
},

{
  id: 'E035', number: 35,
  name: '삼각형의 넓이',
  latex: 'A = \\frac{\\text{밑변} \\times \\text{높이}}{2}',
  description: '직사각형의 딱 절반! ÷2를 잊지 마',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['삼각형', '넓이', '5학년'],
  visualType: 'area_triangle',

  hook: '삼각형은 직사각형의 딱 절반이야 → ÷2를 잊지 마! 📐',

  principle: `
    직사각형을 대각선으로 반으로 자르면?<br>
    → 삼각형 2개!<br><br>
    그러니까 삼각형 넓이 = 직사각형의 절반<br>
    = 밑변 × 높이 ÷ 2<br><br>
    밑변 8cm, 높이 5cm이면:<br>
    8 × 5 ÷ 2 = <strong style="color:#00ffcc">20cm²</strong>
  `,

  story: `고대 이집트에서 피라미드를 지을 때<br>
    삼각형 면의 넓이를 계산해야 했어.<br><br>
    직사각형을 반으로 자르면 삼각형이 되니까<br>
    "밑변 × 높이 ÷ 2"를 사용했지!<br><br>
    4,500년 전부터 쓰인 공식이야 🏛️`,

  realLife: [
    { icon: '🔺', title: '표지판', desc: '삼각형 표지판의 넓이도 밑변 × 높이 ÷ 2!' },
    { icon: '🏔️', title: '산 단면', desc: '산의 삼각형 단면 넓이 = 밑변 × 높이 ÷ 2.' },
    { icon: '🎪', title: '텐트', desc: '삼각형 텐트 입구의 넓이를 구할 때 사용해!' },
  ],

  sliders: [
    { name: 'base', label: '밑변', min: 1, max: 20, default: 8, step: 1 },
    { name: 'height', label: '높이', min: 1, max: 20, default: 5, step: 1 },
  ],

  example: {
    question: '밑변 8cm, 높이 5cm인 삼각형의 넓이는 몇 cm²인가요?',
    answer: '20cm²',
    steps: ['공식: 넓이 = 밑변 × 높이 ÷ 2', '= 8 × 5 ÷ 2', '= 40 ÷ 2', '= 20cm²!'],
    hints: [
      '힌트 1: 삼각형은 직사각형의 절반이야.',
      '힌트 2: 밑변 × 높이 = 8 × 5 = 40.',
      '힌트 3: 40 ÷ 2 = 20cm²!',
    ],
    otherApproaches: [
      { name: '종이 접기', desc: '같은 삼각형 2개를 합치면 직사각형이 돼. 그 절반이 삼각형 넓이!' }
    ],
  },

  evolution: { prev: undefined, next: 'M053', family: '삼각형 넓이의 발전', familyDescription: '초등 ½×밑변×높이 → 중등 닮음비와 넓이비 → 고등 사인 이용 넓이 공식' },
  relatedIds: ['E032', 'E034', 'E036'],
},

{
  id: 'E036', number: 36,
  name: '사다리꼴의 넓이',
  latex: 'A = \\frac{(\\text{윗변} + \\text{아랫변}) \\times \\text{높이}}{2}',
  description: '윗변과 아랫변을 더한 뒤 높이를 곱하고 ÷2',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['사다리꼴', '넓이', '5학년'],
  visualType: 'area_trapezoid',

  hook: '사다리꼴은 두 삼각형으로 나눌 수 있어 → 합쳐서 ÷2! 📐',

  principle: `
    사다리꼴을 뒤집어서 붙이면?<br>
    → 평행사변형이 돼!<br><br>
    평행사변형 밑변 = 윗변 + 아랫변<br>
    넓이의 절반이 사다리꼴 하나!<br><br>
    (윗변 + 아랫변) × 높이 ÷ 2<br>
    (3 + 7) × 4 ÷ 2 = <strong style="color:#00ffcc">20cm²</strong>
  `,

  story: `사다리꼴은 한쪽이 좁고 한쪽이 넓은 도형이야.<br><br>
    같은 사다리꼴을 뒤집어서 붙이면<br>
    평행사변형이 되는 게 핵심!<br><br>
    그 평행사변형 넓이의 반이<br>
    사다리꼴 넓이야 ✨`,

  realLife: [
    { icon: '🏗️', title: '지붕', desc: '사다리꼴 모양 지붕의 넓이를 구할 때 사용해.' },
    { icon: '🪜', title: '사다리', desc: '사다리 모양이 바로 사다리꼴이야!' },
    { icon: '🎒', title: '가방', desc: '사다리꼴 모양 주머니의 천 면적을 구할 수 있어.' },
  ],

  sliders: [
    { name: 'top', label: '윗변', min: 1, max: 10, default: 3, step: 1 },
    { name: 'bottom', label: '아랫변', min: 1, max: 15, default: 7, step: 1 },
    { name: 'height', label: '높이', min: 1, max: 10, default: 4, step: 1 },
  ],

  example: {
    question: '윗변 3cm, 아랫변 7cm, 높이 4cm인 사다리꼴의 넓이는 몇 cm²인가요?',
    answer: '20cm²',
    steps: ['공식: (윗변 + 아랫변) × 높이 ÷ 2', '= (3 + 7) × 4 ÷ 2', '= 10 × 4 ÷ 2', '= 40 ÷ 2 = 20cm²!'],
    hints: [
      '힌트 1: 윗변과 아랫변을 먼저 더해. 3 + 7 = 10.',
      '힌트 2: 10 × 4 = 40.',
      '힌트 3: 40 ÷ 2 = 20cm²!',
    ],
    otherApproaches: [
      { name: '두 삼각형으로', desc: '대각선으로 나눠서 삼각형 2개의 넓이를 더해도 같아!' }
    ],
  },

  evolution: { prev: undefined, next: 'M053', family: '넓이의 발전', familyDescription: '초등 사다리꼴 넓이 → 중등 도형 넓이 응용 → 고등 적분으로 발전' },
  relatedIds: ['E034', 'E035', 'E037'],
},

{
  id: 'E037', number: 37,
  name: '마름모의 넓이',
  latex: 'A = \\frac{\\text{대각선1} \\times \\text{대각선2}}{2}',
  description: '두 대각선을 곱하고 ÷2하면 마름모 넓이',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['마름모', '넓이', '대각선', '5학년'],
  visualType: 'area_rhombus',

  hook: '마름모를 직사각형에 넣으면 딱 절반 크기야! 💎',

  principle: `
    마름모의 두 대각선이 6cm, 4cm일 때:<br><br>
    마름모를 감싸는 직사각형을 그리면<br>
    가로 6cm, 세로 4cm!<br>
    직사각형 넓이 = 6 × 4 = 24cm²<br><br>
    마름모는 그 직사각형의 딱 <strong>절반</strong>!<br>
    24 ÷ 2 = <strong style="color:#00ffcc">12cm²</strong>
  `,

  story: `마름모는 네 변의 길이가 모두 같은 도형이야.<br><br>
    다이아몬드(💎) 모양이라고도 부르지!<br>
    두 대각선이 수직으로 만나는 특별한 성질 덕분에<br>
    넓이를 쉽게 구할 수 있어.`,

  realLife: [
    { icon: '💎', title: '보석', desc: '다이아몬드 모양의 넓이도 대각선으로 구해!' },
    { icon: '🪁', title: '연', desc: '마름모 모양 연의 넓이 = 대각선1 × 대각선2 ÷ 2.' },
    { icon: '🃏', title: '카드', desc: '카드의 다이아몬드 무늬도 마름모야.' },
  ],

  sliders: [
    { name: 'd1', label: '대각선1', min: 1, max: 15, default: 6, step: 1 },
    { name: 'd2', label: '대각선2', min: 1, max: 15, default: 4, step: 1 },
  ],

  example: {
    question: '두 대각선이 6cm, 4cm인 마름모의 넓이는 몇 cm²인가요?',
    answer: '12cm²',
    steps: ['공식: 넓이 = 대각선1 × 대각선2 ÷ 2', '= 6 × 4 ÷ 2', '= 24 ÷ 2', '= 12cm²!'],
    hints: [
      '힌트 1: 마름모 넓이는 두 대각선의 곱의 반이야.',
      '힌트 2: 6 × 4 = 24.',
      '힌트 3: 24 ÷ 2 = 12cm²!',
    ],
    otherApproaches: [
      { name: '4개 삼각형', desc: '마름모를 대각선으로 자르면 삼각형 4개. 각각 넓이를 더해도 12cm²!' }
    ],
  },

  evolution: { prev: undefined, next: 'M053', family: '넓이의 발전', familyDescription: '초등 마름모 넓이 → 중등 대각선과 넓이 → 고등 벡터 외적으로 발전' },
  relatedIds: ['E035', 'E036'],
},

{
  id: 'E038', number: 38,
  name: '원주율',
  latex: '\\text{원주} \\div \\text{지름} \\approx 3.14',
  description: '어떤 원이든 둘레÷지름은 항상 3.14...',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['원주율', '원', '3.14', '6학년'],
  visualType: 'pi_ratio',

  hook: '어떤 원이든 둘레를 지름으로 나누면 항상 3.14...! 신기하지? 🔵',

  principle: `
    동그란 물건에 실을 감아서 재보자!<br><br>
    원의 둘레(원주) ÷ 지름 = ?<br>
    큰 원이든, 작은 원이든 항상 약 <strong style="color:#00ffcc">3.14</strong>!<br><br>
    이 신기한 수를 "원주율"이라고 해.<br>
    초등에서는 <strong>3.14</strong>를 사용해!
  `,

  story: `고대 그리스 수학자 아르키메데스는<br>
    원에 정다각형을 넣고 빼면서<br>
    원주율을 계산했어.<br><br>
    3.14159265... 끝없이 이어지는 수!<br>
    전 세계에서 "3월 14일"을 원주율의 날로 기념해 🎂`,

  realLife: [
    { icon: '🍕', title: '피자', desc: '피자 가장자리 길이 = 지름 × 3.14!' },
    { icon: '🚲', title: '자전거', desc: '바퀴 지름 60cm이면 한 바퀴 = 60 × 3.14 = 188.4cm!' },
    { icon: '🏟️', title: '원형 트랙', desc: '원형 운동장 둘레 = 지름 × 3.14!' },
  ],

  sliders: [
    { name: 'd', label: '지름', min: 1, max: 20, default: 10, step: 1 },
  ],

  example: {
    question: '지름이 10cm인 원의 원주는 약 몇 cm인가요?',
    answer: '31.4cm',
    steps: ['원주 = 지름 × 원주율', '= 10 × 3.14', '= 31.4cm', '원주는 약 31.4cm!'],
    hints: [
      '힌트 1: 원주 = 지름 × 3.14야.',
      '힌트 2: 10 × 3.14 = ?',
      '힌트 3: 10 × 3.14 = 31.4cm!',
    ],
    otherApproaches: [
      { name: '직접 재기', desc: '원 모양 물건에 실을 감아서 재면 약 31.4cm가 나와!' }
    ],
  },

  evolution: { prev: undefined, next: 'M051', family: '원 계산의 발전', familyDescription: '초등 3.14 → 중등 부채꼴 호·넓이 → 고등 삼각함수와 π의 세계' },
  relatedIds: ['E039', 'E040'],
},

{
  id: 'E039', number: 39,
  name: '원의 둘레 (원주)',
  latex: 'L = \\text{지름} \\times 3.14',
  description: '지름에 3.14를 곱하면 원의 둘레',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['원', '둘레', '원주', '6학년'],
  visualType: 'circumference',

  hook: '자전거 바퀴가 한 바퀴 돌면 얼마나 가나? 원주로 계산해! 🚲',

  principle: `
    원의 둘레(원주) = 지름 × 3.14<br><br>
    지름 20cm인 원이면:<br>
    원주 = 20 × 3.14 = <strong style="color:#00ffcc">62.8cm</strong><br><br>
    반지름을 알면? 지름 = 반지름 × 2이니까<br>
    원주 = 반지름 × 2 × 3.14
  `,

  story: `자전거 바퀴가 한 바퀴 돌면<br>
    원주만큼 앞으로 가!<br><br>
    바퀴 지름이 60cm이면<br>
    한 바퀴에 60 × 3.14 = 188.4cm를 가지!<br><br>
    큰 바퀴일수록 한 바퀴에 더 멀리 갈 수 있어 🚴`,

  realLife: [
    { icon: '🚲', title: '자전거', desc: '바퀴 지름 70cm → 한 바퀴 = 70 × 3.14 = 219.8cm!' },
    { icon: '🎡', title: '관람차', desc: '지름 100m 관람차 한 바퀴 = 314m!' },
    { icon: '⭕', title: '화단', desc: '원형 화단 둘레에 울타리를 치려면 원주를 알아야 해.' },
  ],

  sliders: [
    { name: 'd', label: '지름', min: 1, max: 30, default: 20, step: 1 },
  ],

  example: {
    question: '지름이 20cm인 원의 둘레는 약 몇 cm인가요?',
    answer: '62.8cm',
    steps: ['공식: 원주 = 지름 × 3.14', '= 20 × 3.14', '= 62.8cm', '원의 둘레는 약 62.8cm!'],
    hints: [
      '힌트 1: 원의 둘레 = 지름 × 3.14야.',
      '힌트 2: 20 × 3.14 = ?',
      '힌트 3: 20 × 3.14 = 62.8cm!',
    ],
    otherApproaches: [
      { name: '반지름으로', desc: '반지름 10cm × 2 × 3.14 = 62.8cm. 같은 답!' }
    ],
  },

  evolution: { prev: undefined, next: 'M051', family: '원 계산의 발전', familyDescription: '초등 원의 둘레 → 중등 부채꼴 호의 길이 → 고등 곡선의 길이로 발전' },
  relatedIds: ['E038', 'E040'],
},

{
  id: 'E040', number: 40,
  name: '원의 넓이',
  latex: 'A = \\text{반지름} \\times \\text{반지름} \\times 3.14',
  description: '반지름 × 반지름 × 3.14 = 원의 넓이',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['원', '넓이', '6학년'],
  visualType: 'circle_area',

  hook: '원을 잘게 자르면 직사각형이 돼 → 가로(반원주) × 세로(반지름)! 🔵',

  principle: `
    원을 부채꼴로 잘게 잘라서 펼치면?<br>
    → 직사각형 비슷한 모양이 돼!<br><br>
    가로 = 반원주 = 반지름 × 3.14<br>
    세로 = 반지름<br><br>
    넓이 = 반지름 × 3.14 × 반지름<br>
    = 반지름 × 반지름 × 3.14<br><br>
    반지름 5cm이면: 5 × 5 × 3.14 = <strong style="color:#00ffcc">78.5cm²</strong>
  `,

  story: `아르키메데스가 원의 넓이를 구할 때<br>
    원을 잘게 잘라서 펼치는 방법을 썼어.<br><br>
    부채꼴 조각을 번갈아 배치하면<br>
    직사각형처럼 보이지!<br><br>
    이 아이디어가 지금까지 쓰이고 있어 💡`,

  realLife: [
    { icon: '🍕', title: '피자', desc: '반지름 15cm 피자의 넓이 = 15 × 15 × 3.14 = 706.5cm²!' },
    { icon: '🏟️', title: '원형 무대', desc: '반지름 10m 무대 = 314m²!' },
    { icon: '🎯', title: '과녁', desc: '과녁 넓이 = 반지름 × 반지름 × 3.14!' },
  ],

  sliders: [
    { name: 'r', label: '반지름', min: 1, max: 15, default: 5, step: 1 },
  ],

  example: {
    question: '반지름이 5cm인 원의 넓이는 약 몇 cm²인가요?',
    answer: '78.5cm²',
    steps: ['공식: 넓이 = 반지름 × 반지름 × 3.14', '= 5 × 5 × 3.14', '= 25 × 3.14', '= 78.5cm²!'],
    hints: [
      '힌트 1: 반지름을 두 번 곱해. 5 × 5 = 25.',
      '힌트 2: 25 × 3.14 = ?',
      '힌트 3: 25 × 3.14 = 78.5cm²!',
    ],
    otherApproaches: [
      { name: '직사각형으로 변환', desc: '원을 잘게 잘라 펼치면 가로 15.7 × 세로 5 ≈ 78.5cm²!' }
    ],
  },

  evolution: { prev: undefined, next: 'M051', family: '원 계산의 발전', familyDescription: '초등 원의 넓이 → 중등 부채꼴 넓이 → 고등 적분으로 원 넓이 증명' },
  relatedIds: ['E038', 'E039'],
},

{
  id: 'E041', number: 41,
  name: '직육면체의 겉넓이',
  latex: 'S = 2(ab + bc + ca)',
  description: '여섯 면의 넓이를 모두 더한 것',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['직육면체', '겉넓이', '전개도', '6학년'],
  visualType: 'surface_cuboid',

  hook: '선물 상자를 포장지로 감싸려면 겉넓이를 알아야 해! 🎁',

  principle: `
    직육면체를 전개도로 펼치면 직사각형 6개!<br><br>
    가로 a, 세로 b, 높이 c일 때:<br>
    앞뒤: a × c × 2<br>
    좌우: b × c × 2<br>
    위아래: a × b × 2<br><br>
    겉넓이 = <strong style="color:#00ffcc">2(ab + bc + ca)</strong><br>
    예: 3, 4, 5 → 2(12 + 20 + 15) = 2 × 47 = <strong>94cm²</strong>
  `,

  story: `선물을 포장하려면 포장지가 얼마나 필요할까?<br><br>
    상자를 펼쳐서(전개도) 각 면의 넓이를 구하면 돼!<br>
    마주보는 면은 항상 같은 크기이니까<br>
    3쌍의 면 넓이를 구해서 × 2! 🎀`,

  realLife: [
    { icon: '🎁', title: '포장', desc: '선물 상자 포장지 면적 = 겉넓이!' },
    { icon: '🏠', title: '방 페인트', desc: '방의 벽과 천장 면적 = 겉넓이(바닥 제외)!' },
    { icon: '📦', title: '택배', desc: '택배 상자 만들 때 필요한 종이 면적!' },
  ],

  sliders: [
    { name: 'a', label: '가로', min: 1, max: 10, default: 3, step: 1 },
    { name: 'b', label: '세로', min: 1, max: 10, default: 4, step: 1 },
    { name: 'c', label: '높이', min: 1, max: 10, default: 5, step: 1 },
  ],

  example: {
    question: '가로 3cm, 세로 4cm, 높이 5cm인 직육면체의 겉넓이는 몇 cm²인가요?',
    answer: '94cm²',
    steps: ['ab = 3×4 = 12', 'bc = 4×5 = 20', 'ca = 5×3 = 15', '겉넓이 = 2(12+20+15) = 2×47 = 94cm²!'],
    hints: [
      '힌트 1: 세 쌍의 면 넓이를 각각 구해.',
      '힌트 2: 12 + 20 + 15 = 47.',
      '힌트 3: 47 × 2 = 94cm²!',
    ],
    otherApproaches: [
      { name: '전개도 그리기', desc: '직육면체를 펼쳐서 6개 직사각형의 넓이를 각각 더해도 94cm²!' }
    ],
  },

  evolution: { prev: undefined, next: 'M053', family: '겉넓이의 발전', familyDescription: '초등 직육면체 겉넓이 → 중등 원기둥·구 겉넓이 → 고등 겉넓이 적분' },
  relatedIds: ['E042'],
},

{
  id: 'E042', number: 42,
  name: '직육면체의 부피',
  latex: 'V = \\text{가로} \\times \\text{세로} \\times \\text{높이}',
  description: '가로 × 세로 × 높이 = 입체의 크기',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['직육면체', '부피', '6학년'],
  visualType: 'volume_cuboid',

  hook: '냉장고, 수족관 물 양 — 가로×세로×높이면 알 수 있어! 📦',

  principle: `
    1cm × 1cm × 1cm 쌓기나무가 몇 개 들어갈까?<br><br>
    가로 4개, 세로 3개 = 한 층에 12개<br>
    높이 5층 = 12 × 5 = <strong style="color:#00ffcc">60개 = 60cm³</strong><br><br>
    <strong>부피 = 가로 × 세로 × 높이</strong>
  `,

  story: `아르키메데스는 왕의 금관이 진짜인지 확인하기 위해<br>
    물에 넣어서 부피를 쟀어!<br><br>
    목욕탕에서 물이 넘치는 걸 보고<br>
    "유레카!(알았다!)"라고 외쳤다는 유명한 이야기!<br><br>
    부피는 물체가 차지하는 공간의 크기야 💡`,

  realLife: [
    { icon: '🐟', title: '수족관', desc: '가로 60cm, 세로 30cm, 높이 40cm = 72000cm³ = 72L!' },
    { icon: '📦', title: '택배', desc: '상자 부피로 택배비가 달라져.' },
    { icon: '🧊', title: '냉장고', desc: '냉장고 용량(L)이 부피야!' },
  ],

  sliders: [
    { name: 'a', label: '가로', min: 1, max: 10, default: 4, step: 1 },
    { name: 'b', label: '세로', min: 1, max: 10, default: 3, step: 1 },
    { name: 'c', label: '높이', min: 1, max: 10, default: 5, step: 1 },
  ],

  example: {
    question: '가로 4cm, 세로 3cm, 높이 5cm인 직육면체의 부피는 몇 cm³인가요?',
    answer: '60cm³',
    steps: ['공식: 부피 = 가로 × 세로 × 높이', '= 4 × 3 × 5', '= 12 × 5', '= 60cm³!'],
    hints: [
      '힌트 1: 가로 × 세로 × 높이야.',
      '힌트 2: 4 × 3 = 12.',
      '힌트 3: 12 × 5 = 60cm³!',
    ],
    otherApproaches: [
      { name: '쌓기나무 세기', desc: '1cm³ 블록을 한 층에 12개, 5층 쌓으면 60개!' }
    ],
  },

  evolution: { prev: undefined, next: 'M053', family: '부피의 발전', familyDescription: '초등 가로×세로×높이 → 중등 원기둥·구의 부피 → 고등 적분으로 부피 계산' },
  relatedIds: ['E041'],
},

{
  id: 'E043', number: 43,
  name: '평균',
  latex: '\\text{평균} = \\frac{\\text{전체의 합}}{\\text{개수}}',
  description: '여러 수를 고르게 나누면 평균',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['평균', '통계', '5학년'],
  visualType: 'average',

  hook: '시험 점수가 80, 90, 70이면 평균은? (80+90+70)÷3=80점! 📊',

  principle: `
    5명의 키: 140, 145, 150, 155, 160cm<br><br>
    높은 막대에서 낮은 막대로 옮겨서<br>
    모든 막대를 같은 높이로 만들면?<br>
    = <strong style="color:#00ffcc">150cm</strong><br><br>
    계산으로는: (140+145+150+155+160) ÷ 5 = 750 ÷ 5 = <strong>150cm</strong>
  `,

  story: `벨기에 수학자 케틀레는 평균을 이용해서<br>
    사회 현상을 분석했어.<br><br>
    "평균적인 사람"이라는 개념을 만들어<br>
    키, 몸무게 등의 평균을 연구했지.<br><br>
    지금도 평균은 데이터를 이해하는 가장 기본적인 방법이야! 📈`,

  realLife: [
    { icon: '📝', title: '시험 점수', desc: '국어 85, 수학 90, 영어 80의 평균 = 85점!' },
    { icon: '🌡️', title: '평균 기온', desc: '일주일 기온을 합해서 7로 나누면 평균 기온!' },
    { icon: '⚽', title: '평균 골', desc: '10경기에서 20골 → 경기당 평균 2골!' },
  ],

  sliders: [
    { name: 'a', label: '값 1', min: 0, max: 200, default: 140, step: 1 },
    { name: 'b', label: '값 2', min: 0, max: 200, default: 145, step: 1 },
    { name: 'c', label: '값 3', min: 0, max: 200, default: 150, step: 1 },
  ],

  example: {
    question: '5명의 키가 140, 145, 150, 155, 160cm일 때 평균 키는 몇 cm인가요?',
    answer: '150cm',
    steps: ['합계 = 140 + 145 + 150 + 155 + 160 = 750', '개수 = 5명', '평균 = 750 ÷ 5', '= 150cm!'],
    hints: [
      '힌트 1: 먼저 5명의 키를 모두 더해.',
      '힌트 2: 140+145+150+155+160 = 750.',
      '힌트 3: 750 ÷ 5 = 150cm!',
    ],
    otherApproaches: [
      { name: '가운데 값으로 추측', desc: '140~160의 가운데는 150. 확인: (140+145+150+155+160)÷5 = 150!' }
    ],
  },

  evolution: { prev: undefined, next: 'M067', family: '통계의 발전', familyDescription: '초등 평균 → 중등 중앙값·최빈값·분산 → 고등 정규분포·통계적 추정' },
  relatedIds: ['E049'],
},

// ══════════════════════════════════════════
// 단위 관련
// ══════════════════════════════════════════

{
  id: 'E044', number: 44,
  name: '넓이 단위',
  latex: '1m^2 = 10000cm^2',
  description: '넓이는 길이 단위의 제곱으로 나타내',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['넓이', '단위', 'cm²', 'm²', '5학년'],
  visualType: 'unit_area',

  hook: '1m²는 1cm²가 10000개! 단위가 커지면 숫자가 작아져 📐',

  principle: `
    1m = 100cm이니까<br>
    1m × 1m = 100cm × 100cm<br>
    = <strong style="color:#00ffcc">10,000cm²</strong><br><br>
    넓이 단위를 바꿀 때는<br>
    길이 변환을 <strong>두 번</strong> 해야 해!<br><br>
    1km² = 1,000,000m² (1km = 1000m이니까)
  `,

  story: `넓이를 잴 때 cm²만 쓰면<br>
    운동장은 몇만 cm²가 되어 너무 커!<br><br>
    그래서 m², km², a(아르), ha(헥타르) 등<br>
    큰 단위를 만들었어.<br><br>
    축구장 하나가 약 7,000m²야 ⚽`,

  realLife: [
    { icon: '🏠', title: '방 크기', desc: '방 12m² = 120,000cm².' },
    { icon: '🌾', title: '논밭', desc: '논 1ha = 10,000m².' },
    { icon: '🧣', title: '손수건', desc: '25cm × 25cm = 625cm².' },
  ],

  sliders: [
    { name: 'a', label: 'm²', min: 1, max: 10, default: 1, step: 1 },
  ],

  example: {
    question: '3m²는 몇 cm²인가요?',
    answer: '30,000cm²',
    steps: ['1m² = 10,000cm²', '3m² = 3 × 10,000', '= 30,000cm²', '3m² = 30,000cm²!'],
    hints: [
      '힌트 1: 1m² = 10,000cm²야.',
      '힌트 2: 3 × 10,000 = ?',
      '힌트 3: 3 × 10,000 = 30,000cm²!',
    ],
    otherApproaches: [
      { name: '길이로 생각', desc: '1m = 100cm. 가로 300cm × 세로 100cm = 30,000cm²!' }
    ],
  },

  evolution: { prev: undefined, next: 'M053', family: '넓이 단위의 발전', familyDescription: '초등 단위 변환 → 중등 입체도형 단위 → 고등 물리학 단위 환산' },
  relatedIds: ['E045', 'E046'],
},

{
  id: 'E045', number: 45,
  name: '부피 단위',
  latex: '1m^3 = 1000000cm^3',
  description: '부피는 길이 단위의 세제곱으로 나타내',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['부피', '단위', 'cm³', 'm³', '6학년'],
  visualType: 'unit_volume',

  hook: '1m³는 1cm³가 100만 개! 수영장 물 부피는 m³로 재 🏊',

  principle: `
    1m = 100cm이니까<br>
    1m³ = 100 × 100 × 100<br>
    = <strong style="color:#00ffcc">1,000,000cm³</strong><br><br>
    부피 단위를 바꿀 때는<br>
    길이 변환을 <strong>세 번</strong> 해야 해!<br><br>
    참고: 1L = 1000cm³ = 1000mL
  `,

  story: `부피를 잴 때 cm³만 쓰면<br>
    수영장은 억 단위 cm³가 되어 너무 커!<br><br>
    그래서 m³를 사용하지.<br>
    25m 수영장의 물은 약 375m³야!<br><br>
    물의 양은 L로도 나타내: 1m³ = 1000L 🌊`,

  realLife: [
    { icon: '🏊', title: '수영장', desc: '25m 수영장 = 약 375m³ = 375,000L!' },
    { icon: '📦', title: '택배', desc: '택배비 = 부피(가로×세로×높이)로 정해져.' },
    { icon: '🧊', title: '냉장고', desc: '냉장고 500L = 500,000cm³.' },
  ],

  sliders: [
    { name: 'a', label: 'm³', min: 1, max: 5, default: 1, step: 1 },
  ],

  example: {
    question: '2m³는 몇 cm³인가요?',
    answer: '2,000,000cm³',
    steps: ['1m³ = 1,000,000cm³', '2m³ = 2 × 1,000,000', '= 2,000,000cm³', '2m³ = 2,000,000cm³!'],
    hints: [
      '힌트 1: 1m³ = 1,000,000cm³야.',
      '힌트 2: 2 × 1,000,000 = ?',
      '힌트 3: 2 × 1,000,000 = 2,000,000cm³!',
    ],
    otherApproaches: [
      { name: 'L로 바꾸기', desc: '1m³ = 1000L. 2m³ = 2000L = 2,000,000mL = 2,000,000cm³!' }
    ],
  },

  evolution: { prev: undefined, next: 'M053', family: '부피 단위의 발전', familyDescription: '초등 부피 단위 → 중등 입체도형 부피 → 고등 물리학 단위 환산' },
  relatedIds: ['E042', 'E044'],
},

{
  id: 'E046', number: 46,
  name: '길이 단위',
  latex: '1km = 1000m = 100000cm = 1000000mm',
  description: 'km, m, cm, mm 사이의 관계',
  level: 'elementary', grade: '3~4학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['길이', '단위', 'km', 'm', 'cm', 'mm', '3학년'],
  visualType: 'unit_length',

  hook: '학교에서 집까지 1.5km. 걸으면 몇 분? 단위를 알아야 계산할 수 있어 🏫',

  principle: `
    <strong>1km = 1,000m</strong> (킬로미터 → 미터)<br>
    <strong>1m = 100cm</strong> (미터 → 센티미터)<br>
    <strong>1cm = 10mm</strong> (센티미터 → 밀리미터)<br><br>
    큰 것 → 작은 것: <strong>× 하기</strong><br>
    작은 것 → 큰 것: <strong>÷ 하기</strong><br><br>
    예: 3km = 3 × 1000 = <strong style="color:#00ffcc">3000m</strong>
  `,

  story: `"킬로(kilo)"는 그리스어로 "1000"이란 뜻이야.<br>
    "센티(centi)"는 라틴어로 "100분의 1"이란 뜻!<br>
    "밀리(milli)"는 라틴어로 "1000분의 1"!<br><br>
    단위 접두사를 알면 다른 단위도 쉬워! 📚`,

  realLife: [
    { icon: '🏃', title: '달리기', desc: '100m 달리기, 1km 마라톤!' },
    { icon: '🚗', title: '자동차', desc: '서울~부산 약 400km.' },
    { icon: '✂️', title: '바느질', desc: '바늘 구멍은 약 1mm!' },
  ],

  sliders: [
    { name: 'km', label: 'km', min: 0, max: 5, default: 1, step: 0.1 },
  ],

  example: {
    question: '2.5km는 몇 m인가요?',
    answer: '2500m',
    steps: ['1km = 1000m', '2.5km = 2.5 × 1000', '= 2500m', '2.5km = 2500m!'],
    hints: [
      '힌트 1: 1km = 1000m야.',
      '힌트 2: 2.5 × 1000 = ?',
      '힌트 3: 2.5 × 1000 = 2500m!',
    ],
    otherApproaches: [
      { name: '나누어 생각', desc: '2km = 2000m, 0.5km = 500m. 합치면 2500m!' }
    ],
  },

  evolution: { prev: undefined, next: undefined, family: '단위의 발전', familyDescription: '초등 길이 단위 → 중등 좌표 거리 → 고등 벡터 크기로 발전' },
  relatedIds: ['E044', 'E047', 'E048'],
},

{
  id: 'E047', number: 47,
  name: '들이 단위',
  latex: '1L = 1000mL',
  description: '액체의 양을 재는 단위',
  level: 'elementary', grade: '3~4학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['들이', '단위', 'L', 'mL', '3학년'],
  visualType: 'unit_liquid',

  hook: '콜라 1.5L는 500mL짜리 3캔이야! 🥤',

  principle: `
    <strong>1L = 1000mL</strong><br><br>
    L(리터) → mL(밀리리터): <strong>× 1000</strong><br>
    mL → L: <strong>÷ 1000</strong><br><br>
    1.5L = 1500mL<br>
    500mL = 0.5L<br><br>
    <strong style="color:#00ffcc">500mL 3캔 = 1500mL = 1.5L!</strong>
  `,

  story: `"리터(Liter)"라는 단위는<br>
    프랑스 과학자 리트르(Litron)의 이름에서 왔어.<br><br>
    프랑스 혁명 후 새로운 단위 체계(미터법)를 만들 때<br>
    물 1kg의 부피를 1L로 정했어! 🇫🇷`,

  realLife: [
    { icon: '🥤', title: '음료수', desc: '캔 350mL, 페트병 500mL, 대용량 1.5L!' },
    { icon: '🥛', title: '우유', desc: '작은 팩 200mL, 큰 팩 1L.' },
    { icon: '🛁', title: '욕조', desc: '욕조 물 약 200L = 200,000mL!' },
  ],

  sliders: [
    { name: 'liters', label: 'L', min: 0, max: 5, default: 1.5, step: 0.1 },
  ],

  example: {
    question: '1.5L는 몇 mL인가요?',
    answer: '1500mL',
    steps: ['1L = 1000mL', '1.5L = 1.5 × 1000', '= 1500mL', '1.5L = 1500mL!'],
    hints: [
      '힌트 1: 1L = 1000mL야.',
      '힌트 2: 1.5 × 1000 = ?',
      '힌트 3: 1.5 × 1000 = 1500mL!',
    ],
    otherApproaches: [
      { name: '나누어 생각', desc: '1L = 1000mL, 0.5L = 500mL. 합치면 1500mL!' }
    ],
  },

  evolution: { prev: undefined, next: undefined, family: '단위의 발전', familyDescription: '초등 들이 단위 → 중등 부피 계산 → 고등 적분으로 부피 계산' },
  relatedIds: ['E046', 'E048'],
},

{
  id: 'E048', number: 48,
  name: '무게 단위',
  latex: '1kg = 1000g, 1t = 1000kg',
  description: '무거운 것과 가벼운 것을 재는 단위',
  level: 'elementary', grade: '3~4학년', curriculum: '2022개정',
  category: 'geometry',
  tags: ['무게', '단위', 'g', 'kg', 't', '3학년'],
  visualType: 'unit_weight',

  hook: '갓 태어난 아기 약 3kg. 코끼리는 약 5t — 단위가 엄청 달라! 🐘',

  principle: `
    <strong>1kg = 1000g</strong><br>
    <strong>1t(톤) = 1000kg</strong><br><br>
    작은 것 → g: 과자, 편지 등<br>
    보통 → kg: 사람 몸무게, 쌀 포대<br>
    엄청 큰 것 → t: 자동차, 코끼리<br><br>
    예: <strong style="color:#00ffcc">2.5kg = 2500g</strong>
  `,

  story: `"킬로그램(kg)"은 프랑스에서 만들어진<br>
    국제 표준 무게 단위야.<br><br>
    예전에는 백금 덩어리로 1kg을 정했는데,<br>
    지금은 과학적으로 정확하게 정의해! ⚖️`,

  realLife: [
    { icon: '🍫', title: '과자', desc: '과자 1봉지 약 100g.' },
    { icon: '🧒', title: '몸무게', desc: '초등학생 평균 약 30~40kg.' },
    { icon: '🚛', title: '트럭', desc: '화물 트럭 최대 적재량 약 5t!' },
  ],

  sliders: [
    { name: 'kg', label: 'kg', min: 0, max: 10, default: 2.5, step: 0.1 },
  ],

  example: {
    question: '2.5kg은 몇 g인가요?',
    answer: '2500g',
    steps: ['1kg = 1000g', '2.5kg = 2.5 × 1000', '= 2500g', '2.5kg = 2500g!'],
    hints: [
      '힌트 1: 1kg = 1000g야.',
      '힌트 2: 2.5 × 1000 = ?',
      '힌트 3: 2.5 × 1000 = 2500g!',
    ],
    otherApproaches: [
      { name: '나누어 생각', desc: '2kg = 2000g, 0.5kg = 500g. 합치면 2500g!' }
    ],
  },

  evolution: { prev: undefined, next: undefined, family: '단위의 발전', familyDescription: '초등 무게 단위 → 중등 밀도 계산 → 고등 물리학으로 확장' },
  relatedIds: ['E046', 'E047'],
},

{
  id: 'E049', number: 49,
  name: '가능성',
  latex: '0 \\leq \\text{가능성} \\leq 1',
  description: '일이 일어날 수 있는 정도를 숫자로 나타내',
  level: 'elementary', grade: '5~6학년', curriculum: '2022개정',
  category: 'probability',
  tags: ['가능성', '확률', '6학년'],
  visualType: 'possibility',

  hook: '동전을 던지면 앞면이 나올 가능성은 반반! 숫자로 나타낼 수 있어 🪙',

  principle: `
    가능성을 말로 표현하면:<br>
    <strong>불가능</strong> ← 일어나지 않을 것 같다 ← <strong>반반</strong> → 일어날 것 같다 → <strong>확실</strong><br><br>
    숫자로 표현하면:<br>
    <strong>0</strong>(절대 안 일어남) ~ <strong>1</strong>(반드시 일어남)<br><br>
    동전 앞면 가능성 = <strong style="color:#00ffcc">1/2 (반반!)</strong>
  `,

  story: `확률은 도박에서 시작됐어!<br><br>
    17세기 프랑스 수학자 파스칼과 페르마가<br>
    도박 문제를 풀면서 확률 이론을 만들었지.<br><br>
    지금은 날씨 예보, 의학, 게임 등<br>
    모든 곳에서 가능성(확률)을 사용해! 🌤️`,

  realLife: [
    { icon: '🪙', title: '동전 던지기', desc: '앞면 가능성 = 1/2. 반반이야!' },
    { icon: '🎲', title: '주사위', desc: '6이 나올 가능성 = 1/6. 꽤 낮아!' },
    { icon: '🌧️', title: '날씨', desc: '비 올 가능성 80% → 우산 챙겨!' },
  ],

  sliders: [
    { name: 'red', label: '빨간 공', min: 0, max: 10, default: 3, step: 1 },
    { name: 'blue', label: '파란 공', min: 0, max: 10, default: 7, step: 1 },
  ],

  example: {
    question: '주머니에 빨간 공 3개, 파란 공 7개가 있어요. 빨간 공을 뽑을 가능성은 어떤가요?',
    answer: '낮다 (3/10)',
    steps: ['전체 공: 3 + 7 = 10개', '빨간 공: 3개', '가능성: 3/10 = 0.3', '절반(0.5)보다 작으니까 "낮다"!'],
    hints: [
      '힌트 1: 전체 공 개수를 세봐.',
      '힌트 2: 빨간 공 3개, 전체 10개. 3/10이야.',
      '힌트 3: 3/10 = 0.3. 반반(0.5)보다 작으니까 낮아!',
    ],
    otherApproaches: [
      { name: '비교로 생각', desc: '10개 중 3개니까 10명 중 3명이 당첨. 적지? 가능성이 낮아!' }
    ],
  },

  evolution: { prev: undefined, next: 'M072', family: '확률의 발전', familyDescription: '초등 가능성(말로 표현) → 중등 확률(분수로 표현) → 고등 조건부 확률' },
  relatedIds: ['E043'],
},

{
  id: 'E050', number: 50,
  name: '시각과 시간',
  latex: '1\\text{시간} = 60\\text{분}, 1\\text{분} = 60\\text{초}',
  description: '시간은 60진법! 1시간=60분, 1분=60초',
  level: 'elementary', grade: '1~2학년', curriculum: '2022개정',
  category: 'arithmetic',
  tags: ['시각', '시간', '60진법', '2학년'],
  visualType: 'time_clock',

  hook: '수업 1시간=60분, 1분=60초. 시간은 60으로 나뉘어! ⏰',

  principle: `
    <strong>1시간 = 60분</strong><br>
    <strong>1분 = 60초</strong><br><br>
    3시간 45분 = 몇 분일까?<br>
    3시간 = 3 × 60 = 180분<br>
    180 + 45 = <strong style="color:#00ffcc">225분</strong><br><br>
    시간은 10이 아닌 <strong>60</strong>으로 나뉘는 게 특별해!
  `,

  story: `바빌로니아 사람들은 60진법을 사용했어!<br><br>
    60은 2, 3, 4, 5, 6, 10, 12... 으로<br>
    잘 나눠지기 때문이야.<br><br>
    그래서 1시간을 60분,<br>
    1분을 60초로 정한 거야! 🕰️`,

  realLife: [
    { icon: '🏫', title: '수업시간', desc: '수업 40분 + 쉬는 시간 10분 = 50분!' },
    { icon: '🏃', title: '경주 기록', desc: '100m 달리기 기록은 초 단위로 재!' },
    { icon: '📅', title: '하루', desc: '하루 = 24시간 = 1440분 = 86400초!' },
  ],

  sliders: [
    { name: 'hours', label: '시간', min: 0, max: 12, default: 3, step: 1 },
    { name: 'minutes', label: '분', min: 0, max: 59, default: 45, step: 1 },
  ],

  example: {
    question: '3시간 45분은 몇 분인가요?',
    answer: '225분',
    steps: ['1시간 = 60분', '3시간 = 3 × 60 = 180분', '180 + 45 = 225분', '3시간 45분 = 225분!'],
    hints: [
      '힌트 1: 먼저 시간을 분으로 바꿔. 1시간 = 60분.',
      '힌트 2: 3시간 = 3 × 60 = 180분.',
      '힌트 3: 180 + 45 = 225분!',
    ],
    otherApproaches: [
      { name: '하나씩 더하기', desc: '1시간=60분, 2시간=120분, 3시간=180분. 거기에 45분 더하면 225분!' }
    ],
  },

  evolution: { prev: undefined, next: undefined, family: '시간의 발전', familyDescription: '초등 시각과 시간 → 중등 좌표와 시간 그래프 → 고등 미분과 속도' },
  relatedIds: ['E046'],
},

]

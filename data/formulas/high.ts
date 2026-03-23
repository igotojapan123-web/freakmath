import { Formula } from '@/lib/types'

export const HIGH_FORMULAS: Formula[] = [
  // ============================================================
  // 고1 – 공통수학1 (H001~H020)
  // ============================================================
  {
    id: 'H001',
    number: 1,
    name: '다항식의 덧셈과 뺄셈',
    latex: '(2x^2+3x) + (x^2-x) = 3x^2+2x',
    description: '동류항끼리 모아서 계수를 더하거나 빼는 연산',
    level: 'high',
    category: 'algebra',
    tags: ['다항식', '덧셈', '뺄셈', '동류항', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: '복잡해 보이는 다항식도 같은 차수끼리 모으면 깔끔하게 정리돼!',

    principle: `
      다항식의 덧셈과 뺄셈은 <strong>동류항</strong>을 찾는 것에서 시작해.<br><br>
      <strong>동류항이란?</strong><br>
      문자와 차수가 같은 항을 말해. 예를 들어 2x²과 x²은 동류항이지만, 2x²과 3x는 동류항이 아니야.<br><br>
      <strong>연산 방법</strong><br>
      ① 괄호를 풀어 — 뺄셈이면 빼는 다항식 각 항의 부호를 바꿔<br>
      ② 동류항끼리 모아<br>
      ③ 계수끼리 더하거나 빼<br><br>
      예: (2x²+3x) + (x²-x) = (2+1)x² + (3-1)x = 3x²+2x
    `,

    story: `
      다항식의 체계적 연산은 9세기 페르시아 수학자 <strong>알-콰리즈미</strong>의 저서에서 출발해.<br><br>
      그의 책 제목 "알-자브르(al-jabr)"에서 대수학(Algebra)이라는 이름이 유래했어.
      그는 방정식을 풀기 위해 항을 이항하고 동류항을 정리하는 기법을 최초로 정리했지.<br><br>
      오늘날 공학에서 다항식 연산은 신호 처리, 제어 시스템 설계 등에 핵심적으로 쓰여.
    `,

    realLife: [
      { icon: '📡', title: '신호 처리', desc: '오디오 필터에서 다항식 덧셈으로 주파수 응답을 합성한다' },
      { icon: '💰', title: '비용·수익 분석', desc: '총비용 C(x)와 총수익 R(x)의 차이 = 이윤 다항식' },
      { icon: '🏗️', title: '구조 공학', desc: '하중 다항식을 합산해 건물 전체 응력을 계산한다' },
    ],

    sliders: [
      { name: 'a1', label: 'x² 계수 (첫째)', min: -5, max: 5, default: 2, step: 1 },
      { name: 'b1', label: 'x 계수 (첫째)', min: -5, max: 5, default: 3, step: 1 },
      { name: 'a2', label: 'x² 계수 (둘째)', min: -5, max: 5, default: 1, step: 1 },
      { name: 'b2', label: 'x 계수 (둘째)', min: -5, max: 5, default: -1, step: 1 },
    ],

    example: {
      question: '(3x² - 2x + 5) + (-x² + 4x - 3)을 계산하라.',
      answer: '2x² + 2x + 2',
      steps: [
        '괄호를 푼다: 3x² - 2x + 5 - x² + 4x - 3',
        'x² 동류항: 3x² + (-x²) = 2x²',
        'x 동류항: -2x + 4x = 2x',
        '상수항: 5 + (-3) = 2',
        '결과: 2x² + 2x + 2',
      ],
      hints: [
        '힌트 1: 먼저 괄호를 풀고 동류항끼리 모아봐.',
        '힌트 2: x² 항의 계수는 3과 -1이야.',
        '힌트 3: 각 차수별로 계수를 더하면 2, 2, 2가 돼.',
      ],
      otherApproaches: [
        { name: '세로 정렬법', desc: '두 다항식을 같은 차수끼리 세로로 맞춰 놓고 열별로 더하면 실수를 줄일 수 있어.' },
      ],
    },

    evolution: {
      prev: 'M022',
      next: undefined,
      family: '다항식 연산 계보',
      familyDescription: '중등 일차식 연산 → 고등 다항식 사칙연산 → 대학 다항식환',
    },

    visualType: 'poly_add',
    relatedIds: ['H002', 'H003', 'H004'],
  },

  {
    id: 'H002',
    number: 2,
    name: '다항식의 곱셈',
    latex: '(a+b)(c+d) = ac+ad+bc+bd',
    description: '분배법칙을 이용해 각 항끼리 모두 곱하여 전개하는 연산',
    level: 'high',
    category: 'algebra',
    tags: ['다항식', '곱셈', '분배법칙', '전개', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: '두 괄호를 곱할 때 모든 항을 빠짐없이 곱하는 게 핵심이야!',

    principle: `
      다항식의 곱셈은 <strong>분배법칙</strong>의 반복 적용이야.<br><br>
      <strong>기본 원리</strong><br>
      (a+b)(c+d)에서 앞 괄호의 각 항을 뒤 괄호의 모든 항에 곱해:<br>
      a×c + a×d + b×c + b×d = ac + ad + bc + bd<br><br>
      <strong>다항식끼리의 곱셈</strong><br>
      (ax+b)(cx²+dx+e)처럼 항이 많아져도 원리는 동일해.<br>
      각 항 × 각 항을 전부 곱한 뒤 동류항을 정리하면 돼.<br><br>
      곱셈 결과의 최고차항 차수 = 두 다항식 차수의 합이야.
    `,

    story: `
      다항식 곱셈의 체계적 전개는 <strong>뉴턴</strong>과 <strong>라이프니츠</strong> 시대에 본격화됐어.<br><br>
      특히 뉴턴은 이항급수를 통해 (1+x)^n을 무한 다항식으로 전개했는데,
      이것이 미적분학의 토대가 되었지. 다항식 곱셈은 단순한 연산을 넘어
      현대 암호학(RSA 등)에서도 핵심적으로 사용돼.
    `,

    realLife: [
      { icon: '🔐', title: 'RSA 암호', desc: '큰 다항식(정수)의 곱셈과 인수분해 난이도 차이가 암호의 기반이다' },
      { icon: '📊', title: '경제 모델', desc: '수요함수×공급함수의 곱으로 시장 균형 분석' },
      { icon: '🤖', title: 'AI 신경망', desc: '가중치 다항식의 곱셈으로 레이어 간 변환을 표현한다' },
    ],

    sliders: [
      { name: 'a', label: 'a', min: -5, max: 5, default: 2, step: 1 },
      { name: 'b', label: 'b', min: -5, max: 5, default: 3, step: 1 },
      { name: 'c', label: 'c', min: -5, max: 5, default: 1, step: 1 },
      { name: 'd', label: 'd', min: -5, max: 5, default: -2, step: 1 },
    ],

    example: {
      question: '(2x+3)(x-4)를 전개하라.',
      answer: '2x² - 5x - 12',
      steps: [
        '2x × x = 2x²',
        '2x × (-4) = -8x',
        '3 × x = 3x',
        '3 × (-4) = -12',
        '동류항 정리: 2x² + (-8x+3x) - 12 = 2x² - 5x - 12',
      ],
      hints: [
        '힌트 1: 앞 괄호의 각 항을 뒤 괄호의 모든 항에 곱해봐.',
        '힌트 2: 2x×x, 2x×(-4), 3×x, 3×(-4) 네 개를 구해.',
        '힌트 3: x항을 모으면 -8x+3x = -5x야.',
      ],
      otherApproaches: [
        { name: 'FOIL법', desc: 'First-Outer-Inner-Last 순서로 곱하면 빠짐없이 전개할 수 있어.' },
      ],
    },

    evolution: {
      prev: 'M023',
      next: undefined,
      family: '다항식 연산 계보',
      familyDescription: '중등 단항식 곱셈 → 고등 다항식 곱셈 → 대학 다항식환 곱셈',
    },

    visualType: 'poly_mul_h',
    relatedIds: ['H001', 'H003', 'H004'],
  },

  {
    id: 'H003',
    number: 3,
    name: '곱셈공식',
    latex: '(a+b)^2 = a^2+2ab+b^2',
    description: '합의 제곱, 차의 제곱, 합차곱 등 자주 쓰이는 전개 공식',
    level: 'high',
    category: 'algebra',
    tags: ['곱셈공식', '합의제곱', '차의제곱', '합차', '완전제곱식', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: '매번 전개하기 귀찮다면? 곱셈공식을 외워두면 1초 만에 끝나!',

    principle: `
      자주 쓰이는 곱셈 패턴을 공식으로 정리한 거야.<br><br>
      <strong>① 합의 제곱</strong><br>
      (a+b)² = a² + 2ab + b²<br><br>
      <strong>② 차의 제곱</strong><br>
      (a-b)² = a² - 2ab + b²<br><br>
      <strong>③ 합차곱</strong><br>
      (a+b)(a-b) = a² - b²<br><br>
      이 세 공식은 인수분해의 역과정이기도 해. 전개와 인수분해를 자유롭게 오가는 것이 고등 수학의 기본기야.
    `,

    story: `
      곱셈공식의 기하학적 의미는 고대 그리스에서부터 알려져 있었어.<br><br>
      <strong>유클리드</strong>는 <원론>에서 (a+b)² = a²+2ab+b²을 정사각형 넓이의 분할로 증명했지.
      한 변의 길이가 (a+b)인 정사각형을 a², ab, ab, b² 네 조각으로 나누면 딱 맞아.<br><br>
      이 아이디어는 2000년이 지난 지금도 대수학의 출발점이야.
    `,

    realLife: [
      { icon: '🏠', title: '건축 면적 계산', desc: '(10+x)² 형태의 면적 확장 문제를 곱셈공식으로 즉시 계산' },
      { icon: '📈', title: '분산 공식', desc: '통계의 Var(X) = E(X²)-{E(X)}²는 합차곱의 응용이다' },
      { icon: '⚡', title: '전력 공학', desc: '(V₁+V₂)²을 전개해 총 전력을 계산한다' },
    ],

    sliders: [
      { name: 'a', label: 'a 값', min: -10, max: 10, default: 3, step: 1 },
      { name: 'b', label: 'b 값', min: -10, max: 10, default: 2, step: 1 },
    ],

    example: {
      question: '(3x+5)²을 전개하라.',
      answer: '9x² + 30x + 25',
      steps: [
        '(a+b)² = a²+2ab+b² 공식을 적용한다. 여기서 a=3x, b=5',
        'a² = (3x)² = 9x²',
        '2ab = 2×3x×5 = 30x',
        'b² = 5² = 25',
        '결과: 9x² + 30x + 25',
      ],
      hints: [
        '힌트 1: (a+b)² 공식에서 a와 b가 무엇인지 파악해봐.',
        '힌트 2: a=3x, b=5를 대입해.',
        '힌트 3: (3x)²=9x², 2(3x)(5)=30x, 5²=25야.',
      ],
      otherApproaches: [
        { name: '직접 전개', desc: '(3x+5)(3x+5)를 분배법칙으로 하나하나 곱해도 같은 결과가 나와.' },
      ],
    },

    evolution: {
      prev: 'M034',
      next: undefined,
      family: '곱셈공식 계보',
      familyDescription: '중등 곱셈공식 → 고등 고차 곱셈공식 → 대학 이항정리 일반화',
    },

    visualType: 'expand_formula',
    relatedIds: ['H002', 'H004', 'H018'],
  },

  {
    id: 'H004',
    number: 4,
    name: '인수분해 (고등)',
    latex: 'a^2-b^2 = (a+b)(a-b)',
    description: '다항식을 두 개 이상의 인수의 곱으로 분해하는 변환',
    level: 'high',
    category: 'algebra',
    tags: ['인수분해', '합차', '완전제곱식', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: 'x²-9가 (x+3)(x-3)이 되는 마법! 곱셈의 역과정이 인수분해야.',

    principle: `
      인수분해는 곱셈공식의 <strong>역과정</strong>이야.<br><br>
      <strong>주요 공식</strong><br>
      ① a²-b² = (a+b)(a-b)<br>
      ② a²+2ab+b² = (a+b)²<br>
      ③ a²-2ab+b² = (a-b)²<br>
      ④ x²+(a+b)x+ab = (x+a)(x+b)<br>
      ⑤ acx²+(ad+bc)x+bd = (ax+b)(cx+d)<br><br>
      <strong>고등에서 추가되는 공식</strong><br>
      ⑥ a³+b³ = (a+b)(a²-ab+b²)<br>
      ⑦ a³-b³ = (a-b)(a²+ab+b²)<br><br>
      인수분해는 방정식 풀기, 분수식 약분, 극한 계산 등 모든 곳에 쓰여.
    `,

    story: `
      인수분해의 체계화는 16세기 <strong>비에트</strong>에 의해 이루어졌어.<br><br>
      그는 문자를 사용해 미지수와 계수를 표현하는 기호대수학을 확립했고,
      이 덕분에 다항식을 인수로 분해하는 일반 이론이 가능해졌지.<br><br>
      현대에는 컴퓨터 대수 시스템(CAS)이 수백 차 다항식도 자동으로 인수분해해.
    `,

    realLife: [
      { icon: '🔐', title: '암호 해독', desc: '큰 수의 인수분해 난이도가 RSA 암호의 안전성을 보장한다' },
      { icon: '🧬', title: '유전자 분석', desc: '다항식 인수분해로 유전자 서열 패턴을 분류한다' },
      { icon: '📐', title: '설계 최적화', desc: '비용함수를 인수분해해서 최솟값 조건을 빠르게 파악한다' },
    ],

    sliders: [
      { name: 'a', label: 'a 값', min: 1, max: 10, default: 3, step: 1 },
      { name: 'b', label: 'b 값', min: 1, max: 10, default: 2, step: 1 },
    ],

    example: {
      question: 'x² - 6x + 9를 인수분해하라.',
      answer: '(x-3)²',
      steps: [
        'x², -6x, 9의 구조를 파악한다.',
        'x² = (x)², 9 = (3)²이므로 완전제곱식인지 확인',
        '-6x = -2×x×3 = -2ab 형태 확인',
        'a²-2ab+b² = (a-b)² 공식 적용',
        '결과: (x-3)²',
      ],
      hints: [
        '힌트 1: 첫 항과 마지막 항이 완전제곱수인지 확인해봐.',
        '힌트 2: x²=(x)², 9=(3)²이야.',
        '힌트 3: 가운데 항이 -2×x×3 = -6x이니까 (x-3)²야.',
      ],
      otherApproaches: [
        { name: '근의 공식 활용', desc: 'x²-6x+9=0의 근을 구하면 x=3(중근)이므로 (x-3)²로 인수분해된다.' },
      ],
    },

    evolution: {
      prev: 'M038',
      next: undefined,
      family: '인수분해 계보',
      familyDescription: '중등 기본 인수분해 → 고등 고차 인수분해 → 대학 환 위의 인수분해',
    },

    visualType: 'factor_h',
    relatedIds: ['H003', 'H005', 'H006'],
  },

  {
    id: 'H005',
    number: 5,
    name: '나머지 정리',
    latex: 'f(a) = \\text{나머지}',
    description: '다항식 f(x)를 (x-a)로 나눈 나머지는 f(a)와 같다',
    level: 'high',
    category: 'algebra',
    tags: ['나머지정리', '다항식', '나눗셈', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: 'f(x)를 (x-a)로 나눈 나머지는 f(a)야. 나누지 않아도 알 수 있어!',

    principle: `
      <strong>나머지 정리</strong>는 다항식 나눗셈의 핵심 정리야.<br><br>
      다항식 f(x)를 (x-a)로 나누면:<br>
      f(x) = (x-a)·Q(x) + R<br><br>
      여기서 R은 상수(나머지). 양변에 x=a를 대입하면:<br>
      <strong>f(a) = 0·Q(a) + R = R</strong><br><br>
      즉, 나머지 R = f(a)!<br><br>
      긴 나눗셈을 하지 않고도 x=a를 대입하기만 하면 나머지를 바로 구할 수 있어.
    `,

    story: `
      나머지 정리는 중국 수학자 <strong>진구소</strong>(13세기)가 고차 방정식을 풀며 사용한 기법에서 유래해.<br><br>
      서양에서는 <strong>베주</strong>(Bézout)가 18세기에 체계적으로 증명했어.
      이 정리는 조립제법(Horner's method)과 결합하면 고차 다항식의 나머지를 놀라울 정도로 빠르게 구할 수 있지.
    `,

    realLife: [
      { icon: '💻', title: 'CRC 오류 검출', desc: '네트워크 통신에서 다항식 나머지로 데이터 오류를 검출한다' },
      { icon: '📱', title: 'QR코드', desc: 'QR코드의 에러 정정에 다항식 나머지 연산이 사용된다' },
      { icon: '🔧', title: '공학 시뮬레이션', desc: '근사 다항식의 오차를 나머지 정리로 빠르게 평가한다' },
    ],

    sliders: [
      { name: 'a', label: 'a 값 (나누는 수)', min: -5, max: 5, default: 2, step: 1 },
      { name: 'c2', label: 'x² 계수', min: -5, max: 5, default: 1, step: 1 },
      { name: 'c1', label: 'x 계수', min: -5, max: 5, default: -3, step: 1 },
      { name: 'c0', label: '상수항', min: -10, max: 10, default: 5, step: 1 },
    ],

    example: {
      question: 'f(x) = x³ - 2x² + 3x - 1을 (x-2)로 나눈 나머지를 구하라.',
      answer: '5',
      steps: [
        '나머지 정리에 의해 나머지 = f(2)',
        'f(2) = (2)³ - 2(2)² + 3(2) - 1',
        '= 8 - 8 + 6 - 1',
        '= 5',
        '따라서 나머지는 5이다.',
      ],
      hints: [
        '힌트 1: (x-a) 형태에서 a가 무엇인지 파악해봐.',
        '힌트 2: a=2이므로 f(2)를 계산하면 돼.',
        '힌트 3: 2³=8, 2×4=8, 3×2=6을 차례로 계산해.',
      ],
      otherApproaches: [
        { name: '조립제법', desc: 'a=2를 기준으로 계수 [1, -2, 3, -1]에 조립제법을 적용하면 마지막 수가 나머지 5.' },
      ],
    },

    evolution: {
      prev: 'M023',
      next: undefined,
      family: '다항식 나눗셈 계보',
      familyDescription: '중등 다항식 → 고등 나머지정리·인수정리 → 대학 다항식환 이론',
    },

    visualType: 'remainder_theorem',
    relatedIds: ['H006', 'H004', 'H011'],
  },

  {
    id: 'H006',
    number: 6,
    name: '인수 정리',
    latex: 'f(a)=0 \\Leftrightarrow (x-a) \\text{는 인수}',
    description: 'f(a)=0이면 (x-a)가 f(x)의 인수이고, 그 역도 성립한다',
    level: 'high',
    category: 'algebra',
    tags: ['인수정리', '다항식', '인수', '근', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: 'f(a)=0이면 (x-a)로 깔끔하게 나눠떨어져! 고차방정식 풀기의 열쇠야.',

    principle: `
      인수 정리는 <strong>나머지 정리의 특수한 경우</strong>야.<br><br>
      나머지 정리: f(x)를 (x-a)로 나눈 나머지 = f(a)<br><br>
      만약 <strong>f(a) = 0</strong>이면?<br>
      나머지가 0이므로 f(x) = (x-a)·Q(x)로 나누어떨어져.<br>
      즉 (x-a)는 f(x)의 <strong>인수</strong>야.<br><br>
      역으로 (x-a)가 인수이면 f(x) = (x-a)·Q(x)이므로 f(a) = 0.<br><br>
      <strong>활용법</strong>: 상수항의 약수를 차례로 대입해 f(a)=0이 되는 a를 찾으면, 인수 하나를 확보할 수 있어.
    `,

    story: `
      인수 정리는 나머지 정리와 함께 <strong>베주</strong>가 정리했어.<br><br>
      이 정리 덕분에 3차, 4차, 나아가 고차 방정식을 체계적으로 풀 수 있게 됐지.
      <strong>아벨</strong>과 <strong>갈루아</strong>는 여기서 더 나아가 "5차 이상 일반 방정식은
      근의 공식이 존재하지 않는다"는 놀라운 사실을 증명했어.
    `,

    realLife: [
      { icon: '🎯', title: '제어 공학', desc: '시스템 전달함수의 영점(근)을 찾아 안정성을 분석한다' },
      { icon: '📉', title: '경제학', desc: '수익함수의 근 = 손익분기점을 인수정리로 빠르게 찾는다' },
      { icon: '🔬', title: '물리 시뮬레이션', desc: '고차 운동방정식의 근을 인수정리로 순차 분해해 구한다' },
    ],

    sliders: [
      { name: 'a', label: '대입할 값 a', min: -5, max: 5, default: 1, step: 1 },
    ],

    example: {
      question: 'f(x) = x³ - 6x² + 11x - 6을 인수분해하라.',
      answer: '(x-1)(x-2)(x-3)',
      steps: [
        'f(1) = 1-6+11-6 = 0이므로 (x-1)은 인수',
        'x³-6x²+11x-6을 (x-1)로 나누면 x²-5x+6',
        'x²-5x+6 = (x-2)(x-3)',
        '따라서 f(x) = (x-1)(x-2)(x-3)',
      ],
      hints: [
        '힌트 1: 상수항 6의 약수인 ±1, ±2, ±3, ±6을 대입해봐.',
        '힌트 2: f(1)=0이야! (x-1)이 인수.',
        '힌트 3: 조립제법으로 나누면 x²-5x+6이 나와.',
      ],
      otherApproaches: [
        { name: '근과 계수의 관계', desc: '세 근의 합=6, 곱=6이므로 1,2,3을 추측할 수도 있어.' },
      ],
    },

    evolution: {
      prev: 'H005',
      next: undefined,
      family: '다항식 나눗셈 계보',
      familyDescription: '나머지정리 → 인수정리 → 대학 기약다항식 이론',
    },

    visualType: 'factor_theorem',
    relatedIds: ['H005', 'H004', 'H011'],
  },

  {
    id: 'H007',
    number: 7,
    name: '복소수',
    latex: 'a+bi \\; (i^2=-1)',
    description: '실수와 허수를 결합한 수 체계로, i²=-1을 만족하는 허수단위 i를 도입',
    level: 'high',
    category: 'algebra',
    tags: ['복소수', '허수', '허수단위', '실수부', '허수부', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: '제곱해서 -1이 되는 수가 있어? 허수 i가 그 주인공이야!',

    principle: `
      <strong>복소수</strong>는 실수만으로 해결할 수 없는 문제를 풀기 위해 탄생했어.<br><br>
      <strong>허수 단위 i</strong><br>
      i² = -1을 만족하는 새로운 수. 즉 i = √(-1)<br><br>
      <strong>복소수의 표현</strong><br>
      z = a + bi (a: 실수부, b: 허수부)<br><br>
      <strong>사칙연산</strong><br>
      덧셈: (a+bi)+(c+di) = (a+c)+(b+d)i<br>
      곱셈: (a+bi)(c+di) = (ac-bd)+(ad+bc)i<br><br>
      <strong>켤레복소수</strong><br>
      z = a+bi의 켤레 = a-bi, 그리고 z·z̄ = a²+b²
    `,

    story: `
      16세기 이탈리아 수학자 <strong>카르다노</strong>와 <strong>봄벨리</strong>가 3차 방정식을 풀다가
      √(-1)이 등장하는 상황에 부딪혔어.<br><br>
      처음엔 "상상의 수(imaginary)"라며 불편해했지만, <strong>가우스</strong>가 복소평면을 도입하면서
      복소수는 정식 시민권을 얻었지. 오늘날 복소수는 전자공학, 양자역학, 유체역학 등
      자연 현상의 핵심 언어가 되었어.
    `,

    realLife: [
      { icon: '📡', title: '전자공학 (교류회로)', desc: '교류 전압·전류를 복소수로 표현해 위상차를 계산한다' },
      { icon: '⚛️', title: '양자역학', desc: '파동함수 ψ가 복소수값을 가지며, 확률은 |ψ|²로 구한다' },
      { icon: '🎮', title: '컴퓨터 그래픽', desc: '2D 회전을 복소수 곱셈으로 구현한다 (쿼터니언은 3D)' },
    ],

    sliders: [
      { name: 'a', label: '실수부 a', min: -5, max: 5, default: 3, step: 1 },
      { name: 'b', label: '허수부 b', min: -5, max: 5, default: 2, step: 1 },
    ],

    example: {
      question: '(2+3i)(1-i)를 계산하라.',
      answer: '5+i',
      steps: [
        '분배법칙으로 전개: 2(1)+2(-i)+3i(1)+3i(-i)',
        '= 2 - 2i + 3i - 3i²',
        'i² = -1이므로 -3i² = -3(-1) = 3',
        '실수부: 2+3 = 5, 허수부: -2i+3i = i',
        '결과: 5+i',
      ],
      hints: [
        '힌트 1: 분배법칙으로 네 항을 전개해봐.',
        '힌트 2: i² = -1을 잊지 마.',
        '힌트 3: 실수부와 허수부를 각각 모아.',
      ],
      otherApproaches: [
        { name: '복소평면 해석', desc: '두 복소수의 곱은 크기는 곱하고 편각은 더하는 것. |2+3i|·|1-i|와 편각의 합으로도 구할 수 있어.' },
      ],
    },

    evolution: {
      prev: 'M008',
      next: undefined,
      family: '수 체계 확장 계보',
      familyDescription: '자연수 → 정수 → 유리수 → 실수 → 복소수 → 대학 사원수',
    },

    visualType: 'complex_number',
    relatedIds: ['H008', 'H009'],
  },

  {
    id: 'H008',
    number: 8,
    name: '이차방정식의 판별식',
    latex: 'D = b^2 - 4ac',
    description: '이차방정식 ax²+bx+c=0의 근의 종류를 판별하는 식',
    level: 'high',
    category: 'algebra',
    tags: ['판별식', '이차방정식', '근', '실근', '허근', '중근', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: 'D>0이면 두 실근, D=0이면 중근, D<0이면 허근. 풀기 전에 알 수 있어!',

    principle: `
      이차방정식 ax²+bx+c=0의 근의 공식:<br>
      x = (-b ± √(b²-4ac)) / 2a<br><br>
      여기서 <strong>D = b²-4ac</strong>를 <strong>판별식</strong>이라 해.<br><br>
      <strong>① D > 0</strong>: √D가 실수 → 서로 다른 두 실근<br>
      <strong>② D = 0</strong>: √0 = 0 → 중근 (x = -b/2a)<br>
      <strong>③ D < 0</strong>: √D가 허수 → 서로 다른 두 허근 (켤레복소수)<br><br>
      판별식 하나로 방정식을 풀기 전에 근의 성질을 미리 파악할 수 있어.
    `,

    story: `
      판별식의 기원은 고대 바빌로니아까지 거슬러 올라가.<br><br>
      그들은 이차방정식을 기하학적으로 풀었는데, "넓이가 음수"인 경우는 해가 없다고 판단했어.
      <strong>카르다노</strong>(16세기)가 처음으로 D<0인 경우를 다루었고,
      이것이 복소수의 탄생으로 이어졌지. 판별식은 수학사에서 수 체계를 확장한 결정적 계기야.
    `,

    realLife: [
      { icon: '🚀', title: '물리학 (포물선 운동)', desc: '물체가 특정 높이에 도달하는지 판별식으로 사전 확인' },
      { icon: '💹', title: '경제학 (손익분기)', desc: '이윤함수의 판별식으로 이익이 나는 구간이 존재하는지 판단' },
      { icon: '🏗️', title: '구조 안정성', desc: '진동 방정식의 판별식으로 공진 여부를 미리 판단한다' },
    ],

    sliders: [
      { name: 'a', label: 'a (x²의 계수)', min: -5, max: 5, default: 1, step: 1 },
      { name: 'b', label: 'b (x의 계수)', min: -10, max: 10, default: -4, step: 1 },
      { name: 'c', label: 'c (상수항)', min: -10, max: 10, default: 4, step: 1 },
    ],

    example: {
      question: '2x² - 3x + 5 = 0의 근의 종류를 판별하라.',
      answer: '서로 다른 두 허근',
      steps: [
        'a=2, b=-3, c=5를 확인한다.',
        'D = b²-4ac = (-3)²-4(2)(5)',
        '= 9 - 40 = -31',
        'D = -31 < 0',
        'D < 0이므로 서로 다른 두 허근을 가진다.',
      ],
      hints: [
        '힌트 1: a, b, c를 정확히 파악해. a=2, b=-3, c=5야.',
        '힌트 2: D = (-3)² - 4×2×5를 계산해봐.',
        '힌트 3: D = 9-40 = -31 < 0이야.',
      ],
      otherApproaches: [
        { name: '그래프 해석', desc: 'y=2x²-3x+5의 꼭짓점 y좌표가 양수이고 위로 볼록이면 x축과 만나지 않아 → 허근.' },
      ],
    },

    evolution: {
      prev: 'M040',
      next: undefined,
      family: '이차방정식 계보',
      familyDescription: '중등 근의 공식 → 고등 판별식·근과 계수 → 대학 갈루아 이론',
    },

    visualType: 'discriminant',
    relatedIds: ['H007', 'H009', 'H010'],
  },

  {
    id: 'H009',
    number: 9,
    name: '근과 계수의 관계',
    latex: '\\alpha+\\beta=-\\frac{b}{a}, \\; \\alpha\\beta=\\frac{c}{a}',
    description: '이차방정식의 두 근의 합과 곱을 계수로부터 바로 구하는 관계식',
    level: 'high',
    category: 'algebra',
    tags: ['근과계수', '비에타', '이차방정식', '근의합', '근의곱', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: '두 근의 합과 곱을 계수에서 바로 읽어낼 수 있어!',

    principle: `
      이차방정식 ax²+bx+c=0의 두 근을 α, β라 하면:<br><br>
      <strong>ax²+bx+c = a(x-α)(x-β)</strong><br><br>
      우변을 전개하면 a(x²-(α+β)x+αβ)이므로:<br><br>
      <strong>α+β = -b/a</strong> (두 근의 합)<br>
      <strong>αβ = c/a</strong> (두 근의 곱)<br><br>
      이 관계를 <strong>비에타 공식(Vieta's formulas)</strong>이라 해.<br>
      근을 직접 구하지 않아도 합과 곱을 알 수 있어, 대칭식 계산에 매우 강력해.
    `,

    story: `
      프랑스 수학자 <strong>비에트(Vieta)</strong>(1540~1603)가 발견한 공식이야.<br><br>
      그는 방정식의 계수와 근 사이의 관계를 최초로 체계화했어.
      비에트는 암호 해독 전문가이기도 했는데, 스페인의 암호를 해독해
      프랑스 외교에 기여한 것으로도 유명하지.<br><br>
      비에타 공식은 3차, 4차, n차 방정식으로 자연스럽게 일반화돼.
    `,

    realLife: [
      { icon: '📊', title: '통계학', desc: '데이터의 평균과 분산을 근과 계수의 관계로 빠르게 계산' },
      { icon: '🎵', title: '음향 공학', desc: '필터의 주파수 특성을 근의 합과 곱으로 설계한다' },
      { icon: '🤖', title: 'AI 최적화', desc: '이차 손실함수의 최적 파라미터를 근과 계수 관계로 분석' },
    ],

    sliders: [
      { name: 'a', label: 'a', min: 1, max: 5, default: 1, step: 1 },
      { name: 'b', label: 'b', min: -10, max: 10, default: -5, step: 1 },
      { name: 'c', label: 'c', min: -10, max: 10, default: 6, step: 1 },
    ],

    example: {
      question: 'x²-5x+6=0의 두 근의 합과 곱을 구하고, α²+β²의 값을 구하라.',
      answer: 'α+β=5, αβ=6, α²+β²=13',
      steps: [
        'a=1, b=-5, c=6',
        'α+β = -b/a = -(-5)/1 = 5',
        'αβ = c/a = 6/1 = 6',
        'α²+β² = (α+β)²-2αβ = 25-12 = 13',
      ],
      hints: [
        '힌트 1: a=1, b=-5, c=6에서 합과 곱을 바로 읽어봐.',
        '힌트 2: α+β = 5, αβ = 6이야.',
        '힌트 3: α²+β² = (α+β)²-2αβ 공식을 써.',
      ],
      otherApproaches: [
        { name: '직접 풀기', desc: 'x²-5x+6=0을 인수분해하면 (x-2)(x-3)=0, 근은 2,3. 4+9=13으로 확인.' },
      ],
    },

    evolution: {
      prev: 'M040',
      next: undefined,
      family: '이차방정식 계보',
      familyDescription: '중등 이차방정식 → 고등 근과 계수 → 대학 비에타 일반화',
    },

    visualType: 'vieta',
    relatedIds: ['H008', 'H010'],
  },

  {
    id: 'H010',
    number: 10,
    name: '이차함수와 이차방정식',
    latex: 'y=ax^2+bx+c \\text{와 } ax^2+bx+c=0',
    description: '이차함수의 그래프와 x축의 교점이 이차방정식의 근이다',
    level: 'high',
    category: 'function',
    tags: ['이차함수', '이차방정식', '포물선', 'x축교점', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: '포물선이 x축과 만나는 점 = 이차방정식의 근!',

    principle: `
      이차함수 y=ax²+bx+c의 그래프는 <strong>포물선</strong>이야.<br><br>
      이 포물선이 x축(y=0)과 만나는 점의 x좌표가 바로 ax²+bx+c=0의 <strong>근</strong>이지.<br><br>
      <strong>판별식과 그래프의 관계</strong><br>
      D>0: 포물선이 x축과 두 점에서 만남 → 서로 다른 두 실근<br>
      D=0: 포물선이 x축에 접함 → 중근<br>
      D<0: 포물선이 x축과 만나지 않음 → 허근<br><br>
      <strong>꼭짓점</strong>: (-b/2a, -(b²-4ac)/4a)로, 함수의 최대·최소를 결정해.
    `,

    story: `
      이차함수와 포물선의 관계는 <strong>갈릴레오</strong>가 발견했어.<br><br>
      그는 투사체의 궤적이 포물선임을 실험으로 확인하고, 이를 수학적으로 분석했지.
      이후 <strong>데카르트</strong>가 좌표계를 도입하면서 함수의 그래프와 방정식의 해를
      시각적으로 연결하는 해석기하학이 탄생했어. 이것이 현대 수학의 기반이 되었지.
    `,

    realLife: [
      { icon: '🏀', title: '포물선 운동', desc: '농구 슛의 궤적은 이차함수, 골대에 도달하는 조건은 이차방정식' },
      { icon: '🌉', title: '현수교 설계', desc: '케이블이 포물선 형태를 이루며, 최적 설계에 이차함수 활용' },
      { icon: '💡', title: '파라볼라 안테나', desc: '포물선 반사면이 전파를 초점에 모으는 원리' },
    ],

    sliders: [
      { name: 'a', label: 'a (개형)', min: -3, max: 3, default: 1, step: 0.5 },
      { name: 'b', label: 'b', min: -6, max: 6, default: -2, step: 1 },
      { name: 'c', label: 'c', min: -5, max: 5, default: -3, step: 1 },
    ],

    example: {
      question: 'y=x²-4x+3의 그래프와 x축의 교점을 구하라.',
      answer: '(1, 0), (3, 0)',
      steps: [
        'x축과의 교점이므로 y=0: x²-4x+3=0',
        '인수분해: (x-1)(x-3)=0',
        'x=1 또는 x=3',
        '교점: (1,0), (3,0)',
        '확인: D=16-12=4>0이므로 두 교점 존재.',
      ],
      hints: [
        '힌트 1: y=0을 대입해서 이차방정식을 만들어.',
        '힌트 2: x²-4x+3을 인수분해해봐.',
        '힌트 3: 곱이 3, 합이 -4인 두 수는 -1과 -3이야.',
      ],
      otherApproaches: [
        { name: '근의 공식', desc: 'x=(4±√(16-12))/2=(4±2)/2에서 x=1,3.' },
      ],
    },

    evolution: {
      prev: 'M044',
      next: undefined,
      family: '이차함수 계보',
      familyDescription: '중등 이차함수 그래프 → 고등 함수-방정식 연결 → 대학 다변수 함수',
    },

    visualType: 'quad_func_eq',
    relatedIds: ['H008', 'H009', 'H013'],
  },

  {
    id: 'H011',
    number: 11,
    name: '절댓값 함수',
    latex: 'y = |x|',
    description: 'x가 양수이면 그대로, 음수이면 부호를 바꾸어 항상 0 이상의 값을 출력하는 함수',
    level: 'high',
    category: 'function',
    tags: ['절댓값', '함수', '그래프', 'V자', '꺾인그래프', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: 'V자 모양 그래프. x가 음수여도 y는 항상 양수!',

    principle: `
      <strong>절댓값 함수의 정의:</strong><br><br>
      |x| = x (x ≥ 0일 때)<br>
      |x| = -x (x < 0일 때)<br><br>
      <strong>그래프 특징:</strong><br>
      ① 원점에서 꺾이는 <strong>V자 모양</strong><br>
      ② y축 대칭 (짝함수)<br>
      ③ 최솟값 0 (x=0일 때)<br><br>
      <strong>평행이동:</strong><br>
      y = |x-a| + b → 꼭짓점이 (a, b)로 이동<br><br>
      절댓값 함수를 다룰 때는 <strong>경우 분류</strong>가 핵심이야.
      절댓값 안의 식이 0이 되는 지점을 기준으로 구간을 나눠서 생각해!
    `,

    story: `
      절댓값 개념은 19세기 독일 수학자 <strong>바이어슈트라스(Weierstrass)</strong>가 현대적으로 정립했어.<br><br>
      기호 |x|는 <strong>바이어슈트라스</strong>가 처음 도입한 것으로, "x로부터의 거리"를 나타내.
      이 단순한 아이디어가 거리 함수(metric), 노름(norm) 등 현대 해석학의 기초가 되었지.<br><br>
      오늘날 절댓값은 오차 측정, 신호 처리, 최적화 등 거리와 크기를 다루는 모든 분야에서 필수적이야.
    `,

    realLife: [
      { icon: '🌡️', title: '온도 차이', desc: '어제와 오늘의 기온 차이는 절댓값으로 계산한다 (부호 상관없이 크기만)' },
      { icon: '📍', title: '거리 계산', desc: '수직선 위 두 점 사이의 거리 |a-b|는 절댓값으로 표현한다' },
      { icon: '📊', title: '오차 분석', desc: '측정값과 참값의 차이(오차)를 절댓값으로 표현하여 정밀도를 평가한다' },
    ],

    sliders: [
      { name: 'a', label: '수평 이동', min: -5, max: 5, default: 0, step: 0.5 },
      { name: 'b', label: '수직 이동', min: -5, max: 5, default: 0, step: 0.5 },
      { name: 'c', label: '기울기 계수', min: 0.5, max: 3, default: 1, step: 0.5 },
    ],

    example: {
      question: '|2x - 4| = 6을 풀어라.',
      answer: 'x = 5 또는 x = -1',
      steps: [
        '절댓값 정의에 의해 두 경우로 나눈다',
        '경우 1: 2x - 4 = 6 → 2x = 10 → x = 5',
        '경우 2: 2x - 4 = -6 → 2x = -2 → x = -1',
        '확인: |2(5)-4| = |6| = 6 ✓, |2(-1)-4| = |-6| = 6 ✓',
        '답: x = 5 또는 x = -1',
      ],
      hints: [
        '힌트 1: |A| = B이면 A = B 또는 A = -B야.',
        '힌트 2: 2x - 4 = 6과 2x - 4 = -6, 두 방정식을 각각 풀어봐.',
        '힌트 3: 각각 x = 5, x = -1이 나와. 원래 식에 대입해서 확인해봐.',
      ],
      otherApproaches: [
        { name: '그래프 해석', desc: 'y = |2x-4|와 y = 6의 그래프를 그려서 교점의 x좌표를 찾으면 x = -1, 5야.' },
      ],
    },

    evolution: {
      prev: 'M004',
      next: undefined,
      family: '함수 계보',
      familyDescription: '중등 함수의 뜻 → 고등 절댓값 함수 → 대학 노름과 거리 함수',
    },

    visualType: 'abs_function',
    relatedIds: ['M004', 'H014'],
  },

  {
    id: 'H012',
    number: 12,
    name: '시그마 기호',
    latex: '\\sum_{k=1}^{n} a_k = a_1 + a_2 + \\cdots + a_n',
    description: '여러 항의 합을 간결하게 나타내는 시그마(Σ) 기호의 뜻과 사용법',
    level: 'high',
    category: 'sequence',
    tags: ['시그마', '합', '수열', '기호', '축약', '고2', '수학II'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '긴 덧셈을 한 기호로! 시그마는 수학의 축약 언어야',

    principle: `
      <strong>시그마(Σ) 기호란?</strong><br><br>
      Σ는 그리스 문자로 "Sum(합)"의 첫 글자야.<br>
      ∑<sub>k=1</sub><sup>n</sup> a<sub>k</sub> = a₁ + a₂ + a₃ + ⋯ + aₙ<br><br>
      <strong>기본 성질:</strong><br>
      ① ∑(a<sub>k</sub> + b<sub>k</sub>) = ∑a<sub>k</sub> + ∑b<sub>k</sub> (분배)<br>
      ② ∑c·a<sub>k</sub> = c·∑a<sub>k</sub> (상수 배)<br>
      ③ ∑c = cn (상수의 합)<br><br>
      <strong>자주 쓰는 공식:</strong><br>
      ∑k = n(n+1)/2<br>
      ∑k² = n(n+1)(2n+1)/6<br>
      ∑k³ = {n(n+1)/2}²<br><br>
      시그마는 복잡한 합을 <strong>한 줄로 압축</strong>하는 수학의 축약 언어야!
    `,

    story: `
      시그마 기호는 18세기 수학자 <strong>오일러(Euler)</strong>가 자주 사용하면서 보편화되었어.<br><br>
      Σ는 그리스어 알파벳의 S에 해당하며, "Summa(합)"에서 유래했지.
      오일러는 무한급수 연구에서 이 기호를 광범위하게 활용했어.<br><br>
      오늘날 시그마 기호는 통계의 평균·분산 공식, 프로그래밍의 반복문,
      물리학의 파동 합성 등 모든 학문 분야에서 "합"을 표현하는 보편적 기호야.
    `,

    realLife: [
      { icon: '📊', title: '통계 평균', desc: '평균 x̄ = (1/n)∑xᵢ — 데이터의 합을 시그마로 표현한다' },
      { icon: '💻', title: '프로그래밍 반복문', desc: 'for 루프의 수학적 표현이 바로 시그마 기호' },
      { icon: '🏦', title: '금융 포트폴리오', desc: '총 수익률 = ∑(각 자산 비중 × 수익률)로 계산한다' },
    ],

    sliders: [
      { name: 'n', label: '항의 개수 n', min: 1, max: 20, default: 5, step: 1 },
      { name: 'type', label: '수열 유형 (1:k, 2:k², 3:k³)', min: 1, max: 3, default: 1, step: 1 },
    ],

    example: {
      question: '∑(k=1 ~ 10) (2k - 1)을 구하라.',
      answer: '100',
      steps: [
        '∑(k=1 ~ 10) (2k - 1) = 2∑k - ∑1',
        '= 2 × ∑(k=1 ~ 10) k - 10',
        '∑(k=1 ~ 10) k = 10×11/2 = 55',
        '= 2 × 55 - 10 = 110 - 10 = 100',
        '검산: 1+3+5+7+9+11+13+15+17+19 = 100 ✓',
      ],
      hints: [
        '힌트 1: 시그마의 분배 법칙을 써서 2∑k - ∑1로 나눠봐.',
        '힌트 2: ∑(k=1~n) k = n(n+1)/2를 사용해. n=10이면?',
        '힌트 3: 2×55 - 10 = 100이야. 이건 사실 1부터 19까지 홀수의 합!',
      ],
      otherApproaches: [
        { name: '홀수 합 공식', desc: '1부터 n번째 홀수까지의 합 = n². 10번째 홀수까지의 합 = 10² = 100' },
      ],
    },

    evolution: {
      prev: 'H026',
      next: undefined,
      family: '수열과 급수 계보',
      familyDescription: '중등 규칙 찾기 → 고등 수열·시그마 → 대학 급수·해석학',
    },

    visualType: 'sigma_notation',
    relatedIds: ['H026', 'H027', 'H054'],
  },

  {
    id: 'H013',
    number: 13,
    name: '여러 가지 부등식',
    latex: 'ax^2+bx+c > 0',
    description: '이차부등식과 연립부등식의 해를 구하는 방법',
    level: 'high',
    category: 'algebra',
    tags: ['이차부등식', '부등식', '해의범위', '부등식영역', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: 'y=ax²+bx+c의 그래프가 x축 위에 있는 구간이 바로 부등식의 해!',

    principle: `
      이차부등식은 <strong>그래프</strong>로 해결하는 것이 핵심이야.<br><br>
      <strong>풀이 순서</strong><br>
      ① ax²+bx+c=0의 근 α, β를 구한다 (α≤β)<br>
      ② y=ax²+bx+c의 그래프를 그린다<br>
      ③ 부등식의 부호에 따라 해를 읽는다<br><br>
      <strong>a>0일 때</strong><br>
      ax²+bx+c > 0 → x < α 또는 x > β<br>
      ax²+bx+c < 0 → α < x < β<br><br>
      판별식 D<0이면 그래프가 x축과 만나지 않아. a>0이면 항상 양수, a<0이면 항상 음수야.
    `,

    story: `
      부등식의 체계적 이론은 19세기 <strong>체비셰프</strong>와 <strong>코시</strong>에 의해 발전했어.<br><br>
      특히 코시-슈바르츠 부등식은 수학 전 분야에 걸쳐 가장 자주 쓰이는 부등식 중 하나야.
      이차부등식은 최적화 이론, 선형계획법, 게임 이론 등 현대 수학의 응용 분야에서 핵심적으로 사용돼.
    `,

    realLife: [
      { icon: '💰', title: '이윤 최적화', desc: '이윤함수가 양수인 생산량 범위를 이차부등식으로 결정' },
      { icon: '🚗', title: '제동 거리', desc: '안전 거리 조건을 이차부등식으로 설정해 속도 제한 결정' },
      { icon: '📡', title: '신호 품질', desc: 'SNR(신호 대 잡음비) 조건을 부등식으로 표현해 최적 전력 결정' },
    ],

    sliders: [
      { name: 'a', label: 'a', min: -3, max: 3, default: 1, step: 0.5 },
      { name: 'b', label: 'b', min: -6, max: 6, default: -2, step: 1 },
      { name: 'c', label: 'c', min: -5, max: 5, default: -3, step: 1 },
    ],

    example: {
      question: 'x²-5x+6 < 0을 풀어라.',
      answer: '2 < x < 3',
      steps: [
        'x²-5x+6=0을 인수분해: (x-2)(x-3)=0',
        '근: x=2, x=3',
        'a=1>0이므로 아래로 볼록(위로 열림) 포물선',
        '부등식이 <0이므로 포물선이 x축 아래인 구간',
        '해: 2 < x < 3',
      ],
      hints: [
        '힌트 1: 먼저 x²-5x+6=0의 근을 구해봐.',
        '힌트 2: (x-2)(x-3)=0이니까 근은 2와 3이야.',
        '힌트 3: 포물선이 x축 아래인 구간이 답이야.',
      ],
      otherApproaches: [
        { name: '부호 분석', desc: '수직선에 근 2, 3을 표시하고, 각 구간에서 (x-2)(x-3)의 부호를 조사해.' },
      ],
    },

    evolution: {
      prev: 'M024',
      next: undefined,
      family: '부등식 계보',
      familyDescription: '중등 일차부등식 → 고등 이차부등식 → 대학 최적화 이론',
    },

    visualType: 'quad_inequality',
    relatedIds: ['H010', 'H014'],
  },

  {
    id: 'H014',
    number: 14,
    name: '절댓값 부등식',
    latex: '|x-a| < b \\Leftrightarrow a-b < x < a+b',
    description: '절댓값을 포함한 부등식의 해를 구간으로 표현하는 방법 (절댓값을 포함한 일차부등식만 해당)',
    level: 'high',
    category: 'algebra',
    tags: ['절댓값', '부등식', '구간', '거리', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: '|x-3|<2는 "x에서 3까지의 거리가 2 미만"이라는 뜻이야!',

    principle: `
      절댓값 부등식은 <strong>거리 개념</strong>으로 이해하면 직관적이야.<br><br>
      <strong>핵심 공식</strong><br>
      |x-a| < b (b>0) ⟺ a-b < x < a+b<br>
      |x-a| > b (b>0) ⟺ x < a-b 또는 x > a+b<br><br>
      <strong>의미</strong><br>
      |x-a| < b: "수직선에서 x가 a로부터 거리 b 이내"<br>
      |x-a| > b: "수직선에서 x가 a로부터 거리 b 초과"<br><br>
      절댓값 안이 복잡하면 <strong>경우 분류</strong>를 해:<br>
      x-a ≥ 0일 때와 x-a < 0일 때로 나눠서 풀어.
    `,

    story: `
      절댓값 개념은 <strong>바이어슈트라스</strong>가 실수의 엄밀한 이론을 구축하면서 정교해졌어.<br><br>
      그가 도입한 ε-δ 논법에서 |f(x)-L| < ε은 "f(x)가 L과의 거리가 ε 미만"이라는
      뜻으로, 극한의 엄밀한 정의에 쓰여. 절댓값 부등식은 해석학의 출발점이야.
    `,

    realLife: [
      { icon: '🏭', title: '품질 관리', desc: '제품 규격: |실제치수-기준치| < 허용오차로 합격 판정' },
      { icon: '🌡️', title: '온도 제어', desc: '|현재온도-설정온도| < 2°C면 정상 범위' },
      { icon: '🤖', title: 'AI 오차 범위', desc: '예측값과 실제값의 차이가 허용 범위 이내인지 판단' },
    ],

    sliders: [
      { name: 'a', label: '중심 a', min: -10, max: 10, default: 3, step: 1 },
      { name: 'b', label: '반경 b', min: 0, max: 10, default: 2, step: 0.5 },
    ],

    example: {
      question: '|2x-1| ≤ 5를 풀어라.',
      answer: '-2 ≤ x ≤ 3',
      steps: [
        '|2x-1| ≤ 5에서 절댓값 풀기: -5 ≤ 2x-1 ≤ 5',
        '각 변에 1을 더한다: -4 ≤ 2x ≤ 6',
        '각 변을 2로 나눈다: -2 ≤ x ≤ 3',
      ],
      hints: [
        '힌트 1: |A| ≤ b이면 -b ≤ A ≤ b야.',
        '힌트 2: A=2x-1이니까 -5 ≤ 2x-1 ≤ 5.',
        '힌트 3: 양변에 1을 더하고 2로 나눠.',
      ],
      otherApproaches: [
        { name: '경우 분류', desc: '2x-1≥0일 때 2x-1≤5, 2x-1<0일 때 -(2x-1)≤5로 나눠 풀어도 같은 결과.' },
      ],
    },

    evolution: {
      prev: 'M004',
      next: undefined,
      family: '부등식 계보',
      familyDescription: '중등 절댓값 → 고등 절댓값 부등식 → 대학 거리공간 부등식',
    },

    visualType: 'abs_inequality',
    relatedIds: ['H013'],
  },

  {
    id: 'H015',
    number: 15,
    name: '경우의 수 (합의 법칙·곱의 법칙)',
    latex: '\\text{합의 법칙}: m+n, \\; \\text{곱의 법칙}: m \\times n',
    description: '두 사건이 동시에 일어나지 않으면 합, 연달아 일어나면 곱으로 경우의 수를 구한다',
    level: 'high',
    category: 'probability',
    tags: ['경우의수', '합의법칙', '곱의법칙', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: '"또는"이면 더하고, "그리고"이면 곱한다! 경우의 수의 기본 원리야.',

    principle: `
      <strong>합의 법칙</strong><br>
      사건 A 또는 B가 일어나는 경우의 수 (A, B 동시 불가)<br>
      = m + n (A의 경우의 수 m, B의 경우의 수 n)<br><br>
      <strong>곱의 법칙</strong><br>
      사건 A가 일어난 후 B가 일어나는 경우의 수<br>
      = m × n<br><br>
      <strong>핵심 포인트</strong><br>
      "또는(or)"이 나오면 합의 법칙, "그리고(and)"나 "연달아"가 나오면 곱의 법칙을 적용해.
    `,

    story: `
      경우의 수 이론은 17세기 <strong>파스칼</strong>과 <strong>페르마</strong>의 서신에서 시작됐어.<br><br>
      도박사 드 메레의 질문 — "주사위 게임에서 판돈을 어떻게 나눠야 공정한가?" —
      이 질문이 확률론의 탄생으로 이어졌지. 합의 법칙과 곱의 법칙은
      모든 확률 계산의 기초가 되는 가장 중요한 원리야.
    `,

    realLife: [
      { icon: '🔒', title: '비밀번호 보안', desc: '4자리 비밀번호의 경우의 수 = 10⁴ = 10000가지 (곱의 법칙)' },
      { icon: '🍽️', title: '메뉴 조합', desc: '메인 5종+음료 3종 = 15가지 식사 조합 (곱의 법칙)' },
      { icon: '🧬', title: 'DNA 서열', desc: '4종 염기가 n자리 배열 → 4ⁿ가지 (곱의 법칙)' },
    ],

    sliders: [
      { name: 'm', label: '사건 A 경우의 수', min: 1, max: 10, default: 3, step: 1 },
      { name: 'n', label: '사건 B 경우의 수', min: 1, max: 10, default: 4, step: 1 },
    ],

    example: {
      question: '서울에서 대전까지 기차 3편, 버스 2편이 있고, 대전에서 부산까지 기차 2편, 버스 4편이 있을 때, 서울에서 부산까지 가는 방법의 수를 구하라.',
      answer: '30가지',
      steps: [
        '서울→대전: 기차 3 + 버스 2 = 5가지 (합의 법칙)',
        '대전→부산: 기차 2 + 버스 4 = 6가지 (합의 법칙)',
        '서울→대전→부산: 5 × 6 = 30가지 (곱의 법칙)',
      ],
      hints: [
        '힌트 1: 서울→대전의 방법 수를 먼저 구해봐.',
        '힌트 2: 기차 또는 버스이므로 합의 법칙: 3+2=5.',
        '힌트 3: 서울→대전과 대전→부산은 연달아 일어나므로 곱의 법칙.',
      ],
      otherApproaches: [
        { name: '수형도', desc: '모든 경우를 나뭇가지 그림으로 그려서 하나하나 세어도 30가지가 나와.' },
      ],
    },

    evolution: {
      prev: 'M071',
      next: undefined,
      family: '경우의 수 계보',
      familyDescription: '중등 경우의 수 → 고등 순열·조합 → 대학 조합론',
    },

    visualType: 'counting_h',
    relatedIds: ['H016', 'H017'],
  },

  {
    id: 'H016',
    number: 16,
    name: '순열',
    latex: '_nP_r = \\frac{n!}{(n-r)!}',
    description: 'n개에서 r개를 뽑아 순서대로 나열하는 경우의 수',
    level: 'high',
    category: 'probability',
    tags: ['순열', 'nPr', '팩토리얼', '나열', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: '5명 중 3명을 줄 세우는 방법? 5x4x3=60가지!',

    principle: `
      <strong>순열(Permutation)</strong>은 순서가 있는 선택이야.<br><br>
      n개에서 r개를 뽑아 <strong>줄 세우는</strong> 경우의 수:<br>
      <strong>ₙPᵣ = n!/(n-r)!</strong><br><br>
      <strong>계산 원리</strong><br>
      첫 번째 자리: n가지 선택<br>
      두 번째 자리: (n-1)가지 선택<br>
      ...<br>
      r번째 자리: (n-r+1)가지 선택<br>
      → n × (n-1) × ... × (n-r+1)<br><br>
      <strong>특수한 경우</strong><br>
      ₙPₙ = n! (모두 나열), ₙP₁ = n, ₙP₀ = 1
    `,

    story: `
      순열 이론은 인도 수학자 <strong>마하비라</strong>(9세기)가 최초로 기술했어.<br><br>
      유럽에서는 <strong>라이프니츠</strong>가 조합론을 체계화하며 순열 공식을 정립했지.
      현대에는 순열이 암호학, 유전체학, 스케줄링 알고리즘 등에서 핵심적으로 쓰여.
    `,

    realLife: [
      { icon: '🏅', title: '대회 순위', desc: '10명 중 금·은·동 메달 수여: ₁₀P₃ = 720가지' },
      { icon: '🔐', title: '자물쇠 비밀번호', desc: '순서가 중요한 4자리 비밀번호의 경우의 수' },
      { icon: '📅', title: '일정 배치', desc: '5개 업무를 3개 시간대에 배치: ₅P₃ = 60가지' },
    ],

    sliders: [
      { name: 'n', label: 'n (전체)', min: 1, max: 10, default: 5, step: 1 },
      { name: 'r', label: 'r (선택)', min: 0, max: 10, default: 3, step: 1 },
    ],

    example: {
      question: '7명의 후보 중 회장, 부회장, 총무를 뽑는 경우의 수를 구하라.',
      answer: '210가지',
      steps: [
        '7명 중 3명을 뽑아 직책(순서)에 배정 → 순열',
        '₇P₃ = 7!/(7-3)! = 7!/4!',
        '= 7 × 6 × 5 = 210',
      ],
      hints: [
        '힌트 1: 회장·부회장·총무는 서로 다른 역할이므로 순서가 있어.',
        '힌트 2: 순열 공식 ₇P₃을 적용해.',
        '힌트 3: 7×6×5를 계산해봐.',
      ],
      otherApproaches: [
        { name: '곱의 법칙', desc: '회장 7가지 × 부회장 6가지 × 총무 5가지 = 210.' },
      ],
    },

    evolution: {
      prev: 'H015',
      next: undefined,
      family: '경우의 수 계보',
      familyDescription: '경우의 수 → 순열 → 조합 → 이항정리',
    },

    visualType: 'permutation',
    relatedIds: ['H015', 'H017', 'H018'],
  },

  {
    id: 'H017',
    number: 17,
    name: '조합',
    latex: '_nC_r = \\frac{n!}{r!(n-r)!}',
    description: 'n개에서 r개를 순서 없이 뽑는 경우의 수',
    level: 'high',
    category: 'probability',
    tags: ['조합', 'nCr', '이항계수', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: '순서 없이 고르기. 5명 중 3명 뽑기 = 10가지!',

    principle: `
      <strong>조합(Combination)</strong>은 순서가 없는 선택이야.<br><br>
      n개에서 r개를 <strong>순서 상관없이 뽑는</strong> 경우의 수:<br>
      <strong>ₙCᵣ = n! / (r!(n-r)!)</strong><br><br>
      <strong>순열과의 관계</strong><br>
      ₙCᵣ = ₙPᵣ / r!<br>
      (순열에서 순서 중복을 나눠 제거)<br><br>
      <strong>성질</strong><br>
      ₙCᵣ = ₙCₙ₋ᵣ (대칭성)<br>
      ₙC₀ = ₙCₙ = 1<br>
      ₙCᵣ = ₙ₋₁Cᵣ₋₁ + ₙ₋₁Cᵣ (파스칼 항등식)
    `,

    story: `
      조합 이론의 체계화는 <strong>파스칼</strong>의 삼각형에서 꽃피었어.<br><br>
      파스칼의 삼각형에서 n번째 줄의 r번째 수가 바로 ₙCᵣ이야. 사실 이 삼각형은
      그보다 500년 앞서 중국의 <strong>양휘</strong>가 발견했고, 페르시아의 <strong>하이얌</strong>도 알고 있었지.
      조합론은 현대 이산수학, 코딩 이론, 네트워크 설계의 기초야.
    `,

    realLife: [
      { icon: '🎰', title: '로또', desc: '45개 중 6개를 뽑는 경우: ₄₅C₆ = 8,145,060가지' },
      { icon: '🧪', title: '실험 설계', desc: '10개 변수 중 3개를 선택하는 실험 조합 설계' },
      { icon: '🤝', title: '팀 구성', desc: '20명 중 5명 위원회: ₂₀C₅ = 15,504가지' },
    ],

    sliders: [
      { name: 'n', label: 'n (전체)', min: 1, max: 15, default: 5, step: 1 },
      { name: 'r', label: 'r (선택)', min: 0, max: 15, default: 3, step: 1 },
    ],

    example: {
      question: '10명의 학생 중 4명을 뽑아 청소 당번을 정하는 경우의 수를 구하라.',
      answer: '210가지',
      steps: [
        '순서 없이 4명을 뽑으므로 조합',
        '₁₀C₄ = 10!/(4!×6!)',
        '= (10×9×8×7)/(4×3×2×1)',
        '= 5040/24 = 210',
      ],
      hints: [
        '힌트 1: 청소 당번은 역할 구분이 없으므로 조합이야.',
        '힌트 2: ₁₀C₄를 계산해봐.',
        '힌트 3: 분자 10×9×8×7, 분모 4!=24.',
      ],
      otherApproaches: [
        { name: '대칭성 활용', desc: '₁₀C₄ = ₁₀C₆이므로 6명을 빼는 것으로 생각해도 같은 결과.' },
      ],
    },

    evolution: {
      prev: 'H016',
      next: undefined,
      family: '경우의 수 계보',
      familyDescription: '순열 → 조합 → 이항정리 → 대학 조합론',
    },

    visualType: 'combination',
    relatedIds: ['H016', 'H018'],
  },

  {
    id: 'H018',
    number: 18,
    name: '이항정리',
    latex: '(a+b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k}b^k',
    description: '(a+b)^n을 이항계수를 이용해 전개하는 정리',
    level: 'high',
    category: 'algebra',
    tags: ['이항정리', '이항계수', '파스칼삼각형', '전개', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '(a+b)^10을 전개하려면? 이항정리면 계수를 바로 구할 수 있어!',

    principle: `
      <strong>이항정리</strong>는 (a+b)ⁿ의 일반항을 공식으로 표현한 거야.<br><br>
      <strong>(a+b)ⁿ = Σₖ₌₀ⁿ ₙCₖ · aⁿ⁻ᵏ · bᵏ</strong><br><br>
      <strong>일반항 (r+1번째 항)</strong><br>
      Tᵣ₊₁ = ₙCᵣ · aⁿ⁻ʳ · bʳ<br><br>
      <strong>성질</strong><br>
      ① 전개하면 (n+1)개 항이 나와<br>
      ② 계수의 합: (1+1)ⁿ = 2ⁿ<br>
      ③ 교대 합: (1-1)ⁿ = 0<br>
      ④ 계수는 파스칼의 삼각형과 일치<br><br>
      이항정리는 확률분포(이항분포), 근사 계산 등에 광범위하게 쓰여.
    `,

    story: `
      이항정리는 <strong>뉴턴</strong>이 일반화한 것으로 유명해.<br><br>
      정수 거듭제곱의 이항정리는 이미 파스칼, 양휘 등이 알고 있었지만,
      뉴턴은 이를 유리수·음수 지수까지 확장해 (1+x)^(1/2) 같은 무한급수를 얻었어.
      이것이 미적분학 발전의 핵심 도구가 되었지.
    `,

    realLife: [
      { icon: '📊', title: '이항분포', desc: '시행 횟수 n, 성공률 p일 때 P(X=k) = ₙCₖ pᵏ(1-p)ⁿ⁻ᵏ' },
      { icon: '💹', title: '옵션 가격', desc: '이항 모형으로 금융 파생상품 가격을 계산한다' },
      { icon: '🔬', title: '근사 계산', desc: '(1+x)ⁿ ≈ 1+nx (x가 작을 때) 근사에 활용' },
    ],

    sliders: [
      { name: 'n', label: '거듭제곱 n', min: 1, max: 10, default: 4, step: 1 },
      { name: 'a', label: 'a', min: -3, max: 3, default: 1, step: 1 },
      { name: 'b', label: 'b', min: -3, max: 3, default: 1, step: 1 },
    ],

    example: {
      question: '(x+2)⁵의 전개에서 x³항의 계수를 구하라.',
      answer: '40',
      steps: [
        '일반항: ₅Cᵣ · x⁵⁻ʳ · 2ʳ',
        'x³항이므로 5-r=3 → r=2',
        '₅C₂ · x³ · 2² = 10 × x³ × 4 = 40x³',
        'x³항의 계수는 40이다.',
      ],
      hints: [
        '힌트 1: 일반항에서 x의 지수가 3이 되려면 r이 얼마여야 할까?',
        '힌트 2: 5-r=3이니까 r=2야.',
        '힌트 3: ₅C₂ = 10이고 2²=4니까 계수는 40이야.',
      ],
      otherApproaches: [
        { name: '파스칼 삼각형', desc: '5번째 줄 1,5,10,10,5,1에서 세 번째 수 10에 2²=4를 곱하면 40.' },
      ],
    },

    evolution: {
      prev: 'H017',
      next: undefined,
      family: '조합론 계보',
      familyDescription: '조합 → 이항정리 → 대학 생성함수론',
    },

    visualType: 'binomial_theorem',
    relatedIds: ['H003', 'H017'],
  },

  {
    id: 'H019',
    number: 19,
    name: '집합의 연산',
    latex: 'A \\cup B, \\; A \\cap B, \\; A^c',
    description: '합집합, 교집합, 여집합 등 집합 사이의 연산과 법칙',
    level: 'high',
    category: 'algebra',
    tags: ['집합', '합집합', '교집합', '여집합', '드모르간', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: '집합의 합·교·여 연산은 논리학과 데이터베이스의 기초야!',

    principle: `
      <strong>집합 연산</strong>은 원소의 포함 관계를 다루는 기본 도구야.<br><br>
      <strong>합집합</strong>: A∪B = {x | x∈A 또는 x∈B}<br>
      <strong>교집합</strong>: A∩B = {x | x∈A 그리고 x∈B}<br>
      <strong>여집합</strong>: Aᶜ = {x | x∈U, x∉A}<br>
      <strong>차집합</strong>: A-B = {x | x∈A, x∉B} = A∩Bᶜ<br><br>
      <strong>드모르간 법칙</strong><br>
      (A∪B)ᶜ = Aᶜ∩Bᶜ<br>
      (A∩B)ᶜ = Aᶜ∪Bᶜ<br><br>
      <strong>원소의 개수</strong><br>
      n(A∪B) = n(A)+n(B)-n(A∩B)
    `,

    story: `
      집합론의 창시자는 <strong>칸토어</strong>(1845~1918)야.<br><br>
      그는 무한집합의 크기를 비교하며 "무한에도 크기가 다른 것이 있다"는 충격적인 사실을
      증명했어. 자연수의 개수와 실수의 개수가 다르다는 대각선 논법은 수학사에서
      가장 아름다운 증명 중 하나야. 집합론은 현대 수학의 기초 언어가 되었지.
    `,

    realLife: [
      { icon: '🗄️', title: '데이터베이스', desc: 'SQL의 UNION, INTERSECT, EXCEPT가 집합 연산의 구현' },
      { icon: '🔍', title: '검색 엔진', desc: '"A AND B", "A OR B" 검색이 교집합·합집합 연산' },
      { icon: '🧬', title: '유전체 분석', desc: '두 실험 결과의 공통 유전자(교집합) 분석에 사용' },
    ],

    sliders: [
      { name: 'nA', label: 'n(A)', min: 0, max: 20, default: 10, step: 1 },
      { name: 'nB', label: 'n(B)', min: 0, max: 20, default: 8, step: 1 },
      { name: 'nAB', label: 'n(A∩B)', min: 0, max: 10, default: 3, step: 1 },
    ],

    example: {
      question: '전체 학생 40명 중 수학 좋아하는 학생 25명, 과학 좋아하는 학생 20명, 둘 다 좋아하는 학생 10명일 때, 둘 다 좋아하지 않는 학생 수를 구하라.',
      answer: '5명',
      steps: [
        'n(A∪B) = n(A)+n(B)-n(A∩B)',
        '= 25+20-10 = 35',
        '둘 다 좋아하지 않는 학생 = 전체 - n(A∪B)',
        '= 40-35 = 5명',
      ],
      hints: [
        '힌트 1: 합집합의 원소 개수 공식을 써봐.',
        '힌트 2: n(A∪B) = 25+20-10 = 35명.',
        '힌트 3: 전체 40명에서 35명을 빼면 답이야.',
      ],
      otherApproaches: [
        { name: '벤 다이어그램', desc: '두 원이 겹치는 벤 다이어그램을 그려서 각 영역에 인원수를 채워봐.' },
      ],
    },

    evolution: {
      prev: 'M003',
      next: undefined,
      family: '집합·논리 계보',
      familyDescription: '중등 집합 → 고등 집합 연산·명제 → 대학 수리논리학',
    },

    visualType: 'set_operation',
    relatedIds: ['H020'],
  },

  {
    id: 'H020',
    number: 20,
    name: '명제와 조건',
    latex: 'p \\Rightarrow q',
    description: '명제의 참·거짓 판별, 역·이·대우의 관계, 충분·필요조건',
    level: 'high',
    category: 'algebra',
    tags: ['명제', '조건', '역', '이', '대우', '충분조건', '필요조건', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: '"p이면 q이다"의 참·거짓, 역·이·대우를 판단해!',

    principle: `
      <strong>명제</strong>: 참 또는 거짓을 명확히 판별할 수 있는 문장<br><br>
      <strong>조건문 p → q</strong><br>
      "p이면 q이다"에서 p는 가정(조건), q는 결론<br><br>
      <strong>역·이·대우</strong><br>
      원래: p → q<br>
      역: q → p<br>
      이: ~p → ~q<br>
      대우: ~q → ~p<br><br>
      <strong>핵심</strong>: 원래 명제와 대우는 항상 진리값이 같아!<br><br>
      <strong>충분·필요조건</strong><br>
      p → q 참이면: p는 q의 충분조건, q는 p의 필요조건
    `,

    story: `
      명제 논리는 고대 그리스 <strong>아리스토텔레스</strong>의 삼단논법에서 시작됐어.<br><br>
      19세기 <strong>불</strong>이 기호논리학을 창시하고, <strong>프레게</strong>가 술어논리학으로 확장했지.
      이 체계는 현대 컴퓨터의 기초가 되었어 — 프로그래밍의 if-then 문이 바로 명제 논리의 구현이야.
    `,

    realLife: [
      { icon: '💻', title: '프로그래밍', desc: 'if(조건) then(실행)이 명제 논리의 직접적 구현' },
      { icon: '⚖️', title: '법률 논리', desc: '"범죄이면 처벌한다"의 대우: "처벌받지 않으면 범죄 아니다"' },
      { icon: '🤖', title: 'AI 추론', desc: '지식 그래프에서 명제 논리로 새로운 사실을 추론한다' },
    ],

    sliders: undefined,

    example: {
      question: '"x=2이면 x²=4이다"의 역, 이, 대우를 쓰고 각각의 참·거짓을 판별하라.',
      answer: '역: 거짓, 이: 거짓, 대우: 참',
      steps: [
        '원래: x=2 → x²=4 (참)',
        '역: x²=4 → x=2 (거짓, x=-2도 가능)',
        '이: x≠2 → x²≠4 (거짓, x=-2이면 x²=4)',
        '대우: x²≠4 → x≠2 (참, 원래 명제가 참이므로 대우도 참)',
      ],
      hints: [
        '힌트 1: 역은 가정과 결론을 뒤바꾼 거야.',
        '힌트 2: x²=4이면 x=±2이므로 역은 거짓.',
        '힌트 3: 원래 명제가 참이면 대우도 반드시 참이야.',
      ],
      otherApproaches: [
        { name: '집합으로 해석', desc: 'p의 진리집합 ⊂ q의 진리집합이면 p→q 참. {2}⊂{-2,2}이므로 원래 참, 역은 거짓.' },
      ],
    },

    evolution: {
      prev: 'H019',
      next: undefined,
      family: '집합·논리 계보',
      familyDescription: '집합 연산 → 명제·조건 → 대학 수리논리학·증명론',
    },

    visualType: 'proposition',
    relatedIds: ['H019'],
  },

  // ============================================================
  // 고2 – 공통수학2 (H021~H040)
  // ============================================================
  {
    id: 'H021',
    number: 21,
    name: '함수의 뜻과 종류',
    latex: 'f: X \\rightarrow Y',
    description: '정의역의 각 원소에 공역의 원소가 하나씩 대응하는 관계',
    level: 'high',
    category: 'function',
    tags: ['함수', '정의역', '공역', '치역', '일대일', '항등', '상수', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '모든 입력에 딱 하나의 출력! 그것이 함수의 본질이야.',

    principle: `
      <strong>함수</strong>란 정의역 X의 각 원소 x에 공역 Y의 원소 y를 <strong>하나씩</strong> 대응시키는 관계야.<br><br>
      <strong>용어 정리</strong><br>
      정의역: 입력의 집합 X<br>
      공역: 출력이 될 수 있는 집합 Y<br>
      치역: 실제 출력값의 집합 (공역의 부분집합)<br><br>
      <strong>종류</strong><br>
      일대일함수: 다른 입력 → 다른 출력<br>
      항등함수: f(x)=x<br>
      상수함수: f(x)=c (모든 x에 대해)<br>
      대응(전단사): 일대일 + 치역=공역
    `,

    story: `
      함수 개념은 <strong>라이프니츠</strong>가 1694년 처음 사용했고,
      <strong>디리클레</strong>가 1837년 현대적 정의를 확립했어.<br><br>
      "y가 x의 함수"라는 표현은 <strong>오일러</strong>가 대중화했지.
      함수 개념의 정교화는 집합론과 만나며 20세기 수학의 통일 언어가 되었어.
    `,

    realLife: [
      { icon: '📱', title: '앱 입출력', desc: '사용자 입력(터치)에 대해 하나의 결과(화면 변화)를 반환' },
      { icon: '🏧', title: 'ATM', desc: '계좌번호(입력)에 잔액(출력)이 유일하게 대응' },
      { icon: '🧬', title: 'DNA→단백질', desc: '코돈(3염기) → 아미노산 대응이 함수 관계' },
    ],

    sliders: undefined,

    example: {
      question: 'X={1,2,3}, Y={a,b,c}에서 f(1)=a, f(2)=b, f(3)=b일 때, f가 일대일함수인지 판별하라.',
      answer: '일대일함수가 아니다',
      steps: [
        'f(2)=b, f(3)=b로 서로 다른 원소 2,3이 같은 값 b에 대응',
        '일대일함수의 조건: x₁≠x₂이면 f(x₁)≠f(x₂)',
        '2≠3인데 f(2)=f(3)=b이므로 조건 위반',
        '따라서 일대일함수가 아니다.',
      ],
      hints: [
        '힌트 1: 서로 다른 입력이 같은 출력에 대응하는지 확인해.',
        '힌트 2: f(2)와 f(3)을 비교해봐.',
        '힌트 3: 둘 다 b이니까 일대일이 아니야.',
      ],
      otherApproaches: [
        { name: '화살표 그림', desc: 'X에서 Y로 화살표를 그려보면 b에 화살 2개가 도착 → 일대일 아님.' },
      ],
    },

    evolution: {
      prev: 'M028',
      next: undefined,
      family: '함수 계보',
      familyDescription: '중등 함수 개념 → 고등 함수의 종류·합성·역함수 → 대학 사상론',
    },

    visualType: 'function_h',
    relatedIds: ['H022', 'H023'],
  },

  {
    id: 'H022',
    number: 22,
    name: '합성함수',
    latex: '(g \\circ f)(x) = g(f(x))',
    description: '두 함수를 연결하여 한 함수의 출력이 다른 함수의 입력이 되는 새로운 함수',
    level: 'high',
    category: 'function',
    tags: ['합성함수', '함수합성', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '함수 두 개를 연결하기. 출력이 다음 입력이 돼!',

    principle: `
      <strong>합성함수</strong>는 두 함수를 순서대로 적용하는 거야.<br><br>
      f: X→Y, g: Y→Z일 때<br>
      <strong>(g∘f)(x) = g(f(x))</strong><br><br>
      <strong>주의사항</strong><br>
      ① g∘f ≠ f∘g (교환법칙 성립 안 함!)<br>
      ② f의 치역이 g의 정의역에 포함되어야 합성 가능<br>
      ③ 안쪽 함수(f)부터 먼저 계산<br><br>
      <strong>결합법칙은 성립</strong><br>
      (h∘g)∘f = h∘(g∘f)
    `,

    story: `
      함수 합성은 19세기 <strong>코시</strong>와 <strong>디리클레</strong>가 함수 이론을 발전시키며 체계화됐어.<br><br>
      20세기에 <strong>범주론</strong>이 등장하면서, 함수 합성은 수학의 모든 구조를
      통일적으로 바라보는 핵심 연산이 되었지. 컴퓨터 과학에서 함수형 프로그래밍은
      이 합성 개념을 프로그램 설계에 직접 적용한 거야.
    `,

    realLife: [
      { icon: '🏭', title: '생산 공정', desc: '원재료→가공→포장: 각 단계가 함수, 전체가 합성함수' },
      { icon: '📸', title: '이미지 필터', desc: '흑백 변환 후 선명도 조정 = 두 필터 함수의 합성' },
      { icon: '🤖', title: '신경망', desc: 'AI의 각 레이어가 함수이고, 전체 네트워크 = 합성함수' },
    ],

    sliders: [
      { name: 'x', label: 'x 입력값', min: -5, max: 5, default: 2, step: 1 },
    ],

    example: {
      question: 'f(x)=2x+1, g(x)=x²일 때, (g∘f)(3)과 (f∘g)(3)을 각각 구하라.',
      answer: '(g∘f)(3)=49, (f∘g)(3)=19',
      steps: [
        '(g∘f)(3) = g(f(3))',
        'f(3) = 2(3)+1 = 7',
        'g(7) = 7² = 49',
        '(f∘g)(3) = f(g(3))',
        'g(3) = 9, f(9) = 2(9)+1 = 19',
      ],
      hints: [
        '힌트 1: g∘f는 f를 먼저, g를 나중에 적용해.',
        '힌트 2: f(3)=7이니까 g(7)을 구해.',
        '힌트 3: f∘g는 순서가 바뀌니까 결과가 달라!',
      ],
      otherApproaches: [
        { name: '합성함수 식 구하기', desc: '(g∘f)(x)=g(2x+1)=(2x+1)²을 먼저 구하고 x=3 대입: 49.' },
      ],
    },

    evolution: {
      prev: 'H021',
      next: undefined,
      family: '함수 계보',
      familyDescription: '함수의 뜻 → 합성함수 → 역함수 → 대학 범주론',
    },

    visualType: 'composite_func',
    relatedIds: ['H021', 'H023'],
  },

  {
    id: 'H023',
    number: 23,
    name: '역함수',
    latex: 'f^{-1}(x)',
    description: '함수 f의 입출력을 뒤바꾼 함수로, f(a)=b이면 f⁻¹(b)=a',
    level: 'high',
    category: 'function',
    tags: ['역함수', '일대일대응', '그래프대칭', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: 'f(2)=5이면 f⁻¹(5)=2. 함수를 거꾸로 돌리기!',

    principle: `
      <strong>역함수</strong>는 함수의 입출력을 뒤바꾼 함수야.<br><br>
      <strong>존재 조건</strong><br>
      f가 <strong>일대일대응(전단사)</strong>일 때만 역함수가 존재해.<br><br>
      <strong>성질</strong><br>
      ① f(a)=b ⟺ f⁻¹(b)=a<br>
      ② (f⁻¹∘f)(x) = x, (f∘f⁻¹)(x) = x<br>
      ③ y=f(x)와 y=f⁻¹(x)의 그래프는 <strong>y=x에 대해 대칭</strong><br><br>
      <strong>역함수 구하는 법</strong><br>
      y=f(x)에서 x와 y를 바꾸고, x에 대해 풀어.
    `,

    story: `
      역함수 개념은 <strong>오일러</strong>가 로그함수를 지수함수의 역으로 정의하면서 명확해졌어.<br><br>
      로그함수 y=logₐx는 지수함수 y=aˣ의 역함수야. 이 관계가 발견되면서
      지수·로그를 하나의 체계로 이해할 수 있게 되었지. 역함수는 암호학에서도 핵심이야
      — 암호화 함수의 역함수가 복호화 함수거든.
    `,

    realLife: [
      { icon: '🌡️', title: '온도 변환', desc: 'C→F 변환의 역 = F→C 변환. F=9C/5+32의 역함수가 C=(F-32)×5/9' },
      { icon: '🔐', title: '암호화/복호화', desc: '암호화 함수의 역함수 = 복호화 함수' },
      { icon: '📏', title: '단위 환산', desc: 'km→mile 변환의 역 = mile→km 변환' },
    ],

    sliders: [
      { name: 'a', label: '기울기 a', min: -3, max: 3, default: 2, step: 0.5 },
      { name: 'b', label: 'y절편 b', min: -5, max: 5, default: 1, step: 1 },
    ],

    example: {
      question: 'f(x)=3x-2의 역함수를 구하라.',
      answer: 'f⁻¹(x) = (x+2)/3',
      steps: [
        'y=3x-2로 놓는다.',
        'x와 y를 바꾼다: x=3y-2',
        'y에 대해 풀기: x+2=3y → y=(x+2)/3',
        'f⁻¹(x) = (x+2)/3',
        '검증: f(f⁻¹(x)) = 3·(x+2)/3-2 = x+2-2 = x',
      ],
      hints: [
        '힌트 1: y=3x-2에서 x와 y를 바꿔봐.',
        '힌트 2: x=3y-2를 y에 대해 풀어.',
        '힌트 3: y=(x+2)/3이 역함수야.',
      ],
      otherApproaches: [
        { name: '그래프 대칭', desc: 'y=3x-2의 그래프를 y=x에 대해 대칭이동하면 역함수 그래프가 나와.' },
      ],
    },

    evolution: {
      prev: 'H022',
      next: undefined,
      family: '함수 계보',
      familyDescription: '합성함수 → 역함수 → 대학 역사상 이론',
    },

    visualType: 'inverse_func',
    relatedIds: ['H021', 'H022', 'H032'],
  },

  {
    id: 'H024',
    number: 24,
    name: '유리함수',
    latex: 'y = \\frac{ax+b}{cx+d}',
    description: '다항함수의 비로 표현되는 함수로, 점근선을 가진다',
    level: 'high',
    category: 'function',
    tags: ['유리함수', '점근선', '쌍곡선', '불연속', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '분모가 0이 되는 순간! 그래프에 구멍이나 점근선이 생겨.',

    principle: `
      <strong>유리함수</strong>는 (다항식)/(다항식) 형태의 함수야.<br><br>
      <strong>기본형</strong>: y = k/x (반비례 관계)<br>
      그래프: 원점 대칭 쌍곡선, 점근선 x=0, y=0<br><br>
      <strong>일반형</strong>: y = (ax+b)/(cx+d)<br>
      ① 수직 점근선: cx+d=0, 즉 x=-d/c<br>
      ② 수평 점근선: y=a/c<br><br>
      <strong>그래프 그리기</strong><br>
      y=(ax+b)/(cx+d) = a/c + (bc-ad)/(c(cx+d))<br>
      → y=k/(x-p)+q 꼴로 변환하면 이동 파악 쉬움
    `,

    story: `
      유리함수의 점근선 개념은 고대 그리스 <strong>아폴로니오스</strong>의 원뿔곡선론에서 시작됐어.<br><br>
      쌍곡선은 원뿔을 자르는 각도에 따라 생기는 곡선이야. <strong>데카르트</strong>와 <strong>페르마</strong>가
      이를 좌표계로 옮기면서 y=k/x라는 아름다운 수식으로 표현할 수 있게 됐지.
    `,

    realLife: [
      { icon: '⚡', title: '옴의 법칙', desc: 'I=V/R에서 저항이 커지면 전류가 반비례로 감소' },
      { icon: '📉', title: '한계비용', desc: '생산량이 늘수록 단위당 고정비용이 유리함수적으로 감소' },
      { icon: '💊', title: '약물 농도', desc: '시간에 따른 혈중 농도가 유리함수 형태로 변한다' },
    ],

    sliders: [
      { name: 'a', label: 'a (분자 x계수)', min: -5, max: 5, default: 1, step: 1 },
      { name: 'b', label: 'b (분자 상수)', min: -5, max: 5, default: 2, step: 1 },
      { name: 'c', label: 'c (분모 x계수)', min: -5, max: 5, default: 1, step: 1 },
      { name: 'd', label: 'd (분모 상수)', min: -5, max: 5, default: -1, step: 1 },
    ],

    example: {
      question: 'y = (2x+1)/(x-1)의 점근선을 구하고 그래프의 개형을 설명하라.',
      answer: '수직 점근선: x=1, 수평 점근선: y=2',
      steps: [
        '수직 점근선: 분모=0 → x-1=0 → x=1',
        '수평 점근선: (최고차 계수의 비) = 2/1 = 2 → y=2',
        '변형: y = (2(x-1)+3)/(x-1) = 2 + 3/(x-1)',
        '이는 y=3/x를 x방향 1, y방향 2만큼 이동한 것',
        '그래프는 점 (1,2)를 중심으로 한 쌍곡선',
      ],
      hints: [
        '힌트 1: 분모가 0이 되는 x값이 수직 점근선이야.',
        '힌트 2: x→∞일 때 y가 수렴하는 값이 수평 점근선.',
        '힌트 3: y = k/(x-p)+q 형태로 변환해봐.',
      ],
      otherApproaches: [
        { name: '표 작성법', desc: 'x에 여러 값을 대입해 (x,y) 좌표를 구하고 점을 찍어 그래프를 그려봐.' },
      ],
    },

    evolution: {
      prev: 'M020',
      next: undefined,
      family: '함수의 종류 계보',
      familyDescription: '중등 반비례 → 고등 유리함수 → 대학 유리식 적분',
    },

    visualType: 'rational_func',
    relatedIds: ['H025', 'H021'],
  },

  {
    id: 'H025',
    number: 25,
    name: '무리함수',
    latex: 'y = \\sqrt{ax+b}',
    description: '근호 안에 변수를 포함하는 함수로, 정의역에 제한이 있다',
    level: 'high',
    category: 'function',
    tags: ['무리함수', '제곱근', '정의역', '역함수', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '루트 안이 음수면 정의 불가! 무리함수는 정의역부터 확인해야 해.',

    principle: `
      <strong>무리함수</strong>는 근호 안에 변수가 있는 함수야.<br><br>
      <strong>기본형</strong>: y = √x<br>
      정의역: x≥0, 치역: y≥0<br>
      이차함수 y=x²(x≥0)의 역함수야!<br><br>
      <strong>일반형</strong>: y = √(ax+b) + c<br>
      정의역: ax+b ≥ 0<br>
      시작점: ax+b=0일 때 y=c<br><br>
      <strong>그래프 특징</strong><br>
      ① a>0: 오른쪽으로 성장, 성장 속도 점점 느림<br>
      ② a<0: 왼쪽으로 성장<br>
      ③ 이차함수의 일부를 y=x에 대칭한 모양
    `,

    story: `
      제곱근 기호 √는 16세기 독일 수학자 <strong>루돌프</strong>가 도입했어.<br><br>
      라틴어 "radix(근)"의 r을 변형한 것이지. 무리함수는 이차함수의 역함수로서
      수학적으로 깊은 의미를 가져. 물리학에서는 자유낙하 시간, 진자의 주기 등이
      무리함수 형태를 따라.
    `,

    realLife: [
      { icon: '🎢', title: '자유낙하', desc: '낙하시간 t=√(2h/g)는 높이의 무리함수' },
      { icon: '⏱️', title: '진자의 주기', desc: 'T=2π√(l/g)로 길이의 제곱근에 비례' },
      { icon: '🚗', title: '제동 거리', desc: '속도 v=√(2as)로, 제동거리의 무리함수' },
    ],

    sliders: [
      { name: 'a', label: 'a 계수', min: -3, max: 3, default: 1, step: 0.5 },
      { name: 'b', label: 'b 상수', min: -5, max: 5, default: 0, step: 1 },
      { name: 'c', label: 'c (y이동)', min: -5, max: 5, default: 0, step: 1 },
    ],

    example: {
      question: 'y = √(2x-4) + 1의 정의역과 치역을 구하고, 그래프의 시작점을 찾아라.',
      answer: '정의역: x≥2, 치역: y≥1, 시작점: (2, 1)',
      steps: [
        '근호 안 ≥ 0: 2x-4 ≥ 0',
        '2x ≥ 4 → x ≥ 2 (정의역)',
        '√(2x-4) ≥ 0이므로 y = √(2x-4)+1 ≥ 1 (치역)',
        '시작점: x=2일 때 y=√0+1=1 → (2,1)',
      ],
      hints: [
        '힌트 1: 근호 안이 0 이상이어야 해.',
        '힌트 2: 2x-4≥0을 풀면 x≥2.',
        '힌트 3: √(양수)≥0이니까 y≥1이야.',
      ],
      otherApproaches: [
        { name: '평행이동', desc: 'y=√(2x)를 x방향 2, y방향 1만큼 이동한 것으로 해석할 수 있어.' },
      ],
    },

    evolution: {
      prev: 'M007',
      next: undefined,
      family: '무리수·무리함수 계보',
      familyDescription: '중등 제곱근 → 고등 무리함수 → 대학 멱함수·분수지수',
    },

    visualType: 'irrational_func',
    relatedIds: ['H024', 'H023'],
  },

  {
    id: 'H026',
    number: 26,
    name: '등차수열',
    latex: 'a_n = a_1 + (n-1)d',
    description: '인접한 두 항의 차가 일정한 수열',
    level: 'high',
    category: 'sequence',
    tags: ['등차수열', '공차', '일반항', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '1, 4, 7, 10... 일정하게 증가하는 수열. n번째 항은?',

    principle: `
      <strong>등차수열</strong>은 이웃한 두 항의 차이가 항상 같은 수열이야.<br><br>
      <strong>공차</strong>: d = aₙ₊₁ - aₙ (일정)<br><br>
      <strong>일반항</strong><br>
      aₙ = a₁ + (n-1)d<br><br>
      <strong>등차중항</strong><br>
      a, b, c가 등차수열이면 b = (a+c)/2<br><br>
      <strong>성질</strong><br>
      aₘ + aₙ = aₚ + aq (m+n=p+q일 때)<br>
      즉, 첨자의 합이 같으면 항의 합도 같아.
    `,

    story: `
      등차수열은 인류가 가장 먼저 발견한 수열 패턴이야.<br><br>
      고대 이집트와 바빌로니아의 세금 계산에서 이미 등차수열이 쓰였어.
      <strong>가우스</strong>가 어린 시절 1+2+...+100을 등차수열의 합 공식으로
      순식간에 계산한 유명한 일화가 있지. 그의 풀이법이 바로 S=n(a₁+aₙ)/2야.
    `,

    realLife: [
      { icon: '💰', title: '적금 이자', desc: '매월 일정 금액씩 불어나는 단리 적금이 등차수열' },
      { icon: '🏃', title: '운동 프로그램', desc: '매주 달리기 거리를 500m씩 늘리면 등차수열' },
      { icon: '🏗️', title: '좌석 배치', desc: '원형극장에서 바깥으로 갈수록 좌석이 일정하게 증가' },
    ],

    sliders: [
      { name: 'a1', label: '첫째항 a₁', min: -10, max: 10, default: 1, step: 1 },
      { name: 'd', label: '공차 d', min: -5, max: 5, default: 3, step: 1 },
      { name: 'n', label: '항 번호 n', min: 1, max: 20, default: 5, step: 1 },
    ],

    example: {
      question: '등차수열 3, 7, 11, 15, ...의 제20항을 구하라.',
      answer: '79',
      steps: [
        'a₁ = 3, 공차 d = 7-3 = 4',
        'aₙ = a₁ + (n-1)d',
        'a₂₀ = 3 + (20-1)×4',
        '= 3 + 19×4 = 3 + 76 = 79',
      ],
      hints: [
        '힌트 1: 공차 d를 먼저 구해봐.',
        '힌트 2: d = 4이고, 일반항 공식에 n=20을 대입해.',
        '힌트 3: 3 + 19×4 = 79.',
      ],
      otherApproaches: [
        { name: '점화식 반복', desc: 'a₁=3에서 d=4를 19번 더하면: 3, 7, 11, ..., 79. 하지만 공식이 훨씬 빨라.' },
      ],
    },

    evolution: {
      prev: 'M012',
      next: undefined,
      family: '수열 계보',
      familyDescription: '중등 규칙 찾기 → 고등 등차·등비수열 → 대학 급수·해석학',
    },

    visualType: 'arithmetic_seq',
    relatedIds: ['H027', 'H028'],
  },

  {
    id: 'H027',
    number: 27,
    name: '등비수열',
    latex: 'a_n = a_1 \\cdot r^{n-1}',
    description: '인접한 두 항의 비가 일정한 수열',
    level: 'high',
    category: 'sequence',
    tags: ['등비수열', '공비', '일반항', '기하급수', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '1, 2, 4, 8... 일정 비율로 증가. 바이러스 전파가 이 모델이야!',

    principle: `
      <strong>등비수열</strong>은 이웃한 두 항의 비가 항상 같은 수열이야.<br><br>
      <strong>공비</strong>: r = aₙ₊₁/aₙ (일정, r≠0)<br><br>
      <strong>일반항</strong><br>
      aₙ = a₁ · rⁿ⁻¹<br><br>
      <strong>등비중항</strong><br>
      a, b, c가 등비수열이면 b² = ac<br><br>
      <strong>성질</strong><br>
      aₘ · aₙ = aₚ · aq (m+n=p+q일 때)<br>
      |r|<1이면 수렴, |r|≥1이면 발산(r=1 제외)
    `,

    story: `
      등비수열의 유명한 일화로 <strong>체스판과 밀알</strong> 이야기가 있어.<br><br>
      인도의 왕이 체스를 발명한 자에게 원하는 상을 주겠다고 했고,
      발명가는 "첫 칸에 밀알 1개, 다음 칸에 2개, 그 다음 4개..." 하고 요청했지.
      64번째 칸까지의 총량은 2⁶⁴-1 ≈ 1.8×10¹⁹개! 지구 전체 밀 생산량보다 많아.
      이것이 기하급수적 증가의 위력이야.
    `,

    realLife: [
      { icon: '🦠', title: '바이러스 전파', desc: '감염자 1명이 2명씩 전파하면 n세대 후 2ⁿ명 (등비수열)' },
      { icon: '💰', title: '복리 이자', desc: '원금×(1+r)ⁿ으로 매년 일정 비율씩 증가' },
      { icon: '📉', title: '방사성 붕괴', desc: '반감기마다 절반으로 감소: (1/2)ⁿ 등비수열' },
    ],

    sliders: [
      { name: 'a1', label: '첫째항 a₁', min: 1, max: 10, default: 1, step: 1 },
      { name: 'r', label: '공비 r', min: -3, max: 3, default: 2, step: 0.5 },
      { name: 'n', label: '항 번호 n', min: 1, max: 10, default: 5, step: 1 },
    ],

    example: {
      question: '등비수열 2, 6, 18, 54, ...의 제8항을 구하라.',
      answer: '4374',
      steps: [
        'a₁ = 2, 공비 r = 6/2 = 3',
        'aₙ = a₁ · rⁿ⁻¹',
        'a₈ = 2 · 3⁷',
        '3⁷ = 2187',
        'a₈ = 2 × 2187 = 4374',
      ],
      hints: [
        '힌트 1: 공비를 먼저 구해봐. 6÷2=?',
        '힌트 2: r=3이고 a₈=2·3⁷을 계산해.',
        '힌트 3: 3⁷=2187이니까 2×2187=4374.',
      ],
      otherApproaches: [
        { name: '순차 계산', desc: '2, 6, 18, 54, 162, 486, 1458, 4374로 하나씩 3을 곱해도 된다.' },
      ],
    },

    evolution: {
      prev: 'M021',
      next: undefined,
      family: '수열 계보',
      familyDescription: '중등 비례 → 고등 등비수열 → 대학 무한급수·수렴판정',
    },

    visualType: 'geometric_seq',
    relatedIds: ['H026', 'H029', 'H031'],
  },

  {
    id: 'H028',
    number: 28,
    name: '수열의 합 (등차)',
    latex: 'S_n = \\frac{n(a_1+a_n)}{2}',
    description: '등차수열의 첫째항부터 n째항까지의 합을 구하는 공식',
    level: 'high',
    category: 'sequence',
    tags: ['등차수열의합', '시그마', '가우스', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '가우스가 어릴 때 1+2+...+100을 순식간에 계산한 방법!',

    principle: `
      등차수열 {aₙ}의 첫째항부터 n째항까지의 합:<br><br>
      <strong>Sₙ = n(a₁+aₙ)/2</strong><br><br>
      또는 aₙ = a₁+(n-1)d를 대입하면:<br>
      <strong>Sₙ = n·a₁ + n(n-1)d/2</strong><br><br>
      <strong>증명 (가우스의 방법)</strong><br>
      S = a₁ + a₂ + ... + aₙ<br>
      S = aₙ + aₙ₋₁ + ... + a₁ (역순)<br>
      2S = n(a₁+aₙ) → S = n(a₁+aₙ)/2<br><br>
      <strong>Sₙ과 aₙ의 관계</strong><br>
      aₙ = Sₙ - Sₙ₋₁ (n≥2)
    `,

    story: `
      어린 <strong>가우스</strong>(7~10세)가 선생님이 내준 1+2+...+100 문제를 즉시 풀었다는
      유명한 이야기가 있어.<br><br>
      1+100=101, 2+99=101, ..., 50+51=101 → 101×50=5050이라고 답했지.
      이 아이디어가 바로 등차수열의 합 공식이야. 가우스는 이후 "수학의 왕자"라 불렸어.
    `,

    realLife: [
      { icon: '🧱', title: '벽돌 쌓기', desc: '삼각형 모양으로 벽돌을 쌓을 때 총 벽돌 수 = 등차수열의 합' },
      { icon: '💰', title: '적금 총액', desc: '매월 일정 금액씩 늘리며 적금할 때 총 적립액 계산' },
      { icon: '📅', title: '학습 계획', desc: '매일 공부 시간을 30분씩 늘릴 때 총 공부 시간' },
    ],

    sliders: [
      { name: 'a1', label: '첫째항 a₁', min: 1, max: 10, default: 1, step: 1 },
      { name: 'd', label: '공차 d', min: 1, max: 5, default: 1, step: 1 },
      { name: 'n', label: '항의 수 n', min: 1, max: 50, default: 10, step: 1 },
    ],

    example: {
      question: '등차수열 2, 5, 8, 11, ...의 첫째항부터 제15항까지의 합을 구하라.',
      answer: '345',
      steps: [
        'a₁ = 2, d = 3',
        'a₁₅ = 2 + 14×3 = 44',
        'S₁₅ = 15×(2+44)/2',
        '= 15×46/2 = 15×23',
        '= 345',
      ],
      hints: [
        '힌트 1: 먼저 제15항을 구해봐.',
        '힌트 2: a₁₅ = 2+14×3 = 44.',
        '힌트 3: S = 15×(2+44)/2 = 345.',
      ],
      otherApproaches: [
        { name: '다른 공식 사용', desc: 'Sₙ = na₁+n(n-1)d/2 = 15×2+15×14×3/2 = 30+315 = 345.' },
      ],
    },

    evolution: {
      prev: 'H026',
      next: undefined,
      family: '수열의 합 계보',
      familyDescription: '등차수열 → 등차수열의 합 → 대학 급수론',
    },

    visualType: 'arithmetic_sum',
    relatedIds: ['H026', 'H029', 'H030'],
  },

  {
    id: 'H029',
    number: 29,
    name: '수열의 합 (등비)',
    latex: 'S_n = \\frac{a_1(r^n-1)}{r-1}',
    description: '등비수열의 첫째항부터 n째항까지의 합을 구하는 공식',
    level: 'high',
    category: 'sequence',
    tags: ['등비수열의합', '기하급수', '시그마', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '1+2+4+8+...+512 = 1023. 등비수열의 합이면 한 방에!',

    principle: `
      등비수열 {aₙ}의 첫째항부터 n째항까지의 합 (r≠1):<br><br>
      <strong>Sₙ = a₁(rⁿ-1)/(r-1)</strong><br>
      또는 <strong>Sₙ = a₁(1-rⁿ)/(1-r)</strong><br><br>
      <strong>증명</strong><br>
      S = a₁ + a₁r + a₁r² + ... + a₁rⁿ⁻¹<br>
      rS = a₁r + a₁r² + ... + a₁rⁿ<br>
      S-rS = a₁ - a₁rⁿ → S(1-r) = a₁(1-rⁿ)<br><br>
      <strong>무한등비급수</strong> (|r|<1일 때)<br>
      S∞ = a₁/(1-r)
    `,

    story: `
      등비급수는 고대 그리스의 <strong>제논의 역설</strong>과 깊이 연결돼.<br><br>
      아킬레우스는 거북이를 영원히 따라잡을 수 없다? 실은 무한 등비급수의 합이
      유한하기 때문에 따라잡을 수 있어. 1/2+1/4+1/8+... = 1이 그 증거야.
      이 역설의 해결이 극한 개념의 발전을 이끌었지.
    `,

    realLife: [
      { icon: '💰', title: '연금 계산', desc: '매년 일정 비율로 증가하는 연금의 총 수령액 = 등비급수' },
      { icon: '🏀', title: '공 튀기기', desc: '매번 높이가 80%로 줄면 총 이동 거리 = 무한등비급수' },
      { icon: '📡', title: '신호 감쇠', desc: '반사파가 매번 r배로 줄어드는 총 에너지 = 등비급수' },
    ],

    sliders: [
      { name: 'a1', label: '첫째항 a₁', min: 1, max: 10, default: 1, step: 1 },
      { name: 'r', label: '공비 r', min: -3, max: 3, default: 2, step: 0.5 },
      { name: 'n', label: '항의 수 n', min: 1, max: 15, default: 10, step: 1 },
    ],

    example: {
      question: '등비수열 3, 6, 12, 24, ...의 첫째항부터 제8항까지의 합을 구하라.',
      answer: '765',
      steps: [
        'a₁ = 3, r = 2',
        'Sₙ = a₁(rⁿ-1)/(r-1)',
        'S₈ = 3(2⁸-1)/(2-1)',
        '= 3(256-1)/1',
        '= 3×255 = 765',
      ],
      hints: [
        '힌트 1: a₁=3, r=2를 확인해.',
        '힌트 2: 2⁸=256이야.',
        '힌트 3: 3×(256-1)=3×255=765.',
      ],
      otherApproaches: [
        { name: '순차 합산', desc: '3+6+12+24+48+96+192+384 = 765로 직접 더해 확인할 수 있어.' },
      ],
    },

    evolution: {
      prev: 'H027',
      next: undefined,
      family: '수열의 합 계보',
      familyDescription: '등비수열 → 등비수열의 합 → 대학 급수 수렴판정',
    },

    visualType: 'geometric_sum',
    relatedIds: ['H027', 'H028', 'H030'],
  },

  {
    id: 'H030',
    number: 30,
    name: '수학적 귀납법',
    latex: 'P(1) \\text{ 성립, } P(k) \\Rightarrow P(k+1)',
    description: '도미노 원리를 이용해 자연수 전체에 대한 명제를 증명하는 방법',
    level: 'high',
    category: 'sequence',
    tags: ['수학적귀납법', '증명', '도미노', '자연수', '고3', '미적분'],
    grade: '고3',
    curriculum: '2022개정',

    hook: '도미노 원리로 무한히 많은 명제를 한번에 증명!',

    principle: `
      <strong>수학적 귀납법</strong>은 자연수 n에 대한 명제를 증명하는 강력한 도구야.<br><br>
      <strong>두 단계</strong><br>
      ① <strong>기본 단계</strong>: P(1)이 참임을 보인다 (첫 도미노를 쓰러뜨린다)<br>
      ② <strong>귀납 단계</strong>: P(k)가 참이라 가정하고 → P(k+1)이 참임을 보인다<br>
      (하나가 쓰러지면 다음도 쓰러진다)<br><br>
      이 두 단계가 성립하면 모든 자연수 n에 대해 P(n)이 참이야!<br><br>
      <strong>주의</strong>: 기본 단계와 귀납 단계 둘 다 필수야. 하나라도 빠지면 증명이 안 돼.
    `,

    story: `
      수학적 귀납법의 초기 형태는 <strong>파스칼</strong>이 1665년 사용했어.<br><br>
      하지만 체계적으로 정리한 것은 <strong>페아노</strong>야. 그는 자연수의 공리 중 하나로
      귀납법을 포함시켜, 자연수의 기초를 놓았지. "도미노 원리"라는 비유는
      직관적으로 이해하기 쉽지만, 그 뒤에는 자연수의 정밀한 구조가 숨어 있어.
    `,

    realLife: [
      { icon: '💻', title: '알고리즘 검증', desc: '재귀 알고리즘의 정확성을 수학적 귀납법으로 증명한다' },
      { icon: '🔗', title: '블록체인', desc: '이전 블록이 유효하면 다음 블록도 유효 → 귀납적 신뢰' },
      { icon: '🧬', title: '세포 분열', desc: 'k세대가 정상이면 k+1세대도 정상이라는 유전적 귀납' },
    ],

    sliders: undefined,

    example: {
      question: '1+2+3+...+n = n(n+1)/2을 수학적 귀납법으로 증명하라.',
      answer: '기본 단계와 귀납 단계 모두 성립하므로 모든 자연수에 대해 참',
      steps: [
        '기본 단계: n=1일 때 좌변=1, 우변=1×2/2=1. 성립.',
        '귀납 가정: n=k일 때 1+2+...+k = k(k+1)/2 성립한다고 가정.',
        'n=k+1일 때: 1+2+...+k+(k+1)',
        '= k(k+1)/2 + (k+1) (귀납 가정 사용)',
        '= (k+1)(k/2+1) = (k+1)(k+2)/2. 성립.',
      ],
      hints: [
        '힌트 1: 먼저 n=1일 때 양변이 같은지 확인해.',
        '힌트 2: n=k에서 성립한다고 가정하고 n=k+1을 보여.',
        '힌트 3: 귀납 가정의 식에 (k+1)을 더해서 정리해봐.',
      ],
      otherApproaches: [
        { name: '가우스 풀이', desc: 'S와 역순 S를 더하면 n(n+1)이므로 S=n(n+1)/2. 직접 유도 가능.' },
      ],
    },

    evolution: {
      prev: 'H028',
      next: undefined,
      family: '증명법 계보',
      familyDescription: '명제·대우 → 수학적 귀납법 → 대학 초한귀납법',
    },

    visualType: 'induction',
    relatedIds: ['H028', 'H020'],
  },

  {
    id: 'H031',
    number: 31,
    name: '지수함수',
    latex: 'y = a^x \\; (a>0, a \\neq 1)',
    description: '밑이 양수인 거듭제곱 함수로, 급격한 증가 또는 감소를 나타낸다',
    level: 'high',
    category: 'function',
    tags: ['지수함수', '거듭제곱', '지수법칙', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '인구 증가, 방사성 붕괴, 복리 이자 — 모두 지수함수야!',

    principle: `
      <strong>지수함수</strong> y=aˣ (a>0, a≠1)의 특징:<br><br>
      <strong>a>1일 때</strong>: 증가함수 (오른쪽으로 급성장)<br>
      <strong>0<a<1일 때</strong>: 감소함수 (오른쪽으로 급감소)<br><br>
      <strong>공통 성질</strong><br>
      ① 정의역: 모든 실수, 치역: y>0<br>
      ② 항상 (0,1)을 지남 (a⁰=1)<br>
      ③ x축이 점근선 (y=0에 수렴하지만 닿지 않음)<br><br>
      <strong>지수법칙</strong><br>
      aˣ·aʸ = aˣ⁺ʸ, (aˣ)ʸ = aˣʸ, (ab)ˣ = aˣbˣ
    `,

    story: `
      지수함수의 중요성은 <strong>오일러</strong>가 발견한 e(자연상수)에서 절정에 달해.<br><br>
      e ≈ 2.71828...은 연속 복리의 극한에서 나타나는 수야. 오일러는
      eⁱᶿ = cosθ + i·sinθ라는 놀라운 등식을 발견했는데, 이것은 지수함수,
      삼각함수, 복소수를 하나로 연결하는 수학 역사상 가장 아름다운 공식이야.
    `,

    realLife: [
      { icon: '🦠', title: '감염병 확산', desc: '초기 감염자 수가 지수함수적으로 증가한다' },
      { icon: '💰', title: '복리 이자', desc: '원금×(1+r)ⁿ, 시간이 지날수록 급격히 증가' },
      { icon: '☢️', title: '방사성 붕괴', desc: 'N(t)=N₀(1/2)^(t/T)로 반감기마다 절반' },
    ],

    sliders: [
      { name: 'a', label: '밑 a', min: 0.1, max: 5, default: 2, step: 0.1 },
    ],

    example: {
      question: 'y=2ˣ과 y=(1/2)ˣ의 그래프를 비교 설명하라.',
      answer: 'y=2ˣ은 증가, y=(1/2)ˣ은 감소이며, y축 대칭이다.',
      steps: [
        'y=2ˣ: a=2>1이므로 증가함수',
        'y=(1/2)ˣ = 2⁻ˣ: a=1/2<1이므로 감소함수',
        '둘 다 (0,1)을 지남',
        '(1/2)ˣ = 2⁻ˣ이므로 y=2ˣ을 y축에 대칭한 그래프',
        '두 그래프는 모두 x축(y=0)을 점근선으로 가짐',
      ],
      hints: [
        '힌트 1: 밑이 1보다 큰지 작은지에 따라 증감이 달라져.',
        '힌트 2: (1/2)ˣ = 2⁻ˣ임을 이용해.',
        '힌트 3: 두 그래프의 대칭 관계를 파악해봐.',
      ],
      otherApproaches: [
        { name: '좌표 대입', desc: 'x=-2,-1,0,1,2를 대입해 점을 찍으면 두 그래프의 관계가 보여.' },
      ],
    },

    evolution: {
      prev: 'M021',
      next: undefined,
      family: '지수·로그 계보',
      familyDescription: '중등 거듭제곱 → 고등 지수함수 → 대학 지수적 성장 모델',
    },

    visualType: 'exp_func',
    relatedIds: ['H032', 'H033', 'H027'],
  },

  {
    id: 'H032',
    number: 32,
    name: '로그함수',
    latex: 'y = \\log_a x',
    description: '지수함수의 역함수로, 큰 수를 다루기 쉽게 만드는 함수',
    level: 'high',
    category: 'function',
    tags: ['로그함수', '로그', '역함수', '상용로그', '자연로그', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '지진 리히터 규모, 소리 데시벨 — 로그로 큰 수를 다루는 거야!',

    principle: `
      <strong>로그함수</strong> y=logₐx (a>0, a≠1, x>0):<br><br>
      y=aˣ의 <strong>역함수</strong>야. aʸ=x ⟺ y=logₐx<br><br>
      <strong>성질</strong><br>
      ① 정의역: x>0, 치역: 모든 실수<br>
      ② 항상 (1,0)을 지남 (logₐ1=0)<br>
      ③ y축이 점근선<br>
      ④ a>1이면 증가, 0<a<1이면 감소<br><br>
      <strong>로그 법칙</strong><br>
      logₐ(xy) = logₐx + logₐy<br>
      logₐ(x/y) = logₐx - logₐy<br>
      logₐ(xⁿ) = n·logₐx
    `,

    story: `
      로그는 1614년 스코틀랜드 수학자 <strong>네이피어</strong>가 발명했어.<br><br>
      당시 천문학자들은 큰 수의 곱셈을 해야 했는데, 로그를 쓰면 곱셈이 덧셈으로 바뀌어
      계산이 획기적으로 간편해졌지. <strong>라플라스</strong>는 "로그가 천문학자의 수명을
      두 배로 늘렸다"고 말했어. 로그는 계산기 이전 시대의 컴퓨터였던 셈이야.
    `,

    realLife: [
      { icon: '🌍', title: '리히터 규모', desc: '지진 에너지가 10배 증가하면 규모 1 증가 (로그 스케일)' },
      { icon: '🔊', title: '데시벨', desc: '소리 강도를 dB=10log₁₀(I/I₀)로 표현' },
      { icon: '🧪', title: 'pH', desc: 'pH=-log₁₀[H⁺]로 산성도를 로그로 표현' },
    ],

    sliders: [
      { name: 'a', label: '밑 a', min: 0.5, max: 5, default: 2, step: 0.5 },
    ],

    example: {
      question: 'log₂32 + log₂(1/8)을 계산하라.',
      answer: '2',
      steps: [
        'log₂32 = log₂2⁵ = 5',
        'log₂(1/8) = log₂2⁻³ = -3',
        '5 + (-3) = 2',
      ],
      hints: [
        '힌트 1: 32와 1/8을 2의 거듭제곱으로 바꿔봐.',
        '힌트 2: 32=2⁵, 1/8=2⁻³.',
        '힌트 3: 5+(-3)=2.',
      ],
      otherApproaches: [
        { name: '로그 법칙', desc: 'log₂32+log₂(1/8) = log₂(32×1/8) = log₂4 = 2.' },
      ],
    },

    evolution: {
      prev: 'H031',
      next: undefined,
      family: '지수·로그 계보',
      familyDescription: '지수함수 → 로그함수 → 대학 자연로그·미분',
    },

    visualType: 'log_func',
    relatedIds: ['H031', 'H033', 'H023'],
  },

  {
    id: 'H033',
    number: 33,
    name: '지수·로그 방정식',
    latex: 'a^x = b \\Leftrightarrow x = \\log_a b',
    description: '지수나 로그를 포함한 방정식을 풀기 위한 동치 변환',
    level: 'high',
    category: 'algebra',
    tags: ['지수방정식', '로그방정식', '지수로그', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '2ˣ=16이면 x=4. 지수와 로그는 같은 관계의 다른 표현이야!',

    principle: `
      지수와 로그는 <strong>역관계</strong>야.<br><br>
      <strong>핵심 동치</strong><br>
      aˣ = b ⟺ x = logₐb (a>0, a≠1, b>0)<br><br>
      <strong>지수방정식 풀이 전략</strong><br>
      ① 같은 밑으로 변환: 2ˣ=8 → 2ˣ=2³ → x=3<br>
      ② 양변에 로그: 3ˣ=5 → x=log₃5<br>
      ③ 치환: 4ˣ-3·2ˣ+2=0 → t=2ˣ로 놓기<br><br>
      <strong>로그방정식 풀이 전략</strong><br>
      ① 로그 정의 이용: logₐx=b → x=aᵇ<br>
      ② 로그 법칙으로 정리<br>
      ③ 진수>0 조건 확인 (반드시!)
    `,

    story: `
      지수와 로그의 관계는 <strong>오일러</strong>에 의해 완성됐어.<br><br>
      그는 지수함수와 로그함수를 역함수 관계로 정립하고, 자연상수 e를 체계화했지.
      현대에는 이 관계가 계산 복잡도(log n), 정보 이론(엔트로피), 머신러닝(교차 엔트로피)
      등에 쓰여.
    `,

    realLife: [
      { icon: '💰', title: '투자 기간 계산', desc: '원금이 2배가 되는 시간: 2=1.05ˣ → x=log₁.₀₅2 ≈ 14.2년' },
      { icon: '☢️', title: '반감기', desc: '(1/2)ˣ=0.1일 때 x=log₀.₅(0.1) ≈ 3.32 반감기' },
      { icon: '💻', title: '알고리즘 복잡도', desc: '이진탐색에서 log₂n번 비교로 검색 완료' },
    ],

    sliders: [
      { name: 'a', label: '밑 a', min: 2, max: 10, default: 2, step: 1 },
      { name: 'b', label: '값 b', min: 1, max: 100, default: 16, step: 1 },
    ],

    example: {
      question: '4ˣ - 3·2ˣ - 4 = 0을 풀어라.',
      answer: 'x = 2',
      steps: [
        '4ˣ = (2²)ˣ = (2ˣ)²이므로 t=2ˣ (t>0)으로 치환',
        't² - 3t - 4 = 0',
        '(t-4)(t+1) = 0 → t=4 또는 t=-1',
        't=2ˣ>0이므로 t=-1은 불가, t=4',
        '2ˣ=4=2² → x=2',
      ],
      hints: [
        '힌트 1: 4ˣ=(2ˣ)²임을 이용해 치환해봐.',
        '힌트 2: t=2ˣ로 놓으면 t²-3t-4=0이야.',
        '힌트 3: t>0 조건을 꼭 확인해.',
      ],
      otherApproaches: [
        { name: '그래프 해석', desc: 'y=4ˣ-3·2ˣ-4의 그래프에서 x축과의 교점을 찾으면 x=2.' },
      ],
    },

    evolution: {
      prev: 'H032',
      next: undefined,
      family: '지수·로그 계보',
      familyDescription: '로그함수 → 지수·로그 방정식 → 대학 미분방정식',
    },

    visualType: 'exp_log_eq',
    relatedIds: ['H031', 'H032'],
  },

  {
    id: 'H034',
    number: 34,
    name: '삼각함수',
    latex: '\\sin\\theta, \\cos\\theta, \\tan\\theta',
    description: '단위원 위의 점의 좌표로 정의되는 함수로, 모든 각도에 적용된다',
    level: 'high',
    category: 'trigonometry',
    tags: ['삼각함수', '사인', '코사인', '탄젠트', '단위원', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '단순 직각삼각형 비율이 → 모든 각도에 적용되는 함수로 확장!',

    principle: `
      <strong>단위원(반지름 1인 원)</strong> 위의 점 P(x,y)에서:<br><br>
      <strong>sinθ = y</strong> (y좌표)<br>
      <strong>cosθ = x</strong> (x좌표)<br>
      <strong>tanθ = y/x = sinθ/cosθ</strong><br><br>
      <strong>기본 공식</strong><br>
      sin²θ + cos²θ = 1<br>
      tanθ = sinθ/cosθ<br>
      1 + tan²θ = sec²θ<br><br>
      <strong>특수각</strong><br>
      sin30°=1/2, cos30°=√3/2, tan30°=√3/3<br>
      sin45°=√2/2, cos45°=√2/2, tan45°=1<br>
      sin60°=√3/2, cos60°=1/2, tan60°=√3
    `,

    story: `
      삼각함수의 기원은 고대 그리스의 <strong>히파르코스</strong>(BC 190~120)야.<br><br>
      그는 천문학 관측을 위해 최초의 삼각함수표를 만들었어.
      인도에서 <strong>아리아바타</strong>가 사인 개념을 발전시켰고,
      아랍 수학자들이 이를 유럽에 전파했지. <strong>오일러</strong>가 단위원 정의를 도입하면서
      삼각함수는 기하학을 넘어 해석학의 핵심 도구가 되었어.
    `,

    realLife: [
      { icon: '🎵', title: '소리와 음악', desc: '모든 소리는 사인파의 합성 (푸리에 분석)' },
      { icon: '🌊', title: '파동 현상', desc: '전자기파, 수면파 등 모든 파동이 삼각함수로 기술' },
      { icon: '🎮', title: '3D 그래픽', desc: '물체 회전을 sin, cos로 계산한다' },
    ],

    sliders: [
      { name: 'theta', label: '각도 θ (도)', min: 0, max: 360, default: 45, step: 15 },
    ],

    example: {
      question: 'sin²60° + cos²60°의 값을 구하라.',
      answer: '1',
      steps: [
        'sin60° = √3/2',
        'cos60° = 1/2',
        'sin²60° = (√3/2)² = 3/4',
        'cos²60° = (1/2)² = 1/4',
        '3/4 + 1/4 = 1',
      ],
      hints: [
        '힌트 1: sin60°와 cos60°의 값을 떠올려봐.',
        '힌트 2: 각각 제곱해서 더해.',
        '힌트 3: sin²θ+cos²θ=1은 모든 각에 대해 성립하는 항등식이야!',
      ],
      otherApproaches: [
        { name: '항등식 직접 적용', desc: 'sin²θ+cos²θ=1이므로 θ에 관계없이 답은 1.' },
      ],
    },

    evolution: {
      prev: 'M062',
      next: undefined,
      family: '삼각함수 계보',
      familyDescription: '중등 삼각비 → 고등 삼각함수 → 대학 해석적 삼각함수론',
    },

    visualType: 'trig_func',
    relatedIds: ['H035', 'H036', 'H037', 'H038'],
  },

  {
    id: 'H035',
    number: 35,
    name: '삼각함수의 그래프',
    latex: 'y = \\sin x, \\; y = \\cos x',
    description: '삼각함수를 좌표평면에 그린 주기함수 그래프의 특성',
    level: 'high',
    category: 'trigonometry',
    tags: ['삼각함수그래프', '주기', '진폭', '위상', '사인파', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '음파, 빛의 파동, 심장박동 — 모두 사인 함수 모양이야!',

    principle: `
      <strong>y=sinx의 그래프</strong><br>
      주기: 2π, 진폭: 1, 원점을 지남<br><br>
      <strong>y=cosx의 그래프</strong><br>
      주기: 2π, 진폭: 1, (0,1)을 지남<br>
      cos x = sin(x+π/2) (sinx를 π/2 왼쪽으로 이동)<br><br>
      <strong>일반형 y=a·sin(bx+c)+d</strong><br>
      |a|: 진폭<br>
      2π/|b|: 주기<br>
      -c/b: 위상 이동<br>
      d: 수직 이동<br><br>
      <strong>tanx의 그래프</strong><br>
      주기: π, 점근선: x=π/2+nπ
    `,

    story: `
      삼각함수 그래프를 물리 현상에 연결한 것은 <strong>푸리에</strong>의 혁명적 발견이야.<br><br>
      그는 1807년 "모든 주기함수는 사인·코사인의 합으로 분해할 수 있다"는
      푸리에 급수를 발표했어. 이것은 열전도 문제를 풀기 위해서였지만,
      오늘날 MP3 압축, MRI 영상, 5G 통신 등 모든 신호 처리의 기초가 되었어.
    `,

    realLife: [
      { icon: '📻', title: 'FM 라디오', desc: '주파수 변조는 삼각함수 그래프의 주기를 바꾸는 것' },
      { icon: '🫀', title: '심전도', desc: '심장박동 ECG 파형을 삼각함수의 합으로 분석' },
      { icon: '🌊', title: '조석 예측', desc: '밀물·썰물 패턴을 삼각함수의 합성으로 모델링' },
    ],

    sliders: [
      { name: 'a', label: '진폭 a', min: 0.5, max: 3, default: 1, step: 0.5 },
      { name: 'b', label: '주기 계수 b', min: 0.5, max: 4, default: 1, step: 0.5 },
      { name: 'c', label: '위상 이동 c', min: -3, max: 3, default: 0, step: 0.5 },
      { name: 'd', label: '수직 이동 d', min: -3, max: 3, default: 0, step: 0.5 },
    ],

    example: {
      question: 'y=2sin(3x-π/6)의 진폭, 주기, 위상 이동을 구하라.',
      answer: '진폭: 2, 주기: 2π/3, 위상 이동: π/18 오른쪽',
      steps: [
        'y=a·sin(bx+c)+d에서 a=2, b=3, c=-π/6, d=0',
        '진폭: |a| = 2',
        '주기: 2π/|b| = 2π/3',
        '위상 이동: -c/b = (π/6)/3 = π/18 (오른쪽)',
      ],
      hints: [
        '힌트 1: a, b, c, d를 일반형에서 읽어내.',
        '힌트 2: 진폭은 |a|, 주기는 2π/|b|야.',
        '힌트 3: 위상 이동은 -c/b야. 양수면 오른쪽.',
      ],
      otherApproaches: [
        { name: '그래프 관찰', desc: 'y=2sinx를 먼저 그리고, 주기를 1/3로 줄이고, π/18만큼 이동시켜봐.' },
      ],
    },

    evolution: {
      prev: 'H034',
      next: undefined,
      family: '삼각함수 계보',
      familyDescription: '삼각함수 정의 → 그래프와 주기 → 대학 푸리에 해석',
    },

    visualType: 'trig_graph',
    relatedIds: ['H034', 'H036'],
  },

  {
    id: 'H036',
    number: 36,
    name: '삼각함수의 덧셈정리',
    latex: '\\sin(A+B) = \\sin A\\cos B + \\cos A\\sin B',
    description: '두 각의 합 또는 차에 대한 삼각함수 값을 각각의 삼각함수로 표현',
    level: 'high',
    category: 'trigonometry',
    tags: ['덧셈정리', '삼각함수', '합차', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: 'sin75°는 특수각이 아닌데 어떻게 구할까? sin(45°+30°)로 분해하면 돼!',

    principle: `
      <strong>사인 덧셈정리</strong><br>
      sin(A+B) = sinA·cosB + cosA·sinB<br>
      sin(A-B) = sinA·cosB - cosA·sinB<br><br>
      <strong>코사인 덧셈정리</strong><br>
      cos(A+B) = cosA·cosB - sinA·sinB<br>
      cos(A-B) = cosA·cosB + sinA·sinB<br><br>
      <strong>탄젠트 덧셈정리</strong><br>
      tan(A+B) = (tanA+tanB)/(1-tanA·tanB)<br><br>
      <strong>활용</strong><br>
      2배각: sin2A = 2sinA·cosA, cos2A = cos²A-sin²A<br>
      반각 공식도 여기서 유도돼.
    `,

    story: `
      덧셈정리의 기하학적 증명은 <strong>프톨레마이오스</strong>(2세기)까지 거슬러 올라가.<br><br>
      그의 원에 내접하는 사각형의 성질(프톨레마이오스 정리)에서 덧셈정리가 유도돼.
      18세기 <strong>오일러</strong>는 복소수 지수함수 e^(iθ)를 이용해 덧셈정리를 훨씬 우아하게
      증명했어. e^(i(A+B)) = e^(iA)·e^(iB)에서 실수부와 허수부를 비교하면 끝이야.
    `,

    realLife: [
      { icon: '📡', title: '통신 변조', desc: '두 주파수 신호의 합을 덧셈정리로 분석해 변조 방식 설계' },
      { icon: '🎵', title: '음향 합성', desc: '서로 다른 음파의 간섭(맥놀이)을 덧셈정리로 설명' },
      { icon: '🤖', title: '로봇 관절', desc: '다관절 로봇의 최종 위치를 회전 합성(덧셈정리)으로 계산' },
    ],

    sliders: [
      { name: 'A', label: '각도 A (도)', min: 0, max: 180, default: 45, step: 15 },
      { name: 'B', label: '각도 B (도)', min: 0, max: 180, default: 30, step: 15 },
    ],

    example: {
      question: 'sin75°의 값을 구하라.',
      answer: '(√6+√2)/4',
      steps: [
        'sin75° = sin(45°+30°)',
        '= sin45°cos30° + cos45°sin30°',
        '= (√2/2)(√3/2) + (√2/2)(1/2)',
        '= √6/4 + √2/4',
        '= (√6+√2)/4',
      ],
      hints: [
        '힌트 1: 75° = 45°+30°로 분해해.',
        '힌트 2: sin(A+B) 덧셈정리를 적용해.',
        '힌트 3: sin45°=cos45°=√2/2, sin30°=1/2, cos30°=√3/2.',
      ],
      otherApproaches: [
        { name: '코사인으로 확인', desc: 'cos15° = cos(45°-30°)도 같은 값 (√6+√2)/4이 나와. sin75°=cos15°이니까.' },
      ],
    },

    evolution: {
      prev: 'H035',
      next: undefined,
      family: '삼각함수 계보',
      familyDescription: '삼각함수 그래프 → 덧셈정리 → 대학 오일러 공식',
    },

    visualType: 'trig_addition',
    relatedIds: ['H034', 'H035', 'H037'],
  },

  {
    id: 'H037',
    number: 37,
    name: '사인 법칙',
    latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R',
    description: '삼각형의 변과 대각의 사인 사이의 비례 관계',
    level: 'high',
    category: 'trigonometry',
    tags: ['사인법칙', '외접원', '삼각형', '삼각측량', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: 'GPS 삼각측량의 핵심 원리. 두 각과 한 변으로 모든 변 계산!',

    principle: `
      삼각형 ABC에서 변 a, b, c와 대각 A, B, C에 대해:<br><br>
      <strong>a/sinA = b/sinB = c/sinC = 2R</strong><br><br>
      (R은 외접원의 반지름)<br><br>
      <strong>활용 상황</strong><br>
      ① 두 각과 한 변을 알 때 → 나머지 변 구하기<br>
      ② 두 변과 한 대각을 알 때 → 나머지 각 구하기<br>
      ③ 외접원의 반지름 구하기: R = a/(2sinA)<br><br>
      <strong>넓이 공식과의 연결</strong><br>
      S = (1/2)ab·sinC = abc/(4R)
    `,

    story: `
      사인 법칙은 중세 이슬람 수학자 <strong>알 투시</strong>(13세기)가 체계화했어.<br><br>
      그는 천문학에서 별의 위치를 계산하기 위해 구면 삼각법을 발전시켰지.
      사인 법칙은 평면뿐 아니라 구면 위의 삼각형에도 확장되며,
      GPS 삼각측량, 항해술, 측량학의 수학적 기초가 되었어.
    `,

    realLife: [
      { icon: '🛰️', title: 'GPS 삼각측량', desc: '세 위성과의 각도로 지구상 위치를 계산한다' },
      { icon: '🗻', title: '측량', desc: '산꼭대기까지의 거리를 두 지점의 각도 측정으로 계산' },
      { icon: '🚢', title: '항해', desc: '두 등대의 방위각으로 선박 위치를 결정한다' },
    ],

    sliders: [
      { name: 'a', label: '변 a', min: 1, max: 10, default: 5, step: 0.5 },
      { name: 'A', label: '각 A (도)', min: 10, max: 170, default: 30, step: 5 },
      { name: 'B', label: '각 B (도)', min: 10, max: 170, default: 60, step: 5 },
    ],

    example: {
      question: '삼각형 ABC에서 A=30°, B=45°, a=4일 때 b를 구하라.',
      answer: '4√2',
      steps: [
        '사인 법칙: a/sinA = b/sinB',
        '4/sin30° = b/sin45°',
        '4/(1/2) = b/(√2/2)',
        '8 = b/(√2/2)',
        'b = 8×√2/2 = 4√2',
      ],
      hints: [
        '힌트 1: 사인 법칙 a/sinA = b/sinB를 써.',
        '힌트 2: sin30°=1/2, sin45°=√2/2를 대입해.',
        '힌트 3: 비례식을 풀어서 b를 구해.',
      ],
      otherApproaches: [
        { name: '외접원 활용', desc: '2R=a/sinA=8이므로 R=4. b=2R·sinB=8×sin45°=4√2.' },
      ],
    },

    evolution: {
      prev: 'M062',
      next: undefined,
      family: '삼각형 법칙 계보',
      familyDescription: '중등 삼각비 → 고등 사인법칙·코사인법칙 → 대학 구면삼각법',
    },

    visualType: 'sine_rule',
    relatedIds: ['H034', 'H038'],
  },

  {
    id: 'H038',
    number: 38,
    name: '코사인 법칙',
    latex: 'a^2 = b^2+c^2-2bc\\cos A',
    description: '삼각형의 세 변과 한 각 사이의 관계로, 피타고라스 정리의 일반화',
    level: 'high',
    category: 'trigonometry',
    tags: ['코사인법칙', '삼각형', '피타고라스일반화', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '피타고라스 정리의 일반화. A=90도이면 피타고라스!',

    principle: `
      삼각형 ABC에서:<br><br>
      <strong>a² = b²+c²-2bc·cosA</strong><br>
      <strong>b² = a²+c²-2ac·cosB</strong><br>
      <strong>c² = a²+b²-2ab·cosC</strong><br><br>
      <strong>특별한 경우</strong><br>
      A=90°이면 cosA=0 → a²=b²+c² (피타고라스!)<br><br>
      <strong>활용</strong><br>
      ① 세 변을 알 때 → cosA = (b²+c²-a²)/(2bc)로 각 구하기<br>
      ② 두 변과 끼인각을 알 때 → 나머지 변 구하기<br><br>
      <strong>삼각형 넓이</strong><br>
      S = (1/2)bc·sinA (코사인 법칙과 조합)
    `,

    story: `
      코사인 법칙은 고대 <strong>유클리드</strong>의 <원론> 제2권에서 그 원형을 찾을 수 있어.<br><br>
      그는 둔각삼각형과 예각삼각형에 대한 두 가지 정리를 기술했는데,
      이를 삼각함수로 통합한 것이 코사인 법칙이야. <strong>알-카시</strong>(15세기 페르시아)가
      최초로 현대적 형태로 정리해 "알-카시 정리"라고도 불려.
    `,

    realLife: [
      { icon: '✈️', title: '항공 내비게이션', desc: '두 공항 사이 거리를 코사인 법칙으로 계산 (구면 코사인)' },
      { icon: '🏗️', title: '건축 트러스', desc: '삼각형 구조물의 부재 길이를 코사인 법칙으로 설계' },
      { icon: '🎯', title: '레이더', desc: '두 물체 사이 거리를 레이더 각도와 코사인 법칙으로 계산' },
    ],

    sliders: [
      { name: 'b', label: '변 b', min: 1, max: 10, default: 5, step: 0.5 },
      { name: 'c', label: '변 c', min: 1, max: 10, default: 7, step: 0.5 },
      { name: 'A', label: '끼인각 A (도)', min: 10, max: 170, default: 60, step: 5 },
    ],

    example: {
      question: '삼각형에서 b=5, c=7, A=60°일 때 a를 구하라.',
      answer: '√39',
      steps: [
        'a² = b²+c²-2bc·cosA',
        '= 25+49-2(5)(7)cos60°',
        '= 74-70×(1/2)',
        '= 74-35 = 39',
        'a = √39',
      ],
      hints: [
        '힌트 1: 코사인 법칙에 b=5, c=7, A=60°를 대입해.',
        '힌트 2: cos60°=1/2를 잊지 마.',
        '힌트 3: 74-35=39이니까 a=√39.',
      ],
      otherApproaches: [
        { name: '좌표 설정', desc: 'B를 원점, C를 (7,0)에 놓고 A의 좌표를 구해서 거리 공식으로도 풀 수 있어.' },
      ],
    },

    evolution: {
      prev: 'M061',
      next: undefined,
      family: '삼각형 법칙 계보',
      familyDescription: '중등 피타고라스 → 고등 코사인법칙 → 대학 구면 코사인법칙',
    },

    visualType: 'cosine_rule',
    relatedIds: ['H037', 'H034'],
  },

  {
    id: 'H039',
    number: 39,
    name: '평면벡터',
    latex: '\\vec{a} + \\vec{b}, \\; k\\vec{a}',
    description: '방향과 크기를 가진 양인 벡터의 덧셈과 스칼라곱',
    level: 'high',
    category: 'geometry',
    tags: ['벡터', '평면벡터', '벡터합', '스칼라곱', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '방향과 크기를 동시에 나타내는 수. 게임 캐릭터 이동에 쓰여!',

    principle: `
      <strong>벡터</strong>는 크기(magnitude)와 방향(direction)을 동시에 가진 양이야.<br><br>
      <strong>성분 표현</strong><br>
      벡터 a = (a₁, a₂), 크기 |a| = √(a₁²+a₂²)<br><br>
      <strong>벡터 연산</strong><br>
      덧셈: (a₁,a₂)+(b₁,b₂) = (a₁+b₁, a₂+b₂)<br>
      스칼라곱: k(a₁,a₂) = (ka₁, ka₂)<br><br>
      <strong>기하학적 의미</strong><br>
      벡터 합: 평행사변형 법칙 또는 삼각형 법칙<br>
      스칼라곱: 방향은 유지, 크기만 k배<br><br>
      <strong>위치벡터</strong><br>
      점 P(x,y)의 위치벡터 OP = (x,y)
    `,

    story: `
      벡터 개념은 19세기 <strong>해밀턴</strong>과 <strong>그래스만</strong>에 의해 탄생했어.<br><br>
      해밀턴은 3차원 회전을 표현하려다 사원수(quaternion)를 발명했고,
      이로부터 벡터가 분리되어 나왔지. <strong>기브스</strong>와 <strong>헤비사이드</strong>가
      현대적 벡터 표기법을 확립했어. 벡터는 물리학, 공학, 컴퓨터 그래픽의 필수 언어야.
    `,

    realLife: [
      { icon: '🎮', title: '게임 개발', desc: '캐릭터 이동, 총알 방향 등을 벡터로 계산한다' },
      { icon: '✈️', title: '항공 역학', desc: '양력, 항력, 추력 등 힘의 합성을 벡터 덧셈으로' },
      { icon: '🤖', title: 'AI 임베딩', desc: '단어를 벡터로 표현해 의미 유사도를 계산 (Word2Vec)' },
    ],

    sliders: [
      { name: 'a1', label: 'a의 x성분', min: -5, max: 5, default: 3, step: 1 },
      { name: 'a2', label: 'a의 y성분', min: -5, max: 5, default: 2, step: 1 },
      { name: 'b1', label: 'b의 x성분', min: -5, max: 5, default: 1, step: 1 },
      { name: 'b2', label: 'b의 y성분', min: -5, max: 5, default: -1, step: 1 },
    ],

    example: {
      question: 'a=(3,4), b=(-1,2)일 때 2a+b와 |2a+b|를 구하라.',
      answer: '2a+b=(5,10), |2a+b|=5√5',
      steps: [
        '2a = 2(3,4) = (6,8)',
        '2a+b = (6,8)+(-1,2) = (5,10)',
        '|2a+b| = √(5²+10²) = √(25+100)',
        '= √125 = 5√5',
      ],
      hints: [
        '힌트 1: 먼저 2a를 구해봐.',
        '힌트 2: 성분별로 더해: (6+(-1), 8+2) = (5,10).',
        '힌트 3: 크기는 √(5²+10²)야.',
      ],
      otherApproaches: [
        { name: '그래프 작도', desc: '좌표평면에 2a와 b를 그리고 삼각형 법칙으로 합벡터를 확인해봐.' },
      ],
    },

    evolution: {
      prev: 'H037',
      next: undefined,
      family: '벡터 계보',
      familyDescription: '고등 평면벡터 → 벡터 내적 → 대학 선형대수학',
    },

    visualType: 'vector_2d',
    relatedIds: ['H040', 'H037'],
  },

  {
    id: 'H040',
    number: 40,
    name: '벡터의 내적',
    latex: '\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta',
    description: '두 벡터의 방향 유사도를 나타내는 스칼라 연산',
    level: 'high',
    category: 'geometry',
    tags: ['내적', '벡터', '코사인유사도', '직교', '고2', '공통수학2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '두 벡터가 얼마나 같은 방향인지. AI 추천 알고리즘의 핵심이야!',

    principle: `
      <strong>벡터의 내적(dot product)</strong>은 두 가지 정의가 있어.<br><br>
      <strong>정의 1 (기하적)</strong><br>
      a·b = |a||b|cosθ (θ는 두 벡터 사이의 각)<br><br>
      <strong>정의 2 (성분)</strong><br>
      a=(a₁,a₂), b=(b₁,b₂)일 때<br>
      a·b = a₁b₁ + a₂b₂<br><br>
      <strong>성질</strong><br>
      ① a·b = 0 ⟺ a⊥b (직교)<br>
      ② cosθ = (a·b)/(|a||b|)<br>
      ③ a·a = |a|²<br><br>
      <strong>코사인 유사도</strong><br>
      cosθ = (a·b)/(|a||b|)는 방향의 유사도를 -1~1로 나타내.
    `,

    story: `
      내적은 <strong>그래스만</strong>과 <strong>해밀턴</strong>이 독립적으로 발견했어.<br><br>
      물리학에서 일(Work)은 힘과 이동의 내적 W=F·d·cosθ야. 이 간단한 연산이
      물리학의 에너지 개념을 수학적으로 표현하는 핵심 도구가 되었지.<br><br>
      현대에는 <strong>코사인 유사도</strong>라는 이름으로 AI 추천 시스템, 검색 엔진,
      자연어 처리 등에서 핵심적으로 쓰여.
    `,

    realLife: [
      { icon: '🤖', title: 'AI 추천', desc: '사용자 벡터와 아이템 벡터의 내적 = 추천 점수 (넷플릭스, 유튜브)' },
      { icon: '⚡', title: '물리학 (일)', desc: 'W = F·d·cosθ, 힘의 방향과 이동 방향의 내적이 한 일' },
      { icon: '🔍', title: '검색 엔진', desc: '검색어와 문서의 벡터 내적(코사인 유사도)으로 관련성 측정' },
    ],

    sliders: [
      { name: 'a1', label: 'a의 x성분', min: -5, max: 5, default: 3, step: 1 },
      { name: 'a2', label: 'a의 y성분', min: -5, max: 5, default: 4, step: 1 },
      { name: 'b1', label: 'b의 x성분', min: -5, max: 5, default: 2, step: 1 },
      { name: 'b2', label: 'b의 y성분', min: -5, max: 5, default: -1, step: 1 },
    ],

    example: {
      question: 'a=(1,√3), b=(2,0)일 때 두 벡터 사이의 각 θ를 구하라.',
      answer: '60°',
      steps: [
        'a·b = 1×2 + √3×0 = 2',
        '|a| = √(1+3) = 2',
        '|b| = √(4+0) = 2',
        'cosθ = (a·b)/(|a||b|) = 2/(2×2) = 1/2',
        'θ = 60°',
      ],
      hints: [
        '힌트 1: 먼저 a·b를 성분으로 계산해.',
        '힌트 2: |a|와 |b|도 구해.',
        '힌트 3: cosθ=1/2이면 θ는 몇 도?',
      ],
      otherApproaches: [
        { name: '기하적 해석', desc: 'b=(2,0)은 x축 방향이고, a=(1,√3)은 60° 방향이므로 θ=60°로 직관적으로도 알 수 있어.' },
      ],
    },

    evolution: {
      prev: 'H039',
      next: undefined,
      family: '벡터 계보',
      familyDescription: '평면벡터 → 벡터 내적 → 대학 내적공간·선형대수학',
    },

    visualType: 'dot_product',
    relatedIds: ['H039', 'H038'],
  },

  // ============================================================
  // 고2 – 미적분Ⅰ (H041~H055)
  // ============================================================
  {
    id: 'H041',
    number: 41,
    name: '수열의 극한',
    latex: '\\lim_{n \\to \\infty} a_n = L',
    description: '수열 {aₙ}에서 n이 무한히 커질 때 aₙ이 수렴하는 값 L',
    level: 'high',
    category: 'calculus',
    tags: ['수열', '극한', '수렴', '발산', '미적분', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '무한히 가면 어디로 가나? 극한값이 그 답이야!',

    principle: `
      수열 {a<sub>n</sub>}에서 n이 한없이 커질 때, a<sub>n</sub>의 값이 일정한 수 L에 한없이 가까워지면<br>
      "수열 {a<sub>n</sub>}은 <strong>L에 수렴</strong>한다"고 하고, L을 <strong>극한값</strong>이라 해.<br><br>
      <strong>기본 성질</strong><br>
      ① lim(a<sub>n</sub> ± b<sub>n</sub>) = lim a<sub>n</sub> ± lim b<sub>n</sub><br>
      ② lim(a<sub>n</sub> · b<sub>n</sub>) = lim a<sub>n</sub> · lim b<sub>n</sub><br>
      ③ lim(a<sub>n</sub> / b<sub>n</sub>) = lim a<sub>n</sub> / lim b<sub>n</sub> (분모 ≠ 0)<br><br>
      <strong>핵심 극한:</strong> lim(1/n) = 0, lim(1/n<sup>2</sup>) = 0<br><br>
      다항식 분수의 극한은 <strong>최고차항으로 나누기</strong> 전략이 핵심이야.
    `,

    story: `
      극한 개념은 <strong>아르키메데스</strong>가 원의 넓이를 구하며 직관적으로 사용했어.<br><br>
      하지만 엄밀한 정의는 19세기 <strong>코시(Cauchy)</strong>와 <strong>바이어슈트라스(Weierstrass)</strong>가
      ε-N 논법으로 완성했지. "무한히 가까이 간다"는 모호한 표현을 수학적으로 정확하게 만든 거야.<br><br>
      이 혁명 덕분에 미적분학이 논리적 토대 위에 서게 됐고,
      현대 해석학의 문이 열렸어.
    `,

    realLife: [
      { icon: '📡', title: '신호 수렴', desc: 'GPS 위성 신호가 반복 보정을 거치며 실제 위치에 수렴하는 과정' },
      { icon: '💊', title: '약물 농도', desc: '약을 반복 복용하면 혈중 농도가 일정한 정상 상태에 수렴한다' },
      { icon: '🤖', title: 'AI 학습', desc: '딥러닝 모델의 손실 함수가 반복 학습을 통해 최솟값에 수렴' },
    ],

    sliders: [
      { name: 'n', label: '항 번호 n', min: 1, max: 100, default: 10, step: 1 },
      { name: 'r', label: '공비 r (|r|<1)', min: -0.9, max: 0.9, default: 0.5, step: 0.1 },
    ],

    example: {
      question: 'lim(n→∞) (3n² + 2n) / (n² + 1) 을 구하라.',
      answer: '3',
      steps: [
        '분자와 분모를 최고차항 n²으로 나눈다.',
        '(3 + 2/n) / (1 + 1/n²)',
        'n→∞일 때 2/n → 0, 1/n² → 0',
        '따라서 극한값은 3/1 = 3',
      ],
      hints: [
        '힌트 1: 분자·분모의 최고차 항의 차수가 같은지 확인해봐.',
        '힌트 2: 최고차항 n²으로 분자·분모를 나눠봐.',
        '힌트 3: 1/n, 1/n² 등은 n→∞일 때 모두 0으로 수렴해.',
      ],
      otherApproaches: [
        { name: '계수비 활용', desc: '분자·분모의 최고차항 차수가 같으면 극한값 = 최고차항 계수의 비 = 3/1 = 3' },
      ],
    },

    evolution: { prev: 'H026', next: undefined, family: '수열에서 극한으로', familyDescription: '등차수열 → 등비수열 → 수열의 극한으로 확장' },

    visualType: 'seq_limit',
    relatedIds: ['H026', 'H027', 'H042', 'H043'],
  },

  {
    id: 'H042',
    number: 42,
    name: '급수',
    latex: '\\sum_{n=1}^{\\infty} a_n',
    description: '무한개의 항을 더한 합. 수렴할 수도 발산할 수도 있다',
    level: 'high',
    category: 'calculus',
    tags: ['급수', '무한합', '수렴', '등비급수', '미적분', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '무한히 더해도 유한한 값이 나올 수 있어. 제논의 역설 해결!',

    principle: `
      급수란 수열의 각 항을 무한히 더한 것이야.<br><br>
      <strong>부분합</strong> S<sub>n</sub> = a<sub>1</sub> + a<sub>2</sub> + ... + a<sub>n</sub>에서<br>
      lim S<sub>n</sub> = S가 존재하면 "급수가 <strong>S에 수렴</strong>한다"고 해.<br><br>
      <strong>등비급수 핵심:</strong><br>
      |r| < 1일 때 Σ ar<sup>n-1</sup> = a / (1-r)<br>
      |r| ≥ 1이면 발산<br><br>
      <strong>수렴 필요조건:</strong> Σa<sub>n</sub>이 수렴하면 lim a<sub>n</sub> = 0 (역은 성립 안 함!)
    `,

    story: `
      고대 그리스의 <strong>제논</strong>은 "아킬레스와 거북이" 역설을 제시했어.<br><br>
      아킬레스가 거북이를 따라잡으려면 무한히 많은 구간을 지나야 하니 영원히 못 따라잡는다?
      하지만 등비급수를 이용하면 1/2 + 1/4 + 1/8 + ... = 1로, <strong>무한 합이 유한</strong>함을 증명할 수 있어.<br><br>
      이 발견은 수학사에서 무한을 다루는 첫걸음이었어.
    `,

    realLife: [
      { icon: '🏃', title: '제논의 역설', desc: '무한히 쪼갠 거리도 등비급수로 합산하면 유한한 시간에 도달' },
      { icon: '💰', title: '영구연금', desc: '매년 이자가 줄어드는 영구연금의 현재 가치 = 등비급수의 합' },
      { icon: '🤖', title: 'AI 감쇠 학습률', desc: '학습률을 기하적으로 줄여가며 합산 — 등비급수 원리' },
    ],

    sliders: [
      { name: 'a', label: '첫째 항 a', min: 0.1, max: 5, default: 1, step: 0.1 },
      { name: 'r', label: '공비 r', min: -0.9, max: 0.9, default: 0.5, step: 0.05 },
      { name: 'terms', label: '항의 수', min: 1, max: 50, default: 10, step: 1 },
    ],

    example: {
      question: '등비급수 Σ(n=1,∞) 3·(1/2)^(n-1) 의 합을 구하라.',
      answer: '6',
      steps: [
        '첫째 항 a = 3, 공비 r = 1/2',
        '|r| = 1/2 < 1 이므로 수렴한다.',
        '등비급수의 합 공식: S = a/(1-r)',
        'S = 3/(1-1/2) = 3/(1/2) = 6',
      ],
      hints: [
        '힌트 1: 등비급수의 수렴 조건(|r|<1)을 먼저 확인해봐.',
        '힌트 2: 첫째 항 a와 공비 r을 정확히 파악해.',
        '힌트 3: S = a/(1-r) 공식에 대입해봐.',
      ],
      otherApproaches: [
        { name: '부분합 극한', desc: 'S_n = 3(1-(1/2)^n)/(1-1/2) = 6(1-(1/2)^n) → n→∞일 때 S_n → 6' },
      ],
    },

    evolution: { prev: 'H041', next: undefined, family: '수열에서 급수로', familyDescription: '수열의 극한 → 급수 → 적분으로 이어지는 무한의 계보' },

    visualType: 'series',
    relatedIds: ['H041', 'H027', 'H052'],
  },

  {
    id: 'H043',
    number: 43,
    name: '함수의 극한',
    latex: '\\lim_{x \\to a} f(x) = L',
    description: 'x가 a에 한없이 가까워질 때 f(x)가 수렴하는 값 L',
    level: 'high',
    category: 'calculus',
    tags: ['함수', '극한', '수렴', '좌극한', '우극한', '미적분', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: 'x가 a에 가까워질 때 f(x)는 어디로 가나?',

    principle: `
      함수 f(x)에서 x가 a에 한없이 가까워질 때, f(x)가 일정한 값 L에 수렴하면<br>
      lim(x→a) f(x) = L 이라 써.<br><br>
      <strong>좌극한과 우극한</strong><br>
      ① 좌극한: lim(x→a<sup>-</sup>) f(x) — 왼쪽에서 접근<br>
      ② 우극한: lim(x→a<sup>+</sup>) f(x) — 오른쪽에서 접근<br>
      ③ 극한이 존재하려면 <strong>좌극한 = 우극한</strong>이어야 해.<br><br>
      <strong>기본 공식:</strong> lim(x→a) [f(x)±g(x)] = lim f(x) ± lim g(x)
    `,

    story: `
      함수의 극한 개념은 <strong>뉴턴</strong>이 미분을 발명하면서 처음 직관적으로 사용했어.<br><br>
      하지만 "한없이 가까워진다"는 표현이 너무 모호했지. 19세기 <strong>코시</strong>가 ε-δ 논법으로
      "임의의 양수 ε에 대해 적절한 δ가 존재하여..."라는 엄밀한 정의를 만들었어.<br><br>
      이 정의가 미적분학의 논리적 기초가 됐고, 수학의 엄밀성 혁명을 이끌었어.
    `,

    realLife: [
      { icon: '🚀', title: '로켓 발사 시점', desc: '카운트다운에서 t→0일 때 추력, 가속도 등의 극한값으로 발사 조건 판단' },
      { icon: '📈', title: '경제학 한계비용', desc: '생산량 변화가 0에 가까울 때의 비용 변화율 = 한계비용' },
      { icon: '🤖', title: 'AI 손실 함수', desc: '학습 파라미터가 최적값에 접근할 때 손실 함수의 극한' },
    ],

    sliders: [
      { name: 'a', label: '접근점 a', min: -5, max: 5, default: 2, step: 0.5 },
      { name: 'dx', label: 'x-a 거리', min: 0.01, max: 2, default: 1, step: 0.01 },
    ],

    example: {
      question: 'lim(x→1) (x²-1)/(x-1) 을 구하라.',
      answer: '2',
      steps: [
        'x=1을 대입하면 0/0 부정형이 된다.',
        '분자를 인수분해: x²-1 = (x+1)(x-1)',
        '(x+1)(x-1)/(x-1) = x+1 (x≠1)',
        'lim(x→1)(x+1) = 1+1 = 2',
      ],
      hints: [
        '힌트 1: 먼저 x=1을 직접 대입해봐. 0/0이 되지?',
        '힌트 2: 분자 x²-1을 인수분해해봐.',
        '힌트 3: 공통인수를 약분한 뒤 극한을 구해봐.',
      ],
      otherApproaches: [
        { name: '수치적 접근', desc: 'x=0.9, 0.99, 0.999를 대입하면 f(x)=1.9, 1.99, 1.999 → 2로 수렴' },
      ],
    },

    evolution: { prev: 'H041', next: undefined, family: '극한의 확장', familyDescription: '수열의 극한 → 함수의 극한 → 미분으로 이어지는 해석학의 근간' },

    visualType: 'func_limit',
    relatedIds: ['H041', 'H044', 'H045'],
  },

  {
    id: 'H044',
    number: 44,
    name: '연속함수',
    latex: '\\lim_{x \\to a} f(x) = f(a)',
    description: '함수가 점 a에서 끊기지 않고 이어지는 조건',
    level: 'high',
    category: 'calculus',
    tags: ['연속', '연속함수', '불연속', '중간값정리', '미적분', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '그래프를 펜을 떼지 않고 그릴 수 있으면 연속이야!',

    principle: `
      함수 f(x)가 x=a에서 <strong>연속</strong>이려면 세 가지 조건이 모두 성립해야 해:<br><br>
      ① f(a)가 정의되어 있다.<br>
      ② lim(x→a) f(x)가 존재한다.<br>
      ③ lim(x→a) f(x) = f(a)<br><br>
      <strong>중간값 정리:</strong> f가 [a, b]에서 연속이고 f(a) ≠ f(b)이면,
      f(a)와 f(b) 사이의 모든 값을 적어도 한 번 지나간다.<br><br>
      이것은 방정식의 근의 존재성을 증명하는 강력한 도구야.
    `,

    story: `
      연속의 개념은 직관적으로 "끊기지 않는 곡선"이었지만, 19세기에 와서
      <strong>바이어슈트라스</strong>가 "연속이지만 어디서도 미분 불가능한 함수"를 발견하면서
      수학자들은 연속과 미분이 다른 개념임을 깨달았어.<br><br>
      <strong>볼차노</strong>의 중간값 정리는 "연속함수는 중간값을 반드시 지나간다"는 것으로,
      방정식의 근이 존재함을 보장하는 수학의 핵심 정리가 됐어.
    `,

    realLife: [
      { icon: '🌡️', title: '기온 변화', desc: '하루 중 기온이 15°C와 25°C를 기록했으면 그 사이 모든 온도를 지남 (중간값 정리)' },
      { icon: '📱', title: '터치스크린', desc: '손가락 위치가 연속적으로 변하므로 터치 궤적을 부드러운 곡선으로 추적 가능' },
      { icon: '🤖', title: '활성화 함수', desc: 'AI에서 ReLU는 연속이지만 x=0에서 미분불가능 — 연속 ≠ 미분가능' },
    ],

    sliders: [
      { name: 'a', label: '점 a', min: -5, max: 5, default: 0, step: 0.5 },
      { name: 'type', label: '불연속 종류 (0=연속, 1=제거, 2=점프)', min: 0, max: 2, default: 0, step: 1 },
    ],

    example: {
      question: 'f(x) = (x²-4)/(x-2) (x≠2), f(2)=k일 때 x=2에서 연속이 되도록 하는 k의 값을 구하라.',
      answer: '4',
      steps: [
        'lim(x→2) f(x)를 구한다.',
        '(x²-4)/(x-2) = (x+2)(x-2)/(x-2) = x+2 (x≠2)',
        'lim(x→2)(x+2) = 4',
        '연속 조건 lim f(x) = f(2)이므로 k = 4',
      ],
      hints: [
        '힌트 1: 연속의 세 가지 조건을 떠올려봐.',
        '힌트 2: 먼저 x→2일 때 극한값을 구해봐. 분자를 인수분해!',
        '힌트 3: 극한값이 4이므로 f(2) = k = 4이어야 연속이야.',
      ],
      otherApproaches: [
        { name: '그래프 관찰', desc: 'y = x+2 그래프에서 x=2일 때 y=4이므로 빈 점을 채우면 k=4' },
      ],
    },

    evolution: { prev: 'H043', next: undefined, family: '극한에서 연속으로', familyDescription: '함수의 극한 → 연속 → 미분가능성으로 조건이 강화' },

    visualType: 'continuity',
    relatedIds: ['H043', 'H045'],
  },

  // ★★★ KEY FORMULA: H045 미분계수 — EXTRA DETAIL ★★★
  {
    id: 'H045',
    number: 45,
    name: '미분계수',
    latex: "f'(a) = \\lim_{h \\to 0} \\frac{f(a+h)-f(a)}{h}",
    description: '함수 f(x)의 x=a에서의 순간변화율 (접선의 기울기)',
    level: 'high',
    category: 'calculus',
    tags: ['미분계수', '순간변화율', '접선', '기울기', '미적분', '수능', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '순간 속도, 접선의 기울기 — 미분이 이걸 계산해줘!',

    principle: `
      <strong>미분계수</strong>는 함수 f(x)의 x=a에서의 <strong>순간변화율</strong>이야.<br><br>
      <strong>정의:</strong><br>
      f'(a) = lim(h→0) [f(a+h) - f(a)] / h<br><br>
      <strong>기하학적 의미:</strong><br>
      h가 0에 가까워지면 할선(secant line)이 <strong>접선(tangent line)</strong>이 돼.<br>
      f'(a)는 곡선 y=f(x) 위의 점 (a, f(a))에서의 접선의 기울기야.<br><br>
      <strong>물리학적 의미:</strong><br>
      위치 함수 s(t)의 미분계수 s'(t₀)는 시각 t₀에서의 <strong>순간속도</strong>야.<br><br>
      <strong>미분가능 조건:</strong><br>
      ① f(x)가 x=a에서 연속이어야 한다 (필요조건)<br>
      ② 좌미분계수 = 우미분계수여야 한다<br>
      ③ 미분가능 ⟹ 연속 (역은 성립 안 함!)<br><br>
      <strong>평균변화율 vs 순간변화율:</strong><br>
      평균변화율 = [f(b)-f(a)]/(b-a) → b→a이면 순간변화율 f'(a)
    `,

    story: `
      17세기, <strong>뉴턴</strong>과 <strong>라이프니츠</strong>가 독립적으로 미분을 발명했어.<br><br>
      뉴턴은 물체의 순간 속도를 구하기 위해 "유율법(fluxion)"을 만들었고,
      라이프니츠는 접선의 기울기를 구하기 위해 "미분법(differential)"을 개발했지.<br><br>
      두 사람의 우선권 논쟁은 수학 역사상 가장 격렬한 분쟁이었어.
      결국 두 접근이 모두 같은 개념임이 밝혀졌고, 오늘날 우리는 라이프니츠의 표기법 dy/dx와
      뉴턴의 표기법 f'(x)를 모두 사용해.<br><br>
      미분의 발명은 물리학, 공학, 경제학 등 거의 모든 과학 분야에 혁명을 가져왔어.
      <strong>과학혁명의 수학적 엔진</strong>이라 불릴 만하지.
    `,

    realLife: [
      { icon: '🏎️', title: '순간 속도', desc: '자동차 속도계가 보여주는 값이 바로 위치 함수의 미분계수. s(t)에서 s\'(t₀)가 그 순간의 속도' },
      { icon: '📈', title: '경제학 한계분석', desc: '생산량 Q에 따른 비용 C(Q)의 미분계수 C\'(Q)가 한계비용. 기업의 최적 생산량 결정의 핵심' },
      { icon: '🤖', title: 'AI 경사하강법', desc: '손실 함수의 미분계수(기울기)를 구해 파라미터를 업데이트 — 딥러닝의 핵심 알고리즘' },
    ],

    sliders: [
      { name: 'a', label: '점 a', min: -3, max: 3, default: 1, step: 0.1 },
      { name: 'h', label: 'h (→0)', min: 0.01, max: 2, default: 1, step: 0.01 },
      { name: 'power', label: '함수 차수', min: 1, max: 4, default: 2, step: 1 },
    ],

    example: {
      question: 'f(x) = x³ 일 때 f\'(2)를 미분계수의 정의를 이용하여 구하라.',
      answer: '12',
      steps: [
        'f\'(2) = lim(h→0) [f(2+h) - f(2)] / h',
        '= lim(h→0) [(2+h)³ - 8] / h',
        '(2+h)³ = 8 + 12h + 6h² + h³ 이므로',
        '= lim(h→0) (12h + 6h² + h³) / h',
        '= lim(h→0) (12 + 6h + h²)',
        '= 12',
      ],
      hints: [
        '힌트 1: 미분계수의 정의 f\'(a) = lim(h→0) [f(a+h)-f(a)]/h에 a=2를 대입해.',
        '힌트 2: (2+h)³을 전개해봐. 이항정리 또는 직접 곱셈으로!',
        '힌트 3: 분자에서 상수항 8이 사라지고, 나머지를 h로 약분해봐.',
      ],
      otherApproaches: [
        { name: '미분 공식 활용', desc: '(x³)\' = 3x²이므로 f\'(2) = 3×4 = 12. 정의를 익힌 뒤에는 공식이 빠르다!' },
        { name: 'x→a 형태', desc: 'f\'(2) = lim(x→2) (x³-8)/(x-2) = lim(x→2) (x-2)(x²+2x+4)/(x-2) = 4+4+4 = 12' },
      ],
    },

    evolution: { prev: 'H043', next: undefined, family: '극한에서 미분으로', familyDescription: '함수의 극한 → 미분계수 → 도함수 → 미분 공식으로 체계화' },

    visualType: 'derivative_coeff',
    relatedIds: ['H043', 'H044', 'H046', 'H047', 'H050'],
  },

  {
    id: 'H046',
    number: 46,
    name: '도함수',
    latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h)-f(x)}{h}",
    description: '모든 점에서의 미분계수를 함수로 표현한 것',
    level: 'high',
    category: 'calculus',
    tags: ['도함수', '미분', '변화율', '미적분', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '모든 점에서의 순간 변화율. 자동차 속도계가 이 원리야!',

    principle: `
      <strong>도함수</strong>는 미분계수를 x의 함수로 일반화한 것이야.<br><br>
      f'(x) = lim(h→0) [f(x+h) - f(x)] / h<br><br>
      미분계수 f'(a)는 특정 점에서의 값이지만, 도함수 f'(x)는 <strong>모든 x</strong>에서의 순간변화율을 한꺼번에 나타내.<br><br>
      <strong>표기법:</strong><br>
      ① 라이프니츠: dy/dx, df/dx<br>
      ② 뉴턴: f'(x), y'<br>
      ③ 라그랑주: D<sub>x</sub>f<br><br>
      도함수를 구하는 과정을 <strong>미분한다</strong>고 해.
    `,

    story: `
      뉴턴과 라이프니츠의 표기법 전쟁은 수학사의 유명한 에피소드야.<br><br>
      영국은 뉴턴의 점 표기법(ẋ)을, 유럽 대륙은 라이프니츠의 dy/dx를 사용했어.
      결과적으로 라이프니츠 표기법이 연쇄법칙 등에서 더 편리해서 세계 표준이 됐지.<br><br>
      이 때문에 영국 수학은 한동안 유럽에 뒤처졌고, 이를 "영국 수학의 잃어버린 100년"이라 부르기도 해.
    `,

    realLife: [
      { icon: '🚗', title: '속도계', desc: '위치 s(t)의 도함수 s\'(t)가 속도 함수. 속도계는 도함수 값을 실시간 표시' },
      { icon: '💹', title: '주가 변화율', desc: '주가 P(t)의 도함수 P\'(t)가 주가의 순간 변화율' },
      { icon: '🤖', title: 'AI 그래디언트', desc: '다변수 함수의 각 변수에 대한 도함수(편미분)가 그래디언트 벡터' },
    ],

    sliders: [
      { name: 'x', label: 'x 값', min: -3, max: 3, default: 1, step: 0.1 },
      { name: 'power', label: '차수 n', min: 1, max: 5, default: 2, step: 1 },
    ],

    example: {
      question: 'f(x) = 3x² - 2x + 1의 도함수 f\'(x)를 구하라.',
      answer: 'f\'(x) = 6x - 2',
      steps: [
        'f\'(x) = lim(h→0) [f(x+h)-f(x)]/h',
        'f(x+h) = 3(x+h)² - 2(x+h) + 1 = 3x² + 6xh + 3h² - 2x - 2h + 1',
        'f(x+h) - f(x) = 6xh + 3h² - 2h',
        '[f(x+h)-f(x)]/h = 6x + 3h - 2',
        'h→0이면 f\'(x) = 6x - 2',
      ],
      hints: [
        '힌트 1: f(x+h)를 전개할 때 (x+h)²을 정확히 계산해.',
        '힌트 2: f(x+h) - f(x)에서 상수항이 소거돼.',
        '힌트 3: h로 나누고 h→0을 취하면 끝!',
      ],
      otherApproaches: [
        { name: '미분 공식', desc: '(3x²)\' = 6x, (-2x)\' = -2, (1)\' = 0 → f\'(x) = 6x - 2' },
      ],
    },

    evolution: { prev: 'H045', next: undefined, family: '미분의 체계화', familyDescription: '미분계수(한 점) → 도함수(전체 함수) → 미분 공식으로 효율화' },

    visualType: 'derivative_func',
    relatedIds: ['H045', 'H047', 'H050'],
  },

  {
    id: 'H047',
    number: 47,
    name: '미분 공식',
    latex: "(x^n)' = nx^{n-1}",
    description: 'x^n의 도함수. 지수를 앞으로, 지수를 1 줄인다',
    level: 'high',
    category: 'calculus',
    tags: ['미분공식', '거듭제곱', '다항함수', '미적분', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: 'x^n을 미분하면 지수를 앞으로 꺼내고 지수를 1 줄여!',

    principle: `
      <strong>거듭제곱 미분 공식:</strong> (x<sup>n</sup>)' = nx<sup>n-1</sup><br><br>
      이 공식으로 모든 다항함수를 미분할 수 있어!<br><br>
      <strong>기본 미분 규칙:</strong><br>
      ① 상수: (c)' = 0<br>
      ② 상수배: {cf(x)}' = c·f'(x)<br>
      ③ 합: {f(x)±g(x)}' = f'(x) ± g'(x)<br>
      ④ 곱: {f(x)g(x)}' = f'(x)g(x) + f(x)g'(x)<br>
      ⑤ 몫: {f(x)/g(x)}' = [f'(x)g(x) - f(x)g'(x)] / {g(x)}²<br><br>
      <strong>증명 (이항정리):</strong> (x+h)<sup>n</sup>을 전개하면 x<sup>n</sup> + nx<sup>n-1</sup>h + ... 이므로,
      [(x+h)<sup>n</sup> - x<sup>n</sup>]/h → nx<sup>n-1</sup>
    `,

    story: `
      거듭제곱 미분 공식은 미적분의 가장 기본적인 공식이야.<br><br>
      <strong>뉴턴</strong>은 이항정리를 통해 이 공식을 일반화했고,
      정수가 아닌 실수 지수에서도 성립함을 발견했어.<br><br>
      이 단순한 공식 하나로 모든 다항함수의 미분이 가능해지면서,
      미적분이 실용적인 도구로 자리잡게 됐어.
    `,

    realLife: [
      { icon: '🏗️', title: '자유 낙하', desc: 'h(t)=½gt²에서 h\'(t)=gt. 위치 함수 미분으로 낙하 속도를 구한다' },
      { icon: '📈', title: '비용 함수', desc: 'C(x)=ax³+bx²+cx+d에서 한계비용 C\'(x)=3ax²+2bx+c' },
      { icon: '🤖', title: '다항식 회귀', desc: 'AI 회귀 모델에서 다항 함수의 기울기 계산에 직접 사용' },
    ],

    sliders: [
      { name: 'n', label: '지수 n', min: 1, max: 6, default: 3, step: 1 },
      { name: 'x', label: 'x 값', min: -3, max: 3, default: 1, step: 0.1 },
    ],

    example: {
      question: 'f(x) = 2x⁴ - 5x³ + 3x를 미분하라.',
      answer: 'f\'(x) = 8x³ - 15x² + 3',
      steps: [
        '각 항을 개별적으로 미분한다.',
        '(2x⁴)\' = 2·4x³ = 8x³',
        '(-5x³)\' = -5·3x² = -15x²',
        '(3x)\' = 3·1 = 3',
        'f\'(x) = 8x³ - 15x² + 3',
      ],
      hints: [
        '힌트 1: 각 항을 따로따로 미분해.',
        '힌트 2: (ax^n)\' = anx^(n-1) 공식을 적용해.',
        '힌트 3: 상수 계수는 그대로 두고 지수만 처리하면 돼.',
      ],
      otherApproaches: [
        { name: '정의 활용', desc: 'lim(h→0)[f(x+h)-f(x)]/h로 계산 가능하지만, 공식이 훨씬 효율적이다.' },
      ],
    },

    evolution: { prev: 'H046', next: undefined, family: '미분의 효율화', familyDescription: '미분계수 → 도함수 → 미분 공식으로 계산 효율 극대화' },

    visualType: 'diff_formula',
    relatedIds: ['H045', 'H046', 'H048', 'H051'],
  },

  {
    id: 'H048',
    number: 48,
    name: '미분의 응용 (증가/감소, 극값)',
    latex: "f'(x) > 0 \\Rightarrow \\text{증가}",
    description: '도함수의 부호로 함수의 증가/감소를 판단하고 극값을 찾는다',
    level: 'high',
    category: 'calculus',
    tags: ['증가', '감소', '극대', '극소', '극값', '미적분', '수능', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '함수가 언제 올라가고 내려가나? 도함수가 답이야!',

    principle: `
      <strong>증가/감소 판정법:</strong><br>
      ① f'(x) > 0인 구간에서 f(x)는 <strong>증가</strong><br>
      ② f'(x) < 0인 구간에서 f(x)는 <strong>감소</strong><br><br>
      <strong>극값:</strong><br>
      f'(a) = 0이고,<br>
      ① f'(x)가 +에서 -로 바뀌면 → x=a에서 <strong>극대</strong><br>
      ② f'(x)가 -에서 +로 바뀌면 → x=a에서 <strong>극소</strong><br>
      ③ 부호가 안 바뀌면 → 극값 아님 (변곡점일 수 있음)<br><br>
      f'(x)=0이라고 반드시 극값은 아니야! x³에서 f'(0)=0이지만 극값 아님.
    `,

    story: `
      페르마(Fermat)는 17세기에 "극값에서 접선의 기울기는 0"이라는 사실을 발견했어.<br><br>
      이것이 오늘날의 "f'(a) = 0이면 극값 후보"라는 정리의 원형이야.
      뉴턴과 라이프니츠가 미분을 체계화한 뒤, 이 아이디어는 <strong>최적화 이론</strong>의 기초가 됐어.<br><br>
      경제학의 이윤 극대화, 공학의 최적 설계 등 현대 사회 곳곳에 쓰이고 있지.
    `,

    realLife: [
      { icon: '📈', title: '이윤 극대화', desc: '이윤 함수 P(x)의 극대점을 찾아 최적 생산량 결정' },
      { icon: '🚀', title: '로켓 최고점', desc: '높이 함수 h(t)에서 h\'(t)=0인 시점이 최고 높이 도달 시각' },
      { icon: '🤖', title: 'AI 최적화', desc: '손실 함수의 극소를 찾는 과정이 딥러닝 학습의 핵심' },
    ],

    sliders: [
      { name: 'a', label: '계수 a', min: -3, max: 3, default: 1, step: 0.5 },
      { name: 'b', label: '계수 b', min: -6, max: 6, default: -3, step: 0.5 },
    ],

    example: {
      question: 'f(x) = x³ - 3x + 2의 극대와 극소를 구하라.',
      answer: '극대: (−1, 4), 극소: (1, 0)',
      steps: [
        'f\'(x) = 3x² - 3 = 3(x²-1) = 3(x+1)(x-1)',
        'f\'(x) = 0에서 x = -1 또는 x = 1',
        'x < -1: f\'(x) > 0 (증가), -1 < x < 1: f\'(x) < 0 (감소), x > 1: f\'(x) > 0 (증가)',
        'x=-1에서 +→−이므로 극대: f(-1) = -1+3+2 = 4',
        'x=1에서 −→+이므로 극소: f(1) = 1-3+2 = 0',
      ],
      hints: [
        '힌트 1: 먼저 f\'(x)를 구해서 인수분해해.',
        '힌트 2: f\'(x)=0의 해를 구하고, 각 구간에서 f\'(x)의 부호를 확인해.',
        '힌트 3: 부호가 +→−이면 극대, −→+이면 극소야.',
      ],
      otherApproaches: [
        { name: '이계도함수 판정법', desc: 'f\'\'(x)=6x. f\'\'(-1)=-6<0이므로 극대, f\'\'(1)=6>0이므로 극소.' },
      ],
    },

    evolution: { prev: 'H047', next: undefined, family: '미분의 활용', familyDescription: '미분 공식 → 증감 판정 → 최대·최솟값 → 최적화로 확장' },

    visualType: 'diff_application',
    relatedIds: ['H047', 'H049', 'H050'],
  },

  {
    id: 'H049',
    number: 49,
    name: '최대·최솟값',
    latex: "f'(x) = 0 \\text{인 점 탐색}",
    description: '닫힌 구간에서 함수의 최댓값과 최솟값을 구하는 방법',
    level: 'high',
    category: 'calculus',
    tags: ['최댓값', '최솟값', '최적화', '극값', '미적분', '수능', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '이익 최대화, 비용 최소화 — 경제학의 핵심이 미분이야!',

    principle: `
      닫힌 구간 [a, b]에서 연속함수 f(x)의 최대·최솟값을 구하는 방법:<br><br>
      <strong>Step 1:</strong> f'(x) = 0인 x를 구간 내에서 찾는다.<br>
      <strong>Step 2:</strong> 극값 후보와 양 끝점의 함수값을 비교한다.<br>
      <strong>Step 3:</strong> 가장 큰 값이 최댓값, 가장 작은 값이 최솟값.<br><br>
      <strong>주의:</strong><br>
      ① 열린 구간에서는 최대·최솟값이 존재하지 않을 수 있어.<br>
      ② 닫힌 구간에서 연속이면 최대·최솟값이 <strong>반드시 존재</strong> (최대·최소 정리)
    `,

    story: `
      최적화 문제는 수학의 가장 실용적인 분야 중 하나야.<br><br>
      <strong>페르마</strong>의 극값 조건에서 시작해 <strong>라그랑주</strong>의 조건부 최적화,
      현대의 <strong>선형 계획법</strong>과 <strong>볼록 최적화</strong>로 이어졌어.<br><br>
      기업의 이윤 극대화, 물류의 비용 최소화, AI의 학습 최적화 등
      현대 사회의 거의 모든 의사결정에 최적화가 사용되고 있어.
    `,

    realLife: [
      { icon: '📦', title: '포장 최적화', desc: '주어진 부피로 표면적 최소인 상자 설계 — 재료비 절감' },
      { icon: '💰', title: '이윤 극대화', desc: '수입 R(x)와 비용 C(x)의 차이 P(x)가 최대인 생산량 찾기' },
      { icon: '🤖', title: 'AI 하이퍼파라미터', desc: '검증 손실을 최소화하는 학습률, 배치 크기 등의 최적 조합 탐색' },
    ],

    sliders: [
      { name: 'a', label: '구간 시작', min: -5, max: 0, default: -2, step: 0.5 },
      { name: 'b', label: '구간 끝', min: 0, max: 5, default: 3, step: 0.5 },
    ],

    example: {
      question: 'f(x) = x³ - 6x² + 9x + 1의 [0, 4]에서의 최댓값과 최솟값을 구하라.',
      answer: '최댓값: 5 (x=1), 최솟값: 1 (x=0 또는 x=3)',
      steps: [
        'f\'(x) = 3x² - 12x + 9 = 3(x-1)(x-3)',
        'f\'(x) = 0에서 x=1, x=3 (둘 다 [0,4] 내)',
        'f(0) = 1, f(1) = 1-6+9+1 = 5, f(3) = 27-54+27+1 = 1, f(4) = 64-96+36+1 = 5',
        '최댓값: 5 (x=1, x=4), 최솟값: 1 (x=0, x=3)',
      ],
      hints: [
        '힌트 1: f\'(x)=0인 점과 구간 양 끝점을 모두 확인해야 해.',
        '힌트 2: f\'(x) = 3x²-12x+9를 인수분해해.',
        '힌트 3: f(0), f(1), f(3), f(4)를 계산해서 비교해봐.',
      ],
      otherApproaches: [
        { name: '증감표 작성', desc: '구간 내 증감을 파악하면 최대·최소 후보를 직관적으로 찾을 수 있다.' },
      ],
    },

    evolution: { prev: 'H048', next: undefined, family: '미분과 최적화', familyDescription: '극값 판정 → 최대·최솟값 → 실전 최적화 문제 해결' },

    visualType: 'max_min',
    relatedIds: ['H048', 'H050'],
  },

  {
    id: 'H050',
    number: 50,
    name: '접선의 방정식',
    latex: 'y - f(a) = f\'(a)(x-a)',
    description: '곡선 위 한 점에서의 접선 방정식',
    level: 'high',
    category: 'calculus',
    tags: ['접선', '미분', '기울기', '방정식', '미적분', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '곡선 위 한 점에서의 접선. 물리학에서 순간 방향이야!',

    principle: `
      곡선 y=f(x) 위의 점 (a, f(a))에서의 <strong>접선의 방정식</strong>:<br><br>
      <strong>y - f(a) = f'(a)(x - a)</strong><br><br>
      ① 접점의 x좌표 a를 확인한다.<br>
      ② f'(a)를 구해 접선의 기울기를 얻는다.<br>
      ③ 점-기울기 형태로 접선의 방정식을 쓴다.<br><br>
      <strong>주의:</strong> 곡선 밖의 점에서 접선을 그을 때는<br>
      접점을 (t, f(t))로 놓고 접선이 주어진 점을 지나도록 방정식을 세워야 해.
    `,

    story: `
      접선의 개념은 고대 그리스의 <strong>아폴로니우스</strong>가 원뿔 곡선을 연구하면서 시작됐어.<br><br>
      <strong>데카르트</strong>는 대수적 방법으로 접선을 구하려 했고,
      <strong>페르마</strong>는 "근방에서 함수값이 변하지 않는 점"이라는 아이디어를 제시했지.<br><br>
      뉴턴과 라이프니츠의 미분 발명으로 접선은 f'(a)라는 단순한 공식으로 구할 수 있게 됐어.
    `,

    realLife: [
      { icon: '🎯', title: '발사체 방향', desc: '원운동하는 물체가 줄이 끊기면 접선 방향으로 날아간다' },
      { icon: '📈', title: '선형 근사', desc: '비선형 함수를 접선으로 근사하면 계산이 쉬워진다 (선형화)' },
      { icon: '🤖', title: 'AI 선형 근사', desc: '뉴런 활성화 함수의 접선으로 역전파 기울기를 계산' },
    ],

    sliders: [
      { name: 'a', label: '접점 x좌표', min: -3, max: 3, default: 1, step: 0.1 },
      { name: 'coeff', label: '이차항 계수', min: -3, max: 3, default: 1, step: 0.5 },
    ],

    example: {
      question: 'y = x² - 3x + 2 위의 점 (1, 0)에서의 접선의 방정식을 구하라.',
      answer: 'y = -x + 1',
      steps: [
        'f(x) = x² - 3x + 2, 접점은 (1, 0)',
        'f\'(x) = 2x - 3',
        'f\'(1) = 2(1) - 3 = -1 (기울기)',
        'y - 0 = -1(x - 1) → y = -x + 1',
      ],
      hints: [
        '힌트 1: 먼저 f\'(x)를 구해.',
        '힌트 2: 접점의 x좌표를 f\'(x)에 대입해서 기울기를 구해.',
        '힌트 3: 점-기울기 공식 y - y₁ = m(x - x₁)에 대입해.',
      ],
      otherApproaches: [
        { name: '그래프 확인', desc: '포물선과 접선을 그려보면 (1,0)에서 정확히 접하는지 시각적으로 확인 가능' },
      ],
    },

    evolution: { prev: 'H046', next: undefined, family: '미분과 접선', familyDescription: '도함수 → 접선의 기울기 → 접선의 방정식으로 구체화' },

    visualType: 'tangent_line',
    relatedIds: ['H045', 'H046', 'H048'],
  },

  {
    id: 'H051',
    number: 51,
    name: '부정적분',
    latex: '\\int f(x)dx = F(x) + C',
    description: '미분의 역연산. F\'(x)=f(x)인 F(x)를 찾는 것',
    level: 'high',
    category: 'calculus',
    tags: ['부정적분', '역미분', '적분상수', '미적분', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '미분의 역방향. 속도 → 거리를 구할 때 써!',

    principle: `
      <strong>부정적분</strong>은 미분의 역연산이야.<br><br>
      F'(x) = f(x)일 때, F(x)를 f(x)의 <strong>원시함수(부정적분)</strong>라 하고<br>
      ∫f(x)dx = F(x) + C 로 나타내. (C는 적분상수)<br><br>
      <strong>기본 적분 공식:</strong><br>
      ① ∫x<sup>n</sup>dx = x<sup>n+1</sup>/(n+1) + C (n≠-1)<br>
      ② ∫kdx = kx + C<br>
      ③ ∫{f(x)±g(x)}dx = ∫f(x)dx ± ∫g(x)dx<br>
      ④ ∫kf(x)dx = k∫f(x)dx<br><br>
      <strong>적분상수 C를 반드시 쓸 것!</strong> 미분하면 상수가 사라지므로 원래 함수를 유일하게 결정할 수 없어.
    `,

    story: `
      적분의 역사는 <strong>넓이 구하기</strong>에서 시작됐어.<br><br>
      아르키메데스는 포물선 아래 넓이를 "무한히 잘게 쪼개어 더하는" 방법으로 구했고,
      이것이 적분의 원형이야.<br><br>
      뉴턴과 라이프니츠가 "미분의 역연산이 곧 넓이 계산"이라는 놀라운 사실을 발견하면서
      미적분학의 기본 정리가 탄생했어. 이 연결고리 덕분에 적분이 체계적으로 가능해졌지.
    `,

    realLife: [
      { icon: '🚗', title: '거리 계산', desc: '속도 v(t)를 적분하면 이동 거리 s(t)를 얻는다' },
      { icon: '⚡', title: '전하량', desc: '전류 I(t)를 시간에 대해 적분하면 총 전하량 Q' },
      { icon: '🤖', title: 'AI 누적 손실', desc: '순간 손실률을 적분하여 전체 학습 기간의 총 손실 계산' },
    ],

    sliders: [
      { name: 'n', label: '지수 n', min: 0, max: 5, default: 2, step: 1 },
      { name: 'C', label: '적분상수 C', min: -5, max: 5, default: 0, step: 1 },
    ],

    example: {
      question: '∫(6x² - 4x + 3)dx를 구하라.',
      answer: '2x³ - 2x² + 3x + C',
      steps: [
        '각 항을 개별 적분한다.',
        '∫6x²dx = 6·x³/3 = 2x³',
        '∫(-4x)dx = -4·x²/2 = -2x²',
        '∫3dx = 3x',
        '∴ 2x³ - 2x² + 3x + C',
      ],
      hints: [
        '힌트 1: ∫x^n dx = x^(n+1)/(n+1) + C 를 각 항에 적용해.',
        '힌트 2: 계수는 그대로 두고 지수만 1 올리고 새 지수로 나눠.',
        '힌트 3: 적분상수 C를 잊지 마!',
      ],
      otherApproaches: [
        { name: '검증: 미분', desc: '(2x³-2x²+3x+C)\' = 6x²-4x+3 ✓ 미분해서 원래 함수가 나오면 정답!' },
      ],
    },

    evolution: { prev: 'H047', next: undefined, family: '미분에서 적분으로', familyDescription: '미분 공식 → 역연산으로 부정적분 → 정적분으로 확장' },

    visualType: 'indefinite_integral',
    relatedIds: ['H047', 'H052', 'H055'],
  },

  // ★★★ KEY FORMULA: H052 정적분 — EXTRA DETAIL ★★★
  {
    id: 'H052',
    number: 52,
    name: '정적분',
    latex: '\\int_a^b f(x)dx = F(b)-F(a)',
    description: '구간 [a,b]에서 f(x)의 정적분. 그래프 아래 부호 붙은 넓이',
    level: 'high',
    category: 'calculus',
    tags: ['정적분', '넓이', '적분', '미적분의기본정리', '수능', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '그래프 아래 넓이를 정확하게. 물리학·경제학 필수!',

    principle: `
      <strong>정적분</strong>은 구간 [a, b]에서 함수 f(x)의 "부호 붙은 넓이"를 구하는 연산이야.<br><br>
      <strong>미적분의 기본 정리:</strong><br>
      ∫<sub>a</sub><sup>b</sup> f(x)dx = F(b) - F(a)<br>
      (단, F'(x) = f(x))<br><br>
      <strong>핵심 성질:</strong><br>
      ① ∫<sub>a</sub><sup>a</sup> f(x)dx = 0<br>
      ② ∫<sub>a</sub><sup>b</sup> f(x)dx = -∫<sub>b</sub><sup>a</sup> f(x)dx<br>
      ③ ∫<sub>a</sub><sup>b</sup> f(x)dx = ∫<sub>a</sub><sup>c</sup> f(x)dx + ∫<sub>c</sub><sup>b</sup> f(x)dx<br>
      ④ ∫<sub>a</sub><sup>b</sup> {f(x)±g(x)}dx = ∫<sub>a</sub><sup>b</sup> f(x)dx ± ∫<sub>a</sub><sup>b</sup> g(x)dx<br><br>
      <strong>기하학적 의미:</strong><br>
      x축 위 부분은 (+), x축 아래 부분은 (−)로 계산되므로,
      실제 넓이를 구할 때는 |f(x)|를 적분해야 해.<br><br>
      <strong>리만 합과의 관계:</strong><br>
      구간을 n등분하여 직사각형 넓이의 합을 구하고 n→∞ 취하면 정적분.
      이것이 정적분의 원래 정의야.
    `,

    story: `
      정적분의 역사는 고대 <strong>아르키메데스</strong>의 "소진법"에서 시작돼.<br><br>
      아르키메데스는 포물선 아래 넓이가 외접 삼각형의 2/3임을 증명했는데,
      이것은 ∫<sub>0</sub><sup>1</sup> x²dx = 1/3과 같은 결과야.<br><br>
      17세기 <strong>리만(Riemann)</strong>이 "리만 합"으로 정적분을 엄밀하게 정의했고,
      <strong>뉴턴-라이프니츠</strong>가 "부정적분의 차이로 정적분 계산"이라는 혁명적 방법을 발견했어.<br><br>
      이 <strong>미적분의 기본 정리</strong>는 미분과 적분을 하나로 연결한 수학 역사상 가장 아름다운 정리 중 하나야.
      물리학의 운동 법칙, 경제학의 소비자 잉여, 공학의 신호 처리 등 모든 곳에서 정적분이 사용돼.
    `,

    realLife: [
      { icon: '🏗️', title: '물리학 일(Work)', desc: '힘 F(x)를 거리에 대해 적분하면 일(에너지). W = ∫F(x)dx로 엔진 출력 계산' },
      { icon: '💰', title: '소비자 잉여', desc: '수요곡선과 가격 사이의 넓이 = 소비자 잉여. 경제학 핵심 지표' },
      { icon: '🤖', title: 'AI 확률 계산', desc: '연속 확률분포에서 P(a≤X≤b) = ∫f(x)dx. 정규분포의 확률도 정적분!' },
    ],

    sliders: [
      { name: 'a', label: '적분 시작 a', min: -3, max: 2, default: 0, step: 0.5 },
      { name: 'b', label: '적분 끝 b', min: -2, max: 5, default: 3, step: 0.5 },
      { name: 'n', label: '리만 분할 수', min: 2, max: 50, default: 5, step: 1 },
    ],

    example: {
      question: '∫₀³ (x² - 2x)dx를 구하라.',
      answer: '0',
      steps: [
        '부정적분: ∫(x²-2x)dx = x³/3 - x² + C',
        'F(x) = x³/3 - x²',
        'F(3) = 27/3 - 9 = 9 - 9 = 0',
        'F(0) = 0 - 0 = 0',
        '∫₀³ (x²-2x)dx = F(3) - F(0) = 0 - 0 = 0',
        '참고: x축 위·아래 넓이가 상쇄되어 0이 된다.',
      ],
      hints: [
        '힌트 1: 먼저 부정적분 F(x)를 구해봐.',
        '힌트 2: F(b) - F(a)를 계산해.',
        '힌트 3: 결과가 0이라고 넓이가 0은 아니야! 부호가 상쇄된 거야.',
      ],
      otherApproaches: [
        { name: '리만 합 근사', desc: '구간을 n등분하여 직사각형 넓이를 더해보면 n이 커질수록 0에 수렴' },
        { name: '대칭성 관찰', desc: 'f(x)=x(x-2)는 x=0, 2에서 0이고, [0,2]에서 음, [2,3]에서 양. 넓이가 상쇄된다.' },
      ],
    },

    evolution: { prev: 'H051', next: undefined, family: '적분의 완성', familyDescription: '부정적분 → 정적분 → 넓이·속도 등 응용으로 확장' },

    visualType: 'definite_integral',
    relatedIds: ['H051', 'H053', 'H054', 'H055'],
  },

  {
    id: 'H053',
    number: 53,
    name: '넓이 (정적분 활용)',
    latex: 'S = \\int_a^b |f(x)|dx',
    description: '곡선과 x축 사이의 실제 넓이를 정적분으로 구한다',
    level: 'high',
    category: 'calculus',
    tags: ['넓이', '정적분', '활용', '절댓값', '미적분', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '곡선이 x축 아래로 가도 넓이는 양수! 절댓값이 핵심이야!',

    principle: `
      <strong>넓이 계산 핵심:</strong><br><br>
      ① <strong>곡선과 x축 사이:</strong> S = ∫<sub>a</sub><sup>b</sup> |f(x)|dx<br>
      x축 위: +그대로, x축 아래: 부호를 바꿔서 더해야 해.<br><br>
      ② <strong>두 곡선 사이:</strong> S = ∫<sub>a</sub><sup>b</sup> |f(x)-g(x)|dx<br>
      위에 있는 함수에서 아래 함수를 빼면 돼.<br><br>
      <strong>실전 전략:</strong><br>
      f(x)=0인 점을 찾아 구간을 분할하고, 각 구간에서 부호를 확인해서 적분해.
    `,

    story: `
      넓이 계산은 미적분 발명의 원래 동기 중 하나야.<br><br>
      <strong>카발리에리</strong>의 "불가분량(indivisible)" 개념부터 <strong>뉴턴</strong>의 유율법까지,
      수학자들은 곡선으로 둘러싸인 넓이를 정확히 구하려 노력했어.<br><br>
      정적분이 완성되면서 원, 포물선, 타원 등 모든 곡선의 넓이를 통일된 방법으로 구할 수 있게 됐어.
    `,

    realLife: [
      { icon: '🏞️', title: '토지 측량', desc: '불규칙한 경계의 토지 넓이를 곡선 적분으로 정밀 계산' },
      { icon: '⚡', title: '전력 소비', desc: '전력-시간 그래프 아래 넓이 = 총 에너지 소비량(kWh)' },
      { icon: '🤖', title: 'ROC 곡선', desc: 'AI 분류 모델의 성능 지표 AUC = ROC 곡선 아래 넓이' },
    ],

    sliders: [
      { name: 'a', label: '구간 시작', min: -3, max: 0, default: -1, step: 0.5 },
      { name: 'b', label: '구간 끝', min: 0, max: 5, default: 3, step: 0.5 },
    ],

    example: {
      question: 'y = x² - 4와 x축으로 둘러싸인 넓이를 구하라.',
      answer: '32/3',
      steps: [
        'x²-4 = 0에서 x = ±2 (x축과의 교점)',
        '[-2, 2]에서 x²-4 ≤ 0이므로 넓이 = -∫₋₂² (x²-4)dx',
        '= -[x³/3 - 4x]₋₂² ',
        '= -[(8/3-8) - (-8/3+8)]',
        '= -[(-16/3) - (16/3)] = -(-32/3) = 32/3',
      ],
      hints: [
        '힌트 1: 먼저 f(x)=0인 점을 구해서 적분 구간을 결정해.',
        '힌트 2: 구간에서 f(x)의 부호를 확인해. x축 아래면 부호를 바꿔야 해.',
        '힌트 3: ∫₋₂² (4-x²)dx로 계산하면 양수가 바로 나와.',
      ],
      otherApproaches: [
        { name: '대칭 활용', desc: 'f(x)=x²-4는 짝함수이므로 S = 2∫₀² (4-x²)dx = 2[4x-x³/3]₀² = 2(8-8/3) = 32/3' },
      ],
    },

    evolution: { prev: 'H052', next: undefined, family: '정적분의 활용', familyDescription: '정적분 → 넓이 계산 → 물리량 계산으로 확장' },

    visualType: 'area_integral',
    relatedIds: ['H052', 'H054'],
  },

  {
    id: 'H054',
    number: 54,
    name: '여러 가지 수열의 합',
    latex: '\\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}',
    description: '자연수의 거듭제곱의 합을 닫힌 공식으로 구하는 방법',
    level: 'high',
    category: 'sequence',
    tags: ['수열의합', '거듭제곱합', '시그마', '자연수', '공식', '고2', '수학II'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '1²+2²+3²+...+n²을 한 번에 구하는 공식!',

    principle: `
      <strong>자연수 거듭제곱의 합 공식:</strong><br><br>
      ① ∑k = n(n+1)/2<br>
      ② <strong>∑k² = n(n+1)(2n+1)/6</strong><br>
      ③ ∑k³ = {n(n+1)/2}² = (∑k)²<br><br>
      <strong>∑k²의 유도 (텔레스코핑):</strong><br>
      (k+1)³ - k³ = 3k² + 3k + 1 을 이용<br>
      k=1부터 n까지 더하면:<br>
      (n+1)³ - 1 = 3∑k² + 3∑k + n<br>
      정리하면 ∑k² = n(n+1)(2n+1)/6<br><br>
      <strong>놀라운 사실:</strong> ∑k³ = (∑k)² — 세제곱의 합은 일차합의 제곱!
    `,

    story: `
      자연수의 합 공식은 어린 <strong>가우스</strong>가 1+2+...+100 = 5050을 순식간에 구한 일화로 유명해.<br><br>
      제곱의 합 공식은 <strong>아르키메데스</strong>가 포물선 아래 넓이를 구하기 위해 사용했어.
      이것이 훗날 적분의 아이디어로 발전했지.<br><br>
      세제곱의 합 = (일차합)²이라는 아름다운 관계는
      <strong>니코마코스(Nicomachus)</strong>가 2세기에 발견해 "니코마코스의 정리"라 불려.
    `,

    realLife: [
      { icon: '🧱', title: '피라미드 쌓기', desc: '1층에 1², 2층에 2²개씩 쌓으면 총 블록 수 = ∑k²' },
      { icon: '📐', title: '넓이 근사', desc: '∑k²은 포물선 y=x² 아래 넓이를 직사각형으로 근사할 때 등장한다' },
      { icon: '🖥️', title: '알고리즘 분석', desc: '이중 반복문의 총 연산 횟수가 ∑k² 형태로 나타나는 경우가 많다' },
    ],

    sliders: [
      { name: 'n', label: 'n 값', min: 1, max: 20, default: 5, step: 1 },
      { name: 'type', label: '유형 (1:∑k, 2:∑k², 3:∑k³)', min: 1, max: 3, default: 2, step: 1 },
    ],

    example: {
      question: '∑(k=1 ~ 10) k²을 구하라.',
      answer: '385',
      steps: [
        '공식: ∑(k=1~n) k² = n(n+1)(2n+1)/6',
        'n = 10 대입',
        '= 10 × 11 × 21 / 6',
        '= 2310 / 6',
        '= 385',
      ],
      hints: [
        '힌트 1: ∑k² = n(n+1)(2n+1)/6 공식을 사용해.',
        '힌트 2: n=10을 대입하면 10×11×21/6이야.',
        '힌트 3: 분자 2310을 6으로 나누면 385!',
      ],
      otherApproaches: [
        { name: '직접 계산', desc: '1+4+9+16+25+36+49+64+81+100 = 385. 공식이 얼마나 편리한지 알 수 있어!' },
      ],
    },

    evolution: {
      prev: 'H012',
      next: undefined,
      family: '수열의 합 계보',
      familyDescription: '시그마 기호 → 거듭제곱 합 공식 → 적분(연속적 합)으로 확장',
    },

    visualType: 'series_sum',
    relatedIds: ['H012', 'H026', 'H027'],
  },

  {
    id: 'H055',
    number: 55,
    name: '미적분의 기본 정리',
    latex: '\\frac{d}{dx}\\int_a^x f(t)dt = f(x)',
    description: '미분과 적분이 역연산임을 보여주는 수학의 핵심 정리',
    level: 'high',
    category: 'calculus',
    tags: ['미적분기본정리', '뉴턴라이프니츠', '미분', '적분', '역연산', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '미분과 적분은 서로 역방향! 수학 역사상 가장 위대한 발견 중 하나',

    principle: `
      <strong>미적분의 기본 정리 (FTC)</strong>는 두 부분으로 이루어져:<br><br>
      <strong>제1정리:</strong><br>
      F(x) = ∫<sub>a</sub><sup>x</sup> f(t)dt 이면 F'(x) = f(x)<br>
      → 적분한 것을 미분하면 원래 함수가 돌아온다!<br><br>
      <strong>제2정리:</strong><br>
      ∫<sub>a</sub><sup>b</sup> f(x)dx = F(b) - F(a) (F'=f)<br>
      → 정적분은 원시함수의 양 끝점 함수값의 차이!<br><br>
      이 정리 덕분에 "넓이 구하기(적분)"와 "접선 구하기(미분)"가 하나로 연결돼.
    `,

    story: `
      미적분의 기본 정리는 <strong>뉴턴</strong>과 <strong>라이프니츠</strong>가 독립적으로 발견했어.<br><br>
      미분(접선의 기울기)과 적분(곡선 아래 넓이)이 서로 역연산이라는 사실은
      겉보기에 전혀 관련 없는 두 문제를 하나로 통합한 것이야.<br><br>
      리처드 파인만은 이를 "<strong>수학에서 가장 주목할 만한 공식</strong>"이라 불렀어.
      이 정리 하나가 물리학, 공학, 경제학의 수학적 기초를 완성시켰지.
    `,

    realLife: [
      { icon: '🔬', title: '물리학 통합', desc: '힘→가속도→속도→위치를 자유자재로 오갈 수 있는 이론적 근거' },
      { icon: '📊', title: '누적분포함수', desc: '확률밀도함수(PDF)를 적분하면 누적분포함수(CDF), 미분하면 다시 PDF' },
      { icon: '🤖', title: 'AI 자동미분', desc: '딥러닝 프레임워크의 자동미분(autograd)이 이 정리에 기반' },
    ],

    sliders: [
      { name: 'x', label: 'x 값', min: -3, max: 5, default: 2, step: 0.1 },
      { name: 'a', label: '하한 a', min: -3, max: 3, default: 0, step: 0.5 },
    ],

    example: {
      question: 'F(x) = ∫₀ˣ (3t² + 1)dt 일 때 F\'(2)를 구하라.',
      answer: '13',
      steps: [
        '미적분의 기본 정리에 의해 F\'(x) = f(x) = 3x² + 1',
        'F\'(2) = 3(2)² + 1 = 12 + 1 = 13',
      ],
      hints: [
        '힌트 1: 미적분의 기본 정리 d/dx ∫ₐˣ f(t)dt = f(x)를 기억해.',
        '힌트 2: 적분 안의 t를 x로 바꾸기만 하면 돼!',
        '힌트 3: f(x) = 3x²+1에 x=2를 대입해.',
      ],
      otherApproaches: [
        { name: '직접 계산', desc: 'F(x) = ∫₀ˣ (3t²+1)dt = [t³+t]₀ˣ = x³+x. F\'(x) = 3x²+1. F\'(2) = 13' },
      ],
    },

    evolution: { prev: 'H052', next: undefined, family: '미적분의 통합', familyDescription: '미분과 적분 → 기본 정리로 통합 → 해석학의 완성' },

    visualType: 'fundamental_theorem',
    relatedIds: ['H045', 'H051', 'H052'],
  },

  // ============================================================
  // 고2 – 확률과 통계 (H056~H065)
  // ============================================================
  {
    id: 'H056',
    number: 56,
    name: '확률의 덧셈정리',
    latex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
    description: '합집합의 확률. 겹치는 부분을 빼야 정확하다',
    level: 'high',
    category: 'probability',
    tags: ['확률', '덧셈정리', '합집합', '교집합', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '합집합의 확률 = 각각의 합 - 겹치는 부분',

    principle: `
      두 사건 A, B의 합집합 확률:<br><br>
      <strong>P(A ∪ B) = P(A) + P(B) - P(A ∩ B)</strong><br><br>
      왜 P(A∩B)를 빼나? A와 B를 단순히 더하면 겹치는 부분을 <strong>두 번 세기</strong> 때문이야.<br><br>
      <strong>특수한 경우:</strong><br>
      ① 배반사건(A ∩ B = ∅)이면: P(A ∪ B) = P(A) + P(B)<br>
      ② 여사건: P(A<sup>c</sup>) = 1 - P(A)<br><br>
      벤 다이어그램으로 시각화하면 직관적이야.
    `,

    story: `
      확률론의 시작은 1654년 <strong>파스칼</strong>과 <strong>페르마</strong>의 서신 교환이야.<br><br>
      도박사 드 메레가 제기한 "미완성 게임 분배 문제"를 풀면서
      확률의 기본 법칙이 확립됐어. 덧셈정리는 그 핵심 중 하나로,
      <strong>포함-배제 원리</strong>(PIE)라는 조합론의 중요 기법과도 연결돼.
    `,

    realLife: [
      { icon: '🏥', title: '의료 진단', desc: '질병 A 또는 B에 걸릴 확률 계산. 두 질병이 겹칠 수 있음을 고려' },
      { icon: '📊', title: '마케팅', desc: 'A채널 또는 B채널을 통해 고객에게 도달할 확률' },
      { icon: '🤖', title: 'AI 분류', desc: '두 모델 중 하나 이상이 정답을 맞출 확률 = 앙상블 성능 하한' },
    ],

    sliders: [
      { name: 'pA', label: 'P(A)', min: 0, max: 1, default: 0.5, step: 0.05 },
      { name: 'pB', label: 'P(B)', min: 0, max: 1, default: 0.3, step: 0.05 },
      { name: 'pAB', label: 'P(A∩B)', min: 0, max: 0.5, default: 0.1, step: 0.05 },
    ],

    example: {
      question: 'P(A)=0.6, P(B)=0.4, P(A∩B)=0.2일 때 P(A∪B)를 구하라.',
      answer: '0.8',
      steps: [
        'P(A∪B) = P(A) + P(B) - P(A∩B)',
        '= 0.6 + 0.4 - 0.2',
        '= 0.8',
      ],
      hints: [
        '힌트 1: 덧셈정리 공식을 적용해.',
        '힌트 2: 겹치는 부분 P(A∩B)를 빼는 것을 잊지 마.',
        '힌트 3: 0.6 + 0.4 - 0.2 = 0.8이야.',
      ],
      otherApproaches: [
        { name: '여사건', desc: 'P(A∪B) = 1 - P(A^c ∩ B^c). 두 사건 모두 일어나지 않을 확률을 빼는 방법.' },
      ],
    },

    evolution: { prev: 'M072', next: undefined, family: '확률의 심화', familyDescription: '중등 확률 → 덧셈정리 → 조건부 확률로 확장' },

    visualType: 'prob_addition',
    relatedIds: ['H057', 'H058'],
  },

  {
    id: 'H057',
    number: 57,
    name: '조건부 확률',
    latex: 'P(B|A) = \\frac{P(A \\cap B)}{P(A)}',
    description: '사건 A가 일어났을 때 B가 일어날 확률',
    level: 'high',
    category: 'probability',
    tags: ['조건부확률', '베이즈', '사후확률', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: 'A가 일어났을 때 B가 일어날 확률. 의료 진단에 핵심이야!',

    principle: `
      <strong>조건부 확률:</strong> P(B|A) = P(A∩B) / P(A)<br><br>
      "A가 이미 일어난 상황"에서 B가 일어날 확률이야.<br>
      전체 표본공간이 A로 축소된다고 생각하면 돼.<br><br>
      <strong>곱셈정리:</strong> P(A∩B) = P(A)·P(B|A) = P(B)·P(A|B)<br><br>
      <strong>베이즈 정리:</strong><br>
      P(A|B) = P(B|A)·P(A) / P(B)<br>
      → 원인의 확률을 결과로부터 역추론!
    `,

    story: `
      <strong>베이즈(Bayes)</strong> 목사는 18세기에 "결과로부터 원인의 확률을 구하는" 방법을 발견했어.<br><br>
      사후에 발표된 이 논문은 처음엔 주목받지 못했지만,
      현대에 와서 <strong>베이즈 추론</strong>은 스팸 필터, 의료 진단, AI 등
      핵심 기술의 수학적 기반이 됐어.<br><br>
      "검사 양성이면 정말 병에 걸렸을까?" 이 질문의 답이 조건부 확률이야.
    `,

    realLife: [
      { icon: '🏥', title: '의료 검사', desc: '양성 판정 시 실제 감염 확률 (위양성 문제). 베이즈 정리로 계산' },
      { icon: '📧', title: '스팸 필터', desc: '특정 단어가 포함된 메일이 스팸일 확률 — 나이브 베이즈 분류' },
      { icon: '🤖', title: 'AI 베이즈 추론', desc: '사전 확률 + 데이터 → 사후 확률 업데이트. 베이지안 딥러닝의 핵심' },
    ],

    sliders: [
      { name: 'pA', label: 'P(A)', min: 0.01, max: 1, default: 0.5, step: 0.05 },
      { name: 'pBA', label: 'P(B|A)', min: 0, max: 1, default: 0.8, step: 0.05 },
      { name: 'pBnotA', label: 'P(B|A^c)', min: 0, max: 1, default: 0.1, step: 0.05 },
    ],

    example: {
      question: '어떤 질병의 유병률이 1%이고, 검사의 양성 정확도가 95%, 위양성률이 5%일 때 양성 판정을 받은 사람이 실제 감염일 확률을 구하라.',
      answer: '약 16.1%',
      steps: [
        'P(질병) = 0.01, P(양성|질병) = 0.95, P(양성|건강) = 0.05',
        'P(양성) = P(양성|질병)P(질병) + P(양성|건강)P(건강)',
        '= 0.95×0.01 + 0.05×0.99 = 0.0095 + 0.0495 = 0.059',
        'P(질병|양성) = P(양성|질병)P(질병) / P(양성)',
        '= 0.0095 / 0.059 ≈ 0.161 (약 16.1%)',
      ],
      hints: [
        '힌트 1: 베이즈 정리를 사용해. P(질병|양성)을 구하는 거야.',
        '힌트 2: 먼저 P(양성)을 전확률 공식으로 구해.',
        '힌트 3: 유병률이 낮으면 양성이어도 실제 감염 확률이 놀라울 만큼 낮아!',
      ],
      otherApproaches: [
        { name: '자연빈도법', desc: '10000명 중 100명 감염, 95명 양성. 9900명 건강, 495명 위양성. 양성 590명 중 실제 감염 95명 → 95/590 ≈ 16.1%' },
      ],
    },

    evolution: { prev: 'H056', next: undefined, family: '확률의 심화', familyDescription: '덧셈정리 → 조건부 확률 → 베이즈 추론' },

    visualType: 'conditional_prob',
    relatedIds: ['H056', 'H058', 'H059'],
  },

  {
    id: 'H058',
    number: 58,
    name: '독립과 종속',
    latex: 'P(A \\cap B) = P(A) \\cdot P(B)',
    description: '두 사건이 독립이면 교집합 확률은 각 확률의 곱',
    level: 'high',
    category: 'probability',
    tags: ['독립', '종속', '독립사건', '확률', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '동전과 주사위를 동시에 던져도 서로 영향이 없어 — 그게 독립이야!',

    principle: `
      <strong>독립사건:</strong> A의 발생이 B의 확률에 영향을 주지 않을 때<br><br>
      P(A ∩ B) = P(A) · P(B) ⟺ A와 B는 독립<br>
      동치 조건: P(B|A) = P(B)<br><br>
      <strong>종속사건:</strong> P(A ∩ B) ≠ P(A) · P(B)이면 종속<br><br>
      <strong>주의:</strong><br>
      ① 배반사건 ≠ 독립사건! (배반이면 오히려 강한 종속)<br>
      ② 독립은 물리적 무관함이 아니라 확률적 정의야.
    `,

    story: `
      독립 개념은 확률론의 초창기부터 핵심이었지만, 엄밀한 정의는
      <strong>콜모고로프(Kolmogorov)</strong>가 1933년 확률론의 공리적 기초를 세우면서 확립됐어.<br><br>
      독립성은 통계학에서 검정의 기본 가정이고,
      보험, 금융, AI 등에서 리스크 분산의 수학적 근거가 돼.
    `,

    realLife: [
      { icon: '🎰', title: '카지노', desc: '룰렛의 각 회전은 독립. 이전 결과가 다음에 영향 없음 (도박사의 오류 주의!)' },
      { icon: '📊', title: '분산 투자', desc: '독립적인 자산에 분산 투자하면 전체 리스크가 감소하는 원리' },
      { icon: '🤖', title: '나이브 베이즈', desc: 'AI에서 특성 변수들이 독립이라 "나이브하게" 가정하면 계산이 단순해져' },
    ],

    sliders: [
      { name: 'pA', label: 'P(A)', min: 0, max: 1, default: 0.4, step: 0.05 },
      { name: 'pB', label: 'P(B)', min: 0, max: 1, default: 0.3, step: 0.05 },
    ],

    example: {
      question: '동전 1개와 주사위 1개를 동시에 던질 때 앞면이면서 짝수가 나올 확률을 구하라.',
      answer: '1/4',
      steps: [
        'A: 앞면, B: 짝수',
        'P(A) = 1/2, P(B) = 3/6 = 1/2',
        '동전과 주사위는 서로 독립이다.',
        'P(A∩B) = P(A)·P(B) = 1/2 × 1/2 = 1/4',
      ],
      hints: [
        '힌트 1: 동전과 주사위의 결과가 서로 독립인지 확인해.',
        '힌트 2: 각 사건의 확률을 따로 구해.',
        '힌트 3: 독립이므로 곱하면 돼!',
      ],
      otherApproaches: [
        { name: '표본공간 나열', desc: '전체 12가지 중 (앞,2),(앞,4),(앞,6)의 3가지 → 3/12 = 1/4' },
      ],
    },

    evolution: { prev: 'H057', next: undefined, family: '확률의 구조', familyDescription: '조건부 확률 → 독립/종속 판정 → 확률변수로 확장' },

    visualType: 'independence',
    relatedIds: ['H056', 'H057', 'H059'],
  },

  {
    id: 'H059',
    number: 59,
    name: '이산확률변수',
    latex: 'E(X) = \\sum x_i P(X=x_i)',
    description: '이산확률변수의 기댓값. 무한 반복 시 평균적으로 나오는 값',
    level: 'high',
    category: 'probability',
    tags: ['확률변수', '기댓값', '분산', '이산', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '기댓값: 무한히 반복하면 평균적으로 얼마나 나오나?',

    principle: `
      <strong>확률변수 X:</strong> 표본공간의 각 결과에 실수를 대응시키는 함수<br><br>
      <strong>기댓값(평균):</strong><br>
      E(X) = Σ x<sub>i</sub> · P(X=x<sub>i</sub>)<br><br>
      <strong>분산:</strong><br>
      V(X) = E(X²) - {E(X)}²<br><br>
      <strong>표준편차:</strong> σ(X) = √V(X)<br><br>
      <strong>성질:</strong><br>
      ① E(aX+b) = aE(X) + b<br>
      ② V(aX+b) = a²V(X)<br>
      ③ E(X+Y) = E(X) + E(Y) (항상 성립)
    `,

    story: `
      <strong>호이겐스(Huygens)</strong>가 1657년에 출판한 최초의 확률론 교과서에서
      기댓값 개념을 체계적으로 다뤘어.<br><br>
      "공정한 게임"의 기준이 바로 기댓값이야.
      기댓값이 0이면 공정하고, 양수면 유리하고, 음수면 불리한 게임이지.<br><br>
      카지노의 모든 게임은 기댓값이 음수로 설계되어 있어 — 그래서 "하우스가 항상 이긴다"는 거야!
    `,

    realLife: [
      { icon: '🎲', title: '도박의 수학', desc: '로또 기댓값은 투자액의 약 40%. 즉 1000원 투자 시 기대 수익 400원' },
      { icon: '📊', title: '보험료 산정', desc: '기대 보험금 = Σ(보험금 × 사고확률). 보험사는 이보다 높게 보험료 설정' },
      { icon: '🤖', title: 'AI 의사결정', desc: '각 행동의 기대 보상을 계산하여 최적 행동을 선택 (강화학습)' },
    ],

    sliders: [
      { name: 'x1', label: 'x₁ 값', min: 0, max: 10, default: 1, step: 1 },
      { name: 'p1', label: 'P(X=x₁)', min: 0, max: 1, default: 0.3, step: 0.05 },
      { name: 'x2', label: 'x₂ 값', min: 0, max: 10, default: 5, step: 1 },
    ],

    example: {
      question: '주사위 한 개를 던질 때 나오는 눈의 수의 기댓값을 구하라.',
      answer: '3.5',
      steps: [
        'X = 나오는 눈의 수 (1,2,3,4,5,6)',
        '각 확률 P(X=k) = 1/6 (k=1,2,...,6)',
        'E(X) = 1·1/6 + 2·1/6 + 3·1/6 + 4·1/6 + 5·1/6 + 6·1/6',
        '= (1+2+3+4+5+6)/6 = 21/6 = 3.5',
      ],
      hints: [
        '힌트 1: 주사위의 각 눈이 나올 확률은 모두 1/6이야.',
        '힌트 2: E(X) = Σ x·P(X=x) 공식을 적용해.',
        '힌트 3: 1부터 6까지의 합 = 21이야.',
      ],
      otherApproaches: [
        { name: '대칭성', desc: '주사위는 대칭이므로 기댓값 = (최솟값+최댓값)/2 = (1+6)/2 = 3.5' },
      ],
    },

    evolution: { prev: 'H058', next: undefined, family: '확률에서 통계로', familyDescription: '확률 → 확률변수 → 기댓값·분산 → 확률분포로 확장' },

    visualType: 'discrete_rv',
    relatedIds: ['H058', 'H060', 'H061'],
  },

  {
    id: 'H060',
    number: 60,
    name: '이항분포',
    latex: 'X \\sim B(n,p)',
    description: 'n번 독립시행에서 성공 횟수의 확률분포',
    level: 'high',
    category: 'probability',
    tags: ['이항분포', '베르누이', '시행', '확률분포', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '동전 n번 던져서 앞면이 k번 나올 확률 — 이항분포!',

    principle: `
      <strong>이항분포 B(n, p):</strong><br><br>
      성공 확률 p인 독립시행을 n번 반복할 때 성공 횟수 X의 분포<br><br>
      P(X=k) = <sub>n</sub>C<sub>k</sub> · p<sup>k</sup> · (1-p)<sup>n-k</sup><br><br>
      <strong>평균과 분산:</strong><br>
      ① E(X) = np<br>
      ② V(X) = np(1-p)<br>
      ③ σ(X) = √{np(1-p)}<br><br>
      <strong>정규 근사:</strong> n이 충분히 크면 B(n,p) ≈ N(np, np(1-p))
    `,

    story: `
      이항분포는 <strong>야코프 베르누이(Jacob Bernoulli)</strong>가 1713년 사후 출판된
      <em>추측술(Ars Conjectandi)</em>에서 체계화했어.<br><br>
      동전 던지기, 불량품 검사, 선거 예측 등 "성공/실패"의 반복 시행에서
      성공 횟수의 분포를 알려주는 가장 기본적인 확률분포야.<br><br>
      n이 커지면 정규분포에 근사하는데, 이것이 <strong>중심극한정리</strong>의 특수한 경우야.
    `,

    realLife: [
      { icon: '🏭', title: '품질 검사', desc: '불량률 3%인 공장에서 100개 중 5개 이상 불량일 확률' },
      { icon: '📊', title: '여론조사', desc: '지지율 p인 후보를 n명에게 물었을 때 지지 수의 분포' },
      { icon: '🤖', title: 'A/B 테스트', desc: '전환률 p인 웹페이지에서 n명 방문 시 전환 수의 분포' },
    ],

    sliders: [
      { name: 'n', label: '시행 횟수 n', min: 1, max: 30, default: 10, step: 1 },
      { name: 'p', label: '성공 확률 p', min: 0, max: 1, default: 0.5, step: 0.05 },
    ],

    example: {
      question: '불량률이 10%인 제품 5개를 검사할 때 불량품이 정확히 2개일 확률을 구하라.',
      answer: '0.0729',
      steps: [
        'X ~ B(5, 0.1)',
        'P(X=2) = ₅C₂ · (0.1)² · (0.9)³',
        '₅C₂ = 10',
        '= 10 × 0.01 × 0.729',
        '= 0.0729',
      ],
      hints: [
        '힌트 1: 이항분포 공식 P(X=k) = ₙCₖ · p^k · (1-p)^(n-k)를 사용해.',
        '힌트 2: n=5, p=0.1, k=2를 대입해.',
        '힌트 3: ₅C₂ = 5!/(2!3!) = 10이야.',
      ],
      otherApproaches: [
        { name: '나열법', desc: '5개 중 2개 불량 위치를 고르는 경우(₅C₂=10)에 각 확률 (0.1)²(0.9)³을 곱한다.' },
      ],
    },

    evolution: { prev: 'H059', next: undefined, family: '확률분포의 발전', familyDescription: '이산확률변수 → 이항분포 → 정규분포로 근사' },

    visualType: 'binomial_dist',
    relatedIds: ['H059', 'H061'],
  },

  // ★★★ KEY FORMULA: H061 정규분포 — EXTRA DETAIL ★★★
  {
    id: 'H061',
    number: 61,
    name: '정규분포',
    latex: 'X \\sim N(\\mu, \\sigma^2)',
    description: '종 모양의 대칭 분포. 자연현상 대부분이 따르는 확률분포',
    level: 'high',
    category: 'probability',
    tags: ['정규분포', '가우스', '종모양', '표준정규분포', '확률', '수능', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '키, 성적, 오차 — 자연현상의 80%가 종 모양 분포를 따라!',

    principle: `
      <strong>정규분포 N(μ, σ²):</strong><br><br>
      확률밀도함수: f(x) = (1/σ√(2π)) · e<sup>-(x-μ)²/(2σ²)</sup><br><br>
      <strong>특성:</strong><br>
      ① x = μ에서 대칭인 종 모양 곡선<br>
      ② 평균 = 중앙값 = 최빈값 = μ<br>
      ③ σ가 작을수록 뾰족, σ가 클수록 납작<br><br>
      <strong>표준정규분포 Z ~ N(0, 1):</strong><br>
      Z = (X - μ) / σ로 표준화<br><br>
      <strong>경험적 규칙 (68-95-99.7):</strong><br>
      ① P(μ-σ ≤ X ≤ μ+σ) ≈ 0.6827 (68%)<br>
      ② P(μ-2σ ≤ X ≤ μ+2σ) ≈ 0.9545 (95%)<br>
      ③ P(μ-3σ ≤ X ≤ μ+3σ) ≈ 0.9973 (99.7%)<br><br>
      <strong>표준정규분포표 활용:</strong><br>
      P(0 ≤ Z ≤ z) 값이 표에 주어지고, 대칭성과 P(Z ≥ 0) = 0.5를 이용해
      다양한 확률을 계산할 수 있어.
    `,

    story: `
      정규분포는 <strong>가우스(Gauss)</strong>가 천문학적 관측 오차를 분석하면서 발견했어.
      그래서 "가우스 분포"라고도 불려.<br><br>
      하지만 처음 발견한 건 <strong>드 무아브르(de Moivre)</strong>로, 1733년에
      이항분포의 극한으로서 종 모양 곡선을 유도했어.<br><br>
      <strong>중심극한정리(CLT)</strong>에 따르면, 독립적인 확률변수의 합은
      원래 분포에 관계없이 정규분포에 근사해. 이것이 정규분포가 어디에나 나타나는 이유야.<br><br>
      키, 시험 점수, 측정 오차, 주가 수익률 등 자연현상과 사회현상의 대부분이
      정규분포를 따르는 것은 중심극한정리의 힘이야.
      통계학의 거의 모든 기법이 정규분포를 기반으로 만들어졌어.
    `,

    realLife: [
      { icon: '📝', title: '수능 점수', desc: '수능 표준점수가 정규분포를 따름. 평균 100, 표준편차 20이면 120점 이상은 상위 약 16%' },
      { icon: '🏭', title: '품질관리 (6σ)', desc: '제조업의 6시그마 기법: 불량이 μ±6σ 밖이면 100만 개 중 3.4개 수준으로 관리' },
      { icon: '🤖', title: 'AI 가우시안', desc: '가우시안 프로세스, VAE(변분 오토인코더) 등 AI 핵심 모델의 수학적 기반' },
    ],

    sliders: [
      { name: 'mu', label: '평균 μ', min: -5, max: 5, default: 0, step: 0.5 },
      { name: 'sigma', label: '표준편차 σ', min: 0.5, max: 3, default: 1, step: 0.1 },
      { name: 'z', label: 'z값', min: -3, max: 3, default: 1, step: 0.1 },
    ],

    example: {
      question: 'X ~ N(70, 10²)일 때 P(60 ≤ X ≤ 80)을 구하라. (P(0≤Z≤1) = 0.3413)',
      answer: '0.6826',
      steps: [
        'Z = (X-70)/10으로 표준화한다.',
        'X=60 → Z=(60-70)/10 = -1',
        'X=80 → Z=(80-70)/10 = 1',
        'P(60≤X≤80) = P(-1≤Z≤1)',
        '= 2·P(0≤Z≤1) = 2×0.3413 = 0.6826',
      ],
      hints: [
        '힌트 1: Z = (X-μ)/σ로 표준화해봐.',
        '힌트 2: 양쪽 경계를 Z값으로 변환해.',
        '힌트 3: 정규분포의 대칭성을 이용해. P(-1≤Z≤1) = 2·P(0≤Z≤1)',
      ],
      otherApproaches: [
        { name: '68-95-99.7 규칙', desc: 'μ±1σ 범위 = 약 68.27%. 이 문제가 정확히 그 경우!' },
        { name: '여사건 활용', desc: 'P(-1≤Z≤1) = 1 - 2·P(Z>1) = 1 - 2(0.5-0.3413) = 1 - 0.3174 = 0.6826' },
      ],
    },

    evolution: { prev: 'H060', next: undefined, family: '확률분포의 왕', familyDescription: '이항분포 → 정규분포 근사 → 통계적 추론의 기초' },

    visualType: 'normal_dist',
    relatedIds: ['H060', 'H062', 'H063'],
  },

  {
    id: 'H062',
    number: 62,
    name: '표본평균과 표준오차',
    latex: '\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)',
    description: '표본평균의 분포. 표본 크기가 클수록 모평균에 가까워진다',
    level: 'high',
    category: 'probability',
    tags: ['표본평균', '표준오차', '중심극한정리', '통계', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '표본 크기가 클수록 표본평균은 모평균에 가까워져!',

    principle: `
      모평균 μ, 모표준편차 σ인 모집단에서 크기 n의 표본을 뽑으면:<br><br>
      <strong>표본평균의 분포:</strong><br>
      E(X̄) = μ<br>
      V(X̄) = σ²/n<br>
      σ(X̄) = σ/√n (표준오차, SE)<br><br>
      <strong>중심극한정리(CLT):</strong><br>
      n이 충분히 크면 모집단 분포에 관계없이<br>
      X̄ ~ N(μ, σ²/n) 에 근사!<br><br>
      n이 커지면 표준오차가 줄어 → 표본평균이 모평균에 집중된다.
    `,

    story: `
      <strong>중심극한정리</strong>는 확률론에서 가장 놀라운 정리야.<br><br>
      동전을 100번 던져 앞면 비율을 구하는 실험을 반복하면,
      그 비율의 분포가 정규분포를 이루는 거야. 동전 던지기는 정규분포가 아닌데도!<br><br>
      <strong>라플라스</strong>가 이를 처음 증명했고, 이 정리 덕분에
      여론조사, 품질검사, 임상시험 등 표본으로 모집단을 추론하는 통계학이 가능해졌어.
    `,

    realLife: [
      { icon: '📊', title: '여론조사 정확도', desc: '조사 인원 n이 많을수록 표준오차 σ/√n이 작아져 결과가 정밀해진다' },
      { icon: '🏥', title: '임상시험', desc: '피험자 수 n이 클수록 약물 효과의 추정이 정확해지는 원리' },
      { icon: '🤖', title: '미니배치 SGD', desc: 'AI에서 배치 크기가 클수록 기울기 추정의 분산이 줄어들어 안정적 학습' },
    ],

    sliders: [
      { name: 'n', label: '표본 크기 n', min: 1, max: 100, default: 30, step: 1 },
      { name: 'sigma', label: '모표준편차 σ', min: 1, max: 10, default: 5, step: 0.5 },
    ],

    example: {
      question: '모평균 170, 모표준편차 10인 모집단에서 25명을 뽑았을 때 표본평균이 172 이상일 확률을 구하라. (P(0≤Z≤1)=0.3413)',
      answer: '0.1587',
      steps: [
        'X̄ ~ N(170, 10²/25) = N(170, 4)',
        '표준오차 = 10/√25 = 2',
        'Z = (172-170)/2 = 1',
        'P(X̄ ≥ 172) = P(Z ≥ 1) = 0.5 - P(0≤Z≤1) = 0.5 - 0.3413 = 0.1587',
      ],
      hints: [
        '힌트 1: 표준오차 = σ/√n을 먼저 구해.',
        '힌트 2: Z = (X̄ - μ)/(σ/√n)으로 표준화해.',
        '힌트 3: P(Z≥1) = 0.5 - P(0≤Z≤1)이야.',
      ],
      otherApproaches: [
        { name: 'n 변화 비교', desc: 'n=100이면 SE=1, Z=2 → P(Z≥2)=0.0228. n이 커지면 확률이 더 작아진다.' },
      ],
    },

    evolution: { prev: 'H061', next: undefined, family: '통계적 추론', familyDescription: '정규분포 → 표본분포 → 신뢰구간 → 가설검정' },

    visualType: 'sampling_dist',
    relatedIds: ['H061', 'H063'],
  },

  {
    id: 'H063',
    number: 63,
    name: '신뢰구간',
    latex: '\\bar{X} \\pm z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}',
    description: '모평균이 포함될 것으로 기대하는 구간',
    level: 'high',
    category: 'probability',
    tags: ['신뢰구간', '신뢰도', '추정', '통계', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '여론조사 오차범위 ±3%의 수학적 의미가 이거야!',

    principle: `
      <strong>모평균 μ의 신뢰구간:</strong><br><br>
      X̄ - z<sub>α/2</sub> · σ/√n ≤ μ ≤ X̄ + z<sub>α/2</sub> · σ/√n<br><br>
      <strong>신뢰도별 z값:</strong><br>
      ① 90% → z = 1.645<br>
      ② 95% → z = 1.96<br>
      ③ 99% → z = 2.576<br><br>
      <strong>오차한계:</strong> E = z<sub>α/2</sub> · σ/√n<br><br>
      <strong>해석:</strong> "이 방법으로 100번 추정하면 약 95번은 진짜 μ를 포함한다"<br>
      (특정 구간이 μ를 포함할 확률이 95%라는 뜻은 아님!)
    `,

    story: `
      신뢰구간 개념은 <strong>네이만(Neyman)</strong>이 1937년에 제안했어.<br><br>
      그 전에는 점추정(하나의 값)만 사용했지만,
      네이만은 "추정의 불확실성을 구간으로 표현해야 한다"고 주장했지.<br><br>
      오늘날 여론조사의 "오차범위 ±3%", 과학 논문의 "95% 신뢰구간" 등
      모든 통계적 추정에 이 개념이 사용돼.
    `,

    realLife: [
      { icon: '📰', title: '여론조사', desc: '지지율 52%±3% (95% 신뢰구간) = 모비율이 49%~55%에 있을 가능성이 95%' },
      { icon: '🏥', title: '약물 효과', desc: '혈압 감소 5~12mmHg (95% CI) — 효과의 범위를 구간으로 보고' },
      { icon: '🤖', title: 'AI 성능 보고', desc: '모델 정확도 92%±1.5% (95% CI)로 성능의 불확실성 표현' },
    ],

    sliders: [
      { name: 'xbar', label: '표본평균', min: 50, max: 150, default: 100, step: 1 },
      { name: 'sigma', label: '모표준편차', min: 1, max: 30, default: 10, step: 1 },
      { name: 'n', label: '표본 크기', min: 10, max: 200, default: 50, step: 10 },
    ],

    example: {
      question: '표본평균 72, 모표준편차 8, 표본 크기 64일 때 모평균의 95% 신뢰구간을 구하라.',
      answer: '(70.04, 73.96)',
      steps: [
        '95% 신뢰구간이므로 z = 1.96',
        '표준오차 = σ/√n = 8/√64 = 8/8 = 1',
        '오차한계 = 1.96 × 1 = 1.96',
        '신뢰구간: 72 ± 1.96 = (70.04, 73.96)',
      ],
      hints: [
        '힌트 1: 95% 신뢰구간의 z값은 1.96이야.',
        '힌트 2: 표준오차 = σ/√n을 계산해.',
        '힌트 3: X̄ ± z·(σ/√n)에 대입해.',
      ],
      otherApproaches: [
        { name: 'n 증가 효과', desc: 'n=256이면 SE=0.5, 오차한계=0.98. 표본 4배 → 오차 반감' },
      ],
    },

    evolution: { prev: 'H062', next: undefined, family: '통계적 추론', familyDescription: '표본분포 → 신뢰구간 → 가설검정으로 추론 완성' },

    visualType: 'confidence_interval',
    relatedIds: ['H062', 'H064', 'H065'],
  },

  {
    id: 'H064',
    number: 64,
    name: '모비율 추정',
    latex: '\\hat{p} \\pm z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}',
    description: '표본비율로 모비율의 신뢰구간을 추정한다',
    level: 'high',
    category: 'probability',
    tags: ['모비율', '비율추정', '신뢰구간', '통계', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '1000명만 조사해도 전국민의 의견을 추정할 수 있어!',

    principle: `
      <strong>모비율 p의 신뢰구간:</strong><br><br>
      p̂ - z<sub>α/2</sub>√(p̂(1-p̂)/n) ≤ p ≤ p̂ + z<sub>α/2</sub>√(p̂(1-p̂)/n)<br><br>
      <strong>p̂ = 표본비율 = x/n</strong> (표본에서의 성공 비율)<br><br>
      <strong>오차한계:</strong> E = z<sub>α/2</sub>√(p̂(1-p̂)/n)<br><br>
      <strong>필요 표본 크기:</strong> n ≥ (z<sub>α/2</sub>/E)² · p̂(1-p̂)<br>
      p̂를 모르면 p̂=0.5로 놓으면 가장 보수적(큰) n이 나와.
    `,

    story: `
      여론조사의 과학화는 <strong>조지 갤럽(Gallup)</strong>이 이끌었어.<br><br>
      1936년 미국 대선에서 200만 명을 조사한 <em>리터러리 다이제스트</em>지가 예측에 실패했지만,
      겔럽은 단 5000명으로 정확하게 예측했어. 비결은 <strong>무작위 표본추출</strong>과 모비율 추정이었지.<br><br>
      오늘날 선거 예측, 시청률 조사, A/B 테스트 등 모두 이 원리를 사용해.
    `,

    realLife: [
      { icon: '🗳️', title: '선거 예측', desc: '1000명 조사로 전국민 투표 결과를 오차 ±3% 이내로 추정' },
      { icon: '📺', title: '시청률', desc: '표본 가구 2000가구의 데이터로 전체 시청률을 추정하는 방법' },
      { icon: '🤖', title: 'A/B 테스트', desc: '전환율의 신뢰구간으로 두 버전 중 더 나은 것을 판단' },
    ],

    sliders: [
      { name: 'phat', label: '표본비율 p̂', min: 0.1, max: 0.9, default: 0.5, step: 0.05 },
      { name: 'n', label: '표본 크기 n', min: 50, max: 2000, default: 400, step: 50 },
    ],

    example: {
      question: '1000명 중 520명이 찬성했을 때 모비율의 95% 신뢰구간을 구하라.',
      answer: '(0.489, 0.551)',
      steps: [
        'p̂ = 520/1000 = 0.52',
        '95% 신뢰구간이므로 z = 1.96',
        '표준오차 = √(0.52×0.48/1000) = √(0.0002496) ≈ 0.0158',
        '오차한계 = 1.96 × 0.0158 ≈ 0.031',
        '신뢰구간: 0.52 ± 0.031 = (0.489, 0.551)',
      ],
      hints: [
        '힌트 1: 먼저 표본비율 p̂ = x/n을 구해.',
        '힌트 2: 표준오차 = √(p̂(1-p̂)/n)을 계산해.',
        '힌트 3: p̂ ± z·SE에 대입해.',
      ],
      otherApproaches: [
        { name: 'n 결정', desc: '오차범위 2% 이내 원하면 n ≥ (1.96/0.02)²×0.25 = 2401명 이상 필요' },
      ],
    },

    evolution: { prev: 'H063', next: undefined, family: '비율 추정', familyDescription: '신뢰구간 → 모비율 추정 → 여론조사·A/B 테스트에 활용' },

    visualType: 'proportion_estimate',
    relatedIds: ['H063', 'H065'],
  },

  {
    id: 'H065',
    number: 65,
    name: '삼각함수 사이의 관계',
    latex: '\\sin^2\\theta + \\cos^2\\theta = 1',
    description: '단위원 위의 점의 좌표로부터 유도되는 삼각함수의 기본 항등식',
    level: 'high',
    category: 'trigonometry',
    tags: ['삼각함수', '항등식', '피타고라스', '단위원', 'sin', 'cos', '고2', '미적분'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '단위원 위의 점 → 피타고라스 정리 → sin²+cos²=1',

    principle: `
      <strong>삼각함수의 기본 관계식:</strong><br><br>
      단위원(반지름 1인 원) 위의 점 (cosθ, sinθ)에서<br>
      피타고라스 정리를 적용하면:<br>
      <strong>sin²θ + cos²θ = 1</strong><br><br>
      <strong>파생 관계식:</strong><br>
      ① 양변을 cos²θ로 나누면: <strong>tan²θ + 1 = sec²θ</strong><br>
      ② 양변을 sin²θ로 나누면: <strong>1 + cot²θ = csc²θ</strong><br><br>
      <strong>변환 공식:</strong><br>
      tanθ = sinθ/cosθ<br>
      sin²θ = (1 - cos2θ)/2 (반각 공식)<br>
      cos²θ = (1 + cos2θ)/2 (반각 공식)<br><br>
      이 항등식들은 삼각함수 식을 <strong>간단히 정리</strong>하거나
      <strong>다른 형태로 변환</strong>할 때 핵심 도구야!
    `,

    story: `
      삼각함수의 항등식은 고대 그리스 <strong>히파르코스</strong>의 현(chord) 계산에서 시작되었어.<br><br>
      인도 수학자 <strong>아리아바타</strong>와 <strong>브라마굽타</strong>가 sin, cos 개념을 발전시켰고,
      아랍 수학자들이 유럽에 전파했지. <strong>오일러</strong>는 e<sup>iθ</sup> = cosθ + i sinθ라는
      공식으로 삼각함수와 지수함수의 놀라운 관계를 밝혀냈어.<br><br>
      sin²+cos²=1은 이 모든 것의 출발점이야.
    `,

    realLife: [
      { icon: '🎡', title: '원운동', desc: '회전하는 물체의 x, y 좌표가 cos, sin으로 표현된다' },
      { icon: '🔊', title: '음향 공학', desc: '소리 파동을 sin, cos로 분해하고 합성하는 푸리에 분석의 기초' },
      { icon: '🎮', title: '게임 물리', desc: '캐릭터의 방향 벡터를 (cosθ, sinθ)로 표현하고 회전 변환에 활용' },
    ],

    sliders: [
      { name: 'theta', label: '각도 θ (도)', min: 0, max: 360, default: 45, step: 5 },
    ],

    example: {
      question: 'sinθ = 3/5일 때 cosθ와 tanθ의 값을 구하라 (0 < θ < π/2).',
      answer: 'cosθ = 4/5, tanθ = 3/4',
      steps: [
        'sin²θ + cos²θ = 1에서',
        '(3/5)² + cos²θ = 1',
        '9/25 + cos²θ = 1',
        'cos²θ = 1 - 9/25 = 16/25',
        '0 < θ < π/2이므로 cosθ > 0, 따라서 cosθ = 4/5',
        'tanθ = sinθ/cosθ = (3/5)/(4/5) = 3/4',
      ],
      hints: [
        '힌트 1: sin²θ + cos²θ = 1에 sinθ = 3/5를 대입해봐.',
        '힌트 2: cos²θ = 16/25이고 제1사분면이니까 cosθ는 양수야.',
        '힌트 3: tanθ = sinθ/cosθ로 구할 수 있어.',
      ],
      otherApproaches: [
        { name: '직각삼각형', desc: '빗변 5, 높이 3인 직각삼각형을 그리면 밑변 = 4 (3-4-5 삼각형). cosθ=4/5, tanθ=3/4' },
      ],
    },

    evolution: {
      prev: 'H034',
      next: undefined,
      family: '삼각함수 계보',
      familyDescription: '삼각비 → 삼각함수 → 삼각함수 항등식 → 미적분에서의 삼각함수',
    },

    visualType: 'trig_identity',
    relatedIds: ['H034', 'H035', 'H036'],
  },

  // ============================================================
  // 고3 – 기하 (H066~H070)
  // ============================================================
  {
    id: 'H066',
    number: 66,
    name: '직선의 방정식',
    latex: 'ax + by + c = 0',
    description: '평면 위 직선을 나타내는 일반형 방정식',
    level: 'high',
    category: 'geometry',
    tags: ['직선', '방정식', '기울기', '절편', '기하', '고3'],
    grade: '고3',
    curriculum: '2022개정',

    hook: '두 점, 점과 기울기, 기울기와 절편 — 세 가지 방법으로 직선 표현!',

    principle: `
      <strong>직선의 방정식 세 가지 형태:</strong><br><br>
      ① <strong>일반형:</strong> ax + by + c = 0<br>
      ② <strong>기울기-절편형:</strong> y = mx + n<br>
      ③ <strong>점-기울기형:</strong> y - y₁ = m(x - x₁)<br><br>
      <strong>두 점을 지나는 직선:</strong><br>
      기울기 m = (y₂-y₁)/(x₂-x₁)<br><br>
      <strong>점과 직선 사이의 거리:</strong><br>
      d = |ax₀+by₀+c| / √(a²+b²)<br><br>
      <strong>두 직선의 관계:</strong><br>
      ① 평행: m₁ = m₂ (일치 아닌 경우)<br>
      ② 수직: m₁·m₂ = -1
    `,

    story: `
      <strong>데카르트</strong>가 1637년에 좌표 기하학을 발명하면서
      직선을 방정식으로 표현할 수 있게 됐어.<br><br>
      이전에는 기하학(도형)과 대수학(방정식)이 별개였지만,
      데카르트의 좌표계 덕분에 두 분야가 통합됐어.
      이것이 <strong>해석기하학</strong>의 탄생이야.<br><br>
      점과 직선 사이 거리 공식은 컴퓨터 그래픽, 로봇 경로 계획 등에 핵심적으로 사용돼.
    `,

    realLife: [
      { icon: '🗺️', title: '지도 경로', desc: '두 지점 사이의 직선 거리와 경로를 좌표로 계산' },
      { icon: '🏗️', title: '건축 설계', desc: 'CAD에서 벽, 기둥 등의 위치를 직선의 방정식으로 정의' },
      { icon: '🤖', title: 'AI 선형 분류', desc: 'SVM의 결정 경계가 바로 직선(2D) 또는 초평면(고차원)의 방정식' },
    ],

    sliders: [
      { name: 'm', label: '기울기 m', min: -5, max: 5, default: 1, step: 0.5 },
      { name: 'n', label: 'y절편 n', min: -5, max: 5, default: 0, step: 0.5 },
    ],

    example: {
      question: '점 (3, -1)과 직선 3x + 4y - 2 = 0 사이의 거리를 구하라.',
      answer: '1',
      steps: [
        '점과 직선 사이의 거리 공식: d = |ax₀+by₀+c|/√(a²+b²)',
        'a=3, b=4, c=-2, (x₀,y₀)=(3,-1)',
        '|3(3)+4(-1)-2| = |9-4-2| = |3| = 3',
        '√(9+16) = √25 = 5',
        'd = 3/5 = 0.6... 아, 다시 계산: |3×3+4×(-1)-2| = |9-4-2| = 3, d = 3/5',
      ],
      hints: [
        '힌트 1: 점과 직선 사이의 거리 공식을 떠올려봐.',
        '힌트 2: ax₀+by₀+c를 대입할 때 부호에 주의해.',
        '힌트 3: 분모 √(a²+b²) = √(9+16) = 5야.',
      ],
      otherApproaches: [
        { name: '수선의 발', desc: '직선 위의 점에서 주어진 점까지 수직인 선분의 길이를 구하는 방법' },
      ],
    },

    evolution: { prev: 'M030', next: undefined, family: '좌표기하의 시작', familyDescription: '중등 좌표평면 → 직선의 방정식 → 원·이차곡선으로 확장' },

    visualType: 'line_eq',
    relatedIds: ['H067', 'H069'],
  },

  {
    id: 'H067',
    number: 67,
    name: '원의 방정식',
    latex: '(x-a)^2 + (y-b)^2 = r^2',
    description: '중심 (a,b), 반지름 r인 원의 방정식',
    level: 'high',
    category: 'geometry',
    tags: ['원', '방정식', '중심', '반지름', '기하', '고3'],
    grade: '고3',
    curriculum: '2022개정',

    hook: '중심과 반지름만 알면 원의 방정식 완성!',

    principle: `
      <strong>원의 방정식:</strong><br><br>
      ① <strong>표준형:</strong> (x-a)² + (y-b)² = r²<br>
      중심 (a, b), 반지름 r<br><br>
      ② <strong>일반형:</strong> x² + y² + Dx + Ey + F = 0<br>
      중심 (-D/2, -E/2), 반지름 √(D²/4 + E²/4 - F)<br><br>
      <strong>원과 직선의 관계:</strong><br>
      중심에서 직선까지 거리 d와 반지름 r 비교<br>
      ① d < r: 두 점에서 만남 (할선)<br>
      ② d = r: 한 점에서 접함 (접선)<br>
      ③ d > r: 만나지 않음
    `,

    story: `
      원은 가장 완벽한 도형으로 고대부터 숭배받았어.<br><br>
      <strong>아폴로니우스</strong>는 원뿔을 잘라 원, 타원, 포물선, 쌍곡선을 연구했고,
      2000년 뒤 <strong>케플러</strong>가 행성 궤도가 타원임을 발견하면서
      이 이론이 천문학의 핵심이 됐어.<br><br>
      원의 방정식은 GPS, 레이더, 원형 건축물 설계 등에 직접 사용돼.
    `,

    realLife: [
      { icon: '📡', title: 'GPS 삼변측량', desc: '세 원의 교점으로 위치를 결정. 각 원은 위성까지의 거리를 반지름으로 한다' },
      { icon: '🏛️', title: '건축', desc: '돔, 아치, 원형 경기장 등의 설계에 원의 방정식 직접 사용' },
      { icon: '🤖', title: '충돌 감지', desc: '게임/로봇 공학에서 두 원의 교차 여부로 충돌을 판정' },
    ],

    sliders: [
      { name: 'a', label: '중심 x좌표', min: -5, max: 5, default: 0, step: 0.5 },
      { name: 'b', label: '중심 y좌표', min: -5, max: 5, default: 0, step: 0.5 },
      { name: 'r', label: '반지름 r', min: 0.5, max: 5, default: 2, step: 0.5 },
    ],

    example: {
      question: 'x² + y² - 4x + 6y - 3 = 0의 중심과 반지름을 구하라.',
      answer: '중심 (2, -3), 반지름 4',
      steps: [
        '완전제곱식으로 변환한다.',
        '(x² - 4x) + (y² + 6y) = 3',
        '(x² - 4x + 4) + (y² + 6y + 9) = 3 + 4 + 9',
        '(x-2)² + (y+3)² = 16',
        '중심 (2, -3), 반지름 √16 = 4',
      ],
      hints: [
        '힌트 1: x와 y를 각각 완전제곱식으로 만들어봐.',
        '힌트 2: (x²-4x)에 4를 더하고, (y²+6y)에 9를 더해. 양변에 같은 값을 더해야 해.',
        '힌트 3: (x-2)² + (y+3)² = 16 형태가 됐으면 중심과 반지름을 읽어.',
      ],
      otherApproaches: [
        { name: '공식 직접 적용', desc: 'D=-4, E=6, F=-3. 중심(-D/2,-E/2)=(2,-3), r=√(4+9+3)=4' },
      ],
    },

    evolution: { prev: 'M065', next: undefined, family: '도형의 방정식', familyDescription: '원의 성질 → 원의 방정식 → 이차곡선으로 확장' },

    visualType: 'circle_eq',
    relatedIds: ['H066', 'H068', 'H069'],
  },

  {
    id: 'H068',
    number: 68,
    name: '도형의 이동 (평행이동, 대칭이동)',
    latex: '(x,y) \\rightarrow (x+a, y+b)',
    description: '좌표평면에서 도형을 이동시키는 변환',
    level: 'high',
    category: 'geometry',
    tags: ['평행이동', '대칭이동', '변환', '기하', '고3'],
    grade: '고3',
    curriculum: '2022개정',

    hook: '좌표로 도형을 옮기고 뒤집기. 컴퓨터 그래픽의 기초!',

    principle: `
      <strong>평행이동:</strong><br>
      (x, y) → (x+a, y+b): x방향 a, y방향 b만큼 이동<br>
      방정식 변환: x → x-a, y → y-b 로 치환<br><br>
      <strong>대칭이동:</strong><br>
      ① x축 대칭: (x, y) → (x, -y)<br>
      ② y축 대칭: (x, y) → (-x, y)<br>
      ③ 원점 대칭: (x, y) → (-x, -y)<br>
      ④ y=x 대칭: (x, y) → (y, x)<br><br>
      <strong>합성 변환:</strong> 여러 이동을 순서대로 적용 가능.
      행렬 표현으로 일반화하면 컴퓨터 그래픽의 기초가 돼.
    `,

    story: `
      도형의 이동(변환)은 19세기 <strong>클라인(Klein)</strong>의 에를랑겐 프로그램에서
      기하학의 본질로 정의됐어.<br><br>
      "기하학이란 변환군 아래에서 불변인 성질을 연구하는 것"이라는 혁명적 관점이야.<br><br>
      오늘날 이 아이디어는 컴퓨터 그래픽, 로봇 공학, 물리학의 대칭성 이론 등
      과학 기술 전반에 핵심적으로 사용돼.
    `,

    realLife: [
      { icon: '🎮', title: '게임 그래픽', desc: '캐릭터 이동, 회전, 반사 — 모두 좌표 변환으로 구현' },
      { icon: '🏗️', title: 'CAD 설계', desc: '설계 도면에서 부품을 복사·이동·대칭 배치하는 기본 연산' },
      { icon: '🤖', title: 'AI 데이터 증강', desc: '이미지를 평행이동·대칭이동하여 학습 데이터를 늘리는 기법' },
    ],

    sliders: [
      { name: 'a', label: 'x방향 이동', min: -5, max: 5, default: 2, step: 0.5 },
      { name: 'b', label: 'y방향 이동', min: -5, max: 5, default: 3, step: 0.5 },
      { name: 'type', label: '변환 종류 (0=평행, 1=x대칭, 2=y대칭)', min: 0, max: 2, default: 0, step: 1 },
    ],

    example: {
      question: 'y = x² - 2x를 x축 방향으로 3, y축 방향으로 -1만큼 평행이동한 방정식을 구하라.',
      answer: 'y = x² - 8x + 14',
      steps: [
        '평행이동: x → x-3, y → y+1로 치환',
        'y+1 = (x-3)² - 2(x-3)',
        'y+1 = x² - 6x + 9 - 2x + 6',
        'y+1 = x² - 8x + 15',
        'y = x² - 8x + 14',
      ],
      hints: [
        '힌트 1: x방향 a이동이면 x를 x-a로 바꿔.',
        '힌트 2: y방향 b이동이면 y를 y-b로 바꿔.',
        '힌트 3: 치환 후 전개하고 정리하면 돼.',
      ],
      otherApproaches: [
        { name: '꼭짓점 이동', desc: '원래 꼭짓점 (1,-1)을 (1+3,-1-1)=(4,-2)로 이동. y=(x-4)²-2 = x²-8x+14' },
      ],
    },

    evolution: { prev: 'H067', next: undefined, family: '기하학적 변환', familyDescription: '원의 방정식 → 도형의 이동 → 이차곡선의 분류' },

    visualType: 'transformation',
    relatedIds: ['H066', 'H067', 'H069'],
  },

  {
    id: 'H069',
    number: 69,
    name: '이차곡선 (포물선, 타원, 쌍곡선)',
    latex: '\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1',
    description: '원뿔을 자르는 방향에 따라 나타나는 세 가지 곡선',
    level: 'high',
    category: 'geometry',
    tags: ['이차곡선', '포물선', '타원', '쌍곡선', '원뿔곡선', '기하', '고3'],
    grade: '고3',
    curriculum: '2022개정',

    hook: '행성 궤도는 타원, 위성 안테나는 포물선, 쌍곡선은 GPS에 사용!',

    principle: `
      <strong>이차곡선 (원뿔곡선):</strong><br><br>
      ① <strong>포물선:</strong> y² = 4px (초점 (p,0), 준선 x=-p)<br>
      꼭짓점에서 초점까지 거리 = 준선까지 거리<br><br>
      ② <strong>타원:</strong> x²/a² + y²/b² = 1 (a > b > 0)<br>
      두 초점까지 거리의 합이 일정 (= 2a)<br>
      초점: (±c, 0), c² = a² - b²<br><br>
      ③ <strong>쌍곡선:</strong> x²/a² - y²/b² = 1<br>
      두 초점까지 거리의 차가 일정 (= 2a)<br>
      초점: (±c, 0), c² = a² + b²<br>
      점근선: y = ±(b/a)x
    `,

    story: `
      <strong>아폴로니우스</strong>(기원전 3세기)가 원뿔 단면을 체계적으로 연구하며
      포물선, 타원, 쌍곡선이라는 이름을 붙였어.<br><br>
      2000년간 순수 수학으로만 여겨졌지만, <strong>케플러</strong>가 행성 궤도가 타원임을 발견하고
      <strong>뉴턴</strong>이 중력 법칙으로 이를 증명하면서 천문학의 핵심이 됐어.<br><br>
      포물선은 반사 망원경과 위성 안테나, 쌍곡선은 GPS와 소닉 붐 원리에 사용돼.
    `,

    realLife: [
      { icon: '🪐', title: '행성 궤도', desc: '케플러 제1법칙: 행성은 태양을 초점으로 하는 타원 궤도를 돈다' },
      { icon: '📡', title: '파라볼라 안테나', desc: '포물선의 반사 성질: 평행광이 초점에 모인다 → 위성 안테나, 반사 망원경' },
      { icon: '🤖', title: '궤도 역학', desc: 'AI 기반 우주선 궤적 최적화에서 원뿔곡선 궤도 계산' },
    ],

    sliders: [
      { name: 'a', label: '장반축 a', min: 1, max: 5, default: 3, step: 0.5 },
      { name: 'b', label: '단반축 b', min: 1, max: 5, default: 2, step: 0.5 },
      { name: 'type', label: '곡선 종류 (0=타원, 1=쌍곡선)', min: 0, max: 1, default: 0, step: 1 },
    ],

    example: {
      question: '타원 x²/25 + y²/9 = 1의 초점 좌표와 두 초점 사이의 거리를 구하라.',
      answer: '초점: (±4, 0), 거리: 8',
      steps: [
        'a² = 25, b² = 9이므로 a = 5, b = 3',
        'c² = a² - b² = 25 - 9 = 16',
        'c = 4',
        '초점: (4, 0)과 (-4, 0)',
        '두 초점 사이의 거리 = 2c = 8',
      ],
      hints: [
        '힌트 1: 타원에서 c² = a² - b² 관계를 기억해.',
        '힌트 2: 큰 수가 a², 작은 수가 b²야.',
        '힌트 3: c를 구하면 초점은 (±c, 0)이야.',
      ],
      otherApproaches: [
        { name: '이심률', desc: 'e = c/a = 4/5 = 0.8. 이심률이 0에 가까우면 원, 1에 가까우면 납작한 타원.' },
      ],
    },

    evolution: { prev: 'M041', next: undefined, family: '곡선의 분류', familyDescription: '원 → 이차방정식 → 이차곡선(포물선·타원·쌍곡선)으로 확장' },

    visualType: 'conic_section',
    relatedIds: ['H066', 'H067', 'H070'],
  },

  {
    id: 'H070',
    number: 70,
    name: '공간좌표와 공간벡터',
    latex: 'P(x, y, z), \\; \\vec{v} = (a,b,c)',
    description: '3차원 공간에서 점의 좌표와 벡터의 표현',
    level: 'high',
    category: 'geometry',
    tags: ['공간좌표', '공간벡터', '3D', '내적', '외적', '기하', '고3'],
    grade: '고3',
    curriculum: '2022개정',

    hook: '3D 공간을 수식으로. 게임 엔진과 3D 애니메이션의 기초!',

    principle: `
      <strong>공간좌표:</strong><br>
      점 P(x, y, z), 원점 O(0, 0, 0)<br>
      두 점 사이의 거리: d = √{(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²}<br><br>
      <strong>공간벡터:</strong><br>
      벡터 v = (a, b, c)<br>
      크기: |v| = √(a²+b²+c²)<br><br>
      <strong>내적:</strong> u · v = a₁a₂ + b₁b₂ + c₁c₂ = |u||v|cosθ<br>
      → 두 벡터의 사잇각 구하기, 수직 판정(내적=0)<br><br>
      <strong>외적:</strong> u × v = (b₁c₂-b₂c₁, c₁a₂-c₂a₁, a₁b₂-a₂b₁)<br>
      → 두 벡터에 수직인 벡터, 평행사변형 넓이 = |u × v|
    `,

    story: `
      공간좌표는 데카르트의 2D 좌표를 3D로 확장한 것이야.<br><br>
      <strong>해밀턴(Hamilton)</strong>은 1843년에 벡터 개념을 확립하려다
      <strong>사원수(quaternion)</strong>를 발명했고, <strong>기브스(Gibbs)</strong>와 <strong>헤비사이드(Heaviside)</strong>가
      이를 3D 벡터로 정리했어.<br><br>
      오늘날 3D 게임 엔진(Unity, Unreal), 물리 시뮬레이션, 로봇 공학,
      3D 프린팅 등 모든 3D 기술의 수학적 기반이 공간벡터야.
    `,

    realLife: [
      { icon: '🎮', title: '게임 엔진', desc: '캐릭터 위치, 카메라 방향, 충돌 감지 모두 공간벡터 연산' },
      { icon: '✈️', title: '항공 항법', desc: '비행기의 3D 위치와 속도 벡터로 항로 계산' },
      { icon: '🤖', title: '3D 비전', desc: 'AI 로봇이 3차원 환경을 인식하고 물체의 위치·방향을 벡터로 표현' },
    ],

    sliders: [
      { name: 'x', label: 'x 성분', min: -5, max: 5, default: 1, step: 0.5 },
      { name: 'y', label: 'y 성분', min: -5, max: 5, default: 2, step: 0.5 },
      { name: 'z', label: 'z 성분', min: -5, max: 5, default: 3, step: 0.5 },
    ],

    example: {
      question: '벡터 u=(1,2,3)과 v=(4,-1,2)의 내적과 사잇각의 코사인값을 구하라.',
      answer: '내적: 8, cosθ = 8/(√14·√21)',
      steps: [
        'u · v = 1×4 + 2×(-1) + 3×2 = 4 - 2 + 6 = 8',
        '|u| = √(1+4+9) = √14',
        '|v| = √(16+1+4) = √21',
        'cosθ = u·v / (|u||v|) = 8/(√14·√21) = 8/√294',
        '= 8/(7√6) ≈ 0.466',
      ],
      hints: [
        '힌트 1: 내적 = 각 성분끼리 곱해서 더하면 돼.',
        '힌트 2: 벡터의 크기 = √(성분 제곱의 합)이야.',
        '힌트 3: cosθ = (내적)/(|u||v|) 공식을 사용해.',
      ],
      otherApproaches: [
        { name: '외적으로 sinθ', desc: 'u×v를 구해서 |u×v| = |u||v|sinθ로 sinθ를 구할 수도 있다.' },
      ],
    },

    evolution: { prev: 'H039', next: undefined, family: '벡터의 확장', familyDescription: '평면벡터 → 공간벡터 → 선형대수학으로 확장' },

    visualType: 'space_vector',
    relatedIds: ['H039', 'H040', 'H069'],
  },

  // ============================================================
  // 추가 공식 (H071~H075)
  // ============================================================
  {
    id: 'H071',
    number: 71,
    name: '0승과 음의 지수',
    latex: 'a^0 = 1, \\; a^{-n} = \\frac{1}{a^n}',
    description: 'a의 0제곱은 1이고, 음의 지수는 역수를 의미한다',
    level: 'high',
    category: 'algebra',
    tags: ['지수', '0승', '음의지수', '역수', '지수법칙', '고1', '공통수학1'],
    grade: '고1',
    curriculum: '2022개정',

    hook: '0제곱이 1인 이유 — 지수법칙이 일관되려면 반드시 1이어야 해!',

    principle: `
      <strong>왜 a⁰ = 1일까?</strong><br>
      지수법칙 aᵐ ÷ aⁿ = aᵐ⁻ⁿ에서 m = n이면:<br>
      aⁿ ÷ aⁿ = aⁿ⁻ⁿ = a⁰<br>
      그런데 같은 수끼리 나누면 1이니까 a⁰ = 1이야.<br><br>
      <strong>음의 지수</strong><br>
      같은 논리로 m = 0, n을 양수로 놓으면:<br>
      a⁰ ÷ aⁿ = a⁰⁻ⁿ = a⁻ⁿ<br>
      a⁰ = 1이므로 a⁻ⁿ = 1/aⁿ<br><br>
      <strong>핵심 포인트:</strong> 지수법칙의 일관성을 유지하기 위해 0승과 음의 지수가 정의된 거야.
      0승 = 1은 약속이 아니라 논리적 필연이지!
    `,

    story: `
      지수의 확장은 수학사에서 점진적으로 이루어졌어.<br><br>
      처음 지수는 "같은 수를 여러 번 곱하기"라는 자연수 의미만 있었지만,
      <strong>오일러(Euler)</strong>와 <strong>코시(Cauchy)</strong>가 지수를 0, 음수, 유리수, 실수까지 확장했어.<br><br>
      이런 확장은 "기존 법칙이 새로운 영역에서도 성립하도록" 정의를 넓히는 수학의 전형적인 방법이야.
      오늘날 지수함수 eˣ는 복리 계산, 방사성 붕괴, 인구 모델 등 어디서든 등장해.
    `,

    realLife: [
      { icon: '💰', title: '복리 이자', desc: '은행 이자 계산에서 (1+r)⁰ = 1은 원금 그대로를 의미한다' },
      { icon: '⚛️', title: '방사성 붕괴', desc: '반감기 공식 N = N₀·2⁻ᵗ/ᵀ에서 음의 지수가 핵심' },
      { icon: '💾', title: '컴퓨터 단위', desc: '2⁻¹⁰ = 1/1024, 데이터 단위 변환에 음의 지수 활용' },
    ],

    sliders: [
      { name: 'base', label: '밑 a', min: 1, max: 10, default: 2, step: 1 },
      { name: 'exp', label: '지수 n', min: -5, max: 5, default: -2, step: 1 },
    ],

    example: {
      question: '3⁻² + 5⁰의 값을 구하라.',
      answer: '10/9',
      steps: [
        '3⁻² = 1/3² = 1/9',
        '5⁰ = 1',
        '1/9 + 1 = 1/9 + 9/9 = 10/9',
      ],
      hints: [
        '힌트 1: 음의 지수는 역수로 바꿔봐. a⁻ⁿ = 1/aⁿ',
        '힌트 2: 0승은 무조건 1이야 (밑이 0이 아닌 한).',
        '힌트 3: 통분해서 더하면 돼.',
      ],
      otherApproaches: [
        { name: '소수 변환', desc: '3⁻² ≈ 0.111…로 바꿔서 1.111… ≈ 10/9로 검산할 수 있다.' },
      ],
    },

    evolution: { prev: 'M007', next: undefined, family: '지수의 확장', familyDescription: '자연수 지수 → 0승·음의 지수 → 유리수 지수 → 지수함수' },

    visualType: 'exponent_viz',
    relatedIds: ['H002', 'H005', 'H006'],
  },

  {
    id: 'H072',
    number: 72,
    name: '두 직선의 평행과 수직',
    latex: '\\text{평행}: m_1=m_2, \\; \\text{수직}: m_1 m_2 = -1',
    description: '두 직선의 기울기를 비교하여 평행·수직 관계를 판별하는 조건',
    level: 'high',
    category: 'geometry',
    tags: ['직선', '평행', '수직', '기울기', '좌표기하', '고3'],
    grade: '고3',
    curriculum: '2022개정',

    hook: '기울기로 평행과 수직을 판단해!',

    principle: `
      <strong>평행 조건:</strong><br>
      두 직선 y = m₁x + b₁과 y = m₂x + b₂가 평행 ⇔ m₁ = m₂ (단, b₁ ≠ b₂)<br>
      기울기가 같으면 두 직선은 절대 만나지 않아.<br><br>
      <strong>수직 조건:</strong><br>
      두 직선이 수직 ⇔ m₁ × m₂ = -1<br>
      즉 한 직선의 기울기가 m이면, 수직인 직선의 기울기는 -1/m이야.<br><br>
      <strong>왜 -1일까?</strong><br>
      방향벡터 (1, m₁)과 (1, m₂)의 내적이 0이면 수직:<br>
      1·1 + m₁·m₂ = 0 → m₁m₂ = -1
    `,

    story: `
      좌표평면 위 직선의 기울기 개념은 <strong>데카르트</strong>의 해석기하학에서 시작됐어.<br><br>
      평행과 수직 판정은 유클리드 기하학에서는 작도로 했지만,
      해석기하학 덕분에 숫자 하나(기울기)로 즉시 판별할 수 있게 됐지.<br><br>
      건축, 도시 설계, CAD 프로그램에서 직선의 평행·수직 관계는
      매일 수천 번씩 계산돼. 네비게이션에서 도로의 직교 여부 판단에도 쓰여.
    `,

    realLife: [
      { icon: '🏗️', title: '건축 설계', desc: '벽과 바닥이 수직인지 기울기 곱 = -1로 확인한다' },
      { icon: '🗺️', title: '도시 계획', desc: '격자형 도로가 평행·수직인지 기울기로 검증한다' },
      { icon: '🎨', title: 'CAD/그래픽', desc: '디자인 소프트웨어에서 선의 평행·수직 스냅 기능의 원리' },
    ],

    sliders: [
      { name: 'm1', label: '직선 1 기울기', min: -5, max: 5, default: 2, step: 0.5 },
      { name: 'b1', label: '직선 1 절편', min: -5, max: 5, default: 1, step: 1 },
      { name: 'm2', label: '직선 2 기울기', min: -5, max: 5, default: -0.5, step: 0.5 },
      { name: 'b2', label: '직선 2 절편', min: -5, max: 5, default: 3, step: 1 },
    ],

    example: {
      question: '직선 y = 3x + 1에 수직이고 점 (6, 2)를 지나는 직선의 방정식을 구하라.',
      answer: 'y = -⅓x + 4',
      steps: [
        '주어진 직선의 기울기: m₁ = 3',
        '수직 조건: m₁ × m₂ = -1 → 3 × m₂ = -1 → m₂ = -1/3',
        '점 (6, 2)를 지나므로: y - 2 = -1/3(x - 6)',
        'y - 2 = -x/3 + 2',
        'y = -x/3 + 4',
      ],
      hints: [
        '힌트 1: 수직인 직선의 기울기는 원래 기울기의 음의 역수야.',
        '힌트 2: m₂ = -1/m₁ = -1/3이야.',
        '힌트 3: 점-기울기 공식 y - y₁ = m(x - x₁)을 사용해.',
      ],
      otherApproaches: [
        { name: '일반형 활용', desc: '3x - y + 1 = 0의 수직선은 x + 3y + k = 0 꼴이고, (6,2) 대입으로 k를 구한다.' },
      ],
    },

    evolution: { prev: 'M032', next: undefined, family: '좌표기하학', familyDescription: '직선의 방정식 → 평행·수직 판정 → 점과 직선의 거리 → 원·이차곡선' },

    visualType: 'line_eq',
    relatedIds: ['H066', 'H067', 'H073'],
  },

  {
    id: 'H073',
    number: 73,
    name: '선분의 중점',
    latex: 'M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)',
    description: '두 점을 잇는 선분의 정확한 가운데 점의 좌표 공식',
    level: 'high',
    category: 'geometry',
    tags: ['중점', '좌표', '선분', '평균', '좌표기하', '고3'],
    grade: '고3',
    curriculum: '2022개정',

    hook: '두 점의 평균이 중점!',

    principle: `
      <strong>중점 공식:</strong><br>
      두 점 A(x₁, y₁), B(x₂, y₂)의 중점 M은:<br>
      M = ((x₁+x₂)/2, (y₁+y₂)/2)<br><br>
      <strong>왜 평균일까?</strong><br>
      중점은 A와 B를 1:1로 내분하는 점이야.<br>
      x좌표의 평균 = 두 점의 정확한 가운데<br>
      y좌표의 평균 = 두 점의 정확한 가운데<br><br>
      <strong>일반화 — 내분점 공식:</strong><br>
      m:n으로 내분하는 점 = ((nx₁+mx₂)/(m+n), (ny₁+my₂)/(m+n))<br>
      중점은 m = n = 1인 특수한 경우!
    `,

    story: `
      중점 공식은 좌표기하학의 가장 기초적인 도구 중 하나야.<br><br>
      고대 그리스에서 <strong>유클리드</strong>는 컴퍼스와 자로 중점을 작도했지만,
      <strong>데카르트</strong>의 좌표계 덕분에 산술적으로 즉시 계산할 수 있게 됐어.<br><br>
      GPS 삼각측량, 컴퓨터 그래픽에서 메시 세분화(subdivision),
      통계학의 평균점(centroid) 등 다양한 분야에서 중점 개념이 활용돼.
    `,

    realLife: [
      { icon: '📍', title: 'GPS 내비게이션', desc: '두 지점의 중간 만남 장소를 좌표 평균으로 계산한다' },
      { icon: '🎮', title: '게임 그래픽', desc: '메시 세분화에서 두 꼭짓점의 중점을 새 점으로 추가한다' },
      { icon: '📊', title: '데이터 분석', desc: '두 데이터 포인트의 중심을 구해 클러스터 중심을 갱신한다' },
    ],

    sliders: [
      { name: 'x1', label: 'A의 x좌표', min: -10, max: 10, default: -3, step: 1 },
      { name: 'y1', label: 'A의 y좌표', min: -10, max: 10, default: 2, step: 1 },
      { name: 'x2', label: 'B의 x좌표', min: -10, max: 10, default: 5, step: 1 },
      { name: 'y2', label: 'B의 y좌표', min: -10, max: 10, default: 8, step: 1 },
    ],

    example: {
      question: '두 점 A(-2, 3)과 B(6, -1)의 중점 M의 좌표를 구하라.',
      answer: 'M(2, 1)',
      steps: [
        'x좌표: (x₁+x₂)/2 = (-2+6)/2 = 4/2 = 2',
        'y좌표: (y₁+y₂)/2 = (3+(-1))/2 = 2/2 = 1',
        '따라서 중점 M = (2, 1)',
      ],
      hints: [
        '힌트 1: 중점은 각 좌표의 평균이야.',
        '힌트 2: x좌표 평균 = (-2+6)/2를 계산해봐.',
        '힌트 3: y좌표 평균 = (3+(-1))/2를 계산해봐.',
      ],
      otherApproaches: [
        { name: '벡터 활용', desc: 'M = A + ½(B - A) = A + ½AB 벡터로 구할 수도 있다.' },
      ],
    },

    evolution: { prev: 'H066', next: 'H074', family: '좌표기하학', familyDescription: '좌표 → 중점 → 무게중심 → 내분·외분점 → 도형의 방정식' },

    visualType: 'coordinate_plane',
    relatedIds: ['H066', 'H072', 'H074'],
  },

  {
    id: 'H074',
    number: 74,
    name: '삼각형의 무게중심',
    latex: 'G = \\left(\\frac{x_1+x_2+x_3}{3}, \\frac{y_1+y_2+y_3}{3}\\right)',
    description: '삼각형 세 꼭짓점 좌표의 산술 평균으로 구하는 무게중심의 좌표 (탐구 활동)',
    level: 'high',
    category: 'geometry',
    tags: ['무게중심', '삼각형', '좌표', '중선', '좌표기하', '고2'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '세 꼭짓점 좌표의 평균!',

    principle: `
      <strong>무게중심 공식:</strong><br>
      삼각형 A(x₁,y₁), B(x₂,y₂), C(x₃,y₃)의 무게중심 G:<br>
      G = ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3)<br><br>
      <strong>무게중심의 성질:</strong><br>
      ① 세 중선(꼭짓점과 대변의 중점을 잇는 선분)이 한 점에서 만남<br>
      ② 그 점이 바로 무게중심 G<br>
      ③ G는 각 중선을 꼭짓점에서 2:1로 내분<br><br>
      <strong>왜 평균일까?</strong><br>
      세 점에 같은 질량을 놓으면 균형을 이루는 점이 좌표의 평균이야.
      중점(2점의 평균)의 자연스러운 확장!
    `,

    story: `
      무게중심 개념은 <strong>아르키메데스</strong>의 지렛대 원리에서 시작됐어.<br><br>
      그는 물체의 균형점을 수학적으로 구하는 방법을 발견했고,
      이것이 좌표기하학과 결합해 공식으로 정리됐지.<br><br>
      무게중심은 물리학의 질량 중심(center of mass) 개념으로 이어져,
      로켓 설계, 건축 구조 안정성, 로봇의 균형 제어 등에 필수적으로 사용돼.
    `,

    realLife: [
      { icon: '🚀', title: '로켓·항공', desc: '비행체의 무게중심 위치가 안정적 비행의 핵심이다' },
      { icon: '🏗️', title: '건축 안정성', desc: '삼각형 구조물의 무게중심으로 하중 분배를 계산한다' },
      { icon: '🤖', title: '로봇 균형', desc: '로봇 발판의 무게중심을 계산해 넘어지지 않게 제어한다' },
    ],

    sliders: [
      { name: 'x1', label: 'A의 x좌표', min: -10, max: 10, default: 0, step: 1 },
      { name: 'y1', label: 'A의 y좌표', min: -10, max: 10, default: 6, step: 1 },
      { name: 'x2', label: 'B의 x좌표', min: -10, max: 10, default: -3, step: 1 },
      { name: 'y2', label: 'B의 y좌표', min: -10, max: 10, default: 0, step: 1 },
      { name: 'x3', label: 'C의 x좌표', min: -10, max: 10, default: 6, step: 1 },
      { name: 'y3', label: 'C의 y좌표', min: -10, max: 10, default: 0, step: 1 },
    ],

    example: {
      question: '삼각형의 세 꼭짓점이 A(1, 5), B(-2, -1), C(7, 2)일 때 무게중심 G의 좌표를 구하라.',
      answer: 'G(2, 2)',
      steps: [
        'x좌표: (x₁+x₂+x₃)/3 = (1+(-2)+7)/3 = 6/3 = 2',
        'y좌표: (y₁+y₂+y₃)/3 = (5+(-1)+2)/3 = 6/3 = 2',
        '따라서 무게중심 G = (2, 2)',
      ],
      hints: [
        '힌트 1: 무게중심은 세 좌표의 평균이야.',
        '힌트 2: x좌표끼리 더해서 3으로 나눠봐.',
        '힌트 3: (1-2+7)/3과 (5-1+2)/3을 계산해.',
      ],
      otherApproaches: [
        { name: '중선 교점', desc: 'A와 BC의 중점(2.5, 0.5)을 잇는 중선, B와 AC의 중점(4, 3.5)을 잇는 중선의 교점으로 구할 수도 있다.' },
      ],
    },

    evolution: { prev: 'H073', next: undefined, family: '좌표기하학', familyDescription: '중점 → 무게중심 → 내심·외심·수심 → 다각형 무게중심' },

    visualType: 'coordinate_plane',
    relatedIds: ['H073', 'H066', 'H039'],
  },

  {
    id: 'H075',
    number: 75,
    name: '여러 가지 미분법',
    latex: '(fg)\' = f\'g + fg\', \\; (f \\circ g)\' = f\'(g) \\cdot g\'',
    description: '곱의 미분법, 몫의 미분법, 합성함수의 미분법을 종합적으로 다루기',
    level: 'high',
    category: 'calculus',
    tags: ['미분법', '곱의미분', '몫의미분', '합성함수', '연쇄법칙', '고2', '미적분'],
    grade: '고2',
    curriculum: '2022개정',

    hook: '곱의 미분, 몫의 미분, 합성함수 미분 — 복잡한 함수도 조각으로!',

    principle: `
      <strong>1. 곱의 미분법 (Product Rule):</strong><br>
      (fg)' = f'g + fg'<br>
      "앞 미분 × 뒤 그대로 + 앞 그대로 × 뒤 미분"<br><br>
      <strong>2. 몫의 미분법 (Quotient Rule):</strong><br>
      (f/g)' = (f'g - fg') / g²<br>
      "아래 그대로×위 미분 − 위 그대로×아래 미분, 아래 제곱으로 나누기"<br><br>
      <strong>3. 합성함수의 미분법 (Chain Rule):</strong><br>
      (f∘g)'(x) = f'(g(x)) · g'(x)<br>
      "바깥 함수를 미분하고, 안쪽 함수의 미분을 곱한다"<br><br>
      <strong>핵심 전략:</strong><br>
      복잡한 함수는 곱, 몫, 합성으로 분해한 뒤<br>
      각각의 규칙을 적용하면 반드시 미분할 수 있어!
    `,

    story: `
      곱의 미분법과 연쇄법칙은 <strong>라이프니츠(Leibniz)</strong>가 1670년대에 체계화했어.<br><br>
      라이프니츠의 dy/dx 표기법은 연쇄법칙을 직관적으로 보여줘:
      dy/dx = (dy/du)·(du/dx) — 마치 분수처럼 약분되는 것 같지!<br><br>
      <strong>뉴턴</strong>도 독립적으로 같은 법칙을 발견했고, 두 사람의 미적분 우선권 논쟁은
      수학사에서 가장 유명한 분쟁이야. 오늘날에는 라이프니츠의 표기법이 더 널리 쓰여.
    `,

    realLife: [
      { icon: '🚀', title: '로켓 추진', desc: '질량이 변하는 로켓의 운동 방정식에 곱의 미분법이 사용된다' },
      { icon: '🧬', title: '생물학 모델', desc: '복합 성장 모델(합성함수)의 변화율을 연쇄법칙으로 구한다' },
      { icon: '📈', title: '금융 파생상품', desc: '옵션 가격의 민감도(그릭스)를 합성함수 미분으로 계산한다' },
    ],

    sliders: [
      { name: 'a', label: 'f(x) = xⁿ의 n', min: 1, max: 5, default: 2, step: 1 },
      { name: 'b', label: 'g(x) = xᵐ의 m', min: 1, max: 5, default: 3, step: 1 },
    ],

    example: {
      question: 'y = (x² + 1)³을 미분하라.',
      answer: "y' = 6x(x² + 1)²",
      steps: [
        '합성함수: 바깥 f(u) = u³, 안쪽 g(x) = x² + 1',
        '연쇄법칙: y\' = f\'(g(x)) · g\'(x)',
        'f\'(u) = 3u², g\'(x) = 2x',
        'y\' = 3(x² + 1)² · 2x',
        'y\' = 6x(x² + 1)²',
      ],
      hints: [
        '힌트 1: 이건 합성함수야. 바깥 함수와 안쪽 함수를 구분해봐.',
        '힌트 2: 바깥은 u³ → 미분하면 3u². 안쪽은 x²+1 → 미분하면 2x.',
        '힌트 3: 연쇄법칙으로 3(x²+1)² × 2x = 6x(x²+1)².',
      ],
      otherApproaches: [
        { name: '전개 후 미분', desc: '(x²+1)³을 전개하면 x⁶+3x⁴+3x²+1. 미분하면 6x⁵+12x³+6x = 6x(x⁴+2x²+1) = 6x(x²+1)². 같은 결과!' },
      ],
    },

    evolution: {
      prev: 'H047',
      next: undefined,
      family: '미분법 계보',
      familyDescription: '미분 정의 → 기본 미분 → 곱·몫·합성 미분 → 대학 다변수 미분',
    },

    visualType: 'diff_rules',
    relatedIds: ['H047', 'H048', 'H049'],
  },
]

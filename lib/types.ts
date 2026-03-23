export type Level = 'elementary' | 'middle' | 'high' | 'university'

export type Category =
  | 'arithmetic'    // 수와 연산
  | 'geometry'      // 도형
  | 'algebra'       // 대수/방정식
  | 'function'      // 함수/그래프
  | 'sequence'      // 수열
  | 'probability'   // 확률/통계
  | 'calculus'      // 미적분
  | 'trigonometry'  // 삼각함수

export interface RealLifeItem {
  icon: string
  title: string
  desc: string
}

export interface Slider {
  name: string
  label: string
  min: number
  max: number
  default: number
  step?: number
}

export interface Example {
  question: string
  answer: string
  steps: string[]
  hints: string[]
  otherApproaches: {
    name: string
    desc: string
  }[]
}

export interface Evolution {
  prev?: string       // 이전 공식 id
  next?: string       // 다음 공식 id
  family: string      // 계보 이름 (예: "넓이 계보")
  familyDescription?: string
}

export interface Formula {
  id: string                  // "004"
  number: number              // 4
  name: string                // "피타고라스의 정리"
  latex: string               // "c^2 = a^2 + b^2"
  latexDisplay?: string       // 화면 표시용 (없으면 latex 사용)
  description: string         // 한 줄 설명
  level: Level
  category: Category
  tags: string[]              // 검색 태그
  grade?: '1~2학년' | '3~4학년' | '5~6학년' | '1-2' | '3-4' | '5-6' | '중1' | '중2' | '중3' | '고1' | '고2' | '고3' | '대학'
  curriculum?: '2022개정' | '2015개정'

  // 7단계 콘텐츠
  hook: string                // 훅 문구
  principle: string           // 원리 설명 (HTML 가능)
  story: string               // 탄생 스토리 (HTML 가능)
  realLife: RealLifeItem[]    // 실생활 연결 3개
  sliders?: Slider[]          // 직접 해보기 슬라이더
  example: Example            // 예제 문제

  // 계보
  evolution: Evolution

  // 시각화
  visualType: string          // p5.js 템플릿 이름
  videoPath?: string          // Manim 영상 경로 (public/videos/)

  // 메타
  relatedIds?: string[]       // 관련 공식 id 목록
}

// 레벨 한국어 맵핑
export const LEVEL_KO: Record<Level, string> = {
  elementary: '초등',
  middle: '중등',
  high: '고등',
  university: '대학',
}

// 레벨 색상
export const LEVEL_COLOR: Record<Level, { bg: string; text: string; border: string }> = {
  elementary: { bg: 'rgba(6,78,59,0.7)', text: '#4ade80', border: 'rgba(74,222,128,0.3)' },
  middle: { bg: 'rgba(30,58,95,0.7)', text: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
  high: { bg: 'rgba(67,20,7,0.7)', text: '#fb923c', border: 'rgba(251,146,60,0.3)' },
  university: { bg: 'rgba(59,7,100,0.7)', text: '#c084fc', border: 'rgba(192,132,252,0.3)' },
}

// 카테고리 한국어 맵핑
export const CATEGORY_KO: Record<Category, string> = {
  arithmetic: '수와 연산',
  geometry: '도형',
  algebra: '대수/방정식',
  function: '함수/그래프',
  sequence: '수열',
  probability: '확률/통계',
  calculus: '미적분',
  trigonometry: '삼각함수',
}

// 카테고리 이모지
export const CATEGORY_EMOJI: Record<Category, string> = {
  arithmetic: '🔢',
  geometry: '🔺',
  algebra: '📐',
  function: '📈',
  sequence: '🔢',
  probability: '🎲',
  calculus: '∫',
  trigonometry: '〰️',
}

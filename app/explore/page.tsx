'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/Header'
import FormulaCard from '@/components/FormulaCard'
import { ALL_FORMULAS } from '@/data/formulas/index'
import { Level, Category, LEVEL_KO, CATEGORY_KO, CATEGORY_EMOJI } from '@/lib/types'

const LEVELS: { value: Level | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'elementary', label: '초등' },
  { value: 'middle', label: '중등' },
  { value: 'high', label: '고등' },
  { value: 'university', label: '대학' },
]

const CATEGORIES: { value: Category | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: '전체보기', emoji: '✦' },
  { value: 'arithmetic', label: '수와 연산', emoji: '🔢' },
  { value: 'geometry', label: '도형', emoji: '🔺' },
  { value: 'algebra', label: '대수/방정식', emoji: '📐' },
  { value: 'function', label: '함수/그래프', emoji: '📈' },
  { value: 'sequence', label: '수열', emoji: '🔢' },
  { value: 'probability', label: '확률/통계', emoji: '🎲' },
  { value: 'calculus', label: '미적분', emoji: '∫' },
  { value: 'trigonometry', label: '삼각함수', emoji: '〰️' },
]

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<Level | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')

  const filtered = useMemo(() => {
    return ALL_FORMULAS.filter(f => {
      const matchLevel = selectedLevel === 'all' || f.level === selectedLevel
      const matchCategory = selectedCategory === 'all' || f.category === selectedCategory
      const matchQuery = query === '' ||
        f.name.includes(query) ||
        f.description.includes(query) ||
        f.tags?.some(t => t.includes(query)) ||
        f.id.toLowerCase().includes(query.toLowerCase())
      return matchLevel && matchCategory && matchQuery
    })
  }, [query, selectedLevel, selectedCategory])

  const tabStyle = (active: boolean) => ({
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    cursor: 'pointer' as const,
    transition: 'all 0.2s',
    border: '1px solid',
    fontFamily: 'Noto Sans KR, sans-serif',
    color: active ? 'var(--mint)' : 'var(--sub)',
    background: active ? 'rgba(0,255,204,0.08)' : 'transparent',
    borderColor: active ? 'rgba(0,255,204,0.2)' : 'rgba(255,255,255,0.07)',
  })

  const catStyle = (active: boolean) => ({
    padding: '7px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    cursor: 'pointer' as const,
    transition: 'all 0.2s',
    border: '1px solid',
    fontFamily: 'Noto Sans KR, sans-serif',
    color: active ? '#a78bfa' : 'var(--sub)',
    background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
    borderColor: active ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.07)',
  })

  return (
    <div className="min-h-screen">
      <Header />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

        {/* 헤더 */}
        <div className="mb-8">
          <div
            className="text-[10px] tracking-[4px] uppercase mb-3"
            style={{ color: 'var(--sub)', fontFamily: 'Syne, sans-serif' }}
          >
            <span style={{ color: 'var(--mint)' }}>FORMULA</span> EXPLORER
          </div>
          <h1
            className="text-3xl font-black text-white mb-2"
            style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-1px' }}
          >
            수학 공식 탐험
          </h1>
          <p style={{ color: 'var(--sub)', fontSize: '14px', fontFamily: 'Noto Sans KR' }}>
            현재 <span style={{ color: 'var(--mint)' }}>{ALL_FORMULAS.length}개</span> 공식 수록 · 초등~대학
          </p>
        </div>

        {/* 검색창 */}
        <div className="mb-6">
          <div
            className="flex items-center gap-3 h-12 px-5 rounded-full transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              maxWidth: '480px',
            }}
          >
            <span style={{ color: 'var(--sub)', fontSize: '16px' }}>⌕</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="공식 이름, 설명, 태그 검색..."
              className="flex-1 bg-transparent border-none outline-none text-white text-sm"
              style={{
                fontFamily: 'Noto Sans KR, sans-serif',
                caretColor: 'var(--mint)',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ color: 'var(--sub)', fontSize: '16px', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 레벨 필터 */}
        <div className="flex gap-2 flex-wrap mb-4">
          {LEVELS.map(lv => (
            <button
              key={lv.value}
              onClick={() => setSelectedLevel(lv.value)}
              style={tabStyle(selectedLevel === lv.value)}
            >
              {lv.label}
            </button>
          ))}
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              style={catStyle(selectedCategory === cat.value)}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* 결과 수 */}
        <div className="mb-5" style={{ color: 'var(--sub)', fontSize: '13px', fontFamily: 'Noto Sans KR' }}>
          {filtered.length === ALL_FORMULAS.length
            ? `전체 ${filtered.length}개`
            : `검색 결과 ${filtered.length}개`}
        </div>

        {/* 공식 그리드 */}
        {filtered.length > 0 ? (
          <div className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {filtered.map(f => (
              <FormulaCard key={f.id} formula={f} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div style={{ fontSize: '48px', opacity: 0.3 }}>∅</div>
            <p style={{ color: 'var(--sub)', fontFamily: 'Noto Sans KR' }}>
              &quot;{query}&quot; 검색 결과가 없어요
            </p>
            <button
              onClick={() => { setQuery(''); setSelectedLevel('all'); setSelectedCategory('all') }}
              className="px-4 py-2 rounded-full text-sm transition-all"
              style={{
                border: '1px solid rgba(0,255,204,0.2)',
                color: 'var(--mint)',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'Noto Sans KR',
              }}
            >
              필터 초기화
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

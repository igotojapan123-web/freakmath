'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const QUICK_TAGS = ['피타고라스', '근의 공식', '오일러 공식', '황금비', '사인 법칙', '미분']

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/explore')
    }
  }

  return (
    <div className="w-full max-w-[500px]">
      {/* 검색창 */}
      <div
        className="flex items-center gap-3 h-14 px-6 rounded-full transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        onFocus={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(0,255,204,0.4)'
          el.style.background = 'rgba(0,255,204,0.04)'
          el.style.boxShadow = '0 0 0 4px rgba(0,255,204,0.08), 0 0 50px rgba(0,255,204,0.06)'
        }}
        onBlur={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(255,255,255,0.1)'
          el.style.background = 'rgba(255,255,255,0.04)'
          el.style.boxShadow = 'none'
        }}
      >
        <span style={{ color: 'var(--sub)', fontSize: '18px' }}>⌕</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="피타고라스, 근의 공식, 오일러..."
          className="flex-1 bg-transparent border-none outline-none text-[15px] text-white"
          style={{
            fontFamily: 'Noto Sans KR, sans-serif',
            caretColor: 'var(--mint)',
          }}
        />
        <button
          onClick={handleSearch}
          className="flex-shrink-0 px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200"
          style={{
            fontFamily: 'Syne, sans-serif',
            background: 'var(--mint)',
            color: '#000',
          }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.background = 'var(--mint2)'
            ;(e.target as HTMLElement).style.boxShadow = '0 0 28px rgba(0,255,204,0.4)'
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.background = 'var(--mint)'
            ;(e.target as HTMLElement).style.boxShadow = 'none'
          }}
        >
          탐험하기
        </button>
      </div>

      {/* 빠른 검색 태그 */}
      <div className="flex gap-2 justify-center mt-4 flex-wrap">
        {QUICK_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => {
              setQuery(tag)
              router.push(`/explore?q=${encodeURIComponent(tag)}`)
            }}
            className="text-[12px] px-3 py-1 rounded-[14px] transition-all duration-200"
            style={{
              color: 'var(--sub2)',
              border: '1px solid var(--border)',
              fontFamily: 'Noto Sans KR, sans-serif',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.color = 'var(--mint)'
              el.style.borderColor = 'rgba(0,255,204,0.2)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.color = 'var(--sub2)'
              el.style.borderColor = 'var(--border)'
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { Formula, CATEGORY_KO } from '@/lib/types'
import LevelBadge from './LevelBadge'
import FormulaLatex from './FormulaLatex'

export default function FormulaCard({ formula }: { formula: Formula }) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/formula/${formula.id}`)}
      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(0,255,204,0.2)'
        el.style.boxShadow = '0 0 30px rgba(0,255,204,0.07), 0 12px 40px rgba(0,0,0,0.5)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(255,255,255,0.07)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* 공식 미리보기 */}
      <div
        className="h-24 flex items-center justify-center relative overflow-hidden"
        style={{ background: '#05080f', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* 배경 그리드 */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,204,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,204,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />
        {/* 공식 텍스트 (KaTeX) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '90%' }}>
          <FormulaLatex
            latex={formula.latexDisplay || formula.latex}
            displayMode={false}
            fontSize={14}
            color="#00ffcc"
          />
        </div>
      </div>

      {/* 카드 본문 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[11px] tracking-wider"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--mint)' }}
          >
            {formula.id}
          </span>
          <LevelBadge level={formula.level} />
        </div>

        <h3
          className="font-bold text-white mb-1.5 text-[14px] leading-snug"
          style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
        >
          {formula.name}
        </h3>

        <p
          className="text-[12px] leading-relaxed mb-3"
          style={{ color: 'var(--sub)', fontFamily: 'Noto Sans KR, sans-serif' }}
        >
          {formula.description}
        </p>

        <div className="flex items-center justify-between pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <span
            className="text-[10px] px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(124,58,237,0.12)',
              color: '#a78bfa',
              border: '1px solid rgba(124,58,237,0.18)',
              fontFamily: 'Noto Sans KR, sans-serif',
            }}
          >
            {CATEGORY_KO[formula.category]}
          </span>
          <span
            className="text-[12px] transition-colors duration-200 group-hover:text-mint"
            style={{ color: 'var(--sub)', fontFamily: 'Noto Sans KR, sans-serif' }}
          >
            탐험하기 →
          </span>
        </div>
      </div>
    </div>
  )
}

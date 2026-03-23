'use client'

import { useRouter } from 'next/navigation'
import { Formula, LEVEL_COLOR, LEVEL_KO } from '@/lib/types'

export default function EvolutionChain({
  chain,
  currentId,
}: {
  chain: Formula[]
  currentId: string
}) {
  const router = useRouter()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      flexWrap: 'wrap',
      padding: '8px 0',
    }}>
      {chain.map((f, i) => {
        const isCurrent = f.id === currentId
        const color = LEVEL_COLOR[f.level]
        return (
          <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              onClick={() => !isCurrent && router.push(`/formula/${f.id}`)}
              style={{
                padding: '12px 16px',
                borderRadius: '16px',
                textAlign: 'center',
                cursor: isCurrent ? 'default' : 'pointer',
                transition: 'all 0.25s',
                background: isCurrent ? color.bg : 'rgba(255,255,255,0.03)',
                border: isCurrent
                  ? `2px solid ${color.text}`
                  : '1px solid rgba(255,255,255,0.1)',
                boxShadow: isCurrent ? `0 0 20px ${color.text}30` : 'none',
                transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                minWidth: '90px',
                maxWidth: '130px',
              }}
            >
              <div style={{
                fontSize: '10px', fontWeight: 700,
                color: color.text, fontFamily: 'Syne, sans-serif', marginBottom: '4px',
              }}>
                {LEVEL_KO[f.level]}{isCurrent ? ' ← 지금' : ''}
              </div>
              <div style={{
                fontSize: '11px',
                color: isCurrent ? '#fff' : 'rgba(255,255,255,0.55)',
                fontFamily: 'Noto Sans KR, sans-serif',
                fontWeight: isCurrent ? 700 : 400,
                lineHeight: 1.4,
                wordBreak: 'keep-all',
              }}>
                {f.name}
              </div>
              <div style={{
                fontSize: '9px', color: color.text,
                fontFamily: 'JetBrains Mono, monospace',
                opacity: 0.6, marginTop: '3px',
              }}>
                {f.id}
              </div>
            </div>
            {i < chain.length - 1 && (
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '18px', flexShrink: 0 }}>
                →
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

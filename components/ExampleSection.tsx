'use client'

import { useState } from 'react'

export default function ExampleSection({ example }: { example: any }) {
  const [showHint, setShowHint]  = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <div style={{ background: '#05080f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '22px' }}>
      <p style={{ fontSize: '14px', color: '#fff', lineHeight: 1.8, marginBottom: '18px', fontFamily: 'Noto Sans KR' }}>
        {example.question}
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <button onClick={() => setShowHint(!showHint)}
          style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', background: showHint ? 'rgba(124,58,237,0.12)' : 'transparent', cursor: 'pointer', fontSize: '13px', fontFamily: 'Noto Sans KR', transition: 'all .2s' }}>
          힌트 {showHint ? '닫기' : '보기'}
        </button>
        <button onClick={() => setShowSteps(!showSteps)}
          style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(0,255,204,0.2)', color: 'var(--mint)', background: showSteps ? 'rgba(0,255,204,0.08)' : 'transparent', cursor: 'pointer', fontSize: '13px', fontFamily: 'Noto Sans KR', transition: 'all .2s' }}>
          풀이 {showSteps ? '닫기' : '보기'}
        </button>
        <button onClick={() => setShowAnswer(!showAnswer)}
          style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(251,191,36,0.2)', color: 'var(--amber)', background: showAnswer ? 'rgba(251,191,36,0.08)' : 'transparent', cursor: 'pointer', fontSize: '13px', fontFamily: 'Noto Sans KR', transition: 'all .2s' }}>
          정답 {showAnswer ? '닫기' : '보기'}
        </button>
      </div>

      {showHint && (
        <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {example.hints.map((h: string, i: number) => (
            <div key={i} style={{ padding: '11px 15px', borderLeft: '3px solid rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.06)', borderRadius: '0 10px 10px 0', fontSize: '13px', color: 'var(--text)', lineHeight: 1.7, fontFamily: 'Noto Sans KR' }}>
              {h}
            </div>
          ))}
        </div>
      )}

      {showSteps && (
        <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {example.steps.map((s: string, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '12px', padding: '8px 14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--mint)', fontFamily: 'JetBrains Mono', minWidth: '20px' }}>{i+1}</span>
              <span style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.7, fontFamily: 'Noto Sans KR' }}>{s}</span>
            </div>
          ))}
        </div>
      )}

      {showAnswer && (
        <div style={{ padding: '14px 18px', background: 'rgba(0,255,204,0.08)', border: '1px solid rgba(0,255,204,0.2)', borderRadius: '12px', fontSize: '15px', fontWeight: 700, color: 'var(--mint)', fontFamily: 'Noto Sans KR', marginBottom: '12px' }}>
          정답: {example.answer}
        </div>
      )}

      {example.otherApproaches?.length > 0 && (
        <div style={{ padding: '14px 16px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--amber)', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '7px', fontFamily: 'Syne, sans-serif' }}>다른 풀이법</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px', fontFamily: 'Noto Sans KR' }}>{example.otherApproaches[0].name}</div>
          <div style={{ fontSize: '12px', color: 'var(--sub)', lineHeight: 1.7, fontFamily: 'Noto Sans KR' }}>{example.otherApproaches[0].desc}</div>
        </div>
      )}
    </div>
  )
}

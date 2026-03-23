import Header from '@/components/Header'

export default function TutorPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>✦</div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '12px', fontFamily: 'Syne, sans-serif' }}>
          AI 튜터
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--sub)', lineHeight: 1.7, fontFamily: 'Noto Sans KR' }}>
          AI 튜터 기능은 준비 중입니다.<br />
          공식 탐험 페이지에서 각 공식의 힌트와 풀이를 확인해보세요.
        </p>
        <a
          href="/explore"
          style={{
            display: 'inline-block', marginTop: '24px', padding: '10px 24px',
            borderRadius: '20px', fontSize: '14px', fontFamily: 'Noto Sans KR',
            color: 'var(--mint)', border: '1px solid rgba(0,255,204,0.2)',
            textDecoration: 'none',
          }}
        >
          공식 탐험하기 →
        </a>
      </div>
    </div>
  )
}

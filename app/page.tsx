import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* 로고 */}
        <div
          className="font-black leading-none tracking-[-4px] mb-12"
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(60px, 10vw, 110px)',
          }}
        >
          <span style={{ color: 'var(--mint)', textShadow: '0 0 80px rgba(0,255,204,0.4), 0 0 160px rgba(0,255,204,0.1)' }}>
            FREAK
          </span>
          <span className="text-white">MATH</span>
        </div>

        {/* 검색창 */}
        <SearchBar />
      </main>

      {/* 푸터 */}
      <footer
        className="flex items-center justify-between px-9 py-5 text-[12px] border-t flex-shrink-0"
        style={{
          borderColor: 'var(--border)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(0,0,8,0.5)',
          color: 'var(--sub2)',
        }}
      >
        <div>© 2026 Freakmath · Selix · 대한수학회 자료 기반</div>
        <div className="flex gap-5">
          <a href="/explore" className="hover:text-mint transition-colors">공식 탐험</a>
          <a href="/tutor" className="hover:text-mint transition-colors">AI 튜터</a>
          <a href="https://instagram.com/freakmath" className="hover:text-mint transition-colors">@freakmath</a>
        </div>
        <div style={{ color: 'var(--sub2)', fontSize: '11px' }}>수학을 처음부터 끝까지 탐험하다</div>
      </footer>
    </div>
  )
}

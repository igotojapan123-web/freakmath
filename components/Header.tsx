'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  const tabs = [
    { href: '/', label: '🌌 탐험', match: '/' },
    { href: '/explore', label: '📐 공식', match: '/explore' },
    { href: '/tutor', label: '✦ AI 튜터', match: '/tutor' },
  ]

  return (
    <header
      className="flex items-center justify-between px-9 h-14 flex-shrink-0 border-b sticky top-0 z-50"
      style={{
        borderColor: 'var(--border)',
        backdropFilter: 'blur(24px)',
        background: 'rgba(0,0,8,0.5)',
      }}
    >
      <Link href="/" className="flex flex-col cursor-pointer select-none">
        <div
          className="text-[19px] font-black leading-none"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          <span style={{ color: 'var(--mint)' }}>FREAK</span>
          <span className="text-white">MATH</span>
        </div>
        <div
          className="text-[9px] mt-0.5 tracking-[3px] uppercase"
          style={{ color: 'var(--sub2)', fontFamily: 'Syne, sans-serif' }}
        >
          수학 탐험 플랫폼
        </div>
      </Link>

      <nav className="flex gap-0.5">
        {tabs.map(tab => {
          const isActive = pathname === tab.match ||
            (tab.match !== '/' && pathname.startsWith(tab.match))
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 border"
              style={{
                fontFamily: 'Noto Sans KR, sans-serif',
                color: isActive ? 'var(--mint)' : 'var(--sub)',
                background: isActive ? 'rgba(0,255,204,0.08)' : 'transparent',
                borderColor: isActive ? 'rgba(0,255,204,0.15)' : 'transparent',
              }}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

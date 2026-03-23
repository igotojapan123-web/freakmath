import type { Metadata } from 'next'
import './globals.css'
import StarBackground from '@/components/StarBackground'

export const metadata: Metadata = {
  title: 'FREAKMATH — 수학 탐험 플랫폼',
  description: '초등부터 대학까지 모든 수학 공식을 시각화로 이해하는 한국 최초 수학 탐험 플랫폼',
  keywords: '수학 공식, 수학 시각화, 피타고라스, 근의 공식, 수학 탐험, 수포자',
  openGraph: {
    title: 'FREAKMATH — 수학 탐험 플랫폼',
    description: '수학이 눈 앞에서 살아 움직인다',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <StarBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}

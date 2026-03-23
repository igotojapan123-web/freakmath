'use client'

import { Level, LEVEL_KO, LEVEL_COLOR } from '@/lib/types'

export default function LevelBadge({ level }: { level: Level }) {
  const color = LEVEL_COLOR[level]
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
      style={{
        fontFamily: 'Syne, sans-serif',
        background: color.bg,
        color: color.text,
        border: `1px solid ${color.border}`,
      }}
    >
      {LEVEL_KO[level]}
    </span>
  )
}

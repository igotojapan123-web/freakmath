'use client'

import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface Props {
  latex: string
  displayMode?: boolean
  fontSize?: number
  color?: string
}

export default function FormulaLatex({
  latex,
  displayMode = false,
  fontSize = 28,
  color = '#00ffcc',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    try {
      katex.render(latex, ref.current, {
        displayMode,
        throwOnError: false,
        errorColor: '#f87171',
        trust: true,
        strict: false,
      })
      ref.current.style.color = color
      ref.current.style.fontSize = fontSize + 'px'
      ref.current.style.textShadow = `0 0 20px ${color}60`
    } catch {
      if (ref.current) ref.current.textContent = latex
    }
  }, [latex, displayMode, color, fontSize])

  return <div ref={ref} />
}

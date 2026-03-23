'use client'

import { useState } from 'react'
import { Formula } from '@/lib/types'
import FormulaVizClient from './FormulaVizClient'

export default function FormulaSlider({ formula }: { formula: Formula }) {
  const init = formula.sliders
    ? Object.fromEntries(formula.sliders.map(s => [s.name, s.default]))
    : {}
  const [vals, setVals] = useState<Record<string, number>>(init)

  if (!formula.sliders || formula.sliders.length === 0) return null

  const result = calcResult(formula.id, vals)

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '22px' }}>
      {formula.sliders.map(s => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', color: 'var(--mint)', width: '60px' }}>{s.label}</span>
          <input type="range" min={s.min} max={s.max} step={s.step || 1} value={vals[s.name]} aria-label={s.label}
            onChange={e => setVals(p => ({ ...p, [s.name]: Number(e.target.value) }))}
            style={{ flex: 1, accentColor: 'var(--mint)' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '16px', color: '#fff', width: '36px', textAlign: 'right' }}>{vals[s.name]}</span>
        </div>
      ))}

      <div style={{ background: '#05080f', borderRadius: '10px', overflow: 'hidden', marginBottom: '14px' }}>
        <FormulaVizClient visualType={formula.visualType} values={vals} height={180} />
      </div>

      <div style={{ background: '#05080f', border: '1px solid rgba(0,255,204,0.15)', borderRadius: '10px', padding: '14px', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', color: 'var(--mint)' }}>
        {result}
      </div>
    </div>
  )
}

function calcResult(id: string, v: Record<string, number>): string {
  const s = (key: string, fb: number) => v[key] ?? fb
  const r = (n: number, d = 2) => Number.isFinite(n) ? parseFloat(n.toFixed(d)) : 0
  const a = s('a', 3), b = s('b', 4), c = s('c', 2), n = s('n', 7)

  switch(id) {
    // 1~2학년
    case 'E001': return `${a} + ${b} = ${a + b}`
    case 'E002': return `${a} - ${b} = ${Math.max(0, a - b)}`
    case 'E003': return `${a} + ${b} = ${a + b} \u2192 ${a + b} - ${b} = ${a}`
    case 'E004': return `${a} \u00D7 ${b} = ${a * b}`
    // 3~4학년
    case 'E005': return `${a} \u00D7 ${b} = ${a * b}`
    case 'E006': return `${a} \u00F7 ${b} = ${b > 0 ? r(a / b) : '?'}`
    case 'E007': return `${a} \u00D7 ${b} = ${a * b} \u2192 ${a * b} \u00F7 ${b} = ${a}`
    case 'E008': return `${a} \u2192 \uBC18\uC62C\uB9BC ${Math.round(a / 100) * 100}`
    case 'E009': return `${a}/${b} (\uBD84\uC790 ${a}, \uBD84\uBAA8 ${b})`
    case 'E010': return `${a}.${b} = ${a + (b || 0) / 10}`
    case 'E011': return `${a}/${n} + ${b}/${n} = ${a + b}/${n}`
    case 'E012': return `${r(a, 1)} + ${r(b, 1)} = ${r(a + b, 1)}`
    // 5~6학년
    case 'E013': return `\uAD04\uD638 \u2192 \u00D7\u00F7 \u2192 +\u2212`
    case 'E014': return `${a} \u2264 x < ${b}`
    case 'E015': { const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y); return `\uCD5C\uB300\uACF5\uC57D\uC218(${a}, ${b}) = ${gcd(a, b)}` }
    case 'E016': { const gcd2 = (x: number, y: number): number => y === 0 ? x : gcd2(y, x % y); return `\uCD5C\uC18C\uACF5\uBC30\uC218(${a}, ${b}) = ${(a * b) / gcd2(a, b)}` }
    case 'E017': return `\uC57D\uBD84: \uBD84\uC790\uBD84\uBAA8\uB97C \uACF5\uC57D\uC218\uB85C \uB098\uB204\uAE30`
    case 'E018': return `\uD1B5\uBD84 \uD6C4 \uB367\uC148`
    case 'E019': return `${a}/${b} \u00D7 ${s('c', 3)}/${s('d', 4)} = ${a * s('c', 3)}/${b * s('d', 4)}`
    case 'E020': return `\uB098\uB204\uB294 \uBD84\uC218 \uB4A4\uC9D1\uC5B4\uC11C \uACF1\uD558\uAE30`
    case 'E021': return `${r(a, 1)} \u00D7 ${b} = ${r(a * b, 1)}`
    case 'E022': return `${r(a, 1)} \u00F7 ${b} = ${b > 0 ? r(a / b, 1) : '?'}`
    case 'E023': return `\u25A1 = ${a} \u2192 \u25B3 = ${a + 2}`
    case 'E024': return `\uBE44\uC728 = ${a} \u00F7 ${b} = ${b > 0 ? r(a / b) : '?'}`
    case 'E025': return `${r(a * 100)}% = ${r(a)}`
    case 'E026': return `${a} : ${b} = ${a * 2} : ${b * 2}`
    case 'E027': return `\uBE44\uB840\uBC30\uBD84`
    case 'E028': return `\uAC01\uB3C4 = ${s('angle', 90)}\u00B0`
    case 'E029': return `180\u00B0 - ${a}\u00B0 - ${b}\u00B0 = ${180 - a - b}\u00B0`
    case 'E030': return `360\u00B0 - ${a}\u00B0 - ${b}\u00B0 - ${c}\u00B0 = ${360 - a - b - c}\u00B0`
    // 도형
    case 'E031': return `\uB458\uB808 = 2\u00D7(${a}+${b}) = ${2 * (a + b)}`
    case 'E032': return `\uB113\uC774 = ${a}\u00D7${b} = ${a * b}`
    case 'E033': return `\uB113\uC774 = ${a}\u00D7${a} = ${a * a}`
    case 'E034': return `\uB113\uC774 = ${a}\u00D7${b} = ${a * b}`
    case 'E035': return `\uB113\uC774 = ${a}\u00D7${b}\u00F72 = ${r(a * b / 2)}`
    case 'E036': return `\uB113\uC774 = (${a}+${b})\u00D7${c}\u00F72 = ${r((a + b) * c / 2)}`
    case 'E037': return `\uB113\uC774 = ${a}\u00D7${b}\u00F72 = ${r(a * b / 2)}`
    case 'E038': return `\uC6D0\uC8FC\uC728 \u2248 3.14`
    case 'E039': return `\uC6D0\uC8FC = ${a}\u00D73.14 = ${r(a * 3.14)}`
    case 'E040': return `\uB113\uC774 = ${a}\u00D7${a}\u00D73.14 = ${r(a * a * 3.14)}`
    case 'E041': return `\uAC89\uB113\uC774 = 2(${a}\u00D7${b}+${b}\u00D7${c}+${c}\u00D7${a}) = ${2 * (a * b + b * c + c * a)}`
    case 'E042': return `\uBD80\uD53C = ${a}\u00D7${b}\u00D7${c} = ${a * b * c}`
    case 'E043': { const ns = [a, b, c]; return `\uD3C9\uADE0 = (${ns.join('+')})\u00F7${ns.length} = ${r(ns.reduce((x, y) => x + y, 0) / ns.length, 1)}` }
    default: return Object.entries(v).map(([k, val]) => `${k}=${val ?? 0}`).join(', ')
  }
}

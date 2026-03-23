'use client'

import { useEffect, useRef } from 'react'

const MINT   = '#00ffcc'
const PURPLE = '#a78bfa'
const AMBER  = '#fbbf24'
const WHITE  = '#ffffff'
const BG2    = '#05080f'

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeOutElastic = (t: number) => {
  if (t === 0 || t === 1) return t
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1
}

interface Props {
  visualType: string
  values?: Record<string, number>
  height?: number
}

export default function FormulaViz({ visualType, values = {}, height = 240 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef  = useRef<number>(0)
  const tRef      = useRef<number>(0)

  useEffect(() => {
    const cv  = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')!

    const resize = () => {
      cv.width = Math.round(cv.getBoundingClientRect().width) || cv.offsetWidth || 800
      cv.height = height
    }
    requestAnimationFrame(resize)
    window.addEventListener('resize', resize)

    tRef.current = 0
    cancelAnimationFrame(frameRef.current)

    const draw = () => {
      const W = cv.width, H = cv.height
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = BG2
      ctx.fillRect(0, 0, W, H)

      ctx.strokeStyle = 'rgba(0,255,204,0.04)'
      ctx.lineWidth = 0.5
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke() }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke() }

      const rawT = tRef.current
      // 무한 루프: 180프레임 애니메이션 + 180프레임(3초) 대기 = 360프레임 주기
      const loopLen = 360
      const loopT = rawT % loopLen
      const T = Math.min(loopT, 180)
      const p = Math.min(1, T / 180)
      drawViz(ctx, W, H, T, p, visualType, values)
      tRef.current++
      frameRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visualType, JSON.stringify(values), height])

  return (
    <canvas
      ref={canvasRef}
      aria-label={`${visualType} 시각화 애니메이션`}
      role="img"
      style={{ width: '100%', height, display: 'block', borderRadius: '12px' }}
    />
  )
}

function drawViz(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  T: number, p: number,
  type: string,
  vals: Record<string, number>
) {
  const cx = W / 2, cy = H / 2
  const M = 16 // margin
  const r = (n: number, d = 2) => Number.isFinite(n) ? parseFloat(n.toFixed(d)) : 0

  // 안전한 값 접근: NaN/undefined 방어
  const v = (key: string, fallback: number) => {
    const val = vals[key]
    return (Number.isFinite(val) ? val : fallback)
  }

  // 좌표 clamp
  const clx = (x: number) => Math.max(M, Math.min(W - M, x))
  const cly = (y: number) => Math.max(M, Math.min(H - M, y))

  const gText = (text: string, x: number, y: number, color: string, size: number, alpha = 1) => {
    if (!Number.isFinite(x) || !Number.isFinite(y) || alpha <= 0) return
    ctx.save()
    ctx.globalAlpha = Math.min(1, Math.max(0, alpha))
    ctx.fillStyle = color
    ctx.shadowBlur = 16; ctx.shadowColor = color
    ctx.font = `bold ${Math.max(8, size)}px JetBrains Mono, monospace`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(text, clx(x), cly(y))
    ctx.restore()
  }

  const gLine = (x1: number, y1: number, x2: number, y2: number, color: string, w = 2, alpha = 1) => {
    if (!Number.isFinite(x1 + y1 + x2 + y2) || alpha <= 0) return
    ctx.save()
    ctx.globalAlpha = Math.min(1, Math.max(0, alpha))
    ctx.strokeStyle = color; ctx.lineWidth = w
    ctx.shadowBlur = 12; ctx.shadowColor = color
    ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
    ctx.restore()
  }

  const gCircle = (x: number, y: number, r: number, color: string, fill = false, alpha = 1) => {
    if (!Number.isFinite(x + y + r) || r <= 0 || alpha <= 0) return
    ctx.save()
    ctx.globalAlpha = Math.min(1, Math.max(0, alpha))
    ctx.strokeStyle = color; ctx.lineWidth = 2
    ctx.shadowBlur = 16; ctx.shadowColor = color
    if (fill) { ctx.fillStyle = color + '33'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill() }
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.stroke()
    ctx.restore()
  }

switch (type) {

  // ══════════════════════════════════════════
  // ══════════════════════════════════════════
  // E001~E010 — 설계서 기반 전용 시각화
  // 색상: 보라(#534AB7), 초록(#1D9E75), 주황(#D85A30)
  // ══════════════════════════════════════════
  case 'addition': {
    const VIO = '#534AB7', GRN = '#1D9E75'
    const a = v('a', 3), b = v('b', 4)
    const sz = Math.min(32, (W - 60) / (a + b + 3)), gap2 = 4
    const totalItems = a + b
    const startA = cx - (totalItems * (sz + gap2)) / 2
    const yy = cy - 10

    // 단계1~2: 사과(원) a개 보라 + b개 초록
    for (let i = 0; i < a; i++) {
      const prog = easeOutElastic(Math.min(1, Math.max(0, p * 2.5 - i * 0.08)))
      const x = startA + i * (sz + gap2) + sz / 2
      gCircle(x, yy, sz / 2 - 2, VIO, true, prog * 0.9)
    }
    for (let i = 0; i < b; i++) {
      // 단계4: p>0.4 이후 오른쪽 사과가 왼쪽으로 슬라이드
      const slideP = Math.min(1, Math.max(0, (p - 0.4) * 3))
      const origX = cx + 40 + i * (sz + gap2) + sz / 2
      const targetX = startA + (a + i) * (sz + gap2) + sz / 2
      const x = origX + (targetX - origX) * easeOutCubic(slideP)
      const prog = easeOutElastic(Math.min(1, Math.max(0, (p - 0.15) * 2 - i * 0.08)))
      gCircle(x, yy, sz / 2 - 2, GRN, true, prog * 0.9)
    }
    // 단계3: 위에 "a + b" 텍스트
    if (p > 0.1) gText(`${a} + ${b}`, cx, yy - sz - 10, 'rgba(255,255,255,0.6)', 16, easeOutCubic((p - 0.1) / 0.3))
    // 단계5: "= 합" 결과
    if (p > 0.7) {
      const fp = easeOutCubic((p - 0.7) / 0.3)
      gText(`= ${a + b}`, cx, yy + sz + 20, '#1D9E75', 22, fp)
      // 전체 묶음 강조 테두리
      ctx.save(); ctx.globalAlpha = fp * 0.3; ctx.strokeStyle = '#1D9E75'; ctx.lineWidth = 2; ctx.shadowBlur = 12; ctx.shadowColor = '#1D9E75'
      ctx.strokeRect(startA - 4, yy - sz / 2 - 4, totalItems * (sz + gap2) + 4, sz + 8); ctx.restore()
    }
    break
  }

  case 'subtraction': {
    const VIO = '#534AB7', RED = '#D85A30'
    const total = v('a', 7), sub = v('b', 3)
    const remain = Math.max(0, total - sub)
    const sz = Math.min(32, (W - 60) / (total + 1)), gap2 = 4
    const startX = cx - (total * (sz + gap2)) / 2
    const yy = cy - 10

    for (let i = 0; i < total; i++) {
      const isRemoving = i >= remain
      // 단계3: 빼지는 항목이 빨갛게 변하며 위로 날아감
      const flyP = isRemoving ? Math.max(0, (p - 0.45) * 3) : 0
      const flyY = yy - easeOutCubic(Math.min(1, flyP)) * 80
      const fadeOut = isRemoving ? Math.max(0, 1 - flyP * 1.5) : 1
      const prog = easeOutElastic(Math.min(1, Math.max(0, p * 2 - i * 0.05)))
      const x = startX + i * (sz + gap2) + sz / 2
      const color = isRemoving && p > 0.35 ? RED : VIO
      gCircle(x, flyY, sz / 2 - 2, color, true, prog * fadeOut * 0.9)
    }
    // 단계2: "total - sub"
    if (p > 0.08) gText(`${total} - ${sub}`, cx, yy - sz - 10, 'rgba(255,255,255,0.6)', 16, easeOutCubic((p - 0.08) / 0.3))
    // 단계4: "= remain"
    if (p > 0.75) gText(`= ${remain}`, cx, yy + sz + 20, '#1D9E75', 22, easeOutCubic((p - 0.75) / 0.25))
    break
  }

  case 'add_sub_relation': {
    const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
    const a = v('a', 3), b = v('b', 5), c = a + b
    const blockSz = 18, gap2 = 3

    // 단계1: 왼쪽 — 합치기
    const leftCX = W * 0.25, rightCX = W * 0.75
    if (p > 0.05) {
      const p1 = easeOutCubic((p - 0.05) / 0.35)
      for (let i = 0; i < a; i++) { const x = leftCX - (a * (blockSz + gap2)) / 2 + i * (blockSz + gap2); ctx.save(); ctx.globalAlpha = p1 * 0.85; ctx.fillStyle = VIO + '66'; ctx.strokeStyle = VIO; ctx.lineWidth = 1.5; ctx.fillRect(x, cy - 30, blockSz, blockSz); ctx.strokeRect(x, cy - 30, blockSz, blockSz); ctx.restore() }
      for (let i = 0; i < b; i++) { const x = leftCX - (b * (blockSz + gap2)) / 2 + i * (blockSz + gap2); ctx.save(); ctx.globalAlpha = p1 * 0.85; ctx.fillStyle = GRN + '66'; ctx.strokeStyle = GRN; ctx.lineWidth = 1.5; ctx.fillRect(x, cy + 10, blockSz, blockSz); ctx.strokeRect(x, cy + 10, blockSz, blockSz); ctx.restore() }
      gText(`${a} + ${b} = ${c}`, leftCX, cy - 52, VIO, 14, p1)
    }
    // 단계2: 화살표
    if (p > 0.4) { const ap = easeOutCubic((p - 0.4) / 0.2); gText('\u2192', cx, cy, 'rgba(255,255,255,0.4)', 28, ap) }
    // 단계3: 오른쪽 — 분리
    if (p > 0.5) {
      const p2 = easeOutCubic((p - 0.5) / 0.35)
      for (let i = 0; i < c; i++) { const x = rightCX - (c * (blockSz + gap2)) / 2 + i * (blockSz + gap2); const isRemain = i < a; ctx.save(); ctx.globalAlpha = p2 * 0.85; ctx.fillStyle = (isRemain ? VIO : ORG) + '66'; ctx.strokeStyle = isRemain ? VIO : ORG; ctx.lineWidth = 1.5; ctx.fillRect(x, cy - 10, blockSz, blockSz); ctx.strokeRect(x, cy - 10, blockSz, blockSz); ctx.restore() }
      gText(`${c} - ${b} = ${a}`, rightCX, cy - 52, ORG, 14, p2)
    }
    // 단계4: 양방향 관계
    if (p > 0.85) gText(`${a}+${b}=${c} \u2194 ${c}-${b}=${a}`, cx, H - 18, '#1D9E75', 14, easeOutCubic((p - 0.85) / 0.15))
    break
  }

  case 'times_table': {
    const VIO = '#534AB7', GRN = '#1D9E75'
    const a = v('a', 3), b = v('b', 4)
    const cell = Math.min(30, Math.min((W - 80) / b, (H - 80) / a))
    const ox = cx - (b * cell) / 2, oy = cy - (a * cell) / 2 - 10

    // 단계2~3: 격자가 줄 단위로 채워짐
    for (let row = 0; row < a; row++) {
      const rowP = easeOutCubic(Math.min(1, Math.max(0, p * (a + 1) - row * 0.8)))
      for (let col = 0; col < b; col++) {
        const idx = row * b + col + 1
        const prog = rowP * easeOutElastic(Math.min(1, Math.max(0, rowP * 2 - col * 0.15)))
        ctx.save(); ctx.globalAlpha = prog * 0.85
        ctx.fillStyle = VIO + '44'; ctx.strokeStyle = VIO; ctx.lineWidth = 1.5
        ctx.shadowBlur = 5; ctx.shadowColor = VIO
        ctx.fillRect(ox + col * cell + 1, oy + row * cell + 1, cell - 2, cell - 2)
        ctx.strokeRect(ox + col * cell + 1, oy + row * cell + 1, cell - 2, cell - 2)
        ctx.restore()
        // 단계4: 카운트
        if (prog > 0.5) gText(String(idx), ox + col * cell + cell / 2, oy + row * cell + cell / 2, 'rgba(255,255,255,0.5)', Math.min(11, cell - 6), prog)
      }
    }
    // 단계1: 위에 수식
    gText(`${a} \u00D7 ${b}`, cx, oy - 18, 'rgba(255,255,255,0.6)', 16, p)
    // 단계5: 결과
    if (p > 0.8) gText(`= ${a * b}`, cx, oy + a * cell + 22, GRN, 22, easeOutCubic((p - 0.8) / 0.2))
    break
  }

  case 'multiply_long': {
    const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
    const a = Math.max(10, v('a', 23)), b = Math.max(1, v('b', 4))
    const tens = Math.floor(a / 10) * 10, ones = a % 10
    const barH = 36, maxW = W * 0.7, ox = cx - maxW / 2

    // 단계1: 수식
    gText(`${a} \u00D7 ${b}`, cx, 28, 'rgba(255,255,255,0.6)', 16, p)
    // 단계2: 분리 20+3
    if (p > 0.1) {
      const p1 = easeOutCubic((p - 0.1) / 0.3)
      gText(`${tens} + ${ones}`, cx, 48, VIO, 13, p1)
    }
    // 단계3: tens × b 블록
    if (p > 0.25) {
      const p2 = easeOutCubic((p - 0.25) / 0.3)
      const w1 = (tens / a) * maxW
      ctx.save(); ctx.globalAlpha = p2 * 0.3; ctx.fillStyle = VIO; ctx.fillRect(ox, cy - barH / 2, w1, barH); ctx.restore()
      ctx.save(); ctx.globalAlpha = p2; ctx.strokeStyle = VIO; ctx.lineWidth = 2; ctx.strokeRect(ox, cy - barH / 2, w1, barH); ctx.restore()
      gText(`${tens}\u00D7${b}=${tens * b}`, ox + w1 / 2, cy, VIO, 13, p2)
    }
    // 단계4: ones × b 블록
    if (p > 0.45) {
      const p3 = easeOutCubic((p - 0.45) / 0.3)
      const w1 = (tens / a) * maxW, w2 = (ones / a) * maxW
      ctx.save(); ctx.globalAlpha = p3 * 0.3; ctx.fillStyle = ORG; ctx.fillRect(ox + w1 + 4, cy - barH / 2, w2, barH); ctx.restore()
      ctx.save(); ctx.globalAlpha = p3; ctx.strokeStyle = ORG; ctx.lineWidth = 2; ctx.strokeRect(ox + w1 + 4, cy - barH / 2, w2, barH); ctx.restore()
      gText(`${ones}\u00D7${b}=${ones * b}`, ox + w1 + 4 + w2 / 2, cy, ORG, 13, p3)
    }
    // 단계5: 합산
    if (p > 0.75) gText(`${tens * b} + ${ones * b} = ${a * b}`, cx, cy + barH + 20, GRN, 18, easeOutCubic((p - 0.75) / 0.25))
    break
  }

  case 'division': {
    const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
    const total = Math.max(1, v('a', 12)), divBy = Math.max(1, v('b', 3))
    const perGroup = Math.max(1, Math.floor(total / divBy))
    const itemR = Math.min(10, (W - 60) / (total * 3))
    const plateColors = [VIO, GRN, ORG, '#D85A30', '#534AB7', '#1D9E75']

    // 단계1: 쿠키 뭉쳐있음
    const srcY = cy - 40
    for (let i = 0; i < total; i++) {
      const prog = easeOutCubic(Math.min(1, p * 2.5))
      // 단계4: 라운드 로빈 배분
      const assignP = Math.max(0, (p - 0.35) * 2.5)
      const plateIdx = i % divBy
      const itemIdx = Math.floor(i / divBy)
      const dealt = assignP > (i / total) * 1.2
      const plateW = (W - 40) / divBy
      const targetX = 20 + plateIdx * plateW + plateW / 2 + (itemIdx - perGroup / 2) * (itemR * 2 + 4)
      const targetY = cy + 40
      const srcX = cx + (i - total / 2) * (itemR * 2 + 2)
      const x = dealt ? srcX + (targetX - srcX) * easeOutCubic(Math.min(1, (assignP - (i / total) * 1.2) * 3)) : srcX
      const y = dealt ? srcY + (targetY - srcY) * easeOutCubic(Math.min(1, (assignP - (i / total) * 1.2) * 3)) : srcY
      gCircle(x, y, itemR, dealt ? plateColors[plateIdx % 6] : VIO, true, prog * 0.85)
    }
    // 단계2: 수식
    gText(`${total} \u00F7 ${divBy}`, cx, 24, 'rgba(255,255,255,0.6)', 16, p)
    // 단계3: 접시
    if (p > 0.2) {
      const pp = easeOutCubic((p - 0.2) / 0.2)
      for (let g = 0; g < divBy; g++) {
        const plateW = (W - 40) / divBy
        const px = 20 + g * plateW + plateW / 2
        gLine(px - plateW * 0.35, cy + 60, px + plateW * 0.35, cy + 60, plateColors[g % 6], 3, pp * 0.6)
      }
    }
    // 단계5: 결과
    if (p > 0.85) gText(`= ${perGroup}`, cx, H - 18, GRN, 20, easeOutCubic((p - 0.85) / 0.15))
    break
  }

  case 'mul_div_relation': {
    const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
    const a = v('a', 3), b = v('b', 4), c = a * b
    const cell = Math.min(20, Math.min((W * 0.35) / b, (H - 80) / a))
    const leftCX = W * 0.25, rightCX = W * 0.75

    // 단계1: 왼쪽 격자 채우기
    if (p > 0.05) {
      const p1 = easeOutCubic((p - 0.05) / 0.35)
      const ox = leftCX - (b * cell) / 2, oy = cy - (a * cell) / 2
      for (let r2 = 0; r2 < a; r2++) for (let c2 = 0; c2 < b; c2++) {
        ctx.save(); ctx.globalAlpha = p1 * 0.8; ctx.fillStyle = VIO + '44'; ctx.strokeStyle = VIO; ctx.lineWidth = 1
        ctx.fillRect(ox + c2 * cell + 1, oy + r2 * cell + 1, cell - 2, cell - 2); ctx.strokeRect(ox + c2 * cell + 1, oy + r2 * cell + 1, cell - 2, cell - 2); ctx.restore()
      }
      gText(`${a}\u00D7${b}=${c}`, leftCX, cy - (a * cell) / 2 - 16, VIO, 13, p1)
    }
    // 단계2: 화살표
    if (p > 0.4) gText('\u2194', cx, cy, 'rgba(255,255,255,0.4)', 28, easeOutCubic((p - 0.4) / 0.2))
    // 단계3: 오른쪽 격자 분리
    if (p > 0.5) {
      const p2 = easeOutCubic((p - 0.5) / 0.35)
      const ox = rightCX - (b * cell) / 2, oy = cy - (a * cell) / 2
      for (let r2 = 0; r2 < a; r2++) {
        const rowColor = [GRN, ORG, VIO][r2 % 3]
        for (let c2 = 0; c2 < b; c2++) {
          ctx.save(); ctx.globalAlpha = p2 * 0.8; ctx.fillStyle = rowColor + '44'; ctx.strokeStyle = rowColor; ctx.lineWidth = 1
          ctx.fillRect(ox + c2 * cell + 1, oy + r2 * cell + 1, cell - 2, cell - 2); ctx.strokeRect(ox + c2 * cell + 1, oy + r2 * cell + 1, cell - 2, cell - 2); ctx.restore()
        }
      }
      gText(`${c}\u00F7${a}=${b}`, rightCX, cy - (a * cell) / 2 - 16, ORG, 13, p2)
    }
    // 단계4: 양방향
    if (p > 0.85) gText(`${a}\u00D7${b}=${c} \u2194 ${c}\u00F7${a}=${b}`, cx, H - 18, GRN, 13, easeOutCubic((p - 0.85) / 0.15))
    break
  }

  case 'rounding': {
    const GRN = '#1D9E75', ORG = '#D85A30'
    const num = v('a', 37)
    const lower = Math.floor(num / 10) * 10, upper = lower + 10
    const rounded = Math.round(num / 10) * 10
    const lineY2 = cy, lineW = W * 0.75
    const ox = cx - lineW / 2
    const scale = lineW / 20 // -10 to +10 around lower

    // 단계1: 수직선
    gLine(ox, lineY2, ox + lineW, lineY2, 'rgba(255,255,255,0.2)', 2, p)
    for (let v = lower - 10; v <= upper + 10; v += 5) {
      const x = ox + (v - (lower - 10)) * scale / 2
      if (x < ox || x > ox + lineW) continue
      const isMajor = v % 10 === 0
      gLine(x, lineY2 - (isMajor ? 10 : 5), x, lineY2 + (isMajor ? 10 : 5), 'rgba(255,255,255,0.3)', isMajor ? 2 : 1, p)
      if (isMajor) gText(String(v), x, lineY2 + 22, 'rgba(255,255,255,0.5)', 12, p)
    }
    // 단계2: 점
    if (p > 0.2) {
      const np = easeOutElastic(Math.min(1, (p - 0.2) / 0.3))
      const numX = ox + (num - (lower - 10)) * scale / 2
      gCircle(numX, lineY2, 6, ORG, true, np)
      gText(String(num), numX, lineY2 - 22, ORG, 15, np)
    }
    // 단계3~4: 거리
    if (p > 0.45) {
      const dp = easeOutCubic((p - 0.45) / 0.25)
      const numX = ox + (num - (lower - 10)) * scale / 2
      const lowerX = ox + (lower - (lower - 10)) * scale / 2
      const upperX = ox + (upper - (lower - 10)) * scale / 2
      gLine(numX, lineY2 + 6, lowerX, lineY2 + 6, '#534AB7', 2, dp)
      gLine(numX, lineY2 - 6, upperX, lineY2 - 6, GRN, 2, dp)
      gText(String(num - lower), (numX + lowerX) / 2, lineY2 + 20, '#534AB7', 11, dp)
      gText(String(upper - num), (numX + upperX) / 2, lineY2 - 20, GRN, 11, dp)
    }
    // 단계5: 결과
    if (p > 0.7) {
      const rp = easeOutElastic(Math.min(1, (p - 0.7) / 0.3))
      const roundedX = ox + (rounded - (lower - 10)) * scale / 2
      gCircle(roundedX, lineY2, 10, GRN, true, rp * 0.5)
      gText(`${num} \u2192 ${rounded}`, cx, H - 18, GRN, 18, rp)
    }
    break
  }

  case 'fraction_intro': {
    const VIO = '#534AB7'
    const numer = v('a', 3), denom = v('b', 4)
    const r2 = Math.min(70, H / 2 - 25)

    // 단계1: 원형 피자
    ctx.save(); ctx.globalAlpha = p * 0.15; ctx.fillStyle = 'rgba(255,255,255,1)'
    ctx.beginPath(); ctx.arc(cx, cy, r2, 0, Math.PI * 2); ctx.fill(); ctx.restore()
    ctx.save(); ctx.globalAlpha = p * 0.4; ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(cx, cy, r2, 0, Math.PI * 2); ctx.stroke(); ctx.restore()

    // 단계2: 칼선
    for (let i = 0; i < denom; i++) {
      const cutP = easeOutCubic(Math.min(1, Math.max(0, (p - 0.15) * 3 - i * 0.15)))
      const angle = -Math.PI / 2 + (i / denom) * Math.PI * 2
      gLine(cx, cy, cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2, 'rgba(255,255,255,0.3)', 1.5, cutP)
    }

    // 단계3: 조각 채우기
    for (let i = 0; i < denom; i++) {
      const filled = i < numer
      if (!filled) continue
      const fillP = easeOutCubic(Math.min(1, Math.max(0, (p - 0.35) * 2.5 - i * 0.1)))
      const a1 = -Math.PI / 2 + (i / denom) * Math.PI * 2
      const a2 = -Math.PI / 2 + ((i + 1) / denom) * Math.PI * 2
      ctx.save(); ctx.globalAlpha = fillP * 0.6; ctx.fillStyle = VIO
      ctx.shadowBlur = 10; ctx.shadowColor = VIO
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r2 - 2, a1, a2); ctx.closePath(); ctx.fill(); ctx.restore()
    }

    // 단계4~5: 분수 + 설명
    if (p > 0.65) {
      const fp = easeOutCubic((p - 0.65) / 0.35)
      gText(`${numer}/${denom}`, cx + r2 + 40, cy, VIO, 24, fp)
      gText(`${denom}\uC870\uAC01 \uC911 ${numer}\uC870\uAC01`, cx, cy + r2 + 22, 'rgba(255,255,255,0.5)', 13, fp)
    }
    break
  }

  case 'decimal_intro': {
    const VIO = '#534AB7', GRN = '#1D9E75'
    const n = v('n', 3)
    const barW2 = W * 0.7, barH2 = 40
    const ox = cx - barW2 / 2

    // 단계1: "1" 전체 막대
    if (p > 0.05) {
      const p1 = easeOutCubic((p - 0.05) / 0.25)
      ctx.save(); ctx.globalAlpha = p1 * 0.15; ctx.fillStyle = WHITE; ctx.fillRect(ox, cy - 60, barW2, barH2); ctx.restore()
      ctx.save(); ctx.globalAlpha = p1 * 0.5; ctx.strokeStyle = WHITE; ctx.lineWidth = 2; ctx.strokeRect(ox, cy - 60, barW2, barH2); ctx.restore()
      gText('1', cx, cy - 60 - 14, 'rgba(255,255,255,0.6)', 14, p1)
    }

    // 단계2: 10등분 눈금
    const cellW = barW2 / 10
    for (let i = 0; i < 10; i++) {
      const prog = easeOutCubic(Math.min(1, Math.max(0, (p - 0.25) * 3 - i * 0.06)))
      const x = ox + i * cellW
      const filled = i < n
      ctx.save(); ctx.globalAlpha = prog * 0.85
      ctx.fillStyle = filled ? VIO + '55' : 'rgba(255,255,255,0.04)'
      ctx.strokeStyle = filled ? VIO : 'rgba(255,255,255,0.15)'
      ctx.lineWidth = filled ? 2 : 1
      ctx.fillRect(x + 1, cy + 10, cellW - 2, barH2 - 2)
      ctx.strokeRect(x + 1, cy + 10, cellW - 2, barH2 - 2)
      ctx.restore()
    }

    // 단계3: 0.n
    if (p > 0.5) {
      const fp = easeOutCubic((p - 0.5) / 0.25)
      gText(`${n}\uCE78 \uCC44\uC6C0 \u2192 0.${n}`, cx, cy + barH2 + 24, VIO, 16, fp)
    }

    // 단계5: 설명
    if (p > 0.75) {
      const fp2 = easeOutCubic((p - 0.75) / 0.25)
      gText('\uC18C\uC218\uC810 \uB4A4 \uC22B\uC790 = \uC798\uAC8C \uB098\uB208 \uC870\uAC01', cx, H - 18, GRN, 13, fp2)
    }
    break
  }

  // ══════════════════════════════════════════
  // ══════════════════════════════════════════
  // E011~E020 — 설계서 기반 전용 시각화
  // ══════════════════════════════════════════

  case 'fraction_add_same': {
    // E011: 같은 분모 분수 덧셈 — 원형 조각 합치기
    const VIO='#534AB7',GRN='#1D9E75'
    const denom=v('n',5), aa=v('a',2), bb=v('b',1)
    const rr=Math.min(55,(W*0.3)),y1=cy,lx=W*0.25,rx=W*0.75
    const drawPie=(px: number,py: number,n: number,fill: number,color: string,prog: number)=>{
      for(let i=0;i<n;i++){const a1=-Math.PI/2+(i/n)*Math.PI*2,a2=-Math.PI/2+((i+1)/n)*Math.PI*2
        ctx.save();ctx.globalAlpha=prog*0.15;ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=1
        ctx.beginPath();ctx.moveTo(px,py);ctx.arc(px,py,rr,a1,a2);ctx.closePath();ctx.stroke();ctx.restore()
        if(i<fill){ctx.save();ctx.globalAlpha=prog*0.6;ctx.fillStyle=color;ctx.shadowBlur=8;ctx.shadowColor=color
          ctx.beginPath();ctx.moveTo(px,py);ctx.arc(px,py,rr,a1,a2);ctx.closePath();ctx.fill();ctx.restore()}}
    }
    // 단계1: 첫째 분수
    if(p>0.05){const p1=easeOutCubic((p-0.05)/0.3);drawPie(lx,y1,denom,aa,VIO,p1);gText(`${aa}/${denom}`,lx,y1+rr+18,VIO,14,p1)}
    // 단계2: 둘째 분수
    if(p>0.25){const p2=easeOutCubic((p-0.25)/0.3);drawPie(rx,y1,denom,bb,GRN,p2);gText(`${bb}/${denom}`,rx,y1+rr+18,GRN,14,p2)}
    // 단계3~4: 합쳐진 원
    if(p>0.6){const p3=easeOutCubic((p-0.6)/0.35);drawPie(cx,y1-10,denom,aa+bb,'#1D9E75',p3)
      gText(`${aa}/${denom} + ${bb}/${denom} = ${aa+bb}/${denom}`,cx,y1+rr+18,'#1D9E75',15,p3)}
    break
  }

  case 'decimal_add_sub': {
    // E012: 소수 덧셈 — 막대 길이 합산
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const n1=v('a',0.3),n2=v('b',0.5),total2=n1+n2
    const barW=W*0.65,barH=32,ox=cx-barW/2
    // 단계1: 0.3 막대
    if(p>0.05){const p1=easeOutCubic((p-0.05)/0.3)
      const w1=n1*barW;ctx.save();ctx.globalAlpha=p1*0.4;ctx.fillStyle=VIO;ctx.fillRect(ox,cy-50,w1,barH);ctx.restore()
      ctx.save();ctx.globalAlpha=p1;ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.strokeRect(ox,cy-50,w1,barH);ctx.restore()
      gText(String(n1),ox+w1/2,cy-50+barH/2,VIO,14,p1)
      // 10칸 눈금
      for(let i=0;i<=10;i++){const x=ox+i*(barW/10);gLine(x,cy-50,x,cy-50+barH,'rgba(255,255,255,0.1)',1,p1)}}
    // 단계2: 0.5 막대
    if(p>0.25){const p2=easeOutCubic((p-0.25)/0.3)
      const w2=n2*barW;ctx.save();ctx.globalAlpha=p2*0.4;ctx.fillStyle=GRN;ctx.fillRect(ox,cy,w2,barH);ctx.restore()
      ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.strokeRect(ox,cy,w2,barH);ctx.restore()
      gText(String(n2),ox+w2/2,cy+barH/2,GRN,14,p2)}
    // 단계3: 소수점 맞춤 강조
    if(p>0.45){const p3=easeOutCubic((p-0.45)/0.2);gLine(ox,cy-55,ox,cy+barH+5,'rgba(255,255,255,0.3)',2,p3)}
    // 단계4: 합산 막대
    if(p>0.6){const p4=easeOutCubic((p-0.6)/0.35)
      const wt=total2*barW;ctx.save();ctx.globalAlpha=p4*0.3;ctx.fillStyle=ORG;ctx.fillRect(ox,cy+50,wt,barH);ctx.restore()
      ctx.save();ctx.globalAlpha=p4;ctx.strokeStyle=ORG;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=ORG;ctx.strokeRect(ox,cy+50,wt,barH);ctx.restore()
      gText(`${n1} + ${n2} = ${total2}`,cx,cy+50+barH+18,ORG,16,p4)}
    break
  }

  case 'mixed_calc': {
    // E013: 혼합 계산 — 올바른 순서 vs 틀린 순서
    const VIO='#534AB7',GRN='#1D9E75',RED='#D85A30'
    const ma=v('a',3),mb=v('b',4),mc=v('c',2)
    // 단계1: 수식
    gText(`${ma} + ${mb} \u00D7 ${mc}`,cx,cy-70,'rgba(255,255,255,0.7)',22,easeOutCubic(Math.min(1,p*3)))
    // 단계2: 틀린 순서 (빨간 X)
    if(p>0.15&&p<0.55){const wp=easeOutCubic((p-0.15)/0.25)
      gText(`${ma}+${mb}=${ma+mb}, ${ma+mb}\u00D7${mc}=${( ma+mb)*mc}`,cx,cy-30,RED,16,wp*(1-Math.max(0,(p-0.45)*10)))
      if(p>0.35) gText('\u2716',cx+120,cy-30,RED,20,easeOutCubic((p-0.35)/0.1))}
    // 단계3: 올바른 순서
    if(p>0.4){const cp=easeOutCubic((p-0.4)/0.35)
      // mb×mc 박스 강조
      if(p<0.75){ctx.save();ctx.globalAlpha=cp*0.3;ctx.strokeStyle=GRN;ctx.lineWidth=3;ctx.shadowBlur=12;ctx.shadowColor=GRN
        ctx.strokeRect(cx-10,cy+5,80,30);ctx.restore()}
      gText(`${mb} \u00D7 ${mc} = ${mb*mc} \uBA3C\uC800!`,cx,cy+20,GRN,16,cp)
      if(p>0.6){const sp=easeOutCubic((p-0.6)/0.2);gText(`${ma} + ${mb*mc} = ${ma+mb*mc}`,cx,cy+50,GRN,18,sp)}}
    // 단계4: 규칙
    if(p>0.8) gText('\u00D7 \u00F7 \uBA3C\uC800 \u2192 + - \uB098\uC911\uC5D0',cx,H-18,VIO,14,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'number_range': {
    // E014: 수의 범위 — 이상/이하 vs 초과/미만
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const lineY=cy-10,sc=(W-80)/10,ox=cx-5*sc
    gLine(ox,lineY,ox+10*sc,lineY,'rgba(255,255,255,0.2)',2,p)
    for(let i=0;i<=10;i++){const x=ox+i*sc;gLine(x,lineY-6,x,lineY+6,'rgba(255,255,255,0.3)',1.5,p);gText(String(i),x,lineY+18,'rgba(255,255,255,0.4)',10,p)}
    // 단계2: 3이상 7이하 (p<0.55)
    const phase1=p<0.55
    if(p>0.2){const rp=easeOutCubic((p-0.2)/(phase1?0.3:0.3))
      const x1=ox+3*sc,x2=ox+7*sc
      ctx.save();ctx.globalAlpha=rp*0.2;ctx.fillStyle=phase1?VIO:GRN;ctx.fillRect(x1,lineY-12,x2-x1,24);ctx.restore()
      // 양 끝 점
      gCircle(x1,lineY,5,phase1?VIO:GRN,phase1,rp) // 이상=채운원, 초과=빈원
      gCircle(x2,lineY,5,phase1?VIO:GRN,phase1,rp)
      if(phase1){gText('3 \uC774\uC0C1 7 \uC774\uD558 (\u25CF \uD3EC\uD568)',cx,lineY-32,VIO,13,rp)}
      else{gText('3 \uCD08\uACFC 7 \uBBF8\uB9CC (\u25CB \uBBF8\uD3EC\uD568)',cx,lineY-32,GRN,13,rp)}}
    // 단계4: 차이점
    if(p>0.8) gText('\u25CF = \uD3EC\uD568, \u25CB = \uBBF8\uD3EC\uD568',cx,H-18,ORG,13,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'gcd': {
    // E015: 최대공약수 — 공통으로 나누기
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const a2=v('a',12),b2=v('b',8)
    const gcdFn=(x: number,y: number): number=>y===0?x:gcdFn(y,x%y)
    const gcdVal=gcdFn(a2,b2)
    // 단계1~2: 블록 배치
    const bsz=Math.min(22,(W-60)/Math.max(a2,b2)),gap3=3
    const row1Y=cy-30,row2Y=cy+20
    for(let i=0;i<a2;i++){const prog=easeOutCubic(Math.min(1,p*2-i*0.04));const x=30+i*(bsz+gap3)
      ctx.save();ctx.globalAlpha=prog*0.8;ctx.fillStyle=VIO+'55';ctx.strokeStyle=VIO;ctx.lineWidth=1.5
      ctx.fillRect(x,row1Y,bsz,bsz);ctx.strokeRect(x,row1Y,bsz,bsz);ctx.restore()}
    gText(`${a2}`,20,row1Y+bsz/2,'rgba(255,255,255,0.5)',11,p)
    for(let i=0;i<b2;i++){const prog=easeOutCubic(Math.min(1,Math.max(0,(p-0.15)*2-i*0.04)));const x=30+i*(bsz+gap3)
      ctx.save();ctx.globalAlpha=prog*0.8;ctx.fillStyle=GRN+'55';ctx.strokeStyle=GRN;ctx.lineWidth=1.5
      ctx.fillRect(x,row2Y,bsz,bsz);ctx.strokeRect(x,row2Y,bsz,bsz);ctx.restore()}
    gText(`${b2}`,20,row2Y+bsz/2,'rgba(255,255,255,0.5)',11,p>0.15?easeOutCubic((p-0.15)/0.3):0)
    // 단계3~4: 나누기 과정
    if(p>0.4){const dp=easeOutCubic((p-0.4)/0.3)
      // gcdVal 단위로 묶음 표시
      const bA=a2/gcdVal,bB=b2/gcdVal
      for(let i=0;i<bA;i++){const x=30+i*gcdVal*(bsz+gap3);ctx.save();ctx.globalAlpha=dp*0.4;ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.strokeRect(x-1,row1Y-2,gcdVal*(bsz+gap3)-gap3+2,bsz+4);ctx.restore()}
      for(let i=0;i<bB;i++){const x=30+i*gcdVal*(bsz+gap3);ctx.save();ctx.globalAlpha=dp*0.4;ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.strokeRect(x-1,row2Y-2,gcdVal*(bsz+gap3)-gap3+2,bsz+4);ctx.restore()}}
    // 단계5: 결과
    if(p>0.75) gText(`\uCD5C\uB300\uACF5\uC57D\uC218 = ${gcdVal}`,cx,H-18,ORG,18,easeOutCubic((p-0.75)/0.25))
    break
  }

  case 'lcm': {
    // E016: 최소공배수 — 배수 점 찍기
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const a2=v('a',3),b2=v('b',4)
    const gcdFn2=(x: number,y: number): number=>y===0?x:gcdFn2(y,x%y)
    const lcmVal=(a2*b2)/gcdFn2(a2,b2)
    const maxShow=Math.min(lcmVal+4,20)
    const sc=(W-60)/maxShow,ox=30
    const row1Y=cy-22,row2Y=cy+22
    // 수직선
    gLine(ox,cy,ox+maxShow*sc,cy,'rgba(255,255,255,0.15)',1,p)
    for(let i=1;i<=maxShow;i++){const x=ox+i*sc;gLine(x,cy-4,x,cy+4,'rgba(255,255,255,0.15)',1,p)}
    // 단계1: a의 배수
    for(let i=1;i*a2<=maxShow;i++){const prog=easeOutElastic(Math.min(1,Math.max(0,p*2-i*0.12)));const x=ox+i*a2*sc
      gCircle(x,row1Y,8,VIO,true,prog*0.85);gText(String(i*a2),x,row1Y-14,VIO,10,prog)}
    // 단계2: b의 배수
    for(let i=1;i*b2<=maxShow;i++){const prog=easeOutElastic(Math.min(1,Math.max(0,(p-0.25)*2-i*0.12)));const x=ox+i*b2*sc
      gCircle(x,row2Y,8,GRN,true,prog*0.85);gText(String(i*b2),x,row2Y+16,GRN,10,prog)}
    // 단계3: 겹치는 점 강조
    if(p>0.6&&lcmVal<=maxShow){const fp=easeOutElastic(Math.min(1,(p-0.6)/0.3));const lcmX=ox+lcmVal*sc
      gCircle(lcmX,cy,14,ORG,true,fp*0.5);ctx.save();ctx.globalAlpha=fp;ctx.strokeStyle=ORG;ctx.lineWidth=3;ctx.shadowBlur=16;ctx.shadowColor=ORG
      ctx.beginPath();ctx.arc(lcmX,cy,14,0,Math.PI*2);ctx.stroke();ctx.restore()
      gText(`${lcmVal}`,lcmX,cy,ORG,13,fp)}
    if(p>0.8) gText(`\uCD5C\uC18C\uACF5\uBC30\uC218 = ${lcmVal}`,cx,H-18,ORG,16,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'simplify_fraction': {
    // E017: 약분 — 같은 크기 다른 표현
    const VIO='#534AB7'
    const fracs: [number,number][] = [[4,8],[2,4],[1,2]]
    const rr=Math.min(45,(W-40)/(fracs.length*2.5))
    fracs.forEach(([n,d],idx)=>{
      const prog=easeOutCubic(Math.min(1,Math.max(0,p*2.5-idx*0.5)))
      const px=cx+(idx-1)*(rr*2+30),py=cy-10
      // 원 + 등분 + 채우기
      ctx.save();ctx.globalAlpha=prog*0.2;ctx.fillStyle='rgba(255,255,255,1)';ctx.beginPath();ctx.arc(px,py,rr,0,Math.PI*2);ctx.fill();ctx.restore()
      for(let i=0;i<d;i++){const a1=-Math.PI/2+(i/d)*Math.PI*2,a2=-Math.PI/2+((i+1)/d)*Math.PI*2
        ctx.save();ctx.globalAlpha=prog*0.3;ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=1
        ctx.beginPath();ctx.moveTo(px,py);ctx.arc(px,py,rr,a1,a2);ctx.closePath();ctx.stroke();ctx.restore()
        if(i<n){ctx.save();ctx.globalAlpha=prog*0.55;ctx.fillStyle=VIO;ctx.beginPath();ctx.moveTo(px,py);ctx.arc(px,py,rr-1,a1,a2);ctx.closePath();ctx.fill();ctx.restore()}}
      gText(`${n}/${d}`,px,py+rr+16,VIO,14,prog)
    })
    // 단계4: 크기 같음 강조
    if(p>0.8) gText('4/8 = 2/4 = 1/2 \u2014 \uD06C\uAE30\uAC00 \uAC19\uC544!',cx,H-18,'#1D9E75',14,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'fraction_add_diff': {
    // E018: 분모 다른 분수 덧셈 — 통분 후 합산
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const rr=Math.min(42,(W-40)/7)
    // 단계1: 1/2 원형
    if(p>0.05){const p1=easeOutCubic((p-0.05)/0.25);const px=W*0.2
      ctx.save();ctx.globalAlpha=p1*0.2;ctx.fillStyle=WHITE;ctx.beginPath();ctx.arc(px,cy-20,rr,0,Math.PI*2);ctx.fill();ctx.restore()
      ctx.save();ctx.globalAlpha=p1*0.55;ctx.fillStyle=VIO;ctx.beginPath();ctx.moveTo(px,cy-20);ctx.arc(px,cy-20,rr,-Math.PI/2,Math.PI/2);ctx.closePath();ctx.fill();ctx.restore()
      gLine(px,cy-20-rr,px,cy-20+rr,'rgba(255,255,255,0.3)',1,p1);gText('1/2',px,cy-20+rr+14,VIO,13,p1)}
    // 단계2: 1/3 원형
    if(p>0.2){const p2=easeOutCubic((p-0.2)/0.25);const px=W*0.45
      ctx.save();ctx.globalAlpha=p2*0.2;ctx.fillStyle=WHITE;ctx.beginPath();ctx.arc(px,cy-20,rr,0,Math.PI*2);ctx.fill();ctx.restore()
      ctx.save();ctx.globalAlpha=p2*0.55;ctx.fillStyle=GRN;ctx.beginPath();ctx.moveTo(px,cy-20);ctx.arc(px,cy-20,rr,-Math.PI/2,-Math.PI/2+Math.PI*2/3);ctx.closePath();ctx.fill();ctx.restore()
      gText('1/3',px,cy-20+rr+14,GRN,13,p2)}
    // 단계3: 통분 → 6등분
    if(p>0.45){const p3=easeOutCubic((p-0.45)/0.3);const px=W*0.75
      for(let i=0;i<6;i++){const a1=-Math.PI/2+(i/6)*Math.PI*2,a2=-Math.PI/2+((i+1)/6)*Math.PI*2
        const filled=i<5,color=i<3?VIO:i<5?GRN:'transparent'
        if(filled){ctx.save();ctx.globalAlpha=p3*0.55;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(px,cy-20);ctx.arc(px,cy-20,rr,a1,a2);ctx.closePath();ctx.fill();ctx.restore()}
        ctx.save();ctx.globalAlpha=p3*0.3;ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px,cy-20);ctx.arc(px,cy-20,rr,a1,a2);ctx.closePath();ctx.stroke();ctx.restore()}
      gText('5/6',px,cy-20+rr+14,ORG,14,p3)}
    // 단계4: 수식
    if(p>0.75) gText('1/2 + 1/3 = 3/6 + 2/6 = 5/6',cx,H-18,ORG,14,easeOutCubic((p-0.75)/0.25))
    break
  }

  case 'fraction_multiply': {
    // E019: 분수 곱셈 — 면적 모델
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const fmNum1=v('a',2),fmDen1=v('b',3),fmNum2=v('c',3),fmDen2=v('d',4)
    const fmProd=fmNum1*fmNum2,fmProdD=fmDen1*fmDen2
    const rectW=Math.min(180,W*0.45),rectH=Math.min(140,H*0.5)
    const ox=cx-rectW/2,oy=cy-rectH/2-10
    // 단계1: 전체 직사각형
    if(p>0.05){const p1=easeOutCubic((p-0.05)/0.2)
      ctx.save();ctx.globalAlpha=p1*0.1;ctx.fillStyle=WHITE;ctx.fillRect(ox,oy,rectW,rectH);ctx.restore()
      ctx.save();ctx.globalAlpha=p1*0.4;ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=1.5;ctx.strokeRect(ox,oy,rectW,rectH);ctx.restore()}
    // 단계2: 가로 fmDen1등분 → fmNum1칸 채움
    if(p>0.2){const p2=easeOutCubic((p-0.2)/0.25)
      for(let i=1;i<fmDen1;i++) gLine(ox+i*rectW/fmDen1,oy,ox+i*rectW/fmDen1,oy+rectH,VIO,1.5,p2)
      ctx.save();ctx.globalAlpha=p2*0.25;ctx.fillStyle=VIO;ctx.fillRect(ox,oy,rectW*fmNum1/fmDen1,rectH);ctx.restore()
      gText(`${fmNum1}/${fmDen1}`,ox+rectW*fmNum1/(fmDen1*2),oy-14,VIO,13,p2)}
    // 단계3: 세로 fmDen2등분 → fmNum2칸 채움
    if(p>0.45){const p3=easeOutCubic((p-0.45)/0.25)
      for(let i=1;i<fmDen2;i++) gLine(ox,oy+i*rectH/fmDen2,ox+rectW,oy+i*rectH/fmDen2,GRN,1.5,p3)
      ctx.save();ctx.globalAlpha=p3*0.2;ctx.fillStyle=GRN;ctx.fillRect(ox,oy,rectW,rectH*fmNum2/fmDen2);ctx.restore()
      gText(`${fmNum2}/${fmDen2}`,ox-22,oy+rectH*fmNum2/(fmDen2*2),GRN,13,p3)}
    // 단계4: 겹치는 영역
    if(p>0.65){const p4=easeOutCubic((p-0.65)/0.25)
      ctx.save();ctx.globalAlpha=p4*0.5;ctx.fillStyle=ORG;ctx.fillRect(ox,oy,rectW*fmNum1/fmDen1,rectH*fmNum2/fmDen2);ctx.restore()
      ctx.save();ctx.globalAlpha=p4;ctx.strokeStyle=ORG;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=ORG
      ctx.strokeRect(ox,oy,rectW*fmNum1/fmDen1,rectH*fmNum2/fmDen2);ctx.restore()
      gText(`${fmProd}/${fmProdD}`,cx,cy,ORG,16,p4)}
    // 단계5: 수식
    if(p>0.85) gText(`${fmNum1}/${fmDen1} \u00D7 ${fmNum2}/${fmDen2} = ${fmProd}/${fmProdD}`,cx,H-18,ORG,14,easeOutCubic((p-0.85)/0.15))
    break
  }

  case 'fraction_divide': {
    // E020: 분수 나눗셈 — 뒤집어서 곱하기
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const steps: {text: string,color: string,note?: string}[] = [
      {text:'2/3 \u00F7 1/4',color:WHITE},
      {text:'\u00F7 \u2192 \u00D7 (\uB4A4\uC9D1\uAE30!)',color:VIO,note:'1/4 \u2192 4/1'},
      {text:'2/3 \u00D7 4/1',color:GRN},
      {text:'= 8/3',color:ORG},
    ]
    steps.forEach((s,i)=>{
      const prog=easeOutCubic(Math.min(1,Math.max(0,p*2.5-i*0.4)))
      const y=cy-55+i*36
      gText(s.text,cx,y,s.color,i===0?20:17,prog)
      if(s.note&&prog>0.3) gText(s.note,cx,y+17,'rgba(255,255,255,0.35)',12,prog*0.8)
    })
    // 뒤집기 화살표
    if(p>0.25&&p<0.6){const fp=easeOutCubic((p-0.25)/0.2)
      ctx.save();ctx.globalAlpha=fp*0.5;ctx.strokeStyle=VIO;ctx.lineWidth=2
      ctx.beginPath();ctx.arc(cx+70,cy-20,12,0,Math.PI*1.5);ctx.stroke();ctx.restore()}
    break
  }

  // ══════════════════════════════════════════
  // E021+ 시작
  // ══════════════════════════════════════════
  // E021~E030 — 설계서 기반 전용 시각화
  // ══════════════════════════════════════════

  case 'decimal_multiply': {
    // E021: 소수 곱셈 — 10×10 격자 면적
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const dm1=v('a',0.3),dm2=v('b',0.4)
    const dmCells1=Math.round(dm1*10),dmCells2=Math.round(dm2*10)
    const gridSz=Math.min(160,Math.min(W-60,H-60)),cellSz=gridSz/10
    const ox=cx-gridSz/2,oy=cy-gridSz/2-5
    // 단계1: 10×10 격자
    if(p>0.05){const gp=easeOutCubic((p-0.05)/0.25)
      for(let i=0;i<=10;i++){gLine(ox+i*cellSz,oy,ox+i*cellSz,oy+gridSz,'rgba(255,255,255,0.08)',1,gp);gLine(ox,oy+i*cellSz,ox+gridSz,oy+i*cellSz,'rgba(255,255,255,0.08)',1,gp)}}
    // 단계2: 가로 dm1 = dmCells1칸 강조
    if(p>0.2){const p2=easeOutCubic((p-0.2)/0.25)
      ctx.save();ctx.globalAlpha=p2*0.25;ctx.fillStyle=VIO;ctx.fillRect(ox,oy,dmCells1*cellSz,gridSz);ctx.restore()
      gText(String(dm1),ox+dmCells1*cellSz/2,oy-12,VIO,13,p2)}
    // 단계3: 세로 dm2 = dmCells2칸 강조
    if(p>0.4){const p3=easeOutCubic((p-0.4)/0.25)
      ctx.save();ctx.globalAlpha=p3*0.2;ctx.fillStyle=GRN;ctx.fillRect(ox,oy,gridSz,dmCells2*cellSz);ctx.restore()
      gText(String(dm2),ox-18,oy+dmCells2*cellSz/2,GRN,13,p3)}
    // 단계4: 겹치는 칸
    if(p>0.6){const p4=easeOutCubic((p-0.6)/0.25)
      const dmOverlap=dmCells1*dmCells2
      ctx.save();ctx.globalAlpha=p4*0.5;ctx.fillStyle=ORG;ctx.fillRect(ox,oy,dmCells1*cellSz,dmCells2*cellSz);ctx.restore()
      ctx.save();ctx.globalAlpha=p4;ctx.strokeStyle=ORG;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=ORG;ctx.strokeRect(ox,oy,dmCells1*cellSz,dmCells2*cellSz);ctx.restore()
      gText(`${dmOverlap}\uCE78`,ox+dmCells1*cellSz/2,oy+dmCells2*cellSz/2,ORG,14,p4)}
    // 단계5: 수식
    if(p>0.8) gText(`${dm1} \u00D7 ${dm2} = ${dm1*dm2} (${dmCells1*dmCells2}/100)`,cx,H-16,ORG,14,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'decimal_divide': {
    // E022: 소수 나눗셈 — ×10으로 자연수 변환
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const steps: {text:string,color:string,note?:string}[] = [
      {text:'1.2 \u00F7 0.3',color:WHITE},
      {text:'\u00D710 \u2192 12 \u00F7 3',color:VIO,note:'\uC591\uCABD\uC5D0 \u00D710'},
      {text:'12\uAC1C\uB97C 3\uBB36\uC74C\uC73C\uB85C',color:GRN},
      {text:'= 4',color:ORG},
    ]
    steps.forEach((s,i)=>{
      const prog=easeOutCubic(Math.min(1,Math.max(0,p*2.5-i*0.4)))
      gText(s.text,cx,cy-50+i*34,s.color,i===0?20:17,prog)
      if(s.note&&prog>0.3) gText(s.note,cx,cy-50+i*34+16,'rgba(255,255,255,0.35)',11,prog*0.8)
    })
    // 블록 시각화 (12÷3)
    if(p>0.5){const bp=easeOutCubic((p-0.5)/0.35);const bsz=14,gap3=3
      for(let g=0;g<3;g++){const color=[VIO,GRN,ORG][g]
        for(let i=0;i<4;i++){const x=cx-80+g*60+i*(bsz+gap3);ctx.save();ctx.globalAlpha=bp*0.7;ctx.fillStyle=color+'55';ctx.strokeStyle=color;ctx.lineWidth=1.5
          ctx.fillRect(x,cy+50,bsz,bsz);ctx.strokeRect(x,cy+50,bsz,bsz);ctx.restore()}}}
    break
  }

  case 'correspondence': {
    // E023: 대응 관계 — 입력→규칙→출력
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const corrN=v('n',4),corrMul=v('a',2)
    const inputs=Array.from({length:corrN},(_,i)=>i+1),rule=(x:number)=>x*corrMul
    const bW=38,bH=28,gapH=16
    const totalH=inputs.length*(bH+gapH)-gapH
    const startY=cy-totalH/2
    inputs.forEach((inp,i)=>{
      const prog=easeOutElastic(Math.min(1,Math.max(0,p*2-i*0.15)))
      const y=startY+i*(bH+gapH)
      // 입력 박스
      ctx.save();ctx.globalAlpha=prog*0.8;ctx.fillStyle=VIO+'44';ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.fillRect(cx-120,y,bW,bH);ctx.strokeRect(cx-120,y,bW,bH);ctx.restore()
      gText(String(inp),cx-120+bW/2,y+bH/2,VIO,14,prog)
      // 화살표 + 규칙
      if(p>0.3){const ap=easeOutCubic(Math.min(1,(p-0.3)*2-i*0.1))
        gLine(cx-120+bW+4,y+bH/2,cx+80,y+bH/2,'rgba(255,255,255,0.15)',1.5,ap)
        gText(`\u00D7${corrMul}`,cx-20,y+bH/2-8,ORG,11,ap)}
      // 출력 박스
      if(p>0.45){const op=easeOutElastic(Math.min(1,(p-0.45)*2-i*0.15))
        ctx.save();ctx.globalAlpha=op*0.8;ctx.fillStyle=GRN+'44';ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.fillRect(cx+82,y,bW,bH);ctx.strokeRect(cx+82,y,bW,bH);ctx.restore()
        gText(String(rule(inp)),cx+82+bW/2,y+bH/2,GRN,14,op)}
    })
    // 표 헤더
    gText('\uC785\uB825',cx-120+bW/2,startY-16,VIO,11,p)
    if(p>0.45) gText('\uCD9C\uB825',cx+82+bW/2,startY-16,GRN,11,easeOutCubic((p-0.45)/0.3))
    if(p>0.85) gText(`\uADDC\uCE59: \u00D7${corrMul}`,cx,H-16,ORG,15,easeOutCubic((p-0.85)/0.15))
    break
  }

  case 'ratio': {
    // E024: 비율 — 공 개수 비교 + 막대 변환
    const VIO='#534AB7',ORG='#D85A30',GRN='#1D9E75'
    const blue=v('a',3),red=v('b',5),rr=Math.min(14,(W-80)/(blue+red+2))
    // 단계1: 공들
    for(let i=0;i<blue;i++){const prog=easeOutElastic(Math.min(1,Math.max(0,p*2.5-i*0.1)));gCircle(cx-80+i*(rr*2+6),cy-30,rr,VIO,true,prog*0.85)}
    for(let i=0;i<red;i++){const prog=easeOutElastic(Math.min(1,Math.max(0,(p-0.1)*2.5-i*0.1)));gCircle(cx+20+i*(rr*2+6),cy-30,rr,ORG,true,prog*0.85)}
    // 단계2: 텍스트
    if(p>0.2) gText(`\uD30C\uB780 : \uBE68\uAC04 = ${blue} : ${red}`,cx,cy-30-rr-16,'rgba(255,255,255,0.6)',13,easeOutCubic((p-0.2)/0.3))
    // 단계3: 막대 그래프
    if(p>0.45){const bp=easeOutCubic((p-0.45)/0.35);const barW=W*0.5,barH=24,ox=cx-barW/2
      const w1=(blue/(blue+red))*barW,w2=(red/(blue+red))*barW
      ctx.save();ctx.globalAlpha=bp*0.4;ctx.fillStyle=VIO;ctx.fillRect(ox,cy+20,w1*bp,barH);ctx.restore()
      ctx.save();ctx.globalAlpha=bp*0.4;ctx.fillStyle=ORG;ctx.fillRect(ox+w1,cy+20,w2*bp,barH);ctx.restore()
      ctx.save();ctx.globalAlpha=bp;ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.strokeRect(ox,cy+20,w1,barH);ctx.restore()
      ctx.save();ctx.globalAlpha=bp;ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.strokeRect(ox+w1,cy+20,w2,barH);ctx.restore()
      gText(String(blue),ox+w1/2,cy+20+barH/2,VIO,13,bp);gText(String(red),ox+w1+w2/2,cy+20+barH/2,ORG,13,bp)}
    // 단계4: 비율
    if(p>0.8) gText(`\uBE44\uC728 = ${blue}/${blue+red} = ${(blue/(blue+red)).toFixed(2)}`,cx,H-16,GRN,15,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'percentage': {
    // E025: 백분율 — 100칸 채우기
    const VIO='#534AB7',GRN='#1D9E75'
    const pct=Math.round(Math.min(99,Math.max(1,v('a',0.25)*100)))
    const cols=10,cellSz=Math.min((W-60)/cols,(H-60)/cols)
    const ox=cx-(cols*cellSz)/2,oy=cy-(cols*cellSz)/2-5
    for(let i=0;i<100;i++){
      const row=Math.floor(i/cols),col=i%cols
      const filled=i<pct
      const prog=easeOutCubic(Math.min(1,Math.max(0,p*2-(i/100)*0.5)))
      ctx.save();ctx.globalAlpha=prog*(filled?0.7:0.12)
      ctx.fillStyle=filled?VIO+'88':'rgba(255,255,255,0.06)'
      ctx.strokeStyle=filled?VIO:'rgba(255,255,255,0.08)'
      ctx.lineWidth=1;ctx.shadowBlur=filled?4:0;ctx.shadowColor=VIO
      ctx.fillRect(ox+col*cellSz+1,oy+row*cellSz+1,cellSz-2,cellSz-2)
      ctx.strokeRect(ox+col*cellSz+1,oy+row*cellSz+1,cellSz-2,cellSz-2);ctx.restore()
    }
    if(p>0.6) gText(`${pct}/100 = ${pct}%`,cx,oy+cols*cellSz+20,GRN,18,easeOutCubic((p-0.6)/0.4))
    break
  }

  case 'proportion': {
    // E026: 비례식 — 두 비율이 같음
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const r1=[v('a',2),v('b',3)],r2=[v('c',4),v('d',6)]
    const unit=Math.min(22,(W-80)/(r2[0]+r2[1]+4))
    // 첫째 비 (위)
    if(p>0.05){const p1=easeOutCubic((p-0.05)/0.3);const ox=cx-(r1[0]+r1[1])*unit/2
      for(let i=0;i<r1[0];i++){ctx.save();ctx.globalAlpha=p1*0.7;ctx.fillStyle=VIO+'66';ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.fillRect(ox+i*unit+1,cy-50,unit-2,22);ctx.strokeRect(ox+i*unit+1,cy-50,unit-2,22);ctx.restore()}
      for(let i=0;i<r1[1];i++){ctx.save();ctx.globalAlpha=p1*0.7;ctx.fillStyle=GRN+'66';ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.fillRect(ox+(r1[0]+i)*unit+1,cy-50,unit-2,22);ctx.strokeRect(ox+(r1[0]+i)*unit+1,cy-50,unit-2,22);ctx.restore()}
      gText(`${r1[0]}:${r1[1]}`,ox+(r1[0]+r1[1])*unit+16,cy-39,VIO,13,p1)}
    // 둘째 비 (아래)
    if(p>0.3){const p2=easeOutCubic((p-0.3)/0.3);const ox=cx-(r2[0]+r2[1])*unit/2
      for(let i=0;i<r2[0];i++){ctx.save();ctx.globalAlpha=p2*0.7;ctx.fillStyle=VIO+'66';ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.fillRect(ox+i*unit+1,cy+10,unit-2,22);ctx.strokeRect(ox+i*unit+1,cy+10,unit-2,22);ctx.restore()}
      for(let i=0;i<r2[1];i++){ctx.save();ctx.globalAlpha=p2*0.7;ctx.fillStyle=GRN+'66';ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.fillRect(ox+(r2[0]+i)*unit+1,cy+10,unit-2,22);ctx.strokeRect(ox+(r2[0]+i)*unit+1,cy+10,unit-2,22);ctx.restore()}
      gText(`${r2[0]}:${r2[1]}`,ox+(r2[0]+r2[1])*unit+16,cy+21,GRN,13,p2)}
    // 외항곱=내항곱
    if(p>0.65){const p3=easeOutCubic((p-0.65)/0.3);gText(`${r1[0]}\u00D7${r2[1]} = ${r1[1]}\u00D7${r2[0]} = ${r1[0]*r2[1]}`,cx,cy+55,ORG,14,p3)}
    if(p>0.85) gText(`${r1[0]}:${r1[1]} = ${r2[0]}:${r2[1]}`,cx,H-16,ORG,16,easeOutCubic((p-0.85)/0.15))
    break
  }

  case 'proportion_split': {
    // E027: 비례배분 — 비율대로 나누기
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const totalN=v('n',10),r1=v('a',3),r2=v('b',2),sum=r1+r2
    const part1=totalN*r1/sum,part2=totalN*r2/sum
    const barW=W*0.65,barH=40,ox=cx-barW/2
    // 단계1: 전체 막대
    if(p>0.05){const p1=easeOutCubic((p-0.05)/0.25)
      ctx.save();ctx.globalAlpha=p1*0.12;ctx.fillStyle=WHITE;ctx.fillRect(ox,cy-barH/2,barW,barH);ctx.restore()
      ctx.save();ctx.globalAlpha=p1*0.4;ctx.strokeStyle=WHITE;ctx.lineWidth=2;ctx.strokeRect(ox,cy-barH/2,barW,barH);ctx.restore()
      gText(`\uC804\uCCB4 ${totalN}`,cx,cy-barH/2-14,'rgba(255,255,255,0.5)',13,p1)}
    // 단계2~3: 분할 계산
    if(p>0.3){const p2=easeOutCubic((p-0.3)/0.2);gText(`${r1}+${r2}=${sum} \u2192 \uD55C \uBB36\uC74C = ${totalN}÷${sum} = ${totalN/sum}`,cx,cy-barH/2-32,'rgba(255,255,255,0.4)',11,p2)}
    // 단계4: 색칠
    if(p>0.45){const p3=easeOutCubic((p-0.45)/0.35);const w1=barW*r1/sum
      ctx.save();ctx.globalAlpha=p3*0.5;ctx.fillStyle=VIO+'88';ctx.fillRect(ox,cy-barH/2,w1,barH);ctx.restore()
      ctx.save();ctx.globalAlpha=p3;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=VIO;ctx.strokeRect(ox,cy-barH/2,w1,barH);ctx.restore()
      ctx.save();ctx.globalAlpha=p3*0.5;ctx.fillStyle=GRN+'88';ctx.fillRect(ox+w1,cy-barH/2,barW-w1,barH);ctx.restore()
      ctx.save();ctx.globalAlpha=p3;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=GRN;ctx.strokeRect(ox+w1,cy-barH/2,barW-w1,barH);ctx.restore()
      gText(`${part1}`,ox+w1/2,cy,VIO,16,p3);gText(`${part2}`,ox+w1+(barW-w1)/2,cy,GRN,16,p3)}
    // 단계5: 확인
    if(p>0.8) gText(`${part1} : ${part2} = ${r1} : ${r2} \u2713`,cx,H-16,ORG,15,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'angle': {
    // E028: 각도 — 반직선 회전
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const armLen=Math.min(90,W*0.3)
    const pivotX=cx,pivotY=cy+20
    // 고정 반직선
    gLine(pivotX,pivotY,pivotX+armLen,pivotY,'rgba(255,255,255,0.4)',2,p)
    // 단계2: 회전 반직선
    const targetAngles=[30,45,90,180]
    const totalDur=1,pauseDur=0.15
    const segDur=totalDur/(targetAngles.length)
    let currentDeg=0
    for(let i=0;i<targetAngles.length;i++){
      const segStart=i*segDur,segEnd=segStart+segDur-pauseDur
      if(p>=segStart&&p<=segStart+segDur) currentDeg=targetAngles[i]*Math.min(1,(p-segStart)/(segDur-pauseDur))
      else if(p>segStart+segDur) currentDeg=targetAngles[i]
    }
    currentDeg=Math.min(180,currentDeg)
    const rad=currentDeg*Math.PI/180
    const endX=pivotX+Math.cos(-rad)*armLen,endY=pivotY+Math.sin(-rad)*armLen
    gLine(pivotX,pivotY,endX,endY,GRN,2.5,p)
    // 호
    if(p>0.05){ctx.save();ctx.globalAlpha=p*0.5;ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.shadowBlur=6;ctx.shadowColor=ORG
      ctx.beginPath();ctx.arc(pivotX,pivotY,30,0,-rad,true);ctx.stroke();ctx.restore()
      gText(`${Math.round(currentDeg)}\u00B0`,pivotX+40,pivotY-20,ORG,15,p)}
    // 단계3: 특수각 이름
    const names:{[k:number]:string}={90:'\uC9C1\uAC01',180:'\uD3C9\uAC01'}
    const nearest=targetAngles.find(a=>Math.abs(currentDeg-a)<2)
    if(nearest&&names[nearest]) gText(names[nearest],pivotX,pivotY-armLen-10,VIO,14,p)
    // 단계4: 직각 네모
    if(Math.abs(currentDeg-90)<3){const sq=12;ctx.save();ctx.globalAlpha=0.6;ctx.strokeStyle=VIO;ctx.lineWidth=2
      ctx.strokeRect(pivotX,pivotY-sq,sq,sq);ctx.restore()}
    break
  }

  case 'triangle_angles': {
    // E029: 삼각형 내각의 합 — 세 각 떼어서 직선
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const triW=v('w',140),triH=v('h',100)
    const A={x:cx,y:cy-triH/2},B={x:cx-triW/2,y:cy+triH/2},C={x:cx+triW/2,y:cy+triH/2}
    // 단계1: 삼각형 (페이드아웃)
    const triAlpha=Math.max(0,1-(p>0.5?(p-0.5)*3:0))
    if(triAlpha>0){ctx.save();ctx.globalAlpha=triAlpha*0.8;ctx.strokeStyle=WHITE;ctx.lineWidth=2.5
      ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.lineTo(C.x,C.y);ctx.closePath();ctx.stroke();ctx.restore()
      // 색 호
      if(p>0.1){const ap=easeOutCubic((p-0.1)/0.3)*triAlpha
        ctx.save();ctx.globalAlpha=ap*0.6;ctx.strokeStyle=VIO;ctx.lineWidth=3;ctx.beginPath();ctx.arc(A.x,A.y,16,Math.atan2(B.y-A.y,B.x-A.x),Math.atan2(C.y-A.y,C.x-A.x));ctx.stroke();ctx.restore()
        ctx.save();ctx.globalAlpha=ap*0.6;ctx.strokeStyle=GRN;ctx.lineWidth=3;ctx.beginPath();ctx.arc(B.x,B.y,16,Math.atan2(A.y-B.y,A.x-B.x),Math.atan2(C.y-B.y,C.x-B.x));ctx.stroke();ctx.restore()
        ctx.save();ctx.globalAlpha=ap*0.6;ctx.strokeStyle=ORG;ctx.lineWidth=3;ctx.beginPath();ctx.arc(C.x,C.y,16,Math.atan2(B.y-C.y,B.x-C.x),Math.atan2(A.y-C.y,A.x-C.x));ctx.stroke();ctx.restore()
        gText('A',A.x,A.y-22,VIO,12,ap);gText('B',B.x-18,B.y+8,GRN,12,ap);gText('C',C.x+18,C.y+8,ORG,12,ap)}}
    // 단계2~3: 세 각 떼어서 직선으로
    if(p>0.55){const lp=easeOutCubic((p-0.55)/0.35);const lineY=cy+triH/2+30
      gLine(cx-80,lineY,cx+80,lineY,'rgba(255,255,255,0.3)',2,lp)
      const aW=45,bW=55,cW=60,startX=cx-80
      ctx.save();ctx.globalAlpha=lp*0.5;ctx.fillStyle=VIO+'55';ctx.fillRect(startX,lineY-16,aW*lp,16);ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.strokeRect(startX,lineY-16,aW,16);ctx.restore()
      ctx.save();ctx.globalAlpha=lp*0.5;ctx.fillStyle=GRN+'55';ctx.fillRect(startX+aW,lineY-16,bW*lp,16);ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.strokeRect(startX+aW,lineY-16,bW,16);ctx.restore()
      ctx.save();ctx.globalAlpha=lp*0.5;ctx.fillStyle=ORG+'55';ctx.fillRect(startX+aW+bW,lineY-16,cW*lp,16);ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.strokeRect(startX+aW+bW,lineY-16,cW,16);ctx.restore()}
    // 단계4: 수식
    if(p>0.85) gText('\u2220A + \u2220B + \u2220C = 180\u00B0',cx,H-16,'#1D9E75',16,easeOutCubic((p-0.85)/0.15))
    break
  }

  case 'quad_angles': {
    // E030: 사각형 내각 — 대각선으로 삼각형 2개
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const qw=v('w',140),qh=v('h',100),ox=cx-qw/2,oy=cy-qh/2-10
    // 단계1: 사각형
    if(p>0.05){const p1=easeOutCubic((p-0.05)/0.25)
      ctx.save();ctx.globalAlpha=p1*0.8;ctx.strokeStyle=WHITE;ctx.lineWidth=2.5
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox+qw,oy);ctx.lineTo(ox+qw,oy+qh);ctx.lineTo(ox,oy+qh);ctx.closePath();ctx.stroke();ctx.restore()}
    // 단계2: 대각선
    if(p>0.3){const dp=easeOutCubic((p-0.3)/0.2);gLine(ox,oy,ox+qw,oy+qh,ORG,2.5,dp)}
    // 단계3: 삼각형 색칠
    if(p>0.45){const p3=easeOutCubic((p-0.45)/0.3)
      ctx.save();ctx.globalAlpha=p3*0.2;ctx.fillStyle=VIO;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox+qw,oy);ctx.lineTo(ox+qw,oy+qh);ctx.closePath();ctx.fill();ctx.restore()
      ctx.save();ctx.globalAlpha=p3*0.2;ctx.fillStyle=GRN;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox,oy+qh);ctx.lineTo(ox+qw,oy+qh);ctx.closePath();ctx.fill();ctx.restore()
      gText('180\u00B0',cx+20,cy-20,VIO,14,p3);gText('180\u00B0',cx-20,cy+20,GRN,14,p3)}
    // 단계4: 합계
    if(p>0.75) gText('180\u00B0 + 180\u00B0 = 360\u00B0',cx,H-16,ORG,17,easeOutCubic((p-0.75)/0.25))
    break
  }

  // ══════════════════════════════════════════
  // E031~E040 — 설계서 기반 전용 시각화
  // ══════════════════════════════════════════

  case 'perimeter_rect': {
    // E031: 직사각형 둘레 — 개미가 변 따라 이동
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const w2=v('a',5),h2=v('b',3)
    const sc=Math.min(30,Math.min((W-80)/w2,(H-80)/h2))
    const rx=cx-w2*sc/2,ry=cy-h2*sc/2-10
    // 직사각형
    ctx.save();ctx.globalAlpha=p*0.8;ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=2;ctx.strokeRect(rx,ry,w2*sc,h2*sc);ctx.restore()
    // 개미 이동 (둘레 따라 진행)
    const perim=2*(w2+h2)*sc,dist=p*perim
    const corners=[[rx,ry],[rx+w2*sc,ry],[rx+w2*sc,ry+h2*sc],[rx,ry+h2*sc]]
    const edges=[w2*sc,h2*sc,w2*sc,h2*sc]
    const edgeColors=[VIO,GRN,VIO,GRN]
    const edgeLabels=[String(w2),String(h2),String(w2),String(h2)]
    let rem=dist,ei=0
    // 변 색칠
    for(let i=0;i<4&&rem>0;i++){const len=edges[i];const drawn=Math.min(rem,len);const [sx,sy]=corners[i];const [ex,ey]=corners[(i+1)%4]
      const dx=(ex-sx)/len,dy=(ey-sy)/len
      gLine(sx,sy,sx+dx*drawn,sy+dy*drawn,edgeColors[i],3,0.8)
      // 변 길이 라벨
      if(drawn>=len*0.5){const mx=(sx+ex)/2,my=(sy+ey)/2;const off=i%2===0?-14:14
        gText(edgeLabels[i],mx+(i===1||i===3?off:0),my+(i===0||i===2?-14:14),edgeColors[i],12,Math.min(1,drawn/len))}
      rem-=len;ei=i}
    // 개미 위치
    if(p<1){let rem2=dist;for(let i=0;i<4;i++){if(rem2<=edges[i]){const [sx,sy]=corners[i];const [ex,ey]=corners[(i+1)%4];const t=rem2/edges[i]
        gCircle(sx+(ex-sx)*t,sy+(ey-sy)*t,5,ORG,true,0.9);break};rem2-=edges[i]}}
    // 수식
    if(p>0.85) gText(`(${w2}+${h2})\u00D72 = ${2*(w2+h2)}`,cx,ry+h2*sc+28,GRN,16,easeOutCubic((p-0.85)/0.15))
    break
  }

  case 'area_rect': {
    // E032: 직사각형 넓이 — 격자 채우기
    const VIO='#534AB7',GRN='#1D9E75'
    const w2=v('a',5),h2=v('b',3)
    const cell=Math.min(30,Math.min((W-60)/w2,(H-70)/h2))
    const ox=cx-w2*cell/2,oy=cy-h2*cell/2-5
    for(let row=0;row<h2;row++){
      const rowP=easeOutCubic(Math.min(1,Math.max(0,p*(h2+1)-row*0.7)))
      for(let col=0;col<w2;col++){
        const prog=rowP*easeOutCubic(Math.min(1,Math.max(0,rowP*2-col*0.12)))
        ctx.save();ctx.globalAlpha=prog*0.7;ctx.fillStyle=VIO+'55';ctx.strokeStyle=VIO;ctx.lineWidth=1.5
        ctx.fillRect(ox+col*cell+1,oy+row*cell+1,cell-2,cell-2);ctx.strokeRect(ox+col*cell+1,oy+row*cell+1,cell-2,cell-2);ctx.restore()
        // 카운트
        if(prog>0.5){const idx=row*w2+col+1;gText(String(idx),ox+col*cell+cell/2,oy+row*cell+cell/2,'rgba(255,255,255,0.4)',Math.min(10,cell-8),prog)}
      }
    }
    gText(`\uAC00\uB85C ${w2}`,cx,oy-14,'rgba(255,255,255,0.5)',12,p)
    gText(`\uC138\uB85C ${h2}`,ox-20,cy,'rgba(255,255,255,0.5)',12,p)
    if(p>0.8) gText(`${w2} \u00D7 ${h2} = ${w2*h2}`,cx,oy+h2*cell+22,GRN,18,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'area_square': {
    // E033: 정사각형 넓이 — 격자 + 제곱
    const VIO='#534AB7',GRN='#1D9E75'
    const a2=v('a',4)
    const cell=Math.min(28,Math.min((W-60)/a2,(H-70)/a2))
    const ox=cx-a2*cell/2,oy=cy-a2*cell/2-5
    for(let row=0;row<a2;row++)for(let col=0;col<a2;col++){
      const idx=row*a2+col;const prog=easeOutElastic(Math.min(1,Math.max(0,p*2-(idx/(a2*a2))*0.6)))
      ctx.save();ctx.globalAlpha=prog*0.7;ctx.fillStyle=VIO+'55';ctx.strokeStyle=VIO;ctx.lineWidth=1.5
      ctx.fillRect(ox+col*cell+1,oy+row*cell+1,cell-2,cell-2);ctx.strokeRect(ox+col*cell+1,oy+row*cell+1,cell-2,cell-2);ctx.restore()
    }
    ctx.save();ctx.globalAlpha=p*0.8;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=VIO;ctx.strokeRect(ox,oy,a2*cell,a2*cell);ctx.restore()
    gText(`${a2}`,cx,oy-14,'rgba(255,255,255,0.5)',13,p)
    gText(`${a2}`,ox-16,cy,'rgba(255,255,255,0.5)',13,p)
    if(p>0.75) gText(`${a2} \u00D7 ${a2} = ${a2}\u00B2 = ${a2*a2}`,cx,oy+a2*cell+22,GRN,17,easeOutCubic((p-0.75)/0.25))
    break
  }

  case 'area_parallelogram': {
    // E034: 평행사변형 넓이 — 잘라서 직사각형으로
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const bw=v('w',160),bh=v('h',80),skew=v('s',40)
    const ox=cx-bw/2,oy=cy-bh/2-5
    // 단계1: 평행사변형
    if(p>0.05){const p1=easeOutCubic((p-0.05)/0.25)
      ctx.save();ctx.globalAlpha=p1*0.3;ctx.fillStyle=VIO;ctx.beginPath();ctx.moveTo(ox+skew,oy);ctx.lineTo(ox+bw+skew,oy);ctx.lineTo(ox+bw,oy+bh);ctx.lineTo(ox,oy+bh);ctx.closePath();ctx.fill();ctx.restore()
      ctx.save();ctx.globalAlpha=p1*0.8;ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ox+skew,oy);ctx.lineTo(ox+bw+skew,oy);ctx.lineTo(ox+bw,oy+bh);ctx.lineTo(ox,oy+bh);ctx.closePath();ctx.stroke();ctx.restore()}
    // 단계2: 칼선 (수직)
    if(p>0.3){const cp=easeOutCubic((p-0.3)/0.15);gLine(ox+skew,oy,ox,oy+bh,ORG,2.5,cp)}
    // 단계3: 삼각형 이동
    const moveP=p>0.4?easeOutCubic(Math.min(1,(p-0.4)/0.3)):0
    if(moveP>0){
      ctx.save();ctx.globalAlpha=moveP*0.4;ctx.fillStyle=ORG
      ctx.beginPath();ctx.moveTo(ox+skew+bw*moveP,oy);ctx.lineTo(ox+bw*moveP,oy+bh);ctx.lineTo(ox+skew+bw*moveP,oy+bh);ctx.closePath();ctx.fill();ctx.restore()}
    // 단계4: 직사각형 완성 강조
    if(p>0.7){const fp=easeOutCubic((p-0.7)/0.2)
      ctx.save();ctx.globalAlpha=fp;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=GRN;ctx.strokeRect(ox,oy,bw,bh);ctx.restore()
      gText('\uBC11\uBCC0',cx,oy+bh+14,'rgba(255,255,255,0.5)',11,fp);gText('\uB192\uC774',ox-18,cy,'rgba(255,255,255,0.5)',11,fp)}
    if(p>0.85) gText('\uBC11\uBCC0 \u00D7 \uB192\uC774',cx,H-16,GRN,16,easeOutCubic((p-0.85)/0.15))
    break
  }

  case 'area_triangle': {
    // E035: 삼각형 넓이 — 복제+뒤집기→직사각형
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const bw=v('w',150),bh=v('h',90),ox=cx-bw/2,oy=cy-bh/2-5
    // 단계1: 삼각형
    const drawTri=(flip:boolean,alpha:number,color:string,offX:number)=>{
      ctx.save();ctx.globalAlpha=alpha*0.4;ctx.fillStyle=color
      ctx.beginPath()
      if(!flip){ctx.moveTo(ox+offX,oy+bh);ctx.lineTo(ox+bw+offX,oy+bh);ctx.lineTo(ox+offX,oy)}
      else{ctx.moveTo(ox+offX,oy);ctx.lineTo(ox+bw+offX,oy);ctx.lineTo(ox+bw+offX,oy+bh)}
      ctx.closePath();ctx.fill();ctx.restore()
      ctx.save();ctx.globalAlpha=alpha*0.8;ctx.strokeStyle=color;ctx.lineWidth=2
      ctx.beginPath()
      if(!flip){ctx.moveTo(ox+offX,oy+bh);ctx.lineTo(ox+bw+offX,oy+bh);ctx.lineTo(ox+offX,oy);ctx.closePath()}
      else{ctx.moveTo(ox+offX,oy);ctx.lineTo(ox+bw+offX,oy);ctx.lineTo(ox+bw+offX,oy+bh);ctx.closePath()}
      ctx.stroke();ctx.restore()
    }
    const p1=easeOutCubic(Math.min(1,p*2.5))
    drawTri(false,p1,VIO,0)
    // 단계2: 복제+뒤집기
    if(p>0.35){const p2=easeOutCubic((p-0.35)/0.3);drawTri(true,p2,ORG,0)}
    // 단계3: 직사각형 강조
    if(p>0.65){const fp=easeOutCubic((p-0.65)/0.2)
      ctx.save();ctx.globalAlpha=fp;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=GRN;ctx.strokeRect(ox,oy,bw,bh);ctx.restore()}
    // 단계4: 수식
    if(p>0.8) gText('\uC9C1\uC0AC\uAC01\uD615\uC758 \uBC18 = \uBC11\uBCC0\u00D7\uB192\uC774\u00F72',cx,H-16,GRN,14,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'area_trapezoid': {
    // E036: 사다리꼴 넓이 — 복제+뒤집어 붙이기
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const topW=v('a',60),botW=v('b',120),h2=v('h',70),ox=cx-botW/2,oy=cy-h2/2-5
    const topOff=(botW-topW)/2
    // 단계1: 사다리꼴
    const drawTrap=(flip:boolean,alpha:number,color:string,offY:number)=>{
      ctx.save();ctx.globalAlpha=alpha*0.35;ctx.fillStyle=color
      ctx.beginPath()
      if(!flip){ctx.moveTo(ox+topOff,oy+offY);ctx.lineTo(ox+topOff+topW,oy+offY);ctx.lineTo(ox+botW,oy+h2+offY);ctx.lineTo(ox,oy+h2+offY)}
      else{ctx.moveTo(ox+botW-topOff,oy+offY);ctx.lineTo(ox+botW-topOff-topW,oy+offY);ctx.lineTo(ox,oy+h2+offY);ctx.lineTo(ox+botW,oy+h2+offY)}
      ctx.closePath();ctx.fill();ctx.restore()
      ctx.save();ctx.globalAlpha=alpha*0.8;ctx.strokeStyle=color;ctx.lineWidth=2
      ctx.beginPath()
      if(!flip){ctx.moveTo(ox+topOff,oy+offY);ctx.lineTo(ox+topOff+topW,oy+offY);ctx.lineTo(ox+botW,oy+h2+offY);ctx.lineTo(ox,oy+h2+offY);ctx.closePath()}
      else{ctx.moveTo(ox+botW-topOff,oy+offY);ctx.lineTo(ox+botW-topOff-topW,oy+offY);ctx.lineTo(ox,oy+h2+offY);ctx.lineTo(ox+botW,oy+h2+offY);ctx.closePath()}
      ctx.stroke();ctx.restore()
    }
    drawTrap(false,easeOutCubic(Math.min(1,p*2.5)),VIO,0)
    // 단계2: 복제+뒤집기
    if(p>0.35){const p2=easeOutCubic((p-0.35)/0.3);drawTrap(true,p2,ORG,0)}
    // 단계3: 합치면 평행사변형
    if(p>0.65){const fp=easeOutCubic((p-0.65)/0.2)
      gText(`\uC717\uBCC0+\uC544\uB7AB\uBCC0 = \uBC11\uBCC0`,cx,oy-16,GRN,12,fp)}
    if(p>0.8) gText('(\uC717\uBCC0+\uC544\uB7AB\uBCC0)\u00D7\uB192\uC774\u00F72',cx,H-16,GRN,14,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'area_rhombus': {
    // E037: 마름모 넓이 — 4삼각형→직사각형
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const d1=v('d1',120),d2=v('d2',80)
    // 단계1: 마름모
    const pts=[{x:cx,y:cy-d2/2},{x:cx+d1/2,y:cy},{x:cx,y:cy+d2/2},{x:cx-d1/2,y:cy}]
    if(p>0.05){const p1=easeOutCubic((p-0.05)/0.25)
      ctx.save();ctx.globalAlpha=p1*0.3;ctx.fillStyle=VIO
      ctx.beginPath();pts.forEach((pt,i)=>i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y));ctx.closePath();ctx.fill();ctx.restore()
      ctx.save();ctx.globalAlpha=p1*0.8;ctx.strokeStyle=VIO;ctx.lineWidth=2
      ctx.beginPath();pts.forEach((pt,i)=>i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y));ctx.closePath();ctx.stroke();ctx.restore()}
    // 단계2: 대각선
    if(p>0.25){const dp=easeOutCubic((p-0.25)/0.2)
      gLine(cx-d1/2,cy,cx+d1/2,cy,ORG,2,dp);gLine(cx,cy-d2/2,cx,cy+d2/2,ORG,2,dp)
      gText(`d\u2081=${d1/10}`,cx,cy+d2/2+14,ORG,11,dp);gText(`d\u2082=${d2/10}`,cx+d1/2+14,cy,ORG,11,dp)}
    // 단계3~4: 직사각형 외접
    if(p>0.5){const rp=easeOutCubic((p-0.5)/0.25)
      ctx.save();ctx.globalAlpha=rp*0.3;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.setLineDash([5,5])
      ctx.strokeRect(cx-d1/2,cy-d2/2,d1,d2);ctx.restore()
      gText('\uC9C1\uC0AC\uAC01\uD615\uC758 \uBC18',cx+d1/2+10,cy-d2/2-8,GRN,11,rp)}
    if(p>0.8) gText(`d\u2081\u00D7d\u2082\u00F72`,cx,H-16,GRN,16,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'pi_ratio': {
    // E038: 원주율 — 실 풀기
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const rr=Math.min(55,H*0.25)
    // 단계1: 원 + 지름
    gCircle(cx,cy-20,rr,'rgba(255,255,255,0.3)',false,easeOutCubic(Math.min(1,p*2.5)))
    if(p>0.1){const dp=easeOutCubic((p-0.1)/0.2);gLine(cx-rr,cy-20,cx+rr,cy-20,ORG,2.5,dp);gText(`\uC9C0\uB984 d`,cx,cy-20+14,ORG,12,dp)}
    // 단계2~3: 실 풀기
    if(p>0.35){const sp=easeOutCubic((p-0.35)/0.35)
      const circumLen=2*Math.PI*rr,drawLen=circumLen*sp
      const lineY=cy+rr+30
      gLine(cx-circumLen/2,lineY,cx-circumLen/2+drawLen,lineY,GRN,3,sp)
      // 지름 눈금 3개
      const diam=2*rr
      for(let i=0;i<3;i++){const x=cx-circumLen/2+i*diam
        if(x<cx-circumLen/2+drawLen) gLine(x,lineY-6,x,lineY+6,ORG,2,sp)}
      if(sp>0.5) gText('\u00D73.14...',cx-circumLen/2+3*diam+10,lineY,'rgba(255,255,255,0.4)',11,sp)}
    // 단계4~5: 결과
    if(p>0.8) gText('\uC6D0\uC8FC \u00F7 \uC9C0\uB984 = \u03C0 \u2248 3.14',cx,H-16,GRN,15,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'circumference': {
    // E039: 원의 둘레 — 원 굴리기
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const rr=Math.min(35,H*0.18)
    const circumLen=2*Math.PI*rr
    const rollP=easeOutCubic(Math.min(1,Math.max(0,(p-0.2)/0.6)))
    const startX=cx-circumLen/2,rollX=startX+rollP*circumLen
    const groundY=cy+20
    // 지면 선
    gLine(startX-10,groundY+rr,startX+circumLen+30,groundY+rr,'rgba(255,255,255,0.15)',1.5,p)
    // 굴러가는 원
    const angle=rollP*Math.PI*2
    ctx.save();ctx.globalAlpha=p*0.8;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=VIO
    ctx.beginPath();ctx.arc(rollX,groundY,rr,0,Math.PI*2);ctx.stroke();ctx.restore()
    // 반지름 표시 (회전)
    gLine(rollX,groundY,rollX+Math.cos(angle)*rr,groundY-Math.sin(angle)*rr,ORG,2,p*0.7)
    gText('r',rollX+10,groundY-rr-8,ORG,11,p)
    // 굴러간 거리 강조
    if(rollP>0.1) gLine(startX,groundY+rr+8,rollX,groundY+rr+8,GRN,3,rollP)
    // 수식
    if(p>0.8) gText(`\uC6D0\uC8FC = 2 \u00D7 r \u00D7 3.14`,cx,H-16,GRN,15,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'circle_area': {
    // E040: 원의 넓이 — 부채꼴→직사각형
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const rr=Math.min(55,H*0.25),n=8
    const morphP=easeOutCubic(Math.min(1,Math.max(0,(p-0.3)/0.5)))
    // 단계1: 원형 조각
    for(let i=0;i<n;i++){
      const a1=(i/n)*Math.PI*2-Math.PI/2,a2=((i+1)/n)*Math.PI*2-Math.PI/2
      const prog=easeOutElastic(Math.min(1,Math.max(0,p*1.8-i*0.08)))
      const color=i%2===0?VIO:ORG
      // 목표 위치 (직사각형으로)
      const midA=(a1+a2)/2
      const srcX=cx+Math.cos(midA)*rr*0.4,srcY=cy-15+Math.sin(midA)*rr*0.4
      const sliceW=Math.PI*rr/n
      const targetX=cx-Math.PI*rr/2+i*sliceW+sliceW/2
      const targetY=cy+rr+20
      const x=srcX+(targetX-srcX)*morphP,y=srcY+(targetY-srcY)*morphP
      ctx.save();ctx.globalAlpha=prog*0.6;ctx.fillStyle=color+'88';ctx.strokeStyle=color;ctx.lineWidth=1.5
      ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,rr*(1-morphP*0.3),a1,a2);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()
    }
    // 단계4: 수식
    if(p>0.3&&morphP>0.5){const fp=easeOutCubic((morphP-0.5)/0.5)
      gText(`\uAC00\uB85C \u2248 \u03C0r`,cx,cy+rr+55,'rgba(255,255,255,0.4)',11,fp)
      gText(`\uC138\uB85C \u2248 r`,cx-Math.PI*rr/2-18,cy+rr+20,'rgba(255,255,255,0.4)',11,fp)}
    if(p>0.8) gText('\uB113\uC774 = r \u00D7 r \u00D7 3.14',cx,H-16,GRN,16,easeOutCubic((p-0.8)/0.2))
    break
  }

  // ══════════════════════════════════════════
  // E041~E050 — 설계서 기반 전용 시각화
  // ══════════════════════════════════════════

  case 'surface_cuboid': {
    // E041: 직육면체 겉넓이 — 면 떼어내기
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const a2=v('a',4),b2=v('b',3),c2=v('c',2)
    const sc=Math.min(14,Math.min((W-80)/8,(H-60)/6))
    const faces=[
      {label:`\uC55E ${a2}\u00D7${c2}`,w:a2,h:c2,color:VIO,area:a2*c2},
      {label:`\uC704 ${a2}\u00D7${b2}`,w:a2,h:b2,color:GRN,area:a2*b2},
      {label:`\uC608 ${b2}\u00D7${c2}`,w:b2,h:c2,color:ORG,area:b2*c2},
    ]
    faces.forEach((f,i)=>{
      const prog=easeOutCubic(Math.min(1,Math.max(0,p*3-i*0.6)))
      const fx=W*0.15+i*W*0.28,fy=cy-f.h*sc/2
      ctx.save();ctx.globalAlpha=prog*0.35;ctx.fillStyle=f.color;ctx.fillRect(fx,fy,f.w*sc,f.h*sc);ctx.restore()
      ctx.save();ctx.globalAlpha=prog*0.9;ctx.strokeStyle=f.color;ctx.lineWidth=2;ctx.strokeRect(fx,fy,f.w*sc,f.h*sc);ctx.restore()
      gText(f.label,fx+f.w*sc/2,fy-12,f.color,11,prog)
      gText(`=${f.area}`,fx+f.w*sc/2,fy+f.h*sc+14,f.color,12,prog)
    })
    if(p>0.7){const fp=easeOutCubic((p-0.7)/0.3);const total=2*(a2*c2+a2*b2+b2*c2)
      gText(`\u00D72 \u2192 \uAC89\uB113\uC774 = ${total}`,cx,H-16,GRN,15,fp)}
    break
  }

  case 'volume_cuboid': {
    // E042: 직육면체 부피 — 층 쌓기
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const a2=v('a',4),b2=v('b',3),c2=v('c',3)
    const sc=Math.min(18,Math.min((W-60)/(a2+2),(H-60)/(b2+c2)))
    const isoX=0.7,isoY=0.35
    const ox=cx-(a2*sc)/2,baseY=cy+c2*sc*isoY
    // 층별 쌓기
    for(let layer=0;layer<c2;layer++){
      const layerP=easeOutCubic(Math.min(1,Math.max(0,p*(c2+1)-layer*0.7)))
      if(layerP<=0) continue
      for(let row=0;row<b2;row++)for(let col=0;col<a2;col++){
        const x=ox+col*sc+row*sc*isoX*0.3
        const y=baseY-layer*sc*isoY-row*sc*isoY*0.5
        const prog=layerP*easeOutCubic(Math.min(1,Math.max(0,layerP*2-(row*a2+col)/(a2*b2)*0.5)))
        ctx.save();ctx.globalAlpha=prog*0.6;ctx.fillStyle=[VIO,GRN,ORG][layer%3]+'66';ctx.strokeStyle=[VIO,GRN,ORG][layer%3]
        ctx.lineWidth=1;ctx.fillRect(x,y,sc-1,sc*isoY);ctx.strokeRect(x,y,sc-1,sc*isoY);ctx.restore()
      }
      if(layerP>0.5) gText(`${layer+1}\uCE35`,ox+a2*sc+20,baseY-layer*sc*isoY-b2*sc*isoY*0.25,'rgba(255,255,255,0.4)',10,layerP)
    }
    gText(`${a2}`,cx,baseY+18,'rgba(255,255,255,0.5)',12,p)
    if(p>0.8) gText(`${a2}\u00D7${b2}\u00D7${c2} = ${a2*b2*c2}`,cx,H-16,GRN,16,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'average': {
    // E043: 평균 — 막대 녹아서 균등 분배
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const nums=[v('a',2),v('b',6),v('c',4),v('d',8)]
    const avg=nums.reduce((a3,b3)=>a3+b3,0)/nums.length
    const maxH=100,barW=36,gap2=14
    const totalW2=nums.length*(barW+gap2)-gap2,ox=cx-totalW2/2,baseY=cy+maxH/2+10
    const colors=[VIO,GRN,ORG,'#D85A30']
    // 단계1~3: 막대 표시 → 녹아서 균등 분배
    const flatP=easeOutCubic(Math.min(1,Math.max(0,(p-0.5)*2.5)))
    nums.forEach((n2,i)=>{
      const origH=(n2/10)*maxH,avgH=(avg/10)*maxH
      const curH=origH+(avgH-origH)*flatP
      const x=ox+i*(barW+gap2)
      const prog=easeOutCubic(Math.min(1,p*3-i*0.3))
      ctx.save();ctx.globalAlpha=prog*0.7;ctx.fillStyle=colors[i%4]+'66';ctx.strokeStyle=colors[i%4]
      ctx.lineWidth=2;ctx.shadowBlur=6;ctx.shadowColor=colors[i%4]
      ctx.fillRect(x,baseY-curH,barW,curH);ctx.strokeRect(x,baseY-curH,barW,curH);ctx.restore()
      gText(String(n2),x+barW/2,baseY+16,colors[i%4],12,prog)
    })
    // 단계4: 평균선
    if(p>0.6){const lp=easeOutCubic((p-0.6)/0.25);const avgY=baseY-(avg/10)*maxH
      gLine(ox-8,avgY,ox+totalW2+8,avgY,GRN,2.5,lp)
      gText(`\uD3C9\uADE0 = ${avg}`,cx,avgY-14,GRN,15,lp)}
    break
  }

  case 'unit_area': {
    // E044: 넓이 단위 — 1cm²→1m² 확대
    const VIO='#534AB7',GRN='#1D9E75'
    const smallSz=Math.min(40,(W-40)/4)
    // 단계1: 1cm² 작은 정사각형
    if(p>0.05){const p1=easeOutCubic((p-0.05)/0.3)
      ctx.save();ctx.globalAlpha=p1*0.5;ctx.fillStyle=VIO+'66';ctx.strokeStyle=VIO;ctx.lineWidth=2
      ctx.fillRect(cx-smallSz/2,cy-20-smallSz/2,smallSz,smallSz);ctx.strokeRect(cx-smallSz/2,cy-20-smallSz/2,smallSz,smallSz);ctx.restore()
      gText('1cm\u00B2',cx,cy-20,VIO,14,p1);gText('1cm',cx,cy-20-smallSz/2-12,'rgba(255,255,255,0.5)',10,p1)}
    // 단계2~3: 10×10 축소 격자
    if(p>0.4){const p2=easeOutCubic((p-0.4)/0.35);const gridSz=Math.min(100,W*0.3),cellSz=gridSz/10
      const gx=cx-gridSz/2,gy=cy+30
      for(let i=0;i<=10;i++){gLine(gx+i*cellSz,gy,gx+i*cellSz,gy+gridSz,'rgba(255,255,255,0.06)',1,p2);gLine(gx,gy+i*cellSz,gx+gridSz,gy+i*cellSz,'rgba(255,255,255,0.06)',1,p2)}
      ctx.save();ctx.globalAlpha=p2*0.8;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.strokeRect(gx,gy,gridSz,gridSz);ctx.restore()
      gText('100\uCE78 = 1m\u00B2',cx,gy+gridSz+16,GRN,13,p2)}
    if(p>0.8) gText('1m\u00B2 = 10000cm\u00B2',cx,H-16,GRN,15,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'unit_volume': {
    // E045: 부피 단위 — 정육면체 쌓기
    const VIO='#534AB7',GRN='#1D9E75'
    const sz=Math.min(50,(W-40)/3)
    // 단계1: 1cm³
    if(p>0.05){const p1=easeOutCubic((p-0.05)/0.3)
      ctx.save();ctx.globalAlpha=p1*0.4;ctx.fillStyle=VIO+'66';ctx.strokeStyle=VIO;ctx.lineWidth=2
      ctx.fillRect(cx-sz/2,cy-sz/2,sz,sz);ctx.strokeRect(cx-sz/2,cy-sz/2,sz,sz);ctx.restore()
      gText('1cm\u00B3',cx,cy,VIO,14,p1)}
    // 단계2~3: 1000개 = 1L 강조
    if(p>0.45){const p2=easeOutCubic((p-0.45)/0.35)
      const gridN=5,gsz=Math.min(80,W*0.25),gcell=gsz/gridN,gx=cx-gsz/2,gy=cy+40
      for(let r2=0;r2<gridN;r2++)for(let c2=0;c2<gridN;c2++){
        ctx.save();ctx.globalAlpha=p2*0.5;ctx.fillStyle=GRN+'44';ctx.strokeStyle=GRN;ctx.lineWidth=1
        ctx.fillRect(gx+c2*gcell+1,gy+r2*gcell+1,gcell-2,gcell-2);ctx.strokeRect(gx+c2*gcell+1,gy+r2*gcell+1,gcell-2,gcell-2);ctx.restore()}
      gText('10\u00D710\u00D710',cx,gy+gsz+14,'rgba(255,255,255,0.4)',11,p2)}
    if(p>0.8) gText('1000cm\u00B3 = 1L',cx,H-16,GRN,16,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'unit_length': {
    // E046: 길이 단위 — 줌아웃
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const units=[{name:'1mm',scale:1,color:VIO},{name:'1cm = 10mm',scale:10,color:GRN},{name:'1m = 100cm',scale:100,color:ORG},{name:'1km = 1000m',scale:1000,color:'#1D9E75'}]
    const stageIdx=Math.min(3,Math.floor(p*4.5))
    units.forEach((u,i)=>{
      if(i>stageIdx) return
      const prog=easeOutCubic(Math.min(1,(p-i*0.22)/0.25))
      const y=30+i*48,barW=Math.min(W*0.6,200)*(1-i*0.15)
      const ox=cx-barW/2
      ctx.save();ctx.globalAlpha=prog*0.4;ctx.fillStyle=u.color+'55';ctx.strokeStyle=u.color;ctx.lineWidth=2
      ctx.fillRect(ox,y,barW*prog,24);ctx.strokeRect(ox,y,barW,24);ctx.restore()
      gText(u.name,cx,y+12,u.color,13,prog)
      if(i>0) gText(`\u00D7${units[i].scale/units[i-1].scale}`,ox-30,y+12,'rgba(255,255,255,0.3)',10,prog)
    })
    break
  }

  case 'unit_liquid': {
    // E047: 들이 단위 — 컵 쌓기→병
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    // 단계1: 작은 컵 (1mL)
    if(p>0.05){const p1=easeOutCubic((p-0.05)/0.25)
      ctx.save();ctx.globalAlpha=p1*0.6;ctx.fillStyle=VIO+'66';ctx.strokeStyle=VIO;ctx.lineWidth=2
      ctx.fillRect(cx-60,cy-30,20,30);ctx.strokeRect(cx-60,cy-30,20,30);ctx.restore()
      gText('1mL',cx-50,cy-40,VIO,11,p1)}
    // 단계2: 500mL 표시
    if(p>0.25){const p2=easeOutCubic((p-0.25)/0.3)
      ctx.save();ctx.globalAlpha=p2*0.5;ctx.fillStyle=GRN+'55';ctx.strokeStyle=GRN;ctx.lineWidth=2
      ctx.fillRect(cx-15,cy-40,30,50);ctx.strokeRect(cx-15,cy-40,30,50);ctx.restore()
      gText('500mL',cx,cy-50,GRN,12,p2)}
    // 단계3: 1L 병
    if(p>0.5){const p3=easeOutCubic((p-0.5)/0.3)
      ctx.save();ctx.globalAlpha=p3*0.5;ctx.fillStyle=ORG+'55';ctx.strokeStyle=ORG;ctx.lineWidth=2.5
      ctx.fillRect(cx+35,cy-50,35,65);ctx.strokeRect(cx+35,cy-50,35,65);ctx.restore()
      gText('1L',cx+52,cy-58,ORG,14,p3)}
    if(p>0.8) gText('1L = 1000mL',cx,H-16,GRN,16,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'unit_weight': {
    // E048: 무게 단위 — 저울 + 추
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    // 저울 기둥
    gLine(cx,cy+50,cx,cy-20,'rgba(255,255,255,0.3)',3,p)
    gLine(cx-80,cy+50,cx+80,cy+50,'rgba(255,255,255,0.2)',2,p)
    // 단계1: 1g 추
    if(p>0.05){const p1=easeOutCubic((p-0.05)/0.25)
      gCircle(cx-50,cy,12,VIO,true,p1*0.7);gText('1g',cx-50,cy,VIO,10,p1)}
    // 단계2: 1000g = 1kg
    if(p>0.3){const p2=easeOutCubic((p-0.3)/0.3)
      gCircle(cx,cy-10,20,GRN,true,p2*0.7);gText('1kg',cx,cy-10,GRN,12,p2)
      gText('= 1000g',cx,cy+16,'rgba(255,255,255,0.4)',10,p2)}
    // 단계3: 1000kg = 1t
    if(p>0.55){const p3=easeOutCubic((p-0.55)/0.3)
      gCircle(cx+50,cy-20,28,ORG,true,p3*0.6);gText('1t',cx+50,cy-20,ORG,14,p3)
      gText('= 1000kg',cx+50,cy+14,'rgba(255,255,255,0.4)',10,p3)}
    // 실물 예시
    if(p>0.8){const fp=easeOutCubic((p-0.8)/0.2);gText('\uC0AC\uACFC\u2248200g   \uC0AC\uB78C\u224860kg   \uCF54\uB07C\uB9AC\u22485t',cx,H-16,'rgba(255,255,255,0.4)',11,fp)}
    break
  }

  case 'possibility': {
    // E049: 가능성 — 주머니에서 공 꺼내기
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const redN=v('a',3),blueN=v('b',1),totalN=redN+blueN
    const ballR=Math.min(16,(W-80)/(totalN*3))
    // 단계1: 주머니 속 공들
    const bagX=cx,bagY=cy-20,bagW=totalN*(ballR*2+8)+20
    ctx.save();ctx.globalAlpha=p*0.15;ctx.fillStyle=WHITE
    ctx.beginPath();ctx.ellipse(bagX,bagY,bagW/2,40,0,0,Math.PI*2);ctx.fill();ctx.restore()
    ctx.save();ctx.globalAlpha=p*0.4;ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=2
    ctx.beginPath();ctx.ellipse(bagX,bagY,bagW/2,40,0,0,Math.PI*2);ctx.stroke();ctx.restore()
    for(let i=0;i<totalN;i++){
      const prog=easeOutElastic(Math.min(1,Math.max(0,p*2-i*0.12)))
      const color=i<redN?ORG:VIO
      const x=bagX-(totalN-1)*(ballR+4)/2+i*(ballR*2+8)
      gCircle(x,bagY,ballR,color,true,prog*0.85)
    }
    // 단계3~4: 확률 비교
    if(p>0.45){const fp=easeOutCubic((p-0.45)/0.35)
      const barW=W*0.5,barH=22,bx=cx-barW/2,by=cy+40
      const w1=(redN/totalN)*barW,w2=(blueN/totalN)*barW
      ctx.save();ctx.globalAlpha=fp*0.5;ctx.fillStyle=ORG+'88';ctx.fillRect(bx,by,w1,barH);ctx.restore()
      ctx.save();ctx.globalAlpha=fp;ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.strokeRect(bx,by,w1,barH);ctx.restore()
      ctx.save();ctx.globalAlpha=fp*0.5;ctx.fillStyle=VIO+'88';ctx.fillRect(bx+w1,by,w2,barH);ctx.restore()
      ctx.save();ctx.globalAlpha=fp;ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.strokeRect(bx+w1,by,w2,barH);ctx.restore()
      gText(`\uBE68\uAC04 ${redN}/${totalN}`,bx+w1/2,by+barH/2,ORG,12,fp)
      gText(`\uD30C\uB780 ${blueN}/${totalN}`,bx+w1+w2/2,by+barH/2,VIO,12,fp)}
    if(p>0.8) gText(`\uBE68\uAC04 \uACF5 \uB098\uC62C \uAC00\uB2A5\uC131 = ${redN}/${totalN} (\uB192\uB2E4)`,cx,H-16,GRN,14,easeOutCubic((p-0.8)/0.2))
    break
  }

  case 'time_clock': {
    // E050: 시각과 시간 — 아날로그 시계
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const clockR=Math.min(80,Math.min(W,H)*0.3)
    // 시계 원판
    ctx.save();ctx.globalAlpha=p*0.1;ctx.fillStyle=WHITE;ctx.beginPath();ctx.arc(cx,cy,clockR,0,Math.PI*2);ctx.fill();ctx.restore()
    ctx.save();ctx.globalAlpha=p*0.6;ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(cx,cy,clockR,0,Math.PI*2);ctx.stroke();ctx.restore()
    // 눈금 (12개)
    for(let i=0;i<12;i++){const angle=-Math.PI/2+i*Math.PI/6;const isMajor=[0,3,6,9].includes(i)
      const inner=clockR*(isMajor?0.78:0.85),outer=clockR*0.92
      gLine(cx+Math.cos(angle)*inner,cy+Math.sin(angle)*inner,cx+Math.cos(angle)*outer,cy+Math.sin(angle)*outer,'rgba(255,255,255,0.3)',isMajor?2.5:1,p)
      if(isMajor) gText(String(i===0?12:i===3?3:i===6?6:9),cx+Math.cos(angle)*clockR*0.68,cy+Math.sin(angle)*clockR*0.68,'rgba(255,255,255,0.5)',12,p)}
    // 바늘 애니메이션: 3시 → 3시30분
    const targetMin=p<0.5?0:v('m',30)*easeOutCubic((p-0.5)/0.4)
    const hourAngle=-Math.PI/2+(v('h',3)+targetMin/60)*Math.PI/6
    const minAngle=-Math.PI/2+targetMin*Math.PI/30
    // 시침
    gLine(cx,cy,cx+Math.cos(hourAngle)*clockR*0.5,cy+Math.sin(hourAngle)*clockR*0.5,VIO,4,p*0.9)
    // 분침
    gLine(cx,cy,cx+Math.cos(minAngle)*clockR*0.72,cy+Math.sin(minAngle)*clockR*0.72,GRN,2.5,p*0.9)
    // 중심점
    gCircle(cx,cy,4,ORG,true,p)
    // 시각 표시
    const displayMin=Math.round(targetMin)
    gText(`${v('h',3)}\uC2DC ${displayMin<10?'0'+displayMin:displayMin}\uBD84`,cx,cy+clockR+20,GRN,16,p)
    if(p>0.5&&p<0.9) gText(`${displayMin}\uBD84 \uC9C0\uB0A8`,cx,cy+clockR+38,'rgba(255,255,255,0.4)',12,easeOutCubic((p-0.5)/0.3))
    break
  }

    // ══════════════════════════════════════════
    // M001~M010 — 설계서 v2 기반 전용 시각화
    // ══════════════════════════════════════════

    case 'integer_calc': {
      // M001: 정수 덧셈 — 수직선 화살표 이동
      const VIO='#534AB7',GRN='#1D9E75'
      const a2=v('a',3),b2=v('b',5)
      const lineY=cy,sc=(W-60)/20,ox=cx-10*sc
      gLine(ox,lineY,ox+20*sc,lineY,'rgba(255,255,255,0.2)',2,p)
      for(let i=-10;i<=10;i++){const x=ox+(i+10)*sc;gLine(x,lineY-5,x,lineY+5,'rgba(255,255,255,0.2)',1.5,p)
        if(i%2===0) gText(String(i),x,lineY+18,'rgba(255,255,255,0.35)',10,p)}
      // 출발점 0
      gCircle(ox+10*sc,lineY,4,'rgba(255,255,255,0.5)',true,p)
      // +a 화살표 (보라)
      if(p>0.15){const ap=easeOutCubic((p-0.15)/0.3);const x0=ox+10*sc,x1=ox+(10+a2)*sc
        ctx.save();ctx.globalAlpha=ap*0.7;ctx.strokeStyle=VIO;ctx.lineWidth=3;ctx.shadowBlur=8;ctx.shadowColor=VIO
        ctx.beginPath();ctx.moveTo(x0,lineY-12);ctx.lineTo(x1,lineY-12);ctx.stroke();ctx.restore()
        gText(`+${a2}`,( x0+x1)/2,lineY-26,VIO,13,ap)}
      // +b 화살표 (초록)
      if(p>0.45){const bp=easeOutCubic((p-0.45)/0.3);const x1=ox+(10+a2)*sc,x2=ox+(10+a2+b2)*sc
        ctx.save();ctx.globalAlpha=bp*0.7;ctx.strokeStyle=GRN;ctx.lineWidth=3;ctx.shadowBlur=8;ctx.shadowColor=GRN
        ctx.beginPath();ctx.moveTo(x1,lineY-12);ctx.lineTo(x2,lineY-12);ctx.stroke();ctx.restore()
        gText(`+${b2}`,(x1+x2)/2,lineY-26,GRN,13,bp)}
      // 도착점
      if(p>0.7){const fp=easeOutCubic((p-0.7)/0.3);gCircle(ox+(10+a2+b2)*sc,lineY,6,GRN,true,fp)
        gText(`(+${a2})+(+${b2}) = +${a2+b2}`,cx,H-16,GRN,15,fp)}
      break
    }

    case 'integer_calc_sub': {
      // M002: 정수 뺄셈→덧셈 변환
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      // 단계1: 수식
      gText('(+5) - (+3)',cx,34,'rgba(255,255,255,0.6)',18,easeOutCubic(Math.min(1,p*3)))
      // 단계2: 부호 전환
      if(p>0.2){const tp=easeOutCubic((p-0.2)/0.25);gText('= (+5) + (-3)',cx,58,VIO,16,tp)
        gText('\uBD80\uD638 \uC804\uD658!',cx+120,58,ORG,12,tp*0.7)}
      // 수직선
      const lineY=cy+20,sc=(W-60)/16,ox=cx-8*sc
      if(p>0.1){gLine(ox,lineY,ox+16*sc,lineY,'rgba(255,255,255,0.15)',1.5,p)
        for(let i=-3;i<=8;i++){const x=ox+(i+3)*sc;gLine(x,lineY-4,x,lineY+4,'rgba(255,255,255,0.2)',1,p);if(i%2===0) gText(String(i),x,lineY+16,'rgba(255,255,255,0.3)',9,p)}}
      // 단계3: +5에서 왼쪽 3칸
      if(p>0.45){const mp=easeOutCubic((p-0.45)/0.35);const x5=ox+8*sc,x2=ox+5*sc
        gCircle(x5,lineY,5,VIO,true,mp*0.8)
        ctx.save();ctx.globalAlpha=mp*0.6;ctx.strokeStyle=GRN;ctx.lineWidth=3;ctx.shadowBlur=8;ctx.shadowColor=GRN
        const curX=x5+(x2-x5)*Math.min(1,mp*1.5);ctx.beginPath();ctx.moveTo(x5,lineY-10);ctx.lineTo(curX,lineY-10);ctx.stroke();ctx.restore()
        if(mp>0.8) gCircle(x2,lineY,6,GRN,true,(mp-0.8)*5)}
      if(p>0.8) gText('(+5)+(-3) = +2',cx,H-16,GRN,16,easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'integer_calc_mul': {
      // M003: 정수 곱셈 부호 규칙 — 2×2 표
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const cellSz=55,ox=cx-cellSz*1.2,oy=cy-cellSz*0.8
      const signs=[['+','+'],['+','-'],['-','+'],['-','-']]
      const results=['+','-','-','+']
      const colors=[GRN,ORG,ORG,GRN]
      // 헤더
      gText('+',ox+cellSz*0.5,oy-20,GRN,14,p);gText('-',ox+cellSz*1.5+10,oy-20,ORG,14,p)
      gText('+',ox-20,oy+cellSz*0.5,GRN,14,p);gText('-',ox-20,oy+cellSz*1.5+10,ORG,14,p)
      for(let r2=0;r2<2;r2++)for(let c2=0;c2<2;c2++){
        const idx=r2*2+c2;const prog=easeOutElastic(Math.min(1,Math.max(0,p*2.5-idx*0.3)))
        const x=ox+c2*(cellSz+10),y=oy+r2*(cellSz+10)
        ctx.save();ctx.globalAlpha=prog*0.3;ctx.fillStyle=colors[idx];ctx.fillRect(x,y,cellSz,cellSz);ctx.restore()
        ctx.save();ctx.globalAlpha=prog*0.8;ctx.strokeStyle=colors[idx];ctx.lineWidth=2;ctx.strokeRect(x,y,cellSz,cellSz);ctx.restore()
        gText(`(${signs[idx][0]})(${signs[idx][1]})=${results[idx]}`,x+cellSz/2,y+cellSz/2,colors[idx],13,prog)
      }
      if(p>0.8) gText('\uAC19\uC740 \uBD80\uD638=\uC591\uC218, \uB2E4\uB978 \uBD80\uD638=\uC74C\uC218',cx,H-16,GRN,13,easeOutCubic((p-0.8)/0.2))
      break
    }

    // M004 absolute_value — 이미 전용 구현 있음 (아래 유지)

    case 'integer_calc_rational': {
      // M005: 유리수 사칙연산 — 통분 막대
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const barW=W*0.6,barH=32,ox=cx-barW/2
      // 1/2 막대
      if(p>0.05){const p1=easeOutCubic((p-0.05)/0.25);const cellW=barW/6
        for(let i=0;i<6;i++){const filled=i<3;ctx.save();ctx.globalAlpha=p1*(filled?0.5:0.12)
          ctx.fillStyle=filled?VIO+'88':'rgba(255,255,255,0.06)';ctx.strokeStyle=filled?VIO:'rgba(255,255,255,0.1)'
          ctx.lineWidth=filled?2:1;ctx.fillRect(ox+i*cellW+1,cy-50,cellW-2,barH-2);ctx.strokeRect(ox+i*cellW+1,cy-50,cellW-2,barH-2);ctx.restore()}
        gText('1/2 = 3/6',ox-40,cy-34,VIO,12,p1)}
      // 1/3 막대
      if(p>0.25){const p2=easeOutCubic((p-0.25)/0.25);const cellW=barW/6
        for(let i=0;i<6;i++){const filled=i<2;ctx.save();ctx.globalAlpha=p2*(filled?0.5:0.12)
          ctx.fillStyle=filled?GRN+'88':'rgba(255,255,255,0.06)';ctx.strokeStyle=filled?GRN:'rgba(255,255,255,0.1)'
          ctx.lineWidth=filled?2:1;ctx.fillRect(ox+i*cellW+1,cy-10,cellW-2,barH-2);ctx.strokeRect(ox+i*cellW+1,cy-10,cellW-2,barH-2);ctx.restore()}
        gText('1/3 = 2/6',ox-40,cy+6,GRN,12,p2)}
      // 합산 = 5/6
      if(p>0.55){const p3=easeOutCubic((p-0.55)/0.3);const cellW=barW/6
        for(let i=0;i<6;i++){const filled=i<5;ctx.save();ctx.globalAlpha=p3*(filled?0.6:0.12)
          ctx.fillStyle=filled?ORG+'88':'rgba(255,255,255,0.06)';ctx.strokeStyle=filled?ORG:'rgba(255,255,255,0.1)'
          ctx.lineWidth=filled?2.5:1;ctx.fillRect(ox+i*cellW+1,cy+38,cellW-2,barH-2);ctx.strokeRect(ox+i*cellW+1,cy+38,cellW-2,barH-2);ctx.restore()}
        gText('= 5/6',ox-40,cy+54,ORG,13,p3)}
      if(p>0.85) gText('1/2 + 1/3 = 3/6 + 2/6 = 5/6',cx,H-16,ORG,14,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'recurring_decimal': {
      // M006: 유한소수와 순환소수
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      // 1÷3 = 0.333...
      if(p>0.05){const p1=easeOutCubic((p-0.05)/0.3)
        gText('1 \u00F7 3 = ?',cx,40,'rgba(255,255,255,0.6)',18,p1)}
      if(p>0.2){const p2=easeOutCubic((p-0.2)/0.35)
        const digits='0.333333...'
        const showLen=Math.min(digits.length,Math.floor(p2*digits.length)+1)
        gText(digits.substring(0,showLen),cx,cy-20,VIO,22,p2)
        if(showLen>=6) gText('\uBC18\uBCF5!',cx+100,cy-20,ORG,14,p2*0.8)}
      if(p>0.55){const p3=easeOutCubic((p-0.55)/0.25)
        gText('\u2192 0.\u0307{3} (\uC21C\uD658\uC18C\uC218)',cx,cy+20,ORG,16,p3)}
      // 비교: 유한소수
      if(p>0.7){const p4=easeOutCubic((p-0.7)/0.25)
        gText('1 \u00F7 4 = 0.25 (\uC720\uD55C\uC18C\uC218)',cx,cy+55,GRN,14,p4)}
      if(p>0.9) gText('\uBD84\uBAA8 = 2\u207F\u00D75\u207A \u2192 \uC720\uD55C, \uC544\uB2C8\uBA74 \uC21C\uD658',cx,H-16,VIO,12,easeOutCubic((p-0.9)/0.1))
      break
    }

    // M007 exponent_viz — 이미 전용 구현 있음 (아래 유지)

    case 'exponent_div': {
      // M008: 지수법칙 나눗셈 — 블록 소거
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const expN=v('expN',5),expD=v('expD',2),expR=expN-expD
      const bsz=28,gap2=6
      // 단계1: 2^expN 블록 expN개
      for(let i=0;i<expN;i++){const prog=easeOutElastic(Math.min(1,Math.max(0,p*2.5-i*0.1)));const x=cx-(expN/2)*(bsz+gap2)+i*(bsz+gap2)
        const isCancel=i>=expR&&p>0.4;const cancelP=isCancel?easeOutCubic(Math.min(1,(p-0.4)*3)):0
        ctx.save();ctx.globalAlpha=prog*(1-cancelP*0.7);ctx.fillStyle=(isCancel?ORG:VIO)+'55';ctx.strokeStyle=isCancel?ORG:VIO
        ctx.lineWidth=2;ctx.fillRect(x,cy-40,bsz,bsz);ctx.strokeRect(x,cy-40,bsz,bsz);ctx.restore()
        gText('2',x+bsz/2,cy-40+bsz/2,isCancel?ORG:VIO,12,prog*(1-cancelP*0.5))
        if(isCancel&&cancelP>0.3) gText('\u2716',x+bsz/2,cy-40+bsz/2,ORG,16,cancelP)}
      gText(`2\u2075`,cx,cy-40-18,'rgba(255,255,255,0.5)',14,p)
      // 단계2: 2^expD 소거
      if(p>0.3){const sp=easeOutCubic((p-0.3)/0.2);gText(`\u00F7 2\u00B2`,cx+90,cy-40+bsz/2,ORG,14,sp)}
      // 단계3: 남은 expR개 = 2^expR
      if(p>0.6){const rp=easeOutCubic((p-0.6)/0.25)
        for(let i=0;i<expR;i++){const x=cx-(expR/2)*(bsz+gap2)+i*(bsz+gap2)
          ctx.save();ctx.globalAlpha=rp*0.7;ctx.fillStyle=GRN+'55';ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=GRN
          ctx.fillRect(x,cy+20,bsz,bsz);ctx.strokeRect(x,cy+20,bsz,bsz);ctx.restore()
          gText('2',x+bsz/2,cy+20+bsz/2,GRN,12,rp)}
        gText(`= 2\u00B3`,cx+80,cy+20+bsz/2,GRN,16,rp)}
      if(p>0.85) gText(`\uC9C0\uC218 ${expN}-${expD}=${expR}`,cx,H-16,GRN,15,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'exponent_power': {
      // M009: 거듭제곱의 거듭제곱 — cols개×rows줄
      const VIO='#534AB7',GRN='#1D9E75'
      const epCols=v('epCols',3),epRows=v('epRows',2),epTotal=epCols*epRows
      const bsz=24,gap2=5
      // (2^epCols)^epRows → 블록 epCols개 × epRows줄
      gText('(2\u00B3)\u00B2',cx,30,'rgba(255,255,255,0.6)',18,easeOutCubic(Math.min(1,p*3)))
      for(let row=0;row<epRows;row++){
        const rowP=easeOutCubic(Math.min(1,Math.max(0,p*2.5-row*0.4)))
        for(let col=0;col<epCols;col++){const prog=rowP*easeOutElastic(Math.min(1,Math.max(0,rowP*2-col*0.15)))
          const x=cx-(epCols/2)*(bsz+gap2)+col*(bsz+gap2),y=cy-20+row*(bsz+gap2)
          ctx.save();ctx.globalAlpha=prog*0.7;ctx.fillStyle=VIO+'55';ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.shadowBlur=5;ctx.shadowColor=VIO
          ctx.fillRect(x,y,bsz,bsz);ctx.strokeRect(x,y,bsz,bsz);ctx.restore()
          gText('2',x+bsz/2,y+bsz/2,VIO,11,prog)}
        gText(`${row+1}\uC904`,cx+(epCols/2-0.5)*(bsz+gap2)+16,cy-20+row*(bsz+gap2)+bsz/2,'rgba(255,255,255,0.3)',10,rowP)
      }
      if(p>0.7){const fp=easeOutCubic((p-0.7)/0.25);gText(`${epCols}\uAC1C \u00D7 ${epRows}\uC904 = ${epTotal}\uAC1C \u2192 2\u2076`,cx,cy+50,GRN,16,fp)}
      if(p>0.85) gText(`\uC9C0\uC218 ${epCols}\u00D7${epRows}=${epTotal}`,cx,H-16,GRN,15,easeOutCubic((p-0.85)/0.15))
      break
    }

    // ══════════════════════════════════════════
    // 기존 중등 전용 시각화 (유지)
    // ══════════════════════════════════════════

    case 'prime_factorization': {
      // 소인수분해 나무 (예: 12 = 2² × 3)
      const n = v('n', 12)
      const nodes = [{v:n,x:cx,y:40,leaf:false}]
      let cur = n, yy = 40
      const factors: number[] = []
      let temp = cur
      for (const pr of [2,3,5,7,11,13]) { while (temp % pr === 0) { factors.push(pr); temp /= pr } }
      if (temp > 1) factors.push(temp)

      const nodeR = 18, yGap = 48
      factors.forEach((f, i) => {
        const prog = easeOutElastic(Math.min(1, Math.max(0, p * 1.8 - i * 0.15)))
        const ny = 55 + i * yGap
        const lx = cx - 40 - i * 8, rx = cx + 40 + i * 8
        // 소수 노드
        gCircle(lx, ny, nodeR * prog, MINT, true, prog * 0.8)
        gText(String(f), lx, ny, '#000', 13, prog)
        // 나머지 노드
        cur = Math.round(cur / f)
        if (cur > 1) {
          gCircle(rx, ny, nodeR * prog, PURPLE, true, prog * 0.7)
          gText(String(cur), rx, ny, '#000', 13, prog)
        }
        // 연결선
        if (i === 0) gLine(cx, 55, lx, ny - nodeR, 'rgba(255,255,255,0.2)', 1.5, prog)
        if (i > 0) { gLine(cx + 40 + (i-1)*8, 55+(i-1)*yGap+nodeR, lx, ny-nodeR, 'rgba(255,255,255,0.15)', 1, prog); gLine(cx+40+(i-1)*8, 55+(i-1)*yGap+nodeR, rx, ny-nodeR, 'rgba(255,255,255,0.15)', 1, prog) }
      })
      gCircle(cx, 38, nodeR, AMBER, true, p)
      gText(String(n), cx, 38, '#000', 14, p)
      if (p > 0.8) gText(`${n} = ${factors.join(' \u00D7 ')}`, cx, H - 20, MINT, 14, easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'number_line_int': {
      const lineY2 = cy
      const sc = (W - 80) / 14, ox2 = cx - 7 * sc
      gLine(30, lineY2, W-30, lineY2, 'rgba(255,255,255,0.2)', 2, p)
      for (let i = -7; i <= 7; i++) {
        const x = ox2 + (i+7) * sc
        const prog = easeOutCubic(Math.min(1, p * 2))
        gLine(x, lineY2-6, x, lineY2+6, 'rgba(255,255,255,0.3)', 1.5, prog)
        gText(String(i), x, lineY2+18, i < 0 ? PURPLE : i > 0 ? MINT : AMBER, 10, prog)
      }
      gCircle(ox2 + 7*sc, lineY2, 5, AMBER, true, p)
      gText('0', ox2 + 7*sc, lineY2 - 18, AMBER, 13, p)
      if (p > 0.5) { gText('\u2190 \uC74C\uC218', ox2 + 2*sc, lineY2-28, PURPLE, 12, easeOutCubic((p-0.5)/0.5)); gText('\uC591\uC218 \u2192', ox2 + 12*sc, lineY2-28, MINT, 12, easeOutCubic((p-0.5)/0.5)) }
      break
    }

    case 'absolute_value': {
      const val = v('a', -5)
      const lineY3 = cy, sc2 = (W-80)/14, ox3 = cx-7*sc2
      gLine(30, lineY3, W-30, lineY3, 'rgba(255,255,255,0.2)', 2, p)
      for (let i=-7;i<=7;i++) { const x=ox3+(i+7)*sc2; gLine(x,lineY3-5,x,lineY3+5,'rgba(255,255,255,0.25)',1,p); if(i%2===0) gText(String(i),x,lineY3+16,'rgba(255,255,255,0.35)',9,p) }
      if (p > 0.3) {
        const ap=easeOutCubic((p-0.3)/0.4), vx=ox3+(val+7)*sc2, zx=ox3+7*sc2
        gCircle(vx, lineY3, 6, PURPLE, true, ap)
        gText(String(val), vx, lineY3-22, PURPLE, 13, ap)
        gLine(Math.min(vx,zx), lineY3-3, Math.max(vx,zx), lineY3-3, AMBER, 3, ap)
        gText(`|${val}| = ${Math.abs(val)}`, cx, lineY3+38, MINT, 16, ap)
      }
      break
    }

    // ══════════════════════════════════════════
    // M011~M024 — 설계서 v2 기반 전용 시각화
    // ══════════════════════════════════════════

    case 'square_root_viz': {
      // M011: 제곱근 — 넓이→한 변
      const VIO='#534AB7',GRN='#1D9E75'
      const area=v('a',9),side=Math.sqrt(area)
      const sz=Math.min(100,Math.min(W-60,H-60)/1.5)
      const gridN=Math.round(side),cellSz=sz/gridN,ox=cx-sz/2,oy=cy-sz/2-5
      // 격자
      for(let r2=0;r2<gridN;r2++)for(let c2=0;c2<gridN;c2++){
        const prog=easeOutElastic(Math.min(1,Math.max(0,p*2-(r2*gridN+c2)/(gridN*gridN)*0.5)))
        ctx.save();ctx.globalAlpha=prog*0.5;ctx.fillStyle=VIO+'55';ctx.strokeStyle=VIO;ctx.lineWidth=1.5
        ctx.fillRect(ox+c2*cellSz+1,oy+r2*cellSz+1,cellSz-2,cellSz-2);ctx.strokeRect(ox+c2*cellSz+1,oy+r2*cellSz+1,cellSz-2,cellSz-2);ctx.restore()}
      gText(`\uB113\uC774 = ${area}`,cx,oy+sz/2,'rgba(255,255,255,0.5)',13,p)
      if(p>0.5){const fp=easeOutCubic((p-0.5)/0.4)
        gLine(ox,oy+sz+6,ox+sz,oy+sz+6,GRN,2.5,fp);gText(`\uD55C \uBCC0 = ${r(side)} = \u221A${area}`,cx,oy+sz+22,GRN,16,fp)}
      break
    }

    case 'square_root_property': {
      // M012: √(a×b) = √a × √b
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      gText('\u221A(2\u00D73) = \u221A6',cx,40,VIO,18,easeOutCubic(Math.min(1,p*3)))
      if(p>0.25){const p2=easeOutCubic((p-0.25)/0.3);gText('\u221A2 \u00D7 \u221A3',cx,cy-10,GRN,18,p2)}
      // 수직선 비교
      if(p>0.5){const p3=easeOutCubic((p-0.5)/0.35);const sc=(W-80)/4,ox=cx-2*sc
        gLine(ox,cy+30,ox+4*sc,cy+30,'rgba(255,255,255,0.15)',1.5,p3)
        const v6=Math.sqrt(6),v2=Math.sqrt(2),v3=Math.sqrt(3)
        gCircle(ox+v6*sc,cy+30,6,VIO,true,p3);gText(`\u221A6\u2248${r(v6)}`,ox+v6*sc,cy+48,VIO,11,p3)
        gCircle(ox+v2*sc,cy+30,5,GRN,true,p3*0.7);gText(`\u221A2\u2248${r(v2)}`,ox+v2*sc,cy+14,GRN,10,p3)
        gCircle(ox+v3*sc,cy+30,5,ORG,true,p3*0.7);gText(`\u221A3\u2248${r(v3)}`,ox+v3*sc,cy+14,ORG,10,p3)}
      if(p>0.85) gText('\uAC19\uC740 \uAC12!',cx,H-16,GRN,16,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'square_root_add': {
      // M013: 동류항 묶기 a√2+b√2=(a+b)√2
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sqA=v('sqA',3),sqB=v('sqB',5),sqSum=sqA+sqB
      const bsz=22,gap2=4
      // sqA개 묶음 (보라)
      if(p>0.05){const p1=easeOutCubic((p-0.05)/0.3)
        for(let i=0;i<sqA;i++){const x=cx-120+i*(bsz+gap2);ctx.save();ctx.globalAlpha=p1*0.7;ctx.fillStyle=VIO+'55';ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.fillRect(x,cy-15,bsz,bsz);ctx.strokeRect(x,cy-15,bsz,bsz);ctx.restore();gText('\u221A2',x+bsz/2,cy-15+bsz/2,VIO,9,p1)}
        gText(`${sqA}\u221A2`,cx-120+(sqA/2)*(bsz+gap2),cy-34,VIO,14,p1)}
      gText('+',cx-30,cy-3,'rgba(255,255,255,0.5)',18,p)
      // sqB개 묶음 (초록)
      if(p>0.2){const p2=easeOutCubic((p-0.2)/0.3)
        for(let i=0;i<sqB;i++){const x=cx+10+i*(bsz+gap2);ctx.save();ctx.globalAlpha=p2*0.7;ctx.fillStyle=GRN+'55';ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.fillRect(x,cy-15,bsz,bsz);ctx.strokeRect(x,cy-15,bsz,bsz);ctx.restore();gText('\u221A2',x+bsz/2,cy-15+bsz/2,GRN,9,p2)}
        gText(`${sqB}\u221A2`,cx+10+(sqB/2)*(bsz+gap2),cy-34,GRN,14,p2)}
      // 합산 결과
      if(p>0.6){const fp=easeOutCubic((p-0.6)/0.35)
        for(let i=0;i<sqSum;i++){const x=cx-(sqSum/2)*(bsz+gap2)+i*(bsz+gap2);ctx.save();ctx.globalAlpha=fp*0.6;ctx.fillStyle=ORG+'55';ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.fillRect(x,cy+30,bsz,bsz);ctx.strokeRect(x,cy+30,bsz,bsz);ctx.restore()}}
      if(p>0.8) gText(`= ${sqSum}\u221A2`,cx,cy+30+bsz+16,ORG,18,easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'rationalize': {
      // M014: 분모의 유리화
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const steps: {text:string,color:string,note?:string}[] = [
        {text:'1/\u221A2',color:WHITE},
        {text:'\u00D7 \u221A2/\u221A2',color:VIO,note:'\uBD84\uC790\uBD84\uBAA8\uC5D0 \u221A2 \uACF1\uD558\uAE30'},
        {text:'= \u221A2 / (\u221A2\u00D7\u221A2)',color:GRN},
        {text:'= \u221A2 / 2',color:ORG},
      ]
      steps.forEach((s,i)=>{const prog=easeOutCubic(Math.min(1,Math.max(0,p*2.5-i*0.4)));const y=cy-55+i*34
        gText(s.text,cx,y,s.color,i===0?22:17,prog)
        if(s.note&&prog>0.3) gText(s.note,cx,y+16,'rgba(255,255,255,0.3)',11,prog*0.7)})
      if(p>0.9) gText('\uBD84\uBAA8\uC5D0 \uB8E8\uD2B8 \uC5C6\uC560\uAE30!',cx,H-16,GRN,14,easeOutCubic((p-0.9)/0.1))
      break
    }

    case 'polynomial_mul': {
      // M015: 단항식 곱셈 cx₁·x^e₁ × cx₂·x^e₂
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const pmC1=v('pmC1',3),pmC2=v('pmC2',2),pmE1=v('pmE1',2),pmE2=v('pmE2',3)
      const pmCR=pmC1*pmC2,pmER=pmE1+pmE2
      gText(`${pmC1}x\u00B2 \u00D7 ${pmC2}x\u00B3`,cx,36,'rgba(255,255,255,0.6)',20,easeOutCubic(Math.min(1,p*3)))
      if(p>0.2){const p2=easeOutCubic((p-0.2)/0.3)
        gText(`\uACC4\uC218: ${pmC1}\u00D7${pmC2} = ${pmCR}`,cx-60,cy-10,VIO,14,p2)
        gText(`\uBB38\uC790: x\u00B2\u00D7x\u00B3 = x\u2075`,cx+60,cy-10,GRN,14,p2)}
      if(p>0.55){const p3=easeOutCubic((p-0.55)/0.25)
        // 시각: 블록 pmE1+pmE2=pmER개
        for(let i=0;i<pmER;i++){const x=cx-(pmER/2)*30+i*30;const color=i<pmE1?VIO:GRN
          ctx.save();ctx.globalAlpha=p3*0.6;ctx.fillStyle=color+'55';ctx.strokeStyle=color;ctx.lineWidth=2
          ctx.fillRect(x,cy+20,26,26);ctx.strokeRect(x,cy+20,26,26);ctx.restore()
          gText('x',x+13,cy+33,color,11,p3)}}
      if(p>0.8) gText(`= ${pmCR}x\u2075`,cx,H-16,ORG,20,easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'linear_expr': {
      // M016: 동류항 정리
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      gText('3x + 2 + 5x - 1',cx,34,'rgba(255,255,255,0.6)',18,easeOutCubic(Math.min(1,p*3)))
      if(p>0.2){const p2=easeOutCubic((p-0.2)/0.3)
        gText('x\uD56D \uBAA8\uC73C\uAE30: 3x+5x = 8x',cx,cy-15,VIO,14,p2)}
      if(p>0.45){const p3=easeOutCubic((p-0.45)/0.3)
        gText('\uC0C1\uC218\uD56D \uBAA8\uC73C\uAE30: 2+(-1) = 1',cx,cy+15,GRN,14,p3)}
      if(p>0.75) gText('= 8x + 1',cx,cy+50,ORG,22,easeOutCubic((p-0.75)/0.25))
      break
    }

    case 'linear_eq_viz': case 'equation_balance': {
      // M017: 일차방정식 — 천칭 저울
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const step=p<0.35?0:p<0.65?1:2
      const eqs=[['2x+3','7'],['2x','4'],['x','2']]
      const notes=['','\uC591\uCABD -3','\uC591\uCABD \u00F72']
      const poleX=cx,poleY=cy+50,poleH=65
      gLine(poleX,poleY,poleX,poleY-poleH,'rgba(255,255,255,0.3)',3,p)
      const tilt=step===2?0:(2-step)*8
      const lx=poleX-90,rx=poleX+90,ly=poleY-poleH+tilt,ry=poleY-poleH-tilt
      if(p>0.05){const ap=easeOutCubic((p-0.05)/0.2)
        gLine(lx,ly,rx,ry,'rgba(255,255,255,0.5)',2.5,ap)
        gLine(lx,ly,lx,ly+22,'rgba(255,255,255,0.2)',1.5,ap);gLine(lx-22,ly+22,lx+22,ly+22,VIO,3,ap)
        gLine(rx,ry,rx,ry+22,'rgba(255,255,255,0.2)',1.5,ap);gLine(rx-22,ry+22,rx+22,ry+22,GRN,3,ap)}
      const ep=easeOutCubic(Math.min(1,Math.max(0,(p-(step===0?0.1:step===1?0.38:0.68))/0.25)))
      gText(eqs[step][0],lx,ly+14,VIO,16,ep);gText(eqs[step][1],rx,ry+14,GRN,18,ep)
      if(notes[step]) gText(notes[step],cx,poleY+18,ORG,12,ep*0.7)
      if(step===2&&ep>0.5) gText('x = 2',cx,H-16,GRN,18,easeOutCubic((ep-0.5)/0.5))
      break
    }

    case 'binomial_sq_plus': {
      // M018: (a+b)² 넓이 모델
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const a5=v('a',3),b5=v('b',2),tot=a5+b5
      const sc=Math.min(26,(Math.min(W,H)-50)/tot),ox=cx-tot*sc/2,oy=cy-tot*sc/2-5
      const p1=easeOutCubic(Math.min(1,p*2.5))
      ctx.save();ctx.globalAlpha=p1*0.25;ctx.fillStyle=VIO;ctx.fillRect(ox,oy,a5*sc,a5*sc);ctx.restore()
      ctx.save();ctx.globalAlpha=p1;ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.strokeRect(ox,oy,a5*sc,a5*sc);ctx.restore()
      if(p1>0.3) gText('a\u00B2',ox+a5*sc/2,oy+a5*sc/2,VIO,14,p1)
      const p2=easeOutCubic(Math.max(0,Math.min(1,(p-0.25)*2.5)))
      ctx.save();ctx.globalAlpha=p2*0.2;ctx.fillStyle=ORG;ctx.fillRect(ox+a5*sc,oy,b5*sc,a5*sc);ctx.fillRect(ox,oy+a5*sc,a5*sc,b5*sc);ctx.restore()
      if(p2>0.3){gText('ab',ox+a5*sc+b5*sc/2,oy+a5*sc/2,ORG,12,p2);gText('ab',ox+a5*sc/2,oy+a5*sc+b5*sc/2,ORG,12,p2)}
      const p3=easeOutCubic(Math.max(0,Math.min(1,(p-0.5)*2.5)))
      ctx.save();ctx.globalAlpha=p3*0.25;ctx.fillStyle=GRN;ctx.fillRect(ox+a5*sc,oy+a5*sc,b5*sc,b5*sc);ctx.restore()
      ctx.save();ctx.globalAlpha=p3;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.strokeRect(ox+a5*sc,oy+a5*sc,b5*sc,b5*sc);ctx.restore()
      if(p3>0.3) gText('b\u00B2',ox+a5*sc+b5*sc/2,oy+a5*sc+b5*sc/2,GRN,14,p3)
      if(p>0.75){const fp=easeOutCubic((p-0.75)/0.25);ctx.save();ctx.globalAlpha=fp;ctx.strokeStyle=WHITE;ctx.lineWidth=2.5;ctx.strokeRect(ox,oy,tot*sc,tot*sc);ctx.restore()
        gText('(a+b)\u00B2 = a\u00B2+2ab+b\u00B2',cx,H-16,GRN,14,fp)}
      break
    }

    case 'binomial_sq_minus': {
      // M019: (a-b)² — a²에서 빼기
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      gText('(a-b)\u00B2 = a\u00B2 - 2ab + b\u00B2',cx,34,VIO,16,easeOutCubic(Math.min(1,p*3)))
      const sz=Math.min(100,W*0.3),ox=cx-sz/2,oy=cy-sz/2
      // a² 전체
      if(p>0.1){const p1=easeOutCubic((p-0.1)/0.25);ctx.save();ctx.globalAlpha=p1*0.3;ctx.fillStyle=VIO;ctx.fillRect(ox,oy,sz,sz);ctx.restore()
        ctx.save();ctx.globalAlpha=p1;ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.strokeRect(ox,oy,sz,sz);ctx.restore();gText('a\u00B2',cx,cy,VIO,14,p1)}
      // -ab 2줄
      if(p>0.35){const p2=easeOutCubic((p-0.35)/0.25);ctx.save();ctx.globalAlpha=p2*0.4;ctx.fillStyle=ORG
        ctx.fillRect(ox+sz*0.6,oy,sz*0.4,sz);ctx.fillRect(ox,oy+sz*0.6,sz*0.6,sz*0.4);ctx.restore()
        gText('-2ab',cx+sz*0.4,cy-sz*0.3,ORG,12,p2)}
      // +b² 다시 더하기
      if(p>0.6){const p3=easeOutCubic((p-0.6)/0.25);ctx.save();ctx.globalAlpha=p3*0.4;ctx.fillStyle=GRN
        ctx.fillRect(ox+sz*0.6,oy+sz*0.6,sz*0.4,sz*0.4);ctx.restore();gText('+b\u00B2',cx+sz*0.35,cy+sz*0.35,GRN,12,p3)}
      if(p>0.85) gText('(a-b)\u00B2 = a\u00B2-2ab+b\u00B2',cx,H-16,GRN,14,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'diff_of_squares': {
      // M020: a²-b² = (a+b)(a-b)
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sz=Math.min(90,W*0.25),bsz=sz*0.4,ox=cx-sz/2,oy=cy-sz/2-5
      // a² 정사각형
      if(p>0.05){const p1=easeOutCubic((p-0.05)/0.25);ctx.save();ctx.globalAlpha=p1*0.3;ctx.fillStyle=VIO;ctx.fillRect(ox,oy,sz,sz);ctx.restore()
        ctx.save();ctx.globalAlpha=p1;ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.strokeRect(ox,oy,sz,sz);ctx.restore();gText('a\u00B2',cx,cy,VIO,14,p1)}
      // b² 제거
      if(p>0.3){const p2=easeOutCubic((p-0.3)/0.25);ctx.save();ctx.globalAlpha=p2*0.5;ctx.fillStyle=ORG
        ctx.fillRect(ox+sz-bsz,oy+sz-bsz,bsz,bsz);ctx.restore();gText('-b\u00B2',ox+sz-bsz/2,oy+sz-bsz/2,ORG,12,p2)}
      // L자 → (a+b)(a-b)
      if(p>0.6){const fp=easeOutCubic((p-0.6)/0.3);gText('L\uC790 \u2192 \uC7AC\uBC30\uCE58',cx,oy+sz+16,'rgba(255,255,255,0.4)',12,fp)}
      if(p>0.8) gText('a\u00B2-b\u00B2 = (a+b)(a-b)',cx,H-16,GRN,15,easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'binomial_product': {
      // M021: (x+a)(x+b) 넓이 4칸
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sz=Math.min(80,W*0.2),ox=cx-sz,oy=cy-sz/2-5
      const labels=[['x\u00B2','ax'],['bx','ab']],colors=[[VIO,ORG],[GRN,ORG]]
      for(let r2=0;r2<2;r2++)for(let c2=0;c2<2;c2++){
        const idx=r2*2+c2;const prog=easeOutElastic(Math.min(1,Math.max(0,p*2.5-idx*0.2)))
        const x=ox+c2*sz,y=oy+r2*(sz*0.6)
        ctx.save();ctx.globalAlpha=prog*0.25;ctx.fillStyle=colors[r2][c2];ctx.fillRect(x,y,sz,sz*0.6);ctx.restore()
        ctx.save();ctx.globalAlpha=prog*0.8;ctx.strokeStyle=colors[r2][c2];ctx.lineWidth=2;ctx.strokeRect(x,y,sz,sz*0.6);ctx.restore()
        gText(labels[r2][c2],x+sz/2,y+sz*0.3,colors[r2][c2],13,prog)}
      if(p>0.75) gText('(x+a)(x+b) = x\u00B2+(a+b)x+ab',cx,H-16,GRN,13,easeOutCubic((p-0.75)/0.25))
      break
    }

    case 'factorization_common': {
      // M022: 공통인수 묶기 6x²+3x = 3x(2x+1)
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      gText('6x\u00B2 + 3x',cx,34,'rgba(255,255,255,0.6)',20,easeOutCubic(Math.min(1,p*3)))
      if(p>0.2){const p2=easeOutCubic((p-0.2)/0.3);gText('\uACF5\uD1B5\uC778\uC218 3x \uBE60\uC9D0!',cx,cy-20,VIO,14,p2)}
      if(p>0.45){const p3=easeOutCubic((p-0.45)/0.3)
        // 3x 박스
        ctx.save();ctx.globalAlpha=p3*0.4;ctx.fillStyle=VIO+'66';ctx.strokeStyle=VIO;ctx.lineWidth=2.5
        ctx.fillRect(cx-80,cy+5,50,30);ctx.strokeRect(cx-80,cy+5,50,30);ctx.restore();gText('3x',cx-55,cy+20,VIO,14,p3)
        // (2x+1) 박스
        ctx.save();ctx.globalAlpha=p3*0.4;ctx.fillStyle=GRN+'66';ctx.strokeStyle=GRN;ctx.lineWidth=2.5
        ctx.fillRect(cx+10,cy+5,80,30);ctx.strokeRect(cx+10,cy+5,80,30);ctx.restore();gText('(2x+1)',cx+50,cy+20,GRN,14,p3)}
      if(p>0.8) gText('= 3x(2x+1)',cx,H-16,ORG,18,easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'factorization_perfect': {
      // M023: 완전제곱식 → (a+b)²
      const VIO='#534AB7',GRN='#1D9E75'
      gText('a\u00B2 + 2ab + b\u00B2',cx,34,'rgba(255,255,255,0.6)',18,easeOutCubic(Math.min(1,p*3)))
      // 4칸 → 정사각형
      const sz=Math.min(70,W*0.18)
      if(p>0.2){const p2=easeOutCubic((p-0.2)/0.35);const ox=cx-sz,oy=cy-sz/2
        ctx.save();ctx.globalAlpha=p2*0.25;ctx.fillStyle=VIO;ctx.fillRect(ox,oy,sz,sz);ctx.restore()
        ctx.save();ctx.globalAlpha=p2*0.15;ctx.fillStyle=GRN;ctx.fillRect(ox+sz,oy,sz,sz);ctx.restore()
        ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.strokeRect(ox,oy,sz*2,sz);ctx.restore()
        gText('4\uCE78 \u2192 \uC815\uC0AC\uAC01\uD615',cx,oy+sz+16,'rgba(255,255,255,0.4)',12,p2)}
      if(p>0.7) gText('= (a+b)\u00B2',cx,H-16,GRN,20,easeOutCubic((p-0.7)/0.3))
      break
    }

    case 'factorization_diff': case 'factorization_viz': {
      // M024: 합차 인수분해 L자→재배열
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      gText('a\u00B2 - b\u00B2',cx,34,'rgba(255,255,255,0.6)',18,easeOutCubic(Math.min(1,p*3)))
      if(p>0.2){const p2=easeOutCubic((p-0.2)/0.3);gText('L\uC790 \uBAA8\uC591 \u2192 \uC7AC\uBC30\uCE58',cx,cy,'rgba(255,255,255,0.4)',14,p2)}
      if(p>0.5){const p3=easeOutCubic((p-0.5)/0.3)
        // (a+b) × (a-b) 직사각형
        const rw=Math.min(160,W*0.4),rh=Math.min(50,H*0.2)
        ctx.save();ctx.globalAlpha=p3*0.3;ctx.fillStyle=GRN;ctx.fillRect(cx-rw/2,cy+20,rw,rh);ctx.restore()
        ctx.save();ctx.globalAlpha=p3;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.strokeRect(cx-rw/2,cy+20,rw,rh);ctx.restore()
        gText('(a+b)',cx,cy+20+rh+14,GRN,12,p3);gText('(a-b)',cx-rw/2-24,cy+20+rh/2,VIO,12,p3)}
      if(p>0.8) gText('= (a+b)(a-b)',cx,H-16,ORG,18,easeOutCubic((p-0.8)/0.2))
      break
    }

    // ══════════════════════════════════════════
    // M025~M044 — 설계서 v2 기반 전용 시각화
    // ══════════════════════════════════════════

    case 'simultaneous_eq': {
      // M025: 연립방정식 가감법 — 두 직선 교점
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sc=28;gLine(30,cy,W-30,cy,'rgba(255,255,255,0.12)',1,p);gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      if(p>0.1){const lp=easeOutCubic((p-0.1)/0.4);ctx.save();ctx.globalAlpha=lp;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=VIO;ctx.beginPath();ctx.moveTo(cx-4*sc,cy+2*sc);ctx.lineTo(cx+4*sc,cy-2*sc);ctx.stroke();ctx.restore();gText('x+y=4',W-60,cy-3*sc,VIO,12,lp)}
      if(p>0.3){const lp2=easeOutCubic((p-0.3)/0.4);ctx.save();ctx.globalAlpha=lp2;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=GRN;ctx.beginPath();ctx.moveTo(cx-4*sc,cy-sc);ctx.lineTo(cx+4*sc,cy+3*sc);ctx.stroke();ctx.restore();gText('x-y=0',W-60,cy+2*sc,GRN,12,lp2)}
      if(p>0.55){const ip=easeOutElastic(Math.min(1,(p-0.55)/0.35));gCircle(cx+2*sc,cy-sc,7,ORG,true,ip);gText('(2, 2)',cx+2*sc+20,cy-sc-12,ORG,14,ip)}
      if(p>0.8){const fp=easeOutCubic((p-0.8)/0.2);gText('\uC2DD \uB354\uD558\uAE30 \u2192 2x=4 \u2192 x=2',cx,28,ORG,12,fp)}
      break
    }

    case 'simultaneous_sub': {
      // M026: 연립방정식 대입법
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const steps=[{t:'y = 2x',c:VIO},{t:'x + 2x = 6',c:GRN,n:'y \uB300\uC785'},{t:'3x = 6 \u2192 x = 2',c:ORG},{t:'y = 2\u00D72 = 4',c:ORG}]
      steps.forEach((s,i)=>{const prog=easeOutCubic(Math.min(1,Math.max(0,p*2.5-i*0.4)));gText(s.t,cx,cy-50+i*32,s.c,i===0?18:15,prog);if(s.n&&prog>0.3) gText(s.n,cx+100,cy-50+i*32,'rgba(255,255,255,0.3)',11,prog*0.7)})
      if(p>0.85) gText('x=2, y=4',cx,H-16,ORG,18,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'quadratic_eq_factor': {
      // M027: 이차방정식 인수분해 — 포물선 교점
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const r1=v('r1',2),r2=v('r2',3)
      const sc2=30,scY=16,baseY=cy+40
      const qb=-(r1+r2),qc=r1*r2,mid=(r1+r2)/2
      gLine(30,baseY,W-30,baseY,'rgba(255,255,255,0.12)',1,p);gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      gText(`x\u00B2${qb<0?'':'+'}${qb}x${qc<0?'':'+'}${qc}=0`,cx,28,'rgba(255,255,255,0.5)',16,easeOutCubic(Math.min(1,p*3)))
      if(p>0.15){const cp=easeOutCubic((p-0.15)/0.5);ctx.save();ctx.globalAlpha=cp;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=VIO;ctx.beginPath();let st=false;for(let x=mid-3.5;x<=mid+3.5;x+=0.05){const y2=x*x+qb*x+qc;const sx=cx+(x-mid)*sc2,sy=baseY-y2*scY;if(sy<20||sy>H-20){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()}
      if(p>0.55){const rp=easeOutElastic(Math.min(1,(p-0.55)/0.3));gCircle(cx+(r1-mid)*sc2,baseY,6,ORG,true,rp);gCircle(cx+(r2-mid)*sc2,baseY,6,ORG,true,rp);gText(`x=${r1}`,cx+(r1-mid)*sc2,baseY+16,ORG,12,rp);gText(`x=${r2}`,cx+(r2-mid)*sc2,baseY+16,ORG,12,rp)}
      if(p>0.8) gText(`(x-${r1})(x-${r2})=0`,cx,H-16,GRN,16,easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'quadratic_formula_viz': {
      // M028: 근의 공식 — 유도+포물선
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const qa=v('a',1),qb2=v('b',-3),qc2=v('c',2)
      const disc=qb2*qb2-4*qa*qc2,sqrtDisc=disc>=0?Math.sqrt(disc):0
      const qr1=(-qb2-sqrtDisc)/(2*qa),qr2=(-qb2+sqrtDisc)/(2*qa)
      const qMid=(qr1+qr2)/2
      const steps2=[{t:'ax\u00B2+bx+c=0',c:WHITE},{t:'x = (-b\u00B1\u221A(b\u00B2-4ac)) / 2a',c:VIO},{t:`\uC608: a=${qa},b=${qb2},c=${qc2}`,c:GRN},{t:`x = (${-qb2}\u00B1\u221A${disc})/2 = ${qr2} \uB610\uB294 ${qr1}`,c:ORG}]
      steps2.forEach((s,i)=>{const prog=easeOutCubic(Math.min(1,Math.max(0,p*2.2-i*0.35)));gText(s.t,cx,34+i*30,s.c,i===1?16:14,prog)})
      // 포물선
      if(p>0.6){const pp=easeOutCubic((p-0.6)/0.35);const sc3=25,baseY2=cy+60;gLine(30,baseY2,W-30,baseY2,'rgba(255,255,255,0.1)',1,pp)
        ctx.save();ctx.globalAlpha=pp;ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor=VIO;ctx.beginPath();let st=false
        for(let x=qMid-2.5;x<=qMid+2.5;x+=0.05){const y2=qa*x*x+qb2*x+qc2;const sx=cx+(x-qMid)*sc3,sy=baseY2-y2*sc3*0.6;if(sy<20||sy>H-20){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()
        gCircle(cx+(qr1-qMid)*sc3,baseY2,5,ORG,true,pp);gCircle(cx+(qr2-qMid)*sc3,baseY2,5,ORG,true,pp)}
      break
    }

    case 'set_operation': {
      // M029: 집합 — 벤 다이어그램
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const rr=Math.min(55,W*0.18),ax=cx-rr*0.5,bx=cx+rr*0.5
      // A원, B원
      if(p>0.05){const p1=easeOutCubic((p-0.05)/0.25)
        ctx.save();ctx.globalAlpha=p1*0.15;ctx.fillStyle=VIO;ctx.beginPath();ctx.arc(ax,cy,rr,0,Math.PI*2);ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=p1*0.6;ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.beginPath();ctx.arc(ax,cy,rr,0,Math.PI*2);ctx.stroke();ctx.restore()
        ctx.save();ctx.globalAlpha=p1*0.15;ctx.fillStyle=GRN;ctx.beginPath();ctx.arc(bx,cy,rr,0,Math.PI*2);ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=p1*0.6;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.beginPath();ctx.arc(bx,cy,rr,0,Math.PI*2);ctx.stroke();ctx.restore()
        gText('A',ax-rr*0.4,cy-rr*0.3,VIO,16,p1);gText('B',bx+rr*0.4,cy-rr*0.3,GRN,16,p1)}
      // 교집합 채우기
      const phase=Math.floor(((T%540)/540)*3)
      if(p>0.35){const fp=easeOutCubic((p-0.35)/0.3)
        if(phase===0){ctx.save();ctx.globalAlpha=fp*0.5;ctx.fillStyle=ORG;ctx.beginPath();ctx.arc(ax,cy,rr,0,Math.PI*2);ctx.clip();ctx.beginPath();ctx.arc(bx,cy,rr,0,Math.PI*2);ctx.fill();ctx.restore();gText('A\u2229B',cx,cy+rr+18,ORG,14,fp)}
        else if(phase===1){ctx.save();ctx.globalAlpha=fp*0.3;ctx.fillStyle=ORG;ctx.beginPath();ctx.arc(ax,cy,rr,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(bx,cy,rr,0,Math.PI*2);ctx.fill();ctx.restore();gText('A\u222AB',cx,cy+rr+18,ORG,14,fp)}
        else{gText('A\u1D9C (\uC5EC\uC9D1\uD569)',cx,cy+rr+18,ORG,14,fp)}}
      break
    }

    case 'inequality_viz': {
      // M030: 일차부등식 — 수직선 범위
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      gText('2x - 3 > 5',cx,30,'rgba(255,255,255,0.6)',18,easeOutCubic(Math.min(1,p*3)))
      if(p>0.2){const p2=easeOutCubic((p-0.2)/0.25);gText('2x > 8 \u2192 x > 4',cx,56,VIO,15,p2)}
      // 수직선
      const lineY=cy+20,sc=(W-60)/12,ox=cx-6*sc
      if(p>0.1){gLine(ox,lineY,ox+12*sc,lineY,'rgba(255,255,255,0.15)',1.5,p)
        for(let i=0;i<=12;i++){const x=ox+i*sc;gLine(x,lineY-4,x,lineY+4,'rgba(255,255,255,0.2)',1,p);if(i%2===0) gText(String(i-2),x,lineY+16,'rgba(255,255,255,0.3)',9,p)}}
      if(p>0.5){const rp=easeOutCubic((p-0.5)/0.35);const x4=ox+6*sc
        gCircle(x4,lineY,5,ORG,false,rp) // 빈 원 = 초과
        ctx.save();ctx.globalAlpha=rp*0.25;ctx.fillStyle=GRN;ctx.fillRect(x4,lineY-10,6*sc,20);ctx.restore()
        gLine(x4,lineY,ox+12*sc,lineY,GRN,3,rp)
        gText('\u25CB \uCD08\uACFC (4 \uBBF8\uD3EC\uD568)',x4,lineY-20,ORG,11,rp)}
      if(p>0.85) gText('x > 4',cx,H-16,GRN,18,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'linear_func': {
      // M031: 일차함수 y=ax+b — y절편+기울기
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const a3=v('m',3),b3=v('b',2),sc=26
      gLine(30,cy,W-30,cy,'rgba(255,255,255,0.12)',1,p);gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      // y절편
      if(p>0.15){const yp=easeOutCubic((p-0.15)/0.25);gCircle(cx,cy-b3*sc,6,ORG,true,yp);gText(`b=${b3}`,cx+14,cy-b3*sc-10,ORG,12,yp)}
      // 기울기 계단
      if(p>0.3){const sp=easeOutCubic((p-0.3)/0.3)
        gLine(cx,cy-b3*sc,cx+sc,cy-b3*sc,'rgba(255,255,255,0.3)',1.5,sp)
        gLine(cx+sc,cy-b3*sc,cx+sc,cy-(b3+a3)*sc,VIO,2.5,sp)
        gText('1',cx+sc/2,cy-b3*sc+12,'rgba(255,255,255,0.3)',10,sp);gText(String(a3),cx+sc+10,cy-(b3+a3/2)*sc,VIO,12,sp)}
      // 직선
      if(p>0.45){const lp=easeOutCubic((p-0.45)/0.4);ctx.save();ctx.globalAlpha=lp;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=GRN
        ctx.beginPath();ctx.moveTo(cx-4*sc,cy-(a3*(-4)+b3)*sc);ctx.lineTo(cx+4*sc,cy-(a3*4+b3)*sc);ctx.stroke();ctx.restore()}
      if(p>0.85) gText(`y = ${a3}x + ${b3}`,cx,28,GRN,16,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'slope_viz': {
      // M032: 기울기 — Δy/Δx 삼각형
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sc=30;gLine(30,cy,W-30,cy,'rgba(255,255,255,0.12)',1,p);gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      const x1=v('x1',-1),y1=v('y1',-1),x2=v('x2',2),y2=v('y2',2)
      const sx1=cx+x1*sc,sy1=cy-y1*sc,sx2=cx+x2*sc,sy2=cy-y2*sc
      if(p>0.15){const pp=easeOutCubic((p-0.15)/0.3);gCircle(sx1,sy1,5,VIO,true,pp);gCircle(sx2,sy2,5,GRN,true,pp);gText('A',sx1-14,sy1-10,VIO,12,pp);gText('B',sx2+10,sy2-10,GRN,12,pp)}
      // Δx, Δy 삼각형
      if(p>0.4){const tp=easeOutCubic((p-0.4)/0.3)
        gLine(sx1,sy1,sx2,sy1,ORG,2,tp);gText(`\u0394x=${x2-x1}`,(sx1+sx2)/2,sy1+16,ORG,12,tp)
        gLine(sx2,sy1,sx2,sy2,ORG,2,tp);gText(`\u0394y=${y2-y1}`,sx2+16,(sy1+sy2)/2,ORG,12,tp)}
      // 직선
      if(p>0.6){const lp=easeOutCubic((p-0.6)/0.3);ctx.save();ctx.globalAlpha=lp*0.6;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor=GRN
        ctx.beginPath();ctx.moveTo(cx-4*sc,cy+4*sc);ctx.lineTo(cx+4*sc,cy-4*sc);ctx.stroke();ctx.restore()}
      if(p>0.85) gText(`\uAE30\uC6B8\uAE30 = \u0394y/\u0394x = ${y2-y1}/${x2-x1} = 1`,cx,H-16,GRN,14,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'intercept_viz': {
      // M033: x절편, y절편
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const iSlope=v('slope',2),iYint=v('yint',-4)
      const iXint=iYint!==0?(-iYint/iSlope):0
      const sc=30;gLine(30,cy,W-30,cy,'rgba(255,255,255,0.12)',1,p);gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      // y=slope*x+yint 직선
      if(p>0.15){const lp=easeOutCubic((p-0.15)/0.5);ctx.save();ctx.globalAlpha=lp;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=VIO
        ctx.beginPath();ctx.moveTo(cx-3*sc,cy-(iSlope*(-3)+iYint)*sc*0.3);ctx.lineTo(cx+4*sc,cy-(iSlope*4+iYint)*sc*0.3);ctx.stroke();ctx.restore()}
      // y절편 (0,yint)
      if(p>0.4){const yp=easeOutCubic((p-0.4)/0.25);gCircle(cx,cy-iYint*sc*0.3,6,GRN,true,yp);gText(`y\uC808\uD3B8 (0,${iYint})`,cx+20,cy-iYint*sc*0.3+14,GRN,12,yp)}
      // x절편 (xint,0)
      if(p>0.6){const xp=easeOutCubic((p-0.6)/0.25);gCircle(cx+iXint*sc,cy,6,ORG,true,xp);gText(`x\uC808\uD3B8 (${iXint},0)`,cx+iXint*sc+14,cy-14,ORG,12,xp)}
      if(p>0.85) gText(`y=${iSlope}x${iYint<0?iYint:'+'+iYint}`,cx,28,VIO,16,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'linear_eq_apply': {
      // M034: 일차방정식 활용 — 문제→식→답
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      gText('\uC0AC\uACFC x\uAC1C, 500x + 200 = 2200',cx,30,'rgba(255,255,255,0.5)',14,easeOutCubic(Math.min(1,p*3)))
      if(p>0.2){const p2=easeOutCubic((p-0.2)/0.25);gText('500x = 2000',cx,cy-20,VIO,16,p2)}
      if(p>0.45){const p3=easeOutCubic((p-0.45)/0.25);gText('x = 4',cx,cy+10,GRN,22,p3)}
      // 사과 4개 시각화
      if(p>0.6){const fp=easeOutCubic((p-0.6)/0.3)
        for(let i=0;i<4;i++) gCircle(cx-45+i*30,cy+50,12,ORG,true,fp*0.7)
        gText('\uC0AC\uACFC 4\uAC1C!',cx,cy+75,ORG,14,fp)}
      break
    }

    case 'parabola_basic': {
      // M035: y=ax² — a=1,2,-1 비교
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sc=30,scY=12,baseY=cy+50
      gLine(30,baseY,W-30,baseY,'rgba(255,255,255,0.12)',1,p);gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      const curves=[{a:1,c:VIO,l:'a=1'},{a:2,c:GRN,l:'a=2'},{a:-1,c:ORG,l:'a=-1'}]
      curves.forEach((cv,ci)=>{if(p>0.1+ci*0.2){const cp=easeOutCubic((p-0.1-ci*0.2)/0.5)
        ctx.save();ctx.globalAlpha=cp;ctx.strokeStyle=cv.c;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=cv.c;ctx.beginPath();let st=false
        for(let x=-4;x<=4;x+=0.05){const y2=cv.a*x*x;const sx=cx+x*sc,sy=baseY-y2*scY;if(sy<20||sy>H-20){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()
        gText(cv.l,cx+3.5*sc,baseY-cv.a*3.5*3.5*scY+(cv.a<0?20:-12),cv.c,11,cp)}})
      break
    }

    case 'parabola_standard': {
      // M036: y=a(x-p)²+q — 이동
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sc=28,scY=14,baseY=cy+50,pp=v('p',2),qq=v('q',-3)
      gLine(30,baseY,W-30,baseY,'rgba(255,255,255,0.12)',1,p);gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      // y=x² (원본, 흐리게)
      if(p>0.1){const p1=easeOutCubic((p-0.1)/0.3);ctx.save();ctx.globalAlpha=p1*0.3;ctx.strokeStyle=VIO;ctx.lineWidth=1.5;ctx.setLineDash([4,4]);ctx.beginPath();let st=false
        for(let x=-4;x<=4;x+=0.05){const y2=x*x;const sx=cx+x*sc,sy=baseY-y2*scY;if(sy<20||sy>H-20){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()}
      // y=(x-p)²+q (이동 후)
      if(p>0.35){const p2=easeOutCubic((p-0.35)/0.5);ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=GRN;ctx.beginPath();let st=false
        for(let x=-4;x<=6;x+=0.05){const y2=(x-pp)*(x-pp)+qq;const sx=cx+x*sc,sy=baseY-y2*scY;if(sy<20||sy>H-20){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()
        gCircle(cx+pp*sc,baseY-qq*scY,6,ORG,true,p2);gText(`(${pp},${qq})`,cx+pp*sc+14,baseY-qq*scY-12,ORG,12,p2)}
      if(p>0.85) gText(`y=(x-${pp})\u00B2+${qq<0?'('+qq+')':qq}`,cx,28,GRN,15,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'parabola_vertex': {
      // M037: 꼭짓점+대칭축
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sc=28,scY=14,baseY=cy+50
      gLine(30,baseY,W-30,baseY,'rgba(255,255,255,0.12)',1,p);gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      const pvH=v('h',1),pvK=v('k',-4)
      if(p>0.1){const cp=easeOutCubic((p-0.1)/0.5);ctx.save();ctx.globalAlpha=cp;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=VIO;ctx.beginPath();let st=false
        for(let x=pvH-4;x<=pvH+4;x+=0.05){const y2=(x-pvH)*(x-pvH)+pvK;const sx=cx+(x-pvH)*sc+pvH*sc,sy=baseY-y2*scY;if(sy<20||sy>H-20){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()}
      if(p>0.5){const vp=easeOutElastic(Math.min(1,(p-0.5)/0.3));gCircle(cx+pvH*sc,baseY-pvK*scY,7,ORG,true,vp);gText(`\uAF2D\uC9D3\uC810 (${pvH},${pvK})`,cx+pvH*sc+16,baseY-pvK*scY+14,ORG,12,vp)
        gLine(cx+pvH*sc,20,cx+pvH*sc,H-20,GRN,1.5,vp*0.4);gText(`\uB300\uCE6D\uCD95 x=${pvH}`,cx+pvH*sc+10,30,GRN,11,vp)}
      break
    }

    case 'parabola_minmax': {
      // M038: 최대/최소
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sc=26,scY=12,baseY=cy
      gLine(30,baseY,W-30,baseY,'rgba(255,255,255,0.12)',1,p);gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      const mmQ=v('q',2)
      // a>0 (왼쪽) 최솟값
      if(p>0.1){const p1=easeOutCubic((p-0.1)/0.4);const ox=cx-W*0.22
        ctx.save();ctx.globalAlpha=p1;ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor=VIO;ctx.beginPath();let st=false
        for(let x=-3;x<=3;x+=0.05){const y2=x*x-mmQ;const sx=ox+x*sc,sy=baseY-y2*scY;if(sy<20||sy>H-20){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()
        gCircle(ox,baseY+mmQ*scY,5,GRN,true,p1);gText('a>0 \u2192 \uCD5C\uC19F\uAC12',ox,baseY+mmQ*scY+16,GRN,11,p1)}
      // a<0 (오른쪽) 최댓값
      if(p>0.4){const p2=easeOutCubic((p-0.4)/0.4);const ox=cx+W*0.22
        ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor=ORG;ctx.beginPath();let st=false
        for(let x=-3;x<=3;x+=0.05){const y2=-x*x+mmQ;const sx=ox+x*sc,sy=baseY-y2*scY;if(sy<20||sy>H-20){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()
        gCircle(ox,baseY-mmQ*scY,5,GRN,true,p2);gText('a<0 \u2192 \uCD5C\uB313\uAC12',ox,baseY-mmQ*scY-16,GRN,11,p2)}
      break
    }

    case 'inverse_proportion': {
      // M039: y=k/x 쌍곡선 — 직사각형 넓이 일정
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const k=v('a',12),sc=22
      gLine(30,cy,W-30,cy,'rgba(255,255,255,0.12)',1,p);gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      if(p>0.15){const cp=easeOutCubic((p-0.15)/0.5);ctx.save();ctx.globalAlpha=cp;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=VIO;ctx.beginPath();let st=false
        for(let x=0.5;x<=7;x+=0.05){const y2=k/x;const sx=cx+x*sc,sy=cy-y2*sc*0.5;if(sy<20||sy>H-20||sx>W-20){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()}
      // 직사각형 넓이=k
      const ptX=2+((T%200)/200)*4,ptY=k/ptX
      if(p>0.5){const rp=easeOutCubic((p-0.5)/0.3);const sx=cx+ptX*sc,sy=cy-ptY*sc*0.5
        ctx.save();ctx.globalAlpha=rp*0.2;ctx.fillStyle=ORG;ctx.fillRect(cx,cy,ptX*sc,-(ptY*sc*0.5));ctx.restore()
        gCircle(sx,sy,5,ORG,true,rp);gText(`\uB113\uC774=${k}`,cx+ptX*sc/2,cy-(ptY*sc*0.25),ORG,11,rp)}
      if(p>0.85) gText(`y = ${k}/x (\uC9C1\uC0AC\uAC01\uD615 \uB113\uC774 \uD56D\uC0C1 ${k})`,cx,H-16,GRN,13,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'direct_proportion': case 'proportional_judge': {
      // M040: 정비례 vs 반비례 판별
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const dpK=v('k',6)
      const sc=22;gLine(30,cy,W-30,cy,'rgba(255,255,255,0.12)',1,p);gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      // 정비례 직선 (왼쪽)
      if(p>0.1){const p1=easeOutCubic((p-0.1)/0.4);ctx.save();ctx.globalAlpha=p1;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=VIO
        ctx.beginPath();ctx.moveTo(cx-4*sc,cy+4*sc);ctx.lineTo(cx+4*sc,cy-4*sc);ctx.stroke();ctx.restore()
        gText('\uC815\uBE44\uB840 y=kx',cx-2*sc,30,VIO,13,p1);gText('y/x \uC77C\uC815',cx-2*sc,48,'rgba(255,255,255,0.4)',10,p1)}
      // 반비례 쌍곡선 (오른쪽)
      if(p>0.4){const p2=easeOutCubic((p-0.4)/0.4);ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=GRN;ctx.beginPath();let st=false
        for(let x=0.5;x<=5;x+=0.05){const y2=dpK/x;const sx=cx+x*sc,sy=cy-y2*sc*0.5;if(sy<20||sy>H-20||sx>W-20){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()
        gText('\uBC18\uBE44\uB840 y=k/x',cx+2*sc,30,GRN,13,p2);gText('xy \uC77C\uC815',cx+2*sc,48,'rgba(255,255,255,0.4)',10,p2)}
      break
    }

    case 'simul_eq_apply': {
      // M041: 연립방정식 활용
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      gText('\uBB38\uC7A5 \u2192 \uC2DD 2\uAC1C \u2192 \uAD50\uC810 = \uB2F5',cx,30,'rgba(255,255,255,0.5)',14,easeOutCubic(Math.min(1,p*3)))
      const sc=22;if(p>0.2){gLine(30,cy+20,W-30,cy+20,'rgba(255,255,255,0.1)',1,p);gLine(cx,40,cx,H-20,'rgba(255,255,255,0.1)',1,p)}
      if(p>0.3){const lp=easeOutCubic((p-0.3)/0.3);ctx.save();ctx.globalAlpha=lp;ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-3*sc,cy+20+2*sc);ctx.lineTo(cx+3*sc,cy+20-2*sc);ctx.stroke();ctx.restore()}
      if(p>0.5){const lp2=easeOutCubic((p-0.5)/0.3);ctx.save();ctx.globalAlpha=lp2;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-3*sc,cy+20-sc);ctx.lineTo(cx+3*sc,cy+20+sc);ctx.stroke();ctx.restore()}
      if(p>0.7){const ip=easeOutElastic(Math.min(1,(p-0.7)/0.25));gCircle(cx+sc,cy+20-sc*0.3,6,ORG,true,ip);gText('\uAD50\uC810 = \uB2F5',cx+sc+18,cy+20-sc*0.3-14,ORG,13,ip)}
      break
    }

    case 'triangle_congruent': {
      // M042: 삼각형 합동 조건
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const conds=['SSS: \uC138 \uBCC0','SAS: \uB450 \uBCC0+\uB07C\uC778\uAC01','ASA: \uB450 \uAC01+\uB07C\uC778\uBCC0']
      conds.forEach((c2,i)=>{const prog=easeOutCubic(Math.min(1,Math.max(0,p*2.5-i*0.5)));const y=cy-40+i*40;const color=[VIO,GRN,ORG][i]
        // 삼각형 쌍
        const ox=cx-80,sz=25
        ctx.save();ctx.globalAlpha=prog*0.6;ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ox,y+sz);ctx.lineTo(ox+sz,y);ctx.lineTo(ox+sz*2,y+sz);ctx.closePath();ctx.stroke();ctx.restore()
        ctx.save();ctx.globalAlpha=prog*0.6;ctx.strokeStyle=color;ctx.lineWidth=2;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(ox+sz*2.5,y+sz);ctx.lineTo(ox+sz*3.5,y);ctx.lineTo(ox+sz*4.5,y+sz);ctx.closePath();ctx.stroke();ctx.restore()
        gText(c2,cx+40,y+sz/2,color,12,prog)})
      if(p>0.85) gText('\uAC19\uC73C\uBA74 \u2192 \uD569\uB3D9!',cx,H-16,GRN,16,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'isosceles_viz': {
      // M043: 이등변삼각형 — 두 변 같으면 밑각 같음
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const tw=120,th=100,A={x:cx,y:cy-th/2},B={x:cx-tw/2,y:cy+th/2},C={x:cx+tw/2,y:cy+th/2}
      if(p>0.05){const p1=easeOutCubic((p-0.05)/0.3);ctx.save();ctx.globalAlpha=p1*0.8;ctx.strokeStyle=WHITE;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.lineTo(C.x,C.y);ctx.closePath();ctx.stroke();ctx.restore()}
      // 같은 변 표시
      if(p>0.3){const sp=easeOutCubic((p-0.3)/0.25)
        gLine(A.x,A.y,B.x,B.y,VIO,3,sp);gLine(A.x,A.y,C.x,C.y,VIO,3,sp)
        gText('=',((A.x+B.x)/2)-10,(A.y+B.y)/2,VIO,14,sp);gText('=',((A.x+C.x)/2)+10,(A.y+C.y)/2,VIO,14,sp)}
      // 밑각 같음
      if(p>0.55){const ap=easeOutCubic((p-0.55)/0.25)
        ctx.save();ctx.globalAlpha=ap*0.6;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.beginPath();ctx.arc(B.x,B.y,16,-0.3,0.8);ctx.stroke();ctx.restore()
        ctx.save();ctx.globalAlpha=ap*0.6;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.beginPath();ctx.arc(C.x,C.y,16,Math.PI-0.8,Math.PI+0.3);ctx.stroke();ctx.restore()
        gText('\u2220B = \u2220C',cx,C.y+22,GRN,14,ap)}
      break
    }

    case 'parallelogram_viz': {
      // M044: 평행사변형 — 대변 같고 대각선 이등분
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const pw=140,ph=80,skew=35,ox=cx-pw/2,oy=cy-ph/2
      const pts=[{x:ox+skew,y:oy},{x:ox+pw+skew,y:oy},{x:ox+pw,y:oy+ph},{x:ox,y:oy+ph}]
      if(p>0.05){const p1=easeOutCubic((p-0.05)/0.25);ctx.save();ctx.globalAlpha=p1*0.8;ctx.strokeStyle=WHITE;ctx.lineWidth=2.5
        ctx.beginPath();pts.forEach((pt,i)=>i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y));ctx.closePath();ctx.stroke();ctx.restore()}
      // 대변 같음
      if(p>0.3){const sp=easeOutCubic((p-0.3)/0.25)
        gLine(pts[0].x,pts[0].y,pts[1].x,pts[1].y,VIO,3,sp);gLine(pts[2].x,pts[2].y,pts[3].x,pts[3].y,VIO,3,sp)
        gLine(pts[1].x,pts[1].y,pts[2].x,pts[2].y,GRN,3,sp);gLine(pts[3].x,pts[3].y,pts[0].x,pts[0].y,GRN,3,sp)}
      // 대각선 이등분
      if(p>0.55){const dp=easeOutCubic((p-0.55)/0.3)
        gLine(pts[0].x,pts[0].y,pts[2].x,pts[2].y,ORG,1.5,dp*0.5);gLine(pts[1].x,pts[1].y,pts[3].x,pts[3].y,ORG,1.5,dp*0.5)
        const midX=(pts[0].x+pts[2].x)/2,midY=(pts[0].y+pts[2].y)/2
        gCircle(midX,midY,5,ORG,true,dp);gText('\uC774\uB4F1\uBD84',midX+10,midY-14,ORG,11,dp)}
      break
    }

    // ══════════════════════════════════════════
    // M045~M062 — 기하+통계 전용 시각화
    // ══════════════════════════════════════════

    case 'pythagoras_viz': {
      const sA = Math.max(0.5, parseFloat((v('a', 3)).toFixed(1)));
      const sB = Math.max(0.5, parseFloat((v('b', 4)).toFixed(1)));
      const sC = parseFloat((Math.sqrt(sA*sA + sB*sB)).toFixed(1));
      const gridA = Math.ceil(sA), gridB = Math.ceil(sB);
      const totalCells = gridA*gridA + gridB*gridB;
      const maxSide = Math.max(gridA, gridB, Math.ceil(sC));
      const u = Math.min(W / (maxSide * 4 + 10), H / (maxSide * 3 + 8));

      // 좌표 기준점 — 왼쪽에 삼각형, 오른쪽에 c²
      const triCx = W * 0.30, triCy = H * 0.20;
      const Ax = triCx - sB * u / 2, Ay = triCy + sA * u / 2;
      const Bx = triCx + sB * u / 2, By = Ay;
      const Tx = Ax, Ty = Ay - sA * u;

      const totalTiles = sA * sA + sB * sB;
      const sCI = Math.ceil(sC);

      // 정사각형 위치 — 좌우 분리
      const sqAox = triCx - sB * u / 2 - sA * u - u * 1.5, sqAoy = Ty;
      const sqBox = Ax, sqBoy = Ay + u * 1.5;
      const cDestX = W * 0.55, cDestY = H * 0.15;
      
      // 부드러운 이징
      const eIO = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
      const eO = (t: number) => 1 - Math.pow(1 - t, 3);
      const cl = (t: number) => Math.max(0, Math.min(1, t));
      const lr = (a: number, b: number, t: number) => a + (b - a) * t;
      
      // 단계 정의 (p 기반)
      // 0.00~0.12: 삼각형 그리기
      // 0.12~0.20: 라벨
      // 0.20~0.30: a² 정사각형 + 칸 카운팅
      // 0.30~0.42: b² 정사각형 + 칸 카운팅
      // 0.42~0.48: c² 빈 틀
      // 0.48~0.78: 칸 이동 애니메이션
      // 0.78~0.90: 결과 강조
      // 0.90~1.00: 수식
      
      // === 삼각형 ===
      const triP = cl(p / 0.12);
      if (triP > 0) {
        const ta = eO(Math.min(triP * 1.5, 1));
        // 삼각형 채우기
        ctx.save();
        ctx.globalAlpha = ta * 0.1;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Bx, By); ctx.lineTo(Tx, Ty); ctx.closePath(); ctx.fill();
        ctx.restore();
        
        // 삼각형 변 그리기
        ctx.save();
        ctx.globalAlpha = ta;
        const segs = [[Ax,Ay,Bx,By],[Bx,By,Tx,Ty],[Tx,Ty,Ax,Ay]];
        const totalSeg = eIO(Math.min(triP * 1.2, 1)) * 3;
        for (let si = 0; si < 3; si++) {
          const segP = cl(totalSeg - si);
          if (segP <= 0) continue;
          const s = segs[si];
          gLine(s[0], s[1], lr(s[0],s[2],eO(segP)), lr(s[1],s[3],eO(segP)), '#ffffff', 2.5, ta);
        }
        // 직각 표시
        if (triP > 0.9) {
          ctx.strokeStyle = 'rgba(255,255,255,0.6)';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(Ax, Ay - 10, 10, 10);
        }
        ctx.restore();
      }
      
      // === 라벨 ===
      const lblP = cl((p - 0.08) / 0.08);
      if (lblP > 0) {
        gText('a = ' + sA, sqAox + sA * u / 2, Ty - 14, '#534AB7', 18, eO(lblP));
        gText('b = ' + sB, (Ax + Bx) / 2, sqBoy + sB * u + 35, '#1D9E75', 18, eO(lblP));
        gText('c = ' + sC, Bx + (Tx - Bx) / 2 + 40, (By + Ty) / 2, '#D85A30', 18, eO(lblP));
      }
      
      // === a² 정사각형 + 격자 + 카운팅 ===
      const sqAp = cl((p - 0.20) / 0.05);
      if (sqAp > 0) {
        const sa = eO(sqAp);
        const ss = sA * u;
        ctx.save();
        ctx.globalAlpha = sa;
        ctx.fillStyle = 'rgba(83,74,183,0.25)';
        ctx.strokeStyle = '#534AB7';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.rect(sqAox, sqAoy, ss, ss); ctx.fill(); ctx.stroke();
        // 격자
        ctx.globalAlpha = sa * 0.15;
        ctx.lineWidth = 0.5;
        for (let i = 1; i < gridA; i++) {
          ctx.beginPath(); ctx.moveTo(sqAox + i * u, sqAoy); ctx.lineTo(sqAox + i * u, sqAoy + ss); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sqAox, sqAoy + i * u); ctx.lineTo(sqAox + ss, sqAoy + i * u); ctx.stroke();
        }
        ctx.restore();
      }
      
      // a² 칸 카운팅
      const cntAp = cl((p - 0.24) / 0.06);
      if (cntAp > 0) {
        for (let idx = 0; idx < gridA * gridA; idx++) {
          const row = Math.floor(idx / gridA), col = idx % gridA;
          const cx2 = sqAox + col * u + u / 2, cy2 = sqAoy + row * u + u / 2;
          const dl = idx / (gridA * gridA);
          const t2 = cl((cntAp - dl * 0.55) / 0.45);
          if (t2 <= 0) continue;
          const sc = eO(t2);
          gCircle(cx2, cy2, u * 0.26 * sc, '#534AB7', true, sc * 0.5);
          gText(String(idx + 1), cx2, cy2 + 1, '#ffffff', u * 0.28, sc * 0.9);
        }
        if (cntAp > 0.8) {
          gText('a00B2 = ' + gridA * gridA + 'CE78', sqAox + sA * u / 2, sqAoy + sA * u + 18, '#534AB7', 14, cl((cntAp - 0.8) / 0.2));
        }
      }
      
      // === b² 정사각형 + 격자 + 카운팅 ===
      const sqBp = cl((p - 0.30) / 0.05);
      if (sqBp > 0) {
        const sb2 = eO(sqBp);
        const ss2 = sB * u;
        ctx.save();
        ctx.globalAlpha = sb2;
        ctx.fillStyle = 'rgba(29,158,117,0.25)';
        ctx.strokeStyle = '#1D9E75';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.rect(sqBox, sqBoy, ss2, ss2); ctx.fill(); ctx.stroke();
        ctx.globalAlpha = sb2 * 0.15;
        ctx.lineWidth = 0.5;
        for (let i = 1; i < gridB; i++) {
          ctx.beginPath(); ctx.moveTo(sqBox + i * u, sqBoy); ctx.lineTo(sqBox + i * u, sqBoy + ss2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sqBox, sqBoy + i * u); ctx.lineTo(sqBox + ss2, sqBoy + i * u); ctx.stroke();
        }
        ctx.restore();
      }
      
      // b² 칸 카운팅
      const cntBp = cl((p - 0.35) / 0.07);
      if (cntBp > 0) {
        for (let idx = 0; idx < gridB * gridB; idx++) {
          const row = Math.floor(idx / gridB), col = idx % gridB;
          const cx2 = sqBox + col * u + u / 2, cy2 = sqBoy + row * u + u / 2;
          const dl = idx / (gridB * gridB);
          const t2 = cl((cntBp - dl * 0.55) / 0.45);
          if (t2 <= 0) continue;
          const sc = eO(t2);
          gCircle(cx2, cy2, u * 0.26 * sc, '#1D9E75', true, sc * 0.5);
          gText(String(idx + 1), cx2, cy2 + 1, '#ffffff', u * 0.28, sc * 0.9);
        }
        if (cntBp > 0.8) {
          gText('b00B2 = ' + gridB * gridB + 'CE78', sqBox + sB * u / 2, sqBoy + sB * u + 18, '#1D9E75', 14, cl((cntBp - 0.8) / 0.2));
        }
      }
      
      // === c² 빈 틀 (점선) ===
      const cFrameP = cl((p - 0.42) / 0.04);
      if (cFrameP > 0) {
        ctx.save();
        ctx.globalAlpha = eO(cFrameP) * 0.3;
        ctx.strokeStyle = '#D85A30';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        for (let r = 0; r < sCI; r++) {
          for (let c2 = 0; c2 < sCI; c2++) {
            ctx.beginPath();
            ctx.rect(cDestX + c2 * u + 3, cDestY + r * u + 3, u - 6, u - 6);
            ctx.stroke();
          }
        }
        ctx.setLineDash([]);
        ctx.restore();
        gText('c\u00B2 = ?', cDestX + sCI * u / 2, cDestY - 15, '#D85A30', 15, eO(cFrameP));
      }
      
      // === 칸 이동 애니메이션 ===
      const moveP = cl((p - 0.48) / 0.30);
      if (moveP > 0) {
        let tileIdx = 0;
        
        // a² 타일 이동
        for (let r = 0; r < gridA; r++) {
          for (let c = 0; c < gridA; c++) {
            const fromX = sqAox + c * u, fromY = sqAoy + r * u;
            const dr = Math.floor(tileIdx / sCI), dc = tileIdx % sCI;
            const toX = cDestX + dc * u, toY = cDestY + dr * u;
            const delay = tileIdx / totalTiles * 0.65;
            const t2 = cl((moveP - delay) / 0.25);
            const et = eIO(t2);
            const curX = lr(fromX, toX, et);
            const curY = lr(fromY, toY, et) - Math.sin(et * Math.PI) * u * 2.5;
            
            if (t2 > 0) {
              ctx.save();
              ctx.globalAlpha = 1;
              ctx.fillStyle = 'rgba(83,74,183,0.35)';
              ctx.strokeStyle = '#534AB7';
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.rect(curX + 2, curY + 2, u - 4, u - 4); ctx.fill(); ctx.stroke();
              ctx.restore();
              // 착지 후 번호 표시
              if (et > 0.9) {
                const la = cl((et - 0.9) / 0.1);
                gCircle(curX + u/2, curY + u/2, u * 0.26, '#534AB7', true, la * 0.4);
                gText(String(tileIdx + 1), curX + u/2, curY + u/2 + 1, '#ffffff', u * 0.28, la * 0.9);
              }
            }
            tileIdx++;
          }
        }
        
        // b² 타일 이동
        for (let r = 0; r < gridB; r++) {
          for (let c = 0; c < gridB; c++) {
            const fromX = sqBox + c * u, fromY = sqBoy + r * u;
            const dr = Math.floor(tileIdx / sCI), dc = tileIdx % sCI;
            const toX = cDestX + dc * u, toY = cDestY + dr * u;
            const delay = tileIdx / totalTiles * 0.65;
            const t2 = cl((moveP - delay) / 0.25);
            const et = eIO(t2);
            const curX = lr(fromX, toX, et);
            const curY = lr(fromY, toY, et) - Math.sin(et * Math.PI) * u * 3;
            
            if (t2 > 0) {
              ctx.save();
              ctx.globalAlpha = 1;
              ctx.fillStyle = 'rgba(29,158,117,0.35)';
              ctx.strokeStyle = '#1D9E75';
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.rect(curX + 2, curY + 2, u - 4, u - 4); ctx.fill(); ctx.stroke();
              ctx.restore();
              if (et > 0.9) {
                const la = cl((et - 0.9) / 0.1);
                gCircle(curX + u/2, curY + u/2, u * 0.26, '#1D9E75', true, la * 0.4);
                gText(String(tileIdx + 1), curX + u/2, curY + u/2 + 1, '#ffffff', u * 0.28, la * 0.9);
              }
            }
            tileIdx++;
          }
        }
      }
      
      // === 결과 강조 ===
      const resultP = cl((p - 0.78) / 0.08);
      if (resultP > 0) {
        const rp = eO(resultP);
        ctx.save();
        ctx.globalAlpha = rp;
        ctx.strokeStyle = '#D85A30';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.beginPath();
        ctx.rect(cDestX - 3, cDestY - 3, sC * u + 6, sC * u + 6);
        ctx.stroke();
        ctx.restore();
        gText('c² = ' + totalTiles + '칸', cDestX + sCI * u / 2, cDestY + sC * u + 22, '#D85A30', 16, rp);
        
        // 은은한 빛남
        if (resultP > 0.5) {
          const ga = cl((resultP - 0.5) / 0.5);
          const pulse = Math.sin(T * 0.07) * 0.3 + 0.7;
          ctx.save();
          ctx.globalAlpha = ga * 0.05 * pulse;
          ctx.fillStyle = '#D85A30';
          ctx.beginPath();
          ctx.arc(cDestX + sCI * u / 2, cDestY + sC * u / 2, sC * u * 0.65, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      
      // === 수식 ===
      const eqP = cl((p - 0.90) / 0.10);
      if (eqP > 0) {
        const ep = eO(eqP);
        gText(sA*sA + ' + ' + sB*sB + ' = ' + totalTiles, cx, H * 0.88, '#ffffff', 18, ep);
        gText('\uC9C1\uAC01\uC0BC\uAC01\uD615\uC758 \uB450 \uC9E7\uC740 \uBCC0\uC5D0 \uC815\uC0AC\uAC01\uD615\uC744 \uADF8\uB9AC\uBA74', cx, H * 0.93, 'rgba(255,255,255,0.6)', 13, ep);
        gText('\uADF8 \uB113\uC774\uC758 \uD569\uC740 \uBE57\uBCC0\uC758 \uC815\uC0AC\uAC01\uD615 \uB113\uC774\uC640 \uD56D\uC0C1 \uAC19\uB2E4', cx, H * 0.97, 'rgba(255,255,255,0.6)', 13, ep);
      }
      
      // 단계 텍스트 (상단)
      let stepTxt = '';
      if (p < 0.12) stepTxt = '\u2460 \uC9C1\uAC01\uC0BC\uAC01\uD615\uC744 \uADF8\uB9B0\uB2E4';
      else if (p < 0.20) stepTxt = '\u2461 \uAC01 \uBCC0\uC758 \uAE38\uC774';
      else if (p < 0.30) stepTxt = '\u2462 a\u00B2 = ' + (sA*sA) + '\uCE78';
      else if (p < 0.42) stepTxt = '\u2463 b\u00B2 = ' + (sB*sB) + '\uCE78';
      else if (p < 0.48) stepTxt = '\u2464 \uBE57\uBCC0\uC5D0 \uBE48 \uD2C0\uC744 \uB193\uB294\uB2E4';
      else if (p < 0.78) stepTxt = '\u2465 ' + (sA*sA) + '\uCE78 + ' + (sB*sB) + '\uCE78\uC744 \uC62E\uACA8\uC11C c\u00B2\uB97C \uCC44\uC6B4\uB2E4';
      else if (p < 0.90) stepTxt = '\u2466 \uB531 ' + totalTiles + '\uCE78 = c\u00B2';
      
      if (stepTxt) {
        ctx.save();
        ctx.font = '13px system-ui';
        const tw = ctx.measureText(stepTxt).width + 24;
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.beginPath();
        const rx = cx - tw/2, ry = 8, rh = 26, rad = 13;
        ctx.moveTo(rx+rad,ry); ctx.lineTo(rx+tw-rad,ry);
        ctx.quadraticCurveTo(rx+tw,ry,rx+tw,ry+rad);
        ctx.lineTo(rx+tw,ry+rh-rad);
        ctx.quadraticCurveTo(rx+tw,ry+rh,rx+tw-rad,ry+rh);
        ctx.lineTo(rx+rad,ry+rh);
        ctx.quadraticCurveTo(rx,ry+rh,rx,ry+rh-rad);
        ctx.lineTo(rx,ry+rad);
        ctx.quadraticCurveTo(rx,ry,rx+rad,ry);
        ctx.closePath(); ctx.fill();
        ctx.restore();
        gText(stepTxt, cx, 22, 'rgba(255,255,255,0.7)', 13, 1);
      }
      
      break;
    }

    case 'pythagorean_triple': {
      // M046: 피타고라스 수
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const triples=[[3,4,5],[5,12,13],[8,15,17]]
      triples.forEach(([a4,b4,c4],i)=>{const prog=easeOutCubic(Math.min(1,Math.max(0,p*2.5-i*0.5)));const y=34+i*60;const color=[VIO,GRN,ORG][i]
        gText(`(${a4}, ${b4}, ${c4})`,cx-60,y,color,16,prog)
        gText(`${a4}\u00B2+${b4}\u00B2=${a4*a4}+${b4*b4}=${c4*c4}=${c4}\u00B2`,cx+60,y,'rgba(255,255,255,0.5)',12,prog)
        // 미니 직각삼각형
        const sc=Math.min(1.5,40/c4);const ox=W-80,oy=y-10
        ctx.save();ctx.globalAlpha=prog*0.6;ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ox,oy+a4*sc);ctx.lineTo(ox+b4*sc,oy+a4*sc);ctx.lineTo(ox,oy);ctx.closePath();ctx.stroke();ctx.restore()
      })
      break
    }

    case 'similarity_viz': case 'similarity_area': {
      // M048: 닮음비와 넓이비 — 1:2 → 1:4
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const s1=v('s1',40),s2=v('s2',80)
      if(p>0.1){const p1=easeOutCubic((p-0.1)/0.3);ctx.save();ctx.globalAlpha=p1*0.3;ctx.fillStyle=VIO;ctx.fillRect(cx-s2-30-s1,cy-s1/2,s1,s1);ctx.restore();ctx.save();ctx.globalAlpha=p1;ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.strokeRect(cx-s2-30-s1,cy-s1/2,s1,s1);ctx.restore();gText('1',cx-s2-30-s1/2,cy,VIO,14,p1)}
      if(p>0.35){const p2=easeOutCubic((p-0.35)/0.35);ctx.save();ctx.globalAlpha=p2*0.2;ctx.fillStyle=GRN;ctx.fillRect(cx+10,cy-s2/2,s2,s2);ctx.restore();ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.strokeRect(cx+10,cy-s2/2,s2,s2);ctx.restore();gText('4',cx+10+s2/2,cy,GRN,14,p2)}
      if(p>0.7) gText('\uB2EE\uC74C\uBE44 1:2 \u2192 \uB113\uC774\uBE44 1:4',cx,H-16,ORG,15,easeOutCubic((p-0.7)/0.3))
      break
    }

    case 'similarity_volume': {
      // M049: 닮음비와 부피비 — 1:2 → 1:8 (등각 블록)
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const s1=v('s1',30),s2=v('s2',50)
      if(p>0.1){const p1=easeOutCubic((p-0.1)/0.3);ctx.save();ctx.globalAlpha=p1*0.4;ctx.fillStyle=VIO+'66';ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.fillRect(cx-s2-40,cy-s1/2,s1,s1);ctx.strokeRect(cx-s2-40,cy-s1/2,s1,s1);ctx.restore();gText('1',cx-s2-40+s1/2,cy,VIO,12,p1)}
      if(p>0.35){const p2=easeOutCubic((p-0.35)/0.35);ctx.save();ctx.globalAlpha=p2*0.3;ctx.fillStyle=GRN+'66';ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.fillRect(cx+20,cy-s2/2,s2,s2);ctx.strokeRect(cx+20,cy-s2/2,s2,s2);ctx.restore();gText('8',cx+20+s2/2,cy,GRN,14,p2)}
      if(p>0.7) gText('\uB2EE\uC74C\uBE44 1:2 \u2192 \uBD80\uD53C\uBE44 1:8',cx,H-16,ORG,15,easeOutCubic((p-0.7)/0.3))
      break
    }

    case 'parallel_ratio': case 'parallel_ratio_viz': {
      // M050: 평행선과 선분의 비
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const triH=120,triW=100
      const A={x:cx,y:cy-triH/2},B={x:cx-triW/2,y:cy+triH/2},C={x:cx+triW/2,y:cy+triH/2}
      if(p>0.1){const p1=easeOutCubic((p-0.1)/0.3);ctx.save();ctx.globalAlpha=p1*0.8;ctx.strokeStyle=WHITE;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.lineTo(C.x,C.y);ctx.closePath();ctx.stroke();ctx.restore()}
      // 평행선 DE
      if(p>0.35){const pp=easeOutCubic((p-0.35)/0.3);const t=0.4;const D={x:A.x+(B.x-A.x)*t,y:A.y+(B.y-A.y)*t};const E={x:A.x+(C.x-A.x)*t,y:A.y+(C.y-A.y)*t}
        gLine(D.x-20,D.y,E.x+20,D.y,ORG,2.5,pp);gText('DE \u2225 BC',cx+triW/2+10,D.y,ORG,12,pp)}
      if(p>0.65){const rp=easeOutCubic((p-0.65)/0.3);gText('AD/DB = AE/EC',cx,H-16,GRN,14,rp)}
      break
    }

    case 'inscribed_angle': {
      // M051: 원주각=중심각/2
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const rr=Math.min(65,H/2-25),ca=v('angle',80)*Math.PI/180
      gCircle(cx,cy,rr,'rgba(255,255,255,0.15)',false,easeOutCubic(Math.min(1,p*2.5)))
      // 호
      if(p>0.2){const ap=easeOutCubic((p-0.2)/0.3);ctx.save();ctx.globalAlpha=ap;ctx.strokeStyle=ORG;ctx.lineWidth=4;ctx.shadowBlur=10;ctx.shadowColor=ORG;ctx.beginPath();ctx.arc(cx,cy,rr,-Math.PI/2,-Math.PI/2+ca);ctx.stroke();ctx.restore()}
      // 중심각
      if(p>0.35){const cp=easeOutCubic((p-0.35)/0.3);const a1=-Math.PI/2,a2=a1+ca
        gLine(cx,cy,cx+Math.cos(a1)*rr,cy+Math.sin(a1)*rr,VIO,2,cp);gLine(cx,cy,cx+Math.cos(a2)*rr,cy+Math.sin(a2)*rr,VIO,2,cp);gText('2\u03B8',cx+12,cy-16,VIO,12,cp)}
      // 원주각
      if(p>0.55){const ip=easeOutCubic((p-0.55)/0.3);const inscPt={x:cx+Math.cos(-Math.PI/2+ca+1.2)*rr,y:cy+Math.sin(-Math.PI/2+ca+1.2)*rr};const a1=-Math.PI/2,a2=a1+ca
        gLine(inscPt.x,inscPt.y,cx+Math.cos(a1)*rr,cy+Math.sin(a1)*rr,GRN,2,ip);gLine(inscPt.x,inscPt.y,cx+Math.cos(a2)*rr,cy+Math.sin(a2)*rr,GRN,2,ip);gCircle(inscPt.x,inscPt.y,4,GRN,true,ip);gText('\u03B8',inscPt.x+16,inscPt.y,GRN,12,ip)}
      if(p>0.85) gText('\uC6D0\uC8FC\uAC01 = \uC911\uC2EC\uAC01 \u00F7 2',cx,H-16,ORG,15,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'circle_chord': case 'tangent_length': {
      // M052: 접선의 길이 — PA=PB
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const rr=Math.min(55,H/2-30)
      gCircle(cx,cy,rr,'rgba(255,255,255,0.2)',false,easeOutCubic(Math.min(1,p*2.5)))
      // 외부 점 P
      const px=cx+rr*1.8,py=cy
      if(p>0.2){const pp=easeOutCubic((p-0.2)/0.3);gCircle(px,py,5,ORG,true,pp);gText('P',px+10,py-10,ORG,13,pp)}
      // 접선 2개
      if(p>0.4){const tp=easeOutCubic((p-0.4)/0.35);const ang=Math.acos(rr/(rr*1.8))
        const t1x=cx+Math.cos(ang)*rr,t1y=cy-Math.sin(ang)*rr
        const t2x=cx+Math.cos(-ang)*rr,t2y=cy+Math.sin(-ang)*rr
        gLine(px,py,t1x,t1y,VIO,2.5,tp);gLine(px,py,t2x,t2y,GRN,2.5,tp)
        gCircle(t1x,t1y,4,VIO,true,tp);gCircle(t2x,t2y,4,GRN,true,tp)
        gText('A',t1x-10,t1y-12,VIO,11,tp);gText('B',t2x-10,t2y+14,GRN,11,tp)}
      if(p>0.75) gText('PA = PB',cx,H-16,ORG,16,easeOutCubic((p-0.75)/0.25))
      break
    }

    case 'trig_ratio': {
      // M054: 삼각비 sin/cos/tan
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const deg=v('angle',30),rad=deg*Math.PI/180,rr=Math.min(75,H/2-25)
      gLine(cx-rr-20,cy,cx+rr+20,cy,'rgba(255,255,255,0.12)',1,p);gLine(cx,cy-rr-20,cx,cy+rr+20,'rgba(255,255,255,0.12)',1,p)
      if(p>0.1) gCircle(cx,cy,rr,'rgba(255,255,255,0.12)',false,easeOutCubic((p-0.1)/0.3))
      if(p>0.3){const hp=easeOutCubic((p-0.3)/0.3);const ex=cx+Math.cos(rad)*rr,ey=cy-Math.sin(rad)*rr
        gLine(cx,cy,ex,ey,WHITE,2.5,hp);gCircle(ex,ey,4,WHITE,true,hp)
        if(p>0.5){const sp=easeOutCubic((p-0.5)/0.3);gLine(ex,cy,ex,ey,VIO,2.5,sp);gLine(cx,cy,ex,cy,GRN,2.5,sp)
          gText(`\uC0AC\uC778=${r(Math.sin(rad))}`,ex+30,(cy+ey)/2,VIO,12,sp);gText(`\uCF54\uC0AC\uC778=${r(Math.cos(rad))}`,(cx+ex)/2,cy+18,GRN,12,sp)}}
      if(p>0.8) gText(`\uD0C4\uC820\uD2B8=${r(Math.tan(rad))}`,cx,H-16,ORG,14,easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'trig_special': {
      // M055: 특수각 30°,45°,60° 비교
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const angles=[{d:30,s:'1/2',c:VIO},{d:45,s:'\u221A2/2',c:GRN},{d:60,s:'\u221A3/2',c:ORG}]
      angles.forEach((a4,i)=>{const prog=easeOutCubic(Math.min(1,Math.max(0,p*2.5-i*0.4)));const y=34+i*60
        gText(`${a4.d}\u00B0`,cx-80,y,a4.c,18,prog);gText(`\uC0AC\uC778 = ${a4.s}`,cx+20,y,a4.c,14,prog)
        // 미니 삼각형
        const rad=a4.d*Math.PI/180,rr=25,ox=W-70
        ctx.save();ctx.globalAlpha=prog*0.6;ctx.strokeStyle=a4.c;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ox,y+10);ctx.lineTo(ox+Math.cos(rad)*rr,y+10-Math.sin(rad)*rr);ctx.lineTo(ox+Math.cos(rad)*rr,y+10);ctx.closePath();ctx.stroke();ctx.restore()
      })
      break
    }

    case 'trig_apply': {
      // M056: 삼각비 활용 — 건물 높이
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const dist=v('dist',100),ang=v('angle',30),h2=Math.round(dist*Math.tan(ang*Math.PI/180))
      // 지면
      gLine(40,cy+40,W-40,cy+40,'rgba(255,255,255,0.2)',2,p)
      // 사람
      if(p>0.1){const p1=easeOutCubic((p-0.1)/0.2);gLine(cx-100,cy+40,cx-100,cy,'rgba(255,255,255,0.4)',2,p1);gCircle(cx-100,cy-8,6,'rgba(255,255,255,0.4)',false,p1)}
      // 건물
      if(p>0.2){const p2=easeOutCubic((p-0.2)/0.3);ctx.save();ctx.globalAlpha=p2*0.3;ctx.fillStyle=VIO;ctx.fillRect(cx+40,cy+40-80,40,80);ctx.restore();ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=VIO;ctx.lineWidth=2;ctx.strokeRect(cx+40,cy+40-80,40,80);ctx.restore();gText(`h=?`,cx+60,cy-10,VIO,13,p2)}
      // 시선 + 각도
      if(p>0.4){const sp=easeOutCubic((p-0.4)/0.3);gLine(cx-100,cy,cx+60,cy+40-80,ORG,2,sp*0.6)
        ctx.save();ctx.globalAlpha=sp*0.5;ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx-100,cy,20,0,-ang*Math.PI/180,true);ctx.stroke();ctx.restore();gText(`${ang}\u00B0`,cx-75,cy-6,ORG,12,sp)}
      // 거리
      if(p>0.5){const dp=easeOutCubic((p-0.5)/0.2);gText(`${dist}m`,cx-30,cy+55,'rgba(255,255,255,0.5)',12,dp)}
      if(p>0.75) gText(`h = ${dist} \u00D7 tan${ang}\u00B0 \u2248 ${h2}m`,cx,H-16,GRN,14,easeOutCubic((p-0.75)/0.25))
      break
    }

    case 'solid_volume': case 'sphere_volume': case 'sphere_surface': case 'cylinder_surface': case 'cone_volume': case 'cone_surface': {
      // M057~M061: 입체 도형 (2D 등각 투영)
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const rr=v('r',3),scS=Math.min(16,(H-60)/(rr*2+1)),rPx=rr*scS
      // 구 시각화
      if(p>0.1){const sp=easeOutCubic((p-0.1)/0.4)
        ctx.save();ctx.globalAlpha=sp*0.15;ctx.fillStyle=VIO;ctx.beginPath();ctx.arc(cx,cy,rPx,0,Math.PI*2);ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=sp;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=16;ctx.shadowColor=VIO;ctx.beginPath();ctx.arc(cx,cy,rPx,0,Math.PI*2);ctx.stroke()
        ctx.globalAlpha=sp*0.3;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(cx,cy,rPx,rPx*0.28,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
      if(p>0.4){const rp=easeOutCubic((p-0.4)/0.3);gLine(cx,cy,cx+rPx,cy,ORG,2.5,rp);gText(`r=${rr}`,cx+rPx/2,cy-14,ORG,13,rp)}
      if(p>0.7){const vp=easeOutCubic((p-0.7)/0.3);const vol=r((4/3)*Math.PI*rr*rr*rr);const surf=r(4*Math.PI*rr*rr)
        gText(`V = 4/3\u03C0r\u00B3 = ${vol}`,cx,H-32,VIO,13,vp);gText(`S = 4\u03C0r\u00B2 = ${surf}`,cx,H-14,GRN,13,vp)}
      break
    }

    case 'solid_figure': {
      // M062(기존) — 이제 중앙값/최빈값으로 교체됨, 이 케이스는 fallback용
      const pulse2=0.8+Math.sin(T*0.04)*0.2;gCircle(cx,cy,40,'#534AB7',false,p*pulse2);gText(type.replace(/_/g,' '),cx,cy,'#534AB7',13,p)
      break
    }

    case 'parallel_angles': {
      // M063: 동위각·엇각
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      // 두 평행선
      gLine(40,cy-30,W-40,cy-30,'rgba(255,255,255,0.3)',2,p);gLine(40,cy+30,W-40,cy+30,'rgba(255,255,255,0.3)',2,p)
      gText('l',W-30,cy-30-10,'rgba(255,255,255,0.4)',11,p);gText('m',W-30,cy+30-10,'rgba(255,255,255,0.4)',11,p)
      // 횡단선
      if(p>0.15){const tp=easeOutCubic((p-0.15)/0.25);gLine(cx-60,cy-70,cx+60,cy+70,ORG,2.5,tp)}
      // 동위각
      if(p>0.4){const ap=easeOutCubic((p-0.4)/0.3)
        ctx.save();ctx.globalAlpha=ap*0.6;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(cx-10,cy-30,14,0,-0.8,true);ctx.stroke();ctx.restore()
        ctx.save();ctx.globalAlpha=ap*0.6;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(cx+10,cy+30,14,0,-0.8,true);ctx.stroke();ctx.restore()
        gText('\uB3D9\uC704\uAC01 \uAC19\uC74C',cx+70,cy,VIO,12,ap)}
      if(p>0.65){const ep=easeOutCubic((p-0.65)/0.3)
        ctx.save();ctx.globalAlpha=ep*0.6;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(cx-10,cy-30,14,Math.PI,Math.PI+0.8);ctx.stroke();ctx.restore()
        ctx.save();ctx.globalAlpha=ep*0.6;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(cx+10,cy+30,14,0,-0.8,true);ctx.stroke();ctx.restore()
        gText('\uC58B\uAC01 \uAC19\uC74C',cx-70,cy,GRN,12,ep)}
      break
    }

    case 'polygon_angles': case 'exterior_angle': case 'polygon_angle_sum': case 'polygon_exterior_sum': case 'polygon_exterior': {
      // M064~M066: 다각형 각도 — 오각형 삼각형 분할
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const n2=5,rr=Math.min(65,H/2-25)
      const pts: {x:number,y:number}[]=[]
      for(let i=0;i<n2;i++){const a=-Math.PI/2+(i/n2)*Math.PI*2;pts.push({x:cx+Math.cos(a)*rr,y:cy+Math.sin(a)*rr})}
      if(p>0.1){const p1=easeOutCubic((p-0.1)/0.3);ctx.save();ctx.globalAlpha=p1*0.8;ctx.strokeStyle=WHITE;ctx.lineWidth=2.5;ctx.beginPath();pts.forEach((pt,i)=>i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y));ctx.closePath();ctx.stroke();ctx.restore()}
      // 대각선 → 삼각형 3개
      if(p>0.35){const dp=easeOutCubic((p-0.35)/0.3)
        gLine(pts[0].x,pts[0].y,pts[2].x,pts[2].y,VIO,2,dp);gLine(pts[0].x,pts[0].y,pts[3].x,pts[3].y,GRN,2,dp)
        gText('180\u00B0',(pts[0].x+pts[1].x+pts[2].x)/3,(pts[0].y+pts[1].y+pts[2].y)/3,VIO,11,dp)
        gText('180\u00B0',(pts[0].x+pts[2].x+pts[3].x)/3,(pts[0].y+pts[2].y+pts[3].y)/3,GRN,11,dp)
        gText('180\u00B0',(pts[0].x+pts[3].x+pts[4].x)/3,(pts[0].y+pts[3].y+pts[4].y)/3,ORG,11,dp)}
      if(p>0.75) gText(`${n2}\uAC01\uD615 = (${n2}-2)\u00D7180\u00B0 = ${(n2-2)*180}\u00B0`,cx,H-16,GRN,14,easeOutCubic((p-0.75)/0.25))
      break
    }

    case 'sector_viz': case 'arc_length': case 'sector_area': {
      // M067~M068: 호/부채꼴
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const rr=Math.min(65,H/2-25),theta=v('angle',90)
      const rad=theta*Math.PI/180
      gCircle(cx,cy,rr,'rgba(255,255,255,0.12)',false,easeOutCubic(Math.min(1,p*2.5)))
      // 부채꼴
      if(p>0.2){const sp=easeOutCubic((p-0.2)/0.4);ctx.save();ctx.globalAlpha=sp*0.3;ctx.fillStyle=VIO;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,rr,-Math.PI/2,-Math.PI/2+rad);ctx.closePath();ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=sp;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,rr,-Math.PI/2,-Math.PI/2+rad);ctx.closePath();ctx.stroke();ctx.restore()
        gText(`${theta}\u00B0`,cx+16,cy-12,ORG,13,sp)}
      // 호 강조
      if(p>0.55){const hp=easeOutCubic((p-0.55)/0.3);ctx.save();ctx.globalAlpha=hp;ctx.strokeStyle=GRN;ctx.lineWidth=4;ctx.shadowBlur=10;ctx.shadowColor=GRN;ctx.beginPath();ctx.arc(cx,cy,rr,-Math.PI/2,-Math.PI/2+rad);ctx.stroke();ctx.restore()}
      if(p>0.8) gText(`\uD638 = 2\u03C0r\u00D7${theta}/360`,cx,H-16,GRN,13,easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'square_diagonal': case 'rect_diagonal': {
      // M069~M070: 대각선 길이
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const a4=v('a',4),b4=v('b',3),d=r(Math.sqrt(a4*a4+b4*b4))
      const sc=Math.min(20,Math.min((W-60)/a4,(H-60)/b4)),ox=cx-a4*sc/2,oy=cy-b4*sc/2
      ctx.save();ctx.globalAlpha=p*0.8;ctx.strokeStyle=WHITE;ctx.lineWidth=2;ctx.strokeRect(ox,oy,a4*sc,b4*sc);ctx.restore()
      gText(String(a4),cx,oy+b4*sc+14,'rgba(255,255,255,0.5)',12,p);gText(String(b4),ox-14,cy,'rgba(255,255,255,0.5)',12,p)
      if(p>0.35){const dp=easeOutCubic((p-0.35)/0.3);gLine(ox,oy,ox+a4*sc,oy+b4*sc,ORG,3,dp);gText(`d=${d}`,cx+10,cy-10,ORG,15,dp)}
      if(p>0.7) gText(`d\u00B2 = ${a4}\u00B2+${b4}\u00B2 = ${a4*a4+b4*b4}`,cx,H-16,GRN,13,easeOutCubic((p-0.7)/0.3))
      break
    }

    case 'histogram_viz': {
      // M047: 도수분포표 — 막대 솟아오름
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const data=[v('d0',3),v('d1',7),v('d2',12),v('d3',8),v('d4',5)],maxV=v('maxV',12),barW=Math.min(40,(W-60)/data.length-8),maxBH=H-70,ox=cx-(data.length*(barW+10))/2,baseY=cy+maxBH/2
      const labels=['140~','150~','160~','170~','180~']
      data.forEach((d2,i)=>{const bh=(d2/maxV)*maxBH;const x=ox+i*(barW+10);const prog=easeOutCubic(Math.min(1,Math.max(0,p*2.5-i*0.2)));const color=[VIO,GRN,ORG,VIO,GRN][i]
        ctx.save();ctx.globalAlpha=prog*0.6;ctx.fillStyle=color+'66';ctx.strokeStyle=color;ctx.lineWidth=2;ctx.fillRect(x,baseY-bh*prog,barW,bh*prog);ctx.strokeRect(x,baseY-bh*prog,barW,bh*prog);ctx.restore()
        gText(String(d2),x+barW/2,baseY-bh-10,color,11,prog);gText(labels[i],x+barW/2,baseY+14,'rgba(255,255,255,0.4)',8,prog)})
      gText('(cm)',ox+data.length*(barW+10)+10,baseY+14,'rgba(255,255,255,0.3)',9,p)
      break
    }

    case 'relative_freq': {
      // M053: 상대도수 — 비율 변환
      const VIO='#534AB7',GRN='#1D9E75'
      const data=[v('d0',3),v('d1',7),v('d2',12),v('d3',8),v('d4',5)],total=v('total',35)
      const barW=Math.min(40,(W-60)/data.length-8),maxBH=H-70,ox=cx-(data.length*(barW+10))/2,baseY=cy+maxBH/2
      data.forEach((d2,i)=>{const bh=((d2/total))*maxBH*2;const x=ox+i*(barW+10);const prog=easeOutCubic(Math.min(1,Math.max(0,p*2.5-i*0.2)));const color=[VIO,GRN,'#D85A30',VIO,GRN][i]
        ctx.save();ctx.globalAlpha=prog*0.6;ctx.fillStyle=color+'66';ctx.strokeStyle=color;ctx.lineWidth=2;ctx.fillRect(x,baseY-bh*prog,barW,bh*prog);ctx.strokeRect(x,baseY-bh*prog,barW,bh*prog);ctx.restore()
        gText(String(r(d2/total)),x+barW/2,baseY-bh-10,color,10,prog)})
      if(p>0.8) gText('\uC0C1\uB300\uB3C4\uC218 = \uB3C4\uC218/\uCD1D\uB3C4\uC218',cx,H-16,GRN,13,easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'representative_value': {
      // M062: 중앙값·최빈값
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const data=[v('d0',2),v('d1',3),v('d2',3),v('d3',5),v('d4',7),v('d5',8),v('d6',3)]
      const sorted=[...data].sort((a4,b4)=>a4-b4)
      const median=sorted[Math.floor(sorted.length/2)]
      const mode=v('mode',3) // 최빈값
      const bsz=22,gap2=6,ox=cx-(data.length*(bsz+gap2))/2
      // 정렬 전
      if(p<0.4){const p1=easeOutCubic(Math.min(1,p*3));data.forEach((d2,i)=>{const x=ox+i*(bsz+gap2);ctx.save();ctx.globalAlpha=p1*0.7;ctx.fillStyle=VIO+'55';ctx.strokeStyle=VIO;ctx.lineWidth=1.5;ctx.fillRect(x,cy-15,bsz,bsz);ctx.strokeRect(x,cy-15,bsz,bsz);ctx.restore();gText(String(d2),x+bsz/2,cy-15+bsz/2,VIO,12,p1)})}
      // 정렬 후
      if(p>0.35){const p2=easeOutCubic((p-0.35)/0.35);sorted.forEach((d2,i)=>{const x=ox+i*(bsz+gap2);const isMed=i===3;const isMode=d2===mode
        ctx.save();ctx.globalAlpha=p2*0.7;ctx.fillStyle=(isMed?ORG:isMode?GRN:VIO)+'55';ctx.strokeStyle=isMed?ORG:isMode?GRN:VIO;ctx.lineWidth=isMed?3:1.5;ctx.fillRect(x,cy+25,bsz,bsz);ctx.strokeRect(x,cy+25,bsz,bsz);ctx.restore();gText(String(d2),x+bsz/2,cy+25+bsz/2,isMed?ORG:isMode?GRN:VIO,12,p2)})}
      if(p>0.7){const fp=easeOutCubic((p-0.7)/0.3);gText(`\uC911\uC559\uAC12=${median}`,cx-50,H-30,ORG,14,fp);gText(`\uCD5C\uBE48\uAC12=${mode}`,cx+50,H-30,GRN,14,fp)}
      break
    }

    // ══════════════════════════════════════════
    // M071~M076 — 확률과 통계 전용 시각화
    // ══════════════════════════════════════════

    case 'counting_add': case 'counting_viz': {
      // M071: 경우의 수 합의 법칙 — "또는" → 합
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const nA=v('nA',3),nB=v('nB',4)
      // A 그룹
      if(p>0.05){const p1=easeOutCubic((p-0.05)/0.3)
        for(let i=0;i<nA;i++){const x=cx-100+i*32;gCircle(x,cy-30,12,VIO,true,p1*0.7);gText(String(i+1),x,cy-30,'#000',11,p1)}
        gText(`A: ${nA}\uAC00\uC9C0`,cx-100+32,cy-52,VIO,12,p1)}
      // B 그룹
      if(p>0.25){const p2=easeOutCubic((p-0.25)/0.3)
        for(let i=0;i<nB;i++){const x=cx+20+i*32;gCircle(x,cy-30,12,GRN,true,p2*0.7);gText(String(i+nA+1),x,cy-30,'#000',11,p2)}
        gText(`B: ${nB}\uAC00\uC9C0`,cx+20+48,cy-52,GRN,12,p2)}
      // "또는" → 합
      if(p>0.5){const fp=easeOutCubic((p-0.5)/0.3)
        gText('A \uB610\uB294 B',cx,cy+10,'rgba(255,255,255,0.5)',16,fp)
        gText(`\u2192 ${nA} + ${nB} = ${nA+nB}\uAC00\uC9C0`,cx,cy+35,ORG,18,fp)}
      if(p>0.85) gText('\uD569\uC758 \uBC95\uCE59: \uB610\uB294 \u2192 \uB354\uD558\uAE30',cx,H-16,GRN,13,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'counting_mul': {
      // M072: 경우의 수 곱의 법칙 — 트리 다이어그램
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const choices1=['A','B','C'],choices2=['1','2']
      const startX=cx-80,startY=32
      // 1단계: 3가지
      choices1.forEach((c2,i)=>{
        const prog=easeOutElastic(Math.min(1,Math.max(0,p*2.5-i*0.15)))
        const y=startY+i*55;gCircle(startX,y+20,14,VIO,true,prog*0.7);gText(c2,startX,y+20,'#000',12,prog)
        // 2단계: 각각 2가지
        if(p>0.35){const p2=easeOutCubic((p-0.35)/0.4)
          choices2.forEach((c3,j)=>{const prog2=p2*easeOutElastic(Math.min(1,Math.max(0,p2*2-j*0.2)))
            const endX=startX+120,endY=y+8+j*24
            gLine(startX+14,y+20,endX-14,endY,`rgba(255,255,255,${0.15*prog2})`,1.5,prog2)
            gCircle(endX,endY,12,GRN,true,prog2*0.7);gText(c3,endX,endY,'#000',11,prog2)
            gText(`${c2}${c3}`,endX+24,endY,ORG,10,prog2)
          })
        }
      })
      if(p>0.8) gText('3 \u00D7 2 = 6\uAC00\uC9C0 (\uACF1\uC758 \uBC95\uCE59)',cx,H-16,ORG,14,easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'std_deviation': {
      // M073: 분산과 표준편차 — 평균선+편차 화살표
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const data=[v('d0',4),v('d1',7),v('d2',5),v('d3',8),v('d4',6)],avg=v('avg',6),maxV=v('maxV',10)
      const barW=34,gap2=12,maxBH=H-70
      const totalW2=data.length*(barW+gap2)-gap2,ox=cx-totalW2/2,baseY=cy+maxBH/2
      // 막대
      data.forEach((d2,i)=>{const bh=(d2/maxV)*maxBH;const x=ox+i*(barW+gap2)
        const prog=easeOutCubic(Math.min(1,Math.max(0,p*2.5-i*0.2)));const color=[VIO,GRN,ORG,VIO,GRN][i]
        ctx.save();ctx.globalAlpha=prog*0.6;ctx.fillStyle=color+'66';ctx.strokeStyle=color;ctx.lineWidth=2
        ctx.fillRect(x,baseY-bh*prog,barW,bh*prog);ctx.strokeRect(x,baseY-bh*prog,barW,bh*prog);ctx.restore()
        gText(String(d2),x+barW/2,baseY+14,color,11,prog)
      })
      // 평균선
      if(p>0.4){const lp=easeOutCubic((p-0.4)/0.25);const avgY=baseY-(avg/maxV)*maxBH
        gLine(ox-8,avgY,ox+totalW2+8,avgY,ORG,2.5,lp);gText(`\uD3C9\uADE0=${avg}`,ox+totalW2+14,avgY,ORG,12,lp)}
      // 편차 화살표
      if(p>0.6){const dp=easeOutCubic((p-0.6)/0.3)
        data.forEach((d2,i)=>{const x=ox+i*(barW+gap2)+barW/2;const avgY=baseY-(avg/maxV)*maxBH;const dY=baseY-(d2/maxV)*maxBH
          if(d2!==avg) gLine(x,avgY,x,dY,'rgba(255,255,255,0.4)',1.5,dp)})}
      if(p>0.85) gText('\uBD84\uC0B0 = \uD3B8\uCC28\u00B2\uC758 \uD3C9\uADE0, \uD45C\uC900\uD3B8\uCC28 = \u221A\uBD84\uC0B0',cx,H-16,GRN,11,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'correlation_viz': {
      // M074: 산점도와 상관관계 — 점 찍기
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sc=20;gLine(40,cy+60,W-40,cy+60,'rgba(255,255,255,0.15)',1.5,p);gLine(50,20,50,H-20,'rgba(255,255,255,0.15)',1.5,p)
      gText('\uD0A4(cm)',W-30,cy+60-10,'rgba(255,255,255,0.3)',9,p);gText('\uBC1C(\uCE58\uC218)',50+10,24,'rgba(255,255,255,0.3)',9,p)
      // 양의 상관 점들
      const pts: [number,number][] = [[2,1],[3,2],[4,2.5],[5,3],[6,4],[7,4.5],[8,5],[9,5.5]]
      pts.forEach(([x2,y2],i)=>{
        const prog=easeOutElastic(Math.min(1,Math.max(0,p*2-i*0.1)))
        gCircle(50+x2*sc,cy+60-y2*sc,5,VIO,true,prog*0.7)
      })
      // 추세선
      if(p>0.6){const lp=easeOutCubic((p-0.6)/0.3)
        ctx.save();ctx.globalAlpha=lp*0.6;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor=GRN;ctx.setLineDash([4,4])
        ctx.beginPath();ctx.moveTo(50+1*sc,cy+60-0.5*sc);ctx.lineTo(50+10*sc,cy+60-6*sc);ctx.stroke();ctx.restore()
        gText('\uC591\uC758 \uC0C1\uAD00\uAD00\uACC4',cx+40,40,GRN,13,lp)}
      break
    }

    case 'probability_viz': case 'probability_basic': {
      // M075: 확률의 기본 성질 — 주사위 짝수
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const diceSize=32,gap2=8,total=v('n',6)
      const ox=cx-(total*(diceSize+gap2))/2
      // 주사위 6면
      for(let i=0;i<total;i++){
        const prog=easeOutElastic(Math.min(1,Math.max(0,p*2-i*0.1)))
        const x=ox+i*(diceSize+gap2),isEven=(i+1)%2===0
        const fadeP=isEven&&p>0.4?easeOutCubic((p-0.4)/0.3):0
        ctx.save();ctx.globalAlpha=prog*0.7
        ctx.fillStyle=isEven&&fadeP>0?GRN+'66':VIO+'33'
        ctx.strokeStyle=isEven&&fadeP>0?GRN:VIO;ctx.lineWidth=2
        ctx.shadowBlur=isEven&&fadeP>0?10:0;ctx.shadowColor=GRN
        ctx.fillRect(x,cy-diceSize/2,diceSize,diceSize);ctx.strokeRect(x,cy-diceSize/2,diceSize,diceSize);ctx.restore()
        gText(String(i+1),x+diceSize/2,cy,isEven&&fadeP>0?GRN:VIO,14,prog)
      }
      // 확률
      if(p>0.55){const fp=easeOutCubic((p-0.55)/0.3)
        gText('\uC9DD\uC218: 2, 4, 6 \u2192 3\uAC1C',cx,cy+diceSize/2+24,GRN,14,fp)}
      if(p>0.8) gText('P(\uC9DD\uC218) = 3/6 = 1/2',cx,H-16,ORG,16,easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'complement_prob': {
      // M076: 여사건 — P(A)+P(Aᶜ)=1
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const rr=Math.min(60,H/2-30)
      // 전체 원 (1)
      if(p>0.05){const p1=easeOutCubic((p-0.05)/0.25)
        ctx.save();ctx.globalAlpha=p1*0.15;ctx.fillStyle=WHITE;ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=p1*0.5;ctx.strokeStyle=WHITE;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.stroke();ctx.restore()
        gText('\uC804\uCCB4 = 1',cx,cy-rr-14,'rgba(255,255,255,0.5)',12,p1)}
      // A 부분 (사건)
      if(p>0.25){const p2=easeOutCubic((p-0.25)/0.3)
        ctx.save();ctx.globalAlpha=p2*0.5;ctx.fillStyle=VIO;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,rr,-Math.PI/2,Math.PI*0.8);ctx.closePath();ctx.fill();ctx.restore()
        gText('A',cx-20,cy-10,VIO,16,p2);gText('P(A)',cx-rr*0.5,cy+rr*0.3,VIO,12,p2)}
      // Aᶜ 부분 (여사건)
      if(p>0.5){const p3=easeOutCubic((p-0.5)/0.3)
        ctx.save();ctx.globalAlpha=p3*0.4;ctx.fillStyle=GRN;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,rr,Math.PI*0.8,-Math.PI/2);ctx.closePath();ctx.fill();ctx.restore()
        gText('A\u1D9C',cx+rr*0.4,cy-rr*0.2,GRN,14,p3);gText('P(A\u1D9C)',cx+rr*0.5,cy+rr*0.3,GRN,12,p3)}
      if(p>0.8) gText('P(A) + P(A\u1D9C) = 1',cx,H-16,ORG,16,easeOutCubic((p-0.8)/0.2))
      break
    }

    // ══════════════════════════════════════════
    // 나머지 중등 fallback
    // ══════════════════════════════════════════
    case 'gcd_lcm': case 'real_number':
    case 'real_compare': case 'radical_calc': case 'algebra_intro':
    case 'linear_eq_apply': case 'graph_read':
    case 'polynomial_add': case 'inequality_viz':
    case 'inequality_apply': case 'function_concept':
    case 'geometry_basic': case 'parallel_angles': case 'triangle_construct':
    case 'triangle_congruent': case 'polygon_angles': case 'polygon_exterior':
    case 'sector_viz': case 'solid_figure': case 'solid_volume':
    case 'isosceles_viz': case 'circumcenter_viz': case 'parallelogram_viz':
    case 'quadrilaterals_viz': case 'similarity_viz': case 'triangle_similar':
    case 'parallel_ratio': case 'circle_chord': case 'inscribed_angle':
    case 'representative_value': case 'frequency_table': case 'histogram_viz':
    case 'relative_freq': case 'counting_viz': case 'complement_prob':
    case 'box_plot': case 'correlation_viz': {
      const pulse2 = 0.8 + Math.sin(T * 0.04) * 0.2
      ctx.save(); ctx.globalAlpha = p * pulse2 * 0.12; ctx.fillStyle = PURPLE
      ctx.beginPath(); ctx.arc(cx, cy, 55, 0, Math.PI * 2); ctx.fill(); ctx.restore()
      ctx.save(); ctx.globalAlpha = p * pulse2; ctx.strokeStyle = PURPLE; ctx.lineWidth = 2; ctx.shadowBlur = 12; ctx.shadowColor = PURPLE
      ctx.beginPath(); ctx.arc(cx, cy, 55, 0, Math.PI * 2); ctx.stroke(); ctx.restore()
      gText(type.replace(/_/g, ' '), cx, cy, PURPLE, 13, p)
      break
    }

    // ══════════════════════════════════════════
    // 고등 전용 시각화 (10개 핵심 + fallback)
    // ══════════════════════════════════════════

    case 'exp_func': {
      const sc=28; gLine(30,cy,W-30,cy,'rgba(255,255,255,0.12)',1,p); gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      const base1=v('base',2),base2=v('base2',0.5)
      if(p>0.15){const lp=easeOutCubic((p-0.15)/0.7);ctx.save();ctx.globalAlpha=lp;ctx.strokeStyle=MINT;ctx.lineWidth=2.5;ctx.shadowBlur=12;ctx.shadowColor=MINT;ctx.beginPath();let st=false;for(let x=-5;x<=4;x+=0.1){const y2=Math.pow(base1,x);if(!Number.isFinite(y2))continue;const sx=cx+x*sc,sy=cy-y2*sc*0.5;if(!Number.isFinite(sy)||sy<20||sy>H-20){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()}
      if(p>0.4){const lp2=easeOutCubic((p-0.4)/0.5);ctx.save();ctx.globalAlpha=lp2*0.6;ctx.strokeStyle=PURPLE;ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor=PURPLE;ctx.beginPath();let st2=false;for(let x=-4;x<=5;x+=0.1){const y2=Math.pow(base2,x);if(!Number.isFinite(y2))continue;const sx=cx+x*sc,sy=cy-y2*sc*0.5;if(!Number.isFinite(sy)||sy<20||sy>H-20){st2=false;continue};if(!st2){ctx.moveTo(sx,sy);st2=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()}
      if(p>0.7){gText(`y = ${base1}\u02E3`,cx+3*sc,40,MINT,13,easeOutCubic((p-0.7)/0.3));gText(`y = ${base2}\u02E3`,cx-3*sc,40,PURPLE,13,easeOutCubic((p-0.7)/0.3))}
      break
    }

    case 'log_func': {
      const sc2=28; gLine(30,cy,W-30,cy,'rgba(255,255,255,0.12)',1,p); gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      const logBase=v('base',2)
      if(p>0.15){const lp=easeOutCubic((p-0.15)/0.7);ctx.save();ctx.globalAlpha=lp;ctx.strokeStyle=AMBER;ctx.lineWidth=2.5;ctx.shadowBlur=12;ctx.shadowColor=AMBER;ctx.beginPath();let st=false;for(let x=0.1;x<=8;x+=0.1){const y2=Math.log(x)/Math.log(logBase);const sx=cx+x*sc2*0.6-sc2*2,sy=cy-y2*sc2;if(sy<20||sy>H-20||sx<30){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()}
      if(p>0.5){const dp=easeOutCubic((p-0.5)/0.3);gLine(30,cy-(30-cx)/1+cy,W-30,cy+(W-30-cx)/1-cy,'rgba(255,255,255,0.1)',1,dp)}
      if(p>0.7) gText(`y = log${logBase}x`,W-80,60,AMBER,14,easeOutCubic((p-0.7)/0.3))
      break
    }

    case 'trig_func': {
      const r2=Math.min(70,H/2-25),angle=(T*0.02)%(Math.PI*2)
      gCircle(cx-80,cy,r2,'rgba(255,255,255,0.15)',false,p)
      if(p>0.2){const px=cx-80+Math.cos(angle)*r2,py=cy-Math.sin(angle)*r2;gLine(cx-80,cy,px,py,WHITE,2,p);gCircle(px,py,4,MINT,true,p);gLine(px,cy,px,py,MINT,2,p*0.8);gLine(cx-80,cy,px,cy,PURPLE,2,p*0.8);gText(`sin=${r(Math.sin(angle))}`,cx+50,cy-20,MINT,13,p);gText(`cos=${r(Math.cos(angle))}`,cx+50,cy+20,PURPLE,13,p)}
      break
    }

    case 'trig_graph': {
      const sc3=40,ampScale=v('amp',50); gLine(30,cy,W-30,cy,'rgba(255,255,255,0.12)',1,p); gLine(cx-200,20,cx-200,H-20,'rgba(255,255,255,0.12)',1,p)
      if(p>0.1){const lp=easeOutCubic((p-0.1)/0.8);ctx.save();ctx.globalAlpha=lp;ctx.strokeStyle=MINT;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=MINT;ctx.beginPath();let st=false;const ox=cx-200;for(let x=-1;x<=10;x+=0.05){const sx=ox+x*sc3,sy=cy-Math.sin(x)*ampScale;if(sx<30||sx>W-30){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()}
      if(p>0.7){gText('y = sin x',W-70,40,MINT,14,easeOutCubic((p-0.7)/0.3));gText('2\u03C0',cx-200+Math.PI*2*sc3,cy+16,'rgba(255,255,255,0.4)',11,p)}
      break
    }

    case 'arithmetic_seq': {
      const a0=v('a',2),d=v('d',3),n=v('n',7)
      const maxV=a0+(n-1)*d,barW=Math.min(40,(W-60)/n-6),maxBH=H-70,ox=cx-(n*(barW+6))/2
      for(let i=0;i<n;i++){const val=a0+i*d;const bh=(val/maxV)*maxBH;const x=ox+i*(barW+6);const prog=easeOutCubic(Math.min(1,Math.max(0,p*2-i*0.1)));ctx.save();ctx.globalAlpha=prog*0.85;ctx.fillStyle=MINT+'33';ctx.strokeStyle=MINT;ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor=MINT;ctx.fillRect(x,H-35-bh*prog,barW,bh*prog);ctx.strokeRect(x,H-35-bh*prog,barW,bh*prog);ctx.restore();gText(String(val),x+barW/2,H-20,'rgba(255,255,255,0.5)',10,prog)}
      if(p>0.8) gText(`a\u2099 = ${a0} + (n-1)\u00D7${d}`,cx,26,MINT,14,easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'geometric_seq': {
      const a1=v('a',1),ratio=v('r',2),n2=v('n',7)
      const maxV2=a1*Math.pow(ratio,n2-1),barW2=Math.min(40,(W-60)/n2-6),maxBH2=H-70,ox2=cx-(n2*(barW2+6))/2
      for(let i=0;i<n2;i++){const val=a1*Math.pow(ratio,i);const bh=Math.min(maxBH2,(val/maxV2)*maxBH2);const x=ox2+i*(barW2+6);const prog=easeOutCubic(Math.min(1,Math.max(0,p*2-i*0.1)));ctx.save();ctx.globalAlpha=prog*0.85;ctx.fillStyle=AMBER+'33';ctx.strokeStyle=AMBER;ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor=AMBER;ctx.fillRect(x,H-35-bh*prog,barW2,bh*prog);ctx.strokeRect(x,H-35-bh*prog,barW2,bh*prog);ctx.restore();gText(String(Math.round(val)),x+barW2/2,H-20,'rgba(255,255,255,0.5)',10,prog)}
      if(p>0.8) gText(`a\u2099 = ${a1} \u00D7 ${ratio}^(n-1)`,cx,26,AMBER,14,easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'derivative_coeff': case 'derivative_func': case 'diff_formula': case 'diff_application': case 'max_min': case 'tangent_line': {
      const sc4=35,scY=20,baseY=cy+40
      const dCoeff=v('c',2),dShift=v('shift',2)
      gLine(30,baseY,W-30,baseY,'rgba(255,255,255,0.12)',1,p);gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      if(p>0.15){const cp=easeOutCubic((p-0.15)/0.6);ctx.save();ctx.globalAlpha=cp;ctx.strokeStyle=MINT;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=MINT;ctx.beginPath();let st=false;for(let x=-4;x<=4;x+=0.05){const y=x*x-dShift;const sx=cx+x*sc4,sy=baseY-y*scY;if(sy<20||sy>H-20){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()}
      // 접선
      const ta=((T%300)/300)*6-3
      if(p>0.5){const tp=easeOutCubic((p-0.5)/0.4);const ty=ta*ta-dShift;const slope=dCoeff*ta;const sx=cx+ta*sc4,sy=baseY-ty*scY;gCircle(sx,sy,5,AMBER,true,tp);ctx.save();ctx.globalAlpha=tp*0.7;ctx.strokeStyle=AMBER;ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor=AMBER;ctx.beginPath();ctx.moveTo(sx-60,sy+slope*60*scY/sc4);ctx.lineTo(sx+60,sy-slope*60*scY/sc4);ctx.stroke();ctx.restore();gText(`f'(${r(ta,1)}) = ${r(slope,1)}`,sx+40,sy-20,AMBER,12,tp)}
      break
    }

    case 'definite_integral': case 'indefinite_integral': case 'area_integral': case 'velocity_integral': case 'fundamental_theorem': {
      const sc5=35,scY2=20,baseY2=cy+40
      const iLow=v('a',0),iHigh=v('b',2)
      gLine(30,baseY2,W-30,baseY2,'rgba(255,255,255,0.12)',1,p);gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      if(p>0.1){const cp=easeOutCubic((p-0.1)/0.5);ctx.save();ctx.globalAlpha=cp;ctx.strokeStyle=MINT;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=MINT;ctx.beginPath();let st=false;for(let x=-3;x<=3;x+=0.05){const y=x*x;const sx=cx+x*sc5,sy=baseY2-y*scY2;if(sy<20||sy>H-20){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()}
      // 넓이 채우기 (iLow~iHigh)
      if(p>0.4){const fp=easeOutCubic((p-0.4)/0.5);const nRect=Math.floor(fp*20)+1;const dx=(iHigh-iLow)/nRect;for(let i=0;i<nRect;i++){const x=iLow+i*dx;const y=x*x;const sx=cx+x*sc5,bh=y*scY2;ctx.save();ctx.globalAlpha=0.3*fp;ctx.fillStyle=AMBER;ctx.fillRect(sx,baseY2-bh,dx*sc5,bh);ctx.restore()}}
      if(p>0.8) gText(`\u222B\u2080\u00B2 x\u00B2 dx = ${r(Math.pow(iHigh,3)/3-Math.pow(iLow,3)/3)}`,cx,H-20,MINT,14,easeOutCubic((p-0.8)/0.2))
      break
    }

    case 'normal_dist': {
      const mu=v('mu',0),sigma=v('sigma',1)
      const sc6=50,ampH=H*0.6
      gLine(30,cy+60,W-30,cy+60,'rgba(255,255,255,0.12)',1,p)
      if(p>0.1){const cp=easeOutCubic((p-0.1)/0.7);ctx.save();ctx.globalAlpha=cp;ctx.fillStyle=MINT+'22';ctx.strokeStyle=MINT;ctx.lineWidth=2.5;ctx.shadowBlur=12;ctx.shadowColor=MINT;ctx.beginPath();const baseY3=cy+60;ctx.moveTo(30,baseY3);for(let x=-4;x<=4;x+=0.05){const y=(1/(sigma*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*Math.pow((x-mu)/sigma,2));const sx=cx+x*sc6,sy=baseY3-y*ampH*sigma;if(sx>=30&&sx<=W-30)ctx.lineTo(sx,sy)};ctx.lineTo(W-30,baseY3);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
      if(p>0.6){const fp=easeOutCubic((p-0.6)/0.4);gLine(cx+mu*sc6,cy+60,cx+mu*sc6,40,AMBER,2,fp);gText(`\u03BC=${mu}`,cx+mu*sc6,32,AMBER,12,fp);gText(`\u03C3=${sigma}`,cx+mu*sc6+50,32,PURPLE,12,fp)}
      if(p>0.85) gText('N(\u03BC, \u03C3\u00B2)',cx,H-16,MINT,14,easeOutCubic((p-0.85)/0.15))
      break
    }

    case 'vector_2d': case 'dot_product': {
      const sc7=30
      gLine(30,cy,W-30,cy,'rgba(255,255,255,0.12)',1,p);gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',1,p)
      const vax=v('ax',3),vay=v('ay',2),vbx=v('bx',1),vby=v('by',3)
      if(p>0.2){const vp=easeOutCubic((p-0.2)/0.4);gLine(cx,cy,cx+vax*sc7,cy-vay*sc7,MINT,3,vp);gText('\u20D7a',cx+vax*sc7+10,cy-vay*sc7,MINT,13,vp)}
      if(p>0.4){const vp2=easeOutCubic((p-0.4)/0.4);gLine(cx,cy,cx+vbx*sc7,cy-vby*sc7,PURPLE,3,vp2);gText('\u20D7b',cx+vbx*sc7+10,cy-vby*sc7,PURPLE,13,vp2)}
      if(p>0.65){const sp=easeOutCubic((p-0.65)/0.3);gLine(cx,cy,cx+(vax+vbx)*sc7,cy-(vay+vby)*sc7,AMBER,2.5,sp);gText('\u20D7a+\u20D7b',cx+(vax+vbx)*sc7+10,cy-(vay+vby)*sc7,AMBER,13,sp)}
      break
    }

    // 나머지 고등 케이스: 앰버 원 fallback
    case 'poly_add': case 'poly_mul_h': case 'expand_formula': case 'factor_h':
    case 'remainder_theorem': case 'factor_theorem': case 'complex_number':
    case 'discriminant': case 'vieta': case 'quad_func_eq':
    case 'higher_eq': case 'simul_quad': case 'quad_inequality':
    case 'abs_inequality': case 'counting_h': case 'permutation':
    case 'combination': case 'binomial_theorem': case 'set_operation':
    case 'proposition': case 'function_h': case 'composite_func':
    case 'inverse_func': case 'rational_func': case 'irrational_func':
    case 'arithmetic_sum': case 'geometric_sum': case 'induction':
    case 'exp_log_eq': case 'trig_addition': case 'sine_rule':
    case 'cosine_rule': case 'seq_limit': case 'series': case 'func_limit':
    case 'continuity': case 'prob_addition': case 'conditional_prob':
    case 'independence': case 'discrete_rv': case 'binomial_dist':
    case 'sampling_dist': case 'confidence_interval': case 'proportion_estimate':
    case 'hypothesis_test': case 'line_eq': case 'circle_eq':
    case 'transformation': case 'conic_section': case 'space_vector': {
      const pulse2 = 0.8 + Math.sin(T * 0.04) * 0.2
      ctx.save(); ctx.globalAlpha = p * pulse2 * 0.12; ctx.fillStyle = AMBER
      ctx.beginPath(); ctx.arc(cx, cy, 55, 0, Math.PI * 2); ctx.fill(); ctx.restore()
      ctx.save(); ctx.globalAlpha = p * pulse2; ctx.strokeStyle = AMBER; ctx.lineWidth = 2; ctx.shadowBlur = 12; ctx.shadowColor = AMBER
      ctx.beginPath(); ctx.arc(cx, cy, 55, 0, Math.PI * 2); ctx.stroke(); ctx.restore()
      gText(type.replace(/_/g, ' '), cx, cy, AMBER, 13, p)
      break
    }

    default: {
      const pulse = 0.7 + Math.sin(T * 0.05) * 0.3
      gCircle(cx, cy, 40, MINT, false, pulse)
      gText('\u2211', cx, cy, MINT, 36, p)
      break
    }
  }
}

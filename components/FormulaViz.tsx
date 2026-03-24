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
    const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
    const a = v('a', 3), b = v('b', 4)
    const cell = Math.min(30, Math.min((W - 80) / b, (H - 100) / a))
    const ox = cx - (b * cell) / 2, oy = cy - (a * cell) / 2 - 15

    // ① 곱셈식 등장
    if (p > 0.05) {
      const p1 = easeOutCubic((p - 0.05) / 0.15)
      gText(`① ${a} × ${b} 곱셈표 시작!`, cx, oy - 28, 'rgba(255,255,255,0.7)', 14, p1)
    }

    // ② 격자 테두리 그리기 (격자 선)
    if (p > 0.1) {
      const p2 = easeOutCubic((p - 0.1) / 0.2)
      for (let col = 0; col <= b; col++) {
        gLine(ox + col * cell, oy, ox + col * cell, oy + a * cell, VIO, 1, p2 * 0.4)
      }
      for (let row = 0; row <= a; row++) {
        gLine(ox, oy + row * cell, ox + b * cell, oy + row * cell, VIO, 1, p2 * 0.4)
      }
      gText(`② 가로 ${b}칸, 세로 ${a}줄 격자`, cx, oy - 14, VIO, 13, p2)
    }

    // ③ 격자가 줄 단위로 채워짐
    for (let row = 0; row < a; row++) {
      const rowP = easeOutCubic(Math.min(1, Math.max(0, (p - 0.2) * (a + 1) - row * 0.8)))
      for (let col = 0; col < b; col++) {
        const idx = row * b + col + 1
        const prog = rowP * easeOutElastic(Math.min(1, Math.max(0, rowP * 2 - col * 0.15)))
        ctx.save(); ctx.globalAlpha = prog * 0.85
        ctx.fillStyle = VIO + '44'; ctx.strokeStyle = VIO; ctx.lineWidth = 1.5
        ctx.shadowBlur = 5; ctx.shadowColor = VIO
        ctx.fillRect(ox + col * cell + 1, oy + row * cell + 1, cell - 2, cell - 2)
        ctx.strokeRect(ox + col * cell + 1, oy + row * cell + 1, cell - 2, cell - 2)
        ctx.restore()
        if (prog > 0.5) gText(String(idx), ox + col * cell + cell / 2, oy + row * cell + cell / 2, 'rgba(255,255,255,0.5)', Math.min(11, cell - 6), prog)
      }
    }

    // ④ 교차점(꼭짓점)에 원 표시
    if (p > 0.55) {
      const p4 = easeOutCubic((p - 0.55) / 0.2)
      for (let row = 0; row <= a; row++) {
        for (let col = 0; col <= b; col++) {
          gCircle(ox + col * cell, oy + row * cell, 3, ORG, true, p4 * 0.6)
        }
      }
      gText(`④ 교차점 ${(a+1)*(b+1)}개 확인`, cx, oy + a * cell + 14, ORG, 12, p4)
    }

    // ⑤ 결과 강조
    if (p > 0.78) {
      const p5 = easeOutCubic((p - 0.78) / 0.22)
      gLine(ox - 4, oy - 4, ox + b * cell + 4, oy - 4, GRN, 2, p5)
      gLine(ox - 4, oy - 4, ox - 4, oy + a * cell + 4, GRN, 2, p5)
      gLine(ox + b * cell + 4, oy - 4, ox + b * cell + 4, oy + a * cell + 4, GRN, 2, p5)
      gLine(ox - 4, oy + a * cell + 4, ox + b * cell + 4, oy + a * cell + 4, GRN, 2, p5)
      gCircle(cx, oy + a * cell + 34, 18, GRN, true, p5 * 0.3)
      gText(`⑤ ${a} × ${b} = ${a * b}`, cx, oy + a * cell + 34, GRN, 18, p5)
    }
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
    const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
    const numer = v('a', 3), denom = v('b', 4)
    const r2 = Math.min(65, H / 2 - 30)

    // ① 원형 피자 등장
    if (p > 0.02) {
      const p1 = easeOutCubic((p - 0.02) / 0.18)
      ctx.save(); ctx.globalAlpha = p1 * 0.15; ctx.fillStyle = 'rgba(255,255,255,1)'
      ctx.beginPath(); ctx.arc(cx, cy, r2, 0, Math.PI * 2); ctx.fill(); ctx.restore()
      ctx.save(); ctx.globalAlpha = p1 * 0.5; ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.arc(cx, cy, r2, 0, Math.PI * 2); ctx.stroke(); ctx.restore()
      gCircle(cx, cy, r2, 'rgba(255,255,255,0.3)', false, p1 * 0.4)
      gText(`① 원을 ${denom}등분 해보자!`, cx, cy - r2 - 18, 'rgba(255,255,255,0.7)', 14, p1)
    }

    // ② 분수선(지름선) 표시
    if (p > 0.15) {
      const p2 = easeOutCubic((p - 0.15) / 0.15)
      gLine(cx - r2, cy, cx + r2, cy, ORG, 2, p2 * 0.5)
      gLine(cx, cy - r2, cx, cy + r2, ORG, 2, p2 * 0.5)
      gText(`② 기준선 긋기`, cx, cy + r2 + 14, ORG, 12, p2)
    }

    // ③ 칼선 — denom등분
    for (let i = 0; i < denom; i++) {
      const cutP = easeOutCubic(Math.min(1, Math.max(0, (p - 0.28) * 3 - i * 0.15)))
      const angle = -Math.PI / 2 + (i / denom) * Math.PI * 2
      gLine(cx, cy, cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2, 'rgba(255,255,255,0.35)', 1.5, cutP)
    }
    if (p > 0.3) {
      const p3 = easeOutCubic((p - 0.3) / 0.15)
      gText(`③ ${denom}조각으로 나누기`, cx, cy + r2 + 28, 'rgba(255,255,255,0.6)', 12, p3)
    }

    // ④ 조각 채우기 — numer개
    for (let i = 0; i < denom; i++) {
      const filled = i < numer
      if (!filled) continue
      const fillP = easeOutCubic(Math.min(1, Math.max(0, (p - 0.45) * 2.5 - i * 0.1)))
      const a1 = -Math.PI / 2 + (i / denom) * Math.PI * 2
      const a2 = -Math.PI / 2 + ((i + 1) / denom) * Math.PI * 2
      ctx.save(); ctx.globalAlpha = fillP * 0.65; ctx.fillStyle = VIO
      ctx.shadowBlur = 10; ctx.shadowColor = VIO
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r2 - 2, a1, a2); ctx.closePath(); ctx.fill(); ctx.restore()
      // 조각 중심에 원 점
      if (fillP > 0.5) {
        const midA = (a1 + a2) / 2
        gCircle(cx + Math.cos(midA) * r2 * 0.6, cy + Math.sin(midA) * r2 * 0.6, 5, GRN, true, fillP * 0.8)
      }
    }
    if (p > 0.5) {
      const p4 = easeOutCubic((p - 0.5) / 0.2)
      gText(`④ ${numer}조각 색칠 완료!`, cx, cy + r2 + 42, VIO, 13, p4)
    }

    // ⑤ 분수 표시 + 설명
    if (p > 0.7) {
      const fp = easeOutCubic((p - 0.7) / 0.3)
      // 분수 표시선 (분자/분모 구분선)
      gLine(cx + r2 + 20, cy - 12, cx + r2 + 60, cy - 12, GRN, 2, fp)
      // 원 테두리 강조
      gLine(cx - r2, cy - r2, cx + r2, cy - r2, VIO, 1, fp * 0.3)
      gLine(cx - r2, cy + r2, cx + r2, cy + r2, VIO, 1, fp * 0.3)
      gLine(cx - r2, cy - r2, cx - r2, cy + r2, VIO, 1, fp * 0.3)
      gLine(cx + r2, cy - r2, cx + r2, cy + r2, VIO, 1, fp * 0.3)
      gCircle(cx + r2 + 40, cy - 12, 3, GRN, true, fp * 0.6)
      gText(`${numer}`, cx + r2 + 40, cy - 24, GRN, 20, fp)
      gText(`${denom}`, cx + r2 + 40, cy + 2, GRN, 20, fp)
      gText(`⑤ 분수 ${numer}/${denom} — ${denom}조각 중 ${numer}조각`, cx, cy + r2 + 58, GRN, 13, fp)
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
    const VIO='#534AB7', GRN='#1D9E75', ORG='#D85A30'
    const numBase=v('a',4), denomBase=v('b',8)
    const gcdFn=(x:number,y:number):number=>y===0?x:gcdFn(y,x%y)
    const gcdVal=gcdFn(numBase,denomBase)
    const fracs: [number,number][] = [[numBase,denomBase],[numBase/Math.max(1,gcdVal/2),(denomBase/Math.max(1,gcdVal/2))],[numBase/gcdVal,denomBase/gcdVal]]
    const safeFracs=fracs.map(([n,d])=>[Math.round(n),Math.round(d)] as [number,number])
    const rr=Math.min(48,(W-40)/(safeFracs.length*2.8))

    // ① 첫 번째 분수 원형 등장
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.18)
      gText(`① 분수 ${safeFracs[0][0]}/${safeFracs[0][1]} 시작`,cx,cy-rr-32,VIO,14,p1)
    }

    safeFracs.forEach(([n,d],idx)=>{
      const prog=easeOutCubic(Math.min(1,Math.max(0,(p-0.05)*2.5-idx*0.55)))
      const px=cx+(idx-1)*(rr*2+36),py=cy-8
      // 원
      ctx.save();ctx.globalAlpha=prog*0.2;ctx.fillStyle='rgba(255,255,255,1)';ctx.beginPath();ctx.arc(px,py,rr,0,Math.PI*2);ctx.fill();ctx.restore()
      ctx.save();ctx.globalAlpha=prog*0.5;ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(px,py,rr,0,Math.PI*2);ctx.stroke();ctx.restore()
      for(let i=0;i<d;i++){
        const a1=-Math.PI/2+(i/d)*Math.PI*2,a2=-Math.PI/2+((i+1)/d)*Math.PI*2
        // 분수선(피자 칼선)
        gLine(px,py,px+Math.cos(a1)*rr,py+Math.sin(a1)*rr,'rgba(255,255,255,0.3)',1,prog)
        if(i<n){
          ctx.save();ctx.globalAlpha=prog*0.6;ctx.fillStyle=[VIO,ORG,GRN][idx];ctx.beginPath();ctx.moveTo(px,py);ctx.arc(px,py,rr-1,a1,a2);ctx.closePath();ctx.fill();ctx.restore()
          // 조각마다 작은 원
          if(prog>0.5){
            const midA=(a1+a2)/2
            gCircle(px+Math.cos(midA)*rr*0.62,py+Math.sin(midA)*rr*0.62,4,[VIO,ORG,GRN][idx],true,prog*0.7)
          }
        }
      }
      gText(`${n}/${d}`,px,py+rr+16,[VIO,ORG,GRN][idx],15,prog)
    })

    // ② 연결 화살표 선
    if(p>0.35){
      const p2=easeOutCubic((p-0.35)/0.2)
      gLine(cx-(rr+4),cy-8,cx-(rr*2+20),cy-8,'rgba(255,255,255,0.3)',1.5,p2)
      gLine(cx+(rr+4),cy-8,cx+(rr*2+20),cy-8,'rgba(255,255,255,0.3)',1.5,p2)
      gText(`② 약분 →`,cx-(rr+30),cy-24,ORG,11,p2)
      gText(`→ 약분`,cx+(rr+10),cy-24,ORG,11,p2)
    }

    // ③ 등호 선 연결
    if(p>0.55){
      const p3=easeOutCubic((p-0.55)/0.2)
      gLine(cx-(rr*3+36),cy+rr+30,cx+(rr*3+36),cy+rr+30,GRN,1.5,p3*0.4)
      gText(`③ 크기가 모두 같아!`,cx,cy+rr+30,GRN,13,p3)
    }

    // ④ 세로 기준선
    if(p>0.68){
      const p4=easeOutCubic((p-0.68)/0.2)
      for(let i=0;i<safeFracs.length;i++){
        const px=cx+(i-1)*(rr*2+36)
        gLine(px,cy-rr-10,px,cy+rr+10,'rgba(255,255,255,0.15)',1,p4)
      }
      gText(`④ 분모×분자 동시에 나누기 = 약분`,cx,cy+rr+44,ORG,12,p4)
    }

    // ⑤ 최종 결과
    if(p>0.82){
      const p5=easeOutCubic((p-0.82)/0.18)
      gCircle(cx+(rr*2+36),cy-8,rr+6,GRN,false,p5*0.6)
      gText(`⑤ 기약분수: ${safeFracs[2][0]}/${safeFracs[2][1]}`,cx,H-18,GRN,15,p5)
    }
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
    const fn1=v('a',2),fd1=v('b',3),fn2=v('c',1),fd2=v('d',4)
    const resultN=fn1*fd2, resultD=fd1*fn2

    // ① 원래 나눗셈 식 등장
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.18)
      gText(`① ${fn1}/${fd1} ÷ ${fn2}/${fd2}`,cx,cy-80,WHITE,22,p1)
      // 왼쪽 분수 시각 막대
      const bW=120,bH=22,bx=cx-bW/2,by=cy-56
      gLine(bx,by,bx+bW,by,'rgba(255,255,255,0.2)',1,p1)
      gLine(bx,by+bH,bx+bW,by+bH,'rgba(255,255,255,0.2)',1,p1)
      gLine(bx,by,bx,by+bH,'rgba(255,255,255,0.2)',1,p1)
      gLine(bx+bW,by,bx+bW,by+bH,'rgba(255,255,255,0.2)',1,p1)
      ctx.save();ctx.globalAlpha=p1*0.4;ctx.fillStyle=VIO;ctx.fillRect(bx+1,by+1,(bW*fn1/fd1)-2,bH-2);ctx.restore()
    }

    // ② 분수 나눗셈 → 역수 곱셈 변환
    if(p>0.18){
      const p2=easeOutCubic((p-0.18)/0.2)
      gText(`② ÷ 는 뒤집어서 × 로!`,cx,cy-28,VIO,16,p2)
      gLine(cx-80,cy-12,cx+80,cy-12,VIO,1.5,p2*0.5)
      // 뒤집기 회전 호
      ctx.save();ctx.globalAlpha=p2*0.6;ctx.strokeStyle=ORG;ctx.lineWidth=2.5
      ctx.beginPath();ctx.arc(cx+60,cy-38,14,-Math.PI*0.2,Math.PI*1.3);ctx.stroke()
      ctx.restore()
      gText(`${fn2}/${fd2} → ${fd2}/${fn2}`,cx+60,cy-20,ORG,13,p2)
    }

    // ③ 역수로 변환된 식
    if(p>0.38){
      const p3=easeOutCubic((p-0.38)/0.2)
      gText(`③ ${fn1}/${fd1} × ${fd2}/${fn2}`,cx,cy+10,GRN,20,p3)
      // 연결 선
      gLine(cx-60,cy+22,cx+60,cy+22,GRN,1.5,p3*0.4)
      gLine(cx-60,cy-70,cx-60,cy+22,GRN,1.5,p3*0.3)
    }

    // ④ 분자×분자, 분모×분모 계산
    if(p>0.55){
      const p4=easeOutCubic((p-0.55)/0.2)
      gLine(cx-50,cy+40,cx+50,cy+40,'rgba(255,255,255,0.3)',1.5,p4)
      gText(`④ 분자: ${fn1}×${fd2}=${resultN}`,cx-40,cy+35,VIO,13,p4)
      gText(`분모: ${fd1}×${fn2}=${resultD}`,cx+40,cy+55,ORG,13,p4)
      gCircle(cx-40,cy+35,3,VIO,true,p4)
      gCircle(cx+40,cy+55,3,ORG,true,p4)
    }

    // ⑤ 최종 결과
    if(p>0.75){
      const p5=easeOutCubic((p-0.75)/0.25)
      gCircle(cx,cy+88,26,GRN,true,p5*0.25)
      gText(`⑤ = ${resultN}/${resultD}`,cx,cy+88,GRN,22,p5)
      gLine(cx-80,cy+70,cx+80,cy+70,GRN,1.5,p5*0.5)
      gLine(cx-80,cy+105,cx+80,cy+105,GRN,1.5,p5*0.5)
    }
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
    const dividend=v('a',1.2), divisor=v('b',0.3)
    const mult=10, bigDividend=Math.round(dividend*mult), bigDivisor=Math.round(divisor*mult)
    const result=Math.round(bigDividend/bigDivisor)

    // ① 원래 소수 나눗셈 식
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.18)
      gText(`① ${dividend} ÷ ${divisor}`,cx,cy-90,WHITE,22,p1)
      // 소수점 위치 강조선
      gLine(cx-10,cy-78,cx-10,cy-65,ORG,2,p1*0.6)
      gLine(cx+32,cy-78,cx+32,cy-65,ORG,2,p1*0.6)
    }

    // ② ×10 변환 시각화
    if(p>0.18){
      const p2=easeOutCubic((p-0.18)/0.22)
      gText(`② 양쪽에 ×${mult} 하기`,cx,cy-54,VIO,16,p2)
      // 양방향 화살표
      gLine(cx-80,cy-42,cx-20,cy-30,VIO,2,p2*0.7)
      gLine(cx+80,cy-42,cx+20,cy-30,VIO,2,p2*0.7)
      gCircle(cx-80,cy-42,4,VIO,true,p2*0.7)
      gCircle(cx+80,cy-42,4,VIO,true,p2*0.7)
      gText(`×${mult}`,cx-60,cy-50,VIO,12,p2)
      gText(`×${mult}`,cx+60,cy-50,VIO,12,p2)
    }

    // ③ 변환된 정수 나눗셈
    if(p>0.38){
      const p3=easeOutCubic((p-0.38)/0.2)
      gText(`③ ${bigDividend} ÷ ${bigDivisor}`,cx,cy-14,GRN,20,p3)
      gLine(cx-70,cy-2,cx+70,cy-2,GRN,1.5,p3*0.4)
    }

    // ④ 블록으로 나누기 시각화
    if(p>0.52){
      const p4=easeOutCubic((p-0.52)/0.25)
      const bsz=16,gap3=4
      const colors=[VIO,GRN,ORG,'#D85A30']
      for(let g=0;g<bigDivisor;g++){
        const color=colors[g%4]
        const perGroup=Math.floor(bigDividend/bigDivisor)
        for(let i=0;i<perGroup;i++){
          const x=cx-((bigDividend/2)*(bsz+gap3))+(g*perGroup+i)*(bsz+gap3)
          ctx.save();ctx.globalAlpha=p4*0.75;ctx.fillStyle=color+'55';ctx.strokeStyle=color;ctx.lineWidth=1.5
          ctx.fillRect(x,cy+18,bsz,bsz);ctx.strokeRect(x,cy+18,bsz,bsz);ctx.restore()
        }
        // 그룹 구분선
        const gx=cx-((bigDividend/2)*(bsz+gap3))+(g*Math.floor(bigDividend/bigDivisor))*(bsz+gap3)-2
        gLine(gx,cy+14,gx,cy+40,ORG,2,p4*0.7)
        gCircle(gx,cy+14,3,ORG,true,p4*0.7)
      }
      gText(`④ ${bigDividend}개를 ${bigDivisor}묶음으로`,cx,cy+46,ORG,13,p4)
    }

    // ⑤ 최종 결과
    if(p>0.75){
      const p5=easeOutCubic((p-0.75)/0.25)
      gLine(cx-90,cy+64,cx+90,cy+64,GRN,2,p5*0.6)
      gCircle(cx,cy+80,20,GRN,true,p5*0.25)
      gText(`⑤ ${dividend} ÷ ${divisor} = ${result}`,cx,cy+80,GRN,18,p5)
    }
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
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const pct=Math.round(Math.min(99,Math.max(1,v('a',0.25)*100)))
    const cols=10,cellSz=Math.min((W-80)/cols,(H-100)/cols)
    const ox=cx-(cols*cellSz)/2,oy=cy-(cols*cellSz)/2-10

    // ① 제목
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.13)
      gText(`① 100칸 격자로 백분율 이해하기`,cx,oy-22,VIO,13,p1)
    }

    // ② 100칸 격자 + 행/열 구분선
    if(p>0.12){
      const p2=easeOutCubic((p-0.12)/0.18)
      // 격자 세로선 (열)
      for(let col=0;col<=cols;col++){
        gLine(ox+col*cellSz, oy, ox+col*cellSz, oy+cols*cellSz, 'rgba(255,255,255,0.15)', 1, p2*0.5)
      }
      // 격자 가로선 (행)
      for(let row=0;row<=cols;row++){
        gLine(ox, oy+row*cellSz, ox+cols*cellSz, oy+row*cellSz, 'rgba(255,255,255,0.15)', 1, p2*0.5)
      }
      gText(`② 전체 100칸`,cx,oy+cols*cellSz+14,ORG,12,p2)
    }

    // ③ 칸 채우기
    for(let i=0;i<100;i++){
      const row=Math.floor(i/cols),col=i%cols
      const filled=i<pct
      const prog=easeOutCubic(Math.min(1,Math.max(0,(p-0.25)*2.5-(i/100)*0.5)))
      ctx.save();ctx.globalAlpha=prog*(filled?0.72:0.1)
      ctx.fillStyle=filled?VIO+'88':'rgba(255,255,255,0.05)'
      ctx.strokeStyle=filled?VIO:'rgba(255,255,255,0.07)'
      ctx.lineWidth=1;ctx.shadowBlur=filled?4:0;ctx.shadowColor=VIO
      ctx.fillRect(ox+col*cellSz+1,oy+row*cellSz+1,cellSz-2,cellSz-2)
      ctx.strokeRect(ox+col*cellSz+1,oy+row*cellSz+1,cellSz-2,cellSz-2);ctx.restore()
    }
    if(p>0.3){
      const p3=easeOutCubic((p-0.3)/0.2)
      gText(`③ ${pct}칸 채우는 중...`,cx,oy+cols*cellSz+28,VIO,13,p3)
    }

    // ④ 채워진 영역 테두리 강조
    if(p>0.55){
      const p4=easeOutCubic((p-0.55)/0.2)
      const filledCols=pct%cols, filledRows=Math.floor(pct/cols)
      gLine(ox,oy,ox+cols*cellSz,oy,GRN,2,p4*0.6)
      gLine(ox,oy,ox,oy+filledRows*cellSz,GRN,2,p4*0.6)
      if(filledCols>0) gLine(ox,oy+filledRows*cellSz,ox+filledCols*cellSz,oy+filledRows*cellSz,GRN,2,p4*0.6)
      // 모서리 원
      gCircle(ox,oy,5,GRN,true,p4*0.7)
      gCircle(ox+cols*cellSz,oy,5,GRN,true,p4*0.7)
      gText(`④ ${pct}칸 = 전체의 ${pct}/100`,cx,oy+cols*cellSz+42,GRN,13,p4)
    }

    // ⑤ 최종 백분율
    if(p>0.75){
      const p5=easeOutCubic((p-0.75)/0.25)
      gLine(cx-80,oy+cols*cellSz+58,cx+80,oy+cols*cellSz+58,GRN,1.5,p5*0.5)
      gCircle(cx,oy+cols*cellSz+72,16,GRN,true,p5*0.25)
      gText(`⑤ ${pct}/100 = ${pct}%`,cx,oy+cols*cellSz+72,GRN,18,p5)
    }
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
    const armLen=Math.min(88,W*0.28)
    const pivotX=cx,pivotY=cy+10
    const targetDeg=v('deg',90)

    // ① 꼭짓점 + 고정 반직선 등장
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.18)
      gLine(pivotX,pivotY,pivotX+armLen,pivotY,'rgba(255,255,255,0.5)',2.5,p1)
      gCircle(pivotX,pivotY,5,WHITE,true,p1*0.7)
      gText(`① 기준 반직선`,pivotX+armLen/2,pivotY+16,VIO,12,p1)
    }

    // ② 각도 호 + 회전 반직선
    const currentDeg=targetDeg*easeOutCubic(Math.min(1,Math.max(0,(p-0.15)/0.55)))
    const rad=currentDeg*Math.PI/180
    const endX=pivotX+Math.cos(-rad)*armLen,endY=pivotY+Math.sin(-rad)*armLen

    if(p>0.15){
      const p2=easeOutCubic((p-0.15)/0.2)
      gLine(pivotX,pivotY,endX,endY,GRN,3,p2)
      // 각도 호
      ctx.save();ctx.globalAlpha=p2*0.55;ctx.strokeStyle=ORG;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=ORG
      ctx.beginPath();ctx.arc(pivotX,pivotY,36,0,-rad,true);ctx.stroke();ctx.restore()
      gText(`${Math.round(currentDeg)}°`,pivotX+46,pivotY-24,ORG,16,p2)
      gText(`② 반직선 회전`,cx,pivotY-armLen-12,GRN,12,p2)
    }

    // ③ 분도기 눈금선 (각도 눈금)
    if(p>0.32){
      const p3=easeOutCubic((p-0.32)/0.2)
      for(let deg=0;deg<=180;deg+=30){
        const gr=deg*Math.PI/180
        const ix=pivotX+Math.cos(-gr)*armLen*0.88, iy=pivotY+Math.sin(-gr)*armLen*0.88
        const ox2=pivotX+Math.cos(-gr)*(armLen+6), oy2=pivotY+Math.sin(-gr)*(armLen+6)
        gLine(ix,iy,ox2,oy2,ORG,1.5,p3*0.5)
        gText(`${deg}°`,ox2+(deg===0?8:deg===180?-8:0),oy2+4,'rgba(255,255,255,0.35)',9,p3)
      }
      gText(`③ 분도기 눈금`,pivotX-armLen,pivotY+22,ORG,11,p3)
    }

    // ④ 직각 표시 / 특수각 이름
    if(p>0.52){
      const p4=easeOutCubic((p-0.52)/0.22)
      const isRight=Math.abs(currentDeg-90)<5
      const isFlat=Math.abs(currentDeg-180)<5
      if(isRight){
        const sq=13
        ctx.save();ctx.globalAlpha=p4*0.7;ctx.strokeStyle=VIO;ctx.lineWidth=2.5
        ctx.strokeRect(pivotX,pivotY-sq,sq,sq);ctx.restore()
        gText(`직각!`,pivotX+armLen*0.5,pivotY-armLen*0.5,VIO,14,p4)
      }
      if(isFlat) gText(`평각!`,pivotX,pivotY-armLen*0.3,VIO,14,p4)
      gLine(pivotX-armLen-8,pivotY,pivotX+armLen+8,pivotY,'rgba(255,255,255,0.2)',1,p4*0.5)
      gText(`④ ${Math.round(currentDeg)}° 각도 확인`,cx,pivotY+armLen*0.7,ORG,13,p4)
    }

    // ⑤ 각도 설명 + 시작/끝 점 표시
    if(p>0.75){
      const p5=easeOutCubic((p-0.75)/0.25)
      gCircle(pivotX+armLen,pivotY,6,WHITE,true,p5*0.6)
      gCircle(endX,endY,6,GRN,true,p5*0.6)
      gLine(pivotX+armLen,pivotY-4,endX,endY-4,ORG,1,p5*0.3)
      gText(`⑤ 각도 = ${Math.round(currentDeg)}° 완성!`,cx,pivotY+38,GRN,14,p5)
    }
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
    const sc=Math.min(28,Math.min((W-80)/w2,(H-90)/h2))
    const rx=cx-w2*sc/2,ry=cy-h2*sc/2-14

    // ① 직사각형 윤곽 등장
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.18)
      ctx.save();ctx.globalAlpha=p1*0.7;ctx.strokeStyle='rgba(255,255,255,0.45)';ctx.lineWidth=2.5;ctx.strokeRect(rx,ry,w2*sc,h2*sc);ctx.restore()
      // 꼭짓점 원
      gCircle(rx,ry,5,WHITE,true,p1*0.6)
      gCircle(rx+w2*sc,ry,5,WHITE,true,p1*0.6)
      gCircle(rx+w2*sc,ry+h2*sc,5,WHITE,true,p1*0.6)
      gCircle(rx,ry+h2*sc,5,WHITE,true,p1*0.6)
      gText(`① 직사각형 가로=${w2}, 세로=${h2}`,cx,ry-16,VIO,13,p1)
    }

    // ② 변 길이 라벨
    if(p>0.18){
      const p2=easeOutCubic((p-0.18)/0.2)
      gLine(rx,ry-10,rx+w2*sc,ry-10,VIO,2,p2*0.6)
      gLine(rx+w2*sc+10,ry,rx+w2*sc+10,ry+h2*sc,GRN,2,p2*0.6)
      gLine(rx,ry+h2*sc+10,rx+w2*sc,ry+h2*sc+10,VIO,2,p2*0.6)
      gLine(rx-10,ry,rx-10,ry+h2*sc,GRN,2,p2*0.6)
      gText(`${w2}`,cx,ry-22,VIO,13,p2)
      gText(`${h2}`,rx+w2*sc+22,cy-14,GRN,13,p2)
      gText(`② 4변 길이 확인`,cx,ry+h2*sc+24,VIO,12,p2)
    }

    const perim=2*(w2+h2)*sc,dist=p*perim
    const corners=[[rx,ry],[rx+w2*sc,ry],[rx+w2*sc,ry+h2*sc],[rx,ry+h2*sc]]
    const edges=[w2*sc,h2*sc,w2*sc,h2*sc]
    const edgeColors=[VIO,GRN,VIO,GRN]

    // ③ 개미 이동 경로 색칠
    let rem=dist
    for(let i=0;i<4&&rem>0;i++){
      const len=edges[i];const drawn=Math.min(rem,len)
      const [sx,sy]=corners[i];const [ex,ey]=corners[(i+1)%4]
      const dx=(ex-sx)/len,dy=(ey-sy)/len
      gLine(sx,sy,sx+dx*drawn,sy+dy*drawn,edgeColors[i],4,0.85)
      rem-=len
    }
    if(p>0.22) gText(`③ 개미가 둘레 따라 이동!`,cx,ry+h2*sc+38,ORG,12,easeOutCubic((p-0.22)/0.2))

    // ④ 개미(이동 점)
    if(p<0.98){
      let rem2=dist
      for(let i=0;i<4;i++){
        if(rem2<=edges[i]){
          const [sx,sy]=corners[i];const [ex,ey]=corners[(i+1)%4];const t=rem2/edges[i]
          gCircle(sx+(ex-sx)*t,sy+(ey-sy)*t,7,ORG,true,0.95)
          break
        }
        rem2-=edges[i]
      }
    }
    if(p>0.45) gText(`④ 지나간 거리 = ${r(p*2*(w2+h2),1)}`,cx,ry+h2*sc+52,ORG,12,easeOutCubic((p-0.45)/0.2))

    // ⑤ 둘레 공식 + 결과
    if(p>0.78){
      const p5=easeOutCubic((p-0.78)/0.22)
      gLine(cx-90,ry+h2*sc+66,cx+90,ry+h2*sc+66,GRN,1.5,p5*0.5)
      gCircle(cx,ry+h2*sc+78,18,GRN,true,p5*0.25)
      gText(`⑤ (${w2}+${h2})×2 = ${2*(w2+h2)}`,cx,ry+h2*sc+78,GRN,16,p5)
    }
    break
  }

  case 'area_rect': {
    // E032: 직사각형 넓이 — 격자 채우기
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const w2=v('a',5),h2=v('b',3)
    const cell=Math.min(28,Math.min((W-70)/w2,(H-90)/h2))
    const ox=cx-w2*cell/2,oy=cy-h2*cell/2-12

    // ① 직사각형 외곽선 등장
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.18)
      ctx.save();ctx.globalAlpha=p1*0.6;ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=2.5;ctx.strokeRect(ox,oy,w2*cell,h2*cell);ctx.restore()
      gText(`① 가로 ${w2}, 세로 ${h2}`,cx,oy-18,VIO,13,p1)
      // 가로/세로 라벨선
      gLine(ox,oy-8,ox+w2*cell,oy-8,VIO,2,p1*0.5)
      gLine(ox-8,oy,ox-8,oy+h2*cell,GRN,2,p1*0.5)
    }

    // ② 격자 세로/가로선 먼저 그리기
    if(p>0.15){
      const p2=easeOutCubic((p-0.15)/0.2)
      for(let col=0;col<=w2;col++) gLine(ox+col*cell,oy,ox+col*cell,oy+h2*cell,ORG,1,p2*0.3)
      for(let row=0;row<=h2;row++) gLine(ox,oy+row*cell,ox+w2*cell,oy+row*cell,ORG,1,p2*0.3)
      gText(`② 격자 ${w2}×${h2}`,cx,oy+h2*cell+15,ORG,12,p2)
    }

    // ③ 격자 셀 채우기 (행 단위)
    for(let row=0;row<h2;row++){
      const rowP=easeOutCubic(Math.min(1,Math.max(0,(p-0.28)*(h2+1)-row*0.7)))
      for(let col=0;col<w2;col++){
        const prog=rowP*easeOutCubic(Math.min(1,Math.max(0,rowP*2-col*0.12)))
        ctx.save();ctx.globalAlpha=prog*0.72;ctx.fillStyle=VIO+'55';ctx.strokeStyle=VIO;ctx.lineWidth=1.5
        ctx.fillRect(ox+col*cell+1,oy+row*cell+1,cell-2,cell-2);ctx.strokeRect(ox+col*cell+1,oy+row*cell+1,cell-2,cell-2);ctx.restore()
        if(prog>0.5){const idx=row*w2+col+1;gText(String(idx),ox+col*cell+cell/2,oy+row*cell+cell/2,'rgba(255,255,255,0.45)',Math.min(10,cell-8),prog)}
      }
    }
    if(p>0.35) gText(`③ 칸 하나씩 채우기`,cx,oy+h2*cell+29,VIO,12,easeOutCubic((p-0.35)/0.2))

    // ④ 꼭짓점 강조 원
    if(p>0.58){
      const p4=easeOutCubic((p-0.58)/0.22)
      gCircle(ox,oy,6,GRN,true,p4*0.7)
      gCircle(ox+w2*cell,oy,6,GRN,true,p4*0.7)
      gCircle(ox,oy+h2*cell,6,GRN,true,p4*0.7)
      gCircle(ox+w2*cell,oy+h2*cell,6,GRN,true,p4*0.7)
      gText(`④ 총 ${w2*h2}칸!`,cx,oy+h2*cell+43,GRN,13,p4)
    }

    // ⑤ 수식 결과
    if(p>0.78){
      const p5=easeOutCubic((p-0.78)/0.22)
      gLine(cx-80,oy+h2*cell+56,cx+80,oy+h2*cell+56,GRN,1.5,p5*0.5)
      gText(`⑤ ${w2} × ${h2} = ${w2*h2}`,cx,oy+h2*cell+68,GRN,18,p5)
    }
    break
  }

  case 'area_square': {
    // E033: 정사각형 넓이 — 격자 + 제곱
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const a2=v('a',4)
    const cell=Math.min(26,Math.min((W-70)/a2,(H-95)/a2))
    const ox=cx-a2*cell/2,oy=cy-a2*cell/2-14

    // ① 정사각형 소개
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.18)
      gText(`① 한 변이 ${a2}인 정사각형`,cx,oy-20,VIO,13,p1)
      // 변 길이 라벨선
      gLine(ox,oy-10,ox+a2*cell,oy-10,VIO,2,p1*0.5)
      gLine(ox-10,oy,ox-10,oy+a2*cell,VIO,2,p1*0.5)
      gText(`${a2}`,cx,oy-22,VIO,13,p1)
      gText(`${a2}`,ox-22,cy-14,VIO,13,p1)
    }

    // ② 격자선 그리기
    if(p>0.15){
      const p2=easeOutCubic((p-0.15)/0.18)
      for(let col=0;col<=a2;col++) gLine(ox+col*cell,oy,ox+col*cell,oy+a2*cell,ORG,1,p2*0.35)
      for(let row=0;row<=a2;row++) gLine(ox,oy+row*cell,ox+a2*cell,oy+row*cell,ORG,1,p2*0.35)
      gText(`② 격자 ${a2}×${a2}`,cx,oy+a2*cell+14,ORG,12,p2)
    }

    // ③ 격자 셀 채우기
    for(let row=0;row<a2;row++) for(let col=0;col<a2;col++){
      const idx=row*a2+col
      const prog=easeOutElastic(Math.min(1,Math.max(0,(p-0.28)*2.2-(idx/(a2*a2))*0.6)))
      ctx.save();ctx.globalAlpha=prog*0.72;ctx.fillStyle=VIO+'55';ctx.strokeStyle=VIO;ctx.lineWidth=1.5
      ctx.fillRect(ox+col*cell+1,oy+row*cell+1,cell-2,cell-2);ctx.strokeRect(ox+col*cell+1,oy+row*cell+1,cell-2,cell-2);ctx.restore()
    }
    if(p>0.3) gText(`③ ${a2*a2}칸 채우기`,cx,oy+a2*cell+28,VIO,12,easeOutCubic((p-0.3)/0.2))

    // ④ 외곽선 강조 + 꼭짓점 원
    if(p>0.55){
      const p4=easeOutCubic((p-0.55)/0.22)
      ctx.save();ctx.globalAlpha=p4*0.85;ctx.strokeStyle=GRN;ctx.lineWidth=3;ctx.shadowBlur=12;ctx.shadowColor=GRN;ctx.strokeRect(ox,oy,a2*cell,a2*cell);ctx.restore()
      gCircle(ox,oy,6,GRN,true,p4*0.7)
      gCircle(ox+a2*cell,oy,6,GRN,true,p4*0.7)
      gCircle(ox,oy+a2*cell,6,GRN,true,p4*0.7)
      gCircle(ox+a2*cell,oy+a2*cell,6,GRN,true,p4*0.7)
      gText(`④ 넓이 = ${a2}² = ${a2*a2}`,cx,oy+a2*cell+42,GRN,13,p4)
    }

    // ⑤ 제곱 공식
    if(p>0.78){
      const p5=easeOutCubic((p-0.78)/0.22)
      gLine(cx-80,oy+a2*cell+55,cx+80,oy+a2*cell+55,GRN,1.5,p5*0.5)
      gText(`⑤ ${a2} × ${a2} = ${a2}² = ${a2*a2}`,cx,oy+a2*cell+67,GRN,17,p5)
    }
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
    const bw=v('w',140),bh=v('h',80),ox=cx-bw/2,oy=cy-bh/2-18

    const drawTri=(flip:boolean,alpha:number,color:string)=>{
      ctx.save();ctx.globalAlpha=alpha*0.4;ctx.fillStyle=color
      ctx.beginPath()
      if(!flip){ctx.moveTo(ox,oy+bh);ctx.lineTo(ox+bw,oy+bh);ctx.lineTo(ox,oy)}
      else{ctx.moveTo(ox,oy);ctx.lineTo(ox+bw,oy);ctx.lineTo(ox+bw,oy+bh)}
      ctx.closePath();ctx.fill();ctx.restore()
      ctx.save();ctx.globalAlpha=alpha*0.85;ctx.strokeStyle=color;ctx.lineWidth=2.5
      ctx.beginPath()
      if(!flip){ctx.moveTo(ox,oy+bh);ctx.lineTo(ox+bw,oy+bh);ctx.lineTo(ox,oy);ctx.closePath()}
      else{ctx.moveTo(ox,oy);ctx.lineTo(ox+bw,oy);ctx.lineTo(ox+bw,oy+bh);ctx.closePath()}
      ctx.stroke();ctx.restore()
    }

    // ① 삼각형 등장
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.23)
      drawTri(false,p1,VIO)
      // 꼭짓점 원
      gCircle(ox,oy+bh,6,VIO,true,p1*0.7)
      gCircle(ox+bw,oy+bh,6,VIO,true,p1*0.7)
      gCircle(ox,oy,6,VIO,true,p1*0.7)
      gText(`① 삼각형: 밑변=${bw/10}, 높이=${bh/10}`,cx,oy-18,VIO,13,p1)
    }

    // ② 높이선(수직선) 표시
    if(p>0.22){
      const p2=easeOutCubic((p-0.22)/0.18)
      gLine(ox,oy,ox,oy+bh,ORG,2,p2*0.7)
      gLine(ox,oy+bh-10,ox+10,oy+bh-10,ORG,1.5,p2*0.6)
      gLine(ox+10,oy+bh-10,ox+10,oy+bh,ORG,1.5,p2*0.6)
      gText(`높이`,ox-22,cy-18,ORG,12,p2)
      gLine(ox,oy+bh+10,ox+bw,oy+bh+10,GRN,2,p2*0.5)
      gText(`밑변`,cx,oy+bh+22,GRN,12,p2)
      gText(`② 높이와 밑변 확인`,cx,oy-30,ORG,12,p2)
    }

    // ③ 복제+뒤집기 등장
    if(p>0.38){
      const p3=easeOutCubic((p-0.38)/0.22)
      drawTri(true,p3,ORG)
      gText(`③ 똑같은 삼각형 뒤집어 붙이기`,cx,oy+bh+36,ORG,12,p3)
    }

    // ④ 직사각형 강조
    if(p>0.6){
      const p4=easeOutCubic((p-0.6)/0.2)
      ctx.save();ctx.globalAlpha=p4*0.9;ctx.strokeStyle=GRN;ctx.lineWidth=3;ctx.shadowBlur=12;ctx.shadowColor=GRN;ctx.strokeRect(ox,oy,bw,bh);ctx.restore()
      gCircle(ox,oy,5,GRN,true,p4*0.7)
      gCircle(ox+bw,oy,5,GRN,true,p4*0.7)
      gCircle(ox,oy+bh,5,GRN,true,p4*0.7)
      gCircle(ox+bw,oy+bh,5,GRN,true,p4*0.7)
      gText(`④ 합치면 직사각형!`,cx,oy+bh+50,GRN,13,p4)
    }

    // ⑤ 넓이 공식
    if(p>0.8){
      const p5=easeOutCubic((p-0.8)/0.2)
      gLine(cx-100,oy+bh+64,cx+100,oy+bh+64,GRN,1.5,p5*0.5)
      gText(`⑤ 넓이 = 밑변×높이÷2`,cx,oy+bh+76,GRN,14,p5)
    }
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
    const rr=v('r',35)>0?Math.min(40,v('r',35)):Math.min(35,H*0.18)
    const circumLen=2*Math.PI*rr
    const rollP=easeOutCubic(Math.min(1,Math.max(0,(p-0.22)/0.58)))
    const startX=cx-circumLen/2, rollX=startX+rollP*circumLen
    const groundY=cy+10
    const angle=rollP*Math.PI*2

    // ① 원 + 반지름 소개
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.2)
      ctx.save();ctx.globalAlpha=p1*0.8;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=VIO
      ctx.beginPath();ctx.arc(startX,groundY,rr,0,Math.PI*2);ctx.stroke();ctx.restore()
      gLine(startX,groundY,startX+rr,groundY,ORG,2.5,p1*0.8)
      gCircle(startX,groundY,4,ORG,true,p1*0.8)
      gText(`r=${r(rr/10,1)}`,startX+rr/2,groundY-12,ORG,13,p1)
      gText(`① 반지름 r 확인`,cx,groundY-rr-18,VIO,13,p1)
    }

    // ② 지름선 표시
    if(p>0.18){
      const p2=easeOutCubic((p-0.18)/0.18)
      gLine(startX-rr,groundY,startX+rr,groundY,GRN,2,p2*0.6)
      gText(`지름 = 2r`,startX,groundY+14,GRN,12,p2)
      gText(`② 지름 = 반지름×2`,cx,groundY-rr-30,GRN,12,p2)
    }

    // ③ 지면선 + 굴러가는 원
    if(p>0.2){
      const p3=easeOutCubic((p-0.2)/0.15)
      gLine(startX-10,groundY+rr,startX+circumLen+20,groundY+rr,'rgba(255,255,255,0.2)',1.5,p3)
      gText(`③ 원을 굴려서 둘레 측정!`,cx,groundY+rr+18,ORG,12,p3)
    }

    // 굴러가는 원 그리기
    if(p>0.22){
      ctx.save();ctx.globalAlpha=Math.min(1,(p-0.22)*5)*0.85;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=VIO
      ctx.beginPath();ctx.arc(rollX,groundY,rr,0,Math.PI*2);ctx.stroke();ctx.restore()
      // 반지름 회전 표시
      gLine(rollX,groundY,rollX+Math.cos(angle)*rr,groundY-Math.sin(angle)*rr,ORG,2.5,0.8)
      gCircle(rollX,groundY,4,VIO,true,0.7)
    }

    // ④ 굴러간 거리 강조
    if(rollP>0.08){
      gLine(startX,groundY+rr+10,rollX,groundY+rr+10,GRN,3.5,rollP)
      gCircle(startX,groundY+rr+10,5,GRN,true,rollP*0.7)
      gCircle(rollX,groundY+rr+10,5,GRN,true,rollP*0.7)
      if(rollP>0.4) gText(`④ 굴러간 거리 = 원주`,cx,groundY+rr+32,GRN,12,easeOutCubic((rollP-0.4)/0.3))
    }

    // ⑤ 원주 공식 결과
    if(p>0.82){
      const p5=easeOutCubic((p-0.82)/0.18)
      gLine(cx-100,groundY+rr+46,cx+100,groundY+rr+46,GRN,1.5,p5*0.5)
      gText(`⑤ 원주 = 2 × r × 3.14`,cx,groundY+rr+58,GRN,15,p5)
    }
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
    const sc=Math.min(14,Math.min((W-80)/8,(H-80)/6))
    const faces=[
      {label:`앞 ${a2}×${c2}`,w:a2,h:c2,color:VIO,area:a2*c2},
      {label:`위 ${a2}×${b2}`,w:a2,h:b2,color:GRN,area:a2*b2},
      {label:`옆 ${b2}×${c2}`,w:b2,h:c2,color:ORG,area:b2*c2},
    ]
    const total=2*(a2*c2+a2*b2+b2*c2)

    // ① 직육면체 소개
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.18)
      gText(`① 직육면체 ${a2}×${b2}×${c2}`,cx,24,VIO,14,p1)
      // 간단한 육면체 아이소 스케치
      const bx=cx-20,by=38,bw=40,bh=24,dep=12
      gLine(bx,by+bh,bx+bw,by+bh,VIO,1.5,p1*0.5)
      gLine(bx+bw,by,bx+bw,by+bh,VIO,1.5,p1*0.5)
      gLine(bx,by,bx+bw,by,VIO,1.5,p1*0.5)
      gLine(bx,by,bx,by+bh,VIO,1.5,p1*0.5)
      gLine(bx,by,bx+dep,by-dep,VIO,1,p1*0.4)
      gLine(bx+bw,by,bx+bw+dep,by-dep,VIO,1,p1*0.4)
      gLine(bx+bw+dep,by-dep,bx+dep,by-dep,VIO,1,p1*0.4)
    }

    // ② 면 분리 표시
    if(p>0.18){
      const p2=easeOutCubic((p-0.18)/0.15)
      gText(`② 6개 면을 펼쳐보기`,cx,62,ORG,13,p2)
    }

    // ③ 각 면 사각형 + 면 윤곽선
    faces.forEach((f,i)=>{
      const prog=easeOutCubic(Math.min(1,Math.max(0,(p-0.28)*3-i*0.55)))
      const fx=W*0.13+i*W*0.29,fy=cy-f.h*sc/2+10
      ctx.save();ctx.globalAlpha=prog*0.35;ctx.fillStyle=f.color;ctx.fillRect(fx,fy,f.w*sc,f.h*sc);ctx.restore()
      ctx.save();ctx.globalAlpha=prog*0.9;ctx.strokeStyle=f.color;ctx.lineWidth=2.5;ctx.strokeRect(fx,fy,f.w*sc,f.h*sc);ctx.restore()
      // 모서리 원
      if(prog>0.5){
        gCircle(fx,fy,4,f.color,true,prog*0.6)
        gCircle(fx+f.w*sc,fy+f.h*sc,4,f.color,true,prog*0.6)
      }
      // 면 내부 대각선
      gLine(fx,fy,fx+f.w*sc,fy+f.h*sc,f.color,1,prog*0.2)
      gText(f.label,fx+f.w*sc/2,fy-13,f.color,11,prog)
      gText(`=${f.area}`,fx+f.w*sc/2,fy+f.h*sc+15,f.color,13,prog)
    })
    if(p>0.42) gText(`③ 면마다 넓이 계산`,cx,H-52,ORG,12,easeOutCubic((p-0.42)/0.2))

    // ④ ×2 이유 설명
    if(p>0.62){
      const p4=easeOutCubic((p-0.62)/0.2)
      gLine(W*0.13,cy+faces[0].h*sc/2+28,W*0.13+W*0.6,cy+faces[0].h*sc/2+28,'rgba(255,255,255,0.25)',1.5,p4)
      gText(`④ 각 면은 반대쪽에도 있어 → ×2`,cx,H-38,GRN,13,p4)
    }

    // ⑤ 겉넓이 합계
    if(p>0.78){
      const p5=easeOutCubic((p-0.78)/0.22)
      gLine(cx-100,H-26,cx+100,H-26,GRN,1.5,p5*0.5)
      gText(`⑤ 겉넓이 = ${total}`,cx,H-14,GRN,15,p5)
    }
    break
  }

  case 'volume_cuboid': {
    // E042: 직육면체 부피 — 층 쌓기
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const a2=v('a',4),b2=v('b',3),c2=v('c',3)
    const sc=Math.min(18,Math.min((W-60)/(a2+2),(H-80)/(b2+c2)))
    const isoX=0.7,isoY=0.35
    const ox=cx-(a2*sc)/2,baseY=cy+c2*sc*isoY

    // ① 직육면체 소개
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.18)
      gText(`① 직육면체 ${a2}×${b2}×${c2}`,cx,20,VIO,14,p1)
      // 바닥 테두리선
      gLine(ox,baseY,ox+a2*sc,baseY,VIO,1.5,p1*0.5)
      gLine(ox,baseY,ox+b2*sc*isoX*0.3,baseY-b2*sc*isoY*0.5,VIO,1.5,p1*0.5)
      gCircle(ox,baseY,5,VIO,true,p1*0.6)
    }

    // ② 바닥 면 강조
    if(p>0.15){
      const p2=easeOutCubic((p-0.15)/0.18)
      gLine(ox,baseY,ox+a2*sc,baseY,GRN,2,p2*0.6)
      gLine(ox+a2*sc,baseY,ox+a2*sc+b2*sc*isoX*0.3,baseY-b2*sc*isoY*0.5,GRN,2,p2*0.6)
      gText(`② 바닥 = ${a2}×${b2}=${a2*b2}`,cx,baseY+16,GRN,12,p2)
    }

    // ③ 층별 쌓기
    for(let layer=0;layer<c2;layer++){
      const layerP=easeOutCubic(Math.min(1,Math.max(0,(p-0.28)*(c2+1)-layer*0.7)))
      if(layerP<=0) continue
      for(let row=0;row<b2;row++) for(let col=0;col<a2;col++){
        const x=ox+col*sc+row*sc*isoX*0.3
        const y=baseY-layer*sc*isoY-row*sc*isoY*0.5
        const prog=layerP*easeOutCubic(Math.min(1,Math.max(0,layerP*2-(row*a2+col)/(a2*b2)*0.5)))
        ctx.save();ctx.globalAlpha=prog*0.65;ctx.fillStyle=[VIO,GRN,ORG][layer%3]+'66';ctx.strokeStyle=[VIO,GRN,ORG][layer%3]
        ctx.lineWidth=1.5;ctx.fillRect(x,y,sc-1,sc*isoY);ctx.strokeRect(x,y,sc-1,sc*isoY);ctx.restore()
      }
      if(layerP>0.5){
        gText(`${layer+1}층`,ox+a2*sc+22,baseY-layer*sc*isoY-b2*sc*isoY*0.25,[VIO,GRN,ORG][layer%3],11,layerP)
        // 층 꼭짓점 원
        gCircle(ox+a2*sc,baseY-layer*sc*isoY,4,[VIO,GRN,ORG][layer%3],true,layerP*0.6)
      }
    }
    if(p>0.32) gText(`③ 층마다 ${a2*b2}개 × ${c2}층`,cx,baseY+30,ORG,12,easeOutCubic((p-0.32)/0.2))

    // ④ 가로/세로/높이 라벨
    if(p>0.55){
      const p4=easeOutCubic((p-0.55)/0.22)
      gLine(ox,baseY+8,ox+a2*sc,baseY+8,VIO,2,p4*0.5)
      gText(`${a2}`,cx,baseY+20,VIO,12,p4)
      gLine(ox-8,baseY,ox-8,baseY-c2*sc*isoY,GRN,2,p4*0.5)
      gText(`높이${c2}`,ox-24,baseY-c2*sc*isoY/2,GRN,11,p4)
      gText(`④ 가로×세로×높이`,cx,20,ORG,13,p4)
    }

    // ⑤ 부피 공식 결과
    if(p>0.78){
      const p5=easeOutCubic((p-0.78)/0.22)
      gLine(cx-90,H-26,cx+90,H-26,GRN,1.5,p5*0.5)
      gText(`⑤ ${a2}×${b2}×${c2} = ${a2*b2*c2}`,cx,H-14,GRN,16,p5)
    }
    break
  }

  case 'average': {
    // E043: 평균 — 막대 녹아서 균등 분배
    const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
    const nums=[v('a',2),v('b',6),v('c',4),v('d',8)]
    const avg=nums.reduce((a3,b3)=>a3+b3,0)/nums.length
    const sum=nums.reduce((a3,b3)=>a3+b3,0)
    const maxH=90,barW=34,gap2=12
    const totalW2=nums.length*(barW+gap2)-gap2,ox=cx-totalW2/2,baseY=cy+maxH/2+5
    const colors=[VIO,GRN,ORG,'#D85A30']

    // ① 데이터 막대 등장
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.18)
      gText(`① 자료: ${nums.join(', ')}`,cx,baseY-maxH-22,VIO,13,p1)
      // 기준선 + 세로 축선
      gLine(ox-4,baseY,ox+totalW2+4,baseY,'rgba(255,255,255,0.3)',2,p1)
      gLine(ox-4,baseY-maxH-10,ox-4,baseY,'rgba(255,255,255,0.2)',1.5,p1)
      // 가로 눈금선
      gLine(ox-12,baseY-(avg/10)*maxH-1,ox,baseY-(avg/10)*maxH-1,'rgba(255,255,255,0.2)',1.5,p1)
    }

    const flatP=easeOutCubic(Math.min(1,Math.max(0,(p-0.52)*2.5)))
    nums.forEach((n2,i)=>{
      const origH=(n2/10)*maxH,avgH=(avg/10)*maxH
      const curH=origH+(avgH-origH)*flatP
      const x=ox+i*(barW+gap2)
      const prog=easeOutCubic(Math.min(1,(p-0.05)*3-i*0.3))
      ctx.save();ctx.globalAlpha=prog*0.72;ctx.fillStyle=colors[i%4]+'66';ctx.strokeStyle=colors[i%4]
      ctx.lineWidth=2.5;ctx.shadowBlur=6;ctx.shadowColor=colors[i%4]
      ctx.fillRect(x,baseY-curH,barW,curH);ctx.strokeRect(x,baseY-curH,barW,curH);ctx.restore()
      gText(String(n2),x+barW/2,baseY+16,colors[i%4],13,prog)
      // 데이터 점
      if(prog>0.5) gCircle(x+barW/2,baseY-origH,5,colors[i%4],true,prog*0.7)
    })
    if(p>0.1) gText(`② 막대로 데이터 비교`,cx,baseY-maxH-36,ORG,12,easeOutCubic((p-0.1)/0.2))

    // ③ 합계 표시
    if(p>0.32){
      const p3=easeOutCubic((p-0.32)/0.2)
      gText(`③ 합계 = ${nums.join('+')} = ${sum}`,cx,baseY+30,VIO,13,p3)
      // 합계 연결선
      gLine(ox,baseY+42,ox+totalW2,baseY+42,VIO,1.5,p3*0.5)
    }

    // ④ 균등 분배 과정
    if(p>0.5){
      const p4=easeOutCubic((p-0.5)/0.18)
      gText(`④ 균등하게 나누는 중...`,cx,baseY-maxH-50,GRN,12,p4)
    }

    // 평균선
    if(p>0.58){
      const lp=easeOutCubic((p-0.58)/0.25)
      const avgY=baseY-(avg/10)*maxH
      gLine(ox-10,avgY,ox+totalW2+10,avgY,GRN,3,lp)
      gCircle(ox-10,avgY,5,GRN,true,lp*0.7)
      gCircle(ox+totalW2+10,avgY,5,GRN,true,lp*0.7)
      gText(`평균 = ${avg}`,cx,avgY-16,GRN,15,lp)
    }

    // ⑤ 평균 공식
    if(p>0.8){
      const p5=easeOutCubic((p-0.8)/0.2)
      gLine(cx-100,baseY+44,cx+100,baseY+44,GRN,1.5,p5*0.5)
      gText(`⑤ 평균 = 합계(${sum}) ÷ 개수(${nums.length}) = ${avg}`,cx,baseY+56,GRN,13,p5)
    }
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
    const units=[
      {name:'1mm',scale:1,color:VIO,desc:'가장 작은 단위'},
      {name:'1cm = 10mm',scale:10,color:GRN,desc:'손가락 한 마디'},
      {name:'1m = 100cm',scale:100,color:ORG,desc:'어른 키 정도'},
      {name:'1km = 1000m',scale:1000,color:'#1D9E75',desc:'걸어서 약 15분'},
    ]
    const stageIdx=Math.min(3,Math.floor(p*4.8))

    // ① 첫 단위(mm) 등장
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.18)
      gText(`① 길이 단위 변환 알아보기`,cx,18,VIO,14,p1)
    }

    units.forEach((u,i)=>{
      if(i>stageIdx) return
      const prog=easeOutCubic(Math.min(1,(p-i*0.22)/0.25))
      const y=38+i*48,barW=Math.min(W*0.58,196)*(1-i*0.12)
      const bx=cx-barW/2

      ctx.save();ctx.globalAlpha=prog*0.4;ctx.fillStyle=u.color+'55';ctx.strokeStyle=u.color;ctx.lineWidth=2.5
      ctx.fillRect(bx,y,barW*prog,26);ctx.strokeRect(bx,y,barW,26);ctx.restore()

      // 막대 왼쪽/오른쪽 끝선
      gLine(bx,y-3,bx,y+30,u.color,1.5,prog*0.5)
      gLine(bx+barW,y-3,bx+barW,y+30,u.color,1.5,prog*0.5)

      gText(u.name,cx,y+13,u.color,13,prog)

      // 단위 설명 작은 원
      if(prog>0.5) gCircle(bx-12,y+13,5,u.color,true,prog*0.65)

      // 변환 배수 + 화살표선
      if(i>0){
        const prev=units[i-1]
        const mult=u.scale/prev.scale
        gText(`×${mult}`,bx-38,y+13,'rgba(255,255,255,0.5)',11,prog)
        gLine(bx-30,y+13,bx-15,y+13,u.color,1.5,prog*0.5)
      }

      // 설명
      if(prog>0.6) gText(u.desc,cx,y+30,'rgba(255,255,255,0.3)',10,prog*0.8)
    })

    // ② 단위 스케일 그림
    if(p>0.22){
      const p2=easeOutCubic((p-0.22)/0.18)
      gText(`② mm → cm → m → km 순서`,cx,H-40,ORG,12,p2)
    }

    // ③ 연결 세로선
    if(p>0.42){
      const p3=easeOutCubic((p-0.42)/0.18)
      gLine(cx-100,38,cx-100,38+3*48+26,'rgba(255,255,255,0.12)',1,p3)
    }

    // ④ 단위 비교 강조
    if(p>0.62){
      const p4=easeOutCubic((p-0.62)/0.2)
      // 단위 계층 원
      gCircle(cx+100,62,8,VIO,true,p4*0.6)
      gCircle(cx+100,110,10,GRN,true,p4*0.6)
      gLine(cx+100,70,cx+100,100,VIO,1.5,p4*0.4)
      gText(`④ 10배씩 커지는 단위들`,cx,H-28,GRN,13,p4)
    }

    // ⑤ 정리
    if(p>0.82){
      const p5=easeOutCubic((p-0.82)/0.18)
      gLine(cx-120,H-16,cx+120,H-16,GRN,1.5,p5*0.5)
      gText(`⑤ 1km=1000m=100000cm=1000000mm`,cx,H-4,GRN,11,p5)
    }
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
    const clockR=Math.min(76,Math.min(W,H)*0.28)
    const hourVal=v('h',3), minVal=v('m',30)
    const cy2=cy-8

    // ① 시계 원판 등장
    if(p>0.02){
      const p1=easeOutCubic((p-0.02)/0.18)
      ctx.save();ctx.globalAlpha=p1*0.1;ctx.fillStyle=WHITE;ctx.beginPath();ctx.arc(cx,cy2,clockR,0,Math.PI*2);ctx.fill();ctx.restore()
      ctx.save();ctx.globalAlpha=p1*0.65;ctx.strokeStyle='rgba(255,255,255,0.45)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy2,clockR,0,Math.PI*2);ctx.stroke();ctx.restore()
      gCircle(cx,cy2,clockR,VIO,false,p1*0.3)
      gText(`① 시계 원판`,cx,cy2+clockR+16,VIO,12,p1)
    }

    // ② 눈금 (12개) + 숫자
    if(p>0.15){
      const p2=easeOutCubic((p-0.15)/0.2)
      for(let i=0;i<12;i++){
        const angle=-Math.PI/2+i*Math.PI/6
        const isMajor=[0,3,6,9].includes(i)
        const inner=clockR*(isMajor?0.76:0.84), outer=clockR*0.92
        gLine(cx+Math.cos(angle)*inner,cy2+Math.sin(angle)*inner,cx+Math.cos(angle)*outer,cy2+Math.sin(angle)*outer,'rgba(255,255,255,0.4)',isMajor?2.5:1,p2)
        if(isMajor){
          const numVal=i===0?12:i===3?3:i===6?6:9
          gText(String(numVal),cx+Math.cos(angle)*clockR*0.66,cy2+Math.sin(angle)*clockR*0.66,'rgba(255,255,255,0.7)',13,p2)
          // 주요 숫자 원
          gCircle(cx+Math.cos(angle)*clockR*0.88,cy2+Math.sin(angle)*clockR*0.88,3,ORG,true,p2*0.5)
        }
      }
      gText(`② 12개 눈금 표시`,cx,cy2+clockR+30,ORG,12,p2)
    }

    // ③ 시침 등장
    if(p>0.32){
      const p3=easeOutCubic((p-0.32)/0.2)
      const hourAngle=-Math.PI/2+hourVal*Math.PI/6
      gLine(cx,cy2,cx+Math.cos(hourAngle)*clockR*0.5,cy2+Math.sin(hourAngle)*clockR*0.5,VIO,5,p3)
      gText(`③ 시침: ${hourVal}시`,cx,cy2+clockR+44,VIO,12,p3)
    }

    // ④ 분침 회전 애니메이션
    const targetMin=p<0.52?0:minVal*easeOutCubic((p-0.52)/0.38)
    const hourAngle=-Math.PI/2+(hourVal+targetMin/60)*Math.PI/6
    const minAngle=-Math.PI/2+targetMin*Math.PI/30

    if(p>0.32){
      gLine(cx,cy2,cx+Math.cos(hourAngle)*clockR*0.5,cy2+Math.sin(hourAngle)*clockR*0.5,VIO,5,Math.min(1,(p-0.32)/0.2))
    }
    if(p>0.52){
      const p4=easeOutCubic((p-0.52)/0.2)
      gLine(cx,cy2,cx+Math.cos(minAngle)*clockR*0.73,cy2+Math.sin(minAngle)*clockR*0.73,GRN,3,p4)
      gText(`④ 분침 회전: ${Math.round(targetMin)}분`,cx,cy2+clockR+58,GRN,12,p4)
    }

    // 중심점
    gCircle(cx,cy2,5,ORG,true,p)

    // ⑤ 시각 표시
    if(p>0.78){
      const p5=easeOutCubic((p-0.78)/0.22)
      const displayMin=Math.round(targetMin)
      gLine(cx-70,cy2+clockR+72,cx+70,cy2+clockR+72,GRN,1.5,p5*0.5)
      gText(`⑤ ${hourVal}시 ${displayMin<10?'0'+displayMin:displayMin}분`,cx,cy2+clockR+82,GRN,18,p5)
    }
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
      // M003: 정수 곱셈 부호 규칙 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const a=v('a',3),b=v('b',-4)
      const cellSz=52,ox=cx-cellSz*1.15,oy=cy-cellSz*0.9
      const signs=[['+','+'],['+','-'],['-','+'],['-','-']]
      const results=['+','-','-','+']
      const colors=[GRN,ORG,ORG,GRN]

      // ① 제목 등장
      if(p>0.02){const p1=easeOutCubic((p-0.02)/0.18)
        gText('① 부호 규칙표',cx,18,WHITE,15,p1)
        gLine(cx-80,28,cx+80,28,MINT,1.5,p1*0.5)}

      // ② 헤더 축선 등장
      if(p>0.1){const p2=easeOutCubic((p-0.1)/0.2)
        gLine(ox-8,oy-30,ox+cellSz*2+18,oy-30,'rgba(255,255,255,0.25)',1,p2)
        gLine(ox-30,oy-8,ox-30,oy+cellSz*2+18,'rgba(255,255,255,0.25)',1,p2)
        gText('+',ox+cellSz*0.5,oy-18,GRN,15,p2)
        gText('-',ox+cellSz*1.5+10,oy-18,ORG,15,p2)
        gText('+',ox-18,oy+cellSz*0.5,GRN,15,p2)
        gText('-',ox-18,oy+cellSz*1.5+10,ORG,15,p2)
        gText('②',ox-28,oy-18,'rgba(255,255,255,0.4)',11,p2)}

      // ③ 4칸 순서대로 등장
      for(let r2=0;r2<2;r2++)for(let c2=0;c2<2;c2++){
        const idx=r2*2+c2
        const prog=easeOutCubic(Math.min(1,Math.max(0,(p-0.22)*3.5-idx*0.35)))
        const x=ox+c2*(cellSz+10),y=oy+r2*(cellSz+10)
        ctx.save();ctx.globalAlpha=prog*0.3;ctx.fillStyle=colors[idx];ctx.fillRect(x,y,cellSz,cellSz);ctx.restore()
        ctx.save();ctx.globalAlpha=prog*0.85;ctx.strokeStyle=colors[idx];ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor=colors[idx];ctx.strokeRect(x,y,cellSz,cellSz);ctx.restore()
        gText(`(${signs[idx][0]})(${signs[idx][1]})=${results[idx]}`,x+cellSz/2,y+cellSz/2,colors[idx],13,prog)
        if(prog>0.4) gCircle(x+cellSz/2,y+cellSz/2,cellSz*0.45,colors[idx],false,prog*0.2)
      }

      // ④ 슬라이더 값으로 예시 계산
      if(p>0.6){const p4=easeOutCubic((p-0.6)/0.25)
        const signA=a>=0?'+':'-',signB=b>=0?'+':'-'
        const prod=a*b,signProd=prod>=0?'+':'-'
        gLine(cx-70,cy+cellSz+14,cx+70,cy+cellSz+14,PURPLE,1,p4*0.4)
        gText(`④ (${signA}${Math.abs(a)}) × (${signB}${Math.abs(b)})`,cx,cy+cellSz+28,PURPLE,13,p4)
        gText(`= (${signProd}${Math.abs(prod)})`,cx,cy+cellSz+44,PURPLE,14,p4)}

      // ⑤ 결론 + 강조
      if(p>0.82){const p5=easeOutCubic((p-0.82)/0.18)
        gLine(30,H-28,W-30,H-28,'rgba(0,255,204,0.15)',1,p5)
        gCircle(cx,H-14,W*0.45,MINT,false,p5*0.06)
        gText('⑤ 같은 부호=양수, 다른 부호=음수',cx,H-14,MINT,13,p5)}
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
      // M010: 소인수분해 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const n=v('n',12)
      const factors: number[]=[]
      let temp=n
      for(const pr of [2,3,5,7,11,13]){while(temp%pr===0){factors.push(pr);temp=Math.round(temp/pr)}}
      if(temp>1) factors.push(temp)
      const nodeR=18,yGap=46

      // ① 타이틀 + 수 노드
      if(p>0.02){const p1=easeOutCubic((p-0.02)/0.18)
        gText(`① ${n} 소인수분해 시작`,cx,18,WHITE,14,p1)
        gLine(cx-60,28,cx+60,28,ORG,1.5,p1*0.5)
        gCircle(cx,46,nodeR,AMBER,true,p1*0.9)
        gText(String(n),cx,46,'#000',14,p1)}

      // ② 나눗셈 축선
      if(p>0.12){const p2=easeOutCubic((p-0.12)/0.2)
        gLine(cx,46+nodeR,cx,46+nodeR+factors.length*yGap,VIO,1.5,p2*0.4)
        gText('② 나무 구조',cx-70,46+nodeR+factors.length*yGap/2,VIO,11,p2)}

      // ③ 소수 노드 순차 등장
      let cur2=n
      factors.forEach((f,i)=>{
        const prog=easeOutCubic(Math.min(1,Math.max(0,(p-0.28)*3-i*0.45)))
        const ny=60+i*yGap
        const lx=cx-45-i*7,rx=cx+45+i*7
        if(i===0) gLine(cx,46+nodeR,lx,ny-nodeR,'rgba(255,255,255,0.2)',1.5,prog)
        else{gLine(cx+45+(i-1)*7,60+(i-1)*yGap+nodeR,lx,ny-nodeR,'rgba(255,255,255,0.15)',1,prog)
          gLine(cx+45+(i-1)*7,60+(i-1)*yGap+nodeR,rx,ny-nodeR,'rgba(255,255,255,0.15)',1,prog)}
        gCircle(lx,ny,nodeR*prog,MINT,true,prog*0.85)
        gText(String(f),lx,ny,'#000',13,prog)
        cur2=Math.round(cur2/f)
        if(cur2>1){gCircle(rx,ny,nodeR*prog,PURPLE,true,prog*0.7);gText(String(cur2),rx,ny,'#000',13,prog)}
        if(prog>0.5) gLine(lx+nodeR,ny,lx+nodeR+18,ny,ORG,1,prog*0.5)})

      // ④ 소수 구분 박스
      if(p>0.65){const p4=easeOutCubic((p-0.65)/0.2)
        const unique=[...new Set(factors)]
        unique.forEach((f,i)=>{const bx=30+i*55
          gLine(bx,H-52,bx+46,H-52,MINT,1.5,p4*0.6);gLine(bx,H-52,bx,H-32,MINT,1,p4*0.4)
          gLine(bx+46,H-52,bx+46,H-32,MINT,1,p4*0.4);gLine(bx,H-32,bx+46,H-32,MINT,1.5,p4*0.6)
          gCircle(bx+23,H-42,12,MINT,false,p4*0.5)
          gText(String(f),bx+23,H-42,MINT,13,p4)})
        gText('④ 소인수 목록',30+unique.length*27.5,H-42,'rgba(255,255,255,0.4)',10,p4)}

      // ⑤ 결과식
      if(p>0.82){const p5=easeOutCubic((p-0.82)/0.18)
        gLine(30,H-22,W-30,H-22,'rgba(0,255,204,0.15)',1,p5)
        gCircle(cx,H-14,W*0.42,MINT,false,p5*0.06)
        gText(`⑤ ${n} = ${factors.join(' × ')}`,cx,H-14,MINT,14,p5)}
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
      // M004: 절댓값 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const val=v('a',-5)
      const lineY3=cy,sc2=(W-80)/14,ox3=cx-7*sc2

      // ① 수직선 등장
      if(p>0.02){const p1=easeOutCubic((p-0.02)/0.2)
        gLine(30,lineY3,W-30,lineY3,'rgba(255,255,255,0.2)',2,p1)
        gLine(W-30,lineY3,W-22,lineY3-5,'rgba(255,255,255,0.2)',1.5,p1)
        gLine(W-30,lineY3,W-22,lineY3+5,'rgba(255,255,255,0.2)',1.5,p1)
        for(let i=-7;i<=7;i++){const x=ox3+(i+7)*sc2
          gLine(x,lineY3-5,x,lineY3+5,'rgba(255,255,255,0.25)',i===0?2:1,p1)
          if(i%2===0) gText(String(i),x,lineY3+16,'rgba(255,255,255,0.35)',9,p1)}
        gCircle(ox3+7*sc2,lineY3,4,'rgba(255,255,255,0.5)',true,p1)
        gText('① 수직선 위의 점',cx,lineY3-38,WHITE,13,p1)}

      // ② 값 점 등장
      if(p>0.22){const p2=easeOutCubic((p-0.22)/0.22)
        const vx=ox3+(val+7)*sc2
        gCircle(vx,lineY3,7,VIO,true,p2)
        gText(String(val),vx,lineY3-22,VIO,14,p2)
        gLine(vx,lineY3-8,vx,lineY3+8,VIO,2.5,p2)
        gText('② 음수 점 표시',cx,lineY3-52,VIO,12,p2)}

      // ③ 원점까지 거리 선
      if(p>0.42){const p3=easeOutCubic((p-0.42)/0.22)
        const vx=ox3+(val+7)*sc2,zx=ox3+7*sc2
        const lx=Math.min(vx,zx),rx=Math.max(vx,zx)
        gLine(lx,lineY3-3,rx,lineY3-3,ORG,3,p3)
        gCircle(lx,lineY3,5,ORG,false,p3*0.7)
        gCircle(rx,lineY3,5,ORG,false,p3*0.7)
        gText(`③ 거리 = ${Math.abs(val)}`,(lx+rx)/2,lineY3-18,ORG,13,p3)}

      // ④ 절댓값 정의
      if(p>0.62){const p4=easeOutCubic((p-0.62)/0.2)
        gLine(cx-100,lineY3+36,cx+100,lineY3+36,'rgba(0,255,204,0.2)',1,p4)
        gText(`④ |${val}| = ${Math.abs(val)} (원점까지 거리)`,cx,lineY3+50,MINT,13,p4)}

      // ⑤ 결론 강조
      if(p>0.82){const p5=easeOutCubic((p-0.82)/0.18)
        gCircle(cx,lineY3+75,60,GRN,false,p5*0.3)
        gText(`⑤ |${val}| = ${Math.abs(val)}  (절댓값은 항상 ≥ 0)`,cx,lineY3+75,GRN,14,p5)}
      break
    }

    // ══════════════════════════════════════════
    // M011~M024 — 설계서 v2 기반 전용 시각화
    // ══════════════════════════════════════════

    case 'square_root_viz': {
      // M011: 제곱근 넓이→한 변 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const area=v('a',9),side=Math.sqrt(Math.max(1,area))
      const sz=Math.min(100,Math.min(W-80,H-80)/1.4)
      const gridN=Math.max(1,Math.round(side)),cellSz=sz/gridN,ox=cx-sz/2,oy=cy-sz/2-10

      // ① 제목 + 넓이 라벨
      if(p>0.02){const p1=easeOutCubic((p-0.02)/0.18)
        gText(`① 넓이 ${area}인 정사각형`,cx,18,WHITE,14,p1)
        gLine(cx-90,28,cx+90,28,ORG,1.5,p1*0.5)}

      // ② 테두리 박스 등장
      if(p>0.1){const p2=easeOutCubic((p-0.1)/0.2)
        gLine(ox,oy,ox+sz,oy,VIO,2,p2);gLine(ox+sz,oy,ox+sz,oy+sz,VIO,2,p2)
        gLine(ox+sz,oy+sz,ox,oy+sz,VIO,2,p2);gLine(ox,oy+sz,ox,oy,VIO,2,p2)
        ctx.save();ctx.globalAlpha=p2*0.08;ctx.fillStyle=VIO;ctx.fillRect(ox,oy,sz,sz);ctx.restore()
        gText(`② 넓이 = ${area}`,cx,oy+sz/2,'rgba(255,255,255,0.5)',14,p2)}

      // ③ 격자 칸 채우기
      if(p>0.28){
        for(let r2=0;r2<gridN;r2++)for(let c2=0;c2<gridN;c2++){
          const prog=easeOutCubic(Math.min(1,Math.max(0,(p-0.28)*3.5-(r2*gridN+c2)/(gridN*gridN)*0.8)))
          ctx.save();ctx.globalAlpha=prog*0.45;ctx.fillStyle=VIO+'55';ctx.strokeStyle=VIO;ctx.lineWidth=1.5
          ctx.fillRect(ox+c2*cellSz+1,oy+r2*cellSz+1,cellSz-2,cellSz-2)
          ctx.strokeRect(ox+c2*cellSz+1,oy+r2*cellSz+1,cellSz-2,cellSz-2);ctx.restore()
          if(prog>0.6&&gridN<=4) gText(String(r2*gridN+c2+1),ox+c2*cellSz+cellSz/2,oy+r2*cellSz+cellSz/2,'rgba(255,255,255,0.4)',Math.min(11,cellSz-4),prog)}
        if(p>0.45){const p3=easeOutCubic((p-0.45)/0.15)
          gText(`③ ${gridN}×${gridN} = ${area}칸`,cx,oy+sz+16,ORG,13,p3)}}

      // ④ 한 변 강조선
      if(p>0.6){const p4=easeOutCubic((p-0.6)/0.22)
        gLine(ox-6,oy,ox-6,oy+sz,GRN,3,p4)
        gLine(ox-12,oy,ox,oy,GRN,2,p4);gLine(ox-12,oy+sz,ox,oy+sz,GRN,2,p4)
        gLine(ox,oy+sz+28,ox+sz,oy+sz+28,GRN,2.5,p4)
        gCircle(ox,oy,5,GRN,true,p4*0.8);gCircle(ox+sz,oy+sz,5,GRN,true,p4*0.8)
        gText(`④ 한 변 = √${area} = ${r(side)}`,cx,oy+sz+42,GRN,14,p4)}

      // ⑤ 결론
      if(p>0.82){const p5=easeOutCubic((p-0.82)/0.18)
        gCircle(cx,H-14,W*0.42,MINT,false,p5*0.06)
        gLine(30,H-26,W-30,H-26,'rgba(0,255,204,0.15)',1,p5)
        gText(`⑤ √${area} = ${r(side)} (제곱하면 ${area})`,cx,H-14,MINT,15,p5)}
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
      // M014: 분모의 유리화 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const n2=v('n',1),d2=v('d',2)
      const dSqrt=Math.sqrt(Math.max(1,d2))

      // ① 문제 제시
      if(p>0.02){const p1=easeOutCubic((p-0.02)/0.18)
        gText(`① 분모에 √가 있다: ${n2}/√${d2}`,cx,22,WHITE,14,p1)
        gLine(cx-120,32,cx+120,32,'rgba(255,255,255,0.2)',1,p1*0.5)
        gCircle(cx+30,22,22,ORG,false,p1*0.25)}

      // ② 분자분모에 √d 곱하기
      if(p>0.18){const p2=easeOutCubic((p-0.18)/0.22)
        gText(`② × √${d2}/√${d2}`,cx,cy-50,VIO,17,p2)
        gLine(cx-60,cy-38,cx+60,cy-38,VIO,1.5,p2*0.5)
        gLine(cx-70,cy-28,cx+70,cy-28,'rgba(255,255,255,0.15)',1,p2*0.4)
        gText('← 분자분모에 같은 수 곱하기',cx,cy-20,'rgba(255,255,255,0.35)',11,p2*0.8)}

      // ③ 분자 계산
      if(p>0.38){const p3=easeOutCubic((p-0.38)/0.22)
        gText(`③ 분자: ${n2}×√${d2} = ${n2}√${d2}`,cx,cy,GRN,15,p3)
        gLine(cx-100,cy+12,cx+100,cy+12,GRN,1,p3*0.4)}

      // ④ 분모 계산
      if(p>0.58){const p4=easeOutCubic((p-0.58)/0.2)
        gText(`④ 분모: √${d2}×√${d2} = ${d2}`,cx,cy+34,ORG,15,p4)
        gLine(cx-90,cy+48,cx+90,cy+48,ORG,1,p4*0.4)
        gCircle(cx,cy+34,50,ORG,false,p4*0.18)
        gText(`(루트 사라짐!)`,cx,cy+58,'rgba(255,165,0,0.5)',11,p4)}

      // ⑤ 결론
      if(p>0.78){const p5=easeOutCubic((p-0.78)/0.22)
        gLine(30,H-28,W-30,H-28,'rgba(0,255,204,0.15)',1,p5)
        gCircle(cx,H-14,W*0.44,MINT,false,p5*0.06)
        gText(`⑤ = ${n2}√${d2}/${d2} (분모 유리화 완료!)`,cx,H-14,MINT,14,p5)}
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
      // M016: 동류항 정리 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const cA=v('a',3),cB=v('b',5),kC=v('c',2),kD=v('d',-1)
      const sumX=cA+cB,sumK=kC+kD

      // ① 원래 식
      if(p>0.02){const p1=easeOutCubic((p-0.02)/0.2)
        gText(`① ${cA}x + ${kC} + ${cB}x + (${kD})`,cx,22,WHITE,15,p1)
        gLine(cx-150,32,cx+150,32,'rgba(255,255,255,0.15)',1,p1*0.5)}

      // ② x항 묶기 블록
      if(p>0.18){const p2=easeOutCubic((p-0.18)/0.22)
        const bw=26,bh=26,startX=cx-((cA+cB)/2)*(bw+4)
        for(let i=0;i<cA+cB;i++){const bx=startX+i*(bw+4)
          ctx.save();ctx.globalAlpha=p2*0.5;ctx.fillStyle=(i<cA?VIO:VIO+'99')+'66';ctx.strokeStyle=i<cA?VIO:VIO+'cc';ctx.lineWidth=i<cA?2:1.5
          ctx.fillRect(bx,cy-52,bw,bh);ctx.strokeRect(bx,cy-52,bw,bh);ctx.restore()
          gText('x',bx+bw/2,cy-52+bh/2,i<cA?VIO:PURPLE,9,p2)}
        gLine(cx-((cA+cB)/2)*(bw+4)-6,cy-30,cx+((cA+cB)/2)*(bw+4)+6,cy-30,VIO,1.5,p2*0.5)
        gText(`② x항: ${cA}x+${cB}x = ${sumX}x`,cx,cy-18,VIO,14,p2)}

      // ③ 상수항 묶기
      if(p>0.4){const p3=easeOutCubic((p-0.4)/0.22)
        gLine(cx-60,cy+12,cx+60,cy+12,'rgba(255,255,255,0.12)',1,p3)
        gCircle(cx-40,cy+24,14,GRN,false,p3*0.5)
        gCircle(cx+40,cy+24,14,ORG,false,p3*0.5)
        gText(String(kC),cx-40,cy+24,GRN,13,p3)
        gText(String(kD),cx+40,cy+24,ORG,13,p3)
        gText(`③ 상수: ${kC}+(${kD}) = ${sumK}`,cx,cy+42,GRN,14,p3)}

      // ④ 결합 화살표
      if(p>0.6){const p4=easeOutCubic((p-0.6)/0.2)
        gLine(cx-30,cy+55,cx-12,cy+70,WHITE,1.5,p4*0.5)
        gLine(cx+30,cy+55,cx+12,cy+70,WHITE,1.5,p4*0.5)
        gText('④ 합치기',cx,cy+64,'rgba(255,255,255,0.4)',11,p4)}

      // ⑤ 결론
      if(p>0.76){const p5=easeOutCubic((p-0.76)/0.24)
        gCircle(cx,cy+88,44,MINT,false,p5*0.2)
        gLine(cx-60,cy+78,cx+60,cy+78,MINT,1.5,p5*0.4)
        gText(`⑤ = ${sumX}x + ${sumK}`,cx,cy+88,MINT,20,p5)}
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
      // M018: (a+b)² 넓이 모델 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const a5=v('a',3),b5=v('b',2),tot=a5+b5
      const sc=Math.min(24,(Math.min(W,H)-60)/tot),ox=cx-tot*sc/2,oy=cy-tot*sc/2-8

      // ① 전체 정사각형 테두리
      if(p>0.02){const p1=easeOutCubic((p-0.02)/0.2)
        gText(`① (a+b)² = (${a5}+${b5})² = ${tot}²`,cx,16,WHITE,14,p1)
        gLine(ox,oy,ox+tot*sc,oy,WHITE,2,p1*0.4);gLine(ox+tot*sc,oy,ox+tot*sc,oy+tot*sc,WHITE,2,p1*0.4)
        gLine(ox+tot*sc,oy+tot*sc,ox,oy+tot*sc,WHITE,2,p1*0.4);gLine(ox,oy+tot*sc,ox,oy,WHITE,2,p1*0.4)
        gLine(ox+a5*sc,oy,ox+a5*sc,oy+tot*sc,'rgba(255,255,255,0.2)',1,p1*0.6)
        gLine(ox,oy+a5*sc,ox+tot*sc,oy+a5*sc,'rgba(255,255,255,0.2)',1,p1*0.6)}

      // ② a² 등장
      if(p>0.18){const p2=easeOutCubic((p-0.18)/0.22)
        ctx.save();ctx.globalAlpha=p2*0.3;ctx.fillStyle=VIO;ctx.fillRect(ox,oy,a5*sc,a5*sc);ctx.restore()
        ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=VIO;ctx.strokeRect(ox,oy,a5*sc,a5*sc);ctx.restore()
        gText('② a²',ox+a5*sc/2,oy+a5*sc/2,VIO,14,p2)
        gCircle(ox,oy,4,VIO,true,p2*0.7);gCircle(ox+a5*sc,oy+a5*sc,4,VIO,true,p2*0.7)}

      // ③ 두 ab 등장
      if(p>0.38){const p3=easeOutCubic((p-0.38)/0.22)
        ctx.save();ctx.globalAlpha=p3*0.25;ctx.fillStyle=ORG
        ctx.fillRect(ox+a5*sc,oy,b5*sc,a5*sc);ctx.fillRect(ox,oy+a5*sc,a5*sc,b5*sc);ctx.restore()
        ctx.save();ctx.globalAlpha=p3;ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.shadowBlur=6;ctx.shadowColor=ORG
        ctx.strokeRect(ox+a5*sc,oy,b5*sc,a5*sc);ctx.strokeRect(ox,oy+a5*sc,a5*sc,b5*sc);ctx.restore()
        gText('③ab',ox+a5*sc+b5*sc/2,oy+a5*sc/2,ORG,12,p3)
        gText('③ab',ox+a5*sc/2,oy+a5*sc+b5*sc/2,ORG,12,p3)
        gLine(ox+a5*sc+b5*sc/2,oy+a5*sc/2+10,ox+a5*sc/2,oy+a5*sc+b5*sc/2-10,ORG,1,p3*0.4)}

      // ④ b² 등장
      if(p>0.57){const p4=easeOutCubic((p-0.57)/0.22)
        ctx.save();ctx.globalAlpha=p4*0.3;ctx.fillStyle=GRN;ctx.fillRect(ox+a5*sc,oy+a5*sc,b5*sc,b5*sc);ctx.restore()
        ctx.save();ctx.globalAlpha=p4;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=GRN;ctx.strokeRect(ox+a5*sc,oy+a5*sc,b5*sc,b5*sc);ctx.restore()
        gText('④ b²',ox+a5*sc+b5*sc/2,oy+a5*sc+b5*sc/2,GRN,14,p4)
        gCircle(ox+a5*sc,oy+a5*sc,4,GRN,true,p4*0.7)}

      // ⑤ 전체 강조 + 결론
      if(p>0.76){const p5=easeOutCubic((p-0.76)/0.24)
        ctx.save();ctx.globalAlpha=p5*0.15;ctx.fillStyle=WHITE;ctx.fillRect(ox,oy,tot*sc,tot*sc);ctx.restore()
        ctx.save();ctx.globalAlpha=p5;ctx.strokeStyle=WHITE;ctx.lineWidth=2.5;ctx.strokeRect(ox,oy,tot*sc,tot*sc);ctx.restore()
        gCircle(cx,H-14,W*0.44,MINT,false,p5*0.06)
        gText('⑤ (a+b)² = a²+2ab+b²',cx,H-14,MINT,14,p5)}
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
      // M021: (x+a)(x+b) 넓이 4칸 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const aV=v('a',2),bV=v('b',3)
      const sz=Math.min(78,W*0.19),ox=cx-sz,oy=cy-sz*0.6-5
      const labels=[['x²',`${aV}x`],[`${bV}x`,`${aV*bV}`]]
      const colors=[[VIO,ORG],[GRN,ORG]]

      // ① 식 제목
      if(p>0.02){const p1=easeOutCubic((p-0.02)/0.2)
        gText(`① (x+${aV})(x+${bV}) 넓이 모델`,cx,18,WHITE,14,p1)
        gLine(cx-140,28,cx+140,28,'rgba(255,255,255,0.18)',1,p1*0.5)
        gText('x',ox+sz/2,oy-14,'rgba(255,255,255,0.4)',12,p1)
        gText(String(aV),ox+sz+sz/2,oy-14,'rgba(255,165,0,0.5)',12,p1)
        gText('x',ox-16,oy+sz*0.3,'rgba(255,255,255,0.4)',12,p1)
        gText(String(bV),ox-16,oy+sz*0.6+sz*0.3,'rgba(0,255,180,0.5)',12,p1)}

      // ② x² 칸
      if(p>0.18){const p2=easeOutCubic((p-0.18)/0.22)
        ctx.save();ctx.globalAlpha=p2*0.3;ctx.fillStyle=VIO;ctx.fillRect(ox,oy,sz,sz*0.6);ctx.restore()
        ctx.save();ctx.globalAlpha=p2*0.9;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=VIO;ctx.strokeRect(ox,oy,sz,sz*0.6);ctx.restore()
        gText('② x²',ox+sz/2,oy+sz*0.3,VIO,14,p2)
        gCircle(ox,oy,4,VIO,true,p2*0.7);gCircle(ox+sz,oy+sz*0.6,4,VIO,true,p2*0.7)}

      // ③ ax, bx 칸
      if(p>0.38){const p3=easeOutCubic((p-0.38)/0.22)
        ctx.save();ctx.globalAlpha=p3*0.2;ctx.fillStyle=ORG;ctx.fillRect(ox+sz,oy,sz,sz*0.6);ctx.restore()
        ctx.save();ctx.globalAlpha=p3*0.85;ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.shadowBlur=6;ctx.shadowColor=ORG;ctx.strokeRect(ox+sz,oy,sz,sz*0.6);ctx.restore()
        gText(`③ ${aV}x`,ox+sz+sz/2,oy+sz*0.3,ORG,13,p3)
        ctx.save();ctx.globalAlpha=p3*0.2;ctx.fillStyle=GRN;ctx.fillRect(ox,oy+sz*0.6,sz,sz*0.6);ctx.restore()
        ctx.save();ctx.globalAlpha=p3*0.85;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.shadowBlur=6;ctx.shadowColor=GRN;ctx.strokeRect(ox,oy+sz*0.6,sz,sz*0.6);ctx.restore()
        gText(`③ ${bV}x`,ox+sz/2,oy+sz*0.6+sz*0.3,GRN,13,p3)
        gLine(ox+sz+sz/2,oy+sz*0.3+10,ox+sz/2,oy+sz*0.6+sz*0.3-10,'rgba(255,165,0,0.3)',1,p3*0.5)}

      // ④ ab 칸
      if(p>0.57){const p4=easeOutCubic((p-0.57)/0.22)
        ctx.save();ctx.globalAlpha=p4*0.25;ctx.fillStyle=ORG;ctx.fillRect(ox+sz,oy+sz*0.6,sz,sz*0.6);ctx.restore()
        ctx.save();ctx.globalAlpha=p4*0.85;ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.shadowBlur=6;ctx.shadowColor=ORG;ctx.strokeRect(ox+sz,oy+sz*0.6,sz,sz*0.6);ctx.restore()
        gText(`④ ${aV*bV}`,ox+sz+sz/2,oy+sz*0.6+sz*0.3,ORG,14,p4)
        gCircle(ox+sz,oy+sz*0.6,5,ORG,true,p4*0.8)}

      // ⑤ 합산 결론
      if(p>0.76){const p5=easeOutCubic((p-0.76)/0.24)
        const sumX=aV+bV,prod=aV*bV
        gCircle(cx,H-14,W*0.46,MINT,false,p5*0.06)
        gLine(30,H-26,W-30,H-26,'rgba(0,255,204,0.15)',1,p5)
        gText(`⑤ x²+(${aV}+${bV})x+${aV*bV} = x²+${sumX}x+${prod}`,cx,H-14,MINT,13,p5)}
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
      // M023: 완전제곱식 (a+b)² — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const aV=v('a',3),bV=v('b',2),tot=aV+bV
      const sz=Math.min(68,W*0.17),ox=cx-sz,oy=cy-sz/2-8

      // ① 식 제시
      if(p>0.02){const p1=easeOutCubic((p-0.02)/0.2)
        gText(`① ${aV}²+2×${aV}×${bV}+${bV}² 확인`,cx,18,WHITE,13,p1)
        gLine(cx-130,28,cx+130,28,'rgba(255,255,255,0.15)',1,p1*0.5)}

      // ② a² 칸
      if(p>0.18){const p2=easeOutCubic((p-0.18)/0.22)
        ctx.save();ctx.globalAlpha=p2*0.3;ctx.fillStyle=VIO;ctx.fillRect(ox,oy,sz,sz);ctx.restore()
        ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=VIO;ctx.strokeRect(ox,oy,sz,sz);ctx.restore()
        gText(`② a²=${aV*aV}`,ox+sz/2,oy+sz/2,VIO,13,p2)
        gCircle(ox,oy,4,VIO,true,p2*0.7);gCircle(ox+sz,oy+sz,4,VIO,true,p2*0.7)
        gLine(ox-14,oy,ox-14,oy+sz,VIO,2,p2*0.6)
        gText(String(aV),ox-22,oy+sz/2,VIO,11,p2)}

      // ③ 두 ab 칸
      if(p>0.38){const p3=easeOutCubic((p-0.38)/0.22)
        ctx.save();ctx.globalAlpha=p3*0.22;ctx.fillStyle=ORG
        ctx.fillRect(ox+sz,oy,sz,sz/2+4);ctx.fillRect(ox,oy+sz,sz,sz/2-4);ctx.restore()
        ctx.save();ctx.globalAlpha=p3*0.85;ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.shadowBlur=6;ctx.shadowColor=ORG
        ctx.strokeRect(ox+sz,oy,sz,sz/2+4);ctx.strokeRect(ox,oy+sz,sz,sz/2-4);ctx.restore()
        gText('③ab',ox+sz+sz/2,oy+(sz/2+4)/2,ORG,12,p3)
        gText('③ab',ox+sz/2,oy+sz+(sz/2-4)/2,ORG,12,p3)
        gLine(ox+sz,oy+(sz/2+4)/2,ox+sz/2,oy+sz+(sz/2-4)/2,ORG,1,p3*0.4)}

      // ④ b² 칸
      if(p>0.57){const p4=easeOutCubic((p-0.57)/0.22)
        ctx.save();ctx.globalAlpha=p4*0.28;ctx.fillStyle=GRN;ctx.fillRect(ox+sz,oy+sz/2+4,sz,sz/2-4);ctx.restore()
        ctx.save();ctx.globalAlpha=p4;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=GRN;ctx.strokeRect(ox+sz,oy+sz/2+4,sz,sz/2-4);ctx.restore()
        gText(`④ b²=${bV*bV}`,ox+sz+sz/2,oy+sz/2+4+(sz/2-4)/2,GRN,13,p4)
        gCircle(ox+sz+sz,oy+sz,4,GRN,true,p4*0.7)
        gLine(ox+sz+sz+14,oy,ox+sz+sz+14,oy+sz,GRN,2,p4*0.6)
        gText(String(bV),ox+sz+sz+22,oy+sz/2,GRN,11,p4)}

      // ⑤ 결론
      if(p>0.78){const p5=easeOutCubic((p-0.78)/0.22)
        gCircle(cx,H-14,W*0.42,MINT,false,p5*0.07)
        gLine(30,H-26,W-30,H-26,'rgba(0,255,204,0.15)',1,p5)
        gText(`⑤ = (${aV}+${bV})² = (a+b)²`,cx,H-14,MINT,15,p5)}
      break
    }

    case 'factorization_diff': case 'factorization_viz': {
      // M024: 합차 인수분해 L자→재배열 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const aV=v('a',5),bV=v('b',2)
      const sz=Math.min(90,W*0.23),bsz=sz*(bV/aV)*0.8
      const ox=cx-sz/2,oy=cy-sz/2-10

      // ① a² 전체
      if(p>0.02){const p1=easeOutCubic((p-0.02)/0.2)
        gText(`① a²-b² : ${aV}²-${bV}²`,cx,16,WHITE,14,p1)
        gLine(cx-90,26,cx+90,26,'rgba(255,255,255,0.15)',1,p1*0.5)
        ctx.save();ctx.globalAlpha=p1*0.18;ctx.fillStyle=VIO;ctx.fillRect(ox,oy,sz,sz);ctx.restore()
        ctx.save();ctx.globalAlpha=p1;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=VIO;ctx.strokeRect(ox,oy,sz,sz);ctx.restore()
        gText(`② a²=${aV*aV}`,cx,cy,VIO,14,p1)}

      // ② b² 구석 표시
      if(p>0.22){const p2=easeOutCubic((p-0.22)/0.2)
        ctx.save();ctx.globalAlpha=p2*0.45;ctx.fillStyle=ORG;ctx.fillRect(ox+sz-bsz,oy+sz-bsz,bsz,bsz);ctx.restore()
        ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.shadowBlur=6;ctx.shadowColor=ORG;ctx.strokeRect(ox+sz-bsz,oy+sz-bsz,bsz,bsz);ctx.restore()
        gText(`② -b²`,ox+sz-bsz/2,oy+sz-bsz/2,ORG,12,p2)
        gCircle(ox+sz-bsz,oy+sz-bsz,4,ORG,true,p2*0.8)}

      // ③ L자 강조
      if(p>0.42){const p3=easeOutCubic((p-0.42)/0.2)
        gLine(ox,oy,ox+sz-bsz,oy,WHITE,2.5,p3);gLine(ox+sz-bsz,oy,ox+sz-bsz,oy+sz,WHITE,2.5,p3)
        gLine(ox,oy,ox,oy+sz,WHITE,2.5,p3);gLine(ox,oy+sz,ox+sz,oy+sz,WHITE,2.5,p3)
        gLine(ox+sz,oy+sz-bsz,ox+sz,oy+sz,WHITE,2.5,p3)
        gText('③ L자 모양 영역',cx-20,oy+sz+14,'rgba(255,255,255,0.45)',11,p3)}

      // ④ 재배열 직사각형
      if(p>0.6){const p4=easeOutCubic((p-0.6)/0.22)
        const rw=Math.min(160,W*0.38),rh=Math.min(44,H*0.17)
        ctx.save();ctx.globalAlpha=p4*0.28;ctx.fillStyle=GRN;ctx.fillRect(cx-rw/2,cy+sz/2+12,rw,rh);ctx.restore()
        ctx.save();ctx.globalAlpha=p4;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=GRN;ctx.strokeRect(cx-rw/2,cy+sz/2+12,rw,rh);ctx.restore()
        gText('④ 재배열 직사각형',cx,cy+sz/2+12+rh/2,GRN,13,p4)
        gLine(cx-rw/2,cy+sz/2+12,cx-rw/2,cy+sz/2+12+rh,VIO,3,p4)
        gLine(cx-rw/2,cy+sz/2+12+rh,cx+rw/2,cy+sz/2+12+rh,ORG,3,p4)
        gText('(a-b)',cx-rw/2-24,cy+sz/2+12+rh/2,VIO,12,p4)
        gText('(a+b)',cx,cy+sz/2+12+rh+14,ORG,12,p4)}

      // ⑤ 결론
      if(p>0.8){const p5=easeOutCubic((p-0.8)/0.2)
        gCircle(cx,H-14,W*0.44,MINT,false,p5*0.06)
        gLine(30,H-26,W-30,H-26,'rgba(0,255,204,0.15)',1,p5)
        gText(`⑤ a²-b² = (a+b)(a-b)`,cx,H-14,MINT,15,p5)}
      break
    }

    // ══════════════════════════════════════════
    // M025~M044 — 설계서 v2 기반 전용 시각화
    // ══════════════════════════════════════════

    case 'simultaneous_eq': {
      // M025: 연립방정식 가감법 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sc=v('sc',28)
      const solX=v('solX',2),solY=v('solY',2)

      // ① 좌표축
      if(p>0.02){const p1=easeOutCubic((p-0.02)/0.2)
        gLine(30,cy,W-30,cy,'rgba(255,255,255,0.12)',2,p1)
        gLine(cx,20,cx,H-20,'rgba(255,255,255,0.12)',2,p1)
        for(let i=-4;i<=4;i++){if(i===0) continue
          gLine(cx+i*sc,cy-4,cx+i*sc,cy+4,'rgba(255,255,255,0.2)',1,p1)
          gLine(cx-4,cy-i*sc,cx+4,cy-i*sc,'rgba(255,255,255,0.2)',1,p1)
          if(i%2===0){gText(String(i),cx+i*sc,cy+14,'rgba(255,255,255,0.25)',9,p1)
            gText(String(i),cx-14,cy-i*sc,'rgba(255,255,255,0.25)',9,p1)}}
        gText('① 연립방정식 그래프',cx,16,WHITE,13,p1)}

      // ② 직선1: x+y=4
      if(p>0.18){const p2=easeOutCubic((p-0.18)/0.25)
        ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=VIO
        ctx.beginPath();ctx.moveTo(cx-4*sc,cy+4*sc-4*sc);ctx.lineTo(cx+4*sc,cy-4*sc+4*sc);ctx.stroke();ctx.restore()
        gText('② x+y=4',W-62,cy-3*sc,VIO,12,p2)
        gCircle(cx+4*sc,cy,4,VIO,false,p2*0.5);gCircle(cx,cy-4*sc,4,VIO,false,p2*0.5)}

      // ③ 직선2: x-y=0
      if(p>0.38){const p3=easeOutCubic((p-0.38)/0.25)
        ctx.save();ctx.globalAlpha=p3;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=GRN
        ctx.beginPath();ctx.moveTo(cx-4*sc,cy+4*sc);ctx.lineTo(cx+4*sc,cy-4*sc);ctx.stroke();ctx.restore()
        gText('③ x-y=0',W-62,cy-2*sc,GRN,12,p3)
        gCircle(cx,cy,4,GRN,false,p3*0.5)}

      // ④ 교점 표시
      if(p>0.58){const p4=easeOutElastic(Math.min(1,(p-0.58)/0.3))
        gCircle(cx+solX*sc,cy-solY*sc,8,ORG,true,p4)
        gLine(cx+solX*sc,cy,cx+solX*sc,cy-solY*sc,ORG,1.5,p4*0.5)
        gLine(cx,cy-solY*sc,cx+solX*sc,cy-solY*sc,ORG,1.5,p4*0.5)
        gText(`④ (${solX}, ${solY})`,cx+solX*sc+22,cy-solY*sc-14,ORG,14,p4)}

      // ⑤ 가감법 결론
      if(p>0.78){const p5=easeOutCubic((p-0.78)/0.22)
        gLine(30,H-26,W-30,H-26,'rgba(0,255,204,0.15)',1,p5)
        gCircle(cx,H-14,W*0.45,MINT,false,p5*0.06)
        gText(`⑤ 더하기: 2x=4 → x=${solX}, y=${solY}`,cx,H-14,MINT,13,p5)}
      break
    }

    case 'simultaneous_sub': {
      // M026: 연립방정식 대입법 — A급 5단계 (완전 재작성)
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const k=v('k',2),s=v('s',6)
      // y=kx, x+kx=s → x(1+k)=s → x=s/(1+k), y=k*s/(1+k)
      const xAns=Math.round(s/(1+k)*100)/100, yAns=Math.round(k*xAns*100)/100
      const sc=26

      // ① 연립방정식 제시
      if(p>0.02){const p1=easeOutCubic((p-0.02)/0.2)
        gText('① 연립방정식 대입법',cx,16,WHITE,14,p1)
        gLine(cx-110,26,cx+110,26,'rgba(255,255,255,0.15)',1,p1*0.5)
        // 두 식 박스
        ctx.save();ctx.globalAlpha=p1*0.15;ctx.fillStyle=VIO;ctx.fillRect(cx-100,34,100,28);ctx.restore()
        ctx.save();ctx.globalAlpha=p1*0.7;ctx.strokeStyle=VIO;ctx.lineWidth=1.5;ctx.strokeRect(cx-100,34,100,28);ctx.restore()
        ctx.save();ctx.globalAlpha=p1*0.15;ctx.fillStyle=GRN;ctx.fillRect(cx+2,34,100,28);ctx.restore()
        ctx.save();ctx.globalAlpha=p1*0.7;ctx.strokeStyle=GRN;ctx.lineWidth=1.5;ctx.strokeRect(cx+2,34,100,28);ctx.restore()
        gText(`y = ${k}x`,cx-50,48,VIO,14,p1)
        gText(`x + y = ${s}`,cx+52,48,GRN,14,p1)}

      // ② 대입 과정
      if(p>0.2){const p2=easeOutCubic((p-0.2)/0.25)
        gLine(cx-90,cy-32,cx+90,cy-32,'rgba(255,165,0,0.2)',1,p2*0.6)
        gText(`② y=${k}x 대입:`,cx,cy-44,ORG,13,p2)
        gText(`x + ${k}x = ${s}`,cx,cy-28,ORG,16,p2)
        // 화살표
        ctx.save();ctx.globalAlpha=p2*0.5;ctx.strokeStyle=ORG;ctx.lineWidth=1.5
        ctx.beginPath();ctx.moveTo(cx-50,48+28);ctx.quadraticCurveTo(cx-50,cy-44,cx-40,cy-44);ctx.stroke()
        ctx.restore()}

      // ③ x 정리
      if(p>0.42){const p3=easeOutCubic((p-0.42)/0.22)
        gLine(cx-80,cy+2,cx+80,cy+2,'rgba(83,74,183,0.3)',1,p3*0.5)
        gText(`③ ${1+k}x = ${s}`,cx,cy-6,VIO,16,p3)
        gCircle(cx,cy-6,55,VIO,false,p3*0.15)
        gLine(cx-40,cy+8,cx+40,cy+8,'rgba(255,255,255,0.2)',1,p3*0.4)
        gText(`x = ${s} ÷ ${1+k} = ${xAns}`,cx,cy+22,VIO,14,p3)}

      // ④ y 대입 계산
      if(p>0.62){const p4=easeOutCubic((p-0.62)/0.22)
        gLine(cx-80,cy+42,cx+80,cy+42,'rgba(29,158,117,0.3)',1,p4*0.5)
        gText(`④ y = ${k}×${xAns} = ${yAns}`,cx,cy+56,GRN,15,p4)
        gCircle(cx,cy+56,55,GRN,false,p4*0.15)}

      // ⑤ 해 강조
      if(p>0.8){const p5=easeOutCubic((p-0.8)/0.2)
        gLine(30,H-28,W-30,H-28,'rgba(0,255,204,0.15)',1,p5)
        gCircle(cx,H-14,W*0.44,MINT,false,p5*0.06)
        gText(`⑤ 해: x=${xAns},  y=${yAns}`,cx,H-14,MINT,15,p5)}
      break
    }

    case 'quadratic_eq_factor': {
      // M027: 이차방정식 인수분해 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const r1=v('r1',2),r2=v('r2',3)
      const scX=28,scY=14,baseY=cy+38
      const qb=-(r1+r2),qc=r1*r2,mid=(r1+r2)/2

      // ① 좌표축 + 수식
      if(p>0.02){const p1=easeOutCubic((p-0.02)/0.2)
        gLine(30,baseY,W-30,baseY,'rgba(255,255,255,0.12)',2,p1)
        gLine(cx,18,cx,H-18,'rgba(255,255,255,0.12)',2,p1)
        for(let i=-4;i<=4;i++){if(i===0) continue
          gLine(cx+i*scX,baseY-4,cx+i*scX,baseY+4,'rgba(255,255,255,0.2)',1,p1)
          if(i%2===0) gText(String(i+Math.round(mid)),cx+i*scX,baseY+14,'rgba(255,255,255,0.25)',9,p1)}
        const sgB=qb<0?'':'+',sgC=qc<0?'':'+',eqStr=`① x²${sgB}${qb}x${sgC}${qc}=0`
        gText(eqStr,cx,18,WHITE,13,p1)}

      // ② 포물선 그리기
      if(p>0.18){const p2=easeOutCubic((p-0.18)/0.3)
        ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=VIO
        ctx.beginPath();let st=false
        for(let x=mid-3.8;x<=mid+3.8;x+=0.04){const y2=(x-r1)*(x-r2);const sx=cx+(x-mid)*scX,sy=baseY-y2*scY
          if(sy<14||sy>H-14){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)}
        ctx.stroke();ctx.restore()
        // 대칭축
        gLine(cx+(mid-mid)*scX,baseY-8,cx+(mid-mid)*scX,18,'rgba(255,255,255,0.15)',1,p2*0.5)
        gText('② 포물선',cx+60,32,VIO,12,p2)}

      // ③ x축 교점 수직선
      if(p>0.46){const p3=easeOutCubic((p-0.46)/0.22)
        gLine(cx+(r1-mid)*scX,baseY-4,cx+(r1-mid)*scX,baseY+20,ORG,2,p3)
        gLine(cx+(r2-mid)*scX,baseY-4,cx+(r2-mid)*scX,baseY+20,ORG,2,p3)
        gText('③ x축 교점',cx,baseY-22,'rgba(255,165,0,0.5)',11,p3)}

      // ④ 교점 원 + 라벨
      if(p>0.6){const p4=easeOutElastic(Math.min(1,(p-0.6)/0.3))
        gCircle(cx+(r1-mid)*scX,baseY,7,ORG,true,p4)
        gCircle(cx+(r2-mid)*scX,baseY,7,ORG,true,p4)
        gText(`④ x=${r1}`,cx+(r1-mid)*scX,baseY+28,ORG,13,p4)
        gText(`x=${r2}`,cx+(r2-mid)*scX,baseY+28,ORG,13,p4)}

      // ⑤ 인수분해식
      if(p>0.8){const p5=easeOutCubic((p-0.8)/0.2)
        gLine(30,H-26,W-30,H-26,'rgba(0,255,204,0.15)',1,p5)
        gCircle(cx,H-14,W*0.44,MINT,false,p5*0.06)
        gText(`⑤ (x-${r1})(x-${r2})=0`,cx,H-14,MINT,15,p5)}
      break
    }

    case 'quadratic_formula_viz': {
      // M028: 근의 공식 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const qa=v('a',1),qb2=v('b',-3),qc2=v('c',2)
      const disc=qb2*qb2-4*qa*qc2,sqrtDisc=disc>=0?Math.sqrt(disc):0
      const qr1=Math.round((-qb2-sqrtDisc)/(2*qa)*100)/100
      const qr2=Math.round((-qb2+sqrtDisc)/(2*qa)*100)/100
      const qMid=(qr1+qr2)/2
      const sc3=24,baseY2=cy+55

      // ① 표준형 제시
      if(p>0.02){const p1=easeOutCubic((p-0.02)/0.18)
        gText('① ax²+bx+c=0',cx,18,WHITE,14,p1)
        gLine(cx-100,28,cx+100,28,'rgba(255,255,255,0.15)',1,p1*0.5)}

      // ② 근의 공식
      if(p>0.18){const p2=easeOutCubic((p-0.18)/0.22)
        gText('② x = (-b±√(b²-4ac)) / 2a',cx,cy-60,VIO,14,p2)
        gLine(cx-140,cy-48,cx+140,cy-48,VIO,1,p2*0.4)
        gCircle(cx,cy-60,80,VIO,false,p2*0.1)}

      // ③ 판별식 계산
      if(p>0.38){const p3=easeOutCubic((p-0.38)/0.22)
        gText(`③ 판별식 D = ${qb2}²-4×${qa}×${qc2} = ${disc}`,cx,cy-26,GRN,13,p3)
        gLine(cx-140,cy-14,cx+140,cy-14,GRN,1,p3*0.4)}

      // ④ 포물선 + 교점
      if(p>0.55){const p4=easeOutCubic((p-0.55)/0.28)
        gLine(30,baseY2,W-30,baseY2,'rgba(255,255,255,0.1)',1.5,p4)
        gLine(cx,baseY2-100,cx,baseY2+20,'rgba(255,255,255,0.1)',1.5,p4*0.5)
        ctx.save();ctx.globalAlpha=p4;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=VIO
        ctx.beginPath();let st=false
        for(let x=qMid-2.8;x<=qMid+2.8;x+=0.04){const y2=qa*x*x+qb2*x+qc2;const sx=cx+(x-qMid)*sc3,sy=baseY2-y2*sc3*0.65
          if(sy<14||sy>H-14){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)}
        ctx.stroke();ctx.restore()
        // 꼭짓점
        const vx=cx,vy=baseY2-qa*(qMid-qMid)*(qMid-qMid)*sc3*0.65+(qb2*qMid+qc2)*sc3*0.65
        gCircle(vx,vy,4,VIO,true,p4*0.6)
        gText('④ 포물선',cx+50,baseY2-45,VIO,12,p4)
        if(disc>=0){gCircle(cx+(qr1-qMid)*sc3,baseY2,6,ORG,true,p4);gCircle(cx+(qr2-qMid)*sc3,baseY2,6,ORG,true,p4)
          gLine(cx+(qr1-qMid)*sc3,baseY2,cx+(qr1-qMid)*sc3,baseY2+16,ORG,1.5,p4)
          gLine(cx+(qr2-qMid)*sc3,baseY2,cx+(qr2-qMid)*sc3,baseY2+16,ORG,1.5,p4)}}

      // ⑤ 결론
      if(p>0.8){const p5=easeOutCubic((p-0.8)/0.2)
        gLine(30,H-26,W-30,H-26,'rgba(0,255,204,0.15)',1,p5)
        gCircle(cx,H-14,W*0.46,MINT,false,p5*0.06)
        const ans=disc>=0?`⑤ x=${qr2} 또는 x=${qr1}`:'⑤ 실수 근 없음 (D<0)'
        gText(ans,cx,H-14,MINT,14,p5)}
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
      // M034: 일차방정식 활용 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const price=v('price',500),extra=v('extra',200),total2=v('total',2200)
      const ans=Math.round((total2-extra)/price)
      // ① 문제 제시
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.15))
        gText('① 문제: 사과 x개, 500x+200=2200',cx,22,WHITE,13,p1)
        gLine(M,38,W-M,38,'rgba(255,255,255,0.1)',1,p1)}
      // ② 수직선 시각화
      if(p>0.15){const p2=easeOutCubic((p-0.15)/0.2)
        gLine(40,cy-30,W-40,cy-30,'rgba(255,255,255,0.2)',1.5,p2)
        gLine(40,cy-30,40,cy-22,'rgba(255,255,255,0.3)',1.5,p2)
        gLine(W-40,cy-30,W-40,cy-22,'rgba(255,255,255,0.3)',1.5,p2)
        gText('0',40,cy-14,VIO,11,p2);gText(String(total2),W-40,cy-14,ORG,11,p2)
        gText(`② 전체 ${total2}원`,cx,cy-46,VIO,12,p2)}
      // ③ 등식 변환
      if(p>0.35){const p3=easeOutCubic((p-0.35)/0.2)
        gText('③ 500x = 2200 − 200 = 2000',cx,cy+5,VIO,14,p3)
        gLine(cx-120,cy+18,cx+120,cy+18,VIO,1,p3*0.4)}
      // ④ 해 강조
      if(p>0.55){const p4=easeOutCubic((p-0.55)/0.2)
        gText(`④ x = 2000 ÷ 500 = ${ans}`,cx,cy+40,GRN,18,p4)
        gCircle(cx,cy+40,36,GRN,false,p4*0.5)}
      // ⑤ 사과 ans개 시각화
      if(p>0.75){const p5=easeOutCubic((p-0.75)/0.2)
        for(let i=0;i<ans;i++){const px=cx-(ans-1)*18+i*36;gCircle(px,cy+80,14,ORG,true,p5*0.8);gText(String(i+1),px,cy+80,'#000',10,p5)}
        gText(`⑤ 사과 ${ans}개 확인!`,cx,cy+102,ORG,13,p5)
        gLine(cx-ans*20,cy+92,cx+ans*20,cy+92,ORG,1.5,p5*0.5)}
      break
    }

    case 'parabola_basic': {
      // M035: y=ax² — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sc=26,scY=11,baseY=cy+40
      // ① 좌표축
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.12))
        gLine(30,baseY,W-30,baseY,'rgba(255,255,255,0.2)',1.5,p1)
        gLine(cx,20,cx,H-20,'rgba(255,255,255,0.2)',1.5,p1)
        gText('① 좌표축',cx,H-14,'rgba(255,255,255,0.35)',11,p1)
        gText('x',W-20,baseY-10,'rgba(255,255,255,0.3)',11,p1)
        gText('y',cx+10,24,'rgba(255,255,255,0.3)',11,p1)}
      // ② a=1 포물선
      if(p>0.15){const cp=easeOutCubic((p-0.15)/0.22)
        ctx.save();ctx.globalAlpha=cp;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=VIO;ctx.beginPath();let st=false
        for(let x=-4;x<=4;x+=0.05){const yv=x*x;const sx=cx+x*sc,sy=baseY-yv*scY;if(sy<18||sy>H-18){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()
        gText('② a=1',cx+3*sc,baseY-9*scY-12,VIO,12,cp)
        gCircle(cx,baseY,5,VIO,true,cp)}
      // ③ a=2 포물선
      if(p>0.38){const cp=easeOutCubic((p-0.38)/0.22)
        ctx.save();ctx.globalAlpha=cp;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=GRN;ctx.beginPath();let st=false
        for(let x=-4;x<=4;x+=0.05){const yv=2*x*x;const sx=cx+x*sc,sy=baseY-yv*scY;if(sy<18||sy>H-18){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()
        gText('③ a=2 더 좁음',cx+2.2*sc,baseY-2*4*scY-12,GRN,12,cp)
        gCircle(cx,baseY,5,GRN,true,cp)}
      // ④ a=-1 포물선
      if(p>0.6){const cp=easeOutCubic((p-0.6)/0.22)
        ctx.save();ctx.globalAlpha=cp;ctx.strokeStyle=ORG;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=ORG;ctx.beginPath();let st=false
        for(let x=-4;x<=4;x+=0.05){const yv=-x*x;const sx=cx+x*sc,sy=baseY-yv*scY;if(sy<18||sy>H-18){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()
        gText('④ a=-1 아래로',cx+2.5*sc,baseY+9*scY+14,ORG,12,cp)
        gLine(cx,baseY-5,cx,baseY+5,ORG,2,cp)}
      // ⑤ 결론
      if(p>0.82){const p5=easeOutCubic((p-0.82)/0.18)
        gText('⑤ a>0 위로 / a<0 아래로 / |a|클수록 좁음',cx,H-14,WHITE,11,p5)
        gLine(40,H-24,W-40,H-24,'rgba(255,255,255,0.1)',1,p5)}
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
      // M037: 꼭짓점+대칭축 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sc=26,scY=13,baseY=cy+40
      const pvH=v('h',1),pvK=v('k',-3)
      const vx=cx+pvH*sc, vy=baseY-pvK*scY
      // ① 좌표축
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.12))
        gLine(30,baseY,W-30,baseY,'rgba(255,255,255,0.2)',1.5,p1)
        gLine(cx,20,cx,H-20,'rgba(255,255,255,0.2)',1.5,p1)
        gText('① 좌표축',cx,H-14,'rgba(255,255,255,0.3)',10,p1)}
      // ② 포물선 그리기
      if(p>0.15){const cp=easeOutCubic((p-0.15)/0.25)
        ctx.save();ctx.globalAlpha=cp;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=VIO;ctx.beginPath();let st=false
        for(let x=pvH-4.5;x<=pvH+4.5;x+=0.05){const yv=(x-pvH)*(x-pvH)+pvK;const sx=cx+x*sc,sy=baseY-yv*scY;if(sy<16||sy>H-16){st=false;continue};if(!st){ctx.moveTo(sx,sy);st=true}else ctx.lineTo(sx,sy)};ctx.stroke();ctx.restore()
        gText(`② y=(x−${pvH})²+${pvK}`,cx-60,22,VIO,12,cp)}
      // ③ 꼭짓점 표시
      if(p>0.4){const p3=easeOutElastic(Math.min(1,(p-0.4)/0.25))
        gCircle(vx,vy,8,ORG,true,p3)
        gLine(vx-14,vy,vx+14,vy,ORG,1.5,p3*0.6)
        gLine(vx,vy-14,vx,vy+14,ORG,1.5,p3*0.6)
        gText(`③ 꼭짓점 (${pvH},${pvK})`,vx+20,vy+16,ORG,12,p3)}
      // ④ 대칭축
      if(p>0.6){const p4=easeOutCubic((p-0.6)/0.2)
        gLine(vx,16,vx,H-16,GRN,2,p4*0.5)
        gText(`④ 대칭축 x=${pvH}`,vx+12,30,GRN,12,p4)
        gCircle(vx,baseY,5,GRN,true,p4*0.7)}
      // ⑤ 최솟값/최댓값
      if(p>0.8){const p5=easeOutCubic((p-0.8)/0.2)
        gText(`⑤ 최솟값 = ${pvK} (a>0 위로 볼록)`,cx,H-14,WHITE,11,p5)
        gLine(40,H-24,W-40,H-24,'rgba(255,255,255,0.08)',1,p5)}
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
      // M041: 연립방정식 활용 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sc=24
      const baseY=cy+20
      // ① 문제 제시
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.12))
        gText('① 문제: x+y=7, 2x−y=2',cx,20,WHITE,13,p1)
        gLine(M,34,W-M,34,'rgba(255,255,255,0.08)',1,p1)}
      // ② 좌표축
      if(p>0.12){const p2=easeOutCubic((p-0.12)/0.15)
        gLine(30,baseY,W-30,baseY,'rgba(255,255,255,0.2)',1.5,p2)
        gLine(cx,42,cx,H-18,'rgba(255,255,255,0.2)',1.5,p2)
        gText('② 좌표 설정',cx,H-14,'rgba(255,255,255,0.3)',10,p2)}
      // ③ 직선1: x+y=7
      if(p>0.28){const p3=easeOutCubic((p-0.28)/0.22)
        ctx.save();ctx.globalAlpha=p3;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=VIO
        ctx.beginPath();ctx.moveTo(cx-3*sc,baseY+3*sc);ctx.lineTo(cx+3*sc,baseY-3*sc);ctx.stroke();ctx.restore()
        gText('③ x+y=7',cx-2*sc,baseY+2*sc+14,VIO,12,p3)}
      // ④ 직선2: 2x-y=2
      if(p>0.5){const p4=easeOutCubic((p-0.5)/0.22)
        ctx.save();ctx.globalAlpha=p4;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=GRN
        ctx.beginPath();ctx.moveTo(cx-3*sc,baseY-4*sc);ctx.lineTo(cx+3*sc,baseY+2*sc);ctx.stroke();ctx.restore()
        gText('④ 2x−y=2',cx+2*sc,baseY-2*sc-14,GRN,12,p4)}
      // ⑤ 교점 (해)
      if(p>0.72){const p5=easeOutElastic(Math.min(1,(p-0.72)/0.22))
        const ix=cx+sc*3/2, iy=baseY-sc*3/2
        gCircle(ix,iy,8,ORG,true,p5)
        gLine(ix-16,iy,ix+16,iy,ORG,1.5,p5*0.5)
        gLine(ix,iy-16,ix,iy+16,ORG,1.5,p5*0.5)
        gText('⑤ 해: (3, 4)',ix+22,iy-14,ORG,14,p5)
        gLine(ix,baseY,ix,iy,ORG,1,p5*0.3)
        gLine(cx,iy,ix,iy,ORG,1,p5*0.3)}
      break
    }

    case 'triangle_congruent': {
      // M042: 삼각형 합동 조건 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const sz=28,triY=[cy-60,cy-10,cy+40]
      const labels=['SSS: 세 변이 같으면','SAS: 두 변+끼인각','ASA: 두 각+끼인변']
      const colors=[VIO,GRN,ORG]
      // ① 제목
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.1))
        gText('① 합동 조건 3가지',cx,18,WHITE,13,p1)
        gLine(M,30,W-M,30,'rgba(255,255,255,0.1)',1,p1)}
      // ② SSS
      if(p>0.12){const p2=easeOutCubic((p-0.12)/0.2);const ox=W*0.18,y=triY[0]
        ctx.save();ctx.globalAlpha=p2*0.7;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=VIO
        ctx.beginPath();ctx.moveTo(ox,y+sz);ctx.lineTo(ox+sz,y);ctx.lineTo(ox+sz*2,y+sz);ctx.closePath();ctx.stroke()
        ctx.setLineDash([4,3]);ctx.globalAlpha=p2*0.5;ctx.beginPath();ctx.moveTo(ox+sz*2.6,y+sz);ctx.lineTo(ox+sz*3.6,y);ctx.lineTo(ox+sz*4.6,y+sz);ctx.closePath();ctx.stroke();ctx.restore()
        gLine(ox,y+sz,ox+sz*2.6,y+sz,VIO,1.5,p2*0.4)
        gText('② SSS: 세 변 같음',W*0.55,y+sz/2,VIO,12,p2)}
      // ③ SAS
      if(p>0.35){const p3=easeOutCubic((p-0.35)/0.2);const ox=W*0.18,y=triY[1]
        ctx.save();ctx.globalAlpha=p3*0.7;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=GRN
        ctx.beginPath();ctx.moveTo(ox,y+sz);ctx.lineTo(ox+sz,y);ctx.lineTo(ox+sz*2,y+sz);ctx.closePath();ctx.stroke()
        ctx.setLineDash([4,3]);ctx.globalAlpha=p3*0.5;ctx.beginPath();ctx.moveTo(ox+sz*2.6,y+sz);ctx.lineTo(ox+sz*3.6,y);ctx.lineTo(ox+sz*4.6,y+sz);ctx.closePath();ctx.stroke();ctx.restore()
        gCircle(ox+sz,y,6,GRN,true,p3*0.8)
        gText('③ SAS: 두 변+끼인각',W*0.55,y+sz/2,GRN,12,p3)}
      // ④ ASA
      if(p>0.58){const p4=easeOutCubic((p-0.58)/0.2);const ox=W*0.18,y=triY[2]
        ctx.save();ctx.globalAlpha=p4*0.7;ctx.strokeStyle=ORG;ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=ORG
        ctx.beginPath();ctx.moveTo(ox,y+sz);ctx.lineTo(ox+sz,y);ctx.lineTo(ox+sz*2,y+sz);ctx.closePath();ctx.stroke()
        ctx.setLineDash([4,3]);ctx.globalAlpha=p4*0.5;ctx.beginPath();ctx.moveTo(ox+sz*2.6,y+sz);ctx.lineTo(ox+sz*3.6,y);ctx.lineTo(ox+sz*4.6,y+sz);ctx.closePath();ctx.stroke();ctx.restore()
        gCircle(ox,y+sz,5,ORG,true,p4*0.8);gCircle(ox+sz*2,y+sz,5,ORG,true,p4*0.8)
        gText('④ ASA: 두 각+끼인변',W*0.55,y+sz/2,ORG,12,p4)}
      // ⑤ 결론
      if(p>0.82){const p5=easeOutCubic((p-0.82)/0.18)
        gText('⑤ 세 조건 중 하나 → 합동!',cx,H-14,WHITE,13,p5)
        gLine(40,H-26,W-40,H-26,'rgba(255,255,255,0.1)',1,p5)}
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
      // M044: 평행사변형 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const pw=140,ph=74,skew=32,ox=cx-pw/2-16,oy=cy-ph/2
      const pts=[{x:ox+skew,y:oy},{x:ox+pw+skew,y:oy},{x:ox+pw,y:oy+ph},{x:ox,y:oy+ph}]
      const midX=(pts[0].x+pts[2].x)/2,midY=(pts[0].y+pts[2].y)/2
      // ① 평행사변형 그리기
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.15))
        ctx.save();ctx.globalAlpha=p1*0.12;ctx.fillStyle=WHITE
        ctx.beginPath();pts.forEach((pt,i)=>i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y));ctx.closePath();ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=p1*0.8;ctx.strokeStyle=WHITE;ctx.lineWidth=2.5
        ctx.beginPath();pts.forEach((pt,i)=>i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y));ctx.closePath();ctx.stroke();ctx.restore()
        gText('① 평행사변형',cx,H-14,'rgba(255,255,255,0.3)',10,p1)}
      // ② 대변 같음 (위아래 = VIO, 좌우 = GRN)
      if(p>0.2){const p2=easeOutCubic((p-0.2)/0.2)
        gLine(pts[0].x,pts[0].y,pts[1].x,pts[1].y,VIO,3.5,p2)
        gLine(pts[3].x,pts[3].y,pts[2].x,pts[2].y,VIO,3.5,p2)
        gText('② AB=DC',cx,pts[0].y-14,VIO,12,p2)
        gText('=',cx-10,pts[0].y-14,VIO,10,p2*0)}
      // ③ 옆변 같음
      if(p>0.4){const p3=easeOutCubic((p-0.4)/0.2)
        gLine(pts[1].x,pts[1].y,pts[2].x,pts[2].y,GRN,3.5,p3)
        gLine(pts[0].x,pts[0].y,pts[3].x,pts[3].y,GRN,3.5,p3)
        gText('③ AD=BC',pts[2].x+14,cy,GRN,12,p3)}
      // ④ 대각선 그리기
      if(p>0.6){const p4=easeOutCubic((p-0.6)/0.2)
        gLine(pts[0].x,pts[0].y,pts[2].x,pts[2].y,ORG,2,p4*0.6)
        gLine(pts[1].x,pts[1].y,pts[3].x,pts[3].y,ORG,2,p4*0.6)
        gText('④ 대각선 2개',cx,pts[2].y+18,ORG,12,p4)}
      // ⑤ 교점(이등분) 강조
      if(p>0.78){const p5=easeOutElastic(Math.min(1,(p-0.78)/0.2))
        gCircle(midX,midY,8,ORG,true,p5)
        gCircle(midX,midY,16,ORG,false,p5*0.4)
        gText('⑤ 이등분점 O',midX+18,midY-14,ORG,12,p5)
        gLine(midX-22,midY,midX+22,midY,ORG,1.5,p5*0.5)
        gLine(midX,midY-18,midX,midY+18,ORG,1.5,p5*0.5)}
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
      // M046: 피타고라스 수 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const triples=[[3,4,5],[5,12,13],[8,15,17]]
      const colors=[VIO,GRN,ORG]
      const rowY=[cy-52,cy,cy+52]
      // ① 제목
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.1))
        gText('① 피타고라스 수: a²+b²=c²',cx,18,WHITE,13,p1)
        gLine(M,30,W-M,30,'rgba(255,255,255,0.08)',1,p1)}
      // ② (3,4,5)
      if(p>0.12){const [a4,b4,c4]=triples[0];const p2=easeOutCubic((p-0.12)/0.2)
        const sc=Math.min(2,40/c4),ox=W*0.78,y=rowY[0]
        gText(`② (${a4},${b4},${c4})`,W*0.12,y,colors[0],16,p2)
        gText(`${a4}²+${b4}²=${a4*a4+b4*b4}=${c4}²`,cx,y,'rgba(255,255,255,0.55)',12,p2)
        ctx.save();ctx.globalAlpha=p2*0.7;ctx.strokeStyle=colors[0];ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor=colors[0]
        ctx.beginPath();ctx.moveTo(ox,y+a4*sc);ctx.lineTo(ox+b4*sc,y+a4*sc);ctx.lineTo(ox,y);ctx.closePath();ctx.stroke();ctx.restore()
        ctx.save();ctx.globalAlpha=p2*0.4;ctx.fillStyle=colors[0];ctx.beginPath();ctx.moveTo(ox,y);ctx.lineTo(ox+b4*sc,y+a4*sc);ctx.lineTo(ox,y+a4*sc);ctx.closePath();ctx.fill();ctx.restore()
        gCircle(ox,y+a4*sc,3,colors[0],true,p2)}
      // ③ (5,12,13)
      if(p>0.38){const [a4,b4,c4]=triples[1];const p3=easeOutCubic((p-0.38)/0.2)
        const sc=Math.min(1.2,40/c4),ox=W*0.78,y=rowY[1]
        gText(`③ (${a4},${b4},${c4})`,W*0.12,y,colors[1],16,p3)
        gText(`${a4}²+${b4}²=${a4*a4+b4*b4}=${c4}²`,cx,y,'rgba(255,255,255,0.55)',12,p3)
        ctx.save();ctx.globalAlpha=p3*0.7;ctx.strokeStyle=colors[1];ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor=colors[1]
        ctx.beginPath();ctx.moveTo(ox,y+a4*sc);ctx.lineTo(ox+b4*sc,y+a4*sc);ctx.lineTo(ox,y);ctx.closePath();ctx.stroke();ctx.restore()
        gCircle(ox,y+a4*sc,3,colors[1],true,p3)}
      // ④ (8,15,17)
      if(p>0.6){const [a4,b4,c4]=triples[2];const p4=easeOutCubic((p-0.6)/0.2)
        const sc=Math.min(0.9,40/c4),ox=W*0.78,y=rowY[2]
        gText(`④ (${a4},${b4},${c4})`,W*0.12,y,colors[2],16,p4)
        gText(`${a4}²+${b4}²=${a4*a4+b4*b4}=${c4}²`,cx,y,'rgba(255,255,255,0.55)',12,p4)
        ctx.save();ctx.globalAlpha=p4*0.7;ctx.strokeStyle=colors[2];ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor=colors[2]
        ctx.beginPath();ctx.moveTo(ox,y+a4*sc);ctx.lineTo(ox+b4*sc,y+a4*sc);ctx.lineTo(ox,y);ctx.closePath();ctx.stroke();ctx.restore()
        gCircle(ox,y+a4*sc,3,colors[2],true,p4)}
      // ⑤ 배수도 피타고라스 수
      if(p>0.82){const p5=easeOutCubic((p-0.82)/0.18)
        gText('⑤ 배수도 피타고라스 수: (6,8,10)…',cx,H-14,WHITE,11,p5)
        gLine(40,H-26,W-40,H-26,'rgba(255,255,255,0.1)',1,p5)}
      break
    }

    case 'similarity_viz': case 'similarity_area': {
      // M048: 닮음비와 넓이비 — FULL REWRITE A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const ratio=v('ratio',2) // 닮음비 1:ratio
      const s1=Math.min(40,(H-80)/ratio), s2=s1*ratio
      const lx=cx-s2*0.7-10, rx=cx+10
      // ① 제목
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.12))
        gText(`① 닮음비 1:${ratio} → 넓이비 1:${ratio*ratio}`,cx,18,WHITE,13,p1)
        gLine(M,30,W-M,30,'rgba(255,255,255,0.08)',1,p1)}
      // ② 작은 정사각형 (s1×s1)
      if(p>0.15){const p2=easeOutCubic((p-0.15)/0.22)
        ctx.save();ctx.globalAlpha=p2*0.35;ctx.fillStyle=VIO;ctx.fillRect(lx,cy-s1/2,s1,s1);ctx.restore()
        ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=VIO;ctx.strokeRect(lx,cy-s1/2,s1,s1);ctx.restore()
        gLine(lx,cy-s1/2-12,lx+s1,cy-s1/2-12,VIO,1.5,p2)
        gText(`② 변 = ${s1.toFixed(0)}`,lx+s1/2,cy-s1/2-22,VIO,11,p2)
        gText(`넓이 = ${(s1*s1).toFixed(0)}`,lx+s1/2,cy+s1/2+16,VIO,11,p2)}
      // ③ 화살표
      if(p>0.38){const p3=easeOutCubic((p-0.38)/0.12)
        gLine(lx+s1+8,cy,rx-8,cy,'rgba(255,255,255,0.35)',1.5,p3)
        gText(`×${ratio}`,cx,cy-12,'rgba(255,255,255,0.5)',13,p3)}
      // ④ 큰 정사각형 (s2×s2)
      if(p>0.5){const p4=easeOutCubic((p-0.5)/0.25)
        ctx.save();ctx.globalAlpha=p4*0.2;ctx.fillStyle=GRN;ctx.fillRect(rx,cy-s2/2,s2,s2);ctx.restore()
        ctx.save();ctx.globalAlpha=p4;ctx.strokeStyle=GRN;ctx.lineWidth=2.5;ctx.shadowBlur=10;ctx.shadowColor=GRN;ctx.strokeRect(rx,cy-s2/2,s2,s2);ctx.restore()
        gLine(rx,cy-s2/2-12,rx+s2,cy-s2/2-12,GRN,1.5,p4)
        gText(`④ 변 = ${s2.toFixed(0)}`,rx+s2/2,cy-s2/2-22,GRN,11,p4)
        gText(`넓이 = ${(s2*s2).toFixed(0)}`,rx+s2/2,cy+s2/2+16,GRN,11,p4)
        gCircle(rx+s2/2,cy,4,GRN,true,p4*0.5)}
      // ⑤ 결론
      if(p>0.8){const p5=easeOutCubic((p-0.8)/0.2)
        gText(`⑤ 닮음비 1:${ratio} → 넓이비 1:${ratio*ratio}`,cx,H-14,ORG,13,p5)
        gLine(40,H-26,W-40,H-26,'rgba(255,255,255,0.1)',1,p5)
        gCircle(lx+s1/2,cy,s1/2+4,ORG,false,p5*0.3)
        gCircle(rx+s2/2,cy,s2/2+4,ORG,false,p5*0.3)}
      break
    }

    case 'similarity_volume': {
      // M049: 닮음비와 부피비 — FULL REWRITE A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const ratio=v('ratio',2)
      const s1=Math.min(32,(H-90)/ratio), s2=s1*ratio
      const lx=cx-s2*0.7-10, rx=cx+10
      // 등각투영 큐브 그리기 함수
      const drawCube=(bx:number,by:number,sz:number,col:string,al:number)=>{
        if(al<=0) return
        const ex=sz*0.5,ey=sz*0.28
        ctx.save();ctx.globalAlpha=al*0.18;ctx.fillStyle=col
        ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+sz,by);ctx.lineTo(bx+sz+ex,by-ey);ctx.lineTo(bx+ex,by-ey);ctx.closePath();ctx.fill()
        ctx.beginPath();ctx.moveTo(bx+sz,by);ctx.lineTo(bx+sz,by-sz);ctx.lineTo(bx+sz+ex,by-sz-ey);ctx.lineTo(bx+sz+ex,by-ey);ctx.closePath();ctx.fill()
        ctx.restore()
        ctx.save();ctx.globalAlpha=al;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.shadowBlur=10;ctx.shadowColor=col
        gLine(bx,by,bx+sz,by,col,2,al);gLine(bx,by,bx,by-sz,col,2,al)
        gLine(bx+sz,by,bx+sz,by-sz,col,2,al);gLine(bx,by-sz,bx+sz,by-sz,col,2,al)
        gLine(bx+sz,by,bx+sz+ex,by-ey,col,2,al);gLine(bx+sz,by-sz,bx+sz+ex,by-sz-ey,col,2,al)
        gLine(bx+sz+ex,by-ey,bx+sz+ex,by-sz-ey,col,2,al);gLine(bx+sz+ex,by-sz-ey,bx+ex,by-sz-ey,col,2,al)
        gLine(bx,by-sz,bx+ex,by-sz-ey,col,2,al);gLine(bx+ex,by-sz-ey,bx+sz+ex,by-sz-ey,col,2,al)
        ctx.restore()}
      const cubeBase=cy+s1*0.5
      // ① 제목
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.12))
        gText(`① 닮음비 1:${ratio} → 부피비 1:${ratio**3}`,cx,18,WHITE,13,p1)
        gLine(M,30,W-M,30,'rgba(255,255,255,0.08)',1,p1)}
      // ② 작은 큐브
      if(p>0.15){const p2=easeOutCubic((p-0.15)/0.22)
        drawCube(lx,cubeBase,s1,VIO,p2)
        gText(`② 변 = ${s1.toFixed(0)}`,lx+s1/2,cubeBase+18,VIO,11,p2)
        gText(`부피 = ${(s1**3).toFixed(0)}`,lx+s1/2,cubeBase+32,VIO,10,p2)}
      // ③ 화살표
      if(p>0.38){const p3=easeOutCubic((p-0.38)/0.14)
        gLine(lx+s1+8,cubeBase-s1/2,rx-8,cubeBase-s1/2,'rgba(255,255,255,0.35)',1.5,p3)
        gText(`×${ratio}`,lx+s1+((rx-lx-s1)/2),cubeBase-s1/2-14,'rgba(255,255,255,0.5)',13,p3)}
      // ④ 큰 큐브
      if(p>0.52){const p4=easeOutCubic((p-0.52)/0.25)
        drawCube(rx,cubeBase,s2,GRN,p4)
        gText(`④ 변 = ${s2.toFixed(0)}`,rx+s2/2,cubeBase+18,GRN,11,p4)
        gText(`부피 = ${(s2**3).toFixed(0)}`,rx+s2/2,cubeBase+32,GRN,10,p4)
        gCircle(rx+s2/2,cubeBase-s2/2,5,GRN,true,p4*0.6)}
      // ⑤ 결론
      if(p>0.8){const p5=easeOutCubic((p-0.8)/0.2)
        gText(`⑤ 닮음비 1:${ratio} → 부피비 1:${ratio**3}`,cx,H-14,ORG,13,p5)
        gLine(40,H-26,W-40,H-26,'rgba(255,255,255,0.1)',1,p5)}
      break
    }

    case 'parallel_ratio': case 'parallel_ratio_viz': {
      // M050: 평행선과 선분의 비 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const triH=v('triH',115),triW=v('triW',100)
      const A={x:cx,y:cy-triH/2},B={x:cx-triW/2,y:cy+triH/2},C={x:cx+triW/2,y:cy+triH/2}
      const t=0.42
      const D={x:A.x+(B.x-A.x)*t,y:A.y+(B.y-A.y)*t}
      const E={x:A.x+(C.x-A.x)*t,y:A.y+(C.y-A.y)*t}
      // ① 삼각형
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.14))
        ctx.save();ctx.globalAlpha=p1*0.1;ctx.fillStyle=WHITE
        ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.lineTo(C.x,C.y);ctx.closePath();ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=p1*0.8;ctx.strokeStyle=WHITE;ctx.lineWidth=2.5
        ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.lineTo(C.x,C.y);ctx.closePath();ctx.stroke();ctx.restore()
        gText('① 삼각형 ABC',cx,A.y-14,WHITE,11,p1)
        gText('A',A.x-12,A.y-4,WHITE,11,p1)
        gText('B',B.x-14,B.y+4,WHITE,11,p1)
        gText('C',C.x+6,C.y+4,WHITE,11,p1)}
      // ② 꼭짓점 점
      if(p>0.15){const p2=easeOutCubic((p-0.15)/0.14)
        gCircle(A.x,A.y,4,VIO,true,p2)
        gCircle(B.x,B.y,4,VIO,true,p2)
        gCircle(C.x,C.y,4,VIO,true,p2)
        gText('② 꼭짓점 A,B,C',cx,H-14,'rgba(255,255,255,0.35)',10,p2)}
      // ③ 평행선 DE
      if(p>0.3){const p3=easeOutCubic((p-0.3)/0.2)
        gLine(D.x-18,D.y,E.x+18,D.y,ORG,2.5,p3)
        gCircle(D.x,D.y,4,ORG,true,p3);gCircle(E.x,E.y,4,ORG,true,p3)
        gText('D',D.x-16,D.y-4,ORG,11,p3);gText('E',E.x+8,E.y-4,ORG,11,p3)
        gText('③ DE ∥ BC',cx+triW/2+16,D.y,ORG,12,p3)}
      // ④ 비 표시
      if(p>0.52){const p4=easeOutCubic((p-0.52)/0.2)
        const adLen=t*triH,dbLen=(1-t)*triH
        gLine(A.x,A.y,D.x,D.y,GRN,3,p4)
        gLine(D.x,D.y,B.x,B.y,VIO,3,p4)
        gText(`④ AD=${adLen.toFixed(0)}`,A.x-48,A.y+20,GRN,11,p4)
        gText(`DB=${dbLen.toFixed(0)}`,B.x-48,B.y-20,VIO,11,p4)}
      // ⑤ 비례식 결론
      if(p>0.75){const p5=easeOutCubic((p-0.75)/0.2)
        gText('⑤ AD/DB = AE/EC (평행선 비례)',cx,H-14,WHITE,12,p5)
        gLine(40,H-26,W-40,H-26,'rgba(255,255,255,0.1)',1,p5)
        gCircle(D.x,D.y,8,GRN,false,p5*0.5)
        gCircle(E.x,E.y,8,GRN,false,p5*0.5)}
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
      // M054: 삼각비 sin/cos/tan — A급 5단계 ①②③④⑤
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const deg=v('angle',30),rad=deg*Math.PI/180,rr=Math.min(72,H/2-28)
      const ex=cx+Math.cos(rad)*rr, ey=cy-Math.sin(rad)*rr
      // ① 좌표축+단위원
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.12))
        gLine(cx-rr-20,cy,cx+rr+20,cy,'rgba(255,255,255,0.2)',1.5,p1)
        gLine(cx,cy-rr-20,cx,cy+rr+20,'rgba(255,255,255,0.2)',1.5,p1)
        gCircle(cx,cy,rr,'rgba(255,255,255,0.15)',false,p1)
        gText('① 단위원',cx+rr+14,cy-10,'rgba(255,255,255,0.4)',10,p1)}
      // ② 반지름(빗변)
      if(p>0.15){const p2=easeOutCubic((p-0.15)/0.2)
        gLine(cx,cy,ex,ey,WHITE,2.5,p2)
        gCircle(ex,ey,5,WHITE,true,p2)
        gText(`② r=1, θ=${deg}°`,cx+12,cy-rr+18,WHITE,11,p2)}
      // ③ sin (세로, VIO)
      if(p>0.36){const p3=easeOutCubic((p-0.36)/0.2)
        gLine(ex,ey,ex,cy,VIO,2.5,p3)
        gText(`③ sin${deg}°=${r(Math.sin(rad))}`,ex+26,(ey+cy)/2,VIO,12,p3)
        gCircle(ex,cy,4,VIO,true,p3*0.6)}
      // ④ cos (가로, GRN)
      if(p>0.56){const p4=easeOutCubic((p-0.56)/0.2)
        gLine(cx,cy,ex,cy,GRN,2.5,p4)
        gText(`④ cos${deg}°=${r(Math.cos(rad))}`,(cx+ex)/2,cy+20,GRN,12,p4)
        gCircle(cx,cy,4,GRN,true,p4*0.6)}
      // ⑤ tan 결론
      if(p>0.78){const p5=easeOutCubic((p-0.78)/0.2)
        gText(`⑤ tan${deg}°=sin/cos=${r(Math.tan(rad))}`,cx,H-14,ORG,13,p5)
        gLine(40,H-26,W-40,H-26,'rgba(255,255,255,0.1)',1,p5)
        // 각도 호 표시
        ctx.save();ctx.globalAlpha=p5*0.5;ctx.strokeStyle=ORG;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,22,0,-rad,true);ctx.stroke();ctx.restore()
        gText(`${deg}°`,cx+26,cy-10,ORG,11,p5)}
      break
    }

    case 'trig_special': {
      // M055: 특수각 30°,45°,60° 비교 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const rr=Math.min(70,H/2-28)
      const specAngles=[{d:30,sin:'1/2',cos:'√3/2',tan:'1/√3',c:VIO},{d:45,sin:'√2/2',cos:'√2/2',tan:'1',c:GRN},{d:60,sin:'√3/2',cos:'1/2',tan:'√3',c:ORG}]
      // ① 제목
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.1))
        gText('① 특수각 표',cx,18,WHITE,13,p1)
        gLine(M,30,W-M,30,'rgba(255,255,255,0.1)',1,p1)}
      const rowY=[cy-52,cy,cy+52]
      specAngles.forEach((a4,i)=>{
        const stageP=0.12+i*0.24
        if(p<=stageP) return
        const prog=easeOutCubic(Math.min(1,(p-stageP)/0.2))
        const y=rowY[i], rad=a4.d*Math.PI/180
        const num=['②','③','④'][i]
        // 행 배경
        ctx.save();ctx.globalAlpha=prog*0.07;ctx.fillStyle=a4.c;ctx.fillRect(M,y-20,W-2*M,38);ctx.restore()
        gLine(M,y-22,W-M,y-22,a4.c,1,prog*0.2)
        // 각도
        gText(`${num} ${a4.d}°`,W*0.13,y,a4.c,16,prog)
        // 표 값
        gText(`sin=${a4.sin}`,W*0.37,y,a4.c,11,prog)
        gText(`cos=${a4.cos}`,W*0.57,y,a4.c,11,prog)
        gText(`tan=${a4.tan}`,W*0.77,y,a4.c,11,prog)
        // 미니 삼각형 + 원
        const triRr=22, tx=W-40, ty=y
        ctx.save();ctx.globalAlpha=prog*0.7;ctx.strokeStyle=a4.c;ctx.lineWidth=2;ctx.shadowBlur=6;ctx.shadowColor=a4.c
        ctx.beginPath();ctx.moveTo(tx,ty+10);ctx.lineTo(tx+Math.cos(rad)*triRr,ty+10-Math.sin(rad)*triRr);ctx.lineTo(tx+Math.cos(rad)*triRr,ty+10);ctx.closePath();ctx.stroke();ctx.restore()
        gCircle(tx,ty+10,3,a4.c,true,prog*0.8)
      })
      // ⑤ 암기법
      if(p>0.84){const p5=easeOutCubic((p-0.84)/0.16)
        gText('⑤ 30-45-60: sin은 1→√2→√3 (÷2)',cx,H-14,WHITE,11,p5)
        gLine(40,H-26,W-40,H-26,'rgba(255,255,255,0.1)',1,p5)}
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

    case 'solid_volume': case 'sphere_volume': {
      // M057: 구의 부피 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const rr=v('r',3),scS=Math.min(18,(H-80)/(rr*2+1)),rPx=Math.max(20,rr*scS)
      const vol=r((4/3)*Math.PI*rr*rr*rr)
      // ① 구 윤곽
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.14))
        ctx.save();ctx.globalAlpha=p1*0.1;ctx.fillStyle=VIO;ctx.beginPath();ctx.arc(cx,cy,rPx,0,Math.PI*2);ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=p1;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=16;ctx.shadowColor=VIO;ctx.beginPath();ctx.arc(cx,cy,rPx,0,Math.PI*2);ctx.stroke();ctx.restore()
        gText('① 구',cx,cy-rPx-14,VIO,12,p1)}
      // ② 적도 타원
      if(p>0.18){const p2=easeOutCubic((p-0.18)/0.18)
        ctx.save();ctx.globalAlpha=p2*0.4;ctx.strokeStyle=GRN;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(cx,cy,rPx,rPx*0.28,0,0,Math.PI*2);ctx.stroke();ctx.restore()
        gText('② 적도선',cx+rPx+12,cy,GRN,11,p2)}
      // ③ 반지름
      if(p>0.38){const p3=easeOutCubic((p-0.38)/0.18)
        gLine(cx,cy,cx+rPx,cy,ORG,2.5,p3)
        gCircle(cx,cy,4,ORG,true,p3)
        gText(`③ r = ${rr}`,cx+rPx/2,cy-16,ORG,13,p3)}
      // ④ 공식
      if(p>0.58){const p4=easeOutCubic((p-0.58)/0.2)
        gText('④ V = 4/3 × π × r³',cx,H-30,VIO,14,p4)
        gLine(cx-90,H-20,cx+90,H-20,VIO,1,p4*0.4)}
      // ⑤ 계산값
      if(p>0.78){const p5=easeOutCubic((p-0.78)/0.2)
        gText(`⑤ V = ${vol}`,cx,H-14,GRN,15,p5)
        gCircle(cx,cy,rPx+10,ORG,false,p5*0.25)}
      break
    }

    case 'sphere_surface': {
      // M058: 구의 겉넓이 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const rr=v('r',3),scS=Math.min(18,(H-80)/(rr*2+1)),rPx=Math.max(20,rr*scS)
      const surf=r(4*Math.PI*rr*rr)
      // ① 구
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.14))
        ctx.save();ctx.globalAlpha=p1*0.12;ctx.fillStyle=VIO;ctx.beginPath();ctx.arc(cx,cy,rPx,0,Math.PI*2);ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=p1;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=16;ctx.shadowColor=VIO;ctx.beginPath();ctx.arc(cx,cy,rPx,0,Math.PI*2);ctx.stroke();ctx.restore()
        gText('① 구 겉넓이',cx,cy-rPx-14,VIO,12,p1)}
      // ② 경선 그리기
      if(p>0.18){const p2=easeOutCubic((p-0.18)/0.18)
        for(let i=0;i<3;i++){const ang=i*Math.PI/3
          ctx.save();ctx.globalAlpha=p2*0.25;ctx.strokeStyle=GRN;ctx.lineWidth=1.2
          ctx.beginPath();ctx.ellipse(cx,cy,rPx*Math.cos(ang),rPx,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
        gText('② 구 표면',cx+rPx+10,cy,GRN,11,p2)}
      // ③ 반지름
      if(p>0.38){const p3=easeOutCubic((p-0.38)/0.18)
        gLine(cx,cy,cx+rPx,cy,ORG,2.5,p3)
        gCircle(cx,cy,4,ORG,true,p3)
        gText(`③ r = ${rr}`,cx+rPx/2,cy-16,ORG,13,p3)}
      // ④ 공식
      if(p>0.58){const p4=easeOutCubic((p-0.58)/0.2)
        gText('④ S = 4 × π × r²',cx,H-30,VIO,14,p4)
        gLine(cx-85,H-20,cx+85,H-20,VIO,1,p4*0.4)}
      // ⑤ 계산값
      if(p>0.78){const p5=easeOutCubic((p-0.78)/0.2)
        gText(`⑤ S = ${surf}`,cx,H-14,GRN,15,p5)
        gCircle(cx,cy,rPx+10,ORG,false,p5*0.25)}
      break
    }

    case 'cylinder_surface': {
      // M059: 원기둥 겉넓이 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const rr=v('r',3),hh=v('h',5)
      const scS=Math.min(16,(H-80)/((hh+rr*2)*1.2)),rPx=Math.max(16,rr*scS),hPx=Math.max(30,hh*scS)
      const surf=r(2*Math.PI*rr*rr + 2*Math.PI*rr*hh)
      // ① 기둥 옆면
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.14))
        ctx.save();ctx.globalAlpha=p1*0.1;ctx.fillStyle=VIO
        ctx.fillRect(cx-rPx,cy-hPx/2,rPx*2,hPx);ctx.restore()
        ctx.save();ctx.globalAlpha=p1;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=12;ctx.shadowColor=VIO
        ctx.strokeRect(cx-rPx,cy-hPx/2,rPx*2,hPx);ctx.restore()
        gText('① 원기둥',cx,cy-hPx/2-14,VIO,12,p1)}
      // ② 위아래 타원
      if(p>0.18){const p2=easeOutCubic((p-0.18)/0.18)
        ctx.save();ctx.globalAlpha=p2*0.3;ctx.fillStyle=GRN;ctx.beginPath();ctx.ellipse(cx,cy-hPx/2,rPx,rPx*0.3,0,0,Math.PI*2);ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx,cy-hPx/2,rPx,rPx*0.3,0,0,Math.PI*2);ctx.stroke();ctx.restore()
        ctx.save();ctx.globalAlpha=p2*0.3;ctx.fillStyle=GRN;ctx.beginPath();ctx.ellipse(cx,cy+hPx/2,rPx,rPx*0.3,0,0,Math.PI*2);ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx,cy+hPx/2,rPx,rPx*0.3,0,0,Math.PI*2);ctx.stroke();ctx.restore()
        gText('② 원 2개',cx+rPx+12,cy-hPx/2,GRN,11,p2)}
      // ③ 반지름+높이
      if(p>0.38){const p3=easeOutCubic((p-0.38)/0.18)
        gLine(cx,cy-hPx/2,cx+rPx,cy-hPx/2,ORG,2,p3)
        gText(`③ r=${rr}`,cx+rPx/2,cy-hPx/2-14,ORG,11,p3)
        gLine(cx+rPx+10,cy-hPx/2,cx+rPx+10,cy+hPx/2,ORG,2,p3)
        gText(`h=${hh}`,cx+rPx+24,cy,ORG,11,p3)
        gCircle(cx,cy-hPx/2,4,ORG,true,p3)
        gCircle(cx,cy+hPx/2,4,ORG,true,p3)}
      // ④ 공식
      if(p>0.58){const p4=easeOutCubic((p-0.58)/0.2)
        gText('④ S = 2πr² + 2πrh',cx,H-30,VIO,13,p4)
        gLine(cx-95,H-20,cx+95,H-20,VIO,1,p4*0.4)}
      // ⑤ 계산
      if(p>0.78){const p5=easeOutCubic((p-0.78)/0.2)
        gText(`⑤ S = ${surf}`,cx,H-14,GRN,15,p5)}
      break
    }

    case 'cone_volume': {
      // M060: 원뿔 부피 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const rr=v('r',3),hh=v('h',4)
      const scS=Math.min(18,(H-80)/((hh+rr)*1.4)),rPx=Math.max(18,rr*scS),hPx=Math.max(28,hh*scS)
      const vol=r((1/3)*Math.PI*rr*rr*hh)
      const apex={x:cx,y:cy-hPx/2}, bL={x:cx-rPx,y:cy+hPx/2}, bR={x:cx+rPx,y:cy+hPx/2}
      // ① 원뿔
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.14))
        ctx.save();ctx.globalAlpha=p1*0.1;ctx.fillStyle=VIO
        ctx.beginPath();ctx.moveTo(apex.x,apex.y);ctx.lineTo(bL.x,bL.y);ctx.lineTo(bR.x,bR.y);ctx.closePath();ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=p1;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=12;ctx.shadowColor=VIO
        ctx.beginPath();ctx.moveTo(apex.x,apex.y);ctx.lineTo(bL.x,bL.y);ctx.lineTo(bR.x,bR.y);ctx.stroke();ctx.restore()
        ctx.save();ctx.globalAlpha=p1*0.25;ctx.strokeStyle=VIO;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(cx,bL.y,rPx,rPx*0.28,0,0,Math.PI*2);ctx.stroke();ctx.restore()
        gText('① 원뿔',cx,apex.y-14,VIO,12,p1)}
      // ② 밑면 원
      if(p>0.18){const p2=easeOutCubic((p-0.18)/0.18)
        ctx.save();ctx.globalAlpha=p2*0.3;ctx.fillStyle=GRN;ctx.beginPath();ctx.ellipse(cx,bL.y,rPx,rPx*0.28,0,0,Math.PI*2);ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx,bL.y,rPx,rPx*0.28,0,0,Math.PI*2);ctx.stroke();ctx.restore()
        gText('② 밑면',cx+rPx+12,bL.y,GRN,11,p2)}
      // ③ 반지름+높이
      if(p>0.38){const p3=easeOutCubic((p-0.38)/0.18)
        gLine(cx,bL.y,cx+rPx,bL.y,ORG,2,p3)
        gText(`③ r=${rr}`,cx+rPx/2,bL.y+16,ORG,11,p3)
        gLine(cx,apex.y,cx,bL.y,ORG,2,p3*0.5)
        gText(`h=${hh}`,cx+10,cy,ORG,11,p3)
        gCircle(apex.x,apex.y,4,ORG,true,p3)}
      // ④ 공식
      if(p>0.58){const p4=easeOutCubic((p-0.58)/0.2)
        gText('④ V = 1/3 × π × r² × h',cx,H-30,VIO,13,p4)
        gLine(cx-105,H-20,cx+105,H-20,VIO,1,p4*0.4)}
      // ⑤ 계산
      if(p>0.78){const p5=easeOutCubic((p-0.78)/0.2)
        gText(`⑤ V = ${vol}`,cx,H-14,GRN,15,p5)}
      break
    }

    case 'cone_surface': {
      // M061: 원뿔 겉넓이 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const rr=v('r',3),hh=v('h',4)
      const ll=r(Math.sqrt(rr*rr+hh*hh))
      const scS=Math.min(18,(H-80)/((hh+rr)*1.4)),rPx=Math.max(18,rr*scS),hPx=Math.max(28,hh*scS)
      const surf=r(Math.PI*rr*rr + Math.PI*rr*ll)
      const apex={x:cx,y:cy-hPx/2}, bL={x:cx-rPx,y:cy+hPx/2}, bR={x:cx+rPx,y:cy+hPx/2}
      // ① 원뿔
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.14))
        ctx.save();ctx.globalAlpha=p1*0.1;ctx.fillStyle=VIO
        ctx.beginPath();ctx.moveTo(apex.x,apex.y);ctx.lineTo(bL.x,bL.y);ctx.lineTo(bR.x,bR.y);ctx.closePath();ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=p1;ctx.strokeStyle=VIO;ctx.lineWidth=2.5;ctx.shadowBlur=12;ctx.shadowColor=VIO
        ctx.beginPath();ctx.moveTo(apex.x,apex.y);ctx.lineTo(bL.x,bL.y);ctx.lineTo(bR.x,bR.y);ctx.stroke();ctx.restore()
        gText('① 원뿔',cx,apex.y-14,VIO,12,p1)}
      // ② 밑면
      if(p>0.18){const p2=easeOutCubic((p-0.18)/0.18)
        ctx.save();ctx.globalAlpha=p2*0.3;ctx.fillStyle=GRN;ctx.beginPath();ctx.ellipse(cx,bL.y,rPx,rPx*0.28,0,0,Math.PI*2);ctx.fill();ctx.restore()
        ctx.save();ctx.globalAlpha=p2;ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx,bL.y,rPx,rPx*0.28,0,0,Math.PI*2);ctx.stroke();ctx.restore()
        gText('② 밑면 원',cx+rPx+12,bL.y,GRN,11,p2)}
      // ③ 모선 강조
      if(p>0.38){const p3=easeOutCubic((p-0.38)/0.18)
        gLine(apex.x,apex.y,bR.x,bR.y,ORG,3,p3)
        gText(`③ 모선 l=${ll}`,cx+rPx/2+10,cy,ORG,12,p3)
        gCircle(apex.x,apex.y,5,ORG,true,p3)
        gLine(cx,bL.y,cx+rPx,bL.y,ORG,2,p3*0.6)
        gText(`r=${rr}`,cx+rPx/2,bL.y+16,ORG,11,p3)}
      // ④ 공식
      if(p>0.58){const p4=easeOutCubic((p-0.58)/0.2)
        gText('④ S = πr² + πrl',cx,H-30,VIO,14,p4)
        gLine(cx-80,H-20,cx+80,H-20,VIO,1,p4*0.4)}
      // ⑤ 계산
      if(p>0.78){const p5=easeOutCubic((p-0.78)/0.2)
        gText(`⑤ S = ${surf}`,cx,H-14,GRN,15,p5)}
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
      // M069~M070: 대각선 길이 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const a4=v('a',4),b4=v('b',3),d=r(Math.sqrt(a4*a4+b4*b4))
      const sdSc=Math.min(20,Math.min((W-60)/a4,(H-60)/b4)),sdOx=cx-a4*sdSc/2,sdOy=cy-b4*sdSc/2
      // ① 직사각형
      if(p>0.02){const t=easeOutCubic(Math.min(1,(p-0.02)/0.18))
        gText('① 직사각형 그리기',cx,22,VIO,14,t)
        gLine(sdOx,sdOy,sdOx+a4*sdSc,sdOy,VIO,2.5,t)
        gLine(sdOx+a4*sdSc,sdOy,sdOx+a4*sdSc,sdOy+b4*sdSc,VIO,2.5,t)
        gLine(sdOx+a4*sdSc,sdOy+b4*sdSc,sdOx,sdOy+b4*sdSc,VIO,2.5,t)
        gLine(sdOx,sdOy+b4*sdSc,sdOx,sdOy,VIO,2.5,t)
        gCircle(sdOx,sdOy,4,VIO,true,t);gCircle(sdOx+a4*sdSc,sdOy,4,VIO,true,t)
        gCircle(sdOx,sdOy+b4*sdSc,4,VIO,true,t);gCircle(sdOx+a4*sdSc,sdOy+b4*sdSc,4,VIO,true,t)
      }
      // ② 변 길이 표시
      if(p>0.22){const t=easeOutCubic(Math.min(1,(p-0.22)/0.18))
        gText('② 변 길이',cx,22,GRN,14,t)
        gText(`가로 = ${r(a4)}`,cx,sdOy+b4*sdSc+18,GRN,13,t)
        gText(`세로 = ${r(b4)}`,sdOx-24,cy,GRN,13,t)
      }
      // ③ 대각선
      if(p>0.42){const t=easeOutCubic(Math.min(1,(p-0.42)/0.18))
        gText('③ 대각선 그리기',cx,22,ORG,14,t)
        gLine(sdOx,sdOy,sdOx+a4*sdSc,sdOy+b4*sdSc,ORG,3,t)
        gCircle(cx,cy,5,ORG,true,t)
        gText(`d = ${d}`,cx+20,cy-14,ORG,16,t)
      }
      // ④ 피타고라스
      if(p>0.62){const t=easeOutCubic(Math.min(1,(p-0.62)/0.18))
        gText('④ 피타고라스 정리',cx,22,MINT,14,t)
        gText(`d² = ${r(a4)}² + ${r(b4)}² = ${a4*a4} + ${b4*b4} = ${a4*a4+b4*b4}`,cx,sdOy+b4*sdSc+40,ORG,13,t)
      }
      // ⑤ 결론
      if(p>0.82){const t=easeOutCubic(Math.min(1,(p-0.82)/0.15))
        gText('⑤ 대각선 = 루트(가로²+세로²)',cx,22,MINT,14,t)
        gText(`d = 루트(${a4*a4+b4*b4}) = ${d}`,cx,H-20,MINT,16,t)
      }
      break
    }

    case 'histogram_viz': {
      // M047: 도수분포표 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const data=[v('d0',3),v('d1',7),v('d2',12),v('d3',8),v('d4',5)]
      const maxV=Math.max(...data),total3=data.reduce((a,b)=>a+b,0)
      const barW=Math.min(44,(W-80)/data.length-10),maxBH=H-90
      const ox=cx-(data.length*(barW+10))/2,baseY=H-42
      const labels=['140~','150~','160~','170~','180~']
      const colors=[VIO,GRN,ORG,VIO,GRN]
      // ① 제목+축
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.1))
        gText('① 히스토그램 (도수분포)',cx,18,WHITE,13,p1)
        gLine(ox-10,baseY,ox+data.length*(barW+10)+10,baseY,'rgba(255,255,255,0.25)',1.5,p1)
        gLine(ox-10,baseY-maxBH-10,ox-10,baseY,'rgba(255,255,255,0.25)',1.5,p1)}
      // ② 막대 솟아오름
      if(p>0.12){data.forEach((d2,i)=>{const bh=(d2/maxV)*maxBH;const x=ox+i*(barW+10)
        const stageP=Math.min(1,Math.max(0,(p-0.12-i*0.08)/0.22))
        if(stageP<=0) return
        const prog=easeOutCubic(stageP)
        ctx.save();ctx.globalAlpha=prog*0.55;ctx.fillStyle=colors[i]+'66';ctx.strokeStyle=colors[i];ctx.lineWidth=2
        ctx.shadowBlur=8;ctx.shadowColor=colors[i]
        ctx.fillRect(x,baseY-bh*prog,barW,bh*prog);ctx.strokeRect(x,baseY-bh*prog,barW,bh*prog);ctx.restore()
        gText(String(d2),x+barW/2,baseY-bh*prog-12,colors[i],11,prog)
        gText(labels[i],x+barW/2,baseY+14,'rgba(255,255,255,0.45)',8,prog)})}
      // ③ 가장 큰 막대 강조
      if(p>0.6){const p3=easeOutCubic((p-0.6)/0.15)
        const mi=data.indexOf(maxV);const x=ox+mi*(barW+10)
        ctx.save();ctx.globalAlpha=p3*0.2;ctx.fillStyle=ORG
        ctx.fillRect(x,baseY-maxBH,barW,maxBH);ctx.restore()
        gCircle(x+barW/2,baseY-maxBH-10,5,ORG,true,p3)
        gText('③ 최빈 계급',x+barW/2,baseY-maxBH-26,ORG,11,p3)}
      // ④ 단위
      if(p>0.75){const p4=easeOutCubic((p-0.75)/0.15)
        gText('④ 단위: cm / 도수: 명',ox+data.length*(barW+10)*0.5,baseY+28,'rgba(255,255,255,0.5)',10,p4)}
      // ⑤ 합계
      if(p>0.88){const p5=easeOutCubic((p-0.88)/0.12)
        gText(`⑤ 총 도수: ${total3}명`,cx,H-14,WHITE,12,p5)
        gLine(ox-10,H-26,ox+data.length*(barW+10)+10,H-26,'rgba(255,255,255,0.1)',1,p5)}
      break
    }

    case 'relative_freq': {
      // M053: 상대도수 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const data=[v('d0',3),v('d1',7),v('d2',12),v('d3',8),v('d4',5)]
      const total3=data.reduce((a,b)=>a+b,0)
      const barW=Math.min(42,(W-80)/data.length-10),maxBH=H-92
      const ox=cx-(data.length*(barW+10))/2,baseY=H-44
      const colors=[VIO,GRN,ORG,VIO,GRN]
      const labels=['A','B','C','D','E']
      // ① 제목+축
      if(p>0.0){const p1=easeOutCubic(Math.min(1,p/0.1))
        gText('① 상대도수 = 도수÷전체',cx,18,WHITE,13,p1)
        gLine(ox-10,baseY,ox+data.length*(barW+10)+10,baseY,'rgba(255,255,255,0.25)',1.5,p1)
        gLine(ox-10,baseY-maxBH-10,ox-10,baseY,'rgba(255,255,255,0.25)',1.5,p1)
        gText('1.0',ox-30,baseY-maxBH,'rgba(255,255,255,0.3)',9,p1)
        gText('0',ox-14,baseY,'rgba(255,255,255,0.3)',9,p1)}
      // ② 도수 막대
      if(p>0.12){data.forEach((d2,i)=>{
        const freqH=(d2/Math.max(...data))*maxBH
        const x=ox+i*(barW+10)
        const sp=Math.max(0,(p-0.12-i*0.05)/0.18)
        if(sp<=0) return
        const prog=easeOutCubic(Math.min(1,sp))
        ctx.save();ctx.globalAlpha=prog*0.3;ctx.fillStyle=colors[i];ctx.fillRect(x,baseY-freqH*prog,barW,freqH*prog);ctx.restore()
        ctx.save();ctx.globalAlpha=prog*0.5;ctx.strokeStyle=colors[i];ctx.lineWidth=1.5;ctx.strokeRect(x,baseY-freqH*prog,barW,freqH*prog);ctx.restore()
        gText(String(d2),x+barW/2,baseY-freqH*prog-12,colors[i],10,prog)
        gText(labels[i],x+barW/2,baseY+13,'rgba(255,255,255,0.45)',9,prog)})}
      // ③ 상대도수 막대 (겹쳐서)
      if(p>0.48){data.forEach((d2,i)=>{
        const relH=(d2/total3)*maxBH
        const x=ox+i*(barW+10)
        const sp=Math.max(0,(p-0.48-i*0.04)/0.18)
        if(sp<=0) return
        const prog=easeOutCubic(Math.min(1,sp))
        ctx.save();ctx.globalAlpha=prog*0.7;ctx.fillStyle=colors[i]+'55';ctx.strokeStyle=colors[i];ctx.lineWidth=2.5;ctx.shadowBlur=8;ctx.shadowColor=colors[i]
        ctx.fillRect(x,baseY-relH*prog,barW,relH*prog);ctx.strokeRect(x,baseY-relH*prog,barW,relH*prog);ctx.restore()
        gText(r(d2/total3,2).toFixed(2),x+barW/2,baseY-relH*prog-12,colors[i],10,prog)})}
      // ④ 합계 = 1.0 선
      if(p>0.72){const p4=easeOutCubic((p-0.72)/0.14)
        gLine(ox-8,baseY-maxBH,ox+data.length*(barW+10)+8,baseY-maxBH,ORG,1.5,p4*0.5)
        gText(`④ 전체 합 = ${total3}명 → 상대도수 합 = 1.0`,cx,baseY-maxBH-14,ORG,10,p4)}
      // ⑤ 결론
      if(p>0.88){const p5=easeOutCubic((p-0.88)/0.12)
        gText('⑤ 상대도수로 비교 가능 (전체가 달라도)',cx,H-14,WHITE,11,p5)
        gLine(40,H-26,W-40,H-26,'rgba(255,255,255,0.1)',1,p5)}
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
      // M074: 산점도와 상관관계 — A급 5단계
      const VIO='#534AB7',GRN='#1D9E75',ORG='#D85A30'
      const crSc=20,crBaseY=cy+60,crOx=50
      const crPts: [number,number][] = [[2,1],[3,2],[4,2.5],[5,3],[6,4],[7,4.5],[8,5],[9,5.5]]
      // ① 좌표축
      if(p>0.02){const t=easeOutCubic(Math.min(1,(p-0.02)/0.16))
        gText('① 좌표축',cx,22,WHITE,14,t)
        gLine(crOx,crBaseY,W-30,crBaseY,'rgba(255,255,255,0.2)',1.5,t)
        gLine(crOx,20,crOx,H-20,'rgba(255,255,255,0.2)',1.5,t)
        gText('x',W-25,crBaseY-10,'#666',11,t); gText('y',crOx+12,26,'#666',11,t)
        gCircle(crOx,crBaseY,3,WHITE,true,t)
      }
      // ② 점 찍기
      if(p>0.2){const t=easeOutCubic(Math.min(1,(p-0.2)/0.2))
        gText('② 데이터 점 찍기',cx,22,VIO,14,t)
        crPts.forEach(([x2,y2],i)=>{
          const prog=easeOutCubic(Math.min(1,Math.max(0,t*2-i*0.15)))
          gCircle(crOx+x2*crSc,crBaseY-y2*crSc,5,VIO,true,prog*0.8)
        })
      }
      // ③ 추세선
      if(p>0.45){const t=easeOutCubic(Math.min(1,(p-0.45)/0.18))
        gText('③ 추세선 그리기',cx,22,GRN,14,t)
        gLine(crOx+1*crSc,crBaseY-0.5*crSc,crOx+10*crSc,crBaseY-6*crSc,GRN,2.5,t)
        gCircle(crOx+1*crSc,crBaseY-0.5*crSc,4,GRN,true,t)
        gCircle(crOx+10*crSc,crBaseY-6*crSc,4,GRN,true,t)
      }
      // ④ 상관 판정
      if(p>0.65){const t=easeOutCubic(Math.min(1,(p-0.65)/0.15))
        gText('④ 양의 상관관계',cx,22,ORG,14,t)
        gText('점들이 오른쪽 위로 모인다',cx+60,crBaseY-3*crSc,ORG,13,t)
        gLine(cx+30,crBaseY-3*crSc+8,cx+30,crBaseY-3*crSc-8,ORG,2,t)
      }
      // ⑤ 결론
      if(p>0.82){const t=easeOutCubic(Math.min(1,(p-0.82)/0.15))
        gText('⑤ x가 커지면 y도 커진다',cx,22,MINT,14,t)
        gText('양의 상관관계',cx,H-20,MINT,16,t)
      }
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
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const base = v('base', 2)
      const sc = 26
      const axisY = cy + 20

      // ① 좌표축 그리기
      if (p > 0.02) {
        const ap = easeOutCubic((p - 0.02) / 0.18)
        gLine(30, axisY, W - 30, axisY, 'rgba(255,255,255,0.25)', 1.5, ap)
        gLine(cx, 25, cx, H - 20, 'rgba(255,255,255,0.25)', 1.5, ap)
        gText('① 좌표축 그리기', cx, H - 14, 'rgba(255,255,255,0.4)', 11, ap)
        gText('x', W - 20, axisY - 10, 'rgba(255,255,255,0.35)', 12, ap)
        gText('y', cx + 10, 30, 'rgba(255,255,255,0.35)', 12, ap)
      }

      // ② y = base^x 곡선 (보라) 점진적으로 그려짐
      if (p > 0.2) {
        const lp = easeOutCubic((p - 0.2) / 0.2)
        ctx.save(); ctx.globalAlpha = lp; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5
        ctx.shadowBlur = 14; ctx.shadowColor = VIO; ctx.beginPath()
        let st = false
        for (let x = -4.5; x <= 4; x += 0.05) {
          const yv = Math.pow(base, x)
          if (!Number.isFinite(yv)) continue
          const sx = cx + x * sc, sy = axisY - yv * sc * 0.7
          if (!Number.isFinite(sy) || sy < 22 || sy > H - 20) { st = false; continue }
          if (!st) { ctx.moveTo(sx, sy); st = true } else ctx.lineTo(sx, sy)
        }
        ctx.stroke(); ctx.restore()
        gText(`② y = ${base}ˣ 곡선 (보라)`, cx - 60, 36, VIO, 12, lp)
      }

      // ③ y = (1/base)^x 곡선 (초록) 반대 방향
      if (p > 0.4) {
        const lp3 = easeOutCubic((p - 0.4) / 0.2)
        ctx.save(); ctx.globalAlpha = lp3 * 0.85; ctx.strokeStyle = GRN; ctx.lineWidth = 2
        ctx.shadowBlur = 10; ctx.shadowColor = GRN; ctx.beginPath()
        let st3 = false
        const invBase = 1 / base
        for (let x = -4; x <= 4.5; x += 0.05) {
          const yv = Math.pow(invBase, x)
          if (!Number.isFinite(yv)) continue
          const sx = cx + x * sc, sy = axisY - yv * sc * 0.7
          if (!Number.isFinite(sy) || sy < 22 || sy > H - 20) { st3 = false; continue }
          if (!st3) { ctx.moveTo(sx, sy); st3 = true } else ctx.lineTo(sx, sy)
        }
        ctx.stroke(); ctx.restore()
        gText(`③ y = (1/${base})ˣ 반대 방향`, cx + 70, 52, GRN, 12, lp3)
      }

      // ④ (0,1) 점 강조 — "항상 y>0, (0,1) 통과"
      if (p > 0.6) {
        const lp4 = easeOutCubic((p - 0.6) / 0.2)
        gCircle(cx, axisY - sc * 0.7, 7, ORG, true, lp4)
        gLine(cx, axisY - sc * 0.7, cx + 55, axisY - sc * 0.7 - 22, ORG, 1.5, lp4 * 0.7)
        gText('④ (0, 1) 항상 통과', cx + 95, axisY - sc * 0.7 - 28, ORG, 12, lp4)
        gText('y > 0 항상 성립', cx + 90, axisY - sc * 0.7 - 10, 'rgba(255,255,255,0.55)', 11, lp4)
      }

      // ⑤ 지수함수 특징 텍스트
      if (p > 0.8) {
        const lp5 = easeOutCubic((p - 0.8) / 0.2)
        gText('⑤ 밑 > 1 이면 증가, 0 < 밑 < 1 이면 감소', cx, H - 30, 'rgba(255,255,255,0.7)', 12, lp5)
        gLine(30, H - 38, W - 30, H - 38, 'rgba(255,255,255,0.1)', 1, lp5)
      }
      break
    }

    case 'log_func': {
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const logBase = v('base', 2)
      const sc2 = 26
      const axisY2 = cy + 10
      const ox2 = cx - 60

      // ① 좌표축 그리기
      if (p > 0.02) {
        const ap = easeOutCubic((p - 0.02) / 0.18)
        gLine(30, axisY2, W - 30, axisY2, 'rgba(255,255,255,0.25)', 1.5, ap)
        gLine(ox2, 22, ox2, H - 20, 'rgba(255,255,255,0.25)', 1.5, ap)
        gText('① 좌표축 그리기', cx + 60, H - 14, 'rgba(255,255,255,0.4)', 11, ap)
        gText('x', W - 20, axisY2 - 10, 'rgba(255,255,255,0.35)', 12, ap)
        gText('y', ox2 + 10, 30, 'rgba(255,255,255,0.35)', 12, ap)
      }

      // ② y = log_base(x) 곡선 그려짐 (주황)
      if (p > 0.2) {
        const lp = easeOutCubic((p - 0.2) / 0.2)
        ctx.save(); ctx.globalAlpha = lp; ctx.strokeStyle = ORG; ctx.lineWidth = 2.5
        ctx.shadowBlur = 14; ctx.shadowColor = ORG; ctx.beginPath()
        let stL = false
        for (let x = 0.08; x <= 9; x += 0.05) {
          const yv = Math.log(x) / Math.log(logBase)
          if (!Number.isFinite(yv)) continue
          const sx = ox2 + x * sc2 * 0.65, sy = axisY2 - yv * sc2
          if (sx < 32 || sx > W - 20 || sy < 22 || sy > H - 20) { stL = false; continue }
          if (!stL) { ctx.moveTo(sx, sy); stL = true } else ctx.lineTo(sx, sy)
        }
        ctx.stroke(); ctx.restore()
        gText(`② y = log₍${logBase}₎x (주황)`, cx + 60, 38, ORG, 12, lp)
      }

      // ③ y = base^x 곡선 회색 점선 비교
      if (p > 0.4) {
        const lp3 = easeOutCubic((p - 0.4) / 0.2)
        ctx.save(); ctx.globalAlpha = lp3 * 0.45; ctx.strokeStyle = 'rgba(200,200,200,0.6)'
        ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]); ctx.beginPath()
        let stE = false
        for (let x = -3; x <= 3.5; x += 0.05) {
          const yv = Math.pow(logBase, x)
          if (!Number.isFinite(yv)) continue
          const sx = ox2 + x * sc2, sy = axisY2 - yv * sc2
          if (!Number.isFinite(sy) || sy < 22 || sy > H - 20) { stE = false; continue }
          if (!stE) { ctx.moveTo(sx, sy); stE = true } else ctx.lineTo(sx, sy)
        }
        ctx.stroke(); ctx.setLineDash([]); ctx.restore()
        gText(`③ y = ${logBase}ˣ 비교 (회색 점선)`, cx - 50, 55, 'rgba(200,200,200,0.6)', 11, lp3)
      }

      // ④ y=x 대칭축 표시
      if (p > 0.6) {
        const lp4 = easeOutCubic((p - 0.6) / 0.2)
        const symLen = Math.min(cx - 30, H / 2 - 10)
        gLine(ox2 - symLen, axisY2 + symLen, ox2 + symLen, axisY2 - symLen, VIO, 1.5, lp4 * 0.6)
        gText('④ y=x 대칭축', ox2 - symLen + 18, axisY2 + symLen - 10, VIO, 12, lp4)
      }

      // ⑤ "지수함수의 역함수" + (1,0) 점 강조
      if (p > 0.8) {
        const lp5 = easeOutCubic((p - 0.8) / 0.2)
        gCircle(ox2 + sc2 * 0.65, axisY2, 6, GRN, true, lp5)
        gLine(ox2 + sc2 * 0.65, axisY2, ox2 + sc2 * 0.65 + 10, axisY2 - 25, GRN, 1.5, lp5 * 0.7)
        gText('(1, 0) 통과', ox2 + sc2 * 0.65 + 55, axisY2 - 28, GRN, 12, lp5)
        gText('⑤ 지수함수의 역함수 — log', cx, H - 28, 'rgba(255,255,255,0.7)', 12, lp5)
      }
      break
    }

    case 'trig_func': {
      const angleDeg = v('angle', 45)
      const angle = angleDeg * Math.PI / 180
      const r2 = Math.min(70, H / 2 - 25), ocx = cx - 80
      // 단위원
      gCircle(ocx, cy, r2, 'rgba(255,255,255,0.15)', false, p)
      // 축
      gLine(ocx - r2 - 10, cy, ocx + r2 + 10, cy, 'rgba(255,255,255,0.12)', 1, p)
      gLine(ocx, cy - r2 - 10, ocx, cy + r2 + 10, 'rgba(255,255,255,0.12)', 1, p)
      // 점 P
      const px = ocx + Math.cos(angle) * r2, py = cy - Math.sin(angle) * r2
      gLine(ocx, cy, px, py, WHITE, 2, p)
      gCircle(px, py, 5, MINT, true, p)
      // cos 투영 (x축)
      gLine(px, cy, px, py, MINT, 2, p * 0.7)
      gLine(ocx, cy, px, cy, PURPLE, 2, p * 0.7)
      // 값 표시
      gText(`θ = ${Math.round(angleDeg)}°`, cx + 60, cy - 40, AMBER, 14, p)
      gText(`sin θ = ${r(Math.sin(angle))}`, cx + 60, cy - 10, MINT, 13, p)
      gText(`cos θ = ${r(Math.cos(angle))}`, cx + 60, cy + 15, PURPLE, 13, p)
      gText('P(cos θ, sin θ)', cx + 60, cy + 45, '#999', 11, p)
      break
    }

    case 'trig_graph': {
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const amp = v('amp', 1), freq = v('freq', 1)
      const sc3 = Math.min(45, (W - 80) / (2 * Math.PI * 2))
      const ampPx = Math.min(50, (H - 80) / 2.5) * amp
      const axisYT = cy
      const oxT = 50

      // ① 좌표축 + 주기 표시
      if (p > 0.02) {
        const ap = easeOutCubic((p - 0.02) / 0.18)
        gLine(30, axisYT, W - 30, axisYT, 'rgba(255,255,255,0.25)', 1.5, ap)
        gLine(oxT, 22, oxT, H - 18, 'rgba(255,255,255,0.25)', 1.5, ap)
        const period = (2 * Math.PI / freq) * sc3
        gLine(oxT + period, axisYT - 6, oxT + period, axisYT + 6, 'rgba(255,255,255,0.4)', 1.5, ap)
        gText('① 주기: 2π', oxT + period / 2, axisYT + 16, 'rgba(255,255,255,0.5)', 11, ap)
        gText('x', W - 20, axisYT - 10, 'rgba(255,255,255,0.35)', 12, ap)
      }

      // ② sin 파형 그려짐 (보라)
      if (p > 0.2) {
        const lp = easeOutCubic((p - 0.2) / 0.2)
        ctx.save(); ctx.globalAlpha = lp; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5
        ctx.shadowBlur = 12; ctx.shadowColor = VIO; ctx.beginPath()
        let stS = false
        for (let x = 0; x <= (W - oxT - 20) / sc3; x += 0.04) {
          const sx = oxT + x * sc3, sy = axisYT - Math.sin(freq * x) * ampPx
          if (sx > W - 20) break
          if (!stS) { ctx.moveTo(sx, sy); stS = true } else ctx.lineTo(sx, sy)
        }
        ctx.stroke(); ctx.restore()
        gText('② y = sin x (보라)', cx + 20, 30, VIO, 12, lp)
      }

      // ③ cos 파형 겹쳐짐 (초록)
      if (p > 0.4) {
        const lp3 = easeOutCubic((p - 0.4) / 0.2)
        ctx.save(); ctx.globalAlpha = lp3 * 0.85; ctx.strokeStyle = GRN; ctx.lineWidth = 2
        ctx.shadowBlur = 10; ctx.shadowColor = GRN; ctx.beginPath()
        let stC = false
        for (let x = 0; x <= (W - oxT - 20) / sc3; x += 0.04) {
          const sx = oxT + x * sc3, sy = axisYT - Math.cos(freq * x) * ampPx
          if (sx > W - 20) break
          if (!stC) { ctx.moveTo(sx, sy); stC = true } else ctx.lineTo(sx, sy)
        }
        ctx.stroke(); ctx.restore()
        gText('③ y = cos x (초록)', cx + 20, 48, GRN, 12, lp3)
      }

      // ④ 진폭, 주기 라벨 표시
      if (p > 0.6) {
        const lp4 = easeOutCubic((p - 0.6) / 0.2)
        gLine(oxT - 12, axisYT - ampPx, oxT, axisYT - ampPx, ORG, 1.5, lp4 * 0.8)
        gLine(oxT - 12, axisYT, oxT, axisYT, ORG, 1.5, lp4 * 0.8)
        gLine(oxT - 8, axisYT - ampPx, oxT - 8, axisYT, ORG, 1.5, lp4 * 0.8)
        gText(`④ 진폭: ${amp}`, oxT - 8, axisYT - ampPx / 2, ORG, 12, lp4)
        const periodPx = (2 * Math.PI / freq) * sc3
        gCircle(oxT + periodPx, axisYT, 4, ORG, true, lp4)
        gText(`주기: 2π/${freq === 1 ? '' : freq}`, oxT + periodPx, axisYT - 18, ORG, 11, lp4)
      }

      // ⑤ "sin과 cos은 위상차 90도"
      if (p > 0.8) {
        const lp5 = easeOutCubic((p - 0.8) / 0.2)
        gText('⑤ sin과 cos은 위상차 90° (π/2)', cx, H - 28, 'rgba(255,255,255,0.75)', 12, lp5)
        gLine(30, H - 36, W - 30, H - 36, 'rgba(255,255,255,0.1)', 1, lp5)
      }
      break
    }

    case 'arithmetic_seq': {
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const a0 = v('a', 2), d = v('d', 3), n = v('n', 5)
      const maxV = a0 + (n - 1) * d
      const barW = Math.min(48, (W - 70) / n - 8)
      const gap = 8
      const maxBH = H - 90
      const baseY = H - 46
      const ox = cx - (n * (barW + gap)) / 2 + gap / 2

      // ① 좌표축 + 첫 항 a₁ 표시
      if (p > 0.02) {
        const ap = easeOutCubic((p - 0.02) / 0.18)
        gLine(ox - 12, baseY, W - 20, baseY, 'rgba(255,255,255,0.3)', 1.5, ap)
        gLine(ox - 12, 22, ox - 12, baseY + 4, 'rgba(255,255,255,0.3)', 1.5, ap)
        gText('① 수열 시작: 첫 항 a₁', cx, 22, 'rgba(255,255,255,0.5)', 11, ap)
        const firstBH = (a0 / maxV) * maxBH * 0.18
        gLine(ox, baseY, ox + barW, baseY, GRN, 1.5, ap)
        gLine(ox + barW / 2, baseY, ox + barW / 2, baseY - firstBH, GRN, 1.5, ap * 0.5)
        gText(`a₁=${a0}`, ox + barW / 2, baseY - firstBH - 10, GRN, 11, ap)
      }

      // ② 막대 순서대로 솟아오름 (a₁, a₁+d, a₁+2d, ...)
      if (p > 0.2) {
        const stageP = easeOutCubic((p - 0.2) / 0.4)
        for (let i = 0; i < n; i++) {
          const val = a0 + i * d
          const bh = (val / maxV) * maxBH
          const x = ox + i * (barW + gap)
          const prog = easeOutCubic(Math.min(1, Math.max(0, stageP * (n + 1) - i * 0.7)))
          ctx.save(); ctx.globalAlpha = prog * 0.85
          ctx.fillStyle = VIO + '44'; ctx.strokeStyle = VIO; ctx.lineWidth = 2
          ctx.shadowBlur = 8; ctx.shadowColor = VIO
          ctx.fillRect(x, baseY - bh * prog, barW, bh * prog)
          ctx.strokeRect(x, baseY - bh * prog, barW, bh * prog)
          ctx.restore()
          gText(String(val), x + barW / 2, baseY - bh * prog - 10, 'rgba(255,255,255,0.7)', 11, prog)
          gText(String(i + 1), x + barW / 2, baseY + 12, 'rgba(255,255,255,0.35)', 10, prog)
        }
        gText('② 항이 순서대로 솟아오름', cx, 36, VIO, 12, stageP)
      }

      // ③ 공차 d 화살표 표시 between bars
      if (p > 0.4) {
        const lp3 = easeOutCubic((p - 0.4) / 0.2)
        for (let i = 0; i < n - 1; i++) {
          const val1 = a0 + i * d, val2 = a0 + (i + 1) * d
          const bh1 = (val1 / maxV) * maxBH, bh2 = (val2 / maxV) * maxBH
          const x1 = ox + i * (barW + gap) + barW + 2
          const x2 = ox + (i + 1) * (barW + gap) - 2
          const midX = (x1 + x2) / 2
          const midY = baseY - (bh1 + bh2) / 2 - 14
          gLine(ox + i * (barW + gap) + barW / 2, baseY - bh1, ox + (i + 1) * (barW + gap) + barW / 2, baseY - bh2, ORG, 1.5, lp3 * 0.6)
          gText(`+${d}`, midX, midY, ORG, 10, lp3)
        }
        gText('③ 공차 d: 일정하게 증가', cx, 50, ORG, 12, lp3)
      }

      // ④ 일반항 공식 표시
      if (p > 0.6) {
        const lp4 = easeOutCubic((p - 0.6) / 0.2)
        ctx.save(); ctx.globalAlpha = lp4 * 0.15; ctx.fillStyle = VIO
        ctx.fillRect(cx - 120, 58, 240, 28); ctx.restore()
        gText(`④ 일반항: aₙ = ${a0} + (n-1)×${d}`, cx, 73, 'rgba(255,255,255,0.85)', 13, lp4)
      }

      // ⑤ 등차수열 = 일정하게 증가하는 계단
      if (p > 0.8) {
        const lp5 = easeOutCubic((p - 0.8) / 0.2)
        gText('⑤ 등차수열: 일정하게 증가하는 계단', cx, H - 28, 'rgba(255,255,255,0.7)', 12, lp5)
        // 계단 강조선
        for (let i = 0; i < n; i++) {
          const val = a0 + i * d
          const bh = (val / maxV) * maxBH
          const x = ox + i * (barW + gap)
          gCircle(x + barW / 2, baseY - bh, 3, GRN, true, lp5)
        }
      }
      break
    }

    case 'geometric_seq': {
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const a1 = v('a', 1), ratio = v('r', 2), n2 = v('n', 5)
      const maxV2 = a1 * Math.pow(ratio, n2 - 1)
      const barW2 = Math.min(48, (W - 70) / n2 - 8)
      const gap2 = 8
      const maxBH2 = H - 90
      const baseY2 = H - 46
      const ox2 = cx - (n2 * (barW2 + gap2)) / 2 + gap2 / 2

      // ① 좌표축 + 첫 항 a₁ 표시
      if (p > 0.02) {
        const ap = easeOutCubic((p - 0.02) / 0.18)
        gLine(ox2 - 12, baseY2, W - 20, baseY2, 'rgba(255,255,255,0.3)', 1.5, ap)
        gLine(ox2 - 12, 22, ox2 - 12, baseY2 + 4, 'rgba(255,255,255,0.3)', 1.5, ap)
        gText('① 수열 시작: 첫 항 a₁', cx, 22, 'rgba(255,255,255,0.5)', 11, ap)
        const firstBH2 = (a1 / maxV2) * maxBH2 * 0.18
        gLine(ox2 + barW2 / 2, baseY2, ox2 + barW2 / 2, baseY2 - firstBH2, GRN, 1.5, ap * 0.5)
        gText(`a₁=${a1}`, ox2 + barW2 / 2, baseY2 - firstBH2 - 10, GRN, 11, ap)
      }

      // ② 막대 순서대로 솟아오름 (a₁, a₁r, a₁r², ...)
      if (p > 0.2) {
        const stageP2 = easeOutCubic((p - 0.2) / 0.4)
        for (let i = 0; i < n2; i++) {
          const val = a1 * Math.pow(ratio, i)
          const bh = Math.min(maxBH2, (val / maxV2) * maxBH2)
          const x = ox2 + i * (barW2 + gap2)
          const prog = easeOutCubic(Math.min(1, Math.max(0, stageP2 * (n2 + 1) - i * 0.7)))
          ctx.save(); ctx.globalAlpha = prog * 0.85
          ctx.fillStyle = VIO + '44'; ctx.strokeStyle = VIO; ctx.lineWidth = 2
          ctx.shadowBlur = 8; ctx.shadowColor = VIO
          ctx.fillRect(x, baseY2 - bh * prog, barW2, bh * prog)
          ctx.strokeRect(x, baseY2 - bh * prog, barW2, bh * prog)
          ctx.restore()
          gText(String(Math.round(val)), x + barW2 / 2, baseY2 - bh * prog - 10, 'rgba(255,255,255,0.7)', 11, prog)
          gText(String(i + 1), x + barW2 / 2, baseY2 + 12, 'rgba(255,255,255,0.35)', 10, prog)
        }
        gText('② 공비배로 급증하는 막대', cx, 36, VIO, 12, stageP2)
      }

      // ③ 공비 r 화살표 표시 between bars
      if (p > 0.4) {
        const lp3 = easeOutCubic((p - 0.4) / 0.2)
        for (let i = 0; i < n2 - 1; i++) {
          const val1 = a1 * Math.pow(ratio, i)
          const val2 = a1 * Math.pow(ratio, i + 1)
          const bh1 = Math.min(maxBH2, (val1 / maxV2) * maxBH2)
          const bh2 = Math.min(maxBH2, (val2 / maxV2) * maxBH2)
          const x1 = ox2 + i * (barW2 + gap2) + barW2 / 2
          const x2 = ox2 + (i + 1) * (barW2 + gap2) + barW2 / 2
          gLine(x1, baseY2 - bh1 - 4, x2, baseY2 - bh2 - 4, ORG, 1.5, lp3 * 0.65)
          gText(`×${ratio}`, (x1 + x2) / 2, baseY2 - (bh1 + bh2) / 2 - 18, ORG, 10, lp3)
        }
        gText('③ 공비 r: 곱해서 증가', cx, 50, ORG, 12, lp3)
      }

      // ④ 등차수열 비교 (회색 점선 가이드)
      if (p > 0.6) {
        const lp4 = easeOutCubic((p - 0.6) / 0.2)
        ctx.save(); ctx.globalAlpha = lp4 * 0.4; ctx.strokeStyle = 'rgba(200,200,200,0.5)'
        ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath()
        // 등차수열 가이드선: 선형 증가
        const arithStep = (maxV2 - a1) / (n2 - 1)
        for (let i = 0; i < n2; i++) {
          const arithV = a1 + i * arithStep
          const bh = Math.min(maxBH2, (arithV / maxV2) * maxBH2)
          const x = ox2 + i * (barW2 + gap2) + barW2 / 2
          if (i === 0) ctx.moveTo(x, baseY2 - bh); else ctx.lineTo(x, baseY2 - bh)
        }
        ctx.stroke(); ctx.setLineDash([]); ctx.restore()
        gText('④ 등차수열 비교 — 점선 (직선 vs 기하급수)', cx, 64, 'rgba(200,200,200,0.6)', 11, lp4)
      }

      // ⑤ 일반항 공식 + "곱하기로 커지는 수열"
      if (p > 0.8) {
        const lp5 = easeOutCubic((p - 0.8) / 0.2)
        ctx.save(); ctx.globalAlpha = lp5 * 0.15; ctx.fillStyle = VIO
        ctx.fillRect(cx - 130, 70, 260, 28); ctx.restore()
        gText(`⑤ 일반항: aₙ = ${a1}×${ratio}^(n-1) — 곱하기로 커지는 수열`, cx, 85, 'rgba(255,255,255,0.85)', 12, lp5)
        for (let i = 0; i < n2; i++) {
          const val = a1 * Math.pow(ratio, i)
          const bh = Math.min(maxBH2, (val / maxV2) * maxBH2)
          const x = ox2 + i * (barW2 + gap2)
          gCircle(x + barW2 / 2, baseY2 - bh, 3, GRN, true, lp5)
        }
      }
      break
    }

    case 'derivative_coeff': {
      const sc4 = 35, scY = 20, baseY = cy + 40
      const tx = v('x', 2.5)
      // f(x) = 0.15x³ - 0.8x² + 1.5x + 1 (R3F와 같은 함수)
      const fDx = (x: number) => 0.15*x*x*x - 0.8*x*x + 1.5*x + 1
      const fDPrime = (x: number) => 0.45*x*x - 1.6*x + 1.5
      // 좌표축
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.12)', 1, p)
      gLine(cx, 20, cx, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      // 곡선
      ctx.save(); ctx.globalAlpha = p; ctx.strokeStyle = MINT; ctx.lineWidth = 2.5
      ctx.shadowBlur = 10; ctx.shadowColor = MINT; ctx.beginPath(); let st = false
      for (let x = -2; x <= 6; x += 0.05) {
        const y = fDx(x); const sx = cx + (x - 2.5) * sc4, sy = baseY - y * scY
        if (sy < 20 || sy > H - 20) { st = false; continue }
        if (!st) { ctx.moveTo(sx, sy); st = true } else ctx.lineTo(sx, sy)
      }
      ctx.stroke(); ctx.restore()
      // 접선 at x=tx
      const ty = fDx(tx), slope = fDPrime(tx)
      const sx = cx + (tx - 2.5) * sc4, sy = baseY - ty * scY
      gCircle(sx, sy, 6, AMBER, true, p)
      ctx.save(); ctx.globalAlpha = p * 0.7; ctx.strokeStyle = AMBER; ctx.lineWidth = 2
      ctx.shadowBlur = 8; ctx.shadowColor = AMBER; ctx.beginPath()
      ctx.moveTo(sx - 70, sy + slope * 70 * scY / sc4)
      ctx.lineTo(sx + 70, sy - slope * 70 * scY / sc4)
      ctx.stroke(); ctx.restore()
      gText(`x = ${r(tx, 1)}`, sx, sy - 24, AMBER, 12, p)
      gText(`기울기 f'(${r(tx, 1)}) = ${r(slope, 2)}`, cx, 22, AMBER, 14, p)
      gText('f(x)', W - 50, 40, MINT, 12, p)
      break
    }

    case 'fundamental_theorem': {
      const ftx = Math.max(0.1, v('x', 3))
      const ftSc = 35, ftScY = 18, ftBase = cy - 10
      // f(x) = 0.5sin(x)+1.5
      const ftf = (x: number) => 0.5 * Math.sin(x) + 1.5
      // F(x) = -0.5cos(x)+1.5x+0.5
      const ftF = (x: number) => -0.5 * Math.cos(x) + 1.5 * x + 0.5
      // 좌표축 (위쪽: f(x))
      gLine(30, ftBase, W - 30, ftBase, 'rgba(255,255,255,0.15)', 1, p)
      gLine(cx - 100, 20, cx - 100, H - 20, 'rgba(255,255,255,0.15)', 1, p)
      // f(x) 곡선
      ctx.save(); ctx.globalAlpha = p; ctx.strokeStyle = PURPLE; ctx.lineWidth = 2.5
      ctx.shadowBlur = 10; ctx.shadowColor = PURPLE; ctx.beginPath()
      let st2 = false
      for (let x = 0; x <= 6; x += 0.05) {
        const sx = cx - 100 + x * ftSc, sy = ftBase - ftf(x) * ftScY
        if (sx < 30 || sx > W - 30) { st2 = false; continue }
        if (!st2) { ctx.moveTo(sx, sy); st2 = true } else ctx.lineTo(sx, sy)
      }
      ctx.stroke(); ctx.restore()
      gText('f(x)', cx - 100 + 6.2 * ftSc, ftBase - ftf(6) * ftScY, PURPLE, 11, p)
      // 0~x 넓이 채우기
      ctx.save(); ctx.globalAlpha = p * 0.25; ctx.fillStyle = MINT; ctx.beginPath()
      ctx.moveTo(cx - 100, ftBase)
      for (let x = 0; x <= ftx; x += 0.05) {
        ctx.lineTo(cx - 100 + x * ftSc, ftBase - ftf(x) * ftScY)
      }
      ctx.lineTo(cx - 100 + ftx * ftSc, ftBase)
      ctx.closePath(); ctx.fill(); ctx.restore()
      // x 수직선
      gLine(cx - 100 + ftx * ftSc, ftBase, cx - 100 + ftx * ftSc, ftBase - ftf(ftx) * ftScY, AMBER, 2, p)
      // F(x) 값 표시
      gText(`x = ${r(ftx, 1)}`, cx - 100 + ftx * ftSc, ftBase + 16, AMBER, 11, p)
      gText(`F(${r(ftx, 1)}) = ${r(ftF(ftx))}`, cx + 60, 24, MINT, 14, p)
      gText(`f(${r(ftx, 1)}) = ${r(ftf(ftx))}`, cx + 60, 44, PURPLE, 12, p)
      gText("넓이의 변화율 = f(x)", cx, H - 18, '#999', 12, p)
      gText("F'(x) = f(x)", cx, H - 36, AMBER, 13, p)
      break
    }

    case 'definite_integral': case 'velocity_integral': {
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
      const mu = v('mu', 0), sigma = Math.max(0.1, v('sigma', 1))
      const sc6 = 50, baseY3 = cy + 60
      const nPdf = (x: number) => (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2))
      const ampH = H * 0.6 * sigma
      // x축
      gLine(30, baseY3, W - 30, baseY3, 'rgba(255,255,255,0.12)', 1, p)
      // 68% 영역 채우기 (μ±σ)
      ctx.save(); ctx.globalAlpha = p * 0.2; ctx.fillStyle = MINT; ctx.beginPath()
      ctx.moveTo(clx(cx + (mu - sigma) * sc6), baseY3)
      for (let x = mu - sigma; x <= mu + sigma; x += 0.05) {
        const sx = clx(cx + x * sc6), sy = cly(baseY3 - nPdf(x) * ampH)
        ctx.lineTo(sx, sy)
      }
      ctx.lineTo(clx(cx + (mu + sigma) * sc6), baseY3)
      ctx.closePath(); ctx.fill(); ctx.restore()
      // 곡선
      ctx.save(); ctx.globalAlpha = p; ctx.strokeStyle = MINT; ctx.lineWidth = 2.5
      ctx.shadowBlur = 12; ctx.shadowColor = MINT; ctx.beginPath()
      let started = false
      for (let x = -4; x <= 4; x += 0.05) {
        const sx = cx + x * sc6, sy = baseY3 - nPdf(x) * ampH
        if (sx < 30 || sx > W - 30) { started = false; continue }
        if (!started) { ctx.moveTo(sx, sy); started = true } else ctx.lineTo(sx, sy)
      }
      ctx.stroke(); ctx.restore()
      // μ 수직선
      gLine(cx + mu * sc6, baseY3, cx + mu * sc6, 35, AMBER, 2, p)
      gText(`μ = ${r(mu)}`, cx + mu * sc6, 24, AMBER, 13, p)
      // ±σ 마커
      const s1L = cx + (mu - sigma) * sc6, s1R = cx + (mu + sigma) * sc6
      gLine(s1L, baseY3, s1L, baseY3 - nPdf(mu - sigma) * ampH, PURPLE, 1.5, p * 0.5)
      gLine(s1R, baseY3, s1R, baseY3 - nPdf(mu + sigma) * ampH, PURPLE, 1.5, p * 0.5)
      gText('-σ', s1L, baseY3 + 16, PURPLE, 10, p)
      gText('+σ', s1R, baseY3 + 16, PURPLE, 10, p)
      gText('68%', cx + mu * sc6, baseY3 - nPdf(mu) * ampH * 0.4, MINT, 13, p)
      // 하단 정보
      gText(`σ = ${r(sigma)}`, cx + mu * sc6 + 60, 24, PURPLE, 13, p)
      gText('N(μ, σ²)', cx, H - 16, MINT, 14, p)
      break
    }

    case 'vector_2d': case 'dot_product': {
      const sc7 = 30
      const vax = v('ax', 3), vay = v('ay', 2), vbx = v('bx', 1), vby = v('by', 3)
      const sx = vax + vbx, sy = vay + vby
      // 좌표축
      gLine(30, cy, W - 30, cy, 'rgba(255,255,255,0.12)', 1, p)
      gLine(cx, 20, cx, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      gText('x', W - 25, cy - 12, '#666', 11, p); gText('y', cx + 12, 25, '#666', 11, p)
      // 벡터 a (초록)
      gLine(cx, cy, cx + vax * sc7, cy - vay * sc7, MINT, 3, p)
      gText(`a (${r(vax)}, ${r(vay)})`, cx + vax * sc7 + 15, cy - vay * sc7, MINT, 12, p)
      // 벡터 b (보라)
      gLine(cx, cy, cx + vbx * sc7, cy - vby * sc7, PURPLE, 3, p)
      gText(`b (${r(vbx)}, ${r(vby)})`, cx + vbx * sc7 + 15, cy - vby * sc7, PURPLE, 12, p)
      // 합 벡터 a+b (주황)
      gLine(cx, cy, cx + sx * sc7, cy - sy * sc7, AMBER, 2.5, p)
      gText(`a+b (${r(sx)}, ${r(sy)})`, cx + sx * sc7 + 15, cy - sy * sc7, AMBER, 12, p)
      // 평행이동된 b 점선 (a끝→a+b)
      ctx.save(); ctx.globalAlpha = p * 0.4; ctx.strokeStyle = PURPLE; ctx.lineWidth = 1.5
      ctx.setLineDash([6, 4]); ctx.beginPath()
      ctx.moveTo(cx + vax * sc7, cy - vay * sc7)
      ctx.lineTo(cx + sx * sc7, cy - sy * sc7)
      ctx.stroke(); ctx.restore()
      // 화살표 머리 (간단 삼각형)
      const drawHead = (ex: number, ey: number, dx: number, dy: number, col: string) => {
        const len = Math.sqrt(dx * dx + dy * dy); if (len < 0.1) return
        const nx = dx / len, ny = dy / len, sz = 8
        ctx.save(); ctx.globalAlpha = p; ctx.fillStyle = col; ctx.beginPath()
        ctx.moveTo(ex, ey)
        ctx.lineTo(ex - nx * sz + ny * sz * 0.4, ey - ny * sz - nx * sz * 0.4)
        ctx.lineTo(ex - nx * sz - ny * sz * 0.4, ey - ny * sz + nx * sz * 0.4)
        ctx.closePath(); ctx.fill(); ctx.restore()
      }
      drawHead(cx + vax * sc7, cy - vay * sc7, vax * sc7, -vay * sc7, MINT)
      drawHead(cx + vbx * sc7, cy - vby * sc7, vbx * sc7, -vby * sc7, PURPLE)
      drawHead(cx + sx * sc7, cy - sy * sc7, sx * sc7, -sy * sc7, AMBER)
      break
    }

    // ══════════════════════════════════════════
    // H001~H011 — 고등 대수 Canvas 2D
    // ══════════════════════════════════════════

    case 'poly_add': {
      const a2 = v('a2', 2), a1 = v('a1', 3), b2 = v('b2', 1), b1 = v('b1', -1)
      const r2 = a2 + b2, r1 = a1 + b1
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const bw = 40, bh0 = 18, ox1 = cx - 140, ox2 = cx + 20
      // 배경 축선
      gLine(30, cy + 20, W - 30, cy + 20, 'rgba(255,255,255,0.08)', 1, p)
      gLine(cx, 30, cx, H - 30, 'rgba(255,255,255,0.08)', 1, p)
      // ① 첫 번째 다항식 블록
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.18))
        gText('① 첫 번째 다항식', cx - 60, 22, VIO, 14, t)
        for (let i = 0; i < Math.abs(a2); i++) { ctx.save(); ctx.globalAlpha = t * 0.7; ctx.fillStyle = VIO; ctx.fillRect(ox1 + i * (bw + 4), cy - 55, bw * t, bh0 * 2); ctx.restore() }
        gText(`${a2}x²`, ox1 + Math.abs(a2) * (bw + 4) / 2, cy - 65, VIO, 13, t)
        for (let i = 0; i < Math.abs(a1); i++) { ctx.save(); ctx.globalAlpha = t * 0.5; ctx.fillStyle = VIO; ctx.fillRect(ox1 + i * (bw + 4), cy - 14, bw * t, bh0); ctx.restore() }
        gText(`${a1}x`, ox1 + Math.abs(a1) * (bw + 4) / 2, cy - 22, VIO, 13, t)
        // x² 항 강조 원
        gCircle(ox1 + Math.abs(a2) * (bw + 4) / 2, cy - 55, 5, VIO, true, t)
        // 항 구분 수직선
        gLine(ox1 - 8, cy - 70, ox1 - 8, cy + 5, VIO, 1.5, t)
      }
      // ② 두 번째 다항식 블록
      if (p > 0.22) {
        const t = easeOutCubic(Math.min(1, (p - 0.22) / 0.18))
        gText('② 두 번째 다항식', cx + 60, 22, GRN, 14, t)
        for (let i = 0; i < Math.abs(b2); i++) { ctx.save(); ctx.globalAlpha = t * 0.7; ctx.fillStyle = GRN; ctx.fillRect(ox2 + i * (bw + 4), cy - 55, bw * t, bh0 * 2); ctx.restore() }
        gText(`${b2}x²`, ox2 + Math.abs(b2) * (bw + 4) / 2, cy - 65, GRN, 13, t)
        const col1 = b1 < 0 ? ORG : GRN
        for (let i = 0; i < Math.abs(b1); i++) { ctx.save(); ctx.globalAlpha = t * 0.5; ctx.fillStyle = col1; ctx.fillRect(ox2 + i * (bw + 4), cy - 14, bw * t, bh0); ctx.restore() }
        gText(`${b1}x`, ox2 + Math.abs(b1) * (bw + 4) / 2, cy - 22, col1, 13, t)
        // x² 항 강조 원
        gCircle(ox2 + Math.abs(b2) * (bw + 4) / 2, cy - 55, 5, GRN, true, t)
        // 항 구분 수직선
        gLine(ox2 - 8, cy - 70, ox2 - 8, cy + 5, GRN, 1.5, t)
      }
      // ③ 같은 차수끼리 연결 화살선
      if (p > 0.42) {
        const t = easeOutCubic(Math.min(1, (p - 0.42) / 0.16))
        gText('③ 같은 차수끼리 연결', cx, 22, AMBER, 14, t)
        // x² 연결선
        const x2left = ox1 + Math.abs(a2) * (bw + 4) / 2
        const x2right = ox2 + Math.abs(b2) * (bw + 4) / 2
        gLine(x2left, cy - 55, x2right, cy - 55, AMBER, 2, t)
        // x¹ 연결선
        const x1left = ox1 + Math.abs(a1) * (bw + 4) / 2
        const x1right = ox2 + Math.abs(b1) * (bw + 4) / 2
        gLine(x1left, cy - 14, x1right, cy - 14, AMBER, 2, t)
        // 가운데 분할선
        gLine(cx - 10, cy - 80, cx - 10, cy + 10, AMBER, 1, t * 0.5)
      }
      // ④ 합산 식 표시
      if (p > 0.60) {
        const t = easeOutCubic(Math.min(1, (p - 0.60) / 0.18))
        gText('④ 항별 덧셈', cx, 22, ORG, 14, t)
        gText(`${a2}x² + ${b2}x² = ${r2}x²`, cx, cy + 30, AMBER, 15, t)
        gText(`${a1}x + (${b1}x) = ${r1}x`, cx, cy + 55, AMBER, 15, t)
        // 결과 구분선
        gLine(cx - 120, cy + 70, cx + 120, cy + 70, AMBER, 1.5, t)
      }
      // ⑤ 최종 결과
      if (p > 0.80) {
        const t = easeOutCubic(Math.min(1, (p - 0.80) / 0.18))
        gText('⑤ 최종 결과', cx, 22, MINT, 14, t)
        gText(`${r2}x² + ${r1}x`, cx, cy + 100, MINT, 20, t)
        // 결과 강조 원
        gCircle(cx - 40, cy + 100, 4, MINT, true, t)
        gCircle(cx + 40, cy + 100, 4, MINT, true, t)
        // 결과 밑줄
        gLine(cx - 80, cy + 112, cx + 80, cy + 112, MINT, 2, t)
      }
      break
    }

    case 'poly_mul_h': {
      const pa = v('a', 2), pb = v('b', 1), pc = v('c', 1), pd = v('d', 3)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const cw = Math.min(80, (W - 80) / 4), ch = Math.min(60, (H - 100) / 3)
      const gox = cx - cw, goy = cy - ch + 10
      // 배경 그리드선
      gLine(gox, goy - ch, gox + cw * 2, goy - ch, 'rgba(255,255,255,0.08)', 1, p)
      gLine(gox, goy, gox + cw * 2, goy, 'rgba(255,255,255,0.08)', 1, p)
      gLine(gox, goy + ch, gox + cw * 2, goy + ch, 'rgba(255,255,255,0.08)', 1, p)
      gLine(gox, goy - ch, gox, goy + ch, 'rgba(255,255,255,0.08)', 1, p)
      gLine(gox + cw, goy - ch, gox + cw, goy + ch, 'rgba(255,255,255,0.08)', 1, p)
      gLine(gox + cw * 2, goy - ch, gox + cw * 2, goy + ch, 'rgba(255,255,255,0.08)', 1, p)
      // ① 첫 번째 인수 (ax+b)
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.18))
        gText('① 첫 번째 인수', cx - cw, goy - ch - 22, VIO, 14, t)
        gText(`(${pa}x+${pb})`, cx - cw, goy - ch - 4, VIO, 13, t)
        // 가로축 분할선
        gLine(gox, goy - ch, gox + cw * 2, goy - ch, VIO, 2, t)
        gLine(gox + cw, goy - ch - 10, gox + cw, goy - ch + 10, VIO, 2, t)
        // ax 항 강조 원
        gCircle(gox + cw / 2, goy - ch, 5, VIO, true, t)
      }
      // ② 두 번째 인수 (cx+d)
      if (p > 0.22) {
        const t = easeOutCubic(Math.min(1, (p - 0.22) / 0.18))
        gText('② 두 번째 인수', cx + cw + 20, goy - 22, GRN, 14, t)
        gText(`(${pc}x+${pd})`, cx + cw + 20, goy - 4, GRN, 13, t)
        // 세로축 분할선
        gLine(gox + cw * 2, goy - ch, gox + cw * 2, goy + ch, GRN, 2, t)
        gLine(gox + cw * 2 - 10, goy, gox + cw * 2 + 10, goy, GRN, 2, t)
        // cx 항 강조 원
        gCircle(gox + cw * 2, goy - ch / 2, 5, GRN, true, t)
      }
      // ③ 넓이 모델 4칸
      const cells = [
        { r: 0, c: 0, val: `${pa * pc}x²`, col: VIO },
        { r: 0, c: 1, val: `${pa * pd}x`, col: GRN },
        { r: 1, c: 0, val: `${pb * pc}x`, col: GRN },
        { r: 1, c: 1, val: `${pb * pd}`, col: ORG },
      ]
      if (p > 0.25) {
        cells.forEach((cell, idx) => {
          const delay = 0.25 + idx * 0.08
          if (p < delay) return
          const t = easeOutCubic(Math.min(1, (p - delay) / 0.12))
          const rx = gox + cell.c * cw, ry = goy + cell.r * ch
          ctx.save(); ctx.globalAlpha = t * 0.3; ctx.fillStyle = cell.col; ctx.fillRect(rx, ry, cw * t, ch * t); ctx.restore()
          ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = cell.col; ctx.lineWidth = 1.5; ctx.strokeRect(rx, ry, cw, ch); ctx.restore()
          gText(cell.val, rx + cw / 2, ry + ch / 2, cell.col, 14, t)
          // 각 칸 모서리 원
          gCircle(rx, ry, 3, cell.col, true, t)
        })
        if (p > 0.3) gText('③ 넓이 모델 4칸', cx, 22, AMBER, 14, easeOutCubic(Math.min(1, (p - 0.3) / 0.1)))
      }
      // ④ 동류항 통합 안내선
      if (p > 0.58) {
        const t = easeOutCubic(Math.min(1, (p - 0.58) / 0.15))
        gText('④ 동류항 합산', cx, 22, ORG, 14, t)
        const mid = pa * pd + pb * pc
        // x항 두 칸 연결선
        gLine(gox + cw / 2, goy + ch / 2, gox + cw + cw / 2, goy + ch / 2, ORG, 2, t)
        gText(`${pa * pd}x + ${pb * pc}x = ${mid}x`, cx, goy + ch * 2 + 10, ORG, 13, t)
      }
      // ⑤ 합산 결과
      if (p > 0.75) {
        const t = easeOutCubic(Math.min(1, (p - 0.75) / 0.18))
        const mid = pa * pd + pb * pc
        gText('⑤ 최종 전개식', cx, 22, MINT, 14, t)
        gText(`${pa * pc}x² + ${mid}x + ${pb * pd}`, cx, goy + ch * 2 + 35, MINT, 18, t)
        // 결과 강조선
        gLine(cx - 110, goy + ch * 2 + 48, cx + 110, goy + ch * 2 + 48, MINT, 2, t)
        gCircle(cx - 115, goy + ch * 2 + 35, 4, MINT, true, t)
        gCircle(cx + 115, goy + ch * 2 + 35, 4, MINT, true, t)
      }
      break
    }

    case 'expand_formula': {
      const ea = v('a', 3), eb = v('b', 2)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const side = ea + eb
      const u = Math.min((W - 80) / side, (H - 100) / side, 40)
      const gox = cx - side * u / 2, goy = cy - side * u / 2 + 10
      // 배경 보조선
      gLine(gox - 20, goy, gox - 20, goy + side * u, 'rgba(255,255,255,0.06)', 1, p)
      gLine(gox, goy - 20, gox + side * u, goy - 20, 'rgba(255,255,255,0.06)', 1, p)
      // ① 전체 정사각형 외곽
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.18))
        gText('① (a+b)² 전체 정사각형', cx, 22, WHITE, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.15; ctx.fillStyle = WHITE; ctx.fillRect(gox, goy, side * u, side * u); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = WHITE; ctx.lineWidth = 2; ctx.strokeRect(gox, goy, side * u, side * u); ctx.restore()
        gText(`a=${ea}`, gox + ea * u / 2, goy - 14, VIO, 13, t)
        gText(`b=${eb}`, gox + ea * u + eb * u / 2, goy - 14, GRN, 13, t)
        // 세로 분할선 (a|b)
        gLine(gox + ea * u, goy, gox + ea * u, goy + side * u, WHITE, 1.5, t)
        // 가로 분할선 (a|b)
        gLine(gox, goy + ea * u, gox + side * u, goy + ea * u, WHITE, 1.5, t)
        // 좌측 눈금선
        gLine(gox - 8, goy, gox - 8, goy + ea * u, VIO, 2, t)
        gLine(gox - 8, goy + ea * u, gox - 8, goy + side * u, GRN, 2, t)
      }
      // ② 4칸 분할 + 채우기
      const parts = [
        { x: 0, y: 0, w: ea, h: ea, label: `a²=${ea * ea}`, col: VIO, delay: 0.25 },
        { x: ea, y: 0, w: eb, h: ea, label: `ab=${ea * eb}`, col: GRN, delay: 0.35 },
        { x: 0, y: ea, w: ea, h: eb, label: `ab=${ea * eb}`, col: GRN, delay: 0.45 },
        { x: ea, y: ea, w: eb, h: eb, label: `b²=${eb * eb}`, col: ORG, delay: 0.55 },
      ]
      parts.forEach(part => {
        if (p < part.delay) return
        const t = easeOutCubic(Math.min(1, (p - part.delay) / 0.12))
        const rx = gox + part.x * u, ry = goy + part.y * u
        ctx.save(); ctx.globalAlpha = t * 0.35; ctx.fillStyle = part.col; ctx.fillRect(rx, ry, part.w * u, part.h * u); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = part.col; ctx.lineWidth = 1.5; ctx.strokeRect(rx, ry, part.w * u, part.h * u); ctx.restore()
        gText(part.label, rx + part.w * u / 2, ry + part.h * u / 2, part.col, 13, t)
        // 각 칸 모서리 강조 원
        gCircle(rx, ry, 3, part.col, true, t)
      })
      if (p > 0.28) gText('② 4칸 분할', cx, 22, AMBER, 14, easeOutCubic(Math.min(1, (p - 0.28) / 0.1)))
      // ③ 항별 레이블 연결선
      if (p > 0.52) {
        const t = easeOutCubic(Math.min(1, (p - 0.52) / 0.15))
        gText('③ 각 항 면적 확인', cx, 22, ORG, 14, t)
        // a² 영역 대각선 강조
        gLine(gox, goy, gox + ea * u, goy + ea * u, VIO, 1.5, t * 0.6)
        // b² 영역 대각선 강조
        gLine(gox + ea * u, goy + ea * u, gox + side * u, goy + side * u, ORG, 1.5, t * 0.6)
        // ab 영역 강조 원
        gCircle(gox + ea * u + eb * u / 2, goy + ea * u / 2, 5, GRN, true, t)
        gCircle(gox + ea * u / 2, goy + ea * u + eb * u / 2, 5, GRN, true, t)
      }
      // ④ 전개식 표시
      if (p > 0.68) {
        const t = easeOutCubic(Math.min(1, (p - 0.68) / 0.15))
        gText('④ 전개식 도출', cx, 22, GRN, 14, t)
        gText(`a² + 2ab + b²`, cx, goy + side * u + 20, GRN, 15, t)
        // 등호 구분선
        gLine(cx - 80, goy + side * u + 30, cx + 80, goy + side * u + 30, GRN, 1, t)
      }
      // ⑤ 수치 결과
      if (p > 0.82) {
        const t = easeOutCubic(Math.min(1, (p - 0.82) / 0.15))
        gText('⑤ 수치 대입 결과', cx, 22, MINT, 14, t)
        gText(`${ea * ea}+${2 * ea * eb}+${eb * eb} = ${side * side}`, cx, goy + side * u + 48, MINT, 16, t)
        // 최종 결과 강조선
        gLine(cx - 90, goy + side * u + 60, cx + 90, goy + side * u + 60, MINT, 2, t)
        gCircle(cx, goy + side * u + 48, 4, MINT, false, t)
      }
      break
    }

    case 'factor_h': {
      const fp = v('p', 2), fq = v('q', 3)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sum = fp + fq, prod = fp * fq
      const u = Math.min((W - 80) / (sum + 1), (H - 100) / (sum + 1), 30)
      const gox = cx - sum * u / 2, goy = cy - sum * u / 2 + 10
      // 배경 보조 경계선
      gLine(gox - 4, goy - 4, gox + (3 + fp) * u + 4, goy - 4, 'rgba(255,255,255,0.08)', 1, p)
      gLine(gox - 4, goy - 4, gox - 4, goy + (3 + fq) * u + 4, 'rgba(255,255,255,0.08)', 1, p)
      // ① 다항식 제시 + x² 블록
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.20))
        gText(`① 다항식: x²+${sum}x+${prod}`, cx, 22, WHITE, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.3; ctx.fillStyle = VIO; ctx.fillRect(gox, goy, 3 * u, 3 * u); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 1.5; ctx.strokeRect(gox, goy, 3 * u, 3 * u); ctx.restore()
        gText('x²', gox + 1.5 * u, goy + 1.5 * u, VIO, 14, t)
        // x² 블록 모서리 원
        gCircle(gox, goy, 4, VIO, true, t)
        gCircle(gox + 3 * u, goy + 3 * u, 4, VIO, true, t)
        // 상단 눈금선
        gLine(gox, goy - 10, gox + 3 * u, goy - 10, VIO, 2, t)
        gText('x', gox + 1.5 * u, goy - 20, VIO, 12, t)
      }
      // ② 칸 그룹화 (p·x, q·x, pq)
      if (p > 0.28) {
        const t = easeOutCubic(Math.min(1, (p - 0.28) / 0.20))
        gText('② 칸 그룹화 (합·곱 탐색)', cx, 22, GRN, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.25; ctx.fillStyle = GRN; ctx.fillRect(gox + 3 * u, goy, fp * u, 3 * u); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = GRN; ctx.lineWidth = 1.5; ctx.strokeRect(gox + 3 * u, goy, fp * u, 3 * u); ctx.restore()
        gText(`${fp}x`, gox + 3 * u + fp * u / 2, goy + 1.5 * u, GRN, 13, t)
        ctx.save(); ctx.globalAlpha = t * 0.25; ctx.fillStyle = ORG; ctx.fillRect(gox, goy + 3 * u, 3 * u, fq * u); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = ORG; ctx.lineWidth = 1.5; ctx.strokeRect(gox, goy + 3 * u, 3 * u, fq * u); ctx.restore()
        gText(`${fq}x`, gox + 1.5 * u, goy + 3 * u + fq * u / 2, ORG, 13, t)
        ctx.save(); ctx.globalAlpha = t * 0.2; ctx.fillStyle = AMBER; ctx.fillRect(gox + 3 * u, goy + 3 * u, fp * u, fq * u); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = AMBER; ctx.lineWidth = 1.5; ctx.strokeRect(gox + 3 * u, goy + 3 * u, fp * u, fq * u); ctx.restore()
        gText(`${prod}`, gox + 3 * u + fp * u / 2, goy + 3 * u + fq * u / 2, AMBER, 13, t)
        // 합과 곱 강조 원
        gCircle(gox + 3 * u, goy + 3 * u, 5, AMBER, true, t)
        // 그룹 경계선
        gLine(gox + 3 * u, goy, gox + 3 * u, goy + (3 + fq) * u, WHITE, 1.5, t * 0.5)
        gLine(gox, goy + 3 * u, gox + (3 + fp) * u, goy + 3 * u, WHITE, 1.5, t * 0.5)
      }
      // ③ 합과 곱 확인
      if (p > 0.50) {
        const t = easeOutCubic(Math.min(1, (p - 0.50) / 0.18))
        gText('③ 합과 곱 확인', cx, 22, ORG, 14, t)
        gText(`${fp}+${fq}=${sum} (합)`, cx - 60, H - 55, ORG, 13, t)
        gText(`${fp}×${fq}=${prod} (곱)`, cx + 60, H - 55, AMBER, 13, t)
        // 합·곱 연결 화살선
        gLine(gox + 3 * u + fp * u / 2, goy + 1.5 * u, cx - 60, H - 62, GRN, 1.5, t * 0.6)
        gLine(gox + 3 * u + fp * u / 2, goy + 3 * u + fq * u / 2, cx + 60, H - 62, AMBER, 1.5, t * 0.6)
      }
      // ④ 인수분해 결과
      if (p > 0.68) {
        const t = easeOutCubic(Math.min(1, (p - 0.68) / 0.18))
        gText('④ 인수분해 완성', cx, 22, MINT, 14, t)
        gText(`(x+${fp})(x+${fq})`, cx, goy + (3 + Math.max(fp, fq)) * u + 20, MINT, 20, t)
        gLine(cx - 90, goy + (3 + Math.max(fp, fq)) * u + 32, cx + 90, goy + (3 + Math.max(fp, fq)) * u + 32, MINT, 2, t)
      }
      // ⑤ 의미 설명
      if (p > 0.85) {
        const t = easeOutCubic(Math.min(1, (p - 0.85) / 0.12))
        gText('⑤ 전개의 역과정 — 합·곱으로 인수 찾기', cx, H - 22, '#999', 13, t)
        // 양 끝 강조 원
        gCircle(cx - 95, H - 22, 3, '#999', false, t)
        gCircle(cx + 95, H - 22, 3, '#999', false, t)
      }
      break
    }

    case 'remainder_theorem': {
      const ra = v('a', 2)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 35, baseY = cy + 30
      const fRt = (x: number) => 0.1 * x * x * x - 0.5 * x * x + x + 2
      // 좌표축
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.15)', 1.5, p)
      gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.15)', 1.5, p)
      gText('x', W - 24, baseY - 10, '#555', 11, p)
      gText('y', cx + 10, 34, '#555', 11, p)
      // 보조 눈금선
      for (let i = -3; i <= 4; i++) {
        if (i === 0) continue
        gLine(cx + i * sc, baseY - 4, cx + i * sc, baseY + 4, 'rgba(255,255,255,0.2)', 1, p)
        gText(`${i}`, cx + i * sc, baseY + 14, 'rgba(255,255,255,0.3)', 9, p)
      }
      // ① f(x) 곡선
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.25))
        gText('① f(x) 곡선 그리기', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = VIO; ctx.beginPath()
        let s = false
        for (let x = -3; x <= 5; x += 0.05) { const sx = cx + x * sc, sy = baseY - fRt(x) * 18; if (sy < 25 || sy > H - 20) { s = false; continue }; if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        // 곡선 시작점 원
        gCircle(cx + (-2) * sc, baseY - fRt(-2) * 18, 4, VIO, false, t)
      }
      // ② x=a 수직선
      if (p > 0.30) {
        const t = easeOutCubic(Math.min(1, (p - 0.30) / 0.20))
        gText('② x = a 수직선 세우기', cx, 22, ORG, 14, t)
        const ax = cx + ra * sc
        gLine(ax, baseY + 10, ax, baseY - fRt(ra) * 18 - 10, ORG, 2, t)
        gText(`x=${r(ra)}`, ax + 8, baseY + 18, ORG, 12, t)
        // x축 위 강조 원
        gCircle(ax, baseY, 5, ORG, true, t)
      }
      // ③ f(a) 교점 및 나머지 표시
      if (p > 0.52) {
        const t = easeOutCubic(Math.min(1, (p - 0.52) / 0.20))
        gText('③ f(a) 값 = 나머지', cx, 22, GRN, 14, t)
        const ax = cx + ra * sc, ay = baseY - fRt(ra) * 18
        gCircle(ax, ay, 7, GRN, true, t)
        gText(`f(${r(ra)}) = ${r(fRt(ra))}`, ax + 30, ay - 14, GRN, 14, t)
        // 수평 나머지선
        gLine(cx, ay, ax, ay, GRN, 1.5, t * 0.6)
        gText(`나머지 = ${r(fRt(ra))}`, cx - 70, ay - 10, GRN, 11, t)
      }
      // ④ 나눗셈 식 표시
      if (p > 0.72) {
        const t = easeOutCubic(Math.min(1, (p - 0.72) / 0.16))
        gText('④ 나눗셈 관계식', cx, 22, AMBER, 14, t)
        gText(`f(x) = (x-${r(ra)})·Q(x) + f(${r(ra)})`, cx, H - 45, AMBER, 13, t)
        // 식 강조선
        gLine(cx - 130, H - 34, cx + 130, H - 34, AMBER, 1, t)
        // 나눗셈 기호 원
        gCircle(cx - 135, H - 45, 3, AMBER, true, t)
      }
      // ⑤ 결론
      if (p > 0.86) {
        const t = easeOutCubic(Math.min(1, (p - 0.86) / 0.12))
        gText('⑤ f(x)를 (x-a)로 나눈 나머지 = f(a)', cx, H - 22, MINT, 14, t)
        // 결론 양쪽 강조 원
        gCircle(cx - 140, H - 22, 3, MINT, false, t)
        gCircle(cx + 140, H - 22, 3, MINT, false, t)
      }
      break
    }

    case 'factor_theorem': {
      const fa = v('a', 1)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 35, baseY = cy + 30
      const fFt = (x: number) => (x - fa) * (0.15 * x * x + 0.5)
      // 좌표축
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.15)', 1.5, p)
      gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.15)', 1.5, p)
      gText('x', W - 24, baseY - 10, '#555', 11, p)
      gText('y', cx + 10, 34, '#555', 11, p)
      // 보조 눈금선
      for (let i = -3; i <= 4; i++) {
        if (i === 0) continue
        gLine(cx + i * sc, baseY - 4, cx + i * sc, baseY + 4, 'rgba(255,255,255,0.2)', 1, p)
        gText(`${i}`, cx + i * sc, baseY + 14, 'rgba(255,255,255,0.3)', 9, p)
      }
      // ① f(x) 곡선
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.25))
        gText('① f(x) 곡선 그리기', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = VIO; ctx.beginPath()
        let s = false
        for (let x = -3; x <= 5; x += 0.05) { const sx = cx + x * sc, sy = baseY - fFt(x) * 15; if (sy < 25 || sy > H - 20) { s = false; continue }; if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        // 곡선 레이블
        gCircle(cx + (-2) * sc, baseY - fFt(-2) * 15, 4, VIO, false, t)
        gText('f(x)', cx + 3 * sc, baseY - fFt(3) * 15 - 12, VIO, 12, t)
      }
      // ② f(a)=0 교점 (근)
      if (p > 0.30) {
        const t = easeOutCubic(Math.min(1, (p - 0.30) / 0.20))
        gText('② f(a) = 0 확인', cx, 22, GRN, 14, t)
        const ax = cx + fa * sc
        gCircle(ax, baseY, 8, GRN, true, t)
        gText(`x = ${r(fa)}`, ax + 14, baseY + 20, GRN, 13, t)
        gText('f(a) = 0', ax + 14, baseY - 18, GRN, 14, t)
        // x=a 수직선
        gLine(ax, baseY - 60, ax, baseY + 12, GRN, 1.5, t * 0.6)
      }
      // ③ (x-a) 인수 분리
      if (p > 0.50) {
        const t = easeOutCubic(Math.min(1, (p - 0.50) / 0.20))
        gText('③ (x-a)가 인수로 분리됨', cx, 22, ORG, 14, t)
        gText(`f(x) = (x-${r(fa)}) · Q(x)`, cx, cy - 50, ORG, 15, t)
        // 분리 강조선
        gLine(cx - 110, cy - 38, cx + 110, cy - 38, ORG, 1, t)
        // 인수 분리 원
        gCircle(cx - 50, cy - 50, 5, ORG, false, t)
      }
      // ④ 나머지 0 확인
      if (p > 0.68) {
        const t = easeOutCubic(Math.min(1, (p - 0.68) / 0.18))
        gText('④ 나머지 = 0 확인', cx, 22, AMBER, 14, t)
        gText(`나머지 = f(${r(fa)}) = 0`, cx, cy - 20, AMBER, 14, t)
        // 나머지 0 강조 원
        gCircle(cx + 80, cy - 20, 4, AMBER, true, t)
        // 나머지정리 연결선
        gLine(cx - 90, cy - 8, cx + 90, cy - 8, AMBER, 1, t * 0.5)
      }
      // ⑤ 인수정리 결론
      if (p > 0.84) {
        const t = easeOutCubic(Math.min(1, (p - 0.84) / 0.14))
        gText('⑤ f(a)=0이면 (x-a)는 f(x)의 인수', cx, H - 22, MINT, 14, t)
        // 결론 강조
        gLine(cx - 145, H - 34, cx + 145, H - 34, MINT, 1.5, t)
        gCircle(cx - 148, H - 22, 3, MINT, true, t)
        gCircle(cx + 148, H - 22, 3, MINT, true, t)
      }
      break
    }

    case 'complex_number': {
      const ca = v('a', 3), cb = v('b', 2)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = Math.min(35, (W - 80) / 12, (H - 80) / 8)
      // 복소평면 축
      gLine(30, cy, W - 30, cy, 'rgba(255,255,255,0.15)', 1.5, p)
      gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.15)', 1.5, p)
      gText('실수축', W - 50, cy - 12, '#666', 11, p)
      gText('허수축', cx + 14, 35, '#666', 11, p)
      // 보조 눈금
      for (let i = -4; i <= 4; i++) {
        if (i === 0) continue
        gLine(cx + i * sc, cy - 3, cx + i * sc, cy + 3, 'rgba(255,255,255,0.18)', 1, p)
        gLine(cx - 3, cy - i * sc, cx + 3, cy - i * sc, 'rgba(255,255,255,0.18)', 1, p)
      }
      // ① 복소평면 소개
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.18))
        gText('① 복소평면 — 2차원 수 체계', cx, 22, WHITE, 14, t)
        // 단위원 참조
        gCircle(cx, cy, sc, 'rgba(255,255,255,0.12)', false, t)
        gText('|z|=1', cx + sc + 6, cy - 6, 'rgba(255,255,255,0.25)', 10, t)
      }
      // ② 실수부·허수부 좌표 화살표
      if (p > 0.22) {
        const t = easeOutCubic(Math.min(1, (p - 0.22) / 0.20))
        gText('② 실수부·허수부 분해', cx, 22, VIO, 14, t)
        const px = cx + ca * sc, py = cy - cb * sc
        // 실수부 화살표
        gLine(cx, cy, px, cy, VIO, 3, t)
        gText(`실수부 a=${r(ca)}`, (cx + px) / 2, cy + 20, VIO, 12, t)
        // 허수부 화살표
        gLine(px, cy, px, py, GRN, 3, t)
        gText(`허수부 b=${r(cb)}`, px + 22, (cy + py) / 2, GRN, 12, t)
        // 대각선 (절댓값)
        gLine(cx, cy, px, py, 'rgba(255,255,255,0.3)', 1.5, t)
        // 직각 표시선
        gLine(px - 8, cy, px - 8, cy - 8, 'rgba(255,255,255,0.4)', 1, t)
        gLine(px - 8, cy - 8, px, cy - 8, 'rgba(255,255,255,0.4)', 1, t)
      }
      // ③ 복소수 점 표시
      if (p > 0.42) {
        const t = easeOutCubic(Math.min(1, (p - 0.42) / 0.18))
        gText('③ 복소수 점 표시', cx, 22, ORG, 14, t)
        const px = cx + ca * sc, py = cy - cb * sc
        gCircle(px, py, 7, ORG, true, t)
        gText(`${r(ca)}+${r(cb)}i`, px + 20, py - 16, ORG, 14, t)
        // 절댓값 레이블
        const mag = Math.sqrt(ca * ca + cb * cb)
        gText(`|z|=${r(mag)}`, cx + 10, cy - mag * sc / 2, 'rgba(255,255,255,0.5)', 11, t)
      }
      // ④ i²=-1 성질
      if (p > 0.60) {
        const t = easeOutCubic(Math.min(1, (p - 0.60) / 0.18))
        gText('④ 허수 단위 i² = -1', cx, 22, ORG, 14, t)
        gText('i² = -1', cx - 100, cy + 55, ORG, 16, t)
        // i² 강조 원
        gCircle(cx, cy - sc, 5, ORG, false, t)
        gText('i', cx + 8, cy - sc - 6, ORG, 12, t)
        // -1 위치 강조 원
        gCircle(cx - sc, cy, 5, ORG, false, t)
        gText('-1', cx - sc, cy + 14, ORG, 11, t)
        // i → -1 회전 호 (간략화: 선으로 표시)
        gLine(cx, cy - sc, cx - sc, cy, ORG, 1.5, t * 0.6)
      }
      // ⑤ 결론
      if (p > 0.80) {
        const t = easeOutCubic(Math.min(1, (p - 0.80) / 0.18))
        gText('⑤ 2차원으로 확장된 수 체계', cx, H - 22, MINT, 14, t)
        gLine(cx - 110, H - 34, cx + 110, H - 34, MINT, 1.5, t)
        gCircle(cx - 114, H - 22, 3, MINT, true, t)
        gCircle(cx + 114, H - 22, 3, MINT, true, t)
      }
      break
    }

    case 'vieta': {
      const va = v('a', 1), vb = v('b', -5), vc = v('c', 6)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const D = vb * vb - 4 * va * vc
      const sc = 35, baseY = cy + 20
      // 좌표축
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.15)', 1.5, p)
      gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.15)', 1.5, p)
      gText('x', W - 24, baseY - 10, '#555', 11, p)
      gText('y', cx + 10, 34, '#555', 11, p)
      // 보조 눈금선
      for (let i = -2; i <= 6; i++) {
        if (i === 0) continue
        gLine(cx + (i - 2.5) * sc, baseY - 4, cx + (i - 2.5) * sc, baseY + 4, 'rgba(255,255,255,0.18)', 1, p)
        gText(`${i}`, cx + (i - 2.5) * sc, baseY + 14, 'rgba(255,255,255,0.28)', 9, p)
      }
      // ① 포물선
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.20))
        gText('① 포물선 그리기', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = VIO; ctx.beginPath()
        let s = false
        for (let x = -2; x <= 7; x += 0.05) { const y = va * x * x + vb * x + vc; const sx = cx + (x - 2.5) * sc, sy = baseY - y * 15; if (sy < 25 || sy > H - 20) { s = false; continue }; if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        // 꼭짓점 x 좌표 보조선
        const vx = -vb / (2 * va)
        gLine(cx + (vx - 2.5) * sc, baseY, cx + (vx - 2.5) * sc, baseY - (D >= 0 ? 20 : 40), 'rgba(255,255,255,0.2)', 1, t)
      }
      // ② 근 표시
      if (p > 0.25 && D >= 0) {
        const t = easeOutCubic(Math.min(1, (p - 0.25) / 0.20))
        const sq = Math.sqrt(D)
        const r1 = (-vb - sq) / (2 * va), r2 = (-vb + sq) / (2 * va)
        gText('② 두 근 표시', cx, 22, GRN, 14, t)
        gCircle(cx + (r1 - 2.5) * sc, baseY, 7, GRN, true, t)
        gCircle(cx + (r2 - 2.5) * sc, baseY, 7, GRN, true, t)
        gText(`α=${r(r1)}`, cx + (r1 - 2.5) * sc, baseY + 20, GRN, 12, t)
        gText(`β=${r(r2)}`, cx + (r2 - 2.5) * sc, baseY + 20, GRN, 12, t)
        // 두 근 연결선
        gLine(cx + (r1 - 2.5) * sc, baseY - 20, cx + (r2 - 2.5) * sc, baseY - 20, GRN, 1.5, t * 0.7)
        // ③ 합
        if (p > 0.48) {
          const t2 = easeOutCubic(Math.min(1, (p - 0.48) / 0.16))
          gText('③ 두 근의 합', cx, 22, ORG, 14, t2)
          gText(`α+β = ${r(r1)}+${r(r2)} = ${r(r1 + r2)}`, cx - 10, cy - 60, ORG, 14, t2)
          gText(`= -b/a = ${r(-vb / va)}`, cx + 30, cy - 44, ORG, 13, t2)
          // 합 화살선: 근 → 계수
          gLine(cx + (r1 - 2.5) * sc, baseY + 22, cx - 10, cy - 68, ORG, 1, t2 * 0.6)
          gLine(cx + (r2 - 2.5) * sc, baseY + 22, cx - 10, cy - 68, ORG, 1, t2 * 0.6)
        }
        // ④ 곱
        if (p > 0.66) {
          const t3 = easeOutCubic(Math.min(1, (p - 0.66) / 0.16))
          gText('④ 두 근의 곱', cx, 22, AMBER, 14, t3)
          gText(`α×β = ${r(r1)}×${r(r2)} = ${r(r1 * r2)}`, cx - 10, cy - 18, AMBER, 14, t3)
          gText(`= c/a = ${r(vc / va)}`, cx + 30, cy - 2, AMBER, 13, t3)
          // 구분선
          gLine(cx - 120, cy - 30, cx + 120, cy - 30, AMBER, 1, t3 * 0.5)
        }
      }
      if (p > 0.25 && D < 0) {
        const t = easeOutCubic(Math.min(1, (p - 0.25) / 0.20))
        gText('② 실수 근 없음 (판별식 < 0)', cx, 22, ORG, 14, t)
      }
      // ⑤ 결론
      if (p > 0.84) {
        const t = easeOutCubic(Math.min(1, (p - 0.84) / 0.14))
        gText('⑤ 계수에서 근의 합·곱을 바로 읽어낸다', cx, H - 22, MINT, 14, t)
        gLine(cx - 148, H - 34, cx + 148, H - 34, MINT, 1.5, t)
        gCircle(cx - 152, H - 22, 3, MINT, true, t)
        gCircle(cx + 152, H - 22, 3, MINT, true, t)
      }
      break
    }

    case 'quad_func_eq': {
      const qa = v('a', 1), qb = v('b', -4), qc = v('c', 3)
      const D = qb * qb - 4 * qa * qc
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 35, baseY = cy + 20
      const vxCoord = -qb / (2 * qa)  // 꼭짓점 x
      const vyVal = qa * vxCoord * vxCoord + qb * vxCoord + qc  // 꼭짓점 y
      // 좌표축
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.15)', 1.5, p)
      gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.15)', 1.5, p)
      gText('x', W - 24, baseY - 10, '#555', 11, p)
      gText('y', cx + 10, 34, '#555', 11, p)
      // 보조 눈금선
      for (let i = -2; i <= 5; i++) {
        if (i === 0) continue
        gLine(cx + (i - 2) * sc, baseY - 4, cx + (i - 2) * sc, baseY + 4, 'rgba(255,255,255,0.18)', 1, p)
        gText(`${i}`, cx + (i - 2) * sc, baseY + 14, 'rgba(255,255,255,0.28)', 9, p)
      }
      // ① 포물선 y=ax²+bx+c
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.20))
        gText('① 포물선 y=ax²+bx+c', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = VIO; ctx.beginPath()
        let s = false
        for (let x = -2; x <= 6; x += 0.05) { const y = qa * x * x + qb * x + qc; const sx = cx + (x - 2) * sc, sy = baseY - y * 15; if (sy < 25 || sy > H - 20) { s = false; continue }; if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        // 포물선 레이블
        gText('y=f(x)', cx + 3 * sc, baseY - (qa * 3 * 3 + qb * 3 + qc) * 15 - 12, VIO, 11, t)
      }
      // ② 꼭짓점 및 대칭축
      if (p > 0.26) {
        const t = easeOutCubic(Math.min(1, (p - 0.26) / 0.18))
        gText('② 꼭짓점·대칭축', cx, 22, ORG, 14, t)
        const vpx = cx + (vxCoord - 2) * sc, vpy = baseY - vyVal * 15
        // 대칭축 점선
        gLine(vpx, 30, vpx, H - 20, 'rgba(214,90,48,0.35)', 1.5, t)
        gText(`x=${r(vxCoord)}`, vpx + 8, 38, ORG, 11, t)
        // 꼭짓점 점
        gCircle(vpx, vpy, 6, ORG, true, t)
        gText(`꼭짓점(${r(vxCoord)},${r(vyVal)})`, vpx + 16, vpy - 12, ORG, 11, t)
      }
      // ③ x축 강조 + 교점
      if (p > 0.46) {
        const t = easeOutCubic(Math.min(1, (p - 0.46) / 0.18))
        gText('③ y=0 (x축) 교점 탐색', cx, 22, GRN, 14, t)
        gLine(30, baseY, W - 30, baseY, ORG, 2, t * 0.5)
        if (D >= 0) {
          const sq = Math.sqrt(D)
          const r1 = (-qb - sq) / (2 * qa), r2 = (-qb + sq) / (2 * qa)
          gCircle(cx + (r1 - 2) * sc, baseY, 7, GRN, true, t)
          if (D > 0) gCircle(cx + (r2 - 2) * sc, baseY, 7, GRN, true, t)
          gText(`x=${r(r1)}`, cx + (r1 - 2) * sc, baseY + 20, GRN, 13, t)
          if (D > 0) gText(`x=${r(r2)}`, cx + (r2 - 2) * sc, baseY + 20, GRN, 13, t)
          // 두 근 연결선
          if (D > 0) gLine(cx + (r1 - 2) * sc, baseY - 18, cx + (r2 - 2) * sc, baseY - 18, GRN, 1.5, t * 0.7)
        } else {
          gText('x축과 만나지 않음 (근 없음)', cx, cy - 60, ORG, 14, t)
        }
      }
      // ④ 판별식 표시
      if (p > 0.66) {
        const t = easeOutCubic(Math.min(1, (p - 0.66) / 0.16))
        gText('④ 판별식 D=b²-4ac', cx, 22, AMBER, 14, t)
        const dStr = D > 0 ? `D=${r(D)} > 0 → 두 근` : D === 0 ? `D=0 → 중근` : `D=${r(D)} < 0 → 근 없음`
        gText(dStr, cx, H - 48, AMBER, 13, t)
        gLine(cx - 100, H - 37, cx + 100, H - 37, AMBER, 1, t)
        // 판별식 원
        gCircle(cx - 105, H - 48, 3, AMBER, true, t)
      }
      // ⑤ 결론
      if (p > 0.82) {
        const t = easeOutCubic(Math.min(1, (p - 0.82) / 0.16))
        gText('⑤ 포물선이 x축과 만나는 점 = 방정식의 근', cx, H - 22, MINT, 14, t)
        gLine(cx - 152, H - 34, cx + 152, H - 34, MINT, 1.5, t)
        gCircle(cx - 156, H - 22, 3, MINT, true, t)
        gCircle(cx + 156, H - 22, 3, MINT, true, t)
      }
      break
    }

    case 'abs_function': {
      const ah = v('h', 2), ak = v('k', 1)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 30, baseY = cy + 40
      // 좌표축
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.15)', 1.5, p)
      gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.15)', 1.5, p)
      gText('x', W - 24, baseY - 10, '#555', 11, p)
      gText('y', cx + 10, 34, '#555', 11, p)
      // 보조 눈금선
      for (let i = -4; i <= 5; i++) {
        if (i === 0) continue
        gLine(cx + i * sc, baseY - 3, cx + i * sc, baseY + 3, 'rgba(255,255,255,0.18)', 1, p)
        gText(`${i}`, cx + i * sc, baseY + 12, 'rgba(255,255,255,0.28)', 9, p)
      }
      // ① y=|x| 기본 함수
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.25))
        gText('① 기준: y=|x|', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.5; ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath()
        for (let x = -5; x <= 5; x += 0.1) { const sx = cx + x * sc, sy = baseY - Math.abs(x) * sc; if (sy < 25) continue; if (x === -5) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.setLineDash([]); ctx.restore()
        // 원점 강조 원
        gCircle(cx, baseY, 5, VIO, true, t)
        gText('원점(0,0)', cx + 12, baseY - 12, VIO, 11, t)
      }
      // ② 대칭축 y=|x| (x=0 수직선)
      if (p > 0.22) {
        const t = easeOutCubic(Math.min(1, (p - 0.22) / 0.18))
        gText('② y=|x| 대칭축: x=0', cx, 22, VIO, 14, t)
        gLine(cx, baseY - 80, cx, baseY + 10, 'rgba(83,74,183,0.5)', 2, t)
        gText('대칭축 x=0', cx + 10, baseY - 70, VIO, 11, t)
      }
      // ③ y=|x-h|+k 이동 그래프
      if (p > 0.40) {
        const t = easeOutCubic(Math.min(1, (p - 0.40) / 0.25))
        gText(`③ 이동: y=|x-${r(ah)}|+${r(ak)}`, cx, 22, GRN, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = GRN; ctx.lineWidth = 2.5; ctx.shadowBlur = 10; ctx.shadowColor = GRN; ctx.beginPath()
        for (let x = -5; x <= 8; x += 0.1) { const y = Math.abs(x - ah) + ak; const sx = cx + (x - ah / 2) * sc, sy = baseY - y * sc; if (sy < 25 || sy > H - 20) continue; if (x === -5) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        // 이동 화살표 (원점 → 꼭짓점)
        gLine(cx, baseY, cx + (ah / 2) * sc, baseY - ak * sc, 'rgba(29,158,117,0.5)', 1.5, t)
      }
      // ④ 꼭짓점 및 이동 대칭축
      if (p > 0.62) {
        const t = easeOutCubic(Math.min(1, (p - 0.62) / 0.18))
        gText('④ 꼭짓점·새 대칭축', cx, 22, ORG, 14, t)
        const vpx = cx + (ah / 2) * sc, vpy = baseY - ak * sc
        gCircle(vpx, vpy, 8, ORG, true, t)
        gText(`꼭짓점(${r(ah)}, ${r(ak)})`, vpx + 14, vpy - 14, ORG, 13, t)
        // 새 대칭축 점선
        gLine(vpx, 35, vpx, H - 30, 'rgba(214,90,48,0.4)', 1.5, t)
        gText(`대칭축 x=${r(ah)}`, vpx + 8, 42, ORG, 11, t)
        // 꼭짓점에서 내린 수직선 (h방향 이동 표시)
        gLine(cx, baseY, vpx, baseY, AMBER, 1.5, t * 0.6)
        gLine(vpx, baseY, vpx, vpy, AMBER, 1.5, t * 0.6)
        gText(`h=${r(ah)}`, (cx + vpx) / 2, baseY + 14, AMBER, 11, t)
        gText(`k=${r(ak)}`, vpx + 6, (baseY + vpy) / 2, AMBER, 11, t)
      }
      // ⑤ 결론: 접혀 올라감
      if (p > 0.82) {
        const t = easeOutCubic(Math.min(1, (p - 0.82) / 0.16))
        gText('⑤ 음수 부분이 접혀 올라간다', cx, H - 22, MINT, 14, t)
        gLine(cx - 110, H - 34, cx + 110, H - 34, MINT, 1.5, t)
        gCircle(cx - 114, H - 22, 3, MINT, true, t)
        gCircle(cx + 114, H - 22, 3, MINT, true, t)
      }
      break
    }

    // ══════════════════════════════════════════
    // H012~H021 — 고등 대수 Canvas 2D (2)
    // ══════════════════════════════════════════

    case 'sigma_notation': {
      const sn = Math.max(2, Math.min(12, Math.round(v('n', 5))))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const barW = Math.min(40, (W - 60) / sn - 6), maxBH = H - 110
      const ox = cx - (sn * (barW + 6)) / 2, baseY = H - 50

      // ① 막대 솟아오름
      if (p > 0.02) {
        const t0 = easeOutCubic(Math.min(1, (p - 0.02) / 0.1))
        gText('① 막대 하나씩 솟아오름', cx, 22, VIO, 14, t0)
        // 기저선 (x축)
        gLine(ox - 10, baseY, ox + sn * (barW + 6) + 10, baseY, 'rgba(255,255,255,0.35)', 2, t0)
        // 좌측 y축
        gLine(ox - 10, baseY, ox - 10, baseY - maxBH * 0.75, 'rgba(255,255,255,0.25)', 1.5, t0)
        for (let i = 0; i < sn; i++) {
          const val = i + 1
          const bh = (val / sn) * maxBH * 0.7
          const delay = 0.04 + i * (0.44 / sn)
          if (p < delay) continue
          const t = easeOutCubic(Math.min(1, (p - delay) / 0.15))
          const x = ox + i * (barW + 6)
          ctx.save(); ctx.globalAlpha = t * 0.55; ctx.fillStyle = VIO
          ctx.fillRect(x, baseY - bh * t, barW, bh * t); ctx.restore()
          ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 1.5
          ctx.strokeRect(x, baseY - bh * t, barW, bh * t); ctx.restore()
          gText(`a${i + 1}`, x + barW / 2, baseY + 14, 'rgba(255,255,255,0.5)', 10, t)
          // 막대 꼭대기에 원 마커
          gCircle(x + barW / 2, baseY - bh * t, 4, AMBER, true, t)
          // 막대 상단 값
          gText(`${val}`, x + barW / 2, baseY - bh * t - 14, ORG, 10, t)
        }
        // 합산 브래킷 선 (좌)
        gLine(ox - 22, baseY - maxBH * 0.72, ox - 22, baseY, VIO, 2.5, t0)
        gLine(ox - 22, baseY - maxBH * 0.72, ox - 10, baseY - maxBH * 0.72, VIO, 2, t0)
        gLine(ox - 22, baseY, ox - 10, baseY, VIO, 2, t0)
      }

      // ② 시그마 기호 등장
      if (p > 0.5) {
        const t = easeOutCubic(Math.min(1, (p - 0.5) / 0.2))
        gText('② 시그마 = 전부 더해라', cx, 22, GRN, 14, t)
        gText('Σ', ox - 48, cy - 10, GRN, 34, t)
        gText('k=1', ox - 48, cy + 14, GRN, 10, t)
        gText(`${sn}`, ox - 48, cy - 36, GRN, 10, t)
        // 합계 구간 강조선
        gLine(ox, baseY - 6, ox + sn * (barW + 6) - 6, baseY - 6, GRN, 1.5, t * 0.6)
      }

      // ③ 누적 합 강조 (각 막대 위에 누적선)
      if (p > 0.65) {
        const t = easeOutCubic(Math.min(1, (p - 0.65) / 0.2))
        gText('③ 누적 합 시각화', cx, 22, ORG, 14, t)
        let acc = 0
        for (let i = 0; i < sn; i++) {
          acc += i + 1
          const x = ox + i * (barW + 6) + barW / 2
          gText(`${acc}`, x, baseY - (acc / ((sn * (sn + 1)) / 2)) * maxBH * 0.7 - 28, ORG, 9, t * 0.8)
        }
        // 누적 추세선
        ctx.save(); ctx.globalAlpha = t * 0.7; ctx.strokeStyle = ORG; ctx.lineWidth = 2; ctx.setLineDash([4, 3])
        ctx.beginPath()
        for (let i = 0; i < sn; i++) {
          const cumH = ((i + 1) * (i + 2) / 2) / ((sn * (sn + 1)) / 2) * maxBH * 0.7
          const x = ox + i * (barW + 6) + barW / 2
          if (i === 0) ctx.moveTo(x, baseY - cumH); else ctx.lineTo(x, baseY - cumH)
        }
        ctx.stroke(); ctx.setLineDash([]); ctx.restore()
      }

      // ④ 공식 표시
      if (p > 0.78) {
        const t = easeOutCubic(Math.min(1, (p - 0.78) / 0.15))
        gText('④ 공식 Σk = n(n+1)/2', cx, 22, MINT, 14, t)
        const total = (sn * (sn + 1)) / 2
        gText(`n=${sn}: 합 = ${sn}×${sn + 1}÷2 = ${total}`, cx, baseY - maxBH * 0.8, MINT, 13, t)
        // 결과 강조 원
        gCircle(cx, baseY - maxBH * 0.8, 55, MINT, false, t * 0.5)
      }

      // ⑤ 최종 결과
      if (p > 0.9) {
        const t = easeOutCubic(Math.min(1, (p - 0.9) / 0.1))
        const total = (sn * (sn + 1)) / 2
        gText(`⑤ k=1부터 ${sn}까지 합 = ${total}`, cx, H - 22, AMBER, 16, t)
        gLine(cx - 80, H - 32, cx + 80, H - 32, AMBER, 1.5, t * 0.5)
      }
      break
    }

    case 'quad_inequality': {
      const qa = v('a', 1), qb = v('b', -2), qc = v('c', -3)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const D = qb * qb - 4 * qa * qc, sc = 32, baseY = cy + 15

      // ① 좌표축 + 포물선
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① 포물선 그리기', cx, 22, VIO, 14, t)
        // x축
        gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.25)', 1.5, t)
        // y축
        gLine(cx, 28, cx, H - 24, 'rgba(255,255,255,0.2)', 1.5, t)
        // x축 눈금 마커
        for (let xi = -3; xi <= 4; xi++) {
          const sx = cx + xi * sc
          gLine(sx, baseY - 4, sx, baseY + 4, 'rgba(255,255,255,0.3)', 1, t)
          gText(String(xi), sx, baseY + 16, 'rgba(255,255,255,0.4)', 9, t)
        }
        // 포물선
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = VIO; ctx.beginPath()
        let s = false
        for (let xi = -3; xi <= 5; xi += 0.05) {
          const y = qa * xi * xi + qb * xi + qc
          const sx = cx + (xi - 1) * sc, sy = baseY - y * 11
          if (sy < 24 || sy > H - 22) { s = false; continue }
          if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy)
        }
        ctx.stroke(); ctx.restore()
        // 꼭짓점 강조원
        const vx = -qb / (2 * qa), vy = qa * vx * vx + qb * vx + qc
        gCircle(cx + (vx - 1) * sc, baseY - vy * 11, 5, VIO, true, t)
        gText('꼭짓점', cx + (vx - 1) * sc + 22, baseY - vy * 11, VIO, 10, t)
      }

      // ② 판별식 & 근 마커
      if (p > 0.3 && D >= 0) {
        const t = easeOutCubic(Math.min(1, (p - 0.3) / 0.25))
        gText('② 판별식 D≥0 → 두 근 존재', cx, 22, GRN, 14, t)
        const sq = Math.sqrt(D), r1 = (-qb - sq) / (2 * qa), r2 = (-qb + sq) / (2 * qa)
        const sx1 = cx + (r1 - 1) * sc, sx2 = cx + (r2 - 1) * sc
        // 근 수직 마커선
        gLine(sx1, baseY - 30, sx1, baseY + 10, AMBER, 2, t)
        gLine(sx2, baseY - 30, sx2, baseY + 10, AMBER, 2, t)
        // 근 원 강조
        gCircle(sx1, baseY, 6, AMBER, true, t)
        gCircle(sx2, baseY, 6, AMBER, true, t)
        gText(`α=${r(r1)}`, sx1, baseY + 26, AMBER, 11, t)
        gText(`β=${r(r2)}`, sx2, baseY + 26, AMBER, 11, t)
        // 두 근 사이 구간선
        gLine(sx1, baseY - 14, sx2, baseY - 14, GRN, 2, t)
      }

      // ③ 영역 채색
      if (p > 0.5 && D >= 0) {
        const t = easeOutCubic(Math.min(1, (p - 0.5) / 0.25))
        gText('③ y>0 / y<0 영역 구분', cx, 22, ORG, 14, t)
        const sq = Math.sqrt(D), r1 = (-qb - sq) / (2 * qa), r2 = (-qb + sq) / (2 * qa)
        for (let xi = -3; xi <= 5; xi += 0.12) {
          const y = qa * xi * xi + qb * xi + qc
          const sx = cx + (xi - 1) * sc, sy = baseY - y * 11
          if (sy < 24 || sy > H - 22) continue
          const col = y > 0 ? GRN : ORG
          ctx.save(); ctx.globalAlpha = t * 0.22; ctx.fillStyle = col
          ctx.fillRect(sx, Math.min(baseY, sy), 5, Math.abs(baseY - sy)); ctx.restore()
        }
        const sx1 = cx + (r1 - 1) * sc, sx2 = cx + (r2 - 1) * sc
        gText('y<0', (sx1 + sx2) / 2, baseY + 40, ORG, 13, t)
        gText('y>0', sx2 + 28, baseY - 18, GRN, 12, t)
      }

      // ④ 해 구간 표시
      if (p > 0.7 && D >= 0) {
        const t = easeOutCubic(Math.min(1, (p - 0.7) / 0.18))
        gText('④ 해 구간 확인', cx, 22, MINT, 14, t)
        const sq = Math.sqrt(D), r1 = (-qb - sq) / (2 * qa), r2 = (-qb + sq) / (2 * qa)
        const sx1 = cx + (r1 - 1) * sc, sx2 = cx + (r2 - 1) * sc
        // 해 구간 두꺼운 선
        gLine(sx1, baseY, sx2, baseY, MINT, 4, t)
        gCircle(sx1, baseY, 8, MINT, false, t)
        gCircle(sx2, baseY, 8, MINT, false, t)
      }

      // ⑤ 결론
      if (p > 0.87) {
        const t = easeOutCubic(Math.min(1, (p - 0.87) / 0.13))
        gText('⑤ x축 교점이 부등식 해의 경계', cx, H - 22, MINT, 14, t)
        gLine(cx - 130, H - 32, cx + 130, H - 32, MINT, 1, t * 0.4)
      }
      break
    }

    case 'abs_inequality': {
      const aia = v('a', 3), aib = v('b', 2)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = Math.min(36, (W - 80) / 14), lineY = cy + 10
      const ox = cx - 7 * sc

      // ① 수직선 + 눈금
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.18))
        gText('① 수직선 그리기', cx, 22, WHITE, 14, t)
        // 수직선 본선
        gLine(ox - 10, lineY, ox + 14 * sc + 10, lineY, 'rgba(255,255,255,0.35)', 2, t)
        // 화살표 끝 표시
        gLine(ox + 14 * sc + 2, lineY - 5, ox + 14 * sc + 10, lineY, 'rgba(255,255,255,0.35)', 2, t)
        gLine(ox + 14 * sc + 2, lineY + 5, ox + 14 * sc + 10, lineY, 'rgba(255,255,255,0.35)', 2, t)
        // 눈금 tick 선
        for (let i = -3; i <= 10; i++) {
          const tx = ox + (i + 3) * sc
          gLine(tx, lineY - 5, tx, lineY + 5, 'rgba(255,255,255,0.3)', 1, t)
          gText(String(i), tx, lineY + 18, 'rgba(255,255,255,0.35)', 10, t)
        }
        // 원점 강조
        gCircle(ox + 3 * sc, lineY, 3, WHITE, true, t * 0.6)
      }

      // ② 중심점 표시
      if (p > 0.22) {
        const t = easeOutCubic(Math.min(1, (p - 0.22) / 0.2))
        gText('② 중심점 = a 위치', cx, 22, ORG, 14, t)
        const cPx = ox + (aia + 3) * sc
        // 중심 수직선
        gLine(cPx, lineY - 30, cPx, lineY + 6, ORG, 2, t)
        gCircle(cPx, lineY, 7, ORG, true, t)
        gText(`a=${r(aia)}`, cPx, lineY - 40, ORG, 13, t)
        gText('중심', cPx, lineY - 24, ORG, 10, t)
      }

      // ③ 반지름 펼침
      if (p > 0.38) {
        const t = easeOutCubic(Math.min(1, (p - 0.38) / 0.22))
        gText('③ 반지름 b만큼 펼침', cx, 22, VIO, 14, t)
        const cPx = ox + (aia + 3) * sc
        const lPx = ox + (aia - aib + 3) * sc, rPx = ox + (aia + aib + 3) * sc
        // 좌우 펼침 선
        gLine(cPx, lineY - 10, lPx * t + cPx * (1 - t), lineY - 10, VIO, 3, t)
        gLine(cPx, lineY - 10, rPx * t + cPx * (1 - t), lineY - 10, VIO, 3, t)
        // 반지름 레이블
        gText(`b=${r(aib)}`, (cPx + rPx) / 2, lineY - 22, VIO, 11, t)
        gText(`b=${r(aib)}`, (cPx + lPx) / 2, lineY - 22, VIO, 11, t)
      }

      // ④ 해 구간 채색
      if (p > 0.56) {
        const t = easeOutCubic(Math.min(1, (p - 0.56) / 0.2))
        gText('④ 해 구간 표시', cx, 22, GRN, 14, t)
        const lPx = ox + (aia - aib + 3) * sc, rPx = ox + (aia + aib + 3) * sc
        ctx.save(); ctx.globalAlpha = t * 0.32; ctx.fillStyle = GRN
        ctx.fillRect(lPx, lineY - 6, rPx - lPx, 12); ctx.restore()
        // 끝점 tick 강조
        gLine(lPx, lineY - 12, lPx, lineY + 12, GRN, 2.5, t)
        gLine(rPx, lineY - 12, rPx, lineY + 12, GRN, 2.5, t)
        gCircle(lPx, lineY, 6, GRN, true, t)
        gCircle(rPx, lineY, 6, GRN, true, t)
        gText(`${r(aia - aib)}`, lPx, lineY + 30, GRN, 13, t)
        gText(`${r(aia + aib)}`, rPx, lineY + 30, GRN, 13, t)
      }

      // ⑤ 결론 수식
      if (p > 0.78) {
        const t = easeOutCubic(Math.min(1, (p - 0.78) / 0.18))
        gText('⑤ 절댓값 부등식 해석 완료', cx, 22, MINT, 14, t)
        gText(`|x-${r(aia)}| < ${r(aib)}  →  ${r(aia - aib)} < x < ${r(aia + aib)}`, cx, H - 22, MINT, 14, t)
        // 결과 강조 언더라인
        gLine(cx - 120, H - 30, cx + 120, H - 30, MINT, 1.5, t * 0.5)
        gCircle(cx, H - 22, 75, MINT, false, t * 0.25)
      }
      break
    }

    case 'counting_h': {
      const cm = Math.max(1, Math.round(v('m', 3))), cn = Math.max(1, Math.round(v('n', 4)))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'

      // ① 합의 법칙 - 두 갈래 등장
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.18))
        gText('① 합의 법칙: 두 갈래 경우', cx, 22, VIO, 14, t)
        // 시작 노드
        gCircle(cx, cy - 55, 10, WHITE, true, t)
        gText('시작', cx, cy - 55, WHITE, 9, t)
        // 가지 A
        gLine(cx, cy - 45, cx - 90, cy - 5, VIO, 2, t)
        gCircle(cx - 90, cy - 5, 9, VIO, true, t)
        gText('A', cx - 90, cy - 5, WHITE, 10, t)
        // 가지 B
        gLine(cx, cy - 45, cx + 90, cy - 5, GRN, 2, t)
        gCircle(cx + 90, cy - 5, 9, GRN, true, t)
        gText('B', cx + 90, cy - 5, WHITE, 10, t)
        gText(`갈래A: ${cm}가지`, cx - 90, cy - 26, VIO, 11, t)
        gText(`갈래B: ${cn}가지`, cx + 90, cy - 26, GRN, 11, t)
      }

      // ② A 경우 노드 펼침
      if (p > 0.18) {
        const t = easeOutCubic(Math.min(1, (p - 0.18) / 0.2))
        gText('② 경우 A 펼치기', cx, 22, VIO, 14, t)
        for (let i = 0; i < cm; i++) {
          const nx = cx - 90 - (cm - 1) * 14 + i * 28
          gLine(cx - 90, cy - 5, nx, cy + 30, VIO, 1.5, t)
          gCircle(nx, cy + 30, 7, VIO, true, t)
          gText(`A${i + 1}`, nx, cy + 30, WHITE, 9, t)
        }
      }

      // ③ B 경우 노드 펼침
      if (p > 0.34) {
        const t = easeOutCubic(Math.min(1, (p - 0.34) / 0.2))
        gText('③ 경우 B 펼치기', cx, 22, GRN, 14, t)
        for (let i = 0; i < cn; i++) {
          const nx = cx + 90 - (cn - 1) * 14 + i * 28
          gLine(cx + 90, cy - 5, nx, cy + 30, GRN, 1.5, t)
          gCircle(nx, cy + 30, 7, GRN, true, t)
          gText(`B${i + 1}`, nx, cy + 30, WHITE, 9, t)
        }
      }

      // ④ 합의 법칙 결과
      if (p > 0.5) {
        const t = easeOutCubic(Math.min(1, (p - 0.5) / 0.18))
        gText('④ 합산: A+B 모두 고려', cx, 22, ORG, 14, t)
        // 합 구분선
        gLine(cx, cy + 48, cx, cy + 62, 'rgba(255,255,255,0.3)', 1.5, t)
        gText(`${cm} + ${cn} = ${cm + cn}가지 (합의 법칙)`, cx, cy + 55, AMBER, 14, t)
      }

      // ⑤ 곱의 법칙 격자
      if (p > 0.66) {
        const t = easeOutCubic(Math.min(1, (p - 0.66) / 0.22))
        gText('⑤ 곱의 법칙: 단계별 선택', cx, 22, MINT, 14, t)
        const cellSz = Math.min(22, (W - 100) / Math.max(cm, cn) - 3)
        const gox = cx - cn * cellSz / 2, goy = cy + 68
        // 격자 테두리
        gLine(gox - 2, goy - 2, gox + cn * cellSz + 2, goy - 2, MINT, 1, t * 0.5)
        gLine(gox - 2, goy - 2, gox - 2, goy + cm * cellSz + 2, MINT, 1, t * 0.5)
        gLine(gox + cn * cellSz + 2, goy - 2, gox + cn * cellSz + 2, goy + cm * cellSz + 2, MINT, 1, t * 0.5)
        gLine(gox - 2, goy + cm * cellSz + 2, gox + cn * cellSz + 2, goy + cm * cellSz + 2, MINT, 1, t * 0.5)
        for (let row = 0; row < cm; row++) {
          for (let col = 0; col < cn; col++) {
            const delay = 0.66 + (row * cn + col) * (0.18 / (cm * cn))
            if (p < delay) continue
            const t2 = easeOutCubic(Math.min(1, (p - delay) / 0.08))
            ctx.save(); ctx.globalAlpha = t2 * 0.38; ctx.fillStyle = VIO
            ctx.fillRect(gox + col * cellSz, goy + row * cellSz, cellSz - 2, cellSz - 2); ctx.restore()
          }
        }
        gText(`1단계: ${cm}가지`, cx, goy - 12, VIO, 11, t)
        gText(`2단계: ${cn}가지`, cx, goy + cm * cellSz + 12, GRN, 11, t)
        gText(`${cm} × ${cn} = ${cm * cn}가지`, cx, goy + cm * cellSz + 26, MINT, 15, t)
      }
      break
    }

    case 'permutation': {
      const pn = Math.max(2, Math.min(8, Math.round(v('n', 5))))
      const pr = Math.max(1, Math.min(pn, Math.round(v('r', 3))))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const labels = 'ABCDEFGH'.split('')
      const ballR = Math.min(16, (W - 60) / pn / 2 - 2)
      const ox = cx - pn * (ballR * 2 + 6) / 2
      const ballY = cy - 40

      // ① 공 등장
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.18))
        gText(`① ${pn}개 공 나열`, cx, 22, VIO, 14, t)
        // 공 받침대 선
        gLine(ox - 5, ballY + ballR + 6, ox + pn * (ballR * 2 + 6) + 5, ballY + ballR + 6, VIO, 1.5, t * 0.5)
        for (let i = 0; i < pn; i++) {
          const x = ox + i * (ballR * 2 + 6) + ballR
          gCircle(x, ballY, ballR, VIO, true, t)
          gText(labels[i], x, ballY, WHITE, 13, t)
        }
      }

      // ② 슬롯 등장
      if (p > 0.22) {
        const t = easeOutCubic(Math.min(1, (p - 0.22) / 0.18))
        gText(`② ${pr}개 슬롯 준비`, cx, 22, GRN, 14, t)
        const slotW = 30, slotGap = 8
        const slotOx = cx - (pr * (slotW + slotGap)) / 2
        for (let i = 0; i < pr; i++) {
          const sx = slotOx + i * (slotW + slotGap)
          ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = GRN; ctx.lineWidth = 2; ctx.setLineDash([4, 3])
          ctx.strokeRect(sx, ballY + ballR + 14, slotW, slotW); ctx.restore()
          gText(`${i + 1}번`, sx + slotW / 2, ballY + ballR + 14 + slotW + 12, '#999', 10, t)
        }
        // 슬롯 간 연결선
        for (let i = 0; i < pr - 1; i++) {
          const sx = slotOx + i * (slotW + slotGap) + slotW
          gLine(sx, ballY + ballR + 14 + slotW / 2, sx + slotGap, ballY + ballR + 14 + slotW / 2, GRN, 1.5, t * 0.6)
        }
      }

      // ③ 공에서 슬롯으로 화살표
      if (p > 0.4) {
        const t = easeOutCubic(Math.min(1, (p - 0.4) / 0.2))
        gText('③ 공을 슬롯에 배치', cx, 22, ORG, 14, t)
        const slotW = 30, slotGap = 8
        const slotOx = cx - (pr * (slotW + slotGap)) / 2
        for (let i = 0; i < Math.min(pr, pn); i++) {
          const bx = ox + i * (ballR * 2 + 6) + ballR
          const sx = slotOx + i * (slotW + slotGap) + slotW / 2
          gLine(bx, ballY + ballR + 2, sx, ballY + ballR + 14, ORG, 1.5, t)
          gCircle(sx, ballY + ballR + 14 + slotW / 2, ballR - 4, ORG, true, t * 0.7)
          gText(labels[i], sx, ballY + ballR + 14 + slotW / 2, WHITE, 11, t)
        }
      }

      // ④ 가지치기 계산
      if (p > 0.58) {
        const t = easeOutCubic(Math.min(1, (p - 0.58) / 0.2))
        gText('④ 각 자리 선택지 감소', cx, 22, AMBER, 14, t)
        let txt = ''
        for (let i = 0; i < pr; i++) { txt += (i > 0 ? ' × ' : '') + `${pn - i}` }
        gText(txt, cx, cy + 55, ORG, 15, t)
        // 각 배수 시각화 선
        for (let i = 0; i < pr; i++) {
          const fx = cx - ((pr - 1) * 28) / 2 + i * 28
          gLine(fx - 10, cy + 45, fx + 10, cy + 45, ORG, 2, t)
        }
      }

      // ⑤ 최종 결과
      if (p > 0.78) {
        const t = easeOutCubic(Math.min(1, (p - 0.78) / 0.18))
        let result = 1; for (let i = 0; i < pr; i++) result *= (pn - i)
        gText('⑤ 순열 = 순서 있는 선택', cx, 22, MINT, 14, t)
        gText(`${pn}P${pr} = ${result}`, cx, H - 22, MINT, 20, t)
        gCircle(cx, H - 22, 42, MINT, false, t * 0.4)
        gLine(cx - 50, H - 32, cx + 50, H - 32, MINT, 1.5, t * 0.5)
      }
      break
    }

    case 'combination': {
      const cn2 = Math.max(2, Math.min(8, Math.round(v('n', 5))))
      const cr2 = Math.max(1, Math.min(cn2, Math.round(v('r', 3))))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const fact = (n: number): number => n <= 1 ? 1 : n * fact(n - 1)
      let perm = 1; for (let i = 0; i < cr2; i++) perm *= (cn2 - i)
      const comb = Math.round(perm / fact(cr2))
      const labels = 'ABCDE'.split('')

      // ① 원소 공 등장
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.18))
        gText(`① ${cn2}개 원소`, cx, 22, VIO, 14, t)
        const bR = Math.min(14, (W - 60) / cn2 / 2 - 2)
        const bOx = cx - cn2 * (bR * 2 + 8) / 2
        for (let i = 0; i < cn2; i++) {
          const bx = bOx + i * (bR * 2 + 8) + bR
          gCircle(bx, cy - 50, bR, VIO, true, t)
          gText(labels[i % labels.length], bx, cy - 50, WHITE, 12, t)
        }
        // 전체 포함 브래킷
        gLine(bOx - 6, cy - 50 - bR - 6, bOx - 6, cy - 50 + bR + 6, VIO, 2, t)
        gLine(bOx + cn2 * (bR * 2 + 8) + 6, cy - 50 - bR - 6, bOx + cn2 * (bR * 2 + 8) + 6, cy - 50 + bR + 6, VIO, 2, t)
        gLine(bOx - 6, cy - 50 - bR - 6, bOx, cy - 50 - bR - 6, VIO, 2, t)
        gLine(bOx + cn2 * (bR * 2 + 8) + 6, cy - 50 - bR - 6, bOx + cn2 * (bR * 2 + 8), cy - 50 - bR - 6, VIO, 2, t)
      }

      // ② 순열 먼저 계산
      if (p > 0.2) {
        const t = easeOutCubic(Math.min(1, (p - 0.2) / 0.2))
        gText('② 순열로 먼저 세기', cx, 22, GRN, 14, t)
        gText(`${cn2}P${cr2} = ${perm}`, cx, cy - 12, VIO, 17, t)
        gText('(순서 구분)', cx, cy + 6, VIO, 11, t * 0.7)
        // 순열 강조 선
        gLine(cx - 50, cy - 2, cx + 50, cy - 2, VIO, 1, t * 0.4)
      }

      // ③ 중복 그룹 묶기
      if (p > 0.38) {
        const t = easeOutCubic(Math.min(1, (p - 0.38) / 0.22))
        gText('③ 같은 조합 그룹화', cx, 22, ORG, 14, t)
        const rFact = fact(cr2)
        gText(`${cr2}! = ${rFact}가지는 같은 조합`, cx, cy + 22, GRN, 13, t)
        const showN = Math.min(comb, 5)
        const boxW = Math.min(46, (W - 60) / showN - 4)
        const gox = cx - showN * boxW / 2
        for (let i = 0; i < showN; i++) {
          const delay = 0.4 + i * 0.04
          if (p < delay) continue
          const t2 = easeOutCubic(Math.min(1, (p - delay) / 0.1))
          ctx.save(); ctx.globalAlpha = t2 * 0.28; ctx.fillStyle = ORG
          ctx.fillRect(gox + i * boxW, cy + 36, boxW - 4, 28); ctx.restore()
          ctx.save(); ctx.globalAlpha = t2; ctx.strokeStyle = ORG; ctx.lineWidth = 1.5
          ctx.strokeRect(gox + i * boxW, cy + 36, boxW - 4, 28); ctx.restore()
          // 박스 중앙 연결점
          gCircle(gox + i * boxW + boxW / 2 - 2, cy + 36, 3, ORG, true, t2)
        }
        if (comb > 5) gText('...', gox + 5 * boxW + 10, cy + 50, '#999', 14, t)
        // 그룹 상단 브래킷 선
        gLine(gox - 2, cy + 34, gox + showN * boxW - 4, cy + 34, ORG, 1.5, t * 0.5)
      }

      // ④ 나누기 과정
      if (p > 0.62) {
        const t = easeOutCubic(Math.min(1, (p - 0.62) / 0.18))
        gText('④ 중복 제거 = 나누기', cx, 22, MINT, 14, t)
        gText(`${perm} ÷ ${fact(cr2)} = ${comb}`, cx, cy + 78, ORG, 16, t)
        // 나눗셈 강조선
        gLine(cx - 45, cy + 82, cx + 45, cy + 82, ORG, 2, t * 0.5)
      }

      // ⑤ 최종 결과
      if (p > 0.8) {
        const t = easeOutCubic(Math.min(1, (p - 0.8) / 0.18))
        gText('⑤ 조합 = 순서 없는 선택', cx, 22, MINT, 14, t)
        gText(`${cn2}C${cr2} = ${comb}`, cx, H - 22, MINT, 20, t)
        gCircle(cx, H - 22, 40, MINT, false, t * 0.35)
        gLine(cx - 50, H - 32, cx + 50, H - 32, MINT, 1.5, t * 0.5)
      }
      break
    }

    case 'binomial_theorem': {
      const bn = Math.max(1, Math.min(8, Math.round(v('n', 4))))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const fact = (n: number): number => n <= 1 ? 1 : n * fact(n - 1)
      const C = (n: number, k: number) => Math.round(fact(n) / (fact(k) * fact(n - k)))
      const cellSz = Math.min(34, (W - 40) / (bn + 2))

      // ① 파스칼 삼각형 행별 등장
      if (p > 0.02) {
        const t0 = easeOutCubic(Math.min(1, (p - 0.02) / 0.1))
        gText('① 파스칼의 삼각형', cx, 22, VIO, 14, t0)
        for (let row = 0; row <= bn; row++) {
          const delay = 0.04 + row * (0.46 / (bn + 1))
          if (p < delay) continue
          const t = easeOutCubic(Math.min(1, (p - delay) / 0.12))
          const y = 42 + row * (cellSz + 4)
          const cols = row + 1
          const rowOx = cx - cols * cellSz / 2
          const isTarget = row === bn
          for (let k = 0; k < cols; k++) {
            const x = rowOx + k * cellSz + cellSz / 2
            const col = isTarget ? (p > 0.58 ? ORG : VIO) : VIO
            const alpha = isTarget && p > 0.58 ? t : t * 0.6
            ctx.save(); ctx.globalAlpha = alpha * 0.18; ctx.fillStyle = col
            ctx.fillRect(rowOx + k * cellSz + 1, y - cellSz / 2 + 1, cellSz - 2, cellSz - 2); ctx.restore()
            gText(String(C(row, k)), x, y, col, isTarget ? 14 : 11, t)
          }
          // 각 행 좌우 연결선 (삼각형 구조선)
          if (row < bn && p > delay + 0.05) {
            const t2 = easeOutCubic(Math.min(1, (p - delay - 0.05) / 0.1))
            const nextY = 42 + (row + 1) * (cellSz + 4)
            const nextCols = row + 2
            const nextOx = cx - nextCols * cellSz / 2
            for (let k = 0; k < cols; k++) {
              const px = rowOx + k * cellSz + cellSz / 2
              // 왼쪽 아래 연결
              gLine(px, y + cellSz / 2, nextOx + k * cellSz + cellSz / 2, nextY - cellSz / 2, VIO, 0.8, t2 * 0.4)
              // 오른쪽 아래 연결
              gLine(px, y + cellSz / 2, nextOx + (k + 1) * cellSz + cellSz / 2, nextY - cellSz / 2, VIO, 0.8, t2 * 0.4)
            }
          }
        }
      }

      // ② n번째 줄 강조
      if (p > 0.58) {
        const t = easeOutCubic(Math.min(1, (p - 0.58) / 0.15))
        gText(`② ${bn}번째 줄 = (a+b)^${bn} 계수`, cx, 22, ORG, 14, t)
        const y = 42 + bn * (cellSz + 4)
        const cols = bn + 1
        const rowOx = cx - cols * cellSz / 2
        // 해당 줄 하이라이트 박스
        gLine(rowOx - 4, y - cellSz / 2 - 3, rowOx + cols * cellSz + 4, y - cellSz / 2 - 3, ORG, 1.5, t)
        gLine(rowOx - 4, y + cellSz / 2 + 3, rowOx + cols * cellSz + 4, y + cellSz / 2 + 3, ORG, 1.5, t)
        // 각 셀 위에 강조 원
        for (let k = 0; k < cols; k++) {
          const x = rowOx + k * cellSz + cellSz / 2
          gCircle(x, y, cellSz / 2 - 1, ORG, false, t * 0.6)
        }
      }

      // ③ 계수 나열
      if (p > 0.73) {
        const t = easeOutCubic(Math.min(1, (p - 0.73) / 0.15))
        gText('③ 이항계수 목록', cx, H - 40, GRN, 14, t)
        const coeffs = Array.from({ length: bn + 1 }, (_, k) => C(bn, k)).join(', ')
        gText(`계수: ${coeffs}`, cx, H - 22, MINT, 13, t)
        gLine(cx - 90, H - 30, cx + 90, H - 30, MINT, 1, t * 0.4)
      }

      // ④ 대칭성 강조
      if (p > 0.82) {
        const t = easeOutCubic(Math.min(1, (p - 0.82) / 0.12))
        gText('④ 좌우 대칭 성질 확인', cx, 22, MINT, 14, t)
        const y = 42 + bn * (cellSz + 4)
        const cols = bn + 1
        const rowOx = cx - cols * cellSz / 2
        const mid = (cols - 1) / 2
        for (let k = 0; k < Math.floor(cols / 2); k++) {
          const x1 = rowOx + k * cellSz + cellSz / 2
          const x2 = rowOx + (cols - 1 - k) * cellSz + cellSz / 2
          gLine(x1, y - cellSz / 2 - 8, x2, y - cellSz / 2 - 8, MINT, 1.5, t * 0.7)
          gCircle(x1, y - cellSz / 2 - 8, 3, MINT, true, t)
          gCircle(x2, y - cellSz / 2 - 8, 3, MINT, true, t)
        }
      }

      // ⑤ 최종 수식
      if (p > 0.91) {
        const t = easeOutCubic(Math.min(1, (p - 0.91) / 0.09))
        gText('⑤ (a+b)^n 전개 완료', cx, 22, AMBER, 14, t)
        gCircle(cx, cy, Math.min(cellSz * (bn + 2) / 2, W / 3), AMBER, false, t * 0.15)
      }
      break
    }

    case 'set_operation': {
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const r1 = Math.min(65, Math.min(W, H) / 4 - 4), d = r1 * 0.72
      const ax = cx - d / 2, bx = cx + d / 2

      // ① 전체집합 테두리 + 두 원 등장
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① 전체집합 U와 A, B', cx, 22, WHITE, 14, t)
        // 전체집합 직사각형 테두리
        const uPad = 20
        gLine(cx - r1 - d / 2 - uPad, cy - r1 - uPad, cx + r1 + d / 2 + uPad, cy - r1 - uPad, WHITE, 1.5, t * 0.5)
        gLine(cx - r1 - d / 2 - uPad, cy + r1 + uPad, cx + r1 + d / 2 + uPad, cy + r1 + uPad, WHITE, 1.5, t * 0.5)
        gLine(cx - r1 - d / 2 - uPad, cy - r1 - uPad, cx - r1 - d / 2 - uPad, cy + r1 + uPad, WHITE, 1.5, t * 0.5)
        gLine(cx + r1 + d / 2 + uPad, cy - r1 - uPad, cx + r1 + d / 2 + uPad, cy + r1 + uPad, WHITE, 1.5, t * 0.5)
        gText('U', cx + r1 + d / 2 + uPad - 14, cy - r1 - uPad + 12, WHITE, 12, t * 0.6)
        // 두 원
        gCircle(ax, cy, r1, VIO, false, t)
        gCircle(bx, cy, r1, GRN, false, t)
        gText('A', ax - r1 * 0.55, cy - r1 - 10, VIO, 16, t)
        gText('B', bx + r1 * 0.55, cy - r1 - 10, GRN, 16, t)
      }

      // ② 교집합 표시
      if (p > 0.26) {
        const t = easeOutCubic(Math.min(1, (p - 0.26) / 0.2))
        gText('② 교집합 A∩B', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.32
        ctx.beginPath(); ctx.arc(ax, cy, r1, 0, Math.PI * 2); ctx.clip()
        ctx.beginPath(); ctx.arc(bx, cy, r1, 0, Math.PI * 2); ctx.fillStyle = AMBER; ctx.fill()
        ctx.restore()
        gText('A∩B', cx, cy, AMBER, 13, t)
        // 교집합 중심 마커
        gCircle(cx, cy, 5, AMBER, true, t)
        // 두 원 중심 연결선
        gLine(ax, cy, bx, cy, AMBER, 1.5, t * 0.5)
      }

      // ③ 합집합 표시
      if (p > 0.46) {
        const t = easeOutCubic(Math.min(1, (p - 0.46) / 0.2))
        gText('③ 합집합 A∪B', cx, 22, GRN, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.14
        ctx.fillStyle = GRN
        ctx.beginPath(); ctx.arc(ax, cy, r1, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(bx, cy, r1, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
        gText('A∪B', cx, cy + r1 + 18, GRN, 14, t)
        // 합집합 강조 테두리 원
        gCircle(cx, cy, r1 + d / 2 * 0.9, GRN, false, t * 0.3)
      }

      // ④ 여집합 표시
      if (p > 0.64) {
        const t = easeOutCubic(Math.min(1, (p - 0.64) / 0.2))
        gText('④ 여집합 Aᶜ', cx, 22, ORG, 14, t)
        gText('Aᶜ', ax - r1 - 18, cy, ORG, 16, t)
        gText('(A 바깥)', ax - r1 - 16, cy + 18, ORG, 10, t)
        // 여집합 방향 화살표
        gLine(ax - r1 - 4, cy, ax - r1 - 30, cy - 20, ORG, 1.5, t)
        gLine(ax - r1 - 30, cy - 20, ax - r1 - 38, cy - 16, ORG, 1.5, t)
        gLine(ax - r1 - 30, cy - 20, ax - r1 - 26, cy - 10, ORG, 1.5, t)
      }

      // ⑤ 차집합 + 결론
      if (p > 0.8) {
        const t = easeOutCubic(Math.min(1, (p - 0.8) / 0.18))
        gText('⑤ 차집합 A-B (A만)', cx, 22, MINT, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.25
        ctx.beginPath(); ctx.arc(ax, cy, r1, 0, Math.PI * 2)
        ctx.save(); ctx.beginPath(); ctx.arc(bx, cy, r1, 0, Math.PI * 2)
        ctx.restore()
        ctx.fillStyle = MINT
        // A 전체 채우고
        ctx.beginPath(); ctx.arc(ax, cy, r1, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
        // B 부분 지우기 (덮기)
        ctx.save(); ctx.globalAlpha = 1
        ctx.beginPath(); ctx.arc(bx, cy, r1, 0, Math.PI * 2); ctx.clip()
        ctx.clearRect(0, 0, W, H)
        ctx.restore()
        gText('A-B', ax - r1 * 0.5, cy, MINT, 13, t)
        gLine(cx - 110, H - 30, cx + 110, H - 30, MINT, 1, t * 0.4)
        gText('교·합·여·차 집합 완전정복', cx, H - 18, MINT, 13, t)
      }
      break
    }

    case 'proposition': {
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      // 4개 노드 위치: p(좌상), q(우상), ¬p(좌하), ¬q(우하)
      const nW = 52, nH = 28
      const pX = cx - 110, qX = cx + 110
      const topY = cy - 55, botY = cy + 45

      // ① p, q, ¬p, ¬q 노드 등장
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① 명제의 4가지 형태', cx, 22, WHITE, 14, t)
        // p 노드
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2; ctx.fillStyle = VIO + '33'
        ctx.fillRect(pX - nW / 2, topY - nH / 2, nW, nH); ctx.strokeRect(pX - nW / 2, topY - nH / 2, nW, nH); ctx.restore()
        gText('p', pX, topY, VIO, 16, t)
        // q 노드
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = GRN; ctx.lineWidth = 2; ctx.fillStyle = GRN + '33'
        ctx.fillRect(qX - nW / 2, topY - nH / 2, nW, nH); ctx.strokeRect(qX - nW / 2, topY - nH / 2, nW, nH); ctx.restore()
        gText('q', qX, topY, GRN, 16, t)
        // ¬p 노드
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.fillStyle = VIO + '22'
        ctx.fillRect(pX - nW / 2, botY - nH / 2, nW, nH); ctx.strokeRect(pX - nW / 2, botY - nH / 2, nW, nH); ctx.setLineDash([]); ctx.restore()
        gText('¬p', pX, botY, VIO, 15, t)
        // ¬q 노드
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = GRN; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.fillStyle = GRN + '22'
        ctx.fillRect(qX - nW / 2, botY - nH / 2, nW, nH); ctx.strokeRect(qX - nW / 2, botY - nH / 2, nW, nH); ctx.setLineDash([]); ctx.restore()
        gText('¬q', qX, botY, GRN, 15, t)
        // 노드 마커 원
        gCircle(pX, topY, 5, VIO, true, t * 0.7)
        gCircle(qX, topY, 5, GRN, true, t * 0.7)
        gCircle(pX, botY, 5, VIO, true, t * 0.5)
        gCircle(qX, botY, 5, GRN, true, t * 0.5)
      }

      // ② 원래 명제 p→q 화살표
      if (p > 0.22) {
        const t = easeOutCubic(Math.min(1, (p - 0.22) / 0.2))
        gText('② 원래 명제 p→q', cx, 22, VIO, 14, t)
        gLine(pX + nW / 2, topY, qX - nW / 2, topY, VIO, 2.5, t)
        gText('→(명제)', cx, topY - 14, VIO, 11, t)
      }

      // ③ 역 q→p
      if (p > 0.38) {
        const t = easeOutCubic(Math.min(1, (p - 0.38) / 0.2))
        gText('③ 역: q→p', cx, 22, GRN, 14, t)
        gLine(qX - nW / 2, topY + 8, pX + nW / 2, topY + 8, '#999', 2, t)
        gText('역', cx, topY + 18, '#999', 11, t)
      }

      // ④ 이/대우 화살표
      if (p > 0.54) {
        const t = easeOutCubic(Math.min(1, (p - 0.54) / 0.22))
        gText('④ 이: ¬p→¬q  대우: ¬q→¬p', cx, 22, ORG, 14, t)
        // 이: ¬p→¬q
        gLine(pX + nW / 2, botY, qX - nW / 2, botY, '#777', 2, t)
        gText('이', cx, botY - 12, '#777', 11, t)
        // 대우: ¬q→¬p
        gLine(qX - nW / 2, botY + 8, pX + nW / 2, botY + 8, ORG, 2.5, t)
        gText('대우', cx, botY + 18, ORG, 12, t)
        // 수직 연결선 (p↔¬p, q↔¬q)
        gLine(pX, topY + nH / 2, pX, botY - nH / 2, 'rgba(255,255,255,0.25)', 1.5, t)
        gLine(qX, topY + nH / 2, qX, botY - nH / 2, 'rgba(255,255,255,0.25)', 1.5, t)
      }

      // ⑤ 동치 관계 강조
      if (p > 0.74) {
        const t = easeOutCubic(Math.min(1, (p - 0.74) / 0.2))
        gText('⑤ 명제 ↔ 대우: 진리값 동일', cx, 22, MINT, 14, t)
        // 명제-대우 강조 대각선
        gLine(pX + nW / 2, topY, qX - nW / 2, botY + 8, MINT, 1.5, t * 0.4)
        gLine(qX - nW / 2, topY, pX + nW / 2, botY + 8, MINT, 1.5, t * 0.4)
        gText('대우의 진리값은 원래 명제와 같다', cx, H - 22, MINT, 14, t)
        gLine(cx - 130, H - 30, cx + 130, H - 30, MINT, 1, t * 0.4)
      }
      break
    }

    case 'function_h': {
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const setR = Math.min(48, (H - 80) / 4)
      const lx = cx - 115, rx = cx + 115
      const elems = ['1', '2', '3'], elemsY = [cy - 30, cy, cy + 30]
      const ymaps = ['a', 'b', 'c'], ymapY = [cy - 30, cy, cy + 30]

      // ① X, Y 집합 등장
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① 집합 X와 Y 설정', cx, 22, WHITE, 14, t)
        // 중앙 구분선
        gLine(cx, cy - setR * 1.6 - 4, cx, cy + setR * 1.6 + 4, 'rgba(255,255,255,0.12)', 1, t)
        // X 타원
        ctx.save(); ctx.globalAlpha = t * 0.1; ctx.fillStyle = VIO
        ctx.beginPath(); ctx.ellipse(lx, cy, setR, setR * 1.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2
        ctx.beginPath(); ctx.ellipse(lx, cy, setR, setR * 1.6, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore()
        gText('X', lx, cy - setR * 1.6 - 12, VIO, 16, t)
        // X 원소
        for (let i = 0; i < 3; i++) {
          gCircle(lx, elemsY[i], 5, VIO, true, t)
          gText(elems[i], lx - 18, elemsY[i], VIO, 12, t)
        }
        // Y 타원
        ctx.save(); ctx.globalAlpha = t * 0.1; ctx.fillStyle = GRN
        ctx.beginPath(); ctx.ellipse(rx, cy, setR, setR * 1.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = GRN; ctx.lineWidth = 2
        ctx.beginPath(); ctx.ellipse(rx, cy, setR, setR * 1.6, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore()
        gText('Y', rx, cy - setR * 1.6 - 12, GRN, 16, t)
        // Y 원소
        for (let i = 0; i < 3; i++) {
          gCircle(rx, ymapY[i], 5, GRN, true, t)
          gText(ymaps[i], rx + 18, ymapY[i], GRN, 12, t)
        }
      }

      // ② 대응 화살표 (각각 순서대로)
      if (p > 0.28) {
        const t = easeOutCubic(Math.min(1, (p - 0.28) / 0.22))
        gText('② 대응 화살표 연결', cx, 22, ORG, 14, t)
        for (let i = 0; i < 3; i++) {
          const delay = 0.28 + i * 0.06
          if (p < delay) continue
          const t2 = easeOutCubic(Math.min(1, (p - delay) / 0.14))
          gLine(lx + 8, elemsY[i], rx - 8, ymapY[i], ORG, 2, t2)
          // 화살표 머리
          gLine(rx - 8, ymapY[i], rx - 18, ymapY[i] - 5, ORG, 1.5, t2)
          gLine(rx - 8, ymapY[i], rx - 18, ymapY[i] + 5, ORG, 1.5, t2)
        }
        gText('f', cx, cy - 46, ORG, 14, t)
      }

      // ③ 함수 조건 강조
      if (p > 0.52) {
        const t = easeOutCubic(Math.min(1, (p - 0.52) / 0.2))
        gText('③ 함수 조건: x마다 y 하나', cx, 22, MINT, 14, t)
        // 각 X 원소 강조 원
        for (let i = 0; i < 3; i++) {
          gCircle(lx, elemsY[i], 10, MINT, false, t * 0.6)
        }
        gText('1:1 대응', cx, cy + 52, MINT, 13, t * 0.8)
      }

      // ④ 단사/전사 개념
      if (p > 0.66) {
        const t = easeOutCubic(Math.min(1, (p - 0.66) / 0.2))
        gText('④ 단사함수: 서로 다른 x → 다른 y', cx, 22, AMBER, 14, t)
        // 각 Y 원소 강조
        for (let i = 0; i < 3; i++) {
          gCircle(rx, ymapY[i], 10, AMBER, false, t * 0.6)
        }
        // f(x) 레이블
        gText('f(1)=a', cx, cy - 40, AMBER, 10, t)
        gText('f(2)=b', cx, cy - 4, AMBER, 10, t)
        gText('f(3)=c', cx, cy + 32, AMBER, 10, t)
      }

      // ⑤ 결론
      if (p > 0.82) {
        const t = easeOutCubic(Math.min(1, (p - 0.82) / 0.16))
        gText('⑤ 함수: 모든 x에 y 하나씩 대응', cx, 22, MINT, 14, t)
        gText('함수: 모든 x에 y가 하나씩 대응', cx, H - 22, MINT, 14, t)
        // 강조 언더라인
        gLine(cx - 115, H - 30, cx + 115, H - 30, MINT, 1.5, t * 0.5)
        gCircle(cx, H - 22, 80, MINT, false, t * 0.2)
      }
      break
    }

    // ══════════════════════════════════════════
    // H022~H029 — 함수·수열 Canvas 2D
    // ══════════════════════════════════════════

    case 'composite_func': {
      const cfx = v('x', 2)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const fx = cfx * 2 + 1  // f(x)=2x+1
      const gfx = fx * fx - 1 // g(y)=y²-1
      const boxW = 80, boxH = 40, gap = 60
      const y1 = cy - 10
      // ① x 입력 노드 → f 박스
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① x 입력 → f(x) 변환', cx, 22, VIO, 14, t)
        gCircle(cx - gap - boxW - 30, y1, 15, VIO, true, t)
        gText(`${r(cfx)}`, cx - gap - boxW - 30, y1, WHITE, 14, t)
        gLine(cx - gap - boxW - 14, y1, cx - gap - boxW - 2, y1, VIO, 2, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2; ctx.fillStyle = VIO + '22'
        ctx.fillRect(cx - gap - boxW, y1 - boxH / 2, boxW, boxH); ctx.strokeRect(cx - gap - boxW, y1 - boxH / 2, boxW, boxH); ctx.restore()
        gText('f', cx - gap - boxW / 2, y1, VIO, 18, t)
        // 파이프 화살표 선
        gLine(cx - gap, y1, cx - gap / 2 - 10, y1, VIO, 2, t)
        gLine(cx - gap / 2 - 10, y1 - 6, cx - gap / 2 + 2, y1, VIO, 2, t)
        gLine(cx - gap / 2 - 10, y1 + 6, cx - gap / 2 + 2, y1, VIO, 2, t)
        gCircle(cx - gap / 2 + 18, y1, 12, VIO, false, t)
        gText(`${r(fx)}`, cx - gap / 2 + 18, y1, VIO, 12, t)
      }
      // ② f(x) → g 박스 → 출력 노드
      if (p > 0.3) {
        const t = easeOutCubic(Math.min(1, (p - 0.3) / 0.25))
        gText('② f(x) → g → g(f(x)) 합성', cx, 22, GRN, 14, t)
        gLine(cx - gap / 2 + 30, y1, cx + gap / 2 - 2, y1, GRN, 2, t)
        // 파이프 화살표
        gLine(cx + gap / 2 - 12, y1 - 6, cx + gap / 2, y1, GRN, 2, t)
        gLine(cx + gap / 2 - 12, y1 + 6, cx + gap / 2, y1, GRN, 2, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = GRN; ctx.lineWidth = 2; ctx.fillStyle = GRN + '22'
        ctx.fillRect(cx + gap / 2, y1 - boxH / 2, boxW, boxH); ctx.strokeRect(cx + gap / 2, y1 - boxH / 2, boxW, boxH); ctx.restore()
        gText('g', cx + gap / 2 + boxW / 2, y1, GRN, 18, t)
        gLine(cx + gap / 2 + boxW, y1, cx + gap + boxW + 8, y1, GRN, 2, t)
        gCircle(cx + gap + boxW + 24, y1, 15, ORG, true, t)
        gText(`${r(gfx)}`, cx + gap + boxW + 24, y1, WHITE, 12, t)
      }
      // ③ 파이프라인 수식 표시
      if (p > 0.55) {
        const t = easeOutCubic(Math.min(1, (p - 0.55) / 0.18))
        gText('③ 파이프라인: 출력이 다음 입력', cx, y1 + 45, '#aaa', 13, t)
        gText(`f(x)=2x+1,  g(y)=y²−1`, cx, y1 + 68, '#777', 12, t)
        // 파이프 구분선
        gLine(cx - gap - boxW - 50, y1 + 30, cx + gap + boxW + 45, y1 + 30, 'rgba(255,255,255,0.08)', 1, t)
      }
      // ④ 결과 수식
      if (p > 0.72) {
        const t = easeOutCubic(Math.min(1, (p - 0.72) / 0.18))
        gText(`④ g(f(${r(cfx)})) = g(${r(fx)}) = ${r(gfx)}`, cx, y1 + 92, ORG, 15, t)
        // 입력→출력 전체 연결 화살표
        gLine(cx - gap - boxW - 50, y1 + 110, cx + gap + boxW + 50, y1 + 110, GRN, 1.5, t * 0.4)
        gCircle(cx - gap - boxW - 50, y1 + 110, 4, GRN, true, t)
        gCircle(cx + gap + boxW + 50, y1 + 110, 4, ORG, true, t)
      }
      // ⑤ 마무리
      if (p > 0.86) {
        const t = easeOutCubic(Math.min(1, (p - 0.86) / 0.12))
        gText('⑤ 합성함수: g∘f(x) = g(f(x))', cx, H - 22, MINT, 14, t)
      }
      break
    }

    case 'inverse_func': {
      const ifx = v('x', 2)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const fy = ifx * 2 + 1 // f(x)=2x+1
      const sc = 30, baseY = cy + 20
      // 좌표축
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.12)', 1, p)
      gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      // 눈금선 (tick marks)
      if (p > 0.01) {
        for (let i = -3; i <= 4; i++) {
          if (i === 0) continue
          gLine(cx + i * sc, baseY - 4, cx + i * sc, baseY + 4, 'rgba(255,255,255,0.25)', 1, p)
          gLine(cx - 4, baseY - i * sc * 0.4, cx + 4, baseY - i * sc * 0.4, 'rgba(255,255,255,0.25)', 1, p)
        }
      }
      // ① f 직선 그래프
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.22))
        gText('① f: x → y  (원함수)', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = VIO; ctx.beginPath()
        for (let x = -3; x <= 4; x += 0.1) { const y = 2 * x + 1; const sx = cx + x * sc, sy = baseY - y * sc * 0.4; if (sy < 25 || sy > H - 20) continue; if (x === -3) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        gText('f(x)=2x+1', W - 75, 50, VIO, 12, t)
        // 대표점 + 대칭 마커
        gCircle(cx + ifx * sc, baseY - fy * sc * 0.4, 6, VIO, true, t)
        gText(`(${r(ifx)},${r(fy)})`, cx + ifx * sc + 14, baseY - fy * sc * 0.4 - 12, VIO, 12, t)
        // 수직 보조선 (대칭 마커)
        gLine(cx + ifx * sc, baseY, cx + ifx * sc, baseY - fy * sc * 0.4, 'rgba(83,74,183,0.3)', 1, t)
        gLine(cx, baseY - fy * sc * 0.4, cx + ifx * sc, baseY - fy * sc * 0.4, 'rgba(83,74,183,0.3)', 1, t)
      }
      // ② 역함수 그래프
      if (p > 0.3) {
        const t = easeOutCubic(Math.min(1, (p - 0.3) / 0.25))
        gText('② 역함수 f⁻¹: y → x', cx, 22, GRN, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = GRN; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = GRN; ctx.beginPath()
        for (let y = -2; y <= 8; y += 0.1) { const x = (y - 1) / 2; const sx = cx + x * sc, sy = baseY - y * sc * 0.4; if (sy < 25 || sy > H - 20 || sx < 30) continue; if (y === -2) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        gText('f⁻¹(y)=(y−1)/2', 30, baseY - 5.5 * sc * 0.4, GRN, 12, t)
        // 역함수 대표점
        gCircle(cx + fy * sc * 0.65, baseY - ifx * sc * 0.65, 6, GRN, true, t)
        gText(`(${r(fy)},${r(ifx)})`, cx + fy * sc * 0.65 + 12, baseY - ifx * sc * 0.65 - 12, GRN, 12, t)
        // 대칭 연결선 (원점에서 두 점 잇기)
        gLine(cx + ifx * sc, baseY - fy * sc * 0.4, cx + fy * sc * 0.65, baseY - ifx * sc * 0.65, 'rgba(255,255,255,0.15)', 1.5, t)
      }
      // ③ y=x 대칭축 + 마커
      if (p > 0.55) {
        const t = easeOutCubic(Math.min(1, (p - 0.55) / 0.18))
        gText('③ y=x 대칭축 기준으로 반사', cx, 22, ORG, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.35; ctx.strokeStyle = '#aaa'; ctx.lineWidth = 1; ctx.setLineDash([6, 4])
        ctx.beginPath(); ctx.moveTo(cx - 3 * sc, baseY + 3 * sc * 0.4); ctx.lineTo(cx + 4 * sc, baseY - 4 * sc * 0.4); ctx.stroke(); ctx.restore()
        gText('y=x', cx + 4 * sc + 8, baseY - 4 * sc * 0.4, '#aaa', 11, t)
        // 대칭점 마커들
        gCircle(cx + 0 * sc, baseY - 1 * sc * 0.4, 4, '#aaa', false, t)
        gCircle(cx + 1 * sc, baseY - 3 * sc * 0.4, 4, '#aaa', false, t)
        gCircle(cx + 2 * sc, baseY - 5 * sc * 0.4, 4, '#aaa', false, t)
      }
      // ④ 대칭 관계 수식
      if (p > 0.73) {
        const t = easeOutCubic(Math.min(1, (p - 0.73) / 0.18))
        gText(`④ f(${r(ifx)})=${r(fy)} → f⁻¹(${r(fy)})=${r(ifx)}`, cx, H - 40, ORG, 13, t)
        // 좌우 마커 선
        gLine(cx - 100, H - 55, cx + 100, H - 55, 'rgba(255,255,255,0.08)', 1, t)
      }
      // ⑤ 마무리
      if (p > 0.86) {
        const t = easeOutCubic(Math.min(1, (p - 0.86) / 0.12))
        gText('⑤ 역함수: y=x 축 기준 반사', cx, H - 22, MINT, 14, t)
      }
      break
    }

    case 'rational_func': {
      const rk = v('k', 6)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 30, baseY = cy
      // 좌표축
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.15)', 1.5, p)
      gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.15)', 1.5, p)
      // 눈금 tick marks
      if (p > 0.01) {
        for (let i = -5; i <= 5; i++) {
          if (i === 0) continue
          gLine(cx + i * sc, baseY - 5, cx + i * sc, baseY + 5, 'rgba(255,255,255,0.2)', 1, p)
          gLine(cx - 5, baseY - i * sc * 0.5, cx + 5, baseY - i * sc * 0.5, 'rgba(255,255,255,0.2)', 1, p)
        }
      }
      // ① 좌표축 안내
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.12))
        gText('① y = k/x  유리함수 좌표계', cx, 22, WHITE, 14, t)
        gText('x', W - 30, baseY - 14, 'rgba(255,255,255,0.4)', 11, t)
        gText('y', cx + 8, 32, 'rgba(255,255,255,0.4)', 11, t)
      }
      // ② 쌍곡선 그래프
      if (p > 0.15) {
        const t = easeOutCubic(Math.min(1, (p - 0.15) / 0.3))
        gText(`② y = ${r(rk)}/x  쌍곡선`, cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 10; ctx.shadowColor = VIO
        // 1사분면
        ctx.beginPath(); let s1 = false
        for (let x = 0.3; x <= 8; x += 0.1) { const y = rk / x; const sx = cx + x * sc, sy = baseY - y * sc * 0.5; if (sy < 25 || sx > W - 30) continue; if (!s1) { ctx.moveTo(sx, sy); s1 = true } else ctx.lineTo(sx, sy) }
        ctx.stroke()
        // 3사분면
        ctx.beginPath(); let s2 = false
        for (let x = -8; x <= -0.3; x += 0.1) { const y = rk / x; const sx = cx + x * sc, sy = baseY - y * sc * 0.5; if (sy > H - 20 || sx < 30) continue; if (!s2) { ctx.moveTo(sx, sy); s2 = true } else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        // 곡선 위 대표점 (gCircle)
        const px1 = cx + 1 * sc, py1 = baseY - (rk / 1) * sc * 0.5
        const px2 = cx + 2 * sc, py2 = baseY - (rk / 2) * sc * 0.5
        if (py1 > 25 && py1 < H - 20) gCircle(px1, py1, 5, VIO, true, t)
        if (py2 > 25 && py2 < H - 20) gCircle(px2, py2, 5, VIO, false, t)
        gText(`(1,${r(rk)})`, px1 + 10, py1 - 10, VIO, 11, t)
        gText(`(2,${r(rk / 2)})`, px2 + 10, py2 - 10, VIO, 11, t)
      }
      // ③ 점근선 표시
      if (p > 0.5) {
        const t = easeOutCubic(Math.min(1, (p - 0.5) / 0.2))
        gText('③ x=0, y=0 점근선', cx, 22, ORG, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.55; ctx.strokeStyle = ORG; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4])
        ctx.beginPath(); ctx.moveTo(cx, 25); ctx.lineTo(cx, H - 20); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(30, baseY); ctx.lineTo(W - 30, baseY); ctx.stroke(); ctx.restore()
        gText('x=0', cx + 14, 40, ORG, 11, t)
        gText('y=0', W - 45, baseY - 14, ORG, 11, t)
        // 점근선 끝 마커
        gLine(cx - 5, 25, cx + 5, 25, ORG, 1.5, t)
        gLine(cx - 5, H - 20, cx + 5, H - 20, ORG, 1.5, t)
        gLine(30, baseY - 5, 30, baseY + 5, ORG, 1.5, t)
        gLine(W - 30, baseY - 5, W - 30, baseY + 5, ORG, 1.5, t)
      }
      // ④ 3사분면 대응점
      if (p > 0.68) {
        const t = easeOutCubic(Math.min(1, (p - 0.68) / 0.18))
        gText('④ 1·3사분면 대칭 배치', cx, 22, GRN, 14, t)
        const nx1 = cx - 1 * sc, ny1 = baseY - (rk / -1) * sc * 0.5
        const nx2 = cx - 2 * sc, ny2 = baseY - (rk / -2) * sc * 0.5
        if (ny1 < H - 20 && ny1 > 25) gCircle(nx1, ny1, 5, GRN, true, t)
        if (ny2 < H - 20 && ny2 > 25) gCircle(nx2, ny2, 5, GRN, false, t)
        gLine(cx + 1 * sc, baseY - (rk / 1) * sc * 0.5, nx1, ny1, 'rgba(255,255,255,0.08)', 1, t)
      }
      // ⑤ 마무리
      if (p > 0.84) {
        const t = easeOutCubic(Math.min(1, (p - 0.84) / 0.14))
        gText('⑤ 점근선에 가까이 가지만 닿지 않는다', cx, H - 22, MINT, 14, t)
      }
      break
    }

    case 'irrational_func': {
      const ia = v('a', 1)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 30, baseY = cy + 30, ox = cx - 60
      // 좌표축
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.12)', 1, p)
      gLine(ox, 30, ox, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      // 눈금 tick marks
      if (p > 0.01) {
        for (let i = 1; i <= 7; i++) {
          gLine(ox + i * sc, baseY - 4, ox + i * sc, baseY + 4, 'rgba(255,255,255,0.2)', 1, p)
        }
        for (let i = 1; i <= 4; i++) {
          gLine(ox - 4, baseY - i * sc, ox + 4, baseY - i * sc, 'rgba(255,255,255,0.2)', 1, p)
        }
      }
      // ① 루트 그래프
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.25))
        gText('① y = √(ax)  무리함수', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 10; ctx.shadowColor = VIO; ctx.beginPath()
        let s = false
        for (let x = 0; x <= 8; x += 0.05) { const y = Math.sqrt(ia * x); const sx = ox + x * sc, sy = baseY - y * sc; if (sy < 25 || sx > W - 30) continue; if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        // 주요 점
        gCircle(ox, baseY, 6, VIO, true, t)
        gText('(0,0)', ox + 10, baseY - 14, VIO, 11, t)
        const kx1 = 1, ky1 = Math.sqrt(ia * kx1)
        gCircle(ox + kx1 * sc, baseY - ky1 * sc, 5, VIO, true, t)
        gText(`(1,${r(ky1)})`, ox + kx1 * sc + 8, baseY - ky1 * sc - 12, VIO, 11, t)
      }
      // ② 정의역 경계: x<0 빗금
      if (p > 0.3) {
        const t = easeOutCubic(Math.min(1, (p - 0.3) / 0.22))
        gText('② 정의역 경계: x ≥ 0', cx, 22, ORG, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.18; ctx.fillStyle = ORG
        ctx.fillRect(30, 30, ox - 30, H - 50); ctx.restore()
        // 경계선 마커
        gLine(ox, 30, ox, H - 20, ORG, 2, t * 0.6)
        gText('정의 불가', ox - 42, cy, ORG, 12, t)
        gText('x < 0', ox - 30, cy + 20, ORG, 11, t)
        // 경계 tick
        gLine(ox - 6, baseY, ox + 6, baseY, ORG, 2.5, t)
        gCircle(ox, baseY, 7, ORG, false, t)
      }
      // ③ 포물선 대칭 (y=x²의 역함수)
      if (p > 0.55) {
        const t = easeOutCubic(Math.min(1, (p - 0.55) / 0.2))
        gText('③ y²=ax  포물선과 역관계', cx, 22, GRN, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.35; ctx.strokeStyle = GRN; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath()
        let s2 = false
        for (let x = 0; x <= 6; x += 0.05) { const y = x * x / Math.max(0.1, ia); const sx = ox + x * sc, sy = baseY - y * sc * 0.18; if (sy < 25 || sx > W - 30) continue; if (!s2) { ctx.moveTo(sx, sy); s2 = true } else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        // 대응점
        const px4 = 2, py4 = Math.sqrt(ia * px4)
        gCircle(ox + px4 * sc, baseY - py4 * sc, 5, GRN, false, t)
        gText(`(${px4},${r(py4)})`, ox + px4 * sc + 8, baseY - py4 * sc - 10, GRN, 11, t)
      }
      // ④ a 값에 따른 변화
      if (p > 0.73) {
        const t = easeOutCubic(Math.min(1, (p - 0.73) / 0.18))
        gText(`④ a=${r(ia)} 변수 → 기울기 변화`, cx, 22, '#aaa', 13, t)
        const px3 = 4, py3 = Math.sqrt(ia * px3)
        gCircle(ox + px3 * sc, baseY - py3 * sc, 5, '#aaa', true, t)
        gLine(ox + px3 * sc, baseY, ox + px3 * sc, baseY - py3 * sc, 'rgba(255,255,255,0.15)', 1, t)
      }
      // ⑤ 마무리
      if (p > 0.87) {
        const t = easeOutCubic(Math.min(1, (p - 0.87) / 0.12))
        gText('⑤ 무리함수 정의역: x ≥ 0  (음수 제곱근 불가)', cx, H - 22, MINT, 13, t)
      }
      break
    }

    case 'arithmetic_sum': {
      const asn = Math.max(2, Math.min(10, Math.round(v('n', 5))))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const barW = Math.min(35, (W - 60) / asn - 4), maxBH = H - 90, baseY = H - 50
      const ox = cx - asn * (barW + 4) / 2
      // ① 오름차순 막대 + 윤곽선
      for (let i = 0; i < asn; i++) {
        const val = i + 1, bh = (val / asn) * maxBH * 0.42
        const delay = 0.02 + i * (0.22 / asn)
        if (p < delay) continue
        const t = easeOutCubic(Math.min(1, (p - delay) / 0.1))
        const x = ox + i * (barW + 4)
        ctx.save(); ctx.globalAlpha = t * 0.5; ctx.fillStyle = VIO; ctx.fillRect(x, baseY - bh * t, barW, bh * t); ctx.restore()
        // 막대 윤곽선 (gLine 4변)
        gLine(x, baseY, x, baseY - bh * t, VIO, 1.5, t)
        gLine(x + barW, baseY, x + barW, baseY - bh * t, VIO, 1.5, t)
        gLine(x, baseY - bh * t, x + barW, baseY - bh * t, VIO, 1.5, t)
        gLine(x, baseY, x + barW, baseY, VIO, 1, t * 0.4)
        // 상단 모서리 gCircle
        gCircle(x + barW / 2, baseY - bh * t, 3, VIO, true, t)
        gText(String(val), x + barW / 2, baseY + 12, 'rgba(255,255,255,0.5)', 10, t)
      }
      if (p > 0.05) gText('① 1 + 2 + ... + n  막대 시각화', cx, 22, VIO, 14, easeOutCubic(Math.min(1, (p - 0.05) / 0.1)))
      // ② 뒤집은 막대 겹치기
      if (p > 0.32) {
        const t = easeOutCubic(Math.min(1, (p - 0.32) / 0.2))
        gText('② 뒤집어서 겹치면 n+1 높이', cx, 22, GRN, 14, t)
        for (let i = 0; i < asn; i++) {
          const val = asn - i, bh = (val / asn) * maxBH * 0.42
          const origBh = ((i + 1) / asn) * maxBH * 0.42
          const x = ox + i * (barW + 4)
          ctx.save(); ctx.globalAlpha = t * 0.35; ctx.fillStyle = GRN
          ctx.fillRect(x, baseY - origBh - bh * t, barW, bh * t); ctx.restore()
          // 위쪽 모서리 마커
          gCircle(x, baseY - origBh - bh * t, 3, GRN, true, t * 0.6)
        }
      }
      // ③ 직사각형 테두리
      if (p > 0.56) {
        const t = easeOutCubic(Math.min(1, (p - 0.56) / 0.16))
        gText('③ 전체 직사각형 = n×(n+1)', cx, 22, ORG, 14, t)
        const totalH = maxBH * 0.42 + maxBH * 0.42
        const rx = ox - 2, rw = asn * (barW + 4)
        // 직사각형 4변
        gLine(rx, baseY - totalH, rx + rw, baseY - totalH, ORG, 2, t)
        gLine(rx, baseY, rx + rw, baseY, ORG, 2, t)
        gLine(rx, baseY - totalH, rx, baseY, ORG, 2, t)
        gLine(rx + rw, baseY - totalH, rx + rw, baseY, ORG, 2, t)
        // 네 모서리 gCircle
        gCircle(rx, baseY - totalH, 5, ORG, true, t)
        gCircle(rx + rw, baseY - totalH, 5, ORG, true, t)
        gText(`폭=${asn}`, rx + rw / 2, baseY - totalH - 14, ORG, 12, t)
        gText(`높이=${asn + 1}`, rx + rw + 12, baseY - totalH / 2, ORG, 12, t)
      }
      // ④ 절반 수식
      if (p > 0.73) {
        const t = easeOutCubic(Math.min(1, (p - 0.73) / 0.18))
        const total = asn * (asn + 1) / 2
        gText(`④ S = n(n+1)/2 = ${asn}×${asn + 1}/2 = ${total}`, cx, baseY + 28, MINT, 15, t)
        // 구분선
        gLine(cx - 120, baseY + 18, cx + 120, baseY + 18, 'rgba(255,255,255,0.1)', 1, t)
      }
      // ⑤ 마무리
      if (p > 0.87) {
        const t = easeOutCubic(Math.min(1, (p - 0.87) / 0.12))
        gText('⑤ 가우스 공식: 쌍으로 합이 n+1', cx, H - 22, MINT, 13, t)
      }
      break
    }

    case 'geometric_sum': {
      const gr = Math.max(0.1, Math.min(0.9, v('r', 0.5)))
      const gn = Math.max(2, Math.min(10, Math.round(v('n', 6))))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const maxW = W - 80, baseY = cy + 10
      const total = (1 - Math.pow(gr, gn)) / (1 - gr)
      const limit = 1 / (1 - gr)
      const blockH = 28
      // ① 블록 쌓기 + 모서리 마커
      let cumX = 40
      for (let i = 0; i < gn; i++) {
        const w = Math.pow(gr, i) / limit * maxW
        const delay = 0.02 + i * (0.45 / gn)
        if (p < delay) { cumX += w + 2; continue }
        const t = easeOutCubic(Math.min(1, (p - delay) / 0.12))
        ctx.save(); ctx.globalAlpha = t * 0.5; ctx.fillStyle = i === 0 ? VIO : GRN
        ctx.fillRect(cumX, baseY - blockH, w * t, blockH); ctx.restore()
        // 블록 4변 윤곽선
        const col = i === 0 ? VIO : GRN
        gLine(cumX, baseY - blockH, cumX + w * t, baseY - blockH, col, 1.5, t)
        gLine(cumX, baseY, cumX + w * t, baseY, col, 1, t * 0.4)
        gLine(cumX, baseY - blockH, cumX, baseY, col, 1.5, t)
        gLine(cumX + w * t, baseY - blockH, cumX + w * t, baseY, col, 1.5, t)
        // 블록 상단 모서리 gCircle
        gCircle(cumX, baseY - blockH, 3, col, true, t)
        gCircle(cumX + w * t, baseY - blockH, 3, col, true, t)
        if (w > 18) gText(`r^${i}`, cumX + w / 2, baseY - blockH / 2, WHITE, 9, t)
        cumX += w * t + 2
      }
      if (p > 0.05) gText(`① 등비수열 블록: 1 + ${gr} + ${r(gr * gr)} + ...`, cx, 22, VIO, 14, easeOutCubic(Math.min(1, (p - 0.05) / 0.1)))
      // ② 수렴 마커 선
      if (p > 0.55) {
        const t = easeOutCubic(Math.min(1, (p - 0.55) / 0.2))
        gText('② 수렴값에 가까워진다', cx, 22, ORG, 14, t)
        const limX = 40 + maxW
        gLine(limX, baseY - blockH - 25, limX, baseY + 15, ORG, 2, t)
        // 수렴 마커 tick들
        gLine(limX - 6, baseY - blockH - 25, limX + 6, baseY - blockH - 25, ORG, 2, t)
        gLine(limX - 6, baseY + 15, limX + 6, baseY + 15, ORG, 1.5, t)
        gCircle(limX, baseY - blockH / 2, 5, ORG, true, t)
        gText(`수렴값 = ${r(limit)}`, limX + 12, baseY - 18, ORG, 13, t)
        gText(`n항 합 = ${r(total)}`, cx, baseY + 28, GRN, 14, t)
      }
      // ③ 남은 거리 마커
      if (p > 0.7) {
        const t = easeOutCubic(Math.min(1, (p - 0.7) / 0.18))
        gText('③ 나머지 = 수렴값 − 현재 합', cx, 22, '#aaa', 13, t)
        const remainW = (limit - total) / limit * maxW
        const limX = 40 + maxW
        gLine(limX - remainW, baseY - blockH, limX, baseY - blockH, '#aaa', 1.5, t * 0.5)
        gCircle(limX - remainW, baseY - blockH, 4, '#aaa', false, t)
        gText(`차이: ${r(limit - total)}`, limX - remainW / 2, baseY - blockH - 14, '#aaa', 11, t)
      }
      // ④ 공식
      if (p > 0.82) {
        const t = easeOutCubic(Math.min(1, (p - 0.82) / 0.15))
        gText(`④ S = (1−r^n)/(1−r) = ${r(total)}`, cx, baseY + 48, MINT, 14, t)
        gLine(cx - 130, baseY + 38, cx + 130, baseY + 38, 'rgba(255,255,255,0.08)', 1, t)
      }
      // ⑤ 마무리
      if (p > 0.92) {
        const t = easeOutCubic(Math.min(1, (p - 0.92) / 0.08))
        gText('⑤ |r|<1 이면 무한합도 수렴한다', cx, H - 22, MINT, 13, t)
      }
      break
    }

    // ══════════════════════════════════════════
    // H033~H044 — 삼각·극한·연속 Canvas 2D
    // ══════════════════════════════════════════

    case 'exp_log_eq': {
      const elBase = Math.max(1.1, v('base', 2)), elTarget = Math.max(0.5, v('target', 8))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 28, baseY = cy + 20, ox = cx - 80
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.12)', 1, p)
      gLine(ox, 30, ox, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      const sol = Math.log(elTarget) / Math.log(elBase)
      // 눈금
      if (p > 0.01) {
        for (let i = -2; i <= 5; i++) {
          gLine(ox + i * sc, baseY - 4, ox + i * sc, baseY + 4, 'rgba(255,255,255,0.2)', 1, p)
        }
      }
      // ① 지수곡선
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.25))
        gText(`① y = ${r(elBase)}^x  지수함수`, cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = VIO; ctx.beginPath()
        let s = false
        for (let x = -3; x <= 6; x += 0.1) { const y = Math.pow(elBase, x); const sx = ox + x * sc, sy = baseY - y * 3; if (sy < 25 || sy > H - 20 || sx < 30 || sx > W - 30) { s = false; continue }; if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        // y=1 대표점 (x=0)
        gCircle(ox, baseY - 1 * 3, 5, VIO, true, t)
        gText('(0,1)', ox + 10, baseY - 1 * 3 - 12, VIO, 11, t)
        gText(`y=${r(elBase)}^x`, ox + 1 * sc + 8, baseY - Math.pow(elBase, 1) * 3 - 12, VIO, 12, t)
      }
      // ② y=target 수평선 + 마커
      if (p > 0.3) {
        const t = easeOutCubic(Math.min(1, (p - 0.3) / 0.18))
        gText(`② y = ${r(elTarget)}  수평선`, cx, 22, GRN, 14, t)
        const ty = baseY - elTarget * 3
        if (ty > 25) {
          gLine(30, ty, W - 30, ty, GRN, 2, t * 0.6)
          // 수평선 양끝 마커
          gLine(30, ty - 5, 30, ty + 5, GRN, 2, t)
          gLine(W - 30, ty - 5, W - 30, ty + 5, GRN, 2, t)
          gText(`y=${r(elTarget)}`, 34, ty - 10, GRN, 11, t)
        }
      }
      // ③ 교점 + 수직·수평 보조선
      if (p > 0.5) {
        const t = easeOutCubic(Math.min(1, (p - 0.5) / 0.2))
        gText('③ 교점에서 해(解) 도출', cx, 22, ORG, 14, t)
        const sx = ox + sol * sc, sy = baseY - elTarget * 3
        if (sy > 25 && sy < H - 20) {
          gCircle(sx, sy, 7, ORG, true, t)
          gText(`x = ${r(sol)}`, sx + 12, sy - 16, ORG, 14, t)
          // 수직 마커선
          gLine(sx, sy, sx, baseY, 'rgba(217,90,48,0.35)', 1.5, t)
          gLine(sx - 5, baseY, sx + 5, baseY, ORG, 2, t)
          // 수평 마커선
          gLine(sx, sy, ox, sy, 'rgba(217,90,48,0.35)', 1.5, t)
          gCircle(ox, sy, 4, ORG, false, t)
        }
      }
      // ④ 로그 변환
      if (p > 0.7) {
        const t = easeOutCubic(Math.min(1, (p - 0.7) / 0.2))
        gText(`④ log 변환: x = log_${r(elBase)}(${r(elTarget)})`, cx, H - 40, GRN, 13, t)
        gLine(cx - 130, H - 50, cx + 130, H - 50, 'rgba(255,255,255,0.08)', 1, t)
      }
      // ⑤ 마무리
      if (p > 0.85) {
        const t = easeOutCubic(Math.min(1, (p - 0.85) / 0.13))
        gText(`⑤ ${r(elBase)}^x = ${r(elTarget)}  → x = ${r(sol)}`, cx, H - 22, MINT, 14, t)
      }
      break
    }

    case 'trig_addition': {
      const taA = v('A', 30), taB = v('B', 45)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const aRad = taA * Math.PI / 180, bRad = taB * Math.PI / 180, abRad = aRad + bRad
      const rr = Math.min(70, Math.min(W, H) / 3), ocx = cx - 60
      // 단위원 + 축
      gCircle(ocx, cy, rr, 'rgba(255,255,255,0.15)', false, p)
      gLine(ocx - rr - 10, cy, ocx + rr + 10, cy, 'rgba(255,255,255,0.1)', 1, p)
      gLine(ocx, cy - rr - 10, ocx, cy + rr + 10, 'rgba(255,255,255,0.1)', 1, p)
      // 단위원 위 기준점
      gCircle(ocx + rr, cy, 4, 'rgba(255,255,255,0.3)', true, p)
      // ① 각 A 반지름 선 + 호
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① 단위원 위 각 A, A+B 표시', cx, 22, VIO, 14, t)
        const pax = ocx + Math.cos(aRad) * rr, pay = cy - Math.sin(aRad) * rr
        gLine(ocx, cy, pax, pay, VIO, 2.5, t)
        gCircle(pax, pay, 5, VIO, true, t)
        gText(`A=${Math.round(taA)}°`, pax + 10, pay - 10, VIO, 12, t)
        // 각 A 호
        ctx.save(); ctx.globalAlpha = t * 0.5; ctx.strokeStyle = VIO; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(ocx, cy, rr * 0.35, 0, -aRad, true); ctx.stroke(); ctx.restore()
      }
      // ② 각 A+B 반지름 + sin 높이선
      if (p > 0.28) {
        const t = easeOutCubic(Math.min(1, (p - 0.28) / 0.22))
        gText('② 각 A+B  반지름 추가', cx, 22, GRN, 14, t)
        const pbx = ocx + Math.cos(abRad) * rr, pby = cy - Math.sin(abRad) * rr
        gLine(ocx, cy, pbx, pby, GRN, 2.5, t)
        gCircle(pbx, pby, 5, GRN, true, t)
        gText(`A+B=${Math.round(taA + taB)}°`, pbx + 8, pby - 12, GRN, 12, t)
        // 각 B 호 (A에서 A+B까지)
        ctx.save(); ctx.globalAlpha = t * 0.5; ctx.strokeStyle = GRN; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(ocx, cy, rr * 0.45, -aRad, -abRad, true); ctx.stroke(); ctx.restore()
      }
      // ③ sin(A+B) 높이 + cos(A+B) 폭 마커
      if (p > 0.5) {
        const t = easeOutCubic(Math.min(1, (p - 0.5) / 0.2))
        gText('③ sin(A+B) 높이, cos 폭 분리', cx, 22, ORG, 14, t)
        const sinAB = Math.sin(abRad), cosAB = Math.cos(abRad)
        const px = ocx + cosAB * rr, py = cy - sinAB * rr
        // 수직 높이 마커
        gLine(px, cy, px, py, ORG, 2, t * 0.8)
        gLine(px - 5, cy, px + 5, cy, ORG, 2, t)
        gLine(px - 5, py, px + 5, py, ORG, 2, t)
        // 수평 폭 마커
        gLine(ocx, py, px, py, 'rgba(217,90,48,0.4)', 1.5, t)
        gText(`sin(A+B)=${r(sinAB)}`, cx + 55, cy - 35, ORG, 13, t)
        gText(`cos(A+B)=${r(cosAB)}`, cx + 55, cy - 15, ORG, 12, t)
      }
      // ④ 각 항 분리
      if (p > 0.7) {
        const t = easeOutCubic(Math.min(1, (p - 0.7) / 0.18))
        gText('④ 항별 분리 검증', cx, 22, '#bbb', 13, t)
        const sAcB = Math.sin(aRad) * Math.cos(bRad)
        const cAsB = Math.cos(aRad) * Math.sin(bRad)
        gText(`sinA·cosB = ${r(sAcB)}`, cx + 55, cy + 10, VIO, 13, t)
        gText(`cosA·sinB = ${r(cAsB)}`, cx + 55, cy + 30, GRN, 13, t)
        gLine(cx + 55, cy + 40, cx + 55 + 100, cy + 40, 'rgba(255,255,255,0.15)', 1, t)
        gText(`합 = ${r(sAcB + cAsB)}`, cx + 55, cy + 52, ORG, 13, t)
      }
      // ⑤ 공식
      if (p > 0.86) {
        const t = easeOutCubic(Math.min(1, (p - 0.86) / 0.12))
        gText('⑤ sin(A+B) = sinAcosB + cosAsinB', cx, H - 22, MINT, 14, t)
      }
      break
    }

    case 'sine_rule': {
      const srA = Math.max(20, Math.min(80, v('A', 50)))
      const srB = Math.max(20, Math.min(80, v('B', 60)))
      const srC = 180 - srA - srB
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const aR = srA * Math.PI / 180, bR = srB * Math.PI / 180, cR = srC * Math.PI / 180
      // 사인법칙으로 변 계산
      const scale2R = 110
      const a = Math.sin(aR) * scale2R, b = Math.sin(bR) * scale2R, c = Math.sin(cR) * scale2R
      const R = scale2R / 2
      // 삼각형 꼭짓점
      const Px = cx - c / 2, Py = cy + 35
      const Qx = cx + c / 2, Qy = cy + 35
      const Rx = Px + b * Math.cos(aR), Ry = Py - b * Math.sin(aR)
      // 외접원 중심 계산
      const mx = (Px + Qx + Rx) / 3, my = (Py + Qy + Ry) / 3
      // ① 삼각형 변 + 꼭짓점 마커
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.25))
        gText('① 삼각형 + 꼭짓점 표시', cx, 22, WHITE, 14, t)
        gLine(Px, Py, Qx, Qy, WHITE, 2.5, t)
        gLine(Qx, Qy, Rx, Ry, WHITE, 2.5, t)
        gLine(Rx, Ry, Px, Py, WHITE, 2.5, t)
        // 꼭짓점 gCircle
        gCircle(Px, Py, 5, WHITE, true, t)
        gCircle(Qx, Qy, 5, WHITE, true, t)
        gCircle(Rx, Ry, 5, WHITE, true, t)
        gText('P', Px - 16, Py + 4, WHITE, 12, t)
        gText('Q', Qx + 8, Qy + 4, WHITE, 12, t)
        gText('R', Rx + 6, Ry - 12, WHITE, 12, t)
      }
      // ② 외접원 + 반지름선
      if (p > 0.28) {
        const t = easeOutCubic(Math.min(1, (p - 0.28) / 0.25))
        gText('② 외접원 반지름 R 표시', cx, 22, VIO, 14, t)
        gCircle(cx, cy, R, 'rgba(83,74,183,0.2)', false, t)
        gCircle(cx, cy, 4, VIO, true, t)
        // 반지름선 3개
        gLine(cx, cy, Px, Py, VIO, 1.5, t * 0.6)
        gLine(cx, cy, Qx, Qy, VIO, 1.5, t * 0.6)
        gLine(cx, cy, Rx, Ry, VIO, 1.5, t * 0.6)
        gText('R', cx + 8, cy - R / 2, VIO, 12, t)
      }
      // ③ a/sinA 비율 표시
      if (p > 0.52) {
        const t = easeOutCubic(Math.min(1, (p - 0.52) / 0.2))
        gText('③ a/sinA = 2R  비율 계산', cx, 22, ORG, 14, t)
        gText(`a = ${r(a)}`, Px - 20, (Py + Qy) / 2 + 16, ORG, 12, t)
        gText(`a/sinA = ${r(a / Math.sin(aR))}`, cx - 90, H - 54, VIO, 13, t)
        // 대변 a 강조 마커
        gLine(Px - 3, Py, Qx + 3, Qy, ORG, 3.5, t * 0.4)
        gCircle((Px + Qx) / 2, Py, 4, ORG, true, t)
      }
      // ④ b/sinB 비율
      if (p > 0.68) {
        const t = easeOutCubic(Math.min(1, (p - 0.68) / 0.18))
        gText('④ b/sinB 동일 비율 확인', cx, 22, GRN, 14, t)
        gText(`b = ${r(b)}`, (Px + Rx) / 2 - 35, (Py + Ry) / 2, GRN, 12, t)
        gText(`b/sinB = ${r(b / Math.sin(bR))}`, cx + 40, H - 54, GRN, 13, t)
        gCircle((Qx + Rx) / 2, (Qy + Ry) / 2, 4, GRN, true, t)
        // 구분선
        gLine(cx - 5, H - 54, cx + 5, H - 54, 'rgba(255,255,255,0.2)', 1.5, t)
      }
      // ⑤ 최종 공식
      if (p > 0.84) {
        const t = easeOutCubic(Math.min(1, (p - 0.84) / 0.14))
        gText(`⑤ a/sinA = b/sinB = 2R = ${r(scale2R)}`, cx, H - 22, MINT, 14, t)
      }
      break
    }

    case 'cosine_rule': {
      const crA = v('a', 5), crB = v('b', 6), crAngle = Math.max(10, Math.min(170, v('A', 60)))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const angRad = crAngle * Math.PI / 180
      const crC2 = crA * crA + crB * crB - 2 * crA * crB * Math.cos(angRad)
      const crC = Math.sqrt(Math.max(0, crC2))
      const sc2 = Math.min(18, Math.min(W - 80, H - 80) / Math.max(crA, crB, crC) / 2)
      // 삼각형 꼭짓점
      const Ax = cx - crB * sc2 / 2, Ay = cy + 20
      const Bx = Ax + crB * sc2, By = Ay
      const Cx = Ax + crA * sc2 * Math.cos(angRad), Cy = Ay - crA * sc2 * Math.sin(angRad)
      // ① 삼각형 변 + 꼭짓점 gCircle
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.25))
        gText('① 삼각형 세 변 표시', cx, 22, WHITE, 14, t)
        gLine(Ax, Ay, Bx, By, VIO, 2.5, t)
        gLine(Ax, Ay, Cx, Cy, GRN, 2.5, t)
        gLine(Bx, By, Cx, Cy, ORG, 2.5, t)
        gText(`b=${r(crB)}`, (Ax + Bx) / 2, Ay + 18, VIO, 12, t)
        gText(`a=${r(crA)}`, (Ax + Cx) / 2 - 22, (Ay + Cy) / 2, GRN, 12, t)
        gText(`c=${r(crC)}`, (Bx + Cx) / 2 + 14, (By + Cy) / 2, ORG, 12, t)
        // 꼭짓점 gCircle
        gCircle(Ax, Ay, 6, VIO, true, t)
        gCircle(Bx, By, 6, VIO, true, t)
        gCircle(Cx, Cy, 6, GRN, true, t)
        gText('A', Ax - 14, Ay + 4, WHITE, 12, t)
        gText('B', Bx + 8, By + 4, WHITE, 12, t)
        gText('C', Cx + 6, Cy - 14, WHITE, 12, t)
      }
      // ② 각도 A 마커 + 보정항
      if (p > 0.3) {
        const t = easeOutCubic(Math.min(1, (p - 0.3) / 0.22))
        gText(`② 각 A=${Math.round(crAngle)}°  각도 마커`, cx, 22, AMBER, 14, t)
        // 각도 호
        ctx.save(); ctx.globalAlpha = t * 0.6; ctx.strokeStyle = AMBER; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(Ax, Ay, 22, -angRad, 0, true); ctx.stroke(); ctx.restore()
        gText(`${Math.round(crAngle)}°`, Ax + 26, Ay - 10, AMBER, 12, t)
        const correction = -2 * crA * crB * Math.cos(angRad)
        if (Math.abs(crAngle - 90) < 2) {
          gText('A=90° → 피타고라스!', cx, cy - 55, GRN, 14, t)
        } else {
          gText(`보정항: −2ab·cosA = ${r(correction)}`, cx, cy - 55, ORG, 13, t)
        }
      }
      // ③ 정사각형 시각화 (a², b² 면적 암시)
      if (p > 0.52) {
        const t = easeOutCubic(Math.min(1, (p - 0.52) / 0.2))
        gText('③ a², b² 면적 개념', cx, 22, '#aaa', 13, t)
        const sqA = crA * sc2, sqB = crB * sc2
        // a² 정사각형 윤곽
        gLine(Ax - sqA, Ay, Ax, Ay, GRN, 1.5, t * 0.5)
        gLine(Ax - sqA, Ay, Ax - sqA, Ay - sqA, GRN, 1.5, t * 0.5)
        gLine(Ax - sqA, Ay - sqA, Ax, Ay - sqA, GRN, 1.5, t * 0.5)
        gLine(Ax, Ay, Ax, Ay - sqA, GRN, 1.5, t * 0.5)
        gCircle(Ax - sqA / 2, Ay - sqA / 2, 3, GRN, true, t * 0.5)
        gText(`a²=${r(crA * crA)}`, Ax - sqA / 2, Ay - sqA / 2, GRN, 10, t * 0.5)
      }
      // ④ 코사인 법칙 계산
      if (p > 0.7) {
        const t = easeOutCubic(Math.min(1, (p - 0.7) / 0.18))
        gText('④ 코사인 법칙으로 c 계산', cx, 22, MINT, 13, t)
        gText(`c² = ${r(crA)}²+${r(crB)}²−2·${r(crA)}·${r(crB)}·cos${Math.round(crAngle)}°`, cx, H - 55, MINT, 12, t)
        gText(`c² = ${r(crC2)}  →  c = ${r(crC)}`, cx, H - 38, MINT, 14, t)
        gLine(cx - 140, H - 62, cx + 140, H - 62, 'rgba(255,255,255,0.1)', 1, t)
      }
      // ⑤ 피타고라스 일반화
      if (p > 0.86) {
        const t = easeOutCubic(Math.min(1, (p - 0.86) / 0.12))
        gText('⑤ 코사인 법칙 = 피타고라스의 일반화', cx, H - 22, MINT, 13, t)
      }
      break
    }

    case 'dot_product': {
      const dpax = v('ax', 3), dpay = v('ay', 2), dpbx = v('bx', 1), dpby = v('by', 3)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 30
      const dot = dpax * dpbx + dpay * dpby
      const magA = Math.sqrt(dpax * dpax + dpay * dpay), magB = Math.sqrt(dpbx * dpbx + dpby * dpby)
      const cosTheta = magA > 0 && magB > 0 ? dot / (magA * magB) : 0
      const theta = Math.acos(Math.max(-1, Math.min(1, cosTheta))) * 180 / Math.PI
      // 좌표축
      gLine(30, cy, W - 30, cy, 'rgba(255,255,255,0.12)', 1, p)
      gLine(cx, 20, cx, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      // ① 벡터 + 사이각
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① 두 벡터 그리기', cx, 22, WHITE, 14, t)
        gLine(cx, cy, cx + dpax * sc, cy - dpay * sc, VIO, 3, t)
        gText(`a(${r(dpax)},${r(dpay)})`, cx + dpax * sc + 12, cy - dpay * sc, VIO, 12, t)
        gLine(cx, cy, cx + dpbx * sc, cy - dpby * sc, GRN, 3, t)
        gText(`b(${r(dpbx)},${r(dpby)})`, cx + dpbx * sc + 12, cy - dpby * sc, GRN, 12, t)
        // 벡터 끝 원
        gCircle(cx + dpax * sc, cy - dpay * sc, 5, VIO, true, t)
        gCircle(cx + dpbx * sc, cy - dpby * sc, 5, GRN, true, t)
        gCircle(cx, cy, 5, WHITE, true, t)
      }
      // ② 사이각 호 + 사영선
      if (p > 0.22) {
        const t = easeOutCubic(Math.min(1, (p - 0.22) / 0.2))
        gText('② 사이각 θ와 사영', cx, 22, ORG, 14, t)
        const angA = Math.atan2(-dpay, dpax), angB = Math.atan2(-dpby, dpbx)
        ctx.save(); ctx.globalAlpha = t * 0.7; ctx.strokeStyle = ORG; ctx.lineWidth = 1.5; ctx.beginPath()
        ctx.arc(cx, cy, 22, Math.min(angA, angB), Math.max(angA, angB)); ctx.stroke(); ctx.restore()
        gText(`θ=${Math.round(theta)}°`, cx + 28, cy - 14, ORG, 12, t)
        // 사영선 (a → b 방향 투영)
        const projLen = (dot / (magB * magB)) * sc
        gLine(cx, cy, cx + dpbx * projLen, cy - dpby * projLen, ORG, 2, t)
        gLine(cx + dpbx * projLen, cy - dpby * projLen, cx + dpax * sc, cy - dpay * sc, 'rgba(255,165,0,0.4)', 1, t)
      }
      // ③ 내적 계산
      if (p > 0.42) {
        const t = easeOutCubic(Math.min(1, (p - 0.42) / 0.2))
        gText('③ 내적 계산', cx, 22, ORG, 14, t)
        gText(`a·b = ${r(dpax)}×${r(dpbx)} + ${r(dpay)}×${r(dpby)} = ${r(dot)}`, cx, cy + 50, ORG, 14, t)
        gLine(cx - 100, cy + 38, cx + 100, cy + 38, 'rgba(255,150,0,0.3)', 1, t)
        gLine(cx - 100, cy + 62, cx + 100, cy + 62, 'rgba(255,150,0,0.3)', 1, t)
      }
      // ④ 수직 여부 판단
      if (p > 0.62) {
        const t = easeOutCubic(Math.min(1, (p - 0.62) / 0.2))
        if (Math.abs(dot) < 0.01) {
          gText('④ 내적 = 0 → 수직!', cx, 22, MINT, 14, t)
          gCircle(cx, cy, 14, MINT, false, t)
        } else {
          gText(`④ 내적 ${dot > 0 ? '> 0 (예각)' : '< 0 (둔각)'}`, cx, 22, MINT, 14, t)
          gLine(cx - 60, cy + 75, cx + 60, cy + 75, MINT, 1, t)
        }
        gText(`예각/둔각: ${dot > 0 ? '예각' : dot < 0 ? '둔각' : '직각'}`, cx, cy + 80, MINT, 13, t)
      }
      // ⑤ 공식 정리
      if (p > 0.82) {
        const t = easeOutCubic(Math.min(1, (p - 0.82) / 0.15))
        gText('⑤ a·b = |a||b|cosθ', cx, H - 38, WHITE, 13, t)
        gText(`= ${r(magA,2)}×${r(magB,2)}×${r(cosTheta,3)} = ${r(dot)}`, cx, H - 20, MINT, 13, t)
        gLine(30, H - 48, W - 30, H - 48, 'rgba(255,255,255,0.15)', 1, t)
      }
      break
    }

    case 'seq_limit': {
      const sln = Math.max(3, Math.min(20, Math.round(v('n', 10))))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const barW = Math.min(30, (W - 60) / sln - 3), baseY = cy + 60, maxBH = H - 100
      const ox = cx - sln * (barW + 3) / 2
      // ① 막대 1/n 그리기
      if (p > 0.02) {
        const tLabel = easeOutCubic(Math.min(1, (p - 0.02) / 0.1))
        gText('① 수열 1/n 시각화', cx, 22, VIO, 14, tLabel)
      }
      for (let i = 1; i <= sln; i++) {
        const val = 1 / i, bh = val * maxBH * 0.8
        const delay = 0.02 + (i - 1) * (0.4 / sln)
        if (p < delay) continue
        const t = easeOutCubic(Math.min(1, (p - delay) / 0.1))
        const x = ox + (i - 1) * (barW + 3)
        ctx.save(); ctx.globalAlpha = t * 0.5; ctx.fillStyle = VIO; ctx.fillRect(x, baseY - bh * t, barW, bh * t); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 1; ctx.strokeRect(x, baseY - bh * t, barW, bh * t); ctx.restore()
        // 막대 꼭대기 원
        gCircle(x + barW / 2, baseY - bh * t, 3, VIO, true, t)
      }
      // ② 극한선 (epsilon 밴드)
      if (p > 0.44) {
        const t = easeOutCubic(Math.min(1, (p - 0.44) / 0.18))
        gText('② 극한선과 ε 밴드', cx, 22, GRN, 14, t)
        const eps = 0.1 * maxBH * 0.8
        gLine(30, baseY, W - 30, baseY, GRN, 2, t)
        gLine(30, baseY - eps, W - 30, baseY - eps, 'rgba(100,220,150,0.4)', 1, t)
        gLine(30, baseY + eps, W - 30, baseY + eps, 'rgba(100,220,150,0.4)', 1, t)
        ctx.save(); ctx.globalAlpha = t * 0.08; ctx.fillStyle = GRN; ctx.fillRect(30, baseY - eps, W - 60, eps * 2); ctx.restore()
        gText('ε', W - 25, baseY - eps - 5, GRN, 11, t)
        gText('y = 0', W - 40, baseY - 14, GRN, 12, t)
      }
      // ③ 막대 꼭대기 연결 곡선
      if (p > 0.56) {
        const t = easeOutCubic(Math.min(1, (p - 0.56) / 0.15))
        gText('③ 감소 추세', cx, 22, ORG, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.6; ctx.strokeStyle = ORG; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.beginPath()
        for (let i = 1; i <= sln; i++) {
          const bh = (1 / i) * maxBH * 0.8
          const x = ox + (i - 1) * (barW + 3) + barW / 2
          if (i === 1) ctx.moveTo(x, baseY - bh); else ctx.lineTo(x, baseY - bh)
        }
        ctx.stroke(); ctx.restore()
        gLine(ox - 5, baseY, ox + sln * (barW + 3), baseY, 'rgba(255,255,255,0.2)', 1, t)
      }
      // ④ 현재 마지막 항 값
      if (p > 0.7) {
        const t = easeOutCubic(Math.min(1, (p - 0.7) / 0.15))
        gText('④ 수렴 확인', cx, 22, MINT, 14, t)
        const lastX = ox + (sln - 1) * (barW + 3) + barW / 2
        const lastBH = (1 / sln) * maxBH * 0.8
        gCircle(lastX, baseY - lastBH, 7, MINT, true, t)
        gLine(lastX, baseY - lastBH, lastX, baseY, MINT, 1, t)
        gText(`1/${sln}=${r(1/sln, 4)}`, lastX + 8, baseY - lastBH - 10, MINT, 11, t)
      }
      // ⑤ 정리
      if (p > 0.84) {
        const t = easeOutCubic(Math.min(1, (p - 0.84) / 0.13))
        gText('⑤ n → ∞ 이면 1/n → 0', cx, H - 38, WHITE, 13, t)
        gText('n이 커질수록 0에 한없이 가까워진다', cx, H - 20, MINT, 13, t)
        gLine(30, H - 48, W - 30, H - 48, 'rgba(255,255,255,0.15)', 1, t)
      }
      break
    }

    case 'series': {
      const srn = Math.max(2, Math.min(10, Math.round(v('n', 6))))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const maxW = W - 80, baseY = cy
      // ① 블록 쌓기 1/2 + 1/4 + ...
      if (p > 0.02) {
        const tLabel = easeOutCubic(Math.min(1, (p - 0.02) / 0.1))
        gText('① 블록 쌓기 1/2+1/4+…', cx, 22, VIO, 14, tLabel)
      }
      let cumX = 40
      for (let i = 1; i <= srn; i++) {
        const w = (1 / Math.pow(2, i)) * maxW
        const delay = 0.02 + (i - 1) * (0.45 / srn)
        if (p < delay) { cumX += w + 2; continue }
        const t = easeOutCubic(Math.min(1, (p - delay) / 0.12))
        ctx.save(); ctx.globalAlpha = t * 0.5; ctx.fillStyle = VIO
        ctx.fillRect(cumX, baseY - 20, w * t, 30); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 1.5
        ctx.strokeRect(cumX, baseY - 20, w * t, 30); ctx.restore()
        if (w > 15) gText(`1/${Math.pow(2, i)}`, cumX + w / 2, baseY - 5, WHITE, 10, t)
        // 블록 모서리 원
        gCircle(cumX, baseY - 20, 3, VIO, true, t)
        gCircle(cumX + w * t, baseY - 20, 3, VIO, true, t)
        cumX += w + 2
      }
      // ② 수렴선 + 나머지 표시
      if (p > 0.5) {
        const t = easeOutCubic(Math.min(1, (p - 0.5) / 0.2))
        gText('② 수렴선 = 1', cx, 22, GRN, 14, t)
        const limX = 40 + maxW
        gLine(limX, baseY - 50, limX, baseY + 30, ORG, 2, t)
        gLine(40, baseY - 22, limX + 10, baseY - 22, 'rgba(100,220,150,0.35)', 1, t)
        gText('합 = 1', limX + 10, baseY - 32, ORG, 14, t)
        gCircle(limX, baseY - 20, 6, ORG, true, t)
      }
      // ③ 현재 합 값 + 나머지
      if (p > 0.62) {
        const t = easeOutCubic(Math.min(1, (p - 0.62) / 0.16))
        gText('③ 현재 부분합', cx, 22, ORG, 14, t)
        const total = 1 - Math.pow(0.5, srn)
        const remain = Math.pow(0.5, srn)
        gText(`S_${srn} = ${r(total, 4)}`, cx - 50, baseY + 35, GRN, 14, t)
        gText(`나머지 = ${r(remain, 4)}`, cx + 60, baseY + 35, ORG, 12, t)
        const curX = 40 + maxW * total
        gLine(curX, baseY - 30, curX, baseY + 25, GRN, 1, t)
      }
      // ④ 무한급수 상자
      if (p > 0.76) {
        const t = easeOutCubic(Math.min(1, (p - 0.76) / 0.15))
        gText('④ 무한히 더할수록', cx, 22, MINT, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.15; ctx.fillStyle = MINT; ctx.fillRect(cx - 120, baseY + 48, 240, 26); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = MINT; ctx.lineWidth = 1; ctx.strokeRect(cx - 120, baseY + 48, 240, 26); ctx.restore()
        gText('부분합이 1에 점점 가까워짐', cx, baseY + 63, MINT, 13, t)
      }
      // ⑤ 공식 정리
      if (p > 0.88) {
        const t = easeOutCubic(Math.min(1, (p - 0.88) / 0.1))
        gText('⑤ 무한히 더해도 유한한 값 = 수렴!', cx, H - 22, MINT, 14, t)
        gLine(30, H - 34, W - 30, H - 34, 'rgba(255,255,255,0.15)', 1, t)
      }
      break
    }

    case 'func_limit': {
      const fla = v('a', 2)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 35, baseY = cy + 20
      const flf = (x: number) => 0.5 * x + 1
      const flL = flf(fla)
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.12)', 1, p)
      gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      // ① f(x) 곡선
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① f(x) 곡선 그리기', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = VIO; ctx.beginPath()
        let s = false
        for (let x = -2; x <= 6; x += 0.05) { const y = flf(x); const sx = cx + (x - 2) * sc, sy = baseY - y * 20; if (sy < 25 || sy > H - 20) { s = false; continue }; if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        gText('f(x) = 0.5x+1', W - 70, 40, VIO, 11, t)
      }
      // ② 왼쪽 접근 + epsilon 밴드
      if (p > 0.24) {
        const t = easeOutCubic(Math.min(1, (p - 0.24) / 0.2))
        gText('② 왼쪽에서 접근', cx, 22, VIO, 14, t)
        const lx = fla - 2 + t * 1.85
        const sx = cx + (lx - 2) * sc, sy = baseY - flf(lx) * 20
        gCircle(sx, sy, 6, VIO, true, t)
        gLine(sx - 25, sy, sx - 4, sy, VIO, 2, t)
        gLine(sx, sy, sx, baseY, 'rgba(100,100,200,0.3)', 1, t)
      }
      // ③ 오른쪽 접근
      if (p > 0.44) {
        const t = easeOutCubic(Math.min(1, (p - 0.44) / 0.2))
        gText('③ 오른쪽에서 접근', cx, 22, GRN, 14, t)
        const rx = fla + 2 - t * 1.85
        const sx = cx + (rx - 2) * sc, sy = baseY - flf(rx) * 20
        gCircle(sx, sy, 6, GRN, true, t)
        gLine(sx + 4, sy, sx + 25, sy, GRN, 2, t)
        gLine(sx, sy, sx, baseY, 'rgba(50,180,120,0.3)', 1, t)
      }
      // ④ epsilon-delta 시각화
      if (p > 0.62) {
        const t = easeOutCubic(Math.min(1, (p - 0.62) / 0.2))
        gText('④ ε-δ 논법', cx, 22, ORG, 14, t)
        const ax = cx + (fla - 2) * sc, ay = baseY - flL * 20
        const eps = 18, delta = 12
        gLine(ax - delta, baseY - 10, ax - delta, baseY + 10, ORG, 1, t)
        gLine(ax + delta, baseY - 10, ax + delta, baseY + 10, ORG, 1, t)
        gLine(30, ay - eps, W - 30, ay - eps, 'rgba(200,130,50,0.4)', 1, t)
        gLine(30, ay + eps, W - 30, ay + eps, 'rgba(200,130,50,0.4)', 1, t)
        ctx.save(); ctx.globalAlpha = t * 0.08; ctx.fillStyle = ORG; ctx.fillRect(30, ay - eps, W - 60, eps * 2); ctx.restore()
        gText('ε', W - 20, ay - eps - 5, ORG, 11, t)
        gText('δ', ax + delta + 5, baseY + 20, ORG, 11, t)
      }
      // ⑤ 극한값 + 공식
      if (p > 0.8) {
        const t = easeOutCubic(Math.min(1, (p - 0.8) / 0.16))
        const ax = cx + (fla - 2) * sc, ay = baseY - flL * 20
        gCircle(ax, ay, 9, ORG, true, t)
        gText(`L = ${r(flL)}`, ax + 16, ay - 16, ORG, 13, t)
        gLine(ax, ay, ax, baseY, 'rgba(200,130,50,0.4)', 1, t)
        gLine(ax - 30, ay, ax + 30, ay, 'rgba(200,130,50,0.4)', 1, t)
        gText('⑤ x → a 일 때 극한 = L', cx, H - 38, WHITE, 13, t)
        gText(`lim f(x) = ${r(flL)} (x→${r(fla)})`, cx, H - 20, MINT, 13, t)
        gLine(30, H - 48, W - 30, H - 48, 'rgba(255,255,255,0.15)', 1, t)
      }
      break
    }

    case 'continuity': {
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 35, baseY = cy
      // ① 연속 함수 소개
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.22))
        gText('① 연속 vs 불연속 비교', cx, 22, VIO, 14, t)
        gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.1)', 1, t)
        gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.08)', 1, t)
      }
      // ② 연속 곡선 (왼쪽 반)
      if (p > 0.1 && p < 0.62) {
        const t = easeOutCubic(Math.min(1, (p - 0.1) / 0.25))
        gText('② 연속: 연필 안 떼고 그리기', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 10; ctx.shadowColor = VIO; ctx.beginPath()
        for (let x = -4; x <= 4; x += 0.05) { const y = Math.sin(x * 0.8) * 1.5; const sx = cx + x * sc, sy = baseY - y * 25; if (x === -4) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        gText('매끄럽게 이어진다', cx, baseY + 55, VIO, 13, t)
        // 연속 함수 위 원들
        for (const xi of [-2, 0, 2]) {
          const yi = Math.sin(xi * 0.8) * 1.5
          gCircle(cx + xi * sc, baseY - yi * 25, 4, VIO, true, t)
        }
        gLine(30, baseY - 40, W - 30, baseY - 40, 'rgba(100,100,200,0.2)', 1, t)
      }
      // ③ 불연속 곡선
      if (p > 0.56) {
        const t = easeOutCubic(Math.min(1, (p - 0.56) / 0.22))
        gText('③ 불연속: 끊어진 곳', cx, 22, ORG, 14, t)
        gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.08)', 1, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = ORG; ctx.lineWidth = 2.5; ctx.shadowBlur = 10; ctx.shadowColor = ORG; ctx.beginPath()
        for (let x = -4; x < 0; x += 0.05) { const y = 0.3 * x + 1; const sx = cx + x * sc, sy = baseY - y * 25; if (x === -4) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy) }
        ctx.stroke()
        ctx.beginPath()
        for (let x = 0.1; x <= 4; x += 0.05) { const y = 0.3 * x - 0.5; const sx = cx + x * sc, sy = baseY - y * 25; if (x < 0.15) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        gCircle(cx, baseY - 25, 7, ORG, false, t)
        gCircle(cx, baseY + 12, 5, ORG, true, t)
        gText('끊김!', cx + 18, baseY - 42, ORG, 13, t)
        gLine(cx - 2, baseY - 45, cx - 2, baseY + 25, 'rgba(220,90,50,0.5)', 1, t)
      }
      // ④ 연속 조건 세 가지
      if (p > 0.76) {
        const t = easeOutCubic(Math.min(1, (p - 0.76) / 0.15))
        gText('④ 연속 조건 3가지', cx, 22, MINT, 14, t)
        gText('f(a) 존재, lim f(x) 존재, 두 값 일치', cx, baseY + 70, MINT, 12, t)
        ctx.save(); ctx.globalAlpha = t * 0.12; ctx.fillStyle = MINT; ctx.fillRect(cx - 160, baseY + 56, 320, 22); ctx.restore()
        gLine(cx - 160, baseY + 56, cx + 160, baseY + 56, 'rgba(100,220,180,0.3)', 1, t)
        gLine(cx - 160, baseY + 78, cx + 160, baseY + 78, 'rgba(100,220,180,0.3)', 1, t)
      }
      // ⑤ 결론
      if (p > 0.88) {
        const t = easeOutCubic(Math.min(1, (p - 0.88) / 0.1))
        gText('⑤ 연속 = 끊김 없이 이어지는 함수', cx, H - 22, MINT, 14, t)
        gLine(30, H - 34, W - 30, H - 34, 'rgba(255,255,255,0.15)', 1, t)
      }
      break
    }

    // ══════════════════════════════════════════
    // H046~H060 — 미적분·확률 Canvas 2D
    // ══════════════════════════════════════════

    case 'derivative_func': {
      const dfx = v('x', 2)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 35, scY = 18, baseY = cy + 30
      const fDf = (x: number) => 0.15*x*x*x - 0.8*x*x + 1.5*x + 1
      const fDfP = (x: number) => 0.45*x*x - 1.6*x + 1.5
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.12)', 1, p); gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      // ① f(x) 곡선 + 기준점
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① f(x) 곡선 그리기', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = VIO; ctx.beginPath()
        let s = false; for (let x = -1; x <= 6; x += 0.05) { const y = fDf(x); const sx = cx + (x - 2.5) * sc, sy = baseY - y * scY; if (sy < 25 || sy > H - 20) { s = false; continue }; if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy) }; ctx.stroke(); ctx.restore()
        gText('f(x)', W - 45, 38, VIO, 12, t)
      }
      // ② 접선 샘플 여러 곳
      if (p > 0.22) {
        const t = easeOutCubic(Math.min(1, (p - 0.22) / 0.25))
        gText('② 각 점의 접선 기울기', cx, 22, ORG, 14, t)
        for (const xi of [0, 1, 2, 3, 4.5]) {
          const sx = cx + (xi - 2.5) * sc, sy = baseY - fDf(xi) * scY
          const slope = fDfP(xi)
          const len = 18
          ctx.save(); ctx.globalAlpha = t * 0.65; ctx.strokeStyle = ORG; ctx.lineWidth = 1.5; ctx.beginPath()
          ctx.moveTo(sx - len, sy + slope * len * scY / sc)
          ctx.lineTo(sx + len, sy - slope * len * scY / sc)
          ctx.stroke(); ctx.restore()
          gCircle(sx, sy, 4, ORG, true, t)
        }
      }
      // ③ f'(x) 곡선 그리기
      if (p > 0.44) {
        const t = easeOutCubic(Math.min(1, (p - 0.44) / 0.3))
        gText('③ 기울기 모아 f\'(x) 곡선', cx, 22, GRN, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = GRN; ctx.lineWidth = 2; ctx.shadowBlur = 8; ctx.shadowColor = GRN; ctx.beginPath()
        const pts = Math.floor(t * 50)
        let s2 = false; for (let i = 0; i <= pts; i++) { const x = -1 + i * 7 / 50; const y = fDfP(x); const sx = cx + (x - 2.5) * sc, sy = baseY - y * scY; if (sy < 25 || sy > H - 20) { s2 = false; continue }; if (!s2) { ctx.moveTo(sx, sy); s2 = true } else ctx.lineTo(sx, sy) }; ctx.stroke(); ctx.restore()
        gText("f'(x)", W - 45, 55, GRN, 12, t)
      }
      // ④ 선택 점의 기울기 강조
      if (p > 0.68) {
        const t = easeOutCubic(Math.min(1, (p - 0.68) / 0.18))
        gText('④ 선택 점 기울기', cx, 22, MINT, 14, t)
        const xi = Math.max(-1, Math.min(5.5, dfx))
        const sx = cx + (xi - 2.5) * sc, sy = baseY - fDf(xi) * scY
        const dpsy = baseY - fDfP(xi) * scY
        gCircle(sx, sy, 7, MINT, true, t)
        gCircle(sx, dpsy, 7, GRN, true, t)
        gLine(sx, sy, sx, dpsy, 'rgba(100,220,180,0.5)', 1, t)
        gText(`f'(${r(xi)})=${r(fDfP(xi))}`, sx + 12, dpsy - 14, GRN, 12, t)
      }
      // ⑤ 결론
      if (p > 0.84) {
        const t = easeOutCubic(Math.min(1, (p - 0.84) / 0.13))
        gText('⑤ 도함수 = 모든 점의 순간변화율', cx, H - 38, WHITE, 13, t)
        gText('f\'(x) = lim[f(x+h)-f(x)]/h (h→0)', cx, H - 20, MINT, 12, t)
        gLine(30, H - 48, W - 30, H - 48, 'rgba(255,255,255,0.15)', 1, t)
      }
      break
    }

    case 'diff_formula': {
      const dfn = Math.max(1, Math.min(6, Math.round(v('n', 3))))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 35, scY = 15, baseY = cy + 30
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.12)', 1, p); gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      // ① 원래 곡선 y = x^n
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.25))
        gText(`① y = x^${dfn} 그리기`, cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = VIO; ctx.beginPath()
        let s = false; for (let x = -2; x <= 3; x += 0.05) { const y = Math.pow(x, dfn); const sx = cx + x * sc, sy = baseY - y * scY; if (sy < 25 || sy > H - 20) { s = false; continue }; if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy) }; ctx.stroke(); ctx.restore()
        gText(`y = x^${dfn}`, W - 45, 38, VIO, 12, t)
        // 키 포인트 원
        gCircle(cx, baseY, 5, VIO, true, t)
        gCircle(cx + sc, baseY - 1 * scY, 5, VIO, true, t)
      }
      // ② 계수 화살표 시각화
      if (p > 0.24) {
        const t = easeOutCubic(Math.min(1, (p - 0.24) / 0.22))
        gText('② 계수 n을 앞으로', cx, 22, ORG, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = ORG; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.beginPath()
        ctx.moveTo(cx + 30, baseY + 30); ctx.lineTo(cx + 10, baseY + 18); ctx.stroke()
        ctx.setLineDash([]); ctx.restore()
        gText(`n = ${dfn}`, cx + 36, baseY + 38, ORG, 13, t)
        gLine(cx - 15, baseY + 38, cx + 28, baseY + 38, 'rgba(220,130,50,0.4)', 1, t)
        gText(`지수 ${dfn} → 계수 ${dfn}`, cx - 60, baseY + 55, ORG, 12, t)
      }
      // ③ 도함수 y' = n*x^(n-1)
      if (p > 0.44) {
        const t = easeOutCubic(Math.min(1, (p - 0.44) / 0.28))
        gText(`③ y' = ${dfn}x^${dfn-1}`, cx, 22, GRN, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = GRN; ctx.lineWidth = 2; ctx.shadowBlur = 8; ctx.shadowColor = GRN; ctx.beginPath()
        let s = false; for (let x = -2; x <= 3; x += 0.05) { const y = dfn * Math.pow(x, dfn - 1); const sx = cx + x * sc, sy = baseY - y * scY; if (sy < 25 || sy > H - 20) { s = false; continue }; if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy) }; ctx.stroke(); ctx.restore()
        gText(`y' = ${dfn}x^${dfn-1}`, W - 52, 54, GRN, 12, t)
      }
      // ④ x=1 값 비교
      if (p > 0.68) {
        const t = easeOutCubic(Math.min(1, (p - 0.68) / 0.18))
        gText('④ x=1 에서 비교', cx, 22, MINT, 14, t)
        const sx1 = cx + sc, sy1 = baseY - Math.pow(1, dfn) * scY
        const sdsy1 = baseY - dfn * Math.pow(1, dfn-1) * scY
        gCircle(sx1, sy1, 6, VIO, true, t)
        gCircle(sx1, sdsy1, 6, GRN, true, t)
        gLine(sx1, sy1, sx1, sdsy1, 'rgba(255,255,255,0.3)', 1, t)
        gText(`f(1)=1`, sx1 + 10, sy1 - 10, VIO, 11, t)
        gText(`f'(1)=${dfn}`, sx1 + 10, sdsy1 - 10, GRN, 11, t)
      }
      // ⑤ 공식 정리
      if (p > 0.84) {
        const t = easeOutCubic(Math.min(1, (p - 0.84) / 0.13))
        gText('⑤ 거듭제곱 미분 공식', cx, H - 38, WHITE, 13, t)
        gText(`(x^n)' = n·x^(n-1)`, cx, H - 20, MINT, 14, t)
        gLine(30, H - 48, W - 30, H - 48, 'rgba(255,255,255,0.15)', 1, t)
      }
      break
    }

    case 'diff_application': {
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 35, scY = 15, baseY = cy + 30
      const daF = (x: number) => -0.2 * x * x * x + 1.2 * x * x - 1.5 * x + 2
      const daFp = (x: number) => -0.6 * x * x + 2.4 * x - 1.5
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.12)', 1, p); gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      // ① f(x) + f'(x) 그리기
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.25))
        gText('① f(x)와 f\'(x) 함께 보기', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.beginPath()
        let s = false; for (let x = -1; x <= 5; x += 0.05) { const y = daF(x); const sx = cx + (x - 2) * sc, sy = baseY - y * scY; if (sy < 20 || sy > H - 15) { s = false; continue }; if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy) }; ctx.stroke(); ctx.restore()
        ctx.save(); ctx.globalAlpha = t * 0.7; ctx.strokeStyle = GRN; ctx.lineWidth = 2; ctx.setLineDash([5, 3]); ctx.beginPath()
        let s2 = false; for (let x = -1; x <= 5; x += 0.05) { const y = daFp(x); const sx = cx + (x - 2) * sc, sy = baseY - y * scY; if (sy < 20 || sy > H - 15) { s2 = false; continue }; if (!s2) { ctx.moveTo(sx, sy); s2 = true } else ctx.lineTo(sx, sy) }; ctx.stroke(); ctx.restore()
        gText("f(x)", W - 50, 38, VIO, 12, t); gText("f'(x)", W - 50, 54, GRN, 12, t)
      }
      // ② 증가/감소 영역 색칠
      if (p > 0.28) {
        const t = easeOutCubic(Math.min(1, (p - 0.28) / 0.25))
        gText('② 증가·감소 구간', cx, 22, ORG, 14, t)
        for (let x = -1; x <= 5; x += 0.2) { const fp = daFp(x); const sx = cx + (x - 2) * sc; if (sx < 30 || sx > W - 30) continue; ctx.save(); ctx.globalAlpha = t * 0.18; ctx.fillStyle = fp > 0 ? VIO : ORG; ctx.fillRect(sx, baseY - 65, 7, 130); ctx.restore() }
        gText('↑증가', cx - 55, baseY - 70, VIO, 11, t)
        gText('↓감소', cx + 5, baseY - 70, ORG, 11, t)
      }
      // ③ f'(x)=0 선
      if (p > 0.5) {
        const t = easeOutCubic(Math.min(1, (p - 0.5) / 0.2))
        gText("③ f'(x)=0 위치", cx, 22, MINT, 14, t)
        const r1 = 0.77, r2 = 3.23
        gLine(cx + (r1 - 2) * sc, baseY - 70, cx + (r1 - 2) * sc, baseY + 10, 'rgba(100,220,180,0.4)', 1, t)
        gLine(cx + (r2 - 2) * sc, baseY - 70, cx + (r2 - 2) * sc, baseY + 10, 'rgba(100,220,180,0.4)', 1, t)
        gCircle(cx + (r1 - 2) * sc, baseY - daFp(r1) * scY, 5, MINT, true, t)
        gCircle(cx + (r2 - 2) * sc, baseY - daFp(r2) * scY, 5, MINT, true, t)
      }
      // ④ 극값 표시
      if (p > 0.66) {
        const t = easeOutCubic(Math.min(1, (p - 0.66) / 0.18))
        gText('④ 극소·극대 찾기', cx, 22, ORG, 14, t)
        const r1 = 0.77, r2 = 3.23
        gCircle(cx + (r1 - 2) * sc, baseY - daF(r1) * scY, 7, ORG, true, t)
        gText('극소', cx + (r1 - 2) * sc + 10, baseY - daF(r1) * scY - 14, ORG, 12, t)
        gCircle(cx + (r2 - 2) * sc, baseY - daF(r2) * scY, 7, ORG, true, t)
        gText('극대', cx + (r2 - 2) * sc + 10, baseY - daF(r2) * scY - 14, ORG, 12, t)
        gLine(cx + (r1 - 2) * sc, baseY - daF(r1) * scY, cx + (r2 - 2) * sc, baseY - daF(r2) * scY, 'rgba(220,130,50,0.3)', 1, t)
      }
      // ⑤ 결론
      if (p > 0.82) {
        const t = easeOutCubic(Math.min(1, (p - 0.82) / 0.14))
        gText("⑤ f'(x)=0이면 극값 후보!", cx, H - 38, WHITE, 13, t)
        gText('부호 변화로 극대·극소 판별', cx, H - 20, MINT, 13, t)
        gLine(30, H - 48, W - 30, H - 48, 'rgba(255,255,255,0.15)', 1, t)
      }
      break
    }

    case 'max_min': {
      const mma = v('a', 0), mmb = v('b', 4)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 35, scY = 15, baseY = cy + 30
      const mmF = (x: number) => -0.2 * x * x * x + 1.2 * x * x - 1.5 * x + 2
      const mmFp = (x: number) => -0.6 * x * x + 2.4 * x - 1.5
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.12)', 1, p); gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      // ① 곡선 + 구간 표시
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.25))
        gText(`① 구간 [${r(mma)}, ${r(mmb)}] 설정`, cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.beginPath()
        let s = false; for (let x = mma - 0.5; x <= mmb + 0.5; x += 0.05) { const y = mmF(x); const sx = cx + (x - 2) * sc, sy = baseY - y * scY; if (sy < 25 || sy > H - 20) { s = false; continue }; if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy) }; ctx.stroke(); ctx.restore()
        // 구간 끝점 수직선
        gLine(cx + (mma - 2) * sc, baseY - 75, cx + (mma - 2) * sc, baseY + 12, ORG, 2, t)
        gLine(cx + (mmb - 2) * sc, baseY - 75, cx + (mmb - 2) * sc, baseY + 12, ORG, 2, t)
        gText(`a=${r(mma)}`, cx + (mma - 2) * sc, baseY + 22, ORG, 11, t)
        gText(`b=${r(mmb)}`, cx + (mmb - 2) * sc, baseY + 22, ORG, 11, t)
      }
      // ② 구간 내 극값 위치
      if (p > 0.28) {
        const t = easeOutCubic(Math.min(1, (p - 0.28) / 0.24))
        gText('② 극값 위치 찾기', cx, 22, MINT, 14, t)
        const r1 = 0.77, r2 = 3.23
        for (const xi of [r1, r2].filter(x => x >= mma && x <= mmb)) {
          const sx = cx + (xi - 2) * sc, sy = baseY - mmF(xi) * scY
          gLine(sx, sy, sx, baseY, 'rgba(100,220,180,0.35)', 1, t)
          gCircle(sx, sy, 5, MINT, true, t)
          gText(`x=${r(xi)}`, sx + 8, sy - 12, MINT, 10, t)
        }
      }
      // ③ 끝점 값 표시
      if (p > 0.46) {
        const t = easeOutCubic(Math.min(1, (p - 0.46) / 0.22))
        gText('③ 끝점 값 비교', cx, 22, ORG, 14, t)
        const saX = cx + (mma - 2) * sc, saY = baseY - mmF(mma) * scY
        const sbX = cx + (mmb - 2) * sc, sbY = baseY - mmF(mmb) * scY
        gCircle(saX, saY, 6, ORG, false, t)
        gCircle(sbX, sbY, 6, ORG, false, t)
        gText(`f(a)=${r(mmF(mma),2)}`, saX - 14, saY - 14, ORG, 11, t)
        gText(`f(b)=${r(mmF(mmb),2)}`, sbX + 6, sbY - 14, ORG, 11, t)
        gLine(saX, saY, sbX, sbY, 'rgba(220,130,50,0.25)', 1, t)
      }
      // ④ 최대·최소 강조
      if (p > 0.64) {
        const t = easeOutCubic(Math.min(1, (p - 0.64) / 0.22))
        gText('④ 최대·최소 결정', cx, 22, GRN, 14, t)
        const pts = [mma, 0.77, 3.23, mmb].filter(x => x >= mma && x <= mmb)
        let maxV = -Infinity, minV = Infinity, maxX = mma, minX = mma
        pts.forEach(x => { const y = mmF(x); if (y > maxV) { maxV = y; maxX = x }; if (y < minV) { minV = y; minX = x } })
        gCircle(cx + (maxX - 2) * sc, baseY - maxV * scY, 9, GRN, true, t)
        gText('최대', cx + (maxX - 2) * sc + 14, baseY - maxV * scY - 12, GRN, 13, t)
        gCircle(cx + (minX - 2) * sc, baseY - minV * scY, 9, ORG, true, t)
        gText('최소', cx + (minX - 2) * sc + 14, baseY - minV * scY + 18, ORG, 13, t)
        gLine(cx + (maxX-2)*sc, baseY - maxV*scY, cx + (minX-2)*sc, baseY - minV*scY, 'rgba(100,200,120,0.3)', 1, t)
      }
      // ⑤ 결론
      if (p > 0.84) {
        const t = easeOutCubic(Math.min(1, (p - 0.84) / 0.13))
        gText('⑤ 극값 + 끝점 비교 → 최대·최소', cx, H - 38, WHITE, 13, t)
        gText('극값과 끝점 중 최대·최소 비교', cx, H - 20, MINT, 13, t)
        gLine(30, H - 48, W - 30, H - 48, 'rgba(255,255,255,0.15)', 1, t)
      }
      break
    }

    case 'tangent_line': {
      const tla = v('a', 2)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 35, scY = 18, baseY = cy + 30
      const tlF = (x: number) => 0.15*x*x*x - 0.8*x*x + 1.5*x + 1
      const tlFp = (x: number) => 0.45*x*x - 1.6*x + 1.5
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.12)', 1, p); gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      // ① 곡선 + 접점
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① 곡선 위의 점 선택', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.beginPath()
        let s = false; for (let x = -1; x <= 6; x += 0.05) { const y = tlF(x); const sx = cx + (x - 2.5) * sc, sy = baseY - y * scY; if (sy < 25 || sy > H - 20) { s = false; continue }; if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy) }; ctx.stroke(); ctx.restore()
        const px = cx + (tla - 2.5) * sc, py = baseY - tlF(tla) * scY
        gCircle(px, py, 7, ORG, true, t)
        gText(`(${r(tla)}, ${r(tlF(tla))})`, px + 12, py - 12, ORG, 11, t)
        gLine(px, py, px, baseY, 'rgba(220,130,50,0.3)', 1, t)
      }
      // ② 접선 그리기
      if (p > 0.26) {
        const t = easeOutCubic(Math.min(1, (p - 0.26) / 0.24))
        gText('② 접선 그리기', cx, 22, GRN, 14, t)
        const slope = tlFp(tla), px = cx + (tla - 2.5) * sc, py = baseY - tlF(tla) * scY
        ctx.save(); ctx.globalAlpha = t * 0.8; ctx.strokeStyle = GRN; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = GRN; ctx.beginPath()
        ctx.moveTo(px - 90, py + slope * 90 * scY / sc); ctx.lineTo(px + 90, py - slope * 90 * scY / sc); ctx.stroke(); ctx.restore()
      }
      // ③ 법선 그리기
      if (p > 0.46) {
        const t = easeOutCubic(Math.min(1, (p - 0.46) / 0.22))
        gText('③ 법선(접선과 수직)', cx, 22, ORG, 14, t)
        const slope = tlFp(tla), px = cx + (tla - 2.5) * sc, py = baseY - tlF(tla) * scY
        const normSlope = slope !== 0 ? -1 / slope : 999
        ctx.save(); ctx.globalAlpha = t * 0.55; ctx.strokeStyle = ORG; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath()
        ctx.moveTo(px - 55, py + normSlope * 55 * scY / sc); ctx.lineTo(px + 55, py - normSlope * 55 * scY / sc); ctx.stroke(); ctx.setLineDash([]); ctx.restore()
        gLine(px - 5, py - 5, px + 5, py - 5, ORG, 1, t)
        gLine(px + 5, py - 5, px + 5, py + 5, ORG, 1, t)
      }
      // ④ 기울기 수식
      if (p > 0.64) {
        const t = easeOutCubic(Math.min(1, (p - 0.64) / 0.2))
        gText('④ 접선 기울기', cx, 22, MINT, 14, t)
        gText(`f'(${r(tla)}) = ${r(tlFp(tla),3)}`, cx, cy - 50, ORG, 14, t)
        gLine(cx - 100, cy - 62, cx + 100, cy - 62, 'rgba(200,130,50,0.35)', 1, t)
        const px = cx + (tla - 2.5) * sc, py = baseY - tlF(tla) * scY
        gCircle(px, py, 10, MINT, false, t)
      }
      // ⑤ 접선 방정식
      if (p > 0.82) {
        const t = easeOutCubic(Math.min(1, (p - 0.82) / 0.14))
        gText("⑤ 접선 방정식", cx, H - 38, WHITE, 13, t)
        gText(`y - f(a) = f'(a)(x - a)`, cx, H - 20, MINT, 13, t)
        gLine(30, H - 48, W - 30, H - 48, 'rgba(255,255,255,0.15)', 1, t)
      }
      break
    }

    case 'indefinite_integral': {
      const iiC = v('C', 0)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 35, scY = 12, baseY = cy + 20
      const iiF = (x: number, c: number) => 0.15*x*x*x - 0.8*x*x + 1.5*x + 1 + c
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.12)', 1, p); gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      // ① f(x)+C 여러 곡선
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.3))
        gText('① f(x)+C 가족 곡선들', cx, 22, VIO, 14, t)
        for (const c of [-2, -1, 0, 1, 2]) {
          const col = c === Math.round(iiC) ? GRN : (c === 0 ? VIO : 'rgba(255,255,255,0.2)')
          const lw = c === Math.round(iiC) ? 2.5 : 1.5
          ctx.save(); ctx.globalAlpha = t * (c === Math.round(iiC) ? 1 : 0.4); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath()
          let s = false; for (let x = -1; x <= 6; x += 0.05) { const y = iiF(x, c); const sx = cx + (x - 2.5) * sc, sy = baseY - y * scY; if (sy < 20 || sy > H - 15) { s = false; continue }; if (!s) { ctx.moveTo(sx, sy); s = true } else ctx.lineTo(sx, sy) }; ctx.stroke(); ctx.restore()
        }
        gText('f(x)', W - 42, 38, VIO, 12, t)
      }
      // ② C 이동 화살표
      if (p > 0.32) {
        const t = easeOutCubic(Math.min(1, (p - 0.32) / 0.22))
        gText('② C 값에 따라 위아래 이동', cx, 22, ORG, 14, t)
        const px = cx + (0.5) * sc
        for (const [c1, c2] of [[-2,-1],[-1,0],[0,1],[1,2]]) {
          const y1 = iiF(0.5, c1) * scY, y2 = iiF(0.5, c2) * scY
          gLine(px, baseY - y1, px, baseY - y2, 'rgba(220,130,50,0.5)', 1, t)
        }
        gText('+C', px + 8, baseY - iiF(0.5, 1) * scY, ORG, 12, t)
      }
      // ③ 선택된 C 강조
      if (p > 0.5) {
        const t = easeOutCubic(Math.min(1, (p - 0.5) / 0.2))
        gText('③ 선택 C 강조', cx, 22, GRN, 14, t)
        gText(`C = ${r(iiC)}`, W - 55, 50, GRN, 14, t)
        const selC = Math.round(iiC)
        const sx0 = cx + (0 - 2.5) * sc, sy0 = baseY - iiF(0, selC) * scY
        gCircle(sx0, sy0, 6, GRN, true, t)
        gLine(sx0 - 80, sy0, sx0 + 80, sy0, 'rgba(100,220,150,0.3)', 1, t)
        gText(`y절편 = ${r(iiF(0, selC), 2)}`, sx0 + 12, sy0 - 14, GRN, 11, t)
      }
      // ④ 미분하면 원래 함수
      if (p > 0.68) {
        const t = easeOutCubic(Math.min(1, (p - 0.68) / 0.2))
        gText('④ 미분하면 원래 함수 복원', cx, 22, MINT, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.12; ctx.fillStyle = MINT; ctx.fillRect(cx - 145, H - 60, 290, 24); ctx.restore()
        gLine(cx - 145, H - 60, cx + 145, H - 60, 'rgba(100,220,180,0.3)', 1, t)
        gLine(cx - 145, H - 36, cx + 145, H - 36, 'rgba(100,220,180,0.3)', 1, t)
        gText('d/dx [F(x)+C] = f(x)', cx, H - 46, MINT, 12, t)
      }
      // ⑤ 결론
      if (p > 0.84) {
        const t = easeOutCubic(Math.min(1, (p - 0.84) / 0.13))
        gText('⑤ 부정적분 = 미분의 역과정, C는 자유', cx, H - 20, MINT, 13, t)
        gLine(30, H - 30, W - 30, H - 30, 'rgba(255,255,255,0.15)', 1, t)
      }
      break
    }

    case 'area_integral': {
      const aia = v('a', 0), aib = v('b', 3)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 35, scY = 15, baseY = cy + 30
      const aiF = (x: number) => -0.15 * x * x + 1.5 * x + 0.5
      const aiG = (x: number) => 0.2 * x + 0.3
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.12)', 1, p); gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      // ① 두 곡선 그리기
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.25))
        gText('① 두 곡선 f(x), g(x)', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.beginPath()
        for (let x = -1; x <= 5; x += 0.05) { const sx = cx + (x - 1.5) * sc, sy = baseY - aiF(x) * scY; if (sy < 20 || sy > H - 15) continue; if (x === -1) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy) }; ctx.stroke()
        ctx.strokeStyle = GRN; ctx.lineWidth = 2; ctx.beginPath()
        for (let x = -1; x <= 5; x += 0.05) { const sx = cx + (x - 1.5) * sc, sy = baseY - aiG(x) * scY; if (x === -1) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy) }; ctx.stroke(); ctx.restore()
        gText('f(x)', W - 42, 38, VIO, 12, t)
        gText('g(x)', W - 42, 54, GRN, 12, t)
      }
      // ② 적분 경계선
      if (p > 0.28) {
        const t = easeOutCubic(Math.min(1, (p - 0.28) / 0.22))
        gText('② 적분 구간 경계', cx, 22, ORG, 14, t)
        const xaS = cx + (aia - 1.5) * sc, xbS = cx + (aib - 1.5) * sc
        gLine(xaS, baseY - aiF(aia) * scY, xaS, baseY + 12, ORG, 2, t)
        gLine(xbS, baseY - aiF(aib) * scY, xbS, baseY + 12, ORG, 2, t)
        gText(`a=${r(aia)}`, xaS, baseY + 22, ORG, 11, t)
        gText(`b=${r(aib)}`, xbS, baseY + 22, ORG, 11, t)
        // 교점 원
        gCircle(xaS, baseY - aiF(aia) * scY, 5, ORG, false, t)
        gCircle(xbS, baseY - aiF(aib) * scY, 5, ORG, false, t)
      }
      // ③ 영역 채우기
      if (p > 0.46) {
        const t = easeOutCubic(Math.min(1, (p - 0.46) / 0.22))
        gText('③ 넓이 영역 채우기', cx, 22, ORG, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.28; ctx.fillStyle = ORG; ctx.beginPath()
        ctx.moveTo(cx + (aia - 1.5) * sc, baseY - aiG(aia) * scY)
        for (let x = aia; x <= aib; x += 0.05) ctx.lineTo(cx + (x - 1.5) * sc, baseY - aiF(x) * scY)
        for (let x = aib; x >= aia; x -= 0.05) ctx.lineTo(cx + (x - 1.5) * sc, baseY - aiG(x) * scY)
        ctx.closePath(); ctx.fill(); ctx.restore()
        gLine(cx + (aia - 1.5) * sc, baseY - aiF(aia) * scY, cx + (aib - 1.5) * sc, baseY - aiF(aib) * scY, 'rgba(220,130,50,0.25)', 1, t)
      }
      // ④ 리만 합 막대
      if (p > 0.64) {
        const t = easeOutCubic(Math.min(1, (p - 0.64) / 0.2))
        gText('④ 리만 합으로 근사', cx, 22, MINT, 14, t)
        const nBars = 5
        const dx2 = (aib - aia) / nBars
        for (let i = 0; i < nBars; i++) {
          const xi = aia + (i + 0.5) * dx2
          const diff = (aiF(xi) - aiG(xi)) * scY
          const bx = cx + (xi - dx2 / 2 - 1.5) * sc
          const bw = dx2 * sc
          const sy = baseY - aiF(xi) * scY
          ctx.save(); ctx.globalAlpha = t * 0.18; ctx.fillStyle = MINT; ctx.fillRect(bx, sy, bw, diff); ctx.restore()
          ctx.save(); ctx.globalAlpha = t * 0.5; ctx.strokeStyle = MINT; ctx.lineWidth = 0.8; ctx.strokeRect(bx, sy, bw, diff); ctx.restore()
          gCircle(bx + bw / 2, sy, 3, MINT, true, t)
        }
      }
      // ⑤ 최종 넓이
      if (p > 0.82) {
        const t = easeOutCubic(Math.min(1, (p - 0.82) / 0.14))
        let area = 0; const dx = 0.01; for (let x = aia; x <= aib; x += dx) area += (aiF(x) - aiG(x)) * dx
        gText('⑤ 두 곡선 사이 넓이', cx, H - 38, WHITE, 13, t)
        gText(`∫(f-g)dx = ${r(Math.abs(area))}`, cx, H - 20, MINT, 16, t)
        gLine(30, H - 48, W - 30, H - 48, 'rgba(255,255,255,0.15)', 1, t)
      }
      break
    }

    case 'series_sum': {
      const ssn = Math.max(2, Math.min(8, Math.round(v('n', 5))))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const barW = Math.min(40, (W - 60) / ssn - 4), maxBH = H - 90, baseY = H - 50
      const ox = cx - ssn * (barW + 4) / 2
      // ① 제곱수 막대 올리기
      if (p > 0.02) {
        const tLabel = easeOutCubic(Math.min(1, (p - 0.02) / 0.1))
        gText('① 제곱수 막대 쌓기', cx, 22, VIO, 14, tLabel)
      }
      for (let i = 1; i <= ssn; i++) {
        const val = i * i, maxVal = ssn * ssn, bh = (val / maxVal) * maxBH * 0.6
        const delay = 0.02 + (i - 1) * (0.4 / ssn)
        if (p < delay) continue
        const t = easeOutCubic(Math.min(1, (p - delay) / 0.12))
        const x = ox + (i - 1) * (barW + 4)
        ctx.save(); ctx.globalAlpha = t * 0.5; ctx.fillStyle = VIO; ctx.fillRect(x, baseY - bh * t, barW, bh * t); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 1.5; ctx.strokeRect(x, baseY - bh * t, barW, bh * t); ctx.restore()
        gText(`${val}`, x + barW / 2, baseY + 14, 'rgba(255,255,255,0.5)', 10, t)
        // 막대 꼭대기 원
        gCircle(x + barW / 2, baseY - bh * t, 4, VIO, true, t)
      }
      // ② 꼭대기 연결선
      if (p > 0.44) {
        const t = easeOutCubic(Math.min(1, (p - 0.44) / 0.18))
        gText('② 꼭대기 연결 추세', cx, 22, GRN, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.6; ctx.strokeStyle = GRN; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.beginPath()
        for (let i = 1; i <= ssn; i++) {
          const val = i * i, maxVal = ssn * ssn, bh = (val / maxVal) * maxBH * 0.6
          const x = ox + (i - 1) * (barW + 4) + barW / 2
          if (i === 1) ctx.moveTo(x, baseY - bh); else ctx.lineTo(x, baseY - bh)
        }
        ctx.stroke(); ctx.setLineDash([]); ctx.restore()
        gLine(ox - 5, baseY, ox + ssn * (barW + 4), baseY, 'rgba(255,255,255,0.15)', 1, t)
      }
      // ③ 합 누적 표시
      if (p > 0.58) {
        const t = easeOutCubic(Math.min(1, (p - 0.58) / 0.18))
        gText('③ 누적 합 계산', cx, 22, ORG, 14, t)
        let cumSum = 0
        for (let i = 1; i <= ssn; i++) { cumSum += i * i }
        gText(`1²+2²+…+${ssn}² = ${cumSum}`, cx, baseY - maxBH * 0.65, ORG, 13, t)
        gLine(cx - 120, baseY - maxBH * 0.65 - 12, cx + 120, baseY - maxBH * 0.65 - 12, 'rgba(220,130,50,0.35)', 1, t)
        gLine(cx - 120, baseY - maxBH * 0.65 + 8, cx + 120, baseY - maxBH * 0.65 + 8, 'rgba(220,130,50,0.35)', 1, t)
      }
      // ④ 공식 박스
      if (p > 0.72) {
        const t = easeOutCubic(Math.min(1, (p - 0.72) / 0.18))
        gText('④ 공식 적용', cx, 22, MINT, 14, t)
        const total = ssn * (ssn + 1) * (2 * ssn + 1) / 6
        ctx.save(); ctx.globalAlpha = t * 0.12; ctx.fillStyle = MINT; ctx.fillRect(cx - 150, baseY + 22, 300, 26); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = MINT; ctx.lineWidth = 1; ctx.strokeRect(cx - 150, baseY + 22, 300, 26); ctx.restore()
        gText(`n(n+1)(2n+1)/6 = ${total}`, cx, baseY + 37, MINT, 13, t)
      }
      // ⑤ 결론
      if (p > 0.88) {
        const t = easeOutCubic(Math.min(1, (p - 0.88) / 0.1))
        gText('⑤ 시그마 공식으로 빠르게 계산', cx, H - 22, MINT, 13, t)
        gLine(30, H - 32, W - 30, H - 32, 'rgba(255,255,255,0.15)', 1, t)
      }
      break
    }

    case 'prob_addition': {
      const ppa = v('pa', 0.4), ppb = v('pb', 0.3), ppab = Math.min(ppa, ppb, v('pab', 0.1))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const rr = Math.min(60, Math.min(W, H) / 4), d = rr * 0.65
      const ax = cx - d / 2, bx = cx + d / 2
      const pUnion = ppa + ppb - ppab
      // ① 벤 다이어그램 테두리 + 집합 테두리선
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① 벤 다이어그램 그리기', cx, 22, WHITE, 14, t)
        gCircle(ax, cy, rr, VIO, false, t)
        gCircle(bx, cy, rr, GRN, false, t)
        gText(`P(A)=${r(ppa)}`, ax - rr * 0.55, cy - rr - 14, VIO, 13, t)
        gText(`P(B)=${r(ppb)}`, bx + rr * 0.55, cy - rr - 14, GRN, 13, t)
        // 집합 경계 수직선
        gLine(ax, cy - rr, ax, cy + rr, VIO, 1, t * 0.4)
        gLine(bx, cy - rr, bx, cy + rr, GRN, 1, t * 0.4)
        // 상단 가로 기준선
        gLine(ax - rr, cy - rr - 20, bx + rr, cy - rr - 20, 'rgba(255,255,255,0.15)', 1, t)
      }
      // ② 영역 채우기 + 교집합 마커
      if (p > 0.28) {
        const t = easeOutCubic(Math.min(1, (p - 0.28) / 0.22))
        gText('② 각 집합 영역 색칠', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.22; ctx.fillStyle = VIO; ctx.beginPath(); ctx.arc(ax, cy, rr, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = GRN; ctx.beginPath(); ctx.arc(bx, cy, rr, 0, Math.PI * 2); ctx.fill(); ctx.restore()
        gText(`교집합=${r(ppab)}`, cx, cy, ORG, 13, t)
        gCircle(cx, cy, 7, ORG, true, t)
        // 교집합 수직 구분선
        gLine(cx, cy - rr * 0.8, cx, cy + rr * 0.8, ORG, 1.5, t * 0.6)
      }
      // ③ A 단독 영역 강조선
      if (p > 0.46) {
        const t = easeOutCubic(Math.min(1, (p - 0.46) / 0.18))
        gText('③ A만의 영역 분리', cx, 22, VIO, 14, t)
        gLine(ax - rr, cy, ax, cy, VIO, 2.5, t)
        gCircle(ax - rr * 0.5, cy, 5, VIO, true, t)
        gText('A만', ax - rr * 0.5, cy - 18, VIO, 12, t)
      }
      // ④ B 단독 영역 강조선
      if (p > 0.6) {
        const t = easeOutCubic(Math.min(1, (p - 0.6) / 0.18))
        gText('④ B만의 영역 분리', cx, 22, GRN, 14, t)
        gLine(bx, cy, bx + rr, cy, GRN, 2.5, t)
        gCircle(bx + rr * 0.5, cy, 5, GRN, true, t)
        gText('B만', bx + rr * 0.5, cy - 18, GRN, 12, t)
      }
      // ⑤ 합사건 수식
      if (p > 0.76) {
        const t = easeOutCubic(Math.min(1, (p - 0.76) / 0.2))
        gText('⑤ 합사건 확률 계산', cx, 22, ORG, 14, t)
        gText(`P(A∪B) = ${r(ppa)}+${r(ppb)}-${r(ppab)} = ${r(pUnion)}`, cx, H - 38, ORG, 14, t)
        gText('겹치는 교집합을 한 번 빼야 한다', cx, H - 18, MINT, 13, t)
        // 결과 강조 하단 경계선
        gLine(cx - 140, H - 50, cx + 140, H - 50, MINT, 1, t * 0.5)
        gCircle(cx - 140, H - 50, 4, MINT, true, t)
        gCircle(cx + 140, H - 50, 4, MINT, true, t)
      }
      break
    }

    case 'conditional_prob': {
      const cpa = v('pa', 0.5), cpab = Math.min(cpa, v('pab', 0.2))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const bw = Math.min(200, W - 80), bh = Math.min(110, H - 110)
      const bx1 = cx - bw / 2, by1 = cy - bh / 2
      const aw = bw * cpa, abw = aw * (cpab / cpa)
      const pBA = r(cpab / cpa)
      // ① 전체 표본공간
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.18))
        gText('① 전체 표본공간 설정', cx, 22, WHITE, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = WHITE; ctx.lineWidth = 2; ctx.strokeRect(bx1, by1, bw, bh); ctx.restore()
        gText('Ω', bx1 + 10, by1 + 12, 'rgba(255,255,255,0.4)', 12, t)
        // 상하 경계 파티션 선
        gLine(bx1, by1, bx1 + bw, by1, 'rgba(255,255,255,0.3)', 1, t)
        gLine(bx1, by1 + bh, bx1 + bw, by1 + bh, 'rgba(255,255,255,0.3)', 1, t)
      }
      // ② A 영역 파티션
      if (p > 0.22) {
        const t = easeOutCubic(Math.min(1, (p - 0.22) / 0.2))
        gText('② 사건 A 파티션 분리', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.3; ctx.fillStyle = VIO; ctx.fillRect(bx1, by1, aw, bh); ctx.restore()
        gText(`P(A)=${r(cpa)}`, bx1 + aw / 2, by1 - 14, VIO, 13, t)
        // A 우측 경계 수직 파티션선
        gLine(bx1 + aw, by1, bx1 + aw, by1 + bh, VIO, 2, t)
        gCircle(bx1 + aw, by1, 4, VIO, true, t)
        gCircle(bx1 + aw, by1 + bh, 4, VIO, true, t)
      }
      // ③ A가 일어난 후 축소된 세계
      if (p > 0.42) {
        const t = easeOutCubic(Math.min(1, (p - 0.42) / 0.2))
        gText('③ A 조건 → 세계 축소', cx, 22, GRN, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.4; ctx.fillStyle = GRN; ctx.fillRect(bx1, by1, abw, bh); ctx.restore()
        gText('A∩B', bx1 + abw / 2, cy, GRN, 12, t)
        // A∩B 경계선
        gLine(bx1 + abw, by1, bx1 + abw, by1 + bh, GRN, 2, t)
        gCircle(bx1 + abw, cy, 5, GRN, true, t)
      }
      // ④ 비율 화살표
      if (p > 0.6) {
        const t = easeOutCubic(Math.min(1, (p - 0.6) / 0.18))
        gText('④ A 안에서 B의 비율', cx, 22, ORG, 14, t)
        gLine(bx1, cy + bh / 2 + 12, bx1 + aw, cy + bh / 2 + 12, VIO, 2.5, t)
        gLine(bx1, cy + bh / 2 + 22, bx1 + abw, cy + bh / 2 + 22, GRN, 2.5, t)
        gCircle(bx1 + aw, cy + bh / 2 + 12, 4, VIO, true, t)
        gCircle(bx1 + abw, cy + bh / 2 + 22, 4, GRN, true, t)
        gText(`A폭`, bx1 + aw / 2, cy + bh / 2 + 8, VIO, 10, t)
        gText(`A∩B폭`, bx1 + abw / 2, cy + bh / 2 + 18, GRN, 10, t)
      }
      // ⑤ 조건부 확률 수식
      if (p > 0.76) {
        const t = easeOutCubic(Math.min(1, (p - 0.76) / 0.2))
        gText('⑤ 조건부 확률 공식', cx, 22, MINT, 14, t)
        gText(`P(B|A) = P(A∩B)/P(A) = ${r(cpab)}/${r(cpa)} = ${pBA}`, cx, H - 22, MINT, 14, t)
        gLine(cx - 150, H - 34, cx + 150, H - 34, MINT, 1, t * 0.5)
        gCircle(cx - 150, H - 34, 3, MINT, true, t)
        gCircle(cx + 150, H - 34, 3, MINT, true, t)
      }
      break
    }

    case 'independence': {
      const ipa = v('pa', 0.3), ipb = v('pb', 0.4)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const pab = ipa * ipb
      const boxW = 80, boxH = 44
      const ax = cx - 110, bx2 = cx + 40
      // ① 독립: 두 사건 박스
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.22))
        gText('① 두 독립 사건 A, B', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2; ctx.shadowBlur = 10; ctx.shadowColor = VIO
        ctx.strokeRect(ax, cy - boxH / 2, boxW, boxH); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = GRN; ctx.lineWidth = 2; ctx.shadowBlur = 10; ctx.shadowColor = GRN
        ctx.strokeRect(bx2, cy - boxH / 2, boxW, boxH); ctx.restore()
        gText(`A: ${r(ipa)}`, ax + boxW / 2, cy, VIO, 14, t)
        gText(`B: ${r(ipb)}`, bx2 + boxW / 2, cy, GRN, 14, t)
        // 박스 상단 기준선
        gLine(ax, cy - boxH / 2 - 10, bx2 + boxW, cy - boxH / 2 - 10, 'rgba(255,255,255,0.15)', 1, t)
      }
      // ② 비교선: A와 B 사이 분리선
      if (p > 0.28) {
        const t = easeOutCubic(Math.min(1, (p - 0.28) / 0.2))
        gText('② 독립이면 서로 영향 없음', cx, 22, GRN, 14, t)
        gLine(ax + boxW + 5, cy, bx2 - 5, cy, 'rgba(255,255,255,0.3)', 1.5, t)
        gCircle(ax + boxW + 5, cy, 4, VIO, true, t)
        gCircle(bx2 - 5, cy, 4, GRN, true, t)
        gText('독립', cx, cy - 14, 'rgba(255,255,255,0.5)', 11, t)
      }
      // ③ 곱셈법칙 비교
      if (p > 0.46) {
        const t = easeOutCubic(Math.min(1, (p - 0.46) / 0.2))
        gText('③ 곱셈법칙 검증', cx, 22, ORG, 14, t)
        gText(`P(A)×P(B) = ${r(ipa)}×${r(ipb)} = ${r(pab)}`, cx, cy + 50, ORG, 14, t)
        gLine(cx - 130, cy + 38, cx + 130, cy + 38, ORG, 1, t * 0.5)
        gCircle(cx - 130, cy + 38, 3, ORG, true, t)
        gCircle(cx + 130, cy + 38, 3, ORG, true, t)
      }
      // ④ 독립 성립 결론
      if (p > 0.62) {
        const t = easeOutCubic(Math.min(1, (p - 0.62) / 0.18))
        gText('④ P(A∩B) = P(A)×P(B) 이면 독립!', cx, cy + 75, MINT, 13, t)
        gLine(cx - 150, cy + 64, cx + 150, cy + 64, MINT, 1, t * 0.4)
        gCircle(cx, cy + 64, 4, MINT, true, t)
      }
      // ⑤ 종속 비교 + 결론
      if (p > 0.78) {
        const t = easeOutCubic(Math.min(1, (p - 0.78) / 0.18))
        gText('⑤ 종속이면 A 발생 시 B 확률 변함', cx, cy + 100, '#aaa', 13, t)
        gText('독립 = 곱셈 법칙 성립', cx, H - 22, MINT, 14, t)
        gLine(cx - 100, H - 34, cx + 100, H - 34, MINT, 1, t * 0.5)
        gCircle(cx - 100, H - 34, 3, MINT, true, t)
        gCircle(cx + 100, H - 34, 3, MINT, true, t)
      }
      break
    }

    case 'discrete_rv': {
      const drn = Math.max(2, Math.min(8, Math.round(v('n', 6))))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const prob = 1 / drn, ev = (drn + 1) / 2
      const barW = Math.min(50, (W - 60) / drn - 4), maxBH = H - 110, baseY = H - 40
      const ox = cx - drn * (barW + 4) / 2
      // ① 막대 그래프 그리기
      if (p > 0.02) gText('① 확률분포 막대 그래프', cx, 22, VIO, 14, easeOutCubic(Math.min(1, (p - 0.02) / 0.15)))
      for (let i = 1; i <= drn; i++) {
        const bh = prob * maxBH * 2
        const delay = 0.05 + (i - 1) * (0.28 / drn)
        if (p < delay) continue
        const t = easeOutCubic(Math.min(1, (p - delay) / 0.12))
        const x = ox + (i - 1) * (barW + 4)
        ctx.save(); ctx.globalAlpha = t * 0.45; ctx.fillStyle = VIO; ctx.fillRect(x, baseY - bh * t, barW, bh * t); ctx.restore()
        // 막대 윤곽선 (gLine 대용 strokeRect)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 1.5; ctx.strokeRect(x, baseY - bh * t, barW, bh * t); ctx.restore()
        gText(String(i), x + barW / 2, baseY + 14, '#999', 12, t)
        gText(`1/${drn}`, x + barW / 2, baseY - bh * t - 12, VIO, 10, t)
        // 각 막대 상단 마커
        gCircle(x + barW / 2, baseY - bh * t, 4, GRN, true, t * 0.8)
        // 막대 좌우 윤곽선 보조선
        gLine(x, baseY, x, baseY - bh * t, VIO, 1, t * 0.3)
        gLine(x + barW, baseY, x + barW, baseY - bh * t, VIO, 1, t * 0.3)
      }
      // ② 베이스라인
      if (p > 0.25) {
        const t = easeOutCubic(Math.min(1, (p - 0.25) / 0.15))
        gText('② 베이스라인 (확률의 합=1)', cx, 22, GRN, 14, t)
        gLine(ox - 5, baseY, ox + drn * (barW + 4) + 5, baseY, 'rgba(255,255,255,0.4)', 1.5, t)
        gCircle(ox - 5, baseY, 3, WHITE, true, t)
        gCircle(ox + drn * (barW + 4) + 5, baseY, 3, WHITE, true, t)
      }
      // ③ 균등분포 수평선
      if (p > 0.42) {
        const t = easeOutCubic(Math.min(1, (p - 0.42) / 0.18))
        const bh = prob * maxBH * 2
        gText('③ 균등분포: 모두 같은 높이', cx, 22, ORG, 14, t)
        gLine(ox, baseY - bh, ox + drn * (barW + 4), baseY - bh, ORG, 1.5, t)
        gCircle(ox, baseY - bh, 4, ORG, true, t)
        gCircle(ox + drn * (barW + 4), baseY - bh, 4, ORG, true, t)
      }
      // ④ 기댓값 수직선
      if (p > 0.58) {
        const t = easeOutCubic(Math.min(1, (p - 0.58) / 0.2))
        const evX = ox + (ev - 1) * (barW + 4) + barW / 2
        gText('④ 기댓값 E(X) 위치', cx, 22, ORG, 14, t)
        gLine(evX, baseY + 8, evX, baseY - maxBH * 0.55, ORG, 2.5, t)
        gCircle(evX, baseY - maxBH * 0.55, 6, ORG, true, t)
        gText(`E(X) = ${r(ev)}`, evX + 25, baseY - maxBH * 0.48, ORG, 14, t)
      }
      // ⑤ 결론
      if (p > 0.76) {
        const t = easeOutCubic(Math.min(1, (p - 0.76) / 0.2))
        gText('⑤ 무한 반복 시 평균값', cx, 22, MINT, 14, t)
        gText(`무한히 반복하면 평균 ${r(ev)}`, cx, H - 22, MINT, 14, t)
        gLine(cx - 110, H - 34, cx + 110, H - 34, MINT, 1, t * 0.5)
        gCircle(cx - 110, H - 34, 3, MINT, true, t)
        gCircle(cx + 110, H - 34, 3, MINT, true, t)
      }
      break
    }

    case 'binomial_dist': {
      const bdn = Math.max(2, Math.min(20, Math.round(v('n', 10)))), bdp = Math.max(0.05, Math.min(0.95, v('p', 0.5)))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const C2 = (n: number, k: number) => { if (k > n || k < 0) return 0; if (k > n - k) k = n - k; let r2 = 1; for (let i = 0; i < k; i++) r2 = r2 * (n - i) / (i + 1); return Math.round(r2) }
      const barW = Math.min(30, (W - 60) / (bdn + 1) - 2), maxBH = H - 100, baseY = H - 40
      const ox = cx - (bdn + 1) * (barW + 2) / 2
      let maxP = 0, peakK = 0
      for (let k = 0; k <= bdn; k++) { const pk = C2(bdn, k) * Math.pow(bdp, k) * Math.pow(1 - bdp, bdn - k); if (pk > maxP) { maxP = pk; peakK = k } }
      // ① 막대 그리기
      if (p > 0.02) gText(`① 이항분포 B(${bdn}, ${r(bdp)})`, cx, 22, VIO, 14, easeOutCubic(Math.min(1, (p - 0.02) / 0.12)))
      for (let k = 0; k <= bdn; k++) {
        const pk = C2(bdn, k) * Math.pow(bdp, k) * Math.pow(1 - bdp, bdn - k)
        const bh = (pk / maxP) * maxBH * 0.72
        const delay = 0.05 + k * (0.38 / (bdn + 1))
        if (p < delay) continue
        const t = easeOutCubic(Math.min(1, (p - delay) / 0.1))
        const x = ox + k * (barW + 2)
        ctx.save(); ctx.globalAlpha = t * 0.5; ctx.fillStyle = VIO; ctx.fillRect(x, baseY - bh * t, barW, bh * t); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 1; ctx.strokeRect(x, baseY - bh * t, barW, bh * t); ctx.restore()
        if (barW > 12) gText(String(k), x + barW / 2, baseY + 13, 'rgba(255,255,255,0.4)', 9, t)
        // 막대 상단 마커 (상위 3개 강조)
        if (Math.abs(k - peakK) <= 1) gCircle(x + barW / 2, baseY - bh * t, 3, GRN, true, t * 0.9)
      }
      // ② 베이스라인
      if (p > 0.3) {
        const t = easeOutCubic(Math.min(1, (p - 0.3) / 0.15))
        gText('② 기준선과 전체 합=1', cx, 22, GRN, 14, t)
        gLine(ox - 4, baseY, ox + (bdn + 1) * (barW + 2) + 4, baseY, 'rgba(255,255,255,0.35)', 1.5, t)
        gCircle(ox - 4, baseY, 3, WHITE, true, t)
        gCircle(ox + (bdn + 1) * (barW + 2) + 4, baseY, 3, WHITE, true, t)
      }
      // ③ 꼭짓점(최빈값) 강조선
      if (p > 0.5) {
        const t = easeOutCubic(Math.min(1, (p - 0.5) / 0.18))
        const peakPk = C2(bdn, peakK) * Math.pow(bdp, peakK) * Math.pow(1 - bdp, bdn - peakK)
        const peakBH = (peakPk / maxP) * maxBH * 0.72
        const peakX = ox + peakK * (barW + 2) + barW / 2
        gText('③ 최빈값(최고점) 강조', cx, 22, ORG, 14, t)
        gLine(peakX, baseY, peakX, baseY - peakBH - 18, ORG, 2, t)
        gCircle(peakX, baseY - peakBH - 18, 7, ORG, true, t)
        gText(`최빈: k=${peakK}`, peakX + 20, baseY - peakBH - 22, ORG, 12, t)
        // 종모양 커브 오버레이 선
        gLine(ox, baseY - maxBH * 0.05, ox + (bdn + 1) * (barW + 2), baseY - maxBH * 0.05, ORG, 1, t * 0.3)
      }
      // ④ 기댓값
      if (p > 0.65) {
        const t = easeOutCubic(Math.min(1, (p - 0.65) / 0.18))
        const meanX = ox + bdp * bdn * (barW + 2) + barW / 2
        gText('④ 기댓값 E(X) = n·p', cx, 22, GRN, 14, t)
        gLine(meanX, baseY + 5, meanX, baseY - maxBH * 0.3, GRN, 2.5, t)
        gCircle(meanX, baseY - maxBH * 0.3, 5, GRN, true, t)
        gText(`E(X)=${r(bdn * bdp)}`, meanX + 22, baseY - maxBH * 0.26, GRN, 13, t)
      }
      // ⑤ 정규분포 근사 설명
      if (p > 0.8) {
        const t = easeOutCubic(Math.min(1, (p - 0.8) / 0.18))
        gText('⑤ n 증가 → 정규분포 근사', cx, 22, MINT, 14, t)
        gText('n이 커지면 → 정규분포 근사', cx, H - 22, MINT, 14, t)
        gLine(cx - 120, H - 35, cx + 120, H - 35, MINT, 1, t * 0.5)
        gCircle(cx - 120, H - 35, 3, MINT, true, t)
        gCircle(cx + 120, H - 35, 3, MINT, true, t)
      }
      break
    }

    // ══════════════════════════════════════════
    // H062~H075 — 통계·좌표·미분 Canvas 2D (마지막)
    // ══════════════════════════════════════════

    case 'sampling_dist': {
      const sdn = Math.max(2, Math.min(50, Math.round(v('n', 10))))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const baseY = cy + 30, sc = 48
      const sigma = 1 / Math.sqrt(sdn)
      // ① 모집단 분포 (균등)
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① 모집단 균등분포', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.55; ctx.strokeStyle = VIO; ctx.lineWidth = 2; ctx.beginPath()
        for (let x = -3; x <= 3; x += 0.05) { const y = 0.3; const sx = cx + x * sc, sy = baseY - y * 80; if (x === -3) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        gText('균등', cx, baseY - 42, VIO, 12, t)
        // 균등 분포 경계 시그마 밴드선
        gLine(cx - 3 * sc, baseY - 80 * 0.3, cx + 3 * sc, baseY - 80 * 0.3, VIO, 1, t * 0.4)
        gCircle(cx - 3 * sc, baseY - 80 * 0.3, 3, VIO, true, t)
        gCircle(cx + 3 * sc, baseY - 80 * 0.3, 3, VIO, true, t)
      }
      // ② 표본평균 분포 (좁은 종모양)
      if (p > 0.28) {
        const t = easeOutCubic(Math.min(1, (p - 0.28) / 0.28))
        gText('② 표본평균 분포 (종모양)', cx, 22, GRN, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = GRN; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = GRN; ctx.beginPath()
        for (let x = -3; x <= 3; x += 0.05) {
          const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * (x / sigma) * (x / sigma))
          const sx = cx + x * sc, sy = baseY - y * 40 * sigma
          if (x === -3) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy)
        }
        ctx.stroke(); ctx.restore()
        // 피크 마커
        const peakY = baseY - (1 / (sigma * Math.sqrt(2 * Math.PI))) * 40 * sigma
        gCircle(cx, peakY, 6, GRN, true, t)
      }
      // ③ ±1σ 밴드선
      if (p > 0.48) {
        const t = easeOutCubic(Math.min(1, (p - 0.48) / 0.2))
        gText('③ ±1 표준오차 구간', cx, 22, ORG, 14, t)
        gLine(cx - sigma * sc, baseY - 15, cx - sigma * sc, baseY + 12, ORG, 2, t)
        gLine(cx + sigma * sc, baseY - 15, cx + sigma * sc, baseY + 12, ORG, 2, t)
        gLine(cx - sigma * sc, baseY + 6, cx + sigma * sc, baseY + 6, ORG, 1.5, t)
        gCircle(cx - sigma * sc, baseY - 15, 4, ORG, true, t)
        gCircle(cx + sigma * sc, baseY - 15, 4, ORG, true, t)
        gText('±σ', cx, baseY + 20, ORG, 12, t)
      }
      // ④ 표준오차 수치
      if (p > 0.64) {
        const t = easeOutCubic(Math.min(1, (p - 0.64) / 0.2))
        gText('④ 표준오차 계산', cx, 22, ORG, 14, t)
        gText(`n=${sdn}, SE = 1/√${sdn} = ${r(sigma)}`, cx, baseY + 38, ORG, 13, t)
        gLine(cx - 130, baseY + 27, cx + 130, baseY + 27, ORG, 1, t * 0.4)
        gCircle(cx - 130, baseY + 27, 3, ORG, true, t)
        gCircle(cx + 130, baseY + 27, 3, ORG, true, t)
      }
      // ⑤ 결론
      if (p > 0.8) {
        const t = easeOutCubic(Math.min(1, (p - 0.8) / 0.18))
        gText('⑤ n 증가 → 분포 좁아짐', cx, 22, MINT, 14, t)
        gText('n이 커지면 분포가 좁아진다', cx, H - 22, MINT, 14, t)
        gLine(cx - 115, H - 34, cx + 115, H - 34, MINT, 1, t * 0.5)
        gCircle(cx - 115, H - 34, 3, MINT, true, t)
        gCircle(cx + 115, H - 34, 3, MINT, true, t)
      }
      break
    }

    case 'confidence_interval': {
      const cin = Math.max(5, Math.round(v('n', 30))), ciSig = Math.max(0.1, v('sigma', 1))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const se = ciSig / Math.sqrt(cin), margin = 1.96 * se
      const sc = Math.min(80, (W - 80) / 6), lineY = cy - 10
      const lx = cx - margin * sc, rx = cx + margin * sc
      // ① 기준선 + 표본평균
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.18))
        gText('① 표본평균 위치 설정', cx, 22, VIO, 14, t)
        gLine(30, lineY, W - 30, lineY, 'rgba(255,255,255,0.18)', 1.5, t)
        gCircle(cx, lineY, 7, VIO, true, t)
        gText('표본평균 x̄', cx, lineY - 22, VIO, 13, t)
        // 좌우 기준 마커
        gCircle(30, lineY, 3, 'rgba(255,255,255,0.3)', true, t)
        gCircle(W - 30, lineY, 3, 'rgba(255,255,255,0.3)', true, t)
      }
      // ② 신뢰구간 영역
      if (p > 0.26) {
        const t = easeOutCubic(Math.min(1, (p - 0.26) / 0.22))
        gText('② 95% 신뢰구간 구성', cx, 22, GRN, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.25; ctx.fillStyle = GRN; ctx.fillRect(lx, lineY - 18, rx - lx, 36); ctx.restore()
        gLine(lx, lineY - 18, lx, lineY + 18, GRN, 2, t)
        gLine(rx, lineY - 18, rx, lineY + 18, GRN, 2, t)
        gText(`-${r(margin)}`, lx, lineY + 30, GRN, 11, t)
        gText(`+${r(margin)}`, rx, lineY + 30, GRN, 11, t)
        // 끝점 마커
        gCircle(lx, lineY - 18, 4, GRN, true, t)
        gCircle(rx, lineY - 18, 4, GRN, true, t)
      }
      // ③ 오차범위 화살표선
      if (p > 0.46) {
        const t = easeOutCubic(Math.min(1, (p - 0.46) / 0.2))
        gText('③ 오차범위 ±1.96·SE', cx, 22, ORG, 14, t)
        gLine(cx, lineY + 42, lx, lineY + 42, ORG, 2, t)
        gLine(cx, lineY + 42, rx, lineY + 42, ORG, 2, t)
        gCircle(lx, lineY + 42, 4, ORG, true, t)
        gCircle(rx, lineY + 42, 4, ORG, true, t)
        gText(`오차범위 = ${r(margin)}`, cx, lineY + 56, ORG, 12, t)
      }
      // ④ 해석
      if (p > 0.62) {
        const t = easeOutCubic(Math.min(1, (p - 0.62) / 0.2))
        gText('④ 모평균 포함 확률 95%', cx, 22, GRN, 14, t)
        gText('이 안에 모평균이 있을 확률 95%', cx, lineY + 78, ORG, 14, t)
        gLine(cx - 140, lineY + 68, cx + 140, lineY + 68, ORG, 1, t * 0.4)
        gCircle(cx - 140, lineY + 68, 3, ORG, true, t)
        gCircle(cx + 140, lineY + 68, 3, ORG, true, t)
      }
      // ⑤ 최종 수치
      if (p > 0.78) {
        const t = easeOutCubic(Math.min(1, (p - 0.78) / 0.18))
        gText('⑤ n, σ로 오차범위 결정', cx, 22, MINT, 14, t)
        gText(`n=${cin}, σ=${r(ciSig)}, 오차범위=${r(margin)}`, cx, H - 22, MINT, 14, t)
        gLine(cx - 130, H - 34, cx + 130, H - 34, MINT, 1, t * 0.5)
        gCircle(cx - 130, H - 34, 3, MINT, true, t)
        gCircle(cx + 130, H - 34, 3, MINT, true, t)
      }
      break
    }

    case 'proportion_estimate': {
      const pep = Math.max(0.05, Math.min(0.95, v('p', 0.6))), pen = Math.max(10, Math.round(v('n', 100)))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const margin = 1.96 * Math.sqrt(pep * (1 - pep) / pen)
      const rr = Math.min(46, H / 5)
      const pieY = cy - 30
      const lineY = cy + 55, sc2 = (W - 100) * 0.85
      const pcx = 50 + pep * sc2, plx = 50 + Math.max(0, pep - margin) * sc2, prx = 50 + Math.min(1, pep + margin) * sc2
      // ① 표본 비율 원형 그래프
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.22))
        gText('① 표본 비율 파이차트', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.45; ctx.fillStyle = VIO; ctx.beginPath(); ctx.moveTo(cx, pieY); ctx.arc(cx, pieY, rr, -Math.PI / 2, -Math.PI / 2 + pep * Math.PI * 2); ctx.lineTo(cx, pieY); ctx.fill()
        ctx.globalAlpha = t * 0.15; ctx.fillStyle = '#999'; ctx.beginPath(); ctx.moveTo(cx, pieY); ctx.arc(cx, pieY, rr, -Math.PI / 2 + pep * Math.PI * 2, -Math.PI / 2 + Math.PI * 2); ctx.lineTo(cx, pieY); ctx.fill(); ctx.restore()
        gCircle(cx, pieY, rr, VIO, false, t * 0.6)
        gText(`p = ${r(pep)}`, cx, pieY, WHITE, 14, t)
        // 반지름 기준선
        gLine(cx, pieY, cx + Math.cos(-Math.PI / 2 + pep * Math.PI * 2) * rr, pieY + Math.sin(-Math.PI / 2 + pep * Math.PI * 2) * rr, VIO, 1.5, t * 0.6)
        gCircle(cx + Math.cos(-Math.PI / 2 + pep * Math.PI * 2) * rr, pieY + Math.sin(-Math.PI / 2 + pep * Math.PI * 2) * rr, 4, VIO, true, t)
      }
      // ② 수직선 기준
      if (p > 0.32) {
        const t = easeOutCubic(Math.min(1, (p - 0.32) / 0.2))
        gText('② 비율 수직선 설정', cx, 22, GRN, 14, t)
        gLine(50, lineY, W - 50, lineY, 'rgba(255,255,255,0.2)', 1.5, t)
        gCircle(50, lineY, 3, WHITE, true, t)
        gCircle(W - 50, lineY, 3, WHITE, true, t)
        gText('0', 50, lineY + 14, '#777', 11, t)
        gText('1', W - 50, lineY + 14, '#777', 11, t)
      }
      // ③ 신뢰구간 밴드
      if (p > 0.48) {
        const t = easeOutCubic(Math.min(1, (p - 0.48) / 0.22))
        gText('③ 95% 신뢰구간 밴드', cx, 22, GRN, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.28; ctx.fillStyle = GRN; ctx.fillRect(plx, lineY - 10, prx - plx, 20); ctx.restore()
        gLine(plx, lineY - 14, plx, lineY + 14, GRN, 2, t)
        gLine(prx, lineY - 14, prx, lineY + 14, GRN, 2, t)
        gCircle(plx, lineY - 14, 4, GRN, true, t)
        gCircle(prx, lineY - 14, 4, GRN, true, t)
        gCircle(pcx, lineY, 6, ORG, true, t)
        gText(`${r(pep - margin)}`, plx, lineY + 24, GRN, 11, t)
        gText(`${r(pep + margin)}`, prx, lineY + 24, GRN, 11, t)
      }
      // ④ 오차범위 화살표
      if (p > 0.64) {
        const t = easeOutCubic(Math.min(1, (p - 0.64) / 0.2))
        gText('④ 오차범위 계산', cx, 22, ORG, 14, t)
        gLine(pcx, lineY + 32, plx, lineY + 32, ORG, 1.5, t)
        gLine(pcx, lineY + 32, prx, lineY + 32, ORG, 1.5, t)
        gCircle(plx, lineY + 32, 3, ORG, true, t)
        gCircle(prx, lineY + 32, 3, ORG, true, t)
        gText(`±${r(margin)}`, pcx, lineY + 44, ORG, 12, t)
      }
      // ⑤ 최종 결론
      if (p > 0.8) {
        const t = easeOutCubic(Math.min(1, (p - 0.8) / 0.18))
        gText('⑤ n 클수록 오차범위 작아짐', cx, 22, MINT, 14, t)
        gText(`n=${pen}, 오차범위=${r(margin)}`, cx, H - 22, MINT, 14, t)
        gLine(cx - 100, H - 34, cx + 100, H - 34, MINT, 1, t * 0.5)
        gCircle(cx - 100, H - 34, 3, MINT, true, t)
        gCircle(cx + 100, H - 34, 3, MINT, true, t)
      }
      break
    }

    case 'trig_identity': {
      const tiAng = v('angle', 45) * Math.PI / 180
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const rr = Math.min(68, Math.min(W, H) / 3.2)
      const px = cx + Math.cos(tiAng) * rr, py = cy - Math.sin(tiAng) * rr
      const cosV = Math.cos(tiAng), sinV = Math.sin(tiAng)
      // 단위원 + 축
      gCircle(cx, cy, rr, 'rgba(255,255,255,0.15)', false, p)
      gLine(cx - rr - 12, cy, cx + rr + 12, cy, 'rgba(255,255,255,0.12)', 1, p)
      gLine(cx, cy - rr - 12, cx, cy + rr + 12, 'rgba(255,255,255,0.12)', 1, p)
      // ① 단위원 위의 점
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① 단위원 위의 점 P', cx, 22, WHITE, 14, t)
        gLine(cx, cy, px, py, WHITE, 2, t)
        gCircle(px, py, 6, MINT, true, t)
        gText(`P(cos θ, sin θ)`, px + 14, py - 10, MINT, 11, t)
      }
      // ② 삼각형 세 변 (gLine 3개)
      if (p > 0.26) {
        const t = easeOutCubic(Math.min(1, (p - 0.26) / 0.22))
        gText('② 직각삼각형 세 변', cx, 22, VIO, 14, t)
        // 수직 변 (sin)
        gLine(px, py, px, cy, GRN, 2, t)
        // 수평 변 (cos)
        gLine(cx, cy, px, cy, VIO, 2, t)
        // 빗변 (=1)
        gLine(cx, cy, px, py, ORG, 2, t * 0.6)
        gText(`cos=${r(cosV)}`, (cx + px) / 2, cy + 18, VIO, 12, t)
        gText(`sin=${r(sinV)}`, px + 16, (cy + py) / 2, GRN, 12, t)
        gText('빗변=1', (cx + px) / 2 - 18, (cy + py) / 2 - 12, ORG, 12, t)
        // 수평·수직 교점 마커
        gCircle(px, cy, 4, GRN, true, t)
      }
      // ③ cos² 수평 제곱 강조
      if (p > 0.46) {
        const t = easeOutCubic(Math.min(1, (p - 0.46) / 0.2))
        gText('③ cos² 수평 길이 강조', cx, 22, VIO, 14, t)
        gLine(cx, cy + rr * 0.15, px, cy + rr * 0.15, VIO, 3, t)
        gCircle(cx, cy + rr * 0.15, 4, VIO, true, t)
        gCircle(px, cy + rr * 0.15, 4, VIO, true, t)
        gText(`cos²=${r(cosV * cosV)}`, (cx + px) / 2, cy + rr * 0.15 + 14, VIO, 11, t)
      }
      // ④ sin² 수직 제곱 강조
      if (p > 0.62) {
        const t = easeOutCubic(Math.min(1, (p - 0.62) / 0.2))
        const c2 = cosV * cosV, s2 = sinV * sinV
        gText('④ sin² 수직 길이 강조', cx, 22, GRN, 14, t)
        gLine(px + rr * 0.15, py, px + rr * 0.15, cy, GRN, 3, t)
        gCircle(px + rr * 0.15, py, 4, GRN, true, t)
        gCircle(px + rr * 0.15, cy, 4, GRN, true, t)
        gText(`sin²=${r(s2)}`, px + rr * 0.15 + 18, (py + cy) / 2, GRN, 11, t)
        gText(`cos²+sin² = ${r(c2)}+${r(s2)} = ${r(c2 + s2)}`, cx, cy + rr + 28, ORG, 13, t)
      }
      // ⑤ 피타고라스 항등식 결론
      if (p > 0.78) {
        const t = easeOutCubic(Math.min(1, (p - 0.78) / 0.18))
        gText('⑤ 피타고라스 삼각 항등식', cx, 22, MINT, 14, t)
        gText('cos²θ + sin²θ = 1', cx, H - 22, MINT, 15, t)
        gLine(cx - 90, H - 34, cx + 90, H - 34, MINT, 1, t * 0.5)
        gCircle(cx - 90, H - 34, 3, MINT, true, t)
        gCircle(cx + 90, H - 34, 3, MINT, true, t)
      }
      break
    }

    case 'line_eq': {
      const lm = v('m', 2), lb = v('b', 1)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 30, baseY = cy
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.12)', 1, p)
      gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      const yIntX = cx, yIntY = baseY - lb * sc
      const xIntX = cx + (-lb / lm) * sc, xIntY = baseY
      // ① y절편 마커
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① y절편 위치 설정', cx, 22, VIO, 14, t)
        gCircle(yIntX, yIntY, 6, ORG, true, t)
        gText(`y절편(0,${r(lb)})`, yIntX + 22, yIntY - 14, ORG, 12, t)
        // y절편 수평 기준선
        gLine(yIntX - 18, yIntY, yIntX + 18, yIntY, ORG, 1.5, t)
      }
      // ② 직선 그리기
      if (p > 0.24) {
        const t = easeOutCubic(Math.min(1, (p - 0.24) / 0.22))
        gText('② 직선 y=mx+b 그리기', cx, 22, GRN, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = VIO; ctx.beginPath()
        for (let x = -5; x <= 5; x += 0.1) { const y = lm * x + lb; const sx = cx + x * sc, sy = baseY - y * sc; if (sy < 25 || sy > H - 20 || sx < 30 || sx > W - 30) continue; if (x === -5) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy) }
        ctx.stroke(); ctx.restore()
        // x절편 마커
        if (Number.isFinite(xIntX) && xIntX > 30 && xIntX < W - 30) {
          gCircle(xIntX, xIntY, 5, GRN, true, t)
          gText(`x절편(${r(-lb / lm)},0)`, xIntX + 18, xIntY - 14, GRN, 11, t)
        }
      }
      // ③ 기울기 삼각형 (rise/run)
      if (p > 0.44) {
        const t = easeOutCubic(Math.min(1, (p - 0.44) / 0.2))
        gText('③ 기울기 삼각형 rise/run', cx, 22, GRN, 14, t)
        const tx1 = cx + 0.5 * sc, ty1 = baseY - (lm * 0.5 + lb) * sc
        const tx2 = cx + 1.5 * sc, ty2 = baseY - (lm * 1.5 + lb) * sc
        // run 선
        gLine(tx1, ty1, tx2, ty1, GRN, 2, t)
        // rise 선
        gLine(tx2, ty1, tx2, ty2, ORG, 2, t)
        gCircle(tx1, ty1, 4, GRN, true, t)
        gCircle(tx2, ty2, 4, ORG, true, t)
        gText('run=1', (tx1 + tx2) / 2, ty1 + 14, GRN, 11, t)
        gText(`rise=${r(lm)}`, tx2 + 14, (ty1 + ty2) / 2, ORG, 11, t)
      }
      // ④ 기울기 표시
      if (p > 0.6) {
        const t = easeOutCubic(Math.min(1, (p - 0.6) / 0.18))
        gText('④ 기울기·절편 값 표시', cx, 22, VIO, 14, t)
        gText(`기울기 m = ${r(lm)}`, cx + 80, 48, GRN, 13, t)
        gText(`y절편 = ${r(lb)}`, cx + 80, 66, ORG, 13, t)
        gLine(cx + 60, 42, cx + 60, 74, 'rgba(255,255,255,0.2)', 1, t)
        gCircle(cx + 60, 42, 3, GRN, true, t)
        gCircle(cx + 60, 74, 3, ORG, true, t)
      }
      // ⑤ 직선 방정식 결론
      if (p > 0.78) {
        const t = easeOutCubic(Math.min(1, (p - 0.78) / 0.18))
        gText('⑤ 직선 방정식 완성', cx, 22, MINT, 14, t)
        gText(`y = ${r(lm)}x + ${r(lb)}`, cx, H - 22, MINT, 16, t)
        gLine(cx - 70, H - 34, cx + 70, H - 34, MINT, 1, t * 0.5)
        gCircle(cx - 70, H - 34, 3, MINT, true, t)
        gCircle(cx + 70, H - 34, 3, MINT, true, t)
      }
      break
    }

    case 'circle_eq': {
      const ca = v('a', 1), cb = v('b', 1), cr = Math.max(0.5, v('r', 2))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 28, baseY = cy
      const ccx = cx + ca * sc, ccy = baseY - cb * sc
      gLine(30, baseY, W - 30, baseY, 'rgba(255,255,255,0.12)', 1, p)
      gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      // ① 중심점
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.18))
        gText('① 중심점 설정', cx, 22, VIO, 14, t)
        gCircle(ccx, ccy, 6, ORG, true, t)
        gText(`중심(${r(ca)},${r(cb)})`, ccx + 16, ccy - 14, ORG, 12, t)
        // 원점→중심 연결선
        gLine(cx, baseY, ccx, ccy, 'rgba(255,255,255,0.2)', 1, t)
        gCircle(cx, baseY, 4, 'rgba(255,255,255,0.4)', true, t)
      }
      // ② 반지름선
      if (p > 0.24) {
        const t = easeOutCubic(Math.min(1, (p - 0.24) / 0.22))
        gText('② 반지름 r 설정', cx, 22, GRN, 14, t)
        gLine(ccx, ccy, ccx + cr * sc, ccy, GRN, 2.5, t)
        gText(`r=${r(cr)}`, ccx + (cr / 2) * sc, ccy + 16, GRN, 12, t)
        gCircle(ccx + cr * sc, ccy, 5, GRN, true, t)
      }
      // ③ 원 그리기
      if (p > 0.42) {
        const t = easeOutCubic(Math.min(1, (p - 0.42) / 0.25))
        gText('③ 원 그리기', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2.5; ctx.shadowBlur = 10; ctx.shadowColor = VIO
        ctx.beginPath(); ctx.arc(ccx, ccy, cr * sc * t, 0, Math.PI * 2); ctx.stroke(); ctx.restore()
        // 지름 양끝 마커
        gCircle(ccx - cr * sc * t, ccy, 4, VIO, true, t * 0.8)
        gCircle(ccx + cr * sc * t, ccy, 4, VIO, true, t * 0.8)
      }
      // ④ 지름선
      if (p > 0.6) {
        const t = easeOutCubic(Math.min(1, (p - 0.6) / 0.2))
        gText('④ 지름 = 2r 강조', cx, 22, ORG, 14, t)
        gLine(ccx - cr * sc, ccy, ccx + cr * sc, ccy, ORG, 2, t)
        gCircle(ccx - cr * sc, ccy, 5, ORG, true, t)
        gCircle(ccx + cr * sc, ccy, 5, ORG, true, t)
        gText(`지름=${r(cr * 2)}`, ccx, ccy - cr * sc - 14, ORG, 12, t)
      }
      // ⑤ 원의 방정식
      if (p > 0.76) {
        const t = easeOutCubic(Math.min(1, (p - 0.76) / 0.2))
        gText('⑤ 원의 방정식 완성', cx, 22, MINT, 14, t)
        gText(`(x-${r(ca)})²+(y-${r(cb)})²=${r(cr * cr)}`, cx, H - 22, MINT, 14, t)
        gLine(cx - 120, H - 34, cx + 120, H - 34, MINT, 1, t * 0.5)
        gCircle(cx - 120, H - 34, 3, MINT, true, t)
        gCircle(cx + 120, H - 34, 3, MINT, true, t)
      }
      break
    }

    case 'transformation': {
      const tdx = v('dx', 2), tdy = v('dy', 1)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 24
      gLine(30, cy, W - 30, cy, 'rgba(255,255,255,0.08)', 1, p)
      gLine(cx, 30, cx, H - 20, 'rgba(255,255,255,0.08)', 1, p)
      const tri = [[0, 0], [2, 0], [1, 2]]
      const offX = -55
      // ① 원본 삼각형
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① 원본 도형 꼭짓점', cx, 22, VIO, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = VIO; ctx.lineWidth = 2; ctx.beginPath()
        tri.forEach(([x, y], i) => { const sx = cx + x * sc + offX, sy = cy - y * sc; i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy) }); ctx.closePath(); ctx.stroke()
        ctx.globalAlpha = t * 0.15; ctx.fillStyle = VIO; ctx.fill(); ctx.restore()
        // 꼭짓점 마커
        tri.forEach(([x, y]) => { gCircle(cx + x * sc + offX, cy - y * sc, 4, VIO, true, t) })
      }
      // ② 평행이동 도형
      if (p > 0.28) {
        const t = easeOutCubic(Math.min(1, (p - 0.28) / 0.22))
        gText('② 평행이동 도형', cx, 22, GRN, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = GRN; ctx.lineWidth = 2; ctx.beginPath()
        tri.forEach(([x, y], i) => { const sx = cx + (x + tdx) * sc + offX, sy = cy - (y + tdy) * sc; i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy) }); ctx.closePath(); ctx.stroke()
        ctx.globalAlpha = t * 0.15; ctx.fillStyle = GRN; ctx.fill(); ctx.restore()
        tri.forEach(([x, y]) => { gCircle(cx + (x + tdx) * sc + offX, cy - (y + tdy) * sc, 4, GRN, true, t) })
        gText(`(+${r(tdx)}, +${r(tdy)})`, cx + (1 + tdx) * sc + offX + 22, cy - (1 + tdy) * sc, GRN, 12, t)
      }
      // ③ 이동 벡터 화살표
      if (p > 0.44) {
        const t = easeOutCubic(Math.min(1, (p - 0.44) / 0.2))
        gText('③ 이동 벡터 표시', cx, 22, ORG, 14, t)
        const ox0 = cx + tri[0][0] * sc + offX, oy0 = cy - tri[0][1] * sc
        const tx0 = cx + (tri[0][0] + tdx) * sc + offX, ty0 = cy - (tri[0][1] + tdy) * sc
        const ox1 = cx + tri[1][0] * sc + offX, oy1 = cy - tri[1][1] * sc
        const tx1 = cx + (tri[1][0] + tdx) * sc + offX, ty1 = cy - (tri[1][1] + tdy) * sc
        gLine(ox0, oy0, tx0, ty0, ORG, 2, t)
        gLine(ox1, oy1, tx1, ty1, ORG, 1.5, t * 0.6)
        gCircle(ox0, oy0, 3, ORG, true, t)
        gCircle(tx0, ty0, 5, ORG, true, t)
      }
      // ④ 대칭축 y=x 선
      if (p > 0.6) {
        const t = easeOutCubic(Math.min(1, (p - 0.6) / 0.22))
        gText('④ 대칭축 y=x 그리기', cx, 22, ORG, 14, t)
        gLine(cx - 80, cy + 80, cx + 80, cy - 80, 'rgba(255,200,80,0.5)', 1.5, t)
        gCircle(cx - 80, cy + 80, 3, ORG, true, t)
        gCircle(cx + 80, cy - 80, 3, ORG, true, t)
        gText('y=x', cx + 84, cy - 84, ORG, 12, t)
      }
      // ⑤ 대칭이동 도형
      if (p > 0.74) {
        const t = easeOutCubic(Math.min(1, (p - 0.74) / 0.22))
        gText('⑤ y=x 대칭이동 도형', cx, 22, ORG, 14, t)
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = ORG; ctx.lineWidth = 2; ctx.setLineDash([5, 3]); ctx.beginPath()
        tri.forEach(([x, y], i) => { const sx = cx + y * sc + 60, sy = cy - x * sc; i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy) }); ctx.closePath(); ctx.stroke(); ctx.restore()
        tri.forEach(([x, y]) => { gCircle(cx + y * sc + 60, cy - x * sc, 4, ORG, true, t * 0.8) })
      }
      break
    }

    case 'space_vector': {
      const svx = v('x', 2), svy = v('y', 3), svz = v('z', 1)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const sc = 24
      const proj = (x: number, y: number, z: number): [number, number] => [cx + (x - y) * sc * 0.7, cy - z * sc + (x + y) * sc * 0.3]
      const [ox, oy] = proj(0, 0, 0)
      const [px2, py2] = proj(svx, svy, svz)
      const [fx, fy] = proj(svx, svy, 0)
      const [fpx, fpy] = proj(svx, 0, 0)
      const [fpy2x, fpy2y] = proj(0, svy, 0)
      // ① 3축 그리기
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① 공간 3축 설정', cx, 22, WHITE, 14, t)
        const [xx, xy] = proj(4, 0, 0), [yx, yy] = proj(0, 4, 0), [zx, zy] = proj(0, 0, 4)
        gLine(ox, oy, xx, xy, VIO, 2, t); gText('x', xx + 10, xy, VIO, 13, t)
        gLine(ox, oy, yx, yy, GRN, 2, t); gText('y', yx - 16, yy, GRN, 13, t)
        gLine(ox, oy, zx, zy, ORG, 2, t); gText('z', zx + 10, zy, ORG, 13, t)
        gCircle(ox, oy, 4, WHITE, true, t * 0.5)
      }
      // ② 점 P와 벡터
      if (p > 0.28) {
        const t = easeOutCubic(Math.min(1, (p - 0.28) / 0.25))
        gText('② 점 P와 위치벡터', cx, 22, MINT, 14, t)
        gLine(ox, oy, px2, py2, MINT, 2.5, t)
        gCircle(px2, py2, 7, MINT, true, t)
        gText(`P(${r(svx)},${r(svy)},${r(svz)})`, px2 + 16, py2 - 14, MINT, 13, t)
      }
      // ③ xy평면 투영선
      if (p > 0.44) {
        const t = easeOutCubic(Math.min(1, (p - 0.44) / 0.22))
        gText('③ xy평면 투영 수직선', cx, 22, ORG, 14, t)
        ctx.save(); ctx.globalAlpha = t * 0.4; ctx.strokeStyle = ORG; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3])
        ctx.beginPath(); ctx.moveTo(px2, py2); ctx.lineTo(fx, fy); ctx.stroke(); ctx.restore()
        gCircle(fx, fy, 4, ORG, true, t)
        gText('xy투영', fx + 12, fy + 10, ORG, 11, t)
      }
      // ④ x, y축 투영선
      if (p > 0.58) {
        const t = easeOutCubic(Math.min(1, (p - 0.58) / 0.2))
        gText('④ 각 축 투영 분해', cx, 22, VIO, 14, t)
        gLine(fx, fy, fpx, fpy, VIO, 1.5, t)
        gLine(fx, fy, fpy2x, fpy2y, GRN, 1.5, t)
        gCircle(fpx, fpy, 4, VIO, true, t)
        gCircle(fpy2x, fpy2y, 4, GRN, true, t)
        gText(`x=${r(svx)}`, fpx - 16, fpy + 14, VIO, 11, t)
        gText(`y=${r(svy)}`, fpy2x + 14, fpy2y + 14, GRN, 11, t)
      }
      // ⑤ 결론
      if (p > 0.74) {
        const t = easeOutCubic(Math.min(1, (p - 0.74) / 0.2))
        gText('⑤ 3차원 좌표 완성', cx, 22, MINT, 14, t)
        gText('2차원에서 3차원으로 확장', cx, H - 22, MINT, 14, t)
        gLine(cx - 115, H - 34, cx + 115, H - 34, MINT, 1, t * 0.5)
        gCircle(cx - 115, H - 34, 3, MINT, true, t)
        gCircle(cx + 115, H - 34, 3, MINT, true, t)
      }
      break
    }

    case 'exponent_viz': {
      const evBase = Math.max(1.5, v('base', 2))
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const exps = [3, 2, 1, 0, -1, -2]
      const barW = Math.min(48, (W - 60) / exps.length - 6), maxBH = H - 108, baseY = H - 44
      const ox = cx - exps.length * (barW + 6) / 2
      const maxVal = Math.pow(evBase, 3)
      // ① 막대 그리기 + 상단 마커
      if (p > 0.02) gText(`① ${r(evBase)}의 거듭제곱 막대`, cx, 22, VIO, 14, easeOutCubic(Math.min(1, (p - 0.02) / 0.12)))
      for (let i = 0; i < exps.length; i++) {
        const exp = exps[i], val = Math.pow(evBase, exp)
        const bh = Math.max(4, (val / maxVal) * maxBH * 0.72)
        const delay = 0.05 + i * 0.09
        if (p < delay) continue
        const t = easeOutCubic(Math.min(1, (p - delay) / 0.12))
        const x = ox + i * (barW + 6)
        const col = exp >= 0 ? VIO : GRN
        ctx.save(); ctx.globalAlpha = t * 0.5; ctx.fillStyle = col; ctx.fillRect(x, baseY - bh * t, barW, bh * t); ctx.restore()
        ctx.save(); ctx.globalAlpha = t; ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.strokeRect(x, baseY - bh * t, barW, bh * t); ctx.restore()
        gText(`${r(evBase)}^${exp}`, x + barW / 2, baseY + 14, '#999', 10, t)
        gText(`${r(val)}`, x + barW / 2, baseY - bh * t - 12, col, 11, t)
        // 상단 마커
        gCircle(x + barW / 2, baseY - bh * t, 4, col, true, t * 0.9)
      }
      // ② 베이스라인
      if (p > 0.3) {
        const t = easeOutCubic(Math.min(1, (p - 0.3) / 0.15))
        gText('② 기준선 베이스', cx, 22, GRN, 14, t)
        gLine(ox - 6, baseY, ox + exps.length * (barW + 6) + 6, baseY, 'rgba(255,255,255,0.35)', 1.5, t)
        gCircle(ox - 6, baseY, 3, WHITE, true, t)
        gCircle(ox + exps.length * (barW + 6) + 6, baseY, 3, WHITE, true, t)
      }
      // ③ 0승 강조선
      if (p > 0.46) {
        const t = easeOutCubic(Math.min(1, (p - 0.46) / 0.18))
        const zeroIdx = exps.indexOf(0)
        const zx = ox + zeroIdx * (barW + 6) + barW / 2
        const zeroBH = Math.max(4, (1 / maxVal) * maxBH * 0.72)
        gText('③ 0승 = 1 강조', cx, 22, ORG, 14, t)
        gLine(zx, baseY, zx, baseY - zeroBH - 22, ORG, 2.5, t)
        // 1 수평 기준선
        gLine(zx - barW * 0.8, baseY - zeroBH, zx + barW * 0.8, baseY - zeroBH, ORG, 1.5, t * 0.6)
        gCircle(zx, baseY - zeroBH - 22, 7, ORG, true, t)
        gText('= 1', zx + 18, baseY - zeroBH - 22, ORG, 13, t)
      }
      // ④ 나누기 패턴 화살표
      if (p > 0.62) {
        const t = easeOutCubic(Math.min(1, (p - 0.62) / 0.18))
        gText('④ 오른→왼: 나누기 패턴', cx, 22, ORG, 14, t)
        for (let i = 0; i < exps.length - 1; i++) {
          const x1 = ox + i * (barW + 6) + barW / 2
          const x2 = ox + (i + 1) * (barW + 6) + barW / 2
          gLine(x1, baseY - maxBH * 0.08, x2, baseY - maxBH * 0.08, ORG, 1, t * 0.5)
          gCircle(x2, baseY - maxBH * 0.08, 3, ORG, true, t * 0.6)
        }
        gText(`÷${r(evBase)} 패턴`, cx, baseY + 38, ORG, 13, t)
      }
      // ⑤ 결론
      if (p > 0.8) {
        const t = easeOutCubic(Math.min(1, (p - 0.8) / 0.16))
        gText('⑤ 0승=1, 음수승=분수', cx, 22, MINT, 14, t)
        gText(`${r(evBase)}⁰=1, ${r(evBase)}⁻¹=1/${r(evBase)}`, cx, H - 22, MINT, 14, t)
        gLine(cx - 100, H - 34, cx + 100, H - 34, MINT, 1, t * 0.5)
        gCircle(cx - 100, H - 34, 3, MINT, true, t)
        gCircle(cx + 100, H - 34, 3, MINT, true, t)
      }
      break
    }

    case 'coordinate_plane': {
      const cpx1 = v('x1', 1), cpy1 = v('y1', 2), cpx2 = v('x2', 5), cpy2 = v('y2', 6)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const mx = (cpx1 + cpx2) / 2, my = (cpy1 + cpy2) / 2
      const sc = Math.min(28, (W - 80) / 10, (H - 80) / 8)
      const orgX = cx - 70
      gLine(30, cy, W - 30, cy, 'rgba(255,255,255,0.12)', 1, p)
      gLine(orgX, 30, orgX, H - 20, 'rgba(255,255,255,0.12)', 1, p)
      const ax2 = orgX + cpx1 * sc, ay2 = cy - cpy1 * sc
      const bx2 = orgX + cpx2 * sc, by2 = cy - cpy2 * sc
      const mmx = orgX + mx * sc, mmy = cy - my * sc
      // ① 점 A, B 설정
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.2))
        gText('① 두 점 A, B 설정', cx, 22, WHITE, 14, t)
        gCircle(ax2, ay2, 6, VIO, true, t)
        gText(`A(${r(cpx1)},${r(cpy1)})`, ax2 + 14, ay2 - 14, VIO, 12, t)
        gCircle(bx2, by2, 6, GRN, true, t)
        gText(`B(${r(cpx2)},${r(cpy2)})`, bx2 + 14, by2 - 14, GRN, 12, t)
      }
      // ② 선분 AB
      if (p > 0.26) {
        const t = easeOutCubic(Math.min(1, (p - 0.26) / 0.2))
        gText('② 선분 AB 연결', cx, 22, VIO, 14, t)
        gLine(ax2, ay2, bx2, by2, WHITE, 2, t)
      }
      // ③ 중점 구성 보조선 (수평·수직)
      if (p > 0.44) {
        const t = easeOutCubic(Math.min(1, (p - 0.44) / 0.2))
        gText('③ 중점 구성 보조선', cx, 22, ORG, 14, t)
        // 수평 이등분선
        gLine(ax2, ay2, bx2, ay2, ORG, 1.5, t * 0.6)
        // 수직 이등분선
        gLine(bx2, ay2, bx2, by2, ORG, 1.5, t * 0.6)
        gCircle(bx2, ay2, 4, ORG, true, t)
        gLine(mmx, ay2, mmx, mmy, ORG, 1, t * 0.4)
        gLine(ax2, mmy, mmx, mmy, ORG, 1, t * 0.4)
      }
      // ④ 중점 M 마커
      if (p > 0.58) {
        const t = easeOutCubic(Math.min(1, (p - 0.58) / 0.2))
        gText('④ 중점 M 찾기', cx, 22, ORG, 14, t)
        gCircle(mmx, mmy, 8, ORG, true, t)
        gText(`M(${r(mx)},${r(my)})`, mmx + 16, mmy - 16, ORG, 13, t)
        // 중점 수직/수평 확인선
        gLine(mmx, mmy, mmx, cy, 'rgba(255,180,60,0.3)', 1, t)
        gLine(mmx, mmy, orgX, mmy, 'rgba(255,180,60,0.3)', 1, t)
        gCircle(mmx, cy, 3, ORG, true, t * 0.5)
        gCircle(orgX, mmy, 3, ORG, true, t * 0.5)
      }
      // ⑤ 결론
      if (p > 0.74) {
        const t = easeOutCubic(Math.min(1, (p - 0.74) / 0.2))
        gText('⑤ 중점 = x평균, y평균', cx, 22, MINT, 14, t)
        gText('x좌표 평균, y좌표 평균', cx, H - 22, MINT, 14, t)
        gLine(cx - 100, H - 34, cx + 100, H - 34, MINT, 1, t * 0.5)
        gCircle(cx - 100, H - 34, 3, MINT, true, t)
        gCircle(cx + 100, H - 34, 3, MINT, true, t)
      }
      break
    }

    case 'diff_rules': {
      const drx = v('x', 2)
      const VIO = '#534AB7', GRN = '#1D9E75', ORG = '#D85A30'
      const f = drx * drx, g = Math.sin(drx), fp = 2 * drx, gp = Math.cos(drx)
      const chainResult = Math.cos(drx * drx) * 2 * drx
      // ① 곱의 미분 f, g 소개
      if (p > 0.02) {
        const t = easeOutCubic(Math.min(1, (p - 0.02) / 0.22))
        gText('① 두 함수 f, g 설정', cx, 22, VIO, 14, t)
        gText(`f(x) = x² = ${r(f)}`, cx - 70, cy - 42, VIO, 14, t)
        gText(`g(x) = sin(x) = ${r(g)}`, cx - 70, cy - 18, GRN, 14, t)
        // f, g 구분선
        gLine(cx - 160, cy - 4, cx + 100, cy - 4, 'rgba(255,255,255,0.2)', 1, t)
        gCircle(cx - 160, cy - 4, 3, VIO, true, t)
        gCircle(cx + 100, cy - 4, 3, GRN, true, t)
      }
      // ② 곱의 미분 f'g, fg' 계산
      if (p > 0.22) {
        const t = easeOutCubic(Math.min(1, (p - 0.22) / 0.22))
        gText('② 곱의 미분 두 항 분해', cx, 22, GRN, 14, t)
        gText(`f'g = ${r(fp)}·${r(g)} = ${r(fp * g)}`, cx - 70, cy + 18, VIO, 13, t)
        gText(`fg' = ${r(f)}·${r(gp)} = ${r(f * gp)}`, cx + 70, cy + 18, GRN, 13, t)
        gLine(cx - 160, cy + 8, cx + 150, cy + 8, 'rgba(255,255,255,0.15)', 1, t)
        gCircle(cx - 160, cy + 8, 3, VIO, true, t)
        gCircle(cx + 150, cy + 8, 3, GRN, true, t)
      }
      // ③ 합산 결론
      if (p > 0.42) {
        const t = easeOutCubic(Math.min(1, (p - 0.42) / 0.2))
        gText('③ 두 항 합산 = (fg)\'', cx, 22, ORG, 14, t)
        gText(`(fg)' = ${r(fp * g + f * gp)}`, cx, cy + 48, ORG, 16, t)
        gLine(cx - 80, cy + 36, cx + 80, cy + 36, ORG, 1.5, t)
        gCircle(cx - 80, cy + 36, 4, ORG, true, t)
        gCircle(cx + 80, cy + 36, 4, ORG, true, t)
      }
      // ④ 합성함수 체인룰
      if (p > 0.58) {
        const t = easeOutCubic(Math.min(1, (p - 0.58) / 0.22))
        gText('④ 합성함수 체인룰 sin(x²)', cx, 22, GRN, 14, t)
        gText('y = sin(x²)', cx, cy + 76, VIO, 15, t)
        gText(`바깥 미분: cos(x²)`, cx - 80, cy + 96, GRN, 13, t)
        gText(`안쪽 미분: 2x=${r(2 * drx)}`, cx + 72, cy + 96, ORG, 13, t)
        // 두 부분 연결선
        gLine(cx - 80, cy + 86, cx + 150, cy + 86, 'rgba(255,255,255,0.15)', 1, t)
        gCircle(cx - 80, cy + 86, 3, GRN, true, t)
        gCircle(cx + 150, cy + 86, 3, ORG, true, t)
      }
      // ⑤ 체인룰 결과 + 결론
      if (p > 0.76) {
        const t = easeOutCubic(Math.min(1, (p - 0.76) / 0.2))
        gText('⑤ 체인룰 최종 결과', cx, 22, MINT, 14, t)
        gText(`y' = cos(x²)·2x = ${r(chainResult)}`, cx, cy + 118, MINT, 14, t)
        gLine(cx - 130, cy + 108, cx + 130, cy + 108, MINT, 1, t * 0.5)
        gCircle(cx - 130, cy + 108, 3, MINT, true, t)
        gCircle(cx + 130, cy + 108, 3, MINT, true, t)
        gText('체인룰: 껍질 벗기기', cx, H - 22, MINT, 14, t)
      }
      break
    }

    case 'discriminant': {
      const da = v('a', 1), db = v('b', -4), dc = v('c', 3)
      const D = db * db - 4 * da * dc
      const scX = (W - 80) / 10, scY = (H - 80) / 10
      const ox = cx, oy = cy + 20
      // 좌표축
      gLine(40, oy, W - 40, oy, 'rgba(255,255,255,0.2)', 1.5, p)
      gLine(ox, 30, ox, H - 20, 'rgba(255,255,255,0.2)', 1.5, p)
      gText('x', W - 30, oy - 12, '#666', 11, p)
      gText('y', ox + 14, 35, '#666', 11, p)
      // 포물선
      ctx.save(); ctx.globalAlpha = p * 0.9; ctx.strokeStyle = PURPLE; ctx.lineWidth = 2.5
      ctx.shadowBlur = 10; ctx.shadowColor = PURPLE; ctx.beginPath()
      for (let i = -50; i <= 50; i++) {
        const xv = i / 10
        const yv = da * xv * xv + db * xv + dc
        const sx = clx(ox + xv * scX), sy = cly(oy - yv * scY)
        if (i === -50) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy)
      }
      ctx.stroke(); ctx.restore()
      // 근 & 판별식 텍스트
      if (D > 0) {
        const sq = Math.sqrt(D)
        const r1 = (-db - sq) / (2 * da), r2 = (-db + sq) / (2 * da)
        // 교점 표시
        ctx.save(); ctx.fillStyle = MINT; ctx.shadowBlur = 12; ctx.shadowColor = MINT; ctx.globalAlpha = p
        ctx.beginPath(); ctx.arc(clx(ox + r1 * scX), oy, 6, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath(); ctx.arc(clx(ox + r2 * scX), oy, 6, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
        gText(`D = ${r(D)} > 0, 근 2개`, cx, 24, MINT, 14, p)
        gText(`x = ${r(r1)}, ${r(r2)}`, cx, 44, MINT, 12, p)
      } else if (D === 0) {
        const r1 = -db / (2 * da)
        ctx.save(); ctx.fillStyle = PURPLE; ctx.shadowBlur = 12; ctx.shadowColor = PURPLE; ctx.globalAlpha = p
        ctx.beginPath(); ctx.arc(clx(ox + r1 * scX), oy, 7, 0, Math.PI * 2); ctx.fill(); ctx.restore()
        gText(`D = 0, 근 1개 (중근 x=${r(r1)})`, cx, 24, PURPLE, 14, p)
      } else {
        gText(`D = ${r(D)} < 0, 근 없음`, cx, 24, AMBER, 14, p)
      }
      // 계산 과정
      gText(`D = b²-4ac = (${r(db)})²-4·${r(da)}·${r(dc)} = ${r(D)}`, cx, H - 18, '#999', 11, p)
      break
    }

    case 'induction': {
      const nDom = Math.max(2, Math.min(20, Math.round(v('n', 5))))
      const domW = Math.min(30, (W - 60) / nDom - 4), domH = domW * 2.5
      const baseY = cy + domH / 2 + 10, ox = cx - (nDom * (domW + 4)) / 2
      for (let i = 0; i < nDom; i++) {
        const x = ox + i * (domW + 4)
        const color = i === 0 ? '#D85A30' : PURPLE
        // 넘어진 도미노 (비스듬히)
        ctx.save()
        ctx.translate(x + domW / 2, baseY)
        ctx.rotate(-Math.PI / 2 * 0.85)
        ctx.globalAlpha = p * 0.85
        ctx.fillStyle = color + '44'; ctx.strokeStyle = color; ctx.lineWidth = 2
        ctx.shadowBlur = 8; ctx.shadowColor = color
        ctx.fillRect(-domW / 2, -domH / 2, domW, domH)
        ctx.strokeRect(-domW / 2, -domH / 2, domW, domH)
        ctx.restore()
        gText(String(i + 1), x + domW / 2, baseY - domH / 2 - 12, 'rgba(255,255,255,0.5)', 10, p)
      }
      gText(`도미노 ${nDom}개`, cx, 22, AMBER, 14, p)
      gText('P(1) 참 + P(k)→P(k+1) = 모두 참', cx, H - 18, '#999', 12, p)
      break
    }

    case 'conic_section': {
      const cType = Math.round(v('angle', 0)) % 4
      const sc = Math.min(60, Math.min(W - 80, H - 80) / 4)
      // 좌표축
      gLine(cx - sc * 3, cy, cx + sc * 3, cy, 'rgba(255,255,255,0.12)', 1, p)
      gLine(cx, cy - sc * 3, cx, cy + sc * 3, 'rgba(255,255,255,0.12)', 1, p)
      const names = ['원', '타원', '포물선', '쌍곡선']
      const colors = [MINT, PURPLE, AMBER, '#D85A30']
      const col = colors[cType]
      // 곡선
      ctx.save(); ctx.globalAlpha = p; ctx.strokeStyle = col; ctx.lineWidth = 2.5
      ctx.shadowBlur = 12; ctx.shadowColor = col; ctx.beginPath()
      if (cType === 0) { // 원
        ctx.arc(cx, cy, sc * 1.5, 0, Math.PI * 2)
      } else if (cType === 1) { // 타원
        ctx.ellipse(cx, cy, sc * 2, sc * 1.2, 0, 0, Math.PI * 2)
      } else if (cType === 2) { // 포물선 y=x²
        let started = false
        for (let t = -2.5; t <= 2.5; t += 0.05) {
          const sx = cx + t * sc, sy = cy - (t * t * 0.4) * sc + sc * 2
          if (!started) { ctx.moveTo(sx, sy); started = true } else ctx.lineTo(sx, sy)
        }
      } else { // 쌍곡선
        // 좌측 가지
        let started = false
        for (let t = -1.8; t <= 1.8; t += 0.05) {
          const x = -Math.cosh(t) * sc, y = Math.sinh(t) * sc * 0.7
          if (!started) { ctx.moveTo(cx + x, cy - y); started = true } else ctx.lineTo(cx + x, cy - y)
        }
        // 우측 가지
        ctx.moveTo(cx + Math.cosh(-1.8) * sc, cy - Math.sinh(-1.8) * sc * 0.7)
        for (let t = -1.8; t <= 1.8; t += 0.05) {
          const x = Math.cosh(t) * sc, y = Math.sinh(t) * sc * 0.7
          ctx.lineTo(cx + x, cy - y)
        }
      }
      ctx.stroke(); ctx.restore()
      gText(names[cType], cx, 22, col, 16, p)
      gText('0=원  1=타원  2=포물선  3=쌍곡선', cx, H - 18, '#666', 11, p)
      break
    }

    // 나머지 고등 케이스: 앰버 원 fallback
    case 'higher_eq': case 'simul_quad':
    case 'hypothesis_test': {
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

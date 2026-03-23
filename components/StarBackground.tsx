'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  opacity: number
  twinkleSpeed: number
  twinkleOffset: number
  color: string
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  life: number
}

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let stars: Star[] = []
    let shoots: ShootingStar[] = []
    let t = 0

    function getStarColor(): string {
      const r = Math.random()
      if (r < 0.62) return '#ffffff'
      if (r < 0.76) return '#00ffcc'
      if (r < 0.87) return '#a78bfa'
      return '#fbbf24'
    }

    function initStars() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      stars = []
      const n = Math.floor((canvas!.width * canvas!.height) / 1800)
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          r: Math.random() * 1.7 + 0.15,
          opacity: Math.random() * 0.65 + 0.15,
          twinkleSpeed: Math.random() * 0.012 + 0.003,
          twinkleOffset: Math.random() * Math.PI * 2,
          color: getStarColor(),
        })
      }
    }

    function draw() {
      const W = canvas!.width
      const H = canvas!.height
      ctx!.clearRect(0, 0, W, H)

      // 순수 우주 배경
      ctx!.fillStyle = '#000008'
      ctx!.fillRect(0, 0, W, H)

      // 은은한 성운
      const nebulas = [
        { x: 0.25, y: 0.3, c: '#00ffcc', o: 0.016 },
        { x: 0.72, y: 0.55, c: '#7c3aed', o: 0.013 },
        { x: 0.5, y: 0.82, c: '#00ffcc', o: 0.009 },
      ]
      nebulas.forEach(n => {
        const gx = W * n.x, gy = H * n.y
        const g = ctx!.createRadialGradient(gx, gy, 0, gx, gy, W * 0.32)
        g.addColorStop(0, n.c + Math.floor(n.o * 255).toString(16).padStart(2, '0'))
        g.addColorStop(1, 'transparent')
        ctx!.fillStyle = g
        ctx!.fillRect(0, 0, W, H)
      })

      // 수학 격자 (매우 은은하게)
      ctx!.strokeStyle = 'rgba(255,255,255,0.018)'
      ctx!.lineWidth = 0.5
      for (let x = 0; x < W; x += 50) {
        ctx!.beginPath(); ctx!.moveTo(x, 0); ctx!.lineTo(x, H); ctx!.stroke()
      }
      for (let y = 0; y < H; y += 50) {
        ctx!.beginPath(); ctx!.moveTo(0, y); ctx!.lineTo(W, y); ctx!.stroke()
      }

      // 별
      stars.forEach(s => {
        const tw = Math.sin(t * s.twinkleSpeed + s.twinkleOffset)
        const op = s.opacity * (0.5 + tw * 0.5)
        ctx!.save()
        ctx!.globalAlpha = op
        ctx!.fillStyle = s.color
        if (s.r > 1.2) {
          // 십자 광선
          ctx!.shadowBlur = s.r * 5
          ctx!.shadowColor = s.color
          ctx!.strokeStyle = s.color
          ctx!.lineWidth = s.r * 0.2
          ctx!.globalAlpha = op * 0.3
          ctx!.beginPath(); ctx!.moveTo(s.x - s.r * 5, s.y); ctx!.lineTo(s.x + s.r * 5, s.y); ctx!.stroke()
          ctx!.beginPath(); ctx!.moveTo(s.x, s.y - s.r * 5); ctx!.lineTo(s.x, s.y + s.r * 5); ctx!.stroke()
          ctx!.globalAlpha = op
        }
        ctx!.shadowBlur = s.r > 1 ? s.r * 4 : 0
        ctx!.shadowColor = s.color
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.restore()
      })

      // 유성
      if (Math.random() < 0.005) {
        shoots.push({
          x: Math.random() * W * 1.2 - W * 0.1,
          y: Math.random() * H * 0.3,
          vx: 7 + Math.random() * 5,
          vy: 5 + Math.random() * 4,
          length: 60 + Math.random() * 90,
          life: 1,
        })
      }
      shoots = shoots.filter(s => s.life > 0.02)
      shoots.forEach(s => {
        const len = Math.hypot(s.vx, s.vy)
        const tx = s.x - s.vx / len * s.length
        const ty = s.y - s.vy / len * s.length
        const g = ctx!.createLinearGradient(s.x, s.y, tx, ty)
        g.addColorStop(0, `rgba(255,255,255,${s.life})`)
        g.addColorStop(0.35, `rgba(0,255,204,${s.life * 0.5})`)
        g.addColorStop(1, 'transparent')
        ctx!.save()
        ctx!.strokeStyle = g
        ctx!.lineWidth = 1.1
        ctx!.shadowBlur = 5
        ctx!.shadowColor = '#00ffcc'
        ctx!.beginPath(); ctx!.moveTo(s.x, s.y); ctx!.lineTo(tx, ty); ctx!.stroke()
        ctx!.restore()
        s.x += s.vx; s.y += s.vy; s.life -= 0.016
      })

      t++
      animId = requestAnimationFrame(draw)
    }

    initStars()
    draw()

    const handleResize = () => { initStars() }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

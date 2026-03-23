'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, Line } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// =============================================
// H061 정규분포 — 3D 종 모양 곡선
// "평균 중심으로 좌우 대칭, 68-95-99.7 규칙"
// =============================================

const PURPLE = '#534AB7'
const TEAL = '#1D9E75'
const CORAL = '#D85A30'
const TOTAL_DUR = 26

const STEPS = [
  { start: 0, end: 3, name: 'bell' },
  { start: 3, end: 5, name: 'mean' },
  { start: 5, end: 8, name: 'sigma1' },
  { start: 8, end: 11, name: 'sigma2' },
  { start: 11, end: 14, name: 'sigma3' },
  { start: 14, end: 17, name: 'fill68' },
  { start: 17, end: 20, name: 'fill95' },
  { start: 20, end: 22, name: 'result' },
]

function getPhase(t: number) {
  const looped = t % TOTAL_DUR
  for (const s of STEPS) {
    if (looped >= s.start && looped < s.end) {
      return { name: s.name, progress: (looped - s.start) / (s.end - s.start), time: looped }
    }
  }
  return { name: 'hold', progress: 1, time: looped }
}

function easeOut(t: number) { return 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3) }
function easeInOut(t: number) {
  const c = Math.min(Math.max(t, 0), 1)
  return c < 0.5 ? 4*c*c*c : 1 - Math.pow(-2*c+2, 3) / 2
}

// 정규분포 함수
function normal(x: number, mu: number, sigma: number) {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2))
}

const MU = 0, SIGMA = 1, SCALE_Y = 8, SCALE_X = 2.2

// --- 종 모양 곡선 ---
function BellCurve({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const progress = phase.name === 'bell' ? easeInOut(phase.progress) : 1

  const points = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 120; i++) {
      const x = (i / 120) * 8 - 4
      const y = normal(x, MU, SIGMA) * SCALE_Y
      pts.push([x * SCALE_X, y, 0])
    }
    return pts
  }, [])

  const visibleCount = Math.max(2, Math.floor(points.length * progress))

  return (
    <Line
      points={points.slice(0, visibleCount)}
      color={PURPLE}
      lineWidth={3}
      transparent
      opacity={0.9}
    />
  )
}

// --- 영역 채우기 ---
function FilledRegion({
  from, to, color, phase, showAfter, opacity = 0.25
}: {
  from: number, to: number, color: string,
  phase: ReturnType<typeof getPhase>, showAfter: string, opacity?: number
}) {
  const showIdx = STEPS.findIndex(s => s.name === showAfter)
  const currentIdx = STEPS.findIndex(s => s.name === phase.name)
  const isVisible = currentIdx >= showIdx || phase.name === 'hold'
  const progress = phase.name === showAfter ? easeOut(phase.progress) : isVisible ? 1 : 0

  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(from * SCALE_X, 0)
    for (let i = 0; i <= 60; i++) {
      const x = from + (to - from) * i / 60
      s.lineTo(x * SCALE_X, normal(x, MU, SIGMA) * SCALE_Y)
    }
    s.lineTo(to * SCALE_X, 0)
    s.closePath()
    return s
  }, [from, to])

  if (progress <= 0) return null

  return (
    <mesh position={[0, 0, -0.01]}>
      <shapeGeometry args={[shape]} />
      <meshBasicMaterial color={color} transparent opacity={opacity * progress} side={THREE.DoubleSide} />
    </mesh>
  )
}

// --- 평균선 ---
function MeanLine({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['mean','sigma1','sigma2','sigma3','fill68','fill95','result','hold'].includes(phase.name)
  const progress = phase.name === 'mean' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  const peakY = normal(MU, MU, SIGMA) * SCALE_Y

  return (
    <group>
      <Line
        points={[[0, 0, 0.02], [0, peakY * progress, 0.02]]}
        color={CORAL}
        lineWidth={2}
        transparent
        opacity={0.6}
      />
      <Text position={[0, peakY + 0.6, 0.1]} fontSize={0.45} color={CORAL} anchorX="center" fillOpacity={progress}>
        평균 (μ)
      </Text>
    </group>
  )
}

// --- σ 표시들 ---
function SigmaMarkers({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const markers = [
    { n: 1, showAfter: 'sigma1', label: 'σ', color: TEAL },
    { n: 2, showAfter: 'sigma2', label: '2σ', color: PURPLE },
    { n: 3, showAfter: 'sigma3', label: '3σ', color: '#888899' },
  ]

  return (
    <group>
      {markers.map((m) => {
        const showIdx = STEPS.findIndex(s => s.name === m.showAfter)
        const currentIdx = STEPS.findIndex(s => s.name === phase.name)
        const isVisible = currentIdx >= showIdx || phase.name === 'hold'
        const progress = phase.name === m.showAfter ? easeOut(phase.progress) : isVisible ? 1 : 0

        if (progress <= 0) return null

        const x1 = m.n * SIGMA * SCALE_X
        const x2 = -m.n * SIGMA * SCALE_X

        return (
          <group key={m.n}>
            {/* 오른쪽 수직선 */}
            <Line
              points={[[x1, 0, 0.02], [x1, normal(m.n, MU, SIGMA) * SCALE_Y * progress, 0.02]]}
              color={m.color} lineWidth={1} transparent opacity={progress * 0.5}
            />
            {/* 왼쪽 수직선 */}
            <Line
              points={[[x2, 0, 0.02], [x2, normal(m.n, MU, SIGMA) * SCALE_Y * progress, 0.02]]}
              color={m.color} lineWidth={1} transparent opacity={progress * 0.5}
            />
            {/* 오른쪽 라벨 */}
            <Text position={[x1, -0.6, 0.1]} fontSize={0.3} color={m.color} anchorX="center" fillOpacity={progress}>
              +{m.label}
            </Text>
            {/* 왼쪽 라벨 */}
            <Text position={[x2, -0.6, 0.1]} fontSize={0.3} color={m.color} anchorX="center" fillOpacity={progress}>
              -{m.label}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

// --- 퍼센트 라벨 ---
function PercentLabels({ phase }: { phase: ReturnType<typeof getPhase> }) {
  // 68% — σ 범위
  const show68 = ['fill68','fill95','result','hold'].includes(phase.name)
  const p68 = phase.name === 'fill68' ? easeOut(phase.progress) : show68 ? 1 : 0

  // 95% — 2σ 범위
  const show95 = ['fill95','result','hold'].includes(phase.name)
  const p95 = phase.name === 'fill95' ? easeOut(phase.progress) : show95 ? 1 : 0

  return (
    <group>
      {p68 > 0 && (
        <Text position={[0, 1.8, 0.1]} fontSize={0.55} color={TEAL} anchorX="center" fillOpacity={p68}>
          68%
        </Text>
      )}
      {p95 > 0 && (
        <Text position={[0, 0.8, 0.1]} fontSize={0.45} color={PURPLE} anchorX="center" fillOpacity={p95}>
          95%
        </Text>
      )}
    </group>
  )
}

// --- x축 ---
function XAxis() {
  return (
    <group>
      <Line
        points={[[-4 * SCALE_X, 0, 0], [4 * SCALE_X, 0, 0]]}
        color="#555566" lineWidth={1} transparent opacity={0.4}
      />
    </group>
  )
}

// --- 결과 ---
function ResultTexts({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['result', 'hold'].includes(phase.name)
  const progress = phase.name === 'result' ? easeOut(phase.progress) : show ? 1 : 0
  if (progress <= 0) return null

  return (
    <group>
      <Text position={[0, 5.5, 0.1]} fontSize={0.55} color="#ffffff" anchorX="center" fillOpacity={progress}>
        정규분포 N(μ, σ²)
      </Text>
      <Text position={[0, 4.7, 0.1]} fontSize={0.35} color="#999999" anchorX="center" fillOpacity={progress}>
        평균 중심으로 대칭 · 68-95-99.7 규칙
      </Text>
    </group>
  )
}

// --- 바닥 ---
function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#121620" roughness={0.95} />
      </mesh>
      <gridHelper args={[24, 24, '#1a1e2a', '#151925']} />
    </group>
  )
}

// --- 메인 씬 ---
function Scene() {
  const [time, setTime] = useState(0)
  useFrame((_, delta) => { setTime(prev => prev + delta) })
  const phase = getPhase(time)

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 12, 8]} intensity={0.9} castShadow shadow-mapSize={[2048, 2048]} shadow-radius={3} />
      <directionalLight position={[-4, 6, -4]} intensity={0.2} />

      <Floor />
      <XAxis />
      <BellCurve phase={phase} />
      <MeanLine phase={phase} />
      <SigmaMarkers phase={phase} />

      {/* 68% 영역 채우기 */}
      <FilledRegion from={-1} to={1} color={TEAL} phase={phase} showAfter="fill68" opacity={0.2} />
      {/* 95% 영역 채우기 */}
      <FilledRegion from={-2} to={2} color={PURPLE} phase={phase} showAfter="fill95" opacity={0.12} />

      <PercentLabels phase={phase} />
      <ResultTexts phase={phase} />

      <EffectComposer>
        <Bloom intensity={0.3} luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>

      <OrbitControls
        enableZoom={true} enablePan={false} autoRotate={false}
        minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.2}
        minDistance={6} maxDistance={22}
      />
    </>
  )
}

// --- 단계 오버레이 ---
function StepOverlay({ time }: { time: number }) {
  const phase = getPhase(time)
  const stepTexts: Record<string, string> = {
    'bell': '① 종 모양 곡선',
    'mean': '② 평균 (μ) 표시',
    'sigma1': '③ 표준편차 ±σ 범위',
    'sigma2': '④ ±2σ 범위',
    'sigma3': '⑤ ±3σ 범위',
    'fill68': '⑥ μ±σ 안에 68%가 있다',
    'fill95': '⑦ μ±2σ 안에 95%가 있다',
    'result': '⑧ 정규분포 N(μ, σ²)',
  }
  const stepText = stepTexts[phase.name] || ''
  return stepText ? (
    <div style={{
      position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
      fontSize: 15, color: 'rgba(255,255,255,0.85)',
      background: 'rgba(255,255,255,0.08)', padding: '8px 22px',
      borderRadius: 24, pointerEvents: 'none', whiteSpace: 'nowrap',
    }}>
      {stepText}
    </div>
  ) : null
}

// --- 메인 컴포넌트 ---
export default function NormalDistR3F() {
  const [time, setTime] = useState(0)
  useEffect(() => {
    let raf: number
    const tick = () => { setTime(prev => prev + 1/60); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '700px' }}>
      <Canvas shadows camera={{ position: [0, 3, 12], fov: 40 }} gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
        <color attach="background" args={['#0a0e17']} />
        <fog attach="fog" args={['#0a0e17', 15, 40]} />
        <Scene />
      </Canvas>
      <StepOverlay time={time} />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
        <button onClick={() => setTime(0)} style={{
          padding: '8px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', fontSize: 14
        }}>
          다시 보기
        </button>
      </div>
    </div>
  )
}

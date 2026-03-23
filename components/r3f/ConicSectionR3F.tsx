'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, Line } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// =============================================
// H069 이차곡선 — 원뿔을 자르는 각도에 따라
// 원 → 타원 → 포물선 → 쌍곡선
// =============================================

const PURPLE = '#534AB7'
const TEAL = '#1D9E75'
const CORAL = '#D85A30'
const WHITE = '#ffffff'
const TOTAL_DUR = 30 // 26초 + 4초 대기

const STEPS = [
  { start: 0, end: 3, name: 'cone' },          // 원뿔 등장
  { start: 3, end: 7, name: 'cut_circle' },     // 수평 절단 → 원
  { start: 7, end: 8.5, name: 'label_circle' },
  { start: 8.5, end: 12, name: 'cut_ellipse' }, // 비스듬한 절단 → 타원
  { start: 12, end: 13.5, name: 'label_ellipse' },
  { start: 13.5, end: 17, name: 'cut_parabola' }, // 모선과 평행 → 포물선
  { start: 17, end: 18.5, name: 'label_parabola' },
  { start: 18.5, end: 22, name: 'cut_hyperbola' }, // 수직에 가까운 절단 → 쌍곡선
  { start: 22, end: 23.5, name: 'label_hyperbola' },
  { start: 23.5, end: 26, name: 'result' },
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

// --- 원뿔 ---
function Cone({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const progress = phase.name === 'cone' ? easeOut(phase.progress) : 1

  return (
    <group position={[0, 0, 0]} scale={[progress, progress, progress]}>
      <mesh castShadow>
        <coneGeometry args={[2.5, 5, 48, 1, true]} />
        <meshStandardMaterial
          color="#444466"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* 원뿔 와이어프레임 */}
      <mesh>
        <coneGeometry args={[2.5, 5, 24, 1, true]} />
        <meshBasicMaterial color="#555577" wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

// --- 절단면 (평면) ---
function CuttingPlane({
  phase, showAfter, rotation, positionY, color, opacity = 0.25
}: {
  phase: ReturnType<typeof getPhase>, showAfter: string,
  rotation: [number, number, number], positionY: number,
  color: string, opacity?: number
}) {
  const showIdx = STEPS.findIndex(s => s.name === showAfter)
  const currentIdx = STEPS.findIndex(s => s.name === phase.name)
  
  // 이 절단면의 단계와 바로 다음 라벨 단계에서만 보이게
  const myStep = STEPS[showIdx]
  const nextStep = STEPS[showIdx + 1]
  const isActive = phase.name === showAfter || (nextStep && phase.name === nextStep.name)
  
  if (!isActive) return null

  const progress = phase.name === showAfter ? easeInOut(phase.progress) : 1

  return (
    <group position={[0, positionY, 0]} rotation={rotation}>
      <mesh scale={[progress * 4, progress * 4, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * progress} side={THREE.DoubleSide} />
      </mesh>
      {/* 절단면 테두리 */}
      <mesh scale={[progress * 4, progress * 4, 1]}>
        <ringGeometry args={[0.48, 0.5, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.5 * progress} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// --- 절단 결과 곡선 (원, 타원, 포물선, 쌍곡선) ---
function SectionCurve({
  type, phase, showAfter, color, position
}: {
  type: 'circle' | 'ellipse' | 'parabola' | 'hyperbola',
  phase: ReturnType<typeof getPhase>, showAfter: string,
  color: string, position: [number, number, number]
}) {
  const showIdx = STEPS.findIndex(s => s.name === showAfter)
  const currentIdx = STEPS.findIndex(s => s.name === phase.name)
  const isVisible = currentIdx >= showIdx || phase.name === 'hold'
  const progress = phase.name === showAfter ? easeOut(phase.progress) : isVisible ? 1 : 0

  const points = useMemo(() => {
    const pts: [number, number, number][] = []
    const segments = 80

    if (type === 'circle') {
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2
        pts.push([Math.cos(a) * 1.2, 0, Math.sin(a) * 1.2])
      }
    } else if (type === 'ellipse') {
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2
        pts.push([Math.cos(a) * 1.5, 0, Math.sin(a) * 0.9])
      }
    } else if (type === 'parabola') {
      for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * 4 - 2
        pts.push([t, 0, 0.3 * t * t])
      }
    } else if (type === 'hyperbola') {
      // 좌측 가지
      for (let i = 0; i <= segments / 2; i++) {
        const t = (i / (segments / 2)) * 2 - 2
        if (Math.abs(t) > 0.05) {
          const x = -Math.cosh(t) * 0.8
          const z = Math.sinh(t) * 0.6
          pts.push([x, 0, z])
        }
      }
      // 빈 구간
      pts.push([NaN, NaN, NaN] as any) // 선 끊기용
      // 우측 가지
      for (let i = 0; i <= segments / 2; i++) {
        const t = (i / (segments / 2)) * 2 - 2
        if (Math.abs(t) > 0.05) {
          const x = Math.cosh(t) * 0.8
          const z = Math.sinh(t) * 0.6
          pts.push([x, 0, z])
        }
      }
    }
    return pts.filter(p => !isNaN(p[0]))
  }, [type])

  if (progress <= 0 || points.length < 2) return null

  const visibleCount = Math.max(2, Math.floor(points.length * progress))

  return (
    <group position={position}>
      <Line
        points={points.slice(0, visibleCount)}
        color={color}
        lineWidth={3}
        transparent
        opacity={0.9}
      />
    </group>
  )
}

// --- 라벨들 ---
function Labels({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const labels: { name: string, text: string, sub: string, color: string, pos: [number, number, number], showAfter: string }[] = [
    { name: 'circle', text: '원', sub: '수평으로 자르면', color: TEAL, pos: [-5, 3.5, 0], showAfter: 'label_circle' },
    { name: 'ellipse', text: '타원', sub: '비스듬히 자르면', color: PURPLE, pos: [-5, 1.5, 0], showAfter: 'label_ellipse' },
    { name: 'parabola', text: '포물선', sub: '모선과 평행하게 자르면', color: CORAL, pos: [5, 1.5, 0], showAfter: 'label_parabola' },
    { name: 'hyperbola', text: '쌍곡선', sub: '수직에 가깝게 자르면', color: WHITE, pos: [5, 3.5, 0], showAfter: 'label_hyperbola' },
  ]

  return (
    <group>
      {labels.map((l) => {
        const showIdx = STEPS.findIndex(s => s.name === l.showAfter)
        const currentIdx = STEPS.findIndex(s => s.name === phase.name)
        const isVisible = currentIdx >= showIdx || phase.name === 'hold'
        const progress = phase.name === l.showAfter ? easeOut(phase.progress) : isVisible ? 1 : 0

        if (progress <= 0) return null

        return (
          <group key={l.name}>
            <Text position={l.pos} fontSize={0.6} color={l.color} anchorX="center" fillOpacity={progress}>
              {l.text}
            </Text>
            <Text position={[l.pos[0], l.pos[1] - 0.7, l.pos[2]]} fontSize={0.3} color="#999999" anchorX="center" fillOpacity={progress}>
              {l.sub}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

// --- 결과 텍스트 ---
function ResultTexts({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['result', 'hold'].includes(phase.name)
  const progress = phase.name === 'result' ? easeOut(phase.progress) : show ? 1 : 0
  if (progress <= 0) return null

  return (
    <group>
      <Text position={[0, 5.8, 0.1]} fontSize={0.55} color="#ffffff" anchorX="center" fillOpacity={progress}>
        원뿔을 어떻게 자르느냐에 따라 다른 곡선
      </Text>
      <Text position={[0, 5.0, 0.1]} fontSize={0.35} color="#999999" anchorX="center" fillOpacity={progress}>
        원, 타원, 포물선, 쌍곡선 — 모두 이차곡선
      </Text>
    </group>
  )
}

// --- 바닥 ---
function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -2.6, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#121620" roughness={0.95} />
      </mesh>
      <gridHelper args={[24, 24, '#1a1e2a', '#151925']} position={[0, -2.59, 0]} />
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
      <directionalLight position={[6, 14, 8]} intensity={0.9} castShadow
        shadow-mapSize={[2048, 2048]} shadow-radius={3}
        shadow-camera-left={-10} shadow-camera-right={10}
        shadow-camera-top={10} shadow-camera-bottom={-10}
      />
      <directionalLight position={[-4, 6, -6]} intensity={0.2} />

      <Floor />
      <Cone phase={phase} />

      {/* 절단면들 — 각 단계에서만 보임 */}
      <CuttingPlane phase={phase} showAfter="cut_circle" rotation={[0, 0, 0]} positionY={-0.5} color={TEAL} />
      <CuttingPlane phase={phase} showAfter="cut_ellipse" rotation={[0.6, 0, 0]} positionY={0} color={PURPLE} />
      <CuttingPlane phase={phase} showAfter="cut_parabola" rotation={[1.1, 0, 0]} positionY={0.3} color={CORAL} />
      <CuttingPlane phase={phase} showAfter="cut_hyperbola" rotation={[1.45, 0, 0]} positionY={0.5} color={WHITE} opacity={0.15} />

      {/* 절단 결과 곡선들 — 라벨 단계부터 계속 보임 */}
      <SectionCurve type="circle" phase={phase} showAfter="label_circle" color={TEAL} position={[-5, 0, 0]} />
      <SectionCurve type="ellipse" phase={phase} showAfter="label_ellipse" color={PURPLE} position={[-5, -1.5, 0]} />
      <SectionCurve type="parabola" phase={phase} showAfter="label_parabola" color={CORAL} position={[5, -1.5, 0]} />
      <SectionCurve type="hyperbola" phase={phase} showAfter="label_hyperbola" color={WHITE} position={[5, 0, 0]} />

      <Labels phase={phase} />
      <ResultTexts phase={phase} />

      <EffectComposer>
        <Bloom intensity={0.3} luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>

      <OrbitControls
        enableZoom={true} enablePan={false} autoRotate={false}
        minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.2}
        minDistance={8} maxDistance={24}
      />
    </>
  )
}

// --- 단계 오버레이 ---
function StepOverlay({ time }: { time: number }) {
  const phase = getPhase(time)
  const stepTexts: Record<string, string> = {
    'cone': '① 원뿔',
    'cut_circle': '② 수평으로 자르면 → 원',
    'label_circle': '② 원 (Circle)',
    'cut_ellipse': '③ 비스듬히 자르면 → 타원',
    'label_ellipse': '③ 타원 (Ellipse)',
    'cut_parabola': '④ 모선과 평행하게 자르면 → 포물선',
    'label_parabola': '④ 포물선 (Parabola)',
    'cut_hyperbola': '⑤ 거의 수직으로 자르면 → 쌍곡선',
    'label_hyperbola': '⑤ 쌍곡선 (Hyperbola)',
    'result': '⑥ 이차곡선 = 원뿔의 단면!',
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
export default function ConicSectionR3F() {
  const [time, setTime] = useState(0)
  useEffect(() => {
    let raf: number
    const tick = () => { setTime(prev => prev + 1/60); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '700px' }}>
      <Canvas shadows camera={{ position: [0, 4, 14], fov: 40 }} gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
        <color attach="background" args={['#0a0e17']} />
        <fog attach="fog" args={['#0a0e17', 18, 45]} />
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

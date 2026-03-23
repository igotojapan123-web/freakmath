'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, Line } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// =============================================
// H055 미적분의 기본정리
// "넓이의 변화율 = 원래 함수"
// F'(x) = f(x), 즉 적분과 미분은 역연산
// =============================================

const PURPLE = '#534AB7'
const TEAL = '#1D9E75'
const CORAL = '#D85A30'
const TOTAL_DUR = 28

// f(x) = 0.5sin(x) + 1.5 (항상 양수인 예쁜 곡선)
function f(x: number) { return 0.5 * Math.sin(x) + 1.5 }

// F(x) = ∫₀ˣ f(t)dt ≈ -0.5cos(x) + 1.5x + 0.5
function F(x: number) { return -0.5 * Math.cos(x) + 1.5 * x + 0.5 }

const SCALE_X = 1.2
const OFFSET_X = -3

const STEPS = [
  { start: 0, end: 3, name: 'curve_f' },         // f(x) 곡선
  { start: 3, end: 5, name: 'label_f' },
  { start: 5, end: 9, name: 'sweep_area' },       // x가 이동하며 넓이 채워짐
  { start: 9, end: 11, name: 'area_func' },        // 넓이 = F(x) 함수
  { start: 11, end: 15, name: 'curve_F' },         // F(x) 곡선 아래에 그려짐
  { start: 15, end: 18, name: 'derivative' },      // F'(x) = f(x) 보여줌
  { start: 18, end: 21, name: 'connection' },       // 미분↔적분 연결
  { start: 21, end: 24, name: 'result' },
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

// --- f(x) 곡선 (위쪽) ---
function CurveF({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const progress = phase.name === 'curve_f' ? easeInOut(phase.progress) : 1

  const points = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * 6
      pts.push([x * SCALE_X + OFFSET_X, f(x) + 3, 0])
    }
    return pts
  }, [])

  const visible = Math.max(2, Math.floor(points.length * progress))

  return (
    <Line points={points.slice(0, visible)} color={PURPLE} lineWidth={3} transparent opacity={0.9} />
  )
}

// --- 이동하는 x선 + 넓이 채우기 ---
function SweepArea({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['sweep_area','area_func','curve_F','derivative','connection','result','hold'].includes(phase.name)
  const sweepProgress = phase.name === 'sweep_area' ? phase.progress : show ? 1 : 0

  if (sweepProgress <= 0) return null

  const xMax = sweepProgress * 6

  // 채워진 영역
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(OFFSET_X, 3)
    const steps = Math.floor(xMax * 15)
    for (let i = 0; i <= steps; i++) {
      const x = (i / Math.max(steps, 1)) * xMax
      s.lineTo(x * SCALE_X + OFFSET_X, f(x) + 3)
    }
    s.lineTo(xMax * SCALE_X + OFFSET_X, 3)
    s.closePath()
    return s
  }, [xMax])

  return (
    <group>
      {/* 채워진 넓이 */}
      <mesh position={[0, 0, -0.01]}>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* 이동하는 수직선 */}
      <Line
        points={[[xMax * SCALE_X + OFFSET_X, 3, 0.02], [xMax * SCALE_X + OFFSET_X, f(xMax) + 3, 0.02]]}
        color={CORAL}
        lineWidth={2}
        transparent
        opacity={0.8}
      />

      {/* x 위치 라벨 — 수직선 아래 */}
      <Text
        position={[xMax * SCALE_X + OFFSET_X, 2.4, 0.1]}
        fontSize={0.35}
        color={CORAL}
        anchorX="center"
      >
        {`x = ${xMax.toFixed(1)}`}
      </Text>
    </group>
  )
}

// --- 넓이 = F(x) 라벨 ---
function AreaLabel({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['area_func','curve_F','derivative','connection','result','hold'].includes(phase.name)
  const progress = phase.name === 'area_func' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  return (
    <Text position={[5.5, 4.5, 0.1]} fontSize={0.45} color={TEAL} anchorX="center" fillOpacity={progress}>
      넓이 = F(x)
    </Text>
  )
}

// --- F(x) 곡선 (아래쪽) ---
function CurveBigF({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['curve_F','derivative','connection','result','hold'].includes(phase.name)
  const progress = phase.name === 'curve_F' ? easeInOut(phase.progress) : show ? 1 : 0

  const points = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * 6
      pts.push([x * SCALE_X + OFFSET_X, F(x) * 0.4 - 1.5, 0])
    }
    return pts
  }, [])

  const visible = Math.max(2, Math.floor(points.length * progress))
  if (visible < 2) return null

  return (
    <group>
      <Line points={points.slice(0, visible)} color={TEAL} lineWidth={3} transparent opacity={0.9} />
      {progress > 0.5 && (
        <Text position={[5.5, 0.5, 0.1]} fontSize={0.45} color={TEAL} anchorX="center" fillOpacity={progress}>
          F(x) = 넓이 함수
        </Text>
      )}

      {/* F(x)의 x축 */}
      <Line
        points={[[OFFSET_X, -1.5, 0], [6 * SCALE_X + OFFSET_X, -1.5, 0]]}
        color="#555566" lineWidth={1} transparent opacity={progress * 0.3}
      />
    </group>
  )
}

// --- F'(x) = f(x) 연결 ---
function DerivativeConnection({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['derivative','connection','result','hold'].includes(phase.name)
  const progress = phase.name === 'derivative' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  return (
    <group>
      {/* 화살표: F(x) → 미분 → f(x) */}
      <Text position={[-5, 1, 0.1]} fontSize={0.5} color={CORAL} anchorX="center" fillOpacity={progress}>
        미분
      </Text>
      {/* 위쪽 화살표 */}
      <Line
        points={[[-5, 0.4, 0], [-5, -0.8, 0]]}
        color={CORAL} lineWidth={2} transparent opacity={progress * 0.6}
      />
      <Text position={[-5, -1.2, 0.1]} fontSize={0.4} color={TEAL} anchorX="center" fillOpacity={progress}>
        F(x)
      </Text>

      {/* 아래쪽 화살표 */}
      <Line
        points={[[-5, 1.6, 0], [-5, 2.8, 0]]}
        color={CORAL} lineWidth={2} transparent opacity={progress * 0.6}
      />
      <Text position={[-5, 3.2, 0.1]} fontSize={0.4} color={PURPLE} anchorX="center" fillOpacity={progress}>
        f(x)
      </Text>

      <Text position={[-5, -2, 0.1]} fontSize={0.35} color="#888899" anchorX="center" fillOpacity={progress}>
        적분
      </Text>
      <Line
        points={[[-5, -2.4, 0], [-5, -3.2, 0]]}
        color="#888899" lineWidth={1} transparent opacity={progress * 0.4}
      />
    </group>
  )
}

// --- 핵심 공식 ---
function FormulaTexts({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['connection','result','hold'].includes(phase.name)
  const progress = phase.name === 'connection' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  return (
    <Text position={[2, -3.5, 0.1]} fontSize={0.55} color={CORAL} anchorX="center" fillOpacity={progress}>
      F'(x) = f(x)
    </Text>
  )
}

// --- 결과 ---
function ResultTexts({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['result', 'hold'].includes(phase.name)
  const progress = phase.name === 'result' ? easeOut(phase.progress) : show ? 1 : 0
  if (progress <= 0) return null

  return (
    <group>
      <Text position={[2, 6.5, 0.1]} fontSize={0.55} color="#ffffff" anchorX="center" fillOpacity={progress}>
        미적분의 기본정리
      </Text>
      <Text position={[2, 5.7, 0.1]} fontSize={0.35} color="#999999" anchorX="center" fillOpacity={progress}>
        넓이 함수를 미분하면 원래 함수가 돌아온다
      </Text>
      <Text position={[2, 5.0, 0.1]} fontSize={0.35} color="#999999" anchorX="center" fillOpacity={progress}>
        미분과 적분은 서로 역연산!
      </Text>
    </group>
  )
}

// --- f(x)의 x축 ---
function FAxis() {
  return (
    <Line
      points={[[OFFSET_X, 3, 0], [6 * SCALE_X + OFFSET_X, 3, 0]]}
      color="#555566" lineWidth={1} transparent opacity={0.3}
    />
  )
}

// --- f(x) 라벨 ---
function FLabel({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['label_f','sweep_area','area_func','curve_F','derivative','connection','result','hold'].includes(phase.name)
  const progress = phase.name === 'label_f' ? easeOut(phase.progress) : show ? 1 : 0
  if (progress <= 0) return null

  return (
    <Text position={[5.5, 5.5, 0.1]} fontSize={0.45} color={PURPLE} anchorX="center" fillOpacity={progress}>
      f(x) = 원래 함수
    </Text>
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
      <FAxis />
      <CurveF phase={phase} />
      <FLabel phase={phase} />
      <SweepArea phase={phase} />
      <AreaLabel phase={phase} />
      <CurveBigF phase={phase} />
      <DerivativeConnection phase={phase} />
      <FormulaTexts phase={phase} />
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
    'curve_f': '① 함수 f(x) 그리기',
    'label_f': '② 이 곡선 아래 넓이를 구하고 싶다',
    'sweep_area': '③ x가 이동하면 넓이가 변한다',
    'area_func': '④ 넓이 자체가 하나의 함수 F(x)',
    'curve_F': '⑤ F(x) = 넓이 함수',
    'derivative': '⑥ F(x)를 미분하면?',
    'connection': '⑦ F\'(x) = f(x) — 원래 함수가 돌아온다!',
    'result': '⑧ 미분과 적분은 역연산',
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
export default function FundamentalTheoremR3F() {
  const [time, setTime] = useState(0)
  useEffect(() => {
    let raf: number
    const tick = () => { setTime(prev => prev + 1/60); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '700px' }}>
      <Canvas shadows camera={{ position: [0, 3, 14], fov: 40 }} gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
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

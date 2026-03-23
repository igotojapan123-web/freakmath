'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// =============================================
// H045 미분계수 — 할선→접선 수렴 3D 시각화
// "두 점 사이 기울기가 → 한 점의 순간 기울기로"
// =============================================

const PURPLE = '#534AB7'
const TEAL = '#1D9E75'
const CORAL = '#D85A30'
const TOTAL_DUR = 26 // 22초 애니메이션 + 4초 대기

// f(x) = 0.15x³ - 0.8x² + 1.5x + 1 (예쁜 곡선)
function f(x: number) {
  return 0.15 * x * x * x - 0.8 * x * x + 1.5 * x + 1
}

// f'(x) = 0.45x² - 1.6x + 1.5
function fPrime(x: number) {
  return 0.45 * x * x - 1.6 * x + 1.5
}

// 고정점 P의 x좌표
const PX = 2.5
const PY = f(PX)

// Q가 접근하는 x좌표 시퀀스
const Q_POSITIONS = [5, 4.2, 3.6, 3.2, 3.0, 2.8, 2.65, 2.55]

const STEPS = [
  { start: 0, end: 2.5, name: 'curve' },
  { start: 2.5, end: 4, name: 'pointP' },
  { start: 4, end: 6.5, name: 'pointQ_far' },
  { start: 6.5, end: 8, name: 'secant1' },
  { start: 8, end: 10, name: 'slope1' },
  { start: 10, end: 16, name: 'approach' },
  { start: 16, end: 18, name: 'tangent' },
  { start: 18, end: 22, name: 'result' },
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
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

// --- 곡선 ---
function CurveShape({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const curvePoints = useMemo(() => {
    const pts: number[] = []
    for (let i = 0; i <= 150; i++) {
      const x = (i / 150) * 6 - 0.5
      pts.push(x - 2.5, f(x), 0)
    }
    return new Float32Array(pts)
  }, [])

  const showCurve = phase.name !== 'hold' || true
  const progress = phase.name === 'curve' ? easeInOut(phase.progress) : 1
  const visibleCount = Math.floor((curvePoints.length / 3) * progress)

  if (visibleCount < 2) return null

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[curvePoints.slice(0, visibleCount * 3), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color={PURPLE} transparent opacity={0.9} />
    </line>
  )
}

// --- 점 P (고정) ---
function PointP({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['pointP','pointQ_far','secant1','slope1','approach','tangent','result','hold'].includes(phase.name)
  const progress = phase.name === 'pointP' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  return (
    <group>
      <mesh position={[PX - 2.5, PY, 0]} scale={progress}>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshStandardMaterial color={CORAL} emissive={CORAL} emissiveIntensity={0.4} />
      </mesh>
      <Text
        position={[PX - 2.5 - 0.6, PY + 0.5, 0.1]}
        fontSize={0.4}
        color={CORAL}
        anchorX="center"
        fillOpacity={progress}
      >
        P
      </Text>
      {/* P 아래로 수직 점선 */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([PX - 2.5, 0, 0, PX - 2.5, PY * progress, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={CORAL} transparent opacity={progress * 0.3} />
      </line>
    </group>
  )
}

// --- 점 Q (움직임) ---
function PointQ({ phase }: { phase: ReturnType<typeof getPhase> }) {
  // Q의 현재 x좌표 계산
  let qx = Q_POSITIONS[0]

  if (phase.name === 'pointQ_far' || phase.name === 'secant1' || phase.name === 'slope1') {
    qx = Q_POSITIONS[0]
  } else if (phase.name === 'approach') {
    const idx = Math.min(Math.floor(phase.progress * Q_POSITIONS.length), Q_POSITIONS.length - 1)
    const nextIdx = Math.min(idx + 1, Q_POSITIONS.length - 1)
    const subProgress = (phase.progress * Q_POSITIONS.length) - idx
    qx = lerp(Q_POSITIONS[idx], Q_POSITIONS[nextIdx], easeInOut(Math.min(subProgress, 1)))
  } else if (['tangent', 'result', 'hold'].includes(phase.name)) {
    qx = PX + 0.01 // 거의 P 위치
  }

  const qy = f(qx)

  const show = ['pointQ_far','secant1','slope1','approach'].includes(phase.name)
  const progress = phase.name === 'pointQ_far' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  return (
    <group>
      <mesh position={[qx - 2.5, qy, 0]} scale={progress}>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.4} />
      </mesh>
      <Text
        position={[qx - 2.5 + 0.6, qy + 0.5, 0.1]}
        fontSize={0.4}
        color={TEAL}
        anchorX="center"
        fillOpacity={progress}
      >
        Q
      </Text>
    </group>
  )
}

// --- 할선 / 접선 ---
function SecantTangentLine({ phase }: { phase: ReturnType<typeof getPhase> }) {
  // Q의 현재 x좌표
  let qx = Q_POSITIONS[0]

  if (phase.name === 'approach') {
    const idx = Math.min(Math.floor(phase.progress * Q_POSITIONS.length), Q_POSITIONS.length - 1)
    const nextIdx = Math.min(idx + 1, Q_POSITIONS.length - 1)
    const subProgress = (phase.progress * Q_POSITIONS.length) - idx
    qx = lerp(Q_POSITIONS[idx], Q_POSITIONS[nextIdx], easeInOut(Math.min(subProgress, 1)))
  } else if (['tangent', 'result', 'hold'].includes(phase.name)) {
    qx = PX + 0.001
  }

  // 할선 기울기 = (f(qx) - f(PX)) / (qx - PX)
  const isTangent = ['tangent', 'result', 'hold'].includes(phase.name)
  const slope = isTangent ? fPrime(PX) : (f(qx) - f(PX)) / (qx - PX)

  const showLine = ['secant1','slope1','approach','tangent','result','hold'].includes(phase.name)
  const progress = phase.name === 'secant1' ? easeOut(phase.progress) : showLine ? 1 : 0

  if (progress <= 0) return null

  // 선 양 끝 계산 (P를 지나는 기울기 slope인 직선)
  const lineLen = 4
  const x1 = PX - lineLen
  const y1 = PY + slope * (-lineLen)
  const x2 = PX + lineLen
  const y2 = PY + slope * (lineLen)

  const lineColor = isTangent ? CORAL : TEAL

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([
              x1 - 2.5, Math.max(y1, -0.5), 0,
              x2 - 2.5, Math.min(y2, 5), 0
            ]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={lineColor} transparent opacity={progress * 0.8} />
      </line>
    </group>
  )
}

// --- 기울기 표시 (Δy/Δx 삼각형) ---
function SlopeTriangle({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['slope1', 'approach'].includes(phase.name)
  
  let qx = Q_POSITIONS[0]
  if (phase.name === 'approach') {
    const idx = Math.min(Math.floor(phase.progress * Q_POSITIONS.length), Q_POSITIONS.length - 1)
    const nextIdx = Math.min(idx + 1, Q_POSITIONS.length - 1)
    const subProgress = (phase.progress * Q_POSITIONS.length) - idx
    qx = lerp(Q_POSITIONS[idx], Q_POSITIONS[nextIdx], easeInOut(Math.min(subProgress, 1)))
  }

  const progress = phase.name === 'slope1' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  const qy = f(qx)
  const dx = qx - PX
  const dy = qy - PY

  return (
    <group>
      {/* 가로선 (Δx) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([
              PX - 2.5, PY, 0.05,
              qx - 2.5, PY, 0.05
            ]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={progress * 0.5} />
      </line>

      {/* 세로선 (Δy) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([
              qx - 2.5, PY, 0.05,
              qx - 2.5, qy, 0.05
            ]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={progress * 0.5} />
      </line>

      {/* Δx 라벨 — 가로선 아래 */}
      <Text
        position={[(PX + qx) / 2 - 2.5, PY - 0.4, 0.1]}
        fontSize={0.3}
        color="#aaaacc"
        anchorX="center"
        fillOpacity={progress}
      >
        {`Δx = ${dx.toFixed(1)}`}
      </Text>

      {/* Δy 라벨 — 세로선 오른쪽 */}
      <Text
        position={[qx - 2.5 + 0.7, (PY + qy) / 2, 0.1]}
        fontSize={0.3}
        color="#aaaacc"
        anchorX="center"
        fillOpacity={progress}
      >
        {`Δy = ${dy.toFixed(1)}`}
      </Text>
    </group>
  )
}

// --- 좌표축 ---
function Axes() {
  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([-3, 0, 0, 4, 0, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#555566" transparent opacity={0.5} />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([-2.5, -0.2, 0, -2.5, 4, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#555566" transparent opacity={0.5} />
      </line>
      <Text position={[4, -0.4, 0.1]} fontSize={0.35} color="#777788" anchorX="center">x</Text>
      <Text position={[-3.1, 4, 0.1]} fontSize={0.35} color="#777788" anchorX="center">y</Text>
    </group>
  )
}

// --- 결과 텍스트 ---
function ResultTexts({ phase }: { phase: ReturnType<typeof getPhase> }) {
  // 현재 기울기 계산
  let qx = Q_POSITIONS[0]
  if (phase.name === 'approach') {
    const idx = Math.min(Math.floor(phase.progress * Q_POSITIONS.length), Q_POSITIONS.length - 1)
    const nextIdx = Math.min(idx + 1, Q_POSITIONS.length - 1)
    const subProgress = (phase.progress * Q_POSITIONS.length) - idx
    qx = lerp(Q_POSITIONS[idx], Q_POSITIONS[nextIdx], easeInOut(Math.min(subProgress, 1)))
  }

  const isTangent = ['tangent', 'result', 'hold'].includes(phase.name)
  const slope = isTangent ? fPrime(PX) : (f(qx) - f(PX)) / (qx - PX)

  // 할선 기울기 (approach 중일 때만)
  const showSecantSlope = ['slope1', 'approach'].includes(phase.name)

  // 접선 결과 (tangent 이후)
  const showTangentResult = ['tangent', 'result', 'hold'].includes(phase.name)
  const tangentProgress = phase.name === 'tangent' ? easeOut(phase.progress) : showTangentResult ? 1 : 0

  // 최종 결과 (result 이후)
  const showFinalResult = ['result', 'hold'].includes(phase.name)
  const finalProgress = phase.name === 'result' ? easeOut(phase.progress) : showFinalResult ? 1 : 0

  return (
    <group>
      {/* 할선 기울기 — 우측 상단 고정 위치 */}
      {showSecantSlope && (
        <Text
          position={[3.5, 4.5, 0.1]}
          fontSize={0.4}
          color={TEAL}
          anchorX="center"
          fillOpacity={1}
        >
          {`할선 기울기 = ${slope.toFixed(2)}`}
        </Text>
      )}

      {/* 접선 도달 */}
      {showTangentResult && !showFinalResult && (
        <Text
          position={[0, 5.2, 0.1]}
          fontSize={0.5}
          color={CORAL}
          anchorX="center"
          fillOpacity={tangentProgress}
        >
          {`접선 기울기 = ${fPrime(PX).toFixed(2)}`}
        </Text>
      )}

      {/* 최종 결과 — 겹침 방지: tangent 텍스트 대신 이것만 보임 */}
      {showFinalResult && (
        <group>
          <Text
            position={[0, 5.5, 0.1]}
            fontSize={0.55}
            color={CORAL}
            anchorX="center"
            fillOpacity={finalProgress}
          >
            {`미분계수 f'(${PX}) = ${fPrime(PX).toFixed(2)}`}
          </Text>
          <Text
            position={[0, 4.7, 0.1]}
            fontSize={0.35}
            color="#999999"
            anchorX="center"
            fillOpacity={finalProgress}
          >
            Q가 P에 한없이 가까워지면 → 순간 변화율
          </Text>
        </group>
      )}
    </group>
  )
}

// --- 바닥 ---
function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#121620" roughness={0.95} />
      </mesh>
      <gridHelper args={[20, 20, '#1a1e2a', '#151925']} />
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
      <directionalLight position={[6, 12, 8]} intensity={0.9} castShadow
        shadow-mapSize={[2048, 2048]} shadow-radius={3} />
      <directionalLight position={[-4, 6, -4]} intensity={0.2} />

      <Floor />
      <Axes />
      <CurveShape phase={phase} />
      <PointP phase={phase} />
      <PointQ phase={phase} />
      <SecantTangentLine phase={phase} />
      <SlopeTriangle phase={phase} />
      <ResultTexts phase={phase} />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={6}
        maxDistance={20}
      />
    </>
  )
}

// --- 단계 오버레이 ---
function StepOverlay({ time }: { time: number }) {
  const phase = getPhase(time)
  const stepTexts: Record<string, string> = {
    'curve': '① 곡선 f(x) 그리기',
    'pointP': '② 고정점 P 설정',
    'pointQ_far': '③ 다른 점 Q를 멀리 찍기',
    'secant1': '④ P와 Q를 잇는 할선 그리기',
    'slope1': '⑤ 할선의 기울기 = Δy / Δx',
    'approach': '⑥ Q를 P에 가까이 이동시키면...',
    'tangent': '⑦ 할선이 접선이 된다!',
    'result': '⑧ 접선의 기울기 = 미분계수',
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
export default function DerivativeR3F() {
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

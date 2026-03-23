'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, Line } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// =============================================
// H034 삼각함수 — 단위원 회전 + sin/cos 실시간
// "원 위의 점이 돌면서 sin, cos 값을 만든다"
// =============================================

const PURPLE = '#534AB7'
const TEAL = '#1D9E75'
const CORAL = '#D85A30'
const TOTAL_DUR = 24 // 20초 애니메이션 + 4초 대기

const STEPS = [
  { start: 0, end: 2.5, name: 'circle' },       // 단위원 그리기
  { start: 2.5, end: 4, name: 'axes_labels' },   // 축 + 라벨
  { start: 4, end: 6, name: 'point' },            // 점 P 등장
  { start: 6, end: 8, name: 'cos_show' },         // cos 투영
  { start: 8, end: 10, name: 'sin_show' },        // sin 투영
  { start: 10, end: 18, name: 'rotate' },         // 점이 한 바퀴 회전하며 sin/cos 실시간
  { start: 18, end: 20, name: 'result' },         // 결과 수식
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

// --- 단위원 ---
function UnitCircle({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = phase.name !== 'hold' || true
  const progress = phase.name === 'circle' ? easeInOut(phase.progress) : 1

  const circlePoints = useMemo(() => {
    const pts: [number, number, number][] = []
    const segments = 100
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push([Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0])
    }
    return pts
  }, [])

  const visibleCount = Math.floor(circlePoints.length * progress)
  if (visibleCount < 2) return null

  return (
    <Line
      points={circlePoints.slice(0, visibleCount)}
      color="#ffffff"
      lineWidth={1.5}
      transparent
      opacity={0.6}
    />
  )
}

// --- 좌표축 ---
function Axes({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['axes_labels','point','cos_show','sin_show','rotate','result','hold'].includes(phase.name)
  const progress = phase.name === 'axes_labels' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  return (
    <group>
      {/* x축 */}
      <Line points={[[-3.8, 0, 0], [3.8, 0, 0]]} color="#555566" lineWidth={1} transparent opacity={progress * 0.5} />
      {/* y축 */}
      <Line points={[[0, -3.8, 0], [0, 3.8, 0]]} color="#555566" lineWidth={1} transparent opacity={progress * 0.5} />

      {/* 축 라벨 — 축 끝에서 충분히 떨어짐 */}
      <Text position={[4.2, -0.4, 0.1]} fontSize={0.4} color="#777788" anchorX="center" fillOpacity={progress}>x</Text>
      <Text position={[-0.5, 4.0, 0.1]} fontSize={0.4} color="#777788" anchorX="center" fillOpacity={progress}>y</Text>

      {/* 1, -1 표시 — 원과 축 교차점 */}
      <Text position={[2.5, -0.5, 0.1]} fontSize={0.3} color="#666677" anchorX="center" fillOpacity={progress}>1</Text>
      <Text position={[-2.5, -0.5, 0.1]} fontSize={0.3} color="#666677" anchorX="center" fillOpacity={progress}>-1</Text>
      <Text position={[-0.5, 2.5, 0.1]} fontSize={0.3} color="#666677" anchorX="center" fillOpacity={progress}>1</Text>
      <Text position={[-0.5, -2.5, 0.1]} fontSize={0.3} color="#666677" anchorX="center" fillOpacity={progress}>-1</Text>

      {/* 원점 */}
      <Text position={[-0.4, -0.4, 0.1]} fontSize={0.3} color="#666677" anchorX="center" fillOpacity={progress}>O</Text>
    </group>
  )
}

// --- 회전하는 점 P + cos/sin 투영 ---
function RotatingPoint({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const showPoint = ['point','cos_show','sin_show','rotate','result','hold'].includes(phase.name)
  const pointProgress = phase.name === 'point' ? easeOut(phase.progress) : showPoint ? 1 : 0

  // 현재 각도 계산
  let angle = Math.PI / 4 // 45도 기본

  if (phase.name === 'rotate') {
    angle = Math.PI / 4 + phase.progress * Math.PI * 2 // 한 바퀴
  } else if (['result', 'hold'].includes(phase.name)) {
    angle = Math.PI / 4 + Math.PI * 2 // 한 바퀴 완료 = 원래 위치
  }

  const px = Math.cos(angle) * 2.5
  const py = Math.sin(angle) * 2.5
  const cosVal = Math.cos(angle)
  const sinVal = Math.sin(angle)

  if (pointProgress <= 0) return null

  // cos 투영 보이기
  const showCos = ['cos_show','sin_show','rotate','result','hold'].includes(phase.name)
  const cosProgress = phase.name === 'cos_show' ? easeOut(phase.progress) : showCos ? 1 : 0

  // sin 투영 보이기
  const showSin = ['sin_show','rotate','result','hold'].includes(phase.name)
  const sinProgress = phase.name === 'sin_show' ? easeOut(phase.progress) : showSin ? 1 : 0

  // 각도 표시
  const angleDeg = Math.round((angle * 180 / Math.PI) % 360)

  return (
    <group>
      {/* 원점→P 반지름 선 */}
      <Line
        points={[[0, 0, 0], [px, py, 0]]}
        color="#ffffff"
        lineWidth={1.5}
        transparent
        opacity={pointProgress * 0.7}
      />

      {/* 점 P — 발광 효과 */}
      <mesh position={[px, py, 0]} scale={pointProgress}>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* P 라벨 — 점에서 바깥쪽으로 */}
      <Text
        position={[px * 1.2, py * 1.2, 0.1]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        fillOpacity={pointProgress}
      >
        P
      </Text>

      {/* 각도 호 */}
      {pointProgress > 0.5 && (
        <Line
          points={Array.from({ length: 30 }, (_, i) => {
            const a = (i / 29) * angle
            return [Math.cos(a) * 0.8, Math.sin(a) * 0.8, 0] as [number, number, number]
          })}
          color={CORAL}
          lineWidth={1.5}
          transparent
          opacity={0.6}
        />
      )}

      {/* 각도 숫자 — 호 바깥쪽 */}
      {pointProgress > 0.5 && (
        <Text
          position={[Math.cos(angle / 2) * 1.2, Math.sin(angle / 2) * 1.2, 0.1]}
          fontSize={0.35}
          color={CORAL}
          anchorX="center"
          fillOpacity={pointProgress * 0.8}
        >
          {`${angleDeg}°`}
        </Text>
      )}

      {/* cos 투영 — P에서 x축으로 점선 */}
      {cosProgress > 0 && (
        <group>
          <Line
            points={[[px, py, 0], [px, 0, 0]]}
            color={TEAL}
            lineWidth={1}
            dashed
            dashSize={0.15}
            gapSize={0.1}
            transparent
            opacity={cosProgress * 0.5}
          />
          {/* x축 위의 cos값 점 */}
          <mesh position={[px, 0, 0]} scale={cosProgress * 0.8}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.5} />
          </mesh>
          {/* cos 막대 — x축 위 */}
          <Line
            points={[[0, -0.15, 0.02], [px * cosProgress, -0.15, 0.02]]}
            color={TEAL}
            lineWidth={4}
            transparent
            opacity={cosProgress * 0.8}
          />
          {/* cos 라벨 — 막대 아래, 겹침 없는 위치 */}
          <Text
            position={[px / 2, -0.7, 0.1]}
            fontSize={0.38}
            color={TEAL}
            anchorX="center"
            fillOpacity={cosProgress}
          >
            {`cos = ${cosVal.toFixed(2)}`}
          </Text>
        </group>
      )}

      {/* sin 투영 — P에서 y축으로 점선 */}
      {sinProgress > 0 && (
        <group>
          <Line
            points={[[px, py, 0], [0, py, 0]]}
            color={PURPLE}
            lineWidth={1}
            dashed
            dashSize={0.15}
            gapSize={0.1}
            transparent
            opacity={sinProgress * 0.5}
          />
          {/* y축 위의 sin값 점 */}
          <mesh position={[0, py, 0]} scale={sinProgress * 0.8}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={0.5} />
          </mesh>
          {/* sin 막대 — y축 옆 */}
          <Line
            points={[[-0.15, 0, 0.02], [-0.15, py * sinProgress, 0.02]]}
            color={PURPLE}
            lineWidth={4}
            transparent
            opacity={sinProgress * 0.8}
          />
          {/* sin 라벨 — 막대 왼쪽, 겹침 없는 위치 */}
          <Text
            position={[-1.2, py / 2, 0.1]}
            fontSize={0.38}
            color={PURPLE}
            anchorX="center"
            fillOpacity={sinProgress}
          >
            {`sin = ${sinVal.toFixed(2)}`}
          </Text>
        </group>
      )}

      {/* 직각 표시 — P에서 x축까지의 직각 네모 */}
      {cosProgress > 0.5 && sinProgress > 0.5 && (
        <Line
          points={[
            [px - 0.25 * Math.sign(px), 0, 0.02],
            [px - 0.25 * Math.sign(px), 0.25 * Math.sign(py), 0.02],
            [px, 0.25 * Math.sign(py), 0.02],
          ]}
          color="#ffffff"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      )}
    </group>
  )
}

// --- sin 파형 궤적 (회전할 때) ---
function SinWaveTrail({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = phase.name === 'rotate'
  if (!show) return null

  const trailPoints = useMemo(() => {
    const pts: [number, number, number][] = []
    const segments = 100
    for (let i = 0; i <= segments; i++) {
      const progress = i / segments
      const angle = Math.PI / 4 + progress * Math.PI * 2
      // 오른쪽으로 펼쳐지는 sin 파형
      pts.push([3.5 + progress * 4, Math.sin(angle) * 2.5, 0])
    }
    return pts
  }, [])

  const visibleCount = Math.floor(trailPoints.length * phase.progress)
  if (visibleCount < 2) return null

  return (
    <group>
      <Line
        points={trailPoints.slice(0, visibleCount)}
        color={PURPLE}
        lineWidth={2}
        transparent
        opacity={0.6}
      />
      {/* sin 파형 라벨 — 파형 위, 겹침 없음 */}
      <Text
        position={[5.5, 3.2, 0.1]}
        fontSize={0.35}
        color={PURPLE}
        anchorX="center"
        fillOpacity={phase.progress > 0.3 ? 1 : 0}
      >
        sin 파형
      </Text>
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
      <Text
        position={[0, 5.2, 0.1]}
        fontSize={0.55}
        color="#ffffff"
        anchorX="center"
        fillOpacity={progress}
      >
        단위원 위의 점 P(cos θ, sin θ)
      </Text>
      <Text
        position={[0, 4.4, 0.1]}
        fontSize={0.38}
        color="#999999"
        anchorX="center"
        fillOpacity={progress}
      >
        원 위를 돌면 cos과 sin이 반복된다
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
      <UnitCircle phase={phase} />
      <Axes phase={phase} />
      <RotatingPoint phase={phase} />
      <SinWaveTrail phase={phase} />
      <ResultTexts phase={phase} />

      {/* 후처리 — Bloom 발광 */}
      <EffectComposer>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={6}
        maxDistance={22}
      />
    </>
  )
}

// --- 단계 오버레이 ---
function StepOverlay({ time }: { time: number }) {
  const phase = getPhase(time)
  const stepTexts: Record<string, string> = {
    'circle': '① 반지름 1인 단위원',
    'axes_labels': '② 좌표축 설정',
    'point': '③ 원 위의 점 P',
    'cos_show': '④ P의 x좌표 = cos θ',
    'sin_show': '⑤ P의 y좌표 = sin θ',
    'rotate': '⑥ P가 원을 돌면서 sin, cos 값이 변한다',
    'result': '⑦ 삼각함수 = 원 위의 좌표!',
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
export default function TrigFuncR3F() {
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

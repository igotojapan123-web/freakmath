'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, Line, Cone } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// =============================================
// H039 평면벡터 — 벡터 합성과 스칼라곱
// "화살표의 방향과 크기로 표현하는 양"
// =============================================

const PURPLE = '#534AB7'
const TEAL = '#1D9E75'
const CORAL = '#D85A30'
const TOTAL_DUR = 24

const STEPS = [
  { start: 0, end: 2.5, name: 'axes' },
  { start: 2.5, end: 5, name: 'vec_a' },        // 벡터 a 등장
  { start: 5, end: 7.5, name: 'vec_b' },         // 벡터 b 등장
  { start: 7.5, end: 11, name: 'translate_b' },   // b를 a 끝으로 평행이동
  { start: 11, end: 14, name: 'vec_sum' },        // a+b 결과 벡터
  { start: 14, end: 17, name: 'scalar' },         // 2a 스칼라곱
  { start: 17, end: 20, name: 'result' },
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
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

// 벡터 값
const AX = 3, AY = 2   // 벡터 a = (3, 2)
const BX = 1, BY = 3   // 벡터 b = (1, 3)

// --- 화살표 (벡터) ---
function Arrow({
  from, to, color, phase, showAfter, label, labelOffset
}: {
  from: [number, number], to: [number, number], color: string,
  phase: ReturnType<typeof getPhase>, showAfter: string,
  label: string, labelOffset: [number, number]
}) {
  const showIdx = STEPS.findIndex(s => s.name === showAfter)
  const currentIdx = STEPS.findIndex(s => s.name === phase.name)
  const isVisible = currentIdx >= showIdx || phase.name === 'hold'
  const progress = phase.name === showAfter ? easeOut(phase.progress) : isVisible ? 1 : 0

  if (progress <= 0) return null

  const curTo: [number, number] = [
    lerp(from[0], to[0], progress),
    lerp(from[1], to[1], progress)
  ]

  const dx = curTo[0] - from[0]
  const dy = curTo[1] - from[1]
  const len = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx)

  return (
    <group>
      {/* 벡터 선 */}
      <Line
        points={[[from[0], from[1], 0], [curTo[0], curTo[1], 0]]}
        color={color}
        lineWidth={3}
        transparent
        opacity={0.9}
      />

      {/* 화살표 머리 */}
      {len > 0.3 && (
        <group
          position={[curTo[0], curTo[1], 0]}
          rotation={[0, 0, angle - Math.PI / 2]}
        >
          <mesh>
            <coneGeometry args={[0.15, 0.4, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
          </mesh>
        </group>
      )}

      {/* 라벨 — 벡터 중간에서 오프셋 */}
      <Text
        position={[
          (from[0] + curTo[0]) / 2 + labelOffset[0],
          (from[1] + curTo[1]) / 2 + labelOffset[1],
          0.1
        ]}
        fontSize={0.5}
        color={color}
        anchorX="center"
        fillOpacity={progress}
      >
        {label}
      </Text>
    </group>
  )
}

// --- 평행이동된 b (점선) ---
function TranslatedB({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['translate_b','vec_sum','scalar','result','hold'].includes(phase.name)
  const progress = phase.name === 'translate_b' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  // b를 a의 끝점(AX, AY)으로 이동
  const fromX = lerp(0, AX, progress)
  const fromY = lerp(0, AY, progress)
  const toX = lerp(BX, AX + BX, progress)
  const toY = lerp(BY, AY + BY, progress)

  return (
    <group>
      <Line
        points={[[fromX, fromY, 0], [toX, toY, 0]]}
        color={TEAL}
        lineWidth={2}
        dashed
        dashSize={0.2}
        gapSize={0.15}
        transparent
        opacity={0.6}
      />
      {/* 화살표 머리 */}
      {progress > 0.5 && (
        <group
          position={[toX, toY, 0]}
          rotation={[0, 0, Math.atan2(BY, BX) - Math.PI / 2]}
        >
          <mesh>
            <coneGeometry args={[0.12, 0.3, 12]} />
            <meshStandardMaterial color={TEAL} transparent opacity={0.6} />
          </mesh>
        </group>
      )}
      <Text
        position={[(fromX + toX) / 2 + 0.5, (fromY + toY) / 2, 0.1]}
        fontSize={0.35}
        color={TEAL}
        anchorX="center"
        fillOpacity={progress * 0.6}
      >
        b (이동)
      </Text>
    </group>
  )
}

// --- 합 벡터 a+b ---
function SumVector({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['vec_sum','scalar','result','hold'].includes(phase.name)
  const progress = phase.name === 'vec_sum' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  const toX = (AX + BX) * progress
  const toY = (AY + BY) * progress

  return (
    <group>
      <Line
        points={[[0, 0, 0], [toX, toY, 0]]}
        color={CORAL}
        lineWidth={4}
        transparent
        opacity={0.9}
      />
      {progress > 0.5 && (
        <group
          position={[toX, toY, 0]}
          rotation={[0, 0, Math.atan2(AY + BY, AX + BX) - Math.PI / 2]}
        >
          <mesh>
            <coneGeometry args={[0.18, 0.45, 12]} />
            <meshStandardMaterial color={CORAL} emissive={CORAL} emissiveIntensity={0.4} />
          </mesh>
        </group>
      )}
      <Text
        position={[toX / 2 - 0.7, toY / 2 + 0.3, 0.1]}
        fontSize={0.5}
        color={CORAL}
        anchorX="center"
        fillOpacity={progress}
      >
        a + b
      </Text>
      {/* 좌표값 */}
      <Text
        position={[toX + 0.5, toY + 0.5, 0.1]}
        fontSize={0.35}
        color={CORAL}
        anchorX="center"
        fillOpacity={progress}
      >
        {`(${AX + BX}, ${AY + BY})`}
      </Text>
    </group>
  )
}

// --- 스칼라곱 2a ---
function ScalarVector({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['scalar','result','hold'].includes(phase.name)
  const progress = phase.name === 'scalar' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  const toX = AX * 2 * progress
  const toY = AY * 2 * progress

  return (
    <group>
      <Line
        points={[[0, -1, 0], [toX, AY * 2 * progress - 1, 0]]}
        color={PURPLE}
        lineWidth={3}
        dashed
        dashSize={0.25}
        gapSize={0.12}
        transparent
        opacity={0.7}
      />
      {progress > 0.5 && (
        <group
          position={[toX, AY * 2 * progress - 1, 0]}
          rotation={[0, 0, Math.atan2(AY, AX) - Math.PI / 2]}
        >
          <mesh>
            <coneGeometry args={[0.14, 0.35, 12]} />
            <meshStandardMaterial color={PURPLE} transparent opacity={0.7} />
          </mesh>
        </group>
      )}
      <Text
        position={[toX / 2 + 0.6, (AY * 2 * progress - 1) / 2 - 0.5, 0.1]}
        fontSize={0.45}
        color={PURPLE}
        anchorX="center"
        fillOpacity={progress}
      >
        2a
      </Text>
      <Text
        position={[toX / 2 + 0.6, (AY * 2 * progress - 1) / 2 - 1.0, 0.1]}
        fontSize={0.3}
        color="#999999"
        anchorX="center"
        fillOpacity={progress}
      >
        같은 방향, 2배 길이
      </Text>
    </group>
  )
}

// --- 좌표축 ---
function Axes({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const progress = phase.name === 'axes' ? easeOut(phase.progress) : 1

  return (
    <group>
      <Line points={[[-2, 0, 0], [9, 0, 0]]} color="#555566" lineWidth={1} transparent opacity={progress * 0.4} />
      <Line points={[[0, -2, 0], [0, 7, 0]]} color="#555566" lineWidth={1} transparent opacity={progress * 0.4} />
      <Text position={[9, -0.5, 0.1]} fontSize={0.35} color="#777788" anchorX="center" fillOpacity={progress}>x</Text>
      <Text position={[-0.5, 7, 0.1]} fontSize={0.35} color="#777788" anchorX="center" fillOpacity={progress}>y</Text>

      {/* 원점 */}
      <mesh position={[0, 0, 0]} scale={progress}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#888899" />
      </mesh>
      <Text position={[-0.4, -0.4, 0.1]} fontSize={0.3} color="#666677" anchorX="center" fillOpacity={progress}>O</Text>
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
      <Text position={[4, 7, 0.1]} fontSize={0.5} color="#ffffff" anchorX="center" fillOpacity={progress}>
        벡터 = 방향 + 크기
      </Text>
      <Text position={[4, 6.2, 0.1]} fontSize={0.35} color="#999999" anchorX="center" fillOpacity={progress}>
        벡터의 합: 끝점을 이어서 합성
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
      <Axes phase={phase} />

      {/* 벡터 a */}
      <Arrow from={[0, 0]} to={[AX, AY]} color={PURPLE} phase={phase} showAfter="vec_a" label="a" labelOffset={[-0.5, 0.4]} />

      {/* 벡터 b */}
      <Arrow from={[0, 0]} to={[BX, BY]} color={TEAL} phase={phase} showAfter="vec_b" label="b" labelOffset={[0.5, 0.2]} />

      {/* 좌표값 표시 */}
      {['vec_a','vec_b','translate_b','vec_sum','scalar','result','hold'].includes(phase.name) && (
        <Text position={[AX + 0.4, AY + 0.4, 0.1]} fontSize={0.3} color={PURPLE} anchorX="center">
          {`(${AX}, ${AY})`}
        </Text>
      )}
      {['vec_b','translate_b','vec_sum','scalar','result','hold'].includes(phase.name) && (
        <Text position={[BX + 0.4, BY + 0.4, 0.1]} fontSize={0.3} color={TEAL} anchorX="center">
          {`(${BX}, ${BY})`}
        </Text>
      )}

      <TranslatedB phase={phase} />
      <SumVector phase={phase} />
      <ScalarVector phase={phase} />
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
    'axes': '① 좌표평면',
    'vec_a': '② 벡터 a = (3, 2)',
    'vec_b': '③ 벡터 b = (1, 3)',
    'translate_b': '④ b를 a의 끝점으로 평행이동',
    'vec_sum': '⑤ a + b = (4, 5) — 합 벡터',
    'scalar': '⑥ 2a — 같은 방향, 2배 길이',
    'result': '⑦ 벡터 = 방향 + 크기',
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
export default function VectorR3F() {
  const [time, setTime] = useState(0)
  useEffect(() => {
    let raf: number
    const tick = () => { setTime(prev => prev + 1/60); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '700px' }}>
      <Canvas shadows camera={{ position: [3, 3, 14], fov: 40 }} gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
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

'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, Line } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// =============================================
// H008 판별식 — D>0, D=0, D<0 세 가지 경우
// "D의 부호로 근의 개수를 알 수 있다"
// =============================================

const PURPLE = '#534AB7'
const TEAL = '#1D9E75'
const CORAL = '#D85A30'
const TOTAL_DUR = 26 // 22초 + 4초 대기

const STEPS = [
  { start: 0, end: 2.5, name: 'axes' },
  { start: 2.5, end: 5.5, name: 'case_pos' },     // D > 0: 근 2개
  { start: 5.5, end: 7.5, name: 'label_pos' },
  { start: 7.5, end: 10.5, name: 'case_zero' },    // D = 0: 근 1개 (접함)
  { start: 10.5, end: 12.5, name: 'label_zero' },
  { start: 12.5, end: 15.5, name: 'case_neg' },     // D < 0: 근 없음
  { start: 15.5, end: 17.5, name: 'label_neg' },
  { start: 17.5, end: 20, name: 'compare' },        // 세 경우 비교
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

// 포물선 함수들
// D > 0: y = (x-1)(x-3) = x² - 4x + 3, D = 16-12 = 4
function fPos(x: number) { return (x - 1) * (x - 3) }
// D = 0: y = (x-2)² = x² - 4x + 4, D = 16-16 = 0
function fZero(x: number) { return (x - 2) * (x - 2) }
// D < 0: y = x² - 4x + 5, D = 16-20 = -4
function fNeg(x: number) { return x * x - 4 * x + 5 }

// --- 포물선 그리기 ---
function Parabola({
  fn, color, offsetX, phase, showAfter, opacity = 0.9
}: {
  fn: (x: number) => number, color: string, offsetX: number,
  phase: ReturnType<typeof getPhase>, showAfter: string, opacity?: number
}) {
  const showIdx = STEPS.findIndex(s => s.name === showAfter)
  const currentIdx = STEPS.findIndex(s => s.name === phase.name)
  const isVisible = currentIdx >= showIdx || phase.name === 'hold'
  const progress = phase.name === showAfter ? easeInOut(phase.progress) : isVisible ? 1 : 0

  const points = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 80; i++) {
      const x = (i / 80) * 4 - 0.5
      const y = fn(x)
      if (y < 6) pts.push([x + offsetX - 2, y, 0])
    }
    return pts
  }, [fn, offsetX])

  const visibleCount = Math.floor(points.length * progress)
  if (visibleCount < 2) return null

  return (
    <Line
      points={points.slice(0, visibleCount)}
      color={color}
      lineWidth={2.5}
      transparent
      opacity={opacity}
    />
  )
}

// --- x축 (각 포물선마다) ---
function XAxisLine({ offsetX, width }: { offsetX: number, width: number }) {
  return (
    <Line
      points={[[offsetX - width/2, 0, 0], [offsetX + width/2, 0, 0]]}
      color="#555566"
      lineWidth={1}
      transparent
      opacity={0.4}
    />
  )
}

// --- 교점 표시 ---
function RootDots({
  roots, offsetX, color, phase, showAfter
}: {
  roots: number[], offsetX: number, color: string,
  phase: ReturnType<typeof getPhase>, showAfter: string
}) {
  const showIdx = STEPS.findIndex(s => s.name === showAfter)
  const currentIdx = STEPS.findIndex(s => s.name === phase.name)
  const isVisible = currentIdx >= showIdx || phase.name === 'hold'
  const progress = phase.name === showAfter ? easeOut(phase.progress) : isVisible ? 1 : 0

  if (progress <= 0) return null

  return (
    <group>
      {roots.map((r, i) => (
        <mesh key={i} position={[r + offsetX - 2, 0, 0]} scale={progress}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// --- 좌표축 ---
function Axes({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const progress = phase.name === 'axes' ? easeOut(phase.progress) : 1
  if (progress <= 0) return null

  return (
    <group>
      {/* 왼쪽 축 (D>0) */}
      <XAxisLine offsetX={-4.5} width={4.5} />
      {/* 가운데 축 (D=0) */}
      <XAxisLine offsetX={0} width={4.5} />
      {/* 오른쪽 축 (D<0) */}
      <XAxisLine offsetX={4.5} width={4.5} />
    </group>
  )
}

// --- 각 경우의 라벨 ---
function CaseLabels({ phase }: { phase: ReturnType<typeof getPhase> }) {
  // D > 0 라벨
  const showPos = ['label_pos','case_zero','label_zero','case_neg','label_neg','compare','result','hold'].includes(phase.name)
  const posProgress = phase.name === 'label_pos' ? easeOut(phase.progress) : showPos ? 1 : 0

  // D = 0 라벨
  const showZero = ['label_zero','case_neg','label_neg','compare','result','hold'].includes(phase.name)
  const zeroProgress = phase.name === 'label_zero' ? easeOut(phase.progress) : showZero ? 1 : 0

  // D < 0 라벨
  const showNeg = ['label_neg','compare','result','hold'].includes(phase.name)
  const negProgress = phase.name === 'label_neg' ? easeOut(phase.progress) : showNeg ? 1 : 0

  return (
    <group>
      {/* D > 0 */}
      {posProgress > 0 && (
        <group>
          <Text position={[-4.5, 4.5, 0.1]} fontSize={0.5} color={TEAL} anchorX="center" fillOpacity={posProgress}>
            D {'>'} 0
          </Text>
          <Text position={[-4.5, 3.8, 0.1]} fontSize={0.35} color="#aaaaaa" anchorX="center" fillOpacity={posProgress}>
            근이 2개
          </Text>
          <Text position={[-4.5, -0.8, 0.1]} fontSize={0.3} color={TEAL} anchorX="center" fillOpacity={posProgress}>
            x = 1, x = 3
          </Text>
        </group>
      )}

      {/* D = 0 */}
      {zeroProgress > 0 && (
        <group>
          <Text position={[0, 4.5, 0.1]} fontSize={0.5} color={PURPLE} anchorX="center" fillOpacity={zeroProgress}>
            D = 0
          </Text>
          <Text position={[0, 3.8, 0.1]} fontSize={0.35} color="#aaaaaa" anchorX="center" fillOpacity={zeroProgress}>
            근이 1개 (접한다)
          </Text>
          <Text position={[0, -0.8, 0.1]} fontSize={0.3} color={PURPLE} anchorX="center" fillOpacity={zeroProgress}>
            x = 2 (중근)
          </Text>
        </group>
      )}

      {/* D < 0 */}
      {negProgress > 0 && (
        <group>
          <Text position={[4.5, 4.5, 0.1]} fontSize={0.5} color={CORAL} anchorX="center" fillOpacity={negProgress}>
            D {'<'} 0
          </Text>
          <Text position={[4.5, 3.8, 0.1]} fontSize={0.35} color="#aaaaaa" anchorX="center" fillOpacity={negProgress}>
            근이 없다
          </Text>
          <Text position={[4.5, -0.8, 0.1]} fontSize={0.3} color={CORAL} anchorX="center" fillOpacity={negProgress}>
            x축과 안 만남
          </Text>
        </group>
      )}
    </group>
  )
}

// --- "x축과 만나지 않음" 표시 (D<0) ---
function NoRootIndicator({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['label_neg','compare','result','hold'].includes(phase.name)
  const progress = phase.name === 'label_neg' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  // X 표시
  return (
    <group position={[4.5, 0.8, 0.1]}>
      <Line
        points={[[-0.3, -0.3, 0], [0.3, 0.3, 0]]}
        color={CORAL}
        lineWidth={3}
        transparent
        opacity={progress * 0.7}
      />
      <Line
        points={[[-0.3, 0.3, 0], [0.3, -0.3, 0]]}
        color={CORAL}
        lineWidth={3}
        transparent
        opacity={progress * 0.7}
      />
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
      <Text position={[0, 6.2, 0.1]} fontSize={0.55} color="#ffffff" anchorX="center" fillOpacity={progress}>
        판별식 D = b² - 4ac
      </Text>
      <Text position={[0, 5.4, 0.1]} fontSize={0.35} color="#999999" anchorX="center" fillOpacity={progress}>
        D의 부호만 보면 근이 몇 개인지 바로 안다
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
      <directionalLight position={[6, 12, 8]} intensity={0.9} castShadow
        shadow-mapSize={[2048, 2048]} shadow-radius={3} />
      <directionalLight position={[-4, 6, -4]} intensity={0.2} />

      <Floor />
      <Axes phase={phase} />

      {/* D > 0 포물선 (왼쪽) */}
      <Parabola fn={fPos} color={TEAL} offsetX={-4.5} phase={phase} showAfter="case_pos" />
      <RootDots roots={[1, 3]} offsetX={-4.5} color={TEAL} phase={phase} showAfter="case_pos" />

      {/* D = 0 포물선 (가운데) */}
      <Parabola fn={fZero} color={PURPLE} offsetX={0} phase={phase} showAfter="case_zero" />
      <RootDots roots={[2]} offsetX={0} color={PURPLE} phase={phase} showAfter="case_zero" />

      {/* D < 0 포물선 (오른쪽) */}
      <Parabola fn={fNeg} color={CORAL} offsetX={4.5} phase={phase} showAfter="case_neg" />
      <NoRootIndicator phase={phase} />

      <CaseLabels phase={phase} />
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
    'axes': '① 좌표축 준비',
    'case_pos': '② D > 0: 포물선이 x축과 2점에서 만남',
    'label_pos': '② 근이 2개 (서로 다른 두 실근)',
    'case_zero': '③ D = 0: 포물선이 x축에 접함',
    'label_zero': '③ 근이 1개 (중근)',
    'case_neg': '④ D < 0: 포물선이 x축 위에 떠있음',
    'label_neg': '④ 근이 없다 (허근)',
    'compare': '⑤ 세 경우 비교',
    'result': '⑥ D = b² - 4ac 로 판별!',
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
export default function DiscriminantR3F() {
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

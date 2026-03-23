'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, OrbitControls, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// =============================================
// H052 정적분 — 리만 합 3D 시각화
// "곡선 아래 넓이를 직사각형으로 채우면 정적분"
// =============================================

const PURPLE = '#534AB7'
const TEAL = '#1D9E75'
const CORAL = '#D85A30'
const TOTAL_DUR = 28 // 24초 애니메이션 + 4초 대기

// f(x) = -0.15(x-3)² + 3  (예쁜 포물선)
function f(x: number) {
  return -0.15 * (x - 3) * (x - 3) + 3
}

// 단계 정의
const STEPS = [
  { start: 0, end: 3, name: 'curve' },        // 곡선 그리기
  { start: 3, end: 5, name: 'range' },         // 적분 구간 표시
  { start: 5, end: 10, name: 'bars4' },        // 4개 막대
  { start: 10, end: 11.5, name: 'count4' },    // 4개일 때 넓이
  { start: 11.5, end: 16, name: 'bars8' },     // 8개 막대로 전환
  { start: 16, end: 17.5, name: 'count8' },    // 8개일 때 넓이
  { start: 17.5, end: 21, name: 'bars20' },    // 20개 막대로 전환
  { start: 21, end: 22.5, name: 'count20' },   // 20개일 때 넓이
  { start: 22.5, end: 24, name: 'exact' },     // 정확한 넓이
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

// --- 곡선 ---
function Curve({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const ref = useRef<THREE.Group>(null)
  
  const curvePoints = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 120; i++) {
      const x = (i / 120) * 6
      pts.push(new THREE.Vector3(x - 3, f(x), 0))
    }
    return pts
  }, [])

  const showCurve = ['curve','range','bars4','count4','bars8','count8','bars20','count20','exact','hold'].includes(phase.name)
  const curveProgress = phase.name === 'curve' ? easeInOut(phase.progress) : showCurve ? 1 : 0

  const visiblePoints = Math.floor(curvePoints.length * curveProgress)

  if (visiblePoints < 2) return null

  return (
    <group ref={ref}>
      {/* 곡선 */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(curvePoints.slice(0, visiblePoints).flatMap(p => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={PURPLE} linewidth={2} transparent opacity={0.9} />
      </line>

      {/* 곡선 아래 반투명 면 (적분 구간) */}
      {['range','bars4','count4','bars8','count8','bars20','count20','exact','hold'].includes(phase.name) && (
        <mesh position={[0, 0, -0.01]}>
          <shapeGeometry args={[(() => {
            const shape = new THREE.Shape()
            const a = 1, b = 5 // 적분 구간 [1, 5]
            shape.moveTo(a - 3, 0)
            for (let i = 0; i <= 60; i++) {
              const x = a + (b - a) * i / 60
              shape.lineTo(x - 3, f(x))
            }
            shape.lineTo(b - 3, 0)
            shape.closePath()
            return shape
          })()]} />
          <meshBasicMaterial color={TEAL} transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

// --- 적분 구간 표시 ---
function IntegralRange({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['range','bars4','count4','bars8','count8','bars20','count20','exact','hold'].includes(phase.name)
  const progress = phase.name === 'range' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  const a = 1, b = 5

  return (
    <group>
      {/* a 수직선 */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([a-3, 0, 0, a-3, f(a) * progress, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={CORAL} transparent opacity={progress * 0.6} />
      </line>
      
      {/* b 수직선 */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([b-3, 0, 0, b-3, f(b) * progress, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={CORAL} transparent opacity={progress * 0.6} />
      </line>

      {/* a 라벨 — 곡선 아래 충분히 떨어짐 */}
      <Text
        position={[a - 3, -1.0, 0.1]}
        fontSize={0.525}
        color={CORAL}
        anchorX="center"
        anchorY="middle"
        fillOpacity={progress}
      >
        a = 1
      </Text>

      {/* b 라벨 — 곡선 아래 충분히 떨어짐 */}
      <Text
        position={[b - 3, -1.0, 0.1]}
        fontSize={0.525}
        color={CORAL}
        anchorX="center"
        anchorY="middle"
        fillOpacity={progress}
      >
        b = 5
      </Text>
    </group>
  )
}

// --- 리만 합 막대들 ---
function RiemannBars({ 
  n, phase, activePhase, color 
}: { 
  n: number, phase: ReturnType<typeof getPhase>, activePhase: string, color: string 
}) {
  const a = 1, b = 5
  const dx = (b - a) / n
  
  const isActive = phase.name === activePhase || 
    (activePhase === 'bars4' && ['count4'].includes(phase.name)) ||
    (activePhase === 'bars8' && ['count8'].includes(phase.name)) ||
    (activePhase === 'bars20' && ['count20'].includes(phase.name))
  
  const isHold = phase.name === 'hold' && activePhase === 'bars20'
  const isExact = phase.name === 'exact' && activePhase === 'bars20'

  if (!isActive && !isHold && !isExact) return null

  const barProgress = phase.name === activePhase ? phase.progress : 1

  // 넓이 합 계산
  const totalArea = Array.from({ length: n }).reduce((sum: number, _, i) => {
    const x = a + i * dx
    return sum + f(x) * dx
  }, 0)

  return (
    <group>
      {Array.from({ length: n }).map((_, i) => {
        const x = a + i * dx
        const h = f(x)
        const delay = i / n * 0.6
        const t = Math.max(0, Math.min(1, (barProgress - delay) / 0.4))
        const animH = h * easeOut(t)

        if (t <= 0) return null

        return (
          <group key={`bar-${n}-${i}`}>
            <RoundedBox
              args={[dx * 0.92, animH, dx * 0.7]}
              radius={0.03}
              smoothness={2}
              position={[x + dx/2 - 3, animH / 2, 0]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={color}
                transparent
                opacity={0.7}
                roughness={0.3}
                metalness={0.1}
              />
            </RoundedBox>
            
            {/* 막대 윗면 하이라이트 */}
            {n <= 8 && t > 0.8 && (
              <mesh position={[x + dx/2 - 3, animH + 0.02, 0]}>
                <planeGeometry args={[dx * 0.92, dx * 0.7]} />
                <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}

// --- 좌표축 ---
function Axes({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = phase.name !== 'hold' || true
  
  return (
    <group>
      {/* x축 */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([-3.5, 0, 0, 3.5, 0, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#666677" transparent opacity={0.5} />
      </line>
      
      {/* y축 */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([-3, -0.2, 0, -3, 3.5, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#666677" transparent opacity={0.5} />
      </line>

      {/* x축 라벨 — 축 아래 충분히 떨어짐 */}
      <Text position={[3.5, -0.4, 0.1]} fontSize={0.42} color="#888899" anchorX="center">
        x
      </Text>

      {/* y축 라벨 — 축 왼쪽으로 떨어짐 */}
      <Text position={[-3.5, 3.5, 0.1]} fontSize={0.42} color="#888899" anchorX="center">
        y
      </Text>

      {/* 함수 라벨 — 곡선 오른쪽 위, 다른 요소와 안 겹치는 위치 */}
      {['curve','range','bars4','count4','bars8','count8','bars20','count20','exact','hold'].includes(phase.name) && (
        <Text position={[0.5, 3.3, 0.1]} fontSize={0.45} color={PURPLE} anchorX="center">
          f(x)
        </Text>
      )}
    </group>
  )
}

// --- 바닥 그리드 ---
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

  useFrame((_, delta) => {
    setTime(prev => prev + delta)
  })

  const phase = getPhase(time)

  const showBars4 = ['bars4', 'count4'].includes(phase.name)
  const showBars8 = ['bars8', 'count8'].includes(phase.name)
  const showBars20 = ['bars20', 'count20', 'exact', 'hold'].includes(phase.name)

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[6, 12, 8]}
        intensity={0.9}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-radius={3}
      />
      <directionalLight position={[-4, 6, -4]} intensity={0.2} />

      <Floor />
      <Axes phase={phase} />
      <Curve phase={phase} />
      <IntegralRange phase={phase} />

      {showBars4 && <RiemannBars n={4} phase={phase} activePhase="bars4" color={TEAL} />}
      {showBars8 && <RiemannBars n={8} phase={phase} activePhase="bars8" color={TEAL} />}
      {showBars20 && <RiemannBars n={20} phase={phase} activePhase="bars20" color={TEAL} />}

      {phase.name === 'count4' && (
        <Text position={[3.5, 4.2, 0.1]} fontSize={0.525} color={TEAL} anchorX="center">
          {'4개 막대 ≈ 9.60'}
        </Text>
      )}
      {phase.name === 'count8' && (
        <Text position={[3.5, 4.2, 0.1]} fontSize={0.525} color={TEAL} anchorX="center">
          {'8개 막대 ≈ 9.90'}
        </Text>
      )}
      {phase.name === 'count20' && (
        <Text position={[3.5, 4.2, 0.1]} fontSize={0.525} color={TEAL} anchorX="center">
          {'20개 막대 ≈ 10.13'}
        </Text>
      )}

      {(phase.name === 'exact' || phase.name === 'hold') && (
        <group>
          <Text position={[0, 5, 0.1]} fontSize={0.675} color={CORAL} anchorX="center">
            {'구간 [1, 5] 정적분 = 10.13'}
          </Text>
          <Text position={[0, 3.8, 0.1]} fontSize={0.42} color="#999999" anchorX="center">
            {'막대를 무한히 쪼개면 → 정확한 넓이'}
          </Text>
        </group>
      )}

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={6}
        maxDistance={18}
      />
    </>
  )
}

// --- 단계 오버레이 ---
function StepOverlay({ time }: { time: number }) {
  const phase = getPhase(time)

  const stepTexts: Record<string, string> = {
    'curve': '① 곡선 f(x) 그리기',
    'range': '② 적분 구간 [a, b] 설정',
    'bars4': '③ 4개 직사각형으로 넓이 근사',
    'count4': '③ 4개 → 넓이 ≈ 9.60',
    'bars8': '④ 8개로 더 정밀하게',
    'count8': '④ 8개 → 넓이 ≈ 9.90',
    'bars20': '⑤ 20개로 더더 정밀하게',
    'count20': '⑤ 20개 → 넓이 ≈ 10.13',
    'exact': '⑥ 무한히 쪼개면 = 정적분',
  }

  const stepText = stepTexts[phase.name] || ''

  return (
    <>
      {stepText && (
        <div style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          fontSize: 15, color: 'rgba(255,255,255,0.85)',
          background: 'rgba(255,255,255,0.08)', padding: '8px 22px',
          borderRadius: 24, pointerEvents: 'none',
          transition: 'opacity 0.3s', whiteSpace: 'nowrap',
        }}>
          {stepText}
        </div>
      )}
    </>
  )
}

// --- 메인 컴포넌트 ---
export default function DefiniteIntegralR3F() {
  const [time, setTime] = useState(0)

  useEffect(() => {
    let raf: number
    const tick = () => {
      setTime(prev => prev + 1/60)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '700px' }}>
      <Canvas
        shadows
        camera={{ position: [0, 3, 12], fov: 40 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
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

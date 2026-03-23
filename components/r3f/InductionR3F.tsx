'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, RoundedBox } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// =============================================
// H030 수학적 귀납법 — 도미노 연쇄 3D 시각화
// "첫 번째가 넘어지고, 하나가 넘어지면 다음도 넘어진다"
// =============================================

const PURPLE = '#534AB7'
const TEAL = '#1D9E75'
const CORAL = '#D85A30'
const TOTAL_DUR = 22 // 18초 애니메이션 + 4초 대기
const DOMINO_COUNT = 12

const STEPS = [
  { start: 0, end: 3, name: 'setup' },         // 도미노 줄 세우기
  { start: 3, end: 5, name: 'label_n1' },       // P(1) 참 표시
  { start: 5, end: 7, name: 'push' },           // 첫 도미노 밀기
  { start: 7, end: 8.5, name: 'fall_first' },   // 첫 번째 넘어짐
  { start: 8.5, end: 14, name: 'chain' },       // 연쇄 넘어짐
  { start: 14, end: 16, name: 'label_kk1' },    // P(k)→P(k+1) 설명
  { start: 16, end: 18, name: 'result' },        // 결론
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

// --- 단일 도미노 ---
function Domino({ 
  index, position, phase 
}: { 
  index: number, position: [number, number, number], phase: ReturnType<typeof getPhase> 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // 등장 애니메이션
  const setupProgress = phase.name === 'setup' 
    ? easeOut(Math.max(0, Math.min(1, (phase.progress - index / DOMINO_COUNT * 0.7) / 0.3)))
    : ['label_n1','push','fall_first','chain','label_kk1','result','hold'].includes(phase.name) ? 1 : 0

  // 넘어지는 각도 계산
  let fallAngle = 0
  
  if (index === 0) {
    // 첫 번째 도미노
    if (phase.name === 'fall_first' || phase.name === 'push') {
      const p = phase.name === 'push' ? phase.progress * 0.3 : 0.3 + phase.progress * 0.7
      fallAngle = easeOut(p) * (Math.PI / 2)
    } else if (['chain','label_kk1','result','hold'].includes(phase.name)) {
      fallAngle = Math.PI / 2
    }
  } else {
    // 나머지 도미노 — 연쇄
    if (phase.name === 'chain') {
      const delay = (index - 1) / (DOMINO_COUNT - 1) * 0.85
      const t = Math.max(0, Math.min(1, (phase.progress - delay) / 0.15))
      fallAngle = easeOut(t) * (Math.PI / 2)
    } else if (['label_kk1','result','hold'].includes(phase.name)) {
      fallAngle = Math.PI / 2
    }
  }

  if (setupProgress <= 0) return null

  // 도미노 색상 — 첫 번째는 특별
  const color = index === 0 ? CORAL : PURPLE
  const emissiveIntensity = fallAngle > Math.PI / 4 ? 0.3 : 0

  return (
    <group position={position}>
      {/* 도미노 — 피봇을 아래쪽 모서리로 */}
      <group rotation={[0, 0, -fallAngle]}>
        <RoundedBox
          ref={meshRef}
          args={[0.3, 1.6, 0.8]}
          radius={0.04}
          smoothness={3}
          position={[0, 0.8, 0]}
          scale={[setupProgress, setupProgress, setupProgress]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            roughness={0.25}
            metalness={0.15}
          />
        </RoundedBox>

        {/* 도미노 번호 — 앞면 */}
        {setupProgress > 0.8 && (
          <Text
            position={[0.16, 0.8, 0.2]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={setupProgress}
          >
            {index + 1}
          </Text>
        )}
      </group>

      {/* 넘어질 때 바닥 충격 이펙트 */}
      {fallAngle > Math.PI / 3 && (
        <mesh position={[0.8, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <ringGeometry args={[0.2, 0.6, 16]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.15 * (1 - (fallAngle - Math.PI/3) / (Math.PI/6))} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}
    </group>
  )
}

// --- P(1) 라벨 ---
function LabelP1({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['label_n1','push','fall_first','chain','label_kk1','result','hold'].includes(phase.name)
  const progress = phase.name === 'label_n1' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  return (
    <group>
      {/* 화살표: "밀기!" */}
      <Text
        position={[-2.5, 2.5, 0]}
        fontSize={0.45}
        color={CORAL}
        anchorX="center"
        fillOpacity={progress}
      >
        P(1) 참!
      </Text>
      <Text
        position={[-2.5, 1.9, 0]}
        fontSize={0.3}
        color="#999999"
        anchorX="center"
        fillOpacity={progress}
      >
        첫 번째를 확인한다
      </Text>
    </group>
  )
}

// --- P(k)→P(k+1) 라벨 ---
function LabelPkPk1({ phase }: { phase: ReturnType<typeof getPhase> }) {
  const show = ['label_kk1','result','hold'].includes(phase.name)
  const progress = phase.name === 'label_kk1' ? easeOut(phase.progress) : show ? 1 : 0

  if (progress <= 0) return null

  return (
    <group>
      <Text
        position={[3, 3.5, 0]}
        fontSize={0.45}
        color={TEAL}
        anchorX="center"
        fillOpacity={progress}
      >
        P(k) → P(k+1)
      </Text>
      <Text
        position={[3, 2.8, 0]}
        fontSize={0.3}
        color="#999999"
        anchorX="center"
        fillOpacity={progress}
      >
        하나가 넘어지면 다음도 넘어진다
      </Text>
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
      <Text
        position={[0, 5.5, 0.1]}
        fontSize={0.55}
        color="#ffffff"
        anchorX="center"
        fillOpacity={progress}
      >
        모든 자연수 n에 대해 P(n) 참!
      </Text>
      <Text
        position={[0, 4.7, 0.1]}
        fontSize={0.35}
        color="#999999"
        anchorX="center"
        fillOpacity={progress}
      >
        P(1) 참 + P(k)→P(k+1) = 전부 참
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

  // 도미노 위치: 등간격으로 배치
  const dominoPositions = useMemo(() => {
    return Array.from({ length: DOMINO_COUNT }, (_, i) => {
      const x = -4 + i * 0.9
      return [x, 0, 0] as [number, number, number]
    })
  }, [])

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 14, 8]} intensity={1} castShadow
        shadow-mapSize={[2048, 2048]} shadow-radius={4}
        shadow-camera-left={-10} shadow-camera-right={10}
        shadow-camera-top={10} shadow-camera-bottom={-10}
      />
      <directionalLight position={[-4, 6, -6]} intensity={0.2} />
      <directionalLight position={[0, 3, 8]} intensity={0.15} />

      <Floor />

      {/* 도미노들 */}
      {dominoPositions.map((pos, i) => (
        <Domino key={i} index={i} position={pos} phase={phase} />
      ))}

      <LabelP1 phase={phase} />
      <LabelPkPk1 phase={phase} />
      <ResultTexts phase={phase} />

      {/* Bloom 후처리 */}
      <EffectComposer>
        <Bloom
          intensity={0.3}
          luminanceThreshold={0.5}
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
    'setup': '① 도미노를 세운다',
    'label_n1': '② P(1)이 참인지 확인',
    'push': '③ 첫 번째 도미노를 민다!',
    'fall_first': '④ 첫 번째가 넘어진다',
    'chain': '⑤ 연쇄적으로 전부 넘어진다',
    'label_kk1': '⑥ P(k) 참이면 P(k+1)도 참',
    'result': '⑦ 모든 자연수 n에 대해 성립!',
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
export default function InductionR3F() {
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

'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, OrbitControls, Environment, Float, MeshTransmissionMaterial, RoundedBox } from '@react-three/drei'
import { animated, useSpring, useSprings, config } from '@react-spring/three'
import * as THREE from 'three'

// =============================================
// 피타고라스 정리 — R3F 초고퀄리티 3D 시각화
// =============================================

const PURPLE = '#534AB7'
const TEAL = '#1D9E75'
const CORAL = '#D85A30'
const sA = 3, sB = 4, sC = 5

// 단계 타이밍 (초)
const STEPS = [
  { start: 0, end: 2.5, name: 'triangle' },
  { start: 2.5, end: 4, name: 'labels' },
  { start: 4, end: 7, name: 'squareA' },
  { start: 7, end: 10, name: 'squareB' },
  { start: 10, end: 11, name: 'prepareC' },
  { start: 11, end: 17, name: 'transfer' },
  { start: 17, end: 20, name: 'result' },
  { start: 20, end: 22, name: 'formula' },
]
const TOTAL_DUR = 25 // 22초 애니메이션 + 3초 대기

function getPhase(t: number) {
  const looped = t % TOTAL_DUR
  for (const s of STEPS) {
    if (looped >= s.start && looped < s.end) {
      return { name: s.name, progress: (looped - s.start) / (s.end - s.start) }
    }
  }
  return { name: 'hold', progress: 1 }
}

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3) }
function easeInOut(t: number) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2 }

// --- 삼각형 ---
function Triangle({ phase }: { phase: { name: string, progress: number } }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const edgeRef = useRef<THREE.LineSegments>(null)

  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.lineTo(sB, 0)
    s.lineTo(0, sA)
    s.closePath()
    return s
  }, [])

  const extrudeSettings = useMemo(() => ({
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 4
  }), [])

  const visible = STEPS.findIndex(s => s.name === 'triangle') <= STEPS.findIndex(s => s.name === phase.name) || phase.name === 'hold'
  const opacity = phase.name === 'triangle' ? easeOut(Math.min(phase.progress * 1.5, 1)) * 0.35 : visible ? 0.35 : 0
  const edgeOpacity = phase.name === 'triangle' ? easeOut(Math.min(phase.progress * 1.5, 1)) : visible ? 1 : 0

  return (
    <group position={[-sB/2, 0.02, -sA/2]} rotation={[-Math.PI/2, 0, 0]}>
      <mesh ref={meshRef} castShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color="#8888aa"
          transparent
          opacity={opacity}
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>
      <lineSegments ref={edgeRef}>
        <edgesGeometry args={[new THREE.ExtrudeGeometry(shape, extrudeSettings)]} />
        <lineBasicMaterial color="#ccccdd" transparent opacity={edgeOpacity} />
      </lineSegments>
    </group>
  )
}

// --- 정사각형 블록 ---
function SquareBlock({ 
  size, color, position, phase, showAfter, cellShowAfter 
}: { 
  size: number, color: string, position: [number, number, number],
  phase: { name: string, progress: number },
  showAfter: string, cellShowAfter: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  
  const showIdx = STEPS.findIndex(s => s.name === showAfter)
  const currentIdx = STEPS.findIndex(s => s.name === phase.name)
  const isVisible = currentIdx >= showIdx || phase.name === 'hold'
  
  const blockProgress = phase.name === showAfter ? easeOut(phase.progress) : isVisible ? 1 : 0
  const height = 0.5 * blockProgress

  // 칸 카운팅
  const cellShowIdx = STEPS.findIndex(s => s.name === cellShowAfter)
  const cellVisible = currentIdx >= cellShowIdx || phase.name === 'hold'
  const cellProgress = phase.name === cellShowAfter ? phase.progress : cellVisible ? 1 : 0

  return (
    <group ref={groupRef} position={position}>
      {/* 블록 */}
      {blockProgress > 0 && (
        <RoundedBox
          ref={meshRef}
          args={[size, height, size]}
          radius={0.06}
          smoothness={4}
          position={[0, height / 2, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={color}
            transparent
            opacity={blockProgress * 0.7}
            roughness={0.25}
            metalness={0.1}
          />
        </RoundedBox>
      )}
      
      {/* 격자 라인 */}
      {blockProgress > 0.5 && (
        <group position={[0, height + 0.01, 0]}>
          {Array.from({ length: size - 1 }).map((_, i) => (
            <group key={`grid-${i}`}>
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array([
                      -size/2 + (i+1), 0, -size/2,
                      -size/2 + (i+1), 0, size/2
                    ]), 3]}
                  />
                </bufferGeometry>
                <lineBasicMaterial color={color} transparent opacity={0.2} />
              </line>
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array([
                      -size/2, 0, -size/2 + (i+1),
                      size/2, 0, -size/2 + (i+1)
                    ]), 3]}
                  />
                </bufferGeometry>
                <lineBasicMaterial color={color} transparent opacity={0.2} />
              </line>
            </group>
          ))}
        </group>
      )}
      
      {/* 칸 카운팅 구체 */}
      {cellProgress > 0 && Array.from({ length: size * size }).map((_, idx) => {
        const row = Math.floor(idx / size)
        const col = idx % size
        const delay = idx / (size * size)
        const t = Math.max(0, Math.min(1, (cellProgress - delay * 0.6) / 0.4))
        const s = easeOut(t)
        const bounce = s > 0.85 ? 1 + Math.sin((s - 0.85) * 25) * 0.08 * (1 - s) : s
        
        if (t <= 0) return null
        
        return (
          <mesh
            key={`cell-${idx}`}
            position={[
              -size/2 + col + 0.5,
              height + 0.25,
              -size/2 + row + 0.5
            ]}
            scale={bounce}
            castShadow
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={bounce * 0.85}
              emissive={color}
              emissiveIntensity={0.5}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// --- 파티클 스트림 ---
function ParticleStream({ phase }: { phase: { name: string, progress: number } }) {
  const count = 120
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const src = i < 60 ? 'a' : 'b'
      const srcPos = src === 'a' 
        ? { x: -sB/2 - sA/2 - 0.8, z: 0 }
        : { x: 0, z: sA/2 + sB/2 + 0.8 }
      const sz = src === 'a' ? sA : sB
      return {
        src,
        sx: srcPos.x + (Math.random() - 0.5) * sz * 0.8,
        sy: 0.6 + Math.random() * 0.4,
        sz: srcPos.z + (Math.random() - 0.5) * sz * 0.8,
        cx: (Math.random() - 0.5) * 5,
        cy: 3 + Math.random() * 4,
        cz: (Math.random() - 0.5) * 5,
        delay: Math.random() * 0.5,
        speed: 0.4 + Math.random() * 0.6,
        color: src === 'a' ? PURPLE : TEAL
      }
    })
  }, [])

  const isTransfer = phase.name === 'transfer' || phase.name === 'result' || phase.name === 'formula' || phase.name === 'hold'
  const transferProgress = phase.name === 'transfer' ? phase.progress : isTransfer ? 1 : 0

  const destX = sB/2 + sC/2 + 0.8
  const destZ = 0

  return (
    <group>
      {particles.map((p, i) => {
        const t = Math.max(0, Math.min(1, (transferProgress - p.delay) / p.speed))
        if (t <= 0 || t >= 1) return null
        
        const et = easeInOut(t)
        const mx = (p.sx + destX) / 2 + p.cx
        const mz = (p.sz + destZ) / 2 + p.cz
        const my = Math.max(p.sy, 0.7) + p.cy
        
        const x = p.sx * (1-et)*(1-et) + 2*mx*et*(1-et) + destX*et*et
        const z = p.sz * (1-et)*(1-et) + 2*mz*et*(1-et) + destZ*et*et
        const y = p.sy * (1-et)*(1-et) + 2*my*et*(1-et) + 0.8*et*et
        
        const alpha = t < 0.1 ? t / 0.1 : t > 0.85 ? (1-t) / 0.15 : 1
        const scale = 0.5 + (1 - et) * 1.5

        return (
          <mesh key={i} position={[x, y, z]} scale={scale * 0.08}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial
              color={p.color}
              transparent
              opacity={alpha * 0.7}
              emissive={p.color}
              emissiveIntensity={0.6}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// --- 3D 라벨 ---
function Label3D({ text, color, position, phase, showAfter }: {
  text: string, color: string, position: [number, number, number],
  phase: { name: string, progress: number }, showAfter: string
}) {
  const ref = useRef<THREE.Group>(null)
  const showIdx = STEPS.findIndex(s => s.name === showAfter)
  const currentIdx = STEPS.findIndex(s => s.name === phase.name)
  const visible = currentIdx >= showIdx || phase.name === 'hold'
  const opacity = phase.name === showAfter ? easeOut(phase.progress) : visible ? 1 : 0

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2) * 0.08
      ref.current.quaternion.copy(state.camera.quaternion)
    }
  })

  if (!visible && phase.name !== showAfter) return null

  return (
    <group ref={ref} position={position}>
      <Text
        fontSize={0.5}
        color={color}
        anchorX="center"
        anchorY="middle"
        
        fillOpacity={opacity}
      >
        {text}
        <meshBasicMaterial transparent opacity={opacity} color={color} />
      </Text>
    </group>
  )
}

// --- c² 발광 효과 ---
function GlowEffect({ phase }: { phase: { name: string, progress: number } }) {
  const ref = useRef<THREE.Mesh>(null)
  const isResult = phase.name === 'result' || phase.name === 'formula' || phase.name === 'hold'
  
  useFrame((state) => {
    if (ref.current && isResult) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7
      ref.current.scale.setScalar(sC * 0.8 * pulse)
      ;(ref.current.material as any).opacity = 0.08 * pulse
    }
  })

  if (!isResult) return null

  return (
    <mesh ref={ref} position={[sB/2 + sC/2 + 0.8, 0.5, 0]} rotation={[-Math.PI/2, 0, 0]}>
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial color={CORAL} transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  )
}

// --- 메인 씬 ---
function Scene() {
  const [time, setTime] = useState(0)
  
  useFrame((state, delta) => {
    setTime(prev => prev + delta)
  })

  const phase = getPhase(time)

  return (
    <>
      {/* 조명 */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[8, 16, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-radius={4}
      />
      <directionalLight position={[-5, 8, -6]} intensity={0.2} />
      <directionalLight position={[0, 4, -10]} intensity={0.1} />

      {/* 바닥 */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#121620" roughness={0.95} metalness={0} />
      </mesh>
      <gridHelper args={[30, 30, '#1a1e2a', '#151925']} />

      {/* 삼각형 */}
      <Triangle phase={phase} />

      {/* 라벨 */}
      <Label3D text="a = 3" color={PURPLE} position={[-sB/2 - sA/2 - 0.8, 1.8, 0]} phase={phase} showAfter="labels" />
      <Label3D text="b = 4" color={TEAL} position={[0, 1.8, sA/2 + sB/2 + 0.8]} phase={phase} showAfter="labels" />
      <Label3D text="c = 5" color={CORAL} position={[sB/2 + sC/2 + 0.8, 1.8, 0]} phase={phase} showAfter="labels" />
      
      <Label3D text="a² = 9칸" color={PURPLE} position={[-sB/2 - sA/2 - 0.8, 2.8, 0]} phase={phase} showAfter="squareA" />
      <Label3D text="b² = 16칸" color={TEAL} position={[0, 2.8, sA/2 + sB/2 + 0.8]} phase={phase} showAfter="squareB" />
      <Label3D text="c² = 25칸" color={CORAL} position={[sB/2 + sC/2 + 0.8, 2.8, 0]} phase={phase} showAfter="result" />

      {/* 정사각형 블록 */}
      <SquareBlock size={sA} color={PURPLE} position={[-sB/2 - sA/2 - 0.8, 0, 0]} phase={phase} showAfter="squareA" cellShowAfter="squareA" />
      <SquareBlock size={sB} color={TEAL} position={[0, 0, sA/2 + sB/2 + 0.8]} phase={phase} showAfter="squareB" cellShowAfter="squareB" />
      <SquareBlock size={sC} color={CORAL} position={[sB/2 + sC/2 + 0.8, 0, 0]} phase={phase} showAfter="prepareC" cellShowAfter="result" />

      {/* 파티클 스트림 */}
      <ParticleStream phase={phase} />

      {/* 발광 효과 */}
      <GlowEffect phase={phase} />

      {/* 카메라 컨트롤 */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={10}
        maxDistance={25}
      />
    </>
  )
}

// --- 단계 오버레이 ---
function StepOverlay({ time }: { time: number }) {
  const phase = getPhase(time)
  
  const stepTexts: Record<string, string> = {
    'triangle': '① 직각삼각형',
    'labels': '② 각 변의 길이',
    'squareA': '③ a² = 9칸',
    'squareB': '④ b² = 16칸',
    'prepareC': '⑤ c² 자리 준비',
    'transfer': '⑥ 9칸 + 16칸이 c²로 날아간다',
    'result': '⑦ 딱 25칸 = c²',
  }

  const stepText = stepTexts[phase.name] || ''
  const showFormula = phase.name === 'formula' || phase.name === 'hold'

  return (
    <>
      {stepText && (
        <div style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          fontSize: 14, color: 'rgba(255,255,255,0.8)',
          background: 'rgba(255,255,255,0.06)', padding: '6px 18px',
          borderRadius: 20, pointerEvents: 'none',
          transition: 'opacity 0.3s', opacity: stepText ? 1 : 0,
        }}>
          {stepText}
        </div>
      )}
      {showFormula && (
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center', pointerEvents: 'none',
          background: 'rgba(0,0,0,0.4)', padding: '12px 24px', borderRadius: 12,
        }}>
          <div style={{ fontSize: 22, fontWeight: 500, color: '#fff', letterSpacing: 1 }}>
            9 + 16 = 25 → a² + b² = c²
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
            직각삼각형의 두 짧은 변에 정사각형을 그리면, 그 넓이의 합은 빗변의 정사각형 넓이와 항상 같다
          </div>
        </div>
      )}
    </>
  )
}

// --- 메인 컴포넌트 (export) ---
export default function PythagorasR3F() {
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
        camera={{ position: [0, 12, 18], fov: 38 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0e17']} />
        <fog attach="fog" args={['#0a0e17', 20, 50]} />
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

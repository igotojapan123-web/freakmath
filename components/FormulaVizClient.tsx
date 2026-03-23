'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const PythagorasR3F = dynamic(() => import('@/components/r3f/PythagorasR3F'), { ssr: false })
const DefiniteIntegralR3F = dynamic(() => import('@/components/r3f/DefiniteIntegralR3F'), { ssr: false })
const DerivativeR3F = dynamic(() => import('@/components/r3f/DerivativeR3F'), { ssr: false })
const TrigFuncR3F = dynamic(() => import('@/components/r3f/TrigFuncR3F'), { ssr: false })
const InductionR3F = dynamic(() => import('@/components/r3f/InductionR3F'), { ssr: false })
const DiscriminantR3F = dynamic(() => import('@/components/r3f/DiscriminantR3F'), { ssr: false })
const ConicSectionR3F = dynamic(() => import('@/components/r3f/ConicSectionR3F'), { ssr: false })
const NormalDistR3F = dynamic(() => import('@/components/r3f/NormalDistR3F'), { ssr: false })
const VectorR3F = dynamic(() => import('@/components/r3f/VectorR3F'), { ssr: false })

// 고등 3D visualType 목록
const HIGH_3D_TYPES = new Set([
  // 중등 3D (7개)
  'similarity_volume','sphere_volume','sphere_surface','cylinder_surface','cone_volume','cone_surface',
  // 고등 3D
  'poly_add','poly_mul_h','expand_formula','factor_h','remainder_theorem','factor_theorem',
  'complex_number','discriminant','vieta','quad_func_eq','abs_function','sigma_notation',
  'quad_inequality','abs_inequality','counting_h','permutation','combination','binomial_theorem',
  'set_operation','proposition','function_h','composite_func','inverse_func','rational_func',
  'irrational_func','arithmetic_seq','geometric_seq','arithmetic_sum','geometric_sum','induction',
  'exp_func','log_func','exp_log_eq','trig_func','trig_graph','trig_addition','sine_rule',
  'cosine_rule','vector_2d','dot_product','seq_limit','series','func_limit','continuity',
  'derivative_coeff','derivative_func','diff_formula','diff_application','max_min','tangent_line',
  'indefinite_integral','definite_integral','area_integral','series_sum','fundamental_theorem',
  'prob_addition','conditional_prob','independence','discrete_rv','binomial_dist','normal_dist',
  'sampling_dist','confidence_interval','proportion_estimate','trig_identity','line_eq','circle_eq',
  'transformation','conic_section','space_vector','exponent_viz','coordinate_plane','diff_rules',
])

interface Props {
  visualType: string
  values?: Record<string, number>
  height?: number
  forceCanvas2D?: boolean
}

export default function FormulaVizClient({ visualType, values, height = 240, forceCanvas2D = false }: Props) {
  const [mounted, setMounted] = useState(false)
  const [Viz, setViz] = useState<any>(null)

  const is3D = !forceCanvas2D && HIGH_3D_TYPES.has(visualType)

  useEffect(() => {
    setMounted(true)
    if (is3D) {
      import('./FormulaViz3D').then(mod => setViz(() => mod.default))
    } else {
      import('./FormulaViz').then(mod => setViz(() => mod.default))
    }
  }, [is3D])

  if (!mounted || !Viz) {
    return (
      <div suppressHydrationWarning style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#05080f',
        borderRadius: '12px',
        color: 'rgba(255,255,255,0.2)',
        fontSize: '13px',
        fontFamily: 'Noto Sans KR',
      }}>
        {is3D ? '3D 시각화 로딩 중...' : '애니메이션 로딩 중...'}
      </div>
    )
  }

  const hint3D = is3D && (
    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 4 }}>
      🖱️ 마우스 드래그로 회전 · 휠로 확대/축소
    </p>
  )

  // R3F 전용 컴포넌트
  if (visualType === 'pythagoras_viz' && !forceCanvas2D) return <><PythagorasR3F />{hint3D}</>
  if (visualType === 'definite_integral' && !forceCanvas2D) return <><DefiniteIntegralR3F />{hint3D}</>
  if (visualType === 'derivative_coeff' && !forceCanvas2D) return <><DerivativeR3F />{hint3D}</>
  if (visualType === 'trig_func' && !forceCanvas2D) return <><TrigFuncR3F />{hint3D}</>
  if (visualType === 'induction' && !forceCanvas2D) return <><InductionR3F />{hint3D}</>
  if (visualType === 'discriminant' && !forceCanvas2D) return <><DiscriminantR3F />{hint3D}</>
  if (visualType === 'conic_section' && !forceCanvas2D) return <><ConicSectionR3F />{hint3D}</>
  if (visualType === 'normal_dist' && !forceCanvas2D) return <><NormalDistR3F />{hint3D}</>
  if (visualType === 'vector_2d' && !forceCanvas2D) return <><VectorR3F />{hint3D}</>

  return (
    <>
      <Viz visualType={visualType} values={values} height={height} />
      {hint3D}
    </>
  )
}

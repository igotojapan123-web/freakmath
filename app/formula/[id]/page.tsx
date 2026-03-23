import { getFormulaById, getEvolutionChain, ALL_FORMULAS } from '@/data/formulas/index'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import LevelBadge from '@/components/LevelBadge'
import FormulaLatex from '@/components/FormulaLatex'
import FormulaVizClient from '@/components/FormulaVizClient'
import FormulaSlider from '@/components/FormulaSlider'
import EvolutionChain from '@/components/EvolutionChain'
import ExampleSection from '@/components/ExampleSection'
import { CATEGORY_KO } from '@/lib/types'

export async function generateStaticParams() {
  return ALL_FORMULAS.map(f => ({ id: f.id }))
}

export default async function FormulaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const formula = getFormulaById(id)
  if (!formula) notFound()
  const chain = getEvolutionChain(id)

  const StepLabel = ({ num, title }: { num: string; title: string }) => (
    <div style={{ marginBottom: '14px' }}>
      <div style={{
        fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase',
        color: 'var(--mint)', fontWeight: 700, fontFamily: 'Syne, sans-serif',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        {num} · {title}
        <span style={{ flex: 1, height: '1px', background: 'rgba(0,255,204,0.08)', display: 'block' }} />
      </div>
    </div>
  )

  const H2 = ({ text }: { text: string }) => (
    <h2 style={{
      fontSize: '20px', fontWeight: 700, color: '#fff',
      marginBottom: '16px', fontFamily: 'Syne, sans-serif',
    }}>
      {text}
    </h2>
  )

  const divider: React.CSSProperties = {
    padding: '36px 0',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />

      {/* 전체 중앙 정렬 컨테이너 */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>

        {/* 히어로 */}
        <div style={{
          padding: '32px 0 28px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          {/* 브레드크럼 */}
          <div style={{
            fontSize: '12px', color: 'var(--sub2)',
            marginBottom: '16px', fontFamily: 'Noto Sans KR',
          }}>
            탐험 홈 · {CATEGORY_KO[formula.category]} ·{' '}
            <span style={{ color: 'var(--mint)' }}>{formula.name}</span>
          </div>

          {/* 배지들 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{
              padding: '4px 12px', borderRadius: '12px', fontSize: '11px',
              fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
              background: 'rgba(0,255,204,0.08)', color: 'var(--mint)',
              border: '1px solid rgba(0,255,204,0.18)',
            }}>{formula.id}</span>
            <LevelBadge level={formula.level} />
            <span style={{
              padding: '4px 12px', borderRadius: '12px', fontSize: '11px',
              background: 'rgba(124,58,237,0.12)', color: '#a78bfa',
              border: '1px solid rgba(124,58,237,0.2)', fontFamily: 'Noto Sans KR',
            }}>{CATEGORY_KO[formula.category]}</span>
            {formula.grade && (
              <span style={{
                padding: '4px 12px', borderRadius: '12px', fontSize: '11px',
                background: 'rgba(255,255,255,0.05)', color: 'var(--sub)',
                border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Noto Sans KR',
              }}>{formula.grade}</span>
            )}
          </div>

          {/* 제목 */}
          <h1 style={{
            fontSize: '30px', fontWeight: 900, color: '#fff',
            marginBottom: '20px', fontFamily: 'Syne, sans-serif', letterSpacing: '-1px',
          }}>{formula.name}</h1>

          {/* 공식 박스 */}
          <div style={{
            background: '#05080f',
            border: '1px solid rgba(0,255,204,0.18)',
            borderRadius: '16px', padding: '28px', textAlign: 'center',
            marginBottom: '16px',
            boxShadow: '0 0 50px rgba(0,255,204,0.04)',
          }}>
            <FormulaLatex
              latex={formula.latexDisplay || formula.latex}
              displayMode={true}
              fontSize={38}
              color="#00ffcc"
            />
            {formula.description && (
              <div style={{
                fontSize: '13px', color: 'var(--sub)',
                marginTop: '12px', fontFamily: 'Noto Sans KR',
              }}>
                {formula.description}
              </div>
            )}
          </div>

          {/* 훅 */}
          {formula.hook && (
            <div style={{
              padding: '14px 18px',
              borderLeft: '3px solid var(--mint)',
              background: 'rgba(0,255,204,0.04)',
              borderRadius: '0 12px 12px 0',
              fontSize: '14px', color: 'var(--text)',
              lineHeight: 1.7, fontFamily: 'Noto Sans KR',
            }}>
              🔥 {formula.hook}
            </div>
          )}
        </div>

        {/* 7단계 */}
        <div>

          {/* 01 시각화 */}
          <div style={divider}>
            <StepLabel num="01" title="시각화" />
            <H2 text={`눈으로 보는 ${formula.name}`} />
            <div style={{
              background: '#05080f',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px', overflow: 'hidden',
            }}>
              <FormulaVizClient
                visualType={formula.visualType}
                height={600}
              />
            </div>
          </div>

          {/* 02 원리 */}
          {formula.principle && (
            <div style={divider}>
              <StepLabel num="02" title="원리 설명" />
              <H2 text="왜 이 공식이 성립할까?" />
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '14px', padding: '22px',
                  fontSize: '14px', lineHeight: 1.9,
                  color: 'var(--text)', fontFamily: 'Noto Sans KR',
                }}
                dangerouslySetInnerHTML={{ __html: formula.principle }}
              />
            </div>
          )}

          {/* 03 탄생 스토리 */}
          {formula.story && (
            <div style={divider}>
              <StepLabel num="03" title="탄생 스토리" />
              <H2 text="이 공식은 어떻게 태어났을까?" />
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '14px', padding: '22px',
                  fontSize: '14px', lineHeight: 1.9,
                  color: 'var(--text)', fontFamily: 'Noto Sans KR',
                }}
                dangerouslySetInnerHTML={{ __html: formula.story }}
              />
            </div>
          )}

          {/* 04 실생활 */}
          {formula.realLife && formula.realLife.length > 0 && (
            <div style={divider}>
              <StepLabel num="04" title="실생활 연결" />
              <H2 text="지금 이 순간도 쓰이고 있어" />
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px',
              }}>
                {formula.realLife.map((item, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px', padding: '18px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
                    <div style={{
                      fontSize: '13px', fontWeight: 700, color: '#fff',
                      marginBottom: '5px', fontFamily: 'Noto Sans KR',
                    }}>{item.title}</div>
                    <div style={{
                      fontSize: '12px', color: 'var(--sub)',
                      lineHeight: 1.6, fontFamily: 'Noto Sans KR',
                    }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 05 슬라이더 */}
          {formula.sliders && formula.sliders.length > 0 && (
            <div style={divider}>
              <StepLabel num="05" title="직접 해보기" />
              <H2 text="슬라이더로 바꿔봐" />
              <FormulaSlider
                formula={{
                  id: formula.id,
                  sliders: formula.sliders,
                  visualType: formula.visualType,
                } as any}
              />
            </div>
          )}

          {/* 06 예제 */}
          {formula.example && (
            <div style={divider}>
              <StepLabel num="06" title="예제 문제" />
              <H2 text="직접 풀어봐" />
              <ExampleSection example={formula.example} />
            </div>
          )}

          {/* 07 계보 */}
          {chain.length > 1 && (
            <div style={{ padding: '36px 0 60px' }}>
              <StepLabel num="07" title="공식의 진화 계보" />
              <H2 text="이 개념은 어떻게 발전했을까" />
              {formula.evolution?.familyDescription && (
                <p style={{
                  fontSize: '13px', color: 'var(--sub)',
                  marginBottom: '16px', fontFamily: 'Noto Sans KR',
                }}>
                  {formula.evolution.familyDescription}
                </p>
              )}
              <EvolutionChain chain={chain} currentId={formula.id} />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

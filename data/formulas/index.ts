import { Formula } from '@/lib/types'
import { ELEMENTARY_FORMULAS } from './elementary'
import { MIDDLE_FORMULAS } from './middle'
import { HIGH_FORMULAS } from './high'

export const ALL_FORMULAS: Formula[] = [
  ...ELEMENTARY_FORMULAS,
  ...MIDDLE_FORMULAS,
  ...HIGH_FORMULAS,
]

export function getFormulaById(id: string): Formula | undefined {
  return ALL_FORMULAS.find(f => f.id === id)
}

export function getFormulasByLevel(level: string): Formula[] {
  return ALL_FORMULAS.filter(f => f.level === level)
}

export function getFormulasByCategory(category: string): Formula[] {
  return ALL_FORMULAS.filter(f => f.category === category)
}

export function searchFormulas(query: string): Formula[] {
  const q = query.toLowerCase()
  return ALL_FORMULAS.filter(f =>
    f.name.includes(q) ||
    f.description.includes(q) ||
    f.tags.some(t => t.includes(q))
  )
}

export function getRelatedFormulas(id: string, limit = 3): Formula[] {
  const formula = getFormulaById(id)
  if (!formula || !formula.relatedIds) return []
  return formula.relatedIds
    .slice(0, limit)
    .map(rid => getFormulaById(rid))
    .filter(Boolean) as Formula[]
}

export function getEvolutionChain(id: string): Formula[] {
  const formula = getFormulaById(id)
  if (!formula) return []

  const chain: Formula[] = [formula]

  // 이전 공식 찾기
  let prevId = formula.evolution.prev
  while (prevId) {
    const prev = getFormulaById(prevId)
    if (!prev) break
    chain.unshift(prev)
    prevId = prev.evolution.prev
  }

  // 다음 공식 찾기
  let nextId = formula.evolution.next
  while (nextId) {
    const next = getFormulaById(nextId)
    if (!next) break
    chain.push(next)
    nextId = next.evolution.next
  }

  return chain
}

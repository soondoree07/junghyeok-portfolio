import { describe, expect, it } from 'vitest'
import { getWrongQuizEntries, isChecklistComplete, isNumericCorrect, parseNumberInput } from '../../portfolio-editorial/src/study/lessons/grading'
import type { ChecklistQuestion, NumericQuestion } from '../../portfolio-editorial/src/study/lessons/types'

const numeric = (answer: number, tolerance?: number): NumericQuestion =>
  ({ id: 'q1', type: 'numeric', question: '', answer, tolerance, explanation: '' })

describe('레슨 문제 채점', () => {
  it('쉼표 · 공백 · 단위가 붙은 입력에서 숫자를 읽는다', () => {
    expect(parseNumberInput('12,500메소')).toBe(12500)
    expect(parseNumberInput(' 3.5 ')).toBe(3.5)
    expect(parseNumberInput('-20%')).toBe(-20)
  })

  it('숫자가 아니면 읽지 않는다', () => {
    expect(parseNumberInput('')).toBeNull()
    expect(parseNumberInput('abc')).toBeNull()
    expect(parseNumberInput('1.2.3')).toBeNull()
  })

  it('허용 오차 안이면 정답, 없으면 정확히 같아야 정답', () => {
    expect(isNumericCorrect(numeric(100), 100)).toBe(true)
    expect(isNumericCorrect(numeric(100), 100.01)).toBe(false)
    expect(isNumericCorrect(numeric(100, 0.5), 100.5)).toBe(true)
    expect(isNumericCorrect(numeric(0.3), 0.1 + 0.2)).toBe(true)
  })

  it('체크리스트는 전부 체크해야 완료', () => {
    const question = { items: ['a', 'b', 'c'] } as ChecklistQuestion
    expect(isChecklistComplete(question, [0, 2])).toBe(false)
    expect(isChecklistComplete(question, [2, 0, 1])).toBe(true)
  })

  it('마지막 답이 틀린 문제만 날짜 순으로 모은다', () => {
    const records = {
      days: {}, reviews: {}, postponed: {},
      quiz: {
        '2026-10-02|b': { correct: false, answeredOn: '2026-10-02' },
        '2026-10-01|a': { correct: false, answeredOn: '2026-10-01' },
        '2026-10-01|ok': { correct: true, answeredOn: '2026-10-01' },
      },
    }
    expect(getWrongQuizEntries(records).map((entry) => entry.key)).toEqual(['2026-10-01|a', '2026-10-02|b'])
  })
})

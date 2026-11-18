import { describe, expect, it } from 'vitest'
import { LIMITS, parseRecords } from '../../portfolio-editorial/src/study/lib/validateRecords'

const day = { checks: { 'am-0': true }, minutes: 30, memo: '', links: [], completed: false }

describe('기록 가져오기 형태 검사', () => {
  it('빈 칸은 빈 기록으로 채운다', () => {
    expect(parseRecords({})).toEqual({ days: {}, reviews: {}, quiz: {}, postponed: {} })
  })

  it('올바른 기록은 그대로 통과한다', () => {
    const records = {
      days: { '2026-10-01': day },
      reviews: { '2026-10-02|2026-10-01|0': { result: 'known', answeredOn: '2026-10-02' } },
      quiz: { '2026-10-01|q-1': { correct: true, answeredOn: '2026-10-01', value: 3 } },
      postponed: { '2026-10-03': true },
    }
    expect(parseRecords(records)).toEqual(records)
  })

  it('날짜 키 · 값 범위가 틀리면 통째로 거른다', () => {
    expect(parseRecords({ days: { '10월 1일': day } })).toBeNull()
    expect(parseRecords({ days: { '2026-10-01': { ...day, minutes: LIMITS.minutes + 1 } } })).toBeNull()
    expect(parseRecords({ reviews: { '2026-10-02|2026-10-01|0': { result: 'maybe', answeredOn: '2026-10-02' } } })).toBeNull()
    expect(parseRecords([])).toBeNull()
    expect(parseRecords(null)).toBeNull()
  })
})

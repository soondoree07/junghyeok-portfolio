import { describe, expect, it } from 'vitest'
import { addDays, diffDays, eachDate, formatLong, formatShort, isValidDate, todayInSeoul } from '../../portfolio-editorial/src/study/lib/seoulDate'

describe('서울 날짜 계산', () => {
  it('UTC 로는 전날이어도 서울 기준 날짜를 돌려준다', () => {
    expect(todayInSeoul(new Date('2026-09-28T15:30:00Z'))).toBe('2026-09-29')
  })

  it('달 · 해를 넘겨 더하고 뺀다', () => {
    expect(addDays('2026-09-30', 1)).toBe('2026-10-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(diffDays('2026-10-11', '2026-10-21')).toBe(10)
  })

  it('기간의 날짜를 처음과 끝 포함해 나열한다', () => {
    expect(eachDate('2026-10-30', '2026-11-02')).toEqual(['2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02'])
  })

  it('없는 날짜는 거른다', () => {
    expect(isValidDate('2026-02-29')).toBe(false)
    expect(isValidDate('2026-13-01')).toBe(false)
    expect(isValidDate('2026-9-1')).toBe(false)
    expect(isValidDate('2028-02-29')).toBe(true)
  })

  it('화면용 날짜에 요일을 붙인다', () => {
    expect(formatShort('2026-09-28')).toBe('09.28 (월)')
    expect(formatLong('2026-09-28')).toBe('2026년 9월 28일 월요일')
  })
})

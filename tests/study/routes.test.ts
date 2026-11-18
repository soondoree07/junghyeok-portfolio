import { describe, expect, it } from 'vitest'
import { href, parseRoute, type Route } from '../../portfolio-editorial/src/study/routes'

describe('공부 사이트 주소', () => {
  it('빈 주소는 오늘 공부, #/work 는 옛 포트폴리오 홈', () => {
    expect(parseRoute('')).toEqual({ name: 'today' })
    expect(parseRoute('#/work')).toEqual({ name: 'home' })
  })

  it('만든 주소를 다시 읽으면 같은 화면이 나온다', () => {
    const routes: Route[] = [
      { name: 'roadmap' }, { name: 'overview' }, { name: 'today' }, { name: 'review' }, { name: 'log' },
      { name: 'day', date: '2026-10-01' }, { name: 'tool', tool: 'excel' }, { name: 'lesson', tool: 'excel', day: 6 },
    ]
    for (const route of routes) expect(parseRoute(href(route))).toEqual(route)
  })

  it('틀린 날짜 · 툴 · 일차는 개요로 보낸다', () => {
    expect(parseRoute('#/study/day/2026-02-30')).toEqual({ name: 'overview' })
    expect(parseRoute('#/study/tool/unknown')).toEqual({ name: 'overview' })
    expect(parseRoute('#/study/lesson/excel/abc')).toEqual({ name: 'overview' })
  })
})

import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { PROJECTS } from '../../portfolio-folio/js/projects.js'
import { RETROS } from '../../portfolio-folio/js/project-retros.js'

// junghyeok.com 책장 데이터: 책 한 권 = 프로젝트 하나 (portfolio-folio/README.md)
const imagesDir = path.resolve(import.meta.dirname, '../../portfolio-folio/images')

describe('책장 프로젝트 데이터', () => {
  it('id 가 겹치지 않는다', () => {
    const ids = PROJECTS.map((project) => project.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('학교 프로젝트는 회사 · 개인 뒤에 온다', () => {
    const firstSchool = PROJECTS.findIndex((project) => project.school)
    expect(firstSchool).toBeGreaterThan(0)
    expect(PROJECTS.slice(firstSchool).every((project) => project.school)).toBe(true)
  })

  it('캡처로 적은 파일이 images/<id>/ 에 있다', () => {
    const missing = PROJECTS.flatMap((project) =>
      (project.shots ?? []).map((shot) => `${project.id}/${shot.file}`))
      .filter((file) => !fs.existsSync(path.join(imagesDir, file)))
    expect(missing).toEqual([])
  })

  it('돌아보기는 있는 프로젝트에만 붙는다', () => {
    const ids = new Set(PROJECTS.map((project) => project.id))
    expect(Object.keys(RETROS).filter((id) => !ids.has(id))).toEqual([])
  })
})

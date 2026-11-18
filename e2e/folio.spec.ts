import fs from 'node:fs'
import path from 'node:path'
import { expect, test, type Page } from '@playwright/test'
import { blockOutside, collectErrors, horizontalOverflow } from './watch'

// three.js 는 jsDelivr 에서 받는다. 바깥은 막고, 같은 버전(0.160.0, devDependency)을 로컬 파일로 돌려준다
const threeDir = path.resolve(import.meta.dirname, '../node_modules/three')

async function serveThreeLocally(page: Page) {
  await page.route(/^https:\/\/cdn\.jsdelivr\.net\/npm\/three@0\.160\.0\/(.+)$/, (route) => {
    const file = path.join(threeDir, new URL(route.request().url()).pathname.replace('/npm/three@0.160.0/', ''))
    if (!fs.existsSync(file)) return route.fulfill({ status: 404 })
    return route.fulfill({ body: fs.readFileSync(file), contentType: 'text/javascript' })
  })
}

async function open(page: Page, { skipIntro }: { skipIntro: boolean }) {
  await blockOutside(page)
  await serveThreeLocally(page) // 나중에 등록한 route 가 먼저 걸린다
  if (skipIntro) await page.addInitScript(() => sessionStorage.setItem('folio-blueprint-seen', '1'))
  const errors = collectErrors(page)
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  return errors
}

test('책장이 뜨고 Projects 로 펼쳤다 돌아온다', async ({ page }) => {
  const errors = await open(page, { skipIntro: true })
  await expect(page.locator('h1.wordmark')).toBeVisible()
  await expect(page.locator('html')).not.toHaveClass(/intro-pending/)
  await page.waitForLoadState('networkidle')
  expect(await horizontalOverflow(page), '가로 스크롤').toBeLessThanOrEqual(0)

  const projects = page.locator('a[data-open="projects"]')
  await projects.click()
  await expect(page.locator('html')).toHaveClass(/grid-mode/)
  await projects.click()
  await expect(page.locator('html')).not.toHaveClass(/grid-mode/)
  expect(errors, '콘솔 오류').toEqual([])
})

test('첫 접속 인트로가 나오고 클릭하면 사이트가 열린다', async ({ page }) => {
  const errors = await open(page, { skipIntro: false })
  await expect(page.locator('html')).toHaveClass(/intro-playing/)
  await page.mouse.click(200, 200)
  await expect(page.locator('html')).not.toHaveClass(/intro-playing|intro-pending/, { timeout: 10_000 })
  await expect(page.locator('h1.wordmark')).toBeVisible()
  expect(errors, '콘솔 오류').toEqual([])
})

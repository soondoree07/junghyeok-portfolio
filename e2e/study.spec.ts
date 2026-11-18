import { expect, test } from '@playwright/test'
import { blockOutside, collectErrors, horizontalOverflow } from './watch'

// 로그인 없이 누구나 보는 화면만. 로그인해야 고칠 수 있는 기록 편집은 보지 않는다 (harness.json auth)
const paths = [
  '/', '/#/work', '/#/roadmap', '/#/study', '/#/study/today', '/#/study/review', '/#/study/log',
  '/#/study/tool/excel', '/#/study/lesson/excel/1',
]

for (const path of paths) {
  test(`${path} 화면이 뜬다`, async ({ page }) => {
    await blockOutside(page)
    // preview 에는 api/ 가 없다 — 서버 호출이 실제 서비스로 나가지 않게 여기서 끊는다
    await page.route('**/api/**', (route) => route.abort())
    const errors = collectErrors(page)

    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1, h2').first()).toBeVisible()
    await page.waitForLoadState('networkidle')

    expect(await horizontalOverflow(page), '가로 스크롤').toBeLessThanOrEqual(0)
    expect(errors, '콘솔 오류').toEqual([])
  })
}

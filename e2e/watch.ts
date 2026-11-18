import type { Page } from '@playwright/test'

// 두 앱이 같이 쓰는 점검: 바깥 주소 막기 · 콘솔 오류 · 우리 서버 실패 요청 · 가로 스크롤
// 바깥 주소(글꼴 · CDN · 구글 · Upstash)는 전부 막는다 — 우리 코드만 보고, 실제 서비스에 닿지 않게
export async function blockOutside(page: Page) {
  await page.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (route) => route.abort())
}

/** 오류를 모으는 배열을 돌려준다. ignore 에 걸리는 우리 주소 응답은 오류로 치지 않는다 */
export function collectErrors(page: Page, ignore: RegExp[] = []) {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    // 실패한 요청은 아래 response 에서 주소와 함께 잡는다 (막은 바깥 주소도 이 문구로 나온다)
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) errors.push(message.text())
  })
  page.on('response', (response) => {
    const url = response.url()
    if (response.status() >= 400 && !ignore.some((pattern) => pattern.test(url))) errors.push(`${response.status()} ${url}`)
  })
  return errors
}

export async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
}

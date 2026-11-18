import { devices } from '@playwright/test'

// 배정 포트 4105 + 50. 다른 프로젝트 E2E 와 겹치지 않게 고정 (두 앱이 차례로 같은 포트를 쓴다)
export const port = Number(process.env.E2E_PORT ?? 4155)

export const viewports = [
  { name: 'pc', use: { ...devices['Desktop Chrome'] } },
  { name: 'phone', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
]

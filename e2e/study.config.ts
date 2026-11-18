import { defineConfig } from '@playwright/test'
import { port, viewports } from './ports'

// study.junghyeok.com 공부 사이트 (portfolio-editorial). 배포와 같은 빌드 결과물을 vite preview 로 띄운다
// api/(구글 로그인 · Upstash) 는 preview 에 없어서 서버 호출은 실패하고 화면은 보기 전용으로 뜬다
export default defineConfig({
  testDir: '.',
  testMatch: 'study.spec.ts',
  fullyParallel: true,
  reporter: 'line',
  outputDir: '../logs/e2e-results/study',
  use: { baseURL: `http://localhost:${port}` },
  projects: viewports,
  webServer: {
    command: `npx vite build && npx vite preview --port ${port} --strictPort`,
    cwd: '../portfolio-editorial',
    port,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: 'ignore',
  },
})

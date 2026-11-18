import { defineConfig } from '@playwright/test'
import { port, viewports } from './ports'

// junghyeok.com 책장 (portfolio-folio, 빌드 없는 정적 사이트). 배포와 같은 파일을 그대로 띄운다
export default defineConfig({
  testDir: '.',
  testMatch: 'folio.spec.ts',
  fullyParallel: true,
  reporter: 'line',
  outputDir: '../logs/e2e-results/folio',
  use: { baseURL: `http://localhost:${port}` },
  projects: viewports,
  webServer: {
    command: `python3 -m http.server ${port} --bind 127.0.0.1 --directory portfolio-folio`,
    cwd: '..',
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: false,
    timeout: 60_000,
    stdout: 'ignore',
    stderr: 'ignore', // python 접속 기록이 결과를 덮지 않게
  },
})

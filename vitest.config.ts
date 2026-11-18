import { defineConfig } from 'vitest/config'

// 단위 테스트는 tests/ 아래만 (공부 사이트 = tests/study, 책장 = tests/folio). 화면 흐름은 e2e/ (Playwright)
// 앱 폴더 안에 두지 않는 이유: portfolio-editorial 의 tsc 빌드(Vercel)가 vitest 를 못 찾고, portfolio-folio 는 폴더째 배포된다
export default defineConfig({
  css: { postcss: {} },
  test: { include: ['tests/**/*.test.{ts,js}'], environment: 'node' },
})

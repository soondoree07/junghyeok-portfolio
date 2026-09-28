import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 상위 폴더(이전 cinematic 프로젝트)의 postcss·tailwind 설정을 끌어오지 않게 막는다
  css: { postcss: {} },
  server: {
    host: true,
    port: 5174,
  },
});

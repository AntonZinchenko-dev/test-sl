import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// GitHub Pages для project-сайта (не username.github.io) отдаёт сборку по адресу
// https://<user>.github.io/<repo>/ — Vite должен знать этот префикс, иначе абсолютные
// пути ассетов в index.html будут указывать на несуществующий https://<user>.github.io/assets/...
// Префикс включаем только при сборке под GitHub Pages (`vite build --mode gh-pages`,
// см. .github/workflows/deploy.yml), обычный `npm run build`/`npm run dev`/e2e его не видят.
const GH_PAGES_BASE = '/test-sl/';

export default defineConfig(({ mode }) => ({
  base: mode === 'gh-pages' ? GH_PAGES_BASE : '/',
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}));

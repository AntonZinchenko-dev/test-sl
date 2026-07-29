// GitHub Pages — статический хостинг без серверных rewrite-правил: прямой переход по ссылке
// вида /repo/auctions/<uuid> (или обновление страницы на таком URL) ищет файл на диске и
// отдаёт 404. Стандартный обходной путь для SPA — продублировать index.html как 404.html:
// GitHub Pages отдаёт его для любого несуществующего пути, а дальше React Router на клиенте
// сам разбирает fragment/pathname и рендерит нужный маршрут.
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const indexHtml = resolve(distDir, 'index.html');
const notFoundHtml = resolve(distDir, '404.html');

if (!existsSync(indexHtml)) {
  console.error(`[copy-spa-404] ${indexHtml} не найден — запустите после "vite build".`);
  process.exit(1);
}

copyFileSync(indexHtml, notFoundHtml);
console.log('[copy-spa-404] dist/404.html создан из dist/index.html');

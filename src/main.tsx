import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App.component';
import './app/styles/global.css';

async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
    // Под GitHub Pages приложение живёт не в корне (https://user.github.io/repo/), поэтому
    // скрипт воркера и его scope должны учитывать base-префикс — иначе он 404-ится/не активируется.
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

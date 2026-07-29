import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // `mocks/` — инфраструктурная папка MSW (bootstrap уровня app), не бизнес-слайс FSD.
    ignores: ['./src/mocks/**'],
  },
  {
    rules: {
      // В проекте намеренно есть слайсы с одним потребителем (widgets/auction-detail,
      // widgets/auctions-list, features/set-bet, features/bets-history) — того требует
      // структура FSD-слоёв из ТЗ (widgets/features как самостоятельные единицы), это не
      // "случайное" дробление, а явное разделение ответственности по слоям.
      'fsd/insignificant-slice': 'off',
    },
  },
]);

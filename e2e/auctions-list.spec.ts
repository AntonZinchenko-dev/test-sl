import { test, expect } from '@playwright/test';

// Мок-БД детерминирована (фиксированный сид в mocks/db.ts): 48 аукционов,
// cargo_num = String(1000 + id).padStart(11, '0'), первая запись — 00000001001.
const FIRST_CARGO_NUM = '00000001001';

test.describe('Список аукционов', () => {
  test('загружается, показывает карточки и пагинацию', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Список аукционов' })).toBeVisible();

    const cards = page.getByTestId('auction-card');
    await expect(cards.first()).toBeVisible();
    await expect(cards).toHaveCount(20); // per_page по умолчанию = 20, всего записей 48

    await expect(page.getByText(/Найдено \d+ аукционов/)).toBeVisible();

    // Пагинация: 48 записей / 20 на странице = 3 страницы → должна отрисоваться.
    const pagination = page.getByRole('navigation', { name: 'Пагинация' });
    await expect(pagination).toBeVisible();

    const firstCardBefore = await cards.first().getAttribute('data-cargo-num');
    await pagination.getByRole('button', { name: 'Следующая страница' }).click();

    await expect(page).toHaveURL(/page=2/);
    await expect(cards.first()).toBeVisible();
    const firstCardAfter = await cards.first().getAttribute('data-cargo-num');
    expect(firstCardAfter).not.toBe(firstCardBefore);
  });

  test('фильтр по номеру заявки находит ровно один аукцион и отражается в URL', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('00000001059').fill(FIRST_CARGO_NUM);
    await page.getByRole('button', { name: 'Применить' }).click();

    await expect(page).toHaveURL(new RegExp(`cargo_num=${FIRST_CARGO_NUM}`));
    const cards = page.getByTestId('auction-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toHaveAttribute('data-cargo-num', FIRST_CARGO_NUM);
  });

  test('фильтр «только доступные для ставки» сужает список и пишется в URL', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Найдено 48 аукционов/)).toBeVisible();

    await page.getByLabel('Только доступные для ставки').check();
    await page.getByRole('button', { name: 'Применить' }).click();

    await expect(page).toHaveURL(/is_available=true/);
    await expect(page).toHaveURL(/page=1/);
    const found = await page.getByText(/Найдено \d+ аукционов/).textContent();
    const total = Number(found?.match(/\d+/)?.[0]);
    expect(total).toBeGreaterThan(0);
    expect(total).toBeLessThan(48);
  });

  test('сброс фильтров возвращает к дефолтным search-параметрам', async ({ page }) => {
    await page.goto('/?cargo_num=00000001001&page=1');
    await expect(page.getByTestId('auction-card')).toHaveCount(1);

    await page.getByRole('button', { name: 'Сбросить' }).click();

    await expect(page).not.toHaveURL(/cargo_num=/);
    await expect(page.getByTestId('auction-card')).toHaveCount(20);
  });
});

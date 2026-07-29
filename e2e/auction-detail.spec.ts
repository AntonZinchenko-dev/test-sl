import { test, expect } from '@playwright/test';

test.describe('Детальная страница аукциона', () => {
  test('открывается по клику из списка и переключает вкладки Обзор/Ставки', async ({ page }) => {
    await page.goto('/');

    const firstCard = page.getByTestId('auction-card').first();
    const cargoNum = await firstCard.getAttribute('data-cargo-num');
    await firstCard.getByRole('link', { name: new RegExp(`№ ${cargoNum}`) }).click();

    await expect(page).toHaveURL(/\/auctions\/.+/);
    await expect(page.getByRole('heading', { name: new RegExp(`Заявка № ${cargoNum}`) })).toBeVisible();

    // По умолчанию открывается вкладка "Обзор" — видны карточки маршрута/груза/оплаты.
    await expect(page.getByText('Маршрут', { exact: true })).toBeVisible();
    await expect(page.getByText('Условия оплаты', { exact: true })).toBeVisible();

    await page.getByRole('link', { name: 'Ставки' }).click();
    await expect(page).toHaveURL(/tab=bets/);
    await expect(page.getByText('История ставок', { exact: true })).toBeVisible();

    await page.getByRole('link', { name: 'Обзор' }).click();
    await expect(page).toHaveURL(/tab=overview/);
    await expect(page.getByText('Параметры торгов', { exact: true })).toBeVisible();
  });

  test('несуществующий аукцион показывает состояние "не найден"', async ({ page }) => {
    await page.goto('/auctions/00000000-0000-4000-8000-000000000000');
    await expect(page.getByText('Аукцион не найден')).toBeVisible();
  });

  test('несуществующий маршрут показывает 404-страницу', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByText('Страница не найдена')).toBeVisible();
    await page.getByRole('link', { name: 'На главную' }).click();
    await expect(page).toHaveURL(/^http:\/\/localhost:4310\/(\?.*)?$/);
  });
});

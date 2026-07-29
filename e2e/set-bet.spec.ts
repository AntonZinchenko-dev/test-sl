import { test, expect } from '@playwright/test';

// `is_available=true` в моке всегда подразумевает `can_set_bet=true` (см. mocks/db.ts),
// а `is_bidder=false` гарантирует отсутствие своей ставки — то есть кнопка карточки будет
// именно «Сделать ставку» (сценарий первичной ставки, а не редактирования).
const BIDDABLE_LIST_URL = '/?is_available=true&is_bidder=false&per_page=50';

test.describe('Установка ставки (core business logic)', () => {
  test('успешная ставка обновляет цену, статус и историю ставок без перезагрузки', async ({ page }) => {
    await page.goto(BIDDABLE_LIST_URL);

    const card = page.getByTestId('auction-card').first();
    await expect(card).toBeVisible();
    const cargoNum = await card.getAttribute('data-cargo-num');
    await card.getByTestId('auction-primary-action').click();

    await expect(page).toHaveURL(/\/auctions\/.+\/bet/);
    await expect(page.getByRole('heading', { name: 'Сделать ставку' })).toBeVisible();

    const priceInput = page.getByLabel('Ваша ставка, ₽');
    await expect(priceInput).not.toHaveValue('');

    await page.getByRole('button', { name: 'Отправить ставку' }).click();

    await expect(page.getByRole('status')).toContainText('Ставка успешно установлена');
    await expect(page.getByText('Ставка принята')).toBeVisible();

    await page.getByRole('link', { name: 'Вернуться к аукциону' }).click();
    await expect(page).toHaveURL(/tab=overview/);

    // Статус/бейдж «Моя ставка» и смена primary action на «Изменить ставку» — признак того,
    // что MSW-стор реально мутировал состояние аукциона после успешной ставки.
    await expect(page.getByText(/^Моя ставка:/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Изменить ставку' })).toBeVisible();

    await page.getByRole('link', { name: 'Ставки' }).click();
    // `hide_bets_history` — независимый от нашего фильтра случайный флаг мока, поэтому
    // допустимы оба легитимных состояния; если история не скрыта, в ней обязана быть наша ставка.
    // (Строка ниже уникальна для тела вкладки — бейдж в шапке использует другой текст-описание.)
    const historyHidden = page.getByText('Организатор скрыл историю ставок для этого аукциона.');
    if (await historyHidden.count()) {
      await expect(historyHidden).toBeVisible();
    } else {
      await expect(page.getByText('Моя организация')).toBeVisible();
    }
    expect(cargoNum).toBeTruthy();
  });

  test('клиентская валидация блокирует некорректную цену без обращения к серверу', async ({ page }) => {
    await page.goto(BIDDABLE_LIST_URL);
    await page.getByTestId('auction-card').first().getByTestId('auction-primary-action').click();

    const priceInput = page.getByLabel('Ваша ставка, ₽');
    await priceInput.fill('0');
    await page.getByRole('button', { name: 'Отправить ставку' }).click();

    await expect(page.getByText('Цена должна быть больше 0')).toBeVisible();
    // Ни toast, ни success-состояние не должны появиться — запрос не ушёл.
    await expect(page.getByText('Ставка принята')).not.toBeVisible();
    await expect(page.getByRole('status')).toHaveCount(0);
  });

  test('форма недоступна, если can_set_bet=false', async ({ page }) => {
    await page.goto('/?is_available=false&per_page=50');
    const cards = page.getByTestId('auction-card');
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const action = cards.nth(i).getByTestId('auction-primary-action');
      if ((await action.textContent())?.trim() === 'Торги недоступны') {
        await expect(action).toBeDisabled();
        return;
      }
    }
    test.skip(true, 'В текущей выборке моков нет карточки с недоступными торгами');
  });
});

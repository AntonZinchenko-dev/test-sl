import { http, HttpResponse } from 'msw';
import { db, recalcPlaces } from './db';
import { AUCTION_STATUS_NUMERIC } from '@/shared/config/enums';
import type { AuctionListRequest, AuctionListItem } from '@/entities/auction/model/types';

const problem = (status: number, code: string, title: string, message: string) =>
  HttpResponse.json({ code, title, message }, { status });

function matches(item: AuctionListItem, body: AuctionListRequest): boolean {
  if (body.cargo_num && !item.main.cargo_num.includes(body.cargo_num)) return false;
  if (body.auc_type?.length && !body.auc_type.includes(item.main.auc_type)) return false;
  if (body.status?.length && !body.status.includes(item.trading.status_mobile)) return false;
  if (body.statuses?.length) {
    const num = AUCTION_STATUS_NUMERIC[item.trading.status];
    if (!body.statuses.includes(num)) return false;
  }
  if (body.load_city && item.route.load.city !== body.load_city) return false;
  if (body.unload_city && item.route.unload.city !== body.unload_city) return false;
  if (body.is_available !== undefined && item.trading.is_available !== body.is_available) return false;
  if (body.is_bidder !== undefined && item.trading.is_bidder !== body.is_bidder) return false;
  if (body.load_date_from && item.route.load.date < body.load_date_from) return false;
  if (body.load_date_to && item.route.load.date > body.load_date_to) return false;
  const current = item.trading.price?.current ?? 0;
  if (body.current_price_from !== undefined && current < body.current_price_from) return false;
  if (body.current_price_to !== undefined && current > body.current_price_to) return false;
  return true;
}

export const handlers = [
  http.post('/api/v1/auctions/list', async ({ request }) => {
    const body = ((await request.json().catch(() => ({}))) ?? {}) as AuctionListRequest;
    const page = body.page && body.page > 0 ? body.page : 1;
    const perPage = body.per_page && body.per_page > 0 ? Math.min(body.per_page, 100) : 20;

    const all = Array.from(db.auctions.values())
      .map((r) => r.listItem)
      .filter((item) => matches(item, body))
      .sort((a, b) => (body.is_oldest ? 1 : -1) * (new Date(a.main.created_at).getTime() - new Date(b.main.created_at).getTime()));

    const total = all.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const from = (page - 1) * perPage;
    const data = all.slice(from, from + perPage);

    return HttpResponse.json({
      data,
      meta: { current_page: page, from: from + 1, last_page: lastPage, per_page: perPage, to: from + data.length, total },
    });
  }),

  http.get('/api/v1/auctions/:auctionUuid', ({ params }) => {
    const record = db.auctions.get(params.auctionUuid as string);
    if (!record) return problem(404, 'resource_not_found', 'Не найдено', 'Аукцион не найден');
    return HttpResponse.json(record.detail);
  }),

  http.get('/api/v1/auctions/:auctionUuid/bets', ({ params, request }) => {
    const uuid = params.auctionUuid as string;
    const record = db.auctions.get(uuid);
    if (!record) return problem(404, 'resource_not_found', 'Не найдено', 'Аукцион не найден');
    const url = new URL(request.url);
    const all = url.searchParams.get('all') === 'true';
    const bets = (db.bets.get(uuid) ?? []).filter((b) => all || !b.is_rejected);
    return HttpResponse.json({ bets });
  }),

  http.post('/api/v1/auctions/:auctionUuid/bets', async ({ params, request }) => {
    const uuid = params.auctionUuid as string;
    const record = db.auctions.get(uuid);
    if (!record) return problem(404, 'resource_not_found', 'Не найдено', 'Аукцион не найден');

    const body = (await request.json().catch(() => ({}))) as { price?: number };
    const errors: { field: string; message: string; code?: string }[] = [];
    const price = body.price;
    const priceInfo = record.detail.trading.price;

    if (typeof price !== 'number' || Number.isNaN(price)) {
      errors.push({ field: 'price', message: 'Цена обязательна', code: 'required' });
    } else if (price <= 0) {
      errors.push({ field: 'price', message: 'Цена должна быть больше 0', code: 'min_value' });
    } else {
      if (priceInfo.min != null && price < priceInfo.min) errors.push({ field: 'price', message: `Цена не может быть меньше ${priceInfo.min}`, code: 'min_value' });
      if (priceInfo.max != null && price > priceInfo.max) errors.push({ field: 'price', message: `Цена не может быть больше ${priceInfo.max}`, code: 'max_value' });
    }
    if (!record.detail.trading.can_set_bet) {
      errors.push({ field: 'price', message: 'Установка ставки недоступна для этого аукциона', code: 'bet_not_allowed' });
    }

    if (errors.length) {
      return HttpResponse.json(
        { code: 'validation_failed', title: 'Ошибка валидации', message: 'Запрос содержит некорректные поля.', errors },
        { status: 422 },
      );
    }

    // Мутация состояния мока: обновляем текущую цену, статус пользователя и список ставок.
    record.detail.trading.price.current = price!;
    record.detail.trading.price.current_no_vat = Math.round((price! / 1.2) * 100) / 100;
    record.detail.trading.price.available = Math.max(priceInfo.min ?? 0, price! - (priceInfo.step ?? 0));
    record.detail.trading.your = { bet: true, last_bet: price!, last_bet_with_vat: price!, win: false };
    record.detail.trading.status_mobile = 'Leading';
    record.detail.trading.is_bidder = true;

    record.listItem.trading.price = { start: record.listItem.trading.price?.start ?? price!, current: price!, current_no_vat: record.detail.trading.price.current_no_vat };
    record.listItem.trading.your = { bet: true, last_bet: price! };
    record.listItem.trading.status_mobile = 'Leading';
    record.listItem.trading.is_bidder = true;

    const bets = db.bets.get(uuid) ?? [];
    const newBet = {
      id: Date.now(),
      created_at: new Date().toISOString().slice(0, 19),
      auction_id: record.id,
      subscriber_id: 999,
      contact_name: 'Я',
      contact_phone: '+79990000000',
      price_with_vat: price!,
      price_no_vat: record.detail.trading.price.current_no_vat,
      organization_id: 999,
      organization_inn: '9999999999',
      organization_name: 'Моя организация',
      transporter_comment: null,
      is_rejected: false,
      is_counter: false,
      place: 1,
      is_win: false,
      run_number: 0,
      cancel_reason: '',
    };
    db.bets.set(uuid, recalcPlaces([newBet, ...bets.filter((b) => b.organization_id !== 999)]));

    return HttpResponse.json({ ok: true, price: price! });
  }),
];

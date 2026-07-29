import { CITIES } from '@/shared/config/cities';
import { AUCTION_STATUS_NUMERIC } from '@/shared/config/enums';
import type {
  AuctionListItem,
  AuctionShowResponse,
} from '@/entities/auction/model/types';
import type { BetItem } from '@/entities/bet/model/types';

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260729);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const intBetween = (min: number, max: number) => Math.floor(min + rand() * (max - min + 1));
const isoOffsetDaysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 19);
};

const AUC_TYPES = ['Request', 'Up', 'Down', 'FixPrice'] as const;
const CARGO_NAMES = ['Мороженое', 'Металлопрокат', 'Стройматериалы', 'Электроника', 'Бытовая химия', 'Овощи', 'Текстиль'];
const BODY_TYPES = ['тентованный', 'фургон', 'рефрижератор', 'изотерм'];
const CANCEL_REASONS = [
  'Отозвана перевозчиком',
  'Перебита более выгодной ставкой',
  'Отклонена организатором',
  'Истекло время подтверждения',
];

export interface AuctionRecord {
  uuid: string;
  id: number;
  listItem: AuctionListItem;
  detail: AuctionShowResponse;
}

interface Db {
  auctions: Map<string, AuctionRecord>;
  bets: Map<string, BetItem[]>;
}

function buildAuction(id: number): AuctionRecord {
  const uuid = `a${String(id).padStart(8, '0')}-${String(rand()).slice(2, 6)}-4${String(rand()).slice(2, 4)}-8${String(rand()).slice(2, 4)}-${String(rand()).slice(2, 14).padEnd(12, '0')}`;
  const aucType = pick(AUC_TYPES);
  const statusNum = intBetween(1, 8);
  const statusName = Object.entries(AUCTION_STATUS_NUMERIC).find(([, n]) => n === statusNum)![0] as any;
  const loadCity = pick(CITIES);
  let unloadCity = pick(CITIES);
  while (unloadCity.gc_id === loadCity.gc_id) unloadCity = pick(CITIES);

  const start = 20000 + intBetween(-5000, 20000);
  const step = pick([200, 500, 1000]);
  const isBidder = rand() > 0.6;
  const hasBet = isBidder && rand() > 0.4;
  const myLastBet = hasBet ? start - step * intBetween(1, 4) : null;
  const current = hasBet ? Math.min(start, myLastBet ?? start) : start;
  const isAvailable = statusNum === 2 && rand() > 0.2;
  const statusMobile = !isBidder ? 'NotParticipating' : hasBet ? pick(['Leading', 'Losing', 'Winner']) : 'NotParticipating';

  const weight = intBetween(1, 20);
  const volume = intBetween(1, 90);
  const cargoName = pick(CARGO_NAMES);
  const bodyType = pick(BODY_TYPES);
  // min всегда лежит на той же сетке шага, что и start/current — иначе available (клэмп по min) не пройдёт client-side step-валидацию.
  const stepsBelowStart = Math.max(1, Math.round((start * 0.3) / step));
  const min = start - step * stepsBelowStart;
  const max = start;
  const distance = intBetween(150, 2500);
  const priceInfo = {
    start,
    start_no_vat: Math.round((start / 1.2) * 100) / 100,
    current,
    current_no_vat: Math.round((current / 1.2) * 100) / 100,
    available: Math.max(min, current - step),
    available_no_vat: Math.round((Math.max(min, current - step) / 1.2) * 100) / 100,
    min,
    min_no_vat: Math.round((min / 1.2) * 100) / 100,
    max,
    max_no_vat: Math.round((max / 1.2) * 100) / 100,
    step,
    step_no_vat: Math.round((step / 1.2) * 100) / 100,
    price_per_km: distance ? Math.round((current / 1.2 / distance) * 100) / 100 : 0,
  };

  const hidePointsAndContacts = rand() > 0.6;
  const hideBetsHistory = rand() > 0.75;
  const canSetBet = statusNum === 2 && isAvailable;
  const cargoDate = isoOffsetDaysFromNow(intBetween(-3, 2));
  const loadDate = isoOffsetDaysFromNow(intBetween(1, 10));
  const unloadDate = isoOffsetDaysFromNow(intBetween(11, 20));

  const listItem: AuctionListItem = {
    main: {
      id,
      cargo_num: String(1000 + id).padStart(11, '0'),
      cargo_date: cargoDate,
      auc_type: aucType,
      order_uid: uuid,
      created_at: cargoDate,
      priority_sort: 0,
      is_assembly: false,
      price_per_km: priceInfo.price_per_km,
    },
    organizer: {
      subscriber_id: 90 + (id % 12),
      organization_id: 300 + id,
      organization_name: pick(['ЛИМ', 'ТрансЛогистик', 'КарgoПро', 'ГрузСервис']),
      organization_inn: String(7700000000 + id * 37),
      organization_kpp: String(770300000 + id),
      is_hide_organization: false,
    },
    route: {
      load: { city: loadCity.name, address: 'Складская 1', date: loadDate, city_gc_id: loadCity.gc_id, points_count: 1 },
      unload: { city: unloadCity.name, address: 'Терминальная 2', date: unloadDate, city_gc_id: unloadCity.gc_id, points_count: 1 },
    },
    cargo: {
      name: cargoName,
      weight,
      volume,
      body_type: bodyType,
      truck_count: 1,
      is_cargo: true,
    },
    trading: {
      status: statusName,
      status_mobile: statusMobile as any,
      start_time: isoOffsetDaysFromNow(0),
      stop_time: isoOffsetDaysFromNow(0),
      bid_measurement_type: 'PerRoute',
      can_set_bet: canSetBet,
      allow_counter_bets: true,
      hide_points_address_and_contacts: hidePointsAndContacts,
      is_bidder: isBidder,
      is_available: isAvailable,
      is_favorite: false,
      price: { start: priceInfo.start, current: priceInfo.current, current_no_vat: priceInfo.current_no_vat },
      your: { bet: hasBet, last_bet: myLastBet },
      step,
    },
    payment: { form: 'Безналичная с НДС', currency_code: '643' },
  };

  const detail: AuctionShowResponse = {
    main: { id, cargo_num: listItem.main.cargo_num, cargo_date: cargoDate, order_uid: uuid, auc_type: aucType, created_at: cargoDate },
    organizer: {
      subscriber_id: listItem.organizer.subscriber_id,
      subscriber_code: String(10000 + id),
      infobase_code: 'RU_Cargo_01',
      organization_name: listItem.organizer.organization_name,
      organization_inn: listItem.organizer.organization_inn,
      organization_kpp: listItem.organizer.organization_kpp,
      organization_id: listItem.organizer.organization_id,
    },
    contacts: hidePointsAndContacts
      ? []
      : [{ name: 'Иванов Иван Иванович', phone: '+79001234567', work_phone: null, uid: null, email: 'ivanov@example.com' }],
    cargo: {
      price: String(intBetween(50000, 300000)),
      currency: 643,
      is_international: false,
      distance,
      truck_count: 1,
      body_type: bodyType,
      car: { type: 'Тягач', weight: 20, volume: 82, width: 2.4, length: 13.6, height: 2.7 },
    },
    trading: {
      status: statusName,
      status_mobile: statusMobile as any,
      start_time: isoOffsetDaysFromNow(0),
      stop_time: isoOffsetDaysFromNow(0),
      bid_measurement_type: 'PerRoute',
      can_set_bet: canSetBet,
      allow_counter_bets: true,
      hide_bets_history: hideBetsHistory,
      hide_places: false,
      no_view_cargo_price: rand() > 0.85,
      hide_points_address_and_contacts: hidePointsAndContacts,
      is_bidder: isBidder,
      is_favorite: false,
      price: priceInfo,
      your: { bet: hasBet, last_bet: myLastBet, last_bet_with_vat: myLastBet, win: statusMobile === 'Winner' },
      settings: { prolong_after_bet: 10, winner_confirm: 1, winner_counter_mode: null, transmission_time_in: 24, coefficient: 10 },
    },
    payment: {
      condition: 'По оригиналам накладных (ТН, ТТН, CMR)',
      condition_predefined: 'ПоОригиналамНаладных',
      form: 'Безналичная с НДС',
      delay: 30,
      delay_type: 'CalendarDays',
      currency_code: '643',
      prepay: '0',
    },
    assembly: { num: null, date: null },
    routes: [
      {
        row_num: 1,
        op_type: 'Loading',
        start_date: loadDate,
        end_date: loadDate,
        comment: null,
        contractor: '',
        contractor_inn: '',
        location: { city_name: loadCity.name, city_full_name: `${loadCity.name}, Россия`, city_gc_id: loadCity.gc_id, loading_address: 'Складская 1', lon: 0, lat: 0 },
        cargo: { name: cargoName, weight: weight.toFixed(3), volume: volume.toFixed(3) },
        contact: { name: '', phone: '' },
      },
      {
        row_num: 2,
        op_type: 'Unloading',
        start_date: unloadDate,
        end_date: unloadDate,
        comment: null,
        contractor: '',
        contractor_inn: '',
        location: { city_name: unloadCity.name, city_full_name: `${unloadCity.name}, Россия`, city_gc_id: unloadCity.gc_id, loading_address: 'Терминальная 2', lon: 0, lat: 0 },
        cargo: { name: cargoName, weight: weight.toFixed(3), volume: volume.toFixed(3) },
        contact: { name: '', phone: '' },
      },
    ],
    admitted_organizations: [
      { id: 14, inn: '9616244307', is_main: true, name: 'ООО Перевозчик', full_name: 'Общество с ограниченной ответственностью Перевозчик', subscriber_id: 13 },
    ],
    hide_bets_history: hideBetsHistory,
  };

  return { uuid, id, listItem, detail };
}

function buildBets(record: AuctionRecord): BetItem[] {
  if (!record.detail.trading.is_bidder) return [];
  const count = intBetween(1, 5);
  const bets: BetItem[] = [];
  for (let i = 0; i < count; i++) {
    const price = record.detail.trading.price.current! + i * (record.detail.trading.price.step ?? 500);
    const isRejected = rand() > 0.85;
    bets.push({
      id: record.id * 100 + i,
      created_at: isoOffsetDaysFromNow(-i),
      auction_id: record.id,
      subscriber_id: 13 + i,
      contact_name: `Перевозчик ${i + 1}`,
      contact_phone: '+79001234567',
      price_with_vat: price,
      price_no_vat: Math.round((price / 1.2) * 100) / 100,
      organization_id: 14 + i,
      organization_inn: String(9600000000 + i),
      organization_name: `ООО Перевозчик ${i + 1}`,
      transporter_comment: null,
      is_rejected: isRejected,
      is_counter: false,
      place: i + 1,
      is_win: i === 0 && record.detail.trading.status === 'Finished',
      run_number: 0,
      cancel_reason: isRejected ? pick(CANCEL_REASONS) : '',
    });
  }
  if (record.detail.trading.your.bet) {
    bets.unshift({
      id: record.id * 100 + 99,
      created_at: isoOffsetDaysFromNow(0),
      auction_id: record.id,
      subscriber_id: 999,
      contact_name: 'Я',
      contact_phone: '+79990000000',
      price_with_vat: record.detail.trading.your.last_bet_with_vat ?? record.detail.trading.your.last_bet ?? 0,
      price_no_vat: Math.round(((record.detail.trading.your.last_bet ?? 0) / 1.2) * 100) / 100,
      organization_id: 999,
      organization_inn: '9999999999',
      organization_name: 'Моя организация',
      transporter_comment: null,
      is_rejected: false,
      is_counter: false,
      place: 1,
      is_win: record.detail.trading.your.win,
      run_number: 0,
      cancel_reason: '',
    });
  }
  return recalcPlaces(bets);
}

// Пересчитывает место в рейтинге по текущему порядку списка (лучшая ставка — первая), не учитывая отменённые.
export function recalcPlaces(bets: BetItem[]): BetItem[] {
  let rank = 0;
  return bets.map((b) => {
    if (b.is_rejected) return { ...b, place: null };
    rank += 1;
    return { ...b, place: rank };
  });
}

function createDb(): Db {
  const auctions = new Map<string, AuctionRecord>();
  const bets = new Map<string, BetItem[]>();
  for (let i = 1; i <= 48; i++) {
    const record = buildAuction(i);
    auctions.set(record.uuid, record);
    bets.set(record.uuid, buildBets(record));
  }
  return { auctions, bets };
}

export const db = createDb();

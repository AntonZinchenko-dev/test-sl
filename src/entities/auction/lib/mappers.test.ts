import { describe, it, expect } from 'vitest';
import { getPrimaryAction, auctionTypeLabel } from './mappers';
import type { AuctionListItem } from '../model/types';

function makeItem(overrides: Partial<AuctionListItem['trading']>): AuctionListItem {
  return {
    main: { id: 1, cargo_num: '1', cargo_date: '', auc_type: 'Down', order_uid: 'u1', created_at: '', priority_sort: 0, is_assembly: false, price_per_km: null },
    organizer: { subscriber_id: 1, organization_id: 1, organization_name: '', organization_inn: '', organization_kpp: '', is_hide_organization: false },
    route: {
      load: { city: 'A', address: '', date: '', city_gc_id: 1, points_count: 1 },
      unload: { city: 'B', address: '', date: '', city_gc_id: 2, points_count: 1 },
    },
    cargo: { name: '', weight: 1, volume: 1, body_type: '', truck_count: 1, is_cargo: true },
    trading: {
      status: 'Auction',
      status_mobile: 'NotParticipating',
      start_time: '',
      stop_time: '',
      bid_measurement_type: 'PerRoute',
      can_set_bet: false,
      allow_counter_bets: true,
      hide_points_address_and_contacts: false,
      is_bidder: false,
      is_available: false,
      is_favorite: false,
      price: null,
      your: null,
      step: null,
      ...overrides,
    },
    payment: { form: '', currency_code: '643' },
  };
}

describe('getPrimaryAction', () => {
  it('returns disabled when can_set_bet is false and no own bet', () => {
    expect(getPrimaryAction(makeItem({ can_set_bet: false })).kind).toBe('disabled');
  });

  it('returns view-bets when cannot bet but already has one', () => {
    expect(getPrimaryAction(makeItem({ can_set_bet: false, your: { bet: true, last_bet: 100 } })).kind).toBe('view-bets');
  });

  it('returns place-bet when can bet and has none', () => {
    expect(getPrimaryAction(makeItem({ can_set_bet: true })).kind).toBe('place-bet');
  });

  it('returns edit-bet when can bet and already has one', () => {
    expect(getPrimaryAction(makeItem({ can_set_bet: true, your: { bet: true, last_bet: 100 } })).kind).toBe('edit-bet');
  });
});

describe('auctionTypeLabel', () => {
  it('maps known enum values', () => {
    expect(auctionTypeLabel('Down')).toBe('На понижение');
  });
  it('falls back to raw value for unknown', () => {
    expect(auctionTypeLabel('Weird')).toBe('Weird');
  });
});

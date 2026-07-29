import type { AuctionType, AuctionStatus, TradingStatus } from '@/shared/config';

export interface AuctionListItemMain {
  id: number;
  cargo_num: string;
  cargo_date: string;
  auc_type: AuctionType;
  order_uid: string;
  created_at: string;
  priority_sort: number;
  is_assembly: boolean;
  price_per_km: number | null;
}

export interface RoutePointShort {
  city: string;
  address: string;
  date: string;
  city_gc_id: number;
  points_count: number;
}

export interface AuctionListItemRoute {
  load: RoutePointShort;
  unload: RoutePointShort;
}

export interface AuctionListItemCargo {
  name: string;
  weight: number;
  volume: number;
  body_type: string;
  truck_count: number;
  is_cargo: boolean;
}

export interface AuctionListItemTradingPrice {
  start: number;
  current: number;
  current_no_vat: number;
}

export interface AuctionListItemTradingYour {
  bet: boolean;
  last_bet: number | null;
}

export interface AuctionListItemTrading {
  status: AuctionStatus;
  status_mobile: TradingStatus;
  start_time: string;
  stop_time: string;
  bid_measurement_type: 'PerRoute' | 'PerKm' | 'Unknown' | null;
  can_set_bet: boolean;
  allow_counter_bets: boolean;
  hide_points_address_and_contacts: boolean;
  is_bidder: boolean;
  is_available: boolean;
  is_favorite: boolean;
  price: AuctionListItemTradingPrice | null;
  your: AuctionListItemTradingYour | null;
  step: number | null;
}

export interface AuctionListItemOrganizer {
  subscriber_id: number;
  organization_id: number;
  organization_name: string;
  organization_inn: string;
  organization_kpp: string;
  is_hide_organization: boolean;
}

export interface AuctionListItemPayment {
  form: string;
  currency_code: string;
}

export interface AuctionListItem {
  main: AuctionListItemMain;
  organizer: AuctionListItemOrganizer;
  route: AuctionListItemRoute;
  cargo: AuctionListItemCargo;
  trading: AuctionListItemTrading;
  payment: AuctionListItemPayment;
}

export interface AuctionListMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface AuctionListResponseBase {
  data: AuctionListItem[];
  meta: AuctionListMeta;
}

export interface AuctionListRequest {
  page?: number;
  per_page?: number;
  is_oldest?: boolean;
  status?: string[];
  statuses?: number[];
  cargo_num?: string;
  load_city?: string;
  unload_city?: string;
  load_date_from?: string;
  load_date_to?: string;
  unload_date_from?: string;
  unload_date_to?: string;
  is_available?: boolean;
  is_bidder?: boolean;
  current_price_from?: number;
  current_price_to?: number;
  auc_type?: string[];
}

// --- Detail (AuctionShowResponse) ---

export interface CarRequirements {
  type: string;
  weight: number | null;
  volume: number | null;
  width: number | null;
  length: number | null;
  height: number | null;
}

export interface AuctionShowCargo {
  price: string;
  currency: number | null;
  is_international: boolean;
  distance: number | null;
  truck_count: number;
  body_type: string;
  car: CarRequirements | null;
}

export interface AuctionShowMain {
  id: number;
  cargo_num: string;
  cargo_date: string;
  order_uid: string;
  auc_type: AuctionType;
  created_at: string;
}

export interface AuctionShowOrganizer {
  subscriber_id: number;
  subscriber_code: string;
  infobase_code: string;
  organization_name: string;
  organization_inn: string;
  organization_kpp: string;
  organization_id: number;
}

export interface Contact {
  name: string | null;
  phone: string | null;
  work_phone: string | null;
  uid: string | null;
  email: string | null;
}

export interface AuctionShowPayment {
  condition: string | null;
  condition_predefined: string | null;
  form: string;
  delay: number | null;
  delay_type: 'CalendarDays' | 'WorkDays' | 'Unknown' | null;
  currency_code: string;
  prepay: string | null;
}

export interface AuctionShowTradingPrice {
  start: number | null;
  start_no_vat: number | null;
  current: number | null;
  current_no_vat: number | null;
  available: number | null;
  available_no_vat: number | null;
  min: number | null;
  min_no_vat: number | null;
  max: number | null;
  max_no_vat: number | null;
  step: number | null;
  step_no_vat: number | null;
  price_per_km: number;
}

export interface AuctionShowTradingYour {
  bet: boolean;
  last_bet: number | null;
  last_bet_with_vat: number | null;
  win: boolean;
}

export interface AuctionShowTradingSettings {
  prolong_after_bet: number | null;
  winner_confirm: number | null;
  winner_counter_mode: number | null;
  transmission_time_in: number | null;
  coefficient: number | null;
}

export interface AuctionShowTrading {
  status: AuctionStatus;
  status_mobile: TradingStatus;
  start_time: string;
  stop_time: string;
  bid_measurement_type: 'PerRoute' | 'PerKm' | 'Unknown' | null;
  can_set_bet: boolean;
  allow_counter_bets: boolean;
  hide_bets_history: boolean;
  hide_places: boolean;
  no_view_cargo_price: boolean;
  hide_points_address_and_contacts: boolean;
  is_bidder: boolean;
  is_favorite: boolean;
  price: AuctionShowTradingPrice;
  your: AuctionShowTradingYour;
  settings: AuctionShowTradingSettings;
}

export interface RoutePointLocation {
  city_name: string;
  city_full_name: string;
  city_gc_id: number;
  loading_address: string;
  lon: number;
  lat: number;
}

export interface RoutePointCargo {
  name: string;
  weight: string;
  volume: string;
}

export interface RoutePointContact {
  name: string;
  phone: string;
}

export interface RoutePoint {
  row_num: number;
  op_type: 'Loading' | 'Unloading' | 'Unknown';
  start_date: string;
  end_date: string;
  comment: string | null;
  contractor: string;
  contractor_inn: string;
  location: RoutePointLocation;
  cargo: RoutePointCargo;
  contact: RoutePointContact;
}

export interface AdmittedOrganization {
  id: number;
  inn: string;
  is_main: boolean;
  name: string;
  full_name: string;
  subscriber_id: number;
}

export interface AuctionShowResponse {
  main: AuctionShowMain;
  organizer: AuctionShowOrganizer;
  contacts: Contact[];
  cargo: AuctionShowCargo;
  trading: AuctionShowTrading;
  payment: AuctionShowPayment;
  assembly: { num: string | null; date: string | null };
  routes: RoutePoint[];
  admitted_organizations: AdmittedOrganization[];
  hide_bets_history: boolean;
}

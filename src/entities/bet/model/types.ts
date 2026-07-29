export interface BetItem {
  id: number;
  created_at: string;
  auction_id: number;
  subscriber_id: number;
  contact_name: string;
  contact_phone: string;
  price_with_vat: number;
  price_no_vat: number;
  organization_id: number;
  organization_inn: string;
  organization_name: string;
  transporter_comment: string | null;
  is_rejected: boolean;
  is_counter: boolean;
  place: number | null;
  is_win: boolean;
  run_number: number;
  cancel_reason: string;
}

export interface BetListResponse {
  bets: BetItem[];
}

export interface SetBetRequest {
  price: number;
}

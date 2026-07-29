import { Link } from '@tanstack/react-router';
import { Badge } from '@/shared/ui/Badge.component';
import { Button } from '@/shared/ui/Button.component';
import { buttonLinkClass } from '@/shared/ui/button-link-style';
import { CardSection, DefinitionRow } from '@/shared/ui/Card.component';
import { TabsList, tabItemClass } from '@/shared/ui/Tabs.component';
import {
  IconRoute,
  IconBox,
  IconBuilding,
  IconWallet,
  IconCoins,
  IconPhone,
  IconMail,
  IconLock,
  IconEyeOff,
} from '@/shared/ui/icons.component';
import { formatDateTime, formatMoney, formatNumber } from '@/shared/lib/format';
import { auctionTypeLabel, auctionStatusLabel } from '@/entities/auction/lib/mappers';
import { AuctionStatusBadge } from '@/entities/auction/ui/AuctionStatusBadge.component';
import { BetsHistoryList } from '@/features/bets-history/ui/BetsHistoryList.component';
import { AUCTIONS_SEARCH_DEFAULTS } from '@/features/auctions-filters/model/schema';
import type { AuctionShowResponse } from '@/entities/auction/model/types';

export function AuctionDetailWidget({
  auction,
  auctionUuid,
  tab,
}: {
  auction: AuctionShowResponse;
  auctionUuid: string;
  tab: 'overview' | 'bets';
}) {
  const { main, organizer, contacts, cargo, trading, payment, routes, admitted_organizations, hide_bets_history } = auction;
  const hideContacts = trading.hide_points_address_and_contacts;
  const betsHidden = hide_bets_history || trading.hide_bets_history;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link
              to="/"
              search={AUCTIONS_SEARCH_DEFAULTS}
              className="mb-1 inline-block text-[13px] font-medium text-slate-400 no-underline hover:text-brand-600"
            >
              ← К списку аукционов
            </Link>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Заявка № {main.cargo_num}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
              <span className="font-semibold text-slate-700">{auctionTypeLabel(main.auc_type)}</span>
              <span>·</span>
              <span>{auctionStatusLabel(trading.status)}</span>
              <span>·</span>
              <span>создана {formatDateTime(main.created_at)}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AuctionStatusBadge status={trading.status_mobile} />
            {trading.your.bet ? (
              <Badge tone="info">Моя ставка: {formatMoney(trading.your.last_bet_with_vat ?? trading.your.last_bet)}</Badge>
            ) : null}
          </div>
        </div>

        {trading.hide_bets_history || trading.hide_points_address_and_contacts || trading.no_view_cargo_price || !trading.can_set_bet ? (
          <div className="flex flex-wrap gap-1.5">
            {!trading.can_set_bet ? (
              <Badge tone="warning" icon={<IconLock width={12} height={12} />}>
                Ставки недоступны
              </Badge>
            ) : null}
            {betsHidden ? (
              <Badge tone="neutral" icon={<IconEyeOff width={12} height={12} />}>
                История ставок скрыта
              </Badge>
            ) : null}
            {trading.hide_points_address_and_contacts ? (
              <Badge tone="neutral" icon={<IconEyeOff width={12} height={12} />}>
                Адрес и контакты скрыты
              </Badge>
            ) : null}
            {trading.no_view_cargo_price ? (
              <Badge tone="neutral" icon={<IconEyeOff width={12} height={12} />}>
                Цена груза скрыта
              </Badge>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <TabsList>
            <Link to="/auctions/$auctionUuid" params={{ auctionUuid }} search={{ tab: 'overview' }} className={tabItemClass(tab === 'overview')}>
              Обзор
            </Link>
            <Link to="/auctions/$auctionUuid" params={{ auctionUuid }} search={{ tab: 'bets' }} className={tabItemClass(tab === 'bets')}>
              Ставки
            </Link>
          </TabsList>

          {trading.can_set_bet ? (
            <Link to="/auctions/$auctionUuid/bet" params={{ auctionUuid }} className={buttonLinkClass('primary', 'md')}>
              {trading.your.bet ? 'Изменить ставку' : 'Сделать ставку'}
            </Link>
          ) : (
            <Button variant="secondary" disabled>
              Торги недоступны
            </Button>
          )}
        </div>
      </div>

      {tab === 'bets' ? (
        <CardSection title="История ставок">
          <BetsHistoryList auctionUuid={auctionUuid} hidden={betsHidden} />
        </CardSection>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <CardSection title="Маршрут" icon={<IconRoute width={16} height={16} />} className="xl:col-span-2">
            <div className="flex flex-col gap-4">
              {routes.map((p) => (
                <div key={p.row_num} className="relative border-l-2 border-slate-200 pl-4">
                  <span
                    className={`absolute -left-[5px] top-1 h-2 w-2 rounded-full ${p.op_type === 'Loading' ? 'bg-emerald-500' : 'bg-brand-500'}`}
                  />
                  <div className="text-[13.5px] font-semibold text-slate-800">
                    {p.op_type === 'Loading' ? 'Погрузка' : 'Выгрузка'} · {p.location.city_name}
                  </div>
                  <div className="text-[12.5px] text-slate-500">
                    {hideContacts ? (
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <IconEyeOff width={12} height={12} /> Адрес скрыт
                      </span>
                    ) : (
                      p.location.loading_address
                    )}
                  </div>
                  <div className="text-[12px] text-slate-400">
                    {formatDateTime(p.start_date)} — {formatDateTime(p.end_date)}
                  </div>
                </div>
              ))}
            </div>
          </CardSection>

          <CardSection title="Груз и требования к ТС" icon={<IconBox width={16} height={16} />}>
            <DefinitionRow label="Тип кузова" value={cargo.body_type || '—'} />
            <DefinitionRow label="Кол-во ТС" value={cargo.truck_count} />
            <DefinitionRow label="Расстояние" value={cargo.distance ? `${formatNumber(cargo.distance)} км` : '—'} />
            {!trading.no_view_cargo_price ? (
              <DefinitionRow label="Цена груза" value={formatMoney(Number(cargo.price))} />
            ) : (
              <DefinitionRow
                label="Цена груза"
                value={
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <IconEyeOff width={12} height={12} /> скрыта
                  </span>
                }
              />
            )}
            {cargo.car ? (
              <>
                <DefinitionRow label="Тип ТС" value={cargo.car.type} />
                <DefinitionRow label="Грузоподъёмность" value={`${formatNumber(cargo.car.weight, 1)} т`} />
                <DefinitionRow
                  label="Габариты кузова"
                  value={`${formatNumber(cargo.car.length, 1)}×${formatNumber(cargo.car.width, 1)}×${formatNumber(cargo.car.height, 1)} м`}
                />
              </>
            ) : null}
          </CardSection>

          <CardSection title="Организатор" icon={<IconBuilding width={16} height={16} />}>
            <DefinitionRow label="Название" value={organizer.organization_name} />
            <DefinitionRow label="ИНН / КПП" value={`${organizer.organization_inn} / ${organizer.organization_kpp}`} />
            {!hideContacts && contacts.length ? (
              <div className="mt-1 flex flex-col gap-2 border-t border-slate-100 pt-3">
                <div className="text-[11.5px] font-bold uppercase tracking-wide text-slate-400">Контакты</div>
                {contacts.map((c, i) => (
                  <div key={i} className="flex flex-col gap-1 text-[13px] text-slate-700">
                    <span className="font-medium">{c.name ?? '—'}</span>
                    <div className="flex flex-wrap gap-3 text-slate-500">
                      {c.phone ? (
                        <span className="inline-flex items-center gap-1">
                          <IconPhone width={13} height={13} /> {c.phone}
                        </span>
                      ) : null}
                      {c.email ? (
                        <span className="inline-flex items-center gap-1">
                          <IconMail width={13} height={13} /> {c.email}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-1 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[12.5px] text-slate-400">
                <IconEyeOff width={13} height={13} /> Контакты скрыты организатором
              </div>
            )}
            {admitted_organizations.length ? (
              <div className="text-[12px] text-slate-400">Допущено организаций: {admitted_organizations.length}</div>
            ) : null}
          </CardSection>

          <CardSection title="Условия оплаты" icon={<IconWallet width={16} height={16} />}>
            <DefinitionRow label="Форма оплаты" value={payment.form} />
            <DefinitionRow label="Условие" value={payment.condition ?? '—'} />
            <DefinitionRow label="Отсрочка" value={payment.delay != null ? `${payment.delay} дн.` : '—'} />
            <DefinitionRow label="Предоплата" value={payment.prepay ? `${payment.prepay}%` : '—'} />
          </CardSection>

          <CardSection title="Параметры торгов" icon={<IconCoins width={16} height={16} />} className="xl:col-span-2">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              <DefinitionRow label="Текущая цена" value={formatMoney(trading.price.current)} />
              <DefinitionRow label="Доступная цена" value={formatMoney(trading.price.available)} />
              <DefinitionRow label="Мин / Макс" value={`${formatMoney(trading.price.min)} / ${formatMoney(trading.price.max)}`} />
              <DefinitionRow label="Шаг ставки" value={formatMoney(trading.price.step)} />
              <DefinitionRow label="Цена за км" value={`${formatNumber(trading.price.price_per_km, 2)} ₽`} />
              <DefinitionRow label="Период торгов" value={`${formatDateTime(trading.start_time)} — ${formatDateTime(trading.stop_time)}`} />
            </div>
          </CardSection>
        </div>
      )}
    </div>
  );
}

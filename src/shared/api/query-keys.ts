// `shared` — самый нижний слой FSD, он не должен знать о доменных типах (`entities/auction` и т. п.).
// Фабрика ключей поэтому дженерик: конкретный тип тела запроса подставляет вызывающий код из своего слоя.
export const queryKeys = {
  auctions: {
    all: ['auctions'] as const,
    list: <TBody,>(body: TBody) => ['auctions', 'list', body] as const,
    detail: (uuid: string) => ['auctions', 'detail', uuid] as const,
    bets: (uuid: string) => ['auctions', 'bets', uuid] as const,
  },
};

export interface CityDictItem {
  gc_id: number;
  name: string;
}

// Мок-словарь городов — используется и фильтрами, и MSW-моками.
export const CITIES: CityDictItem[] = [
  { gc_id: 1, name: 'Москва' },
  { gc_id: 2, name: 'Санкт-Петербург' },
  { gc_id: 59, name: 'Пермь' },
  { gc_id: 4, name: 'Екатеринбург' },
  { gc_id: 5, name: 'Новосибирск' },
  { gc_id: 6, name: 'Казань' },
  { gc_id: 7, name: 'Краснодар' },
  { gc_id: 8, name: 'Ростов-на-Дону' },
  { gc_id: 9, name: 'Уфа' },
  { gc_id: 10, name: 'Самара' },
  { gc_id: 11, name: 'Челябинск' },
  { gc_id: 12, name: 'Воронеж' },
];

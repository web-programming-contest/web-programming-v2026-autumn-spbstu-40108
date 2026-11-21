import type {
  CatalogFiltersState,
  Good,
  SortCriterion,
  SortDirection,
} from '../types';

export const PAGE_SIZE = 9;


export const FILTER_CATEGORIES = [
  'Смартфоны',
  'Наушники',
  'Фитнес-браслеты',
  'Портативная акустика',
  'Очки виртуальной реальности',
  'Электротранспорт',
  'Умные часы',
];

export const FILTER_COLORS = [
  'Красный',
  'Оранжевый',
  'Желтый',
  'Зеленый',
  'Голубой',
  'Синий',
  'Фиолетовый',
];

export const COLOR_HEX: Record<string, string> = {
  'Белый': '#FFFFFF',
  'Черный': '#111827',
  'Серый': '#9CA3AF',
  'Фиолетовый': '#8B5CF6',
  'Синий': '#2563EB',
  'Зеленый': '#22C55E',
  'Голубой': '#38BDF8',
  'Красный': '#EF4444',
  'Желтый': '#FACC15',
  'Бежевый': '#D6C7A1',
  'Розовый': '#F472B6',
};

export function createEmptyFilters(): CatalogFiltersState {
  return {
    minPrice: '',
    maxPrice: '',
    categories: [],
    colors: [],
  };
}

function parsePrice(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function filterGoods(
  goods: Good[],
  filters: CatalogFiltersState,
): Good[] {
  const minPrice = parsePrice(filters.minPrice);
  const maxPrice = parsePrice(filters.maxPrice);

  return goods.filter((good) => {
    if (minPrice !== null && good.price < minPrice) {
      return false;
    }

    if (maxPrice !== null && good.price > maxPrice) {
      return false;
    }

    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(good.category)
    ) {
      return false;
    }

    if (filters.colors.length > 0 && !filters.colors.includes(good.color)) {
      return false;
    }

    return true;
  });
}

export function sortGoods(
  goods: Good[],
  criterion: SortCriterion,
  direction: SortDirection,
): Good[] {
  const sorted = [...goods].sort((first, second) => {
    let result = 0;

    if (criterion === 'price') {
      result = first.price - second.price;
    } else if (criterion === 'popularity') {
      result = first.rating - second.rating;
    } else {
      result =
        new Date(first.createdAt).getTime() -
        new Date(second.createdAt).getTime();
    }

    if (result === 0) {
      result = first.id - second.id;
    }

    return direction === 'asc' ? result : -result;
  });

  return sorted;
}

export type PaginationItem = number | 'ellipsis';

export function getPaginationItems(totalPages: number): PaginationItem[] {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  return [1, 2, 3, 'ellipsis', totalPages];
}

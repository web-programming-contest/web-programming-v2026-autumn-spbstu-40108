import type { CatalogFiltersState } from '../../types';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { PriceRangeSlider } from './PriceRangeSlider';

interface CatalogFiltersProps {
  categories: string[];
  colors: string[];
  draft: CatalogFiltersState;
  minPricePlaceholder: number;
  maxPricePlaceholder: number;
  priceError: string | null;
  onChange: (next: CatalogFiltersState) => void;
  onApply: () => void;
  onReset: () => void;
}

const inputStyles =
  'h-12 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted transition-colors hover:border-primary-light focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/15';

export function CatalogFilters({
  categories,
  colors,
  draft,
  minPricePlaceholder,
  maxPricePlaceholder,
  priceError,
  onChange,
  onApply,
  onReset,
}: CatalogFiltersProps): JSX.Element {
  const toggleCategory = (category: string): void => {
    const isSelected = draft.categories.includes(category);

    onChange({
      ...draft,
      categories: isSelected
        ? draft.categories.filter((item) => item !== category)
        : [...draft.categories, category],
    });
  };

  const toggleColor = (color: string): void => {
    const isSelected = draft.colors.includes(color);

    onChange({
      ...draft,
      colors: isSelected
        ? draft.colors.filter((item) => item !== color)
        : [...draft.colors, color],
    });
  };

  return (
    <aside aria-label="Фильтры товаров" className="w-[290px] shrink-0">
      <h2 className="sr-only">Фильтры</h2>

      <div>
        <h3 className="text-xl font-medium text-[#484848]">Цена, ₽</h3>
        <div className="mt-3 grid grid-cols-2 gap-7">
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">От</span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder={String(minPricePlaceholder)}
              aria-invalid={Boolean(priceError)}
              value={draft.minPrice}
              onChange={(event) =>
                onChange({ ...draft, minPrice: event.target.value })
              }
              className={cn(inputStyles, priceError && 'border-red-500')}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">До</span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder={String(maxPricePlaceholder)}
              aria-invalid={Boolean(priceError)}
              value={draft.maxPrice}
              onChange={(event) =>
                onChange({ ...draft, maxPrice: event.target.value })
              }
              className={cn(inputStyles, priceError && 'border-red-500')}
            />
          </label>
        </div>

        <PriceRangeSlider
          minBound={minPricePlaceholder}
          maxBound={maxPricePlaceholder}
          minValue={draft.minPrice}
          maxValue={draft.maxPrice}
          onChange={({ minPrice, maxPrice }) =>
            onChange({ ...draft, minPrice, maxPrice })
          }
        />

        {priceError ? (
          <p className="mt-2 text-sm text-red-500">{priceError}</p>
        ) : null}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-medium text-ink">Тип товара</h3>
        <div className="mt-3 space-y-1">
          {categories.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-3 rounded-lg py-1.5 text-base text-ink transition-colors hover:text-primary"
            >
              <input
                type="checkbox"
                checked={draft.categories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="h-5 w-5 shrink-0 cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-medium text-ink">Цвет</h3>
        <div className="mt-3 space-y-1">
          {colors.map((color) => (
            <label
              key={color}
              className="flex cursor-pointer items-center gap-3 rounded-lg py-1.5 text-base text-ink transition-colors hover:text-primary"
            >
              <input
                type="checkbox"
                checked={draft.colors.includes(color)}
                onChange={() => toggleColor(color)}
                className="h-5 w-5 shrink-0 cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              />
              <span>{color}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <Button
          type="button"
          size="lg"
          className="w-[139px]"
          onClick={onApply}
        >
          Показать
        </Button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg px-2 py-2 text-xl font-medium text-pink-dark transition-colors hover:text-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
        >
          Сбросить
        </button>
      </div>
    </aside>
  );
}

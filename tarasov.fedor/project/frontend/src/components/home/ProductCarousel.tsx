import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Good } from '../../types';
import { Button } from '../ui/Button';
import { ProductCard } from '../product/ProductCard';

interface ProductCarouselProps {
  id: string;
  title: string;
  description: string;
  products: Good[];
  accent: 'new' | 'hit';
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onProductClick?: (product: Good) => void;
}

function ProductCardSkeleton(): JSX.Element {
  return (
    <div className="rounded-[20px] bg-white">
      <div className="h-[320px] rounded-[20px] bg-[#ECEFF3]" />
      <div className="mt-2 h-6 w-24 rounded bg-surfaceAlt" />
      <div className="mt-2 h-4 w-full rounded bg-surfaceAlt" />
      <div className="mt-2 h-4 w-3/4 rounded bg-surfaceAlt" />
      <div className="mt-4 h-5 w-16 rounded bg-surfaceAlt" />
    </div>
  );
}

export function ProductCarousel({
  id,
  title,
  description,
  products,
  accent,
  isLoading,
  error,
  onRetry,
  onProductClick,
}: ProductCarouselProps): JSX.Element {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = Math.min(3, products.length);

  const visibleProducts = useMemo(
    () =>
      Array.from(
        { length: visibleCount },
        (_, offset) => products[(startIndex + offset) % products.length],
      ),
    [products, startIndex, visibleCount],
  );

  const showArrows = !isLoading && !error && products.length > 1;
  const titleId = `${id}-title`;

  const showPrevious = (): void => {
    setStartIndex(
      (currentIndex) =>
        (currentIndex - 1 + products.length) % products.length,
    );
  };

  const showNext = (): void => {
    setStartIndex(
      (currentIndex) => (currentIndex + 1) % products.length,
    );
  };

  const accentIcon =
    accent === 'new' ? (
      <img
        src="/assets/icons/sparkles.svg"
        alt=""
        aria-hidden="true"
        className="h-12 w-12"
      />
    ) : (
      <img
        src="/assets/icons/flame.svg"
        alt=""
        aria-hidden="true"
        className="h-12 w-12"
      />
    );

  return (
    <section aria-labelledby={titleId} className="mt-20">
      <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-[58px]">
        <div className="flex flex-col justify-center">
          {accentIcon}
          <h2
            id={titleId}
            className="mt-4 text-[32px] font-bold leading-tight text-ink"
          >
            {title}
          </h2>
          <p className="mt-3 text-base leading-6 text-muted">{description}</p>
        </div>

        <div className="relative min-w-0">
          {showArrows ? (
            <>
              <button
                type="button"
                aria-label="Предыдущие товары"
                onClick={showPrevious}
                className="absolute -left-10 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary-soft active:bg-[#DCE7FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <ChevronLeft aria-hidden="true" className="h-7 w-7" />
              </button>
              <button
                type="button"
                aria-label="Следующие товары"
                onClick={showNext}
                className="absolute -right-10 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary-soft active:bg-[#DCE7FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <ChevronRight aria-hidden="true" className="h-7 w-7" />
              </button>
            </>
          ) : null}

          {isLoading ? (
            <div>
              <p className="sr-only">Загружаем товары...</p>
              <div className="grid grid-cols-3 gap-8">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl bg-surface px-8 text-center">
              <p className="text-base leading-6 text-muted">{error}</p>
              <Button variant="secondary" className="mt-4" onClick={onRetry}>
                Повторить
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl bg-surface px-8 text-center">
              <p className="text-base text-muted">
                Пока нет товаров в этой подборке.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-8">
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={`${product.id}-${startIndex}-${index}`}
                  product={product}
                  onOpen={onProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

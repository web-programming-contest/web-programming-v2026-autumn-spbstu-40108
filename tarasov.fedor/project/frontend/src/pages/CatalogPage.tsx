import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CatalogFilters } from '../components/catalog/CatalogFilters';
import { Pagination } from '../components/catalog/Pagination';
import { SortingBar } from '../components/catalog/SortingBar';
import { ProductCard } from '../components/product/ProductCard';
import { ProductDetailModal } from '../components/product/ProductDetailModal';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/PageLoader';
import { useProducts } from '../context/ProductsContext';
import type {
  CatalogFiltersState,
  Good,
  SortCriterion,
  SortDirection,
} from '../types';
import {
  FILTER_CATEGORIES,
  FILTER_COLORS,
  PAGE_SIZE,
  createEmptyFilters,
  filterGoods,
  sortGoods,
} from '../utils/catalog';

export function CatalogPage(): JSX.Element {
  const { goods, isLoading, error, reload } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [draftFilters, setDraftFilters] = useState<CatalogFiltersState>(() =>
    createEmptyFilters(),
  );
  const [appliedFilters, setAppliedFilters] = useState<CatalogFiltersState>(
    () => createEmptyFilters(),
  );
  const [sortCriterion, setSortCriterion] = useState<SortCriterion>('new');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Good | null>(null);

  const priceBounds = useMemo(() => {
    if (goods.length === 0) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.min(...goods.map((product) => product.price)),
      max: Math.max(...goods.map((product) => product.price)),
    };
  }, [goods]);

  const filteredGoods = useMemo(
    () => filterGoods(goods, appliedFilters),
    [appliedFilters, goods],
  );

  const sortedGoods = useMemo(
    () => sortGoods(filteredGoods, sortCriterion, sortDirection),
    [filteredGoods, sortCriterion, sortDirection],
  );

  const totalPages = Math.max(1, Math.ceil(sortedGoods.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageGoods = sortedGoods.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  const productIdParam = searchParams.get('product');

  useEffect(() => {
    if (!productIdParam || goods.length === 0) {
      return;
    }

    const productId = Number(productIdParam);
    const product = Number.isInteger(productId)
      ? goods.find((item) => item.id === productId)
      : undefined;

    if (product) {
      setSelectedProduct(product);
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('product');
    setSearchParams(nextParams, { replace: true });
  }, [goods, productIdParam, searchParams, setSearchParams]);

  const handleCloseProduct = (): void => {
    setSelectedProduct(null);

    if (searchParams.has('product')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('product');
      setSearchParams(nextParams, { replace: true });
    }
  };

  const handleApplyFilters = (): void => {
    const minPrice =
      draftFilters.minPrice.trim() === ''
        ? null
        : Number(draftFilters.minPrice);
    const maxPrice =
      draftFilters.maxPrice.trim() === ''
        ? null
        : Number(draftFilters.maxPrice);

    if (
      minPrice !== null &&
      maxPrice !== null &&
      Number.isFinite(minPrice) &&
      Number.isFinite(maxPrice) &&
      minPrice > maxPrice
    ) {
      setPriceError('Минимальная цена не может быть больше максимальной');
      return;
    }

    setPriceError(null);
    setAppliedFilters({
      ...draftFilters,
      categories: [...draftFilters.categories],
      colors: [...draftFilters.colors],
    });
    setCurrentPage(1);
  };

  const handleResetFilters = (): void => {
    setDraftFilters(createEmptyFilters());
    setAppliedFilters(createEmptyFilters());
    setPriceError(null);
    setCurrentPage(1);
  };

  const handleCriterionChange = (criterion: SortCriterion): void => {
    setSortCriterion(criterion);
    setCurrentPage(1);
  };

  const handleDirectionChange = (direction: SortDirection): void => {
    setSortDirection(direction);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1288px] px-6 pb-16 pt-16">
        <h1 className="text-[32px] font-bold text-ink">Каталог товаров</h1>
        <PageLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1288px] px-6 pb-16 pt-16">
        <h1 className="text-[32px] font-bold text-ink">Каталог товаров</h1>
        <div className="mt-8 flex flex-col items-center rounded-2xl bg-surface px-8 py-16 text-center">
          <p className="text-base leading-6 text-muted">{error}</p>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => {
              void reload();
            }}
          >
            Повторить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1288px] px-6 pb-16 pt-16">
      <h1 className="text-[32px] font-bold text-ink">Каталог товаров</h1>

      <div className="mt-6 flex items-start gap-8">
        <div className="min-w-0 flex-1">
          <SortingBar
            criterion={sortCriterion}
            direction={sortDirection}
            onCriterionChange={handleCriterionChange}
            onDirectionChange={handleDirectionChange}
          />
        </div>
        <div className="w-[290px] shrink-0" aria-hidden="true" />
      </div>

      <div className="mt-5 flex items-start gap-8">
        <div className="min-w-0 flex-1">
          {pageGoods.length === 0 ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center rounded-2xl bg-surface px-8 text-center">
              <p className="text-lg font-semibold text-ink">
                Товары по вашему запросу не найдены
              </p>
              <p className="mt-2 text-base leading-6 text-muted">
                Попробуйте изменить условия фильтрации или сбросить фильтры.
              </p>
              <Button
                variant="secondary"
                className="mt-5"
                onClick={handleResetFilters}
              >
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-8">
              {pageGoods.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={setSelectedProduct}
                  showCartControls
                />
              ))}
            </div>
          )}

          {pageGoods.length > 0 ? (
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          ) : null}
        </div>

        <CatalogFilters
          categories={FILTER_CATEGORIES}
          colors={FILTER_COLORS}
          draft={draftFilters}
          minPricePlaceholder={priceBounds.min}
          maxPricePlaceholder={priceBounds.max}
          priceError={priceError}
          onChange={setDraftFilters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={handleCloseProduct}
      />
    </div>
  );
}

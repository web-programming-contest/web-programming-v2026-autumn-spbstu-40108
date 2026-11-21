import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { getOrdersRequest } from '../api/orders';
import { CartItemRow } from '../components/cart/CartItemRow';
import { CheckoutForm } from '../components/cart/CheckoutForm';
import { DeleteConfirmationModal } from '../components/cart/DeleteConfirmationModal';
import { OrderHistory } from '../components/cart/OrderHistory';
import { OrderSuccessModal } from '../components/cart/OrderSuccessModal';
import { Button, buttonStyles } from '../components/ui/Button';
import { PageLoader } from '../components/ui/PageLoader';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import type {
  CartRow,
  CreatedOrderResponse,
  OrderSummary,
} from '../types';
import { formatPrice, pluralizeRu } from '../utils/format';

type CartTab = 'cart' | 'history';

export function CartPage(): JSX.Element {
  const { items, removeItem, clearCart } = useCart();
  const {
    goods,
    isLoading: isProductsLoading,
    error: productsError,
    reload: reloadProducts,
  } = useProducts();

  const [activeTab, setActiveTab] = useState<CartTab>('cart');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteIds, setDeleteIds] = useState<number[] | null>(null);
  const [completedOrder, setCompletedOrder] =
    useState<CreatedOrderResponse | null>(null);

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const goodsById = useMemo(
    () => new Map(goods.map((product) => [product.id, product])),
    [goods],
  );

  const cartRows = useMemo<CartRow[]>(
    () =>
      items.flatMap((item) => {
        const product = goodsById.get(item.goodId);

        return product ? [{ item, product }] : [];
      }),
    [goodsById, items],
  );

  const totalQuantity = cartRows.reduce(
    (total, row) => total + row.item.quantity,
    0,
  );
  const totalPrice = cartRows.reduce(
    (total, row) => total + row.product.price * row.item.quantity,
    0,
  );

  useEffect(() => {
    setSelectedIds((current) =>
      current.filter((id) =>
        cartRows.some((row) => row.product.id === id),
      ),
    );
  }, [cartRows]);

  useEffect(() => {
    if (cartRows.length > 0 && completedOrder) {
      setCompletedOrder(null);
    }
  }, [cartRows.length, completedOrder]);

  const loadOrders = useCallback(async (): Promise<void> => {
    setOrdersLoading(true);
    setOrdersError(null);

    try {
      const userOrders = await getOrdersRequest();
      setOrders(userOrders);
    } catch {
      setOrdersError(
        'Не удалось загрузить историю заказов. Попробуйте снова.',
      );
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      void loadOrders();
    }
  }, [activeTab, loadOrders]);

  const allSelected =
    cartRows.length > 0 && selectedIds.length === cartRows.length;

  const toggleItem = (goodId: number): void => {
    setSelectedIds((current) =>
      current.includes(goodId)
        ? current.filter((id) => id !== goodId)
        : [...current, goodId],
    );
  };

  const toggleAll = (): void => {
    setSelectedIds(
      allSelected ? [] : cartRows.map((row) => row.product.id),
    );
  };

  const requestDelete = (ids: number[]): void => {
    if (ids.length > 0) {
      setDeleteIds(ids);
    }
  };

  const confirmDelete = (): void => {
    if (!deleteIds) {
      return;
    }

    const idsToDelete = deleteIds;
    idsToDelete.forEach((goodId) => removeItem(goodId));
    setSelectedIds((current) =>
      current.filter((id) => !idsToDelete.includes(id)),
    );
    setDeleteIds(null);
  };

  const handleOrderCreated = (order: CreatedOrderResponse): void => {
    clearCart();
    setSelectedIds([]);
    setCompletedOrder(order);
  };

  const tabClassName = (isActive: boolean): string =>
    [
      'relative -mb-px border-b-2 px-1 pb-4 pt-2 text-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4',
      isActive
        ? 'border-primary text-ink'
        : 'border-transparent text-primary hover:text-primary-dark',
    ].join(' ');

  const renderCartTab = (): JSX.Element => {
    if (isProductsLoading) {
      return <PageLoader />;
    }

    if (productsError) {
      return (
        <div className="flex flex-col items-center rounded-2xl border border-line bg-surface px-8 py-16 text-center">
          <p className="text-sm leading-6 text-muted">{productsError}</p>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => {
              void reloadProducts();
            }}
          >
            Повторить
          </Button>
        </div>
      );
    }

    if (cartRows.length === 0) {
      return (
        <section className="pt-2">
          <img
            src="/assets/icons/empty-cart.svg"
            alt=""
            aria-hidden="true"
            className="h-[134px] w-auto"
          />
          <h2 className="mt-8 text-[32px] font-bold leading-tight text-ink">
            Пока пусто
          </h2>
          <p className="mt-4 max-w-[470px] text-base leading-6 text-muted">
            Ознакомьтесь с новинками и хитами на главной или найдите нужное в{' '}
            <Link
              to="/catalog"
              className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              каталоге
            </Link>
          </p>
          <div className="mt-7 flex items-center gap-4">
            <Link
              to="/catalog"
              className={buttonStyles({ variant: 'primary', size: 'lg' })}
            >
              Перейти в каталог
            </Link>
            <Link
              to="/"
              className={buttonStyles({ variant: 'ghost', size: 'lg' })}
            >
              Главная страница
            </Link>
          </div>
        </section>
      );
    }

    return (
      <>
        <section className="overflow-hidden rounded-2xl bg-white">
          <div className="flex items-center justify-between border-b border-line px-8 py-5">
            <label className="flex cursor-pointer items-center gap-3 text-base font-medium text-ink">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="h-5 w-5 cursor-pointer accent-primary"
              />
              Выбрать все
            </label>

            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={() => requestDelete(selectedIds)}
              className="rounded-lg px-3 py-2 text-base font-medium text-pink-dark transition-colors hover:bg-pink-soft active:bg-[#FFE0F2] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
            >
              Удалить выбранные
            </button>
          </div>

          <div className="divide-y divide-line">
            {cartRows.map((row) => (
              <CartItemRow
                key={row.product.id}
                row={row}
                selected={selectedIds.includes(row.product.id)}
                onToggle={toggleItem}
                onDelete={(goodId) => requestDelete([goodId])}
              />
            ))}
          </div>

          <div className="flex justify-end border-t border-line px-8 py-5 text-2xl font-semibold text-ink">
            {totalQuantity}{' '}
            {pluralizeRu(totalQuantity, ['товар', 'товара', 'товаров'])} на{' '}
            {formatPrice(totalPrice)}
          </div>
        </section>

        <CheckoutForm
          cartRows={cartRows}
          onOrderCreated={handleOrderCreated}
        />
      </>
    );
  };

  return (
    <div className="flex-1 bg-surface">
      <div className="mx-auto w-full max-w-[1368px] px-6 py-10">
        <h1 className="sr-only">Корзина и история заказов</h1>

      <div
        role="tablist"
        aria-label="Разделы корзины"
        className="flex gap-8 border-b border-line"
      >
        <button
          type="button"
          role="tab"
          id="cart-tab"
          aria-controls="cart-panel"
          aria-selected={activeTab === 'cart'}
          onClick={() => setActiveTab('cart')}
          className={tabClassName(activeTab === 'cart')}
        >
          Корзина
        </button>
        <button
          type="button"
          role="tab"
          id="history-tab"
          aria-controls="history-panel"
          aria-selected={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
          className={tabClassName(activeTab === 'history')}
        >
          История заказов
        </button>
      </div>

      {activeTab === 'cart' ? (
        <div
          id="cart-panel"
          role="tabpanel"
          aria-labelledby="cart-tab"
          className="mt-8"
        >
          {renderCartTab()}
        </div>
      ) : (
        <div
          id="history-panel"
          role="tabpanel"
          aria-labelledby="history-tab"
          className="mt-8"
        >
          <OrderHistory
            orders={orders}
            isLoading={ordersLoading}
            error={ordersError}
            onRetry={() => {
              void loadOrders();
            }}
          />
        </div>
      )}

        <DeleteConfirmationModal
          open={deleteIds !== null}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteIds(null)}
        />

        <OrderSuccessModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
        />
      </div>
    </div>
  );
}

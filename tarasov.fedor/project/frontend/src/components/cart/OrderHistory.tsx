import type { OrderSummary } from '../../types';
import { formatPrice, pluralizeRu } from '../../utils/format';
import { Button } from '../ui/Button';
import { PageLoader } from '../ui/PageLoader';

interface OrderHistoryProps {
  orders: OrderSummary[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function OrderHistory({
  orders,
  isLoading,
  error,
  onRetry,
}: OrderHistoryProps): JSX.Element {
  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-white px-8 py-16 text-center">
        <p className="text-base leading-6 text-muted">{error}</p>
        <Button variant="secondary" className="mt-5" onClick={onRetry}>
          Повторить
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-white px-8 py-16 text-center">
        <p className="text-xl font-semibold text-ink">
          У вас пока нет заказов
        </p>
        <p className="mt-2 text-base leading-6 text-muted">
          Оформите первый заказ в корзине, и он появится в истории.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white px-8 py-4">
      <div className="divide-y divide-line">
        {orders.map((order) => (
          <div
            key={order.orderNumber}
            className="grid grid-cols-[1fr_0.4fr_0.35fr] gap-8 py-5 text-base text-ink"
          >
            <span>
              № {order.orderNumber} от {order.date}
            </span>
            <span>
              {order.totalQuantity}{' '}
              {pluralizeRu(order.totalQuantity, [
                'товар',
                'товара',
                'товаров',
              ])}
            </span>
            <span className="text-right">{formatPrice(order.totalPrice)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

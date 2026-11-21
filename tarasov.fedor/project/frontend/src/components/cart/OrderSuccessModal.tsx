import type { CreatedOrderResponse } from '../../types';
import { formatPrice } from '../../utils/format';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface OrderSuccessModalProps {
  order: CreatedOrderResponse | null;
  onClose: () => void;
}

export function OrderSuccessModal({
  order,
  onClose,
}: OrderSuccessModalProps): JSX.Element | null {
  if (!order) {
    return null;
  }

  return (
    <Modal
      open
      hideHeader
      title="Спасибо, ваш заказ успешно оформлен"
      onClose={onClose}
      footer={<Button onClick={onClose}>Ок</Button>}
    >
      <img
        src="/assets/icons/success-illustration.svg"
        alt=""
        aria-hidden="true"
        className="h-14 w-auto"
      />
      <h2 className="mt-2 text-xl font-semibold text-ink">
        Спасибо, ваш заказ успешно оформлен
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted">
        Номер заказа: {order.orderNumber}. Дата оформления: {order.date}.
        Итоговая стоимость: {formatPrice(order.totalPrice)}.
      </p>
      <p className="mt-2 text-sm leading-6 text-muted">
        Мы свяжемся с вами в течение 10 минут, чтобы уточнить удобное время
        получения заказа.
      </p>
    </Modal>
  );
}

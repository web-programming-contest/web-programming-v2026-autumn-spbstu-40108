import { useState, type FormEvent } from 'react';
import { ApiError } from '../../api/client';
import { createOrderRequest } from '../../api/orders';
import type {
  CartRow,
  CreatedOrderResponse,
  DeliveryMethod,
  PaymentMethod,
} from '../../types';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { TextField } from '../ui/TextField';

interface CheckoutFormProps {
  cartRows: CartRow[];
  onOrderCreated: (order: CreatedOrderResponse) => void;
}

interface CheckoutFormState {
  email: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  address: string;
  paymentMethod: PaymentMethod | '';
  needsPackaging: boolean;
}

interface CheckoutErrors {
  email?: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createInitialForm(): CheckoutFormState {
  return {
    email: '',
    phone: '',
    deliveryMethod: 'delivery',
    address: '',
    paymentMethod: '',
    needsPackaging: false,
  };
}

export function CheckoutForm({
  cartRows,
  onOrderCreated,
}: CheckoutFormProps): JSX.Element {
  const [form, setForm] = useState<CheckoutFormState>(() =>
    createInitialForm(),
  );
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFieldError = (field: keyof CheckoutErrors): void => {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      return { ...current, [field]: undefined };
    });
  };

  const handleDeliveryChange = (deliveryMethod: DeliveryMethod): void => {
    setForm((current) => ({ ...current, deliveryMethod }));
    clearFieldError('address');
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const nextErrors: CheckoutErrors = {};
    const email = form.email.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();

    if (!phone) {
      nextErrors.phone = 'Укажите номер телефона';
    }

    if (form.deliveryMethod === 'delivery' && !address) {
      nextErrors.address = 'Укажите адрес доставки';
    }

    if (email && !emailPattern.test(email)) {
      nextErrors.email = 'Укажите корректный адрес электронной почты';
    }

    if (!form.paymentMethod) {
      nextErrors.paymentMethod = 'Выберите способ оплаты';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const order = await createOrderRequest({
        email: email || undefined,
        phone,
        deliveryMethod: form.deliveryMethod,
        address:
          form.deliveryMethod === 'delivery' ? address : undefined,
        paymentMethod: form.paymentMethod as PaymentMethod,
        needsPackaging: form.needsPackaging,
        items: cartRows.map((row) => ({
          goodId: row.product.id,
          quantity: row.item.quantity,
        })),
      });

      onOrderCreated(order);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : 'Не удалось оформить заказ. Попробуйте снова.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-8 rounded-2xl bg-white p-8">
      <h2 className="text-[32px] font-bold leading-tight text-ink">
        Оформление заказа
      </h2>

      <form noValidate className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-[286px_286px] gap-8">
          <TextField
            label="Номер телефона"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Введите номер телефона"
            value={form.phone}
            error={errors.phone}
            onChange={(event) => {
              setForm((current) => ({
                ...current,
                phone: event.target.value,
              }));
              clearFieldError('phone');
            }}
          />

          <TextField
            label="Почта"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Введите адрес почты"
            value={form.email}
            error={errors.email}
            onChange={(event) => {
              setForm((current) => ({
                ...current,
                email: event.target.value,
              }));
              clearFieldError('email');
            }}
          />
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-ink">
            Способ получения
          </legend>
          <div className="mt-3 flex items-center gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                name="delivery-method"
                value="pickup"
                checked={form.deliveryMethod === 'pickup'}
                onChange={() => handleDeliveryChange('pickup')}
                className="h-4 w-4 cursor-pointer accent-primary"
              />
              Самовывоз
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                name="delivery-method"
                value="delivery"
                checked={form.deliveryMethod === 'delivery'}
                onChange={() => handleDeliveryChange('delivery')}
                className="h-4 w-4 cursor-pointer accent-primary"
              />
              Доставка
            </label>
          </div>
        </fieldset>

        {form.deliveryMethod === 'delivery' ? (
          <div className="w-[604px] max-w-full">
            <TextField
              label="Адрес"
              name="address"
              type="text"
              autoComplete="street-address"
              placeholder="Введите адрес доставки"
              value={form.address}
              error={errors.address}
              onChange={(event) => {
                setForm((current) => ({
                  ...current,
                  address: event.target.value,
                }));
                clearFieldError('address');
              }}
            />
          </div>
        ) : null}

        <div className="w-[286px] max-w-full">
          <Select
            label="Оплата"
            placeholder="Не выбрано"
            value={form.paymentMethod}
            error={errors.paymentMethod}
            options={[
              { value: 'По карте', label: 'По карте' },
              { value: 'Наличными', label: 'Наличными' },
            ]}
            onChange={(value) => {
              setForm((current) => ({
                ...current,
                paymentMethod: value as PaymentMethod,
              }));
              clearFieldError('paymentMethod');
            }}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.needsPackaging}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                needsPackaging: event.target.checked,
              }))
            }
            className="h-4 w-4 cursor-pointer accent-primary"
          />
          Нужна ли упаковка
        </label>

        {submitError ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {submitError}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-[193px]"
          disabled={isSubmitting || cartRows.length === 0}
        >
          {isSubmitting ? 'Оформляем...' : 'Оформить заказ'}
        </Button>
      </form>
    </section>
  );
}

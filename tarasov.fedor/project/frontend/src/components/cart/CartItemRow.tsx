import { X } from 'lucide-react';
import type { CartRow } from '../../types';
import { formatPrice } from '../../utils/format';
import { ProductCartControl } from '../product/ProductCartControl';

interface CartItemRowProps {
  row: CartRow;
  selected: boolean;
  onToggle: (goodId: number) => void;
  onDelete: (goodId: number) => void;
}

export function CartItemRow({
  row,
  selected,
  onToggle,
  onDelete,
}: CartItemRowProps): JSX.Element {
  const { item, product } = row;

  return (
    <div className="flex items-center gap-5 px-8 py-6">
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggle(product.id)}
        aria-label={`Выбрать товар: ${product.title}`}
        className="h-5 w-5 shrink-0 cursor-pointer accent-primary"
      />

      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-[#ECEFF3] p-2">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain mix-blend-multiply"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3
          className="line-clamp-2 text-base font-medium leading-6 text-ink"
          title={product.title}
        >
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {formatPrice(product.price)} за шт.
        </p>
      </div>

      <ProductCartControl
        productId={product.id}
        productTitle={product.title}
        size="lg"
      />

      <p className="w-32 shrink-0 text-right text-2xl font-semibold text-ink">
        {formatPrice(product.price * item.quantity)}
      </p>

      <button
        type="button"
        onClick={() => onDelete(product.id)}
        aria-label={`Удалить товар: ${product.title}`}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-base font-medium text-pink-dark transition-colors hover:bg-pink-soft active:bg-[#FFE0F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink"
      >
        <X aria-hidden="true" className="h-5 w-5" />
        Удалить
      </button>
    </div>
  );
}

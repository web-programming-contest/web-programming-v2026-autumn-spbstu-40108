import { Star } from 'lucide-react';
import type { Good } from '../../types';
import { formatPrice, formatRating } from '../../utils/format';
import { Modal } from '../ui/Modal';
import { ProductCartControl } from './ProductCartControl';
import { ProductLabels } from './ProductLabels';

interface ProductDetailModalProps {
  product: Good | null;
  onClose: () => void;
}

export function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps): JSX.Element | null {
  if (!product) {
    return null;
  }

  const specEntries = Object.entries(product.specs);

  return (
    <Modal
      open
      size="lg"
      hideHeader
      title={product.title}
      onClose={onClose}
    >
      <div className="grid grid-cols-[420px_minmax(0,1fr)] gap-8">
        <div className="relative flex h-[440px] items-center justify-center rounded-[20px] bg-[#ECEFF3] p-8">
          <ProductLabels product={product} />
          <img
            src={product.imageUrl}
            alt={product.title}
            className="max-h-full max-w-full object-contain mix-blend-multiply"
          />
        </div>

        <div className="flex min-w-0 flex-col pr-8">
          <h2 className="text-[30px] font-bold leading-tight text-ink">
            {product.title}
          </h2>

          <div className="mt-3 flex items-center gap-1.5 text-base text-muted">
            <Star
              aria-hidden="true"
              className="h-5 w-5 fill-yellow text-yellow"
            />
            <span>{formatRating(product.rating)} из 5</span>
          </div>

          <p className="mt-4 text-base leading-6 text-muted">
            {product.description}
          </p>

          <h3 className="mt-6 text-xl font-semibold text-ink">
            Характеристики
          </h3>

          {specEntries.length > 0 ? (
            <dl className="mt-3 border-t border-line">
              {specEntries.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-6 border-b border-line py-3 text-base"
                >
                  <dt className="text-muted">{label}</dt>
                  <dd className="max-w-[62%] text-right text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-3 text-base text-muted">
              Характеристики не указаны.
            </p>
          )}

          <div className="mt-auto flex items-center justify-end gap-5 pt-8">
            <p className="text-3xl font-bold text-ink">
              {formatPrice(product.price)}
            </p>
            <div className="w-[214px]">
              <ProductCartControl
                productId={product.id}
                productTitle={product.title}
                size="lg"
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

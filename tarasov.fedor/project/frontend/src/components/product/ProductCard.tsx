import { Star } from 'lucide-react';
import type { Good } from '../../types';
import { formatPrice, formatRating } from '../../utils/format';
import { ProductCartControl } from './ProductCartControl';
import { ProductLabels } from './ProductLabels';

interface ProductCardProps {
  product: Good;
  onOpen?: (product: Good) => void;
  showCartControls?: boolean;
}

export function ProductCard({
  product,
  onOpen,
  showCartControls = false,
}: ProductCardProps): JSX.Element {
  const content = (
    <>
      <div className="relative flex h-[320px] items-center justify-center rounded-[20px] bg-[#ECEFF3] p-6">
        <ProductLabels product={product} />
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </div>

      <div className="mt-2 flex flex-1 flex-col">
        <p className="text-2xl font-bold leading-none text-ink">
          {formatPrice(product.price)}
        </p>
        <h3
          className="mt-1.5 line-clamp-2 min-h-[48px] text-base leading-6 text-ink transition-colors group-hover:text-primary"
          title={product.title}
        >
          {product.title}
        </h3>
        <div
          className="mt-auto flex items-center gap-1.5 pt-3 text-base text-muted"
          aria-label={`Рейтинг ${formatRating(product.rating)} из 5`}
        >
          <Star
            aria-hidden="true"
            className="h-5 w-5 fill-yellow text-yellow"
          />
          <span>{formatRating(product.rating)}</span>
        </div>
      </div>
    </>
  );

  return (
    <article className="group flex h-full flex-col rounded-[20px] bg-white transition-shadow hover:shadow-card">
      {onOpen ? (
        <div
          role="button"
          tabIndex={0}
          aria-label={`Открыть карточку товара: ${product.title}`}
          onClick={() => onOpen(product)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onOpen(product);
            }
          }}
          className="flex flex-1 cursor-pointer flex-col rounded-[20px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {content}
        </div>
      ) : (
        <div className="flex flex-1 flex-col">{content}</div>
      )}

      {showCartControls ? (
        <div className="mt-4 w-[150px]">
          <ProductCartControl
            productId={product.id}
            productTitle={product.title}
            size="lg"
            fullWidth
          />
        </div>
      ) : null}
    </article>
  );
}

import type { Good } from '../../types';

export function ProductLabels({
  product,
}: {
  product: Pick<Good, 'isNew' | 'isBestseller'>;
}): JSX.Element | null {
  if (!product.isNew && !product.isBestseller) {
    return null;
  }

  return (
    <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
      {product.isNew ? (
        <span className="rounded-full bg-mint px-3 py-1.5 text-xs font-semibold leading-none text-white">
          Новинка
        </span>
      ) : null}
      {product.isBestseller ? (
        <span className="rounded-full bg-pink px-3 py-1.5 text-xs font-semibold leading-none text-white">
          Хит
        </span>
      ) : null}
    </div>
  );
}

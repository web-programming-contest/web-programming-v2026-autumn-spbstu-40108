import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { cn } from '../../utils/cn';
import { buttonStyles } from '../ui/Button';

interface ProductCartControlProps {
  productId: number;
  productTitle: string;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
}

export function ProductCartControl({
  productId,
  productTitle,
  size = 'md',
  fullWidth = false,
}: ProductCartControlProps): JSX.Element {
  const { addItem, decrementItem, getQuantity, incrementItem } = useCart();
  const quantity = getQuantity(productId);
  const iconClassName = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  const controlHeight = size === 'lg' ? 'h-12' : 'h-10';
  const stepButtonWidth = size === 'lg' ? 'w-9' : 'w-8';

  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={() => addItem(productId)}
        className={buttonStyles({
          variant: 'primary',
          size: size === 'lg' ? 'lg' : 'md',
          fullWidth,
        })}
      >
        <ShoppingCart aria-hidden="true" className={iconClassName} />
        <span>В корзину</span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1',
        fullWidth ? 'w-full justify-between' : 'inline-flex',
      )}
    >
      <button
        type="button"
        aria-label={`Уменьшить количество: ${productTitle}`}
        onClick={() => decrementItem(productId)}
        className={cn(
          'inline-flex items-center justify-center rounded-lg bg-primary-soft text-primary-dark transition-colors hover:bg-[#DCE7FF] active:bg-[#CBDDFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          controlHeight,
          stepButtonWidth,
        )}
      >
        <Minus aria-hidden="true" className={iconClassName} />
      </button>

      <span
        className={cn(
          'inline-flex min-w-0 items-center justify-center gap-1.5 rounded-lg bg-pink-soft px-2 font-semibold text-pink-dark',
          controlHeight,
          size === 'lg' ? 'text-sm' : 'text-xs',
          fullWidth ? 'flex-1' : 'min-w-[86px]',
        )}
      >
        <ShoppingCart aria-hidden="true" className={iconClassName} />
        <span className="whitespace-nowrap">{quantity} шт.</span>
      </span>

      <button
        type="button"
        aria-label={`Увеличить количество: ${productTitle}`}
        onClick={() => incrementItem(productId)}
        className={cn(
          'inline-flex items-center justify-center rounded-lg bg-primary-soft text-primary-dark transition-colors hover:bg-[#DCE7FF] active:bg-[#CBDDFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          controlHeight,
          stepButtonWidth,
        )}
      >
        <Plus aria-hidden="true" className={iconClassName} />
      </button>
    </div>
  );
}

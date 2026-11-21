import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem } from '../types';

const CART_STORAGE_KEY = 'gadget-hub-cart:v1';

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  addItem: (goodId: number) => void;
  incrementItem: (goodId: number) => void;
  decrementItem: (goodId: number) => void;
  setQuantity: (goodId: number, quantity: number) => void;
  removeItem: (goodId: number) => void;
  clearCart: () => void;
  getQuantity: (goodId: number) => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function normalizeItems(items: CartItem[]): CartItem[] {
  const quantities = new Map<number, number>();

  for (const item of items) {
    if (
      !Number.isInteger(item.goodId) ||
      item.goodId <= 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      continue;
    }

    quantities.set(
      item.goodId,
      (quantities.get(item.goodId) ?? 0) + item.quantity,
    );
  }

  return Array.from(quantities.entries()).map(([goodId, quantity]) => ({
    goodId,
    quantity,
  }));
}

function readCart(): CartItem[] {
  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsed: unknown = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return normalizeItems(parsed as CartItem[]);
  } catch {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}

function persistCart(items: CartItem[]): void {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Если хранилище недоступно, корзина продолжает работать в памяти.
  }
}

export function CartProvider({ children }: { children: ReactNode }): JSX.Element {
  const [items, setItems] = useState<CartItem[]>(() => readCart());

  const updateCart = useCallback(
    (updater: (currentItems: CartItem[]) => CartItem[]): void => {
      setItems((currentItems) => {
        const nextItems = normalizeItems(updater(currentItems));
        persistCart(nextItems);
        return nextItems;
      });
    },
    [],
  );

  useEffect(() => {
    const handleStorage = (event: StorageEvent): void => {
      if (event.key === CART_STORAGE_KEY) {
        setItems(readCart());
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const addItem = useCallback(
    (goodId: number): void => {
      updateCart((currentItems) => {
        const existingItem = currentItems.find((item) => item.goodId === goodId);

        if (existingItem) {
          return currentItems.map((item) =>
            item.goodId === goodId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }

        return [...currentItems, { goodId, quantity: 1 }];
      });
    },
    [updateCart],
  );

  const incrementItem = addItem;

  const decrementItem = useCallback(
    (goodId: number): void => {
      updateCart((currentItems) =>
        currentItems.flatMap((item) => {
          if (item.goodId !== goodId) {
            return [item];
          }

          return item.quantity > 1
            ? [{ ...item, quantity: item.quantity - 1 }]
            : [];
        }),
      );
    },
    [updateCart],
  );

  const setQuantity = useCallback(
    (goodId: number, quantity: number): void => {
      updateCart((currentItems) => {
        if (quantity <= 0) {
          return currentItems.filter((item) => item.goodId !== goodId);
        }

        const existingItem = currentItems.find((item) => item.goodId === goodId);

        if (existingItem) {
          return currentItems.map((item) =>
            item.goodId === goodId ? { ...item, quantity } : item,
          );
        }

        return [...currentItems, { goodId, quantity }];
      });
    },
    [updateCart],
  );

  const removeItem = useCallback(
    (goodId: number): void => {
      updateCart((currentItems) =>
        currentItems.filter((item) => item.goodId !== goodId),
      );
    },
    [updateCart],
  );

  const clearCart = useCallback((): void => {
    updateCart(() => []);
  }, [updateCart]);

  const totalQuantity = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const getQuantity = useCallback(
    (goodId: number): number =>
      items.find((item) => item.goodId === goodId)?.quantity ?? 0,
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      totalQuantity,
      addItem,
      incrementItem,
      decrementItem,
      setQuantity,
      removeItem,
      clearCart,
      getQuantity,
    }),
    [
      addItem,
      clearCart,
      decrementItem,
      getQuantity,
      incrementItem,
      items,
      removeItem,
      setQuantity,
      totalQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('Хук useCart должен использоваться внутри CartProvider');
  }

  return context;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getGoodsRequest } from '../api/products';
import type { Good } from '../types';

interface ProductsContextValue {
  goods: Good[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined,
);

export function ProductsProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [goods, setGoods] = useState<Good[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const products = await getGoodsRequest();
      setGoods(products);
    } catch {
      setError('Не удалось загрузить товары. Попробуйте обновить страницу.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    setError(null);

    getGoodsRequest()
      .then((products) => {
        if (isActive) {
          setGoods(products);
        }
      })
      .catch(() => {
        if (isActive) {
          setError('Не удалось загрузить товары. Попробуйте обновить страницу.');
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      goods,
      isLoading,
      error,
      reload,
    }),
    [error, goods, isLoading, reload],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts(): ProductsContextValue {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error(
      'Хук useProducts должен использоваться внутри ProductsProvider',
    );
  }

  return context;
}

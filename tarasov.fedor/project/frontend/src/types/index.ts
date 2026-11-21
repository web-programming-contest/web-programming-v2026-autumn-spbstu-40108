export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface CartItem {
  goodId: number;
  quantity: number;
}

export interface Good {
  id: number;
  title: string;
  description: string;
  specs: Record<string, string>;
  price: number;
  rating: number;
  imageUrl: string;
  category: string;
  color: string;
  isNew: boolean;
  isBestseller: boolean;
  createdAt: string;
}

export type SortCriterion = 'new' | 'price' | 'popularity';
export type SortDirection = 'asc' | 'desc';

export interface CatalogFiltersState {
  minPrice: string;
  maxPrice: string;
  categories: string[];
  colors: string[];
}

export type DeliveryMethod = 'pickup' | 'delivery';
export type PaymentMethod = 'По карте' | 'Наличными';

export interface CartRow {
  item: CartItem;
  product: Good;
}

export interface OrderSummary {
  orderNumber: number;
  date: string;
  totalQuantity: number;
  totalPrice: number;
}

export interface CreatedOrderResponse extends OrderSummary {
  message: string;
}

export interface CreateOrderPayload {
  email?: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  address?: string;
  paymentMethod: PaymentMethod;
  needsPackaging: boolean;
  items: Array<{
    goodId: number;
    quantity: number;
  }>;
}

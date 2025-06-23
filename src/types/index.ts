export interface Product {
  id: string;
  title: string;
  description: string;
  category?: string;
  price: number | null;
  image: string;
}

export interface Order {
  address: string;
  email: string;
  phone: string;
  payment: PaymentType;
  items: string[]; // id товаров
  total: number;
}

export type PaymentType = 'card' | 'cash';

export interface ApiListResponse<T> {
  total: number;
  items: T[];
}

export interface IApi {
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethod): Promise<T>;
}

export type ApiPostMethod = 'POST' | 'PUT' | 'DELETE';

export interface ICart {
  items: string[];
  total: number;
  add(id: string): void;
  remove(id: string): void;
  clear(): void;
  getTotal(products: Product[]): number;
}

export interface AppEvents {
  'modal:open': { productId: string };
  'cart:add': { productId: string };
  'cart:remove': { productId: string };
  'cart:open': void;
  'modal:close': void;

  'order:change': { address?: string; payment?: PaymentType };
  'contacts:change': { email: string; phone: string };

  'checkout:step1:complete': { address: string; payment: PaymentType };
  'order:submit': { email: string; phone: string; address: string; payment: PaymentType };
  'order:success': void;
}

export interface IEvents {
  on<K extends keyof AppEvents>(event: K, callback: (data: AppEvents[K]) => void): void;
  emit<K extends keyof AppEvents>(event: K, data: AppEvents[K]): void;
}

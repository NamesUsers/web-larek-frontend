export interface Product {
  id: string;
  title: string;
  description: string;
  category?: string;
  price: number;
  image: string;
}

export interface Order {
  address: string;
  email: string;
  phone: string;
  payment: PaymentType;
  items: string[]; // id товаров
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
  items: string[]; // id товаров
  add(id: string): void;
  remove(id: string): void;
  clear(): void;
  getTotal(products: Product[]): number;
}


export interface IProductCardView {
  render(product: Product): HTMLElement;
}


export interface ICartView {
  render(cart: ICart, products: Product[]): HTMLElement;
}

export type AppEvents =
  | 'modal:open'
  | 'modal:close'
  | 'product:add'
  | 'product:remove'
  | 'cart:open'
  | 'cart:clear'
  | 'checkout:step1:complete'
  | 'checkout:submit'
  | 'order:success';


export interface IEvents {
  on<T = any>(event: AppEvents, callback: (data: T) => void): void;
  emit<T = any>(event: AppEvents, data?: T): void;
  trigger<T = any>(event: AppEvents): (data: T) => void;
}

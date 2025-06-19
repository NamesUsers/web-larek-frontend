import { Api } from '../components/base/api';

export interface OrderForm {
  email: string;
  phone: string;
  address: string;
  payment: string;
  items: string[];
  total: number;
}

export class OrderAPI {
  constructor(protected api: Api) {}

  postOrder(order: OrderForm): Promise<unknown> {
    return this.api.post('/order', order);
  }
}

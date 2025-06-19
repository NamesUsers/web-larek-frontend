import { OrderModel } from '../models/OrderModel';
import { Order } from '../components/Order';
import { IEvents } from '../types';

export class AppPresenter {
  constructor(
    private orderModel: OrderModel,
    private orderComponent: Order,
    private events: IEvents
  ) {
    this.events.on('order:change', this.handleOrderChange);
  }

  handleOrderChange = (data: { address?: string; payment?: string }) => {
    if (data.address !== undefined) {
      this.orderModel.set('address', data.address);
    }

    if (data.payment !== undefined) {
      this.orderModel.set('payment', data.payment as any);
    }

    const validation = this.orderModel.validateBasic();
    this.orderComponent.setValidState(validation.isValid, validation.error);
  };
}

import { Product } from '../types';
import { IEvents } from '../types';

export interface ICartItemView {
  getElement(): HTMLElement;
}

export class CartItemView implements ICartItemView {
  protected element: HTMLElement;

  constructor(product: Product, index: number, events: IEvents) {
    const template = document.querySelector<HTMLTemplateElement>('#card-basket');
    if (!template) {
      throw new Error('Template #card-basket not found');
    }

    this.element = template.content.cloneNode(true) as HTMLElement;

    const indexElement = this.element.querySelector('.basket__item-index') as HTMLElement;
    const titleElement = this.element.querySelector('.card__title') as HTMLElement;
    const priceElement = this.element.querySelector('.card__price') as HTMLElement;
    const deleteButton = this.element.querySelector('.basket__item-delete') as HTMLButtonElement;

    indexElement.textContent = String(index + 1);
    titleElement.textContent = product.title;
    priceElement.textContent = product.price === null ? 'Бесценно' : `${product.price} синапсов`;

    deleteButton.addEventListener('click', () => {
      events.emit('cart:remove', { productId: product.id });
    });
  }

  getElement(): HTMLElement {
    return this.element;
  }
}

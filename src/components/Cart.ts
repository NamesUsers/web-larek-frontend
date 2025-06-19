import { Product, IEvents } from '../types';

export class Cart {
  protected list: HTMLElement;
  protected total: HTMLElement;

  constructor(protected root: HTMLElement, protected events: IEvents) {
    this.list = this.root.querySelector('.basket__list')!;
    this.total = this.root.querySelector('.basket__price')!;

    const form = this.root.querySelector('.basket__order') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const address = (this.root.querySelector('input[name="address"]') as HTMLInputElement)?.value;
        const payment = this.root.querySelector('.button_alt_active')?.getAttribute('name') || 'card';

        this.events.emit('checkout:step1:complete', { address, payment });
      });
    }
  }

  public render(products: Product[], total: number) {
    this.list.innerHTML = '';

    products.forEach((product, index) => {
      const template = document.querySelector<HTMLTemplateElement>('#card-basket')!;
      const item = template.content.cloneNode(true) as HTMLElement;

      item.querySelector('.basket__item-index')!.textContent = `${index + 1}`;
      item.querySelector('.card__title')!.textContent = product.title!;
      item.querySelector('.card__price')!.textContent = product.price === null
        ? 'Бесценно'
        : `${product.price} синапсов`;

      const deleteButton = item.querySelector('.basket__item-delete')!;
      deleteButton.setAttribute('data-id', product.id);
      deleteButton.addEventListener('click', () => {
        this.events.emit('cart:remove', { productId: product.id });
      });

      this.list.append(item);
    });

    this.total.textContent = `${total} синапсов`;
  }

  public setCheckoutEnabled(enabled: boolean) {
    const checkoutButton = this.root.querySelector('.basket__button') as HTMLButtonElement;
    if (checkoutButton) {
      checkoutButton.disabled = !enabled;
    }
  }
}

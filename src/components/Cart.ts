import { Product } from '../types';
import { IEvents } from '../types';

export class Cart {
	protected list: HTMLElement;
	protected total: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(
		protected container: HTMLElement,
		protected events: IEvents
	) {
		this.list = this.container.querySelector('.basket__list')!;
		this.total = this.container.querySelector('.basket__price')!;
		this.button = this.container.querySelector('.basket__button')!;

		this.button.addEventListener('click', () => {
			this.events.emit('checkout:step1:complete');
		});
	}

	render(items: Product[], total: number) {
		this.list.innerHTML = '';

		items.forEach((product, index) => {
			const template = document.querySelector<HTMLTemplateElement>('#card-basket');
			if (!template) return;

			const item = template.content.cloneNode(true) as HTMLElement;

			(item.querySelector('.basket__item-index') as HTMLElement).textContent = `${index + 1}`;
			(item.querySelector('.card__title') as HTMLElement).textContent = product.title;
			(item.querySelector('.card__price') as HTMLElement).textContent =
				product.price === null ? 'Бесценно' : `${product.price} синапсов`;

			const deleteButton = item.querySelector('.basket__item-delete') as HTMLButtonElement;
			deleteButton.addEventListener('click', () => {
				this.events.emit('cart:remove', { productId: product.id });
			});

			this.list.append(item);
		});

		this.total.textContent = `${total} синапсов`;
	}
}

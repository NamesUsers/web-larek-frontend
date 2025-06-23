import { Product, IEvents } from '../types';

export class CartItem {
	protected element: HTMLElement;

	constructor(
		protected product: Product,
		protected index: number,
		protected events: IEvents
	) {
		const template = document.querySelector<HTMLTemplateElement>('#card-basket');
		if (!template) {
			throw new Error('Шаблон #card-basket не найден');
		}

		this.element = template.content.cloneNode(true) as HTMLElement;

		const title = this.element.querySelector('.card__title');
		const price = this.element.querySelector('.card__price');
		const indexEl = this.element.querySelector('.basket__item-index');
		const deleteButton = this.element.querySelector('.basket__item-delete');

		if (title) title.textContent = product.title;
		if (price) {
			price.textContent =
				product.price === null
					? 'Бесценно'
					: `${product.price} синапсов`;
		}
		if (indexEl) indexEl.textContent = String(index + 1);

		deleteButton?.addEventListener('click', () => {
			this.events.emit('cart:remove', { productId: product.id });
		});
	}

	render(): HTMLElement {
		return this.element;
	}
}

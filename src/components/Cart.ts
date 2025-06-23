import { Product, IEvents } from '../types';
import { CartItem } from './CartItem';

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
			this.events.emit('checkout:step1:complete', {
				address: '',
				payment: 'card',
			});
		});
	}

	render(items: Product[], total: number): HTMLElement {
		this.list.innerHTML = '';

		items.forEach((product, index) => {
			const item = new CartItem(product, index, this.events);
			this.list.append(item.render());
		});

		this.total.textContent = total === 0
			? '0 синапсов'
			: `${total} синапсов`;

		return this.container;
	}

	setCheckoutEnabled(state: boolean): void {
		this.button.disabled = !state;
	}
}

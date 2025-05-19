import { Product } from '../types';
import { IEvents } from '../types';

export class ProductCard {
	constructor(private events: IEvents) {}

	render(product: Product): HTMLElement {
		const card = document.createElement('div');
		card.className = 'product-card';

		card.innerHTML = `
			<img src="${product.image}" alt="${product.title}" class="product-card__image"/>
			<h3 class="product-card__title">${product.title}</h3>
			<p class="product-card__price">${product.price} ₽</p>
		`;

		card.addEventListener('click', () => {
			this.events.emit('modal:open', product.id);
		});

		return card;
	}
}

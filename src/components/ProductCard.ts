import { Product } from '../types';
import { IEvents } from '../types';
import { CDN_URL } from '../utils/constants';

export class ProductCard {
	constructor(private events: IEvents) {}

	render(product: Product): HTMLElement {
		const card = document.createElement('div');
		card.className = 'product-card';

		card.innerHTML = `
			<div class="product-card__tag ${product.category}">
				${this.getCategoryName(product.category)}
			</div>
			<img src="${CDN_URL}/${product.image}" alt="${product.title}" class="product-card__image"/>
			<h3 class="product-card__title">${product.title}</h3>
			<p class="product-card__price">
				${product.price === null ? 'Бесценно' : product.price + ' синапсов'}
			</p>
		`;

		card.addEventListener('click', () => {
			this.events.emit('modal:open', { productId: product.id });
		});

		return card;
	}

	private getCategoryName(category: string): string {
		switch (category) {
			case 'software': return 'софт-скилл';
			case 'hardware': return 'доступен';
			case 'magic': return 'магия';
			case 'rare': return 'экспериментальный';
			default: return '';
		}
	}
}

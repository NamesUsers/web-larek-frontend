import { Product } from '../types';
import { IEvents } from '../types';
import { ProductCard } from './ProductCard';

export class Catalog {
	private items: HTMLElement[] = [];

	constructor(
		private container: HTMLElement,
		private events: IEvents
	) {}

	// Отображение списка карточек
	render(products: Product[]) {
		this.clear();

		products.forEach((product) => {
			const card = new ProductCard(this.events);
			const cardElement = card.render(product);
			this.items.push(cardElement);
			this.container.appendChild(cardElement);
		});
	}

	// Очистка предыдущего состояния
	clear() {
		this.items.forEach((item) => item.remove());
		this.items = [];
	}
}
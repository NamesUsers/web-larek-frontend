import { Product } from '../types';
import { IEvents } from '../types';
import { CDN_URL } from '../utils/constants';

export class ProductModal {
	private modal: HTMLElement;

	constructor(
		private container: HTMLElement,
		private events: IEvents
	) {
		this.modal = document.querySelector('.modal')!;
		const closeBtn = this.modal.querySelector('.modal__close');
		if (closeBtn) {
			closeBtn.addEventListener('click', () => this.close());
		}

		this.modal.addEventListener('click', (e) => {
			if (e.target === this.modal) this.close();
		});
	}

	open(product: Product, inCart: boolean) {
		const image = this.modal.querySelector('.card__image') as HTMLImageElement | null;
		if (image) image.src = `${CDN_URL}/${product.image.replace('.svg', '.png')}`;


		// ✅ Добавляем замену категории
		const category = this.modal.querySelector('.card__category');
		if (category) {
			const key = this.getCategoryKey(product.category);
			const label = this.getCategoryName(key || 'other');
			category.className = `card__category card__category_${key}`;
			category.textContent = label;
		}

		const title = this.modal.querySelector('.card__title');
		if (title) title.textContent = product.title;

		const description = this.modal.querySelector('.card__text');
		if (description) description.textContent = product.description;

		const price = this.modal.querySelector('.card__price');
		if (price) {
			price.textContent = product.price === null ? 'Бесценно' : `${product.price} синапсов`;
		}

		const button = this.modal.querySelector('.card__button') as HTMLButtonElement | null;
		if (button) {
			button.textContent = inCart ? 'Удалить из корзины' : 'В корзину';
			button.onclick = () => {
				this.events.emit(inCart ? 'cart:remove' : 'cart:add', {
					productId: product.id,
				});
				this.close();
			};
		}

		this.modal.classList.add('modal_active');
	}

	close() {
		this.modal.classList.remove('modal_active');
	}

	private getCategoryKey(raw: string): string | null {
		const category = raw.trim().toLowerCase();
		switch (category) {
			case 'софт-скил': return 'soft';
			case 'хард-скил': return 'hard';
			case 'дополнительное': return 'additional';
			case 'кнопка': return 'button';
			case 'другое': return 'other';
			default:
				console.warn('[МОДАЛКА: НЕИЗВЕСТНАЯ КАТЕГОРИЯ]', raw);
				return null;
		}
	}

	private getCategoryName(key: string): string {
		switch (key) {
			case 'soft': return 'софт-скил';
			case 'hard': return 'хард-скил';
			case 'additional': return 'дополнительное';
			case 'button': return 'кнопка';
			case 'other': return 'другое';
			default: return 'неизвестно';
		}
	}
}

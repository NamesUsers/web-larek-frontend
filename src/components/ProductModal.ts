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
		if (image) image.src = `${CDN_URL}/${product.image}`;

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
}
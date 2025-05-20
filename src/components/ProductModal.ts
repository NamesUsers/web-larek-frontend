import { Product } from '../types';
import { IEvents } from '../types';

export class ProductModal {
	private modal: HTMLElement;
	private image: HTMLImageElement;
	private title: HTMLElement;
	private description: HTMLElement;
	private price: HTMLElement;
	private action: HTMLButtonElement;
	private closeBtn: HTMLElement;

	constructor(
		private container: HTMLElement,
		private events: IEvents
	) {
		this.modal = document.querySelector('.modal')!; // используем готовую разметку
		this.image = this.modal.querySelector('.modal__image')!;
		this.title = this.modal.querySelector('.modal__title')!;
		this.description = this.modal.querySelector('.modal__description')!;
		this.price = this.modal.querySelector('.modal__price')!;
		this.action = this.modal.querySelector('.modal__action')!;
		this.closeBtn = this.modal.querySelector('.modal__close')!;

		this.closeBtn.addEventListener('click', () => this.close());
		this.modal.addEventListener('click', (e) => {
			if (e.target === this.modal) this.close();
		});
	}

	open(product: Product, inCart: boolean) {
		this.image.src = product.image;
		this.title.textContent = product.title;
		this.description.textContent = product.description;
		this.price.textContent = product.price === null ? 'Бесценно' : `${product.price} синапсов`;
		this.action.textContent = inCart ? 'Удалить из корзины' : 'Добавить в корзину';
		this.modal.classList.add('modal_active');
	}

	close() {
		this.modal.classList.remove('modal_active');
	}
}

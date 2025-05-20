import { Product } from '../types';
import { IEvents } from '../types';

export class ProductModal {
	private modal: HTMLElement;

	constructor(
		private container: HTMLElement,
		private events: IEvents
	) {
		this.modal = this.createModal();
		this.container.append(this.modal);

		this.modal.addEventListener('click', (e) => {
			if (e.target === this.modal || (e.target as HTMLElement).classList.contains('modal__close')) {
				this.close();
			}
		});
	}

	private createModal(): HTMLElement {
		const modal = document.createElement('div');
		modal.classList.add('modal');
		modal.innerHTML = `
			<div class="modal__content">
				<button class="modal__close">×</button>
				<img class="modal__image" />
				<h2 class="modal__title"></h2>
				<p class="modal__description"></p>
				<p class="modal__price"></p>
				<button class="modal__action"></button>
			</div>
		`;
		modal.style.display = 'none';
		return modal;
	}

	open(product: Product, inCart: boolean) {
		this.modal.querySelector('.modal__image')!.setAttribute('src', product.image);
		this.modal.querySelector('.modal__title')!.textContent = product.title;
		this.modal.querySelector('.modal__description')!.textContent = product.description;
		this.modal.querySelector('.modal__price')!.textContent = `${product.price} ₽`;

		const button = this.modal.querySelector('.modal__action') as HTMLButtonElement;
		button.textContent = inCart ? 'Удалить из корзины' : 'Купить';

		button.onclick = () => {
			this.events.emit(inCart ? 'cart:remove' : 'cart:add', { productId: product.id });
			this.close();
		};

		this.modal.style.display = 'block';
	}

	close() {
		this.modal.style.display = 'none';
	}
}

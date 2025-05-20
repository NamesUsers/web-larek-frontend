import { IEvents } from '../types';

export class Success {
	protected container: HTMLElement;
	protected closeButton: HTMLButtonElement;
	protected amount: HTMLElement;

	constructor(protected events: IEvents) {
		const template = document.querySelector<HTMLTemplateElement>('#success')!;
		this.container = template.content.cloneNode(true) as HTMLElement;

		this.closeButton = this.container.querySelector('.order-success__close')!;
		this.amount = this.container.querySelector('.order-success__description')!;

		this.closeButton.addEventListener('click', () => {
			this.events.emit('cart:open'); // ← возвращаем пользователя к каталогу
		});
	}

	render(total: number) {
		this.amount.textContent = `Списано ${total} синапсов`;

		const modal = document.querySelector('.modal');
		if (modal) modal.classList.add('modal_active');

		const modalContent = document.querySelector('.modal__content');
		if (modalContent) {
			modalContent.innerHTML = '';
			modalContent.append(this.container);
		}
	}
}

import { IEvents } from '../types';

export class Cart {
	protected rootElement: HTMLElement;
	protected listElement: HTMLElement;
	protected totalElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(protected events: IEvents) {}

	/**
	 * Устанавливает корневой элемент корзины — вызывается из index.ts
	 */
	public setRoot(root: HTMLElement) {
		this.rootElement = root;
		this.listElement = root.querySelector('.basket__list')!;
		this.totalElement = root.querySelector('.basket__price')!;
		this.buttonElement = root.querySelector('.basket__button')!;
	}

	/**
	 * Рендерит содержимое корзины: список элементов и итоговую цену
	 */
	public render(items: HTMLElement[], total: number): void {
		if (!this.listElement || !this.totalElement) return;

		this.listElement.innerHTML = '';
		items.forEach((item) => this.listElement.append(item));
		this.totalElement.textContent = `${total} синапсов`;
	}

	/**
	 * Активирует или деактивирует кнопку оформления заказа
	 */
	public setCheckoutEnabled(enabled: boolean): void {
		if (this.buttonElement) {
			this.buttonElement.disabled = !enabled;
		}
	}
}

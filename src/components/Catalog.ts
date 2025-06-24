export class Catalog {
	constructor(private container: HTMLElement) {}

	public render(cardElements: HTMLElement[]) {
		this.container.innerHTML = '';
		cardElements.forEach((card) => this.container.append(card));
	}

	public setCounter(count: number) {
		const counter = document.querySelector('.header__basket-counter');
		if (counter) {
			counter.textContent = String(count);
		}
	}

	public showError(message: string) {
		this.container.innerHTML = '';
		const div = document.createElement('div');
		div.textContent = message;
		div.style.color = 'red';
		div.style.padding = '2rem';
		div.style.textAlign = 'center';
		this.container.append(div);
	}
}

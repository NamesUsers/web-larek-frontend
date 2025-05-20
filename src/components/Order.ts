import { IEvents, PaymentType } from '../types';

export class Order {
	protected container: HTMLElement;
	protected form: HTMLFormElement;
	protected address: HTMLInputElement;
	protected buttons: NodeListOf<HTMLButtonElement>;
	protected payment: PaymentType = 'card';

	constructor(parent: HTMLElement, protected events: IEvents) {
		const template = document.querySelector<HTMLTemplateElement>('#order')!;
		this.container = template.content.cloneNode(true) as HTMLElement;

		this.form = this.container.querySelector('form')!;
		this.address = this.form.querySelector('input[name="address"]')!;
		this.buttons = this.form.querySelectorAll('button.button_alt');

		this.buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name as PaymentType;
				this.buttons.forEach((btn) => btn.classList.remove('button_alt-active'));
				button.classList.add('button_alt-active');
				this.validate();
			});
		});

		this.address.addEventListener('input', () => this.validate());

		this.form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('checkout:submit', {
				address: this.address.value,
				payment: this.payment,
			});
		});
	}

	render() {
		document.body.querySelector('.modal__content')!.innerHTML = '';
		document.body.querySelector('.modal__content')!.append(this.container);
	}

	validate() {
		const button = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
		button.disabled = !this.address.value || !this.payment;
	}
}

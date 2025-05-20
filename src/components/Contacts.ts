import { IEvents } from '../types';

export class Contacts {
	protected container: HTMLElement;
	protected form: HTMLFormElement;
	protected email: HTMLInputElement;
	protected phone: HTMLInputElement;

	constructor(parent: HTMLElement, protected events: IEvents) {
		const template = document.querySelector<HTMLTemplateElement>('#contacts')!;
		this.container = template.content.cloneNode(true) as HTMLElement;

		this.form = this.container.querySelector('form')!;
		this.email = this.form.querySelector('input[name="email"]')!;
		this.phone = this.form.querySelector('input[name="phone"]')!;

		this.email.addEventListener('input', () => this.validate());
		this.phone.addEventListener('input', () => this.validate());

		this.form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('order:success', {
				email: this.email.value,
				phone: this.phone.value,
			});
		});
	}

	render() {
		document.body.querySelector('.modal__content')!.innerHTML = '';
		document.body.querySelector('.modal__content')!.append(this.container);
	}

	validate() {
		const button = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
		const validEmail = this.email.value.includes('@');
		const validPhone = this.phone.value.length >= 10;
		button.disabled = !validEmail || !validPhone;
	}
}

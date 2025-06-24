import { IEvents } from '../types';

export class Contacts {
	protected container: HTMLElement;
	protected form: HTMLFormElement;
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;
	protected submitButton: HTMLButtonElement;
	protected errorField: HTMLElement;

	constructor(protected parent: HTMLElement, protected events: IEvents) {}

	render(): HTMLElement {
		const template = document.querySelector<HTMLTemplateElement>('#contacts')!;
		const clone = template.content.cloneNode(true) as HTMLElement;
		this.container = clone;

		this.form = this.container.querySelector('form')!;
		this.emailInput = this.form.querySelector('input[name="email"]')!;
		this.phoneInput = this.form.querySelector('input[name="phone"]')!;
		this.submitButton = this.form.querySelector('button[type="submit"]')!;
		this.errorField = this.form.querySelector('.form__errors')!;

		this.emailInput.addEventListener('input', () => this.emitChange());
		this.phoneInput.addEventListener('input', () => this.emitChange());

		this.form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.events.emit('order:submit', undefined); // ✅ <-- передаём явно
		});

		return this.container;
	}

	protected emitChange() {
		this.events.emit('contacts:change', {
			email: this.emailInput.value.trim(),
			phone: this.phoneInput.value.trim(),
		});
	}

	public setValidState(
		emailValid: boolean,
		phoneValid: boolean,
		errors: { email: string; phone: string }
	) {
		const isValid = emailValid && phoneValid;
		this.submitButton.disabled = !isValid;
		this.errorField.textContent = !isValid
			? [errors.email, errors.phone].filter(Boolean).join('. ')
			: '';
	}
}

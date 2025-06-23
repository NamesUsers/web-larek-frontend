import { IEvents, PaymentType } from '../types';

export class Order {
  protected container: HTMLElement;
  protected form: HTMLFormElement;
  protected addressInput: HTMLInputElement;
  protected buttons: NodeListOf<HTMLButtonElement>;
  protected submitButton: HTMLButtonElement;
  protected errorField: HTMLElement;
  protected wasInteracted = false;

  constructor(protected parent: HTMLElement, protected events: IEvents) {}

  render(): HTMLElement {
    const template = document.querySelector<HTMLTemplateElement>('#order')!;
    this.container = template.content.cloneNode(true) as HTMLElement;

    this.form = this.container.querySelector('form')!;
    this.addressInput = this.form.querySelector('input[name="address"]')!;
    this.buttons = this.container.querySelectorAll('.button_alt');
    this.submitButton = this.form.querySelector('button[type="submit"]')!;
    this.errorField = this.container.querySelector('.form__errors')!;

    this.addressInput.addEventListener('input', () => {
      this.wasInteracted = true;
      this.handleInput();
    });

    this.buttons.forEach((button) => {
      button.addEventListener('click', () => {
        this.wasInteracted = true;
        this.buttons.forEach((btn) => btn.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        this.handleInput();
      });
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('checkout:step1:complete', {
        address: this.addressInput.value,
        payment: this.getSelectedPayment(),
      });
    });

    // Блокируем кнопку изначально
    this.validate();

    return this.container;
  }

  protected handleInput() {
    this.emitChange();
    this.validate();
  }

  protected emitChange() {
    this.events.emit('order:change', {
      address: this.addressInput.value,
      payment: this.getSelectedPayment(),
    });
  }

  protected getSelectedPayment(): PaymentType | undefined {
    const selected = Array.from(this.buttons).find((btn) =>
      btn.classList.contains('button_alt-active')
    );
    return selected?.getAttribute('name') as PaymentType;
  }

  protected validate() {
    const isValid = this.addressInput.value.trim() !== '' && !!this.getSelectedPayment();
    const error = isValid || !this.wasInteracted ? '' : 'Введите адрес и выберите оплату';
    this.setValidState(isValid, error);
  }

  public setValidState(isValid: boolean, error?: string) {
    this.submitButton.disabled = !isValid;
    this.errorField.textContent = error ?? '';
  }
}

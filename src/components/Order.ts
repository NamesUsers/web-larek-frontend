import { IEvents, PaymentType } from '../types';

export class Order {
  protected container: HTMLElement;
  protected form: HTMLFormElement;
  protected address: HTMLInputElement;
  protected buttons: NodeListOf<HTMLButtonElement>;
  protected errorField: HTMLElement;
  protected submitButton: HTMLButtonElement;
  protected payment: PaymentType | null = null;

  constructor(parent: HTMLElement, protected events: IEvents) {
    const template = document.querySelector<HTMLTemplateElement>('#order')!;
    this.container = template.content.cloneNode(true) as HTMLElement;
  }

  render() {
    // Сброс оплаты
    this.payment = null;

    const modalContent = document.body.querySelector('.modal__content')!;
    modalContent.innerHTML = '';

    const template = document.querySelector<HTMLTemplateElement>('#order')!;
    const clone = template.content.cloneNode(true) as HTMLElement;
    modalContent.append(clone);

    this.form = modalContent.querySelector('form')!;
    this.address = this.form.querySelector('input[name="address"]')!;
    this.buttons = this.form.querySelectorAll('button.button_alt');
    this.errorField = this.form.querySelector('.form__errors')!;
    this.submitButton = this.form.querySelector('button[type="submit"]')!;

    // Выбор оплаты
    this.buttons.forEach((button) => {
      button.addEventListener('click', () => {
        this.payment = button.name as PaymentType;
        this.buttons.forEach((btn) => btn.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        this.emitChange();
      });
    });

    // Ввод адреса
    this.address.addEventListener('input', () => {
      this.emitChange();
    });

    // Отправка формы
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!this.payment || !this.address.value.trim()) return;

      this.events.emit('checkout:submit', {
        address: this.address.value.trim(),
        payment: this.payment,
      });
    });
  }

  // Генерирует событие изменения данных формы
  protected emitChange() {
    this.events.emit('order:change', {
      address: this.address.value,
      payment: this.payment,
    });
  }

  // Метод для установки состояния формы извне (из модели)
  public setValidState(isValid: boolean, errorMessage?: string) {
    this.submitButton.disabled = !isValid;

    if (errorMessage) {
      this.errorField.textContent = errorMessage;
      this.errorField.classList.add('form__errors_active');
    } else {
      this.errorField.textContent = '';
      this.errorField.classList.remove('form__errors_active');
    }
  }
}

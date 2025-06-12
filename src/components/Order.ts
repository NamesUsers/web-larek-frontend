import { IEvents, PaymentType } from '../types';

export class Order {
  protected container: HTMLElement;
  protected form: HTMLFormElement;
  protected address: HTMLInputElement;
  protected buttons: NodeListOf<HTMLButtonElement>;
  protected payment: PaymentType | null = null;

  constructor(parent: HTMLElement, protected events: IEvents) {
    const template = document.querySelector<HTMLTemplateElement>('#order')!;
    this.container = template.content.cloneNode(true) as HTMLElement;
  }

  render() {
    const modalContent = document.body.querySelector('.modal__content')!;
    modalContent.innerHTML = '';

    // 🔁 Повторно клонируем шаблон при каждом открытии
    const template = document.querySelector<HTMLTemplateElement>('#order')!;
    const clone = template.content.cloneNode(true) as HTMLElement;
    modalContent.append(clone);

    // 🔄 Повторно переопределим ссылки на форму, адрес и кнопки
    this.form = modalContent.querySelector('form')!;
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
      if (!this.payment || !this.address.value) return; // ⛔ Предохранитель

      this.events.emit('checkout:submit', {
        address: this.address.value,
        payment: this.payment,
      });
    });
  }

  validate() {
    const button = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
    button.disabled = !this.address.value.trim() || !this.payment;
  }
}

import { IEvents } from '../types';

export class Contacts {
  protected email: HTMLInputElement;
  protected phone: HTMLInputElement;
  protected form: HTMLFormElement;

  constructor(protected root: HTMLElement, protected events: IEvents) {}

  render(data: { address: string; payment: string }): HTMLElement {
    const template = document.querySelector<HTMLTemplateElement>('#contacts')!;
    const container = template.content.cloneNode(true) as HTMLElement;

    this.form = container.querySelector('form')!;
    this.email = container.querySelector('input[name="email"]')!;
    this.phone = container.querySelector('input[name="phone"]')!;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:submit', {
        email: this.email.value,
        phone: this.phone.value,
        address: data.address,
        payment: data.payment,
      });
    });

    return container;
  }
}

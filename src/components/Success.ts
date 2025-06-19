import { IEvents } from '../types';

export class Success {
  protected closeButton: HTMLButtonElement;
  protected amount: HTMLElement;

  constructor(protected events: IEvents) {}

  render(total: number): HTMLElement {
    const template = document.querySelector<HTMLTemplateElement>('#success')!;
    const container = template.content.cloneNode(true) as HTMLElement;

    this.closeButton = container.querySelector('.order-success__close')!;
    this.amount = container.querySelector('.order-success__description')!;
    this.amount.textContent = `Списано ${total} синапсов`;

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close', undefined);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    return container;
  }
}

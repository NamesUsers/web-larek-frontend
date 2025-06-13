import { IEvents } from '../types';

export class Success {
  protected closeButton: HTMLButtonElement;
  protected amount: HTMLElement;

  constructor(protected events: IEvents) {}

  render(total: number) {
    const template = document.querySelector<HTMLTemplateElement>('#success')!;
    const container = template.content.cloneNode(true) as HTMLElement;

    this.closeButton = container.querySelector('.order-success__close')!;
    this.amount = container.querySelector('.order-success__description')!;
    this.amount.textContent = `Списано ${total} синапсов`;

    this.closeButton.addEventListener('click', () => {
      const modal = document.querySelector('.modal');
      if (modal) modal.classList.remove('modal_active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const modalContent = document.querySelector('.modal__content')!;
    modalContent.innerHTML = '';
    modalContent.append(container);

    const modal = document.querySelector('.modal');
    if (modal) modal.classList.add('modal_active');
  }
}

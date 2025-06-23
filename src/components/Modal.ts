export class Modal {
  private container: HTMLElement;
  private content: HTMLElement;

  constructor() {
    this.container = document.querySelector('.modal')!;
    this.content = this.container.querySelector('.modal__content')!;

    const closeBtn = this.container.querySelector('.modal__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.close();
    });
  }

  open(content: HTMLElement) {
    this.content.innerHTML = '';
    this.content.append(content); // НЕ клонируем, чтобы сохранить обработчики
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
  }
}

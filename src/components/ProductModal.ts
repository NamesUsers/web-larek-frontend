import { Product } from '../types';
import { IEvents } from '../types';
import { CDN_URL } from '../utils/constants';

export class ProductModal {
  constructor(private events: IEvents) {}

  render(product: Product, inCart: boolean): HTMLElement {
    const template = document.querySelector<HTMLTemplateElement>('#card-preview')!;
    const node = template.content.cloneNode(true) as HTMLElement;

    const image = node.querySelector('.card__image') as HTMLImageElement | null;
    if (image) image.src = `${CDN_URL}/${product.image.replace('.svg', '.png')}`;

    const category = node.querySelector('.card__category');
    if (category) {
      const key = this.getCategoryKey(product.category);
      const label = this.getCategoryName(key || 'other');
      category.className = `card__category card__category_${key}`;
      category.textContent = label;
    }

    const title = node.querySelector('.card__title');
    if (title) title.textContent = product.title;

    const description = node.querySelector('.card__text');
    if (description) description.textContent = product.description;

    const price = node.querySelector('.card__price');
    if (price) {
      price.textContent = product.price === null ? 'Бесценно' : `${product.price} синапсов`;
    }

    const button = node.querySelector('.card__button') as HTMLButtonElement | null;
    if (button) {
      button.textContent = inCart ? 'Удалить из корзины' : 'В корзину';
      button.addEventListener('click', () => {
        this.events.emit(inCart ? 'cart:remove' : 'cart:add', {
          productId: product.id,
        });
        this.events.emit('modal:close', undefined); // ✅ Закрываем через глобальное событие
      });
    }

    return node;
  }

  private getCategoryKey(raw: string): string | null {
    const category = raw.trim().toLowerCase();
    switch (category) {
      case 'софт-скил': return 'soft';
      case 'хард-скил': return 'hard';
      case 'дополнительное': return 'additional';
      case 'кнопка': return 'button';
      case 'другое': return 'other';
      default:
        console.warn('[МОДАЛКА: НЕИЗВЕСТНАЯ КАТЕГОРИЯ]', raw);
        return null;
    }
  }

  private getCategoryName(key: string): string {
    switch (key) {
      case 'soft': return 'софт-скил';
      case 'hard': return 'хард-скил';
      case 'additional': return 'дополнительное';
      case 'button': return 'кнопка';
      case 'other': return 'другое';
      default: return 'неизвестно';
    }
  }
}

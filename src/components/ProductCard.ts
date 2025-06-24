import { Product } from '../types';
import { IEvents } from '../types';
import { CDN_URL } from '../utils/constants';

export class ProductCard {
  protected template: HTMLTemplateElement;

  constructor(private events: IEvents) {
    this.template = document.querySelector<HTMLTemplateElement>('#card-catalog')!;
  }

  render(product: Product): HTMLElement {
    const clone = this.template.content.cloneNode(true) as HTMLElement;
    const card = clone.querySelector('.card') as HTMLElement;

    const categoryKey = this.getCategoryKey(product.category);
    const categoryLabel = this.getCategoryName(categoryKey || 'other');

    const categoryEl = card.querySelector('.card__category') as HTMLElement;
    categoryEl.textContent = categoryLabel;
    categoryEl.className = `card__category card__category_${categoryKey}`;

    const titleEl = card.querySelector('.card__title') as HTMLElement;
    titleEl.textContent = product.title;

    const imageEl = card.querySelector('.card__image') as HTMLImageElement;
    imageEl.src = `${CDN_URL}/${product.image.replace('.svg', '.png')}`;
    imageEl.alt = product.title;

    const priceEl = card.querySelector('.card__price') as HTMLElement;
    priceEl.textContent = product.price === null
      ? 'Бесценно'
      : `${product.price} синапсов`;

    card.addEventListener('click', () => {
      this.events.emit('modal:open', { productId: product.id });
    });

    return card;
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
        console.warn('[НЕИЗВЕСТНАЯ КАТЕГОРИЯ]', raw);
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

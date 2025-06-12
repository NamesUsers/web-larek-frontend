import { Product } from '../types';
import { IEvents } from '../types';
import { CDN_URL } from '../utils/constants';

export class ProductCard {
  constructor(private events: IEvents) {}

  render(product: Product): HTMLElement {
    const card = document.createElement('div');
    card.className = 'card card__column';

    const categoryKey = this.getCategoryKey(product.category);
    const categoryLabel = this.getCategoryName(categoryKey || 'other');

    const className = categoryKey
      ? `card__category card__category_${categoryKey}`
      : 'card__category';


    card.innerHTML = `
      <div class="${className}">
        ${categoryLabel}
      </div>
      <img src="${CDN_URL}/${product.image}" alt="${product.title}" class="card__image"/>
      <h3 class="card__title">${product.title}</h3>
      <p class="card__price">
        ${product.price === null ? 'Бесценно' : product.price + ' синапсов'}
      </p>
    `;

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

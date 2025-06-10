import { Product } from '../types';
import { IEvents } from '../types';
import { CDN_URL } from '../utils/constants';

export class ProductCard {
  constructor(private events: IEvents) {}

  render(product: Product): HTMLElement {
    const card = document.createElement('div');
    card.className = 'card card__column';

    // правильный SCSS-совместимый класс и текст
    const categoryKey = this.getCategoryKey(product.category);
    const categoryLabel = this.getCategoryName(categoryKey);

    card.innerHTML = `
      <div class="card__category card__category_${categoryKey}">
        ${categoryLabel}
      </div>
      <img src="${CDN_URL}/${product.image}" alt="${product.title}" class="card__image"/>
      <h3 class="card__title">${product.title}</h3>
      <p class="card__price">
        ${product.price === null ? 'Бесценно' : product.price + ' синапсов'}
      </p>
    `;
console.log('Категория:', product.category);

    card.addEventListener('click', () => {
      this.events.emit('modal:open', { productId: product.id });
    });

    return card;
  }

  // Возвращает ключ категории для SCSS
  private getCategoryKey(category: string): string {
    switch (category) {
      case 'software':
        return 'soft';
      case 'hardware':
        return 'hard';
      case 'magic':
        return 'additional';
      case 'rare':
        return 'other';
      default:
        return 'other';
    }
  }

  // Возвращает текст категории для отображения
  private getCategoryName(categoryKey: string): string {
    switch (categoryKey) {
      case 'soft':
        return 'софт-скилл';
      case 'hard':
        return 'доступен';
      case 'additional':
        return 'магия';
      case 'other':
        return 'другое';
      default:
        return '';
    }
  }
}

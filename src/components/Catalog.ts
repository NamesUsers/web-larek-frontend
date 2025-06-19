import { Product } from '../types';
import { ProductCard } from './ProductCard';

export class Catalog {
  constructor(
    private container: HTMLElement,
    private cardBuilder: ProductCard
  ) {}

  public render(products: Product[]) {
    this.container.innerHTML = '';
    const items = products.map(product => this.cardBuilder.render(product));
    items.forEach(item => this.container.append(item));
  }

  public setCounter(count: number) {
    const counter = document.querySelector('.header__basket-counter');
    if (counter) {
      counter.textContent = String(count);
    }
  }

  public showError(message: string) {
    this.container.innerHTML = '';
    const div = document.createElement('div');
    div.textContent = message;
    div.style.color = 'red';
    div.style.padding = '2rem';
    div.style.textAlign = 'center';
    this.container.append(div);
  }
}

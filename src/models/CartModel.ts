import { Product } from '../types';

export class CartModel {
	private items: Product[] = [];

	add(product: Product): void {
		const exists = this.items.find(item => item.id === product.id);
		if (!exists) this.items.push(product);
	}

	remove(productId: string): void {
		this.items = this.items.filter(item => item.id !== productId);
	}

	clear(): void {
		this.items = [];
	}

	getAll(): Product[] {
		return this.items;
	}

	getTotal(): number {
		return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
	}
}

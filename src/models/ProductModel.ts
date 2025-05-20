import { Product } from '../types';

export class ProductModel {
	private products: Product[] = [];

	setItems(items: Product[]) {
		this.products = items;
	}

	getAll(): Product[] {
		return this.products;
	}

	getById(id: string): Product | undefined {
		return this.products.find((p) => p.id === id);
	}
}
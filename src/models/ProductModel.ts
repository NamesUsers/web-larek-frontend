import { Product, ApiListResponse } from '../types';
import { Api } from '../components/base/api';

export class ProductModel {
	private products: Product[] = [];

	constructor(private api: Api) {}

	async load(): Promise<void> {
		const response = await this.api.get<ApiListResponse<Product>>('/product');
		this.products = response.items;
	}

	getAll(): Product[] {
		return this.products;
	}

	getById(id: string): Product | undefined {
		return this.products.find((p) => p.id === id);
	}
}

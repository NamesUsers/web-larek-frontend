
import { Api } from '../components/base/api';
import { Product, ApiListResponse } from '../types';

export class ProductAPI {
	constructor(private api: Api) {}

	getAll(): Promise<Product[]> {
		return this.api
			.get<ApiListResponse<Product>>('/product/')
			.then(res => res.items);
	}
}

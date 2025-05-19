export type PaymentMethod = 'card' | 'cash';

export interface OrderData {
	address: string;
	payment: PaymentMethod;
	email: string;
	phone: string;
}

export class OrderModel {
	private data: Partial<OrderData> = {};

	set<K extends keyof OrderData>(key: K, value: OrderData[K]) {
		this.data[key] = value;
	}

	get<K extends keyof OrderData>(key: K): OrderData[K] | undefined {
		return this.data[key] as OrderData[K] | undefined;
	}

	isValid(): boolean {
		return (
			typeof this.data.address === 'string' &&
			typeof this.data.payment === 'string' &&
			typeof this.data.email === 'string' &&
			typeof this.data.phone === 'string'
		);
	}

	getData(): OrderData | null {
		if (this.isValid()) {
			return this.data as OrderData;
		}
		return null;
	}

	clear(): void {
		this.data = {};
	}
}

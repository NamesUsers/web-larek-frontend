export type PaymentMethod = 'card' | 'cash';

export interface OrderData {
	address: string;
	payment: PaymentMethod;
	email: string;
	phone: string;
}

export class OrderModel {
	private data: Partial<OrderData> = {};

	// Учитываем optional-поля через Partial<OrderData>[K]
	set<K extends keyof OrderData>(key: K, value: Partial<OrderData>[K]): void {
		this.data[key] = value;
	}

	get<K extends keyof OrderData>(key: K): Partial<OrderData>[K] {
		return this.data[key];
	}

	isValid(): boolean {
		return (
			typeof this.data.address === 'string' &&
			typeof this.data.payment === 'string' &&
			typeof this.data.email === 'string' &&
			typeof this.data.phone === 'string'
		);
	}

	validateBasic(): { isValid: boolean; error?: string } {
		if (!this.data.address || this.data.address.trim() === '') {
			return { isValid: false, error: 'Введите адрес доставки' };
		}
		if (!this.data.payment) {
			return { isValid: false, error: 'Выберите способ оплаты' };
		}
		return { isValid: true };
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

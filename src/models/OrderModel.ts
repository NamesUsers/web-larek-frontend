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

	// Полная валидация (для submit)
	isValid(): boolean {
		return (
			typeof this.data.address === 'string' &&
			typeof this.data.payment === 'string' &&
			typeof this.data.email === 'string' &&
			typeof this.data.phone === 'string'
		);
	}

	// Частичная валидация для кнопки "Оформить заказ"
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

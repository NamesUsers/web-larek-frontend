export type PaymentMethod = 'card' | 'cash';

export interface OrderData {
	address: string;
	payment: PaymentMethod;
	email: string;
	phone: string;
}

export class OrderModel {
	private data: Partial<OrderData> = {};

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

	validateContacts(): {
		emailValid: boolean;
		phoneValid: boolean;
		emailError: string;
		phoneError: string;
	} {
		const email = this.data.email || '';
		const phone = this.data.phone || '';

		const emailValid = this.validateEmail(email);
		const phoneValid = this.validatePhone(phone);

		return {
			emailValid,
			phoneValid,
			emailError: emailValid ? '' : 'Некорректный email',
			phoneError: phoneValid ? '' : 'Некорректный телефон',
		};
	}

	private validateEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	private validatePhone(phone: string): boolean {
		return /^\+?\d{10,15}$/.test(phone);
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

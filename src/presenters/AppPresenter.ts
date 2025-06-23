import { IEvents, PaymentType } from '../types';
import { OrderModel } from '../models/OrderModel';
import { Order } from '../components/Order';
import { Contacts } from '../components/Contacts';

export class AppPresenter {
	constructor(
		private orderModel: OrderModel,
		private orderView: Order,
		private contactsView: Contacts,
		private events: IEvents
	) {
		this.events.on('order:change', this.handleOrderChange);
		this.events.on('contacts:change', this.handleContactsChange);
	}

	private handleOrderChange = (data: { address?: string; payment?: PaymentType }) => {
		if (data.address !== undefined) {
			this.orderModel.set('address', data.address);
		}

		if (data.payment !== undefined) {
			this.orderModel.set('payment', data.payment);
		}

		const validation = this.orderModel.validateBasic();

		// 🛠 TypeScript знает, что метод существует, всё работает корректно
		this.orderView.setValidState(validation.isValid, validation.error);
	};

	private handleContactsChange = (data: { email: string; phone: string }) => {
		this.orderModel.set('email', data.email);
		this.orderModel.set('phone', data.phone);

		const emailValid = this.validateEmail(data.email);
		const phoneValid = this.validatePhone(data.phone);

		this.contactsView.setValidState(emailValid, phoneValid, {
			email: emailValid ? '' : 'Некорректный email',
			phone: phoneValid ? '' : 'Некорректный телефон',
		});
	};

	private validateEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	private validatePhone(phone: string): boolean {
		return /^\+?\d{10,15}$/.test(phone);
	}
}

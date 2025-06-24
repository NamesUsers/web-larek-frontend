import { IEvents, PaymentType, Product, Order } from '../types';
import { OrderModel } from '../models/OrderModel';
import { Order as OrderView } from '../components/Order';
import { Contacts } from '../components/Contacts';
import { Cart } from '../components/Cart';
import { Catalog } from '../components/Catalog';
import { ProductCard } from '../components/ProductCard';
import { CartItemView } from '../components/CartItemView';
import { OrderAPI } from '../api/OrderAPI';

export class AppPresenter {
	constructor(
		private orderModel: OrderModel,
		private orderView: OrderView,
		private contactsView: Contacts,
		private cartView: Cart,
		private catalogView: Catalog,
		private orderApi: OrderAPI,
		private events: IEvents,
		private cartItems: string[],
		private totalPrice: number
	) {
		this.events.on('order:change', this.handleOrderChange);
		this.events.on('contacts:change', this.handleContactsChange);
		this.events.on('order:submit', this.handleOrderSubmit);
	}

	private handleOrderChange = (data: { address?: string; payment?: PaymentType }) => {
		if (data.address !== undefined) {
			this.orderModel.set('address', data.address);
		}
		if (data.payment !== undefined) {
			this.orderModel.set('payment', data.payment);
		}

		const validation = this.orderModel.validateBasic();
		this.orderView.setValidState(validation.isValid, validation.error);
	};

	private handleContactsChange = (data: { email: string; phone: string }) => {
		this.orderModel.set('email', data.email);
		this.orderModel.set('phone', data.phone);

		const result = this.orderModel.validateContacts();
		this.contactsView.setValidState(result.emailValid, result.phoneValid, {
			email: result.emailError,
			phone: result.phoneError,
		});
	};

	private handleOrderSubmit = () => {
		const base = this.orderModel.getData();
		if (!base) return;

		const payload: Order = {
			...base,
			items: this.cartItems,
			total: this.totalPrice,
		};

		this.orderApi.postOrder(payload)
			.then(() => {
				this.orderModel.clear();
				this.events.emit('order:success', undefined);
			})
			.catch((error) => {
				console.error('Ошибка при отправке заказа:', error);
			});
	};

	public renderCart(items: Product[]): void {
		this.cartItems = items.map(item => item.id);
		this.totalPrice = items.reduce((sum, item) => sum + (item.price ?? 0), 0);

		const elements = items.map((product, index) => {
			const itemView = new CartItemView(product, index, this.events);
			return itemView.getElement();
		});

		this.cartView.render(elements, this.totalPrice);
	}

	public renderCatalog(products: Product[]): void {
		const cards = products.map((product) => {
			const card = new ProductCard(this.events);
			return card.render(product);
		});
		this.catalogView.render(cards);
	}
}

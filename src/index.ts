import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';

import { ProductModel } from './models/ProductModel';
import { CartModel } from './models/CartModel';

import { Catalog } from './components/Catalog';
import { ProductModal } from './components/ProductModal';
import { Cart } from './components/Cart';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

import { Product, IEvents } from './types';

const api = new Api(process.env.API_ORIGIN as string);
const events = new EventEmitter() as IEvents;

const model = new ProductModel(api);
const cart = new CartModel();

const catalog = new Catalog(document.querySelector('.gallery')!, events);
const modal = new ProductModal(document.body, events);
const orderStep = new Order(document.body, events);
const contactsStep = new Contacts(document.body, events);
const successScreen = new Success(events);

let cartView: Cart | null = null;

// Загрузка каталога
model.load()
	.then(() => {
		const products = model.getAll();
		catalog.render(products);
	})
	.catch((error) => {
		console.error('❌ Ошибка при загрузке продуктов:', error);
		const gallery = document.querySelector('.gallery');
		if (gallery) {
			const message = document.createElement('div');
			message.textContent = '❌ Не удалось загрузить каталог товаров.';
			message.style.color = 'red';
			message.style.padding = '2rem';
			message.style.textAlign = 'center';
			gallery.append(message);
		}
	});

// Открытие модального окна товара
events.on('modal:open', ({ productId }: { productId: string }) => {
	const product = model.getById(productId);
	if (!product) return;

	const inCart = cart.getAll().some(p => p.id === productId);
	modal.open(product, inCart);
});

// Добавление товара в корзину
events.on('cart:add', ({ productId }: { productId: string }) => {
	const product = model.getById(productId);
	if (product) {
		cart.add(product);
		cartView?.render(cart.getAll(), cart.getTotal());
		updateCounter();
	}
});

// Удаление товара из корзины
events.on('cart:remove', ({ productId }: { productId: string }) => {
	cart.remove(productId);
	cartView?.render(cart.getAll(), cart.getTotal());
	updateCounter();
});

// Показ корзины (динамически создаём и вставляем)
document.querySelector('.header__basket')?.addEventListener('click', () => {
	events.emit('cart:open');
});

events.on('cart:open', () => {
	showModal();

	const content = document.querySelector('.modal__content')!;
	content.innerHTML = '';

	const template = document.querySelector<HTMLTemplateElement>('#basket')!;
	const basketEl = template.content.cloneNode(true) as HTMLElement;

	content.append(basketEl);

	cartView = new Cart(document.querySelector('.basket')!, events);
	cartView.render(cart.getAll(), cart.getTotal());
});

// Шаг 1 — форма адреса и оплаты
events.on('checkout:step1:complete', () => {
	orderStep.render();
	showModal();
});

// Шаг 2 — Email и телефон
events.on('checkout:submit', () => {
	contactsStep.render();
	showModal();
});

// Успешное оформление
events.on('order:success', () => {
	const total = cart.getTotal();
	successScreen.render(total);
	cart.clear();
	updateCounter();
});

// Обновление счётчика
function updateCounter() {
	const counter = document.querySelector('.header__basket-counter');
	if (counter) {
		counter.textContent = String(cart.getAll().length);
	}
}

// Активация модального окна
function showModal() {
	document.querySelector('.modal')?.classList.add('modal_active');
}

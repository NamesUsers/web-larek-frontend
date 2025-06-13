import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { API_URL } from './utils/constants';

import { ProductAPI } from './api/ProductAPI';
import { ProductModel } from './models/ProductModel';
import { CartModel } from './models/CartModel';

import { Catalog } from './components/Catalog';
import { ProductModal } from './components/ProductModal';
import { Cart } from './components/Cart';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

import { Product, IEvents } from './types';

const api = new Api(API_URL);
const productApi = new ProductAPI(api);
const model = new ProductModel();
const cart = new CartModel();

const events = new EventEmitter() as IEvents;
const catalog = new Catalog(document.querySelector('.gallery')!, events);
const modal = new ProductModal(document.body, events);

const orderStep = new Order(document.body, events);
const contactsStep = new Contacts(document.body, events);
const successScreen = new Success(events);

let cartView: Cart | null = null;

// Загрузка каталога
productApi.getAll()
	.then((products) => {
		model.setItems(products);
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

events.on('modal:open', ({ productId }: { productId: string }) => {
	const product = model.getById(productId);
	if (!product) return;

	const inCart = cart.getAll().some(p => p.id === productId);

	// Вставка шаблона в .modal__content
	const content = document.querySelector('.modal__content');
	if (!content) {
		console.error('❌ .modal__content не найден!');
		return;
	}
	content.innerHTML = '';

	const template = document.querySelector<HTMLTemplateElement>('#card-preview');
	if (!template) {
		console.error('❌ Шаблон #card-preview не найден!');
		return;
	}

	const node = template.content.cloneNode(true);
	content.append(node);

	// Заполнение и показ
	modal.open(product, inCart);
	showModal();
});

events.on('cart:add', ({ productId }: { productId: string }) => {
	const product = model.getById(productId);
	if (product) {
		cart.add(product);
		cartView?.render(cart.getAll(), cart.getTotal());
		updateCounter();
		updateCheckoutButton();
	}
});

events.on('cart:remove', ({ productId }: { productId: string }) => {
	cart.remove(productId);
	cartView?.render(cart.getAll(), cart.getTotal());
	updateCounter();
	updateCheckoutButton();
});

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
	updateCheckoutButton();
});

events.on('checkout:step1:complete', () => {
	orderStep.render();
	showModal();
});

events.on('checkout:submit', (data) => {
	contactsStep.render(data);
	showModal();
});

events.on('order:success', () => {
	const total = cart.getTotal();
	successScreen.render(total);
	cart.clear();
	updateCounter();
	updateCheckoutButton();
});

function updateCounter() {
	const counter = document.querySelector('.header__basket-counter');
	if (counter) {
		counter.textContent = String(cart.getAll().length);
	}
}

function updateCheckoutButton() {
	const checkoutButton = document.querySelector('.basket__button') as HTMLButtonElement;
	if (checkoutButton) {
		checkoutButton.disabled = cart.getAll().length === 0;
	}
}

function showModal() {
	document.querySelector('.modal')?.classList.add('modal_active');
}

// 👇 Обновим кнопку при первой загрузке
updateCheckoutButton();

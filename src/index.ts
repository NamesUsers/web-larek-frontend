import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { API_URL } from './utils/constants';

import { ProductAPI } from './api/ProductAPI';
import { OrderAPI, OrderForm } from './api/OrderAPI';
import { ProductModel } from './models/ProductModel';
import { CartModel } from './models/CartModel';
import { OrderModel } from './models/OrderModel';

import { Catalog } from './components/Catalog';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { Modal } from './components/Modal';
import { Cart } from './components/Cart';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

import { AppPresenter } from './presenters/AppPresenter';
import { IEvents, PaymentType } from './types';

const api = new Api(API_URL);
const productApi = new ProductAPI(api);
const orderApi = new OrderAPI(api);
const model = new ProductModel();
const cart = new CartModel();
const orderModel = new OrderModel();

const events = new EventEmitter() as IEvents;

const cardBuilder = new ProductCard(events);
const catalog = new Catalog(document.querySelector('.gallery')!, cardBuilder);
const modal = new Modal();
const productModal = new ProductModal(events);
const orderStep: Order = new Order(document.body, events);
const contactsStep = new Contacts(document.body, events);
const successScreen = new Success(events);

const appPresenter = new AppPresenter(orderModel, orderStep, contactsStep, events);

let cartView: Cart | null = null;

productApi.getAll()
  .then((products) => {
    model.setItems(products);
    catalog.render(products);
  })
  .catch((error) => {
    console.error('❌ Ошибка при загрузке продуктов:', error);
    catalog.showError('❌ Не удалось загрузить каталог товаров.');
  });

events.on('modal:open', ({ productId }) => {
  const product = model.getById(productId);
  if (!product) return;

  const inCart = cart.getAll().some(p => p.id === productId);
  const content = productModal.render(product, inCart);
  modal.open(content);
});

events.on('modal:close', () => {
  modal.close();
});

events.on('cart:add', ({ productId }) => {
  const product = model.getById(productId);
  if (product) {
    cart.add(product);
    cartView?.render(cart.getAll(), cart.getTotal());
    updateCounter();
    updateCheckoutButton();
  }
});

events.on('cart:remove', ({ productId }) => {
  cart.remove(productId);
  cartView?.render(cart.getAll(), cart.getTotal());
  updateCounter();
  updateCheckoutButton();
});

document.querySelector('.header__basket')?.addEventListener('click', () => {
  events.emit('cart:open', undefined);
});

events.on('cart:open', () => {
  const template = document.querySelector<HTMLTemplateElement>('#basket')!;
  const content = template.content.cloneNode(true) as HTMLElement;
  const basketRoot = content.querySelector('.basket') as HTMLElement;

  cartView = new Cart(basketRoot, events);
  cartView.render(cart.getAll(), cart.getTotal());

  updateCheckoutButton();

  const checkoutButton = content.querySelector('.basket__button') as HTMLButtonElement;
  checkoutButton.addEventListener('click', () => {
    const orderContent = orderStep.render();
    modal.open(orderContent);
  });

  modal.open(content);
});

events.on('order:submit', ({ email, phone, address, payment }) => {
  orderModel.set('email', email);
  orderModel.set('phone', phone);
  orderModel.set('address', address);
  orderModel.set('payment', payment as PaymentType);

  const order = orderModel.getData();
  if (!order) {
    alert('❌ Заполните все поля');
    return;
  }

  const allItems = cart.getAll();
  if (allItems.length === 0) {
    alert('❌ Корзина пуста');
    return;
  }

  // Отправляем ТОЛЬКО товары с ценой
  const items = allItems.filter(p => p.price !== null).map(p => p.id);
  const total = allItems.reduce((sum, p) => sum + (p.price ?? 0), 0);

  if (items.length === 0) {
    alert('❌ В заказе нет товаров с ценой. Такие заказы не поддерживаются.');
    return;
  }

  const payload: OrderForm = {
    ...order,
    items,
    total
  };

  orderApi.postOrder(payload)
    .then(() => events.emit('order:success', undefined))
    .catch(() => alert('❌ Ошибка при отправке заказа. Попробуйте позже.'));
});

events.on('order:success', () => {
  const total = cart.getTotal();
  const content = successScreen.render(total);
  modal.open(content);
  cart.clear();
  updateCounter();
  updateCheckoutButton();
  orderModel.clear();
});

function updateCounter() {
  catalog.setCounter(cart.getAll().length);
}

function updateCheckoutButton() {
  cartView?.setCheckoutEnabled(cart.getAll().length > 0);
}

updateCheckoutButton();

events.on('checkout:step1:complete', ({ address, payment }) => {
  orderModel.set('address', address);
  orderModel.set('payment', payment as PaymentType);

  const contactsContent = contactsStep.render({ address, payment });
  modal.open(contactsContent);
});

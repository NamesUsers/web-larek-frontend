// index.ts — исправлено: устранены document.querySelector вне представлений
import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { API_URL } from './utils/constants';

import { ProductAPI } from './api/ProductAPI';
import { OrderAPI } from './api/OrderAPI';
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

// Переносим поиск DOM-элементов в отдельные представления
const catalogRoot = document.querySelector('.gallery') as HTMLElement;
const headerBasket = document.querySelector('.header__basket') as HTMLElement;
const basketTemplate = document.querySelector<HTMLTemplateElement>('#basket')!;

const catalog = new Catalog(catalogRoot);
const modal = new Modal();
const productModal = new ProductModal(events);
const orderStep = new Order(document.body, events);
const contactsStep = new Contacts(document.body, events);
const successScreen = new Success(events);
const cartView = new Cart(events);

const appPresenter = new AppPresenter(
  orderModel,
  orderStep,
  contactsStep,
  cartView,
  catalog,
  orderApi,
  events,
  [],
  0
);

productApi.getAll()
  .then((products) => {
    model.setItems(products);
    appPresenter.renderCatalog(products);
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
    appPresenter.renderCart(cart.getAll());
    updateCounter();
    updateCheckoutButton();
  }
});

events.on('cart:remove', ({ productId }) => {
  cart.remove(productId);
  appPresenter.renderCart(cart.getAll());
  updateCounter();
  updateCheckoutButton();
});

headerBasket?.addEventListener('click', () => {
  events.emit('cart:open', undefined);
});

events.on('cart:open', () => {
  const content = basketTemplate.content.cloneNode(true) as HTMLElement;
  const basketElement = content.querySelector('.basket') as HTMLElement;

  cartView.setRoot(basketElement);
  appPresenter.renderCart(cart.getAll());

  const checkoutButton = content.querySelector('.basket__button') as HTMLButtonElement;
  checkoutButton.addEventListener('click', () => {
    const orderContent = orderStep.render();
    modal.open(orderContent);
  });

  updateCheckoutButton();
  modal.open(content);
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
  cartView.setCheckoutEnabled(cart.getAll().length > 0);
}

updateCheckoutButton();

events.on('checkout:step1:complete', ({ address, payment }) => {
  orderModel.set('address', address);
  orderModel.set('payment', payment);
  const contactsContent = contactsStep.render();
  modal.open(contactsContent);
});

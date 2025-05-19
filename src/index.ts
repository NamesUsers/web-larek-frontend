import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';

import { ProductModel } from './models/ProductModel';
import { ProductCard } from './components/ProductCard';

import { Product, IEvents } from './types';

const api = new Api(process.env.API_ORIGIN as string);
const events = new EventEmitter() as IEvents;

const model = new ProductModel(api);
const productCard = new ProductCard(events);

const app = document.querySelector('#app') || document.body;

model.load().then(() => {
	const product: Product = model.getAll()[0];
	const card = productCard.render(product);
	app.append(card);
});

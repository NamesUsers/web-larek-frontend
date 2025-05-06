import './scss/styles.scss';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';

// Используем переменную окружения из .env
const api = new Api(process.env.API_ORIGIN as string, {});
const events = new EventEmitter();

console.log('App started');
console.log(api, events);

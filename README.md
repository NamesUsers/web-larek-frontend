# Проектная работа: Web-ларёк

## Стек технологий

- TypeScript
- SCSS
- HTML
- Webpack

---

## Установка и запуск

### Установка зависимостей

```bash
npm install
```

### Запуск проекта

```bash
npm run start
```

### Сборка проекта

```bash
npm run build
```

---

## Архитектура проекта

Проект реализован с использованием событийной архитектуры и разделением на слои: данные (модели), представления (UI-компоненты), управление событиями (EventEmitter).

### Структура проекта

- `src/index.ts` — точка входа, инициализация приложения
- `src/types/` — интерфейсы и типы данных
- `src/components/` — UI-компоненты (модальные окна, карточки, представления)
- `src/components/base/` — базовые классы (`Api`, `EventEmitter`)
- `src/utils/` — утилиты и константы

---

## Модели данных

### Product

```ts
interface Product {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
}
```

---

### Order

```ts
interface Order {
  address: string;
  email: string;
  phone: string;
  payment: PaymentType;
  items: string[];
  total: number;
}
```

---

### Cart

```ts
interface ICart {
  items: string[];
  add(id: string): void;
  remove(id: string): void;
  clear(): void;
  getTotal(products: Product[]): number;
}
```

---

### OrderModel

```ts
interface IOrderModel {
  setAddress(value: string): void;
  setEmail(value: string): void;
  setPhone(value: string): void;
  setPayment(value: PaymentType): void;

  isValid: boolean;
  errors: Partial<Record<keyof Omit<Order, 'items' | 'total'>, string>>;

  getOrder(total: number, items: string[]): Order;
}
```

---

## Представления (View-компоненты)

### MainPage / Header

Главная страница отображает каталог товаров.  
Также содержит кнопку открытия корзины и счётчик добавленных товаров.  
По нажатию отправляется событие `cart:open`.

---

### ProductCard

Карточка товара в каталоге: изображение, название, цена. Открывает модалку.

---

### ProductModal

Модальное окно товара: описание, цена, кнопки "Купить" и "Убрать".

---

### CartItem

Карточка товара в корзине: название, цена, кнопка удаления.

---

### CartView

Отображает список товаров, общую сумму и кнопку "Оформить заказ".

---

### Modal

Базовое модальное окно. Поддерживает любой вложенный контент. Закрывается по фону и кнопке.

---

### Order

Форма ввода адреса и выбора способа оплаты.

---

### Contacts

Форма ввода e-mail и телефона.

---

### Success

Экран с сообщением об успешной оплате.

---

## Описание классов

### class `ProductCard`
- **Назначение**: отображение товара в каталоге
- **Конструктор**: `constructor(container: HTMLElement)`
- **Методы**:
  - `render(product: Product): HTMLElement`

---

### class `ProductModal`
- **Назначение**: управление модальными окнами
- **Конструктор**: `constructor(container: HTMLElement, events: IEvents)`
- **Поля**:
  - `container: HTMLElement`
  - `events: IEvents`
- **Методы**:
  - `open(content: HTMLElement): void`
  - `close(): void`

---

### class `Cart`
- **Назначение**: управление товарами в корзине
- **Поля**:
  - `items: string[]`
- **Методы**:
  - `add(id: string): void`
  - `remove(id: string): void`
  - `clear(): void`
  - `getTotal(products: Product[]): number`

---

### class `OrderModel`
- **Назначение**: хранение, валидация и генерация данных заказа
- **Методы**:
  - `setAddress(value: string): void`
  - `setEmail(value: string): void`
  - `setPhone(value: string): void`
  - `setPayment(value: PaymentType): void`
  - `getOrder(total: number, items: string[]): Order`
- **Поля**:
  - `isValid: boolean`
  - `errors: Partial<...>`

---

### class `CartView`
- **Назначение**: отображение корзины
- **Методы**:
  - `render(cart: ICart, products: Product[]): HTMLElement`

---

### class `Header`
- **Назначение**: отображение кнопки корзины и счётчика товаров
- **Методы**:
  - `setCount(count: number): void` — обновляет счётчик
  - `bindCartOpen(handler: () => void): void` — установка обработчика на кнопку

---

### class `Order` и `Contacts`
- **Назначение**: отображение шагов оформления
- **Конструктор**: `constructor(container: HTMLElement, events: IEvents)`
- **Методы**:
  - `render(): void`
  - `validate(): boolean`

> ❗️Валидация делегирована `OrderModel`. Компоненты только отображают поля и ошибки.

---


---

### class `Catalog`
- **Назначение**: отображение списка товаров
- **Методы**:
  - `render(products: Product[]): void`

---

### class `ProductAPI`
- **Назначение**: получение товаров с сервера
- **Методы**:
  - `getAll(): Promise<Product[]>`

---

### class `ProductModel`
- **Назначение**: хранение списка товаров
- **Методы**:
  - `setItems(items: Product[]): void`
  - `getById(id: string): Product | undefined`

---

### class `AppStateModel`
- **Назначение**: глобальное состояние приложения (опционально)

## Подход к отрисовке списков

В проекте реализован внешний рендеринг карточек:
- карточки создаются вне `CartView` и `CatalogView`,
- готовые DOM-элементы передаются как список,
- это снижает связанность и улучшает масштабируемость.

Допустим и альтернативный способ: передача конструктора карточки через интерфейс.

---



---

## 📁 Тестовые данные API

Для загрузки используется API с фиктивными товарами, структура:

```json
{
  "id": "string",
  "title": "string",
  "price": number | null,
  "category": "digital" | "physical",
  "description": "string",
  "image": "string"
}
```

**Пример товара с бесценной ценой:**

```json
{
  "id": "priceless001",
  "title": "Меч истины",
  "price": null,
  "category": "digital",
  "description": "Редкий артефакт",
  "image": "/images/sword.png"
}
```

---

## 💡 Обработка "бесценно" (price === null)

В файле `ProductCard.ts` реализовано условие:

```ts
<p class="product-card__price">
  ${product.price === null ? 'Бесценно' : product.price + ' синапсов'}
</p>
```

Если `price === null`, на карточке товара отображается слово **«Бесценно»**, и он по-прежнему доступен для добавления в корзину и оформления.

---


---

## 📡 События приложения (`EventEmitter`)

Вся логика взаимодействия компонентов построена на событийной архитектуре через `EventEmitter`.

| Событие                   | Назначение                         |
|---------------------------|------------------------------------|
| `modal:open`              | Открытие модального окна товара    |
| `modal:close`             | Закрытие модального окна           |
| `product:add`             | Добавление товара в корзину        |
| `product:remove`          | Удаление товара из корзины         |
| `cart:open`               | Открытие окна корзины              |
| `cart:clear`              | Очистка корзины                    |
| `checkout:step1:complete` | Завершение первого шага заказа     |
| `checkout:submit`         | Подтверждение и отправка заказа    |
| `order:success`           | Успешная оплата и завершение заказа|

### 🔧 Примеры использования:

```ts
// Открыть модалку с товаром
events.emit('modal:open', { productId: '123' });

// Завершить шаг 1 — адрес и оплата
events.emit('checkout:step1:complete');

// Отправка всех данных заказа
events.emit('checkout:submit', {
  address: 'Москва, ул. Пушкина',
  payment: 'card'
});

// Завершение успешного оформления
events.emit('order:success', {
  email: 'user@example.com',
  phone: '+79999999999'
});
```

### 📥 Подписка на события:

```ts
events.on('cart:open', () => {
  showModal();
  cartView.render(...);
});
```

---


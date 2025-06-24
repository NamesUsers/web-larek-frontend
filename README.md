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

Проект реализован с использованием событийной архитектуры и строгим разделением на слои:

- данные (модели)
- представления (View-компоненты)
- управление событиями (`EventEmitter`)
- бизнес-логика (`AppPresenter`)

---

## Структура проекта

- `src/index.ts` — точка входа, инициализация приложения
- `src/types/` — типы и интерфейсы (`Product`, `Order`, `Events`)
- `src/components/` — UI-компоненты (модалки, карточки, формы и т.д.)
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
  category: string;
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

## Представления (View-компоненты)

### `ProductCard`

Карточка товара в каталоге. Использует `<template id="card-catalog">`. Содержит изображение, название, категорию и цену.

---

### `ProductModal`

Модалка с подробным описанием товара. Кнопки "Купить" / "Убрать из корзины".

---

### `Cart`

Список товаров в корзине:
- отображение списка товаров
- итоговая сумма
- кнопка "Оформить"
- метод `setRoot()` для установки контейнера

```ts
setRoot(root: HTMLElement): void;
render(items: HTMLElement[], total: number): void;
setCheckoutEnabled(enabled: boolean): void;
```

---

### `CartItemView`

Элемент в корзине. Генерируется через шаблон `<template id="card-basket">`. Устанавливает `data-id` и `data-price` для каждого товара.

---

### `Modal`

Универсальный компонент модального окна. Поддерживает любые вложенные шаблоны (карточка, корзина, заказ, успех и т.д.)

---

### `Order`

Форма ввода адреса доставки и выбора способа оплаты.  
Методы:

```ts
render(): HTMLElement;
setValidState(isValid: boolean, error?: string): void;
```

---

### `Contacts`

Форма для e-mail и телефона.  
Методы:

```ts
render(): HTMLElement;
setValidState(
  emailValid: boolean,
  phoneValid: boolean,
  errors: { email: string; phone: string }
): void;
```

---

### `Success`

Модальное окно с сообщением об успешной оплате.

---

### `Catalog`

Список карточек товаров.  
Методы:

```ts
render(cards: HTMLElement[]): void;
setCounter(count: number): void;
```

---

## Классы и логика

### `AppPresenter`

Основной управляющий слой. Подписывается на события от представлений, обновляет модель и валидирует данные:

- обрабатывает `order:change` и `contacts:change`
- вызывает `OrderModel.set()` и `validateBasic()` / `validateContacts()`
- отправляет заказ через `OrderAPI`
- хранит состояние корзины (`cartItems` и `totalPrice`)

```ts
renderCart(items: Product[]): void;
renderCatalog(products: Product[]): void;
```

❗ Корзина **не хранится в отдельной модели**, но передаётся презентеру и сохраняется в полях.

---

### `OrderModel`

Централизованная модель заказа. Хранит и валидирует все данные.

```ts
set<K extends keyof OrderData>(key: K, value: Partial<OrderData>[K]): void;
validateBasic(): { isValid: boolean; error?: string };
validateContacts(): {
  emailValid: boolean;
  phoneValid: boolean;
  emailError: string;
  phoneError: string;
};
getData(): OrderData | null;
clear(): void;
```

---

### `ProductModel`

Хранит все полученные с сервера товары.  
Методы:

```ts
setItems(products: Product[]): void;
getAll(): Product[];
getById(id: string): Product | undefined;
```

---

### `CartModel`

Простая модель-контейнер, хранящая товары, добавленные в корзину:

```ts
add(product: Product): void;
remove(productId: string): void;
getAll(): Product[];
clear(): void;
getTotal(): number;
```

---

### `Api`

Базовый HTTP-клиент:

```ts
get<T>(url: string): Promise<T>;
post<T>(url: string, data: unknown): Promise<T>;
```

---

### `OrderAPI`

Вызывает `postOrder(order: Order): Promise<unknown>`, отправляя заказ на сервер.

---

## События `EventEmitter`

Компоненты взаимодействуют исключительно через события (слабое связывание).

| Событие                   | Назначение                         |
|---------------------------|------------------------------------|
| `modal:open`              | Открытие модалки с товаром         |
| `modal:close`             | Закрытие модального окна           |
| `cart:add`                | Добавление товара в корзину        |
| `cart:remove`             | Удаление из корзины                |
| `cart:open`               | Открытие корзины                   |
| `checkout:step1:complete` | Завершение ввода адреса и оплаты   |
| `order:change`            | Событие от формы `Order`           |
| `contacts:change`         | Событие от формы `Contacts`        |
| `order:submit`            | Финальное подтверждение заказа     |
| `order:success`           | Успешная оплата и завершение       |

---

## Обработка "Бесценно"

Если у товара `price === null`, карточка и корзина отобразят надпись:

```ts
product.price === null ? 'Бесценно' : `${product.price} синапсов`;
```

---

## Пример ответа от API

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


## Примечания

- `Header` не вынесен в отдельный компонент — логика открытия корзины реализована в `index.ts`.
- Корзина отображается на основе данных из `CartModel`, но её визуальное представление управляется через `AppPresenter` и `Cart`.

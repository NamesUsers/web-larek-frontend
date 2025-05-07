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
- `src/components/` — UI-компоненты (модальные окна, карточки и т.д.)
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
  price: number;
  image: string;
}
```

Модель товара, получаемого с сервера.

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

Модель заказа, включающая адрес, контакты, список id товаров и сумму.

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

Модель корзины. Хранит список товаров и рассчитывает итог.

---

## Представления (View-компоненты)

### MainPage  
Главная страница — отображает список товаров в виде карточек.

### ProductCard  
Карточка товара в каталоге. Отображает изображение, название, цену. При клике — открывает модалку.

### ProductModal  
Карточка товара в модальном окне. Отображает полное описание, кнопку "Купить"/"Убрать".

### CartItem  
Товар в корзине. Краткое описание и кнопка "Удалить".

### CartView  
Компонент отображения корзины. Показывает список товаров, общую сумму, кнопку «Оформить заказ».

### Modal  
Базовое модальное окно. Универсальный контейнер, отображающий любой контент. Закрывается по фону или крестику.

### CheckoutStep1  
Первый шаг оформления заказа: ввод адреса и выбор способа оплаты.

### CheckoutStep2  
Второй шаг оформления: ввод e-mail и телефона.

### SuccessView  
Экран успешного оформления заказа.

---

## Описание классов

### class `ProductCard`
- **Назначение**: отображение товара в каталоге
- **Конструктор**: `constructor(container: HTMLElement)`
- **Методы**:
  - `render(product: Product): HTMLElement`

---

### class `Modal`
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

### class `CartView`
- **Назначение**: отображение корзины
- **Методы**:
  - `render(cart: ICart, products: Product[]): HTMLElement`

---

### class `CheckoutStep1` и `CheckoutStep2`
- **Назначение**: отображение шагов оформления
- **Конструктор**: `constructor(container: HTMLElement, events: IEvents)`
- **Методы**:
  - `render(): HTMLElement`
  - `validate(): boolean`

---

## События (EventEmitter)

Проект использует событийную архитектуру. Список событий:

- `modal:open` — открыть модальное окно
- `modal:close` — закрыть модальное окно
- `product:add` — добавить товар в корзину
- `product:remove` — убрать товар из корзины
- `cart:open` — открыть корзину
- `cart:clear` — очистить корзину
- `checkout:step1:complete` — завершён шаг 1
- `checkout:submit` — отправка заказа
- `order:success` — заказ оформлен успешно

---

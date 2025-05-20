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

### CheckoutStep1

Форма ввода адреса и выбора способа оплаты.

---

### CheckoutStep2

Форма ввода e-mail и телефона.

---

### SuccessView

Экран с сообщением об успешной оплате.

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

### class `CheckoutStep1` и `CheckoutStep2`
- **Назначение**: отображение шагов оформления
- **Конструктор**: `constructor(container: HTMLElement, events: IEvents)`
- **Методы**:
  - `render(): HTMLElement`
  - `validate(): boolean`

> ❗️Валидация делегирована `OrderModel`. Компоненты только отображают поля и ошибки.

---

## Подход к отрисовке списков

В проекте реализован внешний рендеринг карточек:
- карточки создаются вне `CartView` и `CatalogView`,
- готовые DOM-элементы передаются как список,
- это снижает связанность и улучшает масштабируемость.

Допустим и альтернативный способ: передача конструктора карточки через интерфейс.

---

## События (EventEmitter)

- `modal:open` — открыть модалку  
- `modal:close` — закрыть модалку  
- `product:add` — добавить товар в корзину  
- `product:remove` — удалить из корзины  
- `cart:open` — открыть корзину  
- `cart:clear` — очистить корзину  
- `checkout:step1:complete` — завершить шаг 1  
- `checkout:submit` — отправить заказ  
- `order:success` — успешное оформление  

---

---

## Основной функционал

- Загрузка и отображение каталога товаров
- Открытие модального окна с подробной информацией о товаре
- Добавление и удаление товаров из корзины
- Подсчёт общей суммы заказа
- Пошаговое оформление заказа через `OrderForm` (адрес → контакты)
- Валидация данных на каждом шаге
- Очистка корзины после успешной оплаты
- Обработка ошибок при незаполненных полях
- Закрытие модальных окон по крестику и клику вне окна
- Кнопка перехода к следующему шагу активируется только при валидных данных
- Счётчик товаров в корзине отображается в шапке

---

## View-компоненты

- **ProductCard** — карточка товара
- **ProductModal** — модальное окно с подробностями товара
- **CartView** — отображение корзины
- **HeaderComponent** — иконка корзины и счётчик
- **OrderForm** — форма оформления заказа (оба шага)
- **Success** — финальный экран после заказа

---

## Описание классов

### class `ProductCard`
- Отображение карточки товара
- Навешивает обработчик на клик

### class `CartModel`
- Хранит id товаров
- Методы: `add`, `remove`, `clear`, `getTotal`

### class `OrderModel`
- Хранит состояние формы
- Проводит валидацию
- Генерирует итоговый `Order`

### class `CartView`
- Рендерит список товаров
- Показывает итоговую сумму и кнопку оформления

### class `ProductModal`
- Открывает и закрывает подробности товара

### class `HeaderComponent`
- Отображает количество товаров и кнопку открытия корзины

### class `OrderForm`
- Объединяет оба шага оформления заказа
- Обрабатывает адрес, способ оплаты, email и телефон

### class `Success`
- Отображает сообщение об успешной покупке

---

## События (EventEmitter)

| Событие                   | Назначение                         |
|---------------------------|------------------------------------|
| `modal:open`              | Открытие модального окна товара    |
| `modal:close`             | Закрытие любого модального окна    |
| `product:add`             | Добавление товара в корзину        |
| `product:remove`          | Удаление товара из корзины         |
| `cart:open`               | Открытие окна корзины              |
| `cart:clear`              | Очистка корзины                    |
| `checkout:step1:complete` | Завершение первого шага заказа     |
| `checkout:submit`         | Подтверждение и отправка заказа    |
| `order:success`           | Успешная оплата и завершение заказа|


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

Проект реализован с использованием событийной архитектуры и разделением на слои: данные (модели), представления (UI-компоненты), управление событиями (EventEmitter), и презентер.

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

## Представления (View-компоненты)

### ProductCard

Карточка товара в каталоге: изображение, название, цена. Открывает модалку.

---

### ProductModal

Модальное окно товара: описание, цена, кнопки "Купить" и "Убрать".

---

### Cart

Компонент отображения корзины и управления товарами:
- список товаров
- отображение общей суммы
- кнопка "Оформить заказ"

---

### CartItem

Карточка товара в корзине: название, цена, кнопка удаления.

---

### Modal

Универсальное модальное окно. Реализовано как отдельный компонент. Поддерживает любой вложенный контент (товар, корзина, заказ, успех и т.д.). Закрывается по фону и кнопке.

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

### Header

Логика отображения и открытия корзины реализована в `index.ts`. Отдельного компонента `Header` нет, но поведение включено в структуру.

---

## Классы и логика

### class `ProductCard`

- Отображение товара в каталоге
- `render(product: Product): HTMLElement`

---

### class `ProductModal`

- Отображение модального окна с товаром
- `render(product, inCart): HTMLElement`

---

### class `Cart`

- Управление отображением корзины
- `render(items: Product[], total: number): void`
- `setCheckoutEnabled(enabled: boolean): void`

---

### class `OrderModel`

- Хранение и валидация данных заказа
- `set(field: keyof OrderData, value: string): void`
- `validateBasic(): { isValid: boolean, error?: string }`
- `getData(): Order | null`

---

### class `Contacts`

- Отображение полей email и телефона
- `render({ address, payment }): HTMLElement`
- `setValidState(emailValid, phoneValid, errors): void`

---

### class `Order`

- Отображение адреса и выбора оплаты
- `render(): HTMLElement`
- `setValidState(isValid: boolean, error?: string): void`

---

### class `Catalog`

- `render(products: Product[]): void`
- `setCounter(count: number): void`

---

### class `ProductModel`

- `setItems(products: Product[]): void`
- `getById(id: string): Product | undefined`
- `getAll(): Product[]`

---

### class `AppPresenter`

- Обрабатывает `order:change` и `contacts:change`
- Валидирует модель заказа и обновляет представления

---

### class `Api`

- Базовый HTTP-клиент
- `get(url): Promise<T>`
- `post(url, data): Promise<T>`

---

### class `OrderAPI`

- `postOrder(order: OrderForm): Promise<unknown>`

---

## Обработка "бесценно"

Если у товара `price === null`, он отображается как **"Бесценно"**:

```ts
<p class="product-card__price">
  ${product.price === null ? 'Бесценно' : product.price + ' синапсов'}
</p>
```

---

## Событийная архитектура (`EventEmitter`)

Компоненты взаимодействуют между собой через события.

| Событие                   | Назначение                         |
|---------------------------|------------------------------------|
| `modal:open`              | Открытие модального окна товара    |
| `modal:close`             | Закрытие модального окна           |
| `cart:add`                | Добавление товара в корзину        |
| `cart:remove`             | Удаление товара из корзины         |
| `cart:open`               | Открытие окна корзины              |
| `checkout:step1:complete` | Завершение первого шага заказа     |
| `order:submit`            | Подтверждение и отправка заказа    |
| `order:success`           | Успешная оплата и завершение заказа|
| `order:change`            | Событие при изменении формы заказа |
| `contacts:change`         | Событие при изменении формы контактов |

---

## API — Пример товара

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



---

### 📐 Архитектурные принципы

- ✅ Вся разметка расположена в представлениях и управляется ими — без стороннего обращения к DOM.
- ✅ Валидация и хранение данных выполняются исключительно в `OrderModel`, представления вызывают только `setValidState()`.
- ✅ Представления не содержат данных и не хранят состояние.
- ✅ Все взаимодействия между слоями реализованы через `EventEmitter`, без прямых импортов между компонентами.
- ✅ Для модальных окон используется единый компонент `Modal`.
- ✅ Заказ отправляется на сервер через `OrderAPI` по нажатию кнопки "Оформить".

---

### Дополнение по AppPresenter

Класс `AppPresenter` реализует слой управления между представлениями (`Order`, `Contacts`) и моделью (`OrderModel`). Он подписывается на события `order:change`, `contacts:change` и выполняет:

- обновление модели по каждому изменению формы;
- валидацию полей и отображение ошибок;
- подготовку модели к отправке данных заказа.

---

### Уточнение по Header

Отдельного компонента `Header` нет. Кнопка корзины (`.header__basket`) и счётчик реализованы напрямую в `index.ts`, где и происходит подписка на события и рендер счётчика.


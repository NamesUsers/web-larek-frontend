## Архитектура проекта

### Используемый стек
- TypeScript
- SCSS
- HTML
- Webpack
- MV-подход (Model-View + EventEmitter как управляющий слой)

### Принципы проектирования
- **Изоляция**: каждый модуль решает отдельную задачу и может использоваться независимо.
- **Единая ответственность**: каждый класс или компонент выполняет одну функцию.
- **Масштабируемость**: проект легко дополняется новыми фичами без переписывания существующего кода.

---

### Структура проекта

- `src/index.ts` — точка входа, инициализация приложения.
- `src/components/base/api.ts` — API для получения данных с сервера.
- `src/components/base/events.ts` — брокер событий (EventEmitter).
- `src/types/index.ts` — типы данных (товар, заказ, пользователь).
- `src/pages/index.html` — HTML разметка.
- `src/scss/styles.scss` — основной файл стилей.
- `src/utils/constants.ts` — список статичных данных (например, способы оплаты).
- `src/components/` — (планируются) визуальные компоненты.

---

### Классы

#### Api (src/components/base/api.ts)
Класс для работы с сервером.
- Методы: `get`, `post`, `put`, `delete`
- Обрабатывает ошибки
- Добавляет заголовки

#### EventEmitter (src/components/base/events.ts)
Класс для подписки и генерации событий.
- `on(event, callback)` — слушатель
- `emit(event, data)` — вызов события
- `trigger(event)` — отложенный вызов

---

### Типы данных (src/types/index.ts)

```ts
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface Order {
  address: string;
  email: string;
  phone: string;
  payment: string;
  items: string[]; // id товаров
}

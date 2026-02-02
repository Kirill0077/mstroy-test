# mstroy-test

Тестовый проект на Vue 3 + Vite: приложение «Хранилище дерева» — иерархическая таблица на базе AG Grid и собственной модели дерева.

## Стек

- **Vue 3** (Composition API, `<script setup>`)
- **TypeScript**
- **Vite 7**
- **AG Grid** (Community + Enterprise Row Grouping) — таблица с древовидными данными
- **Vitest** + **@vue/test-utils** — юнит-тесты
- **ESLint**, **Oxlint**, **Prettier** — линтинг и форматирование

## Требования

- **Node.js** `^20.19.0` или `>=22.12.0`
- **pnpm** (рекомендуется)

## Установка и запуск

```bash
pnpm install
pnpm dev
```

Приложение откроется по адресу из вывода Vite (обычно `http://localhost:5173`).

## Скрипты

| Команда           | Описание                               |
| ----------------- | -------------------------------------- |
| `pnpm dev`        | Запуск dev-сервера с hot-reload        |
| `pnpm build`      | Проверка типов и сборка для production |
| `pnpm preview`    | Просмотр production-сборки             |
| `pnpm test:unit`  | Запуск юнит-тестов (Vitest)            |
| `pnpm type-check` | Проверка типов (vue-tsc)               |
| `pnpm lint`       | Линтинг (oxlint + eslint)              |
| `pnpm format`     | Форматирование кода (Prettier)         |

## Структура проекта

```
src/
├── App.vue                    # Корневой компонент: заголовок и TreeStoreGrid
├── main.ts
├── __tests__/                 # Юнит-тесты
│   ├── app.spec.ts
│   ├── tree-store.spec.ts     # Тесты модели TreeStore
│   └── tree-store-grid.spec.ts # Тесты компонента TreeStoreGrid
└── modules/
    └── tree-store-grid/      # Модуль «дерево + таблица»
        ├── api/               # API и тестовые данные
        ├── composables/       # useTreeStore — связка TreeStore и AG Grid
        ├── model/             # TreeStore, типы (TreeItemBase, TreeItemId)
        ├── ui/                # Компонент TreeStoreGrid.vue
        └── index.ts           # Публичный API модуля
```

## Модуль tree-store-grid

### Модель (TreeStore)

Класс `TreeStore<T>` — хранилище элементов дерева с индексами по `id` и по родителю. Поддерживает:

- **Чтение:** `getAll()`, `getItem(id)`, `getChildren(id)`, `getAllChildren(id)`, `getAllParents(id)`
- **Изменение:** `addItem(item)`, `removeItem(id)`, `updateItem(item)`

Элементы реализуют интерфейс `TreeItemBase`: обязательные `id` и опциональный `parent`, остальные поля — произвольные (например, `label`).

### UI (TreeStoreGrid)

Компонент принимает проп `treeItems: TreeItemBase[]` и отображает их в AG Grid в виде дерева (тема Quartz, группировка по иерархии). Использует composable `useTreeStore` для построения `gridOptions` и модулей грида.

### API

- `getTestData()` — асинхронная загрузка тестовых данных для демо (задержка ~1 с).

## Тестирование

Тесты находятся в `src/__tests__/`:

- **tree-store.spec.ts** — 22 теста для `TreeStore`: конструктор, getters, add/remove/update, граничные случаи.
- **tree-store-grid.spec.ts** — 5 тестов для `TreeStoreGrid.vue`: монтирование, props, рендер AgGridVue, передача `gridOptions` и `modules`.
- **app.spec.ts** — базовый тест корневого компонента.

Запуск один раз:

```bash
pnpm test:unit --run
```

Режим watch (по умолчанию без `--run`):

```bash
pnpm test:unit
```

## Настройка IDE и браузера

- **VS Code:** рекомендуется [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Volar), Vetur отключить.
- **TypeScript:** для типов в `.vue` используется `vue-tsc`; в редакторе нужен Volar.
- **Браузер:** для отладки Vue удобно использовать [Vue.js devtools](https://devtools.vuejs.org/).

## Конфигурация

- Сборка и тесты: `vite.config.ts`, `vitest.config.ts`
- TypeScript: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.vitest.json`
- Линтинг: `eslint.config.ts`, `.oxlintrc.json`
- Форматирование: `.prettierrc.json`

Коммиты в проекте оформляются в формате [Conventional Commits](https://www.conventionalcommits.org/) на русском языке.

# Portfolio | Amir Ergashev

Портфолио переведено с Vite/React Router на Next.js App Router и Feature-Sliced Design (FSD) по [ROADMAP.md](ROADMAP.md). Архитектурная миграция полностью завершена (этапы 0–5): интерфейс, стили, шрифты, светлая и тёмная темы, локализация (next-intl для `en`, `ru`, `uz`) и серверное получение данных проектов перенесены с сохранением 100% визуального и функционального соответствия исходной версии.

Предыдущая рабочая версия для отката: [amp3re.netlify.app](https://amp3re.netlify.app/).

## Запуск

Требуются Node.js **24.15.0** (или совместимая 24.x) и pnpm **10.33.3**.

```bash
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Приложение доступно на http://localhost:3000.

## Проверки и сборка

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:architecture
pnpm test:messages
pnpm test:projects
pnpm build
pnpm start
```

- `build` и `start` используют серверный runtime Next.js; статический экспорт намеренно не используется, обеспечивая серверный доступ к данным проектов и динамическую обработку маршрутов.
- `pnpm test` (или `pnpm test:unit`) запускает модульные и компонентные тесты в среде jsdom на базе Vitest.
- `pnpm test:watch` запускает Vitest в интерактивном режиме разработки.
- `pnpm test:architecture` проверяет соблюдение правил зависимостей FSD и изоляцию серверных модулей.
- `pnpm test:messages` валидирует синтаксис ICU и ключи переводов `en`, `ru`, `uz`.
- `pnpm test:projects` проверяет целостность и типизацию серверной модели данных и серверного API.

## Структура

- `app/` — адаптеры маршрутов Next.js App Router (`layout.tsx`, `not-found.tsx`, `error.tsx`, `loading.tsx`).
- `proxy.ts` — подключение middleware маршрутизации и локализации `next-intl`.
- `messages/` — словари переводов ICU (`en.json`, `ru.json`, `uz.json`).
- `src/_app/` — провайдеры темы, корневой layout, i18n request handler и метаданные.
- `src/_pages/` — композиция страниц (`home`, `project`, `not-found`).
- `src/widgets/` — самостоятельные блоки страниц (`header`, `hero`, `services`, `projects`, `contact`, `footer`).
- `src/features/` — интерактивные пользовательские сценарии (`switch-language`, `switch-theme`).
- `src/entities/project/` — сущность проекта: типы, исходные данные, изолированный серверный API (`index.server.ts`) и клиентские UI-компоненты.
- `src/shared/` — переиспользуемые модули: UI-элементы, SCSS Modules и глобальные токены, шрифты, ассеты, адаптеры навигации i18n и тема.
- `public/` — публичные статические файлы: favicon, webmanifest, OG-изображение.
- `tests/` — архитектурные, модульные и компонентные тесты на Vitest.
- `docs/migration/` — спецификация эталона, журнал проверок и отчеты миграции.

## Модульное тестирование (Vitest)

Вместо ресурсоёмких и нестабильных E2E-тестов браузеров проект использует быстрый набор модульных и компонентных тестов на базе **Vitest** и **Testing Library**:

```bash
pnpm test          # разовый прогон всех тестов
pnpm test:watch    # watch-режим для разработки
```

Набор тестов покрывает:
- Управление темой (`ThemeProvider`, `useTheme`, `ThemeScript`, `ThemeSwitch`, обработка исключений `localStorage`);
- Интернационализацию (`LanguageSwitch`, конфигурацию `routing`, строгую валидацию синтаксиса ICU);
- Серверную изоляцию данных и валидацию моделей проектов (`getProjects`, `getProject`, Zod-схемы);
- UI-компоненты (`BackButton`, `Badge`, `Loader`, `BenefitCard`, `ProjectCard`);
- Секции и страницы (`Header`, `Hero`, `Services`, `Projects`, `Contact`, `Footer`, `NotFoundPage`, `ErrorPage`);
- Архитектурные границы Feature-Sliced Design (FSD).

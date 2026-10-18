# Portfolio | Amir Ergashev

Портфолио мигрирует с Vite/React Router на Next.js App Router и Feature-Sliced Design по [ROADMAP.md](ROADMAP.md). Сейчас подготовлен каркас с временными страницами `/`, `/project/weather`, `/project/store` и 404. Перенос существующего интерфейса, темы и переводов выполняется на этапах 2–3.

Предыдущая рабочая версия: [amp3re.netlify.app](https://amp3re.netlify.app/).

## Запуск

Требуются Node.js **24.15.0** и pnpm **10.33.3**.

```bash
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Приложение доступно на http://localhost:3000.

```bash
pnpm lint
pnpm typecheck
pnpm test:architecture
pnpm build
pnpm start
```

`build` и `start` используют серверный runtime Next.js; статический экспорт не включён. `next-intl` установлен для этапа 3, локализованные URL и провайдер ещё не подключены.

## Структура

- `app/` — тонкие адаптеры маршрутов Next.js и специальные файлы.
- `src/_app/` — корневой layout и метаданные приложения.
- `src/_pages/` — композиция главной, проекта и 404.
- `src/entities/project/` — идентификаторы проектов и публичный API.
- `public/` — исходные favicon, manifest, OG-изображение и переводы.
- `tests/` — архитектурные, браузерные и визуальные проверки.
- `docs/migration/` — условия съёмки, результаты и инструкции сравнения.

Остальные слои FSD создаются по мере переноса кода. Старые `src/Pages`, `src/components`, `src/Routes`, `src/context`, `src/hooks`, `src/data`, `src/assets`, `src/styles`, `src/App.tsx`, `src/main.tsx`, `src/i18n.ts` и `index.html` сохранены как исходный материал. Они не входят в активный граф Next.js и временно исключены из новых проверок; новый код не может импортировать их.

## Проверки в браузерах

```bash
pnpm exec playwright install --with-deps chromium firefox webkit
pnpm build
pnpm test:smoke
```

Установка системных библиотек Playwright на Linux может потребовать sudo. Smoke-проверки выполняются на production server в Chromium, Firefox и WebKit.

Для эталонной версии используется отдельный worktree исходного коммита со своим lockfile:

```bash
pnpm baseline:prepare
pnpm test:visual
pnpm baseline:record
```

Эталонные PNG сохраняются в Git, видео и отчёты — в игнорируемом `artifacts/`. Подробные инструкции и защита от перезаписи: [документация миграции](docs/migration/README.md).

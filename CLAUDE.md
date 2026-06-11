# Timeweb concept

Лендинг по макету Figma «Timeweb. Website» (file key `Z1HMlhKYOQ6gcnKut6b0wO`, десктопный фрейм 1432px). Стек: **Next.js (App Router) + TypeScript**, без Tailwind — своя токен-система в `app/globals.css`. Анимации — GSAP (`@gsap/react`). Дальнейшие блоки строим **без Figma** по [docs/PLAYBOOK.md](docs/PLAYBOOK.md).

## Запуск

`npm run dev` (порт 3000, конфиг в `.claude/launch.json`, имя `dev`). Сборка: `npm run build`, линт: `npm run lint`.

## Структура

- `app/` — layout (шрифт Roboto через next/font, анти-FOUC скрипт), page, `globals.css` (вся стилизация, BEM)
- `components/` — секции и UI: `Header.tsx` (client, бургер), `Hero.tsx`, `GsapEffects.tsx` (client, вся анимация)
- `public/assets/` — ассеты из Figma; `public/assets/icons/{duotone|solid}/` — Phosphor
- `docs/PLAYBOOK.md` — структура будущей страницы, правила анимаций/дизайна, иконки
- `docs/MEDIA.md` — реестр фото/иллюстраций (заглушки → ассеты от владельца)
- `_legacy/` — прежняя статическая версия (референс, в сборку не входит; удалить, когда не нужна)

## Как строим новые секции

0. Контент приходит от владельца (скрины примерных блоков — берём **только контент**, стиль и композицию скринов не повторяем; или текстом). **Перед вёрсткой — обязательный дизайн-проход из PLAYBOOK** (инвентарь фактов → задача блока → композиция с нуля → анти-чек на пустые зоны/декор-заглушки/дублирование соседей). **Emoji со скринов не переносим** — вместо них иконки Phosphor или ничего. Дизайн-решения ищем через Mobbin MCP, стиль определяем сами, консистентно с готовым. Ссылки пока заглушки `#`.
1. Сверяемся с порядком и принципами в PLAYBOOK (один primary CTA, proof возле CTA, заголовок = выгода, премиум-слой эффектов).
2. Секция = серверный компонент `components/<Name>.tsx` + блок стилей в `globals.css` с комментарием-заголовком. Клиентскими делаем только интерактивные (state/effects).
3. Медиа: слот в `docs/MEDIA.md`, в разметке заглушка `data-media="<id>"`. Фото рендерим через `next/image`.
4. Анимации — только data-атрибутами (`data-animate`, `data-animate-group/child`, `data-intro` — последний только выше фолда). Кастомные эффекты — в `GsapEffects.tsx`.
5. Иконки: duotone — фич-карточки, solid — мелкий UI. Докачка: `curl -sfL -o public/assets/icons/duotone/<name>.svg "https://unpkg.com/@phosphor-icons/core@2.1.1/assets/duotone/<name>-duotone.svg"`.

## CSS-конвенции

- BEM: `.hero__stat-value`, модификаторы `--` (`.btn--primary`).
- Цвета, шрифты, радиусы, гаттеры — только токены из `:root`. Новые значения — сначала токеном.
- Контентная ширина: `.container` или `width: min(var(--container-max), 100% - var(--page-gutter) * 2)`; `--container-max: 1214px`.
- Шрифты: заголовки/цифры — `--font-heading` (Helvetica Neue, системная), текст/UI — `--font-text` (Roboto через next/font, веса 400/500).
- Фоны секций чередуем: белый / `--color-surface`.

## Адаптив (desktop-first)

Брейкпоинты `max-width`: **1280 (lg)** компактные гаттеры · **1024 (md)** бургер-меню, переносы рядов · **768 (sm)** типографика вниз, сетки 2×2 · **480 (xs)** колонки, full-width CTA, гаттеры 16px. Медиазапросы — в конце блока стилей секции.

Типографика по брейкпоинтам: H1 56/64 → 40/48 (sm) → 32/38 (xs); Display 40/48 → 32/40 → 28/34; подзаголовок 20/24 → 18/24 → 16/22.

## Анимации (правила)

UI-фидбек 100–200ms; reveal 500–700ms, `power2.out`; только transform/opacity; stagger 60–100ms; один reveal на секцию, `once: true`; `prefers-reduced-motion` уважается глобально (класс `js-anim` на `<html>` ставится только без reduced motion — см. layout.tsx). Анимация должна нести функцию, не украшать.

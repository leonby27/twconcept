# Timeweb concept

Статический лендинг (HTML + CSS + ванильный JS, без сборки) по мотивам макета Timeweb.

## Запуск

```bash
python3 -m http.server 8090
```

Открыть http://localhost:8090.

## Структура

- `index.html` — вся разметка
- `styles.css` — все стили (BEM, токены в `:root`)
- `app.js` — интерактив (бургер, FAQ, тарифы, рекомендации, эффекты)
- `assets/` — картинки и иконки
- `docs/` — заметки по дизайну (`PLAYBOOK.md`, `MEDIA.md`)

## Деплой

GitHub Pages, ветка `gh-pages` → https://leonby27.github.io/twconcept/

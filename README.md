# Manifik

Портфолио брендинговой студии Manifik. Чистые HTML, CSS и JavaScript, без библиотек и зависимостей.

## Структура

| Путь | Что это |
| --- | --- |
| `index.html` | Главная страница |
| `iz-korzinki.html`, `onda.html` | Страницы кейсов |
| `linkedin-cover.html` | Макет обложки для LinkedIn |
| `styles.css`, `case.css`, `app.js` | Стили и скрипт сайта |
| `assets/` | Изображения, SVG и шрифты |
| `scripts/` | Локальный сервер, сборка и вспомогательные скрипты |
| `figma-helper/`, `*-state.json` | Исходники макета Figma, в сборку не входят |
| `DESIGN.md` | Описание дизайн-системы |

## Локальный запуск

Требуется Node.js 18 или новее.

```bash
npm run dev
```

Сайт откроется на http://localhost:4173.

- `npm run check` проверяет синтаксис.
- `npm run build` собирает готовый сайт в `dist/`.

## Публикация на GitHub Pages

Деплой настроен через GitHub Actions (`.github/workflows/pages.yml`). При каждом пуше в ветку `main` сайт собирается и публикуется автоматически.

Один раз после создания репозитория: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Сайт будет доступен по адресу `https://<username>.github.io/<repo>/`.

## Примечания

Форма брифа работает только локально: отправка намеренно отключена, пока нет получателя заявок. Onda, Forma и Séra — концепты.

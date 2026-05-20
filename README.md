# msizov-site

Набросок персонального сайта для `msizov.com` (Mikhail Sizov).

## Что уже сделано
- Одностраничный draft в стиле, вдохновленном `glebfedorenko.com`
- Контентная логика и блоки собраны по мотивам `sizov.io`
- Факты и опыт заполнены из приложенного CV

## Файлы
- `index.html` — структура и контент секций
- `styles.css` — визуальный стиль, адаптивность, анимации
- `script.js` — reveal-анимация секций и sticky-header поведение

## Быстрый запуск
```bash
python3 -m http.server 4173
```

После запуска откройте `http://localhost:4173`.

## Что кастомизировать первым
- Контакты и ссылки: в `index.html` в секции `#contact`
- Тексты hero/проекты/таймлайн: `index.html`
- Цвета/шрифты/ритм: CSS-переменные в начале `styles.css`

## Инфраструктура
Доступ к домену и серверной части:
`https://dash.cloudflare.com/3b26c4d0e4e358d252bcdae3c0f8c8bb/home/domains`

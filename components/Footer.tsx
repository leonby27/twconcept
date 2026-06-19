import type { CSSProperties } from "react";

const COLUMNS = [
  {
    title: "Клиентам",
    links: ["Цены на хостинг", "Сравнить услуги", "Вопросы и ответы", "Договор", "Новости", "Акции"],
  },
  {
    title: "Партнерам",
    links: ["Вебмастерам", "Интеграторам", "Наш логотип", "Договор вебмастера", "Peering policy"],
  },
  {
    title: "Продукты",
    links: [
      "Хостинг",
      "VDS и VPS",
      "Почта для бизнеса",
      "Домены",
      "Выделенные серверы",
      "Виджет отзывов",
      "Конструктор сайтов",
      "Ускоритель сайтов",
    ],
  },
  {
    title: "О компании",
    links: ["О нас", "Контакты", "Команда", "Комьюнити", "Программа «Bug Bounty»", "Карта сайта", "Блог"],
  },
];

const CRUMBS = ["Главная", "Название страницы", "Название страницы"];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <nav className="footer__crumbs" aria-label="Хлебные крошки">
          {CRUMBS.map((c, i) => (
            <span key={i} className="footer__crumb">
              {i < CRUMBS.length - 1 ? <a href="#">{c}</a> : <span aria-current="page">{c}</span>}
              {i < CRUMBS.length - 1 && <span className="footer__crumb-sep" aria-hidden="true">›</span>}
            </span>
          ))}
        </nav>

        <div className="footer__main">
          <div className="footer__brand">
            <span
              className="icon footer__logo"
              role="img"
              aria-label="Timeweb"
              style={{ "--icon": "url(/assets/timeweb-logo.svg)" } as CSSProperties}
            />
            <p className="footer__phone-label">Бесплатно по России</p>
            <a href="tel:88007001081" className="footer__phone">8 (800) 700-10-81</a>
            <a href="#" className="footer__tg" aria-label="Telegram">
              <span
                className="icon footer__tg-icon"
                aria-hidden="true"
                style={{ "--icon": "url(/assets/icons/solid/telegram-logo.svg)" } as CSSProperties}
              />
            </a>
            <p className="footer__legal">
              © 2006-2025 АО «ТаймВэб».
              <br />
              Зарегистрированный товарный знак N461919. Лицензия РОСКОМНАДЗОР N142739. Политика АО
              «ТаймВэб» в отношении обработки персональных данных
            </p>
          </div>

          <nav className="footer__columns" aria-label="Карта сайта">
            {COLUMNS.map((col) => (
              <div key={col.title} className="footer__column">
                <p className="footer__column-title">{col.title}</p>
                <ul className="footer__links">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="footer__link">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

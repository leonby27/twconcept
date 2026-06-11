import type { CSSProperties } from "react";

const COLUMNS = [
  {
    title: "Продукты",
    links: [
      "Виртуальный хостинг",
      "Конструктор сайтов",
      "Домены",
      "Почта на домене",
      "SSL-сертификаты",
      "PRO-решения",
    ],
  },
  {
    title: "Клиентам",
    links: ["Панель управления", "База знаний", "Сообщество", "Статус серверов", "Оплата"],
  },
  {
    title: "Партнёрам",
    links: ["Партнёрская программа", "HostFriends", "Реселлинг", "Агентствам"],
  },
  {
    title: "О компании",
    links: ["О нас", "Команда", "Блог", "Новости", "Вакансии", "Контакты"],
  },
];

const SOCIALS = ["TG", "VK", "ДЗ"];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <span
              className="icon footer__logo"
              role="img"
              aria-label="Timeweb"
              style={{ "--icon": "url(/assets/timeweb-logo.svg)" } as CSSProperties}
            />
            <p className="footer__tagline">
              Надёжный хостинг для сайтов и бизнеса с 2006 года
            </p>
            <p className="footer__contact">
              <span
                className="icon footer__contact-icon"
                aria-hidden="true"
                style={{ "--icon": "url(/assets/icons/solid/chats-circle.svg)" } as CSSProperties}
              />
              Поддержка 24/7
            </p>
            <p className="footer__contact">
              <span
                className="icon footer__contact-icon"
                aria-hidden="true"
                style={{ "--icon": "url(/assets/icons/solid/phone.svg)" } as CSSProperties}
              />
              8-800-700-10-81 (бесплатно)
            </p>
            <div className="footer__socials">
              {SOCIALS.map((s) => (
                <a key={s} href="#" className="footer__social" aria-label={s}>
                  {s}
                </a>
              ))}
            </div>
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

        <div className="footer__bottom">
          <p className="footer__copyright">© 2006–2026 Timeweb.com — хостинг для сайта</p>
          <p className="footer__legal">
            <a href="#" className="footer__link">Политика конфиденциальности</a>
            {" · "}
            <a href="#" className="footer__link">Договор</a>
            {" · "}
            <a href="#" className="footer__link">Реквизиты</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

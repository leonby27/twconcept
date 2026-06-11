import type { CSSProperties } from "react";

type Product = {
  icon: string;
  title: string;
  price: string;
  text: string;
  chips: string[];
  cta: string;
  featured?: boolean;
};

const PRODUCTS: Product[] = [
  {
    icon: "hard-drives",
    title: "Хостинг для сайта",
    price: "от 180 ₽/мес",
    text: "Виртуальный хостинг для сайтов любой сложности. Быстрые NVMe-диски, изоляция, автобэкапы.",
    chips: ["10 дней бесплатно", "SSL в подарок", "WordPress", "1С-Битрикс", "Joomla"],
    cta: "Попробовать бесплатно",
    featured: true,
  },
  {
    icon: "globe-hemisphere-west",
    title: "Домены",
    price: "от 199 ₽/год",
    text: "325+ зон. .RU, .COM, .РФ и тысячи других.",
    chips: ["3 домена в подарок"],
    cta: "Найти домен",
  },
  {
    icon: "envelope-simple",
    title: "Почта на домене",
    price: "Входит в хостинг",
    text: "yourname@yourdomain.ru — профессионально и бесплатно. Веб-интерфейс и мобильное приложение.",
    chips: ["Бесплатно"],
    cta: "Подробнее",
  },
];

export default function Products() {
  return (
    <section className="products">
      <div className="container">
        <div className="section-head" data-animate="fade-up">
          <h2 className="section-head__title">Всё для вашего сайта&nbsp;— в&nbsp;одном аккаунте</h2>
          <p className="section-head__sub">Домен, хостинг, почта, SSL — настройте за 15 минут</p>
        </div>

        <div className="products__grid" data-animate-group>
          {PRODUCTS.map((p) => (
            <article
              key={p.title}
              className={`products__card${p.featured ? " products__card--featured" : ""}`}
              data-animate-child
            >
              <div className="products__head">
                <span
                  className="icon products__icon"
                  aria-hidden="true"
                  style={{ "--icon": `url(/assets/icons/duotone/${p.icon}.svg)` } as CSSProperties}
                />
                <h3 className="products__title">{p.title}</h3>
              </div>
              <p className="products__price">{p.price}</p>
              <p className="products__text">{p.text}</p>
              <ul className="products__chips">
                {p.chips.map((chip) => (
                  <li key={chip} className="products__chip">{chip}</li>
                ))}
              </ul>
              <a
                href="#"
                className={`btn btn--m products__cta ${p.featured ? "btn--primary" : "btn--outline"}`}
              >
                {p.cta}
              </a>
            </article>
          ))}
        </div>

        <aside className="products__cloud" data-animate="fade-up">
          <div className="products__cloud-info">
            <h3 className="products__cloud-title">Нужна облачная инфраструктура или VPS/VDS?</h3>
            <p className="products__cloud-text">
              Выделенные серверы, GPU, Kubernetes, облачные базы данных — в Timeweb Cloud
            </p>
          </div>
          <a href="#" className="btn btn--m btn--primary products__cloud-cta">
            Смотреть PRO-решения →
          </a>
        </aside>
      </div>
    </section>
  );
}

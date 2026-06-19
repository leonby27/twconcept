import type { CSSProperties } from "react";

// Продуктовая сетка: хостинг — главный (широкая карточка), затем
// домены, почта, ускоритель и тёмная карточка VDS/VPS. Вся карточка —
// ссылка, стрелка в углу обозначает переход.
const PRODUCTS = [
  {
    icon: "hard-drives",
    price: "от 180 ₽/мес",
    title: "Хостинг для сайта",
    text: "Виртуальный хостинг для сайтов любой сложности. Быстрые NVMe-диски, изоляция, автобэкапы.",
    wide: true,
  },
  {
    icon: "globe-hemisphere-west",
    price: "от 199 ₽/год",
    title: "Домены",
    text: "325+ зон. .RU, .COM, .РФ и другие",
    text2: "Скидки на популярные доменные зоны",
  },
  {
    icon: "envelope-simple",
    price: "Бесплатно",
    title: "Почта для бизнеса",
    text: "Простой веб-интерфейс и мобильное приложение для ведения почты.",
  },
  {
    icon: "rocket-launch",
    price: "от 4 ₽/день",
    title: "Ускоритель",
    text: "Поможет улучшить скорость работы сайта без изменений в коде.",
  },
  {
    icon: "cloud",
    price: "от 882 ₽/мес",
    title: "VDS / VPS",
    text: "Выделенные серверы, GPU, Kubernetes, облачные базы данных.",
    dark: true,
  },
];

export default function Products() {
  return (
    <section className="products">
      <div className="container">
        <h2 className="section-head__title products__heading">
          Всё для вашего сайта&nbsp;— в&nbsp;одном аккаунте
        </h2>

        <div className="products__grid">
          {PRODUCTS.map((p) => (
            <a
              key={p.title}
              href="#"
              className={[
                "products__card",
                p.wide ? "products__card--wide" : "",
                p.dark ? "products__card--dark" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="products__top">
                <span
                  className="icon products__icon"
                  aria-hidden="true"
                  style={{ "--icon": `url(/assets/icons/duotone/${p.icon}.svg)` } as CSSProperties}
                />
                <span
                  className="icon products__arrow"
                  aria-hidden="true"
                  style={{ "--icon": "url(/assets/icons/solid/arrow-up-right.svg)" } as CSSProperties}
                />
              </div>
              <p className="products__price">{p.price}</p>
              <h3 className="products__name">{p.title}</h3>
              <p className="products__text">
                {p.text}
                {p.text2 ? (
                  <>
                    <br />
                    {p.text2}
                  </>
                ) : null}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

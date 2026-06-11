import type { CSSProperties } from "react";

const ITEMS = [
  {
    icon: "calendar-check",
    title: "10 дней бесплатно",
    text: "Полноценное тестирование без привязки карты",
  },
  {
    icon: "gift",
    title: "3 домена .RU в подарок",
    text: "При оплате хостинга за год или 3 года",
  },
  {
    icon: "arrows-left-right",
    title: "Бесплатная миграция",
    text: "Перенесём сайты, домены и почту без потерь",
  },
  {
    icon: "seal-percent",
    title: "Скидка до 55%",
    text: "При оплате за 3 года. Цена фиксируется навсегда",
  },
];

export default function Benefits() {
  return (
    <section className="benefits" aria-label="Бонусы и условия">
      <div className="benefits__grid container" data-animate-group>
        {ITEMS.map((item) => (
          <article key={item.icon} className="benefits__card hover-lift" data-animate-child>
            <span
              className="icon-tile benefits__icon"
              aria-hidden="true"
              style={{ "--icon": `url(/assets/icons/duotone/${item.icon}.svg)` } as CSSProperties}
            />
            <h3 className="benefits__title">{item.title}</h3>
            <p className="benefits__text">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

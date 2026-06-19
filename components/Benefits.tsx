import type { CSSProperties } from "react";

// Лента бонусов под hero: три условия захода (триал, подарок, скидка).
// Каждая карточка — текст сверху + 3D-иллюстрация снизу на градиент-подложке.
const ITEMS = [
  {
    media: "benefit-trial",
    title: "10 дней бесплатно",
    text: "Полноценное тестирование без привязки банковской карты",
    tint: "#ffece6",
  },
  {
    media: "benefit-domain",
    title: "Домен .RU в подарок",
    text: "При оплате хостинга за год. 3 домена — при оплате за 3 года",
    tint: "#e2e9f5",
  },
  {
    media: "benefit-discount",
    title: "Скидка до 55%",
    text: "При оплате за 3 года. Цена фиксируется на весь срок оплаты",
    tint: "#ffece6",
  },
];

export default function Benefits() {
  return (
    <section className="benefits" aria-label="Бонусы и условия">
      <div className="benefits__grid container">
        {ITEMS.map((item) => (
          <article
            key={item.media}
            className="benefits__card"
            style={{ "--benefit-tint": item.tint } as CSSProperties}
          >
            <div className="benefits__body">
              <h3 className="benefits__title">{item.title}</h3>
              <p className="benefits__text">{item.text}</p>
            </div>
            <img
              className="benefits__media"
              src={`/assets/illustrations/${item.media}.webp`}
              alt=""
              width={170}
              height={118}
              loading="lazy"
            />
          </article>
        ))}
      </div>
    </section>
  );
}

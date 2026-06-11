import type { CSSProperties } from "react";

const OFFERS = [
  { icon: "wallet", text: "Сохраним ваш баланс от другого хостера" },
  { icon: "gift", text: "Или дадим 3 месяца хостинга в подарок" },
  { icon: "arrows-clockwise", text: "Сайты работают без перерыва при переносе" },
];

export default function Migration() {
  return (
    <section className="migration">
      <div className="container">
        <div className="migration__banner" data-animate="fade-up">
          <div className="migration__intro">
            <h2 className="migration__title">Переходите с другого хостинга?</h2>
            <p className="migration__text">
              Перенесём сайты, домены и почту бесплатно. Без простоев. Без потерь данных.
            </p>
          </div>
          <ul className="migration__offers">
            {OFFERS.map((offer) => (
              <li key={offer.icon} className="migration__offer">
                <span
                  className="icon migration__offer-icon"
                  aria-hidden="true"
                  style={{ "--icon": `url(/assets/icons/duotone/${offer.icon}.svg)` } as CSSProperties}
                />
                {offer.text}
              </li>
            ))}
          </ul>
          <a href="#" className="btn btn--m btn--primary migration__cta">
            Перейти на Timeweb бесплатно
          </a>
        </div>
      </div>
    </section>
  );
}

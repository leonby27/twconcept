import type { CSSProperties } from "react";

// Поддержка: обещание скорости + два канала-чипа, справа фото оператора.
const CHIPS = [
  { icon: "lightbulb", label: "База знаний" },
  { icon: "chat-text", label: "Чат поддержки 24/7" },
];

export default function Support() {
  return (
    <section className="support">
      <div className="container support__inner">
        <div className="support__content">
          <h2 className="section-head__title support__title">
            Поддержка на связи.
            <br />
            Круглосуточно
          </h2>
          <p className="support__sub">
            Среднее время ответа&nbsp;— 20 минут. Без очередей, без «ваш вопрос важен для нас».
          </p>

          <ul className="support__chips">
            {CHIPS.map((c) => (
              <li key={c.icon}>
                <a href="#" className="support__chip">
                  <span
                    className="icon support__chip-icon"
                    aria-hidden="true"
                    style={{ "--icon": `url(/assets/icons/solid/${c.icon}.svg)` } as CSSProperties}
                  />
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="support__media-frame">
          <div className="support__media">
            <img src="/assets/photos/support.webp" alt="Оператор поддержки Timeweb" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

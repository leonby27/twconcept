"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

type Period = "month" | "year" | "three";

const PERIODS: { id: Period; label: string; discount?: string; months: number; off: number }[] = [
  { id: "month", label: "За месяц", months: 1, off: 0 },
  { id: "year", label: "За год", discount: "−30%", months: 12, off: 0.3 },
  { id: "three", label: "За 3 года", discount: "−50%", months: 36, off: 0.5 },
];

// Каждая фича: [b] — выделенная жирным величина, [r] — пояснение.
type Feature = [string, string];
type Plan = {
  name: string;
  base: number; // цена/мес без скидки; за год даёт значения макета (164/248/347/482)
  features: Feature[];
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Year+",
    base: 234,
    features: [
      ["2 сайта", "с изоляцией"],
      ["15 ГБ", "на NVMe-дисках"],
      ["5 Баз Данных", ""],
      ["10 ГБ", "почтовой квоты"],
      ["Стандартный", "CPU и MySQL"],
    ],
  },
  {
    name: "Optimo+",
    base: 354,
    popular: true,
    features: [
      ["5 сайтов", "с изоляцией"],
      ["40 ГБ", "на NVMe-дисках"],
      ["8 Баз Данных", ""],
      ["10 ГБ", "почтовой квоты"],
      ["+250%", "CPU и MySQL"],
    ],
  },
  {
    name: "Century+",
    base: 496,
    features: [
      ["35 сайтов", "с изоляцией"],
      ["50 ГБ", "на NVMe-дисках"],
      ["∞ Баз Данных", ""],
      ["10 ГБ", "почтовой квоты"],
      ["+350%", "CPU и MySQL"],
    ],
  },
  {
    name: "Millenium+",
    base: 689,
    features: [
      ["60 сайтов", "с изоляцией"],
      ["60 ГБ", "на NVMe-дисках"],
      ["∞ Баз Данных", ""],
      ["10 ГБ", "почтовой квоты"],
      ["+550%", "CPU и MySQL"],
    ],
  },
];

const ALL_PLANS_INCLUDE = [
  "∞ кол-во почтовых ящиков",
  "Ежедневные резервные копии",
  "Бесплатный DNS-хостинг",
  "Бесплатный SSL",
];

const checkIcon = { "--icon": "url(/assets/icons/solid/check.svg)" } as CSSProperties;
const icon = (name: string) =>
  ({ "--icon": `url(/assets/icons/solid/${name}.svg)` } as CSSProperties);
const fmt = (n: number) => n.toLocaleString("ru-RU");

export default function Pricing() {
  const [period, setPeriod] = useState<Period>("year");
  const [category, setCategory] = useState<"classic" | "premium">("classic");

  const p = PERIODS.find((x) => x.id === period)!;

  return (
    <section className="pricing">
      <div className="container">
        <h2 className="section-head__title pricing__heading">Тарифы хостинга</h2>

        <div className="pricing__controls">
          <div className="pricing__seg" role="group" aria-label="Категория тарифов">
            <button
              type="button"
              className={`pricing__seg-btn${category === "classic" ? " pricing__seg-btn--active" : ""}`}
              aria-pressed={category === "classic"}
              onClick={() => setCategory("classic")}
            >
              <span className="icon pricing__seg-icon" aria-hidden="true" style={icon("squares")} />
              Классический
            </button>
            <button
              type="button"
              className={`pricing__seg-btn${category === "premium" ? " pricing__seg-btn--active" : ""}`}
              aria-pressed={category === "premium"}
              onClick={() => setCategory("premium")}
            >
              <span className="icon pricing__seg-icon" aria-hidden="true" style={icon("star-outline")} />
              Премиум
            </button>
          </div>

          <div className="pricing__seg pricing__seg--period" role="group" aria-label="Период оплаты">
            {PERIODS.map((per) => (
              <button
                key={per.id}
                type="button"
                className={`pricing__seg-btn${period === per.id ? " pricing__seg-btn--active" : ""}`}
                aria-pressed={period === per.id}
                onClick={() => setPeriod(per.id)}
              >
                {per.label}
                {per.discount && <span className="pricing__seg-off">{per.discount}</span>}
              </button>
            ))}
          </div>

          <a href="#" className="pricing__pick">
            <span className="icon pricing__pick-icon" aria-hidden="true" style={icon("navigation")} />
            Подобрать тариф в один клик
          </a>
        </div>

        <div className="pricing__grid">
          {PLANS.map((plan) => {
            const price = Math.round(plan.base * (1 - p.off));
            const total = price * p.months;
            const save = (plan.base - price) * p.months;
            return (
              <article
                key={plan.name}
                className={`pricing__card${plan.popular ? " pricing__card--popular" : ""}`}
              >
                {plan.popular && <span className="pricing__badge">Выбор клиентов</span>}
                <h3 className="pricing__name">{plan.name}</h3>
                {save > 0 ? (
                  <span className="pricing__save">Экономия {fmt(save)} ₽</span>
                ) : (
                  <span className="pricing__save pricing__save--empty" />
                )}
                <p className="pricing__price">
                  <span className="pricing__price-value">{fmt(price)}&nbsp;₽</span>
                  <span className="pricing__price-suffix">/мес</span>
                </p>
                <p className="pricing__total">
                  {fmt(total)} ₽ за {p.months} {p.months === 1 ? "месяц" : "месяцев"}
                </p>

                <a
                  href="#"
                  className={`btn pricing__cta ${plan.popular ? "btn--primary" : "btn--dark"}`}
                >
                  Начать бесплатно
                </a>

                <ul className="pricing__features">
                  {plan.features.map(([b, r], idx) => (
                    <li key={b} className="pricing__feature">
                      <span className="icon pricing__check" aria-hidden="true" style={checkIcon} />
                      <span className="pricing__feature-text">
                        <b className="pricing__feature-b">{b}</b>
                        {r ? ` ${r}` : ""}
                        {idx < 2 && (
                          <span className="icon pricing__info" aria-hidden="true" style={icon("info")} />
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="pricing__included">
          <span className="pricing__included-label">А также в каждом тарифе:</span>
          <ul className="pricing__included-list">
            {ALL_PLANS_INCLUDE.map((f) => (
              <li key={f} className="pricing__included-item">
                <span className="icon pricing__check" aria-hidden="true" style={checkIcon} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

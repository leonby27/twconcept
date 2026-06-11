"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

type Period = "month" | "year" | "three";

const PERIODS: { id: Period; label: string; discount?: string }[] = [
  { id: "month", label: "За месяц" },
  { id: "year", label: "За год", discount: "−37%" },
  { id: "three", label: "За 3 года", discount: "−55%" },
];

type Plan = {
  name: string;
  desc: string;
  prices: Record<Period, number>;
  features: string[];
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Year",
    desc: "Идеальное решение для сайта-визитки",
    prices: { month: 393, year: 248, three: 180 },
    features: [
      "2 сайта с изоляцией",
      "15 ГБ NVMe-диск",
      "2 базы данных",
      "Бесплатный SSL",
      "Безлимитная почта",
      "Бэкапы ежедневно",
    ],
  },
  {
    name: "Optimo",
    desc: "Выбор блогеров и сайтов-галерей",
    prices: { month: 634, year: 399, three: 272 },
    features: [
      "15 сайтов с изоляцией",
      "40 ГБ NVMe-диск",
      "Безлимитные базы данных",
      "Бесплатный SSL",
      "Безлимитная почта",
      "Бэкапы ежедневно",
    ],
  },
  {
    name: "Century",
    desc: "Наилучший вариант для сайта компании",
    prices: { month: 887, year: 559, three: 381 },
    popular: true,
    features: [
      "35 сайтов с изоляцией",
      "50 ГБ NVMe-диск",
      "Безлимитные базы данных",
      "Бесплатный SSL",
      "Безлимитная почта",
      "Приоритетная поддержка",
    ],
  },
  {
    name: "Millennium",
    desc: "Для крупных e-commerce проектов",
    prices: { month: 1285, year: 810, three: 554 },
    features: [
      "60 сайтов с изоляцией",
      "60 ГБ NVMe-диск",
      "Безлимитные базы данных",
      "Бесплатный SSL",
      "Безлимитная почта",
      "Выделенный IP",
    ],
  },
];

const checkIcon = { "--icon": "url(/assets/icons/solid/check.svg)" } as CSSProperties;
const giftIcon = { "--icon": "url(/assets/icons/duotone/gift.svg)" } as CSSProperties;

export default function Pricing() {
  const [period, setPeriod] = useState<Period>("three");

  return (
    <section className="pricing">
      <div className="container">
        <div className="section-head" data-animate="fade-up">
          <h2 className="section-head__title">Тарифы виртуального хостинга</h2>
        </div>

        <div className="pricing__tabs" role="group" aria-label="Период оплаты" data-animate="fade">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pricing__tab${period === p.id ? " pricing__tab--active" : ""}`}
              aria-pressed={period === p.id}
              onClick={() => setPeriod(p.id)}
            >
              {p.label}
              {p.discount && <span className="pricing__tab-discount">{p.discount}</span>}
            </button>
          ))}
        </div>

        <div className="pricing__grid" data-animate-group>
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`pricing__card${plan.popular ? " pricing__card--popular" : ""}`}
              data-animate-child
            >
              {plan.popular && <span className="pricing__badge">Популярный выбор</span>}
              <h3 className="pricing__name">{plan.name}</h3>
              <p className="pricing__desc">{plan.desc}</p>
              <p className="pricing__price-old">
                {period !== "month" ? `${plan.prices.month} ₽/мес` : " "}
              </p>
              <p className="pricing__price">
                <span className="pricing__price-value">{plan.prices[period]}&nbsp;₽</span>
                <span className="pricing__price-suffix">/мес</span>
              </p>
              <p className="pricing__gift">
                <span className="icon pricing__gift-icon" aria-hidden="true" style={giftIcon} />
                3 домена .RU/.РФ в подарок
              </p>
              <ul className="pricing__features">
                {plan.features.map((f) => (
                  <li key={f} className="pricing__feature">
                    <span className="icon pricing__check" aria-hidden="true" style={checkIcon} />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`btn btn--m pricing__cta ${plan.popular ? "btn--primary" : "btn--outline"}`}
              >
                Начать бесплатно
              </a>
            </article>
          ))}
        </div>

        <div className="pricing__links" data-animate="fade">
          <a href="#" className="pricing__link">Все тарифы списком →</a>
          <a href="#" className="pricing__link">Сравнить тарифы →</a>
        </div>
      </div>
    </section>
  );
}

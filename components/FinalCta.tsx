"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

// Фича карточки: [b] — выделенная жирным величина, [rest] — пояснение,
// [info] — рядом инфо-иконка (как в Pricing).
type Feature = { b: string; rest: string; info?: boolean };
type Plan = {
  name: string;
  save: number; // экономия за 12 месяцев, ₽
  price: number; // цена/мес
  total: number; // сумма за 12 месяцев
  features: Feature[];
};

// Каталог тарифов, согласован с секцией «Тарифы» (Pricing): годовые цены.
const PLANS: Record<string, Plan> = {
  "Year+": {
    name: "Year+",
    save: 600,
    price: 164,
    total: 1968,
    features: [
      { b: "2 сайта", rest: "с изоляцией", info: true },
      { b: "15 ГБ", rest: "на NVMe-дисках", info: true },
      { b: "5", rest: "Баз Данных" },
      { b: "10 Гб", rest: "почтовой квоты" },
      { b: "Стандартный", rest: "CPU и MySQL" },
    ],
  },
  "Optimo+": {
    name: "Optimo+",
    save: 752,
    price: 248,
    total: 2976,
    features: [
      { b: "15", rest: "сайтов с изоляцией", info: true },
      { b: "40 ГБ", rest: "на NVMe-дисках", info: true },
      { b: "∞", rest: "Базы Данных" },
      { b: "10 Гб", rest: "почтовой квоты" },
      { b: "+250%", rest: "CPU и MySQL" },
    ],
  },
  "Century+": {
    name: "Century+",
    save: 1772,
    price: 347,
    total: 4164,
    features: [
      { b: "35", rest: "сайтов с изоляцией", info: true },
      { b: "50 ГБ", rest: "на NVMe-дисках", info: true },
      { b: "∞", rest: "Базы Данных" },
      { b: "10 Гб", rest: "почтовой квоты" },
      { b: "+350%", rest: "CPU и MySQL" },
    ],
  },
  "Millenium+": {
    name: "Millenium+",
    save: 2400,
    price: 482,
    total: 5784,
    features: [
      { b: "60", rest: "сайтов с изоляцией", info: true },
      { b: "60 ГБ", rest: "на NVMe-дисках", info: true },
      { b: "∞", rest: "Базы Данных" },
      { b: "10 Гб", rest: "почтовой квоты" },
      { b: "+550%", rest: "CPU и MySQL" },
    ],
  },
};

// Сценарий → рекомендованные тарифы. Всегда два: primary (с плашкой) + secondary.
const SCENARIOS: { label: string; primary: string; secondary: string }[] = [
  { label: "Лэндинг", primary: "Year+", secondary: "Optimo+" },
  { label: "Сайт компании", primary: "Optimo+", secondary: "Year+" },
  { label: "Интернет-магазин", primary: "Century+", secondary: "Millenium+" },
  { label: "Я разработчик", primary: "Optimo+", secondary: "Century+" },
  { label: "Веб-студия", primary: "Century+", secondary: "Millenium+" },
  { label: "Сложный проект", primary: "Millenium+", secondary: "Century+" },
];

const checkIcon = { "--icon": "url(/assets/icons/solid/check.svg)" } as CSSProperties;
const infoIcon = { "--icon": "url(/assets/icons/solid/info.svg)" } as CSSProperties;
const fmt = (n: number) => n.toLocaleString("ru-RU");

function RecoCard({ plan, variant }: { plan: Plan; variant: "primary" | "secondary" }) {
  const isPrimary = variant === "primary";
  return (
    <article className={`reco-card reco-card--${variant}`}>
      {isPrimary && <span className="reco-card__badge">Рекомендуем</span>}
      <div className="reco-card__head">
        <h3 className="reco-card__name">{plan.name}</h3>
        <span className="reco-card__save">Экономия {fmt(plan.save)} ₽</span>
        <p className="reco-card__price">
          <span className="reco-card__price-value">{fmt(plan.price)}&nbsp;₽</span>
          <span className="reco-card__price-suffix">/мес</span>
        </p>
        <p className="reco-card__total">{fmt(plan.total)} ₽ за 12 месяцев</p>
      </div>

      <a
        href="#"
        className={`btn reco-card__cta ${isPrimary ? "btn--dark" : "btn--white"}`}
      >
        Начать бесплатно
      </a>

      <ul className="reco-card__features">
        {plan.features.map((f) => (
          <li key={f.b + f.rest} className="reco-card__feature">
            <span className="icon reco-card__check" aria-hidden="true" style={checkIcon} />
            <span className="reco-card__feature-text">
              <b className="reco-card__feature-b">{f.b}</b>
              {f.rest ? ` ${f.rest}` : ""}
              {f.info && (
                <span className="icon reco-card__info" aria-hidden="true" style={infoIcon} />
              )}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function FinalCta() {
  const [active, setActive] = useState(1); // «Сайт компании» по умолчанию

  const scenario = SCENARIOS[active];
  // Рекомендованный — это primary (с плашкой), остальной — secondary.
  // Раскладка по цене: дешевле слева, дороже справа — поэтому рекомендованный
  // может оказаться как слева, так и справа.
  const cards: { plan: Plan; variant: "primary" | "secondary" }[] = [
    { plan: PLANS[scenario.primary], variant: "primary" },
    { plan: PLANS[scenario.secondary], variant: "secondary" },
  ].sort((a, b) => a.plan.price - b.plan.price);

  return (
    <section className="reco">
      <div className="container reco__inner">
        <div className="reco__pitch">
          <h2 className="reco__title">
            <span className="reco__title-accent">Начните</span> бесплатный период уже
            сегодня.
          </h2>
          <p className="reco__text">
            Выберите свой сценарий и начните работу над проектом вместе с Timeweb
          </p>

          <div className="reco__scenarios" role="radiogroup" aria-label="Сценарий проекта">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.label}
                type="button"
                role="radio"
                aria-checked={active === i}
                className={`reco-scenario${active === i ? " reco-scenario--active" : ""}`}
                onClick={() => setActive(i)}
              >
                <span className="reco-scenario__label">{s.label}</span>
                <span className="reco-scenario__mark" aria-hidden="true">
                  <span className="icon reco-scenario__check" style={checkIcon} />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Контейнер пересоздаётся (→ анимация) только при смене самой пары
            тарифов. Карты ключуем по имени тарифа: внутри той же пары каждый
            тариф сохраняет свой DOM-узел и позицию (отсортированы по цене),
            поэтому при переезде «Рекомендуем» нет ни ремоунта, ни перестановки —
            плашка и стиль кнопки просто переключаются на месте. */}
        <div className="reco__cards" key={cards.map((c) => c.plan.name).join("__")}>
          {cards.map(({ plan, variant }) => (
            <RecoCard key={plan.name} plan={plan} variant={variant} />
          ))}
        </div>
      </div>
    </section>
  );
}

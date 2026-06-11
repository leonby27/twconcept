"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

type Tab = {
  id: string;
  icon: string;
  label: string;
  title: string;
  text: string;
  points: string[];
  plan: { name: string; price: number; gift: string };
};

// Контент табов «Малому бизнесу» и «Разработчикам» — черновик,
// собранный из фактов с этой же страницы. Владелец заменит своим.
const TABS: Tab[] = [
  {
    id: "personal",
    icon: "user",
    label: "Физлицам / блогерам",
    title: "Запустите сайт за 15 минут",
    text: "Никакого программирования. Выберите шаблон в Конструкторе или установите WordPress в 2 клика — и ваш сайт уже онлайн.",
    points: [
      "Конструктор сайтов с 500+ шаблонами",
      "WordPress за 2 клика",
      "Домен .RU в подарок",
      "Поддержка 24/7 на русском",
    ],
    plan: { name: "Year", price: 180, gift: "3 домена .RU/.РФ в подарок" },
  },
  {
    id: "business",
    icon: "briefcase",
    label: "Малому бизнесу",
    title: "Сайт компании — в одном аккаунте",
    text: "Домен, хостинг, SSL и корпоративная почта в одном месте. Работающий сайт перенесём с другого хостинга бесплатно.",
    points: [
      "Почта на домене компании бесплатно",
      "Бесплатный SSL и ежедневные бэкапы",
      "Соответствие 152-ФЗ",
      "Бесплатный перенос сайта",
    ],
    plan: { name: "Century", price: 381, gift: "3 домена .RU/.РФ в подарок" },
  },
  {
    id: "dev",
    icon: "code",
    label: "Разработчикам",
    title: "Инфраструктура, которая не мешает",
    text: "Быстрые NVMe-диски, изоляция сайтов и безлимитные базы данных. Для проектов посерьёзнее — VPS, GPU и Kubernetes в Timeweb Cloud.",
    points: [
      "NVMe-диски и изоляция сайтов",
      "Безлимитные базы данных",
      "Выделенный IP",
      "VPS, GPU и Kubernetes — в Timeweb Cloud",
    ],
    plan: { name: "Millennium", price: 554, gift: "3 домена .RU/.РФ в подарок" },
  },
];

const giftIcon = { "--icon": "url(/assets/icons/duotone/gift.svg)" } as CSSProperties;
const checkIcon = { "--icon": "url(/assets/icons/solid/check.svg)" } as CSSProperties;

export default function Audience() {
  const [active, setActive] = useState(TABS[0].id);
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <section className="audience">
      <div className="container">
        <div className="section-head" data-animate="fade-up">
          <h2 className="section-head__title">Для кого Timeweb?</h2>
          <p className="section-head__sub">Выберите свой сценарий</p>
        </div>

        <div className="audience__tabs" role="tablist" aria-label="Сценарии использования" data-animate="fade">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              className={`audience__tab${active === t.id ? " audience__tab--active" : ""}`}
              onClick={() => setActive(t.id)}
            >
              <span
                className="icon audience__tab-icon"
                aria-hidden="true"
                style={{ "--icon": `url(/assets/icons/solid/${t.icon}.svg)` } as CSSProperties}
              />
              {t.label}
            </button>
          ))}
        </div>

        <div data-animate="fade-up">
        <div className="audience__panel" key={tab.id} role="tabpanel">
          <div className="audience__content">
            <h3 className="audience__title">{tab.title}</h3>
            <p className="audience__text">{tab.text}</p>
            <ul className="audience__points">
              {tab.points.map((point) => (
                <li key={point} className="audience__point">
                  <span className="icon audience__check" aria-hidden="true" style={checkIcon} />
                  {point}
                </li>
              ))}
            </ul>
            <a href="#" className="btn btn--m btn--outline audience__cta">Начать бесплатно</a>
          </div>

          <aside className="audience__rec">
            <p className="audience__rec-label">Рекомендуем</p>
            <h4 className="audience__rec-name">Тариф {tab.plan.name}</h4>
            <p className="audience__rec-price">
              <span className="audience__rec-value">{tab.plan.price}&nbsp;₽</span>
              <span className="audience__rec-suffix">/мес</span>
            </p>
            <p className="audience__rec-note">при оплате за 3 года</p>
            <p className="audience__rec-gift">
              <span className="icon audience__rec-gift-icon" aria-hidden="true" style={giftIcon} />
              {tab.plan.gift}
            </p>
            <a href="#" className="btn btn--m btn--primary audience__rec-cta">
              Попробовать 10 дней бесплатно
            </a>
          </aside>
        </div>
        </div>
      </div>
    </section>
  );
}

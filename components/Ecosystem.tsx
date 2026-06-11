"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

type EcoTab = {
  id: string;
  icon: string;
  label: string;
  title: string;
  text: string;
  rows?: { label: string; price: string }[];
  points?: string[];
  cta: string;
};

// Контент табов кроме «Домены» — черновик из фактов страницы
// («Защита от DDoS» — целиком черновик). Владелец заменит своим.
const TABS: EcoTab[] = [
  {
    id: "domains",
    icon: "globe-hemisphere-west",
    label: "Домены",
    title: "Регистрация доменов",
    text: "Зарегистрируйте домен в 325+ зонах. .RU, .COM, .РФ, .STORE, .SHOP и тысячи других. Бесплатный DNS-хостинг.",
    rows: [
      { label: ".RU / .РФ", price: "от 199 ₽/год" },
      { label: ".COM / .NET", price: "от 1 490 ₽/год" },
      { label: ".ORG / .INFO", price: "от 699 ₽/год" },
    ],
    cta: "Найти домен",
  },
  {
    id: "mail",
    icon: "envelope-simple",
    label: "Почта на домене",
    title: "Почта на вашем домене",
    text: "yourname@yourdomain.ru — профессионально и бесплатно. Входит в любой тариф хостинга.",
    points: [
      "Создание ящика за 1 минуту",
      "Веб-интерфейс и мобильное приложение",
      "Бесплатно с хостингом",
    ],
    cta: "Подключить почту",
  },
  {
    id: "ssl",
    icon: "lock-key",
    label: "SSL-сертификаты",
    title: "SSL-сертификаты",
    text: "Бесплатный SSL входит в каждый тариф хостинга — сайт работает по HTTPS из коробки.",
    points: [
      "Бесплатный SSL в каждом тарифе",
      "Автоматическая установка",
      "SSL в подарок при оплате за год",
    ],
    cta: "Подробнее",
  },
  {
    id: "builder",
    icon: "magic-wand",
    label: "Конструктор",
    title: "Конструктор сайтов",
    text: "Без программистов. Выберите один из 500+ шаблонов — и готовый сайт за 15 минут.",
    points: [
      "500+ шаблонов",
      "От 199 ₽/мес",
      "Бесплатный период",
    ],
    cta: "Создать сайт",
  },
  {
    id: "ddos",
    icon: "shield-check",
    label: "Защита от DDoS",
    title: "Защита от DDoS",
    text: "Фильтрация трафика на уровне инфраструктуры — сайты остаются онлайн даже под атакой.",
    points: [
      "Базовая защита во всех тарифах",
      "Мониторинг 24/7",
      "Без настройки со стороны клиента",
    ],
    cta: "Подробнее",
  },
];

export default function Ecosystem() {
  const [active, setActive] = useState(TABS[0].id);
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <section className="eco">
      <div className="container">
        <div className="section-head" data-animate="fade-up">
          <h2 className="section-head__title">Все продукты Timeweb</h2>
          <p className="section-head__sub">Переключайтесь между услугами</p>
        </div>

        <div className="eco__tabs" role="tablist" aria-label="Продукты" data-animate="fade">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              className={`eco__tab${active === t.id ? " eco__tab--active" : ""}`}
              onClick={() => setActive(t.id)}
            >
              <span
                className="icon eco__tab-icon"
                aria-hidden="true"
                style={{ "--icon": `url(/assets/icons/solid/${t.icon}.svg)` } as CSSProperties}
              />
              {t.label}
            </button>
          ))}
        </div>

        <div data-animate="fade-up">
          <div className="eco__panel" key={tab.id} role="tabpanel">
            <div className="eco__content">
              <h3 className="eco__title">{tab.title}</h3>
              <p className="eco__text">{tab.text}</p>
              {tab.rows && (
                <ul className="eco__rows">
                  {tab.rows.map((row) => (
                    <li key={row.label} className="eco__row">
                      <span className="eco__row-label">{row.label}</span>
                      <span className="eco__row-price">{row.price}</span>
                    </li>
                  ))}
                </ul>
              )}
              {tab.points && (
                <ul className="eco__points">
                  {tab.points.map((point) => (
                    <li key={point} className="eco__point">
                      <span
                        className="icon eco__check"
                        aria-hidden="true"
                        style={{ "--icon": "url(/assets/icons/solid/check.svg)" } as CSSProperties}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              <a href="#" className="btn btn--m btn--primary eco__cta">{tab.cta}</a>
            </div>

            {tab.id === "domains" ? (
              <div className="eco__search" aria-hidden="true">
                <div className="eco__search-field">
                  <span className="eco__search-placeholder">домен<b>yoursite</b>.ru</span>
                  <span className="btn btn--m btn--primary eco__search-btn">Найти</span>
                </div>
                <p className="eco__search-zones">.ru · .com · .рф · .store · .shop</p>
              </div>
            ) : (
              <div className="media-placeholder eco__media" data-media={`eco-${tab.id}`}>
                <span className="media-placeholder__label">eco-{tab.id} · 4:3</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

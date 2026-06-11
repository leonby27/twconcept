"use client";

import { useState } from "react";

// Ответы — черновик из фактов страницы (вопросы со скрина владельца).
const ITEMS = [
  {
    q: "Можно ли попробовать хостинг бесплатно?",
    a: "Да. Каждый тариф можно тестировать 10 дней — без оплаты и привязки карты. Если не подойдёт, ничего платить не нужно.",
  },
  {
    q: "Можно ли перенести сайт от другого хостера?",
    a: "Да, перенесём сайты, домены и почту бесплатно — без простоев и потерь данных. Сохраним ваш баланс от другого хостера или дадим 3 месяца хостинга в подарок.",
  },
  {
    q: "Сколько стоит хостинг для сайта?",
    a: "От 180 ₽/мес на тарифе Year при оплате за 3 года (без скидки — от 393 ₽/мес). В каждый тариф входят бесплатный SSL, почта на домене и ежедневные бэкапы.",
  },
  {
    q: "Есть ли бесплатный SSL-сертификат?",
    a: "Да, бесплатный SSL входит в каждый тариф — сайт сразу работает по HTTPS, установка автоматическая.",
  },
  {
    q: "Мой сайт точно не ляжет?",
    a: "Мы гарантируем доступность 99.98% по договору (SLA). Серверы на быстрых NVMe-дисках, ежедневные бэкапы с восстановлением в 1 клик из панели.",
  },
  {
    q: "Можно ли сменить тариф позже?",
    a: "Да, тариф можно сменить в любой момент из панели управления.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="faq">
      <div className="container faq__inner">
        <div className="section-head" data-animate="fade-up">
          <h2 className="section-head__title">Вопросы и ответы</h2>
          <p className="section-head__sub">Самые частые вопросы о хостинге</p>
        </div>

        <div className="faq__list" data-animate="fade-up">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={`faq__item${isOpen ? " faq__item--open" : ""}`}>
                <button
                  type="button"
                  className="faq__question"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {item.q}
                  <span className="faq__plus" aria-hidden="true" />
                </button>
                <div className="faq__answer">
                  <div className="faq__answer-inner">
                    <p className="faq__answer-text">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

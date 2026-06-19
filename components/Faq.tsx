"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

const caretIcon = { "--icon": "url(/assets/icons/solid/caret-down.svg)" } as CSSProperties;

const ITEMS = [
  {
    q: "А чем друг от друга отличаются хостинг, VDS, VPS и выделенный сервер?",
    a: "Виртуальный хостинг — готовая площадка для сайтов, ресурсы делятся между клиентами с изоляцией. VPS/VDS — выделенные виртуальные серверы с гарантированными ресурсами и полным доступом. Выделенный сервер — отдельная физическая машина целиком под ваши задачи.",
  },
  {
    q: "У меня уже есть сайт и домен. Могу ли я перенести все это к вам?",
    a: "Да. Перенесём сайты, домены и почту бесплатно — без простоев и потерь данных. Сохраним ваш баланс от другого хостера или дадим 3 месяца хостинга в подарок.",
  },
  {
    q: "Какие способы оплаты у вас есть?",
    a: "Банковские карты, СБП, электронные кошельки и безналичный расчёт для юридических лиц. Доступна автооплата, чтобы услуги не отключались.",
  },
  {
    q: "Можно ли у вас приобрести лицензии 1С-Битрикс и ISPmanager?",
    a: "Да, лицензии 1С-Битрикс и ISPmanager можно приобрести и продлить прямо в панели управления — отдельно покупать у сторонних поставщиков не нужно.",
  },
  {
    q: "Какие тарифы хостинга предлагает Timeweb?",
    a: "Линейка из четырёх тарифов — Year+, Optimo+, Century+ и Millenium+ — от 164 ₽/мес. Они отличаются числом сайтов, объёмом NVMe-диска, количеством баз данных и мощностью CPU.",
  },
  {
    q: "Как выбрать подходящий тариф для своего сайта?",
    a: "Ориентируйтесь на число сайтов и нагрузку: для визитки или блога достаточно Year+, для интернет-магазина и нескольких проектов — Optimo+ или Century+. Можно начать с младшего тарифа и сменить его в любой момент из панели.",
  },
  {
    q: "Почему с нами хорошо?",
    a: "20 лет на рынке, 700 000 сайтов, аптайм 99.98% по договору и поддержка, отвечающая в среднем за 10 минут. Бесплатный SSL, ежедневные бэкапы и удобная панель входят во все тарифы.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="faq">
      <div className="container faq__inner">
        <h2 className="section-head__title faq__heading">Остались вопросы?</h2>

        <div className="faq__list">
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
                  <span className="icon faq__caret" aria-hidden="true" style={caretIcon} />
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

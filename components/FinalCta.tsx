"use client";

import { useState } from "react";

export default function FinalCta() {
  const [sent, setSent] = useState(false);

  return (
    <section className="cta-final">
      <div className="container">
        <div className="cta-final__plate" data-animate="fade-up">
          <div className="cta-final__pitch">
            <h2 className="cta-final__title">Готовы запустить сайт?</h2>
            <p className="cta-final__text">
              Начните с 10 бесплатных дней — без привязки карты и скрытых платежей.
              Поддержка 24/7 поможет разобраться с любым вопросом.
            </p>
            <a href="#" className="btn btn--l btn--primary cta-final__btn">
              Начать бесплатно — 10 дней
            </a>
            <p className="cta-final__note">Или напишите нам — ответим на почту или в мессенджер.</p>
          </div>

          <div className="cta-final__card">
            <h3 className="cta-final__card-title">Есть вопрос? Напишите нам</h3>
            {sent ? (
              <p className="cta-final__sent">
                Спасибо! Ответим в течение 10–30 минут. В рабочее время — быстрее.
              </p>
            ) : (
              <form
                className="cta-final__form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <label className="cta-final__label" htmlFor="cta-question">Ваш вопрос</label>
                <textarea
                  id="cta-question"
                  className="cta-final__textarea"
                  rows={3}
                  placeholder="Например: Какой тариф подойдёт для WordPress-блога?"
                  required
                />
                <label className="cta-final__label" htmlFor="cta-contact">Как с вами связаться</label>
                <input
                  id="cta-contact"
                  className="cta-final__input"
                  type="text"
                  placeholder="Email или Telegram"
                  required
                />
                <button type="submit" className="btn btn--m btn--primary cta-final__submit">
                  Отправить вопрос
                </button>
                <p className="cta-final__hint">
                  Ответим в течение 10–30 минут. В рабочее время — быстрее.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

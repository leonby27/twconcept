import type { CSSProperties } from "react";

const PAYOUTS = [
  { amount: "+ 1210 ₽", note: "20% от оплаты за аренду VDS", pos: "a" },
  { amount: "+ 2320 ₽", note: "40% от оплаты хостинга за год", pos: "b" },
];

export default function Partners() {
  return (
    <section className="partners">
      <div className="container">
        <div className="partners__card">
          <div className="partners__info">
            <h2 className="partners__title">
              <span className="partners__title-accent">Отдаём до 45%</span>
              <br />
              от ежемесячных оплат ваших клиентов
            </h2>
            <p className="partners__note">
              ~ 10 млн ₽ в год зарабатывают ведущие партнёры!
            </p>
            <a href="#" className="btn btn--dark partners__cta">Стать партнёром</a>
          </div>

          <div className="partners__visual" aria-hidden="true">
            <img className="partners__coins" src="/assets/illustrations/coins.webp" alt="" loading="lazy" />
            {PAYOUTS.map((p) => (
              <div key={p.pos} className={`partners__payout partners__payout--${p.pos}`}>
                <span className="partners__payout-icon">
                  <img className="partners__payout-check" src="/assets/icons/success-check.svg" alt="" />
                </span>
                <div className="partners__payout-body">
                  <p className="partners__payout-amount">{p.amount}</p>
                  <p className="partners__payout-note">{p.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

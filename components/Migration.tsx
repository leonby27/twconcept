import type { CSSProperties } from "react";

export default function Migration() {
  return (
    <section className="migration">
      <div className="container">
        <div className="migration__card">
          <div className="migration__content">
            <div className="migration__head">
              <h2 className="migration__heading">
                Перенесём в Timeweb ваш сайт и почту бесплатно.
              </h2>
              <p className="migration__desc">Без простоев. Без потерь данных. Легко.</p>
            </div>

            <div className="migration__actions">
              <p className="migration__note">
                <span
                  className="icon migration__note-icon"
                  aria-hidden="true"
                  style={{ "--icon": "url(/assets/icons/duotone/gift.svg)" } as CSSProperties}
                />
                Сохраним ваш баланс или дадим 3 месяца хостинга в подарок
              </p>
              <a href="#" className="btn btn--m btn--dark migration__cta">
                Перенести в Timeweb
              </a>
            </div>
          </div>

          <div className="migration__media">
            <img src="/assets/photos/migration.webp" alt="Перенос сайта на Timeweb" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

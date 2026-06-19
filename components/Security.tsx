import type { CSSProperties } from "react";

// Изоляция сайтов: один центрированный месседж о безопасности.
export default function Security() {
  return (
    <section className="security">
      <div className="container security__inner">
        <span
          className="security__badge"
          aria-hidden="true"
          style={{ "--icon": "url(/assets/icons/duotone/shield-check.svg)" } as CSSProperties}
        />
        <h2 className="security__title">
          Все сайты в безопасности
          <br />и изолированы друг от друга
        </h2>
        <p className="security__text">
          Изоляция сайтов — это опция для повышения безопасности сайтов, которая позволяет
          создать для проекта собственное автономное пространство, независимое от других сайтов
          на том же аккаунте.
        </p>
        <a href="#" className="security__link">
          Подробнее про изоляцию
          <span
            className="icon security__link-arrow"
            aria-hidden="true"
            style={{ "--icon": "url(/assets/icons/solid/arrow-up-right.svg)" } as CSSProperties}
          />
        </a>
      </div>
    </section>
  );
}

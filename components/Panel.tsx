import type { CSSProperties } from "react";

// Панель управления: светлая плашка со списком возможностей слева
// и скриншотом файлового менеджера справа (заглушка медиа).
const FEATURES = [
  { icon: "folder", text: "Функциональный\nфайловый менеджер" },
  { icon: "desktop", text: "Управление сайтами, скоростью и доменами" },
  { icon: "pencil-simple", text: "Бесплатный\nDNS-редактор" },
  { icon: "globe-hemisphere-west", text: "Управление доменами и поддоменами сайтов" },
];

export default function Panel() {
  return (
    <section className="panel">
      <div className="container">
        <div className="panel__card">
          <div className="panel__content">
            <h2 className="panel__heading">Собственная панель управления</h2>
            <p className="panel__desc">
              Управление сайтами, доменами, почтой и остальным&nbsp;— удобно и в одном месте
            </p>

            <ul className="panel__features">
              {FEATURES.map((f) => (
                <li key={f.icon} className="panel__feature">
                  <span
                    className="panel__feature-icon"
                    aria-hidden="true"
                    style={{ "--icon": `url(/assets/icons/duotone/${f.icon}.svg)` } as CSSProperties}
                  />
                  <p className="panel__feature-text">{f.text}</p>
                </li>
              ))}
            </ul>

            <a href="#" className="btn btn--m btn--dark panel__cta">
              Попробовать бесплатно
            </a>
          </div>

          <div className="panel__media">
            <img src="/assets/photos/file-manager.png" alt="Файловый менеджер Timeweb" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

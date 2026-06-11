import type { CSSProperties } from "react";

const FEATURES = [
  {
    icon: "magic-wand",
    title: "WordPress за 2 клика",
    text: "Автоустановка любой CMS — WordPress, Joomla, Drupal, OpenCart и других",
  },
  {
    icon: "envelope-simple",
    title: "Почта на домене без IT-специалиста",
    text: "Создайте yourname@yoursite.ru за 1 минуту. Веб-интерфейс и мобильное приложение",
  },
  {
    icon: "clock-counter-clockwise",
    title: "Восстановление бэкапа в 1 клик",
    text: "Ежедневные резервные копии всех сайтов. Восстановление без обращения в поддержку",
  },
  {
    icon: "tree-structure",
    title: "DNS без технических знаний",
    text: "Удобный редактор DNS-записей. Подключите любой сервис в несколько кликов",
  },
];

export default function Panel() {
  return (
    <section className="panel">
      <div className="container panel__inner">
        <div className="panel__content">
          <div className="section-head" data-animate="fade-up">
            <h2 className="section-head__title">Собственная панель управления&nbsp;— всё в&nbsp;одном окне</h2>
          </div>
          <ul className="panel__features" data-animate-group>
            {FEATURES.map((f) => (
              <li key={f.icon} className="panel__feature" data-animate-child>
                <span
                  className="icon-tile panel__feature-icon"
                  aria-hidden="true"
                  style={{ "--icon": `url(/assets/icons/duotone/${f.icon}.svg)` } as CSSProperties}
                />
                <div>
                  <h3 className="panel__feature-title">{f.title}</h3>
                  <p className="panel__feature-text">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <a href="#" className="panel__link" data-animate="fade">
            Смотреть все возможности панели →
          </a>
        </div>
        <div
          className="media-placeholder panel__media"
          data-media="panel-screenshot"
          data-animate="scale-in"
        >
          <span className="media-placeholder__label">panel-screenshot · 16:10</span>
        </div>
      </div>
    </section>
  );
}

import type { CSSProperties } from "react";

const ARTICLES = [
  {
    icon: "lightning",
    category: "WordPress",
    title: "Как ускорить сайт на WordPress: 10 проверенных способов",
    time: "15 мин",
    views: "12 400 просмотров",
  },
  {
    icon: "rocket-launch",
    category: "Начало работы",
    title: "Как создать сайт самостоятельно: пошаговая инструкция 2026",
    time: "20 мин",
    views: "45 200 просмотров",
  },
  {
    icon: "lock-key",
    category: "Безопасность",
    title: "Как защитить сайт от взлома: базовые меры безопасности",
    time: "12 мин",
    views: "8 700 просмотров",
  },
];

export default function Blog() {
  return (
    <section className="blog">
      <div className="container">
        <div className="section-head-row" data-animate="fade-up">
          <div className="section-head">
            <h2 className="section-head__title">Полезные материалы</h2>
            <p className="section-head__sub">Гайды, инструкции, обновления — для владельцев сайтов</p>
          </div>
          <a href="#" className="section-link">Все статьи →</a>
        </div>

        <div className="blog__grid" data-animate-group>
          {ARTICLES.map((a) => (
            <a key={a.title} href="#" className="blog__card hover-lift" data-animate-child>
              <div className="blog__cover">
                <span
                  className="icon blog__cover-icon"
                  aria-hidden="true"
                  style={{ "--icon": `url(/assets/icons/duotone/${a.icon}.svg)` } as CSSProperties}
                />
              </div>
              <div className="blog__body">
                <p className="blog__category">{a.category}</p>
                <h3 className="blog__title">{a.title}</h3>
                <p className="blog__meta">
                  {a.time} · {a.views}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { CSSProperties } from "react";

const ARTICLES = [
  {
    category: "Маркетинг",
    title: "Как ускорить сайт на WordPress: 10 проверенных способов",
    likes: 12,
    comments: 12,
    date: "10 окт 2026",
  },
  {
    category: "Начало работы",
    title: "Как создать сайт самостоятельно: пошаговая инструкция 2026",
    likes: 12,
    comments: 12,
    date: "10 окт 2026",
  },
  {
    category: "Безопасность",
    title: "Как защитить сайт от взлома: базовые меры безопасности",
    likes: 12,
    comments: 12,
    date: "10 окт 2026",
  },
];

const icon = (name: string) =>
  ({ "--icon": `url(/assets/icons/solid/${name}.svg)` } as CSSProperties);

export default function Blog() {
  return (
    <section className="blog">
      <div className="container">
        <h2 className="section-head__title blog__heading">Полезные материалы</h2>

        <div className="blog__grid">
          {ARTICLES.map((a) => (
            <a key={a.title} href="#" className="blog__card hover-lift">
              <div className="blog__top">
                <span className="blog__category">{a.category}</span>
                <span className="blog__stars" aria-label="Оценка 5 из 5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <img key={n} src="/assets/star-full.svg" alt="" width={15} height={15} />
                  ))}
                </span>
              </div>

              <h3 className="blog__title">{a.title}</h3>

              <div className="blog__meta">
                <span className="blog__meta-item">
                  <span className="icon blog__meta-icon" aria-hidden="true" style={icon("thumbs-up")} />
                  {a.likes}
                </span>
                <span className="blog__meta-item">
                  <span className="icon blog__meta-icon" aria-hidden="true" style={icon("chat-circle")} />
                  {a.comments}
                </span>
                <span className="blog__meta-item blog__meta-date">
                  <span className="icon blog__meta-icon" aria-hidden="true" style={icon("calendar-dots")} />
                  {a.date}
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="blog__foot">
          <a href="#" className="btn btn--m btn--white">Перейти в блог компании</a>
        </div>
      </div>
    </section>
  );
}

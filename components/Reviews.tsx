"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";

const PLATFORMS = [
  { key: "all", label: "Все отзывы", rating: "4.8", badge: "★", color: "var(--color-accent)" },
  { key: "yandex", label: "Яндекс", rating: "4.9", badge: "Я", color: "#fc3f1d" },
  { key: "hosters", label: "Hosters", rating: "4.9", badge: "H", color: "#2e9e60" },
  { key: "yell", label: "Yell", rating: "4.8", badge: "Y", color: "#e4002b" },
  { key: "google", label: "Google", rating: "4.7", badge: "G", color: "#4285f4" },
  { key: "tbank", label: "Т-Банк", rating: "4.7", badge: "Т", color: "#ffdd2d", dark: true },
  { key: "hostings", label: "Hostings", rating: "4.5", badge: "★", color: "var(--color-accent)" },
  { key: "2gis", label: "2GIS", rating: "4.9", badge: "2", color: "#19aa1e" },
];

const FILTERS = ["Сервис", "Поддержка", "Цена", "Панель управления", "Интерфейс", "Скорость", "Качество"];

const REVIEW_TEXT =
  "Радует стабильная работа, низкая цена и техподдержка. Все проблемы решаются в кратчайшие сроки, хотя они возникают редко.";

const REVIEWS = Array.from({ length: 8 }, (_, i) => {
  const src = [
    { badge: "Я", color: "#fc3f1d", dark: false, on: "Яндекс" },
    { badge: "Т", color: "#ffdd2d", dark: true, on: "Т-Банк" },
    { badge: "★", color: "var(--color-accent)", dark: false, on: "Hostings" },
  ][i % 3];
  return { id: i, name: "Дмитрий", date: "27 мая", ...src };
});

export default function Reviews() {
  const [platform, setPlatform] = useState("all");
  const [filter, setFilter] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section className="reviews">
      <div className="container">
        <h2 className="section-head__title reviews__heading">Отзывы о Timeweb</h2>

        <div className="reviews__panel">
          <p className="reviews__lead">
            <span className="reviews__lead-accent">75%</span>{" "}
            отзывов наших клиентов&nbsp;— про качественную поддержку
          </p>

          <p className="reviews__rating">
            <img src="/assets/star-full.svg" alt="" width={20} height={20} />
            <strong>4.8</strong>
            <span className="reviews__rating-note">на основе 4302 отзывов</span>
          </p>

          <div className="reviews__platforms" role="group" aria-label="Площадки отзывов">
            {PLATFORMS.map((p) => (
              <button
                key={p.key}
                type="button"
                className={`reviews__platform${platform === p.key ? " reviews__platform--active" : ""}`}
                aria-pressed={platform === p.key}
                onClick={() => setPlatform(p.key)}
              >
                <span
                  className={`reviews__badge${p.dark ? " reviews__badge--dark" : ""}`}
                  style={{ background: p.color } as CSSProperties}
                >
                  {p.badge}
                </span>
                {p.label}
                <span className="reviews__platform-rating">{p.rating}</span>
              </button>
            ))}
          </div>

          <div className="reviews__filters" role="group" aria-label="Темы отзывов">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`reviews__chip${filter === f ? " reviews__chip--active" : ""}`}
                aria-pressed={filter === f}
                onClick={() => setFilter(filter === f ? null : f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="reviews__carousel">
            <button
              type="button"
              className="reviews__arrow reviews__arrow--prev"
              aria-label="Предыдущие отзывы"
              onClick={() => scroll(-1)}
            >
              ‹
            </button>

            <div className="reviews__track" ref={scroller}>
              {REVIEWS.map((r) => (
                <article key={r.id} className="reviews__card">
                  <div className="reviews__person">
                    <span
                      className={`reviews__badge${r.dark ? " reviews__badge--dark" : ""}`}
                      style={{ background: r.color } as CSSProperties}
                    >
                      {r.badge}
                    </span>
                    <div>
                      <p className="reviews__name">{r.name}</p>
                      <p className="reviews__date">
                        {r.date} на {r.on}
                      </p>
                    </div>
                  </div>
                  <div className="reviews__stars" aria-label="Оценка 5 из 5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <img key={n} src="/assets/star-full.svg" alt="" width={16} height={16} />
                    ))}
                  </div>
                  <p className="reviews__text">{REVIEW_TEXT}</p>
                  <a href="#" className="reviews__more">Читать полностью ›</a>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="reviews__arrow reviews__arrow--next"
              aria-label="Следующие отзывы"
              onClick={() => scroll(1)}
            >
              ›
            </button>
          </div>

          <div className="reviews__foot">
            <span className="reviews__credit">Сделано на MyReviews</span>
            <div className="reviews__dots" aria-hidden="true">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className={`reviews__dot${i === 0 ? " reviews__dot--active" : ""}`} />
              ))}
            </div>
            <a href="#" className="btn btn--m btn--dark reviews__cta">Оставить отзыв</a>
          </div>
        </div>
      </div>
    </section>
  );
}

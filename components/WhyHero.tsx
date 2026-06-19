"use client";

import type { MouseEvent } from "react";

// Тёмная карточка-якорь с эффектом «фонарика»: по движению курсора
// двигаем CSS-переменные --mx/--my, маска ::before открывает картинку.
export default function WhyHero() {
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <article className="why__hero" onMouseMove={onMove}>
      <div>
        <p className="why__hero-value">700&nbsp;000</p>
        <p className="why__hero-label">сайтов за 20 лет</p>
      </div>
      <p className="why__hero-note">
        Работаем с 2006 года — один из крупнейших хостеров в РФ и СНГ.
      </p>
    </article>
  );
}

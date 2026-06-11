"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  "Хостинг",
  "VDS/VPS",
  "Почта",
  "Домены",
  "Выделенные серверы",
  "Партнёрам",
  "Ещё",
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    const mq = window.matchMedia("(min-width: 1025px)");
    const onResize = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    mq.addEventListener("change", onResize);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      mq.removeEventListener("change", onResize);
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <a href="#" className="header__logo" aria-label="Timeweb">
        <img src="/assets/timeweb-logo.svg" alt="Timeweb" width={138} height={23} />
      </a>
      <nav className="header__nav" aria-label="Основная навигация">
        {NAV_ITEMS.map((item) => (
          <a key={item} href="#" className="header__nav-link">
            {item}
          </a>
        ))}
      </nav>
      <div className="header__actions">
        <a href="#" className="btn btn--white btn--s">Войти</a>
        <a href="#" className="btn btn--primary btn--s">Регистрация</a>
      </div>
      <button
        className="header__burger"
        type="button"
        aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className="header__burger-line" />
        <span className="header__burger-line" />
        <span className="header__burger-line" />
      </button>
      <div className="header__menu" id="mobile-menu" hidden={!menuOpen}>
        <nav className="header__menu-nav" aria-label="Мобильная навигация">
          {NAV_ITEMS.map((item) => (
            <a key={item} href="#" className="header__menu-link">
              {item}
            </a>
          ))}
        </nav>
        <div className="header__menu-actions">
          <a href="#" className="btn btn--white btn--s">Войти</a>
          <a href="#" className="btn btn--primary btn--s">Регистрация</a>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useEffect } from "react";

// Появление блоков при скролле. Прячем (.reveal) только блоки полностью
// ниже первого экрана — без мигания и без скрытого контента без JS.
// Раскрываем по скроллу, когда блок входит во вьюпорт.
export default function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>("main > section:not(.hero), main > .band")
    );

    const pending = els.filter((el) => {
      if (el.getBoundingClientRect().top >= window.innerHeight) {
        el.classList.add("reveal");
        return true;
      }
      return false;
    });
    if (!pending.length) return;

    const reveal = () => {
      const trigger = window.innerHeight * 0.88;
      for (let i = pending.length - 1; i >= 0; i--) {
        if (pending[i].getBoundingClientRect().top < trigger) {
          pending[i].classList.add("is-revealed");
          pending.splice(i, 1);
        }
      }
      if (!pending.length) {
        window.removeEventListener("scroll", reveal);
        window.removeEventListener("resize", reveal);
      }
    };

    window.addEventListener("scroll", reveal, { passive: true });
    window.addEventListener("resize", reveal, { passive: true });
    reveal();

    return () => {
      window.removeEventListener("scroll", reveal);
      window.removeEventListener("resize", reveal);
    };
  }, []);

  return null;
}

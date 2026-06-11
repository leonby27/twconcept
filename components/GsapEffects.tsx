"use client";

/**
 * Декларативная система анимаций (GSAP + ScrollTrigger).
 * Новые секции анимируются разметкой, без нового JS:
 *
 *   data-intro             — каскад при загрузке (для контента выше фолда)
 *   data-animate="fade-up" — подъём с затуханием при появлении (по умолчанию)
 *   data-animate="fade"    — только затухание
 *   data-animate="scale-in"— лёгкое увеличение
 *   data-animate-delay="0.2" — задержка, сек
 *   data-animate-group + data-animate-child — каскад (stagger) внутри блока
 *
 * prefers-reduced-motion: класс js-anim не ставится (см. layout.tsx),
 * стартовые состояния не применяются, контент виден сразу.
 */

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const EASE = "power2.out";
const DUR = 0.6; // reveal: 500–700ms
const DIST = 24; // сдвиг fade-up, px
const STAGGER = 0.08;

const FROM_VARS: Record<string, gsap.TweenVars> = {
  "fade-up": { autoAlpha: 0, y: DIST },
  fade: { autoAlpha: 0 },
  "scale-in": { autoAlpha: 0, scale: 0.96 },
};

export default function GsapEffects() {
  useGSAP(() => {
    if (!document.documentElement.classList.contains("js-anim")) return;

    // Интро: каскад при загрузке
    const intro = gsap.utils.toArray<HTMLElement>("[data-intro]");
    if (intro.length) {
      gsap.fromTo(
        intro,
        { autoAlpha: 0, y: DIST },
        { autoAlpha: 1, y: 0, duration: DUR, ease: EASE, stagger: 0.1, delay: 0.05 }
      );
    }

    // Reveal по скроллу: одиночные элементы.
    // Старт «вошёл в вьюпорт на 64px», а не «top 85%»: блоки у самого
    // низа страницы иначе могут никогда не пересечь линию триггера.
    const START = "top bottom-=64";

    gsap.utils.toArray<HTMLElement>("[data-animate]").forEach((el) => {
      const type = el.dataset.animate || "fade-up";
      const delay = parseFloat(el.dataset.animateDelay || "0");
      gsap.fromTo(el, FROM_VARS[type] || FROM_VARS["fade-up"], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: DUR,
        ease: EASE,
        delay,
        scrollTrigger: { trigger: el, start: START, once: true },
      });
    });

    // Reveal по скроллу: группы со stagger
    gsap.utils.toArray<HTMLElement>("[data-animate-group]").forEach((group) => {
      const children = group.querySelectorAll<HTMLElement>("[data-animate-child]");
      if (!children.length) return;
      gsap.fromTo(
        children,
        { autoAlpha: 0, y: DIST },
        {
          autoAlpha: 1,
          y: 0,
          duration: DUR,
          ease: EASE,
          stagger: STAGGER,
          scrollTrigger: { trigger: group, start: START, once: true },
        }
      );
    });
  });

  return null;
}

/* ============================================
   Анимации (GSAP 3.15 + ScrollTrigger)
   ============================================

   Декларативная система: новые блоки анимируются разметкой,
   без нового JS.

   data-animate="fade-up"   — подъём с затуханием (по умолчанию)
   data-animate="fade"      — только затухание
   data-animate="scale-in"  — лёгкое увеличение с затуханием
   data-animate-group       — на контейнере: дети с data-animate-child
                              появляются каскадом (stagger)
   data-animate-delay="0.2" — задержка в секундах (опционально)

   Элементы выше фолда анимируются при загрузке (intro),
   остальные — при появлении во вьюпорте (ScrollTrigger).
   prefers-reduced-motion: все анимации отключаются, контент
   просто виден. */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || typeof gsap === 'undefined') {
    // Без анимаций: убираем стартовые состояния, контент виден сразу
    document.documentElement.classList.add('no-anim');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const EASE = 'power2.out';
  const DUR = 0.6;          // reveal-анимации: 500–700ms
  const DIST = 24;          // сдвиг для fade-up, px
  const STAGGER = 0.08;

  const fromVars = {
    'fade-up': { autoAlpha: 0, y: DIST },
    'fade': { autoAlpha: 0 },
    'scale-in': { autoAlpha: 0, scale: 0.96 },
  };

  // ---- Интро hero: каскад при загрузке ----
  const intro = document.querySelectorAll('[data-intro]');
  if (intro.length) {
    gsap.fromTo(
      intro,
      { autoAlpha: 0, y: DIST },
      { autoAlpha: 1, y: 0, duration: DUR, ease: EASE, stagger: 0.1, delay: 0.05 }
    );
  }

  // ---- Reveal по скроллу: одиночные элементы ----
  document.querySelectorAll('[data-animate]').forEach((el) => {
    const type = el.dataset.animate || 'fade-up';
    const delay = parseFloat(el.dataset.animateDelay || '0');
    gsap.fromTo(el, fromVars[type] || fromVars['fade-up'], {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: DUR,
      ease: EASE,
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  });

  // ---- Reveal по скроллу: группы со stagger ----
  document.querySelectorAll('[data-animate-group]').forEach((group) => {
    const children = group.querySelectorAll('[data-animate-child]');
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
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
          once: true,
        },
      }
    );
  });
})();

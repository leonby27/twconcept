"use client";

import { useEffect, useRef } from "react";

// Цветные иллюстрации по бокам hero (слева/справа), слой за контентом.
// Лёгкий параллакс от курсора; на мобиле и при reduced-motion статично.
export default function HeroDecor() {
  const leftRef = useRef<HTMLImageElement>(null);
  const rightRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 1024px)");
    if (calm.matches || small.matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const t = `translate(${(x * 16).toFixed(1)}px, ${(y * 10).toFixed(1)}px)`;
        if (leftRef.current) leftRef.current.style.transform = t;
        if (rightRef.current) rightRef.current.style.transform = t;
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <img
        ref={leftRef}
        className="hero__decor hero__decor--left"
        src="/assets/illustrations/hero-decor-left.png"
        alt=""
        aria-hidden="true"
      />
      <img
        ref={rightRef}
        className="hero__decor hero__decor--right"
        src="/assets/illustrations/hero-decor-right.png"
        alt=""
        aria-hidden="true"
      />
    </>
  );
}

const AVATARS = [1, 2, 3, 4, 5];

const BRANDS = [
  { src: "/assets/brand-nikon.svg", alt: "Nikon", w: 59, h: 17 },
  { src: "/assets/brand-eset.svg", alt: "ESET", w: 45, h: 18 },
  { src: "/assets/brand-otkrytie.svg", alt: "Открытие", w: 99, h: 18 },
  { src: "/assets/brand-mts.svg", alt: "МТС", w: 59, h: 16 },
  { src: "/assets/brand-nikon.svg", alt: "Nikon", w: 59, h: 17 },
  { src: "/assets/brand-alfa.svg", alt: "Альфа Страхование", w: 90, h: 19 },
  { src: "/assets/brand-redmond.svg", alt: "Redmond", w: 89, h: 17 },
  { src: "/assets/brand-eset-2.svg", alt: "ESET", w: 45, h: 18 },
];

const STATS = [
  { value: "20+ лет", label: "работаем в России и СНГ" },
  { value: "400к+", label: "клиентов" },
  { value: "24/7", label: "поддержка" },
  { value: "152 ФЗ", label: "Соответствие закону" },
];

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__rating" data-intro>
        <div className="hero__rating-avatars">
          {AVATARS.map((n) => (
            <img key={n} src={`/assets/avatar-${n}.png`} alt="" width={24} height={24} />
          ))}
        </div>
        <div className="hero__rating-info">
          <p className="hero__rating-text">
            <span className="hero__rating-score">4.9</span>
            <span> на основе </span>
            <span className="hero__rating-reviews">4302 отзывов</span>
          </p>
          <div className="hero__rating-stars">
            {[1, 2, 3, 4].map((n) => (
              <img key={n} src="/assets/star-full.svg" alt="" width={20} height={20} />
            ))}
            <img src="/assets/star-last.svg" alt="" width={20} height={20} />
          </div>
        </div>
      </div>

      <div className="hero__heading">
        <h1 className="hero__title" data-intro>
          Хостинг для сайта&nbsp;— надёжно, быстро и&nbsp;доступно
        </h1>
        <p className="hero__subtitle" data-intro>
          Домен, хостинг, SSL и почта в одном месте. Запустите сайт за 15 минут.
        </p>
      </div>

      <div className="hero__cta" data-intro>
        <div className="hero__cta-buttons">
          <a href="#" className="btn btn--primary btn--l">Начать бесплатно</a>
          <a href="#" className="btn btn--outline btn--l">Смотреть тарифы</a>
        </div>
        <p className="hero__cta-note">10 дней на тест без оплаты и привязки карты</p>
      </div>

      <div className="hero__brands" data-animate="fade">
        <p className="hero__brands-label">Уже с нами</p>
        <div className="hero__brands-row">
          {BRANDS.map((b, i) => (
            <img key={`${b.src}-${i}`} src={b.src} alt={b.alt} width={b.w} height={b.h} />
          ))}
        </div>
      </div>

      <div className="hero__stats" data-animate-group>
        {STATS.map((s) => (
          <div key={s.value} className="hero__stat" data-animate-child>
            <p className="hero__stat-value">{s.value}</p>
            <p className="hero__stat-label">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

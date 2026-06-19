// «Установка любой CMS в 2 клика» — ряд логотипов CMS, заголовок,
// описание со ссылками на популярные CMS и центральный CTA.
const LOGOS = [1, 2, 3, 4, 5, 6];

export default function Cms() {
  return (
    <section className="cms">
      <div className="container cms__inner">
        <div className="cms__logos" aria-hidden="true">
          {LOGOS.map((n) => (
            <span key={n} className="cms__logo">
              <img src={`/assets/cms/cms-${n}.svg`} alt="" width={60} height={60} loading="lazy" />
            </span>
          ))}
        </div>

        <h2 className="cms__title">Установка любой CMS в 2 клика</h2>

        <p className="cms__text">
          Наш хостинг специально оптимизирован для{" "}
          <a href="#" className="cms__link">WordPress</a>,{" "}
          <a href="#" className="cms__link">Joomla</a>,{" "}
          <a href="#" className="cms__link">Drupal</a>,{" "}
          <a href="#" className="cms__link">OpenCart</a> и других систем управления контентом
        </p>

        <a href="#" className="btn btn--dark cms__cta">
          Создать сайт с автоустановкой CMS
        </a>
      </div>
    </section>
  );
}

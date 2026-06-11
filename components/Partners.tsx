const STATS = [
  { value: "30%", label: "с каждого платежа" },
  { value: "∞", label: "клиентов без лимита" },
];

export default function Partners() {
  return (
    <section className="partners">
      <div className="container">
        <div className="partners__banner" data-animate="fade-up">
          <div className="partners__info">
            <h2 className="partners__title">Рекомендуйте Timeweb — зарабатывайте</h2>
            <p className="partners__text">
              Партнёрская программа для вебмастеров, блогеров, IT-фрилансеров и агентств.
              Получайте доход пока клиент пользуется услугами.
            </p>
          </div>
          <div className="partners__stats">
            {STATS.map((s) => (
              <div key={s.value} className="partners__stat">
                <p className="partners__stat-value">{s.value}</p>
                <p className="partners__stat-label">{s.label}</p>
              </div>
            ))}
          </div>
          <a href="#" className="btn btn--m btn--primary partners__cta">
            Стать партнёром →
          </a>
        </div>
      </div>
    </section>
  );
}

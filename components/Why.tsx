import WhyHero from "./WhyHero";

// «Почему выбирают Timeweb»: тёмная карточка-якорь с главной цифрой
// (700 000) + сетка 2×2 фактов. Отзыв вынесен в отдельный блок (Testimonial).
const STATS = [
  {
    value: "99.98%",
    label: "SLA uptime",
    text: "Гарантируем доступность по договору. Серверы на быстрых NVMe-дисках.",
  },
  {
    value: "10 минут",
    label: "Поддержка 24/7",
    text: "80% вопросов решаем в первые 10 минут. Без выходных и праздников.",
  },
  {
    value: "1 клик",
    label: "восстановление из бэкапа",
    text: "Автоматические резервные копии каждый день, прямо из панели.",
  },
  {
    value: "152-ФЗ",
    label: "защита персональных данных",
    text: "Дата-центры в России. Полное соответствие требованиям закона.",
  },
];

export default function Why() {
  return (
    <section className="why">
      <div className="container">
        <h2 className="section-head__title why__heading">Почему выбирают Timeweb</h2>

        <div className="why__bento">
          <WhyHero />

          <div className="why__stats">
            {STATS.map((s) => (
              <article key={s.value} className="why__stat">
                <p className="why__stat-value">{s.value}</p>
                <p className="why__stat-label">{s.label}</p>
                <p className="why__stat-text">{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

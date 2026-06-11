const CARDS = [
  {
    stat: "10 минут",
    label: "Поддержка 24/7",
    text: "80% вопросов решаем в первые 10 минут. Без выходных и праздников.",
    lead: true,
  },
  {
    stat: "99.98%",
    label: "SLA uptime",
    text: "Гарантируем доступность по договору. Серверы на быстрых NVMe-дисках.",
    fill: "white",
  },
  {
    stat: "700 000",
    label: "сайтов за 20 лет",
    text: "Работаем с 2006 года — крупнейший хостер РФ.",
    fill: "surface",
  },
  {
    stat: "1 клик",
    label: "восстановление из бэкапа",
    text: "Автоматические резервные копии каждый день, прямо из панели.",
    fill: "surface",
  },
  {
    stat: "152-ФЗ",
    label: "защита персональных данных",
    text: "Дата-центры в России. Полное соответствие требованиям закона.",
    fill: "white",
  },
];

export default function Why() {
  return (
    <section className="why">
      <div className="container">
        <div className="section-head" data-animate="fade-up">
          <h2 className="section-head__title">Почему выбирают Timeweb</h2>
          <p className="section-head__sub">Проверено 200 000 клиентов за 20 лет</p>
        </div>

        <div className="why__grid" data-animate-group>
          {CARDS.map((card) => (
            <article
              key={card.stat}
              className={`why__card${card.lead ? " why__card--lead" : ` why__card--${card.fill}`}`}
              data-animate-child
            >
              <p className="why__stat">{card.stat}</p>
              <div className="why__body">
                <p className="why__label">{card.label}</p>
                <p className="why__text">{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const REVIEWS = [
  {
    avatar: "/assets/avatar-1.png",
    name: "Алексей Морозов",
    role: "Владелец интернет-магазина",
    site: "shop-example.ru",
    stars: 5,
    text: "Работаем с Timeweb уже 6 лет. Ни разу не было серьёзных проблем с доступностью. Поддержка отвечает за 5 минут — это редкость. Рекомендую всем коллегам.",
    switched: "перешли с reg.ru",
    source: "Отзыв подтверждён",
  },
  {
    avatar: "/assets/avatar-2.png",
    name: "Мария Кузнецова",
    role: "Фрилансер-разработчик",
    site: "mkuznetsova.ru",
    stars: 5,
    text: "Перенесла 15 проектов клиентов на Timeweb — всё прошло без единой проблемы. Панель удобная, цены адекватные. Особенно нравятся ежедневные бэкапы.",
    switched: "перешли с beget.com",
    source: "Яндекс.Отзывы",
  },
  {
    avatar: "/assets/avatar-3.png",
    name: "Дмитрий Павлов",
    role: "Блогер",
    site: "dpblog.ru",
    stars: 4,
    text: "Выбрал Timeweb для своего блога — всё работает стабильно уже 3 года. WordPress установил за 2 клика. Домен получил бесплатно при оплате за год.",
    switched: "перешли с sweb.ru",
    source: "otzovik.com",
  },
];

export default function Reviews() {
  return (
    <section className="reviews">
      <div className="container">
        <div className="section-head-row" data-animate="fade-up">
          <div className="section-head">
            <h2 className="section-head__title">Что говорят клиенты</h2>
          </div>
          <a href="#" className="section-link">Все отзывы →</a>
        </div>

        <div className="reviews__grid" data-animate-group>
          {REVIEWS.map((r) => (
            <article key={r.name} className="reviews__card hover-lift" data-animate-child>
              <div className="reviews__person">
                <img className="reviews__avatar" src={r.avatar} alt="" width={44} height={44} />
                <div>
                  <p className="reviews__name">{r.name}</p>
                  <p className="reviews__role">
                    {r.role} · {r.site}
                  </p>
                </div>
              </div>
              <div className="reviews__stars" aria-label={`Оценка ${r.stars} из 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <img
                    key={n}
                    src="/assets/star-full.svg"
                    alt=""
                    width={16}
                    height={16}
                    className={n > r.stars ? "reviews__star--empty" : undefined}
                  />
                ))}
              </div>
              <p className="reviews__text">«{r.text}»</p>
              <p className="reviews__footer">
                <span className="reviews__switched">{r.switched}</span>
                <span className="reviews__source">{r.source}</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

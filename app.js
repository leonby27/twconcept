/* Timeweb concept — статическая версия. Вся интерактивность из бывших
   client-компонентов, на ванильном JS. */
(function () {
  "use strict";

  var fmt = function (n) { return n.toLocaleString("ru-RU"); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Header: бургер-меню ---------- */
  (function () {
    var burger = document.querySelector(".header__burger");
    var menu = document.getElementById("mobile-menu");
    if (!burger || !menu) return;
    var open = false;
    var set = function (v) {
      open = v;
      document.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
      if (open) menu.removeAttribute("hidden"); else menu.setAttribute("hidden", "");
    };
    burger.addEventListener("click", function () { set(!open); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
    window.matchMedia("(min-width: 1025px)").addEventListener("change", function (e) {
      if (e.matches) set(false);
    });
    // закрывать по клику на пункт
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { set(false); });
    });
  })();

  /* ---------- FAQ: аккордеон ---------- */
  document.querySelectorAll(".faq__question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq__item");
      var isOpen = item.classList.toggle("faq__item--open");
      btn.setAttribute("aria-expanded", String(isOpen));
    });
  });

  /* ---------- Pricing: период (категория — косметика) ---------- */
  (function () {
    var PERIODS = {
      month: { months: 1, off: 0 },
      year: { months: 12, off: 0.3 },
      three: { months: 36, off: 0.5 },
    };
    var bases = [234, 354, 496, 689]; // Year+ / Optimo+ / Century+ / Millenium+
    var cards = document.querySelectorAll(".pricing__grid .pricing__card");
    var periodSeg = document.querySelector(".pricing__seg--period");
    if (!cards.length || !periodSeg) return;

    var order = ["month", "year", "three"];
    function render(periodId) {
      var p = PERIODS[periodId];
      var word = p.months === 1 ? "месяц" : "месяцев";
      cards.forEach(function (card, i) {
        var base = bases[i];
        if (base == null) return;
        var price = Math.round(base * (1 - p.off));
        var total = price * p.months;
        var save = (base - price) * p.months;
        var pv = card.querySelector(".pricing__price-value");
        var tt = card.querySelector(".pricing__total");
        var sv = card.querySelector(".pricing__save");
        if (pv) pv.innerHTML = fmt(price) + "&nbsp;₽";
        if (tt) tt.textContent = fmt(total) + " ₽ за " + p.months + " " + word;
        if (sv) {
          if (save > 0) { sv.textContent = "Экономия " + fmt(save) + " ₽"; sv.classList.remove("pricing__save--empty"); }
          else { sv.textContent = ""; sv.classList.add("pricing__save--empty"); }
        }
      });
    }

    periodSeg.querySelectorAll(".pricing__seg-btn").forEach(function (btn, idx) {
      btn.addEventListener("click", function () {
        periodSeg.querySelectorAll(".pricing__seg-btn").forEach(function (b) {
          b.classList.remove("pricing__seg-btn--active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("pricing__seg-btn--active");
        btn.setAttribute("aria-pressed", "true");
        render(order[idx] || "year");
      });
    });

    // Категория — только переключение активной кнопки
    var catSeg = document.querySelector(".pricing__seg:not(.pricing__seg--period)");
    if (catSeg) {
      catSeg.querySelectorAll(".pricing__seg-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          catSeg.querySelectorAll(".pricing__seg-btn").forEach(function (b) {
            b.classList.remove("pricing__seg-btn--active");
            b.setAttribute("aria-pressed", "false");
          });
          btn.classList.add("pricing__seg-btn--active");
          btn.setAttribute("aria-pressed", "true");
        });
      });
    }
  })();

  /* ---------- Final CTA: выбор сценария → две рекомендации ---------- */
  (function () {
    var PLANS = {
      "Year+": { name: "Year+", save: 600, price: 164, total: 1968, features: [
        ["2 сайта", "с изоляцией", true], ["15 ГБ", "на NVMe-дисках", true],
        ["5", "Баз Данных", false], ["10 Гб", "почтовой квоты", false], ["Стандартный", "CPU и MySQL", false] ] },
      "Optimo+": { name: "Optimo+", save: 752, price: 248, total: 2976, features: [
        ["15", "сайтов с изоляцией", true], ["40 ГБ", "на NVMe-дисках", true],
        ["∞", "Базы Данных", false], ["10 Гб", "почтовой квоты", false], ["+250%", "CPU и MySQL", false] ] },
      "Century+": { name: "Century+", save: 1772, price: 347, total: 4164, features: [
        ["35", "сайтов с изоляцией", true], ["50 ГБ", "на NVMe-дисках", true],
        ["∞", "Базы Данных", false], ["10 Гб", "почтовой квоты", false], ["+350%", "CPU и MySQL", false] ] },
      "Millenium+": { name: "Millenium+", save: 2400, price: 482, total: 5784, features: [
        ["60", "сайтов с изоляцией", true], ["60 ГБ", "на NVMe-дисках", true],
        ["∞", "Базы Данных", false], ["10 Гб", "почтовой квоты", false], ["+550%", "CPU и MySQL", false] ] },
    };
    var SCENARIOS = [
      { label: "Лэндинг", primary: "Year+", secondary: "Optimo+" },
      { label: "Сайт компании", primary: "Optimo+", secondary: "Year+" },
      { label: "Интернет-магазин", primary: "Century+", secondary: "Millenium+" },
      { label: "Я разработчик", primary: "Optimo+", secondary: "Century+" },
      { label: "Веб-студия", primary: "Century+", secondary: "Millenium+" },
      { label: "Сложный проект", primary: "Millenium+", secondary: "Century+" },
    ];
    var CHECK = "url(assets/icons/solid/check.svg)";
    var INFO = "url(assets/icons/solid/info.svg)";
    var cardsWrap = document.querySelector(".reco__cards");
    var chips = document.querySelectorAll(".reco-scenario");
    if (!cardsWrap || !chips.length) return;

    function featureHTML(f) {
      var info = f[2] ? '<span class="icon reco-card__info" aria-hidden="true" style="--icon: ' + INFO + '"></span>' : "";
      var rest = f[1] ? " " + f[1] : "";
      return '<li class="reco-card__feature">' +
        '<span class="icon reco-card__check" aria-hidden="true" style="--icon: ' + CHECK + '"></span>' +
        '<span class="reco-card__feature-text"><b class="reco-card__feature-b">' + f[0] + "</b>" + rest + info + "</span></li>";
    }
    function cardHTML(plan, variant) {
      var isPrimary = variant === "primary";
      var badge = isPrimary ? '<span class="reco-card__badge">Рекомендуем</span>' : "";
      var cta = isPrimary ? "btn--dark" : "btn--white";
      return '<article class="reco-card reco-card--' + variant + '">' + badge +
        '<div class="reco-card__head">' +
          '<h3 class="reco-card__name">' + plan.name + "</h3>" +
          '<span class="reco-card__save">Экономия ' + fmt(plan.save) + " ₽</span>" +
          '<p class="reco-card__price"><span class="reco-card__price-value">' + fmt(plan.price) + "&nbsp;₽</span>" +
            '<span class="reco-card__price-suffix">/мес</span></p>' +
          '<p class="reco-card__total">' + fmt(plan.total) + " ₽ за 12 месяцев</p>" +
        "</div>" +
        '<a href="#" class="btn reco-card__cta ' + cta + '">Начать бесплатно</a>' +
        '<ul class="reco-card__features">' + plan.features.map(featureHTML).join("") + "</ul>" +
        "</article>";
    }
    function pairKey(s) {
      return [PLANS[s.primary], PLANS[s.secondary]]
        .sort(function (a, b) { return a.price - b.price; })
        .map(function (p) { return p.name; }).join("__");
    }

    var lastKey = pairKey(SCENARIOS[1]); // дефолт — «Сайт компании»
    function select(i) {
      var s = SCENARIOS[i];
      var key = pairKey(s);
      var animate = key !== lastKey;
      lastKey = key;
      var cards = [
        { plan: PLANS[s.primary], variant: "primary" },
        { plan: PLANS[s.secondary], variant: "secondary" },
      ].sort(function (a, b) { return a.plan.price - b.plan.price; });
      cardsWrap.innerHTML = cards.map(function (c) { return cardHTML(c.plan, c.variant); }).join("");
      if (!animate || reduce.matches) {
        cardsWrap.querySelectorAll(".reco-card").forEach(function (el) { el.style.animation = "none"; });
      }
    }

    chips.forEach(function (chip, i) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) {
          c.classList.remove("reco-scenario--active");
          c.setAttribute("aria-checked", "false");
        });
        chip.classList.add("reco-scenario--active");
        chip.setAttribute("aria-checked", "true");
        select(i);
      });
    });
  })();

  /* ---------- WhyHero: эффект «фонарика» ---------- */
  (function () {
    var hero = document.querySelector(".why__hero");
    if (!hero) return;
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", e.clientX - r.left + "px");
      hero.style.setProperty("--my", e.clientY - r.top + "px");
    });
  })();

  /* ---------- Hero decor: параллакс от курсора ---------- */
  (function () {
    var left = document.querySelector(".hero__decor--left");
    var right = document.querySelector(".hero__decor--right");
    if (!left && !right) return;
    if (reduce.matches || window.matchMedia("(max-width: 1024px)").matches) return;
    var raf = 0;
    window.addEventListener("mousemove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var t = "translate(" + (x * 16).toFixed(1) + "px, " + (y * 10).toFixed(1) + "px)";
        if (left) left.style.transform = t;
        if (right) right.style.transform = t;
      });
    });
  })();

  /* ---------- Появление блоков при скролле ---------- */
  (function () {
    if (reduce.matches) return;
    var els = Array.prototype.slice.call(
      document.querySelectorAll("main > section:not(.hero), main > .band")
    );
    var pending = els.filter(function (el) {
      if (el.getBoundingClientRect().top >= window.innerHeight) {
        el.classList.add("reveal");
        return true;
      }
      return false;
    });
    if (!pending.length) return;
    function reveal() {
      var trigger = window.innerHeight * 0.88;
      for (var i = pending.length - 1; i >= 0; i--) {
        if (pending[i].getBoundingClientRect().top < trigger) {
          pending[i].classList.add("is-revealed");
          pending.splice(i, 1);
        }
      }
      if (!pending.length) {
        window.removeEventListener("scroll", reveal);
        window.removeEventListener("resize", reveal);
      }
    }
    window.addEventListener("scroll", reveal, { passive: true });
    window.addEventListener("resize", reveal, { passive: true });
    reveal();
  })();
})();

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

    /* Бегунок сегмент-контролов: белая плашка переезжает к активной кнопке. */
    function setupThumb(seg) {
      if (!seg) return null;
      var thumb = document.createElement("span");
      thumb.className = "pricing__seg-thumb";
      thumb.setAttribute("aria-hidden", "true");
      seg.insertBefore(thumb, seg.firstChild);
      seg.classList.add("pricing__seg--thumbed");
      return thumb;
    }
    function moveThumb(thumb, btn, animate) {
      if (!thumb || !btn) return;
      var keep;
      if (!animate) { keep = thumb.style.transition; thumb.style.transition = "none"; }
      thumb.style.width = btn.offsetWidth + "px";
      thumb.style.height = btn.offsetHeight + "px";
      thumb.style.transform = "translate(" + btn.offsetLeft + "px, " + btn.offsetTop + "px)";
      if (!animate) { void thumb.offsetHeight; thumb.style.transition = keep; }
    }
    function activeBtn(seg) {
      return seg.querySelector(".pricing__seg-btn--active") ||
        seg.querySelector(".pricing__seg-btn");
    }

    /* Одометр цены: строим колонки 0–9 для каждой цифры и катаем их к нужной
       цифре через translateY. Высоту ячейки берём из line-height значения. */
    function buildOdo(valueEl) {
      var cell = parseFloat(getComputedStyle(valueEl).lineHeight) || 44;
      valueEl.textContent = "";
      var odo = document.createElement("span");
      odo.className = "price-odo";
      odo.setAttribute("aria-hidden", "true");
      var sr = document.createElement("span");
      sr.className = "visually-hidden";
      valueEl.appendChild(odo);
      valueEl.appendChild(sr);
      valueEl.appendChild(document.createTextNode(" ₽"));
      return { odo: odo, sr: sr, cols: [], cell: cell };
    }

    function setOdo(state, num, animate) {
      var str = String(num);
      state.sr.textContent = str + " ₽";
      if (state.cols.length !== str.length) {
        state.odo.textContent = "";
        state.cols = [];
        for (var i = 0; i < str.length; i++) {
          var digit = document.createElement("span");
          digit.className = "price-odo__digit";
          digit.style.height = state.cell + "px";
          var track = document.createElement("span");
          track.className = "price-odo__track";
          for (var d = 0; d <= 9; d++) {
            var s = document.createElement("span");
            s.style.height = state.cell + "px";
            s.style.lineHeight = state.cell + "px";
            s.textContent = String(d);
            track.appendChild(s);
          }
          digit.appendChild(track);
          state.odo.appendChild(digit);
          state.cols.push(track);
        }
      }
      for (var j = 0; j < str.length; j++) {
        var dv = parseInt(str.charAt(j), 10);
        var trk = state.cols[j];
        var y = "translateY(" + (-dv * state.cell) + "px)";
        if (animate) {
          trk.style.transform = y;
        } else {
          var keep = trk.style.transition;
          trk.style.transition = "none";
          trk.style.transform = y;
          void trk.offsetHeight; // зафиксировать без анимации
          trk.style.transition = keep;
        }
      }
    }

    var odos = [];
    cards.forEach(function (card) {
      var pv = card.querySelector(".pricing__price-value");
      odos.push(pv ? buildOdo(pv) : null);
    });

    function render(periodId, animate) {
      var p = PERIODS[periodId];
      var word = p.months === 1 ? "месяц" : "месяцев";
      cards.forEach(function (card, i) {
        var base = bases[i];
        if (base == null) return;
        var price = Math.round(base * (1 - p.off));
        var total = price * p.months;
        var save = (base - price) * p.months;
        var tt = card.querySelector(".pricing__total");
        var sv = card.querySelector(".pricing__save");
        if (odos[i]) setOdo(odos[i], price, animate);
        if (tt) tt.textContent = fmt(total) + " ₽ за " + p.months + " " + word;
        if (sv) {
          if (save > 0) { sv.textContent = "Экономия " + fmt(save) + " ₽"; sv.classList.remove("pricing__save--empty"); }
          else { sv.textContent = ""; sv.classList.add("pricing__save--empty"); }
        }
      });
    }

    var periodThumb = setupThumb(periodSeg);
    periodSeg.querySelectorAll(".pricing__seg-btn").forEach(function (btn, idx) {
      btn.addEventListener("click", function () {
        periodSeg.querySelectorAll(".pricing__seg-btn").forEach(function (b) {
          b.classList.remove("pricing__seg-btn--active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("pricing__seg-btn--active");
        btn.setAttribute("aria-pressed", "true");
        moveThumb(periodThumb, btn, true);
        render(order[idx] || "year", true);
      });
    });

    // Инициализация одометра под активный период (без анимации).
    var activeIdx = 0;
    periodSeg.querySelectorAll(".pricing__seg-btn").forEach(function (b, i) {
      if (b.classList.contains("pricing__seg-btn--active")) activeIdx = i;
    });
    render(order[activeIdx] || "year", false);

    // На мобиле тарифы — горизонтальная лента: по умолчанию центрируем
    // Optimo+, а «Подобрать тариф» переносим вниз, под карточки.
    (function () {
      var grid = document.querySelector(".pricing__grid");
      var popular = document.querySelector(".pricing__card--popular");
      var pick = document.querySelector(".pricing__pick");
      if (!grid || !popular) return;
      var mq = window.matchMedia("(max-width: 768px)");
      var pickHome = pick && pick.parentNode; // .pricing__controls

      function placePick() {
        if (!pick) return;
        if (mq.matches) {
          if (pick.parentNode !== grid.parentNode) {
            grid.parentNode.insertBefore(pick, grid.nextSibling);
            pick.classList.add("pricing__pick--below");
          }
        } else if (pickHome && pick.parentNode !== pickHome) {
          pickHome.appendChild(pick);
          pick.classList.remove("pricing__pick--below");
        }
      }
      function centerPopular() {
        if (!mq.matches) return;
        var gridRect = grid.getBoundingClientRect();
        var pRect = popular.getBoundingClientRect();
        var delta = (pRect.left - gridRect.left) - (grid.clientWidth - popular.offsetWidth) / 2;
        grid.scrollLeft += delta;
      }
      function sync() { placePick(); centerPopular(); }
      requestAnimationFrame(sync);
      window.addEventListener("load", sync);
      mq.addEventListener("change", sync);
    })();

    // Категория — только переключение активной кнопки
    var catSeg = document.querySelector(".pricing__seg:not(.pricing__seg--period)");
    var catThumb = catSeg ? setupThumb(catSeg) : null;
    if (catSeg) {
      catSeg.querySelectorAll(".pricing__seg-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          catSeg.querySelectorAll(".pricing__seg-btn").forEach(function (b) {
            b.classList.remove("pricing__seg-btn--active");
            b.setAttribute("aria-pressed", "false");
          });
          btn.classList.add("pricing__seg-btn--active");
          btn.setAttribute("aria-pressed", "true");
          moveThumb(catThumb, btn, true);
        });
      });
    }

    // Стартовое позиционирование бегунков (без анимации) + перерасчёт при
    // изменении ширины/после загрузки шрифтов, когда меняются размеры кнопок.
    function placeThumbs() {
      moveThumb(periodThumb, activeBtn(periodSeg), false);
      if (catSeg) moveThumb(catThumb, activeBtn(catSeg), false);
    }
    requestAnimationFrame(placeThumbs);
    window.addEventListener("load", placeThumbs);
    window.addEventListener("resize", placeThumbs, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeThumbs);
  })();

  /* ---------- Pricing: тултипы на info-иконках ---------- */
  (function () {
    var TIPS = {
      nvme: "NVMe-накопители: чтение и запись в разы быстрее обычных SSD.",
      isolation: "Изоляция сайтов — защита от вредоносного ПО и атак.",
    };
    var icons = document.querySelectorAll(".pricing__info");
    icons.forEach(function (icon) {
      var holder = icon.closest(".pricing__feature-text") || icon.parentNode;
      var txt = (holder && holder.textContent) || "";
      var tip = /NVMe/i.test(txt) ? TIPS.nvme : /изоляц/i.test(txt) ? TIPS.isolation : null;
      if (!tip) return;

      // Иконку нельзя сделать якорем тултипа (её обрезает mask) — оборачиваем.
      var wrap = document.createElement("span");
      wrap.className = "tip";
      wrap.setAttribute("tabindex", "0");
      wrap.setAttribute("role", "button");
      wrap.setAttribute("aria-label", tip);
      icon.parentNode.insertBefore(wrap, icon);
      wrap.appendChild(icon);

      var bubble = document.createElement("span");
      bubble.className = "tip__bubble";
      bubble.setAttribute("role", "tooltip");
      bubble.textContent = tip;
      wrap.appendChild(bubble);
    });
  })();

  /* ---------- Migration illu: рандомная смена иконок на бейджах ----------
     Пул из 6 иконок (монитор/почта/глобус/бонус/сервер/щит). На каждом витке,
     пока бейдж скрыт у центра, иконка меняется на случайную (без повтора
     подряд). reduced-motion — остаются исходные иконки из разметки. */
  (function () {
    if (reduce.matches) return;
    var POOL = ["monitor", "envelope-simple", "globe", "gift", "hard-drives", "shield"]
      .map(function (n) { return "url(assets/icons/solid/" + n + ".svg)"; });
    var icons = Array.prototype.slice.call(
      document.querySelectorAll(".illu__badge .icon")
    );
    if (!icons.length) return;
    icons.forEach(function (ic) {
      var last = null;
      function pick() {
        var u;
        do { u = POOL[(Math.random() * POOL.length) | 0]; } while (u === last && POOL.length > 1);
        last = u;
        return u;
      }
      ic.style.setProperty("--icon", pick());
      var badge = ic.closest(".illu__badge");
      if (badge) {
        badge.addEventListener("animationiteration", function () {
          ic.style.setProperty("--icon", pick());
        });
      }
    });
  })();

  /* ---------- Final CTA: выбор сценария → один рекомендуемый тариф ---------- */
  (function () {
    var PLANS = {
      "Year+": { name: "Year+", price: 164, total: 1968, save: 840, features: [
        ["2", "сайта с изоляцией", true], ["15 ГБ", "на NVMe-дисках", true],
        ["5", "Базы Данных", false], ["Стандартный", "CPU и MySQL", false] ] },
      "Optimo+": { name: "Optimo+", price: 248, total: 2976, save: 1272, features: [
        ["15", "сайтов с изоляцией", true], ["40 ГБ", "на NVMe-дисках", true],
        ["∞", "Базы Данных", false], ["+250%", "CPU и MySQL", false] ] },
      "Century+": { name: "Century+", price: 347, total: 4164, save: 1788, features: [
        ["35", "сайтов с изоляцией", true], ["50 ГБ", "на NVMe-дисках", true],
        ["∞", "Базы Данных", false], ["+350%", "CPU и MySQL", false] ] },
      "Millenium+": { name: "Millenium+", price: 482, total: 5784, save: 2484, features: [
        ["60", "сайтов с изоляцией", true], ["60 ГБ", "на NVMe-дисках", true],
        ["∞", "Базы Данных", false], ["+550%", "CPU и MySQL", false] ] },
    };
    // Каждый сценарий → рекомендуемый тариф и своё описание.
    var SCENARIOS = [
      { plan: "Year+",      desc: "Быстрый старт для лендинга или небольшого сайта — всё необходимое уже включено" },
      { plan: "Optimo+",    desc: "Больше ресурсов для стабильной работы сайта компании, базы данных и сервисов" },
      { plan: "Century+",   desc: "Запас мощности и места под каталог, корзину и пиковые нагрузки магазина" },
      { plan: "Optimo+",    desc: "Гибкая среда с изоляцией и базами данных для пет-проектов и клиентских сайтов" },
      { plan: "Century+",   desc: "Десятки изолированных сайтов на одном аккаунте — удобно вести проекты клиентов" },
      { plan: "Millenium+", desc: "Максимум дисков, баз данных и CPU для нагруженных highload-проектов" },
    ];
    var CHECK = "url(assets/icons/solid/check.svg)";
    var INFO = "url(assets/icons/solid/info.svg)";
    var result = document.querySelector(".reco__result");
    var custom = document.querySelector(".reco-card");      // десктоп (Figma 2 колонки)
    var tariff = document.querySelector(".reco-tariff");    // мобайл (стандартная карточка)
    var chips = document.querySelectorAll(".reco-scenario");
    if (!result || !chips.length) return;

    // Десктоп-карточка: чипы-пилюли.
    function pillHTML(f) {
      var info = f[2] ? '<span class="icon reco-card__info" aria-hidden="true" style="--icon: ' + INFO + '"></span>' : "";
      var rest = f[1] ? " " + f[1] : "";
      return '<div class="reco-card__feature">' +
        '<span class="icon reco-card__check" aria-hidden="true" style="--icon: ' + CHECK + '"></span>' +
        '<span class="reco-card__feature-text"><b class="reco-card__feature-b">' + f[0] + "</b>" + rest + info + "</span></div>";
    }
    // Мобайл-карточка: чек-лист как в сетке тарифов.
    function liHTML(f) {
      var info = f[2] ? '<span class="icon pricing__info" aria-hidden="true" style="--icon: ' + INFO + '"></span>' : "";
      var rest = f[1] ? " " + f[1] : "";
      return '<li class="pricing__feature">' +
        '<span class="icon pricing__check" aria-hidden="true" style="--icon: ' + CHECK + '"></span>' +
        '<span class="pricing__feature-text"><b class="pricing__feature-b">' + f[0] + "</b>" + rest + info + "</span></li>";
    }
    function set(root, sel, val, html) {
      var el = root && root.querySelector(sel);
      if (el) { if (html) el.innerHTML = val; else el.textContent = val; }
    }
    function render(i) {
      var s = SCENARIOS[i];
      var plan = PLANS[s.plan];
      var price = fmt(plan.price) + "&nbsp;₽";
      var total = fmt(plan.total) + " ₽ за 12 месяцев";
      // Десктоп (кастом)
      if (custom) {
        set(custom, ".reco-card__name", plan.name);
        set(custom, ".reco-card__desc", s.desc);
        set(custom, ".reco-card__price-value", price, true);
        set(custom, ".reco-card__total", total);
        custom.querySelector(".reco-card__features").innerHTML = plan.features.map(pillHTML).join("");
      }
      // Мобайл (стандартная)
      if (tariff) {
        set(document, ".reco__desc", s.desc);
        set(tariff, ".pricing__name", plan.name);
        set(tariff, ".pricing__save", "Экономия " + fmt(plan.save) + " ₽");
        set(tariff, ".pricing__price-value", price, true);
        set(tariff, ".pricing__total", total);
        tariff.querySelector(".pricing__features").innerHTML = plan.features.map(liHTML).join("");
      }
      // Мягкий fade содержимого при смене сценария.
      if (!reduce.matches) {
        result.classList.remove("reco__result--swap");
        void result.offsetWidth;
        result.classList.add("reco__result--swap");
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
        render(i);
      });
    });
    // Дефолт — «Сайт компании» (index 1): карточка уже отрендерена в HTML.
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
        var t = "translate(" + (x * 9).toFixed(1) + "px, " + (y * 6).toFixed(1) + "px)";
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

  /* ---------- Metrics: цифры «накручиваются» при появлении ----------
     Каждое значение парсим на ведущее число + суффикс («400к+» → 400 / «к+»),
     считаем от 0 до цели с easeOut и ступенчатой задержкой по колонкам.
     reduced-motion / без JS — число сразу финальное. */
  (function () {
    if (reduce.matches) return;
    var values = Array.prototype.slice.call(
      document.querySelectorAll(".metrics__stat-value")
    );
    if (!values.length) return;

    var items = values
      .map(function (el) {
        var m = el.textContent.match(/^(\d+)([\s\S]*)$/);
        if (!m) return null;
        return { el: el, target: parseInt(m[1], 10), suffix: m[2] };
      })
      .filter(Boolean);
    if (!items.length) return;

    // Стартовое состояние — 0 (секция ниже первого экрана и так скрыта .reveal,
    // так что мелькания не будет; выше — мелькнёт один кадр).
    items.forEach(function (it) {
      it.el.textContent = "0" + it.suffix;
    });

    function count(it, duration) {
      var t0 = null;
      function frame(now) {
        if (t0 === null) t0 = now;
        var p = Math.min((now - t0) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        it.el.textContent = fmt(Math.round(eased * it.target)) + it.suffix;
        if (p < 1) requestAnimationFrame(frame);
        else it.el.textContent = fmt(it.target) + it.suffix;
      }
      requestAnimationFrame(frame);
    }

    var panel = document.querySelector(".metrics__panel") || items[0].el;
    var started = false;
    function start() {
      if (started) return;
      if (panel.getBoundingClientRect().top >= window.innerHeight * 0.85) return;
      started = true;
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", start);
      items.forEach(function (it, i) {
        setTimeout(function () {
          count(it, 1100);
        }, i * 140);
      });
    }
    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", start, { passive: true });
    start();
  })();

  /* ---------- Migration: слово «бесплатно.» проявляется по буквам ---------- */
  (function () {
    var wrap = document.querySelector(".migration__type");
    if (!wrap) return;
    var textEl = wrap.querySelector(".migration__type-text");
    var WORD = "бесплатно.";
    var STAGGER = 55;  // мс между буквами

    // Без анимации — сразу показываем слово целиком.
    if (reduce.matches) {
      textEl.textContent = WORD;
      return;
    }

    var started = false;
    function start() {
      if (started) return;
      started = true;

      // Раскладываем слово по буквам, каждой — своя задержка.
      textEl.textContent = "";
      for (var i = 0; i < WORD.length; i++) {
        var ch = document.createElement("span");
        ch.className = "migration__char";
        ch.textContent = WORD[i];
        ch.style.animationDelay = (i * STAGGER) + "ms";
        textEl.appendChild(ch);
      }
      wrap.classList.add("is-revealing");
    }

    // Триггер по скроллу (как у reveal-блоков) — надёжнее IntersectionObserver.
    function check() {
      if (wrap.getBoundingClientRect().top < window.innerHeight * 0.82) {
        start();
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    check();
  })();
})();

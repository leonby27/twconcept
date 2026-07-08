/* Timeweb concept — статическая версия. Вся интерактивность из бывших
   client-компонентов, на ванильном JS. */
(function () {
  "use strict";

  var fmt = function (n) { return n.toLocaleString("ru-RU"); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Одометр цены (общий для тарифов и рекомендаций): строим колонки 0–9 для
     каждой цифры и катаем их к нужной цифре через translateY. Высоту ячейки
     берём из line-height значения. */
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
    state.sr.textContent = str + " ₽";
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

  /* ---------- Header: полупрозрачный фон + блюр при скролле (мобиле/планшет) ---------- */
  (function () {
    var header = document.querySelector(".header");
    if (!header) return;
    var mq = window.matchMedia("(max-width: 1024px)");
    var onScroll = function () {
      header.classList.toggle("header--scrolled", mq.matches && window.scrollY > 4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", onScroll);
    onScroll();
  })();

  /* ---------- FAQ: аккордеон ---------- */
  document.querySelectorAll(".faq__question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq__item");
      var isOpen = item.classList.toggle("faq__item--open");
      btn.setAttribute("aria-expanded", String(isOpen));
    });
  });

  /* ---------- Pricing: период + категория (Классический/Премиум) ---------- */
  (function () {
    var PERIODS = {
      month: { months: 1 },
      year: { months: 12 },
      three: { months: 36 },
    };
    var order = ["month", "year", "three"];

    // Цена ₽/мес по тарифам и периодам — как на timeweb.
    // Зачёркнутая «старая» цена и экономия считаются относительно помесячной.
    var CATEGORIES = {
      classic: {
        grid: document.querySelector(".pricing__grid--classic"),
        // Year / Optimo / Century / Millennium
        prices: {
          month: [393, 634, 887, 1285],
          year:  [244, 392, 553, 806],
          three: [180, 272, 381, 554],
        },
      },
      premium: {
        grid: document.querySelector(".pricing__grid--premium"),
        // 1 Сайт / Eterno / Premium (4-й слот — баннер переноса, без цены)
        prices: {
          month: [852, 2473, 5388],
          year:  [537, 1534, 4140],
          three: [366, 1161, 4140],
        },
      },
    };

    var periodSeg = document.querySelector(".pricing__seg--period");
    if (!periodSeg) return;

    Object.keys(CATEGORIES).forEach(function (key) {
      var cat = CATEGORIES[key];
      cat.cards = cat.grid ? Array.prototype.slice.call(cat.grid.querySelectorAll(".pricing__card")) : [];
      cat.odos = cat.cards.map(function (card) {
        var pv = card.querySelector(".pricing__price-value");
        return pv ? buildOdo(pv) : null;
      });
    });

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

    function renderCategory(key, periodId, animate) {
      var cat = CATEGORIES[key];
      if (!cat.grid) return;
      var p = PERIODS[periodId];
      var word = p.months === 1 ? "месяц" : "месяцев";
      cat.cards.forEach(function (card, i) {
        var price = cat.prices[periodId][i];
        if (price == null) return;
        var month = cat.prices.month[i];
        var total = price * p.months;
        var save = (month - price) * p.months;
        var tt = card.querySelector(".pricing__total");
        var sv = card.querySelector(".pricing__save");
        if (cat.odos[i]) setOdo(cat.odos[i], price, animate);
        if (tt) tt.textContent = fmt(total) + " ₽ за " + p.months + " " + word;
        if (sv) {
          if (save > 0) { sv.textContent = "Экономия " + fmt(save) + " ₽"; sv.classList.remove("pricing__save--empty"); }
          else { sv.textContent = ""; sv.classList.add("pricing__save--empty"); }
        }
      });
    }

    var activeCategory = "classic";
    function renderActive(periodId, animate) {
      renderCategory(activeCategory, periodId, animate);
    }

    // Индекс активного периода — общий для период-переключателя и категорий
    // (при смене категории нужно отрендерить её под уже выбранный период).
    var activeIdx = 0;
    periodSeg.querySelectorAll(".pricing__seg-btn").forEach(function (b, i) {
      if (b.classList.contains("pricing__seg-btn--active")) activeIdx = i;
    });

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
        activeIdx = idx;
        renderActive(order[idx] || "year", true);
      });
    });

    // Инициализация одометра под активный период (без анимации) — сразу для
    // обеих категорий, чтобы скрытая вкладка не мигала стартовыми цифрами.
    var initialPeriod = order[activeIdx] || "year";
    Object.keys(CATEGORIES).forEach(function (key) {
      renderCategory(key, initialPeriod, false);
    });

    // На мобиле тарифы — горизонтальная лента: по умолчанию центрируем
    // популярную карточку активной категории, «Подобрать тариф» — под ленту.
    var pick = document.querySelector(".pricing__pick");
    var pickHome = pick && pick.parentNode; // .pricing__controls
    var mobileMq = window.matchMedia("(max-width: 768px)");

    function currentGrid() {
      var cat = CATEGORIES[activeCategory];
      return cat && cat.grid;
    }
    function placePick() {
      var grid = currentGrid();
      if (!pick || !grid) return;
      if (mobileMq.matches) {
        grid.parentNode.insertBefore(pick, grid.nextSibling);
        pick.classList.add("pricing__pick--below");
      } else if (pickHome && pick.parentNode !== pickHome) {
        pickHome.appendChild(pick);
        pick.classList.remove("pricing__pick--below");
      }
    }
    function centerPopular() {
      if (!mobileMq.matches) return;
      var grid = currentGrid();
      var popular = grid && grid.querySelector(".pricing__card--popular");
      if (!grid || !popular) return;
      var gridRect = grid.getBoundingClientRect();
      var pRect = popular.getBoundingClientRect();
      var delta = (pRect.left - gridRect.left) - (grid.clientWidth - popular.offsetWidth) / 2;
      grid.scrollLeft += delta;
    }
    function syncMobile() { placePick(); centerPopular(); }
    requestAnimationFrame(syncMobile);
    window.addEventListener("load", syncMobile);
    mobileMq.addEventListener("change", syncMobile);

    // «Включено в каждом тарифе»: почтовая квота больше на премиум-тарифах.
    var mailQuota = document.querySelector("[data-mail-quota]");
    function syncMailQuota() {
      if (!mailQuota) return;
      mailQuota.textContent = mailQuota.getAttribute("data-" + activeCategory) || mailQuota.textContent;
    }

    // Категория: переключение активной вкладки + видимой сетки тарифов
    var catSeg = document.querySelector(".pricing__seg:not(.pricing__seg--period)");
    var catThumb = catSeg ? setupThumb(catSeg) : null;
    if (catSeg) {
      var catKeys = ["classic", "premium"];
      catSeg.querySelectorAll(".pricing__seg-btn").forEach(function (btn, idx) {
        var key = catKeys[idx] || "classic";
        btn.addEventListener("click", function () {
          if (activeCategory === key) return;
          catSeg.querySelectorAll(".pricing__seg-btn").forEach(function (b) {
            b.classList.remove("pricing__seg-btn--active");
            b.setAttribute("aria-pressed", "false");
          });
          btn.classList.add("pricing__seg-btn--active");
          btn.setAttribute("aria-pressed", "true");
          moveThumb(catThumb, btn, true);
          activeCategory = key;
          Object.keys(CATEGORIES).forEach(function (k) {
            var cat = CATEGORIES[k];
            if (cat.grid) cat.grid.hidden = k !== key;
          });
          renderActive(order[activeIdx] || "year", false);
          syncMailQuota();
          requestAnimationFrame(syncMobile);
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
      cpu: "CP — условные единицы процессорной мощности тарифа. Чем больше CP, тем выше вычислительная нагрузка, которую выдержит ваш сайт на пике.",
    };
    var icons = document.querySelectorAll(".pricing__info");
    icons.forEach(function (icon) {
      var holder = icon.closest(".pricing__feature-text") || icon.parentNode;
      var txt = (holder && holder.textContent) || "";
      var tip = /NVMe/i.test(txt) ? TIPS.nvme : /изоляц/i.test(txt) ? TIPS.isolation : /нагрузк/i.test(txt) ? TIPS.cpu : null;
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

  /* ---------- Поиск домена: фокус по клику на всю плашку ---------- */
  (function () {
    var bar = document.querySelector(".domain-search__bar");
    if (!bar) return;
    var input = bar.querySelector(".domain-search__input");
    if (!input) return;
    bar.addEventListener("mousedown", function (e) {
      // Клик по кнопке/самому инпуту обрабатываем штатно.
      if (e.target === input || e.target.closest(".domain-search__submit")) return;
      e.preventDefault(); // не теряем фокус на пустой области плашки
      input.focus();
    });
  })();

  /* ---------- Hero illu: разъезд к краям + фейд при скролле ---------- */
  (function () {
    var illus = document.querySelectorAll(".hero__illu");
    if (!illus.length || reduce.matches) return;
    var mq = window.matchMedia("(min-width: 1025px)");
    var raf = 0;
    function update() {
      raf = 0;
      if (!mq.matches) {
        illus.forEach(function (el) {
          el.style.transform = "";
          el.style.opacity = "";
          el.style.filter = "";
        });
        return;
      }
      // Прогресс 0→1 за первые ~420px скролла: иллюстрации разлетаются по
      // диагонали к углам (левые влево, правые вправо; верхние вверх, нижние
      // вниз), приближаются (scale) и размываются, плавно исчезая.
      var progress = Math.min(window.scrollY / 420, 1);
      var hShift = progress * 140;
      var vShift = progress * 110;
      var scale = (1 + progress * 0.35).toFixed(3);
      var blur = (progress * 10).toFixed(1);
      var opacity = (1 - progress).toFixed(3);
      illus.forEach(function (el) {
        var right = el.classList.contains("hero__illu--doc") ||
          el.classList.contains("hero__illu--folder");
        var top = el.classList.contains("hero__illu--shield") ||
          el.classList.contains("hero__illu--doc");
        var x = (right ? hShift : -hShift).toFixed(1);
        var y = (top ? -vShift : vShift).toFixed(1);
        el.style.transform = "translate(" + x + "px, " + y + "px) scale(" + scale + ")";
        el.style.filter = "blur(" + blur + "px)";
        el.style.opacity = opacity;
      });
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(update); }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
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
      var r = panel.getBoundingClientRect();
      if (r.top >= window.innerHeight || r.bottom <= 0) return;
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

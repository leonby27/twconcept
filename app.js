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

  /* ---------- Header: поиск поверх пунктов тёмного меню ---------- */
  (function () {
    var bar = document.querySelector(".header__bar");
    var trigger = document.querySelector(".header__search");
    var panel = document.querySelector(".header__search-panel");
    if (!bar || !trigger || !panel) return;

    var form = panel.querySelector(".header__search-form");
    var input = panel.querySelector(".header__search-input");
    var close = panel.querySelector(".header__search-close");
    var desktop = window.matchMedia("(min-width: 1025px)");
    var closeTimer = null;

    function openSearch() {
      if (!desktop.matches) return;
      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = null;
      panel.hidden = false;
      panel.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "true");
      bar.classList.add("header__bar--search-open");
      document.dispatchEvent(new CustomEvent("header-search-open"));
      window.requestAnimationFrame(function () {
        panel.classList.add("is-open");
        if (input) input.focus();
      });
    }

    function closeSearch(returnFocus) {
      if (panel.hidden) return;
      if (closeTimer) window.clearTimeout(closeTimer);
      panel.classList.remove("is-open");
      if (returnFocus && desktop.matches) trigger.focus();
      panel.setAttribute("aria-hidden", "true");
      trigger.setAttribute("aria-expanded", "false");
      bar.classList.remove("header__bar--search-open");

      function finishClose() {
        panel.hidden = true;
        closeTimer = null;
      }

      if (reduce.matches) finishClose();
      else closeTimer = window.setTimeout(finishClose, 160);
    }

    trigger.addEventListener("click", openSearch);
    if (close) close.addEventListener("click", function () { closeSearch(true); });
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); });

    document.addEventListener("keydown", function (e) {
      if (!panel.hidden && e.key === "Escape") {
        e.preventDefault();
        closeSearch(true);
      }
    });

    desktop.addEventListener("change", function (e) {
      if (!e.matches) closeSearch(false);
    });
  })();

  /* ---------- Header: пустые мегаменю хостинга и доменов по ховеру ---------- */
  (function () {
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-mega-trigger]"));
    var menu = document.querySelector("[data-mega-menu]");
    if (!triggers.length || !menu) return;

    var desktop = window.matchMedia("(min-width: 1025px)");
    var activeTrigger = null;
    var closeTimer = null;
    var transitionTimer = null;
    var transitionType = null;
    var suppressFocusOpen = false;

    function clearCloseTimer() {
      if (!closeTimer) return;
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }

    function clearTransition() {
      if (transitionTimer) window.clearTimeout(transitionTimer);
      transitionTimer = null;
      transitionType = null;
      menu.classList.remove("header__mega--closing");
    }

    function showMenu(trigger) {
      triggers.forEach(function (item) {
        item.setAttribute("aria-expanded", String(item === trigger));
      });
      activeTrigger = trigger;
      menu.hidden = false;
    }

    function openMenu(trigger) {
      if (!desktop.matches) return;
      clearCloseTimer();

      if (transitionType === "switch") {
        activeTrigger = trigger;
        return;
      }

      if (transitionType === "close") clearTransition();

      if (activeTrigger && activeTrigger !== trigger && !menu.hidden && !reduce.matches) {
        triggers.forEach(function (item) { item.setAttribute("aria-expanded", "false"); });
        activeTrigger = trigger;
        transitionType = "switch";
        menu.classList.add("header__mega--closing");
        transitionTimer = window.setTimeout(function () {
          transitionTimer = null;
          transitionType = null;
          var target = activeTrigger;
          menu.hidden = true;
          menu.classList.remove("header__mega--closing");
          window.requestAnimationFrame(function () {
            if (desktop.matches && activeTrigger === target) showMenu(target);
          });
        }, 120);
        return;
      }

      if (activeTrigger && activeTrigger !== trigger) menu.hidden = true;
      showMenu(trigger);
    }

    function closeMenu(returnFocus) {
      clearCloseTimer();
      if (transitionType === "close") return;
      clearTransition();
      var focusTarget = returnFocus ? activeTrigger : null;
      triggers.forEach(function (item) { item.setAttribute("aria-expanded", "false"); });

      function finishClose() {
        transitionTimer = null;
        transitionType = null;
        menu.hidden = true;
        menu.classList.remove("header__mega--closing");
        activeTrigger = null;
        if (focusTarget) {
          suppressFocusOpen = true;
          focusTarget.focus();
          suppressFocusOpen = false;
        }
      }

      if (menu.hidden || reduce.matches) {
        finishClose();
        return;
      }

      transitionType = "close";
      menu.classList.add("header__mega--closing");
      transitionTimer = window.setTimeout(finishClose, 120);
    }

    function scheduleClose() {
      clearCloseTimer();
      closeTimer = window.setTimeout(function () { closeMenu(false); }, 100);
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener("mouseenter", function () { openMenu(trigger); });
      trigger.addEventListener("mouseleave", scheduleClose);
      trigger.addEventListener("focus", function () {
        if (!suppressFocusOpen) openMenu(trigger);
      });
    });

    menu.addEventListener("mouseenter", function () {
      clearCloseTimer();
      if (transitionType === "close") {
        clearTransition();
        if (activeTrigger) showMenu(activeTrigger);
      }
    });
    menu.addEventListener("mouseleave", scheduleClose);

    document.addEventListener("focusin", function (e) {
      if (!activeTrigger || menu.contains(e.target) || triggers.some(function (item) { return item.contains(e.target); })) return;
      closeMenu(false);
    });

    document.addEventListener("keydown", function (e) {
      if (activeTrigger && e.key === "Escape") closeMenu(true);
    });

    document.addEventListener("header-search-open", function () {
      closeMenu(false);
    });

    desktop.addEventListener("change", function () {
      closeMenu(false);
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
    };
    var order = ["month", "year"];

    // Цена ₽/мес по тарифам и периодам — как на timeweb.
    // Зачёркнутая «старая» цена и экономия считаются относительно помесячной.
    var CATEGORIES = {
      classic: {
        grid: document.querySelector(".pricing__grid--classic"),
        // Year / Optimo / Century / Millennium
        prices: {
          month: [393, 634, 887, 1285],
          year:  [244, 392, 553, 806],
        },
      },
      premium: {
        grid: document.querySelector(".pricing__grid--premium"),
        // 1 Сайт / Eterno / Premium (4-й слот — баннер переноса, без цены)
        prices: {
          month: [852, 2473, 5388],
          year:  [537, 1534, 4140],
        },
      },
    };

    var periodSeg = document.querySelector(".pricing__seg--period");
    if (!periodSeg) return;
    var showRenewal = !!document.querySelector(".pricing[data-show-renewal]");

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
        if (tt) {
          // Страница хостинга: к годовой сумме дописываем цену продления (= помесячная)
          var renewal = showRenewal && p.months > 1 ? " · продление " + fmt(month) + " ₽/мес" : "";
          tt.textContent = fmt(total) + " ₽ за " + p.months + " " + word + renewal;
        }
        if (sv) {
          if (save > 0) { sv.textContent = "Экономия " + fmt(save) + " ₽"; sv.classList.remove("pricing__save--empty"); }
          else { sv.textContent = ""; sv.classList.add("pricing__save--empty"); }
        }
      });
    }

    var activeCategory = "classic";
    // Рендерим обе категории: на мобиле они стоят в одной ленте и видны
    // одновременно, а на десктопе скрытая вкладка уже готова к переключению.
    function renderAll(periodId, animate) {
      Object.keys(CATEGORIES).forEach(function (key) {
        renderCategory(key, periodId, animate);
      });
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
        renderAll(order[idx] || "year", true);
      });
    });

    // Инициализация одометра под активный период (без анимации) — сразу для
    // обеих категорий, чтобы скрытая вкладка не мигала стартовыми цифрами.
    var initialPeriod = order[activeIdx] || "year";
    Object.keys(CATEGORIES).forEach(function (key) {
      renderCategory(key, initialPeriod, false);
    });

    // На мобиле все тарифы — одна горизонтальная лента (общий контейнер
    // обеих сеток, без переключателя категорий): по умолчанию центрируем
    // Optimo, «Подобрать тариф» — под ленту.
    var pick = document.querySelector(".pricing__pick");
    var pickHome = pick && pick.parentNode; // .pricing__controls
    var scroller = document.querySelector(".pricing__grids");
    var mobileMq = window.matchMedia("(max-width: 768px)");

    function placePick() {
      if (!pick || !scroller) return;
      if (mobileMq.matches) {
        scroller.parentNode.insertBefore(pick, scroller.nextSibling);
        pick.classList.add("pricing__pick--below");
      } else if (pickHome && pick.parentNode !== pickHome) {
        pickHome.appendChild(pick);
        pick.classList.remove("pricing__pick--below");
      }
    }
    function centerPopular() {
      if (!mobileMq.matches || !scroller) return;
      var classic = CATEGORIES.classic.grid;
      var popular = classic && classic.querySelector(".pricing__card--popular");
      if (!popular) return;
      var sRect = scroller.getBoundingClientRect();
      var pRect = popular.getBoundingClientRect();
      var delta = (pRect.left - sRect.left) - (scroller.clientWidth - popular.offsetWidth) / 2;
      scroller.scrollLeft += delta;
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

      // Клик мышью не должен ничего менять: :focus-within показывает тултип
      // только для клавиатурной навигации (Tab), поэтому глушим сам фокус
      // по клику — иначе тултип «залипает» после ухода курсора (клик даёт
      // фокус, а он снимается только на blur, а не на mouseleave).
      wrap.addEventListener("mousedown", function (e) {
        e.preventDefault();
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

  /* ---------- Попап регистрации: email + кнопка-стрелка, код партнёра ---------- */
  (function () {
    var modal = document.getElementById("registration-modal");
    if (!modal) return;

    var dialog = modal.querySelector(".registration-modal__dialog");
    var email = modal.querySelector("[data-registration-email]");
    var form = modal.querySelector("[data-registration-form]");
    var terms = modal.querySelector('input[name="terms"]');
    var submit = modal.querySelector(".registration-modal__submit");
    var partnerToggle = modal.querySelector("[data-registration-partner-toggle]");
    var partnerField = document.getElementById("registration-partner-field");
    var previousFocus = null;
    var closeTimer = null;
    var resizeTimer = null;
    var resizeCleanup = null;

    var triggerLabels = /^(Регистрация|Начать бесплатно|Попробовать бесплатно)$/;
    var triggers = Array.prototype.filter.call(document.querySelectorAll("a, button"), function (el) {
      return (
        !modal.contains(el) &&
        (el.hasAttribute("data-registration-open") || triggerLabels.test(el.textContent.replace(/\s+/g, " ").trim()))
      );
    });

    function openModal(trigger) {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
      previousFocus = trigger || document.activeElement;
      // Код партнёра при каждом открытии свёрнут
      if (partnerToggle && partnerField) {
        partnerToggle.setAttribute("aria-expanded", "false");
        partnerField.hidden = true;
      }
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      requestAnimationFrame(function () {
        modal.classList.add("is-open");
        if (email) email.focus();
      });
    }

    function closeModal() {
      if (modal.hidden) return;
      if (resizeCleanup) resizeCleanup();
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      var finish = function () {
        modal.hidden = true;
        closeTimer = null;
        if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
      };
      if (reduce.matches) finish();
      else closeTimer = window.setTimeout(finish, 180);
    }

    function animateDialogHeight(update) {
      if (!dialog || reduce.matches) {
        update();
        return;
      }
      if (resizeCleanup) resizeCleanup();

      var startHeight = dialog.getBoundingClientRect().height;
      update();
      dialog.style.height = "";
      var endHeight = dialog.getBoundingClientRect().height;
      if (Math.abs(endHeight - startHeight) < 1) return;

      dialog.style.height = startHeight + "px";
      dialog.classList.add("registration-modal__dialog--resizing");
      void dialog.offsetHeight;

      var cleanup = function (e) {
        if (e && e.propertyName !== "height") return;
        dialog.removeEventListener("transitionend", cleanup);
        dialog.style.height = "";
        dialog.classList.remove("registration-modal__dialog--resizing");
        if (resizeTimer) window.clearTimeout(resizeTimer);
        resizeTimer = null;
        resizeCleanup = null;
      };
      resizeCleanup = cleanup;
      dialog.addEventListener("transitionend", cleanup);
      requestAnimationFrame(function () {
        dialog.style.height = endHeight + "px";
      });
      resizeTimer = window.setTimeout(cleanup, 320);
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(trigger);
      });
    });

    modal.querySelectorAll("[data-registration-close]").forEach(function (close) {
      close.addEventListener("click", closeModal);
    });

    function validationMessage(input) {
      var empty = !input.value.trim();
      if (input.name === "email") return empty ? "Введите email" : "Введите корректный email";
      return "Проверьте значение поля";
    }

    function clearFieldError(input) {
      var errorId = input.getAttribute("aria-errormessage");
      var error = errorId && document.getElementById(errorId);
      input.classList.remove("registration-modal__input--error");
      input.removeAttribute("aria-invalid");
      if (error) error.textContent = "";
    }

    function validateField(input) {
      var empty = input.required && !input.value.trim();
      if (!empty && input.validity.valid) {
        clearFieldError(input);
        return true;
      }
      var errorId = input.getAttribute("aria-errormessage");
      var error = errorId && document.getElementById(errorId);
      input.classList.add("registration-modal__input--error");
      input.setAttribute("aria-invalid", "true");
      if (error) error.textContent = validationMessage(input);
      return false;
    }

    if (form) {
      form.querySelectorAll(".registration-modal__input[required]").forEach(function (input) {
        input.addEventListener("input", function () {
          if (input.getAttribute("aria-invalid") !== "true") return;
          animateDialogHeight(function () { validateField(input); });
        });
      });
    }

    if (partnerToggle && partnerField) {
      partnerToggle.addEventListener("click", function () {
        var expanded = partnerToggle.getAttribute("aria-expanded") === "true";
        animateDialogHeight(function () {
          partnerToggle.setAttribute("aria-expanded", String(!expanded));
          partnerField.hidden = expanded;
        });
        if (!expanded) {
          var input = partnerField.querySelector("input");
          if (input) input.focus();
        }
      });
    }

    modal.querySelectorAll('a[href="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) { e.preventDefault(); });
    });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var invalid = [];
        animateDialogHeight(function () {
          form.querySelectorAll(".registration-modal__input[required]").forEach(function (input) {
            if (!validateField(input)) invalid.push(input);
          });
        });
        if (invalid.length) invalid[0].focus();
      });
    }

    function syncSubmitState() {
      if (!terms || !submit) return;
      submit.disabled = !terms.checked;
    }
    if (terms) terms.addEventListener("change", syncSubmitState);
    syncSubmitState();

    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;

      var focusable = Array.prototype.filter.call(
        dialog.querySelectorAll('button, input, a[href], [tabindex]:not([tabindex="-1"])'),
        function (el) { return !el.disabled && !el.hidden && el.offsetParent !== null; }
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  })();
})();

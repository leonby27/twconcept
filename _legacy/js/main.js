// Мобильное меню (бургер)
(function () {
  const burger = document.querySelector('.header__burger');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  function setOpen(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  }

  burger.addEventListener('click', () => {
    setOpen(burger.getAttribute('aria-expanded') !== 'true');
  });

  // Закрываем меню при возврате к десктопной ширине
  const mq = window.matchMedia('(min-width: 1025px)');
  mq.addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
    }
  });
})();

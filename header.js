/* Native details remain usable when JavaScript is unavailable. */
(() => {
  const header = document.querySelector('.site-header--mega');
  if (!header) return;
  const mobile = header.querySelector('.mobile-navigation');
  const menus = [...header.querySelectorAll('.nav-menu')];
  const hover = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1201px)');
  const desktop = window.matchMedia('(min-width: 1201px)');
  let hoverTimer;
  let leaveTimer;
  let openedByHover = null;

  const cancelTimers = () => {
    window.clearTimeout(hoverTimer);
    window.clearTimeout(leaveTimer);
  };
  const closeMenus = () => {
    cancelTimers();
    header.querySelectorAll('details[open]').forEach(menu => { menu.open = false; });
    openedByHover = null;
  };
  const openMenu = menu => {
    menus.forEach(other => { if (other !== menu) other.open = false; });
    menu.open = true;
  };

  menus.forEach(menu => {
    const summary = menu.querySelector('summary');
    menu.addEventListener('pointerenter', event => {
      if (!hover.matches || event.pointerType !== 'mouse') return;
      cancelTimers();
      if (menu.open) return;
      hoverTimer = window.setTimeout(() => {
        const focusedMenu = header.querySelector('.nav-menu:focus-within');
        if (focusedMenu && focusedMenu !== menu && focusedMenu.open) return;
        openMenu(menu);
        openedByHover = menu;
      }, 100);
    });
    menu.addEventListener('pointerleave', () => {
      if (!hover.matches) return;
      window.clearTimeout(hoverTimer);
      leaveTimer = window.setTimeout(() => {
        if (!menu.contains(document.activeElement)) {
          menu.open = false;
          if (openedByHover === menu) openedByHover = null;
        }
      }, 220);
    });
    summary.addEventListener('click', event => {
      cancelTimers();
      // A click after hovering keeps the newly opened panel available.
      if (event.detail > 0 && openedByHover === menu && menu.open) event.preventDefault();
      openedByHover = null;
    });
    summary.addEventListener('keydown', event => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      cancelTimers();
      openedByHover = null;
      openMenu(menu);
      const links = [...menu.querySelectorAll('.mega-menu a[href]')];
      const next = event.key === 'ArrowDown' ? links[0] : links[links.length - 1];
      if (next) next.focus();
    });
    menu.addEventListener('focusout', () => {
      window.setTimeout(() => {
        if (!menu.contains(document.activeElement)) menu.open = false;
      }, 0);
    });
  });

  document.addEventListener('click', event => {
    if (!header.contains(event.target)) {
      closeMenus();
      return;
    }
    const link = event.target.closest('a[href]');
    if (!link) return;
    closeMenus();
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname || !destination.hash) return;
    const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const active = document.activeElement;
    const activeMenu = active.closest('.nav-menu');
    const openMenuElement = header.querySelector('details[open]');
    if (!openMenuElement) return;
    const focusTarget = mobile.open ? mobile.querySelector('summary') : (activeMenu || openMenuElement).querySelector('summary');
    const focusWasInside = header.contains(active);
    closeMenus();
    if (focusWasInside && focusTarget) focusTarget.focus();
  });
  header.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!header.contains(document.activeElement)) closeMenus();
    }, 0);
  });
  desktop.addEventListener('change', closeMenus);
})();

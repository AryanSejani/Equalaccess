/* Complete copy is visible without JavaScript; controls enhance existing content. */
(() => {
  'use strict';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('[data-acr-hero]');
  let heroTimer;
  const finishHero = () => {
    window.clearTimeout(heroTimer);
    if (hero) hero.dataset.animate = 'false';
  };
  if (hero && !motion.matches && !document.hidden) {
    hero.dataset.animate = 'true';
    heroTimer = window.setTimeout(finishHero, 3800);
  }
  motion.addEventListener('change', event => { if (event.matches) finishHero(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) finishHero(); });

  function enhanceTabs(root, breakpoint) {
    if (!root) return;
    const list = root.querySelector('[data-vpat-tablist]');
    const tabs = [...list.querySelectorAll('[data-vpat-tab]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    if (panels.some(panel => !panel)) return;
    const media = breakpoint ? window.matchMedia(breakpoint) : null;
    let selected = 0;
    const isTabbed = () => !media || media.matches;

    function render() {
      const tabbed = isTabbed();
      root.dataset.mode = tabbed ? 'tabs' : 'timeline';
      list.hidden = !tabbed;
      list.setAttribute('role', 'tablist');
      tabs.forEach((tab, index) => {
        const active = index === selected;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        tab.dataset.past = String(index < selected);
        const panel = panels[index];
        panel.hidden = tabbed && !active;
        if (tabbed) {
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('aria-labelledby', tab.id);
          panel.tabIndex = 0;
        } else {
          panel.removeAttribute('role');
          panel.setAttribute('aria-labelledby', panel.dataset.heading);
          panel.removeAttribute('tabindex');
        }
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => { selected = index; render(); });
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        selected = next;
        render();
        tabs[next].focus();
      });
    });

    if (media) media.addEventListener('change', () => {
      const focusedTab = tabs.indexOf(document.activeElement);
      const focusedPanel = panels.findIndex(panel => panel.contains(document.activeElement));
      if (media.matches && focusedPanel !== -1) selected = focusedPanel;
      render();
      if (!media.matches && focusedTab !== -1) {
        panels[focusedTab].tabIndex = -1;
        panels[focusedTab].focus();
      }
    });
    render();
  }
  enhanceTabs(document.querySelector('[data-vpat-process]'), '(min-width: 901px)');
  enhanceTabs(document.querySelector('[data-vpat-example]'));

  document.querySelectorAll('[data-vpat-faq] button[aria-controls]').forEach((button, index) => {
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    if (!answer) return;
    const setOpen = open => {
      button.setAttribute('aria-expanded', String(open));
      answer.hidden = !open;
    };
    setOpen(index === 0);
    button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  });
})();

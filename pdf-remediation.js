/* Document examples and the established five-stage process; complete content without JavaScript. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('[data-pd-hero]');
  let heroTimer;
  const finishHero = () => {
    window.clearTimeout(heroTimer);
    if (hero) hero.dataset.animate = 'false';
  };
  if (hero && !reducedMotion.matches && !document.hidden) {
    hero.dataset.animate = 'true';
    heroTimer = window.setTimeout(finishHero, 4100);
  }
  reducedMotion.addEventListener('change', event => { if (event.matches) finishHero(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) finishHero(); });

  function enhanceTabs(root, breakpoint) {
    if (!root) return;
    const list = root.querySelector('[data-pd-tablist]');
    const tabs = [...list.querySelectorAll('[data-pd-tab]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    if (panels.some(panel => !panel)) return;
    const media = breakpoint ? window.matchMedia(breakpoint) : null;
    const vertical = list.dataset.orientation === 'vertical';
    let selected = 0;
    function render() {
      const tabbed = !media || media.matches;
      root.dataset.mode = tabbed ? 'tabs' : 'timeline';
      list.hidden = !tabbed;
      list.setAttribute('role', 'tablist');
      list.setAttribute('aria-orientation', vertical ? 'vertical' : 'horizontal');
      tabs.forEach((tab, index) => {
        const active = index === selected;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
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
        if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % tabs.length;
        else if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index + tabs.length - 1) % tabs.length;
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
  enhanceTabs(document.querySelector('[data-pd-process]'), '(min-width: 901px)');
  enhanceTabs(document.querySelector('[data-pd-examples]'), '(min-width: 701px)');

  const faqButtons = [...document.querySelectorAll('[data-pd-faq] button[aria-controls]')];
  const faqAnswers = faqButtons.map(button => document.getElementById(button.getAttribute('aria-controls')));
  function setFAQ(index, open) {
    faqButtons[index].setAttribute('aria-expanded', String(open));
    faqAnswers[index].hidden = !open;
  }
  if (faqAnswers.every(Boolean)) {
    faqButtons.forEach((button, index) => {
      setFAQ(index, index === 0);
      button.addEventListener('click', () => {
        const opening = button.getAttribute('aria-expanded') !== 'true';
        faqButtons.forEach((_, other) => setFAQ(other, opening && other === index));
      });
    });
  }

})();

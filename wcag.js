/* WCAG page: four progressively enhanced interactions; all copy is readable without JS. */
(() => {
  'use strict';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('[data-wg-hero]');
  let heroTimer;
  const finishHero = () => {
    window.clearTimeout(heroTimer);
    if (hero) hero.dataset.animate = 'false';
  };
  if (hero && !motion.matches && !document.hidden) {
    hero.dataset.animate = 'true';
    heroTimer = window.setTimeout(finishHero, 4600);
  }
  motion.addEventListener('change', event => { if (event.matches) finishHero(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) finishHero(); });

  const pour = document.querySelector('[data-wg-pour]');
  if (pour) {
    const choices = [...pour.querySelectorAll('[data-pour-choice]')];
    const cards = [...pour.querySelectorAll('[data-principle-card]')];
    const visual = document.getElementById('wg-pour-visual');
    const status = pour.querySelector('[data-pour-status]');
    const desktop = window.matchMedia('(min-width: 901px)');
    const summaries = {
      p: 'Perceivable: readable text and a clear content structure are highlighted.',
      o: 'Operable: the keyboard-operable Continue control is highlighted.',
      u: 'Understandable: the instruction explaining the email field is highlighted.',
      r: 'Robust: the control name, role, and state are highlighted.'
    };
    let selected = 'p';
    function renderPour() {
      choices.forEach(button => {
        button.hidden = !desktop.matches;
        button.setAttribute('aria-pressed', String(button.dataset.pourChoice === selected));
      });
      cards.forEach(card => { card.dataset.selected = String(desktop.matches && card.dataset.principleCard === selected); });
      visual.dataset.principle = desktop.matches ? selected : '';
    }
    choices.forEach(button => {
      const select = announce => {
        selected = button.dataset.pourChoice;
        renderPour();
        if (announce) status.textContent = summaries[selected];
      };
      button.addEventListener('click', () => select(true));
      button.addEventListener('focus', () => select(false));
    });
    desktop.addEventListener('change', () => {
      const focused = choices.find(button => button === document.activeElement);
      renderPour();
      if (!desktop.matches && focused) {
        const heading = document.getElementById('wg-principle-' + focused.dataset.pourChoice);
        heading.tabIndex = -1;
        heading.focus();
      }
    });
    renderPour();
  }

  function enhanceTabs(root, breakpoint) {
    if (!root) return;
    const list = root.querySelector('[data-wg-tablist]');
    const tabs = [...list.querySelectorAll('[data-wg-tab]')];
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
  enhanceTabs(document.querySelector('[data-wg-process]'), '(min-width: 901px)');
  enhanceTabs(document.querySelector('[data-wg-examples]'));

  document.querySelectorAll('[data-wg-faq] button[aria-controls]').forEach((button, index) => {
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

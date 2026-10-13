/* ADA compliance journeys, examples, and the canonical process; all substantive content remains readable without JavaScript. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('[data-aw-hero]');
  let heroTimer;
  const finishHero = () => {
    window.clearTimeout(heroTimer);
    if (hero) hero.dataset.animate = 'false';
  };
  if (hero && !reducedMotion.matches && !document.hidden) {
    hero.dataset.animate = 'true';
    heroTimer = window.setTimeout(finishHero, 4800);
  }
  reducedMotion.addEventListener('change', event => { if (event.matches) finishHero(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) finishHero(); });

  function enhanceTabs(root, breakpoint) {
    if (!root) return;
    const list = root.querySelector('[data-aw-tablist]');
    const tabs = [...list.querySelectorAll('[data-aw-tab]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    if (panels.some(panel => !panel)) return;
    const media = breakpoint ? window.matchMedia(breakpoint) : null;
    const orientationMedia = 'responsiveOrientation' in list.dataset ? window.matchMedia('(min-width: 651px)') : null;
    const vertical = () => list.dataset.orientation === 'vertical' || (orientationMedia && !orientationMedia.matches);
    let selected = 0;
    function render() {
      const tabbed = !media || media.matches;
      root.dataset.mode = tabbed ? 'tabs' : 'timeline';
      list.hidden = !tabbed;
      list.setAttribute('role', 'tablist');
      list.setAttribute('aria-orientation', vertical() ? 'vertical' : 'horizontal');
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
        if (event.key === (vertical() ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % tabs.length;
        else if (event.key === (vertical() ? 'ArrowUp' : 'ArrowLeft')) next = (index + tabs.length - 1) % tabs.length;
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
    if (orientationMedia) orientationMedia.addEventListener('change', render);
    render();
  }
  enhanceTabs(document.querySelector('[data-aw-journeys]'), '(min-width: 901px)');
  enhanceTabs(document.querySelector('[data-aw-examples]'));
  enhanceTabs(document.querySelector('[data-aw-process]'), '(min-width: 901px)');

  const examples = document.querySelector('[data-aw-examples]');
  if (examples) {
    const compare = examples.querySelector('[data-aw-compare]');
    const buttons = [...compare.querySelectorAll('[data-aw-view]')];
    const before = [...examples.querySelectorAll('[data-aw-before]')];
    const after = [...examples.querySelectorAll('[data-aw-after]')];
    function showComparison(view) {
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.awView === view)));
      before.forEach(element => { element.hidden = view !== 'before'; });
      after.forEach(element => { element.hidden = view !== 'after'; });
    }
    buttons.forEach(button => button.addEventListener('click', () => showComparison(button.dataset.awView)));
    compare.hidden = false;
    showComparison('before');
  }

  const faqButtons = [...document.querySelectorAll('[data-aw-faq] button[aria-controls]')];
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

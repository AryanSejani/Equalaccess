/* Isolated, local demonstrations. No submission, storage, network request, or live scan. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('[data-cr-hero]');
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
    const list = root.querySelector('[data-cr-tablist]');
    const tabs = [...list.querySelectorAll('[data-cr-tab]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    if (!tabs.length || panels.some(panel => !panel)) return;
    const media = breakpoint ? window.matchMedia(breakpoint) : null;
    const orientationMedia = 'responsiveOrientation' in list.dataset ? window.matchMedia('(min-width: 651px)') : null;
    const vertical = () => orientationMedia && !orientationMedia.matches;
    let selected = 0;
    function render() {
      const tabbed = !media || media.matches;
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
  enhanceTabs(document.querySelector('[data-cr-examples]'));
  enhanceTabs(document.querySelector('[data-cr-journeys]'), '(min-width: 901px)');

  const menu = document.querySelector('.cr-demo-menu');
  const menuButton = document.getElementById('cr-products-trigger');
  const menuLinks = document.getElementById('cr-product-links');
  function setMenu(open, returnFocus = false) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuLinks.hidden = !open;
    if (returnFocus) menuButton.focus();
  }
  if (menu && menuButton && menuLinks) {
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menuLinks.hidden) {
        event.preventDefault();
        event.stopPropagation();
        setMenu(false, true);
      }
    });
    menuLinks.querySelectorAll('a').forEach(anchor => anchor.addEventListener('click', () => {
      setMenu(false);
      document.getElementById('cr-menu-demo-note').focus({ preventScroll: true });
    }));
    document.addEventListener('click', event => {
      if (!menu.contains(event.target)) setMenu(false);
    });
    menu.closest('[data-cr-live]').hidden = false;
  }

  const form = document.querySelector('[data-cr-demo-form]');
  if (form) {
    const field = document.getElementById('cr-demo-email');
    const error = document.getElementById('cr-email-error');
    const feedback = form.querySelector('[data-cr-form-feedback]');
    form.addEventListener('submit', event => {
      event.preventDefault();
      field.value = field.value.trim();
      const valid = field.validity.valid;
      field.setAttribute('aria-invalid', String(!valid));
      error.textContent = valid ? '' : 'Enter an email such as alex@example.com.';
      feedback.textContent = valid
        ? 'The example passes this email-format check. Nothing was sent.'
        : 'Please correct the email field and check again.';
      if (!valid) field.focus();
    });
    form.closest('[data-cr-live]').hidden = false;
  }

  const dialog = document.getElementById('cr-demo-dialog');
  const openDialog = document.querySelector('[data-cr-dialog-open]');
  const closeDialog = document.querySelector('[data-cr-dialog-close]');
  if (dialog && openDialog && closeDialog && typeof dialog.showModal === 'function') {
    openDialog.addEventListener('click', () => {
      dialog.showModal();
      closeDialog.focus();
    });
    closeDialog.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => openDialog.focus({ preventScroll: true }));
    openDialog.closest('[data-cr-live]').hidden = false;
  }

  const options = document.querySelector('[data-cr-options]');
  if (options) {
    const output = document.querySelector('[data-cr-option-output]');
    options.addEventListener('change', event => {
      if (event.target.matches('input[type="radio"]') && event.target.checked) {
        output.textContent = `Selected: ${event.target.value}`;
      }
    });
    options.closest('[data-cr-live]').hidden = false;
  }

  const faqButtons = [...document.querySelectorAll('[data-cr-faq] button[aria-controls]')];
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

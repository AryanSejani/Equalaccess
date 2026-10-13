/* Progressive enhancement: all page content is readable before JavaScript runs. */
(() => {
  'use strict';

  // A short, one-time implementation review. Reduced motion gets the final state.
  const workshop = document.querySelector('[data-workshop]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let workshopTimer;
  const finishWorkshop = () => {
    window.clearTimeout(workshopTimer);
    if (workshop) workshop.dataset.animate = 'false';
  };
  if (workshop && !motion.matches) {
    workshop.dataset.animate = 'true';
    workshopTimer = window.setTimeout(finishWorkshop, 4000);
  }
  motion.addEventListener('change', event => { if (event.matches) finishWorkshop(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) finishWorkshop(); });

  // Keep one set of training content. Use tabs on desktop and an accordion on mobile.
  const training = document.querySelector('[data-role-training]');
  if (training) {
    const desktop = window.matchMedia('(min-width: 901px)');
    const list = training.querySelector('[role="tablist"]');
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const headings = [...training.querySelectorAll('.ct-role-accordion-heading')];
    const toggles = headings.map(heading => heading.querySelector('button'));
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    let selected = 0;
    let open = true;

    function render() {
      const isDesktop = desktop.matches;
      training.dataset.mode = isDesktop ? 'tabs' : 'accordion';
      list.hidden = !isDesktop;
      headings.forEach(heading => { heading.hidden = isDesktop; });
      tabs.forEach((tab, index) => {
        const active = selected === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        toggles[index].setAttribute('aria-expanded', String(active && open));
        const panel = panels[index];
        panel.hidden = !active || (!isDesktop && !open);
        panel.setAttribute('role', isDesktop ? 'tabpanel' : 'region');
        panel.setAttribute('aria-labelledby', isDesktop ? tab.id : toggles[index].id);
        if (isDesktop) panel.tabIndex = 0;
        else panel.removeAttribute('tabindex');
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => { selected = index; open = true; render(); });
      tab.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowDown') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        selected = next;
        open = true;
        render();
        tabs[next].focus();
      });
    });
    toggles.forEach((toggle, index) => {
      toggle.addEventListener('click', () => {
        open = selected === index ? !open : true;
        selected = index;
        render();
      });
    });
    desktop.addEventListener('change', () => {
      const focusedTab = tabs.indexOf(document.activeElement);
      const focusedToggle = toggles.indexOf(document.activeElement);
      if (desktop.matches) open = true;
      render();
      if (!desktop.matches && focusedTab !== -1) toggles[focusedTab].focus();
      if (desktop.matches && focusedToggle !== -1) {
        selected = focusedToggle;
        open = true;
        render();
        tabs[focusedToggle].focus();
      }
    });
    render();
  }

  // Four manually selected views of one technical example. Mobile shows all views.
  const example = document.querySelector('[data-example]');
  if (example) {
    const desktop = window.matchMedia('(min-width: 761px)');
    const list = example.querySelector('[role="tablist"]');
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    let selected = 0;

    function render() {
      example.dataset.mode = desktop.matches ? 'tabs' : 'timeline';
      list.hidden = !desktop.matches;
      tabs.forEach((tab, index) => {
        const active = index === selected;
        const panel = panels[index];
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panel.hidden = desktop.matches && !active;
        if (desktop.matches) {
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('aria-labelledby', tab.id);
          panel.tabIndex = 0;
        } else {
          panel.removeAttribute('role');
          panel.setAttribute('aria-labelledby', panel.querySelector('h3').id);
          panel.removeAttribute('tabindex');
        }
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => { selected = index; render(); });
      tab.addEventListener('keydown', event => {
        let next = index;
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
    desktop.addEventListener('change', () => {
      const focusedTab = tabs.indexOf(document.activeElement);
      const focusedPanel = panels.findIndex(panel => panel.contains(document.activeElement));
      if (desktop.matches && focusedPanel !== -1) selected = focusedPanel;
      render();
      if (!desktop.matches && focusedTab !== -1) {
        // Move focus only when a focused control is being removed by the breakpoint.
        panels[focusedTab].tabIndex = -1;
        panels[focusedTab].focus();
      }
    });
    render();
  }

  // Native buttons, complete answers, and no height animation to obscure content.
  document.querySelectorAll('[data-consulting-faq] button[aria-controls]').forEach((button, index) => {
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    button.setAttribute('aria-expanded', String(index === 0));
    answer.hidden = index !== 0;
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      answer.hidden = expanded;
    });
  });
})();

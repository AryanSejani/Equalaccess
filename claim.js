/* Progressive tabs: every panel remains readable without JavaScript. */
(() => {
  document.querySelectorAll('[data-claim-tabs]').forEach(group => {
    const tablist = group.querySelector('[role="tablist"]');
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    if (panels.some(panel => !panel)) return;
    const narrow = window.matchMedia('(max-width: 850px)');
    const isExample = group.classList.contains('claim-example-shell');
    function updateOrientation() {
      tablist.setAttribute('aria-orientation', isExample && !narrow.matches ? 'vertical' : 'horizontal');
    }
    function select(index, fromKeyboard = false) {
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[i].hidden = !selected;
      });
      if (fromKeyboard) {
        tabs[index].focus({ preventScroll: true });
        tabs[index].scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' });
      }
    }
    tabs.forEach((tab, index) => {
      panels[index].setAttribute('role', 'tabpanel');
      panels[index].setAttribute('aria-labelledby', tab.id);
      panels[index].tabIndex = 0;
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', event => {
        const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
        let next;
        if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % tabs.length;
        else if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        select(next, true);
      });
    });
    group.classList.add('is-enhanced');
    updateOrientation();
    narrow.addEventListener('change', updateOrientation);
    select(0);
    tablist.hidden = false;
  });

  // Buttons expose every answer without JS, then become an accordion on enhancement.
  document.querySelectorAll('[data-claim-faq]').forEach(group => {
    const buttons = [...group.querySelectorAll('.claim-faq-trigger')];
    const panels = buttons.map(button => document.getElementById(button.getAttribute('aria-controls')));
    if (panels.some(panel => !panel)) return;
    function setExpanded(index, expanded) {
      buttons[index].setAttribute('aria-expanded', String(expanded));
      panels[index].hidden = !expanded;
      buttons[index].closest('.claim-faq-item').classList.toggle('is-open', expanded);
    }
    buttons.forEach((button, index) => {
      setExpanded(index, false);
      button.addEventListener('click', () => {
        const expand = button.getAttribute('aria-expanded') !== 'true';
        buttons.forEach((_, other) => setExpanded(other, other === index && expand));
      });
    });
  });
})();

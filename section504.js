/* Progressive enhancement: every answer remains readable without JavaScript. */
(() => {
  document.querySelectorAll('[data-section504-faq]').forEach(list => {
    const buttons = [...list.querySelectorAll('button[aria-controls]')];
    buttons.forEach((button, index) => {
      const answer = document.getElementById(button.getAttribute('aria-controls'));
      if (!answer) return;
      const setOpen = open => {
        button.setAttribute('aria-expanded', String(open));
        answer.hidden = !open;
      };
      setOpen(index === 0);
      button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
    });
  });

  const region = document.querySelector('[data-comparison-scroll]');
  if (!region) return;
  const hint = document.getElementById(region.dataset.scrollHint);
  const updateOverflow = () => {
    const overflow = region.scrollWidth > region.clientWidth + 1;
    if (overflow) {
      region.setAttribute('tabindex', '0');
      if (hint) region.setAttribute('aria-describedby', hint.id);
    } else {
      region.removeAttribute('tabindex');
      region.removeAttribute('aria-describedby');
    }
    if (hint) hint.hidden = !overflow;
  };
  updateOverflow();
  if ('ResizeObserver' in window) new ResizeObserver(updateOverflow).observe(region);
  else window.addEventListener('resize', updateOverflow);
})();

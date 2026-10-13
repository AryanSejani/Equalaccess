/* Continue the final page section's surface beneath the shared footer cards. */
(() => {
  const footer = document.querySelector('.global-footer');
  const main = document.getElementById('main');
  if (!footer || !main || !footer.querySelector('.global-footer-grid')) return;
  const syncSurface = () => {
    let node = main.lastElementChild || main;
    let background = '#fff';
    while (node) {
      const color = window.getComputedStyle(node).backgroundColor;
      if (color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') {
        background = color;
        break;
      }
      node = node.parentElement;
    }
    footer.style.setProperty('--footer-page-background', background);
  };
  syncSurface();
  window.addEventListener('pageshow', syncSurface);
})();

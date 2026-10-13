/* Shared by every page; the copyright follows the visitor's current year. */
(() => {
  const labels = document.querySelectorAll('[data-current-year]');
  if (!labels.length) return;
  let rolloverTimer;
  const updateYear = () => {
    const now = new Date();
    labels.forEach(node => { node.textContent = String(now.getFullYear()); });
    window.clearTimeout(rolloverTimer);
    const nextYear = new Date(now.getFullYear() + 1, 0, 1);
    // Refresh at midnight on January 1 even if the page stays open.
    // A daily ceiling also handles local clock/timezone changes without a long timer.
    rolloverTimer = window.setTimeout(updateYear, Math.min(nextYear.getTime() - now.getTime() + 100, 86400000));
  };
  updateYear();
  window.addEventListener('pageshow', updateYear);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateYear(); });
})();

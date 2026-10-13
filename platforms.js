(() => {
  'use strict';
  const marquees = document.querySelectorAll('[data-platform-marquee]');
  if (!marquees.length) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  marquees.forEach(marquee => {
    const toggle = marquee.querySelector('.platform-motion-toggle');
    const label = marquee.querySelector('[data-marquee-label]');
    if (!toggle || !label) return;
    let manuallyPaused = false;
    let inView = !('IntersectionObserver' in window);
    const sync = () => {
      const motionAllowed = !reducedMotion.matches;
      marquee.dataset.paused = String(manuallyPaused || !inView || document.hidden || !motionAllowed);
      marquee.classList.toggle('has-motion', motionAllowed);
      toggle.hidden = !motionAllowed;
      label.textContent = manuallyPaused ? 'Resume motion' : 'Pause motion';
      toggle.setAttribute('aria-label', manuallyPaused ? 'Resume platform logos' : 'Pause platform logos');
    };
    toggle.addEventListener('click', () => {
      manuallyPaused = !manuallyPaused;
      sync();
    });
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        inView = entries.some(entry => entry.isIntersecting);
        sync();
      }, { threshold: 0 });
      observer.observe(marquee);
    }
    sync();
  });
})();

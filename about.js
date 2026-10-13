/* Preserve direct links to the accessibility statement disclosure. */
(() => {
  function openLinkedNotice() {
    const id = window.location.hash.slice(1);
    if (id !== 'accessibility-commitment') return;
    const notice = document.getElementById(id);
    if (notice?.tagName === 'DETAILS') notice.open = true;
  }
  openLinkedNotice();
  window.addEventListener('hashchange', openLinkedNotice);
})();

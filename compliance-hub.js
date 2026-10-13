(() => {
  const group = document.querySelector('.ch-options');
  if (!group) return;
  const buttons = [...group.querySelectorAll('[data-org]')];
  const results = [...group.querySelectorAll('[data-result]')];
  const status = document.querySelector('#org-status');
  if (!status || !buttons.length || buttons.length !== results.length) return;

  function select(value, announce = false) {
    const selected = results.find(result => result.dataset.result === value);
    if (!selected) return;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.org === value)));
    results.forEach(result => { result.hidden = result !== selected; });
    if (announce) status.textContent = 'Recommended starting point: ' + selected.querySelector('h3').textContent + '. Use Explore Page to read the guide.';
  }

  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.org, true)));
  select('0');
  group.classList.add('is-enhanced');
  buttons.forEach(button => { button.hidden = false; });
})();

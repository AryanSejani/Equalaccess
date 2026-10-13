(() => {
  const root = document.querySelector('.hub-finder-grid');
  if (!root) return;
  const choices = root.querySelector('.hub-choices');
  const buttons = [...root.querySelectorAll('[data-choice]')];
  const panels = [...root.querySelectorAll('[data-recommendation]')];
  const status = root.querySelector('#hub-recommendation-status');
  if (!choices || !status || buttons.length !== panels.length || !buttons.length) return;

  function select(value, announce = false) {
    const selected = panels.find(panel => panel.dataset.recommendation === value);
    if (!selected) return;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.choice === value)));
    panels.forEach(panel => { panel.hidden = panel !== selected; });
    if (announce) status.textContent = 'Best place to start: ' + selected.querySelector('h3').textContent + '. The service link is below the choices.';
  }

  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.choice, true)));
  select('0');
  root.classList.add('is-enhanced');
  choices.hidden = false;
})();

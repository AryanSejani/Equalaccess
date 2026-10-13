/* A continuous illustrative audit, anchored to one storefront. */
(() => {
  const film = document.getElementById('accessibility-film');
  if (!film) return;
  const find = selector => film.querySelector(selector);
  const all = selector => [...film.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const browser = find('.film-browser');
  const visual = find('.film-visual');
  const cursor = find('.film-audit-cursor');
  const ring = find('.film-focus-ring');
  const announcement = find('.film-live-status');
  const buttons = all('.film-stage-button');
  const pins = all('.film-issue-pin');
  const findings = all('[data-finding]');
  const targets = Object.fromEntries(all('[data-film-target]').map(node => [node.dataset.filmTarget,node]));
  const issues = ['image','cart','keyboard'];
  const stateNames = { q: 'queued', f: 'found', x: 'fixed', v: 'verified' };
  const stateLabels = { queued: 'Queued', found: 'Found', fixed: 'Fixed', verified: 'Verified' };
  const issueNames = { image: 'Image description', cart: 'Cart label', keyboard: 'Keyboard access' };
  const fixes = {
    image: { before: '<img src="headphones.jpg">', after: 'alt="Ivory wireless headphones"', summary: 'Add a useful image description, then confirm it is announced.', report: 'Description added and retested.' },
    cart: { before: '<button><svg>…</svg></button>', after: 'aria-label="Open shopping cart"', summary: 'Name the cart control, then confirm its screen-reader announcement.', report: 'Accessible name added and retested.' },
    keyboard: { before: '<div onclick="openCollection()">', after: '<a href="/collections/all">', summary: 'Use a native link, then test keyboard focus and activation.', report: 'Keyboard operation corrected and retested.' }
  };
  // q = queued, f = found, x = fixed, v = verified (image / cart / keyboard).
  const frames = [
    { id: 'survey', ms: 700, stage: 0, target: 'nav', tool: 'inspect', states: 'qqq', title: 'Start with a website scan.', name: 'Website assessment', detail: 'Scanning for detectable barriers.', caption: 'Follow the same storefront from first review to final documentation.' },
    { id: 'image-inspect', ms: 1400, stage: 0, target: 'image', tool: 'inspect', states: 'qqq', title: 'Inspect the product image.', name: 'Product image', detail: 'Checking its text alternative.', label: 'Inspect image', caption: 'A meaningful product image needs a useful text alternative.' },
    { id: 'image-found', ms: 1400, stage: 0, target: 'image', tool: 'inspect', states: 'fqq', tone: 'issue', title: 'A description is missing.', name: 'Product image', detail: 'No useful alternative text.', label: 'Description missing', feedback: 'Image barrier identified', caption: 'The image barrier is recorded against the exact component.' },
    { id: 'cart-found', ms: 1500, stage: 0, target: 'cart', tool: 'inspect', states: 'ffq', tone: 'issue', title: 'What does this control do?', name: 'Shopping cart control', detail: 'Its accessible name is missing.', label: 'Missing label', feedback: 'Cart control needs a name', caption: 'The cart icon also needs a name that describes its purpose.' },
    { id: 'tab-home', ms: 1300, stage: 1, target: 'nav', tool: 'keyboard', states: 'ffq', input: 'keyboard', key: 'Tab', title: 'Now, try the keyboard.', detail: 'Tab reaches the home link.', label: 'Keyboard focus', feedback: 'Tab: home link', caption: 'Manual testing follows the journey without using a mouse.' },
    { id: 'tab-cart', ms: 1000, stage: 1, target: 'cart', tool: 'keyboard', states: 'ffq', input: 'keyboard', key: 'Tab', title: 'Next, the cart control.', detail: 'Focus moves to the cart.', label: 'Keyboard focus', feedback: 'Tab: cart control', caption: 'The focus outline moves from one control to the next.' },
    { id: 'tab-blocked', ms: 2000, stage: 1, target: 'keyboard', tool: 'keyboard', states: 'fff', input: 'keyboard', key: 'Tab', tone: 'issue', title: 'The collection is skipped.', detail: 'Tab cannot reach this control.', label: 'Not keyboard reachable', feedback: 'Tab skips the collection control', caption: 'The collection control cannot be reached with the keyboard.' },
    { id: 'reader-before', ms: 2000, stage: 1, target: 'cart', tool: 'reader', states: 'fff', input: 'reader', tone: 'issue', title: 'An unnamed control.', quote: '“Button.”', detail: 'The destination is not announced.', label: 'Purpose unclear', feedback: 'Screen reader: “Button”', caption: 'A screen-reader check confirms that the cart’s purpose is unclear.' },
    { id: 'image-ready', ms: 1000, stage: 2, target: 'image', tool: 'code', states: 'fff', patch: 'ready', title: 'Write a useful description.', label: 'Update image text', feedback: 'Preparing the image fix', caption: 'The fix belongs in the website’s content and code.' },
    { id: 'image-applied', ms: 1500, stage: 2, target: 'image', tool: 'code', states: 'xff', patch: 'applying', tone: 'fixed', title: 'Image description added.', label: 'Fix applied', feedback: 'Image text added', caption: 'The product image now has a meaningful text alternative.' },
    { id: 'cart-ready', ms: 900, stage: 2, target: 'cart', tool: 'code', states: 'xff', patch: 'ready', title: 'Give the cart a clear name.', label: 'Update control label', feedback: 'Preparing the cart label', caption: 'Give the icon button a name that communicates what it does.' },
    { id: 'cart-applied', ms: 1300, stage: 2, target: 'cart', tool: 'code', states: 'xxf', patch: 'applying', tone: 'fixed', title: 'Cart control labelled.', label: 'Fix applied', feedback: 'Cart label added', caption: 'The cart label now describes its purpose.' },
    { id: 'keyboard-ready', ms: 900, stage: 2, target: 'keyboard', tool: 'code', states: 'xxf', patch: 'ready', title: 'Fix the interaction itself.', label: 'Update component', feedback: 'Preparing the keyboard fix', caption: 'Replace the mouse-only control with a native link.' },
    { id: 'keyboard-applied', ms: 1400, stage: 2, target: 'keyboard', tool: 'code', states: 'xxx', patch: 'applying', tone: 'fixed', title: 'A native link, ready to test.', label: 'Fix applied', feedback: 'Keyboard interaction updated', caption: 'The native link provides keyboard focus and activation.' },
    { id: 'verify-cart', ms: 900, stage: 3, target: 'cart', tool: 'keyboard', states: 'xxx', input: 'keyboard', key: 'Tab', title: 'Start by retesting the cart.', detail: 'Keyboard focus reaches the cart.', label: 'Retest: cart', feedback: 'Retest: cart control', caption: 'Verification starts at the cart, then checks the corrected interactions.' },
    { id: 'reader-after', ms: 1300, stage: 3, target: 'cart', tool: 'reader', states: 'xvx', input: 'reader', tone: 'verified', title: 'Now its purpose is clear.', quote: '“Open shopping cart, button.”', detail: 'A useful name is announced.', label: 'Label verified', feedback: 'Cart label verified', caption: 'The screen reader now announces the cart control’s purpose.' },
    { id: 'verify-link', ms: 700, stage: 3, target: 'keyboard', tool: 'keyboard', states: 'xvx', input: 'keyboard', key: 'Tab', title: 'Focus reaches the collection.', detail: 'The previously skipped link is reachable.', label: 'Keyboard focus', feedback: 'Tab: collection link', caption: 'This time, Tab reaches the collection link.' },
    { id: 'verify-keyboard', ms: 900, stage: 3, target: 'keyboard', tool: 'keyboard', states: 'xvv', input: 'keyboard', key: 'Enter', tone: 'verified', title: 'The collection link works.', detail: 'Tab reaches it. Enter activates it.', label: 'Reachable + operable', feedback: 'Collection link activated', caption: 'The previously skipped control can now be reached and activated.' },
    { id: 'verify-image', ms: 1100, stage: 3, target: 'image', tool: 'reader', states: 'vvv', input: 'reader', tone: 'verified', title: 'The image is described.', quote: '“Ivory wireless headphones, image.”', detail: 'The text alternative is verified.', label: 'Description verified', feedback: 'Image text verified', caption: 'Retesting confirms that the product image has a useful description.' },
    { id: 'complete', ms: 3500, stage: 3, target: null, tool: 'report', states: 'vvv', tone: 'verified', title: 'Remediated & retested.', feedback: 'Checks complete', caption: 'Found. Fixed. Retested. Each change has a documented outcome.' },
    { id: 'document-work', ms: 1700, stage: 4, target: null, tool: 'document', states: 'vvv', document: 'work', records: 1, title: 'Record the findings and fixes.', name: 'Findings & remediation log', detail: 'Connect each barrier to its WCAG reference, code change and final status.', caption: 'A clear work record explains what was found, what changed and what was retested.' },
    { id: 'document-evidence', ms: 1800, stage: 4, target: null, tool: 'document', states: 'vvv', document: 'evidence', records: 2, title: 'Show the retesting evidence.', name: 'Video & verification notes', detail: 'Document keyboard and screen-reader checks with recordings and written results.', caption: 'Verification evidence can include screen recordings, test notes and retesting results.' },
    { id: 'document-vpat', ms: 2100, stage: 4, target: null, tool: 'document', states: 'vvv', document: 'vpat', records: 3, title: 'Document conformance.', name: 'VPAT / ACR documentation', detail: 'When included in scope, an accessibility conformance report records evaluation results and limitations.', caption: 'VPAT-based conformance reporting is available when included in the project scope.' },
    { id: 'document-complete', ms: 2600, stage: 4, target: null, tool: 'document', states: 'vvv', records: 3, title: 'A clear handoff for your team.', name: 'Your accessibility work record', detail: 'Findings, fixes and verification evidence, organized for your team and next steps.', caption: 'A practical record of the work. Deliverables depend on the agreed project scope.' }
  ];
  const indexOf = id => frames.findIndex(frame => frame.id === id);
  const stages = [
    { start: 'survey', summary: 'cart-found' },
    { start: 'tab-home', summary: 'reader-before' },
    { start: 'image-ready', summary: 'keyboard-applied' },
    { start: 'verify-cart', summary: 'complete' },
    { start: 'document-work', summary: 'document-complete' }
  ].map((stage,index) => ({ ...stage,name:buttons[index].querySelector('.film-stage-label').textContent.trim() }));
  const replays = {
    image: ['image-inspect','image-found','image-ready','image-applied','verify-image','complete'],
    cart: ['cart-found','reader-before','cart-ready','cart-applied','reader-after','complete'],
    keyboard: ['tab-home','tab-cart','tab-blocked','keyboard-ready','keyboard-applied','verify-cart','verify-link','verify-keyboard','complete']
  };
  let current = frames[0];
  let sequence = frames.map((_,index) => index);
  let position = 0;
  let replayIssue = null;
  let statuses = { image: 'verified', cart: 'verified', keyboard: 'verified' };
  let visible = true;
  let timer = null;
  let remaining = 0;
  let startedAt = 0;
  let placementFrame = null;
  const clamp = (number,min,max) => Math.min(Math.max(number,min),Math.max(min,max));
  function stopTimer() {
    if (timer === null) return;
    window.clearTimeout(timer);
    remaining = Math.max(0,remaining-(performance.now()-startedAt));
    timer = null;
  }
  function updatePlayback() {
    stopTimer();
    const playing = visible && !document.hidden && !reducedMotion.matches;
    film.dataset.playing = String(playing);
    if (!playing) return;
    startedAt = performance.now();
    timer = window.setTimeout(() => {
      timer = null;
      position += 1;
      if (position >= sequence.length) {
        replayIssue = null;
        sequence = frames.map((_,index) => index);
        position = 0;
      }
      renderFrame(sequence[position]);
    },Math.max(40,remaining));
  }
  function placeTargets() {
    placementFrame = null;
    const bounds = browser.getBoundingClientRect();
    if (!bounds.width) return;
    pins.forEach(pin => {
      const rect = targets[pin.dataset.issue].getBoundingClientRect();
      const x = pin.dataset.issue === 'image' ? rect.left-bounds.left-9 : rect.right-bounds.left-28;
      const y = rect.top-bounds.top-20;
      pin.style.setProperty('--pin-x',clamp(x,2,bounds.width-46)+'px');
      pin.style.setProperty('--pin-y',clamp(y,2,bounds.height-46)+'px');
    });
    if (!current.target) return;
    const target = targets[current.target].getBoundingClientRect();
    const x = clamp(target.left-bounds.left-4,4,bounds.width-12);
    const y = clamp(target.top-bounds.top-4,4,bounds.height-12);
    ring.style.setProperty('--target-x',x+'px');
    ring.style.setProperty('--target-y',y+'px');
    ring.style.setProperty('--target-width',Math.min(target.width+8,bounds.width-x-4)+'px');
    ring.style.setProperty('--target-height',Math.min(target.height+8,bounds.height-y-4)+'px');
    const cursorX = target.left-bounds.left+target.width*.64;
    const cursorY = target.top-bounds.top+target.height*.45;
    cursor.style.setProperty('--cursor-x',clamp(cursorX,6,bounds.width-26)+'px');
    cursor.style.setProperty('--cursor-y',clamp(cursorY,6,bounds.height-32)+'px');
    cursor.dataset.align = cursorX > bounds.width*.65 ? 'end' : 'start';
    ring.dataset.align = x > bounds.width*.55 ? 'end' : 'start';
    if (current.tool !== 'code') return;
    const outer = visual.getBoundingClientRect();
    const source = find('.film-code-tool').getBoundingClientRect();
    const sx = source.left-outer.left, sy = source.top-outer.top+source.height*.55;
    const ex = target.right-outer.left+4, ey = target.top-outer.top+target.height*.5;
    const connection = find('.film-repair-connection');
    connection.setAttribute('viewBox','0 0 '+outer.width+' '+outer.height);
    connection.querySelector('path').setAttribute('d','M '+sx+' '+sy+' C '+(sx-60)+' '+sy+', '+(ex+55)+' '+ey+', '+ex+' '+ey);
    connection.querySelector('circle').setAttribute('cx',ex);
    connection.querySelector('circle').setAttribute('cy',ey);
  }
  function requestPlacement() {
    if (placementFrame !== null) window.cancelAnimationFrame(placementFrame);
    placementFrame = window.requestAnimationFrame(placeTargets);
  }
  function renderFrame(index,staticIssue=false) {
    stopTimer();
    current = frames[index];
    remaining = current.ms;
    const frameStates = Object.fromEntries(issues.map((issue,i) => [issue,stateNames[current.states[i]]]));
    statuses = replayIssue ? { ...statuses,[replayIssue]: staticIssue ? 'verified' : frameStates[replayIssue] } : frameStates;
    Object.assign(film.dataset,{
      step:String(current.stage),beat:current.id,tool:current.tool,input:current.input||'mouse',
      tone:current.tone||'normal',patch:current.patch||'',mode:replayIssue?'replay':'full',
      image:statuses.image,cart:statuses.cart,keyboard:statuses.keyboard
    });
    buttons.forEach((button,i) => button.setAttribute('aria-pressed',String(i===current.stage)));
    find('.film-stage-name').textContent = stages[current.stage].name;
    find('.film-action-title').textContent = replayIssue && current.id==='complete' ? issueNames[replayIssue]+' verified.' : current.title;
    find('.film-demo-feedback').textContent = current.feedback||'Review in progress';
    find('.film-ring-label').textContent = current.label||'';
    cursor.querySelector('span').textContent = current.tool==='code'?'Apply fix':current.tone==='issue'?'Issue found':'Inspect';
    all('[data-tool-panel]').forEach(panel => { panel.hidden = panel.dataset.toolPanel!==current.tool; });
    find('.film-inspect-name').textContent = current.name||'Website component';
    find('.film-inspect-detail').textContent = current.detail||'';
    find('.film-keyboard-detail').textContent = current.detail||'';
    find('.film-reader-quote').textContent = current.quote||'';
    find('.film-reader-verdict').textContent = current.detail||'';
    find('.film-documentation').hidden = current.stage!==4;
    find('.film-document-title').textContent = current.name||'';
    find('.film-document-detail').textContent = current.detail||'';
    all('[data-document]').forEach((card,i) => {
      card.dataset.state = i<(current.records||0)?'recorded':'queued';
      card.classList.toggle('is-current',card.dataset.document===current.document);
    });
    if (current.tool==='code') {
      const fix = fixes[current.target];
      find('.film-code-before').textContent = fix.before;
      find('.film-code-after').textContent = fix.after;
      find('.film-patch-state').textContent = current.patch==='ready'?'Preparing fix':'Fix applied';
    }
    find('.film-report-title').textContent = replayIssue?'Fix documented.':'Work documented.';
    find('.film-report-detail').textContent = replayIssue?fixes[replayIssue].report:'Three example barriers fixed and verified.';
    all('[data-route]').forEach(node => {
      node.classList.toggle('is-active',node.dataset.route===current.target);
      node.classList.toggle('is-blocked',node.dataset.route==='keyboard'&&current.id==='tab-blocked');
    });
    all('[data-key]').forEach(node => {
      node.classList.remove('is-pressed');
      if (node.dataset.key===current.key) {
        void node.offsetWidth;
        node.classList.add('is-pressed');
      }
    });
    pins.forEach((pin,i) => {
      const state = statuses[pin.dataset.issue];
      if (pin.dataset.state!==state) pin.dataset.state = state;
      pin.querySelector('.film-pin-symbol').textContent = state==='verified'?'✓':String(i+1);
    });
    findings.forEach((row,i) => {
      const state = statuses[row.dataset.finding];
      row.dataset.state = state;
      row.classList.toggle('is-current',row.dataset.finding===current.target);
      row.querySelector('.film-finding-symbol').textContent = state==='verified'?'✓':state==='found'?'!':state==='fixed'?'·':String(i+1);
      row.querySelector('.film-finding-status').textContent = stateLabels[state];
    });
    requestPlacement();
    updatePlayback();
  }
  function selectStage(index) {
    replayIssue = null;
    sequence = frames.map((_,i)=>i);
    position = indexOf(reducedMotion.matches?stages[index].summary:stages[index].start);
    renderFrame(position);
    announcement.textContent = stages[index].name+'. '+current.caption;
  }
  function replay(issue) {
    replayIssue = issue;
    sequence = replays[issue].map(indexOf);
    position = 0;
    if (reducedMotion.matches) renderFrame(indexOf(issue+'-applied'),true);
    else renderFrame(sequence[0]);
    announcement.textContent = (reducedMotion.matches?'':'Replaying '+issueNames[issue]+'. ')+fixes[issue].summary;
  }
  buttons.forEach((button,index) => {
    button.addEventListener('click',()=>selectStage(index));
    button.addEventListener('keydown',event => {
      let next;
      if (event.key==='ArrowRight') next = (index+1)%buttons.length;
      else if (event.key==='ArrowLeft') next = (index+buttons.length-1)%buttons.length;
      else if (event.key==='Home') next = 0;
      else if (event.key==='End') next = buttons.length-1;
      else return;
      event.preventDefault();
      buttons[next].focus();
      selectStage(next);
    });
  });
  pins.forEach(pin => {
    pin.hidden = false;
    pin.addEventListener('click',()=>replay(pin.dataset.issue));
  });
  find('.film-controls').hidden = false;
  film.classList.add('is-enhanced');
  reducedMotion.addEventListener('change',event => {
    replayIssue = null;
    sequence = frames.map((_,i)=>i);
    position = event.matches?indexOf('complete'):0;
    renderFrame(position);
  });
  document.addEventListener('visibilitychange',updatePlayback);
  window.addEventListener('pageshow',updatePlayback);
  window.addEventListener('resize',requestPlacement);
  find('.film-product-image img').addEventListener('load',requestPlacement);
  if ('ResizeObserver' in window) new ResizeObserver(requestPlacement).observe(visual);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      updatePlayback();
    },{threshold:0});
    observer.observe(film);
  }
  position = reducedMotion.matches?indexOf('complete'):0;
  renderFrame(position);
})();

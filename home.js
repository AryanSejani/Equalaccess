/* Homepage interactions. All previews are illustrative; no visitor data is collected. */
(() => {
  const tablist = document.querySelector('.home-process-tabs');
  if (tablist) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const progress = document.querySelector('.home-process-progress');
    const select = index => {
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
      });
      progress.style.setProperty('--process-progress', `${(index + 1) / tabs.length * 100}%`);
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('pointerenter', event => {
        if (event.pointerType === 'mouse' && !tablist.contains(document.activeElement)) select(index);
      });
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        select(next);
        tabs[next].focus();
      });
    });
  }

  const demo = document.getElementById('remediation-demo');
  if (!demo) return;
  const headphonesImage = new URL('./assets/ivory-headphones.webp', document.currentScript.src).href;
  const icon = name => `<svg class="icon" aria-hidden="true" focusable="false"><use href="#${name}"/></svg>`;
  const note = (text, verified) => `<span class="demo-issue-note${verified ? ' demo-verified-note' : ''}">${icon(verified ? 'i-check' : 'i-info')}${text}</span>`;
  const examples = {
    forms: {
      label: 'Forms', heading: 'Stay in the loop.', intro: 'News, new arrivals, and thoughtful little things.',
      issue: 'Form control does not have an accessible label.',
      detail: 'Placeholder text alone does not provide a persistent, reliable label. A screen reader user may not hear what this field is for.',
      reason: 'Every input needs an accessible name that communicates its purpose.',
      fix: 'Associate a visible Email address label with the input using matching for and id attributes.',
      code: '<label for="updates-email">Email address</label>\n<input id="updates-email"\n  type="email"\n  autocomplete="email">',
      fixedTitle: 'A visible label, connected to its input.',
      verifiedTitle: 'The purpose of the field is clear.',
      verification: 'Retest keyboard focus and the field’s announced name with a screen reader. Confirm the visible label stays in place while entering text.',
      outcome: 'The example input has a visible label and a matching programmatic association.',
      before: `<div class="demo-email-field"><span class="demo-field-placeholder">Your email</span></div><span class="demo-mock-button">Keep me posted</span>${note('Missing accessible label',false)}`,
      after: `<span class="demo-field-label">Email address</span><div class="demo-email-field demo-focus-target">you@example.com</div><span class="demo-mock-button">Keep me posted</span>${note('Visible label + accessible name',true)}`
    },
    keyboard: {
      label: 'Keyboard', heading: 'Find your everyday.', intro: 'Thoughtful essentials, ready to explore.',
      issue: 'An important action cannot be reached with a keyboard.',
      detail: 'A clickable element built without keyboard behavior can work with a mouse while leaving keyboard users unable to reach or activate it.',
      reason: 'People need to be able to reach and operate important controls without a mouse.',
      fix: 'Use a native button for the action and attach its behavior to the click event, so Enter and Space can activate it.',
      code: '<button type="button" id="shop">\n  Shop collection\n</button>\n\nshop.addEventListener("click", openCollection);',
      fixedTitle: 'A control that works beyond the mouse.',
      verifiedTitle: 'Reach it. Focus it. Activate it.',
      verification: 'Move through the page using Tab and Shift+Tab. Check that the button receives focus and activates using Enter and Space.',
      outcome: 'The example action uses a native button with keyboard activation.',
      before: `<div class="demo-keyboard-path"><span class="demo-key">Tab</span><span>→</span><span class="demo-key">Tab</span><span>→ skipped action</span></div><span class="demo-mock-button demo-target">Shop collection</span>${note('Action skipped in the tab order',false)}`,
      after: `<div class="demo-keyboard-path"><span class="demo-key">Tab</span><span>→</span><span class="demo-key">Enter</span></div><span class="demo-mock-button demo-target demo-focus-target">Shop collection</span>${note('Button reached and activated',true)}`
    },
    images: {
      label: 'Images', heading: 'Everyday sound.', intro: 'Good design deserves a useful description.',
      issue: 'A meaningful product image has no text alternative.',
      detail: 'Without useful alternative text, someone using a screen reader can miss the visual information needed to understand the product.',
      reason: 'Meaningful images need text alternatives that describe their purpose in context.',
      fix: 'Add concise, useful alt text to the product image. Decorative images should use an empty alt attribute instead.',
      code: '<img src="headphones.jpg"\n  alt="Ivory over-ear headphones\n       with cushioned ear cups">',
      fixedTitle: 'The image’s meaning, in words.',
      verifiedTitle: 'Product information is available as text.',
      verification: 'Inspect the alternative text in context and listen with a screen reader. Check that the description is useful and not unnecessarily repeated.',
      outcome: 'The example product image communicates the relevant visual information.',
      before: `<div class="demo-image-example"><img class="demo-inline-image" src="${headphonesImage}" alt=""><span class="demo-alt-copy">headphones_01.png</span></div>${note('Product meaning is missing',false)}`,
      after: `<div class="demo-image-example"><img class="demo-inline-image" src="${headphonesImage}" alt=""><span class="demo-alt-copy">Ivory over-ear headphones with cushioned ear cups</span></div>${note('Meaningful image text provided',true)}`
    },
    navigation: {
      label: 'Navigation', heading: 'Explore the collection.', intro: 'A clear route to what you came for.',
      issue: 'Navigation choices depend on hovering with a mouse.',
      detail: 'If a submenu appears only on hover, people using a keyboard or touch screen may not be able to discover and operate its links.',
      reason: 'Navigation needs an understandable structure and controls that work across input methods.',
      fix: 'Use a disclosure control that opens on activation. Keep its links operable and communicate the open or closed state.',
      code: '<details>\n  <summary>Collections</summary>\n  <a href="/new/">New arrivals</a>\n  <a href="/essentials/">Essentials</a>\n</details>',
      fixedTitle: 'A menu with a clear open and closed state.',
      verifiedTitle: 'The next destination is within reach.',
      verification: 'Open and close the disclosure using keyboard and touch. Check that its state is announced and its links follow a logical focus order.',
      outcome: 'The example navigation uses a native disclosure with usable links.',
      before: `<div class="demo-navigation-list"><span>Collections ⌄</span></div>${note('Submenu available only on hover',false)}`,
      after: `<div class="demo-navigation-list"><span class="demo-focus-target">Collections ⌃</span><span>New arrivals</span><span>Essentials</span></div>${note('Open state + reachable links',true)}`
    },
    focus: {
      label: 'Focus', heading: 'A clear next step.', intro: 'See exactly where you are on the page.',
      issue: 'Keyboard focus is invisible on an important control.',
      detail: 'Removing the default outline without providing another focus indicator makes it difficult to tell which control is currently selected.',
      reason: 'A visible focus indicator helps keyboard users understand where they are before activating a control.',
      fix: 'Provide a clear, contrasting focus outline, and check that it is not hidden or clipped by surrounding content.',
      code: 'button:focus-visible {\n  outline: 3px solid #155AC1;\n  outline-offset: 4px;\n}',
      fixedTitle: 'A focus indicator you can follow.',
      verifiedTitle: 'The active control is easy to locate.',
      verification: 'Tab through the page and confirm the indicator is visible, has sufficient contrast, and remains unobscured across layouts.',
      outcome: 'The example action has a distinct focus ring with space around it.',
      before: `<div class="demo-keyboard-path"><span class="demo-key">Tab</span><span>Where is the focus?</span></div><span class="demo-mock-button demo-target">Continue shopping</span>${note('No visible focus indicator',false)}`,
      after: `<div class="demo-keyboard-path"><span class="demo-key">Tab</span><span>Focus is here ↓</span></div><span class="demo-mock-button demo-target demo-focus-target">Continue shopping</span>${note('Clear, visible keyboard focus',true)}`
    },
    screenreader: {
      label: 'Screen Reader', heading: 'Meaning beyond the icon.', intro: 'An understandable action for every visitor.',
      issue: 'An icon-only control has no accessible name.',
      detail: 'A shopping bag icon may look familiar, but a screen reader user can hear only “button” when the control has no useful name.',
      reason: 'Controls need an accessible name that describes the action they perform.',
      fix: 'Give the cart button a descriptive accessible name and hide the purely decorative icon from assistive technology.',
      code: '<button type="button"\n  aria-label="Open shopping cart">\n  <svg aria-hidden="true">…</svg>\n</button>',
      fixedTitle: 'An action with a descriptive name.',
      verifiedTitle: 'The cart control has a clear purpose.',
      verification: 'Focus the control with a screen reader and confirm its name and role are announced correctly. Test the resulting cart interaction separately.',
      outcome: 'The example control is announced as “Open shopping cart, button.”',
      before: `<span class="demo-mock-button">${icon('i-bag')}</span><div class="demo-announcement">${icon('i-chat')}“Button”</div>${note('The action has no useful name',false)}`,
      after: `<span class="demo-mock-button demo-focus-target">${icon('i-bag')}</span><div class="demo-announcement">${icon('i-chat')}“Open shopping cart, button”</div>${note('Accessible name and role conveyed',true)}`
    }
  };
  let issue = 'forms';
  let stage = 'before';
  const issueButtons = [...demo.querySelectorAll('[data-demo-issue]')];
  const stageButtons = [...demo.querySelectorAll('[data-demo-stage]')];
  const get = id => document.getElementById(id);
  const states = {before:'Before',fix:'Code-Level Fix',verified:'Verified'};
  function render(announce = true) {
    const item = examples[issue];
    demo.dataset.issue = issue;
    demo.dataset.stage = stage;
    issueButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.demoIssue === issue)));
    stageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.demoStage === stage)));
    demo.querySelector('.demo-storefront').hidden = stage === 'fix';
    demo.querySelector('.demo-code-view').hidden = stage !== 'fix';
    demo.querySelector('.demo-browser-state').textContent = states[stage];
    get('demo-mock-heading').textContent = item.heading;
    get('demo-mock-intro').textContent = item.intro;
    // Only trusted, authored example markup is inserted; no external or user input.
    get('demo-mock-ui').innerHTML = stage === 'verified' ? item.after : item.before;
    get('demo-code').textContent = item.code;
    get('demo-status').textContent = stage === 'before' ? 'Issue identified' : stage === 'fix' ? 'Code-level remediation' : 'Verified example';
    get('demo-finding').textContent = stage === 'before' ? item.issue : stage === 'fix' ? item.fixedTitle : item.verifiedTitle;
    get('demo-detail').textContent = stage === 'before' ? item.detail : stage === 'fix' ? item.fix : item.outcome;
    demo.querySelector('.demo-technical > span').textContent = stage === 'before' ? 'WHY IT MATTERS' : 'HOW TO VERIFY';
    get('demo-technical-text').textContent = stage === 'before' ? item.reason : item.verification;
    get('demo-next-label').textContent = stage === 'before' ? 'THE REMEDIATION' : stage === 'fix' ? 'NEXT: RETEST' : 'DOCUMENT THE WORK';
    get('demo-next-text').textContent = stage === 'before' ? item.fix : stage === 'fix' ? 'A code change is the starting point. Retest the component in its full user journey.' : 'Record the change and the verification results. Other accessibility criteria and journeys still need their own review.';
    if (announce) {
      get('demo-live-status').textContent = `${item.label}. ${states[stage]}. ${get('demo-finding').textContent}`;
      const frame = get('demo-example');
      frame.classList.remove('is-changing');
      window.requestAnimationFrame(() => { frame.classList.add('is-changing'); });
    }
  }
  issueButtons.forEach(button => button.addEventListener('click', () => {
    issue = button.dataset.demoIssue;
    stage = 'before';
    render();
  }));
  stageButtons.forEach(button => button.addEventListener('click', () => {
    stage = button.dataset.demoStage;
    render();
  }));
  render(false);
})();

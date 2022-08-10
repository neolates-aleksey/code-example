class MtnModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector('[data-modal-opener]');

    if (!button) return;
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.querySelector(this.getAttribute('data-modal'));
      if (modal) modal.show(button);
    });
  }
}

customElements.define('mtn-modal-opener', MtnModalOpener);

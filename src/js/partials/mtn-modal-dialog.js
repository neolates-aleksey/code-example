import initCustomSelect from "./mtn-custom-select";

class MtnModalDialog extends HTMLElement {
  constructor() {
    super();
    this.closeTrigger = this.querySelectorAll('[data-modal-close]');

    this.closeTrigger.forEach(trigger => {
      trigger.addEventListener(
        'click',
        this.hide.bind(this, false)
      );
    });

    document.addEventListener('keyup', (event) => {
      if (event.code.toUpperCase() === 'ESCAPE') this.hide();
    });

    if (this.classList.contains('media-modal')) {
      this.addEventListener('pointerup', (event) => {
        if (event.pointerType === 'mouse' && !event.target.closest('deferred-media, product-model')) this.hide();
      });
    } else {
      this.addEventListener('click', (event) => {
        if (event.target === this) this.hide();
      });
    }
  }

  show(opener) {
    const focusableElements = this.querySelector('[role="dialog"]');
    this.openedBy = opener;
    document.body.classList.add('is-modal-open');
    this.classList.add('is-opened');

    if (focusableElements) {
      // eslint-disable-next-line no-undef
      trapFocus(this, this.querySelector('[role="dialog"]'));
    }
    window.pauseAllMedia();

    if (this.openedBy.classList.contains('js-quick-view')) {
      this.renderProductInfo();
    }

  }

  hide() {
    document.body.classList.remove('is-modal-open');
    document.body.dispatchEvent(new CustomEvent('modalClosed'));
    this.classList.remove('is-opened');

    const event = new Event('focusout');
    this.openedBy.dispatchEvent(event);
    window.pauseAllMedia();
  }

  renderProductInfo() {
    const productHandle = this.openedBy.dataset.productHandle;

    if (productHandle !== this.dataset.productHandle) {
      this.fetchProductInfo(productHandle);
    }
  }

  fetchProductInfo(productHandle) {
    const modalContent = this.querySelector('[data-quick-view]');
    const loadingState = 'is-loading';

    modalContent.innerHTML = "";
    this.classList.add(loadingState);

    fetch(`/products/${productHandle}?section_id=s-main-product-quick-view`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const section = html.getElementById('shopify-section-s-main-product-quick-view');

        modalContent.append(section);

        this.setAttribute('data-product-handle', productHandle);
        this.classList.remove(loadingState);
        initCustomSelect();

        // reinitialization 'Buy it now' button
        // eslint-disable-next-line no-undef
        if (window.Shopify && Shopify.PaymentButton) {
          // eslint-disable-next-line no-undef
          Shopify.PaymentButton.init();
        }
      }).catch((e) => {
      console.error(e);
    })
  }
}

customElements.define('mtn-modal-dialog', MtnModalDialog);


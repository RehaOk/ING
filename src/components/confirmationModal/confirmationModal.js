import {LitElement, html} from 'lit';
import {confirmationModalStyles} from './confirmationModal.styles.js';
import {store} from '../../store';

export class ConfirmationModal extends LitElement {
  static styles = confirmationModalStyles;
  static properties = {
    employeeName: {type: String},
    isActive: {type: Boolean},
    onConfirm: {type: Function},
    onCancel: {type: Function},
    translations: {type: Object},
  };

  constructor() {
    super();
    this.employee = '';
    this.isActive = false;
    const {localization} = store.getState();
    this.translations = localization.translations;
  }

  connectedCallback() {
    super.connectedCallback();
    const {localization} = store.getState();
    this.locale = localization.locale;
    this.unSubscribe = store.subscribe(() => {
      const {localization} = store.getState();
      this.translations = localization.translations;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unSubscribe();
  }

  render() {
    return this.isActive
      ? html`<div class="modal__overlay">
          <div
            class="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div class="modal__title">
              <slot name="title"
                >${this.translations.confirmationModal.modalTitle}</slot
              >
              <button
                type="button"
                class="modal__close-button"
                @click=${this.onCancel}
                aria-label="Close"
              >
                <img src="./src/icons/xIcon.svg" alt="Close Icon" />
              </button>
            </div>
            <p class="modal__message">
              <slot name="message">
                ${this.translations.confirmationModal.modalMessage.part1}
                ${this.employeeName}
                ${this.translations.confirmationModal.modalMessage.part2}
              </slot>
            </p>
            <button
              type="button"
              class="modal__button modal__button--confirm"
              @click=${this.onConfirm}
            >
              ${this.translations.confirmationModal.proceed}
            </button>
            <button
              type="button"
              class="modal__button modal__button--cancel"
              @click=${this.onCancel}
            >
              ${this.translations.confirmationModal.cancel}
            </button>
          </div>
        </div>`
      : null;
  }
}

customElements.define('confirmation-modal', ConfirmationModal);

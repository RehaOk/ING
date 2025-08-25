import {LitElement, html} from 'lit';
import {confirmationModalStyles} from './confirmationModal.styles.js';

/* TODO: Localize texts */

export class ConfirmationModal extends LitElement {
  static styles = confirmationModalStyles;
  static properties = {
    employee: {type: String},
    isActive: {type: Boolean, reflect: true},
  };

  constructor() {
    super();
    this.employee = '';
  }

  onConfirm = () => this.dispatchEvent(new CustomEvent('confirm')); // TODO: work on event structures
  onCancel = () => this.dispatchEvent(new CustomEvent('cancel'));

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
              <slot name="title">Are You Sure?</slot>
              <button
                type="button"
                class="modal__close-button"
                @click=${this.onCancel}
                aria-label="Close"
              >
                <img src="./src/icons/xIcon.svg" alt="Close Icon" />
                />
              </button>
            </div>
            <p>
              <slot name="message"
                >Selected Employee record of ${this.employee} will be
                deleted</slot
              >
            </p>
            <button
              type="button"
              class="modal__button modal__button--confirm"
              @click=${this.onConfirm}
            >
              Proceed
            </button>
            <button
              type="button"
              class="modal__button modal__button--cancel"
              @click=${this.onCancel}
            >
              Cancel
            </button>
          </div>
        </div>`
      : null;
  }
}

customElements.define('confirmation-modal', ConfirmationModal);

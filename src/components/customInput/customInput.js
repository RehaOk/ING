/* 
    There is a problem with plugin if you are using it at line 84
    see https://github.com/runem/lit-analyzer/issues/97
    didn't try to fix it to save time
*/

import {LitElement, html} from 'lit';
import {customInputStyles} from './customInput.styles';
import {classMap} from 'lit/directives/class-map.js';
import {store as realStore} from '../../store';

export class CustomInput extends LitElement {
  static styles = customInputStyles;
  static properties = {
    id: {type: String},
    name: {type: String},
    type: {type: String},
    label: {type: String},
    required: {type: Boolean},
    value: {type: String},
    errorMessage: {type: String},
    options: {type: Array},
    selectedValue: {type: String},
    errorHandler: {type: Object},
    translations: {type: Object},
  };

  constructor(store = realStore) {
    super();
    this.type = 'text';
    this.label = '';
    this.required = false;
    this.value = '';
    this.errorMessage = '';
    this.id = '';
    this.touched = false;
    this.errorHandler = {};
    this.name = '';
    this.selectedValue = '';
    this._store = store;
    const {localization} = this._store.getState();
    this.translations = localization.translations;
  }

  connectedCallback() {
    super.connectedCallback();
    const {localization} = this._store.getState();
    this.locale = localization.locale;
    this.unSubscribe = this._store.subscribe(() => {
      const {localization} = this._store.getState();
      this.translations = localization.translations;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unSubscribe();
  }

  updated() {
    if (this.touched) {
      const customInput = this.shadowRoot.querySelector('input, select');
      if (customInput) {
        customInput.classList.add('touched');
      }
    }
  }

  render() {
    return html`
      <div class="custom-input">
        <label for="input-field" class="custom-input__label"
          >${this.label}
          ${this.type !== 'select'
            ? html`<div
                class=${classMap({
                  ['custom-input__input-wrapper']: true,
                  ['custom-input__input-wrapper--date']: this.type === 'date',
                })}
              >
                <input
                  id=${this.id}
                  name=${this.name}
                  type=${this.type}
                  .value=${this.value}
                  @input=${this.handleInput}
                  @blur=${this.validate}
                  ?required=${this.required}
                  .aria-describedby=${this.errorMessage
                    ? 'error-' + this.id
                    : ''}
                />
              </div>`
            : html`<div class="custom-input__input-wrapper">
                <select
                  id=${this.id}
                  name=${this.name}
                  .value=${this.selectedValue}
                  @click=${this.handleInput}
                  @change=${this.handleInput}
                >
                  <option value="" disabled selected hidden>
                    ${this.translations.customInput.selectPlaceHolder}
                  </option>
                  ${this.options.map(
                    (option) => html`
                      <option
                        .value=${option.value}
                        .selected="${this.selectedValue === option.value}"
                      >
                        ${option.label}
                      </option>
                    `
                  )}
                </select>
              </div>`}
          ${this.errorMessage
            ? html`<div class="custom-input__error-message">
                ${this.errorMessage}
              </div>`
            : ''}
        </label>
      </div>
    `;
  }

  handleInput(event) {
    if (!this.touched) {
      this.touched = true;
    }
    if (this.type === 'select' && event.target.value === '') {
      this.selectedValue = this.options[0].value;
    } else {
      this.value = event.target.value;
    }
  }

  validate() {
    if (this.type === 'select') {
      if (
        this.errorHandler.handle &&
        this.errorHandler.handle(this.selectedValue)
      ) {
        this.errorMessage = this.errorHandler.message();
      } else {
        this.errorMessage = '';
      }
    } else {
      if (this.required && !this.value) {
        this.errorMessage = `${this.translations.customInput.fieldRequired}`;
      } else if (
        this.errorHandler.handle &&
        this.errorHandler.handle(this.value)
      ) {
        this.errorMessage = this.errorHandler.message();
      } else {
        this.errorMessage = '';
      }
    }
    if (!this.touched) {
      this.touched = true;
    }
  }

  isValid() {
    this.validate();
    return !this.errorMessage;
  }
}

customElements.define('custom-input', CustomInput);

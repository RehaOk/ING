import {LitElement, html} from 'lit';
import {headerStyles} from './pageNavigation.styles';
import {store as realStore} from '../../store';
import {setLocale} from '../../slices/localizationSlice';
import {BRAND_NAME} from './pageNavigation.constants';

export class PageNavigation extends LitElement {
  static styles = headerStyles;
  static properties = {
    locale: {type: String},
    translations: {type: Object},
  };

  constructor(store = realStore) {
    super();
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
      this.locale = localization.locale;
      this.translations = localization.translations;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unSubscribe();
  }

  toggleLocale() {
    const {dispatch} = this._store;
    this.locale === 'en'
      ? dispatch(setLocale('tr'))
      : dispatch(setLocale('en'));
  }

  render() {
    return html`
      <div class="header">
        <a href="/" class="header__brand">
          <img class="header__logo" src="./src/icons/logo.png" alt="ING Logo" />
          <span class="header__title">${BRAND_NAME}</span>
        </a>
        <div class="header__actions">
          <a href="/" class="action-link"
            ><img
              class="header__icon"
              src="./src/icons/employeeIcon.svg"
              alt="Employee Icon"
            />${this.translations.navigation.employees}</a
          >
          <a href="/add" class="action-link"
            ><img
              class="header__icon"
              src="./src/icons/plusIcon.svg"
              alt="Plus Icon"
            />${this.translations.navigation.addNew}</a
          >
          <button class="action-button" @click="${this.toggleLocale}">
            ${this.locale === 'en'
              ? html`<img
                  class="header__flag-icon"
                  src="./src/icons/ukFlagIcon.svg"
                  alt="United Kingdom Flag Icon"
                />`
              : html`<img
                  class="header__flag-icon"
                  src="./src/icons/trFlagIcon.svg"
                  alt="Turkish Flag Icon"
                />`}
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('page-navigation', PageNavigation);

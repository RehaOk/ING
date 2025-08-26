import {LitElement, html} from 'lit';
import {headerStyles} from './pageNavigation.styles';
import {store} from '../../store';
import {setLocale} from '../../slices/localizationSlice';

//TODO: Add Localization
export class PageNavigation extends LitElement {
  unSubscribe;
  static styles = headerStyles;
  static properties = {
    locale: {type: String},
  };

  connectedCallback() {
    super.connectedCallback();
    const {localization} = store.getState();
    this.locale = localization.locale;
    this.unSubscribe = store.subscribe(() => {
      const {localization} = store.getState();
      this.locale = localization.locale;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unSubscribe) {
      this.unSubscribe();
    }
  }

  toggleLocale() {
    const {dispatch} = store;
    this.locale === 'en'
      ? dispatch(setLocale('tr'))
      : dispatch(setLocale('en'));
  }

  render() {
    return html`
      <div class="header">
        <a href="/" class="header__brand">
          <img class="header__logo" src="./src/icons/logo.png" alt="ING Logo" />
          <span class="header__title">ING</span>
        </a>
        <div class="header__actions">
          <a href="/" class="action-link"
            ><img
              class="header__icon"
              src="./src/icons/employeeIcon.svg"
              alt="Employee Icon"
            />Employees</a
          >
          <a href="/add" class="action-link"
            ><img
              class="header__icon"
              src="./src/icons/plusIcon.svg"
              alt="Plus Icon"
            />Add New</a
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

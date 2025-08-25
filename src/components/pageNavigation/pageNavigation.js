import {LitElement, html} from 'lit';
import {headerStyles} from './pageNavigation.styles';

//TODO: Add Localization, Add Flag Functionality with Icon Change
export class PageNavigation extends LitElement {
  static styles = headerStyles;

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
          <button class="action-button">Flag</button>
        </div>
      </div>
    `;
  }
}

customElements.define('page-navigation', PageNavigation);

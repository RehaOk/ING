import {LitElement, html} from 'lit';
import {updateViewStyles} from './update.styles';
import {store as realStore} from '../../store';
import {Router} from '@vaadin/router';

export class UpdateView extends LitElement {
  static styles = updateViewStyles;
  static properties = {
    id: {type: String},
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
    this.unSubscribe = this._store.subscribe(() => {
      const {localization} = this._store.getState();
      this.translations = localization.translations;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unSubscribe();
  }

  onAfterEnter(location) {
    const userId = location.searchParams?.get('id');
    if (userId) {
      this.id = userId;
    } else {
      Router.go('/');
    }
  }

  render() {
    return html`<page-navigation></page-navigation>
      <div class="update-view">
        <h1 class="update-view__title">
          ${this.translations.updateView.editEmployee}
        </h1>
        <employee-editor id=${this.id}></employee-editor>
      </div> `;
  }
}

customElements.define('update-view', UpdateView);

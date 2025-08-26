import {LitElement, html} from 'lit';
import {updateViewStyles} from './update.styles';
import {store} from '../../store';

export class UpdateView extends LitElement {
  static styles = updateViewStyles;
  static properties = {
    id: {type: String},
  };

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe(() => this.requestUpdate());
  }

  disconnectedCallback() {
    this.unsubscribe();
    super.disconnectedCallback();
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
        <h1 class="update-view__title">Edit Employee</h1>
        <employee-editor id=${this.id}></employee-editor>
      </div> `;
  }
}

customElements.define('update-view', UpdateView);

/* Will be used for both Add and Edit operations as stated in instructions document */
import {LitElement, html} from 'lit';
import '../../components/employeeEditor/employeeEditor';
import {createViewStyles} from './create.styles';
import {store} from '../../store';

export class CreateView extends LitElement {
  static styles = createViewStyles;

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe(() => this.requestUpdate());
  }

  disconnectedCallback() {
    this.unsubscribe();
    super.disconnectedCallback();
  }

  render() {
    return html`<page-navigation></page-navigation>
      <div class="create-view">
        <h1 class="create-view__title">Add Employee</h1>
        <employee-editor></employee-editor>
      </div>`;
  }
}

customElements.define('create-view', CreateView);

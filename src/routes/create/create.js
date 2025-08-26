import {LitElement, html} from 'lit';
import '../../components/employeeEditor/employeeEditor';
import {createViewStyles} from './create.styles';
import {store} from '../../store';

export class CreateView extends LitElement {
  static styles = createViewStyles;
  static properties = {
    translations: {type: Object},
  };

  constructor() {
    super();
    const {localization} = store.getState();
    this.translations = localization.translations;
  }

  connectedCallback() {
    super.connectedCallback();
    this.unSubscribe = store.subscribe(() => {
      const {localization} = store.getState();
      this.translations = localization.translations;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unSubscribe();
  }

  render() {
    return html`<page-navigation></page-navigation>
      <div class="create-view">
        <h1 class="create-view__title">
          ${this.translations.createView.addEmployee}
        </h1>
        <employee-editor></employee-editor>
      </div>`;
  }
}

customElements.define('create-view', CreateView);

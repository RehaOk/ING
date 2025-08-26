import {LitElement, html} from 'lit';
import {employeeEditorStyles} from './employeeEditor.styles';
import '../customInput/customInput';
import {Router} from '@vaadin/router';
import {store} from '../../store';
import {
  createEmployeeData,
  updateEmployeeData,
} from '../../slices/employeeSlice';
import {
  departmentInputErrorHandler,
  positionInputErrorHandler,
  emailInputErrorHandler,
  lastNameInputErrorHandler,
  nameInputErrorHandler,
  phoneInputErrorHandler,
  generateUniqueId,
  formatDate,
} from './employeeEditor.utils';

const positionList = JSON.stringify([
  {value: 'Junior', label: 'Junior'},
  {value: 'Medior', label: 'Medior'},
  {value: 'Senior', label: 'Senior'},
]);

export class EmployeeEditor extends LitElement {
  static styles = employeeEditorStyles;
  static properties = {
    isFormValid: {type: Boolean},
    id: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    dateOfEmployment: {type: String},
    dateOfBirth: {type: String},
    phone: {type: String},
    email: {type: String},
    department: {type: String},
    position: {type: String},
  };

  constructor() {
    super();
    this.isFormValid = false;
  }

  connectedCallback() {
    super.connectedCallback();
    if (typeof this.id === 'string' && this.id.length > 0) {
      const {employee} = store.getState();
      const {
        firstName,
        lastName,
        dateOfEmployment,
        dateOfBirth,
        phone,
        email,
        department,
        position,
      } = employee.employeeList.find(({id}) => id === this.id) || {};
      this.firstName = firstName;
      this.lastName = lastName;
      this.phone = phone;
      this.email = email;
      this.department = department;
      this.position = position;
      this.dateOfEmployment = formatDate(dateOfEmployment, '/');
      this.dateOfBirth = formatDate(dateOfBirth, '/');
      if (this.firstName === undefined) {
        // Since there is an input check, any of the fields must not be undefined
        // If there is an undefined it means rest is undefined since id is wrong
        Router.go('/');
      }
    }
  }

  handleSubmit() {
    const inputs = Array.from(this.shadowRoot.querySelectorAll('custom-input'));
    this.isFormValid = inputs.every((input) => input.isValid());
    if (this.isFormValid) {
      const {dispatch} = store;
      const submittedEmployeeData = {};
      inputs.forEach(({name, value, selectedValue}) => {
        // TODO: try to change this logic
        if (selectedValue) {
          if (value) {
            submittedEmployeeData[name] = value;
          } else {
            submittedEmployeeData[name] = selectedValue;
          }
        } else {
          submittedEmployeeData[name] = value;
        }
      });
      submittedEmployeeData.dateOfEmployment = formatDate(
        submittedEmployeeData.dateOfEmployment,
        '-'
      );
      submittedEmployeeData.dateOfBirth = formatDate(
        submittedEmployeeData.dateOfBirth,
        '-'
      );
      if (this.id) {
        // We are in update mode
        submittedEmployeeData.id = this.id;
        dispatch(updateEmployeeData(submittedEmployeeData));
      } else {
        // We are in create mode
        submittedEmployeeData.id = generateUniqueId();
        dispatch(createEmployeeData(submittedEmployeeData));
      }
      Router.go('/');
    }
  }

  handleCancel() {
    Router.go('/');
  }

  render() {
    return html`
      <div class="input__container">
        ${this.id
          ? html`<p class="input__edit-info">
              You are editing ${this.firstName} ${this.lastName}
            </p>`
          : null}
        <form @submit=${this.handleSubmit}>
          <div class="input__column">
            <div class="input__wrapper">
              <custom-input
                id="first-name"
                name="firstName"
                type="text"
                label="First Name"
                value=${this.firstName || ''}
                required
                .errorHandler=${nameInputErrorHandler}
              ></custom-input>
            </div>
            <div class="input__wrapper">
              <custom-input
                id="last-name"
                name="lastName"
                type="text"
                label="Last Name"
                value=${this.lastName || ''}
                required
                .errorHandler=${lastNameInputErrorHandler}
              ></custom-input>
            </div>
            <div class="input__wrapper">
              <custom-input
                id="date-of-employment"
                name="dateOfEmployment"
                type="date"
                label="Date of Employment"
                value=${this.dateOfEmployment || ''}
                required
              ></custom-input>
            </div>
          </div>
          <div class="input__column">
            <div class="input__wrapper">
              <custom-input
                id="date-of-birth"
                name="dateOfBirth"
                type="date"
                label="Date of Birth"
                value=${this.dateOfBirth || ''}
                required
              ></custom-input>
            </div>
            <div class="input__wrapper">
              <custom-input
                id="email"
                name="email"
                type="email"
                label="Email"
                value=${this.email || ''}
                .errorHandler=${emailInputErrorHandler}
                required
              ></custom-input>
            </div>
            <div class="input__wrapper">
              <custom-input
                id="phone"
                name="phone"
                type="tel"
                label="Phone"
                value=${this.phone || ''}
                required
                .errorHandler=${phoneInputErrorHandler}
              ></custom-input>
            </div>
          </div>
          <div class="input__column">
            <div class="input__wrapper">
              <custom-input
                id="department"
                name="department"
                type="text"
                label="Department"
                value=${this.department || ''}
                required
                .errorHandler=${departmentInputErrorHandler}
              ></custom-input>
            </div>
            <div class="input__wrapper">
              <custom-input
                id="position"
                name="position"
                type="select"
                label="Position"
                options=${positionList}
                selectedValue=${this.position || ''}
                .errorHandler=${positionInputErrorHandler}
                required
              ></custom-input>
            </div>
          </div>
          <div class="input__buttons">
            <button
              type="button"
              @click=${this.handleSubmit}
              class="input__button input__button--primary"
            >
              Save
            </button>
            <button
              type="button"
              class="input__button input__button--secondary"
              @click=${this.handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('employee-editor', EmployeeEditor);

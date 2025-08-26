import {LitElement, html} from 'lit';
import {employeeTableStyles} from './employeeTable.styles';

const headers = [
  'First Name',
  'Last Name',
  'Date of Employment',
  'Date of Birth',
  'Phone',
  'Email',
  'Department',
  'Position',
  'Actions',
];

class EmployeeTable extends LitElement {
  static styles = employeeTableStyles;
  static properties = {
    employeeList: {type: Array},
  };

  constructor() {
    super();
    this.employeeList = [];
  }

  render() {
    return html`
      <div class="employee-table">
        <div class="employee-table__wrapper">
          <table>
            <thead>
              <tr>
                ${headers.map((header) => html`<th>${header}</th>`)}
              </tr>
            </thead>
            <tbody>
              ${this.employeeList.map(
                ({
                  firstName,
                  lastName,
                  dateOfEmployment,
                  dateOfBirth,
                  phone,
                  email,
                  department,
                  position,
                }) => html`
                  <tr>
                    <td>${firstName}</td>
                    <td>${lastName}</td>
                    <td>${dateOfEmployment}</td>
                    <td>${dateOfBirth}</td>
                    <td>${phone}</td>
                    <td>${email}</td>
                    <td>${department}</td>
                    <td>${position}</td>
                    <td class="employee-table__actions-cell">
                      <button class="employee-table__action-button">
                        <!-- Edit Icon -->
                      </button>
                      <button class="employee-table__action-button">
                        <!-- Delete Icon -->
                      </button>
                    </td>
                  </tr>
                `
              )}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

customElements.define('employee-table', EmployeeTable);

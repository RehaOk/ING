import {LitElement, html} from 'lit';
import {employeeTableStyles} from './employeeTable.styles';
import {Router} from '@vaadin/router';
import {store} from '../../store';
import {deleteEmployeeData} from '../../slices/employeeSlice';
import {
  setTotalPageNumber,
  setEmployeeListToDisplay,
  setCurrentPage,
} from '../../slices/paginationSlice';

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
    employeeToDelete: {type: Object},
    employeeName: {type: String},
  };

  constructor() {
    super();
    this.employeeList = [];
    this.employeeToDelete = null;
    this.employeeName = '';
  }

  handleEditButtonClick(employeeId) {
    Router.go(`/update?id=${employeeId}`);
  }

  handleConfirmationModalConfirm(employeeId) {
    const {dispatch, getState} = store;
    dispatch(deleteEmployeeData(employeeId));
    this.isConfirmationModalActive = false;
    const {employee, pagination} = getState();
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    dispatch(setEmployeeListToDisplay(employee.employeeList.slice(start, end)));
    dispatch(setTotalPageNumber({employeeCount: employee.employeeList.length}));
    if (pagination.currentPage > pagination.totalPageNumber) {
      dispatch(setCurrentPage(pagination.totalPageNumber));
    }
  }

  handleConfirmationModalCancel() {
    this.isConfirmationModalActive = false;
    this.employeeToDelete = null;
  }

  displayConfirmationModal(employeeId) {
    if (!this.isConfirmationModalActive) {
      this.isConfirmationModalActive = true;
      this.employeeToDelete =
        this.employeeList.find(({id}) => id === employeeId) || null;
      if (this.employeeToDelete) {
        this.employeeName = `${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName}`;
      }
    }
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
                  id,
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
                    <td>
                      <button
                        class="employee-table__action-button"
                        @click=${() => this.handleEditButtonClick(id)}
                      >
                        <img
                          src="./src/icons/pencilSquareIconColored.svg"
                          alt="Edit Icon"
                        />
                      </button>
                      <button
                        class="employee-table__action-button"
                        @click=${() => this.displayConfirmationModal(id)}
                      >
                        <img
                          src="./src/icons/trashIconColored.svg"
                          alt="Delete Icon"
                        />
                      </button>
                    </td>
                  </tr>
                `
              )}
            </tbody>
          </table>
        </div>
      </div>
      <confirmation-modal
        ?isActive=${this.isConfirmationModalActive}
        employeeName=${this.employeeName}
        .onConfirm=${() =>
          this.handleConfirmationModalConfirm(this.employeeToDelete.id)}
        .onCancel=${this.handleConfirmationModalCancel.bind(this)}
      ></confirmation-modal>
    `;
  }
}

customElements.define('employee-table', EmployeeTable);

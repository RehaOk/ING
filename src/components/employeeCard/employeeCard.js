import {LitElement, html} from 'lit';
import {employeeCardStyles} from './employeeCard.styles';
import {Router} from '@vaadin/router';
import {userFriendlyLabels} from './employeeCard.contsants';
import {store} from '../../store';
import {deleteEmployeeData} from '../../slices/employeeSlice';
import {
  setTotalPageNumber,
  setEmployeeListToDisplay,
  setCurrentPage,
} from '../../slices/paginationSlice';

export class EmployeeCard extends LitElement {
  static styles = employeeCardStyles;

  static properties = {
    employee: {type: Object},
    formattedEmployees: {type: Array},
    isConfirmationModalActive: {type: Boolean},
  };

  constructor() {
    super();
    this.isConfirmationModalActive = false;
  }

  willUpdate() {
    this.formattedEmployees = Object.entries(this.employee)
      .filter(([key]) => key !== 'id') // TODO: maybe we dont need this logic connect store here
      .reduce((acc, current, index, employeeList) => {
        if (index % 2 === 0) {
          const next = employeeList[index + 1];
          current[0] = userFriendlyLabels['en'][current[0]]; // TODO: change for localization
          next[0] = userFriendlyLabels['en'][next[0]];
          acc.push([
            [current[0], next[0]],
            [current[1], next[1]],
          ]);
        }
        return acc;
      }, []);
  }

  handleEditButtonClick() {
    Router.go(`/update?id=${this.employee.id}`);
  }

  handleDeleteButtonClick(employeeId) {
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

  displayConfirmationModal() {
    if (!this.isConfirmationModalActive) {
      this.isConfirmationModalActive = true;
    }
  }

  render() {
    return html`
      <div class="card">
        ${this.formattedEmployees.map(([dataLeft, dataRight]) => {
          return html`<div class="card__info-row">
            <div class="card__info card__info--left">
              <div class="card__info-title">${dataLeft[0]}</div>
              <div class="card__info-description">${dataRight[0]}</div>
            </div>
            <div class="card__info card__info--right">
              <div class="card__info-title">${dataLeft[1]}</div>
              <div class="card__info-description">${dataRight[1]}</div>
            </div>
          </div>`;
        })}
        <div class="card__footer">
          <button
            class="card__button card__button--secondary"
            @click=${this.handleEditButtonClick}
          >
            <span class="button__icon button__icon--edit"
              ><img src="./src/icons/pencilSquare.svg" alt="Edit Icon"
            /></span>
            Edit
          </button>
          <button
            class="card__button card__button--primary"
            @click=${this.displayConfirmationModal}
          >
            <span class="button__icon button__icon--trash"
              ><img src="./src/icons/trashIcon.svg" alt="Delete Icon"
            /></span>
            Delete
          </button>
        </div>
      </div>
      <confirmation-modal
        ?isActive=${this.isConfirmationModalActive}
        employeeName=${`${this.employee.firstName} ${this.employee.lastName}`}
        .onConfirm=${() => this.handleDeleteButtonClick(this.employee.id)}
      ></confirmation-modal>
    `;
  }
}

customElements.define('employee-card', EmployeeCard);

import {LitElement, html} from 'lit';
import {employeeCardStyles} from './employeeCard.styles';
import {Router} from '@vaadin/router';
import {store as realStore} from '../../store';
import {deleteEmployeeData} from '../../slices/employeeSlice';
import {
  setTotalPageNumber,
  setEmployeeListToDisplay,
  setCurrentPage,
} from '../../slices/paginationSlice';
import {getEmployeeListToDisplay} from '../../utils';
export class EmployeeCard extends LitElement {
  static styles = employeeCardStyles;

  static properties = {
    employee: {type: Object},
    formattedEmployees: {type: Array},
    isConfirmationModalActive: {type: Boolean},
    translations: {type: Object},
  };

  constructor(store = realStore) {
    super();
    this._store = store;
    this.isConfirmationModalActive = false;
    const {localization} = this._store.getState();
    this.translations = localization.translations;
  }

  connectedCallback() {
    super.connectedCallback();
    const {localization} = this._store.getState();
    this.locale = localization.locale;
    this.unSubscribe = this._store.subscribe(() => {
      const {localization} = this._store.getState();
      this.translations = localization.translations;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unSubscribe();
  }

  willUpdate() {
    const entries = Object.entries(this.employee).filter(
      ([key]) => key !== 'id'
    );
    const labels = this.translations.labels;
    this.formattedEmployees = [];
    for (let i = 0; i < entries.length; i += 2) {
      const [key1, value1] = entries[i];
      const [key2, value2] = entries[i + 1] || [null, null];
      this.formattedEmployees.push([
        [labels[key1], labels[key2]],
        [value1, value2],
      ]);
    }
  }

  handleEditButtonClick() {
    Router.go(`/update?id=${this.employee.id}`);
  }

  handleConfirmationModalConfirm(employeeId) {
    const {dispatch, getState} = this._store;
    dispatch(deleteEmployeeData(employeeId));
    this.isConfirmationModalActive = false;
    const {employee, pagination} = getState();
    dispatch(
      setEmployeeListToDisplay(
        getEmployeeListToDisplay(
          employee.employeeList,
          pagination.currentPage,
          pagination.itemsPerPage
        )
      )
    );
    dispatch(setTotalPageNumber({employeeCount: employee.employeeList.length}));
    if (pagination.currentPage > pagination.totalPageNumber) {
      dispatch(setCurrentPage(pagination.totalPageNumber));
    }
  }

  handleConfirmationModalCancel() {
    this.isConfirmationModalActive = false;
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
              ><img src="./src/icons/pencilSquareIcon.svg" alt="Edit Icon"
            /></span>
            ${this.translations.employeeCard.edit}
          </button>
          <button
            class="card__button card__button--primary"
            @click=${this.displayConfirmationModal}
          >
            <span class="button__icon button__icon--trash"
              ><img src="./src/icons/trashIcon.svg" alt="Delete Icon"
            /></span>
            ${this.translations.employeeCard.delete}
          </button>
        </div>
      </div>
      <confirmation-modal
        ?isActive=${this.isConfirmationModalActive}
        employeeName=${`${this.employee.firstName} ${this.employee.lastName}`}
        .onConfirm=${() =>
          this.handleConfirmationModalConfirm(this.employee.id)}
        .onCancel=${this.handleConfirmationModalCancel.bind(this)}
      ></confirmation-modal>
    `;
  }
}

customElements.define('employee-card', EmployeeCard);

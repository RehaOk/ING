import {LitElement, html} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import '../../components/confirmationModal/confirmationModal';
import '../../components/employeeCard/employeeCard';
import '../../components/pageNavigation/pageNavigation';
import '../../components/pagination/pagination';
import {setEmployeeListToDisplay} from '../../slices/paginationSlice';
import {store} from '../../store';
import {homeViewStyles} from './home.styles';
import '../../components/employeeTable/employeeTable';
import {
  setItemsPerPage,
  setPaginationForViewMode,
} from '../../slices/paginationSlice';
import {getEmployeeListToDisplay} from '../../utils';

export class HomeView extends LitElement {
  static styles = homeViewStyles;
  static properties = {
    employeeList: {type: Array},
    viewMode: {type: String},
    translations: {type: Object},
  };
  constructor() {
    super();
    this.viewMode = 'grid';
    const {dispatch, getState} = store;
    const {employee, pagination, localization} = getState();
    this.translations = localization.translations;
    this.employeeList = employee.employeeList;

    dispatch(
      setEmployeeListToDisplay(
        getEmployeeListToDisplay(
          employee.employeeList,
          pagination.currentPage,
          pagination.itemsPerPage
        )
      )
    );
  }

  connectedCallback() {
    super.connectedCallback();
    const {dispatch, getState, subscribe} = store;
    const {employee, pagination} = getState();
    this.unSubscribe = subscribe(() => {
      const {pagination, localization} = getState();
      this.translations = localization.translations;
      this.employeeList = pagination.employeeListToDisplay;
    });
    dispatch(setItemsPerPage(4));
    dispatch(
      setEmployeeListToDisplay(
        getEmployeeListToDisplay(
          employee.employeeList,
          pagination.currentPage,
          4
        )
      )
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unSubscribe();
  }

  handleViewModeChange(viewMode) {
    const {dispatch, getState} = store;
    const {employee, pagination} = getState();
    if (viewMode !== this.viewMode) {
      dispatch(
        setPaginationForViewMode({
          viewMode,
          currentPage: pagination.currentPage,
          employeeList: employee.employeeList,
        })
      );
      this.viewMode = viewMode;
    }
  }

  render() {
    return html`<page-navigation></page-navigation>
      <div class="home">
        <div class="home__title-row">
          <h1 class="home__title">
            ${this.translations.homeView.employeeList}
          </h1>
          <div class="home__layout-buttons-wrapper">
            <button
              class="home__layout-button"
              type="button"
              @click=${() => this.handleViewModeChange('list')}
            >
              <img
                src="./src/icons/listIcon.svg"
                alt="List Layout Toggle Button"
              />
            </button>
            <button
              class="home__layout-button"
              type="button"
              @click=${() => this.handleViewModeChange('grid')}
            >
              <img
                src="./src/icons/gridIcon.svg"
                alt="Grid Layout Toggle Button"
              />
            </button>
          </div>
        </div>
        ${this.viewMode === 'grid'
          ? html`<div class="home__card-container">
              ${repeat(
                this.employeeList,
                (employeeList) => employeeList.id,
                (employee) =>
                  html`<employee-card .employee=${employee}></employee-card>`
              )}
            </div>`
          : html`<div class="home__table-container">
              <employee-table
                .employeeList=${this.employeeList}
              ></employee-table>
            </div>`}
        <pagination-component></pagination-component>
      </div>`;
  }
}

customElements.define('home-view', HomeView);

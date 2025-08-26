import {LitElement, html} from 'lit';
import {paginationStyles} from './pagination.styles';
import {store} from '../../store';
import {
  setCurrentPage,
  setEmployeeListToDisplay,
  setTotalPageNumber,
} from '../../slices/paginationSlice';
import {classMap} from 'lit/directives/class-map.js';
import {getEmployeeListToDisplay} from '../../utils';
import {PAGE_NUMBER_OFFSET} from './pagination.constants.js';

export class PaginationComponent extends LitElement {
  static styles = paginationStyles;
  static properties = {
    classes: {type: Object},
    currentPageNumber: {type: Number},
    currentItemsPerPage: {type: Number},
  };

  constructor() {
    super();
    const {dispatch, getState} = store;
    const {pagination, employee} = getState();
    this.currentPageNumber = pagination.currentPage;
    this.currentItemsPerPage = pagination.itemsPerPage;
    this.employeeCount = employee.employeeList.length;
    dispatch(setTotalPageNumber({employeeCount: employee.employeeList.length}));
  }

  connectedCallback() {
    super.connectedCallback();
    this.unSubscribe = store.subscribe(() => {
      const {pagination} = store.getState();
      const {currentPage, itemsPerPage} = pagination;
      this.currentPageNumber = currentPage;
      if (currentPage !== this.currentPageNumber) {
        this.currentPageNumber = currentPage;
        this.requestUpdate();
      }
      if (itemsPerPage !== this.currentItemsPerPage) {
        this.currentItemsPerPage = itemsPerPage;
        this.requestUpdate();
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unSubscribe();
  }

  goToPage(pageNumber = this.currentPageNumber) {
    const {dispatch, getState} = store;
    const {employeeList} = getState().employee;
    dispatch(
      setEmployeeListToDisplay(
        getEmployeeListToDisplay(
          employeeList,
          pageNumber,
          this.currentItemsPerPage
        )
      )
    );
    dispatch(setCurrentPage(pageNumber));
    this.requestUpdate();
  }

  goToNextPage() {
    const {totalPageNumber} = store.getState().pagination;
    if (this.currentPageNumber < totalPageNumber) {
      this.currentPageNumber += 1;
      this.goToPage();
    }
  }

  goToPreviousPage() {
    if (this.currentPageNumber > 1) {
      this.currentPageNumber -= 1;
      this.goToPage();
    }
  }

  getPaginationNumbers() {
    const {totalPageNumber} = store.getState().pagination;
    const pageNumbers = [];
    for (
      let i = this.currentPageNumber - PAGE_NUMBER_OFFSET;
      i <= this.currentPageNumber + PAGE_NUMBER_OFFSET;
      i++
    ) {
      if (totalPageNumber < i) {
        // Don't list page numbers greater than total pages
        break;
      }
      if (i < 1) {
        // Don't list negative page numbers
        continue;
      }
      pageNumbers.push(i);
    }

    const isLastPageIncluded = pageNumbers.includes(totalPageNumber);
    return html`${pageNumbers.map((pageNumber) => {
      const isButtonActive = pageNumber === this.currentPageNumber;

      return html`<button
        class=${classMap({
          pagination__button: true,
          ['pagination__button--active']: isButtonActive,
        })}
        @click=${() => this.goToPage(pageNumber)}
      >
        ${pageNumber}
      </button>`;
    })}${!isLastPageIncluded
      ? html`...
          <button
            class=${classMap({
              pagination__button: true,
            })}
            @click=${() => this.goToPage(totalPageNumber)}
          >
            ${totalPageNumber}
          </button>`
      : null}`;
  }

  render() {
    return html`<div class="pagination">
      <button class="pagination__button" @click=${this.goToPreviousPage}>
        <img
          class="pagination__chevron"
          src="./src/icons/chevronLeftIcon.svg"
          alt="Pagination Left Chevron"
        />
      </button>
      ${this.getPaginationNumbers()}
      <button class="pagination__button" @click=${this.goToNextPage}>
        <img
          class="pagination__chevron"
          src="./src/icons/chevronRightIcon.svg"
          alt="Pagination Right Chevron"
        />
      </button>
    </div>`;
  }
}

customElements.define('pagination-component', PaginationComponent);

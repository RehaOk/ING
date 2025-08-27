import {PaginationComponent} from './pagination.js';
import {fixtureSync, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import sinon from 'sinon';

const originalStore = window.store;

suite('pagination-component', () => {
  teardown(() => {
    window.store = originalStore;
  });

  test('is defined', () => {
    const el = document.createElement('pagination-component');
    assert.instanceOf(el, PaginationComponent);
  });

  test('renders with default values', async () => {
    const fakeStore = {
      dispatch: () => {},
      getState: () => ({
        employee: {employeeList: Array(12).fill({})},
        pagination: {
          currentPage: 1,
          itemsPerPage: 4,
          employeeListToDisplay: [],
          totalPageNumber: 3,
        },
      }),
      subscribe: () => () => {},
    };
    const el = fixtureSync(html`<pagination-component></pagination-component>`);
    el._store = fakeStore;
    el.requestUpdate();
    await el.updateComplete;
    assert.shadowDom.equal(
      el,
      `
      <div class="pagination">
        <button class="pagination__button">
          <img
            class="pagination__chevron"
            src="./src/icons/chevronLeftIcon.svg"
            alt="Pagination Left Chevron"
          >
        </button>
        <button class="pagination__button pagination__button--active">
          1
        </button>
        <button class="pagination__button">
          2
        </button>
        <button class="pagination__button">
          3
        </button>
        <button class="pagination__button">
          <img
            class="pagination__chevron"
            src="./src/icons/chevronRightIcon.svg"
            alt="Pagination Right Chevron"
          >
        </button>
      </div>
      `
    );
  });

  test('connectedCallback subscribes to store', () => {
    const fakeUnsubscribe = sinon.spy();
    const fakeSubscribe = sinon.stub().callsFake((cb) => {
      cb();
      return fakeUnsubscribe;
    });
    const fakeStore = {
      dispatch: sinon.spy(),
      getState: sinon.stub().returns({
        employee: {employeeList: []},
        pagination: {
          currentPage: 1,
          itemsPerPage: 4,
          employeeListToDisplay: [],
          totalPageNumber: 1,
        },
      }),
      subscribe: fakeSubscribe,
    };
    const el = new PaginationComponent(fakeStore);
    el.connectedCallback();
    assert.isTrue(fakeSubscribe.called);
    el.disconnectedCallback();
    assert.isTrue(fakeUnsubscribe.called);
  });

  test('goToPage dispatches actions and updates', () => {
    const fakeDispatch = sinon.spy();
    const fakeStore = {
      dispatch: fakeDispatch,
      getState: () => ({
        employee: {employeeList: Array(10).fill({})},
        pagination: {
          currentPage: 1,
          itemsPerPage: 4,
          employeeListToDisplay: [],
          totalPageNumber: 3,
        },
      }),
      subscribe: () => () => {},
    };
    const el = new PaginationComponent(fakeStore);
    el.requestUpdate = sinon.spy();
    el.goToPage(2);
    assert.isTrue(fakeDispatch.called);
    assert.isTrue(el.requestUpdate.called);
  });

  test('goToNextPage increments page and calls goToPage', () => {
    const fakeStore = {
      dispatch: sinon.spy(),
      getState: () => ({
        employee: {employeeList: Array(10).fill({})},
        pagination: {
          currentPage: 1,
          itemsPerPage: 4,
          employeeListToDisplay: [],
          totalPageNumber: 3,
        },
      }),
      subscribe: () => () => {},
    };
    const el = new PaginationComponent(fakeStore);
    el.currentPageNumber = 1;
    el.goToPage = sinon.spy();
    el.goToNextPage();
    assert.equal(el.currentPageNumber, 2);
    assert.isTrue(el.goToPage.called);
  });

  test('goToPreviousPage decrements page and calls goToPage', () => {
    const fakeStore = {
      dispatch: sinon.spy(),
      getState: () => ({
        employee: {employeeList: Array(10).fill({})},
        pagination: {
          currentPage: 2,
          itemsPerPage: 4,
          employeeListToDisplay: [],
          totalPageNumber: 3,
        },
      }),
      subscribe: () => () => {},
    };
    const el = new PaginationComponent(fakeStore);
    el.currentPageNumber = 2;
    el.goToPage = sinon.spy();
    el.goToPreviousPage();
    assert.equal(el.currentPageNumber, 1);
    assert.isTrue(el.goToPage.called);
  });

  test('getPaginationNumbers returns correct buttons', async () => {
    const fakeStore = {
      dispatch: sinon.spy(),
      getState: () => ({
        employee: {employeeList: Array(10).fill({})},
        pagination: {
          currentPage: 2,
          itemsPerPage: 4,
          employeeListToDisplay: [],
          totalPageNumber: 3,
        },
      }),
      subscribe: () => () => {},
    };

    const el = fixtureSync(html`<pagination-component></pagination-component>`);
    el._store = fakeStore;
    el.requestUpdate();
    document.body.appendChild(el);
    el.currentPageNumber = 2;
    el.requestUpdate();
    await el.updateComplete;
    const buttons = el.shadowRoot.querySelectorAll('.pagination__button');
    const buttonLabels = Array.from(buttons)
      .map((btn) => btn.textContent.trim())
      .filter(Boolean);
    assert.include(buttonLabels, '1');
    assert.include(buttonLabels, '2');
    assert.include(buttonLabels, '3');
    document.body.removeChild(el);
  });
});

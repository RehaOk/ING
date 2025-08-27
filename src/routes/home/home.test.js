import {HomeView} from './home.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import sinon from 'sinon';

const originalStore = window.store;

suite('home-view', () => {
  teardown(() => {
    window.store = originalStore;
  });

  test('is defined', () => {
    const el = document.createElement('home-view');
    assert.instanceOf(el, HomeView);
  });

  test('renders with default values', async () => {
    window.store = {
      dispatch: () => {},
      getState: () => ({
        employee: {employeeList: []},
        pagination: {
          currentPage: 1,
          itemsPerPage: 4,
          employeeListToDisplay: [],
        },
        localization: {
          translations: {homeView: {employeeList: 'Employee List'}},
        },
      }),
      subscribe: () => () => {},
    };
    const el = await fixture(html`<home-view></home-view>`);
    await el.updateComplete;
    assert.shadowDom.equal(
      el,
      `
  <page-navigation></page-navigation>
  <div class="home">
    <div class="home__title-row">
      <h1 class="home__title">
        Employee List
      </h1>
      <div class="home__layout-buttons-wrapper">
        <button
          class="home__layout-button"
          type="button"
        >
          <img
            src="./src/icons/listIcon.svg"
            alt="List Layout Toggle Button"
          >
        </button>
        <button
          class="home__layout-button"
          type="button"
        >
          <img
            src="./src/icons/gridIcon.svg"
            alt="Grid Layout Toggle Button"
          >
        </button>
      </div>
    </div>
    <div class="home__card-container">
      <employee-card></employee-card>
      <employee-card></employee-card>
      <employee-card></employee-card>
      <employee-card></employee-card>
    </div>
    <pagination-component>
    </pagination-component>
  </div>`
    );
  });

  test('switches to list view when handleViewModeChange is called', () => {
    const el = new HomeView();
    el.employeeList = [];
    el.viewMode = 'grid';
    el.requestUpdate = sinon.spy();
    el.handleViewModeChange('list');
    assert.equal(el.viewMode, 'list');
  });

  test('does not switch view mode if already set', () => {
    const el = new HomeView();
    el.viewMode = 'grid';
    const spy = sinon.spy(el, 'handleViewModeChange');
    el.handleViewModeChange('grid');
    assert.isTrue(spy.calledOnce);
    assert.equal(el.viewMode, 'grid');
  });

  test('connectedCallback subscribes and dispatches', () => {
    const fakeUnsubscribe = sinon.spy();
    const fakeDispatch = sinon.spy();
    const fakeGetState = sinon.stub().returns({
      employee: {employeeList: []},
      pagination: {currentPage: 1, itemsPerPage: 4, employeeListToDisplay: []},
      localization: {translations: {homeView: {employeeList: 'Employee List'}}},
    });
    const fakeSubscribe = sinon.stub().callsFake((cb) => {
      cb();
      return fakeUnsubscribe;
    });
    window.store = {
      dispatch: fakeDispatch,
      getState: fakeGetState,
      subscribe: fakeSubscribe,
    };

    const el = new HomeView(window.store);
    el.connectedCallback();

    assert.isTrue(fakeSubscribe.called);
    assert.isTrue(fakeDispatch.called);
    el.disconnectedCallback();
    assert.isTrue(fakeUnsubscribe.called);
  });

  test('disconnectedCallback unsubscribes', () => {
    const el = new HomeView();
    el.unSubscribe = sinon.spy();
    el.disconnectedCallback();
    assert.isTrue(el.unSubscribe.called);
  });
});

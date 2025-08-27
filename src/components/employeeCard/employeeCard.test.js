import {EmployeeCard} from './employeeCard.js';
import {fixtureSync, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import sinon from 'sinon';
import {Router} from '@vaadin/router';

const originalStore = window.store;

suite('employee-card', () => {
  teardown(() => {
    window.store = originalStore;
  });

  test('is defined', () => {
    const el = document.createElement('employee-card');
    assert.instanceOf(el, EmployeeCard);
  });

  test('renders with default values', async () => {
    const fakeEmployee = {
      id: '1756027522982-439294',
      firstName: 'Ahmet',
      lastName: 'Karahan',
      dateOfEmployment: '23/09/2022',
      dateOfBirth: '15/07/1990',
      phone: '+(90) 532 123 45 67',
      email: 'ahmet.karahan@example.com',
      department: 'Analytics',
      position: 'Junior',
    };
    const fakeStore = {
      getState: () => ({
        localization: {
          locale: 'en',
          translations: {
            labels: {
              firstName: 'First Name',
              lastName: 'Last Name',
              email: 'Email',
              phone: 'Phone',
              department: 'Department',
              position: 'Position',
              dateOfEmployment: 'Date of Employment',
              dateOfBirth: 'Date of Birth',
            },
            employeeCard: {
              edit: 'Edit',
              delete: 'Delete',
            },
          },
        },
      }),
      subscribe: () => () => {},
      dispatch: () => {},
    };
    const el = fixtureSync(
      html`<employee-card .employee=${fakeEmployee}></employee-card>`
    );
    el._store = fakeStore;
    el.requestUpdate();
    await el.updateComplete;

    assert.ok(el.shadowRoot.querySelector('.card'));
    assert.ok(el.shadowRoot.querySelector('.card__footer'));
    assert.ok(el.shadowRoot.querySelector('confirmation-modal'));
    const editBtn = el.shadowRoot.querySelector('.card__button--secondary');
    const deleteBtn = el.shadowRoot.querySelector('.card__button--primary');
    assert.include(editBtn.textContent, 'Edit');
    assert.include(deleteBtn.textContent, 'Delete');
    assert.include(el.shadowRoot.textContent, 'Ahmet');
    assert.include(el.shadowRoot.textContent, 'Karahan');
    assert.include(el.shadowRoot.textContent, '23/09/2022');
    assert.include(el.shadowRoot.textContent, '15/07/1990');
    assert.include(el.shadowRoot.textContent, '+(90) 532 123 45 67');
    assert.include(el.shadowRoot.textContent, 'ahmet.karahan@example.com');
    assert.include(el.shadowRoot.textContent, 'Analytics');
    assert.include(el.shadowRoot.textContent, 'Junior');
  });

  test('connectedCallback subscribes to store and sets locale', () => {
    const fakeUnsubscribe = sinon.spy();
    const fakeSubscribe = sinon.stub().callsFake((cb) => {
      cb();
      return fakeUnsubscribe;
    });
    const fakeStore = {
      getState: sinon.stub().returns({
        localization: {
          locale: 'en',
          translations: {
            labels: {
              firstName: 'First Name',
              lastName: 'Last Name',
            },
            employeeCard: {
              edit: 'Edit',
              delete: 'Delete',
            },
          },
        },
      }),
      subscribe: fakeSubscribe,
      dispatch: sinon.spy(),
    };
    const el = new EmployeeCard(fakeStore);
    el.employee = {
      id: '1756027522982-439294',
      firstName: 'Ahmet',
      lastName: 'Karahan',
    };
    el.connectedCallback();
    assert.isTrue(fakeSubscribe.called);
    el.disconnectedCallback();
    assert.isTrue(fakeUnsubscribe.called);
  });

  test('disconnectedCallback unsubscribes', () => {
    const el = new EmployeeCard();
    el.unSubscribe = sinon.spy();
    el.disconnectedCallback();
    assert.isTrue(el.unSubscribe.called);
  });

  test('handleEditButtonClick navigates to update page', () => {
    const routerGo = sinon.stub();
    const originalRouterGo = Router.go;
    Router.go = routerGo;
    const el = new EmployeeCard();
    el.employee = {id: '1756027522982-439294'};
    el.handleEditButtonClick();
    assert.isTrue(routerGo.calledWith('/update?id=1756027522982-439294'));
    Router.go = originalRouterGo;
  });

  test('displayConfirmationModal sets modal active', () => {
    const el = new EmployeeCard();
    el.isConfirmationModalActive = false;
    el.displayConfirmationModal();
    assert.isTrue(el.isConfirmationModalActive);
  });

  test('handleConfirmationModalCancel deactivates modal', () => {
    const el = new EmployeeCard();
    el.isConfirmationModalActive = true;
    el.handleConfirmationModalCancel();
    assert.isFalse(el.isConfirmationModalActive);
  });

  test('handleConfirmationModalConfirm dispatches delete and updates', () => {
    const fakeDispatch = sinon.spy();
    const fakeGetState = sinon.stub().returns({
      employee: {employeeList: []},
      pagination: {
        currentPage: 1,
        itemsPerPage: 4,
        employeeListToDisplay: [],
        totalPageNumber: 1,
      },
      localization: {
        locale: 'en',
        translations: {
          labels: {},
          employeeCard: {
            edit: 'Edit',
            delete: 'Delete',
          },
        },
      },
    });
    const fakeStore = {
      dispatch: fakeDispatch,
      getState: fakeGetState,
      subscribe: () => () => {},
    };
    const el = new EmployeeCard(fakeStore);
    el.employee = {
      id: '1756027522982-439294',
      firstName: 'Ahmet',
      lastName: 'Karahan',
    };
    el.isConfirmationModalActive = true;
    el.handleConfirmationModalConfirm('1756027522982-439294');
    assert.isTrue(fakeDispatch.called);
    assert.isFalse(el.isConfirmationModalActive);
  });
});

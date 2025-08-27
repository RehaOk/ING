import {EmployeeTable} from './employeeTable.js';
import {fixtureSync, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import sinon from 'sinon';
import {Router} from '@vaadin/router';

const originalStore = window.store;

suite('employee-table', () => {
  teardown(() => {
    window.store = originalStore;
  });

  test('is defined', () => {
    const el = document.createElement('employee-table');
    assert.instanceOf(el, EmployeeTable);
  });

  test('renders with default values', async () => {
    const fakeStore = {
      getState: () => ({
        localization: {
          locale: 'en',
          translations: {
            labels: {
              firstName: 'First Name',
              lastName: 'Last Name',
              dateOfEmployment: 'Date of Employment',
              dateOfBirth: 'Date of Birth',
              phone: 'Phone',
              email: 'Email',
              department: 'Department',
              position: 'Position',
              actions: 'Actions',
            },
          },
        },
      }),
      subscribe: () => () => {},
      dispatch: () => {},
    };
    const el = fixtureSync(html`<employee-table></employee-table>`);
    el._store = fakeStore;
    el.requestUpdate();
    await el.updateComplete;
    assert.shadowDom.equal(
      el,
      `
      <div class="employee-table">
        <div class="employee-table__wrapper">
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Date of Employment</th>
                <th>Date of Birth</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
      <confirmation-modal employeename=""></confirmation-modal>
      `
    );
  });

  test('connectedCallback subscribes to store and updates translations', () => {
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
              dateOfEmployment: 'Employment Date',
              dateOfBirth: 'Birth Date',
              phone: 'Phone',
              email: 'Email',
              department: 'Department',
              position: 'Position',
              actions: 'Actions',
            },
          },
        },
      }),
      subscribe: fakeSubscribe,
      dispatch: sinon.spy(),
    };
    const el = new EmployeeTable();
    el._store = fakeStore;
    el.connectedCallback();
    assert.isTrue(fakeSubscribe.called);
    el.disconnectedCallback();
    assert.isTrue(fakeUnsubscribe.called);
  });

  test('disconnectedCallback unsubscribes', () => {
    const el = new EmployeeTable();
    el.unSubscribe = sinon.spy();
    el.disconnectedCallback();
    assert.isTrue(el.unSubscribe.called);
  });

  test('handleEditButtonClick navigates to update page', () => {
    const routerGo = sinon.stub();
    const originalRouterGo = Router.go;
    Router.go = routerGo;
    const el = new EmployeeTable();
    el.handleEditButtonClick(123);
    assert.isTrue(routerGo.calledWith('/update?id=123'));
    Router.go = originalRouterGo;
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
          labels: {
            firstName: 'First Name',
            lastName: 'Last Name',
            dateOfEmployment: 'Employment Date',
            dateOfBirth: 'Birth Date',
            phone: 'Phone',
            email: 'Email',
            department: 'Department',
            position: 'Position',
            actions: 'Actions',
          },
        },
      },
    });
    const fakeStore = {
      dispatch: fakeDispatch,
      getState: fakeGetState,
      subscribe: () => () => {},
    };
    const el = new EmployeeTable(fakeStore);
    el.employeeToDelete = {id: 1};
    el.isConfirmationModalActive = true;
    el.handleConfirmationModalConfirm(1);
    assert.isTrue(fakeDispatch.called);
    assert.isFalse(el.isConfirmationModalActive);
  });

  test('handleConfirmationModalCancel resets modal state', () => {
    const el = new EmployeeTable();
    el.isConfirmationModalActive = true;
    el.employeeToDelete = {id: 1};
    el.handleConfirmationModalCancel();
    assert.isFalse(el.isConfirmationModalActive);
    assert.isNull(el.employeeToDelete);
  });

  test('displayConfirmationModal sets modal state and employeeName', () => {
    const el = new EmployeeTable();
    el.employeeList = [{id: 1, firstName: 'Ahmet', lastName: 'Karahan'}];
    el.isConfirmationModalActive = false;
    el.displayConfirmationModal(1);
    assert.isTrue(el.isConfirmationModalActive);
    assert.deepEqual(el.employeeToDelete, {
      id: 1,
      firstName: 'Ahmet',
      lastName: 'Karahan',
    });
    assert.equal(el.employeeName, 'Ahmet Karahan');
  });

  test('displayConfirmationModal does not set employeeName if employee not found', () => {
    const el = new EmployeeTable();
    el.employeeList = [];
    el.isConfirmationModalActive = false;
    el.displayConfirmationModal(2);
    assert.isTrue(el.isConfirmationModalActive);
    assert.isNull(el.employeeToDelete);
    assert.equal(el.employeeName, '');
  });
});

import {EmployeeEditor} from './employeeEditor.js';
import {fixtureSync, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import sinon from 'sinon';
import {Router} from '@vaadin/router';

const originalStore = window.store;

suite('employee-editor', () => {
  teardown(() => {
    window.store = originalStore;
  });

  test('is defined', () => {
    const el = document.createElement('employee-editor');
    assert.instanceOf(el, EmployeeEditor);
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
            },
            employeeEditor: {
              save: 'Save',
              cancel: 'Cancel',
              editInfo: 'Editing',
              modalMessage: {
                part1: 'Selected Employee record of',
                part2: 'will be updated',
              },
            },
          },
        },
      }),
      subscribe: () => () => {},
      dispatch: () => {},
    };
    const el = fixtureSync(html`<employee-editor></employee-editor>`);
    el._store = fakeStore;
    el.requestUpdate();
    await el.updateComplete;

    assert.ok(el.shadowRoot.querySelector('form'));
    assert.ok(el.shadowRoot.querySelector('custom-input[name="firstName"]'));

    const modal = el.shadowRoot.querySelector('confirmation-modal');
    const message = modal.querySelector('[slot="message"]');
    const normalized = message.textContent.replace(/\s+/g, ' ').trim();
    assert.include(normalized, 'Selected Employee record of');
    assert.include(normalized, 'will be updated');
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
              dateOfEmployment: 'Date of Employment',
              dateOfBirth: 'Date of Birth',
              phone: 'Phone',
              email: 'Email',
              department: 'Department',
              position: 'Position',
            },
            employeeEditor: {
              save: 'Save',
              cancel: 'Cancel',
              editInfo: 'Editing',
              modalMessage: {
                part1: 'Are you sure you want to save',
                part2: '?',
              },
            },
          },
        },
      }),
      subscribe: fakeSubscribe,
      dispatch: sinon.spy(),
    };
    const el = new EmployeeEditor();
    el._store = fakeStore;
    el.connectedCallback();
    assert.isTrue(fakeSubscribe.called);
    el.disconnectedCallback();
    assert.isTrue(fakeUnsubscribe.called);
  });

  test('disconnectedCallback unsubscribes', () => {
    const el = new EmployeeEditor();
    el.unSubscribe = sinon.spy();
    el.disconnectedCallback();
    assert.isTrue(el.unSubscribe.called);
  });

  test('handleCancel navigates to root', () => {
    const routerGo = sinon.stub();
    const originalRouterGo = Router.go;
    Router.go = routerGo;
    const el = new EmployeeEditor();
    el.handleCancel();
    assert.isTrue(routerGo.calledWith('/'));
    Router.go = originalRouterGo;
  });

  test('displayConfirmationModal sets modal active if form is valid', async () => {
    const el = fixtureSync(html`<employee-editor></employee-editor>`);
    await el.updateComplete;
    const fakeInputs = [{isValid: () => true}, {isValid: () => true}];
    sinon.stub(el.shadowRoot, 'querySelectorAll').returns(fakeInputs);
    el.displayConfirmationModal();
    assert.isTrue(el.isConfirmationModalActive);
  });

  test('displayConfirmationModal does not activate modal if form is invalid', async () => {
    const el = fixtureSync(html`<employee-editor></employee-editor>`);
    await el.updateComplete;
    const fakeInputs = [{isValid: () => false}, {isValid: () => true}];
    sinon.stub(el.shadowRoot, 'querySelectorAll').returns(fakeInputs);
    el.displayConfirmationModal();
    assert.isFalse(el.isConfirmationModalActive);
  });

  test('handleConfirmationModalCancel deactivates modal and calls handleCancel', () => {
    const el = new EmployeeEditor();
    el.isConfirmationModalActive = true;
    const cancelSpy = sinon.spy(el, 'handleCancel');
    el.handleConfirmationModalCancel();
    assert.isFalse(el.isConfirmationModalActive);
    assert.isTrue(cancelSpy.called);
  });

  test('handleConfirmationModalConfirm dispatches update if id exists', () => {
    const fakeDispatch = sinon.spy();
    const fakeStore = {
      dispatch: fakeDispatch,
      getState: () => ({
        employee: {
          employeeList: [
            {
              id: '1756027522982-439294',
              firstName: 'Ahmet',
              lastName: 'Karahan',
              dateOfEmployment: '23/09/2022',
              dateOfBirth: '15/07/1990',
              phone: '+(90) 532 123 45 67',
              email: 'ahmet.karahan@example.com',
              department: 'Analytics',
              position: 'Junior',
            },
          ],
        },
        localization: {
          locale: 'en',
          translations: {
            labels: {},
            employeeEditor: {
              save: 'Save',
              cancel: 'Cancel',
              editInfo: 'Editing',
              modalMessage: {
                part1: 'Are you sure you want to save',
                part2: '?',
              },
            },
          },
        },
      }),
      subscribe: () => () => {},
    };
    const routerGo = sinon.stub();
    const originalRouterGo = Router.go;
    Router.go = routerGo;
    const el = new EmployeeEditor(fakeStore);
    el.id = '1';
    el.inputs = [
      {name: 'firstName', value: 'Ahmet'},
      {name: 'lastName', value: 'Karahan'},
      {name: 'dateOfEmployment', value: '01/01/2020'},
      {name: 'dateOfBirth', value: '01/01/1990'},
      {name: 'phone', value: '123'},
      {name: 'email', value: 'a@b.com'},
      {name: 'department', value: 'Tech'},
      {name: 'position', value: 'Senior'},
    ];
    el.handleConfirmationModalConfirm();
    assert.isTrue(fakeDispatch.called);
    assert.isTrue(routerGo.calledWith('/'));
    Router.go = originalRouterGo;
  });

  test('handleConfirmationModalConfirm dispatches create if id does not exist', () => {
    const fakeDispatch = sinon.spy();
    const fakeStore = {
      dispatch: fakeDispatch,
      getState: () => ({
        employee: {employeeList: []},
        localization: {
          locale: 'en',
          translations: {
            labels: {},
            employeeEditor: {
              save: 'Save',
              cancel: 'Cancel',
              editInfo: 'Editing',
              modalMessage: {
                part1: 'Are you sure you want to save',
                part2: '?',
              },
            },
          },
        },
      }),
      subscribe: () => () => {},
    };
    const routerGo = sinon.stub();
    const originalRouterGo = Router.go;
    Router.go = routerGo;
    const el = new EmployeeEditor(fakeStore);
    el.id = '';
    el.inputs = [
      {name: 'firstName', value: 'Gizem'},
      {name: 'lastName', value: 'Akın'},
      {name: 'dateOfEmployment', value: '01/01/2021'},
      {name: 'dateOfBirth', value: '01/01/1991'},
      {name: 'phone', value: '456'},
      {name: 'email', value: 'b@c.com'},
      {name: 'department', value: 'Analytics'},
      {name: 'position', value: 'Junior'},
    ];
    el.handleConfirmationModalConfirm();
    assert.isTrue(fakeDispatch.called);
    assert.isTrue(routerGo.calledWith('/'));
    Router.go = originalRouterGo;
  });
});

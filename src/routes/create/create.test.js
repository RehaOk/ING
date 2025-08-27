import {CreateView} from './create.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import sinon from 'sinon';

suite('create-view', () => {
  test('is defined', () => {
    const el = document.createElement('create-view');
    assert.instanceOf(el, CreateView);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<create-view></create-view>`);
    assert.shadowDom.equal(
      el,
      `
      <page-navigation></page-navigation>
      <div class="create-view">
        <h1 class="create-view__title">
          ${el.translations.createView.addEmployee}
        </h1>
        <employee-editor></employee-editor>
      </div> `
    );
  });

  test('subscribes to store on connectedCallback and unsubscribes on disconnectedCallback', () => {
    const fakeTranslations = {createView: {addEmployee: 'Add!'}};
    const fakeUnsubscribe = sinon.spy();
    const getState = sinon
      .stub()
      .returns({localization: {translations: fakeTranslations}});
    const subscribe = sinon.stub().callsFake((cb) => {
      cb();
      return fakeUnsubscribe;
    });
    const fakeStore = {getState, subscribe};

    const el = new CreateView(fakeStore);
    el.requestUpdate = sinon.spy();
    el.connectedCallback();
    assert.deepEqual(el.translations, fakeTranslations);
    assert.isTrue(el.requestUpdate.called);
    assert.isTrue(subscribe.called);

    el.disconnectedCallback();
    assert.isTrue(fakeUnsubscribe.called);
  });

  test('updates translations when store changes', () => {
    const fakeTranslations1 = {createView: {addEmployee: 'Add1'}};
    const fakeTranslations2 = {createView: {addEmployee: 'Add2'}};
    let state = {localization: {translations: fakeTranslations1}};
    const getState = () => state;
    let callback;
    const subscribe = (cb) => {
      callback = cb;
      return () => {};
    };
    const fakeStore = {getState, subscribe};

    const el = new CreateView(fakeStore);
    el.requestUpdate = sinon.spy();
    el.connectedCallback();
    assert.equal(el.translations.createView.addEmployee, 'Add1');
    state = {localization: {translations: fakeTranslations2}};
    callback();
    assert.equal(el.translations.createView.addEmployee, 'Add2');
    assert.isTrue(el.requestUpdate.called);
  });
});

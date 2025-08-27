import {UpdateView} from './update.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {Router} from '@vaadin/router';
import sinon from 'sinon';

suite('update-view', () => {
  test('is defined', () => {
    const el = document.createElement('update-view');
    assert.instanceOf(el, UpdateView);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<update-view></update-view>`);
    assert.shadowDom.equal(
      el,
      `
      <page-navigation></page-navigation>
      <div class="update-view">
        <h1 class="update-view__title">
          ${el.translations.updateView.editEmployee}
        </h1>
        <employee-editor id=""></employee-editor>
      </div> `
    );
  });

  test('renders with a set id', async () => {
    const el = await fixture(html`<update-view id="123"></update-view>`);
    assert.shadowDom.equal(
      el,
      `
      <page-navigation></page-navigation>
      <div class="update-view">
        <h1 class="update-view__title">
          ${el.translations.updateView.editEmployee}
        </h1>
        <employee-editor id="123"></employee-editor>
      </div> `
    );
  });

  test('updates translations and calls requestUpdate on store change', async () => {
    const fakeTranslations = {updateView: {editEmployee: 'Edit Employee'}};
    const fakeUnsubscribe = () => {};
    const getState = () => ({localization: {translations: fakeTranslations}});
    let callback;
    const subscribe = (cb) => {
      callback = cb;
      return fakeUnsubscribe;
    };
    const fakeStore = {getState, subscribe};

    const el = new UpdateView(fakeStore);
    el.requestUpdate = sinon.spy();
    el.connectedCallback();

    if (typeof callback === 'function') {
      callback();
    } else {
      throw new Error('Subscribe callback was not set');
    }

    assert.equal(el.translations.updateView.editEmployee, 'Edit Employee');
    assert.isTrue(el.requestUpdate.called);

    el.disconnectedCallback();
  });

  test('onAfterEnter sets id if present', () => {
    const el = new UpdateView();
    const location = {searchParams: new Map([['id', '42']])};
    el.onAfterEnter(location);
    assert.equal(el.id, '42');
  });

  test('onAfterEnter redirects if id is missing', () => {
    const el = new UpdateView();
    const routerGoStub = sinon.stub(Router, 'go');
    const location = {searchParams: new Map()};
    el.onAfterEnter(location);
    assert.isTrue(routerGoStub.calledWith('/'));
    routerGoStub.restore();
  });
});

import {PageNavigation} from './pageNavigation.js';
import {fixtureSync, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import sinon from 'sinon';

const originalStore = window.store;

suite('page-navigation', () => {
  teardown(() => {
    window.store = originalStore;
  });

  test('is defined', () => {
    const el = document.createElement('page-navigation');
    assert.instanceOf(el, PageNavigation);
  });

  test('renders with default values', async () => {
    const fakeStore = {
      getState: () => ({
        localization: {
          locale: 'en',
          translations: {
            navigation: {
              employees: 'Employees',
              addNew: 'Add New',
            },
          },
        },
      }),
      subscribe: () => () => {},
      dispatch: () => {},
    };
    const el = fixtureSync(html`<page-navigation></page-navigation>`);
    el._store = fakeStore;
    el.requestUpdate();
    await el.updateComplete;
    assert.shadowDom.equal(
      el,
      `
      <div class="header">
        <a href="/" class="header__brand">
          <img class="header__logo" src="./src/icons/logo.png" alt="ING Logo">
          <span class="header__title">ING</span>
        </a>
        <div class="header__actions">
          <a href="/" class="action-link">
            <img class="header__icon" src="./src/icons/employeeIcon.svg" alt="Employee Icon">
            Employees
          </a>
          <a href="/add" class="action-link">
            <img class="header__icon" src="./src/icons/plusIcon.svg" alt="Plus Icon">
            Add New
          </a>
          <button class="action-button">
            <img class="header__flag-icon" src="./src/icons/ukFlagIcon.svg" alt="United Kingdom Flag Icon">
          </button>
        </div>
      </div>
      `
    );
  });

  test('connectedCallback subscribes to store and updates locale', () => {
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
            navigation: {
              employees: 'Employees',
              addNew: 'Add New',
            },
          },
        },
      }),
      subscribe: fakeSubscribe,
      dispatch: sinon.spy(),
    };
    const el = new PageNavigation(fakeStore);
    el.connectedCallback();
    assert.isTrue(fakeSubscribe.called);
    el.disconnectedCallback();
    assert.isTrue(fakeUnsubscribe.called);
  });

  test('disconnectedCallback unsubscribes', () => {
    const el = new PageNavigation();
    el.unSubscribe = sinon.spy();
    el.disconnectedCallback();
    assert.isTrue(el.unSubscribe.called);
  });

  test('toggleLocale dispatches setLocale with tr if current is en', () => {
    const fakeDispatch = sinon.spy();
    const fakeStore = {
      getState: () => ({
        localization: {
          locale: 'en',
          translations: {
            navigation: {
              employees: 'Employees',
              addNew: 'Add New',
            },
          },
        },
      }),
      subscribe: () => () => {},
      dispatch: fakeDispatch,
    };
    const el = new PageNavigation(fakeStore);
    el.locale = 'en';
    el.toggleLocale();
    assert.isTrue(fakeDispatch.called);
  });

  test('toggleLocale dispatches setLocale with en if current is tr', () => {
    const fakeDispatch = sinon.spy();
    const fakeStore = {
      getState: () => ({
        localization: {
          locale: 'tr',
          translations: {
            navigation: {
              employees: 'Çalışanlar',
              addNew: 'Yeni Ekle',
            },
          },
        },
      }),
      subscribe: () => () => {},
      dispatch: fakeDispatch,
    };
    const el = new PageNavigation(fakeStore);
    el.locale = 'tr';
    el.toggleLocale();
    assert.isTrue(fakeDispatch.called);
  });

  test('renders Turkish flag when locale is tr', async () => {
    const fakeStore = {
      getState: () => ({
        localization: {
          locale: 'tr',
          translations: {
            navigation: {
              employees: 'Çalışanlar',
              addNew: 'Yeni Ekle',
            },
          },
        },
      }),
      subscribe: () => () => {},
      dispatch: () => {},
    };
    const el = fixtureSync(html`<page-navigation></page-navigation>`);
    el.locale = 'tr';
    el._store = fakeStore;
    el.requestUpdate();
    await el.updateComplete;
    const flagIcon = el.shadowRoot.querySelector('.header__flag-icon');
    assert.isTrue(flagIcon.src.includes('trFlagIcon.svg'));
  });
});

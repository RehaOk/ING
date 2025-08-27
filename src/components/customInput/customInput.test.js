import {CustomInput} from './customInput.js';
import {fixtureSync, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import sinon from 'sinon';

suite('custom-input', () => {
  test('is defined', () => {
    const el = new CustomInput();
    assert.instanceOf(el, CustomInput);
  });

  test('renders text input with default values', async () => {
    const el = fixtureSync(html`
      <custom-input
        id="first-name"
        name="firstName"
        type="text"
        label="First Name"
        required
        value=""
      ></custom-input>
    `);
    await el.updateComplete;
    const input = el.shadowRoot.querySelector('input[type="text"]');
    assert.ok(input);
    assert.equal(input.name, 'firstName');
    assert.equal(input.value, '');
    assert.equal(el.label, 'First Name');
    assert.equal(el.type, 'text');
    assert.isTrue(el.required);
  });

  test('renders select input with options', async () => {
    const options = [
      {value: 'Junior', label: 'Junior'},
      {value: 'Senior', label: 'Senior'},
    ];
    const el = fixtureSync(html`
      <custom-input
        id="position"
        name="position"
        type="select"
        label="Position"
        .options=${options}
        selectedValue="Senior"
        required
      ></custom-input>
    `);
    await el.updateComplete;
    const select = el.shadowRoot.querySelector('select');
    assert.ok(select);
    assert.equal(select.name, 'position');
    assert.equal(select.value, 'Senior');
    assert.equal(el.label, 'Position');
    assert.equal(el.type, 'select');
    assert.isTrue(el.required);
    assert.include(select.innerHTML, 'Junior');
    assert.include(select.innerHTML, 'Senior');
  });

  test('connectedCallback subscribes to store and sets translations', () => {
    const fakeStore = {
      getState: sinon.stub().returns({
        localization: {
          locale: 'en',
          translations: {
            customInput: {
              selectPlaceHolder: 'Select...',
              fieldRequired: 'Required',
            },
          },
        },
      }),
      subscribe: sinon.stub().returns(() => {}),
    };
    const el = new CustomInput(fakeStore);
    el.connectedCallback();
    assert.equal(el.translations.customInput.selectPlaceHolder, 'Select...');
    el.disconnectedCallback();
  });

  test('disconnectedCallback unsubscribes', () => {
    const el = new CustomInput();
    el.unSubscribe = sinon.spy();
    el.disconnectedCallback();
    assert.isTrue(el.unSubscribe.called);
  });

  test('handleInput updates value for text', async () => {
    const fakeStore = {
      getState: () => ({
        localization: {
          locale: 'en',
          translations: {
            customInput: {
              selectPlaceHolder: 'Select...',
              fieldRequired: 'Required',
            },
          },
        },
      }),
      subscribe: () => () => {},
    };
    const el = fixtureSync(html`
      <custom-input
        id="email"
        name="email"
        type="text"
        label="Email"
        required
        value=""
        ._store=${fakeStore}
      ></custom-input>
    `);
    await el.updateComplete;
    const input = el.shadowRoot.querySelector('input');
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input'));
    assert.equal(el.value, 'test@example.com');
  });

  test('handleInput updates value for select', async () => {
    const fakeStore = {
      getState: () => ({
        localization: {
          locale: 'en',
          translations: {
            customInput: {
              selectPlaceHolder: 'Select...',
              fieldRequired: 'Required',
            },
          },
        },
      }),
      subscribe: () => () => {},
    };
    const options = [
      {value: 'Junior', label: 'Junior'},
      {value: 'Senior', label: 'Senior'},
    ];
    const el = fixtureSync(html`
      <custom-input
        id="position"
        name="position"
        type="select"
        label="Position"
        .options=${options}
        selectedValue=""
        required
        ._store=${fakeStore}
      ></custom-input>
    `);
    await el.updateComplete;
    const select = el.shadowRoot.querySelector('select');
    select.value = 'Senior';
    select.dispatchEvent(new Event('change'));
    assert.equal(el.value, 'Senior');
  });

  test('validate sets errorMessage for required text', () => {
    const el = fixtureSync(html`
      <custom-input
        id="first-name"
        name="firstName"
        type="text"
        label="First Name"
        required
        value=""
      ></custom-input>
    `);
    el.translations = {customInput: {fieldRequired: 'Required'}};
    el.validate();
    assert.equal(el.errorMessage, 'Required');
  });

  test('validate sets errorMessage for select', () => {
    const options = [
      {value: 'Junior', label: 'Junior'},
      {value: 'Senior', label: 'Senior'},
    ];
    const el = fixtureSync(html`
      <custom-input
        id="position"
        name="position"
        type="select"
        label="Position"
        .options=${options}
        selectedValue=""
        required
      ></custom-input>
    `);
    el.errorHandler = {
      handle: (val) => val === '',
      message: () => 'Select required',
    };
    el.validate();
    assert.equal(el.errorMessage, 'Select required');
  });

  test('isValid returns true if no error', () => {
    const el = fixtureSync(html`
      <custom-input
        id="email"
        name="email"
        type="text"
        label="Email"
        required
        value="test@example.com"
      ></custom-input>
    `);
    el.translations = {customInput: {fieldRequired: 'Required'}};
    assert.isTrue(el.isValid());
  });

  test('isValid returns false if error', () => {
    const el = fixtureSync(html`
      <custom-input
        id="email"
        name="email"
        type="text"
        label="Email"
        required
        value=""
      ></custom-input>
    `);
    el.translations = {customInput: {fieldRequired: 'Required'}};
    assert.isFalse(el.isValid());
  });

  test('updated adds touched class to input', async () => {
    const el = fixtureSync(html`
      <custom-input
        id="email"
        name="email"
        type="text"
        label="Email"
        required
        value=""
      ></custom-input>
    `);
    el.touched = true;
    await el.updateComplete;
    el.updated();
    const input = el.shadowRoot.querySelector('input');
    assert.isTrue(input.classList.contains('touched'));
  });
});

import {ConfirmationModal} from './confirmationModal.js';
import {fixtureSync, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import sinon from 'sinon';

suite('confirmation-modal', () => {
  test('is defined', () => {
    const el = new ConfirmationModal();
    assert.instanceOf(el, ConfirmationModal);
  });

  test('renders nothing when not active', async () => {
    const el = fixtureSync(
      html`<confirmation-modal .isActive=${false}></confirmation-modal>`
    );
    await el.updateComplete;
    assert.isNull(el.shadowRoot.querySelector('.modal__overlay'));
  });

  test('renders modal with default translations and employeeName', async () => {
    const fakeTranslations = {
      confirmationModal: {
        modalTitle: 'Confirm',
        modalMessage: {
          part1: 'Are you sure you want to delete',
          part2: '?',
        },
        proceed: 'Proceed',
        cancel: 'Cancel',
      },
    };
    const el = fixtureSync(html`
      <confirmation-modal
        .isActive=${true}
        employeeName="Ahmet Karahan"
        .translations=${fakeTranslations}
        .onConfirm=${() => {}}
        .onCancel=${() => {}}
      ></confirmation-modal>
    `);
    await el.updateComplete;
    assert.ok(el.shadowRoot.querySelector('.modal__overlay'));
    assert.include(el.shadowRoot.textContent, 'Confirm');
    assert.include(
      el.shadowRoot.textContent,
      'Are you sure you want to delete'
    );
    assert.include(el.shadowRoot.textContent, 'Ahmet Karahan');
    assert.include(el.shadowRoot.textContent, '?');
    assert.include(el.shadowRoot.textContent, 'Proceed');
    assert.include(el.shadowRoot.textContent, 'Cancel');
  });

  test('calls onConfirm when confirm button is clicked', async () => {
    const fakeTranslations = {
      confirmationModal: {
        modalTitle: 'Confirm',
        modalMessage: {
          part1: 'Are you sure you want to delete',
          part2: '?',
        },
        proceed: 'Proceed',
        cancel: 'Cancel',
      },
    };
    const onConfirm = sinon.spy();
    const el = fixtureSync(html`
      <confirmation-modal
        .isActive=${true}
        employeeName="Ahmet"
        .translations=${fakeTranslations}
        .onConfirm=${onConfirm}
        .onCancel=${() => {}}
      ></confirmation-modal>
    `);
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector('.modal__button--confirm');
    btn.click();
    assert.isTrue(onConfirm.called);
  });

  test('calls onCancel when cancel button is clicked', async () => {
    const fakeTranslations = {
      confirmationModal: {
        modalTitle: 'Confirm',
        modalMessage: {
          part1: 'Are you sure you want to delete',
          part2: '?',
        },
        proceed: 'Proceed',
        cancel: 'Cancel',
      },
    };
    const onCancel = sinon.spy();
    const el = fixtureSync(html`
      <confirmation-modal
        .isActive=${true}
        employeeName="Ahmet"
        .translations=${fakeTranslations}
        .onConfirm=${() => {}}
        .onCancel=${onCancel}
      ></confirmation-modal>
    `);
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector('.modal__button--cancel');
    btn.click();
    assert.isTrue(onCancel.called);
  });

  test('calls onCancel when close button is clicked', async () => {
    const fakeTranslations = {
      confirmationModal: {
        modalTitle: 'Confirm',
        modalMessage: {
          part1: 'Are you sure you want to delete',
          part2: '?',
        },
        proceed: 'Proceed',
        cancel: 'Cancel',
      },
    };
    const onCancel = sinon.spy();
    const el = fixtureSync(html`
      <confirmation-modal
        .isActive=${true}
        employeeName="Ahmet"
        .translations=${fakeTranslations}
        .onConfirm=${() => {}}
        .onCancel=${onCancel}
      ></confirmation-modal>
    `);
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector('.modal__close-button');
    btn.click();
    assert.isTrue(onCancel.called);
  });

  test('connectedCallback subscribes to store and sets translations', () => {
    const fakeStore = {
      getState: sinon.stub().returns({
        localization: {
          locale: 'en',
          translations: {
            confirmationModal: {
              modalTitle: 'Confirm',
              modalMessage: {
                part1: 'Are you sure you want to delete',
                part2: '?',
              },
              proceed: 'Proceed',
              cancel: 'Cancel',
            },
          },
        },
      }),
      subscribe: sinon.stub().returns(() => {}),
    };
    const el = new ConfirmationModal(fakeStore);
    el.connectedCallback();
    assert.equal(el.translations.confirmationModal.modalTitle, 'Confirm');
    el.disconnectedCallback();
  });

  test('disconnectedCallback unsubscribes', () => {
    const el = new ConfirmationModal();
    el.unSubscribe = sinon.spy();
    el.disconnectedCallback();
    assert.isTrue(el.unSubscribe.called);
  });
});

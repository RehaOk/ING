/* 
    https://lit.dev/docs/components/styles/#external-stylesheet as per instructions here

    I didn't create separate css files but followed:
    https://lit.dev/docs/components/styles/#sharing-styles

    This approach to create a style file, although it is not necessary 
    and styles can be created in their respective files, 
    I believe this approach gives better structure to the project and 
    makes line of code smaller and makes files more readable.
*/

/* TODO: Work on css units, fix font styles */
import {css} from 'lit';

export const confirmationModalStyles = css`
  .modal__overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
  }

  .modal {
    position: relative;
    background-color: white;
    border-radius: 0.2rem;
    width: 90%;
    max-width: 28rem;
    padding: 1rem;
    box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.25);
    margin: 1rem;
  }

  .modal__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.3rem;
    font-weight: 500;
    color: var(--primary-color);
  }

  .modal__message {
    font-size: 0.8rem;
    color: #5f5f5f;
  }

  .modal__close-button {
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
  }

  .modal__close-button lucide-icon {
    width: 1.5em;
    height: 1.5em;
  }

  .modal__button {
    cursor: pointer;
    width: 100%;
    height: 2rem;
    border-radius: 0.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .modal__button--confirm {
    color: white;
    background-color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }

  .modal__button--cancel {
    color: var(--secondary-color);
    background-color: white;
    border: 1px solid var(--secondary-color);
  }
`;

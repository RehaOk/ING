import {css} from 'lit';

export const employeeEditorStyles = css`
  .input__container {
    margin-top: 1.25rem;
    background-color: white;
    border-radius: 0.2rem;
    padding: 3rem;
    height: auto;
    min-height: 37.5rem;
  }

  .input__edit-info {
    position: absolute;
    top: 7rem;
    left: 3rem;
    font-size: 0.7rem;
  }

  .input__column {
    display: flex;
    column-gap: 10%;
    margin-bottom: 3rem;
    @media (max-width: 768px) {
      flex-direction: column;
      margin-bottom: initial;
    }
  }

  .input__wrapper {
    display: flex;
    flex-direction: column;
    flex: 0 1 25%;
    row-gap: 0.3rem;
  }

  .input__buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    @media (max-width: 768px) {
      margin-top: 0.6rem;
      flex-direction: column;
      gap: 0.6rem;
    }
  }

  .input__button {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    height: 2rem;
    border-radius: 0.4rem;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.75rem;
    width: 12.5rem;
    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .input__button--primary {
    color: white;
    background-color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }

  .input__button--secondary {
    color: var(--secondary-color);
    background-color: white;
    border: 1px solid var(--secondary-color);
  }
`;

import {css} from 'lit';

export const employeeEditorStyles = css`
  .input__container {
    margin-top: 1.25rem;
    background-color: white;
    border-radius: 3px;
    padding: 50px;
    height: auto;
    min-height: 600px;
  }

  .input__edit-info {
    position: absolute;
    top: 113px;
    left: 47px;
    font-size: 11px;
  }

  .input__column {
    display: flex;
    column-gap: 10%;
    margin-bottom: 50px;
    @media (max-width: 768px) {
      flex-direction: column;
      margin-bottom: initial;
    }
  }

  .input__wrapper {
    display: flex;
    flex-direction: column;
    flex: 0 1 25%;
    row-gap: 5px;
  }

  .input__buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
    @media (max-width: 768px) {
      margin-top: 10px;
      flex-direction: column;
      gap: 10px;
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
    width: 200px;
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

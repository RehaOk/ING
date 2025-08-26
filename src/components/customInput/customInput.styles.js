import {css} from 'lit';

export const customInputStyles = css`
  input[type='date'] {
    color: #ffffff;
  }

  input[type='date']:focus,
  input[type='date']:valid {
    color: black;
  }

  input[type='date']:focus::before,
  input[type='date']:valid::before {
    content: '';
  }

  input[type='date']::-webkit-calendar-picker-indicator {
    filter: brightness(0) saturate(100%) invert(54%) sepia(78%) saturate(4727%)
      hue-rotate(360deg) brightness(101%) contrast(105%);
  }

  .custom-input {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.9rem;
  }

  .custom-input__input-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .custom-input__input-wrapper input {
    height: 0.6rem;
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 1rem;
    width: 100%;
  }

  .custom-input__input-wrapper--date input {
    padding: 0.6rem 0.06rem;
  }

  .custom-input__input-wrapper select {
    height: 2rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 1rem;
    width: 100%;
  }

  .custom-input__input-wrapper input.touched:invalid {
    border-color: red;
  }

  .custom-input__error-message {
    color: red;
    font-size: 0.75rem;
    margin-top: 0.3rem;
  }

  .custom-input__label {
    font-size: 0.75rem;
    display: flex;
    flex-direction: column;
    row-gap: 0.3rem;
  }
`;

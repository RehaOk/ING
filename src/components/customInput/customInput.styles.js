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
    margin-bottom: 15px;
  }

  .custom-input__input-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .custom-input__input-wrapper input {
    height: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
  }

  .custom-input__input-wrapper--date input {
    padding: 10px 1px;
  }

  .custom-input__input-wrapper select {
    height: 32px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
  }

  .custom-input__input-wrapper input.touched:invalid {
    border-color: red;
  }

  .custom-input__error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
  }

  .custom-input__label {
    font-size: 12px;
    display: flex;
    flex-direction: column;
    row-gap: 5px;
  }
`;

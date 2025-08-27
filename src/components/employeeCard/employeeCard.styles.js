/* 
    https://lit.dev/docs/components/styles/#external-stylesheet as per instructions here

    I didn't create separate css files but followed:
    https://lit.dev/docs/components/styles/#sharing-styles

    This approach to create a style file, although it is not necessary 
    and styles can be created in their respective files, 
    I believe this approach gives better structure to the project and 
    makes line of code smaller and makes files more readable.
*/

import {css} from 'lit';

export const employeeCardStyles = css`
  .card {
    width: 36vw;
    min-width: 12.5rem;
    box-shadow: 0.0625rem 0.0625rem 0.125rem 0.0625rem rgba(90, 90, 90, 0.1);
    padding: 0.25rem 0.6rem 1.25rem 0.6rem;
    background-color: white;

    @media (max-width: 768px) {
      width: 80vw;
      min-width: 12.5rem;
    }
  }

  .card__info-row {
    display: grid;
    grid-template-areas: 'left right';
    grid-template-columns: 1fr 1fr;
    margin-top: 1.3rem;
    gap: 0.6rem;
    word-break: break-word;
  }

  .card__info--left {
    grid-area: left;
  }

  .card__info--right {
    grid-area: right;
  }

  .card__info-title {
    color: #b0b0b4;
  }

  .card__footer {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.25rem;
  }

  .card__button {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    max-width: 6rem;
    height: 2rem;
    border-radius: 0.4rem;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.75rem;
    width: 5rem;
  }

  .button__icon {
    margin-right: 0.3rem;
  }

  .button__icon--trash > svg {
    bottom: 0.4rem;
  }

  .card__button--secondary {
    color: white;
    background-color: var(--secondary-color);
    border: 1px solid var(--secondary-color);
  }

  .card__button--primary {
    color: white;
    background-color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }
`;

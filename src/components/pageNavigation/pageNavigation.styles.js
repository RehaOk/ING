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

export const headerStyles = css`
  .header {
    width: 100%;
    height: 2.5rem;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header__brand {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: black;
  }

  .header__logo {
    height: 2.18rem;
    width: 2.18rem;
  }

  .header__title {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
  }

  .header__actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-right: 0.4rem;
  }

  .header__icon > svg {
    color: var(--primary-color);
  }

  .action-link {
    color: var(--primary-color);
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.7rem;
  }

  .action-link.active {
    font-weight: bold;
  }

  .action-button {
    border: none;
    background-color: inherit;
    cursor: pointer;
    padding: 0;
  }

  .header__flag-icon {
    margin-top: 0.2rem;
    width: 1rem;
    height: 1rem;
  }
`;

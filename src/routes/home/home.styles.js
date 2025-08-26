import {css} from 'lit';
export const homeViewStyles = css`
  .home {
    padding: 0 2rem;
    margin-bottom: 1rem;
  }

  .home__title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .home__title {
    display: inline-block;
    color: var(--primary-color);
    font-weight: 500;
    font-size: 1.3rem;
    margin-left: 15px;
  }

  .home__layout-buttons-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .home__layout-button {
    display: flex;
    align-items: center;
    border: none;
    background-color: inherit;
    cursor: pointer;
  }

  .home__card-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    column-gap: 7rem;
    row-gap: 2rem;
    margin-top: 1.25rem;
    min-height: 662px;
    @media (max-width: 1200px) {
      justify-content: flex-start;
    }
  }

  .home__table-container {
    margin-top: 1.25rem;
    min-height: 662px;
  }
`;

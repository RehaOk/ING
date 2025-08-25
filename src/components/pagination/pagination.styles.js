import {css} from 'lit';

// TODO: Reconsider Units
export const paginationStyles = css`
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    gap: 0.6rem;
  }
  .pagination__chevron {
    padding-top: 0.2rem;
  }
  .pagination__button {
    border: none;
    background-color: inherit;
    cursor: pointer;
  }
  .pagination__button--active {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    margin: 0 0.6rem;
  }
`;

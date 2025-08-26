import {css} from 'lit';

export const employeeTableStyles = css`
  .employee-table {
    background-color: white;
    border-radius: 0.2rem;
    height: auto;
  }

  .employee-table__wrapper {
    width: 100%;
    @media (max-width: 768px) {
      width: 100%;
      overflow-x: auto;
    }
  }

  .employee-table__action-button {
    background-color: inherit;
    border: none;
    cursor: pointer;
  }

  table {
    width: 100%;
    min-width: 31rem;
    overflow-x: auto;
    font-size: 0.87rem;
  }

  td,
  th {
    padding: 1.25rem;
    border-bottom: 1px solid #e8e8e8;
    text-align: center;
    height: 1.5rem;
  }

  td {
    word-break: break-word;
    font-size: 0.8rem;
  }

  th {
    color: var(--primary-color);
    font-weight: 500;
    font-size: 0.7rem;
  }

  @media (max-width: 768px) {
    td,
    th {
      padding: 0.3rem;
      border-bottom: 1px solid #e8e8e8;
      text-align: center;
    }

    th {
      color: var(--primary-color);
      font-weight: 500;
    }
  }
`;

import {css} from 'lit';

export const employeeTableStyles = css`
  .employee-table {
    background-color: white;
    border-radius: 3px;
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
    min-width: 500px;
    overflow-x: auto;
    font-size: 14px;
  }

  td,
  th {
    padding: 20px;
    border-bottom: 1px solid #e8e8e8;
    text-align: center;
    height: 25px;
  }

  td {
    word-break: break-word;
    font-size: 13px;
  }

  th {
    color: var(--primary-color);
    font-weight: 500;
    font-size: 11px;
  }

  @media (max-width: 768px) {
    td,
    th {
      padding: 5px;
      border-bottom: 1px solid #e8e8e8;
      text-align: center;
    }

    th {
      color: var(--primary-color);
      font-weight: 500;
    }
  }
`;

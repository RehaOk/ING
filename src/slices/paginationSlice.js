import {createSlice} from '@reduxjs/toolkit';
import {
  INITIAL_PAGINATION_STATE,
  GRID_MODE_ITEMS_PER_PAGE,
  LIST_MODE_ITEMS_PER_PAGE,
  FIRST_PAGE_NUMBER,
} from '../constants.js';
const paginationSlice = createSlice({
  name: 'pagination',
  initialState: {
    currentPage: INITIAL_PAGINATION_STATE.CURRENT_PAGE,
    itemsPerPage: INITIAL_PAGINATION_STATE.ITEMS_PER_PAGE,
    employeeListToDisplay: [],
    totalPageNumber: INITIAL_PAGINATION_STATE.TOTAL_PAGE_NUMBER,
  },
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setItemsPerPage(state, action) {
      // Prevent Divide By Zero on setTotalPageNumber
      // TODO: Might Throw Error Think Later
      if (action.payload !== 0) {
        state.itemsPerPage = action.payload;
      }
    },
    setTotalPageNumber(state, {payload: {employeeCount}}) {
      state.totalPageNumber = Math.ceil(employeeCount / state.itemsPerPage);
    },
    setEmployeeListToDisplay(state, action) {
      state.employeeListToDisplay = action.payload;
    },
    setPaginationForViewMode(
      state,
      {payload: {viewMode, currentPage, employeeList}}
    ) {
      let itemsPerPage, newPageNumber;

      if (viewMode === 'grid') {
        itemsPerPage = GRID_MODE_ITEMS_PER_PAGE;
        newPageNumber =
          Math.floor(
            (currentPage * LIST_MODE_ITEMS_PER_PAGE) / GRID_MODE_ITEMS_PER_PAGE
          ) || FIRST_PAGE_NUMBER;
      } else {
        itemsPerPage = LIST_MODE_ITEMS_PER_PAGE;
        newPageNumber =
          Math.round(
            (currentPage * GRID_MODE_ITEMS_PER_PAGE) / LIST_MODE_ITEMS_PER_PAGE
          ) || FIRST_PAGE_NUMBER;
      }

      const totalPageNumber = Math.ceil(employeeList.length / itemsPerPage);

      if (newPageNumber > totalPageNumber) {
        newPageNumber = totalPageNumber;
      }

      if (newPageNumber < FIRST_PAGE_NUMBER) {
        newPageNumber = FIRST_PAGE_NUMBER;
      }

      state.itemsPerPage = itemsPerPage;
      state.currentPage = newPageNumber;
      const start = (newPageNumber - 1) * itemsPerPage; // -1 for zero based index
      const end = start + itemsPerPage;
      state.employeeListToDisplay = employeeList.slice(start, end);
      state.totalPageNumber = Math.ceil(employeeList.length / itemsPerPage);
    },
  },
});

export const {
  setCurrentPage,
  setItemsPerPage,
  setTotalPageNumber,
  setEmployeeListToDisplay,
  setPaginationForViewMode,
} = paginationSlice.actions;
export default paginationSlice.reducer;

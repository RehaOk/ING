import {createSlice} from '@reduxjs/toolkit';

const paginationSlice = createSlice({
  name: 'pagination',
  initialState: {
    currentPage: 1,
    itemsPerPage: 4,
    employeeListToDisplay: [],
    totalPageNumber: 2,
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
        itemsPerPage = 4;
        newPageNumber = Math.floor((currentPage * 9) / 4) || 1;
      } else {
        itemsPerPage = 9;
        newPageNumber = Math.round((currentPage * 4) / 9) || 1;
      }

      const totalPageNumber = Math.ceil(employeeList.length / itemsPerPage);

      if (newPageNumber > totalPageNumber) {
        newPageNumber = totalPageNumber;
      }

      if (newPageNumber < 1) {
        newPageNumber = 1;
      }

      state.itemsPerPage = itemsPerPage;
      state.currentPage = newPageNumber;
      const start = (newPageNumber - 1) * itemsPerPage;
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

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
      state.totalPageNumber = employeeCount / state.itemsPerPage;
    },
    setEmployeeListToDisplay(state, action) {
      state.employeeListToDisplay = action.payload;
    },
  },
});

export const {
  setCurrentPage,
  setItemsPerPage,
  setTotalPageNumber,
  setEmployeeListToDisplay,
} = paginationSlice.actions;
export default paginationSlice.reducer;

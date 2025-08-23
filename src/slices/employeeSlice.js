import {createSlice} from '@reduxjs/toolkit';

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employeelist: [],
  },
  reducers: {
    createEmployeeData(state, action) {
      state.employeelist = [...state.employeelist, action.payload];
    },
    updateEmployeeData(state, action) {
      const currentEmployeeData = employeeList.find(
        ({id}) => id === action.payload.id
      );

      if (currentEmployeeData) {
        Object.assign(currentEmployeeData, action.payload.updatedEmployeeData);
        state.employeelist = [...employeeList];
      }
    },
    deleteEmployeeData(state, action) {
      state.employeelist = state.employeelist.filter(
        ({id}) => id !== action.payload
      );
    },
  },
});

export const {createEmployeeData, updateEmployeeData, deleteEmployeeData} =
  employeeSlice.actions;
export default employeeSlice.reducer;

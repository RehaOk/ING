import {configureStore} from '@reduxjs/toolkit';
import employeeReducer from './slices/employeeSlice.js';
import localizationReducer from './slices/localizationSlice.js';
import paginationReducer from './slices/paginationSlice.js';

export const store = configureStore({
  reducer: {
    employee: employeeReducer,
    localization: localizationReducer,
    pagination: paginationReducer,
  },
});

// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/user/authSlice';
import academicYearReducer from '../features/institute/academicYearSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    academicYear: academicYearReducer,
  },
});



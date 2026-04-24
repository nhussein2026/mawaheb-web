// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      // console.log("Login reducer called with action payload:", action.payload);
      state.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      state.user = action.payload.user;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      console.log("Updated state:", state);
      // console.log("LocalStorage token:", localStorage.getItem('token'));
    },
    logout(state) {
      state.isLoggedIn = false;
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = null;
      state.user = null;
    }
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

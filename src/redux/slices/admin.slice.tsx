import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  loading: false,
  error: null,
  introStatus: false,
};

export const adminSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    attendanceV2List: (state, action) => {
      return { ...state, data: {...state.data, attendanceV2List: action.payload }, loading: false };
    },
    usersList: (state, action) => {
      return { ...state, data: {...state.data, usersList: action.payload }, loading: false };
    },
    usersRole: (state, action) => {
      return { ...state, data: {...state.data, usersRole: action.payload }, loading: false };
    },
    biometricData: (state, action) => {
      return { ...state, data: {...state.data, biometricData: action.payload }, loading: false };
    },
    appHomeData: (state, action) => {
      return { ...state, data: {...state.data, appHomeData: action.payload }, loading: false };
    },
    userStatusListData: (state, action) => {
      return { ...state, data: {...state.data, userStatusListData: action.payload }, loading: false };
    },
    branchesData: (state, action) => {
      return { ...state, data: {...state.data, branchesData: action.payload }, loading: false };
    },
  },
});

// Action creators are generated for each case reducer function
export const { attendanceV2List, usersList, appHomeData, userStatusListData,branchesData,usersRole,biometricData } = adminSlice.actions;

export default adminSlice.reducer;

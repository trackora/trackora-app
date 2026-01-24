import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  loading: false,
  error: null,
  introStatus: false,
  folderName: null
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login: (state, action) => {
      return { ...state, data: action.payload, loading: false };
    },
    loginError: (state, action) => {
      return { ...state, error: action.payload, loading: false };
    },
    loginReset: (state, action) => {
      state = initialState;
    },
    loginLoading: (state, action) => {
      return { ...state, loading: action.payload };
    },
    introStatusCheck: (state, action) => {
      return { ...state, introStatus: action.payload };
    },
    setFolderName: (state, action) => {
      return { ...state, folderName: action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, loginError, loginLoading, introStatusCheck,setFolderName } = loginSlice.actions;

export default loginSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  error: null,
  currentAppLanguage:null
};

export const userSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    usersLocation: (state, action) => {
      return { ...state, data: { ...state.data, usersLocation: action.payload } };
    },
    setLanguage: (state, action) => {
      return { ...state, currentAppLanguage: action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { usersLocation,setLanguage } = userSlice.actions;

export default userSlice.reducer;

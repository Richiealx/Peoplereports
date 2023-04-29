import { createSlice } from '@reduxjs/toolkit';



export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    uid: null,
    email: null,
     isLoggedIn: false,

  },
 reducers: {
  setUid: (state, action) => {
    state.uid = action.payload.uid;
    state.email = action.payload.email;
    
  },
  setAmail: (state, action) => {
    state.email = action.payload;
  },
   setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
},
});

export const { setUid } = authSlice.actions;
export const { setAmail } = authSlice.actions;
export const { setLoggedIn } = authSlice.actions;

export const selectUid = state => state.auth.uid;
export const selectAmail = state => state.auth.email;
export const selectLoggedIn = state => state.auth.isLoggedIn;

export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuth:false,
  user:null,
  otp:{
    phone:'',
    hash:""
  }
}


export const authSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
      setAuth(state,action){
        const {user,auth} = action.payload;
        state.isAuth = auth;
        state.user = user;
      },
      setOtp(state,action){
        const {phone,hash} = action.payload;
        state.otp.phone = phone;
        state.otp.hash = hash;
      }
  },
})

// Action creators are generated for each case reducer function
export const {setAuth,setOtp} = authSlice.actions

export default authSlice.reducer
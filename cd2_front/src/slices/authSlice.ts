import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { instance } from '../services/api/axiosInstance';
import { Login } from '../services/auth/Login';

/**
 * Presetar, de maneira "suja", um user. Login cria um token aleatório e logoutHandler elimina o token.
 */

export interface AuthState {
  userName: string,
  status: boolean,
  token: string;
}

let username = "";
let status = false
let token = "";


try {
  username = JSON.parse(localStorage.getItem("userName") || "");
  status = JSON.parse(localStorage.getItem("status") || "");
  token = JSON.parse(localStorage.getItem("token") || "");
} catch (error) {
  username = "";
  status = false;
  token = "";
}

const initialState: AuthState = {
  userName: username,
  status:status,
  token: token,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleLoggedIn: (state) => {
      state.status = !state.status;
    },
    loginHandler: (state) => {
      state.status = true;
      state.userName = "userTeste";
      state.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

      localStorage.setItem("status", JSON.stringify(state.status))
      localStorage.setItem("userName", JSON.stringify(state.userName))
      localStorage.setItem("token", JSON.stringify(state.token))
    },
    logoutHandler: (state) => {

      console.log("logout!")

      state.status = false;

      localStorage.removeItem("status")
      localStorage.removeItem("userName")
      localStorage.removeItem("token")
    }
  },
}
)

// Action creators are generated for each case reducer function
export const { toggleLoggedIn, loginHandler, logoutHandler } = authSlice.actions

export default authSlice.reducer
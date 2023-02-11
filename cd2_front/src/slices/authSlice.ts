import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { instance } from '../services/api/axiosInstance';
import { Login } from '../services/auth/Login';

/**
 * Presetar, de maneira "suja", um user. Login cria um token aleatório e logoutHandler elimina o token.
 */

export interface AuthState {
  userName: string,
  userId: Number,
  status: boolean,
  token: string;
}

let username = "";
let status = false
let token = "";
let userId = 0;


try {
  username = JSON.parse(localStorage.getItem("userName") || "");
  userId = JSON.parse(localStorage.getItem("userId") || "");
  status = JSON.parse(localStorage.getItem("status") || "");
  token = JSON.parse(localStorage.getItem("token") || "");
} catch (error) {
  username = "";
  status = false;
  token = "";
  userId = 0;
}

const initialState: AuthState = {
  userName: username,
  status:status,
  token: token,
  userId: userId,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleLoggedIn: (state) => {
      state.status = !state.status;
    },
    loginHandler: (state, actions) => {
      state.status = true;
      state.userName = actions.payload.nome;
      state.userId = actions.payload.id;
      state.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

      localStorage.setItem("status", JSON.stringify(state.status))
      localStorage.setItem("userName", JSON.stringify(state.userName))
      localStorage.setItem("token", JSON.stringify(state.token))
      localStorage.setItem("userId", JSON.stringify(state.userId))
    },
    logoutHandler: (state) => {

      console.log("logout!")

      state.status = false;

      localStorage.removeItem("status")
      localStorage.removeItem("userId")
      localStorage.removeItem("userName")
      localStorage.removeItem("token")
    }
  },
}
)

// Action creators are generated for each case reducer function
export const { toggleLoggedIn, loginHandler, logoutHandler } = authSlice.actions

export default authSlice.reducer
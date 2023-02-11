import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { instance } from '../services/api/axiosInstance';
import { Login } from '../services/auth/Login';

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
    loginHandler: (state, action) => {
      state.status = action.payload.status;
      state.userName = action.payload.user.name;
      state.token = action.payload.authorisation.token;

      localStorage.setItem("status", JSON.stringify(state.status))
      localStorage.setItem("userName", JSON.stringify(state.userName))
      localStorage.setItem("token", JSON.stringify(state.token))
    },
    logout: (state) => {

      instance.post('/logout',
        {},
        {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        .then(function (response: any) {
          alert("até mais")
          localStorage.removeItem("status")
          localStorage.removeItem("userName")
          localStorage.removeItem("token")
        })
    }
  },
}
)

// Action creators are generated for each case reducer function
export const { toggleLoggedIn, loginHandler, logout } = authSlice.actions

export default authSlice.reducer
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const axios = require('axios').default;

// const auth = useSelector((state: RootState) => state.auth)

export const instance = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 3000,
});
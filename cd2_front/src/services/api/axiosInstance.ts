const axios = require('axios').default;

// const auth = useSelector((state: RootState) => state.auth)

export const instance = axios.create({
  baseURL: "http://localhost:8080/v1/",
  timeout: 3000,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});
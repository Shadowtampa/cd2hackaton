const axios = require('axios').default;

// const auth = useSelector((state: RootState) => state.auth)

export const instance = axios.create({
  baseURL: "https://maps.googleapis.com/",
  timeout: 3000,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});
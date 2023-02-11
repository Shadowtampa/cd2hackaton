import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { instance } from '../services/api/axiosInstance'

export interface ICity {
  id: number,
  name: string,
  state: string,
  foundation: Date,
}
export interface CityState {
  cities: ICity[]
}

const initialState: CityState = {
  cities: [
    {
      id: 0,
      name: "Carregando...",
      state: "Carregando...",
      foundation: new Date(2000, 0, 1) // the month is 0-indexed
    }
  ]
}

export const fetchCitiesAPI = createAsyncThunk(
  'users/fetchById',
  // Declare the type your function argument here:
  async (token: string) => {
    const response = instance.get('/city',
      {
        headers: { Authorization: `Bearer ${token}` }
      })
    // Inferred return type: Promise<MyData>
    return (await response.json())
  }
)

export const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    fetchCities: (state, action) => {
      let tempCities: ICity[] = [];
      instance.get('/city',
        {
          headers: { Authorization: `Bearer ${action.payload}` }
        })
        .then(function (response: any) {

          let tempCities: ICity[] = [];

          response.data.map((city: ICity) => {
            tempCities.push({
              id: city.id,
              name: city.name,
              state: city.state,
              foundation: city.foundation
            })
          })
          state.cities = tempCities;
        })



      // state.cities = tempCities as CityState;
    },

    setCities: (state, action)=>{
      state.cities = action.payload
    }
  },

})

// Action creators are generated for each case reducer function
export const { fetchCities, setCities } = citySlice.actions

export default citySlice.reducer
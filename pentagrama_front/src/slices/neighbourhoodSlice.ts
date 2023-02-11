import { createSlice } from '@reduxjs/toolkit'

export interface INeighbour {
  id: number,
  name: string,
  city_id: number,
}
export interface NeighbourhoodState {
  neighbourhoods: INeighbour[]
}

const initialState: NeighbourhoodState = {
  neighbourhoods: [
    {
      id: 0,
      name: "Carregando...",
      city_id: 0,
    }
  ],
}

export const neighbourhoodSlice = createSlice({
  name: 'neighbourhood',
  initialState,
  reducers: {
    setNeighbourhood: (state, action)=>{
      state.neighbourhoods = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {setNeighbourhood } = neighbourhoodSlice.actions

export default neighbourhoodSlice.reducer
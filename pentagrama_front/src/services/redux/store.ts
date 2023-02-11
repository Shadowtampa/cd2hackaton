import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../../slices/authSlice'
import citySlice from '../../slices/citySlice'
import neighbourhoodSlice from '../../slices/neighbourhoodSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    city: citySlice,
    neighbourhood: neighbourhoodSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
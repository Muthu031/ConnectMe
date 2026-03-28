import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/redux/slices/authSlice'
import feedReducer from '@/redux/slices/feedSlice'
import chatReducer from '@/redux/slices/chatSlice'
import notificationReducer from '@/redux/slices/notificationSlice'
import userReducer from '@/redux/slices/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    chat: chatReducer,
    notifications: notificationReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

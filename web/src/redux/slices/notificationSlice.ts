import { createSlice } from '@reduxjs/toolkit'

interface NotificationItem {
  id?: string
  _id?: string
  [key: string]: any
}

interface NotificationState {
  notifications: NotificationItem[]
  unreadCount: number
  loading: boolean
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
})

export default notificationSlice.reducer

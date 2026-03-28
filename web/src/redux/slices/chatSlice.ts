import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    messages: [],
    activeChat: null,
    loading: false,
    unreadCount: 0,
  },
  reducers: {},
})

export default chatSlice.reducer

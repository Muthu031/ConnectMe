import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/lib/api'

interface FeedPost {
  _id: string
  user: {
    _id: string
    username: string
    profilePicture?: string
  }
  caption: string
  media: Array<{
    type: string
    url: string
  }>
  likes: string[]
  comments: any[]
  createdAt: string
  [key: string]: any
}

interface FeedState {
  posts: FeedPost[]
  loading: boolean
  error: string | null
  hasMore: boolean
}

const initialState: FeedState = {
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
}

export const fetchFeed = createAsyncThunk<FeedPost[]>('feed/fetchFeed', async () => {
  const response = await api.get('/posts')
  return response.data
})

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch feed'
      })
  },
})

export default feedSlice.reducer

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
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
  likesCount?: number
  comments: any[]
  commentsCount?: number
  saves?: string[]
  savesCount?: number
  createdAt: string
  [key: string]: any
}

interface FeedState {
  posts: FeedPost[]
  loading: boolean
  actionLoading: boolean
  error: string | null
  hasMore: boolean
}

const initialState: FeedState = {
  posts: [],
  loading: false,
  actionLoading: false,
  error: null,
  hasMore: true,
}

export const fetchFeed = createAsyncThunk<FeedPost[]>('feed/fetchFeed', async () => {
  const response = await api.get('/posts')

  // Support both plain array and wrapped API response shapes.
  if (Array.isArray(response.data)) {
    return response.data
  }

  if (Array.isArray(response.data?.posts)) {
    return response.data.posts
  }

  if (Array.isArray(response.data?.data?.posts)) {
    return response.data.data.posts
  }

  return []
})

export const createPost = createAsyncThunk<FeedPost, { caption: string }>(
  'feed/createPost',
  async (payload) => {
    const response = await api.post('/posts', payload)
    return response.data?.post
  }
)

export const likePost = createAsyncThunk<string, string>('feed/likePost', async (postId) => {
  await api.post(`/posts/${postId}/like`)
  return postId
})

export const unlikePost = createAsyncThunk<string, string>('feed/unlikePost', async (postId) => {
  await api.delete(`/posts/${postId}/unlike`)
  return postId
})

export const savePost = createAsyncThunk<string, string>('feed/savePost', async (postId) => {
  await api.post(`/posts/${postId}/save`)
  return postId
})

export const unsavePost = createAsyncThunk<string, string>('feed/unsavePost', async (postId) => {
  await api.delete(`/posts/${postId}/unsave`)
  return postId
})

export const addComment = createAsyncThunk<
  { postId: string; comment: any },
  { postId: string; text: string }
>('feed/addComment', async ({ postId, text }) => {
  const response = await api.post(`/posts/${postId}/comment`, { text })
  return { postId, comment: response.data?.comment }
})

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    hydratePostFallbackCounts: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((item) => item._id === action.payload)
      if (!post) return

      post.likesCount = post.likesCount ?? post.likes?.length ?? 0
      post.commentsCount = post.commentsCount ?? post.comments?.length ?? 0
      post.savesCount = post.savesCount ?? post.saves?.length ?? 0
      post.likes = post.likes || []
      post.comments = post.comments || []
      post.saves = post.saves || []
    },
  },
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
      .addCase(createPost.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.actionLoading = false
        if (action.payload?._id) {
          state.posts = [action.payload, ...state.posts]
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.error.message || 'Failed to create post'
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find((item) => item._id === action.payload)
        if (!post) return

        post.likes = post.likes || []
        if (!post.likes.includes('me')) {
          post.likes.push('me')
        }
        post.likesCount = Math.max(post.likesCount ?? post.likes.length, post.likes.length)
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const post = state.posts.find((item) => item._id === action.payload)
        if (!post) return

        post.likes = (post.likes || []).filter((id) => id !== 'me')
        const resolved = Math.max(0, post.likes.length)
        post.likesCount = resolved
      })
      .addCase(savePost.fulfilled, (state, action) => {
        const post = state.posts.find((item) => item._id === action.payload)
        if (!post) return

        post.saves = post.saves || []
        if (!post.saves.includes('me')) {
          post.saves.push('me')
        }
        post.savesCount = post.saves.length
      })
      .addCase(unsavePost.fulfilled, (state, action) => {
        const post = state.posts.find((item) => item._id === action.payload)
        if (!post) return

        post.saves = (post.saves || []).filter((id) => id !== 'me')
        post.savesCount = post.saves.length
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find((item) => item._id === action.payload.postId)
        if (!post) return

        const comment =
          action.payload.comment ||
          {
            _id: `local-${Date.now()}`,
            text: '',
            user: { username: 'you' },
            createdAt: new Date().toISOString(),
          }

        post.comments = post.comments || []
        post.comments.unshift(comment)
        post.commentsCount = post.comments.length
      })
  },
})

export const { hydratePostFallbackCounts } = feedSlice.actions
export default feedSlice.reducer

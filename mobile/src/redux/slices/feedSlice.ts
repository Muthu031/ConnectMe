import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../types';
import { postAPI } from '../../services/api';

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

const initialState: FeedState = {
  posts: [],
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  error: null,
  page: 1,
  hasMore: true,
};

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await postAPI.getFeed(page);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feed');
    }
  }
);

export const createPost = createAsyncThunk(
  'feed/createPost',
  async (postData: FormData, { rejectWithValue }) => {
    try {
      const response = await postAPI.createPost(postData);
      return response.data.post;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const likePost = createAsyncThunk(
  'feed/likePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await postAPI.likePost(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'feed/unlikePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await postAPI.unlikePost(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlike post');
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeed: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    // Fetch feed
    builder.addCase(fetchFeed.pending, (state, action) => {
      if (action.meta.arg === 1) {
        state.isLoading = true;
      } else {
        state.isLoadingMore = true;
      }
    });
    builder.addCase(fetchFeed.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoadingMore = false;
      state.isRefreshing = false;
      
      if (action.meta.arg === 1) {
        state.posts = action.payload.posts;
      } else {
        state.posts = [...state.posts, ...action.payload.posts];
      }
      
      state.page = action.payload.pagination.page;
      state.hasMore = action.payload.pagination.page < action.payload.pagination.pages;
    });
    builder.addCase(fetchFeed.rejected, (state, action) => {
      state.isLoading = false;
      state.isLoadingMore = false;
      state.isRefreshing = false;
      state.error = action.payload as string;
    });

    // Create post
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.unshift(action.payload);
    });

    // Like post
    builder.addCase(likePost.fulfilled, (state, action) => {
      const post = state.posts.find(p => p._id === action.payload);
      if (post) {
        post.likesCount += 1;
      }
    });

    // Unlike post
    builder.addCase(unlikePost.fulfilled, (state, action) => {
      const post = state.posts.find(p => p._id === action.payload);
      if (post) {
        post.likesCount = Math.max(0, post.likesCount - 1);
      }
    });
  },
});

export const { clearFeed } = feedSlice.actions;
export default feedSlice.reducer;

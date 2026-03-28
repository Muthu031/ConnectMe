import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/lib/api'

interface User {
  _id: string
  username: string
  email: string
  profilePicture?: string
  bio?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials)
    localStorage.setItem('token', response.data.token)
    return response.data
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any) => {
    const response = await api.post('/auth/register', userData)
    localStorage.setItem('token', response.data.token)
    return response.data
  }
)

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async () => {
  const response = await api.get('/auth/me')
  return response.data
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer

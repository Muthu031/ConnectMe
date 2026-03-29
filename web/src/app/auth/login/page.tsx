'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { login } from '@/redux/slices/authSlice'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // @ts-ignore
      await dispatch(login(formData)).unwrap()
      toast.success('Welcome back!')
      router.push('/feed')
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isMobile 
          ? 'var(--background-color)' 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={isMobile ? 0 : 8}
          sx={{
            padding: isMobile ? 3 : 5,
            borderRadius: 3,
            border: isMobile ? '1px solid var(--border-color)' : 'none',
          }}
        >
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'cursive',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #E1306C, #833AB4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              ConnectMe
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to see photos and videos from your friends
            </Typography>
          </Box>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email or Phone"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="username"
              autoFocus={!isMobile}
              placeholder="Email or Phone"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                autoCapitalize: 'none',
                autoCorrect: 'off',
                spellCheck: 'false',
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="current-password"
              placeholder="Password"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(45deg, #E1306C, #833AB4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #C13584, #6F2DA8)',
                },
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Link
                href="/auth/forgot-password"
                variant="body2"
                sx={{ color: 'var(--primary-color)' }}
              >
                Forgot password?
              </Link>
            </Box>

            <Divider sx={{ my: 3 }}>OR</Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  href="/auth/register"
                  sx={{
                    color: 'var(--primary-color)',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>

        {/* Download App (Mobile Only) */}
        {isMobile && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Get the app.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}

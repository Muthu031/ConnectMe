'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material'
import { LockReset } from '@mui/icons-material'
import toast from 'react-hot-toast'
import api from '@/lib/api'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
      toast.success('Password reset instructions sent to your email!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset email')
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
          {/* Icon */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LockReset
              sx={{
                fontSize: 60,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 1,
              }}
            >
              {sent ? 'Check Your Email' : 'Forgot Password?'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {sent 
                ? 'We\'ve sent password reset instructions to your email address.'
                : 'Enter your email and we\'ll send you instructions to reset your password.'
              }
            </Typography>
          </Box>

          {!sent ? (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mb: 2,
                  background: 'linear-gradient(45deg, #E1306C, #833AB4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #C13584, #6F2DA8)',
                  },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    Sending...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  href="/auth/login"
                  sx={{
                    color: 'var(--primary-color)',
                    textDecoration: 'none',
                    fontSize: '14px',
                  }}
                >
                  ← Back to Login
                </Link>
              </Box>
            </form>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Didn't receive the email? Check your spam folder or try again.
              </Typography>
              
              <Button
                variant="outlined"
                onClick={() => setSent(false)}
                sx={{ mb: 2 }}
              >
                Try Another Email
              </Button>

              <Box>
                <Link
                  href="/auth/login"
                  sx={{
                    color: 'var(--primary-color)',
                    textDecoration: 'none',
                    fontSize: '14px',
                  }}
                >
                  ← Back to Login
                </Link>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material'
import { MarkEmailRead } from '@mui/icons-material'
import toast from 'react-hot-toast'
import api from '@/lib/api'

export default function VerifyPage() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')

    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/verify-otp', { otp: otpCode })
      toast.success('Account verified successfully!')
      router.push('/auth/login')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    try {
      await api.post('/auth/resend-otp')
      toast.success('OTP sent successfully!')
      setCountdown(60)
      setOtp(['', '', '', '', '', ''])
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setResendLoading(false)
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
            <MarkEmailRead
              sx={{
                fontSize: 80,
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
              Verify Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We've sent a 6-digit code to your email/phone.
              <br />
              Please enter it below to verify your account.
            </Typography>
          </Box>

          {/* OTP Input Form */}
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mb: 4,
              }}
            >
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center', fontSize: '24px' },
                  }}
                  sx={{
                    width: isMobile ? '45px' : '60px',
                    '& input': {
                      padding: isMobile ? '12px 0' : '16px 0',
                    },
                  }}
                  autoFocus={index === 0}
                />
              ))}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || otp.join('').length !== 6}
              sx={{
                py: 1.5,
                background: 'linear-gradient(45deg, #E1306C, #833AB4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #C13584, #6F2DA8)',
                },
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Verifying...
                </>
              ) : (
                'Verify Account'
              )}
            </Button>

            {/* Resend Code */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Didn't receive the code?
              </Typography>
              <Button
                onClick={handleResend}
                disabled={countdown > 0 || resendLoading}
                sx={{
                  mt: 1,
                  color: 'var(--primary-color)',
                  fontWeight: 'bold',
                }}
              >
                {resendLoading ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  'Resend Code'
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

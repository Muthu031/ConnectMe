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
  FormControlLabel,
  Checkbox,
  Grid,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { register } from '@/redux/slices/authSlice'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (!formData.fullName || formData.fullName.length < 2) {
      toast.error('Please enter your full name')
      return false
    }

    if (!formData.username || formData.username.length < 3) {
      toast.error('Username must be at least 3 characters')
      return false
    }

    if (!/^[a-zA-Z0-9._]+$/.test(formData.username)) {
      toast.error('Username can only contain letters, numbers, dots, and underscores')
      return false
    }

    if (!formData.email && !formData.phone) {
      toast.error('Please provide either email or phone number')
      return false
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    if (formData.phone && !/^[0-9]{10,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      toast.error('Please enter a valid phone number')
      return false
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }

    if (!agreeToTerms) {
      toast.error('Please agree to the Terms and Conditions')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...registrationData } = formData
      // @ts-ignore
      await dispatch(register(registrationData)).unwrap()
      toast.success('Account created successfully! Please verify your email/phone.')
      router.push('/auth/verify')
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
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
        py: 4,
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
          <Box sx={{ textAlign: 'center', mb: 3 }}>
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
              Sign up to connect with friends and share moments
            </Typography>
          </Box>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Full Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </Grid>

              {/* Username */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="johndoe"
                  autoComplete="username"
                  helperText="Letters, numbers, dots, and underscores only"
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  autoComplete="email"
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  autoComplete="tel"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Provide at least one: Email or Phone
                </Typography>
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  helperText="At least 6 characters"
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
              </Grid>

              {/* Confirm Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Terms and Conditions */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      I agree to the{' '}
                      <Link href="/terms" target="_blank" sx={{ color: 'var(--primary-color)' }}>
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" target="_blank" sx={{ color: 'var(--primary-color)' }}>
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                />
              </Grid>
            </Grid>

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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <Divider sx={{ my: 3 }}>OR</Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  sx={{
                    color: 'var(--primary-color)',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                  }}
                >
                  Sign in
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

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, CircularProgress, Typography } from '@mui/material'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Simple redirect to login page
    // In production, you would check localStorage for a token here
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (token) {
      router.push('/feed')
    } else {
      router.push('/auth/login')
    }
  }, [router])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        gap: 2,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Loading ConnectMe...
      </Typography>
    </Box>
  )
}

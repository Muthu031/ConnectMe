'use client'

import { ReactNode } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import Navbar from './Navbar'
import BottomNavigation from './BottomNavigation'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: isMobile ? 7 : 8,
          pb: isMobile ? 8 : 0,
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation (Mobile Only) */}
      {isMobile && <BottomNavigation />}
    </Box>
  )
}

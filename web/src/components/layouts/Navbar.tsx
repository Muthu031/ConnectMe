'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Paper,
} from '@mui/material'
import {
  Search as SearchIcon,
  Home,
  AddCircleOutline,
  Favorite,
  ChatBubbleOutline,
  DarkMode,
  LightMode,
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useTheme as useAppTheme } from '../ThemeProvider'

export default function Navbar() {
  const router = useRouter()
  const theme = useTheme()
  const { theme: appTheme, toggleTheme } = useAppTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useSelector((state: RootState) => state.auth)
  const { unreadCount } = useSelector((state: RootState) => state.notifications)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [searchValue, setSearchValue] = useState('')

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    // Implement logout logic
    handleMenuClose()
    router.push('/auth/login')
  }

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backgroundColor: 'var(--surface-color)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography
          variant="h6"
          onClick={() => router.push('/feed')}
          sx={{
            fontFamily: 'cursive',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #E1306C, #833AB4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
            display: isMobile ? 'none' : 'block',
          }}
        >
          ConnectMe
        </Typography>

        {/* Search Bar (Desktop Only) */}
        {!isMobile && (
          <Paper
            component="form"
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 300,
              borderRadius: 2,
              px: 2,
              py: 0.5,
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              fullWidth
            />
          </Paper>
        )}

        {/* Mobile Logo */}
        {isMobile && (
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'cursive',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #E1306C, #833AB4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ConnectMe
          </Typography>
        )}

        {/* Right Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2 }}>
          {!isMobile && (
            <>
              <IconButton onClick={() => router.push('/feed')}>
                <Home />
              </IconButton>

              <IconButton onClick={() => router.push('/chat')}>
                <Badge badgeContent={unreadCount} color="error">
                  <ChatBubbleOutline />
                </Badge>
              </IconButton>

              <IconButton>
                <AddCircleOutline />
              </IconButton>

              <IconButton onClick={() => router.push('/notifications')}>
                <Badge badgeContent={unreadCount} color="error">
                  <Favorite />
                </Badge>
              </IconButton>
            </>
          )}

          <IconButton onClick={toggleTheme}>
            {appTheme === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>

          <IconButton onClick={handleProfileMenuOpen}>
            <Avatar
              src={user?.profilePicture}
              alt={user?.username}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => router.push(`/profile/${user?._id}`)}>
            Profile
          </MenuItem>
          <MenuItem onClick={() => router.push('/settings')}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

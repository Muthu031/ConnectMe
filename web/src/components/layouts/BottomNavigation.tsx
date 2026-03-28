'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
} from '@mui/material'
import {
  Home,
  Search,
  AddCircleOutline,
  FavoriteBorder,
  Person,
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

export default function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { unreadCount } = useSelector((state: RootState) => state.notifications)
  const { user } = useSelector((state: RootState) => state.auth)

  const getCurrentValue = () => {
    if (pathname === '/feed') return 0
    if (pathname === '/search') return 1
    if (pathname === '/create') return 2
    if (pathname === '/notifications') return 3
    if (pathname?.includes('/profile')) return 4
    return 0
  }

  const [value, setValue] = useState(getCurrentValue())

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    switch (newValue) {
      case 0:
        router.push('/feed')
        break
      case 1:
        router.push('/search')
        break
      case 2:
        router.push('/create')
        break
      case 3:
        router.push('/notifications')
        break
      case 4:
        router.push(`/profile/${user?._id}`)
        break
    }
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid var(--border-color)',
      }}
      elevation={3}
    >
      <MuiBottomNavigation
        value={value}
        onChange={handleChange}
        showLabels={false}
      >
        <BottomNavigationAction icon={<Home />} />
        <BottomNavigationAction icon={<Search />} />
        <BottomNavigationAction icon={<AddCircleOutline />} />
        <BottomNavigationAction
          icon={
            <Badge badgeContent={unreadCount} color="error">
              <FavoriteBorder />
            </Badge>
          }
        />
        <BottomNavigationAction icon={<Person />} />
      </MuiBottomNavigation>
    </Paper>
  )
}

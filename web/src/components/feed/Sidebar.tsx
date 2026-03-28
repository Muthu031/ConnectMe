'use client'

import { Box, Paper, Typography, Avatar, Button } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const suggestions = [
  { id: 1, username: 'user1', name: 'John Doe', avatar: '/avatars/1.jpg' },
  { id: 2, username: 'user2', name: 'Jane Smith', avatar: '/avatars/2.jpg' },
  { id: 3, username: 'user3', name: 'Bob Wilson', avatar: '/avatars/3.jpg' },
  { id: 4, username: 'user4', name: 'Alice Brown', avatar: '/avatars/4.jpg' },
  { id: 5, username: 'user5', name: 'Charlie Davis', avatar: '/avatars/5.jpg' },
]

export default function Sidebar() {
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <Box>
      {/* Current User */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user?.profilePicture} sx={{ width: 56, height: 56 }}>
            {user?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Suggestions */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" fontWeight="bold" color="text.secondary">
            Suggestions For You
          </Typography>
          <Typography
            variant="caption"
            sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          >
            See All
          </Typography>
        </Box>

        {suggestions.map((suggestion) => (
          <Box
            key={suggestion.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar src={suggestion.avatar} sx={{ width: 32, height: 32 }}>
                {suggestion.username[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {suggestion.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {suggestion.name}
                </Typography>
              </Box>
            </Box>
            <Button size="small" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
              Follow
            </Button>
          </Box>
        ))}
      </Paper>

      {/* Footer */}
      <Box sx={{ mt: 3, px: 2 }}>
        <Typography variant="caption" color="text.secondary">
          © 2026 ConnectMe • About • Help • Privacy • Terms
        </Typography>
      </Box>
    </Box>
  )
}

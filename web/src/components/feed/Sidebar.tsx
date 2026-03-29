'use client'

import { useEffect, useMemo, useState } from 'react'
import { Box, Paper, Typography, Avatar, Button } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import api from '@/lib/api'

interface SuggestionUser {
  _id: string
  username: string
  fullName?: string
  profilePicture?: string
  followers?: string[]
}

export default function Sidebar() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [suggestions, setSuggestions] = useState<SuggestionUser[]>([])
  const [followState, setFollowState] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const response = await api.get('/search/users?q=a')
        const users = response.data?.users || response.data?.data?.users || []
        if (!Array.isArray(users)) {
          setSuggestions([])
          return
        }

        const filtered = users.filter((item: SuggestionUser) => item._id !== user?._id).slice(0, 6)
        setSuggestions(filtered)
      } catch {
        setSuggestions([])
      }
    }

    loadSuggestions()
  }, [user?._id])

  const handleFollowToggle = async (targetUser: SuggestionUser) => {
    const isFollowing = followState[targetUser._id] || false

    try {
      if (isFollowing) {
        await api.delete(`/users/${targetUser._id}/unfollow`)
      } else {
        await api.post(`/users/${targetUser._id}/follow`)
      }
      setFollowState((prev) => ({ ...prev, [targetUser._id]: !isFollowing }))
    } catch {
      // Keep UI stable if request fails (user likely unauthenticated)
    }
  }

  const displaySuggestions = useMemo(() => suggestions.slice(0, 5), [suggestions])

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

        {displaySuggestions.map((suggestion) => (
          <Box
            key={suggestion._id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar src={suggestion.profilePicture} sx={{ width: 32, height: 32 }}>
                {suggestion.username[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {suggestion.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {suggestion.fullName || 'ConnectMe user'}
                </Typography>
              </Box>
            </Box>
            <Button
              size="small"
              onClick={() => handleFollowToggle(suggestion)}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            >
              {followState[suggestion._id] ? 'Following' : 'Follow'}
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

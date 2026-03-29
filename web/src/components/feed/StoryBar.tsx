'use client'

import { useEffect, useMemo, useState } from 'react'
import { Box, Avatar, Typography, Paper } from '@mui/material'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

interface StoryItem {
  _id: string
  user: {
    _id: string
    username: string
    profilePicture?: string
  }
}

export default function StoryBar() {
  const router = useRouter()
  const [stories, setStories] = useState<StoryItem[]>([])

  useEffect(() => {
    const loadStories = async () => {
      try {
        const response = await api.get('/stories')
        const data = response.data?.stories || response.data?.data?.stories || []
        setStories(Array.isArray(data) ? data : [])
      } catch {
        setStories([])
      }
    }

    loadStories()
  }, [])

  const displayStories = useMemo(() => {
    const yourStory: StoryItem = {
      _id: 'your-story',
      user: { _id: 'me', username: 'Your Story' },
    }
    return [yourStory, ...stories.slice(0, 12)]
  }, [stories])

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      {displayStories.map((story) => (
        <Box
          key={story._id}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            minWidth: 70,
          }}
          onClick={() => router.push(`/stories/${story._id}`)}
        >
          <Avatar
            src={story.user.profilePicture}
            alt={story.user.username}
            sx={{
              width: 56,
              height: 56,
              border: story._id === 'your-story' ? '3px solid #DBDBDB' : '3px solid #E1306C',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              fontSize: 12,
              maxWidth: 70,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {story.user.username}
          </Typography>
        </Box>
      ))}
    </Paper>
  )
}

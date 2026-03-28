'use client'

import { Box, Avatar, Typography, Paper } from '@mui/material'
import { useRouter } from 'next/navigation'

const stories = [
  { id: 1, username: 'Your Story', avatar: '/avatars/you.jpg', hasStory: false },
  { id: 2, username: 'user1', avatar: '/avatars/1.jpg', hasStory: true },
  { id: 3, username: 'user2', avatar: '/avatars/2.jpg', hasStory: true },
  { id: 4, username: 'user3', avatar: '/avatars/3.jpg', hasStory: true },
  { id: 5, username: 'user4', avatar: '/avatars/4.jpg', hasStory: true },
]

export default function StoryBar() {
  const router = useRouter()

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
      {stories.map((story) => (
        <Box
          key={story.id}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            minWidth: 70,
          }}
          onClick={() => router.push(`/stories/${story.id}`)}
        >
          <Avatar
            src={story.avatar}
            alt={story.username}
            sx={{
              width: 56,
              height: 56,
              border: story.hasStory ? '3px solid #E1306C' : '3px solid #DBDBDB',
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
            {story.username}
          </Typography>
        </Box>
      ))}
    </Paper>
  )
}

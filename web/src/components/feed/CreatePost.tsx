'use client'

import { Box, Paper, TextField, Button, Avatar } from '@mui/material'
import { AddPhotoAlternate, Videocam } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

export default function CreatePost() {
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar src={user?.profilePicture} alt={user?.username}>
          {user?.username?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            placeholder="What's on your mind?"
            variant="outlined"
            size="small"
            multiline
            maxRows={4}
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button startIcon={<AddPhotoAlternate />} size="small">
                Photo
              </Button>
              <Button startIcon={<Videocam />} size="small">
                Video
              </Button>
            </Box>
            <Button variant="contained" size="small">
              Post
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

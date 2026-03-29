'use client'

import { Box, Paper, TextField, Button, Avatar } from '@mui/material'
import { AddPhotoAlternate, Videocam } from '@mui/icons-material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { createPost } from '@/redux/slices/feedSlice'

export default function CreatePost() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const [caption, setCaption] = useState('')

  const handleCreatePost = async () => {
    const text = caption.trim()
    if (!text) return

    await dispatch(createPost({ caption: text }))
    setCaption('')
  }

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
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
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
            <Button variant="contained" size="small" onClick={handleCreatePost}>
              Post
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

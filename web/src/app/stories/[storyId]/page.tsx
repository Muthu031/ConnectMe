'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  Button,
} from '@mui/material'
import { ArrowBack, ChevronLeft, ChevronRight, Close } from '@mui/icons-material'
import api from '@/lib/api'

interface StoryUser {
  _id: string
  username: string
  profilePicture?: string
}

interface StoryItem {
  _id: string
  user: StoryUser
  media: {
    type: 'image' | 'video'
    url: string
  }
  caption?: string
  createdAt: string
  expiresAt: string
}

export default function StoryViewerPage() {
  const params = useParams()
  const router = useRouter()
  const storyId = String(params?.storyId || '')

  const [stories, setStories] = useState<StoryItem[]>([])
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true)
      try {
        const response = await api.get('/stories')
        const data = response.data?.stories || response.data?.data?.stories || []
        const safeStories = Array.isArray(data) ? (data as StoryItem[]) : []
        setStories(safeStories)

        const index = safeStories.findIndex((item) => item._id === storyId)
        setActiveIndex(index)

        if (index >= 0) {
          api
            .post(`/stories/${storyId}/view`, {}, { skipAuthRedirect: true } as any)
            .catch(() => undefined)
        }
      } catch {
        setStories([])
        setActiveIndex(-1)
      } finally {
        setLoading(false)
      }
    }

    loadStories()
  }, [storyId])

  const activeStory = useMemo(() => {
    if (activeIndex < 0 || activeIndex >= stories.length) return null
    return stories[activeIndex]
  }, [activeIndex, stories])

  const moveToPreviousStory = () => {
    if (activeIndex <= 0) {
      router.push('/feed')
      return
    }

    const prev = stories[activeIndex - 1]
    router.push(`/stories/${prev._id}`)
  }

  const moveToNextStory = () => {
    if (activeIndex < 0 || activeIndex >= stories.length - 1) {
      router.push('/feed')
      return
    }

    const next = stories[activeIndex + 1]
    router.push(`/stories/${next._id}`)
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!activeStory) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          backgroundColor: '#000',
          color: '#fff',
          p: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Story not found
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          This story may have expired or the link is invalid.
        </Typography>
        <Button variant="contained" startIcon={<ArrowBack />} onClick={() => router.push('/feed')}>
          Back to feed
        </Button>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 0, md: 2 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 480,
          height: { xs: '100vh', md: '90vh' },
          borderRadius: { xs: 0, md: 3 },
          overflow: 'hidden',
          position: 'relative',
          bgcolor: '#111',
          boxShadow: { md: '0 18px 36px rgba(0,0,0,0.45)' },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 12,
            right: 12,
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={activeStory.user.profilePicture} sx={{ width: 32, height: 32 }}>
              {activeStory.user.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={700}>
                {activeStory.user.username}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                {new Date(activeStory.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={() => router.push('/feed')} sx={{ color: '#fff' }}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ position: 'absolute', top: 56, left: 16, right: 16, zIndex: 3 }}>
          <Typography variant="body2">{activeStory.caption || ''}</Typography>
        </Box>

        <Box sx={{ height: '100%', width: '100%' }}>
          {activeStory.media.type === 'video' ? (
            <video
              src={activeStory.media.url}
              controls
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={activeStory.media.url}
              alt={`${activeStory.user.username} story`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </Box>

        <IconButton
          onClick={moveToPreviousStory}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#fff',
            bgcolor: 'rgba(0,0,0,0.25)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' },
          }}
        >
          <ChevronLeft />
        </IconButton>

        <IconButton
          onClick={moveToNextStory}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#fff',
            bgcolor: 'rgba(0,0,0,0.25)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.4)' },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  )
}

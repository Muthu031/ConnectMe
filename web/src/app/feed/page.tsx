'use client'

import { useEffect } from 'react'
import { Box, Container, Grid, useMediaQuery, useTheme } from '@mui/material'
import MainLayout from '@/components/layouts/MainLayout'
import PostCard from '@/components/feed/PostCard'
import StoryBar from '@/components/feed/StoryBar'
import Sidebar from '@/components/feed/Sidebar'
import CreatePost from '@/components/feed/CreatePost'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { fetchFeed } from '@/redux/slices/feedSlice'

export default function FeedPage() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useDispatch()

  const { posts, loading } = useSelector((state: RootState) => state.feed)

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchFeed())
  }, [dispatch])

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: isMobile ? 0 : 3 }}>
        <Grid container spacing={isMobile ? 0 : 3}>
          {/* Main Feed */}
          <Grid item xs={12} lg={8}>
            {/* Stories */}
            <StoryBar />

            {/* Create Post (Desktop Only) */}
            {isDesktop && <CreatePost />}

            {/* Feed Posts */}
            <Box sx={{ mt: isMobile ? 0 : 2 }}>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </Box>
          </Grid>

          {/* Sidebar (Desktop Only) */}
          {isDesktop && (
            <Grid item lg={4}>
              <Box
                sx={{
                  position: 'sticky',
                  top: 80,
                }}
              >
                <Sidebar />
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </MainLayout>
  )
}

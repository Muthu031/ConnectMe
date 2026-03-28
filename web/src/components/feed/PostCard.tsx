'use client'

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
} from '@mui/material'
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  BookmarkBorder,
  MoreVert,
} from '@mui/icons-material'
import { useState } from 'react'

interface Post {
  _id: string
  user: {
    _id: string
    username: string
    profilePicture?: string
  }
  caption: string
  media: Array<{
    type: string
    url: string
  }>
  likes: string[]
  comments: any[]
  createdAt: string
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes?.length || 0)

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  return (
    <Card sx={{ mb: 2, maxWidth: '100%' }}>
      {/* Header */}
      <CardHeader
        avatar={
          <Avatar src={post.user.profilePicture} alt={post.user.username}>
            {post.user.username[0].toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
        title={post.user.username}
        subheader={new Date(post.createdAt).toLocaleDateString()}
      />

      {/* Image/Video */}
      {post.media && post.media[0] && (
        <CardMedia
          component={post.media[0].type === 'video' ? 'video' : 'img'}
          image={post.media[0].url}
          alt="Post media"
          sx={{ width: '100%', maxHeight: 600, objectFit: 'cover' }}
        />
      )}

      {/* Actions */}
      <CardActions disableSpacing sx={{ px: 2 }}>
        <IconButton onClick={handleLike}>
          {liked ? <Favorite sx={{ color: '#E1306C' }} /> : <FavoriteBorder />}
        </IconButton>
        <IconButton>
          <ChatBubbleOutline />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton>
          <BookmarkBorder />
        </IconButton>
      </CardActions>

      {/* Content */}
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body2" fontWeight="bold">
          {likes} likes
        </Typography>
        {post.caption && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>{post.user.username}</strong> {post.caption}
          </Typography>
        )}
        {post.comments && post.comments.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            View all {post.comments.length} comments
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

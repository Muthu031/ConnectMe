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
  TextField,
} from '@mui/material'
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  ChatBubble,
  BookmarkBorder,
  Bookmark,
  MoreVert,
  Send,
} from '@mui/icons-material'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { addComment, likePost, unlikePost, savePost, unsavePost } from '@/redux/slices/feedSlice'

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
  likesCount?: number
  comments: any[]
  commentsCount?: number
  saves?: string[]
  savesCount?: number
  createdAt: string
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(false)

  const liked = useMemo(() => (post.likes || []).includes('me'), [post.likes])
  const saved = useMemo(() => (post.saves || []).includes('me'), [post.saves])
  const likes = post.likesCount ?? post.likes?.length ?? 0

  const handleLike = async () => {
    if (liked) {
      await dispatch(unlikePost(post._id))
    } else {
      await dispatch(likePost(post._id))
    }
  }

  const handleSave = async () => {
    if (saved) {
      await dispatch(unsavePost(post._id))
    } else {
      await dispatch(savePost(post._id))
    }
  }

  const handleAddComment = async () => {
    const text = commentText.trim()
    if (!text) return

    await dispatch(addComment({ postId: post._id, text }))
    setCommentText('')
    setShowComments(true)
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
        <IconButton onClick={() => setShowComments((prev) => !prev)}>
          {showComments ? <ChatBubble /> : <ChatBubbleOutline />}
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={handleSave}>
          {saved ? <Bookmark /> : <BookmarkBorder />}
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
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, cursor: 'pointer' }}
            onClick={() => setShowComments(true)}
          >
            View all {post.comments.length} comments
          </Typography>
        )}

        {showComments && post.comments && post.comments.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {post.comments.slice(0, 3).map((comment) => (
              <Typography key={comment._id} variant="body2" sx={{ mt: 0.5 }}>
                <strong>{comment.user?.username || 'user'}</strong> {comment.text}
              </Typography>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleAddComment()
              }
            }}
          />
          <IconButton color="primary" onClick={handleAddComment}>
            <Send fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  )
}

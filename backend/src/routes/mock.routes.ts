import { Router } from 'express';
import { optionalAuth, protect } from '../middleware/auth';
import { mockDataStore } from '../mock-data/store';
import type { IAuthRequest } from '../types/common.types';

const router = Router();

const getPaging = (query: Record<string, unknown>): { page: number; limit: number } => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? limit : 20
  };
};

const getParam = (req: IAuthRequest, key: string): string => {
  const value = (req.params as Record<string, string | string[] | undefined>)[key];
  if (Array.isArray(value)) {
    return value[0] || '';
  }
  return value || '';
};

router.get('/users/:userId', optionalAuth, async (req: IAuthRequest, res) => {
  const user = await mockDataStore.getUserById(getParam(req, 'userId'));
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  return res.status(200).json({ status: 'success', user });
});

router.put('/users/:userId', protect, async (req: IAuthRequest, res) => {
  const user = await mockDataStore.getUserById(getParam(req, 'userId'));
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  const fullName = typeof req.body?.fullName === 'string' ? req.body.fullName : user.fullName;
  const bio = typeof req.body?.bio === 'string' ? req.body.bio : user.bio;
  user.fullName = fullName;
  user.bio = bio;

  return res.status(200).json({ status: 'success', user });
});

router.post('/users/:userId/follow', protect, async (req: IAuthRequest, res) => {
  const updated = await mockDataStore.followUser(getParam(req, 'userId'), req.user?.id);
  if (!updated) {
    return res.status(400).json({ status: 'error', message: 'Unable to follow user' });
  }

  return res.status(200).json({ status: 'success', following: true });
});

router.delete('/users/:userId/unfollow', protect, async (req: IAuthRequest, res) => {
  const updated = await mockDataStore.unfollowUser(getParam(req, 'userId'), req.user?.id);
  if (!updated) {
    return res.status(400).json({ status: 'error', message: 'Unable to unfollow user' });
  }

  return res.status(200).json({ status: 'success', following: false });
});

router.get('/users/:userId/followers', optionalAuth, async (req: IAuthRequest, res) => {
  const user = await mockDataStore.getUserById(getParam(req, 'userId'));
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  const followers = await Promise.all(user.followers.map((id) => mockDataStore.getUserById(id)));
  return res.status(200).json({ status: 'success', users: followers.filter(Boolean) });
});

router.get('/users/:userId/following', optionalAuth, async (req: IAuthRequest, res) => {
  const user = await mockDataStore.getUserById(getParam(req, 'userId'));
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  const following = await Promise.all(user.following.map((id) => mockDataStore.getUserById(id)));
  return res.status(200).json({ status: 'success', users: following.filter(Boolean) });
});

router.get('/posts', optionalAuth, async (req: IAuthRequest, res) => {
  const { page, limit } = getPaging(req.query as Record<string, unknown>);
  const feed = await mockDataStore.getFeed(page, limit);
  return res.status(200).json({
    status: 'success',
    posts: feed.items,
    pagination: {
      total: feed.total,
      page: feed.page,
      limit: feed.limit,
      pages: feed.pages
    }
  });
});

router.get('/posts/:postId', optionalAuth, async (req: IAuthRequest, res) => {
  const post = await mockDataStore.getPostById(getParam(req, 'postId'));
  if (!post) {
    return res.status(404).json({ status: 'error', message: 'Post not found' });
  }

  return res.status(200).json({ status: 'success', post });
});

router.post('/posts', protect, async (req: IAuthRequest, res) => {
  const post = await mockDataStore.createPost({ caption: req.body?.caption }, req.user?.id);
  return res.status(201).json({ status: 'success', post });
});

router.delete('/posts/:postId', protect, async (req: IAuthRequest, res) => {
  return res.status(200).json({ status: 'success', message: `Post ${getParam(req, 'postId')} deleted (mock)` });
});

router.post('/posts/:postId/like', protect, async (req: IAuthRequest, res) => {
  const updated = await mockDataStore.likePost(getParam(req, 'postId'), req.user?.id);
  if (!updated) {
    return res.status(404).json({ status: 'error', message: 'Post not found' });
  }

  return res.status(200).json({ status: 'success' });
});

router.delete('/posts/:postId/unlike', protect, async (req: IAuthRequest, res) => {
  const updated = await mockDataStore.unlikePost(getParam(req, 'postId'), req.user?.id);
  if (!updated) {
    return res.status(404).json({ status: 'error', message: 'Post not found' });
  }

  return res.status(200).json({ status: 'success' });
});

router.post('/posts/:postId/comment', protect, async (req: IAuthRequest, res) => {
  const text = typeof req.body?.text === 'string' ? req.body.text : '';
  if (!text.trim()) {
    return res.status(400).json({ status: 'error', message: 'Comment text is required' });
  }

  const comment = await mockDataStore.addComment(getParam(req, 'postId'), text, req.user?.id);
  if (!comment) {
    return res.status(404).json({ status: 'error', message: 'Post not found' });
  }

  return res.status(201).json({ status: 'success', comment });
});

router.post('/posts/:postId/save', protect, async (req: IAuthRequest, res) => {
  const updated = await mockDataStore.savePost(getParam(req, 'postId'), req.user?.id);
  if (!updated) {
    return res.status(404).json({ status: 'error', message: 'Post not found' });
  }

  return res.status(200).json({ status: 'success' });
});

router.delete('/posts/:postId/unsave', protect, async (req: IAuthRequest, res) => {
  const updated = await mockDataStore.unsavePost(getParam(req, 'postId'), req.user?.id);
  if (!updated) {
    return res.status(404).json({ status: 'error', message: 'Post not found' });
  }

  return res.status(200).json({ status: 'success' });
});

router.get('/stories', optionalAuth, async (req: IAuthRequest, res) => {
  const stories = await mockDataStore.getStories();
  return res.status(200).json({ status: 'success', stories });
});

router.post('/stories', protect, async (req: IAuthRequest, res) => {
  return res.status(201).json({ status: 'success', message: 'Story created (mock endpoint)' });
});

router.post('/stories/:storyId/view', optionalAuth, async (req: IAuthRequest, res) => {
  return res.status(200).json({ status: 'success', storyId: getParam(req, 'storyId') });
});

router.get('/reels', optionalAuth, async (req: IAuthRequest, res) => {
  const { page, limit } = getPaging(req.query as Record<string, unknown>);
  const reels = await mockDataStore.getReels(page, limit);
  return res.status(200).json({
    status: 'success',
    reels: reels.items,
    pagination: {
      total: reels.total,
      page: reels.page,
      limit: reels.limit,
      pages: reels.pages
    }
  });
});

router.post('/reels', protect, async (req: IAuthRequest, res) => {
  return res.status(201).json({ status: 'success', message: 'Reel created (mock endpoint)' });
});

router.post('/reels/:reelId/like', protect, async (req: IAuthRequest, res) => {
  return res.status(200).json({ status: 'success', reelId: getParam(req, 'reelId') });
});

router.post('/reels/:reelId/comment', protect, async (req: IAuthRequest, res) => {
  return res.status(201).json({ status: 'success', reelId: getParam(req, 'reelId'), text: req.body?.text || '' });
});

router.get('/chats', protect, async (req: IAuthRequest, res) => {
  const conversations = await mockDataStore.getConversations();
  return res.status(200).json({ status: 'success', conversations });
});

router.get('/chats/:conversationId', protect, async (req: IAuthRequest, res) => {
  const conversations = await mockDataStore.getConversations();
  const conversation = conversations.find((item) => item._id === getParam(req, 'conversationId'));
  if (!conversation) {
    return res.status(404).json({ status: 'error', message: 'Conversation not found' });
  }

  return res.status(200).json({ status: 'success', conversation });
});

router.post('/chats', protect, async (req: IAuthRequest, res) => {
  return res.status(201).json({ status: 'success', message: 'Conversation created (mock endpoint)' });
});

router.get('/messages/:conversationId', protect, async (req: IAuthRequest, res) => {
  const { page, limit } = getPaging(req.query as Record<string, unknown>);
  const messages = await mockDataStore.getMessages(getParam(req, 'conversationId'), page, limit);
  return res.status(200).json({
    status: 'success',
    messages: messages.items,
    pagination: {
      total: messages.total,
      page: messages.page,
      limit: messages.limit,
      pages: messages.pages
    }
  });
});

router.get('/notifications', protect, async (req: IAuthRequest, res) => {
  const { page, limit } = getPaging(req.query as Record<string, unknown>);
  const notifications = await mockDataStore.getNotifications(page, limit);
  return res.status(200).json({
    status: 'success',
    notifications: notifications.items,
    pagination: {
      total: notifications.total,
      page: notifications.page,
      limit: notifications.limit,
      pages: notifications.pages
    }
  });
});

router.put('/notifications/:notificationId/read', protect, async (req: IAuthRequest, res) => {
  const updated = await mockDataStore.markNotificationRead(getParam(req, 'notificationId'));
  if (!updated) {
    return res.status(404).json({ status: 'error', message: 'Notification not found' });
  }

  return res.status(200).json({ status: 'success' });
});

router.put('/notifications/read-all', protect, async (req: IAuthRequest, res) => {
  const updated = await mockDataStore.markAllNotificationsRead(req.user?.id);
  return res.status(200).json({ status: 'success', updated });
});

router.get('/search/users', optionalAuth, async (req: IAuthRequest, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q : undefined;
  const users = await mockDataStore.getUsers(query);
  return res.status(200).json({ status: 'success', users });
});

router.get('/search/posts', optionalAuth, async (req: IAuthRequest, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q : undefined;
  const posts = await mockDataStore.searchPosts(query);
  return res.status(200).json({ status: 'success', posts });
});

export default router;

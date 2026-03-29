import axios from 'axios';
import { randomUUID } from 'crypto';

type Visibility = 'public' | 'followers' | 'close-friends' | 'couples-only';

export interface MockUser {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  fullName: string;
  bio: string;
  profilePicture: string;
  coverPicture: string;
  isPrivate: boolean;
  isVerified: boolean;
  followers: string[];
  following: string[];
  closeFriends: string[];
  coupleStatus: 'single' | 'pending' | 'coupled';
  isOnline: boolean;
  lastSeen: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
}

export interface MockComment {
  _id: string;
  user: MockUser;
  text: string;
  likes: string[];
  createdAt: string;
}

export interface MockPost {
  _id: string;
  user: MockUser;
  caption: string;
  media: Array<{ type: 'image' | 'video'; url: string; thumbnail?: string }>;
  likes: string[];
  likesCount: number;
  comments: MockComment[];
  commentsCount: number;
  saves: string[];
  savesCount: number;
  sharesCount: number;
  hashtags: string[];
  visibility: Visibility;
  commentsDisabled: boolean;
  hideLikesCount: boolean;
  createdAt: string;
}

export interface MockStory {
  _id: string;
  user: MockUser;
  media: { type: 'image' | 'video'; url: string };
  caption?: string;
  views: Array<{ user: MockUser; viewedAt: string }>;
  viewsCount: number;
  visibility: Visibility;
  expiresAt: string;
  createdAt: string;
}

export interface MockReel {
  _id: string;
  user: MockUser;
  video: { url: string; thumbnail: string; duration: number };
  caption: string;
  likes: string[];
  likesCount: number;
  comments: MockComment[];
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  hashtags: string[];
  createdAt: string;
}

export interface MockConversation {
  _id: string;
  participants: MockUser[];
  isCouple: boolean;
  coupleEmoji: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface MockMessage {
  _id: string;
  conversation: string;
  sender: MockUser;
  messageType: 'text' | 'image' | 'video' | 'audio' | 'file';
  text?: string;
  status: 'sent' | 'delivered' | 'read';
  readBy: Array<{ user: string; readAt: string }>;
  reactions: Array<{ user: string; emoji: string }>;
  createdAt: string;
}

export interface MockNotification {
  _id: string;
  recipient: string;
  sender: MockUser;
  type: string;
  post?: MockPost;
  reel?: MockReel;
  isRead: boolean;
  createdAt: string;
}

interface MockStore {
  users: MockUser[];
  posts: MockPost[];
  stories: MockStory[];
  reels: MockReel[];
  conversations: MockConversation[];
  messagesByConversation: Record<string, MockMessage[]>;
  notifications: MockNotification[];
}

interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  image?: string;
}

interface DummyPost {
  id: number;
  userId: number;
  title: string;
  body: string;
  tags?: string[];
}

interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

let storeCache: MockStore | null = null;
let initializedAt = 0;
const CACHE_TTL_MS = 15 * 60 * 1000;

const videoSamples = [
  'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
  'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
  'https://samplelib.com/lib/preview/mp4/sample-15s.mp4'
];

const fallbackUsers: DummyUser[] = [
  { id: 1, firstName: 'Alex', lastName: 'Carter', username: 'alex_connect', email: 'alex@connectme.app' },
  { id: 2, firstName: 'Maya', lastName: 'Singh', username: 'maya_singh', email: 'maya@connectme.app' },
  { id: 3, firstName: 'Jordan', lastName: 'Lee', username: 'jordan_lee', email: 'jordan@connectme.app' },
  { id: 4, firstName: 'Nora', lastName: 'Kim', username: 'nora_kim', email: 'nora@connectme.app' },
  { id: 5, firstName: 'Sam', lastName: 'Miller', username: 'sam_miller', email: 'sam@connectme.app' },
  { id: 6, firstName: 'Zoya', lastName: 'Khan', username: 'zoya_k', email: 'zoya@connectme.app' }
];

const fallbackPosts: DummyPost[] = Array.from({ length: 24 }, (_, idx) => ({
  id: idx + 1,
  userId: (idx % 6) + 1,
  title: `ConnectMe moment #${idx + 1}`,
  body: 'Sharing small daily highlights with friends and partner.',
  tags: ['connectme', 'daily', 'social']
}));

const rand = (seed: number, modulo: number): number => {
  if (modulo <= 0) return 0;
  return Math.abs(Math.sin(seed) * 10000) % modulo;
};

const paginate = <T>(list: T[], page: number, limit: number): Paginated<T> => {
  const total = list.length;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 20;
  const pages = Math.max(1, Math.ceil(total / safeLimit));
  const safePage = Math.min(Math.max(1, Math.floor(page || 1)), pages);
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;

  return {
    items: list.slice(start, end),
    total,
    page: safePage,
    limit: safeLimit,
    pages
  };
};

const fetchDummyUsers = async (): Promise<DummyUser[]> => {
  try {
    const response = await axios.get<{ users: DummyUser[] }>('https://dummyjson.com/users?limit=30', {
      timeout: 7000
    });
    return response.data.users || fallbackUsers;
  } catch {
    return fallbackUsers;
  }
};

const fetchDummyPosts = async (): Promise<DummyPost[]> => {
  try {
    const response = await axios.get<{ posts: DummyPost[] }>('https://dummyjson.com/posts?limit=80', {
      timeout: 7000
    });
    return response.data.posts || fallbackPosts;
  } catch {
    return fallbackPosts;
  }
};

const buildStore = async (): Promise<MockStore> => {
  const [rawUsers, rawPosts] = await Promise.all([fetchDummyUsers(), fetchDummyPosts()]);

  const users = rawUsers.slice(0, 24).map((user, idx): MockUser => ({
    _id: `u-${user.id}`,
    username: user.username,
    email: user.email,
    phone: user.phone,
    fullName: `${user.firstName} ${user.lastName}`,
    bio: `Hi, I am ${user.firstName}. Sharing stories on ConnectMe.`,
    profilePicture: user.image || `https://picsum.photos/seed/connect-user-${user.id}/200/200`,
    coverPicture: `https://picsum.photos/seed/connect-cover-${user.id}/1200/400`,
    isPrivate: idx % 5 === 0,
    isVerified: idx % 7 === 0,
    followers: [],
    following: [],
    closeFriends: [],
    coupleStatus: idx % 8 === 0 ? 'coupled' : 'single',
    isOnline: idx % 3 === 0,
    lastSeen: new Date(Date.now() - idx * 9 * 60 * 1000).toISOString(),
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    createdAt: new Date(Date.now() - (idx + 1) * 86400000).toISOString()
  }));

  users.forEach((user, idx) => {
    for (let i = 1; i <= 3; i += 1) {
      const followTarget = users[(idx + i) % users.length];
      if (!user.following.includes(followTarget._id)) {
        user.following.push(followTarget._id);
      }
      if (!followTarget.followers.includes(user._id)) {
        followTarget.followers.push(user._id);
      }
    }

    user.closeFriends = user.following.slice(0, 2);
  });

  users.forEach((user) => {
    user.followersCount = user.followers.length;
    user.followingCount = user.following.length;
  });

  const posts: MockPost[] = rawPosts.slice(0, 60).map((post, idx) => {
    const user = users[idx % users.length];
    const likes = users
      .filter((candidate) => candidate._id !== user._id)
      .filter((candidate, likeIdx) => likeIdx % 3 === idx % 3)
      .slice(0, 8)
      .map((candidate) => candidate._id);

    const comments: MockComment[] = users.slice(0, 2).map((commentUser, commentIdx) => ({
      _id: `c-${post.id}-${commentIdx + 1}`,
      user: commentUser,
      text: commentIdx === 0 ? post.title : post.body.slice(0, 64),
      likes: [],
      createdAt: new Date(Date.now() - (idx + commentIdx + 1) * 450000).toISOString()
    }));

    return {
      _id: `p-${post.id}`,
      user,
      caption: `${post.title}. ${post.body}`,
      media: [
        {
          type: 'image',
          url: `https://picsum.photos/seed/connect-post-${post.id}/1080/1350`
        }
      ],
      likes,
      likesCount: likes.length,
      comments,
      commentsCount: comments.length,
      saves: [],
      savesCount: 0,
      sharesCount: Math.floor(rand(idx + 9, 90)),
      hashtags: post.tags && post.tags.length > 0 ? post.tags : ['connectme', 'social'],
      visibility: idx % 10 === 0 ? 'followers' : 'public',
      commentsDisabled: false,
      hideLikesCount: false,
      createdAt: new Date(Date.now() - idx * 3600000).toISOString()
    };
  });

  posts.forEach((post) => {
    const postOwner = users.find((user) => user._id === post.user._id);
    if (postOwner) {
      postOwner.postsCount += 1;
    }
  });

  const stories: MockStory[] = users.slice(0, 12).map((user, idx) => ({
    _id: `s-${idx + 1}`,
    user,
    media: {
      type: 'image',
      url: `https://picsum.photos/seed/connect-story-${idx + 1}/720/1280`
    },
    caption: `Story update from ${user.fullName}`,
    views: [],
    viewsCount: 0,
    visibility: 'public',
    expiresAt: new Date(Date.now() + (23 - idx) * 3600000).toISOString(),
    createdAt: new Date(Date.now() - idx * 1800000).toISOString()
  }));

  const reels: MockReel[] = posts.slice(0, 20).map((post, idx) => ({
    _id: `r-${idx + 1}`,
    user: post.user,
    video: {
      url: videoSamples[idx % videoSamples.length],
      thumbnail: `https://picsum.photos/seed/connect-reel-${idx + 1}/720/1280`,
      duration: 8 + (idx % 12)
    },
    caption: post.caption,
    likes: post.likes,
    likesCount: post.likes.length,
    comments: post.comments,
    commentsCount: post.comments.length,
    sharesCount: post.sharesCount,
    viewsCount: 300 + idx * 41,
    hashtags: post.hashtags,
    createdAt: post.createdAt
  }));

  const anchorUser = users[0];
  const conversations: MockConversation[] = users.slice(1, 7).map((other, idx) => ({
    _id: `cv-${idx + 1}`,
    participants: [anchorUser, other],
    isCouple: idx === 0,
    coupleEmoji: idx === 0 ? '💑' : '💬',
    lastMessageAt: new Date(Date.now() - idx * 2700000).toISOString(),
    unreadCount: idx % 2
  }));

  const messagesByConversation: Record<string, MockMessage[]> = {};

  conversations.forEach((conversation, idx) => {
    const [first, second] = conversation.participants;
    const items: MockMessage[] = Array.from({ length: 12 }, (_, messageIdx) => {
      const sender = messageIdx % 2 === 0 ? first : second;
      return {
        _id: `m-${conversation._id}-${messageIdx + 1}`,
        conversation: conversation._id,
        sender,
        messageType: 'text',
        text: messageIdx % 2 === 0 ? 'How is your day going?' : 'Great! Just posted something new.',
        status: 'read',
        readBy: [{ user: first._id, readAt: new Date().toISOString() }],
        reactions: messageIdx % 5 === 0 ? [{ user: second._id, emoji: '❤️' }] : [],
        createdAt: new Date(Date.now() - (idx * 12 + messageIdx) * 240000).toISOString()
      };
    });
    messagesByConversation[conversation._id] = items.reverse();
  });

  const notifications: MockNotification[] = posts.slice(0, 24).map((post, idx) => ({
    _id: `n-${idx + 1}`,
    recipient: anchorUser._id,
    sender: users[(idx + 1) % users.length],
    type: idx % 2 === 0 ? 'like_post' : 'comment_post',
    post,
    isRead: idx % 4 === 0,
    createdAt: new Date(Date.now() - idx * 900000).toISOString()
  }));

  return {
    users,
    posts,
    stories,
    reels,
    conversations,
    messagesByConversation,
    notifications
  };
};

const ensureStore = async (): Promise<MockStore> => {
  const isExpired = Date.now() - initializedAt > CACHE_TTL_MS;
  if (!storeCache || isExpired) {
    storeCache = await buildStore();
    initializedAt = Date.now();
  }
  return storeCache;
};

const getEffectiveUser = (store: MockStore, requestedUserId?: string): MockUser => {
  if (requestedUserId) {
    const user = store.users.find((item) => item._id === requestedUserId || item._id === `u-${requestedUserId}`);
    if (user) {
      return user;
    }
  }

  return store.users[0];
};

export const mockDataStore = {
  async getUsers(query?: string): Promise<MockUser[]> {
    const store = await ensureStore();
    if (!query) return store.users;

    const normalized = query.toLowerCase();
    return store.users.filter((user) => {
      return (
        user.username.toLowerCase().includes(normalized) ||
        user.fullName.toLowerCase().includes(normalized)
      );
    });
  },

  async getUserById(userId: string): Promise<MockUser | null> {
    const store = await ensureStore();
    return store.users.find((user) => user._id === userId || user._id === `u-${userId}`) || null;
  },

  async followUser(targetUserId: string, actorUserId?: string): Promise<boolean> {
    const store = await ensureStore();
    const actor = getEffectiveUser(store, actorUserId);
    const target = await this.getUserById(targetUserId);

    if (!target || target._id === actor._id) {
      return false;
    }

    if (!actor.following.includes(target._id)) {
      actor.following.push(target._id);
      actor.followingCount = actor.following.length;
    }

    if (!target.followers.includes(actor._id)) {
      target.followers.push(actor._id);
      target.followersCount = target.followers.length;
    }

    return true;
  },

  async unfollowUser(targetUserId: string, actorUserId?: string): Promise<boolean> {
    const store = await ensureStore();
    const actor = getEffectiveUser(store, actorUserId);
    const target = await this.getUserById(targetUserId);

    if (!target || target._id === actor._id) {
      return false;
    }

    actor.following = actor.following.filter((id) => id !== target._id);
    actor.followingCount = actor.following.length;

    target.followers = target.followers.filter((id) => id !== actor._id);
    target.followersCount = target.followers.length;

    return true;
  },

  async getFeed(page: number, limit: number): Promise<Paginated<MockPost>> {
    const store = await ensureStore();
    const ordered = [...store.posts].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return paginate(ordered, page, limit);
  },

  async getPostById(postId: string): Promise<MockPost | null> {
    const store = await ensureStore();
    return store.posts.find((post) => post._id === postId || post._id === `p-${postId}`) || null;
  },

  async createPost(input: { caption?: string }, actorUserId?: string): Promise<MockPost> {
    const store = await ensureStore();
    const actor = getEffectiveUser(store, actorUserId);
    const post: MockPost = {
      _id: `p-${randomUUID()}`,
      user: actor,
      caption: input.caption || 'Shared from ConnectMe',
      media: [{ type: 'image', url: `https://picsum.photos/seed/connect-new-${Date.now()}/1080/1350` }],
      likes: [],
      likesCount: 0,
      comments: [],
      commentsCount: 0,
      saves: [],
      savesCount: 0,
      sharesCount: 0,
      hashtags: ['connectme', 'newpost'],
      visibility: 'public',
      commentsDisabled: false,
      hideLikesCount: false,
      createdAt: new Date().toISOString()
    };

    store.posts.unshift(post);
    actor.postsCount += 1;
    return post;
  },

  async likePost(postId: string, actorUserId?: string): Promise<boolean> {
    const store = await ensureStore();
    const actor = getEffectiveUser(store, actorUserId);
    const post = await this.getPostById(postId);

    if (!post) return false;

    if (!post.likes.includes(actor._id)) {
      post.likes.push(actor._id);
      post.likesCount = post.likes.length;
    }
    return true;
  },

  async unlikePost(postId: string, actorUserId?: string): Promise<boolean> {
    const store = await ensureStore();
    const actor = getEffectiveUser(store, actorUserId);
    const post = await this.getPostById(postId);

    if (!post) return false;

    post.likes = post.likes.filter((id) => id !== actor._id);
    post.likesCount = post.likes.length;
    return true;
  },

  async addComment(postId: string, text: string, actorUserId?: string): Promise<MockComment | null> {
    const post = await this.getPostById(postId);
    if (!post) return null;

    const store = await ensureStore();
    const actor = getEffectiveUser(store, actorUserId);
    const comment: MockComment = {
      _id: `c-${randomUUID()}`,
      user: actor,
      text,
      likes: [],
      createdAt: new Date().toISOString()
    };

    post.comments.unshift(comment);
    post.commentsCount = post.comments.length;
    return comment;
  },

  async savePost(postId: string, actorUserId?: string): Promise<boolean> {
    const store = await ensureStore();
    const actor = getEffectiveUser(store, actorUserId);
    const post = await this.getPostById(postId);

    if (!post) return false;

    if (!post.saves.includes(actor._id)) {
      post.saves.push(actor._id);
      post.savesCount = post.saves.length;
    }

    return true;
  },

  async unsavePost(postId: string, actorUserId?: string): Promise<boolean> {
    const post = await this.getPostById(postId);
    if (!post) return false;

    const store = await ensureStore();
    const actor = getEffectiveUser(store, actorUserId);
    post.saves = post.saves.filter((id) => id !== actor._id);
    post.savesCount = post.saves.length;
    return true;
  },

  async getStories(): Promise<MockStory[]> {
    const store = await ensureStore();
    return store.stories;
  },

  async getReels(page: number, limit: number): Promise<Paginated<MockReel>> {
    const store = await ensureStore();
    return paginate(store.reels, page, limit);
  },

  async getConversations(): Promise<MockConversation[]> {
    const store = await ensureStore();
    return store.conversations;
  },

  async getMessages(conversationId: string, page: number, limit: number): Promise<Paginated<MockMessage>> {
    const store = await ensureStore();
    const items = store.messagesByConversation[conversationId] || [];
    return paginate(items, page, limit);
  },

  async getNotifications(page: number, limit: number): Promise<Paginated<MockNotification>> {
    const store = await ensureStore();
    return paginate(store.notifications, page, limit);
  },

  async markNotificationRead(notificationId: string): Promise<boolean> {
    const store = await ensureStore();
    const target = store.notifications.find((notification) => notification._id === notificationId);
    if (!target) return false;

    target.isRead = true;
    return true;
  },

  async markAllNotificationsRead(userId?: string): Promise<number> {
    const store = await ensureStore();
    const actor = getEffectiveUser(store, userId);
    let updated = 0;

    store.notifications.forEach((notification) => {
      if (notification.recipient === actor._id && !notification.isRead) {
        notification.isRead = true;
        updated += 1;
      }
    });

    return updated;
  },

  async searchPosts(query?: string): Promise<MockPost[]> {
    const store = await ensureStore();
    if (!query) {
      return store.posts.slice(0, 30);
    }

    const normalized = query.toLowerCase();
    return store.posts.filter((post) => {
      return (
        post.caption.toLowerCase().includes(normalized) ||
        post.hashtags.some((tag) => tag.toLowerCase().includes(normalized)) ||
        post.user.username.toLowerCase().includes(normalized)
      );
    });
  }
};

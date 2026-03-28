export interface User {
  _id: string;
  username: string;
  email?: string;
  phone?: string;
  fullName?: string;
  bio?: string;
  profilePicture?: string;
  coverPicture?: string;
  website?: string;
  isPrivate: boolean;
  isVerified: boolean;
  followers: string[];
  following: string[];
  closeFriends: string[];
  couplePartner?: string;
  anniversaryDate?: string;
  coupleStatus: 'single' | 'pending' | 'coupled';
  isOnline: boolean;
  lastSeen: Date;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: Date;
}

export interface Post {
  _id: string;
  user: User;
  caption: string;
  media: Media[];
  likes: string[];
  likesCount: number;
  comments: Comment[];
  commentsCount: number;
  saves: string[];
  savesCount: number;
  sharesCount: number;
  location?: Location;
  hashtags: string[];
  visibility: 'public' | 'followers' | 'close-friends' | 'couples-only';
  commentsDisabled: boolean;
  hideLikesCount: boolean;
  createdAt: Date;
}

export interface Media {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  publicId?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface Comment {
  _id: string;
  user: User;
  text: string;
  likes: string[];
  createdAt: Date;
}

export interface Story {
  _id: string;
  user: User;
  media: Media;
  caption?: string;
  views: StoryView[];
  viewsCount: number;
  visibility: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface StoryView {
  user: User;
  viewedAt: Date;
}

export interface Reel {
  _id: string;
  user: User;
  video: {
    url: string;
    thumbnail: string;
    duration: number;
  };
  caption: string;
  likes: string[];
  likesCount: number;
  comments: Comment[];
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  hashtags: string[];
  createdAt: Date;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: User;
  messageType: 'text' | 'image' | 'video' | 'audio' | 'file';
  text?: string;
  media?: Media;
  replyTo?: string;
  status: 'sent' | 'delivered' | 'read';
  readBy: Array<{ user: string; readAt: Date }>;
  reactions: Array<{ user: string; emoji: string }>;
  createdAt: Date;
}

export interface Conversation {
  _id: string;
  participants: User[];
  isCouple: boolean;
  coupleEmoji: string;
  lastMessage?: Message;
  lastMessageAt: Date;
  unreadCount: number;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender: User;
  type: string;
  post?: Post;
  reel?: Reel;
  isRead: boolean;
  createdAt: Date;
}

export interface Location {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Call {
  _id: string;
  caller: User;
  receiver: User;
  callType: 'audio' | 'video';
  status: 'ringing' | 'ongoing' | 'completed' | 'missed' | 'rejected';
  duration: number;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
}

export interface User {
  _id: string
  username: string
  email: string
  phone?: string
  profilePicture?: string
  bio?: string
  isPrivate: boolean
  followers: string[]
  following: string[]
  couplePartner?: string
}

export interface Post {
  _id: string
  user: User
  caption: string
  media: Media[]
  likes: string[]
  comments: Comment[]
  saves: string[]
  createdAt: string
}

export interface Media {
  type: 'image' | 'video'
  url: string
  thumbnail?: string
}

export interface Comment {
  _id: string
  user: User
  text: string
  createdAt: string
}

export interface Conversation {
  _id: string
  participants: User[]
  isCouple: boolean
  lastMessage?: Message
  updatedAt: string
}

export interface Message {
  _id: string
  conversation: string
  sender: User
  text?: string
  media?: Media
  status: 'sent' | 'delivered' | 'read'
  createdAt: string
}

export interface Notification {
  _id: string
  user: string
  type: 'like' | 'comment' | 'follow' | 'message'
  sender: User
  post?: string
  message?: string
  isRead: boolean
  createdAt: string
}

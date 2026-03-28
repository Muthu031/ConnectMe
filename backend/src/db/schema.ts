import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
// ENUMS
// ==========================================

export const userRoleEnum = pgEnum('user_role', [
  'ADMIN',
  'HR_MANAGER',
  'MANAGER',
  'EMPLOYEE',
]);

export const visibilityEnum = pgEnum('visibility', [
  'PUBLIC',
  'PRIVATE',
  'FRIENDS_ONLY',
]);

export const coupleStatusEnum = pgEnum('couple_status', [
  'single',
  'pending',
  'coupled',
]);

export const messageTypeEnum = pgEnum('message_type', [
  'TEXT',
  'IMAGE',
  'VIDEO',
  'AUDIO',
  'FILE',
]);

export const messageStatusEnum = pgEnum('message_status', [
  'SENT',
  'DELIVERED',
  'READ',
]);

export const callTypeEnum = pgEnum('call_type', [
  'AUDIO',
  'VIDEO',
]);

export const callStatusEnum = pgEnum('call_status', [
  'INCOMING',
  'OUTGOING',
  'MISSED',
  'COMPLETED',
  'DECLINED',
]);

// ==========================================
// USERS TABLE
// ==========================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 100 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 20 }).unique(),
  password: text('password').notNull(),
  fullName: varchar('fullName', { length: 255 }),
  bio: text('bio'),
  profilePicture: varchar('profilePicture', { length: 500 }),
  coverPicture: varchar('coverPicture', { length: 500 }),
  website: varchar('website', { length: 255 }),
  isPrivate: boolean('isPrivate').default(false).notNull(),
  isVerified: boolean('isVerified').default(false).notNull(),
  couplePartnerId: uuid('couplePartnerId'),
  anniversaryDate: timestamp('anniversaryDate'),
  coupleStatus: coupleStatusEnum('coupleStatus').default('single').notNull(),
  deviceTokens: jsonb('deviceTokens').default([]).notNull(),
  isOnline: boolean('isOnline').default(false).notNull(),
  lastSeen: timestamp('lastSeen'),
  otp: jsonb('otp'),
  isEmailVerified: boolean('isEmailVerified').default(false).notNull(),
  isPhoneVerified: boolean('isPhoneVerified').default(false).notNull(),
  refreshToken: text('refreshToken'),
  postsCount: integer('postsCount').default(0).notNull(),
  followersCount: integer('followersCount').default(0).notNull(),
  followingCount: integer('followingCount').default(0).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

// ==========================================
// POSTS TABLE
// ==========================================

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  caption: text('caption'),
  media: jsonb('media').default([]),
  likes: jsonb('likes').default([]),
  comments: jsonb('comments').default([]),
  saves: jsonb('saves').default([]),
  shares: jsonb('shares').default([]),
  visibility: visibilityEnum('visibility').default('PUBLIC'),
  isCommentingDisabled: boolean('is_commenting_disabled').default(false),
  location: varchar('location', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// STORIES TABLE
// ==========================================

export const stories = pgTable('stories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  media: varchar('media', { length: 500 }).notNull(),
  mediaType: varchar('media_type', { length: 20 }),
  viewers: jsonb('viewers').default([]),
  isExpired: boolean('is_expired').default(false),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// REELS TABLE
// ==========================================

export const reels = pgTable('reels', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  caption: text('caption'),
  videoUrl: varchar('video_url', { length: 500 }).notNull(),
  duration: integer('duration'),
  thumbnail: varchar('thumbnail', { length: 500 }),
  effects: jsonb('effects').default([]),
  music: jsonb('music'),
  likes: jsonb('likes').default([]),
  comments: jsonb('comments').default([]),
  shares: jsonb('shares').default([]),
  saves: jsonb('saves').default([]),
  viewCount: integer('view_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// CONVERSATIONS TABLE
// ==========================================

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }),
  isGroup: boolean('is_group').default(false),
  groupImage: varchar('group_image', { length: 500 }),
  participants: jsonb('participants').default([]),
  lastMessage: text('last_message'),
  lastMessageAt: timestamp('last_message_at'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// MESSAGES TABLE
// ==========================================

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id')
    .references(() => conversations.id, { onDelete: 'cascade' })
    .notNull(),
  senderId: uuid('sender_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content'),
  type: messageTypeEnum('type').default('TEXT'),
  media: jsonb('media'),
  status: messageStatusEnum('status').default('SENT'),
  readBy: jsonb('read_by').default([]),
  deliveredTo: jsonb('delivered_to').default([]),
  replyTo: uuid('reply_to'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// CALLS TABLE
// ==========================================

export const calls = pgTable('calls', {
  id: uuid('id').primaryKey().defaultRandom(),
  callerId: uuid('caller_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  receiverId: uuid('receiver_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  type: callTypeEnum('type').notNull(),
  status: callStatusEnum('status').notNull(),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
  duration: integer('duration'),
  recordingUrl: varchar('recording_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// NOTIFICATIONS TABLE
// ==========================================

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message'),
  data: jsonb('data'),
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  relatedUserId: uuid('related_user_id').references(() => users.id),
  relatedResourceId: uuid('related_resource_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==========================================
// MESSAGES RELATIONSHIP
// ==========================================

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

// ==========================================
// POSTS RELATIONSHIP
// ==========================================

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

// ==========================================
// REELS RELATIONSHIP
// ==========================================

export const reelsRelations = relations(reels, ({ one }) => ({
  user: one(users, {
    fields: [reels.userId],
    references: [users.id],
  }),
}));

// ==========================================
// STORIES RELATIONSHIP
// ==========================================

export const storiesRelations = relations(stories, ({ one }) => ({
  user: one(users, {
    fields: [stories.userId],
    references: [users.id],
  }),
}));

// ==========================================
// CALLS RELATIONSHIP
// ==========================================

export const callsRelations = relations(calls, ({ one }) => ({
  caller: one(users, {
    fields: [calls.callerId],
    references: [users.id],
  }),
  receiver: one(users, {
    fields: [calls.receiverId],
    references: [users.id],
  }),
}));

// ==========================================
// NOTIFICATIONS RELATIONSHIP
// ==========================================

export const notificationsRelations = relations(
  notifications,
  ({ one }) => ({
    user: one(users, {
      fields: [notifications.userId],
      references: [users.id],
    }),
    relatedUser: one(users, {
      fields: [notifications.relatedUserId],
      references: [users.id],
    }),
  })
);

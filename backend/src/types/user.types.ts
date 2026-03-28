/**
 * User Domain Types and Interfaces
 */

import { users } from '../db/schema';

export type IUser = typeof users.$inferSelect;

export interface IUserCreateInput {
  username: string;
  email?: string;
  phone?: string;
  password: string;
  fullName: string;
}

export interface IUserUpdateInput {
  fullName?: string | null;
  bio?: string | null;
  profilePicture?: string | null;
  coverPicture?: string | null;
  website?: string | null;
  isPrivate?: boolean;
  couplePartnerId?: string | null;
  anniversaryDate?: Date | null;
  coupleStatus?: 'single' | 'pending' | 'coupled';
  deviceTokens?: string[];
  refreshToken?: string | null;
  isOnline?: boolean;
  lastSeen?: Date | null;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
}

export interface IUserResponse {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  fullName?: string | null;
  profilePicture?: string;
  bio?: string | null;
  isVerified: boolean | null;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

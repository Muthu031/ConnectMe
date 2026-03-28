/**
 * User Domain Types and Interfaces
 */

export interface IUser {
  id: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  fullName?: string;
  bio?: string;
  profilePicture?: string;
  coverPicture?: string;
  website?: string;
  isPrivate: boolean;
  isVerified: boolean;
  couplePartnerId?: string;
  anniversaryDate?: Date;
  coupleStatus: 'single' | 'pending' | 'coupled';
  deviceTokens: string[];
  isOnline: boolean;
  lastSeen: Date;
  otp?: {
    code: string;
    expiresAt: Date;
  };
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  refreshToken?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreateInput {
  username: string;
  email: string;
  phone?: string;
  password: string;
  fullName?: string;
}

export interface IUserUpdateInput {
  fullName?: string;
  bio?: string;
  profilePicture?: string;
  coverPicture?: string;
  website?: string;
  isPrivate?: boolean;
  couplePartnerId?: string;
  anniversaryDate?: Date;
  coupleStatus?: 'single' | 'pending' | 'coupled';
}

export interface IUserResponse {
  id: string;
  username: string;
  email: string;
  phone?: string;
  fullName?: string;
  profilePicture?: string;
  bio?: string;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

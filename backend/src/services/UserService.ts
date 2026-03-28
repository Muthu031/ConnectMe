/**
 * User Service - Business Logic Layer
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { userRepository } from '@repositories/UserRepository';
import { IUser, IUserCreateInput, IUserResponse } from '@types/user.types';
import { AppError, IAuthTokens } from '@types/common.types';

export class UserService {
  private userRepository = userRepository;
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'secret';
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

  /**
   * Register a new user
   */
  async register(input: IUserCreateInput): Promise<{ user: IUserResponse; tokens: IAuthTokens }> {
    // Validation
    if (!input.username || !input.password) {
      throw new AppError(
        'Username and password are required',
        'VALIDATION_ERROR',
        400
      );
    }

    if (!input.email) {
      throw new AppError(
        'Email is required',
        'VALIDATION_ERROR',
        400
      );
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmailOrUsername(
      input.email,
      input.username
    );

    if (existingUser) {
      throw new AppError(
        'User already exists with this email or username',
        'USER_EXISTS',
        409
      );
    }

    // Create user
    const user = await this.userRepository.create(input);

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    // Update refresh token
    await this.userRepository.update(user.id, {
      refreshToken: tokens.refreshToken
    });

    return {
      user: this.mapUserToResponse(user),
      tokens
    };
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<{ user: IUserResponse; tokens: IAuthTokens }> {
    // Validation
    if (!email || !password) {
      throw new AppError(
        'Email and password are required',
        'VALIDATION_ERROR',
        400
      );
    }

    // Find user by email
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(
        'Invalid credentials',
        'INVALID_CREDENTIALS',
        401
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(
        'Invalid credentials',
        'INVALID_CREDENTIALS',
        401
      );
    }

    // Update online status
    await this.userRepository.update(user.id, {
      isOnline: true,
      lastSeen: new Date()
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    // Update refresh token
    await this.userRepository.update(user.id, {
      refreshToken: tokens.refreshToken
    });

    return {
      user: this.mapUserToResponse(user),
      tokens
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<IAuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as { id: string };

      const user = await this.userRepository.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError(
          'Invalid refresh token',
          'INVALID_TOKEN',
          401
        );
      }

      const newTokens = this.generateTokens(user.id);

      // Update refresh token
      await this.userRepository.update(user.id, {
        refreshToken: newTokens.refreshToken
      });

      return newTokens;
    } catch (error) {
      throw new AppError(
        'Invalid or expired refresh token',
        'INVALID_TOKEN',
        401
      );
    }
  }

  /**
   * Logout user
   */
  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      isOnline: false,
      lastSeen: new Date(),
      refreshToken: null
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IUserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(
        'User not found',
        'USER_NOT_FOUND',
        404
      );
    }

    return this.mapUserToResponse(user);
  }

  /**
   * Verify password
   */
  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return false;
    }

    return bcrypt.compare(password, user.password);
  }

  /**
   * Generate JWT tokens
   */
  private generateTokens(userId: string): IAuthTokens {
    const accessToken = jwt.sign(
      { id: userId },
      this.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { id: userId },
      this.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
    };
  }

  /**
   * Map user to response (exclude sensitive data)
   */
  private mapUserToResponse(user: IUser): IUserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      bio: user.bio,
      isVerified: user.isVerified,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount
    };
  }
}

// Export singleton instance
export const userService = new UserService();

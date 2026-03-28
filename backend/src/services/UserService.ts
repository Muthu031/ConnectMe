/**
 * User Service - Business Logic Layer
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/UserRepository';
import { IUser, IUserCreateInput, IUserResponse } from '../types/user.types';
import { AppError, IAuthTokens } from '../types/common.types';

export class UserService {
  private userRepository = userRepository;
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'secret';
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

  /**
   * Register a new user
   */
  async register(input: IUserCreateInput): Promise<{ user: IUserResponse; tokens: IAuthTokens }> {
    // Validation
    if (!input.fullName || input.fullName.trim().length < 2) {
      throw new AppError(
        'Full name must be at least 2 characters',
        'VALIDATION_ERROR',
        400
      );
    }

    if (!input.username || !input.password) {
      throw new AppError(
        'Username and password are required',
        'VALIDATION_ERROR',
        400
      );
    }

    if (!/^[a-zA-Z0-9._]+$/.test(input.username)) {
      throw new AppError(
        'Username can only contain letters, numbers, dots, and underscores',
        'VALIDATION_ERROR',
        400
      );
    }

    if (!input.email && !input.phone) {
      throw new AppError(
        'Provide at least one contact method: email or phone',
        'VALIDATION_ERROR',
        400
      );
    }

    const normalizedEmail = input.email?.toLowerCase().trim();
    const normalizedPhone = input.phone?.trim();

    if (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new AppError(
        'Invalid email format',
        'VALIDATION_ERROR',
        400
      );
    }

    // The database currently requires email; generate a stable fallback for phone-only signup.
    const emailForInsert = normalizedEmail || `${normalizedPhone}@phone.connectme.local`;

    let user: IUser;
    try {
      user = await this.userRepository.create({
        ...input,
        email: emailForInsert,
        phone: normalizedPhone,
        fullName: input.fullName.trim(),
        username: input.username.trim()
      });
    } catch (error) {
      const repositoryError = error as Error & { code?: string };

      if (repositoryError.code === 'USER_EXISTS') {
        throw new AppError('User already exists', 'USER_EXISTS', 409);
      }

      if (repositoryError instanceof AppError) {
        throw repositoryError;
      }

      throw new AppError(
        'Unable to create user at this time',
        'USER_CREATE_FAILED',
        500
      );
    }

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
      profilePicture: user.profilePicture ?? undefined,
      bio: user.bio,
      isVerified: user.isVerified,
      followersCount: user.followersCount ?? 0,
      followingCount: user.followingCount ?? 0,
      postsCount: user.postsCount ?? 0
    };
  }
}

// Export singleton instance
export const userService = new UserService();

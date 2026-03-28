/**
 * Auth Controller - HTTP Request Handlers
 */

import { Request, Response } from 'express';
import { userService } from '../services/UserService';
import { AppError, IApiResponse, IAuthRequest } from '../types/common.types';
import { IUserCreateInput } from '../types/user.types';

export class AuthController {
  /**
   * Register endpoint
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, phone, password, firstName, lastName, fullName } = req.body;

      const resolvedFullName =
        typeof fullName === 'string' && fullName.trim().length > 0
          ? fullName.trim()
          : [firstName, lastName].filter(Boolean).join(' ').trim() || undefined;

      const normalizedEmail = typeof email === 'string' && email.trim() ? email.trim() : undefined;
      const normalizedPhone = typeof phone === 'string' && phone.trim() ? phone.trim() : undefined;

      const input: IUserCreateInput = {
        username: String(username || '').trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        password: String(password || ''),
        fullName: resolvedFullName || ''
      };

      const result = await userService.register(input);

      const response: IApiResponse<any> = {
        status: 'success',
        message: 'User registered successfully',
        data: result,
        timestamp: new Date()
      };

      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Login endpoint
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        throw new AppError(
          'Email and password are required',
          'VALIDATION_ERROR',
          400
        );
      }

      const result = await userService.login(email, password);

      const response: IApiResponse<any> = {
        status: 'success',
        message: 'Login successful',
        data: result,
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Refresh token endpoint
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError(
          'Refresh token is required',
          'VALIDATION_ERROR',
          400
        );
      }

      const tokens = await userService.refreshToken(refreshToken);

      const response: IApiResponse<any> = {
        status: 'success',
        message: 'Token refreshed successfully',
        data: tokens,
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Verify OTP endpoint
   */
  async verifyOtp(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { otp, email, phone } = req.body;

      if (!otp) {
        throw new AppError('OTP is required', 'VALIDATION_ERROR', 400);
      }

      await userService.verifyOtp(String(otp), {
        userId: req.user?.id,
        email: typeof email === 'string' ? email : undefined,
        phone: typeof phone === 'string' ? phone : undefined
      });

      const response: IApiResponse<null> = {
        status: 'success',
        message: 'Account verified successfully',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Resend OTP endpoint
   */
  async resendOtp(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { email, phone } = req.body || {};

      await userService.resendOtp({
        userId: req.user?.id,
        email: typeof email === 'string' ? email : undefined,
        phone: typeof phone === 'string' ? phone : undefined
      });

      const response: IApiResponse<null> = {
        status: 'success',
        message: 'OTP sent successfully',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Logout endpoint
   */
  async logout(req: IAuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new AppError(
          'User not authenticated',
          'UNAUTHORIZED',
          401
        );
      }

      await userService.logout(req.user.id);

      const response: IApiResponse<null> = {
        status: 'success',
        message: 'Logout successful',
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Get current user endpoint
   */
  async getCurrentUser(req: IAuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new AppError(
          'User not authenticated',
          'UNAUTHORIZED',
          401
        );
      }

      const user = await userService.getUserById(req.user.id);

      const response: IApiResponse<any> = {
        status: 'success',
        message: 'User retrieved successfully',
        data: user,
        timestamp: new Date()
      };

      res.status(200).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Error handler
   */
  private handleError(error: unknown, res: Response): void {
    if (error instanceof AppError) {
      const response: IApiResponse<null> = {
        status: 'error',
        message: error.message,
        error: {
          code: error.code,
          details: error.details
        },
        timestamp: new Date()
      };

      res.status(error.statusCode).json(response);
    } else {
      console.error('Unexpected error:', error);
      const response: IApiResponse<null> = {
        status: 'error',
        message: 'An unexpected error occurred',
        error: {
          code: 'INTERNAL_SERVER_ERROR'
        },
        timestamp: new Date()
      };

      res.status(500).json(response);
    }
  }
}

// Export singleton instance
export const authController = new AuthController();

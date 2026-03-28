/**
 * Authentication Middleware
 */

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthRequest } from '@types/common.types';

export interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

/**
 * Protect route - Verify JWT token
 */
export const protect = (req: IAuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: 'error',
        message: 'No token provided',
        timestamp: new Date()
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: '',
      username: ''
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
      timestamp: new Date()
    });
  }
};

/**
 * Optional auth - Don't block if no token, but attach user if valid
 */
export const optionalAuth = (req: IAuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;

      req.user = {
        id: decoded.id,
        email: '',
        username: ''
      };
    }

    next();
  } catch (error) {
    // Silently fail and continue
    next();
  }
};

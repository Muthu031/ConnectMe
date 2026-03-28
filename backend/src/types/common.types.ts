/**
 * Common API Response Types
 */

export interface IApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
  timestamp: Date;
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: IPaginationMeta;
}

/**
 * Authentication Types
 */
export interface IAuthPayload {
  id: string;
  email: string;
  username: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IAuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
  };
  tokens: IAuthTokens;
}

/**
 * Custom Error Type
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Request Context
 */
export interface IRequestContext {
  userId?: string;
  email?: string;
  username?: string;
  ip?: string;
  userAgent?: string;
}

export interface IAuthRequest extends Express.Request {
  user?: IAuthPayload;
  context?: IRequestContext;
}

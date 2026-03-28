/**
 * ConnectMe Backend Server - TypeScript Entry Point
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import 'dotenv/config';

import { initializeDB, closeDB } from './config/database';
import authRoutes from './routes/auth.routes';
import { AppError, IApiResponse } from './types/common.types';

const app: Express = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Middleware Setup
 */

// Security
app.use(helmet());

// Compression
app.use(compression());

// Logging
app.use(morgan('dev'));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Health Check Endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  const response: IApiResponse<null> = {
    status: 'success',
    message: 'Server is running',
    timestamp: new Date()
  };
  res.status(200).json(response);
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);

/**
 * 404 Handler
 */
app.use((req: Request, res: Response) => {
  const response: IApiResponse<null> = {
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    error: { code: 'NOT_FOUND' },
    timestamp: new Date()
  };
  res.status(404).json(response);
});

/**
 * Global Error Handler
 */
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    const response: IApiResponse<null> = {
      status: 'error',
      message: err.message,
      error: {
        code: err.code,
        details: err.details
      },
      timestamp: new Date()
    };
    res.status(err.statusCode).json(response);
  } else if (err instanceof Error) {
    const response: IApiResponse<null> = {
      status: 'error',
      message: err.message,
      error: { code: 'INTERNAL_SERVER_ERROR' },
      timestamp: new Date()
    };
    res.status(500).json(response);
  } else {
    const response: IApiResponse<null> = {
      status: 'error',
      message: 'An unexpected error occurred',
      error: { code: 'INTERNAL_SERVER_ERROR' },
      timestamp: new Date()
    };
    res.status(500).json(response);
  }
});

/**
 * Initialize and Start Server
 */
const startServer = async () => {
  try {
    // Initialize database
    console.log('🔧 Initializing database...');
    await initializeDB();

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║          ConnectMe Backend              ║
║      TypeScript + Drizzle ORM            ║
╠════════════════════════════════════════╣
║  🚀 Server running on port ${PORT}           ║
║  📱 Environment: ${NODE_ENV}          ║
║  🌐 API: http://localhost:${PORT}/api      ║
║  💚 Health: http://localhost:${PORT}/health ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

/**
 * Graceful Shutdown
 */
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await closeDB();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await closeDB();
  process.exit(0);
});

// Start the server
startServer();

export default app;

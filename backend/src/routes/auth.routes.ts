/**
 * Authentication Routes
 */

import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { protect, optionalAuth } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', (req, res) => authController.register(req, res));

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', (req, res) => authController.login(req, res));

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token', (req, res) => authController.refreshToken(req, res));

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify account with OTP
 * @access  Public (can use token optionally)
 */
router.post('/verify-otp', optionalAuth, (req, res) => authController.verifyOtp(req, res));

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend OTP for account verification
 * @access  Public (can use token optionally)
 */
router.post('/resend-otp', optionalAuth, (req, res) => authController.resendOtp(req, res));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', protect, (req, res) => authController.logout(req, res));

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', protect, (req, res) => authController.getCurrentUser(req, res));

export default router;

import { Request, Response, NextFunction } from 'express';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { InsertUser, User } from '@shared/schema';
import { storage } from './storage';
import { extendSession } from './session';

// Rate limiting for login attempts
interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  blocked: boolean;
  blockedUntil?: number;
}

// In-memory rate limiting store (would move to Redis in production)
const loginAttempts = new Map<string, RateLimitEntry>();

// Rate limiting constants
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes

// Convert callback-based scrypt to Promise-based
const scrypt = promisify(scryptCallback);

/**
 * Hash a password using scrypt with stronger parameters
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate a longer, random salt
  const salt = randomBytes(32).toString('hex');
  // Use standard parameters since custom params aren't supported in this environment
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${derivedKey.toString('hex')}.${salt}`;
}

/**
 * Verify if a plain password matches a hashed password using timing-safe comparison
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    const [hash, salt] = hashedPassword.split('.');
    const hashBuffer = Buffer.from(hash, 'hex');
    const derivedKey = (await scrypt(plainPassword, salt, 64)) as Buffer;
    
    // Use timing-safe comparison to prevent timing attacks
    return timingSafeEqual(hashBuffer, derivedKey);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Check if login attempts are rate limited
 */
export function checkRateLimit(ip: string): { allowed: boolean; timeRemaining?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  
  if (!entry) {
    return { allowed: true };
  }
  
  // Check if IP is blocked
  if (entry.blocked && entry.blockedUntil && entry.blockedUntil > now) {
    return { 
      allowed: false, 
      timeRemaining: Math.ceil((entry.blockedUntil - now) / 1000 / 60) // minutes
    };
  }
  
  // Reset if window has expired
  if (now - entry.firstAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.set(ip, {
      count: 0,
      firstAttempt: now,
      lastAttempt: now,
      blocked: false
    });
    return { allowed: true };
  }
  
  // Check if too many attempts
  if (entry.count >= MAX_ATTEMPTS) {
    // Block the IP
    const blockedUntil = now + BLOCK_DURATION;
    loginAttempts.set(ip, {
      ...entry,
      blocked: true,
      blockedUntil
    });
    
    return { 
      allowed: false, 
      timeRemaining: Math.ceil(BLOCK_DURATION / 1000 / 60) // minutes
    };
  }
  
  return { allowed: true };
}

/**
 * Record a login attempt
 */
export function recordLoginAttempt(ip: string, success: boolean): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  
  if (success && entry) {
    // Reset on successful login
    loginAttempts.delete(ip);
    return;
  }
  
  if (!entry) {
    loginAttempts.set(ip, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
      blocked: false
    });
    return;
  }
  
  // Update attempt count
  loginAttempts.set(ip, {
    ...entry,
    count: entry.count + 1,
    lastAttempt: now
  });
}

/**
 * Register a new user with improved validation
 */
export async function registerUser(userData: any): Promise<User> {
  // Check if username exists
  const existingUsername = await storage.getUserByUsername(userData.username as string);
  if (existingUsername) {
    throw new Error('Username already exists');
  }
  
  // Check if email exists if provided
  if (userData.email) {
    const existingEmail = await storage.getUserByEmail(userData.email as string);
    if (existingEmail) {
      throw new Error('Email is already registered');
    }
  }

  // Check password strength (basic check)
  const password = userData.password as string;
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  
  // Hash the password
  const passwordHash = await hashPassword(password);

  // Generate verification token if email verification is needed
  const verificationToken = randomBytes(32).toString('hex');

  // Create the user
  const user = await storage.createUser({
    ...userData,
    passwordHash,
    verificationToken,
    isVerified: false, // Default to unverified if email verification is enabled
  } as any);

  return user;
}

/**
 * Login a user with rate limiting and remember me functionality
 */
export async function loginUser(username: string, password: string, rememberMe: boolean = false, ip: string): Promise<User> {
  // Check rate limiting
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    throw new Error(`Too many login attempts. Please try again in ${rateLimit.timeRemaining} minutes.`);
  }

  try {
    // Find the user
    const user = await storage.getUserByUsername(username);
    if (!user) {
      recordLoginAttempt(ip, false);
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      recordLoginAttempt(ip, false);
      throw new Error('Invalid username or password');
    }

    // Update last login timestamp
    await storage.updateLastLogin(user.id);
    
    // Reset failed login attempts
    recordLoginAttempt(ip, true);

    return user;
  } catch (error) {
    // Record failed attempt and rethrow
    recordLoginAttempt(ip, false);
    throw error;
  }
}

/**
 * Middleware to check if user is authenticated
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Update last active timestamp
  req.session.lastActive = new Date();
  next();
}

/**
 * Middleware to check if user is verified
 */
export function requireVerified(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!req.session.isVerified) {
    return res.status(403).json({ error: 'Email verification required' });
  }

  next();
}

/**
 * Get current user from session
 */
export async function getCurrentUser(req: Request): Promise<User | null> {
  if (!req.session.userId) {
    return null;
  }

  const user = await storage.getUser(req.session.userId);
  
  // Update last active timestamp
  if (user) {
    req.session.lastActive = new Date();
  }
  
  return user || null;
}

/**
 * Generate a password reset token
 */
export async function generatePasswordResetToken(email: string): Promise<string | null> {
  const user = await storage.getUserByEmail(email);
  if (!user) {
    return null;
  }

  // Generate a token
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour

  // Store token in database
  await storage.createPasswordResetToken(user.id, token, expires);

  return token;
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  // Validate token and get user
  const resetRecord = await storage.validatePasswordResetToken(token);
  if (!resetRecord) {
    return false;
  }

  // Update password
  const passwordHash = await hashPassword(newPassword);
  await storage.updateUserPassword(resetRecord.userId, passwordHash);

  // Invalidate token
  await storage.invalidatePasswordResetToken(token);

  return true;
}

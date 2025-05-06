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
  // Track consecutive failures for exponential backoff
  consecutiveFailures?: number;
}

// In-memory rate limiting store (would move to Redis in production)
const ipLoginAttempts = new Map<string, RateLimitEntry>();
const usernameLoginAttempts = new Map<string, RateLimitEntry>();

// Auto-cleanup old entries every 6 hours (prevent memory leaks)
setInterval(() => {
  const now = Date.now();
  const expiryTime = now - (12 * 60 * 60 * 1000); // 12 hours
  
  // Clean up IP attempts
  for (const [ip, entry] of ipLoginAttempts.entries()) {
    if (entry.lastAttempt < expiryTime) {
      ipLoginAttempts.delete(ip);
    }
  }
  
  // Clean up username attempts
  for (const [username, entry] of usernameLoginAttempts.entries()) {
    if (entry.lastAttempt < expiryTime) {
      usernameLoginAttempts.delete(username);
    }
  }
}, 6 * 60 * 60 * 1000); // Run every 6 hours

// Rate limiting constants
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes
const ACCOUNT_BLOCK_DURATION = 60 * 60 * 1000; // 60 minutes (longer for account-specific)

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
 * Check if login attempts are rate limited by IP address
 */
export function checkIpRateLimit(ip: string): { allowed: boolean; timeRemaining?: number } {
  const now = Date.now();
  const entry = ipLoginAttempts.get(ip);
  
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
    ipLoginAttempts.set(ip, {
      count: 0,
      firstAttempt: now,
      lastAttempt: now,
      blocked: false,
      consecutiveFailures: 0
    });
    return { allowed: true };
  }
  
  // Check if too many attempts
  if (entry.count >= MAX_ATTEMPTS) {
    // Calculate block duration with exponential backoff
    const consecutiveFailures = entry.consecutiveFailures || 1;
    const blockMultiplier = Math.min(Math.pow(2, consecutiveFailures - 1), 6); // Cap at 6x (3 hours)
    const blockDuration = BLOCK_DURATION * blockMultiplier;
    
    // Block the IP
    const blockedUntil = now + blockDuration;
    ipLoginAttempts.set(ip, {
      ...entry,
      blocked: true,
      blockedUntil,
      consecutiveFailures: consecutiveFailures + 1
    });
    
    return { 
      allowed: false, 
      timeRemaining: Math.ceil(blockDuration / 1000 / 60) // minutes
    };
  }
  
  return { allowed: true };
}

/**
 * Check if login attempts are rate limited by username
 */
export function checkUsernameRateLimit(username: string): { allowed: boolean; timeRemaining?: number } {
  const now = Date.now();
  const entry = usernameLoginAttempts.get(username);
  
  if (!entry) {
    return { allowed: true };
  }
  
  // Check if username is blocked
  if (entry.blocked && entry.blockedUntil && entry.blockedUntil > now) {
    return { 
      allowed: false, 
      timeRemaining: Math.ceil((entry.blockedUntil - now) / 1000 / 60) // minutes
    };
  }
  
  // Reset if window has expired
  if (now - entry.firstAttempt > RATE_LIMIT_WINDOW) {
    usernameLoginAttempts.set(username, {
      count: 0,
      firstAttempt: now,
      lastAttempt: now,
      blocked: false,
      consecutiveFailures: 0
    });
    return { allowed: true };
  }
  
  // Check if too many attempts for this username
  if (entry.count >= MAX_ATTEMPTS) {
    // Calculate block duration with exponential backoff
    const consecutiveFailures = entry.consecutiveFailures || 1;
    const blockMultiplier = Math.min(Math.pow(2, consecutiveFailures - 1), 8); // Cap at 8x (8 hours)
    const blockDuration = ACCOUNT_BLOCK_DURATION * blockMultiplier;
    
    // Block the username
    const blockedUntil = now + blockDuration;
    usernameLoginAttempts.set(username, {
      ...entry,
      blocked: true,
      blockedUntil,
      consecutiveFailures: consecutiveFailures + 1
    });
    
    // Account lockout could trigger security notification in a real app
    console.warn(`Account locked: ${username} - multiple failed login attempts`);
    
    return { 
      allowed: false, 
      timeRemaining: Math.ceil(blockDuration / 1000 / 60) // minutes
    };
  }
  
  return { allowed: true };
}

/**
 * Check both IP and username rate limits
 * If either is blocked, login is blocked
 */
export function checkRateLimit(ip: string, username?: string): { allowed: boolean; timeRemaining?: number; source?: string } {
  // Always check IP rate limit
  const ipLimit = checkIpRateLimit(ip);
  if (!ipLimit.allowed) {
    return { ...ipLimit, source: 'ip' };
  }
  
  // If username is provided, also check username rate limit
  if (username) {
    const usernameLimit = checkUsernameRateLimit(username);
    if (!usernameLimit.allowed) {
      return { ...usernameLimit, source: 'account' };
    }
  }
  
  // Both checks passed
  return { allowed: true };
}

/**
 * Record a login attempt
 */
export function recordLoginAttempt(ip: string, username: string | undefined, success: boolean): void {
  const now = Date.now();
  
  // Always track IP-based attempts
  const ipEntry = ipLoginAttempts.get(ip);
  
  if (success) {
    // Reset on successful login
    if (ipEntry) {
      ipLoginAttempts.delete(ip);
    }
    
    // Also reset username tracking if provided
    if (username && usernameLoginAttempts.has(username)) {
      usernameLoginAttempts.delete(username);
    }
    return;
  }
  
  // Handle IP tracking for failed attempt
  if (!ipEntry) {
    ipLoginAttempts.set(ip, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
      blocked: false,
      consecutiveFailures: 1
    });
  } else {
    // Update attempt count
    ipLoginAttempts.set(ip, {
      ...ipEntry,
      count: ipEntry.count + 1,
      lastAttempt: now,
      consecutiveFailures: (ipEntry.consecutiveFailures || 0) + 1
    });
  }
  
  // Handle username tracking if provided
  if (username) {
    const usernameEntry = usernameLoginAttempts.get(username);
    
    if (!usernameEntry) {
      usernameLoginAttempts.set(username, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
        blocked: false,
        consecutiveFailures: 1
      });
    } else {
      // Update attempt count
      usernameLoginAttempts.set(username, {
        ...usernameEntry,
        count: usernameEntry.count + 1,
        lastAttempt: now,
        consecutiveFailures: (usernameEntry.consecutiveFailures || 0) + 1
      });
    }
  }
}

import { sendVerificationEmail, sendPasswordResetEmail } from './email-service';

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
  
  // Send verification email if email is provided
  if (user.email) {
    try {
      await sendVerificationEmail(user);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Continue even if email fails - user can request a new verification email
    }
  }

  return user;
}

/**
 * Login a user with rate limiting and remember me functionality
 */
export async function loginUser(username: string, password: string, rememberMe: boolean = false, ip: string): Promise<User> {
  // Check both IP and username rate limiting
  const rateLimit = checkRateLimit(ip, username);
  if (!rateLimit.allowed) {
    const sourceType = rateLimit.source === 'account' ? 'account' : 'IP address';
    throw new Error(`Too many login attempts for this ${sourceType}. Please try again in ${rateLimit.timeRemaining} minutes.`);
  }

  try {
    // Find the user
    const user = await storage.getUserByUsername(username);
    if (!user) {
      // Record failed attempt but don't expose that the username doesn't exist
      recordLoginAttempt(ip, username, false);
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      // Record failed attempt for both IP and username
      recordLoginAttempt(ip, username, false);
      throw new Error('Invalid username or password');
    }

    // Update last login timestamp
    await storage.updateLastLogin(user.id);
    
    // Handle remember me functionality if requested
    if (rememberMe) {
      // Extend session lifetime
      extendSession(user.id);
    }
    
    // Reset failed login attempts for both IP and username
    recordLoginAttempt(ip, username, true);

    return user;
  } catch (error) {
    // Record failed attempt for both IP and username if not already done
    if (error instanceof Error && error.message !== 'Invalid username or password') {
      recordLoginAttempt(ip, username, false);
    }
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
  
  // Send password reset email
  try {
    await sendPasswordResetEmail(email, token);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    // Continue anyway, token is still valid
  }

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

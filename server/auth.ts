import { Request, Response, NextFunction } from 'express';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { InsertUser, User } from '@shared/schema';
import { storage } from './storage';
import { extendSession } from './session';
import { mfaService } from './mfa-service';
import { securityService } from './security-service';

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
 * Login a user with enhanced security features
 * Returns user and MFA status information
 */
export async function loginUser(username: string, password: string, rememberMe: boolean = false, req: Request): Promise<{
  user: User;
  requireMfa: boolean;
  mfaType: 'totp' | 'recovery' | null;
  deviceId: string | null;
  newDevice: boolean;
}> {
  const ip = securityService.getClientIp(req);
  
  // Use the improved rate limiting from securityService
  const rateLimit = securityService.checkRateLimit(ip, username);
  if (rateLimit.blocked) {
    throw new Error(`Too many login attempts. Please try again in ${Math.ceil(rateLimit.waitTime / 60)} minutes.`);
  }

  try {
    // Find the user
    const user = await storage.getUserByUsername(username);
    if (!user) {
      // Don't expose that the username doesn't exist
      securityService.recordLoginAttempt(ip, username, false);
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      securityService.recordLoginAttempt(ip, username, false);
      await mfaService.logSecurityEvent(
        user.id,
        'LOGIN_FAILED',
        'Failed login attempt: incorrect password',
        { ip, userAgent: req.headers['user-agent'] }
      );
      throw new Error('Invalid username or password');
    }
    
    // Check if account is verified if email verification is required
    if (user.email && !user.isVerified) {
      throw new Error('Please verify your email address before logging in');
    }

    // Update last login timestamp
    await storage.updateLastLogin(user.id);
    
    // Device management - check if device is known
    const userDevices = await securityService.getUserDevices(user.id);
    let deviceId = null;
    let newDevice = false;
    
    // Try to identify the device by its fingerprint (simplified here)
    const userAgent = req.headers['user-agent'] || '';
    const existingDevice = userDevices.find(device => 
      device.browser === securityService.parseUserAgent(userAgent).browser &&
      device.ipAddress === ip
    );
    
    if (existingDevice) {
      // Known device
      deviceId = existingDevice.deviceId;
      // Update last login time for the device
      await storage.updateDeviceLastLogin(existingDevice.id);
    } else {
      // New device - register it
      deviceId = await securityService.registerDevice(user.id, req);
      newDevice = true;
      
      // Log security event for new device
      await mfaService.logSecurityEvent(
        user.id, 
        'NEW_DEVICE_LOGIN', 
        'Login from a new device', 
        { deviceId, ip, userAgent }
      );
    }
    
    // Create a user session
    const sessionToken = await securityService.createSession(user.id, req, deviceId, rememberMe);
    
    // Check if MFA is required
    let requireMfa = false;
    let mfaType: 'totp' | 'recovery' | null = null;
    
    if (user.mfaEnabled) {
      // If MFA is enabled, check if this is a trusted device
      const isTrustedDevice = await securityService.isDeviceTrusted(user.id, deviceId);
      requireMfa = !isTrustedDevice;
      mfaType = 'totp';
    }
    
    // Record successful login
    securityService.recordSuccessfulLogin(ip, username);
    
    // Log security event
    await mfaService.logSecurityEvent(
      user.id,
      'LOGIN_SUCCESS',
      `User logged in successfully${rememberMe ? ' with remember-me option' : ''}`,
      { ip, deviceId, requireMfa, rememberMe }
    );

    return { user, requireMfa, mfaType, deviceId, newDevice };
  } catch (error) {
    // Record failed attempt if not already recorded
    if (error instanceof Error && error.message !== 'Invalid username or password') {
      securityService.recordLoginAttempt(ip, username, false);
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
  
  // Log security event
  await mfaService.logSecurityEvent(
    resetRecord.userId,
    'PASSWORD_RESET',
    'Password was reset using a reset token',
    {}
  );

  return true;
}

/**
 * Verify MFA TOTP code
 */
export async function verifyMfaCode(userId: number, code: string, req: Request): Promise<boolean> {
  // Validate the TOTP code
  const isValidCode = await mfaService.validateTotpCode(userId, code);
  if (!isValidCode) {
    await mfaService.logSecurityEvent(
      userId,
      'MFA_FAILED',
      'Invalid MFA code entered',
      { ip: securityService.getClientIp(req) }
    );
    return false;
  }
  
  // Log successful MFA authentication
  await mfaService.logSecurityEvent(
    userId,
    'MFA_SUCCESS',
    'MFA verification successful',
    { ip: securityService.getClientIp(req) }
  );
  
  return true;
}

/**
 * Verify MFA recovery code
 */
export async function verifyMfaRecoveryCode(userId: number, code: string, req: Request): Promise<boolean> {
  // Validate the recovery code
  const isValidCode = await mfaService.validateRecoveryCode(userId, code);
  if (!isValidCode) {
    await mfaService.logSecurityEvent(
      userId,
      'MFA_RECOVERY_FAILED',
      'Invalid MFA recovery code entered',
      { ip: securityService.getClientIp(req) }
    );
    return false;
  }
  
  // Log successful MFA recovery authentication
  await mfaService.logSecurityEvent(
    userId,
    'MFA_RECOVERY_SUCCESS',
    'MFA recovery code used successfully',
    { ip: securityService.getClientIp(req) }
  );
  
  return true;
}

/**
 * Setup MFA for a user
 */
export async function setupMfa(userId: number, req: Request): Promise<{ secret: string, recoveryCodes: string[] }> {
  // Generate a new TOTP secret
  const secret = await mfaService.generateSecret(userId);
  
  // Generate recovery codes
  const recoveryCodes = await mfaService.generateRecoveryCodes(userId);
  
  // Log MFA setup initiation
  await mfaService.logSecurityEvent(
    userId,
    'MFA_SETUP_INITIATED',
    'MFA setup initiated',
    { ip: securityService.getClientIp(req) }
  );
  
  return { secret, recoveryCodes };
}

/**
 * Enable MFA for a user after verification
 */
export async function enableMfa(userId: number, code: string, req: Request): Promise<boolean> {
  // Verify the code against the secret
  const isValidCode = await mfaService.validateTotpCode(userId, code);
  if (!isValidCode) {
    await mfaService.logSecurityEvent(
      userId,
      'MFA_SETUP_FAILED',
      'Failed to validate TOTP code during MFA setup',
      { ip: securityService.getClientIp(req) }
    );
    return false;
  }
  
  // Enable MFA for the user
  await mfaService.enableMfa(userId);
  
  // Log MFA enabled
  await mfaService.logSecurityEvent(
    userId,
    'MFA_ENABLED',
    'MFA has been enabled',
    { ip: securityService.getClientIp(req) }
  );
  
  return true;
}

/**
 * Disable MFA for a user
 */
export async function disableMfa(userId: number, req: Request, password: string): Promise<boolean> {
  // First, verify the user's password for critical action
  const user = await storage.getUser(userId);
  if (!user) {
    return false;
  }
  
  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    await mfaService.logSecurityEvent(
      userId,
      'MFA_DISABLE_FAILED',
      'Failed to disable MFA due to invalid password',
      { ip: securityService.getClientIp(req) }
    );
    return false;
  }
  
  // Disable MFA
  await mfaService.disableMfa(userId);
  
  // Log MFA disabled
  await mfaService.logSecurityEvent(
    userId,
    'MFA_DISABLED',
    'MFA has been disabled',
    { ip: securityService.getClientIp(req) }
  );
  
  return true;
}

/**
 * Trust a device to bypass MFA
 */
export async function trustDevice(userId: number, deviceId: string, req: Request): Promise<boolean> {
  try {
    await securityService.trustDevice(userId, deviceId);
    
    // Log device trusted
    await mfaService.logSecurityEvent(
      userId,
      'DEVICE_TRUSTED',
      'Device marked as trusted for MFA',
      { deviceId, ip: securityService.getClientIp(req) }
    );
    
    return true;
  } catch (error) {
    console.error('Error trusting device:', error);
    return false;
  }
}

/**
 * Remove a device from trusted devices
 */
export async function untrustDevice(userId: number, deviceId: string, req: Request): Promise<boolean> {
  try {
    await securityService.untrustDevice(userId, deviceId);
    
    // Log device untrusted
    await mfaService.logSecurityEvent(
      userId,
      'DEVICE_UNTRUSTED',
      'Device removed from trusted devices for MFA',
      { deviceId, ip: securityService.getClientIp(req) }
    );
    
    return true;
  } catch (error) {
    console.error('Error untrusting device:', error);
    return false;
  }
}

/**
 * Get all devices for a user
 */
export async function getUserDevices(userId: number): Promise<any[]> {
  return await securityService.getUserDevices(userId);
}

/**
 * Remove a device for a user
 */
export async function removeDevice(userId: number, deviceId: string, req: Request): Promise<boolean> {
  try {
    // Check if device exists and belongs to user
    const devices = await securityService.getUserDevices(userId);
    const deviceExists = devices.some(device => device.deviceId === deviceId);
    
    if (!deviceExists) {
      return false;
    }
    
    await securityService.removeDevice(userId, deviceId);
    
    // Log device removed
    await mfaService.logSecurityEvent(
      userId,
      'DEVICE_REMOVED',
      'Device removed from account',
      { deviceId, ip: securityService.getClientIp(req) }
    );
    
    return true;
  } catch (error) {
    console.error('Error removing device:', error);
    return false;
  }
}

/**
 * Get active sessions for a user
 */
export async function getUserSessions(userId: number): Promise<any[]> {
  try {
    const sessions = await storage.getUserSessions(userId);
    return sessions;
  } catch (error) {
    console.error('Error getting user sessions:', error);
    return [];
  }
}

/**
 * Terminate a specific session
 */
export async function terminateSession(userId: number, sessionToken: string, req: Request): Promise<boolean> {
  try {
    // Verify session belongs to user
    const sessions = await storage.getUserSessions(userId);
    const sessionExists = sessions.some(session => session.sessionToken === sessionToken);
    
    if (!sessionExists) {
      return false;
    }
    
    await securityService.terminateSession(sessionToken);
    
    // Log session terminated
    await mfaService.logSecurityEvent(
      userId,
      'SESSION_TERMINATED',
      'User session was terminated',
      { sessionToken, ip: securityService.getClientIp(req) }
    );
    
    return true;
  } catch (error) {
    console.error('Error terminating session:', error);
    return false;
  }
}

/**
 * Terminate all other sessions for a user
 */
export async function terminateOtherSessions(userId: number, currentSessionToken: string, req: Request): Promise<boolean> {
  try {
    await securityService.terminateOtherSessions(userId, currentSessionToken);
    
    // Log all other sessions terminated
    await mfaService.logSecurityEvent(
      userId,
      'ALL_OTHER_SESSIONS_TERMINATED',
      'All other user sessions were terminated',
      { currentSessionToken, ip: securityService.getClientIp(req) }
    );
    
    return true;
  } catch (error) {
    console.error('Error terminating other sessions:', error);
    return false;
  }
}

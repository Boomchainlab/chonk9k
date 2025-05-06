import crypto from 'crypto';
import { db } from './db';
import { mfaService } from './mfa-service';
import { users, userDevices, userSessions, securityEvents } from '@shared/schema';
import { eq, and, lt, gt, or, not, asc, desc, sql } from 'drizzle-orm';
import { Request } from 'express';

/**
 * Rate Limiter for Login Attempts
 * Uses both IP-based and username-based rate limiting with exponential backoff
 */
interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  blocked: boolean;
  blockedUntil: number;
}

/**
 * SecurityService
 * Provides security functions including device management, session tracking,
 * rate limiting, and security event logging
 */
export class SecurityService {
  private ipLimits: Map<string, RateLimitEntry> = new Map();
  private userLimits: Map<string, RateLimitEntry> = new Map();
  
  // Rate limit configuration
  private readonly MAX_ATTEMPTS = 5;
  private readonly RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private readonly MIN_BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
  private readonly CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
  
  constructor() {
    // Set up cleanup interval for rate limit entries
    setInterval(() => this.cleanupRateLimits(), this.CLEANUP_INTERVAL_MS);
  }
  
  /**
   * Track a login attempt and check if it should be rate limited
   * @param ip - The request IP address
   * @param username - The attempted username
   * @returns Object with blocked status and wait time
   */
  checkRateLimit(ip: string, username: string): { blocked: boolean, waitTime: number } {
    const now = Date.now();
    
    // Check IP-based limit
    const ipEntry = this.getOrCreateRateLimitEntry(this.ipLimits, ip);
    const userEntry = this.getOrCreateRateLimitEntry(this.userLimits, username);
    
    // If either entry is currently blocked, reject the request
    if (ipEntry.blocked && ipEntry.blockedUntil > now) {
      return { blocked: true, waitTime: Math.ceil((ipEntry.blockedUntil - now) / 1000) };
    }
    if (userEntry.blocked && userEntry.blockedUntil > now) {
      return { blocked: true, waitTime: Math.ceil((userEntry.blockedUntil - now) / 1000) };
    }
    
    // Reset if window has expired
    if (now - ipEntry.firstAttempt > this.RATE_LIMIT_WINDOW_MS) {
      ipEntry.count = 0;
      ipEntry.firstAttempt = now;
    }
    if (now - userEntry.firstAttempt > this.RATE_LIMIT_WINDOW_MS) {
      userEntry.count = 0;
      userEntry.firstAttempt = now;
    }
    
    // Increment attempt counters
    ipEntry.count++;
    ipEntry.lastAttempt = now;
    userEntry.count++;
    userEntry.lastAttempt = now;
    
    // Check if too many attempts
    if (ipEntry.count > this.MAX_ATTEMPTS) {
      // Apply exponential backoff
      const excessAttempts = ipEntry.count - this.MAX_ATTEMPTS;
      const blockDuration = this.MIN_BLOCK_DURATION_MS * Math.pow(2, Math.min(excessAttempts, 10));
      ipEntry.blocked = true;
      ipEntry.blockedUntil = now + blockDuration;
      return { blocked: true, waitTime: Math.ceil(blockDuration / 1000) };
    }
    
    if (userEntry.count > this.MAX_ATTEMPTS) {
      // Apply exponential backoff
      const excessAttempts = userEntry.count - this.MAX_ATTEMPTS;
      const blockDuration = this.MIN_BLOCK_DURATION_MS * Math.pow(2, Math.min(excessAttempts, 10));
      userEntry.blocked = true;
      userEntry.blockedUntil = now + blockDuration;
      return { blocked: true, waitTime: Math.ceil(blockDuration / 1000) };
    }
    
    return { blocked: false, waitTime: 0 };
  }
  
  /**
   * Record a login attempt
   * @param ip - The request IP address
   * @param username - The attempted username
   * @param success - Whether the login was successful 
   */
  recordLoginAttempt(ip: string, username: string | undefined, success: boolean): void {
    const now = Date.now();
    
    if (success) {
      // Clear rate limits on successful login
      this.ipLimits.delete(ip);
      if (username) {
        this.userLimits.delete(username);
      }
      return;
    }
    
    // Handle IP tracking for failed attempt
    const ipEntry = this.getOrCreateRateLimitEntry(this.ipLimits, ip);
    ipEntry.count++;
    ipEntry.lastAttempt = now;
    this.ipLimits.set(ip, ipEntry);
    
    // Handle username tracking for failed attempt
    if (username) {
      const usernameEntry = this.getOrCreateRateLimitEntry(this.userLimits, username);
      usernameEntry.count++;
      usernameEntry.lastAttempt = now;
      this.userLimits.set(username, usernameEntry);
    }
  }
  
  /**
   * Record a successful login, clearing rate limit entries
   * @param ip - The request IP address
   * @param username - The attempted username
   */
  recordSuccessfulLogin(ip: string, username: string): void {
    this.ipLimits.delete(ip);
    this.userLimits.delete(username);
  }
  
  /**
   * Clean up expired rate limit entries
   */
  private cleanupRateLimits(): void {
    const now = Date.now();
    const expiryTime = now - this.RATE_LIMIT_WINDOW_MS * 2;
    
    // Clear expired IP entries
    for (const [ip, entry] of this.ipLimits.entries()) {
      if (entry.lastAttempt < expiryTime && (!entry.blocked || entry.blockedUntil < now)) {
        this.ipLimits.delete(ip);
      }
    }
    
    // Clear expired username entries
    for (const [username, entry] of this.userLimits.entries()) {
      if (entry.lastAttempt < expiryTime && (!entry.blocked || entry.blockedUntil < now)) {
        this.userLimits.delete(username);
      }
    }
  }
  
  /**
   * Get or create a rate limit entry
   */
  private getOrCreateRateLimitEntry(map: Map<string, RateLimitEntry>, key: string): RateLimitEntry {
    if (!map.has(key)) {
      const now = Date.now();
      map.set(key, {
        count: 0,
        firstAttempt: now,
        lastAttempt: now,
        blocked: false,
        blockedUntil: 0
      });
    }
    return map.get(key)!;
  }
  
  /**
   * Register a new device for a user
   */
  async registerDevice(userId: number, req: Request): Promise<string> {
    const deviceId = crypto.randomBytes(32).toString('hex');
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = this.getClientIp(req);
    
    // Attempt to parse the user agent
    const deviceInfo = this.parseUserAgent(userAgent);
    
    await db.insert(userDevices)
      .values({
        userId,
        deviceId,
        deviceName: deviceInfo.deviceName,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        operatingSystem: deviceInfo.os,
        ipAddress,
        lastLoginAt: new Date(),
        isTrusted: false,
      });
      
    // Log security event
    await mfaService.logSecurityEvent(
      userId,
      'DEVICE_REGISTERED',
      'New device registered for login',
      { deviceId, ipAddress, userAgent }
    );
    
    return deviceId;
  }
  
  /**
   * Get user's devices
   */
  async getUserDevices(userId: number) {
    return await db.select()
      .from(userDevices)
      .where(eq(userDevices.userId, userId))
      .orderBy(desc(userDevices.lastLoginAt));
  }
  
  /**
   * Create a new session for a user
   */
  async createSession(
    userId: number, 
    req: Request, 
    deviceId: string | null = null,
    isRememberMe: boolean = false
  ): Promise<string> {
    // Generate a secure random session token
    const sessionToken = crypto.randomBytes(64).toString('hex');
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = this.getClientIp(req);
    
    // Calculate session expiry - 1 hour for regular, 30 days for remember-me
    const expireHours = isRememberMe ? 24 * 30 : 1;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expireHours);
    
    // Create session in database
    await db.insert(userSessions)
      .values({
        userId,
        deviceId,
        sessionToken,
        expiresAt,
        ipAddress,
        userAgent,
        isRememberMe,
        lastActiveAt: new Date()
      });
      
    // Log security event
    const eventType = isRememberMe ? 'SESSION_CREATED_LONG' : 'SESSION_CREATED';
    await mfaService.logSecurityEvent(
      userId,
      eventType,
      `User session created${isRememberMe ? ' with remember-me option' : ''}`,
      { deviceId, ipAddress, expiresAt }
    );
    
    return sessionToken;
  }
  
  /**
   * Get a session by token
   */
  async getSessionByToken(sessionToken: string) {
    const [session] = await db.select()
      .from(userSessions)
      .where(eq(userSessions.sessionToken, sessionToken));
    
    return session || null;
  }
  
  /**
   * Validate if a session is active and not expired
   */
  async validateSession(sessionToken: string): Promise<boolean> {
    const [session] = await db.select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.sessionToken, sessionToken),
          gt(userSessions.expiresAt, new Date())
        )
      );
    
    return !!session;
  }
  
  /**
   * Update session last active time
   */
  async updateSessionActivity(sessionToken: string): Promise<void> {
    await db.update(userSessions)
      .set({ lastActiveAt: new Date() })
      .where(eq(userSessions.sessionToken, sessionToken));
  }
  
  /**
   * Terminate a specific session
   */
  async terminateSession(sessionToken: string): Promise<void> {
    const [session] = await db.select({ userId: userSessions.userId })
      .from(userSessions)
      .where(eq(userSessions.sessionToken, sessionToken));
    
    if (session) {
      await db.delete(userSessions)
        .where(eq(userSessions.sessionToken, sessionToken));
      
      // Log security event
      await mfaService.logSecurityEvent(
        session.userId,
        'SESSION_TERMINATED',
        'User session was terminated',
        { sessionToken }
      );
    }
  }
  
  /**
   * Terminate all sessions for a user except the current one
   */
  async terminateOtherSessions(userId: number, currentSessionToken: string): Promise<void> {
    const sessions = await db.select({ token: userSessions.sessionToken })
      .from(userSessions)
      .where(
        and(
          eq(userSessions.userId, userId),
          not(eq(userSessions.sessionToken, currentSessionToken))
        )
      );
    
    if (sessions.length > 0) {
      await db.delete(userSessions)
        .where(
          and(
            eq(userSessions.userId, userId),
            not(eq(userSessions.sessionToken, currentSessionToken))
          )
        );
      
      // Log security event
      await mfaService.logSecurityEvent(
        userId,
        'ALL_OTHER_SESSIONS_TERMINATED',
        `${sessions.length} other user sessions were terminated`,
        { currentSessionToken, count: sessions.length }
      );
    }
  }
  
  /**
   * Clean up expired sessions from the database
   */
  async cleanupExpiredSessions(): Promise<number> {
    const now = new Date();
    
    // Find expired sessions
    const expiredSessions = await db.select()
      .from(userSessions)
      .where(lt(userSessions.expiresAt, now));
    
    if (expiredSessions.length > 0) {
      // Group by user for logging
      const userSessionCounts = new Map<number, number>();
      expiredSessions.forEach(session => {
        const count = userSessionCounts.get(session.userId) || 0;
        userSessionCounts.set(session.userId, count + 1);
      });
      
      // Delete expired sessions
      await db.delete(userSessions)
        .where(lt(userSessions.expiresAt, now));
      
      // Log security events for each user
      for (const [userId, count] of userSessionCounts.entries()) {
        await mfaService.logSecurityEvent(
          userId,
          'SESSIONS_EXPIRED',
          `${count} expired user sessions were cleaned up`,
          { count }
        );
      }
    }
    
    return expiredSessions.length;
  }
  
  /**
   * Validate if a device is trusted
   */
  async isDeviceTrusted(userId: number, deviceId: string): Promise<boolean> {
    const [device] = await db.select({ isTrusted: userDevices.isTrusted })
      .from(userDevices)
      .where(
        and(
          eq(userDevices.userId, userId),
          eq(userDevices.deviceId, deviceId)
        )
      );
    
    return device ? device.isTrusted : false;
  }
  
  /**
   * Mark a device as trusted
   */
  async trustDevice(userId: number, deviceId: string): Promise<void> {
    await db.update(userDevices)
      .set({ isTrusted: true })
      .where(
        and(
          eq(userDevices.userId, userId),
          eq(userDevices.deviceId, deviceId)
        )
      );
    
    // Log security event
    await mfaService.logSecurityEvent(
      userId,
      'DEVICE_TRUSTED',
      'Device was marked as trusted',
      { deviceId }
    );
  }
  
  /**
   * Remove trust from a device
   */
  async untrustDevice(userId: number, deviceId: string): Promise<void> {
    await db.update(userDevices)
      .set({ isTrusted: false })
      .where(
        and(
          eq(userDevices.userId, userId),
          eq(userDevices.deviceId, deviceId)
        )
      );
    
    // Log security event
    await mfaService.logSecurityEvent(
      userId,
      'DEVICE_UNTRUSTED',
      'Device trust was removed',
      { deviceId }
    );
  }
  
  /**
   * Remove a device from a user's account
   */
  async removeDevice(userId: number, deviceId: string): Promise<void> {
    // First, end any active sessions for this device
    await db.delete(userSessions)
      .where(
        and(
          eq(userSessions.userId, userId),
          eq(userSessions.deviceId, deviceId)
        )
      );
    
    // Then remove the device
    await db.delete(userDevices)
      .where(
        and(
          eq(userDevices.userId, userId),
          eq(userDevices.deviceId, deviceId)
        )
      );
    
    // Log security event
    await mfaService.logSecurityEvent(
      userId,
      'DEVICE_REMOVED',
      'Device was removed from account',
      { deviceId }
    );
  }
  
  /**
   * Get client IP from request
   */
  getClientIp(req: Request): string {
    const forwardedFor = req.headers['x-forwarded-for'];
    const ipAddress = forwardedFor
      ? (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0] : forwardedFor[0])
      : req.ip || '127.0.0.1';
      
    return ipAddress;
  }
  
  /**
   * Parse user agent string (simplified version)
   * @param userAgent - The user agent string
   * @returns Parsed user agent information
   */
  parseUserAgent(userAgent: string): { browser: string, os: string, deviceType: string, deviceName: string } {
    let browser = 'Unknown';
    let os = 'Unknown';
    let deviceType = 'Unknown';
    let deviceName = 'Unknown Device';
    
    // Very simplified parsing logic
    if (userAgent.includes('Windows')) {
      os = 'Windows';
      deviceType = 'Desktop';
      deviceName = 'Windows Computer';
    } else if (userAgent.includes('Mac OS X')) {
      os = 'macOS';
      deviceType = 'Desktop';
      deviceName = 'Mac Computer';
    } else if (userAgent.includes('Linux')) {
      os = 'Linux';
      deviceType = 'Desktop';
      deviceName = 'Linux Computer';
    } else if (userAgent.includes('Android')) {
      os = 'Android';
      deviceType = 'Mobile';
      deviceName = 'Android Device';
    } else if (userAgent.includes('iPhone')) {
      os = 'iOS';
      deviceType = 'Mobile';
      deviceName = 'iPhone';
    } else if (userAgent.includes('iPad')) {
      os = 'iOS';
      deviceType = 'Tablet';
      deviceName = 'iPad';
    }
    
    if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
    } else if (userAgent.includes('Safari')) {
      browser = 'Safari';
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge';
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
      browser = 'Internet Explorer';
    }
    
    return { browser, os, deviceType, deviceName };
  }
}

export const securityService = new SecurityService();

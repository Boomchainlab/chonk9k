import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import crypto from "crypto";
import path from "path";
import { storage } from "./storage";
import { 
  insertBadgeSchema, 
  insertUserBadgeSchema, 
  insertTriviaQuizSchema, 
  insertTriviaQuestionSchema,
  insertTriviaSubmissionSchema,
  insertTriviaAnswerSchema,
  insertMarketplaceListingSchema,
  insertSpinWheelRewardSchema,
  insertUserSpinSchema,
  insertStakingPoolSchema,
  insertUserStakeSchema,
  insertReferralRewardSchema,
  insertPremiumTierSchema,
  insertMiningRigSchema,
  insertUserMiningRigSchema,
  insertMiningRewardSchema,
  insertTokenLaunchSchema,
  insertUserInvestmentSchema,
  insertUnstoppableDomainNFTSchema,
  insertUnstoppableDomainBenefitSchema,
  insertUserSchema,
  // Community Challenge imports
  insertCommunityChallengeSchema,
  insertChallengeSubmissionSchema,
  // Mascot Daily Tips imports
  insertDailyTipSchema,
  insertMascotSettingsSchema,
  insertCommunityVoteSchema,
  insertChallengeTagSchema,
  insertChallengeToTagSchema,
  // Learning and social sharing imports
  insertLearningModuleSchema,
  insertLearningLessonSchema,
  insertUserModuleProgressSchema,
  insertUserLessonProgressSchema,
  insertSocialShareSchema,
  insertLearningAchievementSchema,
  insertUserLearningStatsSchema
} from "@shared/schema";
import { coinMarketCapService } from "./coinmarketcap";
import { z } from "zod";
import { 
  registerUser, 
  loginUser, 
  getCurrentUser, 
  requireAuth, 
  requireVerified,
  generatePasswordResetToken,
  resetPassword,
  verifyMfaCode,
  verifyMfaRecoveryCode,
  setupMfa,
  enableMfa,
  disableMfa,
  trustDevice,
  untrustDevice,
  getUserDevices,
  removeDevice,
  getUserSessions,
  terminateSession,
  terminateOtherSessions
} from "./auth";
import { securityService } from "./security-service";
import { mfaService } from "./mfa-service";
import { sendVerificationEmail } from "./email-service";
import { eq } from "drizzle-orm";
import { users } from "@shared/schema";
import { setupSession, extendSession } from "./session";

// Extend the Request interface if needed
declare global {
  namespace Express {
    interface Request {
      clientIp?: string;
    }
  }
}

// Initialize database with some premium tiers if they don't exist yet
async function initializeDatabase() {
  try {
    // Check if premium tiers exist
    const tiers = await storage.getPremiumTiers();
    if (tiers.length === 0) {
      // Create default premium tiers
      await storage.createPremiumTier({
        name: "Bronze",
        description: "Entry level membership with basic benefits",
        tokenRequirement: 1000,
        stakingBonus: 2,
        referralBonus: 5,
        spinMultiplier: 1
      });
      
      await storage.createPremiumTier({
        name: "Silver",
        description: "Mid-tier membership with enhanced benefits",
        tokenRequirement: 5000,
        stakingBonus: 5,
        referralBonus: 10,
        spinMultiplier: 2
      });
      
      await storage.createPremiumTier({
        name: "Gold",
        description: "Premium membership with exclusive benefits",
        tokenRequirement: 20000,
        stakingBonus: 10,
        referralBonus: 15,
        spinMultiplier: 3
      });
      
      await storage.createPremiumTier({
        name: "Diamond",
        description: "Elite membership with maximum benefits",
        tokenRequirement: 100000,
        stakingBonus: 20,
        referralBonus: 25,
        spinMultiplier: 5
      });
      
      console.log("Default premium tiers created");
    }
    
    // Check if staking pools exist
    const pools = await storage.getStakingPools();
    if (pools.length === 0) {
      // Create default staking pools
      await storage.createStakingPool({
        name: "Flexible",
        description: "Low risk, low reward staking with no lock period",
        apr: 5,
        minStakeAmount: 100,
        lockPeriodDays: 0,
        totalStaked: 0,
        isActive: true
      });
      
      await storage.createStakingPool({
        name: "Basic",
        description: "Standard staking with moderate returns",
        apr: 10,
        minStakeAmount: 500,
        lockPeriodDays: 30,
        totalStaked: 0,
        isActive: true
      });
      
      await storage.createStakingPool({
        name: "Premium",
        description: "Higher returns with a longer lock period",
        apr: 15,
        minStakeAmount: 1000,
        lockPeriodDays: 90,
        totalStaked: 0,
        isActive: true
      });
      
      await storage.createStakingPool({
        name: "Diamond",
        description: "Maximum returns with extended lock period",
        apr: 25,
        minStakeAmount: 5000,
        lockPeriodDays: 180,
        totalStaked: 0,
        isActive: true
      });
      
      console.log("Default staking pools created");
    }
    
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  setupSession(app);
  
  // Add IP tracking middleware for rate limiting
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.clientIp = req.headers['x-forwarded-for'] as string || 
                    req.socket.remoteAddress || 
                    'unknown';
    next();
  });
  
  // Tracking user activity middleware
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    // Skip for static assets and certain paths
    if (req.path.startsWith('/static') || req.path === '/api/health' || req.path === '/favicon.ico') {
      return next();
    }
    
    // Update last activity timestamp if user is logged in
    if (req.session && req.session.userId) {
      try {
        await storage.updateUserLastActivity(req.session.userId);
      } catch (error) {
        console.error('Error updating user activity:', error);
        // Don't block the request if activity tracking fails
      }
    }
    next();
  });
  
  // Initialize database with default data
  await initializeDatabase();
  
  // Authentication routes
  app.post('/api/register', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await registerUser(userData);
      
      // Set user ID in session
      req.session.userId = user.id;
      
      // Return user without sensitive data
      const { passwordHash, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error registering user:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to register user' });
    }
  });
  
  app.post('/api/login', async (req: Request, res: Response) => {
    try {
      const { username, password, rememberMe = false } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
      
      const clientIp = req.clientIp || 'unknown';
      const user = await loginUser(username, password, rememberMe, clientIp);
      
      // Set user ID in session
      req.session.userId = user.id;
      req.session.isVerified = user.isVerified;
      
      // Set extended session if remember me is checked
      if (rememberMe) {
        extendSession(req, true);
      }
      
      // Return user without sensitive data
      const { passwordHash, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(401).json({ error: error instanceof Error ? error.message : 'Invalid username or password' });
    }
  });
  
  app.post('/api/logout', (req: Request, res: Response) => {
    // Destroy session
    if (req.session && typeof req.session.destroy === 'function') {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ error: 'Failed to log out' });
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.status(200).json({ message: 'Logged out successfully' });
      });
    } else {
      // Fallback if destroy method is not available
      req.session = {} as any;
      res.status(200).json({ message: 'Logged out successfully' });
    }
  });
  
  app.get('/api/user', async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      // Return user without sensitive data
      const { passwordHash, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ error: 'Failed to fetch current user' });
    }
  });
  
  // Email verification route
  app.get('/api/verify-email/:token', async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      if (!token) {
        return res.status(400).json({ error: 'Verification token is required' });
      }
      
      // Find user with this verification token
      const user = await storage.getUserByVerificationToken(token);
      if (!user) {
        return res.status(400).json({ error: 'Invalid verification token' });
      }
      
      // Mark user as verified
      await storage.verifyUser(user.id);
      
      // Update session if user is logged in
      if (req.session && req.session.userId === user.id) {
        req.session.isVerified = true;
      }
      
      res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(500).json({ error: 'Failed to verify email' });
    }
  });
  
  // Forgot password route
  app.post('/api/forgot-password', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      // Generate reset token
      const token = await generatePasswordResetToken(email);
      
      // Prevent user enumeration attacks by always returning success
      if (!token) {
        return res.status(200).json({ message: 'If an account with that email exists, we have sent a password reset link' });
      }
      
      // In development, we'll also return the token to make testing easier
      res.status(200).json({ 
        message: 'If an account with that email exists, we have sent a password reset link',
        token // Keep token in development, remove in production
      });
    } catch (error) {
      console.error('Error generating password reset token:', error);
      // Still return 200 to prevent user enumeration
      res.status(200).json({ message: 'If an account with that email exists, we have sent a password reset link' });
    }
  });
  
  // Reset password route
  app.post('/api/reset-password', async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ error: 'Token and password are required' });
      }
      
      // Validate password
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
      
      // Reset password
      const success = await resetPassword(token, password);
      if (!success) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  });
  
  // Request a new verification email
  app.post('/api/resend-verification', async (req: Request, res: Response) => {
    try {
      // User must be logged in
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      // Only for unverified users
      if (user.isVerified) {
        return res.status(400).json({ error: 'Email already verified' });
      }
      
      if (!user.email) {
        return res.status(400).json({ error: 'No email address associated with account' });
      }
      
      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      // Update user with new token
      await storage.updateVerificationToken(user.id, verificationToken);
      
      // Get updated user
      const updatedUser = await storage.getUser(user.id);
      if (!updatedUser) {
        return res.status(500).json({ error: 'Failed to update user' });
      }
      
      // Send verification email
      await sendVerificationEmail(updatedUser);
      
      res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
      console.error('Error sending verification email:', error);
      res.status(500).json({ error: 'Failed to send verification email' });
    }
  });
  
  // =====================================
  // MFA Routes
  // =====================================
  
  // Setup MFA
  app.post('/api/mfa/setup', requireAuth, async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const result = await setupMfa(req.session.userId, req);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error setting up MFA:', error);
      res.status(500).json({ error: 'Failed to set up MFA' });
    }
  });
  
  // Verify and enable MFA
  app.post('/api/mfa/enable', requireAuth, async (req: Request, res: Response) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: 'Verification code is required' });
      }
      
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const success = await enableMfa(req.session.userId, code, req);
      if (!success) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }
      
      res.status(200).json({ success: true, message: 'MFA enabled successfully' });
    } catch (error) {
      console.error('Error enabling MFA:', error);
      res.status(500).json({ error: 'Failed to enable MFA' });
    }
  });
  
  // Disable MFA
  app.post('/api/mfa/disable', requireAuth, async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }
      
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const success = await disableMfa(req.session.userId, req, password);
      if (!success) {
        return res.status(400).json({ error: 'Invalid password' });
      }
      
      res.status(200).json({ success: true, message: 'MFA disabled successfully' });
    } catch (error) {
      console.error('Error disabling MFA:', error);
      res.status(500).json({ error: 'Failed to disable MFA' });
    }
  });
  
  // Verify MFA code during login
  app.post('/api/mfa/verify', async (req: Request, res: Response) => {
    try {
      const { code, type, userId } = req.body;
      if (!code || !type || !userId) {
        return res.status(400).json({ error: 'Code, type, and userId are required' });
      }
      
      let success = false;
      if (type === 'totp') {
        success = await verifyMfaCode(userId, code, req);
      } else if (type === 'recovery') {
        success = await verifyMfaRecoveryCode(userId, code, req);
      } else {
        return res.status(400).json({ error: 'Invalid verification type' });
      }
      
      if (!success) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }
      
      // Get user and create session
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Set session data
      req.session.userId = user.id;
      req.session.isVerified = user.isVerified;
      
      // Return user without sensitive data
      const { passwordHash, ...userWithoutPassword } = user;
      res.status(200).json({
        success: true,
        message: 'MFA verification successful',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Error verifying MFA:', error);
      res.status(500).json({ error: 'Failed to verify MFA' });
    }
  });
  
  // =====================================
  // Device Management Routes
  // =====================================
  
  // Get user devices
  app.get('/api/devices', requireAuth, async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const devices = await getUserDevices(req.session.userId);
      res.status(200).json(devices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  });
  
  // Trust a device (skip MFA for this device)
  app.post('/api/devices/:deviceId/trust', requireAuth, async (req: Request, res: Response) => {
    try {
      const { deviceId } = req.params;
      if (!deviceId) {
        return res.status(400).json({ error: 'Device ID is required' });
      }
      
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const success = await trustDevice(req.session.userId, deviceId, req);
      if (!success) {
        return res.status(400).json({ error: 'Failed to trust device' });
      }
      
      res.status(200).json({ success: true, message: 'Device trusted successfully' });
    } catch (error) {
      console.error('Error trusting device:', error);
      res.status(500).json({ error: 'Failed to trust device' });
    }
  });
  
  // Untrust a device (require MFA again for this device)
  app.post('/api/devices/:deviceId/untrust', requireAuth, async (req: Request, res: Response) => {
    try {
      const { deviceId } = req.params;
      if (!deviceId) {
        return res.status(400).json({ error: 'Device ID is required' });
      }
      
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const success = await untrustDevice(req.session.userId, deviceId, req);
      if (!success) {
        return res.status(400).json({ error: 'Failed to untrust device' });
      }
      
      res.status(200).json({ success: true, message: 'Device untrusted successfully' });
    } catch (error) {
      console.error('Error untrusting device:', error);
      res.status(500).json({ error: 'Failed to untrust device' });
    }
  });
  
  // Remove a device
  app.delete('/api/devices/:deviceId', requireAuth, async (req: Request, res: Response) => {
    try {
      const { deviceId } = req.params;
      if (!deviceId) {
        return res.status(400).json({ error: 'Device ID is required' });
      }
      
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const success = await removeDevice(req.session.userId, deviceId, req);
      if (!success) {
        return res.status(400).json({ error: 'Failed to remove device' });
      }
      
      res.status(200).json({ success: true, message: 'Device removed successfully' });
    } catch (error) {
      console.error('Error removing device:', error);
      res.status(500).json({ error: 'Failed to remove device' });
    }
  });
  
  // =====================================
  // Session Management Routes
  // =====================================
  
  // Get active sessions
  app.get('/api/sessions', requireAuth, async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const sessions = await getUserSessions(req.session.userId);
      res.status(200).json(sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  });
  
  // Terminate a specific session
  app.delete('/api/sessions/:sessionToken', requireAuth, async (req: Request, res: Response) => {
    try {
      const { sessionToken } = req.params;
      if (!sessionToken) {
        return res.status(400).json({ error: 'Session token is required' });
      }
      
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const success = await terminateSession(req.session.userId, sessionToken, req);
      if (!success) {
        return res.status(400).json({ error: 'Failed to terminate session' });
      }
      
      res.status(200).json({ success: true, message: 'Session terminated successfully' });
    } catch (error) {
      console.error('Error terminating session:', error);
      res.status(500).json({ error: 'Failed to terminate session' });
    }
  });
  
  // Terminate all other sessions
  app.post('/api/sessions/terminate-others', requireAuth, async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      // Get current session token from cookie or header
      const currentSessionToken = req.headers['x-session-token'] as string || req.cookies?.session;
      if (!currentSessionToken) {
        return res.status(400).json({ error: 'Current session token not found' });
      }
      
      const success = await terminateOtherSessions(req.session.userId, currentSessionToken, req);
      if (!success) {
        return res.status(400).json({ error: 'Failed to terminate other sessions' });
      }
      
      res.status(200).json({ success: true, message: 'All other sessions terminated successfully' });
    } catch (error) {
      console.error('Error terminating other sessions:', error);
      res.status(500).json({ error: 'Failed to terminate other sessions' });
    }
  });
  // Badge routes
  
  // Get all badges
  app.get('/api/badges', async (req: Request, res: Response) => {
    try {
      const badges = await storage.getBadges();
      res.json(badges);
    } catch (error) {
      console.error('Error fetching badges:', error);
      res.status(500).json({ error: 'Failed to fetch badges' });
    }
  });
  
  // Get badge by ID
  app.get('/api/badges/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid badge ID' });
      }
      
      const badge = await storage.getBadge(id);
      if (!badge) {
        return res.status(404).json({ error: 'Badge not found' });
      }
      
      res.json(badge);
    } catch (error) {
      console.error('Error fetching badge:', error);
      res.status(500).json({ error: 'Failed to fetch badge' });
    }
  });
  
  // Create a new badge
  app.post('/api/badges', async (req: Request, res: Response) => {
    try {
      const badgeData = insertBadgeSchema.parse(req.body);
      const newBadge = await storage.createBadge(badgeData);
      res.status(201).json(newBadge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating badge:', error);
      res.status(500).json({ error: 'Failed to create badge' });
    }
  });
  
  // User Badge routes
  
  // Get all badges for a user
  app.get('/api/users/:userId/badges', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const userBadges = await storage.getUserBadgesWithDetails(userId);
      res.json(userBadges);
    } catch (error) {
      console.error('Error fetching user badges:', error);
      res.status(500).json({ error: 'Failed to fetch user badges' });
    }
  });
  
  // Award a badge to a user
  app.post('/api/users/:userId/badges', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const badgeData = insertUserBadgeSchema.parse({
        ...req.body,
        userId
      });
      
      const newUserBadge = await storage.createUserBadge(badgeData);
      res.status(201).json(newUserBadge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error awarding badge:', error);
      res.status(500).json({ error: 'Failed to award badge' });
    }
  });
  
  // Check for eligible badges for a user
  app.get('/api/users/:userId/eligible-badges', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const eligibleBadges = await storage.checkEligibleBadges(userId);
      res.json(eligibleBadges);
    } catch (error) {
      console.error('Error checking eligible badges:', error);
      res.status(500).json({ error: 'Failed to check eligible badges' });
    }
  });
  
  // Award all eligible badges to a user
  app.post('/api/users/:userId/award-eligible-badges', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      // Get eligible badges
      const eligibleBadges = await storage.checkEligibleBadges(userId);
      
      // Award each eligible badge
      const awardedBadges = [];
      for (const badge of eligibleBadges) {
        const userBadge = await storage.createUserBadge({
          userId,
          badgeId: badge.id,
          displayed: true
        });
        awardedBadges.push({
          userBadge,
          badge
        });
      }
      
      res.status(201).json({
        awarded: awardedBadges.length,
        badges: awardedBadges
      });
    } catch (error) {
      console.error('Error awarding eligible badges:', error);
      res.status(500).json({ error: 'Failed to award eligible badges' });
    }
  });
  
  // Trivia Quiz Routes
  
  // Get all trivia quizzes
  app.get('/api/trivia/quizzes', async (req: Request, res: Response) => {
    try {
      const activeOnly = req.query.active === 'true';
      const quizzes = await storage.getTriviaQuizzes(activeOnly);
      res.json(quizzes);
    } catch (error) {
      console.error('Error fetching trivia quizzes:', error);
      res.status(500).json({ error: 'Failed to fetch trivia quizzes' });
    }
  });
  
  // Get current active trivia quiz
  app.get('/api/trivia/current-quiz', async (req: Request, res: Response) => {
    try {
      const currentQuiz = await storage.getCurrentTriviaQuiz();
      if (!currentQuiz) {
        return res.status(404).json({ error: 'No active trivia quiz found' });
      }
      res.json(currentQuiz);
    } catch (error) {
      console.error('Error fetching current trivia quiz:', error);
      res.status(500).json({ error: 'Failed to fetch current trivia quiz' });
    }
  });
  
  // Get trivia quiz by ID
  app.get('/api/trivia/quizzes/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid quiz ID' });
      }
      
      const quiz = await storage.getTriviaQuiz(id);
      if (!quiz) {
        return res.status(404).json({ error: 'Trivia quiz not found' });
      }
      
      res.json(quiz);
    } catch (error) {
      console.error('Error fetching trivia quiz:', error);
      res.status(500).json({ error: 'Failed to fetch trivia quiz' });
    }
  });
  
  // Create a new trivia quiz
  app.post('/api/trivia/quizzes', async (req: Request, res: Response) => {
    try {
      const quizData = insertTriviaQuizSchema.parse(req.body);
      const newQuiz = await storage.createTriviaQuiz(quizData);
      res.status(201).json(newQuiz);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating trivia quiz:', error);
      res.status(500).json({ error: 'Failed to create trivia quiz' });
    }
  });
  
  // Get questions for a quiz
  app.get('/api/trivia/quizzes/:quizId/questions', async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      if (isNaN(quizId)) {
        return res.status(400).json({ error: 'Invalid quiz ID' });
      }
      
      const questions = await storage.getTriviaQuestions(quizId);
      res.json(questions);
    } catch (error) {
      console.error('Error fetching trivia questions:', error);
      res.status(500).json({ error: 'Failed to fetch trivia questions' });
    }
  });
  
  // Create a new question for a quiz
  app.post('/api/trivia/quizzes/:quizId/questions', async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      if (isNaN(quizId)) {
        return res.status(400).json({ error: 'Invalid quiz ID' });
      }
      
      // Check if quiz exists
      const quiz = await storage.getTriviaQuiz(quizId);
      if (!quiz) {
        return res.status(404).json({ error: 'Trivia quiz not found' });
      }
      
      const questionData = insertTriviaQuestionSchema.parse({
        ...req.body,
        quizId
      });
      
      const newQuestion = await storage.createTriviaQuestion(questionData);
      res.status(201).json(newQuestion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating trivia question:', error);
      res.status(500).json({ error: 'Failed to create trivia question' });
    }
  });
  
  // Get a user's submission for a quiz
  app.get('/api/trivia/quizzes/:quizId/submissions/:userId', async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const userId = parseInt(req.params.userId);
      
      if (isNaN(quizId) || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid quiz ID or user ID' });
      }
      
      const submission = await storage.getUserTriviaSubmission(userId, quizId);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      res.json(submission);
    } catch (error) {
      console.error('Error fetching trivia submission:', error);
      res.status(500).json({ error: 'Failed to fetch trivia submission' });
    }
  });
  
  // Submit answers for a quiz
  app.post('/api/trivia/quizzes/:quizId/submit', async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const userId = parseInt(req.body.userId);
      
      if (isNaN(quizId) || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid quiz ID or user ID' });
      }
      
      // Check if user has already submitted this quiz
      const existingSubmission = await storage.getUserTriviaSubmission(userId, quizId);
      if (existingSubmission) {
        return res.status(400).json({ error: 'User has already submitted this quiz' });
      }
      
      // Get quiz and its questions
      const quiz = await storage.getTriviaQuiz(quizId);
      if (!quiz) {
        return res.status(404).json({ error: 'Trivia quiz not found' });
      }
      
      const questions = await storage.getTriviaQuestions(quizId);
      if (questions.length === 0) {
        return res.status(400).json({ error: 'Quiz has no questions' });
      }
      
      // Check if quiz is active
      const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
      if (!quiz.isActive || quiz.startDate > today || quiz.endDate < today) {
        return res.status(400).json({ error: 'Quiz is not currently active' });
      }
      
      // Create a new submission
      const submission = await storage.createTriviaSubmission({
        userId,
        quizId,
        score: 0,
        completed: false,
        rewardClaimed: false
      });
      
      const answers = req.body.answers;
      if (!Array.isArray(answers) || answers.length !== questions.length) {
        return res.status(400).json({ error: 'Invalid answer submission format' });
      }
      
      // Process each answer
      for (let i = 0; i < answers.length; i++) {
        const question = questions[i];
        const selectedAnswer = answers[i];
        
        if (typeof selectedAnswer !== 'number' || selectedAnswer < 0 || selectedAnswer >= question.options.length) {
          return res.status(400).json({ error: `Invalid answer selection for question ${i + 1}` });
        }
        
        // Record the answer
        await storage.createTriviaAnswer({
          submissionId: submission.id,
          questionId: question.id,
          selectedAnswer,
          isCorrect: selectedAnswer === question.correctAnswer
        });
      }
      
      // Calculate the score
      const score = await storage.calculateTriviaScore(submission.id);
      
      // Update the submission
      const updatedSubmission = await storage.getTriviaSubmission(submission.id);
      
      res.status(201).json({
        submission: updatedSubmission,
        score,
        totalQuestions: questions.length
      });
    } catch (error) {
      console.error('Error submitting trivia answers:', error);
      res.status(500).json({ error: 'Failed to submit trivia answers' });
    }
  });
  
  // Claim reward for a completed quiz
  app.post('/api/trivia/submissions/:submissionId/claim-reward', async (req: Request, res: Response) => {
    try {
      const submissionId = parseInt(req.params.submissionId);
      
      if (isNaN(submissionId)) {
        return res.status(400).json({ error: 'Invalid submission ID' });
      }
      
      const submission = await storage.getTriviaSubmission(submissionId);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      if (submission.rewardClaimed) {
        return res.status(400).json({ error: 'Reward already claimed' });
      }
      
      if (!submission.completed) {
        return res.status(400).json({ error: 'Quiz is not completed' });
      }
      
      const claimed = await storage.claimTriviaReward(submissionId);
      
      if (claimed) {
        const quiz = await storage.getTriviaQuiz(submission.quizId);
        res.json({
          success: true,
          message: 'Reward claimed successfully',
          rewardAmount: quiz?.rewardAmount
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Failed to claim reward'
        });
      }
    } catch (error) {
      console.error('Error claiming trivia reward:', error);
      res.status(500).json({ error: 'Failed to claim trivia reward' });
    }
  });
  
  // Get a random trivia question for popups
  app.get('/api/trivia/random-question', async (req: Request, res: Response) => {
    try {
      // Get a random active quiz
      let activeQuizzes = await storage.getTriviaQuizzes(true);
      
      // If no active quizzes exist, create a default one for testing
      if (activeQuizzes.length === 0) {
        console.log('No active quiz found, creating a default one for testing');
        
        // Create a default quiz for testing
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 7); // Set end date to 7 days in the future
        
        const defaultQuiz = {
          title: 'CHONK9K Trivia Challenge',
          description: 'Test your knowledge about cryptocurrency and earn CHONK9K tokens!',
          startDate: today.toISOString().split('T')[0],
          endDate: futureDate.toISOString().split('T')[0],
          isActive: true,
          rewardAmount: 100,
          maxAttempts: 1,
          difficulty: 'medium' // Add the required difficulty field
        };
        
        try {
          const newQuiz = await storage.createTriviaQuiz(defaultQuiz);
          
          // Create some default questions
          const defaultQuestions = [
            {
              quizId: newQuiz.id,
              question: 'What is the ticker symbol for CHONK 9000?',
              options: ['$CHONK', '$CHONK9K', '$CHONKER', '$C9000'],
              correctAnswer: 1, // $CHONK9K
              explanation: 'CHONK 9000 uses the ticker symbol $CHONK9K on all exchanges.',
              difficulty: 'easy',
              points: 10,
              category: 'basics'
            },
            {
              quizId: newQuiz.id,
              question: 'Which blockchain is CHONK9K primarily built on?',
              options: ['Ethereum', 'Bitcoin', 'Solana', 'Cardano'],
              correctAnswer: 2, // Solana
              explanation: 'CHONK9K is primarily built on the Solana blockchain for its speed and low transaction costs.',
              difficulty: 'medium',
              points: 15,
              category: 'technology'
            },
            {
              quizId: newQuiz.id,
              question: 'What feature allows CHONK9K holders to earn passive income?',
              options: ['Mining', 'Staking', 'Trading', 'Lending'],
              correctAnswer: 1, // Staking
              explanation: 'CHONK9K allows holders to stake their tokens to earn passive income through rewards.',
              difficulty: 'medium',
              points: 15,
              category: 'features'
            },
            {
              quizId: newQuiz.id,
              question: 'Who is the founder of CHONK9K?',
              options: ['Vitalik Buterin', 'David Okeamah', 'Elon Musk', 'Satoshi Nakamoto'],
              correctAnswer: 1, // David Okeamah
              explanation: 'CHONK9K was founded by David Okeamah (@Agunnnaya001).',
              difficulty: 'easy',
              points: 10,
              category: 'team'
            },
            {
              quizId: newQuiz.id,
              question: 'What is the official website for CHONK9K?',
              options: ['chonk9k.com', 'boomchainlabgravatar.link', 'chonkcoin.org', 'token9000.io'],
              correctAnswer: 1, // boomchainlabgravatar.link
              explanation: 'The official website for CHONK9K is boomchainlabgravatar.link',
              difficulty: 'easy',
              points: 10,
              category: 'basics'
            }
          ];
          
          for (const question of defaultQuestions) {
            await storage.createTriviaQuestion(question);
          }
          
          // Refresh the active quizzes
          activeQuizzes = await storage.getTriviaQuizzes(true);
        } catch (error) {
          console.error('Error creating default quiz and questions:', error);
          return res.status(500).json({ error: 'Failed to create default quiz' });
        }
      }
      
      // Select a random quiz from the active ones
      const randomQuiz = activeQuizzes[Math.floor(Math.random() * activeQuizzes.length)];
      
      // Get questions for this quiz
      const questions = await storage.getTriviaQuestions(randomQuiz.id);
      
      if (questions.length === 0) {
        return res.status(404).json({ error: 'No questions available for active quiz' });
      }
      
      // Select a random question
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      
      // Format the question for the popup
      const popupQuestion = {
        id: randomQuestion.id,
        question: randomQuestion.question,
        options: randomQuestion.options,
        correctOption: randomQuestion.correctAnswer,
        explanation: randomQuestion.explanation,
        difficulty: randomQuiz.difficulty,
        rewardAmount: randomQuestion.points * 10 // 10 tokens per point
      };
      
      res.json(popupQuestion);
    } catch (error) {
      console.error('Error fetching random trivia question:', error);
      res.status(500).json({ error: 'Failed to fetch random trivia question' });
    }
  });
  
  // Submit an answer for a popup trivia question
  app.post('/api/trivia/submit-answer', async (req: Request, res: Response) => {
    try {
      const { questionId, selectedOption, isCorrect } = req.body;
      
      // Get the question to find its quiz
      const question = await storage.getTriviaQuestion(questionId);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }
      
      // For popup trivia, we'll create a simple submission
      // This is simplified compared to full quiz submissions
      const userId = req.user?.id || 1; // Use authenticated user or default to 1 for demo
      
      // Create or get a submission for this user and quiz
      let submission = await storage.getUserTriviaSubmission(userId, question.quizId);
      
      if (!submission) {
        submission = await storage.createTriviaSubmission({
          userId: userId,
          quizId: question.quizId,
          score: isCorrect ? question.points : 0,
          completed: false
        });
      } else {
        // Update the existing submission score
        await storage.updateTriviaSubmission(submission.id, {
          score: submission.score + (isCorrect ? question.points : 0)
        });
      }
      
      // Record the answer
      await storage.createTriviaAnswer({
        submissionId: submission.id,
        questionId: questionId,
        selectedAnswer: selectedOption,
        isCorrect
      });
      
      // Calculate reward
      const rewardAmount = isCorrect ? question.points * 10 : 0; // 10 tokens per point
      
      res.status(201).json({
        success: true,
        submissionId: submission.id,
        rewardAmount,
        isCorrect
      });
    } catch (error) {
      console.error('Error submitting trivia answer:', error);
      res.status(500).json({ error: 'Failed to submit trivia answer' });
    }
  });

  // Marketplace Listing Routes
  
  // Get all marketplace listings
  app.get('/api/marketplace/listings', async (req: Request, res: Response) => {
    try {
      const activeOnly = req.query.active === 'true';
      const listings = await storage.getMarketplaceListings(activeOnly);
      res.json(listings);
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
      res.status(500).json({ error: 'Failed to fetch marketplace listings' });
    }
  });

  // Get marketplace listing by ID
  app.get('/api/marketplace/listings/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid listing ID' });
      }
      
      const listing = await storage.getMarketplaceListing(id);
      if (!listing) {
        return res.status(404).json({ error: 'Marketplace listing not found' });
      }
      
      res.json(listing);
    } catch (error) {
      console.error('Error fetching marketplace listing:', error);
      res.status(500).json({ error: 'Failed to fetch marketplace listing' });
    }
  });

  // Create a new marketplace listing
  app.post('/api/marketplace/listings', async (req: Request, res: Response) => {
    try {
      const listingData = insertMarketplaceListingSchema.parse(req.body);
      const newListing = await storage.createMarketplaceListing(listingData);
      res.status(201).json(newListing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating marketplace listing:', error);
      res.status(500).json({ error: 'Failed to create marketplace listing' });
    }
  });

  // CoinMarketCap API Routes
  
  // Get latest crypto listings
  app.get('/api/crypto/listings', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const convert = (req.query.convert as string) || 'USD';
      
      const listings = await coinMarketCapService.getLatestListings(limit, convert);
      res.json(listings);
    } catch (error) {
      console.error('Error fetching crypto listings:', error);
      res.status(500).json({ error: 'Failed to fetch crypto listings' });
    }
  });

  // Search for specific cryptocurrency
  app.get('/api/crypto/search/:symbol', async (req: Request, res: Response) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const convert = (req.query.convert as string) || 'USD';
      
      // Special case for CHONK9K - return mock data to demonstrate the mood indicator
      if (symbol === 'CHONK9K') {
        // Create current timestamp
        const timestamp = new Date().toISOString();
        
        // Generate a semi-random price movement based on the current minute
        // to demonstrate different moods over time
        const currentMinute = new Date().getMinutes();
        const randomFactor = Math.sin(currentMinute / 10) * 20; // Will vary between ~-20% and ~+20%
        
        // Create a structured response similar to CoinMarketCap API
        const chonkData = {
          status: {
            timestamp,
            error_code: 0,
            error_message: null,
            elapsed: 10,
            credit_count: 1
          },
          data: {
            CHONK9K: {
              id: 9000,
              name: "CHONK 9000",
              symbol: "CHONK9K",
              slug: "chonk-9000",
              cmc_rank: 420,
              num_market_pairs: 25,
              circulating_supply: 1000000000,
              total_supply: 1000000000,
              max_supply: 1000000000,
              last_updated: timestamp,
              date_added: "2025-01-01T00:00:00.000Z",
              tags: ["meme", "cyberpunk", "cat"],
              platform: null,
              self_reported_circulating_supply: null,
              self_reported_market_cap: null,
              quote: {
                USD: {
                  price: 0.0042 * (1 + (randomFactor / 100)),
                  volume_24h: 1250000,
                  volume_change_24h: 3.75,
                  percent_change_1h: randomFactor / 2,
                  percent_change_24h: randomFactor,
                  percent_change_7d: randomFactor * 1.5,
                  percent_change_30d: randomFactor * 0.8,
                  market_cap: 4200000,
                  market_cap_dominance: 0.001,
                  fully_diluted_market_cap: 4200000,
                  last_updated: timestamp
                }
              }
            }
          }
        };
        
        return res.json(chonkData);
      }
      
      // For other tokens, use the CoinMarketCap API
      const result = await coinMarketCapService.searchCryptocurrency(symbol, convert);
      res.json(result);
    } catch (error) {
      console.error('Error searching for cryptocurrency:', error);
      res.status(500).json({ error: 'Failed to search for cryptocurrency' });
    }
  });

  // Get exchanges
  app.get('/api/crypto/exchanges', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      
      const exchanges = await coinMarketCapService.getExchanges(limit);
      res.json(exchanges);
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      res.status(500).json({ error: 'Failed to fetch exchanges' });
    }
  });

  // Get market pairs for a specific cryptocurrency
  app.get('/api/crypto/market-pairs/:symbol', async (req: Request, res: Response) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      const limit = parseInt(req.query.limit as string) || 100;
      
      const marketPairs = await coinMarketCapService.getMarketPairs(symbol, limit);
      res.json(marketPairs);
    } catch (error) {
      console.error('Error fetching market pairs:', error);
      res.status(500).json({ error: 'Failed to fetch market pairs' });
    }
  });

  // QuickNode Blockchain Streaming API endpoint
  app.post('/api/blockchain/streams/webhook', async (req: Request, res: Response) => {
    try {
      // Log the received blockchain stream data
      console.log('Received blockchain stream data:', req.body);
      
      // Store or process the data as needed
      // This endpoint receives real-time blockchain data from QuickNode streams
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error handling blockchain stream webhook:', error);
      res.status(500).json({ error: 'Failed to process blockchain stream data' });
    }
  });

  // Solana Connection Test Endpoint - tests QuickNode integration
  app.get('/api/solana/connection-test', async (req: Request, res: Response) => {
    try {
      // Import the Solana web3.js library
      const { Connection } = await import('@solana/web3.js');
      
      // QuickNode RPC endpoint from constants
      const QUICKNODE_RPC = "https://necessary-warmhearted-water.solana-mainnet.quiknode.pro/bda0096f492c87a8be28bacba0f44ccb313e4f12/";
      const BACKUP_RPC = "https://api.mainnet-beta.solana.com";
      
      // Create connections to both endpoints
      const quickNodeConnection = new Connection(QUICKNODE_RPC, 'confirmed');
      const backupConnection = new Connection(BACKUP_RPC, 'confirmed');
      
      // Get data from both connections to compare performance
      console.time('quicknode-slot');
      const quickNodeSlot = await quickNodeConnection.getSlot();
      console.timeEnd('quicknode-slot');
      
      console.time('backup-slot');
      const backupSlot = await backupConnection.getSlot();
      console.timeEnd('backup-slot');
      
      console.time('quicknode-block');
      const quickNodeBlockHeight = await quickNodeConnection.getBlockHeight();
      console.timeEnd('quicknode-block');
      
      console.time('backup-block');
      const backupBlockHeight = await backupConnection.getBlockHeight();
      console.timeEnd('backup-block');
      
      res.json({
        success: true,
        quickNode: {
          connected: true,
          slot: quickNodeSlot,
          blockHeight: quickNodeBlockHeight
        },
        backup: {
          connected: true,
          slot: backupSlot,
          blockHeight: backupBlockHeight
        },
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Solana connection test error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Staking Pool Routes

  // Get all staking pools
  app.get('/api/staking/pools', async (req: Request, res: Response) => {
    try {
      const activeOnly = req.query.active === 'true';
      const pools = await storage.getStakingPools(activeOnly);
      res.json(pools);
    } catch (error) {
      console.error('Error fetching staking pools:', error);
      res.status(500).json({ error: 'Failed to fetch staking pools' });
    }
  });

  // Get staking pool by ID
  app.get('/api/staking/pools/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid pool ID' });
      }
      
      const pool = await storage.getStakingPool(id);
      if (!pool) {
        return res.status(404).json({ error: 'Staking pool not found' });
      }
      
      res.json(pool);
    } catch (error) {
      console.error('Error fetching staking pool:', error);
      res.status(500).json({ error: 'Failed to fetch staking pool' });
    }
  });

  // Create a new staking pool
  app.post('/api/staking/pools', async (req: Request, res: Response) => {
    try {
      const poolData = insertStakingPoolSchema.parse(req.body);
      const newPool = await storage.createStakingPool(poolData);
      res.status(201).json(newPool);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating staking pool:', error);
      res.status(500).json({ error: 'Failed to create staking pool' });
    }
  });

  // Get user stakes
  app.get('/api/staking/user-stakes', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const stakes = await storage.getUserStakes(userId);
      res.json(stakes);
    } catch (error) {
      console.error('Error fetching user stakes:', error);
      res.status(500).json({ error: 'Failed to fetch user stakes' });
    }
  });

  // Stake tokens
  app.post('/api/staking/stake', async (req: Request, res: Response) => {
    try {
      const { userId, poolId, amount } = req.body;
      
      if (!userId || !poolId || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid stake data' });
      }

      // Check if pool exists and is active
      const pool = await storage.getStakingPool(poolId);
      if (!pool) {
        return res.status(404).json({ error: 'Staking pool not found' });
      }
      
      if (!pool.isActive) {
        return res.status(400).json({ error: 'This staking pool is not currently active' });
      }
      
      // Check minimum stake amount
      if (amount < pool.minStakeAmount) {
        return res.status(400).json({ 
          error: `Minimum stake amount is ${pool.minStakeAmount} CHONK9K` 
        });
      }
      
      // Check if user has enough tokens
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (user.tokenBalance < amount) {
        return res.status(400).json({ error: 'Insufficient token balance' });
      }
      
      // Calculate end date based on lock period
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + pool.lockPeriodDays);
      
      // Create the stake
      const stakeData = {
        userId,
        poolId,
        amount,
        startDate,
        endDate,
        isActive: true,
        claimedRewards: 0,
        lastClaimDate: null,
        transactionHash: null
      };
      
      const newStake = await storage.createUserStake(stakeData);
      
      // Update user token balance
      await storage.updateUserTokenBalance(userId, user.tokenBalance - amount);
      
      // Update pool total staked amount
      await storage.updatePoolTotalStaked(poolId, pool.totalStaked + amount);
      
      res.status(201).json(newStake);
    } catch (error) {
      console.error('Error staking tokens:', error);
      res.status(500).json({ error: 'Failed to stake tokens' });
    }
  });

  // Claim staking rewards
  app.post('/api/staking/claim/:stakeId', async (req: Request, res: Response) => {
    try {
      const stakeId = parseInt(req.params.stakeId);
      if (isNaN(stakeId)) {
        return res.status(400).json({ error: 'Invalid stake ID' });
      }
      
      // Check if stake exists
      const stake = await storage.getUserStake(stakeId);
      if (!stake) {
        return res.status(404).json({ error: 'Stake not found' });
      }
      
      if (!stake.isActive) {
        return res.status(400).json({ error: 'This stake is no longer active' });
      }
      
      // Get the staking pool
      const pool = await storage.getStakingPool(stake.poolId);
      if (!pool) {
        return res.status(404).json({ error: 'Staking pool not found' });
      }
      
      // Calculate rewards
      const now = new Date();
      const startDate = new Date(stake.startDate);
      // Handle null lastClaimDate case safely
      const lastClaimDate = stake.lastClaimDate ? new Date(stake.lastClaimDate) : startDate;
      
      // Calculate days since last claim
      const daysSinceLastClaim = Math.floor((now.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastClaim < 1) {
        return res.status(400).json({ error: 'Rewards can only be claimed once per day' });
      }
      
      // Calculate rewards: amount * apr * days / 365
      const rewards = stake.amount * (pool.apr / 100) * daysSinceLastClaim / 365;
      
      // Get user's premium tier
      const user = await storage.getUser(stake.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Apply premium tier bonus if applicable
      let finalRewards = rewards;
      if (user.premiumTier > 0) {
        const premiumTier = await storage.getPremiumTier(user.premiumTier);
        if (premiumTier) {
          finalRewards = rewards * (1 + premiumTier.stakingBonus / 100);
        }
      }
      
      // Update user token balance
      await storage.updateUserTokenBalance(user.id, user.tokenBalance + finalRewards);
      
      // Update stake with new claim date and claimed rewards
      await storage.updateUserStakeAfterClaim(stakeId, finalRewards);
      
      res.json({ success: true, claimedAmount: finalRewards });
    } catch (error) {
      console.error('Error claiming rewards:', error);
      res.status(500).json({ error: 'Failed to claim rewards' });
    }
  });

  // Unstake tokens
  app.post('/api/staking/unstake/:stakeId', async (req: Request, res: Response) => {
    try {
      const stakeId = parseInt(req.params.stakeId);
      if (isNaN(stakeId)) {
        return res.status(400).json({ error: 'Invalid stake ID' });
      }
      
      // Check if stake exists
      const stake = await storage.getUserStake(stakeId);
      if (!stake) {
        return res.status(404).json({ error: 'Stake not found' });
      }
      
      if (!stake.isActive) {
        return res.status(400).json({ error: 'This stake is no longer active' });
      }
      
      // Ensure lock period has ended
      const now = new Date();
      const endDate = new Date(stake.endDate);
      
      if (now < endDate) {
        return res.status(400).json({ 
          error: 'Cannot unstake before lock period ends. Ends on ' + endDate.toLocaleDateString() 
        });
      }
      
      // Get user
      const user = await storage.getUser(stake.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Update user token balance
      await storage.updateUserTokenBalance(user.id, user.tokenBalance + stake.amount);
      
      // Update pool total staked amount
      const pool = await storage.getStakingPool(stake.poolId);
      if (pool && pool.totalStaked !== null) {
        await storage.updatePoolTotalStaked(pool.id, pool.totalStaked - stake.amount);
      }
      
      // Deactivate the stake
      await storage.deactivateUserStake(stakeId);
      
      res.json({ success: true, unstakedAmount: stake.amount });
    } catch (error) {
      console.error('Error unstaking tokens:', error);
      res.status(500).json({ error: 'Failed to unstake tokens' });
    }
  });

  // Referral Program Routes

  // Token Faucet Routes
  app.post('/api/faucet/claim', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if the user has already claimed tokens in the last 24 hours
      const lastClaim = await storage.getLastTokenClaim(userId);
      
      if (lastClaim) {
        const lastClaimTime = new Date(lastClaim.claimedAt).getTime();
        const currentTime = Date.now();
        const timeDiff = currentTime - lastClaimTime;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          const timeRemaining = 24 - hoursDiff;
          return res.status(429).json({ 
            error: 'You can claim tokens only once every 24 hours.',
            timeRemaining: Math.ceil(timeRemaining)
          });
        }
      }
      
      // The amount of tokens to be claimed
      const claimAmount = 1000;
      
      // Update the user's token balance
      const currentBalance = user.tokenBalance || 0;
      const newBalance = currentBalance + claimAmount;
      
      // Record the token claim in the database
      await storage.recordTokenClaim(userId, claimAmount);
      
      // Update the user's token balance
      await storage.updateUserTokenBalance(userId, newBalance);
      
      // Return the updated balance and claim information
      return res.json({
        success: true,
        amount: claimAmount,
        message: 'Successfully claimed CHONK9K tokens!',
        newBalance: newBalance
      });
    } catch (error) {
      console.error('Error claiming tokens:', error);
      return res.status(500).json({ error: 'Failed to claim tokens. Please try again later.' });
    }
  });

  app.get('/api/faucet/status', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // Check if the user has claimed tokens in the last 24 hours
      const lastClaim = await storage.getLastTokenClaim(userId);
      
      if (lastClaim) {
        const lastClaimTime = new Date(lastClaim.claimedAt).getTime();
        const currentTime = Date.now();
        const timeDiff = currentTime - lastClaimTime;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          const timeRemaining = 24 - hoursDiff;
          return res.json({ 
            canClaim: false,
            timeRemaining: Math.ceil(timeRemaining),
            nextClaimTime: new Date(lastClaimTime + (24 * 60 * 60 * 1000)).toISOString()
          });
        }
      }
      
      return res.json({
        canClaim: true,
        claimAmount: 1000
      });
    } catch (error) {
      console.error('Error checking claim status:', error);
      return res.status(500).json({ error: 'Failed to check claim status. Please try again later.' });
    }
  });

  // Get user referral stats
  app.get('/api/referrals/stats', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (!user.referralCode) {
        return res.json(null); // User has no referral code yet
      }
      
      // Get referred users
      const referredUsers = await storage.getReferredUsers(userId);
      
      // Get referral rewards
      const referralRewards = await storage.getUserReferralRewards(userId);
      
      // Calculate total and pending rewards
      const totalRewards = referralRewards.reduce((sum, reward) => sum + reward.amount, 0);
      const pendingRewards = referralRewards
        .filter(reward => reward.status === 'pending')
        .reduce((sum, reward) => sum + reward.amount, 0);
      
      // Get user's premium tier
      let rewardsPercentage = 3; // Default
      let nextTier = null;
      
      if (user.premiumTier > 0) {
        const premiumTier = await storage.getPremiumTier(user.premiumTier);
        if (premiumTier) {
          rewardsPercentage = premiumTier.referralBonus;
        }
      }
      
      // Get next tier if available
      const allTiers = await storage.getPremiumTiers();
      const sortedTiers = allTiers.sort((a, b) => a.tokenRequirement - b.tokenRequirement);
      
      const nextPossibleTier = sortedTiers.find(tier => 
        tier.tokenRequirement > user.tokenBalance && 
        (user.premiumTier === 0 || tier.id > user.premiumTier)
      );
      
      if (nextPossibleTier) {
        nextTier = {
          name: nextPossibleTier.name,
          rewardsPercentage: nextPossibleTier.referralBonus,
          remainingReferrals: Math.ceil((nextPossibleTier.tokenRequirement - user.tokenBalance) / 100)
        };
      }
      
      // Build response
      const referralStats = {
        totalReferrals: referredUsers.length,
        totalRewards,
        pendingRewards,
        referralCode: user.referralCode,
        referralLink: `${process.env.WEBSITE_URL || 'https://boomchainlabgravatar.link'}?ref=${user.referralCode}`,
        rewardsPercentage,
        nextTier
      };
      
      res.json(referralStats);
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      res.status(500).json({ error: 'Failed to fetch referral stats' });
    }
  });

  // Get user referral rewards
  app.get('/api/referrals/rewards', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const rewards = await storage.getUserReferralRewards(userId);
      
      // Fetch referred users' details to include in response
      const rewardsWithUsers = await Promise.all(rewards.map(async (reward) => {
        const referredUser = await storage.getUser(reward.referredId);
        return {
          ...reward,
          referred: referredUser ? {
            id: referredUser.id,
            username: referredUser.username,
            tokenBalance: referredUser.tokenBalance,
            walletAddress: referredUser.walletAddress,
            createdAt: referredUser.createdAt
          } : undefined
        };
      }));
      
      res.json(rewardsWithUsers);
    } catch (error) {
      console.error('Error fetching referral rewards:', error);
      res.status(500).json({ error: 'Failed to fetch referral rewards' });
    }
  });

  // Generate referral code
  app.post('/api/referrals/generate-code', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.body.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (user.referralCode) {
        return res.status(400).json({ error: 'User already has a referral code' });
      }
      
      // Generate a unique referral code
      const codePrefix = user.username.substring(0, Math.min(user.username.length, 5)).toUpperCase();
      const randomChars = crypto.randomBytes(4).toString('hex').toUpperCase();
      const referralCode = `${codePrefix}-${randomChars}`;
      
      // Update user with new referral code
      await storage.updateUserReferralCode(userId, referralCode);
      
      res.json({ success: true, referralCode });
    } catch (error) {
      console.error('Error generating referral code:', error);
      res.status(500).json({ error: 'Failed to generate referral code' });
    }
  });

  // Join with referral code
  app.post('/api/referrals/join', async (req: Request, res: Response) => {
    try {
      const { userId, referralCode } = req.body;
      
      if (!userId || !referralCode) {
        return res.status(400).json({ error: 'User ID and referral code are required' });
      }
      
      // Get the user who is joining
      const joiningUser = await storage.getUser(userId);
      if (!joiningUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if user already has a referrer
      if (joiningUser.referrerId) {
        return res.status(400).json({ error: 'User already has a referrer' });
      }
      
      // Find the referrer by code
      const referrer = await storage.getUserByReferralCode(referralCode);
      if (!referrer) {
        return res.status(404).json({ error: 'Invalid referral code' });
      }
      
      // Prevent self-referral
      if (referrer.id === joiningUser.id) {
        return res.status(400).json({ error: 'You cannot refer yourself' });
      }
      
      // Update joining user with referrer ID
      await storage.updateUserReferrer(joiningUser.id, referrer.id);
      
      // Add welcome bonus to joining user (e.g., 10 tokens for using a referral)
      const welcomeBonus = 10;
      await storage.updateUserTokenBalance(joiningUser.id, joiningUser.tokenBalance + welcomeBonus);
      
      // Calculate referrer bonus based on premium tier
      let referralBonus = welcomeBonus * (3 / 100); // Default 3%
      
      if (referrer.premiumTier > 0) {
        const premiumTier = await storage.getPremiumTier(referrer.premiumTier);
        if (premiumTier) {
          referralBonus = welcomeBonus * (premiumTier.referralBonus / 100);
        }
      }
      
      // Create referral reward record (initially pending)
      await storage.createReferralReward({
        referrerId: referrer.id,
        referredId: joiningUser.id,
        amount: referralBonus,
        status: 'pending'
      });
      
      res.json({ 
        success: true, 
        welcomeBonus,
        message: `Successfully joined with referral code. You received ${welcomeBonus} CHONK9K tokens as a welcome bonus!`
      });
    } catch (error) {
      console.error('Error joining with referral:', error);
      res.status(500).json({ error: 'Failed to join with referral' });
    }
  });

  // Claim referral rewards
  app.post('/api/referrals/claim-rewards', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.body.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      // Get all pending rewards
      const pendingRewards = await storage.getUserPendingReferralRewards(userId);
      
      if (pendingRewards.length === 0) {
        return res.status(400).json({ error: 'No pending rewards to claim' });
      }
      
      const totalAmount = pendingRewards.reduce((sum, reward) => sum + reward.amount, 0);
      
      // Get user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Update user token balance
      await storage.updateUserTokenBalance(user.id, user.tokenBalance + totalAmount);
      
      // Update all rewards to claimed status
      await storage.updateReferralRewardsStatus(pendingRewards.map(reward => reward.id), 'claimed');
      
      res.json({ 
        success: true, 
        claimedAmount: totalAmount,
        message: `Successfully claimed ${totalAmount} CHONK9K tokens from referral rewards!`
      });
    } catch (error) {
      console.error('Error claiming referral rewards:', error);
      res.status(500).json({ error: 'Failed to claim referral rewards' });
    }
  });

  // Mining Routes

  // Get all mining rigs
  app.get('/api/mining/rigs', async (req: Request, res: Response) => {
    try {
      const availableOnly = req.query.available === 'true';
      const rigs = await storage.getMiningRigs(availableOnly);
      res.json(rigs);
    } catch (error) {
      console.error('Error fetching mining rigs:', error);
      res.status(500).json({ error: 'Failed to fetch mining rigs' });
    }
  });

  // Get mining rig by ID
  app.get('/api/mining/rigs/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid rig ID' });
      }
      
      const rig = await storage.getMiningRig(id);
      if (!rig) {
        return res.status(404).json({ error: 'Mining rig not found' });
      }
      
      res.json(rig);
    } catch (error) {
      console.error('Error fetching mining rig:', error);
      res.status(500).json({ error: 'Failed to fetch mining rig' });
    }
  });

  // Create a new mining rig
  app.post('/api/mining/rigs', async (req: Request, res: Response) => {
    try {
      const rigData = insertMiningRigSchema.parse(req.body);
      const newRig = await storage.createMiningRig(rigData);
      res.status(201).json(newRig);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating mining rig:', error);
      res.status(500).json({ error: 'Failed to create mining rig' });
    }
  });

  // Get user's mining rigs
  app.get('/api/mining/user-rigs', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const userRigs = await storage.getUserMiningRigsWithDetails(userId);
      res.json(userRigs);
    } catch (error) {
      console.error('Error fetching user mining rigs:', error);
      res.status(500).json({ error: 'Failed to fetch user mining rigs' });
    }
  });

  // Purchase a mining rig
  app.post('/api/mining/purchase', async (req: Request, res: Response) => {
    try {
      const { userId, rigId } = req.body;
      
      if (!userId || !rigId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if rig exists and is available
      const rig = await storage.getMiningRig(rigId);
      if (!rig) {
        return res.status(404).json({ error: 'Mining rig not found' });
      }
      
      if (!rig.isAvailable) {
        return res.status(400).json({ error: 'This mining rig is not available for purchase' });
      }
      
      // Check if user has enough tokens
      if (user.tokenBalance < rig.price) {
        return res.status(400).json({ error: 'Insufficient token balance' });
      }
      
      // Create user mining rig
      const userRig = await storage.createUserMiningRig({
        userId,
        rigId,
        isActive: true,
        totalMined: 0,
        lastRewardDate: null,
        transactionHash: null
      });
      
      // Update user token balance
      await storage.updateUserTokenBalance(user.id, user.tokenBalance - rig.price);
      
      res.status(201).json(userRig);
    } catch (error) {
      console.error('Error purchasing mining rig:', error);
      res.status(500).json({ error: 'Failed to purchase mining rig' });
    }
  });

  // Claim mining rewards
  app.post('/api/mining/claim/:userRigId', async (req: Request, res: Response) => {
    try {
      const userRigId = parseInt(req.params.userRigId);
      if (isNaN(userRigId)) {
        return res.status(400).json({ error: 'Invalid user rig ID' });
      }
      
      // Check if user rig exists
      const userRig = await storage.getUserMiningRig(userRigId);
      if (!userRig) {
        return res.status(404).json({ error: 'User mining rig not found' });
      }
      
      if (!userRig.isActive) {
        return res.status(400).json({ error: 'This mining rig is not active' });
      }
      
      // Get the rig details
      const rig = await storage.getMiningRig(userRig.rigId);
      if (!rig) {
        return res.status(404).json({ error: 'Mining rig not found' });
      }
      
      // Get user
      const user = await storage.getUser(userRig.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Calculate rewards based on hash rate and time since last claim
      const now = new Date();
      const lastClaimDate = userRig.lastRewardDate || userRig.purchaseDate || now;
      
      // Calculate hours since last claim (max 24 hours)
      const hoursSinceLastClaim = Math.min(
        24,
        Math.max(1, Math.floor((now.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60)))
      );
      
      if (hoursSinceLastClaim < 1) {
        return res.status(400).json({ error: 'You can only claim rewards once per hour' });
      }
      
      // Base reward calculation: hashRate * hours * reward factor
      const rewardFactor = 0.00001; // Adjust this based on your token economics
      const rewards = rig.hashRate * hoursSinceLastClaim * rewardFactor;
      
      // Apply premium tier bonus if applicable
      let finalRewards = rewards;
      if (user.premiumTier > 0) {
        const premiumTier = await storage.getPremiumTier(user.premiumTier);
        if (premiumTier) {
          finalRewards = rewards * (1 + premiumTier.stakingBonus / 100);
        }
      }
      
      // Create mining reward record
      const miningReward = await storage.createMiningReward({
        userId: user.id,
        userRigId,
        amount: finalRewards,
        transactionHash: null
      });
      
      // Update user token balance
      await storage.updateUserTokenBalance(user.id, user.tokenBalance + finalRewards);
      
      // Update user rig's last reward date and total mined
      await storage.updateLastRewardDate(userRigId);
      const currentTotal = userRig.totalMined || 0;
      await storage.updateTotalMined(userRigId, currentTotal + finalRewards);
      
      res.json({
        success: true,
        reward: miningReward,
        newBalance: user.tokenBalance + finalRewards,
        totalMined: currentTotal + finalRewards
      });
    } catch (error) {
      console.error('Error claiming mining rewards:', error);
      res.status(500).json({ error: 'Failed to claim mining rewards' });
    }
  });

  // Get mining rewards for a user
  app.get('/api/mining/rewards', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const userRigId = req.query.userRigId ? parseInt(req.query.userRigId as string) : undefined;
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      if (userRigId !== undefined && isNaN(userRigId)) {
        return res.status(400).json({ error: 'Invalid user rig ID' });
      }
      
      const rewards = await storage.getMiningRewards(userId, userRigId);
      res.json(rewards);
    } catch (error) {
      console.error('Error fetching mining rewards:', error);
      res.status(500).json({ error: 'Failed to fetch mining rewards' });
    }
  });

  // Update mining rig status (activate/deactivate)
  app.post('/api/mining/rigs/:userRigId/status', async (req: Request, res: Response) => {
    try {
      const userRigId = parseInt(req.params.userRigId);
      const { isActive } = req.body;
      
      if (isNaN(userRigId)) {
        return res.status(400).json({ error: 'Invalid user rig ID' });
      }
      
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ error: 'isActive must be a boolean value' });
      }
      
      // Check if user rig exists
      const userRig = await storage.getUserMiningRig(userRigId);
      if (!userRig) {
        return res.status(404).json({ error: 'User mining rig not found' });
      }
      
      // Update status
      await storage.updateUserMiningRigStatus(userRigId, isActive);
      
      res.json({
        success: true,
        message: isActive ? 'Mining rig activated' : 'Mining rig deactivated'
      });
    } catch (error) {
      console.error('Error updating mining rig status:', error);
      res.status(500).json({ error: 'Failed to update mining rig status' });
    }
  });

  // Premium Membership Routes

  // Get all premium tiers
  app.get('/api/premium/tiers', async (req: Request, res: Response) => {
    try {
      const tiers = await storage.getPremiumTiers();
      res.json(tiers);
    } catch (error) {
      console.error('Error fetching premium tiers:', error);
      res.status(500).json({ error: 'Failed to fetch premium tiers' });
    }
  });

  // Get user premium info
  app.get('/api/premium/user-info', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Get all tiers to determine next tier requirements
      const allTiers = await storage.getPremiumTiers();
      const sortedTiers = allTiers.sort((a, b) => a.tokenRequirement - b.tokenRequirement);
      
      // Find the next tier for the user
      let nextTierRequirement = null;
      let upgradeProgress = 100; // 100% if at highest tier
      
      if (user.premiumTier === 0) {
        // User has no tier yet, next is the first tier
        if (sortedTiers.length > 0) {
          nextTierRequirement = sortedTiers[0].tokenRequirement;
          upgradeProgress = (user.tokenBalance / nextTierRequirement) * 100;
        }
      } else {
        // Find the next tier if there is one
        const currentTierIndex = sortedTiers.findIndex(tier => tier.id === user.premiumTier);
        if (currentTierIndex >= 0 && currentTierIndex < sortedTiers.length - 1) {
          const nextTier = sortedTiers[currentTierIndex + 1];
          nextTierRequirement = nextTier.tokenRequirement;
          
          // Calculate progress between current tier and next tier
          const currentTier = sortedTiers[currentTierIndex];
          const progressRange = nextTierRequirement - currentTier.tokenRequirement;
          const userProgress = user.tokenBalance - currentTier.tokenRequirement;
          upgradeProgress = Math.min(100, Math.max(0, (userProgress / progressRange) * 100));
        }
      }
      
      const premiumInfo = {
        currentTier: user.premiumTier,
        tokenBalance: user.tokenBalance,
        nextTierRequirement,
        upgradeProgress
      };
      
      res.json(premiumInfo);
    } catch (error) {
      console.error('Error fetching user premium info:', error);
      res.status(500).json({ error: 'Failed to fetch user premium info' });
    }
  });

  // Create a new premium tier
  app.post('/api/premium/tiers', async (req: Request, res: Response) => {
    try {
      const tierData = insertPremiumTierSchema.parse(req.body);
      const newTier = await storage.createPremiumTier(tierData);
      res.status(201).json(newTier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating premium tier:', error);
      res.status(500).json({ error: 'Failed to create premium tier' });
    }
  });

  // Check and update user premium tier based on token balance
  app.post('/api/premium/check-eligibility', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.body.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Get all tiers
      const allTiers = await storage.getPremiumTiers();
      const sortedTiers = allTiers
        .sort((a, b) => b.tokenRequirement - a.tokenRequirement) // Sort descending by requirement
        .filter(tier => user.tokenBalance >= tier.tokenRequirement); // Filter tiers user is eligible for
      
      // Get the highest tier user is eligible for
      const highestEligibleTier = sortedTiers[0];
      
      if (!highestEligibleTier || highestEligibleTier.id === user.premiumTier) {
        // No change needed
        return res.json({
          success: true,
          updated: false,
          currentTier: user.premiumTier
        });
      }
      
      // Update user to new tier
      await storage.updateUserPremiumTier(userId, highestEligibleTier.id);
      
      res.json({
        success: true,
        updated: true,
        previousTier: user.premiumTier,
        currentTier: highestEligibleTier.id,
        tierName: highestEligibleTier.name
      });
    } catch (error) {
      console.error('Error checking premium eligibility:', error);
      res.status(500).json({ error: 'Failed to check premium eligibility' });
    }
  });

  // Spin Wheel Routes
  
  // Get all spin wheel rewards
  app.get('/api/spin-wheel/rewards', async (req: Request, res: Response) => {
    try {
      const activeOnly = req.query.active === 'true';
      const rewards = await storage.getSpinWheelRewards(activeOnly);
      res.json(rewards);
    } catch (error) {
      console.error('Error fetching spin wheel rewards:', error);
      res.status(500).json({ error: 'Failed to fetch spin wheel rewards' });
    }
  });
  
  // Get spin wheel reward by ID
  app.get('/api/spin-wheel/rewards/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid reward ID' });
      }
      
      const reward = await storage.getSpinWheelReward(id);
      if (!reward) {
        return res.status(404).json({ error: 'Spin wheel reward not found' });
      }
      
      res.json(reward);
    } catch (error) {
      console.error('Error fetching spin wheel reward:', error);
      res.status(500).json({ error: 'Failed to fetch spin wheel reward' });
    }
  });
  
  // Create a new spin wheel reward
  app.post('/api/spin-wheel/rewards', async (req: Request, res: Response) => {
    try {
      const rewardData = insertSpinWheelRewardSchema.parse(req.body);
      const newReward = await storage.createSpinWheelReward(rewardData);
      res.status(201).json(newReward);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating spin wheel reward:', error);
      res.status(500).json({ error: 'Failed to create spin wheel reward' });
    }
  });
  
  // Get user spins
  app.get('/api/users/:userId/spins', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const spins = await storage.getUserSpins(userId);
      res.json(spins);
    } catch (error) {
      console.error('Error fetching user spins:', error);
      res.status(500).json({ error: 'Failed to fetch user spins' });
    }
  });
  
  // Create a new user spin (record a spin result)
  app.post('/api/users/:userId/spins', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      // Check if the user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const spinData = insertUserSpinSchema.parse({
        ...req.body,
        userId
      });
      
      const newSpin = await storage.createUserSpin(spinData);
      res.status(201).json(newSpin);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error recording spin result:', error);
      res.status(500).json({ error: 'Failed to record spin result' });
    }
  });

  // WordPress Embed Integration Routes
  
  // Get embed code for WordPress
  app.get('/api/wordpress/embed', async (req: Request, res: Response) => {
    try {
      const { type = 'mood', width = '300px', height = '400px' } = req.query;
      const baseUrl = req.protocol + '://' + req.get('host');
      
      // Generate iframe HTML
      let embedUrl = '';
      let title = '';
      
      switch (type) {
        case 'mood':
          embedUrl = `${baseUrl}/embed/mood`;
          title = 'CHONK9K Token Mood';
          break;
        case 'price':
          embedUrl = `${baseUrl}/embed/price`;
          title = 'CHONK9K Token Price';
          break;
        default:
          embedUrl = `${baseUrl}/embed/mood`;
          title = 'CHONK9K Token Mood';
      }
      
      const iframeCode = `<iframe 
  src="${embedUrl}" 
  width="${width}" 
  height="${height}" 
  title="${title}" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
></iframe>`;
      
      // Generate shortcode
      const shortcode = `[chonk9k_embed type="${type}" width="${width}" height="${height}"]`;
      
      res.json({
        iframeCode,
        shortcode,
        embedUrl
      });
    } catch (error) {
      console.error('Error generating embed code:', error);
      res.status(500).json({ error: 'Failed to generate embed code' });
    }
  });
  
  // Get embed resources for WordPress shortcode
  app.get('/api/wordpress/embed-resources', async (req: Request, res: Response) => {
    try {
      const baseUrl = req.protocol + '://' + req.get('host');
      
      // Example PHP code for WordPress plugin
      const phpCode = `<?php
/**
 * Plugin Name: CHONK9K Integration
 * Description: Integrates CHONK9K token mood indicators and pricing widgets
 * Version: 1.0
 * Author: Boom Chain Lab
 */

// Register shortcode for CHONK9K embeds
function chonk9k_embed_shortcode($atts) {
    // Default attributes
    $attributes = shortcode_atts(array(
        'type' => 'mood',
        'width' => '300px',
        'height' => '400px',
    ), $atts);
    
    $type = esc_attr($attributes['type']);
    $width = esc_attr($attributes['width']);
    $height = esc_attr($attributes['height']);
    
    // Generate iframe code
    $embed_url = "${baseUrl}/embed/" . $type;
    
    return '<iframe src="' . esc_url($embed_url) . '" width="' . $width . '" height="' . $height . '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"></iframe>';
}
add_shortcode('chonk9k_embed', 'chonk9k_embed_shortcode');
?>`;
      
      res.json({
        phpCode,
        baseUrl
      });
    } catch (error) {
      console.error('Error generating WordPress resources:', error);
      res.status(500).json({ error: 'Failed to generate WordPress resources' });
    }
  });
  
  // ChonkPad Token Launch Routes
  
  // Get all token launches
  app.get('/api/chonkpad/launches', async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const launches = await storage.getTokenLaunches(status);
      res.json(launches);
    } catch (error) {
      console.error('Error fetching token launches:', error);
      res.status(500).json({ error: 'Failed to fetch token launches' });
    }
  });
  
  // Get token launch by ID
  app.get('/api/chonkpad/launches/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid launch ID' });
      }
      
      const launch = await storage.getTokenLaunch(id);
      if (!launch) {
        return res.status(404).json({ error: 'Token launch not found' });
      }
      
      res.json(launch);
    } catch (error) {
      console.error('Error fetching token launch:', error);
      res.status(500).json({ error: 'Failed to fetch token launch' });
    }
  });
  
  // Create a new token launch
  app.post('/api/chonkpad/launches', async (req: Request, res: Response) => {
    try {
      const launchData = insertTokenLaunchSchema.parse(req.body);
      const newLaunch = await storage.createTokenLaunch(launchData);
      res.status(201).json(newLaunch);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating token launch:', error);
      res.status(500).json({ error: 'Failed to create token launch' });
    }
  });
  
  // Update token launch status
  app.patch('/api/chonkpad/launches/:id/status', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid launch ID' });
      }
      
      const { status } = req.body;
      if (!status || !['upcoming', 'live', 'ended'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      
      const updatedLaunch = await storage.updateTokenLaunchStatus(id, status);
      if (!updatedLaunch) {
        return res.status(404).json({ error: 'Token launch not found' });
      }
      
      res.json(updatedLaunch);
    } catch (error) {
      console.error('Error updating token launch status:', error);
      res.status(500).json({ error: 'Failed to update token launch status' });
    }
  });
  
  // Invest in a token launch
  app.post('/api/chonkpad/launches/:id/invest', async (req: Request, res: Response) => {
    try {
      const launchId = parseInt(req.params.id);
      if (isNaN(launchId)) {
        return res.status(400).json({ error: 'Invalid launch ID' });
      }
      
      const { userId, amount } = req.body;
      
      if (!userId || isNaN(parseInt(userId))) {
        return res.status(400).json({ error: 'Valid user ID is required' });
      }
      
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: 'Valid positive amount is required' });
      }
      
      // Get the token launch to calculate tokens allocated
      const launch = await storage.getTokenLaunch(launchId);
      if (!launch) {
        return res.status(404).json({ error: 'Token launch not found' });
      }
      
      if (launch.status !== 'live') {
        return res.status(400).json({ error: 'Token launch is not active' });
      }
      
      // Calculate tokens allocated based on token price
      const tokensAllocated = parseFloat(amount) / launch.tokenPrice;
      
      const investmentData = insertUserInvestmentSchema.parse({
        userId: parseInt(userId),
        launchId,
        amount: parseFloat(amount),
        tokensAllocated,
        status: 'pending'
      });
      
      const investment = await storage.createUserInvestment(investmentData);
      
      // Update current raise amount for the token launch
      await storage.updateTokenLaunchCurrentRaise(launchId, parseFloat(amount));
      
      res.status(201).json(investment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error investing in token launch:', error);
      res.status(500).json({ error: 'Failed to invest in token launch' });
    }
  });
  
  // Get user investments
  app.get('/api/chonkpad/users/:userId/investments', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const investments = await storage.getUserInvestments(userId);
      res.json(investments);
    } catch (error) {
      console.error('Error fetching user investments:', error);
      res.status(500).json({ error: 'Failed to fetch user investments' });
    }
  });
  
  // Unstoppable Domain routes
  
  // Get all domains (admin endpoint)
  app.get('/api/unstoppable-domains/all', async (req: Request, res: Response) => {
    try {
      // In a production app, this would check for admin privileges
      const domains = await storage.getAllUnstoppableDomains();
      res.json(domains);
    } catch (error) {
      console.error('Error fetching all domains:', error);
      res.status(500).json({ error: 'Failed to fetch domains' });
    }
  });
  
  // Get all domains for a user
  app.get('/api/users/:userId/unstoppable-domains', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const domains = await storage.getUserUnstoppableDomains(userId);
      res.json(domains);
    } catch (error) {
      console.error('Error fetching user domains:', error);
      res.status(500).json({ error: 'Failed to fetch user domains' });
    }
  });
  
  // Get domain by ID
  app.get('/api/unstoppable-domains/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid domain ID' });
      }
      
      const domain = await storage.getUnstoppableDomain(id);
      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }
      
      res.json(domain);
    } catch (error) {
      console.error('Error fetching domain:', error);
      res.status(500).json({ error: 'Failed to fetch domain' });
    }
  });
  
  // Get domain by name
  app.get('/api/unstoppable-domains/name/:domainName', async (req: Request, res: Response) => {
    try {
      const domainName = req.params.domainName;
      if (!domainName) {
        return res.status(400).json({ error: 'Invalid domain name' });
      }
      
      const domain = await storage.getUnstoppableDomainByName(domainName);
      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }
      
      res.json(domain);
    } catch (error) {
      console.error('Error fetching domain by name:', error);
      res.status(500).json({ error: 'Failed to fetch domain' });
    }
  });
  
  // Register a new domain
  app.post('/api/unstoppable-domains', async (req: Request, res: Response) => {
    try {
      const domainData = insertUnstoppableDomainNFTSchema.parse(req.body);
      
      // Check if domain already exists by name
      const existingDomain = await storage.getUnstoppableDomainByName(domainData.domainName);
      if (existingDomain) {
        return res.status(409).json({ error: 'Domain name already registered' });
      }
      
      const newDomain = await storage.createUnstoppableDomain(domainData);
      res.status(201).json(newDomain);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating domain:', error);
      res.status(500).json({ error: 'Failed to create domain' });
    }
  });
  
  // Verify a domain
  app.post('/api/unstoppable-domains/:id/verify', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid domain ID' });
      }
      
      // Check if domain exists
      const domain = await storage.getUnstoppableDomain(id);
      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }
      
      const success = await storage.verifyUnstoppableDomain(id);
      if (success) {
        res.json({ success: true, message: 'Domain verified successfully' });
      } else {
        res.status(500).json({ error: 'Failed to verify domain' });
      }
    } catch (error) {
      console.error('Error verifying domain:', error);
      res.status(500).json({ error: 'Failed to verify domain' });
    }
  });
  
  // Get benefits for a domain
  app.get('/api/unstoppable-domains/:domainId/benefits', async (req: Request, res: Response) => {
    try {
      const domainId = parseInt(req.params.domainId);
      if (isNaN(domainId)) {
        return res.status(400).json({ error: 'Invalid domain ID' });
      }
      
      const benefits = await storage.getUnstoppableDomainBenefits(domainId);
      res.json(benefits);
    } catch (error) {
      console.error('Error fetching domain benefits:', error);
      res.status(500).json({ error: 'Failed to fetch domain benefits' });
    }
  });
  
  // Add a benefit to a domain
  app.post('/api/unstoppable-domains/:domainId/benefits', async (req: Request, res: Response) => {
    try {
      const domainId = parseInt(req.params.domainId);
      if (isNaN(domainId)) {
        return res.status(400).json({ error: 'Invalid domain ID' });
      }
      
      // Check if domain exists
      const domain = await storage.getUnstoppableDomain(domainId);
      if (!domain) {
        return res.status(404).json({ error: 'Domain not found' });
      }
      
      const benefitData = insertUnstoppableDomainBenefitSchema.parse({
        ...req.body,
        domainId
      });
      
      const newBenefit = await storage.createUnstoppableDomainBenefit(benefitData);
      res.status(201).json(newBenefit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating domain benefit:', error);
      res.status(500).json({ error: 'Failed to create domain benefit' });
    }
  });
  
  // Update user's unstoppable domain preference
  app.patch('/api/users/:userId/unstoppable-domain-preference', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const { useAsUsername } = req.body;
      if (typeof useAsUsername !== 'boolean') {
        return res.status(400).json({ error: 'Invalid preference value' });
      }
      
      const success = await storage.updateUserUnstoppableDomainPreference(userId, useAsUsername);
      if (success) {
        res.json({ success: true, message: 'Preference updated successfully' });
      } else {
        res.status(500).json({ error: 'Failed to update preference' });
      }
    } catch (error) {
      console.error('Error updating user domain preference:', error);
      res.status(500).json({ error: 'Failed to update preference' });
    }
  });

  // ===================================================
  // COMMUNITY CHALLENGE BOARD API ROUTES
  // ===================================================

  // Get all challenges with optional filters
  app.get('/api/challenges', async (req: Request, res: Response) => {
    try {
      const activeOnly = req.query.active === 'true';
      const type = typeof req.query.type === 'string' ? req.query.type : undefined;
      const difficultyLevel = typeof req.query.difficulty === 'string' ? req.query.difficulty : undefined;
      
      const challenges = await storage.getChallenges(activeOnly, type, difficultyLevel);
      res.json(challenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      res.status(500).json({ error: 'Failed to fetch challenges' });
    }
  });

  // Get the active challenge
  app.get('/api/challenges/active', async (req: Request, res: Response) => {
    try {
      const activeChallenge = await storage.getActiveChallenge();
      if (!activeChallenge) {
        return res.status(404).json({ error: 'No active challenge found' });
      }
      
      res.json(activeChallenge);
    } catch (error) {
      console.error('Error fetching active challenge:', error);
      res.status(500).json({ error: 'Failed to fetch active challenge' });
    }
  });

  // Get a specific challenge by ID
  app.get('/api/challenges/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid challenge ID' });
      }
      
      const challenge = await storage.getChallenge(id);
      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }
      
      res.json(challenge);
    } catch (error) {
      console.error(`Error fetching challenge:`, error);
      res.status(500).json({ error: 'Failed to fetch challenge' });
    }
  });

  // Create a new challenge (admin or authorized users only)
  app.post('/api/challenges', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to create challenges' });
      }
      
      const challengeData = insertCommunityChallengeSchema.parse(req.body);
      const newChallenge = await storage.createChallenge({
        ...challengeData,
        createdBy: user.id
      });
      
      res.status(201).json(newChallenge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating challenge:', error);
      res.status(500).json({ error: 'Failed to create challenge' });
    }
  });

  // Update an existing challenge (admin only)
  app.patch('/api/challenges/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to update challenges' });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid challenge ID' });
      }
      
      const existingChallenge = await storage.getChallenge(id);
      if (!existingChallenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }
      
      const updates = req.body;
      const updatedChallenge = await storage.updateChallenge(id, updates);
      
      res.json(updatedChallenge);
    } catch (error) {
      console.error('Error updating challenge:', error);
      res.status(500).json({ error: 'Failed to update challenge' });
    }
  });

  // Get submissions for a challenge
  app.get('/api/challenges/:id/submissions', async (req: Request, res: Response) => {
    try {
      const challengeId = parseInt(req.params.id);
      if (isNaN(challengeId)) {
        return res.status(400).json({ error: 'Invalid challenge ID' });
      }
      
      const status = typeof req.query.status === 'string' ? req.query.status : undefined;
      const submissions = await storage.getChallengeSubmissions(challengeId, undefined, status);
      
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching challenge submissions:', error);
      res.status(500).json({ error: 'Failed to fetch challenge submissions' });
    }
  });

  // Submit a solution to a challenge
  app.post('/api/challenges/:id/submit', requireAuth, requireVerified, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const challengeId = parseInt(req.params.id);
      if (isNaN(challengeId)) {
        return res.status(400).json({ error: 'Invalid challenge ID' });
      }
      
      // Check if challenge exists and is active
      const challenge = await storage.getChallenge(challengeId);
      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }
      
      const now = new Date();
      if (!challenge.isActive || challenge.startDate > now || challenge.endDate < now) {
        return res.status(400).json({ error: 'Challenge is not active' });
      }
      
      // Check if user already submitted for this challenge
      const existingSubmission = await storage.getUserChallengeSubmission(user.id, challengeId);
      if (existingSubmission) {
        return res.status(400).json({ 
          error: 'You have already submitted for this challenge', 
          submission: existingSubmission 
        });
      }
      
      // Validate submission data based on required proof type
      const { proofLink, proofText, proofImageUrl } = req.body;
      const requiredProofType = challenge.requiredProof;
      
      // Validate that the correct proof type is provided
      if (requiredProofType === 'link' && !proofLink) {
        return res.status(400).json({ error: 'This challenge requires a link proof' });
      }
      if (requiredProofType === 'text' && !proofText) {
        return res.status(400).json({ error: 'This challenge requires a text proof' });
      }
      if (requiredProofType === 'image' && !proofImageUrl) {
        return res.status(400).json({ error: 'This challenge requires an image proof' });
      }
      
      // Create submission
      const submissionData = insertChallengeSubmissionSchema.parse({
        challengeId,
        userId: user.id,
        proofLink: proofLink || null,
        proofText: proofText || null,
        proofImageUrl: proofImageUrl || null,
        rewardAmount: challenge.rewardAmount // Store the reward amount at time of submission
      });
      
      const newSubmission = await storage.createChallengeSubmission(submissionData);
      res.status(201).json(newSubmission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error submitting challenge solution:', error);
      res.status(500).json({ error: 'Failed to submit challenge solution' });
    }
  });

  // Get user's submissions
  app.get('/api/user/submissions', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const submissions = await storage.getChallengeSubmissions(undefined, user.id);
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching user submissions:', error);
      res.status(500).json({ error: 'Failed to fetch user submissions' });
    }
  });

  // Review a submission (admin only)
  app.post('/api/submissions/:id/review', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to review submissions' });
      }
      
      const submissionId = parseInt(req.params.id);
      if (isNaN(submissionId)) {
        return res.status(400).json({ error: 'Invalid submission ID' });
      }
      
      const { status, reviewNotes } = req.body;
      if (!status || !['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      
      const submission = await storage.getChallengeSubmission(submissionId);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      // Update submission status
      const success = await storage.updateChallengeSubmissionStatus(
        submissionId, 
        status, 
        user.id, 
        reviewNotes
      );
      
      if (success && status === 'approved') {
        // If approved, add tokens to user's balance
        await storage.updateUserTokenBalance(
          submission.userId, 
          (user.tokenBalance || 0) + submission.rewardAmount
        );
      }
      
      res.json({ success, message: `Submission ${status}` });
    } catch (error) {
      console.error('Error reviewing submission:', error);
      res.status(500).json({ error: 'Failed to review submission' });
    }
  });

  // Claim reward for an approved submission
  app.post('/api/submissions/:id/claim', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const submissionId = parseInt(req.params.id);
      if (isNaN(submissionId)) {
        return res.status(400).json({ error: 'Invalid submission ID' });
      }
      
      const submission = await storage.getChallengeSubmission(submissionId);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      // Verify the submission belongs to the user
      if (submission.userId !== user.id) {
        return res.status(403).json({ error: 'Cannot claim rewards for another user\'s submission' });
      }
      
      // Verify the submission is approved and not already claimed
      if (submission.status !== 'approved') {
        return res.status(400).json({ error: 'Only approved submissions can claim rewards' });
      }
      
      if (submission.rewardClaimed) {
        return res.status(400).json({ error: 'Reward has already been claimed' });
      }
      
      // Mark as claimed
      const success = await storage.claimChallengeReward(submissionId);
      
      // Update user's token balance
      if (success) {
        await storage.updateUserTokenBalance(
          user.id, 
          (user.tokenBalance || 0) + submission.rewardAmount
        );
      }
      
      res.json({ 
        success, 
        message: 'Reward claimed successfully', 
        amount: submission.rewardAmount 
      });
    } catch (error) {
      console.error('Error claiming reward:', error);
      res.status(500).json({ error: 'Failed to claim reward' });
    }
  });

  // Vote on a submission
  app.post('/api/submissions/:id/vote', requireAuth, requireVerified, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const submissionId = parseInt(req.params.id);
      if (isNaN(submissionId)) {
        return res.status(400).json({ error: 'Invalid submission ID' });
      }
      
      const { voteType } = req.body;
      if (!voteType || !['upvote', 'downvote'].includes(voteType)) {
        return res.status(400).json({ error: 'Invalid vote type' });
      }
      
      // Check if submission exists
      const submission = await storage.getChallengeSubmission(submissionId);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      // Check if user already voted
      const existingVote = await storage.getUserVote(user.id, submissionId);
      if (existingVote) {
        return res.status(400).json({ error: 'You have already voted on this submission' });
      }
      
      // Create vote
      const voteData = insertCommunityVoteSchema.parse({
        submissionId,
        userId: user.id,
        voteType
      });
      
      const newVote = await storage.createCommunityVote(voteData);
      
      // Get updated vote counts
      const voteCounts = await storage.getSubmissionVoteCounts(submissionId);
      
      res.status(201).json({
        vote: newVote,
        voteCounts
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error voting on submission:', error);
      res.status(500).json({ error: 'Failed to vote on submission' });
    }
  });

  // Get tags for a challenge
  app.get('/api/challenges/:id/tags', async (req: Request, res: Response) => {
    try {
      const challengeId = parseInt(req.params.id);
      if (isNaN(challengeId)) {
        return res.status(400).json({ error: 'Invalid challenge ID' });
      }
      
      const tags = await storage.getChallengeTags(challengeId);
      res.json(tags);
    } catch (error) {
      console.error('Error fetching challenge tags:', error);
      res.status(500).json({ error: 'Failed to fetch challenge tags' });
    }
  });

  // Get all available tags
  app.get('/api/challenge-tags', async (req: Request, res: Response) => {
    try {
      const tags = await storage.getAllChallengeTags();
      res.json(tags);
    } catch (error) {
      console.error('Error fetching challenge tags:', error);
      res.status(500).json({ error: 'Failed to fetch challenge tags' });
    }
  });

  // Create a new tag (admin only)
  app.post('/api/challenge-tags', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to create tags' });
      }
      
      const tagData = insertChallengeTagSchema.parse(req.body);
      const newTag = await storage.createChallengeTag(tagData);
      
      res.status(201).json(newTag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating challenge tag:', error);
      res.status(500).json({ error: 'Failed to create challenge tag' });
    }
  });

  // Add a tag to a challenge (admin only)
  app.post('/api/challenges/:challengeId/tags/:tagId', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to add tags to challenges' });
      }
      
      const challengeId = parseInt(req.params.challengeId);
      const tagId = parseInt(req.params.tagId);
      
      if (isNaN(challengeId) || isNaN(tagId)) {
        return res.status(400).json({ error: 'Invalid IDs provided' });
      }
      
      // Check if challenge and tag exist
      const challenge = await storage.getChallenge(challengeId);
      const tag = await storage.getChallengeTag(tagId);
      
      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }
      
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      
      const success = await storage.addTagToChallenge(challengeId, tagId);
      res.json({ success });
    } catch (error) {
      console.error('Error adding tag to challenge:', error);
      res.status(500).json({ error: 'Failed to add tag to challenge' });
    }
  });

  // ===================================================
  // CRYPTO MENTOR MASCOT API ROUTES
  // ===================================================

  // Get all daily tips
  app.get('/api/daily-tips', async (req: Request, res: Response) => {
    try {
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;
      const difficulty = typeof req.query.difficulty === 'string' ? req.query.difficulty : undefined;
      
      const tips = await storage.getDailyTips(category, difficulty);
      res.json(tips);
    } catch (error) {
      console.error('Error fetching daily tips:', error);
      res.status(500).json({ error: 'Failed to fetch daily tips' });
    }
  });

  // Get a specific daily tip
  app.get('/api/daily-tips/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid tip ID' });
      }
      
      const tip = await storage.getDailyTip(id);
      if (!tip) {
        return res.status(404).json({ error: 'Tip not found' });
      }
      
      res.json(tip);
    } catch (error) {
      console.error(`Error fetching daily tip:`, error);
      res.status(500).json({ error: 'Failed to fetch daily tip' });
    }
  });

  // Create a new daily tip (admin only)
  app.post('/api/daily-tips', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to create tips' });
      }
      
      const tipData = insertDailyTipSchema.parse(req.body);
      const newTip = await storage.createDailyTip(tipData);
      
      res.status(201).json(newTip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating daily tip:', error);
      res.status(500).json({ error: 'Failed to create daily tip' });
    }
  });

  // Update a daily tip (admin only)
  app.patch('/api/daily-tips/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to update tips' });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid tip ID' });
      }
      
      const tip = await storage.getDailyTip(id);
      if (!tip) {
        return res.status(404).json({ error: 'Tip not found' });
      }
      
      const updates = req.body;
      const updatedTip = await storage.updateDailyTip(id, updates);
      
      res.json(updatedTip);
    } catch (error) {
      console.error('Error updating daily tip:', error);
      res.status(500).json({ error: 'Failed to update daily tip' });
    }
  });

  // Get a random daily tip for the user
  app.get('/api/daily-tips/random', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;
      const difficulty = typeof req.query.difficulty === 'string' ? req.query.difficulty : undefined;
      
      // Get user's mascot settings to check if they've disabled the mascot
      const mascotSettings = await storage.getMascotSettings(user.id);
      
      // If the user has mascot disabled, return an appropriate message
      if (mascotSettings && !mascotSettings.isEnabled) {
        return res.status(200).json({ disabled: true, message: 'Mascot is disabled for this user' });
      }
      
      const randomTip = await storage.getRandomDailyTip(category, difficulty);
      if (!randomTip) {
        return res.status(404).json({ error: 'No tips available' });
      }
      
      // Mark the tip as displayed
      await storage.markTipAsDisplayed(randomTip.id);
      
      // If user has mascot settings, update the last interaction timestamp
      if (mascotSettings) {
        await storage.updateLastInteraction(user.id);
      }
      
      res.json(randomTip);
    } catch (error) {
      console.error('Error fetching random daily tip:', error);
      res.status(500).json({ error: 'Failed to fetch random daily tip' });
    }
  });

  // Get user's mascot settings
  app.get('/api/mascot-settings', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      // Get the user's mascot settings, or create default settings if none exist
      let settings = await storage.getMascotSettings(user.id);
      
      if (!settings) {
        // Create default settings for this user
        settings = await storage.createMascotSettings({
          userId: user.id,
          mascotType: 'crypto_chonk',
          isEnabled: true,
          animation: 'default',
          speechBubbleStyle: 'default',
          tipFrequency: 'daily'
        });
      }
      
      res.json(settings);
    } catch (error) {
      console.error('Error fetching mascot settings:', error);
      res.status(500).json({ error: 'Failed to fetch mascot settings' });
    }
  });

  // Update user's mascot settings
  app.patch('/api/mascot-settings', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      // First check if the user has existing settings
      let settings = await storage.getMascotSettings(user.id);
      
      if (!settings) {
        // Create default settings with the updated values
        const defaultSettings = {
          userId: user.id,
          mascotType: req.body.mascotType || 'crypto_chonk',
          isEnabled: typeof req.body.isEnabled === 'boolean' ? req.body.isEnabled : true,
          animation: req.body.animation || 'default',
          speechBubbleStyle: req.body.speechBubbleStyle || 'default',
          tipFrequency: req.body.tipFrequency || 'daily'
        };
        
        settings = await storage.createMascotSettings(defaultSettings);
      } else {
        // Update existing settings
        settings = await storage.updateMascotSettings(user.id, req.body);
      }
      
      // Update last interaction timestamp
      await storage.updateLastInteraction(user.id);
      
      res.json(settings);
    } catch (error) {
      console.error('Error updating mascot settings:', error);
      res.status(500).json({ error: 'Failed to update mascot settings' });
    }
  });
  
  const httpServer = createServer(app);

  return httpServer;
}

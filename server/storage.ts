import { 
  users, type User, type InsertUser,
  tokenStats, type TokenStat, type InsertTokenStat,
  teamMembers, type TeamMember, type InsertTeamMember,
  roadmapItems, type RoadmapItem, type InsertRoadmapItem,
  tokenPurchases, type TokenPurchase, type InsertTokenPurchase,
  badges, type Badge, type InsertBadge,
  userBadges, type UserBadge, type InsertUserBadge,
  triviaQuizzes, type TriviaQuiz, type InsertTriviaQuiz,
  triviaQuestions, type TriviaQuestion, type InsertTriviaQuestion,
  triviaSubmissions, type TriviaSubmission, type InsertTriviaSubmission,
  triviaAnswers, type TriviaAnswer, type InsertTriviaAnswer,
  spinWheelRewards, type SpinWheelReward, type InsertSpinWheelReward,
  userSpins, type UserSpin, type InsertUserSpin,
  marketplaceListings, type MarketplaceListing, type InsertMarketplaceListing,
  stakingPools, type StakingPool, type InsertStakingPool,
  userStakes, type UserStake, type InsertUserStake,
  referralRewards, type ReferralReward, type InsertReferralReward,
  premiumTiers, type PremiumTier, type InsertPremiumTier,
  miningRigs, type MiningRig, type InsertMiningRig,
  userMiningRigs, type UserMiningRig, type InsertUserMiningRig,
  miningRewards, type MiningReward, type InsertMiningReward,
  tokenLaunches, type TokenLaunch, type InsertTokenLaunch,
  userInvestments, type UserInvestment, type InsertUserInvestment,
  unstoppableDomainNFTs, type UnstoppableDomainNFT, type InsertUnstoppableDomainNFT,
  unstoppableDomainBenefits, type UnstoppableDomainBenefit, type InsertUnstoppableDomainBenefit,
  passwordResetTokens,
  userDevices, type UserDevice, type InsertUserDevice,
  userSessions, type UserSession, type InsertUserSession,
  tokenClaims, type TokenClaim, type InsertTokenClaim,
  // Learning and social sharing imports
  learningModules, type LearningModule, type InsertLearningModule,
  learningLessons, type LearningLesson, type InsertLearningLesson,
  userModuleProgress, type UserModuleProgress, type InsertUserModuleProgress,
  userLessonProgress, type UserLessonProgress, type InsertUserLessonProgress,
  socialShares, type SocialShare, type InsertSocialShare,
  learningAchievements, type LearningAchievement, type InsertLearningAchievement,
  userLearningStats, type UserLearningStats, type InsertUserLearningStats
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateLastLogin(userId: number): Promise<boolean>;
  updateUserPassword(userId: number, passwordHash: string): Promise<boolean>;
  verifyUser(userId: number): Promise<boolean>;
  updateUserLastActivity(userId: number): Promise<boolean>;
  updateVerificationToken(userId: number, token: string): Promise<boolean>;
  
  // Device and session operations
  updateDeviceLastLogin(deviceId: number): Promise<boolean>;
  getUserSessions(userId: number): Promise<any[]>;
  
  // Password reset operations
  createPasswordResetToken(userId: number, token: string, expires: Date): Promise<{ id: number, userId: number, token: string, expires: Date }>;
  validatePasswordResetToken(token: string): Promise<{ userId: number } | null>;
  invalidatePasswordResetToken(token: string): Promise<boolean>;
  
  // Token stats operations
  getTokenStats(): Promise<TokenStat[]>;
  getTokenStat(id: number): Promise<TokenStat | undefined>;
  createTokenStat(tokenStat: InsertTokenStat): Promise<TokenStat>;
  
  // Team members operations
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  
  // Roadmap operations
  getRoadmapItems(): Promise<RoadmapItem[]>;
  getRoadmapItem(id: number): Promise<RoadmapItem | undefined>;
  createRoadmapItem(roadmapItem: InsertRoadmapItem): Promise<RoadmapItem>;
  
  // Token purchases operations
  getTokenPurchases(userId?: number): Promise<TokenPurchase[]>;
  getTokenPurchase(id: number): Promise<TokenPurchase | undefined>;
  createTokenPurchase(tokenPurchase: InsertTokenPurchase): Promise<TokenPurchase>;
  
  // Badge operations
  getBadges(): Promise<Badge[]>;
  getBadge(id: number): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  // User badge operations
  getUserBadges(userId: number): Promise<UserBadge[]>;
  getUserBadge(id: number): Promise<UserBadge | undefined>;
  createUserBadge(userBadge: InsertUserBadge): Promise<UserBadge>;
  getUserBadgesWithDetails(userId: number): Promise<(UserBadge & { badge: Badge })[]>;
  checkEligibleBadges(userId: number): Promise<Badge[]>;
  
  // Trivia Quiz operations
  getTriviaQuizzes(activeOnly?: boolean): Promise<TriviaQuiz[]>;
  getTriviaQuiz(id: number): Promise<TriviaQuiz | undefined>;
  createTriviaQuiz(quiz: InsertTriviaQuiz): Promise<TriviaQuiz>;
  getCurrentTriviaQuiz(): Promise<TriviaQuiz | undefined>;
  
  // Trivia Question operations
  getTriviaQuestions(quizId: number): Promise<TriviaQuestion[]>;
  getTriviaQuestion(id: number): Promise<TriviaQuestion | undefined>;
  createTriviaQuestion(question: InsertTriviaQuestion): Promise<TriviaQuestion>;
  
  // Trivia Submission operations
  getTriviaSubmissions(quizId?: number, userId?: number): Promise<TriviaSubmission[]>;
  getTriviaSubmission(id: number): Promise<TriviaSubmission | undefined>;
  createTriviaSubmission(submission: InsertTriviaSubmission): Promise<TriviaSubmission>;
  getUserTriviaSubmission(userId: number, quizId: number): Promise<TriviaSubmission | undefined>;
  
  // Trivia Answer operations
  getTriviaAnswers(submissionId: number): Promise<TriviaAnswer[]>;
  createTriviaAnswer(answer: InsertTriviaAnswer): Promise<TriviaAnswer>;
  calculateTriviaScore(submissionId: number): Promise<number>;
  claimTriviaReward(submissionId: number): Promise<boolean>;
  
  // Spin Wheel operations
  getSpinWheelRewards(activeOnly?: boolean): Promise<SpinWheelReward[]>;
  getSpinWheelReward(id: number): Promise<SpinWheelReward | undefined>;
  createSpinWheelReward(reward: InsertSpinWheelReward): Promise<SpinWheelReward>;
  getUserSpins(userId: number): Promise<UserSpin[]>;
  createUserSpin(userSpin: InsertUserSpin): Promise<UserSpin>;
  claimSpinReward(spinId: number, transactionHash: string): Promise<boolean>;
  
  // Marketplace operations
  getMarketplaceListings(activeOnly?: boolean): Promise<MarketplaceListing[]>;
  getMarketplaceListing(id: number): Promise<MarketplaceListing | undefined>;
  createMarketplaceListing(listing: InsertMarketplaceListing): Promise<MarketplaceListing>;
  
  // Staking operations
  getStakingPools(activeOnly?: boolean): Promise<StakingPool[]>;
  getStakingPool(id: number): Promise<StakingPool | undefined>;
  createStakingPool(pool: InsertStakingPool): Promise<StakingPool>;
  getUserStakes(userId: number): Promise<UserStake[]>;
  getUserStake(id: number): Promise<UserStake | undefined>;
  createUserStake(stake: InsertUserStake): Promise<UserStake>;
  updateUserStakeAfterClaim(stakeId: number, rewardsAmount: number): Promise<boolean>;
  deactivateUserStake(stakeId: number): Promise<boolean>;
  updatePoolTotalStaked(poolId: number, newTotalStaked: number): Promise<boolean>;
  
  // Referral operations
  getReferredUsers(userId: number): Promise<User[]>;
  getUserReferralRewards(userId: number): Promise<ReferralReward[]>;
  getUserPendingReferralRewards(userId: number): Promise<ReferralReward[]>;
  createReferralReward(reward: InsertReferralReward): Promise<ReferralReward>;
  updateReferralRewardsStatus(rewardIds: number[], status: string): Promise<boolean>;
  updateUserReferralCode(userId: number, referralCode: string): Promise<boolean>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  updateUserReferrer(userId: number, referrerId: number): Promise<boolean>;
  
  // Premium membership operations
  getPremiumTiers(): Promise<PremiumTier[]>;
  getPremiumTier(id: number): Promise<PremiumTier | undefined>;
  createPremiumTier(tier: InsertPremiumTier): Promise<PremiumTier>;
  updateUserPremiumTier(userId: number, tierId: number): Promise<boolean>;
  
  // User token balance operations
  updateUserTokenBalance(userId: number, newBalance: number): Promise<boolean>;
  
  // Token Faucet operations
  recordTokenClaim(userId: number, amount: number): Promise<TokenClaim>;
  getLastTokenClaim(userId: number): Promise<TokenClaim | undefined>;
  getUserTokenClaims(userId: number): Promise<TokenClaim[]>;

  // Mining operations
  getMiningRigs(availableOnly?: boolean): Promise<MiningRig[]>;
  getMiningRig(id: number): Promise<MiningRig | undefined>;
  createMiningRig(rig: InsertMiningRig): Promise<MiningRig>;
  getUserMiningRigs(userId: number): Promise<UserMiningRig[]>;
  getUserMiningRigsWithDetails(userId: number): Promise<(UserMiningRig & { rig: MiningRig })[]>;
  getUserMiningRig(id: number): Promise<UserMiningRig | undefined>;
  createUserMiningRig(userRig: InsertUserMiningRig): Promise<UserMiningRig>;
  updateUserMiningRigStatus(userRigId: number, isActive: boolean): Promise<boolean>;
  updateLastRewardDate(userRigId: number): Promise<boolean>;
  updateTotalMined(userRigId: number, newTotal: number): Promise<boolean>;
  getMiningRewards(userId?: number, userRigId?: number): Promise<MiningReward[]>;
  getMiningReward(id: number): Promise<MiningReward | undefined>;
  createMiningReward(reward: InsertMiningReward): Promise<MiningReward>;
  
  // ChonkPad Token Launch operations
  getTokenLaunches(status?: string): Promise<TokenLaunch[]>;
  getTokenLaunch(id: number): Promise<TokenLaunch | undefined>;
  createTokenLaunch(launch: InsertTokenLaunch): Promise<TokenLaunch>;
  updateTokenLaunchStatus(id: number, status: string): Promise<TokenLaunch | undefined>;
  updateTokenLaunchCurrentRaise(id: number, additionalAmount: number): Promise<boolean>;
  
  // ChonkPad User Investment operations
  getUserInvestments(userId: number): Promise<UserInvestment[]>;
  getUserInvestment(id: number): Promise<UserInvestment | undefined>;
  createUserInvestment(investment: InsertUserInvestment): Promise<UserInvestment>;
  
  // Unstoppable Domain operations
  getAllUnstoppableDomains(): Promise<UnstoppableDomainNFT[]>;
  getUserUnstoppableDomains(userId: number): Promise<UnstoppableDomainNFT[]>;
  getUnstoppableDomain(id: number): Promise<UnstoppableDomainNFT | undefined>;
  getUnstoppableDomainByName(domainName: string): Promise<UnstoppableDomainNFT | undefined>;
  createUnstoppableDomain(domain: InsertUnstoppableDomainNFT): Promise<UnstoppableDomainNFT>;
  verifyUnstoppableDomain(id: number): Promise<boolean>;
  getUnstoppableDomainBenefits(domainId: number): Promise<UnstoppableDomainBenefit[]>;
  createUnstoppableDomainBenefit(benefit: InsertUnstoppableDomainBenefit): Promise<UnstoppableDomainBenefit>;
  updateUserUnstoppableDomainPreference(userId: number, useAsUsername: boolean): Promise<boolean>;

  // Learning Module operations
  getLearningModules(categoryFilter?: string, activeOnly?: boolean): Promise<LearningModule[]>;
  getLearningModule(id: number): Promise<LearningModule | undefined>;
  createLearningModule(module: InsertLearningModule): Promise<LearningModule>;
  updateLearningModule(id: number, module: Partial<InsertLearningModule>): Promise<LearningModule | undefined>;
  
  // Learning Lesson operations
  getLearningLessons(moduleId: number): Promise<LearningLesson[]>;
  getLearningLesson(id: number): Promise<LearningLesson | undefined>;
  createLearningLesson(lesson: InsertLearningLesson): Promise<LearningLesson>;
  updateLearningLesson(id: number, lesson: Partial<InsertLearningLesson>): Promise<LearningLesson | undefined>;
  
  // User Progress operations
  getUserModuleProgress(userId: number, moduleId?: number): Promise<UserModuleProgress[]>;
  getUserModuleProgressDetail(id: number): Promise<UserModuleProgress | undefined>;
  createUserModuleProgress(progress: InsertUserModuleProgress): Promise<UserModuleProgress>;
  updateUserModuleProgress(id: number, percentComplete: number, lastLessonId?: number, pointsEarned?: number, timeSpentMinutes?: number): Promise<UserModuleProgress | undefined>;
  completeUserModuleProgress(id: number): Promise<UserModuleProgress | undefined>;
  
  getUserLessonProgress(userId: number, moduleId?: number, lessonId?: number): Promise<UserLessonProgress[]>;
  getUserLessonProgressDetail(id: number): Promise<UserLessonProgress | undefined>;
  createUserLessonProgress(progress: InsertUserLessonProgress): Promise<UserLessonProgress>;
  updateUserLessonProgress(id: number, timeSpentMinutes?: number, pointsEarned?: number): Promise<UserLessonProgress | undefined>;
  completeUserLessonProgress(id: number): Promise<UserLessonProgress | undefined>;
  
  // Social Sharing operations
  getUserSocialShares(userId: number): Promise<SocialShare[]>;
  getSocialShare(id: number): Promise<SocialShare | undefined>;
  createSocialShare(share: InsertSocialShare): Promise<SocialShare>;
  updateSocialShareEngagement(id: number, metrics: { likes?: number, comments?: number, shares?: number, clicks?: number }): Promise<SocialShare | undefined>;
  
  // Learning Achievements operations
  getUserLearningAchievements(userId: number): Promise<LearningAchievement[]>;
  getLearningAchievement(id: number): Promise<LearningAchievement | undefined>;
  createLearningAchievement(achievement: InsertLearningAchievement): Promise<LearningAchievement>;
  
  // User Learning Stats operations
  getUserLearningStats(userId: number): Promise<UserLearningStats | undefined>;
  createUserLearningStats(stats: InsertUserLearningStats): Promise<UserLearningStats>;
  updateUserLearningStats(userId: number, stats: Partial<InsertUserLearningStats>): Promise<UserLearningStats | undefined>;
  updateUserLearningStreak(userId: number, increment?: boolean): Promise<UserLearningStats | undefined>;
}

export class DatabaseStorage implements IStorage {
  // TRIVIA FUNCTIONALITY IMPLEMENTATION
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
    return user;
  }

  async createUser(insertUser: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async verifyUser(userId: number): Promise<boolean> {
    await db
      .update(users)
      .set({ 
        isVerified: true,
        verificationToken: null 
      })
      .where(eq(users.id, userId));
    return true;
  }
  
  async updateLastLogin(userId: number): Promise<boolean> {
    const now = new Date();
    await db
      .update(users)
      .set({ lastLoginAt: now })
      .where(eq(users.id, userId));
    return true;
  }
  
  async updateUserPassword(userId: number, passwordHash: string): Promise<boolean> {
    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, userId));
    return true;
  }
  
  async updateUserLastActivity(userId: number): Promise<boolean> {
    const now = new Date();
    await db
      .update(users)
      .set({ lastActiveAt: now })
      .where(eq(users.id, userId));
    return true;
  }
  
  async updateDeviceLastLogin(deviceId: number): Promise<boolean> {
    const now = new Date();
    await db
      .update(userDevices)
      .set({ lastLoginAt: now })
      .where(eq(userDevices.id, deviceId));
    return true;
  }
  
  async getUserSessions(userId: number): Promise<any[]> {
    return db
      .select()
      .from(userSessions)
      .where(eq(userSessions.userId, userId))
      .orderBy(desc(userSessions.lastActiveAt));
  }
  
  async updateVerificationToken(userId: number, token: string): Promise<boolean> {
    await db
      .update(users)
      .set({ verificationToken: token })
      .where(eq(users.id, userId));
    return true;
  }
  
  // Password reset operations
  async createPasswordResetToken(userId: number, token: string, expires: Date): Promise<{ id: number, userId: number, token: string, expires: Date }> {
    const [resetToken] = await db
      .insert(passwordResetTokens)
      .values({ userId, token, expires })
      .returning();
    return resetToken as { id: number, userId: number, token: string, expires: Date };
  }
  
  async validatePasswordResetToken(token: string): Promise<{ userId: number } | null> {
    const now = new Date();
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.used, false),
        gte(passwordResetTokens.expires, now)
      ));
      
    if (!resetToken) return null;
    
    return { userId: resetToken.userId };
  }
  
  async invalidatePasswordResetToken(token: string): Promise<boolean> {
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.token, token));
    return true;
  }
  
  // Token stats operations
  async getTokenStats(): Promise<TokenStat[]> {
    return db.select().from(tokenStats);
  }
  
  async getTokenStat(id: number): Promise<TokenStat | undefined> {
    const [tokenStat] = await db.select().from(tokenStats).where(eq(tokenStats.id, id));
    return tokenStat;
  }
  
  async createTokenStat(insertTokenStat: InsertTokenStat): Promise<TokenStat> {
    const [tokenStat] = await db
      .insert(tokenStats)
      .values(insertTokenStat)
      .returning();
    return tokenStat;
  }
  
  // Team members operations
  async getTeamMembers(): Promise<TeamMember[]> {
    return db.select().from(teamMembers);
  }
  
  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    const [teamMember] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return teamMember;
  }
  
  async createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const [teamMember] = await db
      .insert(teamMembers)
      .values(insertTeamMember)
      .returning();
    return teamMember;
  }
  
  // Roadmap operations
  async getRoadmapItems(): Promise<RoadmapItem[]> {
    return db.select().from(roadmapItems);
  }
  
  async getRoadmapItem(id: number): Promise<RoadmapItem | undefined> {
    const [roadmapItem] = await db.select().from(roadmapItems).where(eq(roadmapItems.id, id));
    return roadmapItem;
  }
  
  async createRoadmapItem(insertRoadmapItem: InsertRoadmapItem): Promise<RoadmapItem> {
    const [roadmapItem] = await db
      .insert(roadmapItems)
      .values(insertRoadmapItem)
      .returning();
    return roadmapItem;
  }
  
  // Token purchases operations
  async getTokenPurchases(userId?: number): Promise<TokenPurchase[]> {
    if (userId) {
      return db.select().from(tokenPurchases).where(eq(tokenPurchases.userId, userId));
    }
    return db.select().from(tokenPurchases);
  }
  
  async getTokenPurchase(id: number): Promise<TokenPurchase | undefined> {
    const [purchase] = await db.select().from(tokenPurchases).where(eq(tokenPurchases.id, id));
    return purchase;
  }
  
  async createTokenPurchase(insertTokenPurchase: InsertTokenPurchase): Promise<TokenPurchase> {
    const [purchase] = await db
      .insert(tokenPurchases)
      .values(insertTokenPurchase)
      .returning();
    return purchase;
  }
  
  // Badge operations
  async getBadges(): Promise<Badge[]> {
    return db.select().from(badges);
  }
  
  async getBadge(id: number): Promise<Badge | undefined> {
    const [badge] = await db.select().from(badges).where(eq(badges.id, id));
    return badge;
  }
  
  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const [badge] = await db
      .insert(badges)
      .values(insertBadge)
      .returning();
    return badge;
  }
  
  // User badge operations
  async getUserBadges(userId: number): Promise<UserBadge[]> {
    return db.select().from(userBadges).where(eq(userBadges.userId, userId));
  }
  
  async getUserBadge(id: number): Promise<UserBadge | undefined> {
    const [userBadge] = await db.select().from(userBadges).where(eq(userBadges.id, id));
    return userBadge;
  }
  
  async createUserBadge(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const [userBadge] = await db
      .insert(userBadges)
      .values(insertUserBadge)
      .returning();
    return userBadge;
  }
  
  async getUserBadgesWithDetails(userId: number): Promise<(UserBadge & { badge: Badge })[]> {
    // Query for user badges with badge details
    const userBadgesWithDetails = await db
      .select({
        id: userBadges.id,
        userId: userBadges.userId,
        badgeId: userBadges.badgeId,
        earnedAt: userBadges.earnedAt,
        displayed: userBadges.displayed,
        badge: badges
      })
      .from(userBadges)
      .where(eq(userBadges.userId, userId))
      .innerJoin(badges, eq(userBadges.badgeId, badges.id));
    
    return userBadgesWithDetails;
  }
  
  async checkEligibleBadges(userId: number): Promise<Badge[]> {
    // Get user's purchases total
    const userPurchases = await this.getTokenPurchases(userId);
    const totalTokensPurchased = userPurchases.reduce(
      (sum, purchase) => sum + purchase.amountTokens, 
      0
    );
    
    // Get user's existing badges
    const existingUserBadges = await this.getUserBadges(userId);
    const existingBadgeIds = new Set(existingUserBadges.map(ub => ub.badgeId));
    
    // Get all badges
    const allBadges = await this.getBadges();
    
    // Filter eligible badges based on requirements
    const eligibleBadges = allBadges.filter(badge => {
      // Skip badges the user already has
      if (existingBadgeIds.has(badge.id)) {
        return false;
      }
      
      // Check purchase requirements
      if (badge.requirement === 'token_purchase' && totalTokensPurchased >= badge.requirementValue) {
        return true;
      }
      
      // Add other requirement checks here
      
      return false;
    });
    
    return eligibleBadges;
  }
  
  // Trivia Quiz operations
  async getTriviaQuizzes(activeOnly: boolean = false): Promise<TriviaQuiz[]> {
    if (activeOnly) {
      const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
      return db
        .select()
        .from(triviaQuizzes)
        .where(
          and(
            eq(triviaQuizzes.isActive, true),
            lte(triviaQuizzes.startDate, today),
            gte(triviaQuizzes.endDate, today)
          )
        )
        .orderBy(desc(triviaQuizzes.startDate));
    }
    return db.select().from(triviaQuizzes).orderBy(desc(triviaQuizzes.startDate));
  }
  
  async getTriviaQuiz(id: number): Promise<TriviaQuiz | undefined> {
    const [quiz] = await db.select().from(triviaQuizzes).where(eq(triviaQuizzes.id, id));
    return quiz;
  }
  
  async createTriviaQuiz(insertQuiz: InsertTriviaQuiz): Promise<TriviaQuiz> {
    const [quiz] = await db
      .insert(triviaQuizzes)
      .values(insertQuiz)
      .returning();
    return quiz;
  }
  
  async getCurrentTriviaQuiz(): Promise<TriviaQuiz | undefined> {
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const [quiz] = await db
      .select()
      .from(triviaQuizzes)
      .where(
        and(
          eq(triviaQuizzes.isActive, true),
          lte(triviaQuizzes.startDate, today),
          gte(triviaQuizzes.endDate, today)
        )
      )
      .orderBy(desc(triviaQuizzes.startDate))
      .limit(1);
    return quiz;
  }
  
  // Trivia Question operations
  async getTriviaQuestions(quizId: number): Promise<TriviaQuestion[]> {
    return db
      .select()
      .from(triviaQuestions)
      .where(eq(triviaQuestions.quizId, quizId));
  }
  
  async getTriviaQuestion(id: number): Promise<TriviaQuestion | undefined> {
    const [question] = await db
      .select()
      .from(triviaQuestions)
      .where(eq(triviaQuestions.id, id));
    return question;
  }
  
  async createTriviaQuestion(insertQuestion: InsertTriviaQuestion): Promise<TriviaQuestion> {
    try {
      // Manually prepare the data to ensure proper format
      const data = {
        quiz_id: insertQuestion.quizId,
        question: insertQuestion.question,
        options: JSON.stringify(Array.isArray(insertQuestion.options) ? insertQuestion.options : []),
        correct_answer: insertQuestion.correctAnswer,
        explanation: insertQuestion.explanation,
        points: insertQuestion.points ?? 1,
        category: insertQuestion.category
      };
      
      // Just use the original insertQuestion to avoid schema conversion issues
      const [result] = await db
        .insert(triviaQuestions)
        .values({
          ...insertQuestion
        })
        .returning();
      
      // Return the created question
      return result;
    } catch (error) {
      console.error('Error creating trivia question:', error);
      throw error;
    }
  }
  
  // Trivia Submission operations
  async getTriviaSubmissions(quizId?: number, userId?: number): Promise<TriviaSubmission[]> {
    if (quizId && userId) {
      return db
        .select()
        .from(triviaSubmissions)
        .where(
          and(
            eq(triviaSubmissions.quizId, quizId),
            eq(triviaSubmissions.userId, userId)
          )
        );
    } else if (quizId) {
      return db
        .select()
        .from(triviaSubmissions)
        .where(eq(triviaSubmissions.quizId, quizId));
    } else if (userId) {
      return db
        .select()
        .from(triviaSubmissions)
        .where(eq(triviaSubmissions.userId, userId));
    }
    return db.select().from(triviaSubmissions);
  }
  
  async getTriviaSubmission(id: number): Promise<TriviaSubmission | undefined> {
    const [submission] = await db
      .select()
      .from(triviaSubmissions)
      .where(eq(triviaSubmissions.id, id));
    return submission;
  }
  
  async createTriviaSubmission(insertSubmission: InsertTriviaSubmission): Promise<TriviaSubmission> {
    const [submission] = await db
      .insert(triviaSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }
  
  async updateTriviaSubmission(submissionId: number, data: Partial<InsertTriviaSubmission>): Promise<boolean> {
    const result = await db
      .update(triviaSubmissions)
      .set(data)
      .where(eq(triviaSubmissions.id, submissionId));
    
    return (result.rowCount || 0) > 0;
  }
  
  async getUserTriviaSubmission(userId: number, quizId: number): Promise<TriviaSubmission | undefined> {
    const [submission] = await db
      .select()
      .from(triviaSubmissions)
      .where(
        and(
          eq(triviaSubmissions.userId, userId),
          eq(triviaSubmissions.quizId, quizId)
        )
      );
    return submission;
  }
  
  // Trivia Answer operations
  async getTriviaAnswers(submissionId: number): Promise<TriviaAnswer[]> {
    return db
      .select()
      .from(triviaAnswers)
      .where(eq(triviaAnswers.submissionId, submissionId));
  }
  
  async createTriviaAnswer(insertAnswer: InsertTriviaAnswer): Promise<TriviaAnswer> {
    const [answer] = await db
      .insert(triviaAnswers)
      .values(insertAnswer)
      .returning();
    return answer;
  }
  
  async calculateTriviaScore(submissionId: number): Promise<number> {
    // Get all the answers for this submission
    const answers = await this.getTriviaAnswers(submissionId);
    
    // Calculate the score by counting correct answers
    const score = answers.reduce((total, answer) => {
      return total + (answer.isCorrect ? 1 : 0);
    }, 0);
    
    // Update the submission with the calculated score
    await db
      .update(triviaSubmissions)
      .set({ score, completed: true })
      .where(eq(triviaSubmissions.id, submissionId));
    
    return score;
  }
  
  async claimTriviaReward(submissionId: number): Promise<boolean> {
    // Get the submission
    const submission = await this.getTriviaSubmission(submissionId);
    if (!submission || !submission.completed || submission.rewardClaimed) {
      return false;
    }
    
    // Get the quiz to determine the reward amount
    const quiz = await this.getTriviaQuiz(submission.quizId);
    if (!quiz) {
      return false;
    }
    
    // Calculate the reward based on the score and the quiz reward amount
    // For now, simply award the full amount if they got any questions right
    if (submission.score > 0) {
      // Mark the reward as claimed
      await db
        .update(triviaSubmissions)
        .set({ rewardClaimed: true })
        .where(eq(triviaSubmissions.id, submissionId));
      
      // In a real implementation, we would also give the tokens to the user here
      // For now, just return true to indicate success
      return true;
    }
    
    return false;
  }
  
  // Spin Wheel operations
  async getSpinWheelRewards(activeOnly: boolean = false): Promise<SpinWheelReward[]> {
    if (activeOnly) {
      return db.select().from(spinWheelRewards).where(eq(spinWheelRewards.isActive, true));
    }
    return db.select().from(spinWheelRewards);
  }
  
  async getSpinWheelReward(id: number): Promise<SpinWheelReward | undefined> {
    const [reward] = await db.select().from(spinWheelRewards).where(eq(spinWheelRewards.id, id));
    return reward;
  }
  
  async createSpinWheelReward(insertReward: InsertSpinWheelReward): Promise<SpinWheelReward> {
    const [reward] = await db
      .insert(spinWheelRewards)
      .values(insertReward)
      .returning();
    return reward;
  }
  
  async getUserSpins(userId: number): Promise<UserSpin[]> {
    return db.select().from(userSpins).where(eq(userSpins.userId, userId));
  }
  
  async createUserSpin(insertUserSpin: InsertUserSpin): Promise<UserSpin> {
    const [spin] = await db
      .insert(userSpins)
      .values(insertUserSpin)
      .returning();
    return spin;
  }
  
  async claimSpinReward(spinId: number, transactionHash: string): Promise<boolean> {
    const [spin] = await db.select().from(userSpins).where(eq(userSpins.id, spinId));
    if (!spin || spin.claimed) {
      return false;
    }
    
    await db
      .update(userSpins)
      .set({ 
        claimed: true, 
        claimedDate: new Date(), 
        transactionHash 
      })
      .where(eq(userSpins.id, spinId));
    
    return true;
  }
  
  // Marketplace operations
  async getMarketplaceListings(activeOnly: boolean = false): Promise<MarketplaceListing[]> {
    if (activeOnly) {
      return db
        .select()
        .from(marketplaceListings)
        .where(eq(marketplaceListings.status, "active"))
        .orderBy(marketplaceListings.sortOrder);
    }
    return db.select().from(marketplaceListings).orderBy(marketplaceListings.sortOrder);
  }
  
  async getMarketplaceListing(id: number): Promise<MarketplaceListing | undefined> {
    const [listing] = await db.select().from(marketplaceListings).where(eq(marketplaceListings.id, id));
    return listing;
  }
  
  async createMarketplaceListing(insertListing: InsertMarketplaceListing): Promise<MarketplaceListing> {
    const [listing] = await db
      .insert(marketplaceListings)
      .values(insertListing)
      .returning();
    return listing;
  }
  
  // Staking operations
  async getStakingPools(activeOnly: boolean = false): Promise<StakingPool[]> {
    if (activeOnly) {
      return db.select().from(stakingPools).where(eq(stakingPools.isActive, true));
    }
    return db.select().from(stakingPools);
  }
  
  async getStakingPool(id: number): Promise<StakingPool | undefined> {
    const [pool] = await db.select().from(stakingPools).where(eq(stakingPools.id, id));
    return pool;
  }
  
  async createStakingPool(insertPool: InsertStakingPool): Promise<StakingPool> {
    const [pool] = await db
      .insert(stakingPools)
      .values(insertPool)
      .returning();
    return pool;
  }
  
  async getUserStakes(userId: number): Promise<UserStake[]> {
    return db.select().from(userStakes).where(eq(userStakes.userId, userId));
  }
  
  async getUserStake(id: number): Promise<UserStake | undefined> {
    const [stake] = await db.select().from(userStakes).where(eq(userStakes.id, id));
    return stake;
  }
  
  async createUserStake(insertStake: InsertUserStake): Promise<UserStake> {
    const [stake] = await db
      .insert(userStakes)
      .values(insertStake)
      .returning();
    return stake;
  }
  
  async updateUserStakeAfterClaim(stakeId: number, rewardsAmount: number): Promise<boolean> {
    try {
      const stake = await this.getUserStake(stakeId);
      if (!stake) {
        return false;
      }
      
      const now = new Date();
      const currentRewards = stake.claimedRewards || 0;
      
      await db
        .update(userStakes)
        .set({
          claimedRewards: currentRewards + rewardsAmount,
          lastClaimDate: now
        })
        .where(eq(userStakes.id, stakeId));
      
      return true;
    } catch (error) {
      console.error('Error updating user stake after claim:', error);
      return false;
    }
  }
  
  async deactivateUserStake(stakeId: number): Promise<boolean> {
    try {
      await db
        .update(userStakes)
        .set({ isActive: false })
        .where(eq(userStakes.id, stakeId));
      
      return true;
    } catch (error) {
      console.error('Error deactivating user stake:', error);
      return false;
    }
  }
  
  async updatePoolTotalStaked(poolId: number, newTotalStaked: number): Promise<boolean> {
    try {
      await db
        .update(stakingPools)
        .set({ totalStaked: newTotalStaked })
        .where(eq(stakingPools.id, poolId));
      
      return true;
    } catch (error) {
      console.error('Error updating pool total staked:', error);
      return false;
    }
  }
  
  // Referral operations
  async getReferredUsers(userId: number): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(eq(users.referrerId, userId));
  }
  
  async getUserReferralRewards(userId: number): Promise<ReferralReward[]> {
    return db
      .select()
      .from(referralRewards)
      .where(eq(referralRewards.referrerId, userId));
  }
  
  async getUserPendingReferralRewards(userId: number): Promise<ReferralReward[]> {
    return db
      .select()
      .from(referralRewards)
      .where(
        and(
          eq(referralRewards.referrerId, userId),
          eq(referralRewards.status, 'pending')
        )
      );
  }
  
  async createReferralReward(insertReward: InsertReferralReward): Promise<ReferralReward> {
    const [reward] = await db
      .insert(referralRewards)
      .values(insertReward)
      .returning();
    return reward;
  }
  
  async updateReferralRewardsStatus(rewardIds: number[], status: string): Promise<boolean> {
    try {
      for (const id of rewardIds) {
        await db
          .update(referralRewards)
          .set({ status })
          .where(eq(referralRewards.id, id));
      }
      
      return true;
    } catch (error) {
      console.error('Error updating referral rewards status:', error);
      return false;
    }
  }
  
  async updateUserReferralCode(userId: number, referralCode: string): Promise<boolean> {
    try {
      await db
        .update(users)
        .set({ referralCode })
        .where(eq(users.id, userId));
      
      return true;
    } catch (error) {
      console.error('Error updating user referral code:', error);
      return false;
    }
  }
  
  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.referralCode, referralCode));
    
    return user;
  }
  
  async updateUserReferrer(userId: number, referrerId: number): Promise<boolean> {
    try {
      await db
        .update(users)
        .set({ referrerId })
        .where(eq(users.id, userId));
      
      return true;
    } catch (error) {
      console.error('Error updating user referrer:', error);
      return false;
    }
  }
  
  // Premium membership operations
  async getPremiumTiers(): Promise<PremiumTier[]> {
    return db.select().from(premiumTiers);
  }
  
  async getPremiumTier(id: number): Promise<PremiumTier | undefined> {
    const [tier] = await db.select().from(premiumTiers).where(eq(premiumTiers.id, id));
    return tier;
  }
  
  async createPremiumTier(insertTier: InsertPremiumTier): Promise<PremiumTier> {
    const [tier] = await db
      .insert(premiumTiers)
      .values(insertTier)
      .returning();
    return tier;
  }
  
  async updateUserPremiumTier(userId: number, tierId: number): Promise<boolean> {
    try {
      await db
        .update(users)
        .set({ premiumTier: tierId })
        .where(eq(users.id, userId));
      
      return true;
    } catch (error) {
      console.error('Error updating user premium tier:', error);
      return false;
    }
  }
  
  // User token balance operations
  async updateUserTokenBalance(userId: number, newBalance: number): Promise<boolean> {
    try {
      await db
        .update(users)
        .set({ tokenBalance: newBalance })
        .where(eq(users.id, userId));
      
      return true;
    } catch (error) {
      console.error('Error updating user token balance:', error);
      return false;
    }
  }
  
  // Mining operations
  async getMiningRigs(availableOnly: boolean = false): Promise<MiningRig[]> {
    if (availableOnly) {
      return db
        .select()
        .from(miningRigs)
        .where(eq(miningRigs.isAvailable, true))
        .orderBy(miningRigs.sortOrder);
    }
    return db.select().from(miningRigs).orderBy(miningRigs.sortOrder);
  }
  
  async getMiningRig(id: number): Promise<MiningRig | undefined> {
    const [rig] = await db.select().from(miningRigs).where(eq(miningRigs.id, id));
    return rig;
  }
  
  async createMiningRig(insertRig: InsertMiningRig): Promise<MiningRig> {
    const [rig] = await db
      .insert(miningRigs)
      .values(insertRig)
      .returning();
    return rig;
  }
  
  async getUserMiningRigs(userId: number): Promise<UserMiningRig[]> {
    return db.select().from(userMiningRigs).where(eq(userMiningRigs.userId, userId));
  }
  
  async getUserMiningRigsWithDetails(userId: number): Promise<(UserMiningRig & { rig: MiningRig })[]> {
    const userRigs = await db.select().from(userMiningRigs).where(eq(userMiningRigs.userId, userId));
    
    const rigsWithDetails = await Promise.all(
      userRigs.map(async (userRig) => {
        const [rig] = await db.select().from(miningRigs).where(eq(miningRigs.id, userRig.rigId));
        return { ...userRig, rig };
      })
    );
    
    return rigsWithDetails;
  }
  
  async getUserMiningRig(id: number): Promise<UserMiningRig | undefined> {
    const [userRig] = await db.select().from(userMiningRigs).where(eq(userMiningRigs.id, id));
    return userRig;
  }
  
  async createUserMiningRig(insertUserRig: InsertUserMiningRig): Promise<UserMiningRig> {
    const [userRig] = await db
      .insert(userMiningRigs)
      .values(insertUserRig)
      .returning();
    return userRig;
  }
  
  async updateUserMiningRigStatus(userRigId: number, isActive: boolean): Promise<boolean> {
    try {
      await db
        .update(userMiningRigs)
        .set({ isActive })
        .where(eq(userMiningRigs.id, userRigId));
      
      return true;
    } catch (error) {
      console.error('Error updating user mining rig status:', error);
      return false;
    }
  }
  
  async updateLastRewardDate(userRigId: number): Promise<boolean> {
    try {
      await db
        .update(userMiningRigs)
        .set({ lastRewardDate: new Date() })
        .where(eq(userMiningRigs.id, userRigId));
      
      return true;
    } catch (error) {
      console.error('Error updating last reward date:', error);
      return false;
    }
  }
  
  async updateTotalMined(userRigId: number, newTotal: number): Promise<boolean> {
    try {
      await db
        .update(userMiningRigs)
        .set({ totalMined: newTotal })
        .where(eq(userMiningRigs.id, userRigId));
      
      return true;
    } catch (error) {
      console.error('Error updating total mined:', error);
      return false;
    }
  }
  
  async getMiningRewards(userId?: number, userRigId?: number): Promise<MiningReward[]> {
    let query = db.select().from(miningRewards);
    
    if (userId) {
      query = query.where(eq(miningRewards.userId, userId));
    }
    
    if (userRigId) {
      query = query.where(eq(miningRewards.userRigId, userRigId));
    }
    
    return query;
  }
  
  async getMiningReward(id: number): Promise<MiningReward | undefined> {
    const [reward] = await db.select().from(miningRewards).where(eq(miningRewards.id, id));
    return reward;
  }
  
  async createMiningReward(insertReward: InsertMiningReward): Promise<MiningReward> {
    const [reward] = await db
      .insert(miningRewards)
      .values(insertReward)
      .returning();
    return reward;
  }

  // ChonkPad Token Launch operations
  async getTokenLaunches(status?: string): Promise<TokenLaunch[]> {
    if (status) {
      return db.select().from(tokenLaunches).where(eq(tokenLaunches.status, status));
    }
    return db.select().from(tokenLaunches);
  }
  
  async getTokenLaunch(id: number): Promise<TokenLaunch | undefined> {
    const [launch] = await db.select().from(tokenLaunches).where(eq(tokenLaunches.id, id));
    return launch;
  }
  
  async createTokenLaunch(insertLaunch: InsertTokenLaunch): Promise<TokenLaunch> {
    const [launch] = await db
      .insert(tokenLaunches)
      .values(insertLaunch)
      .returning();
    return launch;
  }
  
  async updateTokenLaunchStatus(id: number, status: string): Promise<TokenLaunch | undefined> {
    const [updatedLaunch] = await db
      .update(tokenLaunches)
      .set({ status })
      .where(eq(tokenLaunches.id, id))
      .returning();
    return updatedLaunch;
  }
  
  async updateTokenLaunchCurrentRaise(id: number, additionalAmount: number): Promise<boolean> {
    try {
      const launch = await this.getTokenLaunch(id);
      if (!launch) {
        return false;
      }
      
      const currentRaise = (launch.currentRaise || 0) + additionalAmount;
      
      await db
        .update(tokenLaunches)
        .set({ currentRaise })
        .where(eq(tokenLaunches.id, id));
      
      return true;
    } catch (error) {
      console.error('Error updating token launch current raise:', error);
      return false;
    }
  }
  
  // ChonkPad User Investment operations
  async getUserInvestments(userId: number): Promise<UserInvestment[]> {
    return db.select().from(userInvestments).where(eq(userInvestments.userId, userId));
  }
  
  async getUserInvestment(id: number): Promise<UserInvestment | undefined> {
    const [investment] = await db.select().from(userInvestments).where(eq(userInvestments.id, id));
    return investment;
  }
  
  async createUserInvestment(insertInvestment: InsertUserInvestment): Promise<UserInvestment> {
    const [investment] = await db
      .insert(userInvestments)
      .values(insertInvestment)
      .returning();
    return investment;
  }

  // Unstoppable Domain operations
  async getAllUnstoppableDomains(): Promise<UnstoppableDomainNFT[]> {
    return db.select().from(unstoppableDomainNFTs);
  }
  
  async getUserUnstoppableDomains(userId: number): Promise<UnstoppableDomainNFT[]> {
    return db.select().from(unstoppableDomainNFTs).where(eq(unstoppableDomainNFTs.userId, userId));
  }
  
  async getUnstoppableDomain(id: number): Promise<UnstoppableDomainNFT | undefined> {
    const [domain] = await db.select().from(unstoppableDomainNFTs).where(eq(unstoppableDomainNFTs.id, id));
    return domain;
  }
  
  async getUnstoppableDomainByName(domainName: string): Promise<UnstoppableDomainNFT | undefined> {
    const [domain] = await db.select().from(unstoppableDomainNFTs).where(eq(unstoppableDomainNFTs.domainName, domainName));
    return domain;
  }
  
  async createUnstoppableDomain(insertDomain: InsertUnstoppableDomainNFT): Promise<UnstoppableDomainNFT> {
    const [domain] = await db
      .insert(unstoppableDomainNFTs)
      .values(insertDomain)
      .returning();
    return domain;
  }
  
  async verifyUnstoppableDomain(id: number): Promise<boolean> {
    try {
      await db
        .update(unstoppableDomainNFTs)
        .set({ verified: true })
        .where(eq(unstoppableDomainNFTs.id, id));
      return true;
    } catch (error) {
      console.error('Error verifying Unstoppable Domain:', error);
      return false;
    }
  }
  
  async getUnstoppableDomainBenefits(domainId: number): Promise<UnstoppableDomainBenefit[]> {
    return db.select().from(unstoppableDomainBenefits).where(eq(unstoppableDomainBenefits.domainId, domainId));
  }
  
  async createUnstoppableDomainBenefit(insertBenefit: InsertUnstoppableDomainBenefit): Promise<UnstoppableDomainBenefit> {
    const [benefit] = await db
      .insert(unstoppableDomainBenefits)
      .values(insertBenefit)
      .returning();
    return benefit;
  }
  
  async updateUserUnstoppableDomainPreference(userId: number, useAsUsername: boolean): Promise<boolean> {
    try {
      await db
        .update(users)
        .set({ useUnstoppableDomainAsUsername: useAsUsername })
        .where(eq(users.id, userId));
      return true;
    } catch (error) {
      console.error('Error updating user Unstoppable Domain preference:', error);
      return false;
    }
  }

  // Implementation of Learning Module methods
  async getLearningModules(categoryFilter?: string, activeOnly?: boolean): Promise<LearningModule[]> {
    try {
      let query = db.select().from(learningModules);
    
      if (categoryFilter) {
        query = query.where(eq(learningModules.category, categoryFilter));
      }
    
      if (activeOnly) {
        query = query.where(eq(learningModules.isActive, true));
      }
    
      return query.orderBy(learningModules.order);
    } catch (error) {
      console.error('Error fetching learning modules:', error);
      return [];
    }
  }
  
  async getLearningModule(id: number): Promise<LearningModule | undefined> {
    try {
      const [module] = await db.select().from(learningModules).where(eq(learningModules.id, id));
      return module;
    } catch (error) {
      console.error(`Error fetching learning module ${id}:`, error);
      return undefined;
    }
  }
  
  async createLearningModule(insertModule: InsertLearningModule): Promise<LearningModule> {
    const [module] = await db
      .insert(learningModules)
      .values(insertModule)
      .returning();
    return module;
  }
  
  async updateLearningModule(id: number, partialModule: Partial<InsertLearningModule>): Promise<LearningModule | undefined> {
    try {
      const [updatedModule] = await db
        .update(learningModules)
        .set(partialModule)
        .where(eq(learningModules.id, id))
        .returning();
      return updatedModule;
    } catch (error) {
      console.error(`Error updating learning module ${id}:`, error);
      return undefined;
    }
  }
  
  // Implementation of Learning Lesson methods
  async getLearningLessons(moduleId: number): Promise<LearningLesson[]> {
    try {
      return db
        .select()
        .from(learningLessons)
        .where(eq(learningLessons.moduleId, moduleId))
        .orderBy(learningLessons.order);
    } catch (error) {
      console.error(`Error fetching lessons for module ${moduleId}:`, error);
      return [];
    }
  }
  
  async getLearningLesson(id: number): Promise<LearningLesson | undefined> {
    try {
      const [lesson] = await db.select().from(learningLessons).where(eq(learningLessons.id, id));
      return lesson;
    } catch (error) {
      console.error(`Error fetching learning lesson ${id}:`, error);
      return undefined;
    }
  }
  
  async createLearningLesson(insertLesson: InsertLearningLesson): Promise<LearningLesson> {
    const [lesson] = await db
      .insert(learningLessons)
      .values(insertLesson)
      .returning();
    return lesson;
  }
  
  async updateLearningLesson(id: number, partialLesson: Partial<InsertLearningLesson>): Promise<LearningLesson | undefined> {
    try {
      const [updatedLesson] = await db
        .update(learningLessons)
        .set(partialLesson)
        .where(eq(learningLessons.id, id))
        .returning();
      return updatedLesson;
    } catch (error) {
      console.error(`Error updating learning lesson ${id}:`, error);
      return undefined;
    }
  }

  // Implementation of User Module Progress methods
  async getUserModuleProgress(userId: number, moduleId?: number): Promise<UserModuleProgress[]> {
    try {
      let query = db.select().from(userModuleProgress).where(eq(userModuleProgress.userId, userId));
      
      if (moduleId) {
        query = query.where(eq(userModuleProgress.moduleId, moduleId));
      }
      
      return query;
    } catch (error) {
      console.error(`Error fetching module progress for user ${userId}:`, error);
      return [];
    }
  }
  
  async getUserModuleProgressDetail(id: number): Promise<UserModuleProgress | undefined> {
    try {
      const [progress] = await db.select().from(userModuleProgress).where(eq(userModuleProgress.id, id));
      return progress;
    } catch (error) {
      console.error(`Error fetching module progress detail ${id}:`, error);
      return undefined;
    }
  }
  
  async createUserModuleProgress(insertProgress: InsertUserModuleProgress): Promise<UserModuleProgress> {
    const [progress] = await db
      .insert(userModuleProgress)
      .values({
        ...insertProgress,
        startedAt: new Date(),
        percentComplete: 0
      })
      .returning();
    return progress;
  }
  
  async updateUserModuleProgress(id: number, percentComplete: number, lastLessonId?: number, pointsEarned?: number, timeSpentMinutes?: number): Promise<UserModuleProgress | undefined> {
    try {
      const updateData: any = { percentComplete };
      
      if (lastLessonId) updateData.lastLessonId = lastLessonId;
      if (pointsEarned !== undefined) updateData.pointsEarned = pointsEarned;
      if (timeSpentMinutes !== undefined) updateData.timeSpentMinutes = timeSpentMinutes;
      
      const [updatedProgress] = await db
        .update(userModuleProgress)
        .set(updateData)
        .where(eq(userModuleProgress.id, id))
        .returning();
      return updatedProgress;
    } catch (error) {
      console.error(`Error updating module progress ${id}:`, error);
      return undefined;
    }
  }
  
  async completeUserModuleProgress(id: number): Promise<UserModuleProgress | undefined> {
    try {
      const now = new Date();
      const [completedProgress] = await db
        .update(userModuleProgress)
        .set({
          percentComplete: 100,
          completedAt: now,
          isCompleted: true
        })
        .where(eq(userModuleProgress.id, id))
        .returning();
      return completedProgress;
    } catch (error) {
      console.error(`Error completing module progress ${id}:`, error);
      return undefined;
    }
  }
  
  // Implementation of User Lesson Progress methods
  async getUserLessonProgress(userId: number, moduleId?: number, lessonId?: number): Promise<UserLessonProgress[]> {
    try {
      let query = db.select().from(userLessonProgress).where(eq(userLessonProgress.userId, userId));
      
      if (moduleId) {
        query = query.where(eq(userLessonProgress.moduleId, moduleId));
      }
      
      if (lessonId) {
        query = query.where(eq(userLessonProgress.lessonId, lessonId));
      }
      
      return query;
    } catch (error) {
      console.error(`Error fetching lesson progress for user ${userId}:`, error);
      return [];
    }
  }
  
  async getUserLessonProgressDetail(id: number): Promise<UserLessonProgress | undefined> {
    try {
      const [progress] = await db.select().from(userLessonProgress).where(eq(userLessonProgress.id, id));
      return progress;
    } catch (error) {
      console.error(`Error fetching lesson progress detail ${id}:`, error);
      return undefined;
    }
  }
  
  async createUserLessonProgress(insertProgress: InsertUserLessonProgress): Promise<UserLessonProgress> {
    const [progress] = await db
      .insert(userLessonProgress)
      .values({
        ...insertProgress,
        startedAt: new Date()
      })
      .returning();
    return progress;
  }
  
  async updateUserLessonProgress(id: number, timeSpentMinutes?: number, pointsEarned?: number): Promise<UserLessonProgress | undefined> {
    try {
      const updateData: any = {};
      
      if (timeSpentMinutes !== undefined) updateData.timeSpentMinutes = timeSpentMinutes;
      if (pointsEarned !== undefined) updateData.pointsEarned = pointsEarned;
      
      const [updatedProgress] = await db
        .update(userLessonProgress)
        .set(updateData)
        .where(eq(userLessonProgress.id, id))
        .returning();
      return updatedProgress;
    } catch (error) {
      console.error(`Error updating lesson progress ${id}:`, error);
      return undefined;
    }
  }
  
  async completeUserLessonProgress(id: number): Promise<UserLessonProgress | undefined> {
    try {
      const now = new Date();
      const [completedProgress] = await db
        .update(userLessonProgress)
        .set({
          completedAt: now,
          isCompleted: true
        })
        .where(eq(userLessonProgress.id, id))
        .returning();
      return completedProgress;
    } catch (error) {
      console.error(`Error completing lesson progress ${id}:`, error);
      return undefined;
    }
  }

  // Social Sharing operations implementation
  async getUserSocialShares(userId: number): Promise<SocialShare[]> {
    try {
      return db
        .select()
        .from(socialShares)
        .where(eq(socialShares.userId, userId))
        .orderBy(desc(socialShares.sharedAt));
    } catch (error) {
      console.error(`Error fetching social shares for user ${userId}:`, error);
      return [];
    }
  }
  
  async getSocialShare(id: number): Promise<SocialShare | undefined> {
    try {
      const [share] = await db.select().from(socialShares).where(eq(socialShares.id, id));
      return share;
    } catch (error) {
      console.error(`Error fetching social share ${id}:`, error);
      return undefined;
    }
  }
  
  async createSocialShare(insertShare: InsertSocialShare): Promise<SocialShare> {
    const [share] = await db
      .insert(socialShares)
      .values({
        ...insertShare,
        sharedAt: new Date()
      })
      .returning();
    return share;
  }
  
  async updateSocialShareEngagement(id: number, metrics: { likes?: number, comments?: number, shares?: number, clicks?: number }): Promise<SocialShare | undefined> {
    try {
      const [share] = await db.select().from(socialShares).where(eq(socialShares.id, id));
      if (!share) return undefined;
      
      const updateData: any = {};
      
      if (metrics.likes !== undefined) updateData.likesCount = (share.likesCount || 0) + metrics.likes;
      if (metrics.comments !== undefined) updateData.commentsCount = (share.commentsCount || 0) + metrics.comments;
      if (metrics.shares !== undefined) updateData.sharesCount = (share.sharesCount || 0) + metrics.shares;
      if (metrics.clicks !== undefined) updateData.clicksCount = (share.clicksCount || 0) + metrics.clicks;
      
      const [updatedShare] = await db
        .update(socialShares)
        .set(updateData)
        .where(eq(socialShares.id, id))
        .returning();
      return updatedShare;
    } catch (error) {
      console.error(`Error updating social share engagement ${id}:`, error);
      return undefined;
    }
  }

  // Learning Achievements operations implementation
  async getUserLearningAchievements(userId: number): Promise<LearningAchievement[]> {
    try {
      return db
        .select()
        .from(learningAchievements)
        .where(eq(learningAchievements.userId, userId))
        .orderBy(desc(learningAchievements.achievedAt));
    } catch (error) {
      console.error(`Error fetching learning achievements for user ${userId}:`, error);
      return [];
    }
  }
  
  async getLearningAchievement(id: number): Promise<LearningAchievement | undefined> {
    try {
      const [achievement] = await db.select().from(learningAchievements).where(eq(learningAchievements.id, id));
      return achievement;
    } catch (error) {
      console.error(`Error fetching learning achievement ${id}:`, error);
      return undefined;
    }
  }
  
  async createLearningAchievement(insertAchievement: InsertLearningAchievement): Promise<LearningAchievement> {
    const [achievement] = await db
      .insert(learningAchievements)
      .values({
        ...insertAchievement,
        achievedAt: new Date()
      })
      .returning();
    return achievement;
  }

  // User Learning Stats operations implementation
  async getUserLearningStats(userId: number): Promise<UserLearningStats | undefined> {
    try {
      const [stats] = await db.select().from(userLearningStats).where(eq(userLearningStats.userId, userId));
      return stats;
    } catch (error) {
      console.error(`Error fetching learning stats for user ${userId}:`, error);
      return undefined;
    }
  }
  
  async createUserLearningStats(insertStats: InsertUserLearningStats): Promise<UserLearningStats> {
    const now = new Date();
    const [stats] = await db
      .insert(userLearningStats)
      .values({
        ...insertStats,
        lastActive: now,
        updatedAt: now
      })
      .returning();
    return stats;
  }
  
  async updateUserLearningStats(userId: number, partialStats: Partial<InsertUserLearningStats>): Promise<UserLearningStats | undefined> {
    try {
      const now = new Date();
      const [updatedStats] = await db
        .update(userLearningStats)
        .set({
          ...partialStats,
          lastActive: now,
          updatedAt: now
        })
        .where(eq(userLearningStats.userId, userId))
        .returning();
      return updatedStats;
    } catch (error) {
      console.error(`Error updating learning stats for user ${userId}:`, error);
      return undefined;
    }
  }
  
  async updateUserLearningStreak(userId: number, increment: boolean = true): Promise<UserLearningStats | undefined> {
    try {
      const [stats] = await db.select().from(userLearningStats).where(eq(userLearningStats.userId, userId));
      if (!stats) return undefined;
      
      // Check if this is a new day from the user's last activity
      const now = new Date();
      const lastActive = stats.lastActive;
      const isNewDay = lastActive && (
        now.getDate() !== lastActive.getDate() ||
        now.getMonth() !== lastActive.getMonth() ||
        now.getFullYear() !== lastActive.getFullYear()
      );
      
      let currentStreak = stats.currentStreak || 0;
      let longestStreak = stats.longestStreak || 0;
      
      if (increment && isNewDay) {
        // Increment the streak for a new day
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else if (!increment) {
        // Reset streak (user explicitly opted to reset)
        currentStreak = 0;
      }
      
      const [updatedStats] = await db
        .update(userLearningStats)
        .set({
          currentStreak,
          longestStreak,
          lastActive: now,
          updatedAt: now
        })
        .where(eq(userLearningStats.userId, userId))
        .returning();
      return updatedStats;
    } catch (error) {
      console.error(`Error updating learning streak for user ${userId}:`, error);
      return undefined;
    }
  }
  // Token Faucet operations
  async recordTokenClaim(userId: number, amount: number): Promise<TokenClaim> {
    try {
      const [claim] = await db
        .insert(tokenClaims)
        .values({
          userId,
          amount,
        })
        .returning();
      return claim;
    } catch (error) {
      console.error('Error recording token claim:', error);
      throw error;
    }
  }

  async getLastTokenClaim(userId: number): Promise<TokenClaim | undefined> {
    try {
      const [lastClaim] = await db
        .select()
        .from(tokenClaims)
        .where(eq(tokenClaims.userId, userId))
        .orderBy(desc(tokenClaims.claimedAt))
        .limit(1);
      
      return lastClaim;
    } catch (error) {
      console.error(`Error fetching last token claim for user ${userId}:`, error);
      return undefined;
    }
  }

  async getUserTokenClaims(userId: number): Promise<TokenClaim[]> {
    try {
      return db
        .select()
        .from(tokenClaims)
        .where(eq(tokenClaims.userId, userId))
        .orderBy(desc(tokenClaims.claimedAt));
    } catch (error) {
      console.error(`Error fetching token claims for user ${userId}:`, error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();
export { db }; // Exporting db for direct access when needed

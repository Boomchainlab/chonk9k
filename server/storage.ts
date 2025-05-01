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
  premiumTiers, type PremiumTier, type InsertPremiumTier
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
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
}

export const storage = new DatabaseStorage();

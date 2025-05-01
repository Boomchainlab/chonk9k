import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import crypto from "crypto";
import { storage } from "./storage";
import { 
  insertBadgeSchema, 
  insertUserBadgeSchema, 
  insertTriviaQuizSchema, 
  insertTriviaQuestionSchema,
  insertTriviaSubmissionSchema,
  insertTriviaAnswerSchema,
  insertMarketplaceListingSchema
} from "@shared/schema";
import { coinMarketCapService } from "./coinmarketcap";
import { z } from "zod";
import { 
  insertStakingPoolSchema,
  insertUserStakeSchema,
  insertReferralRewardSchema,
  insertPremiumTierSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isActive: true
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
      if (pool) {
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

  const httpServer = createServer(app);

  return httpServer;
}

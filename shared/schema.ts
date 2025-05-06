import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, varchar, json, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  verificationToken: varchar("verification_token", { length: 255 }),
  isVerified: boolean("is_verified").default(false),
  lastLoginAt: timestamp("last_login_at"),
  lastActiveAt: timestamp("last_active_at"),
  walletAddress: varchar("wallet_address", { length: 255 }).unique(),
  unstoppableDomain: varchar("unstoppable_domain", { length: 255 }).unique(),
  referralCode: varchar("referral_code", { length: 20 }).unique(),
  referrerId: integer("referrer_id").references(() => users.id),
  tokenBalance: doublePrecision("token_balance").default(0),
  stakingBalance: doublePrecision("staking_balance").default(0),
  stakingStartDate: timestamp("staking_start_date"),
  stakingEndDate: timestamp("staking_end_date"),
  premiumTier: integer("premium_tier").default(0),
  useUnstoppableDomainAsUsername: boolean("use_unstoppable_domain_as_username").default(false),
  // MFA-related fields
  mfaEnabled: boolean("mfa_enabled").default(false),
  mfaSecret: varchar("mfa_secret", { length: 255 }),
  mfaRecoveryCodes: json("mfa_recovery_codes").$type<string[]>(),
  lastSecurityUpdate: timestamp("last_security_update"),
  securityPreferences: json("security_preferences").$type<{
    loginNotifications: boolean;
    securityEvents: boolean;
    passwordExpiryDays: number;
  }>().default({
    loginNotifications: true,
    securityEvents: true,
    passwordExpiryDays: 90,
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tokenStats = pgTable("token_stats", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  change: text("change"),
  changePercentage: doublePrecision("change_percentage"),
  period: text("period"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  twitterUrl: text("twitter_url"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  telegramUrl: text("telegram_url"),
  mediumUrl: text("medium_url"),
  instagramUrl: text("instagram_url")
});

export const roadmapItems = pgTable("roadmap_items", {
  id: serial("id").primaryKey(),
  phase: text("phase").notNull(),
  title: text("title").notNull(),
  period: text("period").notNull(),
  items: text("items").array(),
  completed: boolean("completed").default(false),
});

export const tokenPurchases = pgTable("token_purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  amountEth: doublePrecision("amount_eth").notNull(),
  amountTokens: doublePrecision("amount_tokens").notNull(),
  transactionHash: varchar("transaction_hash", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  purchaseDate: timestamp("purchase_date").defaultNow(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  requirement: text("requirement").notNull(),
  requirementValue: integer("requirement_value").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  rarity: varchar("rarity", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  badgeId: integer("badge_id").references(() => badges.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
  displayed: boolean("displayed").default(true),
});

// Trivia-related tables
export const triviaQuizzes = pgTable("trivia_quizzes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  rewardAmount: doublePrecision("reward_amount").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  difficulty: varchar("difficulty", { length: 50 }).notNull(), // easy, medium, hard
  createdAt: timestamp("created_at").defaultNow(),
});

export const triviaQuestions = pgTable("trivia_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => triviaQuizzes.id).notNull(),
  question: text("question").notNull(),
  options: json("options").$type<string[]>().notNull(), // Array of possible answers
  correctAnswer: integer("correct_answer").notNull(), // Index of the correct answer in the options array
  explanation: text("explanation"),
  points: integer("points").default(1).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // e.g., "blockchain", "defi", "nft", etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const triviaSubmissions = pgTable("trivia_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  quizId: integer("quiz_id").references(() => triviaQuizzes.id).notNull(),
  score: integer("score").notNull(),
  completed: boolean("completed").default(false),
  rewardClaimed: boolean("reward_claimed").default(false),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const triviaAnswers = pgTable("trivia_answers", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id").references(() => triviaSubmissions.id).notNull(),
  questionId: integer("question_id").references(() => triviaQuestions.id).notNull(),
  selectedAnswer: integer("selected_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Spin Wheel Rewards
export const spinWheelRewards = pgTable("spin_wheel_rewards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  tokenAmount: doublePrecision("token_amount"),
  probability: doublePrecision("probability").notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Spin History
export const userSpins = pgTable("user_spins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rewardId: integer("reward_id").references(() => spinWheelRewards.id).notNull(),
  spinDate: timestamp("spin_date").defaultNow(),
  claimed: boolean("claimed").default(false),
  claimedDate: timestamp("claimed_date"),
  transactionHash: varchar("transaction_hash", { length: 255 }),
});

// Marketplace Listings
export const marketplaceListings = pgTable("marketplace_listings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  logo: varchar("logo", { length: 255 }).notNull(),
  description: text("description"),
  tradingPair: varchar("trading_pair", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  listedDate: date("listed_date").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Staking Pools
export const stakingPools = pgTable("staking_pools", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  apr: doublePrecision("apr").notNull(),
  minStakeAmount: doublePrecision("min_stake_amount").notNull(),
  lockPeriodDays: integer("lock_period_days").notNull(),
  totalStaked: doublePrecision("total_staked").default(0),
  maxCapacity: doublePrecision("max_capacity"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Stakes
export const userStakes = pgTable("user_stakes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  poolId: integer("pool_id").references(() => stakingPools.id).notNull(),
  amount: doublePrecision("amount").notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date").notNull(),
  claimedRewards: doublePrecision("claimed_rewards").default(0),
  isActive: boolean("is_active").default(true),
  lastClaimDate: timestamp("last_claim_date"),
  transactionHash: varchar("transaction_hash", { length: 255 }),
});

// Referral Rewards
export const referralRewards = pgTable("referral_rewards", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").references(() => users.id).notNull(),
  referredId: integer("referred_id").references(() => users.id).notNull(),
  amount: doublePrecision("amount").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  transactionHash: varchar("transaction_hash", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Premium Membership Tiers
export const premiumTiers = pgTable("premium_tiers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  tokenRequirement: doublePrecision("token_requirement").notNull(),
  stakingBonus: doublePrecision("staking_bonus").notNull(),
  referralBonus: doublePrecision("referral_bonus").notNull(),
  spinMultiplier: integer("spin_multiplier").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mining Rigs
export const miningRigs = pgTable("mining_rigs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  hashRate: doublePrecision("hash_rate").notNull(),
  powerConsumption: doublePrecision("power_consumption").notNull(), // in watts
  price: doublePrecision("price").notNull(),
  isAvailable: boolean("is_available").default(true),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

// User Mining Rigs
export const userMiningRigs = pgTable("user_mining_rigs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  rigId: integer("rig_id").notNull().references(() => miningRigs.id),
  purchaseDate: timestamp("purchase_date").defaultNow(),
  lastRewardDate: timestamp("last_reward_date"),
  totalMined: doublePrecision("total_mined").default(0),
  isActive: boolean("is_active").default(true),
  transactionHash: varchar("transaction_hash", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow()
});

// Mining Rewards
export const miningRewards = pgTable("mining_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  userRigId: integer("user_rig_id").notNull().references(() => userMiningRigs.id),
  amount: doublePrecision("amount").notNull(),
  rewardDate: timestamp("reward_date").defaultNow(),
  transactionHash: varchar("transaction_hash", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow()
});

// Password Reset Tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expires: timestamp("expires").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Security and MFA related tables

// User devices for device management
export const userDevices = pgTable("user_devices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  deviceId: varchar("device_id", { length: 255 }).notNull(),
  deviceName: varchar("device_name", { length: 255 }),
  deviceType: varchar("device_type", { length: 50 }),
  browser: varchar("browser", { length: 100 }),
  operatingSystem: varchar("operating_system", { length: 100 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  lastLoginAt: timestamp("last_login_at").defaultNow(),
  isTrusted: boolean("is_trusted").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Active Sessions
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  deviceId: varchar("device_id", { length: 255 }),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  location: varchar("location", { length: 255 }),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  userAgent: text("user_agent"),
  isRememberMe: boolean("is_remember_me").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// TOTP Backup codes
export const mfaBackupCodes = pgTable("mfa_backup_codes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  code: varchar("code", { length: 255 }).notNull(),
  isUsed: boolean("is_used").default(false),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow()
});

// Security Event Log
export const securityEvents = pgTable("security_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  eventDescription: text("event_description").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  location: varchar("location", { length: 255 }),
  deviceId: varchar("device_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: json("metadata").$type<Record<string, any>>()
});

// Learning Modules and Courses
export const learningModules = pgTable("learning_modules", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  difficultyLevel: varchar("difficulty_level", { length: 50 }).notNull(), // beginner, intermediate, advanced
  estimatedTimeMinutes: integer("estimated_time_minutes").notNull(),
  category: varchar("category", { length: 100 }).notNull(), // blockchain, defi, nft, etc.
  imageUrl: text("image_url"),
  tags: text("tags").array(),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const learningLessons = pgTable("learning_lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => learningModules.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  mediaType: varchar("media_type", { length: 50 }), // video, image, interactive
  sortOrder: integer("sort_order").default(0),
  points: integer("points").default(10).notNull(), // points earned for completing
  isActive: boolean("is_active").default(true),
  estimatedTimeMinutes: integer("estimated_time_minutes").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userModuleProgress = pgTable("user_module_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  moduleId: integer("module_id").references(() => learningModules.id).notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  percentComplete: integer("percent_complete").default(0).notNull(),
  lastLessonId: integer("last_lesson_id").references(() => learningLessons.id),
  pointsEarned: integer("points_earned").default(0).notNull(),
  timeSpentMinutes: integer("time_spent_minutes").default(0).notNull(),
});

export const userLessonProgress = pgTable("user_lesson_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  lessonId: integer("lesson_id").references(() => learningLessons.id).notNull(),
  moduleId: integer("module_id").references(() => learningModules.id).notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  isCompleted: boolean("is_completed").default(false),
  timeSpentMinutes: integer("time_spent_minutes").default(0),
  pointsEarned: integer("points_earned").default(0),
});

// Social Sharing
export const socialShares = pgTable("social_shares", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  platform: varchar("platform", { length: 50 }).notNull(), // twitter, linkedin, facebook, etc.
  content: text("content").notNull(), 
  moduleId: integer("module_id").references(() => learningModules.id),
  lessonId: integer("lesson_id").references(() => learningLessons.id),
  badgeId: integer("badge_id").references(() => badges.id),
  shareUrl: text("share_url"),
  imageUrl: text("image_url"),
  pointsEarned: integer("points_earned").default(5).notNull(),
  sharedAt: timestamp("shared_at").defaultNow(),
  engagementMetrics: jsonb("engagement_metrics").$type<{
    likes?: number;
    comments?: number;
    shares?: number;
    clicks?: number;
  }>(),
});

// Achievements and Leaderboard data
export const learningAchievements = pgTable("learning_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementType: varchar("achievement_type", { length: 50 }).notNull(), // module_completion, sharing_milestone, streak
  moduleId: integer("module_id").references(() => learningModules.id),
  value: integer("value").default(1).notNull(), // count or value achieved
  description: text("description").notNull(),
  pointsEarned: integer("points_earned").default(0).notNull(),
  achievedAt: timestamp("achieved_at").defaultNow(),
});

export const userLearningStats = pgTable("user_learning_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  totalPointsEarned: integer("total_points_earned").default(0).notNull(),
  modulesCompleted: integer("modules_completed").default(0).notNull(),
  lessonsCompleted: integer("lessons_completed").default(0).notNull(),
  totalTimeSpentMinutes: integer("total_time_spent_minutes").default(0).notNull(),
  shareCount: integer("share_count").default(0).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastActive: timestamp("last_active").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  tokenPurchases: many(tokenPurchases),
  userBadges: many(userBadges),
  triviaSubmissions: many(triviaSubmissions),
  userSpins: many(userSpins),
  userStakes: many(userStakes),
  userMiningRigs: many(userMiningRigs),
  miningRewards: many(miningRewards),
  referredUsers: many(users, { relationName: 'referrals' }),
  referrer: one(users, {
    fields: [users.referrerId],
    references: [users.id],
    relationName: 'referrals',
  }),
  referralsGiven: many(referralRewards, { relationName: 'referrer' }),
  referralsReceived: many(referralRewards, { relationName: 'referred' }),
  // Security and MFA relations
  passwordResetTokens: many(passwordResetTokens),
  devices: many(userDevices),
  sessions: many(userSessions),
  mfaBackupCodes: many(mfaBackupCodes),
  securityEvents: many(securityEvents),
  // Learning progress relations
  moduleProgress: many(userModuleProgress),
  lessonProgress: many(userLessonProgress),
  socialShares: many(socialShares),
  learningAchievements: many(learningAchievements),
  learningStats: many(userLearningStats),
}));

export const tokenPurchasesRelations = relations(tokenPurchases, ({ one }) => ({
  user: one(users, {
    fields: [tokenPurchases.userId],
    references: [users.id],
  }),
}));

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));

export const triviaQuizzesRelations = relations(triviaQuizzes, ({ many }) => ({
  questions: many(triviaQuestions),
  submissions: many(triviaSubmissions),
}));

export const triviaQuestionsRelations = relations(triviaQuestions, ({ one, many }) => ({
  quiz: one(triviaQuizzes, {
    fields: [triviaQuestions.quizId],
    references: [triviaQuizzes.id],
  }),
  answers: many(triviaAnswers),
}));

export const triviaSubmissionsRelations = relations(triviaSubmissions, ({ one, many }) => ({
  user: one(users, {
    fields: [triviaSubmissions.userId],
    references: [users.id],
  }),
  quiz: one(triviaQuizzes, {
    fields: [triviaSubmissions.quizId],
    references: [triviaQuizzes.id],
  }),
  answers: many(triviaAnswers),
}));

export const triviaAnswersRelations = relations(triviaAnswers, ({ one }) => ({
  submission: one(triviaSubmissions, {
    fields: [triviaAnswers.submissionId],
    references: [triviaSubmissions.id],
  }),
  question: one(triviaQuestions, {
    fields: [triviaAnswers.questionId],
    references: [triviaQuestions.id],
  }),
}));

export const spinWheelRewardsRelations = relations(spinWheelRewards, ({ many }) => ({
  userSpins: many(userSpins),
}));

export const userSpinsRelations = relations(userSpins, ({ one }) => ({
  user: one(users, {
    fields: [userSpins.userId],
    references: [users.id],
  }),
  reward: one(spinWheelRewards, {
    fields: [userSpins.rewardId],
    references: [spinWheelRewards.id],
  }),
}));

// Mining relations
export const miningRigsRelations = relations(miningRigs, ({ many }) => ({
  userMiningRigs: many(userMiningRigs),
}));

export const userMiningRigsRelations = relations(userMiningRigs, ({ one, many }) => ({
  user: one(users, {
    fields: [userMiningRigs.userId],
    references: [users.id],
  }),
  rig: one(miningRigs, {
    fields: [userMiningRigs.rigId],
    references: [miningRigs.id],
  }),
  rewards: many(miningRewards),
}));

export const miningRewardsRelations = relations(miningRewards, ({ one }) => ({
  user: one(users, {
    fields: [miningRewards.userId],
    references: [users.id],
  }),
  userRig: one(userMiningRigs, {
    fields: [miningRewards.userRigId],
    references: [userMiningRigs.id],
  }),
}));

// Token Launches for ChonkPad
export const tokenLaunches = pgTable("token_launches", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  symbol: varchar("symbol", { length: 20 }).notNull(),
  logo: text("logo").notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 20 }).notNull().default('upcoming'),
  launchDate: timestamp("launch_date").notNull(),
  endDate: timestamp("end_date"),
  tokenPrice: doublePrecision("token_price").notNull(),
  totalRaise: doublePrecision("total_raise").notNull(),
  currentRaise: doublePrecision("current_raise").default(0),
  allocationPerUser: doublePrecision("allocation_per_user").notNull(),
  network: varchar("network", { length: 20 }).notNull(),
  tags: text("tags").array(),
  links: json("links").$type<{
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    github?: string;
  }>(),
  tokenomics: json("tokenomics").$type<{
    totalSupply: number;
    initialCirculation: number;
    publicSale: number;
    team: number;
    marketing: number;
    ecosystem: number;
    locked: boolean;
    vestingInfo?: string;
  }>(),
  auditStatus: json("audit_status").$type<{
    audited: boolean;
    auditCompany?: string;
    auditLink?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userInvestments = pgTable("user_investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  launchId: integer("launch_id").references(() => tokenLaunches.id).notNull(),
  amount: doublePrecision("amount").notNull(),
  tokensAllocated: doublePrecision("tokens_allocated").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  transactionHash: varchar("transaction_hash", { length: 255 }),
  investmentDate: timestamp("investment_date").defaultNow(),
});

export const tokenLaunchesRelations = relations(tokenLaunches, ({ many }) => ({
  userInvestments: many(userInvestments),
}));

export const userInvestmentsRelations = relations(userInvestments, ({ one }) => ({
  user: one(users, {
    fields: [userInvestments.userId],
    references: [users.id],
  }),
  launch: one(tokenLaunches, {
    fields: [userInvestments.launchId],
    references: [tokenLaunches.id],
  }),
}));

// Unstoppable Domains Integration
export const unstoppableDomainNFTs = pgTable("unstoppable_domain_nfts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  domainName: varchar("domain_name", { length: 255 }).notNull().unique(),
  tokenId: varchar("token_id", { length: 255 }).notNull(),
  network: varchar("network", { length: 50 }).notNull(),
  verified: boolean("verified").default(false),
  nftImageUrl: text("nft_image_url"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const unstoppableDomainBenefits = pgTable("unstoppable_domain_benefits", {
  id: serial("id").primaryKey(),
  domainId: integer("domain_id").references(() => unstoppableDomainNFTs.id).notNull(),
  benefitType: varchar("benefit_type", { length: 50 }).notNull(), // staking_bonus, badge_access, trivia_multiplier, etc.
  benefitValue: doublePrecision("benefit_value").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const unstoppableDomainNFTsRelations = relations(unstoppableDomainNFTs, ({ one, many }) => ({
  user: one(users, {
    fields: [unstoppableDomainNFTs.userId],
    references: [users.id],
  }),
  benefits: many(unstoppableDomainBenefits),
}));

export const unstoppableDomainBenefitsRelations = relations(unstoppableDomainBenefits, ({ one }) => ({
  domain: one(unstoppableDomainNFTs, {
    fields: [unstoppableDomainBenefits.domainId],
    references: [unstoppableDomainNFTs.id],
  }),
}));

// Security and MFA relations
export const userDevicesRelations = relations(userDevices, ({ one }) => ({
  user: one(users, {
    fields: [userDevices.userId],
    references: [users.id],
  }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

export const mfaBackupCodesRelations = relations(mfaBackupCodes, ({ one }) => ({
  user: one(users, {
    fields: [mfaBackupCodes.userId],
    references: [users.id],
  }),
}));

export const securityEventsRelations = relations(securityEvents, ({ one }) => ({
  user: one(users, {
    fields: [securityEvents.userId],
    references: [users.id],
  }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}));

// Learning and social sharing relations
export const learningModulesRelations = relations(learningModules, ({ many }) => ({
  lessons: many(learningLessons),
  userProgress: many(userModuleProgress),
}));

export const learningLessonsRelations = relations(learningLessons, ({ one, many }) => ({
  module: one(learningModules, {
    fields: [learningLessons.moduleId],
    references: [learningModules.id],
  }),
  userProgress: many(userLessonProgress),
}));

export const userModuleProgressRelations = relations(userModuleProgress, ({ one }) => ({
  user: one(users, {
    fields: [userModuleProgress.userId],
    references: [users.id],
  }),
  module: one(learningModules, {
    fields: [userModuleProgress.moduleId],
    references: [learningModules.id],
  }),
  lastLesson: one(learningLessons, {
    fields: [userModuleProgress.lastLessonId],
    references: [learningLessons.id],
  }),
}));

export const userLessonProgressRelations = relations(userLessonProgress, ({ one }) => ({
  user: one(users, {
    fields: [userLessonProgress.userId],
    references: [users.id],
  }),
  lesson: one(learningLessons, {
    fields: [userLessonProgress.lessonId],
    references: [learningLessons.id],
  }),
  module: one(learningModules, {
    fields: [userLessonProgress.moduleId],
    references: [learningModules.id],
  }),
}));

export const socialSharesRelations = relations(socialShares, ({ one }) => ({
  user: one(users, {
    fields: [socialShares.userId],
    references: [users.id],
  }),
  module: one(learningModules, {
    fields: [socialShares.moduleId],
    references: [learningModules.id],
  }),
  lesson: one(learningLessons, {
    fields: [socialShares.lessonId],
    references: [learningLessons.id],
  }),
  badge: one(badges, {
    fields: [socialShares.badgeId],
    references: [badges.id],
  }),
}));

export const learningAchievementsRelations = relations(learningAchievements, ({ one }) => ({
  user: one(users, {
    fields: [learningAchievements.userId],
    references: [users.id],
  }),
  module: one(learningModules, {
    fields: [learningAchievements.moduleId],
    references: [learningModules.id],
  }),
}));

export const userLearningStatsRelations = relations(userLearningStats, ({ one }) => ({
  user: one(users, {
    fields: [userLearningStats.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, passwordHash: true })
  .extend({
    password: z.string().min(6).max(100),
  });
export const insertTokenStatSchema = createInsertSchema(tokenStats).omit({ id: true, timestamp: true });
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true });
export const insertRoadmapItemSchema = createInsertSchema(roadmapItems).omit({ id: true });
export const insertTokenPurchaseSchema = createInsertSchema(tokenPurchases).omit({ id: true, purchaseDate: true });
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true, createdAt: true });
export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({ id: true, earnedAt: true });

// Trivia schemas
export const insertTriviaQuizSchema = createInsertSchema(triviaQuizzes).omit({ id: true, createdAt: true });
export const insertTriviaQuestionSchema = createInsertSchema(triviaQuestions).omit({ id: true, createdAt: true });
export const insertTriviaSubmissionSchema = createInsertSchema(triviaSubmissions).omit({ id: true, submittedAt: true });
export const insertTriviaAnswerSchema = createInsertSchema(triviaAnswers).omit({ id: true, createdAt: true });

// Spin Wheel schemas
export const insertSpinWheelRewardSchema = createInsertSchema(spinWheelRewards).omit({ id: true, createdAt: true });
export const insertUserSpinSchema = createInsertSchema(userSpins).omit({ id: true, spinDate: true, claimedDate: true });

// Marketplace schemas
export const insertMarketplaceListingSchema = createInsertSchema(marketplaceListings).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTokenStat = z.infer<typeof insertTokenStatSchema>;
export type TokenStat = typeof tokenStats.$inferSelect;

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export type InsertRoadmapItem = z.infer<typeof insertRoadmapItemSchema>;
export type RoadmapItem = typeof roadmapItems.$inferSelect;

export type InsertTokenPurchase = z.infer<typeof insertTokenPurchaseSchema>;
export type TokenPurchase = typeof tokenPurchases.$inferSelect;

export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;

// Trivia types
export type InsertTriviaQuiz = z.infer<typeof insertTriviaQuizSchema>;
export type TriviaQuiz = typeof triviaQuizzes.$inferSelect;

export type InsertTriviaQuestion = z.infer<typeof insertTriviaQuestionSchema>;
export type TriviaQuestion = typeof triviaQuestions.$inferSelect;

export type InsertTriviaSubmission = z.infer<typeof insertTriviaSubmissionSchema>;
export type TriviaSubmission = typeof triviaSubmissions.$inferSelect;

export type InsertTriviaAnswer = z.infer<typeof insertTriviaAnswerSchema>;
export type TriviaAnswer = typeof triviaAnswers.$inferSelect;

// Spin Wheel types
export type InsertSpinWheelReward = z.infer<typeof insertSpinWheelRewardSchema>;
export type SpinWheelReward = typeof spinWheelRewards.$inferSelect;

export type InsertUserSpin = z.infer<typeof insertUserSpinSchema>;
export type UserSpin = typeof userSpins.$inferSelect;

// Marketplace types
export type InsertMarketplaceListing = z.infer<typeof insertMarketplaceListingSchema>;
export type MarketplaceListing = typeof marketplaceListings.$inferSelect;

// Add insert schemas for new tables
export const insertStakingPoolSchema = createInsertSchema(stakingPools).omit({ id: true, createdAt: true });
export const insertUserStakeSchema = createInsertSchema(userStakes).omit({ id: true });
export const insertReferralRewardSchema = createInsertSchema(referralRewards).omit({ id: true, createdAt: true });
export const insertPremiumTierSchema = createInsertSchema(premiumTiers).omit({ id: true, createdAt: true });

// Security and MFA schemas
export const insertUserDeviceSchema = createInsertSchema(userDevices).omit({ id: true, createdAt: true, lastLoginAt: true });
export const insertUserSessionSchema = createInsertSchema(userSessions).omit({ id: true, createdAt: true, lastActiveAt: true });
export const insertMfaBackupCodeSchema = createInsertSchema(mfaBackupCodes).omit({ id: true, createdAt: true, usedAt: true });
export const insertSecurityEventSchema = createInsertSchema(securityEvents).omit({ id: true, createdAt: true });
export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({ id: true, createdAt: true });

// Add types for new tables
export type InsertStakingPool = z.infer<typeof insertStakingPoolSchema>;
export type StakingPool = typeof stakingPools.$inferSelect;

export type InsertUserStake = z.infer<typeof insertUserStakeSchema>;
export type UserStake = typeof userStakes.$inferSelect;

export type InsertReferralReward = z.infer<typeof insertReferralRewardSchema>;
export type ReferralReward = typeof referralRewards.$inferSelect;

export type InsertPremiumTier = z.infer<typeof insertPremiumTierSchema>;
export type PremiumTier = typeof premiumTiers.$inferSelect;

// Mining schemas
export const insertMiningRigSchema = createInsertSchema(miningRigs).omit({ id: true, createdAt: true });
export const insertUserMiningRigSchema = createInsertSchema(userMiningRigs).omit({ id: true, purchaseDate: true, createdAt: true });
export const insertMiningRewardSchema = createInsertSchema(miningRewards).omit({ id: true, rewardDate: true, createdAt: true });

// Mining types
export type InsertMiningRig = z.infer<typeof insertMiningRigSchema>;
export type MiningRig = typeof miningRigs.$inferSelect;

export type InsertUserMiningRig = z.infer<typeof insertUserMiningRigSchema>;
export type UserMiningRig = typeof userMiningRigs.$inferSelect;

export type InsertMiningReward = z.infer<typeof insertMiningRewardSchema>;
export type MiningReward = typeof miningRewards.$inferSelect;

// ChonkPad schemas
export const insertTokenLaunchSchema = createInsertSchema(tokenLaunches).omit({ id: true, createdAt: true });
export const insertUserInvestmentSchema = createInsertSchema(userInvestments).omit({ id: true, investmentDate: true });

// Unstoppable Domain Schemas
export const insertUnstoppableDomainNFTSchema = createInsertSchema(unstoppableDomainNFTs).omit({ id: true, createdAt: true });
export const insertUnstoppableDomainBenefitSchema = createInsertSchema(unstoppableDomainBenefits).omit({ id: true, createdAt: true });

// Unstoppable Domain Types
export type UnstoppableDomainNFT = typeof unstoppableDomainNFTs.$inferSelect;
export type InsertUnstoppableDomainNFT = z.infer<typeof insertUnstoppableDomainNFTSchema>;

export type UnstoppableDomainBenefit = typeof unstoppableDomainBenefits.$inferSelect;
export type InsertUnstoppableDomainBenefit = z.infer<typeof insertUnstoppableDomainBenefitSchema>;

// ChonkPad types
export type InsertTokenLaunch = z.infer<typeof insertTokenLaunchSchema>;
export type TokenLaunch = typeof tokenLaunches.$inferSelect;

export type InsertUserInvestment = z.infer<typeof insertUserInvestmentSchema>;
export type UserInvestment = typeof userInvestments.$inferSelect;

// Security and MFA types
export type InsertUserDevice = z.infer<typeof insertUserDeviceSchema>;
export type UserDevice = typeof userDevices.$inferSelect;

export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type UserSession = typeof userSessions.$inferSelect;

export type InsertMfaBackupCode = z.infer<typeof insertMfaBackupCodeSchema>;
export type MfaBackupCode = typeof mfaBackupCodes.$inferSelect;

export type InsertSecurityEvent = z.infer<typeof insertSecurityEventSchema>;
export type SecurityEvent = typeof securityEvents.$inferSelect;

export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

// Learning and social sharing schemas
export const insertLearningModuleSchema = createInsertSchema(learningModules).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLearningLessonSchema = createInsertSchema(learningLessons).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserModuleProgressSchema = createInsertSchema(userModuleProgress).omit({ id: true, startedAt: true });
export const insertUserLessonProgressSchema = createInsertSchema(userLessonProgress).omit({ id: true, startedAt: true });
export const insertSocialShareSchema = createInsertSchema(socialShares).omit({ id: true, sharedAt: true });
export const insertLearningAchievementSchema = createInsertSchema(learningAchievements).omit({ id: true, achievedAt: true });
export const insertUserLearningStatsSchema = createInsertSchema(userLearningStats).omit({ id: true, lastActive: true, updatedAt: true });

// Learning and social sharing types
export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;
export type LearningModule = typeof learningModules.$inferSelect;

export type InsertLearningLesson = z.infer<typeof insertLearningLessonSchema>;
export type LearningLesson = typeof learningLessons.$inferSelect;

export type InsertUserModuleProgress = z.infer<typeof insertUserModuleProgressSchema>;
export type UserModuleProgress = typeof userModuleProgress.$inferSelect;

export type InsertUserLessonProgress = z.infer<typeof insertUserLessonProgressSchema>;
export type UserLessonProgress = typeof userLessonProgress.$inferSelect;

export type InsertSocialShare = z.infer<typeof insertSocialShareSchema>;
export type SocialShare = typeof socialShares.$inferSelect;

export type InsertLearningAchievement = z.infer<typeof insertLearningAchievementSchema>;
export type LearningAchievement = typeof learningAchievements.$inferSelect;

export type InsertUserLearningStats = z.infer<typeof insertUserLearningStatsSchema>;
export type UserLearningStats = typeof userLearningStats.$inferSelect;

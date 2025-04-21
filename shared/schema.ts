import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, varchar, json, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  walletAddress: varchar("wallet_address", { length: 255 }).unique(),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tokenPurchases: many(tokenPurchases),
  userBadges: many(userBadges),
  triviaSubmissions: many(triviaSubmissions),
  userSpins: many(userSpins),
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

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
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

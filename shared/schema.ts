import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, varchar } from "drizzle-orm/pg-core";
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tokenPurchases: many(tokenPurchases),
}));

export const tokenPurchasesRelations = relations(tokenPurchases, ({ one }) => ({
  user: one(users, {
    fields: [tokenPurchases.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertTokenStatSchema = createInsertSchema(tokenStats).omit({ id: true, timestamp: true });
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true });
export const insertRoadmapItemSchema = createInsertSchema(roadmapItems).omit({ id: true });
export const insertTokenPurchaseSchema = createInsertSchema(tokenPurchases).omit({ id: true, purchaseDate: true });

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

import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const insertTokenStatSchema = createInsertSchema(tokenStats).omit({ id: true, timestamp: true });
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true });
export const insertRoadmapItemSchema = createInsertSchema(roadmapItems).omit({ id: true });

export type InsertTokenStat = z.infer<typeof insertTokenStatSchema>;
export type TokenStat = typeof tokenStats.$inferSelect;

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export type InsertRoadmapItem = z.infer<typeof insertRoadmapItemSchema>;
export type RoadmapItem = typeof roadmapItems.$inferSelect;

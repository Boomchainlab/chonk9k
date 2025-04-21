import { 
  users, type User, type InsertUser,
  tokenStats, type TokenStat, type InsertTokenStat,
  teamMembers, type TeamMember, type InsertTeamMember,
  roadmapItems, type RoadmapItem, type InsertRoadmapItem,
  tokenPurchases, type TokenPurchase, type InsertTokenPurchase
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
}

export class DatabaseStorage implements IStorage {
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
}

export const storage = new DatabaseStorage();

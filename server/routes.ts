import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBadgeSchema, insertUserBadgeSchema } from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);

  return httpServer;
}

import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBadgeSchema, 
  insertUserBadgeSchema, 
  insertTriviaQuizSchema, 
  insertTriviaQuestionSchema,
  insertTriviaSubmissionSchema,
  insertTriviaAnswerSchema
} from "@shared/schema";
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

  const httpServer = createServer(app);

  return httpServer;
}

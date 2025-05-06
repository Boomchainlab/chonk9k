import { Request, Response, NextFunction } from 'express';
import { randomBytes, scrypt as scryptCallback } from 'crypto';
import { promisify } from 'util';
import { InsertUser, User } from '@shared/schema';
import { storage } from './storage';

// Convert callback-based scrypt to Promise-based
const scrypt = promisify(scryptCallback);

/**
 * Hash a password using scrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${derivedKey.toString('hex')}.${salt}`;
}

/**
 * Verify if a plain password matches a hashed password
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  const [hash, salt] = hashedPassword.split('.');
  const derivedKey = (await scrypt(plainPassword, salt, 64)) as Buffer;
  return derivedKey.toString('hex') === hash;
}

/**
 * Register a new user
 */
export async function registerUser(userData: any): Promise<User> {
  // Check if user already exists
  const existingUser = await storage.getUserByUsername(userData.username as string);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  // Hash the password
  const passwordHash = await hashPassword(userData.password as string);

  // Create the user
  const user = await storage.createUser({
    ...userData,
    passwordHash,
  } as any); // Using any to bypass the type checking due to our schema modifications

  return user;
}

/**
 * Login a user
 */
export async function loginUser(username: string, password: string): Promise<User> {
  // Find the user
  const user = await storage.getUserByUsername(username);
  if (!user) {
    throw new Error('Invalid username or password');
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid username or password');
  }

  return user;
}

/**
 * Middleware to check if user is authenticated
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

/**
 * Get current user from session
 */
export async function getCurrentUser(req: Request): Promise<User | null> {
  if (!req.session.userId) {
    return null;
  }

  const user = await storage.getUser(req.session.userId);
  return user || null;
}

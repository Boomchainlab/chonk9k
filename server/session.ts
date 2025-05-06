import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './db';

// Create PostgreSQL session store
const PgStore = connectPgSimple(session);

// Session store instance
export const sessionStore = new PgStore({
  pool,
  createTableIfMissing: true, // Auto-create the session table if it doesn't exist
  tableName: 'user_sessions', // Custom table name (default is 'session')
  pruneSessionInterval: 60 * 60 // Prune expired sessions every hour (in seconds)
});

// Session middleware configuration
export const sessionConfig = {
  store: sessionStore,
  name: 'chonk9k_sid', // Custom cookie name
  secret: process.env.SESSION_SECRET || 'secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as 'lax', // TypeScript needs this assertion
  },
};

/**
 * Remember Me functionality - extends session lifetime
 */
export function extendSession(req: Request, rememberMe: boolean = false) {
  if (rememberMe && req.session.cookie) {
    // Extend to 30 days if "remember me" is checked
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
  } else if (req.session.cookie) {
    // Standard 24-hour session otherwise
    req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
  }
}

/**
 * Set up express-session middleware
 */
export function setupSession(app: any) {
  // Trust first proxy if in production
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }
  
  // Use express-session middleware
  app.use(session(sessionConfig));
}

// Extend express-session with our custom properties
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    email?: string;
    isVerified?: boolean;
    lastActive?: Date;
    isRemembered?: boolean;
    csrfToken?: string;
  }
}

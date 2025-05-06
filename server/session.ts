import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

type Session = {
  id: string;
  data: Record<string, any>;
  expires: Date;
};

// In-memory session store
class MemorySessionStore {
  private sessions: Map<string, Session> = new Map();

  /**
   * Create or update a session
   */
  set(sessionId: string, data: Record<string, any>, maxAge: number): void {
    const expires = new Date(Date.now() + maxAge);
    this.sessions.set(sessionId, { id: sessionId, data, expires });
  }

  /**
   * Get a session by ID
   */
  get(sessionId: string): Record<string, any> | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Check if session has expired
    if (session.expires < new Date()) {
      this.destroy(sessionId);
      return null;
    }

    return session.data;
  }

  /**
   * Delete a session
   */
  destroy(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  /**
   * Clean up expired sessions
   */
  cleanup(): void {
    const now = new Date();
    for (const [id, session] of this.sessions.entries()) {
      if (session.expires < now) {
        this.sessions.delete(id);
      }
    }
  }
}

// Create a singleton store
export const sessionStore = new MemorySessionStore();

// Set up cleanup interval (every hour)
setInterval(() => sessionStore.cleanup(), 60 * 60 * 1000);

// Session middleware options
type SessionOptions = {
  name?: string;
  secret: string;
  cookie?: {
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
  };
};

// Default options
const defaultOptions: SessionOptions = {
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'secret-key-change-in-production',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
};

/**
 * Session middleware
 */
export function session(options: SessionOptions = defaultOptions) {
  const opts = { ...defaultOptions, ...options };

  return (req: Request, res: Response, next: NextFunction) => {
    // Parse cookies manually
    const cookies: Record<string, string> = {};
    const cookieHeader = req.headers.cookie || '';
    
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        cookies[key] = value;
      }
    });
    
    // Get or generate session ID from cookie
    let sessionId = cookies[opts.name || 'sid'];
    if (!sessionId) {
      sessionId = randomBytes(32).toString('hex');
      
      // Set cookie header manually
      const cookieOptions: string[] = [`${opts.name || 'sid'}=${sessionId}`, 'Path=/']; 
      
      if (opts.cookie?.httpOnly) cookieOptions.push('HttpOnly');
      if (opts.cookie?.secure) cookieOptions.push('Secure');
      if (opts.cookie?.sameSite) cookieOptions.push(`SameSite=${opts.cookie.sameSite}`);
      if (opts.cookie?.maxAge) {
        const expires = new Date(Date.now() + opts.cookie.maxAge);
        cookieOptions.push(`Expires=${expires.toUTCString()}`);
      }
      
      res.setHeader('Set-Cookie', cookieOptions.join('; '));
    }

    // Get session data
    const sessionData = sessionStore.get(sessionId) || {};

    // Attach session to request
    req.session = sessionData;

    // Save session when response finishes
    res.on('finish', () => {
      sessionStore.set(sessionId, req.session, opts.cookie?.maxAge || 24 * 60 * 60 * 1000);
    });

    next();
  };
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      session: Record<string, any>;
    }
  }
}

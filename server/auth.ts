import type { Response, NextFunction } from "express";
import type { Request } from "express";

declare module "express" {
  interface Request {
    user?: { id: string; email: string };
  }
}

// Simple in-memory session store (in production, use Redis/database)
const sessions = new Map<string, { userId: string; email: string; expiresAt: number }>();

// Demo credentials for testing
const DEMO_USERS = {
  "recruiter@kaizen.com": "password123",
  "admin@kaizen.com": "admin123",
};

export function createSession(userId: string, email: string): string {
  const sessionId = `sess_${Math.random().toString(36).substring(2, 15)}`;
  sessions.set(sessionId, {
    userId,
    email,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  return sessionId;
}

export function validateSession(sessionId: string): { userId: string; email: string } | null {
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return null;
  }
  return { userId: session.userId, email: session.email };
}

export function destroySession(sessionId: string): void {
  sessions.delete(sessionId);
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const sessionId = req.headers.authorization?.replace("Bearer ", "");

  if (!sessionId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const session = validateSession(sessionId);
  if (!session) {
    res.status(401).json({ message: "Session expired" });
    return;
  }

  req.user = { id: session.userId, email: session.email };
  next();
}

export function validateCredentials(email: string, password: string): boolean {
  return DEMO_USERS[email as keyof typeof DEMO_USERS] === password;
}

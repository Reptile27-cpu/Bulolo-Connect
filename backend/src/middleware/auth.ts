import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthenticatedUser {
  id: string;
  accountId: string;
  fullName: string;
  email?: string;
  phoneNumber: string;
  role: string;
  preferredLanguage: string;
  isVerified: boolean;
  assignedLlgId?: string;
  citizenProfileId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
    return;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Session expired or invalid token. Please sign in again.' });
    return;
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as AuthenticatedUser;
      req.user = decoded;
    } catch {
      // Ignored for optional auth
    }
  }
  next();
};

export const requireRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized. Sign in required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. You do not possess the required permission (${allowedRoles.join(', ')}) to access this resource.`
      });
      return;
    }

    next();
  };
};

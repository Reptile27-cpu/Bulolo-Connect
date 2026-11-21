import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export async function recordAuditLog(
  userId: string | null | undefined,
  action: string,
  entityType: string,
  entityId: string | null | undefined,
  req: Request,
  details?: Record<string, any>
) {
  try {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    await prisma.auditLog.create({
      data: {
        userId: userId || undefined,
        action,
        entityType,
        entityId: entityId || undefined,
        ipAddress: String(ipAddress),
        userAgent: String(userAgent),
        details: details ? JSON.stringify(details) : undefined
      }
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { recordAuditLog } from '../middleware/audit';

const announcementSchema = z.object({
  title: z.string().min(5, 'Announcement title is required'),
  category: z.string().min(1, 'Category is required'),
  summary: z.string().min(10, 'Summary is required'),
  content: z.string().min(20, 'Detailed content is required'),
  targetLlg: z.string().optional(),
  targetWard: z.string().optional(),
  isUrgent: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  expiryDate: z.string().optional(),
  attachmentUrls: z.array(z.string()).default([])
});

export async function getAnnouncements(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, targetLlg, isUrgent } = req.query;

    const where: any = { isPublished: true };
    if (category) where.category = String(category);
    if (targetLlg) {
      where.OR = [
        { targetLlg: null },
        { targetLlg: '' },
        { targetLlg: String(targetLlg) }
      ];
    }
    if (isUrgent === 'true') where.isUrgent = true;

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: [{ isUrgent: 'desc' }, { publishDate: 'desc' }]
    });

    const parsed = announcements.map(a => ({
      ...a,
      attachmentUrls: JSON.parse(a.attachmentUrls || '[]')
    }));

    res.json({ success: true, count: parsed.length, announcements: parsed });
  } catch (error) {
    next(error);
  }
}

export async function createAnnouncement(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = announcementSchema.parse(req.body);

    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        category: data.category,
        summary: data.summary,
        content: data.content,
        targetLlg: data.targetLlg || null,
        targetWard: data.targetWard || null,
        isUrgent: data.isUrgent,
        isPublished: data.isPublished,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        authorStaffName: req.user?.fullName || 'District Administration Office',
        attachmentUrls: JSON.stringify(data.attachmentUrls)
      }
    });

    await recordAuditLog(req.user?.id, 'CREATE_ANNOUNCEMENT', 'Announcement', announcement.id, req, {
      title: announcement.title,
      isUrgent: announcement.isUrgent
    });

    res.status(201).json({
      success: true,
      message: 'Announcement published successfully.',
      announcement
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
}

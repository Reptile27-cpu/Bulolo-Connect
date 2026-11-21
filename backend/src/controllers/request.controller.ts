import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { generateRequestReference } from '../utils/reference';
import { recordAuditLog } from '../middleware/audit';

const createRequestSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(15, 'Please provide a detailed description'),
  llg: z.string().min(1, 'LLG is required'),
  ward: z.string().min(1, 'Ward is required'),
  village: z.string().min(1, 'Village or community is required'),
  specificLocation: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isAnonymous: z.boolean().default(false),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  preferredContactMethod: z.enum(['PHONE', 'EMAIL', 'IN_APP']).default('PHONE'),
  urgency: z.enum(['LOW', 'NORMAL', 'HIGH', 'EMERGENCY']).default('NORMAL'),
  attachments: z.array(z.object({
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    fileSize: z.number()
  })).optional()
});

export async function createRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = createRequestSchema.parse(req.body);

    const count = await prisma.citizenRequest.count();
    const referenceNumber = generateRequestReference(count + 1);

    const citizenProfileId = req.user?.citizenProfileId;

    const requestRecord = await prisma.$transaction(async (tx) => {
      const created = await tx.citizenRequest.create({
        data: {
          referenceNumber,
          citizenProfileId: data.isAnonymous ? null : (citizenProfileId || null),
          isAnonymous: data.isAnonymous,
          contactName: data.isAnonymous ? 'Anonymous Resident' : (data.contactName || req.user?.fullName),
          contactPhone: data.isAnonymous ? null : (data.contactPhone || req.user?.phoneNumber),
          contactEmail: data.isAnonymous ? null : (data.contactEmail || req.user?.email || null),
          preferredContactMethod: data.preferredContactMethod,
          category: data.category,
          subject: data.subject,
          description: data.description,
          llg: data.llg,
          ward: data.ward,
          village: data.village,
          specificLocation: data.specificLocation,
          latitude: data.latitude,
          longitude: data.longitude,
          urgency: data.urgency,
          status: 'SUBMITTED',
          attachments: data.attachments?.length ? {
            create: data.attachments.map(att => ({
              fileName: att.fileName,
              fileUrl: att.fileUrl,
              fileType: att.fileType,
              fileSize: att.fileSize,
              isPublic: false
            }))
          } : undefined
        },
        include: {
          attachments: true
        }
      });

      // Notification for citizen if signed in
      if (req.user?.id) {
        await tx.notification.create({
          data: {
            userId: req.user.id,
            title: 'Request Successfully Submitted',
            message: `Your request (${referenceNumber}) has been submitted to Bulolo District Administration. You can track its status using this reference code.`,
            type: 'REQUEST_UPDATE',
            referenceId: created.id
          }
        });
      }

      return created;
    });

    await recordAuditLog(req.user?.id, 'CREATE_REQUEST', 'CitizenRequest', requestRecord.id, req, {
      referenceNumber,
      category: data.category,
      llg: data.llg
    });

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully. Keep your reference number to track progress.',
      referenceNumber,
      request: requestRecord
    });
  } catch (error) {
    next(error);
  }
}

export async function trackRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const referenceNumber = req.params.referenceNumber?.toUpperCase().trim();

    if (!referenceNumber) {
      res.status(400).json({ success: false, message: 'Reference number is required.' });
      return;
    }

    const request = await prisma.citizenRequest.findUnique({
      where: { referenceNumber },
      include: {
        comments: {
          where: { isInternalOnly: false },
          orderBy: { createdAt: 'desc' }
        },
        attachments: {
          where: { isPublic: true }
        }
      }
    });

    if (!request) {
      res.status(404).json({
        success: false,
        message: `No request found matching reference number "${referenceNumber}". Please verify your code.`
      });
      return;
    }

    // Mask sensitive contact details for public tracking protection
    const sanitized = {
      referenceNumber: request.referenceNumber,
      category: request.category,
      subject: request.subject,
      description: request.description,
      llg: request.llg,
      ward: request.ward,
      village: request.village,
      status: request.status,
      urgency: request.urgency,
      departmentReferredTo: request.departmentReferredTo,
      resolutionSummary: request.resolutionSummary,
      resolvedAt: request.resolvedAt,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      officialUpdates: request.comments,
      attachments: request.attachments
    };

    res.json({ success: true, tracking: sanitized });
  } catch (error) {
    next(error);
  }
}

export async function getMyRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user?.citizenProfileId) {
      res.status(400).json({ success: false, message: 'Citizen profile not found' });
      return;
    }

    const requests = await prisma.citizenRequest.findMany({
      where: { citizenProfileId: req.user.citizenProfileId },
      include: {
        attachments: true,
        comments: {
          where: { isInternalOnly: false }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    next(error);
  }
}

export async function getAllRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, llg, ward, status, search, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (category) where.category = String(category);
    if (llg) where.llg = String(llg);
    if (ward) where.ward = String(ward);
    if (status) where.status = String(status);
    if (search) {
      where.OR = [
        { referenceNumber: { contains: String(search) } },
        { subject: { contains: String(search) } },
        { description: { contains: String(search) } }
      ];
    }

    const [total, requests] = await Promise.all([
      prisma.citizenRequest.count({ where }),
      prisma.citizenRequest.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          attachments: true,
          assignments: {
            include: {
              officer: {
                select: { id: true, accountId: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    res.json({
      success: true,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      },
      requests
    });
  } catch (error) {
    next(error);
  }
}

export async function updateRequestStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status, resolutionSummary, departmentReferredTo, officialComment } = req.body;

    const request = await prisma.citizenRequest.findUnique({
      where: { id },
      include: { citizenProfile: { include: { user: true } } }
    });

    if (!request) {
      res.status(404).json({ success: false, message: 'Request not found' });
      return;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const isResolved = status === 'RESOLVED' || status === 'CLOSED';

      const reqUpdated = await tx.citizenRequest.update({
        where: { id },
        data: {
          status,
          resolutionSummary: resolutionSummary || request.resolutionSummary,
          departmentReferredTo: departmentReferredTo || request.departmentReferredTo,
          resolvedAt: isResolved ? new Date() : request.resolvedAt
        }
      });

      if (officialComment) {
        await tx.requestComment.create({
          data: {
            requestId: id,
            authorId: req.user?.id || 'admin',
            authorName: req.user?.fullName || 'District Administration Officer',
            authorRole: req.user?.role || 'DISTRICT_ADMIN',
            isInternalOnly: false,
            content: officialComment
          }
        });
      }

      // Notify citizen if registered
      if (request.citizenProfile?.user?.id) {
        await tx.notification.create({
          data: {
            userId: request.citizenProfile.user.id,
            title: `Update on Request: ${request.referenceNumber}`,
            message: `Status changed to "${status}". ${officialComment || resolutionSummary || ''}`,
            type: 'REQUEST_UPDATE',
            referenceId: id
          }
        });
      }

      return reqUpdated;
    });

    await recordAuditLog(req.user?.id, 'UPDATE_REQUEST_STATUS', 'CitizenRequest', id, req, {
      previousStatus: request.status,
      newStatus: status,
      referenceNumber: request.referenceNumber
    });

    res.json({ success: true, message: 'Request updated successfully', request: updated });
  } catch (error) {
    next(error);
  }
}

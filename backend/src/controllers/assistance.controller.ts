import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { generateApplicationNumber } from '../utils/reference';
import { recordAuditLog } from '../middleware/audit';

const applySchema = z.object({
  programmeId: z.string().min(1, 'Assistance programme must be selected'),
  requestedAmount: z.number().optional(),
  statementOfNeed: z.string().min(20, 'Please explain your circumstances and need for assistance in detail'),
  householdReference: z.string().optional(),
  documents: z.array(z.object({
    title: z.string(),
    documentType: z.string(),
    fileUrl: z.string(),
    fileSize: z.number()
  })).optional()
});

const decisionSchema = z.object({
  status: z.enum(['APPROVED', 'DECLINED', 'ADDITIONAL_INFO_REQUIRED']),
  amountApproved: z.number().optional(),
  explanation: z.string().min(10, 'A clear explanation and justification for the decision is mandatory.')
});

export async function getProgrammes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, onlyOpen } = req.query;
    const where: any = {};
    if (category) where.category = String(category);
    if (onlyOpen === 'true') where.isOpen = true;

    const programmes = await prisma.assistanceProgramme.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const parsed = programmes.map(p => ({
      ...p,
      eligibilityCriteria: JSON.parse(p.eligibilityCriteria || '[]'),
      requiredDocuments: JSON.parse(p.requiredDocuments || '[]')
    }));

    res.json({ success: true, programmes: parsed });
  } catch (error) {
    next(error);
  }
}

export async function createApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user?.citizenProfileId) {
      res.status(403).json({ success: false, message: 'Only registered citizens with a profile can submit assistance applications.' });
      return;
    }

    const data = applySchema.parse(req.body);

    const citizen = await prisma.citizenProfile.findUnique({
      where: { id: req.user.citizenProfileId },
      include: { user: true }
    });

    if (!citizen) {
      res.status(404).json({ success: false, message: 'Citizen profile not found.' });
      return;
    }

    const programme = await prisma.assistanceProgramme.findUnique({
      where: { id: data.programmeId }
    });

    if (!programme || !programme.isOpen) {
      res.status(400).json({ success: false, message: 'This assistance programme is currently closed for applications.' });
      return;
    }

    const count = await prisma.assistanceApplication.count();
    const applicationNumber = generateApplicationNumber(count + 1);

    const application = await prisma.$transaction(async (tx) => {
      const app = await tx.assistanceApplication.create({
        data: {
          applicationNumber,
          programmeId: data.programmeId,
          citizenProfileId: citizen.id,
          applicantName: citizen.fullName,
          applicantPhone: citizen.user.phoneNumber,
          applicantEmail: citizen.user.email || null,
          llg: citizen.llg,
          ward: citizen.ward,
          village: citizen.village,
          householdReference: data.householdReference || null,
          requestedAmount: data.requestedAmount || null,
          statementOfNeed: data.statementOfNeed,
          status: 'SUBMITTED',
          documents: data.documents?.length ? {
            create: data.documents.map(doc => ({
              title: doc.title,
              documentType: doc.documentType,
              fileUrl: doc.fileUrl,
              fileSize: doc.fileSize
            }))
          } : undefined
        },
        include: {
          documents: true,
          programme: true
        }
      });

      await tx.notification.create({
        data: {
          userId: req.user!.id,
          title: 'Assistance Application Submitted',
          message: `Your application (${applicationNumber}) for "${programme.title}" has been registered. An officer will assess your application against programme criteria.`,
          type: 'ASSISTANCE_UPDATE',
          referenceId: app.id
        }
      });

      return app;
    });

    await recordAuditLog(req.user.id, 'SUBMIT_ASSISTANCE_APP', 'AssistanceApplication', application.id, req, {
      applicationNumber,
      programmeCode: programme.code
    });

    res.status(201).json({
      success: true,
      message: 'Assistance application submitted successfully. The district office will review your documentation.',
      applicationNumber,
      application
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user?.citizenProfileId) {
      res.status(403).json({ success: false, message: 'Citizen profile required.' });
      return;
    }

    const applications = await prisma.assistanceApplication.findMany({
      where: { citizenProfileId: req.user.citizenProfileId },
      include: {
        programme: true,
        documents: true,
        decisions: {
          orderBy: { decisionDate: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
}

export async function getAllApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { programmeId, llg, status, search, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (programmeId) where.programmeId = String(programmeId);
    if (llg) where.llg = String(llg);
    if (status) where.status = String(status);
    if (search) {
      where.OR = [
        { applicationNumber: { contains: String(search) } },
        { applicantName: { contains: String(search) } }
      ];
    }

    const [total, applications] = await Promise.all([
      prisma.assistanceApplication.count({ where }),
      prisma.assistanceApplication.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          programme: true,
          documents: true,
          decisions: true
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
      applications
    });
  } catch (error) {
    next(error);
  }
}

export async function reviewApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status, amountApproved, explanation } = decisionSchema.parse(req.body);

    const app = await prisma.assistanceApplication.findUnique({
      where: { id },
      include: {
        programme: true,
        citizenProfile: { include: { user: true } }
      }
    });

    if (!app) {
      res.status(404).json({ success: false, message: 'Assistance application not found.' });
      return;
    }

    const decisionRecord = await prisma.$transaction(async (tx) => {
      const decision = await tx.applicationDecision.create({
        data: {
          applicationId: id,
          decisionOfficerId: req.user!.id,
          decisionOfficerName: req.user!.fullName,
          status,
          amountApproved: amountApproved || null,
          explanation,
          decisionDate: new Date()
        }
      });

      const updatedApp = await tx.assistanceApplication.update({
        where: { id },
        data: {
          status,
          reviewedByStaffId: req.user!.id,
          reviewedByStaffName: req.user!.fullName,
          reviewedAt: new Date(),
          decisionReason: explanation
        }
      });

      // Send citizen in-app notification
      await tx.notification.create({
        data: {
          userId: app.citizenProfile.user.id,
          title: `Decision on Assistance: ${app.applicationNumber}`,
          message: `Your application for "${app.programme.title}" status is now "${status}". Explanation: ${explanation}`,
          type: 'ASSISTANCE_UPDATE',
          referenceId: app.id
        }
      });

      return { decision, updatedApp };
    });

    await recordAuditLog(req.user!.id, 'REVIEW_ASSISTANCE_APP', 'AssistanceApplication', id, req, {
      applicationNumber: app.applicationNumber,
      decision: status,
      amountApproved
    });

    res.json({
      success: true,
      message: `Application decision successfully recorded as "${status}".`,
      application: decisionRecord.updatedApp,
      decision: decisionRecord.decision
    });
  } catch (error) {
    next(error);
  }
}

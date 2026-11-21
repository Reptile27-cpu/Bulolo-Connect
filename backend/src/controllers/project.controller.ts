import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { generateProjectCode } from '../utils/reference';
import { recordAuditLog } from '../middleware/audit';

const projectSchema = z.object({
  title: z.string().min(5, 'Project title is required'),
  description: z.string().min(15, 'Project description is required'),
  category: z.string().min(1, 'Category is required'),
  llg: z.string().min(1, 'LLG is required'),
  ward: z.string().min(1, 'Ward is required'),
  specificLocation: z.string().min(2, 'Specific location is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  implementingAgency: z.string().min(2, 'Implementing agency is required'),
  contractorName: z.string().optional(),
  commencementDate: z.string(),
  expectedCompletionDate: z.string(),
  status: z.enum([
    'PROPOSED',
    'UNDER_ASSESSMENT',
    'APPROVED',
    'PROCUREMENT',
    'UNDER_CONSTRUCTION',
    'DELAYED',
    'COMPLETED',
    'SUSPENDED'
  ]).default('UNDER_CONSTRUCTION'),
  progressPercentage: z.number().min(0).max(100).default(0),
  publishedBudgetKina: z.number().optional(),
  fundingSource: z.string().optional(),
  isFinanciallyVerified: z.boolean().default(false),
  featuredImageUrl: z.string().optional()
});

const updateSchema = z.object({
  title: z.string().min(3, 'Update title is required'),
  reportSummary: z.string().min(10, 'Report summary is required'),
  progressPercentage: z.number().min(0).max(100),
  statusAtUpdate: z.string(),
  inspectionOfficerName: z.string().min(2, 'Officer name is required'),
  photoUrls: z.array(z.string()).default([])
});

export async function getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, llg, ward, status, search } = req.query;

    const where: any = {};
    if (category) where.category = String(category);
    if (llg) where.llg = String(llg);
    if (ward) where.ward = String(ward);
    if (status) where.status = String(status);
    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { projectCode: { contains: String(search) } },
        { description: { contains: String(search) } }
      ];
    }

    const projects = await prisma.developmentProject.findMany({
      where,
      include: {
        updates: {
          orderBy: { updateDate: 'desc' },
          take: 1
        }
      },
      orderBy: { commencementDate: 'desc' }
    });

    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    next(error);
  }
}

export async function getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const project = await prisma.developmentProject.findUnique({
      where: { id },
      include: {
        updates: {
          orderBy: { updateDate: 'desc' }
        },
        attachments: true
      }
    });

    if (!project) {
      res.status(404).json({ success: false, message: 'Development project not found.' });
      return;
    }

    const parsedUpdates = project.updates.map(u => ({
      ...u,
      photoUrls: JSON.parse(u.photoUrls || '[]')
    }));

    res.json({
      success: true,
      project: {
        ...project,
        updates: parsedUpdates
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = projectSchema.parse(req.body);

    const count = await prisma.developmentProject.count();
    const projectCode = generateProjectCode(count + 1);

    const project = await prisma.developmentProject.create({
      data: {
        projectCode,
        title: data.title,
        description: data.description,
        category: data.category,
        llg: data.llg,
        ward: data.ward,
        specificLocation: data.specificLocation,
        latitude: data.latitude,
        longitude: data.longitude,
        implementingAgency: data.implementingAgency,
        contractorName: data.contractorName,
        commencementDate: new Date(data.commencementDate),
        expectedCompletionDate: new Date(data.expectedCompletionDate),
        status: data.status,
        progressPercentage: data.progressPercentage,
        publishedBudgetKina: data.isFinanciallyVerified ? data.publishedBudgetKina : null,
        fundingSource: data.isFinanciallyVerified ? data.fundingSource : null,
        isFinanciallyVerified: data.isFinanciallyVerified,
        featuredImageUrl: data.featuredImageUrl
      }
    });

    await recordAuditLog(req.user?.id, 'CREATE_PROJECT', 'DevelopmentProject', project.id, req, {
      projectCode,
      title: project.title
    });

    res.status(201).json({
      success: true,
      message: 'Development project published successfully.',
      project
    });
  } catch (error) {
    next(error);
  }
}

export async function addProjectUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const data = updateSchema.parse(req.body);

    const project = await prisma.developmentProject.findUnique({
      where: { id }
    });

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      const update = await tx.projectUpdate.create({
        data: {
          projectId: id,
          title: data.title,
          reportSummary: data.reportSummary,
          progressPercentage: data.progressPercentage,
          statusAtUpdate: data.statusAtUpdate,
          inspectionOfficerName: data.inspectionOfficerName,
          photoUrls: JSON.stringify(data.photoUrls)
        }
      });

      const updatedProj = await tx.developmentProject.update({
        where: { id },
        data: {
          progressPercentage: data.progressPercentage,
          status: data.statusAtUpdate,
          actualCompletionDate: data.statusAtUpdate === 'COMPLETED' ? new Date() : undefined
        }
      });

      return { update, updatedProj };
    });

    await recordAuditLog(req.user?.id, 'ADD_PROJECT_UPDATE', 'ProjectUpdate', result.update.id, req, {
      projectId: id,
      newProgress: data.progressPercentage
    });

    res.status(201).json({
      success: true,
      message: 'Project inspection update and progress successfully recorded.',
      update: result.update,
      project: result.updatedProj
    });
  } catch (error) {
    next(error);
  }
}

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { generateHouseholdReference } from '../utils/reference';
import { recordAuditLog } from '../middleware/audit';
import { BULOLO_LLGS } from '../../../shared/types/geography';

const householdSchema = z.object({
  headOfHouseholdName: z.string().min(2, 'Head of household name is required'),
  headOfHouseholdNID: z.string().optional(),
  llg: z.string().min(1, 'LLG is required'),
  ward: z.string().min(1, 'Ward is required'),
  village: z.string().min(1, 'Village is required'),
  residentialAddress: z.string().min(3, 'Residential address is required'),
  householdSize: z.number().min(1).default(1),
  vulnerabilityStatus: z.array(z.string()).default([]),
  specialAssistanceNotes: z.string().optional(),
  members: z.array(z.object({
    fullName: z.string().min(2),
    relationshipToHead: z.string(),
    gender: z.string(),
    dateOfBirth: z.string().optional(),
    isAttendingSchool: z.boolean().default(false),
    schoolName: z.string().optional(),
    hasSpecialNeeds: z.boolean().default(false)
  })).default([])
});

export async function getLLGDirectory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Verified Bulolo LLGs (Mumeng, Watut, Buang, Bulolo Urban)
    res.json({ success: true, llgs: BULOLO_LLGS });
  } catch (error) {
    next(error);
  }
}

export async function getCommunities(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { llg, ward } = req.query;
    const where: any = {};
    if (llg) where.llg = String(llg);
    if (ward) where.ward = String(ward);

    const communities = await prisma.community.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    const parsed = communities.map(c => ({
      ...c,
      publicFacilities: JSON.parse(c.publicFacilities || '[]'),
      keyPriorities: JSON.parse(c.keyPriorities || '[]'),
      economicActivities: JSON.parse(c.economicActivities || '[]')
    }));

    res.json({ success: true, count: parsed.length, communities: parsed });
  } catch (error) {
    next(error);
  }
}

// STRICT PRIVACY: Private Household Management
export async function getMyHousehold(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user?.citizenProfileId) {
      res.status(403).json({ success: false, message: 'Citizen profile required.' });
      return;
    }

    const household = await prisma.household.findUnique({
      where: { citizenProfileId: req.user.citizenProfileId },
      include: { members: true }
    });

    if (!household) {
      res.json({ success: true, household: null });
      return;
    }

    res.json({
      success: true,
      household: {
        ...household,
        vulnerabilityStatus: JSON.parse(household.vulnerabilityStatus || '[]')
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function saveHousehold(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user?.citizenProfileId) {
      res.status(403).json({ success: false, message: 'Citizen profile required.' });
      return;
    }

    const data = householdSchema.parse(req.body);

    const existing = await prisma.household.findUnique({
      where: { citizenProfileId: req.user.citizenProfileId }
    });

    if (existing) {
      // Update existing household
      await prisma.householdMember.deleteMany({
        where: { householdId: existing.id }
      });

      const updated = await prisma.household.update({
        where: { id: existing.id },
        data: {
          headOfHouseholdName: data.headOfHouseholdName,
          headOfHouseholdNID: data.headOfHouseholdNID,
          llg: data.llg,
          ward: data.ward,
          village: data.village,
          residentialAddress: data.residentialAddress,
          householdSize: data.householdSize,
          vulnerabilityStatus: JSON.stringify(data.vulnerabilityStatus),
          specialAssistanceNotes: data.specialAssistanceNotes,
          members: {
            create: data.members.map(m => ({
              fullName: m.fullName,
              relationshipToHead: m.relationshipToHead,
              gender: m.gender,
              dateOfBirth: m.dateOfBirth,
              isAttendingSchool: m.isAttendingSchool,
              schoolName: m.schoolName,
              hasSpecialNeeds: m.hasSpecialNeeds
            }))
          }
        },
        include: { members: true }
      });

      await recordAuditLog(req.user.id, 'UPDATE_HOUSEHOLD', 'Household', updated.id, req);

      res.json({ success: true, message: 'Household profile updated.', household: updated });
    } else {
      // Create new household
      const count = await prisma.household.count();
      const referenceNumber = generateHouseholdReference(count + 1);

      const created = await prisma.household.create({
        data: {
          referenceNumber,
          citizenProfileId: req.user.citizenProfileId,
          headOfHouseholdName: data.headOfHouseholdName,
          headOfHouseholdNID: data.headOfHouseholdNID,
          llg: data.llg,
          ward: data.ward,
          village: data.village,
          residentialAddress: data.residentialAddress,
          householdSize: data.householdSize,
          vulnerabilityStatus: JSON.stringify(data.vulnerabilityStatus),
          specialAssistanceNotes: data.specialAssistanceNotes,
          members: {
            create: data.members.map(m => ({
              fullName: m.fullName,
              relationshipToHead: m.relationshipToHead,
              gender: m.gender,
              dateOfBirth: m.dateOfBirth,
              isAttendingSchool: m.isAttendingSchool,
              schoolName: m.schoolName,
              hasSpecialNeeds: m.hasSpecialNeeds
            }))
          }
        },
        include: { members: true }
      });

      await recordAuditLog(req.user.id, 'CREATE_HOUSEHOLD', 'Household', created.id, req);

      res.status(201).json({ success: true, message: 'Household profile saved.', household: created });
    }
  } catch (error) {
    next(error);
  }
}

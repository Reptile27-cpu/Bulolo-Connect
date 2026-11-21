import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { recordAuditLog } from '../middleware/audit';

const serviceSchema = z.object({
  name: z.string().min(2, 'Service name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description is required'),
  organisationName: z.string().min(2, 'Organisation name is required'),
  physicalAddress: z.string().min(3, 'Physical address is required'),
  llg: z.string().min(1, 'LLG is required'),
  ward: z.string().min(1, 'Ward is required'),
  phoneNumber: z.string().min(5, 'Contact phone is required'),
  alternativePhone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  operatingHours: z.string().min(2, 'Operating hours are required'),
  servicesOffered: z.array(z.string()).default([]),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  officialWebsite: z.string().optional(),
  verificationStatus: z.enum(['VERIFIED', 'PENDING_VERIFICATION', 'OUTDATED']).default('VERIFIED'),
  informationSource: z.string().min(2, 'Information source is mandatory'),
  isEmergencyService: z.boolean().default(false)
});

export async function getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, llg, ward, search, isEmergency, verificationStatus = 'VERIFIED' } = req.query;

    const where: any = {};
    if (category) where.category = String(category);
    if (llg) where.llg = String(llg);
    if (ward) where.ward = String(ward);
    if (isEmergency === 'true') where.isEmergencyService = true;
    if (verificationStatus) where.verificationStatus = String(verificationStatus);
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { description: { contains: String(search) } },
        { organisationName: { contains: String(search) } }
      ];
    }

    const services = await prisma.districtService.findMany({
      where,
      orderBy: [{ isEmergencyService: 'desc' }, { name: 'asc' }]
    });

    const parsed = services.map(s => ({
      ...s,
      servicesOffered: JSON.parse(s.servicesOffered || '[]')
    }));

    res.json({ success: true, count: parsed.length, services: parsed });
  } catch (error) {
    next(error);
  }
}

export async function getServiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const service = await prisma.districtService.findUnique({
      where: { id }
    });

    if (!service) {
      res.status(404).json({ success: false, message: 'District service not found' });
      return;
    }

    res.json({
      success: true,
      service: {
        ...service,
        servicesOffered: JSON.parse(service.servicesOffered || '[]')
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = serviceSchema.parse(req.body);

    const service = await prisma.districtService.create({
      data: {
        name: data.name,
        category: data.category,
        description: data.description,
        organisationName: data.organisationName,
        physicalAddress: data.physicalAddress,
        llg: data.llg,
        ward: data.ward,
        phoneNumber: data.phoneNumber,
        alternativePhone: data.alternativePhone,
        email: data.email || null,
        operatingHours: data.operatingHours,
        servicesOffered: JSON.stringify(data.servicesOffered),
        latitude: data.latitude,
        longitude: data.longitude,
        officialWebsite: data.officialWebsite,
        verificationStatus: data.verificationStatus,
        verifiedAt: data.verificationStatus === 'VERIFIED' ? new Date() : null,
        verifiedByOfficerName: data.verificationStatus === 'VERIFIED' ? (req.user?.fullName || 'District Administrator') : null,
        informationSource: data.informationSource,
        isEmergencyService: data.isEmergencyService
      }
    });

    await recordAuditLog(req.user?.id, 'CREATE_DISTRICT_SERVICE', 'DistrictService', service.id, req, {
      name: service.name,
      category: service.category
    });

    res.status(201).json({
      success: true,
      message: 'District service directory entry created successfully.',
      service
    });
  } catch (error) {
    next(error);
  }
}

export async function updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const data = serviceSchema.partial().parse(req.body);

    const updated = await prisma.districtService.update({
      where: { id },
      data: {
        ...data,
        servicesOffered: data.servicesOffered ? JSON.stringify(data.servicesOffered) : undefined,
        verifiedAt: data.verificationStatus === 'VERIFIED' ? new Date() : undefined,
        verifiedByOfficerName: data.verificationStatus === 'VERIFIED' ? (req.user?.fullName || 'District Administrator') : undefined
      }
    });

    await recordAuditLog(req.user?.id, 'UPDATE_DISTRICT_SERVICE', 'DistrictService', id, req, {
      name: updated.name
    });

    res.json({ success: true, message: 'District service updated successfully.', service: updated });
  } catch (error) {
    next(error);
  }
}

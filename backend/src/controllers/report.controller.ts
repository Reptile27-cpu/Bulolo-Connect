import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export async function getDashboardOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Calculate REAL statistics directly from actual database records (Zero fake metrics)
    const [
      totalCitizens,
      totalRequests,
      pendingRequests,
      inProgressRequests,
      resolvedRequests,
      totalApplications,
      pendingApplications,
      approvedApplications,
      activeProjects,
      totalServices,
      recentRequests,
      recentApplications,
      requestsByLlgGroup,
      requestsByCategoryGroup
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CITIZEN' } }),
      prisma.citizenRequest.count(),
      prisma.citizenRequest.count({ where: { status: { in: ['SUBMITTED', 'RECEIVED', 'UNDER_REVIEW'] } } }),
      prisma.citizenRequest.count({ where: { status: 'ACTION_IN_PROGRESS' } }),
      prisma.citizenRequest.count({ where: { status: { in: ['RESOLVED', 'CLOSED'] } } }),
      prisma.assistanceApplication.count(),
      prisma.assistanceApplication.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW'] } } }),
      prisma.assistanceApplication.count({ where: { status: 'APPROVED' } }),
      prisma.developmentProject.count({ where: { status: { notIn: ['COMPLETED', 'SUSPENDED'] } } }),
      prisma.districtService.count({ where: { verificationStatus: 'VERIFIED' } }),
      prisma.citizenRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.assistanceApplication.findMany({
        take: 5,
        include: { programme: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.citizenRequest.groupBy({
        by: ['llg'],
        _count: { id: true }
      }),
      prisma.citizenRequest.groupBy({
        by: ['category'],
        _count: { id: true }
      })
    ]);

    res.json({
      success: true,
      metrics: {
        totalCitizens,
        totalRequests,
        pendingRequests,
        inProgressRequests,
        resolvedRequests,
        totalApplications,
        pendingApplications,
        approvedApplications,
        activeProjects,
        totalServices
      },
      requestsByLlg: requestsByLlgGroup.map(g => ({ llg: g.llg, count: g._count.id })),
      requestsByCategory: requestsByCategoryGroup.map(g => ({ category: g.category, count: g._count.id })),
      recentActivity: {
        recentRequests,
        recentApplications
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function exportReportData(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { type = 'requests', format = 'json' } = req.query;

    if (type === 'requests') {
      const records = await prisma.citizenRequest.findMany({
        orderBy: { createdAt: 'desc' }
      });

      if (format === 'csv') {
        let csv = 'ReferenceNumber,Category,Subject,LLG,Ward,Village,Urgency,Status,CreatedAt\n';
        records.forEach(r => {
          csv += `"${r.referenceNumber}","${r.category}","${r.subject.replace(/"/g, '""')}","${r.llg}","${r.ward}","${r.village}","${r.urgency}","${r.status}","${r.createdAt.toISOString()}"\n`;
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="bulolo_citizen_requests.csv"');
        res.send(csv);
        return;
      }

      res.json({ success: true, count: records.length, records });
    } else if (type === 'assistance') {
      const records = await prisma.assistanceApplication.findMany({
        include: { programme: true },
        orderBy: { createdAt: 'desc' }
      });

      if (format === 'csv') {
        let csv = 'ApplicationNumber,Programme,ApplicantName,LLG,Ward,Village,RequestedAmount,Status,CreatedAt\n';
        records.forEach(a => {
          csv += `"${a.applicationNumber}","${a.programme.title.replace(/"/g, '""')}","${a.applicantName.replace(/"/g, '""')}","${a.llg}","${a.ward}","${a.village}",${a.requestedAmount || 0},"${a.status}","${a.createdAt.toISOString()}"\n`;
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="bulolo_assistance_applications.csv"');
        res.send(csv);
        return;
      }

      res.json({ success: true, count: records.length, records });
    } else {
      res.status(400).json({ success: false, message: 'Invalid report export type. Supported: requests, assistance.' });
    }
  } catch (error) {
    next(error);
  }
}

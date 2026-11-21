import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import * as requestController from '../controllers/request.controller';
import * as assistanceController from '../controllers/assistance.controller';
import * as directoryController from '../controllers/directory.controller';
import * as projectController from '../controllers/project.controller';
import * as communityController from '../controllers/community.controller';
import * as announcementController from '../controllers/announcement.controller';
import * as reportController from '../controllers/report.controller';
import { authenticateUser, optionalAuth, requireRoles } from '../middleware/auth';

const router = Router();

// --- 1. AUTHENTICATION & PROFILE ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticateUser, authController.getProfile);

// --- 2. CITIZEN REQUESTS & FEEDBACK ---
// Public submission or authenticated submission
router.post('/requests', optionalAuth, requestController.createRequest);
router.get('/requests/track/:referenceNumber', requestController.trackRequest);
router.get('/requests/my', authenticateUser, requestController.getMyRequests);

// Administration & Staff request management
router.get('/requests', authenticateUser, requireRoles('SUPER_ADMIN', 'DISTRICT_ADMIN', 'MP_OFFICE_REP', 'OFFICE_STAFF', 'LLG_ADMIN'), requestController.getAllRequests);
router.patch('/requests/:id/status', authenticateUser, requireRoles('SUPER_ADMIN', 'DISTRICT_ADMIN', 'MP_OFFICE_REP', 'OFFICE_STAFF', 'LLG_ADMIN'), requestController.updateRequestStatus);

// --- 3. ASSISTANCE PROGRAMMES & APPLICATIONS ---
// Public programme listing
router.get('/assistance/programmes', assistanceController.getProgrammes);
// Citizen applications
router.post('/assistance/apply', authenticateUser, assistanceController.createApplication);
router.get('/assistance/my-applications', authenticateUser, assistanceController.getMyApplications);
// Administrative review
router.get('/assistance/applications', authenticateUser, requireRoles('SUPER_ADMIN', 'DISTRICT_ADMIN', 'MP_OFFICE_REP', 'OFFICE_STAFF'), assistanceController.getAllApplications);
router.post('/assistance/applications/:id/decision', authenticateUser, requireRoles('SUPER_ADMIN', 'DISTRICT_ADMIN', 'MP_OFFICE_REP', 'OFFICE_STAFF'), assistanceController.reviewApplication);

// --- 4. DISTRICT SERVICES DIRECTORY ---
// Public directory search
router.get('/services', directoryController.getServices);
router.get('/services/:id', directoryController.getServiceById);
// Administration management
router.post('/services', authenticateUser, requireRoles('SUPER_ADMIN', 'DISTRICT_ADMIN'), directoryController.createService);
router.put('/services/:id', authenticateUser, requireRoles('SUPER_ADMIN', 'DISTRICT_ADMIN'), directoryController.updateService);

// --- 5. DEVELOPMENT PROJECTS ---
// Public project showcase
router.get('/projects', projectController.getProjects);
router.get('/projects/:id', projectController.getProjectById);
// Administrative project management
router.post('/projects', authenticateUser, requireRoles('SUPER_ADMIN', 'DISTRICT_ADMIN', 'MP_OFFICE_REP'), projectController.createProject);
router.post('/projects/:id/updates', authenticateUser, requireRoles('SUPER_ADMIN', 'DISTRICT_ADMIN', 'MP_OFFICE_REP', 'OFFICE_STAFF'), projectController.addProjectUpdate);

// --- 6. COMMUNITIES & PRIVATE HOUSEHOLD MODULE ---
router.get('/communities/llgs', communityController.getLLGDirectory);
router.get('/communities', communityController.getCommunities);
// Private household management
router.get('/household/my', authenticateUser, communityController.getMyHousehold);
router.post('/household', authenticateUser, communityController.saveHousehold);

// --- 7. ANNOUNCEMENTS & NOTIFICATIONS ---
router.get('/announcements', announcementController.getAnnouncements);
router.post('/announcements', authenticateUser, requireRoles('SUPER_ADMIN', 'DISTRICT_ADMIN', 'MP_OFFICE_REP'), announcementController.createAnnouncement);
// User notifications
router.get('/notifications', authenticateUser, announcementController.getMyNotifications);
router.patch('/notifications/:id/read', authenticateUser, announcementController.markNotificationAsRead);

// --- 8. REPORTS & ANALYTICS ---
router.get('/reports/overview', authenticateUser, requireRoles('SUPER_ADMIN', 'DISTRICT_ADMIN', 'MP_OFFICE_REP', 'OFFICE_STAFF'), reportController.getDashboardOverview);
router.get('/reports/export', authenticateUser, requireRoles('SUPER_ADMIN', 'DISTRICT_ADMIN', 'MP_OFFICE_REP'), reportController.exportReportData);

export default router;

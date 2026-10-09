import { Router } from 'express';
import {
  register,
  login,
  getMe,
  demoLogin
} from '../controllers/authController';
import {
  getProfile,
  updateProfile
} from '../controllers/profileController';
import {
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  evaluateSpecific,
  getSavedScholarships,
  saveScholarship,
  removeSavedScholarship,
  getDashboard,
  resetDemoData
} from '../controllers/scholarshipController';
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  updateDocumentChecklist
} from '../controllers/applicationController';
import { askGuidanceAssistant } from '../controllers/assistantController';
import { authenticateToken, optionalAuth, requireAdmin } from '../middleware/auth';
import { getDbStatus } from '../config/db';

const router = Router();

// Health Check & Database Status
router.get('/health', (_req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    status: 'ok',
    service: 'ScholarSphere API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// Authentication
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getMe);
router.post('/auth/demo-login', demoLogin);

// Student Profile
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

// Scholarships (Discovery & Detail)
router.get('/scholarships', optionalAuth, getScholarships);
router.get('/scholarships/match', optionalAuth, getScholarships);
router.get('/scholarships/:id', optionalAuth, getScholarshipById);
router.post('/scholarships', authenticateToken, requireAdmin, createScholarship);
router.put('/scholarships/:id', authenticateToken, requireAdmin, updateScholarship);
router.delete('/scholarships/:id', authenticateToken, requireAdmin, deleteScholarship);

// Admin dedicated aliases
router.post('/admin/scholarships', authenticateToken, requireAdmin, createScholarship);

// Eligibility Evaluation
router.get('/eligibility/:scholarshipId', optionalAuth, evaluateSpecific);

// Saved Scholarships
router.get('/saved', authenticateToken, getSavedScholarships);
router.post('/saved/:scholarshipId', authenticateToken, saveScholarship);
router.delete('/saved/:scholarshipId', authenticateToken, removeSavedScholarship);

// Application Tracker
router.get('/applications', authenticateToken, getApplications);
router.post('/applications', authenticateToken, createApplication);
router.put('/applications/:id', authenticateToken, updateApplication);
router.patch('/applications/:id', authenticateToken, updateApplication);
router.delete('/applications/:id', authenticateToken, deleteApplication);
router.put('/applications/:scholarshipId/checklist', authenticateToken, updateDocumentChecklist);

// Dashboard
router.get('/dashboard', authenticateToken, getDashboard);

// Scholarship Guidance Assistant
router.post('/assistant/ask', optionalAuth, askGuidanceAssistant);

// Admin & Demo Tools
router.post('/admin/reset-demo', resetDemoData);

export default router;

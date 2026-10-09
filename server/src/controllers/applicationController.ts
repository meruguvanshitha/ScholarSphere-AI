import { Request, Response } from 'express';
import { dataStore } from '../services/store';

export async function getApplications(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const applications = dataStore.getApplicationsByStudent(req.user.id);
    res.json({
      success: true,
      applications
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching applications.' });
  }
}

export async function createApplication(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { scholarshipId, trackerStatus, notes, appliedDate } = req.body;

    if (!scholarshipId) {
      res.status(400).json({ success: false, message: 'scholarshipId is required.' });
      return;
    }

    const app = dataStore.createOrUpdateApplication(req.user.id, scholarshipId, {
      trackerStatus: trackerStatus || 'interested',
      notes,
      appliedDate
    });

    res.status(201).json({
      success: true,
      message: 'Scholarship added to application tracker.',
      application: app
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating application entry.' });
  }
}

export async function updateApplication(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params; // this can be scholarshipId or applicationId
    const { trackerStatus, notes, appliedDate, checklistProgress } = req.body;

    // Support referencing by scholarshipId directly
    const scholarshipId = id.startsWith('sch_') ? id : req.body.scholarshipId || id;

    const app = dataStore.createOrUpdateApplication(req.user.id, scholarshipId, {
      trackerStatus,
      notes,
      appliedDate,
      checklistProgress
    });

    res.json({
      success: true,
      message: 'Application tracker status updated.',
      application: app
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating application.' });
  }
}

export async function updateDocumentChecklist(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { scholarshipId } = req.params;
    const { documentName, isReady, notes } = req.body;

    if (!documentName) {
      res.status(400).json({ success: false, message: 'documentName is required.' });
      return;
    }

    const app = dataStore.updateChecklistItem(
      req.user.id,
      scholarshipId,
      documentName,
      Boolean(isReady),
      notes
    );

    if (!app) {
      // First auto-create the application entry if not yet in tracker
      const newApp = dataStore.createOrUpdateApplication(req.user.id, scholarshipId, {
        trackerStatus: 'preparing_documents'
      });
      const updated = dataStore.updateChecklistItem(
        req.user.id,
        scholarshipId,
        documentName,
        Boolean(isReady),
        notes
      );

      res.json({
        success: true,
        message: 'Document checklist updated.',
        application: updated || newApp
      });
      return;
    }

    res.json({
      success: true,
      message: 'Document checklist updated.',
      application: app
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating document checklist.' });
  }
}

export async function deleteApplication(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    dataStore.deleteApplication(req.user.id, id);

    res.json({
      success: true,
      message: 'Scholarship removed from application tracker.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting application.' });
  }
}

import { Request, Response } from 'express';
import { dataStore } from '../services/store';
import { evaluateEligibility } from '../services/eligibilityEngine';

export async function getScholarships(req: Request, res: Response): Promise<void> {
  try {
    const {
      q,
      educationLevel,
      course,
      category,
      reservationCategory,
      verificationStatus,
      lifecycleStatus,
      maxIncome,
      minFunding,
      sortBy,
      page,
      limit
    } = req.query;

    const userId = req.user?.id;

    const data = dataStore.getScholarships({
      query: q as string,
      educationLevel: educationLevel as string,
      course: course as string,
      category: category as string,
      reservationCategory: reservationCategory as string,
      verificationStatus: verificationStatus as string,
      lifecycleStatus: lifecycleStatus as string,
      maxIncome: maxIncome ? Number(maxIncome) : undefined,
      minFunding: minFunding ? Number(minFunding) : undefined,
      sortBy: sortBy as any,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
      userId
    });

    res.json({
      success: true,
      ...data
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching scholarships.' });
  }
}

export async function getScholarshipById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const scholarship = dataStore.getScholarshipById(id, userId);
    if (!scholarship) {
      res.status(404).json({ success: false, message: 'Scholarship opportunity not found.' });
      return;
    }

    res.json({
      success: true,
      scholarship
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error retrieving scholarship.' });
  }
}

export async function createScholarship(req: Request, res: Response): Promise<void> {
  try {
    const {
      name,
      provider,
      description,
      fundingAmount,
      fundingFormatted,
      fundingType,
      educationLevels,
      eligibleCourses,
      minScorePercent,
      minCgpa,
      maxAnnualIncome,
      eligibleCategories,
      eligibleRegions,
      eligibleStudyYears,
      requiredDocuments,
      digiLockerSupportedDocs,
      applicationOpeningDate,
      applicationDeadline,
      officialUrl,
      sourceMetadata,
      verificationStatus,
      lifecycleStatus,
      categoryTags
    } = req.body;

    if (!name || !provider || !description || !applicationDeadline || !officialUrl) {
      res.status(400).json({
        success: false,
        message: 'Name, provider, description, application deadline, and official URL are required.'
      });
      return;
    }

    const newRecord = dataStore.createScholarship({
      name,
      provider,
      description,
      fundingAmount: Number(fundingAmount) || 0,
      fundingFormatted: fundingFormatted || `₹${(Number(fundingAmount) || 0).toLocaleString('en-IN')}`,
      fundingType: fundingType || 'grant',
      educationLevels: Array.isArray(educationLevels) ? educationLevels : ['undergraduate'],
      eligibleCourses: Array.isArray(eligibleCourses) ? eligibleCourses : ['Any'],
      minScorePercent: minScorePercent ? Number(minScorePercent) : undefined,
      minCgpa: minCgpa ? Number(minCgpa) : undefined,
      maxAnnualIncome: maxAnnualIncome ? Number(maxAnnualIncome) : undefined,
      eligibleCategories: Array.isArray(eligibleCategories) ? eligibleCategories : ['All'],
      eligibleRegions: Array.isArray(eligibleRegions) ? eligibleRegions : ['All India'],
      eligibleStudyYears: Array.isArray(eligibleStudyYears) ? eligibleStudyYears : ['Any'],
      requiredDocuments: Array.isArray(requiredDocuments) ? requiredDocuments : ['Class 12th Marks Memo', 'Aadhaar Card'],
      digiLockerSupportedDocs: Array.isArray(digiLockerSupportedDocs) ? digiLockerSupportedDocs : ['Class 12th Marks Memo', 'Aadhaar Card'],
      applicationOpeningDate: applicationOpeningDate || new Date().toISOString(),
      applicationDeadline,
      officialUrl,
      sourceMetadata: sourceMetadata || {
        sourceName: `${provider} Official Portal`,
        sourceType: 'foundation',
        lastCheckedDate: new Date().toISOString().split('T')[0],
        verifiedBy: req.user?.email || 'Admin'
      },
      verificationStatus: verificationStatus || 'verified_official',
      lifecycleStatus: lifecycleStatus || 'active',
      isDemoData: false,
      categoryTags: Array.isArray(categoryTags) ? categoryTags : ['General']
    });

    res.status(201).json({
      success: true,
      message: 'Scholarship opportunity created successfully.',
      scholarship: newRecord
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating scholarship.' });
  }
}

export async function updateScholarship(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updated = dataStore.updateScholarship(id, req.body);

    if (!updated) {
      res.status(404).json({ success: false, message: 'Scholarship not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Scholarship opportunity updated successfully.',
      scholarship: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating scholarship.' });
  }
}

export async function deleteScholarship(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = dataStore.deleteScholarship(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Scholarship not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Scholarship removed successfully.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting scholarship.' });
  }
}

export async function evaluateSpecific(req: Request, res: Response): Promise<void> {
  try {
    const { scholarshipId } = req.params;
    const scholarship = dataStore.getScholarshipById(scholarshipId);

    if (!scholarship) {
      res.status(404).json({ success: false, message: 'Scholarship not found.' });
      return;
    }

    const userId = req.user?.id;
    const profile = userId ? dataStore.getProfileByUserId(userId) : (req.body.profile || null);
    const evaluation = evaluateEligibility(scholarship, profile);

    res.json({
      success: true,
      evaluation
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Evaluation failed.' });
  }
}

export async function getSavedScholarships(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const saved = dataStore.getSavedScholarships(req.user.id);
    res.json({
      success: true,
      saved
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching saved scholarships.' });
  }
}

export async function saveScholarship(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { scholarshipId } = req.params;
    const savedRecord = dataStore.saveScholarship(req.user.id, scholarshipId);

    res.status(201).json({
      success: true,
      message: 'Scholarship saved to your bookmarks.',
      saved: savedRecord
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error saving scholarship.' });
  }
}

export async function removeSavedScholarship(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { scholarshipId } = req.params;
    dataStore.removeSavedScholarship(req.user.id, scholarshipId);

    res.json({
      success: true,
      message: 'Scholarship removed from bookmarks.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error removing saved scholarship.' });
  }
}

export async function getDashboard(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const dashboardData = dataStore.getDashboardMetrics(req.user.id);
    res.json({
      success: true,
      ...dashboardData
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error generating dashboard data.' });
  }
}

export async function resetDemoData(_req: Request, res: Response): Promise<void> {
  try {
    dataStore.seedInitialData();
    res.json({
      success: true,
      message: 'Demo dataset reset to pristine initial state.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Reset failed.' });
  }
}

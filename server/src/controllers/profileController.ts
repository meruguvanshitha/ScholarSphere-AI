import { Request, Response } from 'express';
import { dataStore } from '../services/store';

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const profile = dataStore.getProfileByUserId(req.user.id);
    if (!profile) {
      res.status(404).json({ success: false, message: 'Student profile not found.' });
      return;
    }

    res.json({
      success: true,
      profile
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching profile.' });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const {
      educationLevel,
      course,
      specialization,
      yearOfStudy,
      institution,
      cgpa,
      scorePercent,
      academicAchievements,
      stateOrRegion,
      country,
      familyIncomeAnnual,
      incomeRange,
      studyInterests,
      preferredCategories,
      demographicCategory,
      reservationCategory,
      documentsReady,
      digiLockerVerifiedDocs,
      isOnboarded
    } = req.body;

    // Validate ranges if provided (10.0 CGPA scale for Indian universities)
    if (cgpa !== undefined && cgpa !== null && cgpa !== '' && (Number(cgpa) < 0 || Number(cgpa) > 10.0)) {
      res.status(400).json({ success: false, message: 'CGPA must be between 0.0 and 10.0 on standard Indian university grading.' });
      return;
    }

    if (scorePercent !== undefined && scorePercent !== null && (Number(scorePercent) < 0 || Number(scorePercent) > 100)) {
      res.status(400).json({ success: false, message: 'Score percentage must be between 0% and 100%.' });
      return;
    }

    if (familyIncomeAnnual !== undefined && familyIncomeAnnual !== null && Number(familyIncomeAnnual) < 0) {
      res.status(400).json({ success: false, message: 'Annual family income cannot be negative.' });
      return;
    }

    const updatedProfile = dataStore.updateProfile(req.user.id, {
      educationLevel,
      course,
      specialization,
      yearOfStudy,
      institution,
      cgpa: cgpa !== undefined && cgpa !== '' ? Number(cgpa) : undefined,
      scorePercent: scorePercent !== undefined && scorePercent !== '' ? Number(scorePercent) : undefined,
      academicAchievements,
      stateOrRegion,
      country: country || 'India',
      familyIncomeAnnual: familyIncomeAnnual !== undefined && familyIncomeAnnual !== '' ? Number(familyIncomeAnnual) : undefined,
      incomeRange,
      reservationCategory: reservationCategory || 'General',
      studyInterests: Array.isArray(studyInterests) ? studyInterests : undefined,
      preferredCategories: Array.isArray(preferredCategories) ? preferredCategories : undefined,
      documentsReady: Array.isArray(documentsReady) ? documentsReady : undefined,
      digiLockerVerifiedDocs: Array.isArray(digiLockerVerifiedDocs) ? digiLockerVerifiedDocs : undefined,
      isOnboarded: Boolean(isOnboarded)
    });

    res.json({
      success: true,
      message: 'Student profile updated successfully.',
      profile: updatedProfile
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating profile.' });
  }
}

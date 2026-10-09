import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Calendar,
  DollarSign,
  GraduationCap,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  Clock,
  Bookmark,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Layers,
  Info
} from 'lucide-react';
import { Scholarship, DocumentChecklistItem } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship;
  onClose: () => void;
  onSavedChange?: () => void;
  onTrackerUpdated?: () => void;
  onOpenAdvisorWithContext: (scholarshipId: string) => void;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  onClose,
  onSavedChange,
  onTrackerUpdated,
  onOpenAdvisorWithContext,
  isCompared,
  onToggleCompare
}) => {
  const { user, profile } = useAuth();
  const [isSaved, setIsSaved] = useState<boolean>(scholarship.isSaved || false);
  const [trackerStatus, setTrackerStatus] = useState<string>(scholarship.trackerStatus || 'interested');
  const [isInTracker, setIsInTracker] = useState<boolean>(Boolean(scholarship.trackerStatus));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'why' | 'readiness' | 'overview' | 'documents'>('why');

  // Checklist state for documents
  const [checklist, setChecklist] = useState<DocumentChecklistItem[]>(() => {
    const readyInProfile = profile?.documentsReady || [];
    return scholarship.requiredDocuments.map(doc => ({
      documentName: doc,
      isReady: readyInProfile.includes(doc),
      notes: ''
    }));
  });

  const elig = scholarship.eligibility;
  const dims = elig?.readinessDimensions;

  const handleToggleSave = async () => {
    try {
      if (isSaved) {
        await api.removeSavedScholarship(scholarship._id);
        setIsSaved(false);
      } else {
        await api.saveScholarship(scholarship._id);
        setIsSaved(true);
      }
      onSavedChange?.();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleAddToTracker = async (status: string) => {
    setIsSubmitting(true);
    try {
      await api.createApplication(scholarship._id, status);
      setIsInTracker(true);
      setTrackerStatus(status);
      onTrackerUpdated?.();
    } catch (err) {
      console.error('Tracker add failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleChecklistDoc = async (docName: string, currentReady: boolean) => {
    const updated = checklist.map(item =>
      item.documentName === docName ? { ...item, isReady: !currentReady } : item
    );
    setChecklist(updated);

    try {
      await api.updateDocumentChecklist(scholarship._id, docName, !currentReady);
      onTrackerUpdated?.();
    } catch (err) {
      console.error('Checklist update failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E2DDD5] text-left overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-6 pb-4 border-b border-[#E2DDD5] flex items-start justify-between gap-4 bg-[#FAF7F2]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-xs font-semibold text-gray-500">{scholarship.provider}</span>
              {scholarship.verificationStatus === 'verified_official' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Official Source Verified</span>
                </span>
              )}
              {scholarship.verificationStatus === 'verification_required' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Verification Pending
                </span>
              )}
              {scholarship.verificationStatus === 'expired' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  Expired Opportunity
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              {scholarship.name}
            </h2>

            <div className="flex items-baseline space-x-3 pt-1">
              <span className="text-2xl font-black text-emerald-700">
                {scholarship.fundingFormatted}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                • {scholarship.fundingType.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleCompare(scholarship._id)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1 transition-colors ${
                isCompared
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              title="Toggle in 3-way Comparison"
            >
              <Layers className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">{isCompared ? 'Compared' : 'Compare'}</span>
            </button>

            <button
              onClick={handleToggleSave}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-gray-200 text-gray-400 hover:text-gray-700'
              }`}
              title="Save to bookmarks"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#E2DDD5] bg-[#FAF7F2] px-6 text-xs font-bold text-gray-600">
          <button
            onClick={() => setActiveTab('why')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'why'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent hover:text-[#0F172A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Why This Scholarship? (Explainability)</span>
          </button>

          <button
            onClick={() => setActiveTab('readiness')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'readiness'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent hover:text-[#0F172A]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>4-D Readiness Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'documents'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent hover:text-[#0F172A]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Document Checklist ({checklist.filter(c => c.isReady).length}/{checklist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent hover:text-[#0F172A]'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-gray-500" />
            <span>Full Rules &amp; Provider URL</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: WHY THIS SCHOLARSHIP? (Explainable Engine) */}
          {activeTab === 'why' && (
            <div className="space-y-6">
              {/* Outcome Banner */}
              {elig && (
                <div
                  className={`p-4 rounded-2xl border flex items-start space-x-3 ${
                    elig.outcome === 'Strong Match'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : elig.outcome === 'Needs Confirmation'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="pt-0.5">
                    {elig.outcome === 'Strong Match' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {elig.outcome === 'Needs Confirmation' && <HelpCircle className="w-5 h-5 text-amber-600" />}
                    {elig.outcome === 'Does Not Match' && <XCircle className="w-5 h-5 text-rose-600" />}
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-sm">
                      Eligibility Outcome: {elig.outcome}
                    </p>
                    <p className="text-xs leading-relaxed">
                      {elig.plainLanguageExplanation}
                    </p>
                  </div>
                </div>
              )}

              {/* Requirements Audit Grid */}
              {elig && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Satisfied Criteria */}
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E2DDD5] space-y-3">
                    <p className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Requirements Satisfied ({elig.requirementsSatisfied.length})</span>
                    </p>
                    {elig.requirementsSatisfied.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">No verified criteria satisfied yet.</p>
                    ) : (
                      <ul className="space-y-2 text-xs text-[#334155]">
                        {elig.requirementsSatisfied.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Criteria Not Met or Missing Information */}
                  <div className="space-y-4">
                    {elig.requirementsNotSatisfied.length > 0 && (
                      <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
                        <p className="font-bold text-xs uppercase tracking-wider text-rose-800 flex items-center space-x-1.5">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Disqualification Factors ({elig.requirementsNotSatisfied.length})</span>
                        </p>
                        <ul className="space-y-1.5 text-xs text-rose-950">
                          {elig.requirementsNotSatisfied.map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-rose-600 font-bold">✗</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {elig.missingInformation.length > 0 && (
                      <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                        <p className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center space-x-1.5">
                          <HelpCircle className="w-4 h-4 text-amber-600" />
                          <span>Information Needing Confirmation ({elig.missingInformation.length})</span>
                        </p>
                        <ul className="space-y-1.5 text-xs text-amber-950">
                          {elig.missingInformation.map((item, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-amber-600 font-bold">?</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recommended Next Steps */}
              {elig && elig.recommendedNextSteps.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5">
                  <p className="font-bold text-xs uppercase tracking-wider text-emerald-400">
                    Recommended Next Action Steps
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {elig.recommendedNextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-emerald-400 font-bold">→</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 4-DIMENSION READINESS ENGINE */}
          {activeTab === 'readiness' && dims && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-bold text-base text-[#0F172A]">
                  ScholarSphere Readiness Engine
                </h3>
                <p className="text-xs text-[#64748B]">
                  Separates preparation into 4 interpretable dimensions rather than a fabricated single probability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Eligibility Fit */}
                <div className="p-5 rounded-2xl bg-white border border-[#E2DDD5] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-gray-500">1. Eligibility Fit</span>
                    <span className="text-sm font-extrabold text-emerald-700">{dims.eligibilityFitScore}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${dims.eligibilityFitScore}%` }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-[#0F172A]">{dims.eligibilityFitLabel}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Evaluated against degree level, major, GPA/marks minimums, income caps, and regional guidelines.
                  </p>
                </div>

                {/* 2. Document Readiness */}
                <div className="p-5 rounded-2xl bg-white border border-[#E2DDD5] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-gray-500">2. Document Readiness</span>
                    <span className="text-sm font-extrabold text-teal-700">{dims.documentReadinessScore}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-teal-600 h-2 rounded-full"
                      style={{ width: `${dims.documentReadinessScore}%` }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-[#0F172A]">{dims.documentReadinessLabel}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Calculated from the specific {dims.documentsTotalCount} documents required by this provider.
                  </p>
                </div>

                {/* 3. Deadline Urgency */}
                <div className="p-5 rounded-2xl bg-white border border-[#E2DDD5] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-gray-500">3. Deadline Urgency</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        dims.deadlineUrgencyStatus === 'closing_soon'
                          ? 'bg-rose-100 text-rose-800'
                          : dims.deadlineUrgencyStatus === 'approaching'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {dims.deadlineUrgencyStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#0F172A]">
                    {dims.daysRemaining < 0
                      ? 'Deadline Expired'
                      : `${dims.daysRemaining} days remaining (Due ${dims.deadlineFormatted})`}
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Accurate calendar comparison computed against current local date.
                  </p>
                </div>

                {/* 4. Application Readiness */}
                <div className="p-5 rounded-2xl bg-white border border-[#E2DDD5] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-gray-500">4. Application Tracker</span>
                    <span className="text-sm font-extrabold text-blue-700">{dims.applicationReadinessScore}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${dims.applicationReadinessScore}%` }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-[#0F172A]">{dims.applicationReadinessLabel}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Tracks draft preparation, essay completion, and official submission confirmation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENT CHECKLIST */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div>
                  <h3 className="font-bold text-sm text-[#0F172A]">
                    Required Document Checklist
                  </h3>
                  <p className="text-xs text-gray-500">
                    Mark documents as available or ready for submission. Updates persist to your database record.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700">
                  {checklist.filter(c => c.isReady).length} of {checklist.length} Confirmed
                </span>
              </div>

              <div className="space-y-2.5">
                {checklist.map((item, idx) => {
                  const docLower = item.documentName.toLowerCase();
                  const isDigiLocker =
                    docLower.includes('income') ||
                    docLower.includes('bonafide') ||
                    docLower.includes('marksheet') ||
                    docLower.includes('marks memo') ||
                    docLower.includes('intermediate') ||
                    docLower.includes('ssc') ||
                    docLower.includes('aadhaar') ||
                    scholarship.digiLockerSupportedDocs?.includes(item.documentName) ||
                    profile?.digiLockerVerifiedDocs?.includes(item.documentName);

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                        item.isReady
                          ? 'bg-emerald-50/60 border-emerald-300'
                          : 'bg-[#FAF7F2] border-[#E2DDD5]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 select-none flex-1 pr-2">
                        <input
                          type="checkbox"
                          checked={item.isReady}
                          onChange={() => handleToggleChecklistDoc(item.documentName, item.isReady)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className={`text-xs font-semibold ${item.isReady ? 'text-emerald-900' : 'text-[#0F172A]'}`}>
                          {item.documentName}
                        </span>
                        {isDigiLocker && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs">
                            <ShieldCheck className="w-3 h-3 text-blue-700" />
                            <span>DigiLocker Verified</span>
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-gray-500 font-medium flex-shrink-0">
                        {item.isReady ? '✓ Ready in hand' : 'Pending acquisition'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: FULL OVERVIEW & OFFICIAL RULES */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-[#0F172A]">Full Opportunity Description</h3>
                <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-line">
                  {scholarship.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E2DDD5]">
                  <p className="text-gray-500 font-medium">Education Level</p>
                  <p className="font-bold text-[#0F172A] capitalize">
                    {scholarship.educationLevels.join(', ')}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E2DDD5]">
                  <p className="text-gray-500 font-medium">Eligible Courses</p>
                  <p className="font-bold text-[#0F172A]">
                    {scholarship.eligibleCourses.join(', ')}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E2DDD5]">
                  <p className="text-gray-500 font-medium">Minimum Score / GPA</p>
                  <p className="font-bold text-[#0F172A]">
                    {scholarship.minCgpa ? `GPA >= ${scholarship.minCgpa.toFixed(2)}` : ''}
                    {scholarship.minScorePercent ? ` (Score >= ${scholarship.minScorePercent}%)` : ''}
                    {!scholarship.minCgpa && !scholarship.minScorePercent ? 'No minimum cutoff' : ''}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E2DDD5]">
                  <p className="text-gray-500 font-medium">Income Ceiling</p>
                  <p className="font-bold text-[#0F172A]">
                    {scholarship.maxAnnualIncome && scholarship.maxAnnualIncome < 90000000
                      ? `Up to ₹${(scholarship.maxAnnualIncome / 100000).toFixed(1)} Lakhs / year`
                      : 'No income limit'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E2DDD5]">
                  <p className="text-gray-500 font-medium">Eligible Regions</p>
                  <p className="font-bold text-[#0F172A]">
                    {scholarship.eligibleRegions.join(', ')}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E2DDD5]">
                  <p className="text-gray-500 font-medium">Application Deadline</p>
                  <p className="font-bold text-[#0F172A]">
                    {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Source Verification Audit Box */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1">
                <p className="font-bold text-[#0F172A] flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Registry Verification Audit Details</span>
                </p>
                <p className="text-gray-600">
                  Source: <span className="font-semibold">{scholarship.sourceMetadata.sourceName}</span> ({scholarship.sourceMetadata.sourceType})
                </p>
                <p className="text-gray-600">
                  Audited by: <span className="font-semibold">{scholarship.sourceMetadata.verifiedBy}</span> • Last checked: {scholarship.sourceMetadata.lastCheckedDate}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions Footer */}
        <div className="p-4 sm:p-6 border-t border-[#E2DDD5] bg-[#FAF7F2] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenAdvisorWithContext(scholarship._id)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#0F172A] font-semibold border border-[#D5CEC0] flex items-center space-x-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ask Guidance Advisor</span>
            </button>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Add to Tracker Control */}
            <div className="flex items-center space-x-1">
              <select
                value={trackerStatus}
                onChange={e => handleAddToTracker(e.target.value)}
                disabled={isSubmitting}
                className="p-2 rounded-xl bg-white border border-[#D5CEC0] text-xs font-semibold text-[#0F172A] focus:outline-none"
              >
                <option value="interested">Status: Interested</option>
                <option value="preparing_documents">Status: Preparing Docs</option>
                <option value="ready_to_apply">Status: Ready to Apply</option>
                <option value="applied">Status: Applied</option>
              </select>
            </div>

            <a
              href={scholarship.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <span>Visit Official Provider Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

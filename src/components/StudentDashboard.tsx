import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Bookmark,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  Calendar,
  Layers,
  ShieldCheck,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DashboardData, Scholarship } from '../types';

interface StudentDashboardProps {
  onExplore: () => void;
  onOpenScholarshipDetail: (scholarship: Scholarship) => void;
  onOpenOnboarding: () => void;
  onGoToTracker: () => void;
  onOpenComparison: () => void;
  comparisonList: string[];
  onToggleCompare: (id: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onExplore,
  onOpenScholarshipDetail,
  onOpenOnboarding,
  onGoToTracker,
  onOpenComparison,
  comparisonList,
  onToggleCompare
}) => {
  const { user, profile, activeScenarioNote } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics from backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, profile]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse text-left">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-28 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 max-w-lg mx-auto space-y-4">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-900">Unable to load dashboard</h3>
          <p className="text-sm text-rose-700">{error || 'Server error'}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { metrics, upcomingDeadlines, recommendedScholarships, profileCompletion } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Active Persona Banner for Judges */}
      {activeScenarioNote && (
        <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="font-semibold">{activeScenarioNote}</span>
          </div>
          <span className="hidden sm:inline px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 font-bold text-[10px] uppercase">
            Demo Scenario
          </span>
        </div>
      )}

      {/* Header & Quick Profile Summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-[#E2DDD5]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Welcome back, {user?.name || 'Student'}
          </h1>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1 mt-1 text-xs text-[#64748B]">
            <span className="font-semibold text-gray-800">{profile?.institution || 'Institution Unset'}</span>
            <span>•</span>
            <span>{profile?.course || 'Branch Unset'} ({profile?.yearOfStudy || 'Year Unset'})</span>
            {profile?.cgpa ? (
              <>
                <span>•</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  CGPA {profile.cgpa.toFixed(2)} / 10.0
                </span>
              </>
            ) : null}
            {profile?.reservationCategory && (
              <>
                <span>•</span>
                <span className="font-bold text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                  Category: {profile.reservationCategory}
                </span>
              </>
            )}
            {profile?.familyIncomeAnnual ? (
              <>
                <span>•</span>
                <span className="font-semibold text-gray-700">
                  Income: ₹{(profile.familyIncomeAnnual / 100000).toFixed(1)}L / yr
                </span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenOnboarding}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-[#F3EFE8] text-[#0F172A] border border-[#D5CEC0] flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
            <span>Update Profile</span>
          </button>
          <button
            onClick={fetchDashboardData}
            className="p-2 text-xs rounded-lg bg-white hover:bg-[#F3EFE8] text-gray-600 border border-[#D5CEC0] shadow-xs"
            title="Refresh Live Metrics"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Incomplete Profile Prompt (First-time / Missing fields banner) */}
      {!profileCompletion.isOnboarded && profileCompletion.missingKeyFields.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="font-bold text-amber-950 text-sm">
                Complete Your Profile to Unlock Verified Matches
              </h3>
            </div>
            <p className="text-xs text-amber-800">
              The eligibility engine needs: <span className="font-semibold">{profileCompletion.missingKeyFields.join(', ')}</span>. Without these, opportunities remain marked as "Needs Confirmation".
            </p>
          </div>
          <button
            onClick={onOpenOnboarding}
            className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-xs transition-colors flex-shrink-0"
          >
            Finish Onboarding
          </button>
        </div>
      )}

      {/* Live Metrics Grid (Calculated from real backend records) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-[#E2DDD5] shadow-xs space-y-1">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Matching</p>
          <p className="text-2xl font-extrabold text-[#0F172A]">{metrics.totalMatching}</p>
          <p className="text-[10px] text-emerald-700 font-medium">Deterministic fits</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs space-y-1">
          <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Strong Matches</p>
          <p className="text-2xl font-extrabold text-emerald-700">{metrics.strongMatches}</p>
          <p className="text-[10px] text-gray-500 font-medium">All criteria verified</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs space-y-1">
          <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Needs Info</p>
          <p className="text-2xl font-extrabold text-amber-600">{metrics.needsConfirmation}</p>
          <p className="text-[10px] text-gray-500 font-medium">Pending field details</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2DDD5] shadow-xs space-y-1">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Bookmarks</p>
          <p className="text-2xl font-extrabold text-[#0F172A]">{metrics.savedCount}</p>
          <p className="text-[10px] text-gray-500 font-medium">Saved opportunities</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2DDD5] shadow-xs space-y-1">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">In Progress</p>
          <p className="text-2xl font-extrabold text-blue-700">{metrics.inProgressApplications}</p>
          <button onClick={onGoToTracker} className="text-[10px] text-blue-600 hover:underline font-medium block">
            Open tracker →
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2DDD5] shadow-xs space-y-1">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Closing Soon</p>
          <p className="text-2xl font-extrabold text-amber-600">{metrics.upcomingDeadlinesCount}</p>
          <p className="text-[10px] text-gray-500 font-medium">Next 21 days</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2DDD5] shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Docs Ready</p>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-extrabold text-teal-700">{metrics.documentReadinessPercent}%</span>
          </div>
          <p className="text-[10px] text-gray-500 font-medium">{metrics.documentsReadyCount} docs certified</p>
        </div>
      </div>

      {/* Main Two-Column Layout: Recommended Matches & Urgent Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left (8 Cols): Prioritized Recommended Scholarships */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-[#0F172A] flex items-center space-x-2">
                <span>Top Recommended Opportunities</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  {recommendedScholarships.length} Strong Matches
                </span>
              </h2>
              <p className="text-xs text-[#64748B]">
                Sorted by deterministic criteria matching your active major, scores, and income tier.
              </p>
            </div>
            <button
              onClick={onExplore}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {recommendedScholarships.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-[#E2DDD5] text-center space-y-3">
                <FolderOpen className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="font-semibold text-sm text-[#0F172A]">No Strong Matches Available Yet</p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try completing your academic profile or explore opportunities open to all study years.
                </p>
                <button
                  onClick={onExplore}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800"
                >
                  Browse All Scholarships
                </button>
              </div>
            ) : (
              recommendedScholarships.map(scholarship => {
                const isCompared = comparisonList.includes(scholarship._id);
                return (
                  <div
                    key={scholarship._id}
                    className="bg-white rounded-2xl p-5 border border-[#E2DDD5] hover:border-emerald-500/40 shadow-xs hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Strong Match
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            {scholarship.provider}
                          </span>
                          {scholarship.verificationStatus === 'verified_official' && (
                            <span className="text-[10px] text-emerald-700 font-medium flex items-center space-x-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Verified Source</span>
                            </span>
                          )}
                        </div>
                        <h3
                          onClick={() => onOpenScholarshipDetail(scholarship)}
                          className="text-base font-bold text-[#0F172A] hover:text-emerald-700 cursor-pointer transition-colors"
                        >
                          {scholarship.name}
                        </h3>
                      </div>

                      <div className="text-left sm:text-right flex-shrink-0">
                        <p className="text-base font-extrabold text-emerald-700">
                          {scholarship.fundingFormatted}
                        </p>
                        <p className="text-[11px] text-gray-500 capitalize">
                          {scholarship.fundingType.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#475569] line-clamp-2">
                      {scholarship.description}
                    </p>

                    {/* Explainability Mini Summary */}
                    {scholarship.eligibility && (
                      <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] text-[11px] text-[#334155] space-y-1">
                        <p className="font-semibold text-emerald-800 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Why you qualify:</span>
                        </p>
                        <p className="text-gray-600">
                          {scholarship.eligibility.plainLanguageExplanation}
                        </p>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                      <div className="flex items-center space-x-3 text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Deadline: {new Date(scholarship.applicationDeadline).toLocaleDateString()}</span>
                        </span>
                        <label className="hidden sm:flex items-center space-x-1 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isCompared}
                            onChange={() => onToggleCompare(scholarship._id)}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-[11px] text-gray-600">Compare</span>
                        </label>
                      </div>

                      <button
                        onClick={() => onOpenScholarshipDetail(scholarship)}
                        className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
                      >
                        <span>Audit Eligibility &amp; Readiness</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right (4 Cols): Deadline Intelligence & Document Readiness */}
        <div className="lg:col-span-4 space-y-6">
          {/* Deadline Intelligence Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2DDD5] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-sm text-[#0F172A] flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Deadline Intelligence</span>
              </h3>
              <span className="text-[11px] font-semibold text-gray-500">Next 21 Days</span>
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-3 text-center">
                  No scholarships closing within the next 21 days.
                </p>
              ) : (
                upcomingDeadlines.map(item => {
                  const isUrgent = item.daysRemaining <= 5;
                  return (
                    <div
                      key={item._id}
                      onClick={() => onOpenScholarshipDetail(item)}
                      className="p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EFE8] border border-[#EAE5DC] cursor-pointer transition-colors space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-[#0F172A] line-clamp-1">
                          {item.name}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${
                            isUrgent
                              ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {item.daysRemaining === 0 ? 'Today!' : `${item.daysRemaining}d left`}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 flex items-center justify-between">
                        <span>{item.fundingFormatted}</span>
                        <span>Due {new Date(item.applicationDeadline).toLocaleDateString()}</span>
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Document Readiness Summary Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#E2DDD5] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-sm text-[#0F172A] flex items-center space-x-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Document Readiness</span>
              </h3>
              <span className="text-xs font-bold text-teal-800">
                {metrics.documentReadinessPercent}%
              </span>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.documentReadinessPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-500">
                Confirmed: {metrics.documentsReadyCount} documents.
                {metrics.digiLockerVerifiedCount ? (
                  <span className="font-semibold text-emerald-800 ml-1 inline-flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                    {metrics.digiLockerVerifiedCount} DigiLocker Verified
                  </span>
                ) : null}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenOnboarding}
                className="w-full py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold text-center transition-colors"
              >
                Sync with DigiLocker &amp; Documents
              </button>
            </div>
          </div>

          {/* Application Tracker Quick Widget */}
          <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="font-bold text-sm text-white">Application Pipeline</h3>
            <p className="text-xs text-slate-300">
              Track drafts, requested recommendation letters, and submission receipts in your persistent tracker.
            </p>
            <button
              onClick={onGoToTracker}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Open Application Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

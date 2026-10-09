import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Filter,
  RotateCcw,
  Layers,
  AlertCircle,
  HelpCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { Scholarship } from '../types';
import { useAuth } from '../context/AuthContext';

interface ScholarshipDiscoveryProps {
  onOpenDetail: (scholarship: Scholarship) => void;
  comparisonList: string[];
  onToggleCompare: (id: string) => void;
  onOpenComparison: () => void;
}

export const ScholarshipDiscovery: React.FC<ScholarshipDiscoveryProps> = ({
  onOpenDetail,
  comparisonList,
  onToggleCompare,
  onOpenComparison
}) => {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [educationLevel, setEducationLevel] = useState<string>('all');
  const [course, setCourse] = useState<string>('all');
  const [category, setCategory] = useState<string>('all');
  const [verificationStatus, setVerificationStatus] = useState<string>('all');
  const [eligibilityFilter, setEligibilityFilter] = useState<string>('all');
  const [minFunding, setMinFunding] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('relevance');

  const fetchScholarships = async (targetPage = 1) => {
    setIsLoading(true);
    try {
      const res = await api.getScholarships({
        q: searchQuery,
        educationLevel,
        course,
        category,
        verificationStatus,
        minFunding: minFunding > 0 ? minFunding : undefined,
        sortBy,
        page: targetPage,
        limit: 9
      });

      let fetched = res.scholarships;

      // Filter by eligibility outcome in client view if requested
      if (eligibilityFilter !== 'all') {
        fetched = fetched.filter(s => s.eligibility?.outcome === eligibilityFilter);
      }

      setScholarships(fetched);
      setTotalCount(res.totalCount);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching scholarships:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships(1);
  }, [educationLevel, course, category, verificationStatus, eligibilityFilter, minFunding, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchScholarships(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setEducationLevel('all');
    setCourse('all');
    setCategory('all');
    setVerificationStatus('all');
    setEligibilityFilter('all');
    setMinFunding(0);
    setSortBy('relevance');
  };

  const handleToggleSave = async (scholarship: Scholarship, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (scholarship.isSaved) {
        await api.removeSavedScholarship(scholarship._id);
      } else {
        await api.saveScholarship(scholarship._id);
      }
      setScholarships(prev =>
        prev.map(s => (s._id === scholarship._id ? { ...s, isSaved: !s.isSaved } : s))
      );
    } catch (err) {
      console.error('Save toggle failed:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Title & Search bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Scholarship Discovery &amp; Catalog
            </h1>
            <p className="text-sm text-[#64748B]">
              Discover curated opportunities with real-time explainable eligibility audits.
            </p>
          </div>

          {comparisonList.length > 0 && (
            <button
              onClick={onOpenComparison}
              className="px-4 py-2 rounded-xl bg-teal-700 text-white font-bold text-xs flex items-center space-x-2 shadow-xs hover:bg-teal-800 transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span>Compare {comparisonList.length} Selected</span>
            </button>
          )}
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by scholarship title, provider, field of study, or keyword..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#D5CEC0] text-sm text-[#0F172A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-sm transition-colors shadow-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2DDD5] shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-xs font-semibold text-gray-500">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multi-Criteria Filters</span>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 text-xs">
          {/* Education Level */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Education Level</label>
            <select
              value={educationLevel}
              onChange={e => setEducationLevel(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#DDD5C7] text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="doctoral">Doctoral / PhD</option>
              <option value="high_school">School / Intermediate</option>
            </select>
          </div>

          {/* Discipline / Course */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Field of Study</label>
            <select
              value={course}
              onChange={e => setCourse(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#DDD5C7] text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">All Streams</option>
              <option value="Computer Science">B.Tech / CSE / IT</option>
              <option value="Engineering">Engineering (All)</option>
              <option value="Medical">MBBS / Medical</option>
              <option value="Commerce">Commerce / B.Com</option>
              <option value="Arts">Humanities / Arts</option>
              <option value="Science">Pure Science / B.Sc</option>
            </select>
          </div>

          {/* Reservation Category */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Reservation Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#DDD5C7] text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>

          {/* Eligibility Fit Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">My Eligibility</label>
            <select
              value={eligibilityFilter}
              onChange={e => setEligibilityFilter(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#DDD5C7] text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Strong Match">Strong Match</option>
              <option value="Needs Confirmation">Needs Confirmation</option>
              <option value="Does Not Match">Does Not Match</option>
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Source Verification</label>
            <select
              value={verificationStatus}
              onChange={e => setVerificationStatus(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#DDD5C7] text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">All Sources</option>
              <option value="verified_official">Official Verified</option>
              <option value="verification_required">Needs Verification</option>
              <option value="expired">Expired Records</option>
            </select>
          </div>

          {/* Minimum Funding Amount */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Min Award (₹)</label>
            <select
              value={minFunding}
              onChange={e => setMinFunding(Number(e.target.value))}
              className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#DDD5C7] text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value={0}>Any Amount</option>
              <option value={25000}>₹25,000+</option>
              <option value={50000}>₹50,000+</option>
              <option value={100000}>₹1,00,000+</option>
              <option value={200000}>₹2,00,000+</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#DDD5C7] text-gray-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="relevance">Relevance &amp; Fit</option>
              <option value="deadline">Approaching Deadline</option>
              <option value="funding">Highest Funding (₹)</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <p>
          Showing <span className="font-bold text-[#0F172A]">{scholarships.length}</span> of {totalCount} verified listings
        </p>
      </div>

      {/* Scholarships Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-72 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      ) : scholarships.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#E2DDD5] text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-[#0F172A]">No Scholarships Found</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            No opportunities matched your active filters. Try clearing specific constraints or searching for broader terms.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map(scholarship => {
            const isCompared = comparisonList.includes(scholarship._id);
            const elig = scholarship.eligibility;

            let badgeBg = 'bg-gray-100 text-gray-700 border-gray-300';
            if (elig?.outcome === 'Strong Match') badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
            else if (elig?.outcome === 'Needs Confirmation') badgeBg = 'bg-amber-100 text-amber-800 border-amber-300';
            else if (elig?.outcome === 'Does Not Match') badgeBg = 'bg-rose-100 text-rose-800 border-rose-300';

            return (
              <div
                key={scholarship._id}
                className="bg-white rounded-2xl p-5 border border-[#E2DDD5] hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
              >
                {/* Header: Provider & Bookmark */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-500 line-clamp-1">
                      {scholarship.provider}
                    </span>
                    <button
                      onClick={e => handleToggleSave(scholarship, e)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        scholarship.isSaved
                          ? 'bg-amber-50 border-amber-300 text-amber-600'
                          : 'bg-white border-gray-200 text-gray-400 hover:text-[#0F172A]'
                      }`}
                      title={scholarship.isSaved ? 'Saved to Bookmarks' : 'Save Scholarship'}
                    >
                      <Bookmark className={`w-4 h-4 ${scholarship.isSaved ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onOpenDetail(scholarship)}
                    className="font-bold text-base text-[#0F172A] group-hover:text-emerald-700 cursor-pointer line-clamp-2 leading-snug transition-colors"
                  >
                    {scholarship.name}
                  </h3>

                  {/* Funding Highlight */}
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-extrabold text-emerald-700">
                      {scholarship.fundingFormatted}
                    </span>
                    <span className="text-[11px] text-gray-500 capitalize">
                      {scholarship.fundingType.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Eligibility Pill */}
                  {elig && (
                    <div className="pt-1">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeBg}`}
                      >
                        {elig.outcome === 'Strong Match' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {elig.outcome === 'Needs Confirmation' && <HelpCircle className="w-3 h-3 text-amber-600" />}
                        {elig.outcome === 'Does Not Match' && <XCircle className="w-3 h-3 text-rose-600" />}
                        <span>{elig.outcome}</span>
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed pt-1">
                    {scholarship.description}
                  </p>
                </div>

                {/* Metadata & Actions */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Due {new Date(scholarship.applicationDeadline).toLocaleDateString()}</span>
                    </span>

                    {scholarship.verificationStatus === 'verified_official' ? (
                      <span className="text-emerald-700 font-medium flex items-center space-x-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : scholarship.verificationStatus === 'expired' ? (
                      <span className="text-rose-600 font-medium">Expired</span>
                    ) : (
                      <span className="text-amber-700 font-medium">Pending Review</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => onToggleCompare(scholarship._id)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-[11px] text-gray-600">Compare</span>
                    </label>

                    <button
                      onClick={() => onOpenDetail(scholarship)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EFE8] text-[#0F172A] font-bold text-xs border border-[#DDD5C7] flex items-center space-x-1 group-hover:border-emerald-600 group-hover:text-emerald-800 transition-colors"
                    >
                      <span>View &amp; Audit</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            disabled={page <= 1}
            onClick={() => fetchScholarships(page - 1)}
            className="px-3 py-1.5 rounded-lg border border-[#DDD5C7] bg-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF7F2]"
          >
            Previous
          </button>
          <span className="text-xs font-medium text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => fetchScholarships(page + 1)}
            className="px-3 py-1.5 rounded-lg border border-[#DDD5C7] bg-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FAF7F2]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

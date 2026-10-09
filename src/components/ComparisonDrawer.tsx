import React, { useEffect, useState } from 'react';
import {
  X,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { Scholarship } from '../types';
import { api } from '../services/api';

interface ComparisonDrawerProps {
  scholarshipIds: string[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onOpenDetail: (scholarship: Scholarship) => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  scholarshipIds,
  onClose,
  onRemove,
  onOpenDetail
}) => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSelected = async () => {
      setIsLoading(true);
      try {
        const promises = scholarshipIds.map(id => api.getScholarshipById(id));
        const results = await Promise.all(promises);
        setScholarships(results.map(r => r.scholarship));
      } catch (err) {
        console.error('Error fetching comparison items:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (scholarshipIds.length > 0) {
      fetchSelected();
    } else {
      setScholarships([]);
      setIsLoading(false);
    }
  }, [scholarshipIds]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E2DDD5] text-left overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#E2DDD5] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#0F172A] tracking-tight">
                Side-by-Side Scholarship Comparison
              </h2>
              <p className="text-xs text-gray-500">
                Evaluating {scholarships.length} of 3 opportunities simultaneously
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-x-auto flex-1">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-xs">
              Loading side-by-side metrics...
            </div>
          ) : scholarships.length === 0 ? (
            <div className="p-12 text-center text-gray-500 space-y-2">
              <p className="font-semibold text-sm">No scholarships selected for comparison.</p>
              <p className="text-xs">Select "Compare" on up to 3 cards on the Discovery page.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[700px]">
              {scholarships.map(s => {
                const elig = s.eligibility;
                return (
                  <div
                    key={s._id}
                    className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#E2DDD5] flex flex-col justify-between space-y-4 shadow-xs"
                  >
                    {/* Scholarship Top Info */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-semibold text-gray-500 line-clamp-1">
                          {s.provider}
                        </span>
                        <button
                          onClick={() => onRemove(s._id)}
                          className="text-gray-400 hover:text-rose-600 transition-colors"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="font-black text-base text-[#0F172A] line-clamp-2">
                        {s.name}
                      </h3>

                      <div className="p-3 rounded-xl bg-white border border-[#E2DDD5] space-y-1">
                        <p className="text-xs text-gray-500 font-medium">Funding Award</p>
                        <p className="text-xl font-black text-emerald-700">{s.fundingFormatted}</p>
                        <p className="text-[10px] text-gray-500 capitalize">{s.fundingType.replace('_', ' ')}</p>
                      </div>

                      {/* Eligibility Fit Badge */}
                      {elig && (
                        <div
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 ${
                            elig.outcome === 'Strong Match'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                              : elig.outcome === 'Needs Confirmation'
                              ? 'bg-amber-50 border-amber-300 text-amber-900'
                              : 'bg-rose-50 border-rose-300 text-rose-900'
                          }`}
                        >
                          {elig.outcome === 'Strong Match' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          {elig.outcome === 'Needs Confirmation' && <HelpCircle className="w-4 h-4 text-amber-600" />}
                          {elig.outcome === 'Does Not Match' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                          <span>{elig.outcome}</span>
                        </div>
                      )}

                      {/* Comparative Attribute Rows */}
                      <div className="space-y-2 text-xs pt-2">
                        <div className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-500">Degree Level</span>
                          <span className="font-semibold text-gray-900 capitalize">
                            {s.educationLevels.join(', ')}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-500">Field / Major</span>
                          <span className="font-semibold text-gray-900 line-clamp-1 max-w-[150px]">
                            {s.eligibleCourses.join(', ')}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-500">Minimum GPA</span>
                          <span className="font-semibold text-gray-900">
                            {s.minCgpa ? `${s.minCgpa.toFixed(2)}` : 'None'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-500">Income Limit</span>
                          <span className="font-semibold text-gray-900">
                            {s.maxAnnualIncome && s.maxAnnualIncome < 90000000
                              ? `₹${(s.maxAnnualIncome / 100000).toFixed(1)}L / yr`
                              : 'No cap'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-200">
                          <span className="text-gray-500">Deadline</span>
                          <span className="font-semibold text-gray-900">
                            {new Date(s.applicationDeadline).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="py-1 border-b border-gray-200">
                          <span className="text-gray-500 block mb-1">Required Documents ({s.requiredDocuments.length})</span>
                          <ul className="text-[11px] text-[#334155] list-disc list-inside space-y-0.5">
                            {s.requiredDocuments.slice(0, 3).map((d, i) => (
                              <li key={i} className="truncate">{d}</li>
                            ))}
                            {s.requiredDocuments.length > 3 && (
                              <li className="text-gray-500 font-medium">+{s.requiredDocuments.length - 3} more...</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-2">
                      <button
                        onClick={() => onOpenDetail(s)}
                        className="w-full py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-[#D5CEC0] text-xs font-bold text-[#0F172A] shadow-xs transition-colors"
                      >
                        Inspect Full Audit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

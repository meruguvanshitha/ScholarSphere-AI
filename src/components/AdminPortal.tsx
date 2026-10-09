import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  ExternalLink,
  ShieldCheck,
  Clock,
  Layers,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { Scholarship } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminPortal: React.FC = () => {
  const { user, switchDemoUser } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lifecycleFilter, setLifecycleFilter] = useState<string>('');
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formProvider, setFormProvider] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formAmount, setFormAmount] = useState('60000');
  const [formFormatted, setFormFormatted] = useState('₹60,000 / year');
  const [formType, setFormType] = useState<'full_tuition' | 'partial' | 'stipend' | 'grant' | 'merit_award'>('grant');
  const [formLevels, setFormLevels] = useState('undergraduate');
  const [formCourses, setFormCourses] = useState('B.Tech Computer Science, Engineering');
  const [formMinGpa, setFormMinGpa] = useState('7.5');
  const [formMinScore, setFormMinScore] = useState('75');
  const [formMaxIncome, setFormMaxIncome] = useState('350000');
  const [formRegions, setFormRegions] = useState('All India');
  const [formDeadline, setFormDeadline] = useState('2026-12-01T23:59:59.000Z');
  const [formUrl, setFormUrl] = useState('https://scholarships.gov.in');
  const [formVerification, setFormVerification] = useState<'verified_official' | 'not_verified' | 'verification_required' | 'expired'>('verified_official');
  const [formLifecycle, setFormLifecycle] = useState<'active' | 'draft' | 'archived'>('active');
  const [formDocs, setFormDocs] = useState('Class 12th Marks Memo, Income Certificate, Bonafide Certificate, Aadhaar Card');

  const fetchAdminScholarships = async () => {
    setIsLoading(true);
    try {
      const res = await api.getScholarships({
        q: searchQuery,
        lifecycleStatus: lifecycleFilter || undefined,
        limit: 50
      });
      setScholarships(res.scholarships);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error fetching records.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminScholarships();
  }, [lifecycleFilter]);

  const handleOpenCreate = () => {
    setEditingScholarship(null);
    setFormName('');
    setFormProvider('');
    setFormDesc('');
    setFormAmount('50000');
    setFormFormatted('₹50,000 / year');
    setFormType('grant');
    setFormLevels('undergraduate');
    setFormCourses('B.Tech Computer Science, Engineering, Any');
    setFormMinGpa('7.0');
    setFormMinScore('70');
    setFormMaxIncome('450000');
    setFormRegions('All India');
    setFormDeadline('2026-11-30T23:59:59.000Z');
    setFormUrl('https://scholarships.gov.in');
    setFormVerification('verified_official');
    setFormLifecycle('active');
    setFormDocs('Class 12th Marks Memo, Income Certificate (Tehsildar), Bonafide Certificate, Aadhaar Card');
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (s: Scholarship) => {
    setEditingScholarship(s);
    setFormName(s.name);
    setFormProvider(s.provider);
    setFormDesc(s.description);
    setFormAmount(String(s.fundingAmount));
    setFormFormatted(s.fundingFormatted);
    setFormType(s.fundingType);
    setFormLevels(s.educationLevels.join(', '));
    setFormCourses(s.eligibleCourses.join(', '));
    setFormMinGpa(s.minCgpa ? String(s.minCgpa) : '');
    setFormMinScore(s.minScorePercent ? String(s.minScorePercent) : '');
    setFormMaxIncome(s.maxAnnualIncome ? String(s.maxAnnualIncome) : '');
    setFormRegions(s.eligibleRegions.join(', '));
    setFormDeadline(s.applicationDeadline);
    setFormUrl(s.officialUrl);
    setFormVerification(s.verificationStatus);
    setFormLifecycle(s.lifecycleStatus);
    setFormDocs(s.requiredDocuments.join(', '));
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<Scholarship> = {
        name: formName,
        provider: formProvider,
        description: formDesc,
        fundingAmount: parseFloat(formAmount) || 0,
        fundingFormatted: formFormatted,
        fundingType: formType,
        educationLevels: formLevels.split(',').map(s => s.trim().toLowerCase()),
        eligibleCourses: formCourses.split(',').map(s => s.trim()),
        minCgpa: formMinGpa ? parseFloat(formMinGpa) : undefined,
        minScorePercent: formMinScore ? parseFloat(formMinScore) : undefined,
        maxAnnualIncome: formMaxIncome ? parseFloat(formMaxIncome) : undefined,
        eligibleRegions: formRegions.split(',').map(s => s.trim()),
        applicationDeadline: formDeadline,
        officialUrl: formUrl,
        verificationStatus: formVerification,
        lifecycleStatus: formLifecycle,
        requiredDocuments: formDocs.split(',').map(s => s.trim())
      };

      if (editingScholarship) {
        await api.updateScholarship(editingScholarship._id, payload);
        setMessage({ type: 'success', text: `Updated "${formName}" successfully.` });
      } else {
        await api.createScholarship(payload);
        setMessage({ type: 'success', text: `Created "${formName}" successfully.` });
      }

      setIsFormModalOpen(false);
      fetchAdminScholarships();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Operation failed.' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Permanently remove scholarship "${name}"?`)) return;
    try {
      await api.deleteScholarship(id);
      setMessage({ type: 'success', text: `Scholarship "${name}" deleted.` });
      setScholarships(prev => prev.filter(s => s._id !== id));
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete.' });
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm('Reset all scholarships and applications back to the clean 14-record seed state?')) return;
    try {
      await api.resetDemoData();
      setMessage({ type: 'success', text: 'Catalog reset to original seed dataset.' });
      fetchAdminScholarships();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Reset failed.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Top Banner / Access Control Notification */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E2DDD5]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-purple-900 text-purple-300 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
              Administrator Governance Portal
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage scholarship listings, verification lifecycle status, and rule criteria.
          </p>
        </div>

        {/* Admin Tools Actions */}
        <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
          {user?.role !== 'admin' && (
            <button
              onClick={() => switchDemoUser('admin_eleanor')}
              className="px-3.5 py-2 rounded-xl bg-purple-100 text-purple-950 border border-purple-300 font-bold text-xs hover:bg-purple-200 transition-colors"
            >
              Switch to Admin Role (Dr. Eleanor Vance)
            </button>
          )}

          <button
            onClick={handleResetDemo}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#D5CEC0] text-gray-700 hover:bg-gray-100 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
            title="Reset to initial seed records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Dataset</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Scholarship</span>
          </button>
        </div>
      </div>

      {/* Notice Message */}
      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2DDD5] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchAdminScholarships()}
            placeholder="Search listings..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto text-xs">
          <label className="text-gray-500 font-semibold">Lifecycle Status:</label>
          <select
            value={lifecycleFilter}
            onChange={e => setLifecycleFilter(e.target.value)}
            className="p-2 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-xs font-semibold focus:outline-none"
          >
            <option value="">All (Active + Draft + Archived)</option>
            <option value="active">Active Only</option>
            <option value="draft">Draft Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-2xl border border-[#E2DDD5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF7F2] border-b border-[#E2DDD5] text-gray-600 font-bold">
              <tr>
                <th className="p-3.5">Scholarship Name &amp; Provider</th>
                <th className="p-3.5">Funding Award</th>
                <th className="p-3.5">Deadline</th>
                <th className="p-3.5">Verification</th>
                <th className="p-3.5">Lifecycle</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Loading administrative records...
                  </td>
                </tr>
              ) : scholarships.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No scholarship records found.
                  </td>
                </tr>
              ) : (
                scholarships.map(s => (
                  <tr key={s._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-[#0F172A]">{s.name}</p>
                      <p className="text-[11px] text-gray-500">{s.provider}</p>
                    </td>

                    <td className="p-3.5 font-bold text-emerald-800">
                      {s.fundingFormatted}
                    </td>

                    <td className="p-3.5 text-gray-700">
                      {new Date(s.applicationDeadline).toLocaleDateString()}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.verificationStatus === 'verified_official'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.verificationStatus === 'expired'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {s.verificationStatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.lifecycleStatus === 'active'
                            ? 'bg-blue-100 text-blue-800'
                            : s.lifecycleStatus === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {s.lifecycleStatus}
                      </span>
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700"
                        title="Edit record"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id, s.name)}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-rose-50 text-rose-600"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E2DDD5] text-left overflow-hidden">
            <div className="p-6 border-b border-[#E2DDD5] bg-[#FAF7F2] flex items-center justify-between">
              <h3 className="font-black text-lg text-[#0F172A]">
                {editingScholarship ? 'Edit Scholarship Opportunity' : 'Create New Scholarship Listing'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-200 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-gray-700 mb-1">Scholarship Title</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. National Cyber Fellowship"
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs focus:outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-gray-700 mb-1">Provider / Foundation</label>
                  <input
                    type="text"
                    required
                    value={formProvider}
                    onChange={e => setFormProvider(e.target.value)}
                    placeholder="e.g. Federal Research Alliance"
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Description &amp; Benefits</label>
                  <textarea
                    required
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                    rows={3}
                    placeholder="Provide overview, benefits, and eligibility overview..."
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Funding Numeric Amount (₹ INR)</label>
                  <input
                    type="number"
                    value={formAmount}
                    onChange={e => setFormAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Formatted Display Label</label>
                  <input
                    type="text"
                    value={formFormatted}
                    onChange={e => setFormFormatted(e.target.value)}
                    placeholder="e.g. ₹50,000 / year"
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Education Level (comma separated)</label>
                  <input
                    type="text"
                    value={formLevels}
                    onChange={e => setFormLevels(e.target.value)}
                    placeholder="undergraduate, postgraduate"
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Eligible Courses / Streams</label>
                  <input
                    type="text"
                    value={formCourses}
                    onChange={e => setFormCourses(e.target.value)}
                    placeholder="B.Tech Computer Science, Engineering, Any"
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Minimum CGPA Cutoff (10.0 scale)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={formMinGpa}
                    onChange={e => setFormMinGpa(e.target.value)}
                    placeholder="7.5"
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Max Annual Income Ceiling (₹ INR)</label>
                  <input
                    type="number"
                    value={formMaxIncome}
                    onChange={e => setFormMaxIncome(e.target.value)}
                    placeholder="350000"
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Verification Status</label>
                  <select
                    value={formVerification}
                    onChange={e => setFormVerification(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs focus:outline-none font-semibold"
                  >
                    <option value="verified_official">verified_official</option>
                    <option value="verification_required">verification_required</option>
                    <option value="expired">expired</option>
                    <option value="not_verified">not_verified</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Lifecycle Status</label>
                  <select
                    value={formLifecycle}
                    onChange={e => setFormLifecycle(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs focus:outline-none font-semibold"
                  >
                    <option value="active">active</option>
                    <option value="draft">draft</option>
                    <option value="archived">archived</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Application Deadline (ISO Date)</label>
                  <input
                    type="text"
                    required
                    value={formDeadline}
                    onChange={e => setFormDeadline(e.target.value)}
                    placeholder="2026-11-30T23:59:59.000Z"
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Official Application URL</label>
                  <input
                    type="url"
                    required
                    value={formUrl}
                    onChange={e => setFormUrl(e.target.value)}
                    placeholder="https://example.org/application"
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Required Documents (comma separated)</label>
                  <input
                    type="text"
                    value={formDocs}
                    onChange={e => setFormDocs(e.target.value)}
                    placeholder="Academic Transcripts, Proof of Enrollment, Statement of Purpose"
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  {editingScholarship ? 'Save Changes' : 'Create Scholarship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

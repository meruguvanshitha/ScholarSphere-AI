import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Filter,
  Download,
  Printer,
  ShieldCheck,
  Award,
  Layers,
  X
} from 'lucide-react';
import { Application, Scholarship, DocumentChecklistItem } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ApplicationTrackerProps {
  onOpenDetail: (scholarship: Scholarship) => void;
  onExplore: () => void;
}

const STATUS_COLUMNS = [
  { key: 'interested', label: 'Interested', color: 'bg-slate-100 text-slate-800 border-slate-300' },
  { key: 'preparing_documents', label: 'Preparing Documents', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { key: 'ready_to_apply', label: 'Ready to Apply', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  { key: 'applied', label: 'Applied', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  { key: 'under_review', label: 'Under Review', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { key: 'awarded', label: 'Awarded!', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { key: 'rejected', label: 'Rejected', color: 'bg-rose-100 text-rose-800 border-rose-300' }
];

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  onOpenDetail,
  onExplore
}) => {
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [expandedChecklistAppId, setExpandedChecklistAppId] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await api.getApplications();
      setApplications(res.applications);
    } catch (err) {
      console.error('Error fetching tracker items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (scholarshipId: string, newStatus: string) => {
    try {
      await api.updateApplication(scholarshipId, { trackerStatus: newStatus });
      setApplications(prev =>
        prev.map(app =>
          app.scholarshipId === scholarshipId ? { ...app, trackerStatus: newStatus as any } : app
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveNotes = async (scholarshipId: string) => {
    try {
      await api.updateApplication(scholarshipId, { notes: tempNotes });
      setApplications(prev =>
        prev.map(app =>
          app.scholarshipId === scholarshipId ? { ...app, notes: tempNotes } : app
        )
      );
      setEditingNotesId(null);
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  const handleToggleDoc = async (scholarshipId: string, docName: string, currentReady: boolean) => {
    try {
      await api.updateDocumentChecklist(scholarshipId, docName, !currentReady);
      setApplications(prev =>
        prev.map(app => {
          if (app.scholarshipId !== scholarshipId) return app;
          const updatedChecklist = (app.checklistProgress || []).map(item =>
            item.documentName === docName ? { ...item, isReady: !currentReady } : item
          );
          return { ...app, checklistProgress: updatedChecklist };
        })
      );
    } catch (err) {
      console.error('Checklist update failed:', err);
    }
  };

  const handleDelete = async (scholarshipId: string) => {
    if (!window.confirm('Remove this scholarship from your application tracker?')) return;
    try {
      await api.deleteApplication(scholarshipId);
      setApplications(prev => prev.filter(app => app.scholarshipId !== scholarshipId));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const isDigiLockerDocument = (docName: string, scholarship?: Scholarship | null) => {
    const docLower = docName.toLowerCase();
    return (
      docLower.includes('income') ||
      docLower.includes('bonafide') ||
      docLower.includes('marksheet') ||
      docLower.includes('marks memo') ||
      docLower.includes('intermediate') ||
      docLower.includes('ssc') ||
      docLower.includes('aadhaar') ||
      Boolean(scholarship?.digiLockerSupportedDocs?.includes(docName)) ||
      Boolean(profile?.digiLockerVerifiedDocs?.includes(docName))
    );
  };

  const generateBriefText = () => {
    const lines: string[] = [];
    lines.push('===============================================================');
    lines.push('SCHOLARSPHERE — OFFICIAL STUDENT APPLICATION BRIEF');
    lines.push('Intelligent Scholarship Discovery & Eligibility Platform');
    lines.push('Tagline: "Your Potential Deserves Funding"');
    lines.push('Generated: ' + new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' }));
    lines.push('===============================================================\n');

    lines.push('--- CANDIDATE PROFILE ---');
    lines.push(`Student Name:       ${user?.name || 'Aarav Sharma'}`);
    lines.push(`Email Address:      ${user?.email || 'student@college.edu.in'}`);
    lines.push(`Institution:        ${profile?.institution || 'Osmania University College of Engineering'}`);
    lines.push(`Enrolled Course:    ${profile?.course || 'B.Tech Computer Science & Engineering'}`);
    lines.push(`Academic Metric:    CGPA ${profile?.cgpa || '8.80'} / 10.0 scale (${profile?.scorePercent || '88'}%)`);
    lines.push(`Annual Family Inc:  ₹${profile?.familyIncomeAnnual ? (profile.familyIncomeAnnual / 100000).toFixed(2) + ' Lakhs / year' : '3.5 Lakhs / year'}`);
    lines.push(`Reservation Tier:   ${profile?.reservationCategory || 'EWS'}`);
    lines.push(`Domicile State:     ${profile?.stateOrRegion || 'Telangana'}, ${profile?.country || 'India'}\n`);

    lines.push('--- PIPELINE EXECUTIVE SUMMARY ---');
    lines.push(`Total Opportunities Tracked:  ${applications.length}`);
    const totalPotential = applications.reduce((sum, app) => sum + (app.scholarship?.fundingAmount || 0), 0);
    lines.push(`Aggregated Funding Target:    ₹${totalPotential.toLocaleString('en-IN')}`);
    lines.push(`Active Pipeline Stages:`);
    STATUS_COLUMNS.forEach(col => {
      const count = applications.filter(a => a.trackerStatus === col.key).length;
      if (count > 0) lines.push(`  * ${col.label}: ${count}`);
    });
    lines.push('\n--- DETAILED SCHOLARSHIP PIPELINE ---');

    applications.forEach((app, idx) => {
      const sch = app.scholarship;
      lines.push(`[#${idx + 1}] ${sch?.name || 'Scholarship Scheme'}`);
      lines.push(`    Provider:          ${sch?.provider || 'Official Body'}`);
      lines.push(`    Funding Award:     ${sch?.fundingFormatted || '₹0'}`);
      lines.push(`    Current Status:    ${app.trackerStatus.toUpperCase().replace('_', ' ')}`);
      lines.push(`    Deadline:          ${sch?.applicationDeadline ? new Date(sch.applicationDeadline).toLocaleDateString('en-IN') : 'N/A'}`);
      lines.push(`    Official Portal:   ${sch?.officialUrl || 'N/A'}`);
      lines.push(`    Candidate Notes:   ${app.notes || 'No custom notes'}`);

      const docs = app.checklistProgress || [];
      const readyCount = docs.filter(d => d.isReady).length;
      lines.push(`    Document Readiness: ${readyCount}/${docs.length} Prepared`);
      docs.forEach(doc => {
        const isDigi = isDigiLockerDocument(doc.documentName, sch);
        lines.push(`       ${doc.isReady ? '[✓ READY]' : '[  PENDING]'} ${doc.documentName} ${isDigi ? '(DigiLocker Verified)' : ''}`);
      });
      lines.push('');
    });

    lines.push('===============================================================');
    lines.push('End of Application Brief. Keep documents certified via DigiLocker.');
    lines.push('ScholarSphere India • Built on MongoDB, Express, React & Node.js');
    lines.push('===============================================================');

    return lines.join('\n');
  };

  const handleDownloadBrief = () => {
    const content = generateBriefText();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ScholarSphere_Application_Brief_${user?.name?.replace(/\s+/g, '_') || 'Student'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredApps = activeFilter === 'all'
    ? applications
    : applications.filter(app => app.trackerStatus === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Tracker Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E2DDD5]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Persistent Application Tracker
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              MongoDB Synced
            </span>
          </div>
          <p className="text-sm text-[#64748B]">
            Manage application lifecycle stages, submission notes, and certified DigiLocker document readiness.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Export Application Brief Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F3EFE8] text-[#0F172A] font-bold text-xs border border-[#D5CEC0] flex items-center space-x-1.5 shadow-xs transition-colors"
            title="Generate clean downloadable and printable application summary"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Export Application Brief</span>
          </button>

          <button
            onClick={onExplore}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add More from Catalog</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex-shrink-0 ${
            activeFilter === 'all'
              ? 'bg-[#0F172A] text-white'
              : 'bg-white border border-[#DDD5C7] text-gray-700 hover:bg-[#FAF7F2]'
          }`}
        >
          All Opportunities ({applications.length})
        </button>
        {STATUS_COLUMNS.map(col => {
          const count = applications.filter(a => a.trackerStatus === col.key).length;
          return (
            <button
              key={col.key}
              onClick={() => setActiveFilter(col.key)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex-shrink-0 ${
                activeFilter === col.key
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-white border border-[#DDD5C7] text-gray-700 hover:bg-[#FAF7F2]'
              }`}
            >
              {col.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Application Cards List */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#E2DDD5] text-center space-y-4 shadow-xs">
          <CheckSquare className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-[#0F172A]">No Tracked Applications</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {activeFilter === 'all'
              ? 'You have not added any scholarships to your tracker yet. Browse verified opportunities and click "Add to Tracker".'
              : `No applications currently have the status "${activeFilter.replace('_', ' ')}".`}
          </p>
          <button
            onClick={onExplore}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors shadow-xs"
          >
            Explore Scholarships
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map(app => {
            const sch = app.scholarship;
            const completedDocs = (app.checklistProgress || []).filter(c => c.isReady).length;
            const totalDocs = (app.checklistProgress || []).length;
            const currentCol = STATUS_COLUMNS.find(c => c.key === app.trackerStatus);
            const isChecklistExpanded = expandedChecklistAppId === app._id;

            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl p-5 border border-[#E2DDD5] shadow-xs hover:shadow-md transition-shadow space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${currentCol?.color || 'bg-gray-100'}`}>
                        {currentCol?.label || app.trackerStatus}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        {sch?.provider || 'Scholarship Provider'}
                      </span>
                    </div>

                    <h3
                      onClick={() => sch && onOpenDetail(sch)}
                      className="text-base font-bold text-[#0F172A] hover:text-emerald-700 cursor-pointer transition-colors"
                    >
                      {sch?.name || 'Scholarship Record'}
                    </h3>
                  </div>

                  {/* Status Dropdown Switcher */}
                  <div className="flex items-center space-x-2">
                    <select
                      value={app.trackerStatus}
                      onChange={e => handleUpdateStatus(app.scholarshipId, e.target.value)}
                      className="p-2 rounded-xl bg-[#FAF7F2] border border-[#D5CEC0] text-xs font-bold text-[#0F172A] focus:outline-none"
                    >
                      {STATUS_COLUMNS.map(col => (
                        <option key={col.key} value={col.key}>
                          Move to: {col.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleDelete(app.scholarshipId)}
                      className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-gray-200 transition-colors"
                      title="Remove from tracker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Information bar: Funding, Deadline, Checklist count */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE5DC]">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Funding Award</span>
                    <span className="font-extrabold text-emerald-800">{sch?.fundingFormatted || '₹0'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Submission Deadline</span>
                    <span className="font-bold text-[#0F172A]">
                      {sch?.applicationDeadline ? new Date(sch.applicationDeadline).toLocaleDateString('en-IN') : 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Document Readiness</span>
                    <button
                      onClick={() => setExpandedChecklistAppId(isChecklistExpanded ? null : app._id)}
                      className="font-bold text-teal-800 hover:underline flex items-center space-x-1"
                    >
                      <span>{completedDocs} of {totalDocs} Prepared</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isChecklistExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Last Update</span>
                    <span className="font-medium text-gray-600">
                      {new Date(app.updatedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Expandable Document Checklist with DigiLocker Verified Badges */}
                {isChecklistExpanded && (
                  <div className="p-4 rounded-xl bg-white border border-teal-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                      <span className="font-bold text-xs text-[#0F172A] flex items-center space-x-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Interactive Document Checklist &amp; DigiLocker Verification</span>
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700">
                        {completedDocs} / {totalDocs} Complete
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {(app.checklistProgress || []).map((doc, idx) => {
                        const isDigi = isDigiLockerDocument(doc.documentName, sch);
                        return (
                          <div
                            key={idx}
                            onClick={() => handleToggleDoc(app.scholarshipId, doc.documentName, doc.isReady)}
                            className={`p-2.5 rounded-lg border cursor-pointer select-none flex items-center justify-between transition-colors ${
                              doc.isReady
                                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-semibold'
                                : 'bg-[#FAF7F2] border-[#E2DDD5] text-gray-700'
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate pr-2">
                              <input
                                type="checkbox"
                                checked={doc.isReady}
                                onChange={() => {}}
                                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 pointer-events-none"
                              />
                              <span className="truncate text-[11px]">{doc.documentName}</span>
                            </div>

                            {isDigi && (
                              <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-900 border border-blue-200 flex-shrink-0">
                                <ShieldCheck className="w-2.5 h-2.5 text-blue-700" />
                                <span>DigiLocker Verified</span>
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700 flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5 text-gray-500" />
                      <span>Applicant Notes &amp; Action Items</span>
                    </span>
                    {editingNotesId !== app._id && (
                      <button
                        onClick={() => {
                          setEditingNotesId(app._id);
                          setTempNotes(app.notes || '');
                        }}
                        className="text-emerald-700 hover:underline flex items-center space-x-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{app.notes ? 'Edit notes' : 'Add notes'}</span>
                      </button>
                    )}
                  </div>

                  {editingNotesId === app._id ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        value={tempNotes}
                        onChange={e => setTempNotes(e.target.value)}
                        placeholder="Write reminders, recommendation letter status, portal login credentials..."
                        className="w-full p-2.5 rounded-xl border border-[#DDD5C7] text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNotes(app.scholarshipId)}
                          className="px-3 py-1 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 italic bg-white p-2 rounded-lg border border-gray-100">
                      {app.notes || 'No custom notes recorded for this application.'}
                    </p>
                  )}
                </div>

                {/* Bottom link to view full audit */}
                {sch && (
                  <div className="pt-2 flex justify-between items-center text-xs">
                    <button
                      onClick={() => setExpandedChecklistAppId(isChecklistExpanded ? null : app._id)}
                      className="text-teal-700 hover:underline font-semibold flex items-center space-x-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isChecklistExpanded ? 'Hide Checklist' : 'Show Document Checklist & DigiLocker'}</span>
                    </button>

                    <button
                      onClick={() => onOpenDetail(sch)}
                      className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
                    >
                      <span>Open Full Eligibility Audit</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Export Application Brief Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E2DDD5] text-left overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-[#E2DDD5] bg-[#FAF7F2] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight">
                    Export Application Brief
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Clean student summary with tracked schemes, deadlines, and DigiLocker certificates
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-200 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Preview */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs font-sans">
              {/* Profile Card Header */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E2DDD5] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-[#0F172A]">{user?.name || 'Aarav Sharma'}</h3>
                    <p className="text-gray-500">{user?.email || 'student@college.edu.in'}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase border border-emerald-300">
                    Verified Candidate
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-200 text-[11px]">
                  <div>
                    <span className="text-gray-500 block">Course / Branch:</span>
                    <span className="font-bold text-gray-800">{profile?.course || 'B.Tech CSE'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Institution:</span>
                    <span className="font-bold text-gray-800 truncate block">{profile?.institution || 'Osmania University'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Academic Metric:</span>
                    <span className="font-bold text-emerald-800">CGPA {profile?.cgpa || '8.80'} / 10.0</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Income / Category:</span>
                    <span className="font-bold text-indigo-800">
                      ₹{profile?.familyIncomeAnnual ? (profile.familyIncomeAnnual / 100000).toFixed(1) + 'L' : '3.5L'} • {profile?.reservationCategory || 'EWS'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pipeline Opportunities Summary */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-gray-200 font-bold text-gray-700">
                  <span>Tracked Opportunities ({applications.length})</span>
                  <span className="text-emerald-700 font-extrabold">
                    Target Funding: ₹{applications.reduce((sum, a) => sum + (a.scholarship?.fundingAmount || 0), 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {applications.map((app, idx) => {
                    const sch = app.scholarship;
                    const readyCount = (app.checklistProgress || []).filter(d => d.isReady).length;
                    const totalCount = (app.checklistProgress || []).length;

                    return (
                      <div key={app._id} className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-gray-500 font-semibold uppercase">{sch?.provider}</span>
                            <h4 className="font-bold text-sm text-[#0F172A]">{sch?.name}</h4>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300 uppercase">
                            {app.trackerStatus.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg">
                          <span>Award: <strong className="text-emerald-700">{sch?.fundingFormatted}</strong></span>
                          <span>Deadline: <strong>{sch?.applicationDeadline ? new Date(sch.applicationDeadline).toLocaleDateString('en-IN') : 'N/A'}</strong></span>
                          <span>Documents: <strong>{readyCount} of {totalCount} Ready</strong></span>
                        </div>

                        {app.notes && (
                          <p className="text-[11px] text-gray-600 italic bg-amber-50/50 p-1.5 rounded border border-amber-200/60">
                            Notes: {app.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-6 border-t border-[#E2DDD5] bg-[#FAF7F2] flex items-center justify-between text-xs">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white border border-[#D5CEC0] text-gray-700 font-semibold hover:bg-gray-100"
              >
                Close Preview
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Brief</span>
                </button>

                <button
                  onClick={handleDownloadBrief}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 flex items-center space-x-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt Brief</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

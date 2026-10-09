import React from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Clock,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  RotateCcw,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DemoTourModalProps {
  onClose: () => void;
  onSelectScenario: (scenario: 'alex_stem' | 'maya_incomplete' | 'david_humanities' | 'admin_eleanor', targetTab?: 'dashboard' | 'discovery' | 'admin') => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  onClose,
  onSelectScenario
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E2DDD5] text-left overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#E2DDD5] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#0F172A] tracking-tight">
                Judge &amp; Hackathon Interactive Guided Tour
              </h2>
              <p className="text-xs text-[#64748B]">
                Test the 6 core scenarios of ScholarSphere’s Explainable Eligibility Engine (Indian Schemes &amp; Personas)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
            <p className="font-bold text-xs">Deterministic Rule-Based Architecture (Zero AI Hallucinations)</p>
            <p className="text-[11px] text-emerald-900 mt-0.5 leading-relaxed">
              Unlike black-box aggregator tools that invent arbitrary "85% win chances", ScholarSphere performs strictly auditable mathematical checks across degree level, branch, CGPA (10.0 scale), annual income ceilings (₹ Lakhs), domicile state, and certified DigiLocker documents.
            </p>
          </div>

          {/* Scenario 1: Strong Match */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2DDD5] hover:border-emerald-500 shadow-xs transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#0F172A] flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Scenario 1: Strong Match (Aarav Sharma — All Criteria Verified)</span>
              </span>
              <button
                onClick={() => onSelectScenario('alex_stem', 'dashboard')}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-[11px] hover:bg-emerald-800 flex items-center space-x-1"
              >
                <span>Activate Aarav Sharma</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-gray-600 leading-relaxed">
              <strong>Student:</strong> Aarav Sharma (B.Tech CSE 3rd Year, Osmania Univ, 8.80 / 10.0 CGPA, ₹3.5 Lakhs income, EWS, Telangana). Meets all eligibility cutoffs for the <em>Reliance Foundation UG Scholarship</em> (₹2,00,000) and <em>NSP Post-Matric DBT Scheme</em>. Results in 100% <strong>Strong Match</strong>.
            </p>
          </div>

          {/* Scenario 2: Needs Confirmation */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2DDD5] hover:border-amber-500 shadow-xs transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#0F172A] flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Scenario 2: Needs Confirmation (Priya Patel — Missing Income Cert)</span>
              </span>
              <button
                onClick={() => onSelectScenario('maya_incomplete', 'dashboard')}
                className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700 flex items-center space-x-1"
              >
                <span>Activate Priya Patel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-gray-600 leading-relaxed">
              <strong>Student:</strong> Priya Patel (B.Tech IT 2nd Year, GTU, 8.40 CGPA, OBC). Priya meets all academic cutoffs, but her family annual income certificate is unstated / pending. The engine outputs an honest <strong>Needs Confirmation</strong> instead of fabricating a qualification.
            </p>
          </div>

          {/* Scenario 3: Criteria Mismatch */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2DDD5] hover:border-rose-500 shadow-xs transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#0F172A] flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Scenario 3: Criteria Mismatch (Rahul Verma — Non-Matching Stream)</span>
              </span>
              <button
                onClick={() => onSelectScenario('david_humanities', 'discovery')}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 flex items-center space-x-1"
              >
                <span>Activate Rahul Verma</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-gray-600 leading-relaxed">
              <strong>Student:</strong> Rahul Verma (B.A. History &amp; Political Science, Hindu College DU, 6.80 CGPA). When evaluating technical grants like Reliance UG or Tata Capital Pankh B.Tech, the system explains why he does not qualify (course stream mismatch and CGPA threshold).
            </p>
          </div>

          {/* Scenario 4: Deadline Urgency */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2DDD5] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#0F172A] flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Scenario 4: Urgent Deadlines (Tata Capital Pankh &amp; NSP)</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                In Catalog
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Examine the <em>Tata Capital Pankh Scholarship</em> (Closes in ~4 days) and <em>National Scholarship Portal CSSS</em> (Closes in ~6 days). Both are dynamically tagged with countdown badges and high deadline urgency alerts.
            </p>
          </div>

          {/* Scenario 5: Expired / Archival Record */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2DDD5] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#0F172A] flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Scenario 5: Expired Scheme &amp; Draft Life-cycle</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                In Catalog
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              The <em>AICTE Pragati Technical Girls Scholarship (Previous Cycle)</em> passed its official closing window and is transparently marked as Expired, while upcoming schemes (PMSSS J&amp;K) are marked in Draft state.
            </p>
          </div>

          {/* Scenario 6: Admin Governance & DigiLocker Auditing */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2DDD5] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#0F172A] flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                <span>Scenario 6: Admin Governance (Dr. Ramanujam)</span>
              </span>
              <button
                onClick={() => onSelectScenario('admin_eleanor', 'admin')}
                className="px-3 py-1.5 rounded-lg bg-purple-700 text-white font-bold text-[11px] hover:bg-purple-800 flex items-center space-x-1"
              >
                <span>Admin Governance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Log in as <strong>Dr. K. S. Ramanujam</strong> (Director of Financial Aid). Inspect the Administrative Portal to create Indian scholarship schemes, verify DigiLocker integration flags, and manage scheme lifecycle states.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#E2DDD5] bg-[#FAF7F2] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Close Walkthrough
          </button>
        </div>
      </div>
    </div>
  );
};

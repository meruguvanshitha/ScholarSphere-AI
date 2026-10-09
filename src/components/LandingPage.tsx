import React from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  FileCheck2,
  Sparkles,
  ShieldCheck,
  Search,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Scale,
  Award,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface LandingPageProps {
  onExplore: () => void;
  onGoToDashboard: () => void;
  onOpenDemoTour: () => void;
  onOpenOnboarding: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExplore,
  onGoToDashboard,
  onOpenDemoTour,
  onOpenOnboarding
}) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0F172A] selection:bg-emerald-100 selection:text-emerald-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#E7E2D9]">
        {/* Subtle decorative background blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/40 via-teal-50/20 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Vision & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Deterministic Explainable Eligibility Engine</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.12]">
                Find the Scholarships You <span className="underline decoration-emerald-500 decoration-wavy decoration-3 underline-offset-6">Actually</span> Qualify For.
              </h1>

              <p className="text-lg sm:text-xl text-[#475569] leading-relaxed max-w-2xl font-normal">
                Stop sifting through expired links and vague requirements. ScholarSphere matches your verified academic, financial, and geographic profile against real provider rules with transparent explanations—no fabricated probabilities.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onGoToDashboard}
                  className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-900/15 flex items-center space-x-2 transition-all hover:translate-y-[-1px]"
                >
                  <span>Find My Scholarships</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onExplore}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#F3EFE8] text-[#0F172A] font-semibold text-sm border border-[#D5CEC0] shadow-xs flex items-center space-x-2 transition-colors"
                >
                  <Compass className="w-4 h-4 text-emerald-700" />
                  <span>Explore Catalog</span>
                </button>

                <button
                  onClick={onOpenDemoTour}
                  className="px-4 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-semibold text-xs border border-amber-300 flex items-center space-x-1.5 transition-colors"
                >
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>Launch Judge Tour</span>
                </button>
              </div>

              {/* Trust & Guarantee Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#EAE5DC] text-xs">
                <div>
                  <p className="font-bold text-[#0F172A] text-base">100% Rule-Based</p>
                  <p className="text-[#64748B]">Zero fabricated win odds</p>
                </div>
                <div>
                  <p className="font-bold text-[#0F172A] text-base">4-D Readiness</p>
                  <p className="text-[#64748B]">Docs, deadlines & fit</p>
                </div>
                <div>
                  <p className="font-bold text-[#0F172A] text-base">Source Verified</p>
                  <p className="text-[#64748B]">Official registry audit</p>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Preview of Matching Engine */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/8 border border-[#E2DDD5] p-6 space-y-5 text-left relative">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      RF
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">Reliance Foundation UG Scholarship</p>
                      <p className="text-[11px] text-gray-500">₹2,00,000 Total Grant • Merit-cum-Means</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Strong Match</span>
                  </span>
                </div>

                {/* Explainable Decision Preview Box */}
                <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#EAE5DC] space-y-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                    Why You Qualify (Explainable Audit)
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#334155]">
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Enrolled in B.Tech CSE (qualifies for approved technical degrees)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>CGPA 8.80 / 10.0 meets scheme cutoff (7.50 / 10.0)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Family annual income (₹3.5 Lakhs) is well within ceiling (₹15 Lakhs)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>DigiLocker Verified: Class 12th Memo and Aadhaar authenticated</span>
                    </li>
                  </ul>
                </div>

                {/* 4-Dimension Readiness Breakdown */}
                <div className="space-y-2 pt-1 text-xs">
                  <p className="font-semibold text-[#0F172A] flex justify-between">
                    <span>Readiness Dimensions</span>
                    <span className="text-emerald-700 font-bold">4 of 4 Ready</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                      <p className="text-[10px] text-gray-500 font-medium">Eligibility Fit</p>
                      <p className="font-bold text-emerald-800">100% Strong Fit</p>
                    </div>
                    <div className="p-2 rounded-lg bg-teal-50 border border-teal-200">
                      <p className="text-[10px] text-gray-500 font-medium">Document Readiness</p>
                      <p className="font-bold text-teal-800">DigiLocker Synced</p>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                      <p className="text-[10px] text-gray-500 font-medium">Deadline Urgency</p>
                      <p className="font-bold text-emerald-800">42 Days (Nov 20)</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-[10px] text-gray-500 font-medium">Application Tracker</p>
                      <p className="font-bold text-blue-800">Preparing Docs</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>DigiLocker &amp; Portal Verified</span>
                  </span>
                  <button
                    onClick={onGoToDashboard}
                    className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
                  >
                    <span>View full details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How ScholarSphere Works */}
      <section className="py-16 md:py-24 bg-[#FAF7F2] border-b border-[#E7E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
              How ScholarSphere Works
            </h2>
            <p className="text-[#64748B] text-base">
              A transparent, three-step engine engineered to remove guesswork and eliminate wasted hours on ineligible applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-7 border border-[#E2DDD5] shadow-xs space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Profile Precision Mapping</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Provide your major, university, GPA/percentage, state residence, and optional family income tier in our secure multi-step onboarding.
              </p>
              <div className="pt-2 text-xs text-emerald-800 font-semibold flex items-center space-x-1">
                <FileCheck2 className="w-4 h-4" />
                <span>Sensitive data kept strictly private</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-7 border border-[#E2DDD5] shadow-xs space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Deterministic Eligibility Audit</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Our backend evaluates each scholarship rule deterministically. You receive an honest outcome: Strong Match, Needs Confirmation, or Does Not Match.
              </p>
              <div className="pt-2 text-xs text-teal-800 font-semibold flex items-center space-x-1">
                <Scale className="w-4 h-4" />
                <span>Full transparent reasoning for every rule</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-7 border border-[#E2DDD5] shadow-xs space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Readiness &amp; Deadline Engine</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Track required documents with verified checklists, monitor urgent deadlines with real calendar math, and manage submission progress in your tracker.
              </p>
              <div className="pt-2 text-xs text-amber-900 font-semibold flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>In-app calendar deadline intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Comparison: Honest vs Generic AI Tools */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl space-y-6">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 uppercase tracking-wider">
              Product Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why We Refuse to Fabricate Match Percentages
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Many scholarship platforms generate an arbitrary "87% Chance of Winning" badge using generic AI. This misleads students into applying for awards with hard disqualifications they never knew about.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <p className="font-bold text-rose-300 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Other Platforms</span>
                </p>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Hallucinated win probabilities, unverified aggregator links, missing income rules, and zero explanation for rejection.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <p className="font-bold text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ScholarSphere Standard</span>
                </p>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Strict 3-state deterministic outcome: Strong Match, Needs Confirmation (with exact missing fields), or Does Not Match.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer Section */}
      <footer className="border-t border-[#E2DDD5] bg-[#FAF7F2] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center space-x-2 text-xl font-extrabold text-[#0F172A]">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            <span>Scholar<span className="text-emerald-600">Sphere</span></span>
          </div>
          <p className="text-sm text-[#64748B] max-w-md mx-auto">
            “Your Potential Deserves Funding.” Built for students, counselors, and higher-education administrators.
          </p>
          <div className="flex justify-center space-x-6 text-xs text-[#64748B]">
            <button onClick={onExplore} className="hover:text-[#0F172A]">Discovery Catalog</button>
            <button onClick={onGoToDashboard} className="hover:text-[#0F172A]">Student Dashboard</button>
            <button onClick={onOpenOnboarding} className="hover:text-[#0F172A]">Onboarding Profile</button>
            <button onClick={onOpenDemoTour} className="hover:text-[#0F172A]">Judge Demo Scenarios</button>
          </div>
          <p className="text-[11px] text-[#94A3B8] pt-4">
            ScholarSphere MERN Platform • MongoDB, Express, React, Node.js • Production Architecture
          </p>
        </div>
      </footer>
    </div>
  );
};

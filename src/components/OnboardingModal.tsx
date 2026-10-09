import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Shield,
  GraduationCap,
  FileText,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StudentProfile } from '../types';

interface OnboardingModalProps {
  onClose: () => void;
  onCompleted?: () => void;
}

const COMMON_DOCUMENTS = [
  'Class 12th Marks Memo',
  'SSC (10th) Board Memo',
  'Family Income Certificate (Tehsildar / MeeSeva)',
  'College Bonafide / Enrollment Certificate',
  'Aadhaar Card (Identity Proof)',
  'Integrated Caste / EWS Certificate',
  'Bank Account Passbook (Aadhaar Seeded)',
  'College Admission / Fee Receipt'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  onClose,
  onCompleted
}) => {
  const { profile, updateProfile, refreshProfile } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Indian Student Profile Form State
  const [educationLevel, setEducationLevel] = useState<string>(profile?.educationLevel || 'undergraduate');
  const [course, setCourse] = useState<string>(profile?.course || 'B.Tech Computer Science & Engineering');
  const [specialization, setSpecialization] = useState<string>(profile?.specialization || 'Artificial Intelligence & Machine Learning');
  const [yearOfStudy, setYearOfStudy] = useState<string>(profile?.yearOfStudy || '3rd Year');
  const [institution, setInstitution] = useState<string>(profile?.institution || 'Osmania University College of Engineering, Hyderabad');
  const [cgpa, setCgpa] = useState<string>(profile?.cgpa !== undefined ? String(profile.cgpa) : '8.8');
  const [scorePercent, setScorePercent] = useState<string>(profile?.scorePercent !== undefined ? String(profile.scorePercent) : '88');
  const [academicAchievements, setAcademicAchievements] = useState<string>(profile?.academicAchievements || "Dean's Merit List, SIH State Finalist");
  const [stateOrRegion, setStateOrRegion] = useState<string>(profile?.stateOrRegion || 'Telangana');
  const [country, setCountry] = useState<string>(profile?.country || 'India');
  const [familyIncomeAnnual, setFamilyIncomeAnnual] = useState<string>(
    profile?.familyIncomeAnnual !== undefined ? String(profile.familyIncomeAnnual) : '350000'
  );
  const [incomeRange, setIncomeRange] = useState<string>(profile?.incomeRange || '₹3.0 Lakhs - ₹5.0 Lakhs / year');
  const [reservationCategory, setReservationCategory] = useState<string>(profile?.reservationCategory || 'EWS');
  const [documentsReady, setDocumentsReady] = useState<string[]>(profile?.documentsReady || [
    'Class 12th Marks Memo',
    'Aadhaar Card (Identity Proof)',
    'College Bonafide / Enrollment Certificate',
    'Family Income Certificate (Tehsildar / MeeSeva)'
  ]);

  const toggleDocument = (doc: string) => {
    setDocumentsReady(prev =>
      prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]
    );
  };

  const handleSaveAndAdvance = async () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    // Final submission
    setIsSaving(true);
    try {
      await updateProfile({
        educationLevel,
        course,
        specialization,
        yearOfStudy,
        institution,
        cgpa: cgpa ? parseFloat(cgpa) : undefined,
        scorePercent: scorePercent ? parseFloat(scorePercent) : undefined,
        academicAchievements,
        stateOrRegion,
        country,
        familyIncomeAnnual: familyIncomeAnnual ? parseFloat(familyIncomeAnnual) : undefined,
        incomeRange,
        reservationCategory,
        documentsReady,
        isOnboarded: true
      });
      await refreshProfile();
      onCompleted?.();
      onClose();
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E2DDD5] text-left overflow-hidden">
        {/* Header & Step Indicator */}
        <div className="p-6 border-b border-[#E2DDD5] bg-[#FAF7F2] flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                Step {step} of 4
              </span>
              <span className="text-xs text-gray-500 font-medium">Student Onboarding • Indian Higher Ed</span>
            </div>
            <h2 className="text-lg font-black text-[#0F172A] mt-1">
              {step === 1 && 'Domicile State & Enrolled Institution'}
              {step === 2 && 'Degree, Stream & Academic Scores (10.0 CGPA)'}
              {step === 3 && 'Annual Family Income & Reservation Category'}
              {step === 4 && 'Certified Documents & DigiLocker Verification'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5 overflow-hidden">
          <div
            className="bg-emerald-600 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* STEP 1: Personal & Geographic Location */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-[#64748B]">
                Government and foundation scholarships (e.g. TS ePASS, NSP, State Post-Matric) check state domicile and affiliated university accreditation.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">State / UT of Domicile</label>
                  <input
                    type="text"
                    value={stateOrRegion}
                    onChange={e => setStateOrRegion(e.target.value)}
                    placeholder="e.g. Telangana, Maharashtra, Karnataka, Andhra Pradesh, Delhi..."
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-sm text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-sm text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Current College / University / Institute</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    placeholder="e.g. Osmania University College of Engineering, IIT Madras, JNTU Hyderabad..."
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-sm text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academic Profile */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-[#64748B]">
                The deterministic engine evaluates your degree, branch, semester, and marks on India’s standard 10.0 CGPA scale against official scheme cutoffs.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Degree Level</label>
                  <select
                    value={educationLevel}
                    onChange={e => setEducationLevel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs font-semibold text-[#0F172A] focus:outline-none"
                  >
                    <option value="undergraduate">Undergraduate (B.Tech / B.E / B.Sc / MBBS)</option>
                    <option value="postgraduate">Postgraduate (M.Tech / MBA / M.Sc)</option>
                    <option value="doctoral">Doctoral / PhD</option>
                    <option value="diploma">Polytechnic / Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Current Year of Study</label>
                  <select
                    value={yearOfStudy}
                    onChange={e => setYearOfStudy(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs font-semibold text-[#0F172A] focus:outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-[#0F172A] mb-1">Course / Engineering Branch</label>
                  <input
                    type="text"
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science & Engineering, Electronics, Mechanical..."
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-sm text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-[#0F172A] mb-1">Specialization / Honors (Optional)</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                    placeholder="e.g. Artificial Intelligence & Machine Learning, Data Science, Cyber Security..."
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-sm text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Cumulative CGPA (10.0 scale)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10.0"
                    value={cgpa}
                    onChange={e => setCgpa(e.target.value)}
                    placeholder="e.g. 8.80"
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-sm text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Standard Indian 10.0 CGPA scale</span>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Board / Semester Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scorePercent}
                    onChange={e => setScorePercent(e.target.value)}
                    placeholder="e.g. 88"
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-sm text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Class 12th Board / Latest Semester %</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Financial & Sensitive Demographics */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start space-x-2 text-xs">
                <Shield className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                <p>
                  Annual income &amp; category parameters are used strictly for need-based ceiling evaluations (e.g. NSP ₹4.5L cap, Tata Pankh ₹2.5L cap). Encrypted and confidential.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Annual Family Income (₹ INR)</label>
                  <input
                    type="number"
                    value={familyIncomeAnnual}
                    onChange={e => setFamilyIncomeAnnual(e.target.value)}
                    placeholder="e.g. 350000 (for ₹3.5 Lakhs)"
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-sm text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                    Equivalent: ₹{familyIncomeAnnual ? (parseFloat(familyIncomeAnnual) / 100000).toFixed(2) : '0'} Lakhs / year
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Income Slab Range</label>
                  <select
                    value={incomeRange}
                    onChange={e => setIncomeRange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs font-semibold text-[#0F172A] focus:outline-none"
                  >
                    <option value="Under ₹2.5 Lakhs / year">Under ₹2.5 Lakhs / year (BPL / Priority Tier)</option>
                    <option value="₹2.5 Lakhs - ₹4.5 Lakhs / year">₹2.5 Lakhs - ₹4.5 Lakhs / year (NSP Qualified)</option>
                    <option value="₹4.5 Lakhs - ₹8.0 Lakhs / year">₹4.5 Lakhs - ₹8.0 Lakhs / year (EWS Upper Ceiling)</option>
                    <option value="Above ₹8.0 Lakhs / year">Above ₹8.0 Lakhs / year</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Reservation Category</label>
                  <select
                    value={reservationCategory}
                    onChange={e => setReservationCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CEC0] bg-[#FAF7F2] text-xs font-bold text-[#0F172A] focus:outline-none"
                  >
                    <option value="General">General (Unreserved)</option>
                    <option value="OBC">OBC (Other Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                  </select>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Used for affirmative-action government &amp; foundation grants</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Certified Documents in Hand */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-[#64748B]">
                Select the documents you have verified and available. Essential certificates can be authenticated directly via DigiLocker.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {COMMON_DOCUMENTS.map(doc => {
                  const isChecked = documentsReady.includes(doc);
                  const docLower = doc.toLowerCase();
                  const isDigiLocker =
                    docLower.includes('income') ||
                    docLower.includes('bonafide') ||
                    docLower.includes('memo') ||
                    docLower.includes('aadhaar');

                  return (
                    <div
                      key={doc}
                      onClick={() => toggleDocument(doc)}
                      className={`p-3 rounded-xl border cursor-pointer select-none flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-[#FAF7F2] border-[#E2DDD5] text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 pointer-events-none"
                        />
                        <span className="text-xs">{doc}</span>
                      </div>

                      {isDigiLocker && (
                        <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                          <ShieldCheck className="w-2.5 h-2.5 text-blue-600" />
                          <span>DigiLocker</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 sm:p-6 border-t border-[#E2DDD5] bg-[#FAF7F2] flex items-center justify-between text-xs">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-white border border-[#D5CEC0] font-semibold text-[#0F172A] hover:bg-gray-50 flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleSaveAndAdvance}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-colors disabled:opacity-50"
          >
            <span>{step === 4 ? (isSaving ? 'Saving Profile...' : 'Save & Audit Scholarships') : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

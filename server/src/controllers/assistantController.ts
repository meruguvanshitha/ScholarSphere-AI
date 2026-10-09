import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { dataStore } from '../services/store';

export async function askGuidanceAssistant(req: Request, res: Response): Promise<void> {
  try {
    const { question, scholarshipId } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Question prompt is required.' });
      return;
    }

    const userId = req.user?.id;
    const studentProfile = userId ? dataStore.getProfileByUserId(userId) : null;
    const scholarships = dataStore.getScholarships({ limit: 14 }).scholarships;

    let specificScholarship = null;
    if (scholarshipId) {
      specificScholarship = dataStore.getScholarshipById(scholarshipId, userId);
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if real Gemini API Key is available
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });

        const systemInstruction = `
You are the ScholarSphere Guidance Assistant, a transparent, rigorous student-finance advisor.
Your mission is to help students understand scholarship eligibility, deadlines, document readiness, and official application procedures.

CRITICAL RULES:
1. ONLY refer to scholarships and facts in the provided database context.
2. NEVER invent scholarship opportunities, monetary amounts, fake URLs, or application requirements.
3. NEVER guarantee that a student will be awarded any funding. Distinguish preliminary platform eligibility matching from the scholarship provider's final committee selection.
4. If an eligibility rule or document requirement is unknown or not in the context, explicitly say: "This detail is not verified in our catalog; please check the official provider portal directly."
5. Format answers clearly with bullet points, concise explanations, and direct actionable advice.

CURRENT STUDENT PROFILE CONTEXT:
${studentProfile ? JSON.stringify({
  name: req.user?.email,
  educationLevel: studentProfile.educationLevel,
  course: studentProfile.course,
  specialization: studentProfile.specialization,
  yearOfStudy: studentProfile.yearOfStudy,
  cgpa: studentProfile.cgpa,
  scorePercent: studentProfile.scorePercent,
  annualIncome: studentProfile.familyIncomeAnnual,
  stateOrRegion: studentProfile.stateOrRegion,
  documentsReady: studentProfile.documentsReady
}, null, 2) : 'No student logged in (general guest mode).'}

AVAILABLE SCHOLARSHIPS CONTEXT:
${specificScholarship ? `SPECIFIC SCHOLARSHIP FOCUS:\n${JSON.stringify(specificScholarship, null, 2)}` :
  JSON.stringify(scholarships.map(s => ({
    id: s._id,
    name: s.name,
    provider: s.provider,
    fundingFormatted: s.fundingFormatted,
    educationLevels: s.educationLevels,
    eligibleCourses: s.eligibleCourses,
    minCgpa: s.minCgpa,
    maxAnnualIncome: s.maxAnnualIncome,
    deadline: s.applicationDeadline,
    requiredDocuments: s.requiredDocuments,
    verificationStatus: s.verificationStatus
  })), null, 2)}
`;

        const generatePromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: question,
          config: {
            systemInstruction,
            temperature: 0.2
          }
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI response timeout')), 4500)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        const answerText = response.text || 'Unable to generate advice at this moment.';

        res.json({
          success: true,
          mode: 'gemini-3.8-flash',
          modelProvider: 'Google Gemini 3.8 Flash (Server-Side Grounded)',
          answer: answerText,
          contextScholarship: specificScholarship ? specificScholarship.name : null
        });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, gracefully falling back to rule-based assistant:', geminiError.message);
      }
    }

    // Transparent Deterministic Rule-Based Fallback Engine
    const ruleAnswer = generateDeterministicGuidance(question, studentProfile, specificScholarship, scholarships);

    res.json({
      success: true,
      mode: 'deterministic-rule-engine',
      modelProvider: 'ScholarSphere Rule-Based Guidance Engine (Deterministic Mode)',
      answer: ruleAnswer,
      contextScholarship: specificScholarship ? specificScholarship.name : null,
      note: 'Operating in transparent deterministic mode grounded in official catalog records.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error processing assistant query.' });
  }
}

function generateDeterministicGuidance(
  question: string,
  profile: any,
  specificScholarship: any,
  scholarships: any[]
): string {
  const q = question.toLowerCase();

  // If asking about a specific scholarship
  if (specificScholarship) {
    const s = specificScholarship;
    if (q.includes('document') || q.includes('need') || q.includes('checklist')) {
      return `### Required Documents for ${s.name}\n\nTo apply for this opportunity through **${s.provider}**, prepare the following:\n\n${s.requiredDocuments.map((d: string) => `* **${d}**`).join('\n')}\n\n**Next Steps:** Gather verified digital copies and mark them ready in your ScholarSphere Document Checklist to track completion.`;
    }

    if (q.includes('qualify') || q.includes('eligible') || q.includes('why')) {
      const elig = s.eligibility;
      if (elig) {
        return `### Eligibility Breakdown for ${s.name}\n\n**Preliminary Outcome: ${elig.outcome}**\n\n${elig.plainLanguageExplanation}\n\n**Requirements Satisfied:**\n${elig.requirementsSatisfied.length > 0 ? elig.requirementsSatisfied.map((r: string) => `* ✓ ${r}`).join('\n') : '* None verified yet'}\n\n${elig.requirementsNotSatisfied.length > 0 ? `**Criteria Not Met:**\n${elig.requirementsNotSatisfied.map((r: string) => `* ✗ ${r}`).join('\n')}\n` : ''}${elig.missingInformation.length > 0 ? `**Information Still Required:**\n${elig.missingInformation.map((r: string) => `* ? ${r}`).join('\n')}\n` : ''}\n**Official Provider:** ${s.provider} (Deadline: ${new Date(s.applicationDeadline).toLocaleDateString()}).`;
      }
    }

    if (q.includes('deadline') || q.includes('when') || q.includes('date')) {
      const deadlineDate = new Date(s.applicationDeadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      return `### Deadline Notice for ${s.name}\n\n* **Application Closing Date:** ${deadlineDate}\n* **Status:** ${s.verificationStatus === 'expired' ? 'Expired (Applications Closed)' : 'Accepting Applications'}\n* **Provider URL:** Official links are accessible from the Details panel.\n\nBe sure to submit at least 48 hours prior to the deadline to avoid provider portal slowdowns.`;
    }
  }

  // General Questions
  if (q.includes('deadline') || q.includes('urgent') || q.includes('soon')) {
    const closingSoon = scholarships.filter(s => {
      const diff = (new Date(s.applicationDeadline).getTime() - new Date('2026-10-09T07:12:45Z').getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 14;
    });

    if (closingSoon.length > 0) {
      return `### Scholarships Approaching Deadlines (Within 14 Days)\n\n${closingSoon.map(s => {
        const days = Math.ceil((new Date(s.applicationDeadline).getTime() - new Date('2026-10-09T07:12:45Z').getTime()) / (1000 * 60 * 60 * 24));
        return `* **${s.name}** (${s.provider}) — **${days} day${days === 1 ? '' : 's'} remaining** (Deadline: ${new Date(s.applicationDeadline).toLocaleDateString()})`;
      }).join('\n')}\n\n**Recommendation:** Check your Document Checklist immediately to confirm required records before the portal closes.`;
    }
  }

  if (q.includes('stem') || q.includes('computer') || q.includes('engineering') || q.includes('tech')) {
    const stemSchols = scholarships.filter(s => s.eligibleCourses.some((c: string) => c.toLowerCase().includes('computer') || c.toLowerCase().includes('engineering')));
    return `### Opportunities in STEM & Technology\n\nFound **${stemSchols.length}** opportunities focused on computing and engineering:\n\n${stemSchols.map(s => `* **${s.name}** (${s.provider}) — Funding: **${s.fundingFormatted}** | Min GPA: **${s.minCgpa || 'None'}**`).join('\n')}\n\nCheck your Dashboard to view deterministic eligibility results tailored to your course and marks.`;
  }

  if (q.includes('document') || q.includes('transcript') || q.includes('income') || q.includes('digilocker')) {
    return `### Standard Indian Scholarship Documentation & DigiLocker Guide\n\nMost verified schemes on ScholarSphere (e.g. NSP, Reliance, TS ePASS, Tata Capital) require:\n\n1. **Class 10th & 12th Marks Memo:** Available directly via DigiLocker (CBSE / ICSE / State Boards).\n2. **Family Income Certificate:** Issued by Tehsildar / MeeSeva / Revenue Department in the current financial year.\n3. **College Bonafide / Enrollment Certificate:** Issued by Principal / Head of Department on institution letterhead.\n4. **Aadhaar Card (Aadhaar-Seeded Bank Account):** Essential for Direct Benefit Transfer (DBT) disbursement under Central & State schemes.\n5. **Integrated Caste / EWS Certificate:** Required for affirmative action schemes (SC, ST, OBC, EWS).\n\n**DigiLocker Integration:** You can see which certificates are marked with the **DigiLocker Verified** badge in your document checklist for instant verification.`;
  }

  // Default helpful guidance summary
  return `### ScholarSphere Guidance Assistant\n\nI can help you analyze your funding path with total transparency:\n\n* **Ask about your eligibility:** e.g. "Do I qualify for the National STEM Fellowship?"\n* **Ask about deadlines:** e.g. "Which scholarships close this week?"\n* **Ask about required documents:** e.g. "What documents do I need for the Opportunity Rising Award?"\n* **Profile Status:** ${profile ? `Logged in as student (${profile.educationLevel}, ${profile.course || 'Course unset'}, GPA ${profile.cgpa || 'Unset'})` : 'Guest mode — sign in to see profile-specific match analysis.'}\n\nFeel free to select any scholarship from the discovery page to inspect full eligibility rules and required documentation!`;
}

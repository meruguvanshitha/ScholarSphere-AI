# ScholarSphere — Intelligent Scholarship Discovery & Eligibility Platform

> **“Your Potential Deserves Funding.”**

ScholarSphere is a complete, production-grade MERN web application engineered to solve the real-world frustration of scholarship hunting: navigating expired listings, opaque eligibility requirements, and fabricated match probabilities.

ScholarSphere implements a **deterministic, explainable eligibility engine**, a **4-dimension readiness model**, real-time **deadline intelligence**, persistent **application pipeline tracking**, and an audited **source verification model**.

---

## 1. Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Backend:** Node.js, Express, TypeScript (executed via tsx)
- **Database:** MongoDB with Mongoose (Dual-mode: connects to external MongoDB Atlas cluster when configured; falls back gracefully to a high-fidelity local persistent store for instant out-of-the-box local and sandbox execution)
- **Authentication:** JWT Bearer tokens, bcryptjs password hashing, role-based authorization (Student & Admin)
- **AI / Guidance Engine:** Server-side Google Gemini 3.8 Flash via `@google/genai` with deterministic rule-based fallback

---

## 2. Project File Structure

```
scholarsphere/
├── .env.example                       # Environment variables template
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite + Tailwind build configuration
├── server.ts                          # Express server entry point + Vite dev middleware
├── server/
│   └── src/
│       ├── config/
│       │   └── db.ts                  # Real MongoDB connection & health check manager
│       ├── models/
│       │   ├── User.ts                # Mongoose User schema (bcrypt hashed passwords)
│       │   ├── StudentProfile.ts      # Mongoose StudentProfile schema
│       │   ├── Scholarship.ts         # Mongoose Scholarship schema (rules, indexes)
│       │   ├── Application.ts         # Mongoose Application schema (unique compound index)
│       │   └── SavedScholarship.ts    # Mongoose SavedScholarship schema
│       ├── services/
│       │   ├── eligibilityEngine.ts   # Deterministic Explainable Eligibility Engine
│       │   └── store.ts               # Unified data store & seed engine
│       ├── middleware/
│       │   └── auth.ts                # JWT authentication & requireAdmin middleware
│       ├── controllers/
│       │   ├── authController.ts      # Register, Login, Me, Demo Switcher
│       │   ├── profileController.ts   # Student profile CRUD
│       │   ├── scholarshipController.ts # Discovery, filters, CRUD, dashboard
│       │   ├── applicationController.ts # Tracker & document checklist updates
│       │   └── assistantController.ts # Grounded Guidance Advisor (Gemini 3.8)
│       ├── routes/
│       │   └── api.ts                 # Central REST API routes mounted under /api
│       └── data/
│           └── seedData.ts            # 14 realistic scholarship records & 4 test personas
├── src/
│   ├── types/
│   │   └── index.ts                   # Frontend TypeScript interfaces
│   ├── services/
│   │   └── api.ts                     # Centralized API client (calls Express /api)
│   ├── context/
│   │   └── AuthContext.tsx            # Global Auth, Profile, and Health Context
│   ├── components/
│   │   ├── Navbar.tsx                 # Brand, health pill, persona selector
│   │   ├── LandingPage.tsx            # Marketing hero, value proposition, preview
│   │   ├── StudentDashboard.tsx       # Live metrics, urgency cards, recommendations
│   │   ├── ScholarshipDiscovery.tsx   # Search, multi-filters, sorting, cards
│   │   ├── ScholarshipDetailModal.tsx # "Why You Qualify", 4-D Readiness, Checklist
│   │   ├── ComparisonDrawer.tsx       # Side-by-side 3-way scholarship comparison
│   │   ├── ApplicationTracker.tsx     # Persistent Kanban/list pipeline & notes
│   │   ├── OnboardingModal.tsx        # 4-step progressive onboarding form
│   │   ├── ScholarshipAssistant.tsx   # Guidance advisor Q&A interface
│   │   ├── AdminPortal.tsx            # Protected CRUD, verification, and lifecycle
│   │   ├── AuthModal.tsx              # Sign In and Register forms
│   │   └── DemoTourModal.tsx          # 6-scenario guided judge tour
│   ├── App.tsx                        # Main application orchestrator
│   ├── main.tsx                       # React DOM root entry
│   └── index.css                      # Tailwind v4 theme & custom scrollbars
```

---

## 3. Signature Features

### 3.1 Explainable Eligibility Engine
Rather than fabricating an arbitrary "87% Win Probability", the engine deterministically checks:
1. Degree Level & Major matching
2. Cumulative GPA and marks percentage thresholds
3. Annual family income ceiling
4. Regional / State domicile requirements
5. Enrollment study year

Every evaluation returns one of three transparent states:
- **Strong Match:** All known mandatory requirements are satisfied.
- **Needs Confirmation:** Missing information (e.g. unrecorded family income) prevents verification; prompts student for exact missing fields.
- **Does Not Match:** Clear itemized breakdown of failed mandatory rules with recommendations.

### 3.2 4-Dimension Readiness Engine
1. **Eligibility Fit (0-100%):** Rule compliance score.
2. **Document Readiness (0-100%):** Percentage of provider-required documents certified as ready.
3. **Deadline Urgency:** Accurate calendar days remaining (Overdue, Closing Soon <= 7d, Approaching <= 21d, Active).
4. **Application Pipeline:** Tracking progress (Interested → Preparing Docs → Ready to Apply → Submitted).

---

## 4. Local Setup & Running Instructions

### Prerequisites
- Node.js v18+
- npm or pnpm

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key variables:
```ini
PORT=3000
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/scholarsphere?retryWrites=true&w=majority"
JWT_SECRET="your_secure_jwt_secret_key"
FRONTEND_URL="http://localhost:3000"
GEMINI_API_KEY="your_gemini_api_key"
```
*(Note: If `MONGODB_URI` is left unconfigured or unreachable, ScholarSphere automatically starts in its high-fidelity local persistent mode so judges can evaluate the platform immediately without external database setup).*

### Step 3: Run the Application
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

---

## 5. Judge & Demo Test Personas

Use the **Personas** menu in the top navigation bar or the **Judge Tour** button to test the 6 scenarios:

| Persona | Role | Scenario Tested |
|---|---|---|
| **Alex Rivera** | Student | **Strong Match:** CS Junior, 3.85 GPA, $42k income. Meets all rules for the $15k STEM Fellowship. |
| **Maya Chen** | Student | **Needs Confirmation:** CS Sophomore, 3.50 GPA, missing income field. Evaluates to honest "Needs Confirmation". |
| **David Okafor** | Student | **Criteria Mismatch:** History major, 3.10 GPA. Transparently shows why he fails STEM major requirements. |
| **Dr. Eleanor Vance** | Admin | **Administrator Governance:** Full CRUD, verification status toggle, draft/archive controls. |

---

## 6. REST API Endpoints Summary

- `GET /api/health` — Database connection status & service health
- `POST /api/auth/register` — Student/Admin account registration
- `POST /api/auth/login` — User login with JWT token generation
- `GET /api/auth/me` — Authenticated user details
- `POST /api/auth/demo-login` — 1-click test persona switcher
- `GET /api/profile` — Get authenticated student profile
- `PUT /api/profile` — Update academic, geographic, and financial profile
- `GET /api/scholarships` — Search, multi-filters, sorting, and pagination
- `GET /api/scholarships/:id` — Detail view with eligibility audit
- `POST /api/scholarships` — Admin creation of new listings
- `PUT /api/scholarships/:id` — Admin updates
- `DELETE /api/scholarships/:id` — Admin deletion
- `GET /api/saved` — Get student's bookmarked scholarships
- `POST /api/saved/:id` — Bookmark scholarship
- `DELETE /api/saved/:id` — Remove bookmark
- `GET /api/applications` — Get tracked applications pipeline
- `POST /api/applications` — Add to tracker
- `PUT /api/applications/:id` — Update application status, notes, dates
- `PUT /api/applications/:id/checklist` — Toggle document checklist items
- `GET /api/dashboard` — Live aggregated student metrics
- `POST /api/assistant/ask` — Server-side grounded Gemini 3.8 Flash advisor
- `POST /api/admin/reset-demo` — Reset dataset to clean seed state

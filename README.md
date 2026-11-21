# BULOLO CONNECT
### District Digital Services, Community Engagement & Development Management Platform
**Location:** Bulolo District, Morobe Province, Papua New Guinea  
**Tagline:** *"One District. One Community. One Connected Future."*  
**Languages:** English & Tok Pisin  
**Currency:** Papua New Guinean Kina (PGK / K)  

---

## 1. Executive Summary & Platform Purpose

**BULOLO CONNECT** is a production-quality, database-driven digital civic platform designed to connect residents of Bulolo District with essential public services, community information, transparent development monitoring, and the district administration.

Encompassing **Mumeng Rural LLG**, **Watut Rural LLG**, **Buang Rural LLG**, and **Bulolo Urban LLG**, the platform bridges connectivity gaps in Morobe Province, supporting low-bandwidth Android smartphones, offline draft saving, dual-language translation (English and Tok Pisin), and role-based administrative workflows.

---

## 2. Key Modules & Functional Capabilities

1. **Public-Facing Civic Portal:**
   - **Hero & Gateway:** Mountain silhouette branding, emergency contact bar, and instant citizen tracking lookup.
   - **Verified Services Directory:** Categorized into Healthcare (Hospitals/Aid Posts), Education (Technical/Secondary/Primary), Police & Emergency, Agriculture (DPI/CIC), Transport, and Government Offices.
   - **Development Projects Tracker:** Verified capital projects funded by DSIP and Provincial Grants, with physical progress meters (0–100%), verified budgets, contractor details, and inspection reports.
   - **Official Announcements & Notices:** Timely publication of tertiary fee subsidies, flood and highway alerts (e.g. Kumalu River crossing), and community consultations.

2. **Citizen Registration & Dashboard:**
   - Unique system-generated Account ID (e.g., `BC-USR-2026-0100`).
   - Profile management with LLG, Ward, Village, and diaspora flag (resident vs. living elsewhere).
   - Real-time tracking of submitted requests and assistance applications with status badges and official response notes.
   - **Private Household & Family Registry:** 100% confidential household profile for welfare and educational subsidy verification, protected under strict RBAC controls.

3. **Citizen Request & Issue Management:**
   - Standardized reference numbering (e.g., `REQ-2026-00001`).
   - Categories: Roads & Bridges, Water Supply, Electricity, Health, Education, Agriculture, Youth, and Public Infrastructure.
   - Offline draft saving feature for unstable 3G networks.
   - Public reference tracking without exposing confidential citizen personal data.

4. **Assistance Programme & Application Engine:**
   - Dedicated "Request Assistance" section covering Tertiary School Fees, Agricultural Coffee Support, Emergency Medical Evacuation, Youth Vocational Grants, and Community Initiatives.
   - Step-by-step application workflow (`Draft` → `Submitted` → `Under Review` → `Approved / Declined` → `Completed`).
   - **Civic Governance Rule:** Never automatically promises funding. Every decision requires authorized officer assessment, justification, and immutable audit recording.

5. **Administrative & MP's Office Portals:**
   - **District Administration Backoffice:** Real database KPI calculations (no hardcoded fake statistics), request triage, department referrals, status updates with automated citizen in-app notifications, and assistance approvals.
   - **MP's Office Oversight Dashboard:** District-wide oversight across the 4 LLGs, monitoring infrastructure progress, and direct electorate notice broadcasting.
   - **Audit Trail & Data Exports:** Instant export of citizen requests and assistance applications to CSV.

---

## 3. Technology Stack & Architecture

- **Frontend:** Next.js (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express.js, TypeScript, RESTful API architecture.
- **Database & ORM:** PostgreSQL (Production) / SQLite (Zero-dependency local dev), Prisma ORM.
- **Authentication & Security:** JWT session tokens, Bcrypt password hashing (12 rounds), Role-Based Access Control (RBAC), Helmet security headers, CORS protection, Zod request validation, and immutable audit logs.
- **Internationalization:** English (`en`) and Tok Pisin (`tpi`) translation dictionaries.

---

## 4. Repository Structure

```text
Digital District Services/
├── backend/                       # Express.js + TypeScript REST API
│   ├── prisma/
│   │   ├── schema.prisma          # Production PostgreSQL Schema
│   │   ├── schema.sqlite.prisma   # Local Development SQLite Schema
│   │   └── seed.ts                # Authentic Bulolo District seed records
│   ├── src/
│   │   ├── config/                # Environment & Database client
│   │   ├── controllers/           # Auth, Requests, Assistance, Services, Projects, Reports
│   │   ├── middleware/            # Auth, RBAC, Audit Logging, Error handling
│   │   ├── routes/                # REST API router (/api/v1/...)
│   │   ├── tests/                 # Automated API test suite (11 test cases)
│   │   └── server.ts              # Express Server entrypoint
│   └── package.json
├── frontend/                      # Next.js App Router + Tailwind CSS
│   ├── src/
│   │   ├── app/                   # App Router pages (public, auth, portal, admin)
│   │   ├── components/            # Reusable UI, Layout, BuloloLogo, Cards
│   │   ├── context/               # AuthContext, LanguageContext (English / Tok Pisin)
│   │   └── lib/                   # API client with offline draft detection
│   ├── public/                    # PWA manifest.json and icons
│   ├── tailwind.config.ts         # Bulolo color system (Forest Green, Gold, Charcoal)
│   └── package.json
├── shared/                        # Shared types, LLG metadata, & translation dictionaries
│   ├── types/                     # Geography, Auth, Request, Assistance, Directory types
│   └── locales/
│       ├── en.json                # English dictionary
│       └── tpi.json               # Tok Pisin dictionary
├── .env.example                   # Environment configuration template
├── package.json                   # Root orchestrator scripts
└── README.md                      # Comprehensive documentation
```

---

## 5. Installation & Setup Instructions

### Prerequisites
- Node.js v18+ (tested on Node.js v26)
- npm v9+

### 1. Backend Setup & Database Migration
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup local database and seed authentic Bulolo records
npm run db:setup
```

*(Note: For PostgreSQL in production, set `DATABASE_URL="postgresql://user:password@host:5432/bulolo_connect?schema=public"` in `.env` and run `npx prisma db push --schema=prisma/schema.prisma`)*

### 2. Run Backend Automated Test Suite
```bash
# Inside backend directory
npx ts-node src/tests/api.test.ts
```
Expected output:
```text
🧪 Starting Bulolo Connect API Test Suite...
  ✅ PASS: Health check endpoint
  ✅ PASS: Get Bulolo LLGs directory
  ✅ PASS: Get verified district services
  ✅ PASS: Get assistance programmes
  ✅ PASS: Get development projects
  ✅ PASS: Track request REQ-2026-00001
  ✅ PASS: Citizen login (John Somare)
  ✅ PASS: Admin login (Super Admin)
  ✅ PASS: Submit new citizen request
  ✅ PASS: Admin dashboard overview metrics calculation
  ✅ PASS: Export citizen requests to CSV
=======================================================
🏁 Test Results: 11 Passed, 0 Failed.
=======================================================
```

### 3. Start Backend Server
```bash
npm run dev
# Server runs on: http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### 4. Frontend Setup & Build
```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Build production bundle
npm run build

# Start frontend application
npm run dev
# Application accessible at: http://localhost:3000
```

---

## 6. Pre-Configured Test & Evaluation Accounts

The database seed provides verified accounts with authentic roles:

| Role | Email / Phone | Password | Purpose |
|:---|:---|:---|:---|
| **Super Administrator** | `admin@buloloconnect.gov.pg` | `BuloloAdmin2026!` | Full ICT & system governance |
| **MP's Office Representative** | `mp.office@buloloconnect.gov.pg` | `BuloloAdmin2026!` | Executive electorate oversight & public notice broadcasting |
| **District Administrator** | `dist.admin@buloloconnect.gov.pg` | `BuloloAdmin2026!` | District records, services & assistance management |
| **Office Staff** | `staff@buloloconnect.gov.pg` | `BuloloAdmin2026!` | Case triage, officer response & status updates |
| **Registered Citizen** | `citizen@bulolo.pg` (`+67571234567`) | `BuloloCitizen2026!` | Citizen John Somare (Sambio Ward, Mumeng LLG) |

---

## 7. Security, Privacy & Low-Bandwidth Optimizations

- **Strict Data Segregation:** Citizens can only view their own requests, assistance applications, and private household records.
- **Protected Household Module:** Family members, dependents, and vulnerability markers are strictly hidden from public directories and restricted to authorized welfare case officers with audit logging.
- **Low-Bandwidth Mobile Optimizations:** Zero heavy external runtime web fonts, compact CSS bundles (<105 kB first load JS), offline form drafting in `localStorage`, and PWA mobile installation manifest.
- **Language Switcher:** Seamless toggle between English and Tok Pisin on every page without page reloading.

---

**BULOLO CONNECT — One District. One Community. One Connected Future.**

# VaaniX

> **AI-powered real-time voice integrity and impersonation monitoring platform**

VaaniX is an enterprise security operations dashboard designed to help organizations detect, investigate, and respond to **voice-cloning and voice-impersonation attacks** during calls.

The project combines a polished **Next.js security console** with a standalone **voice deepfake detection pipeline**. The frontend currently uses deterministic mock/demo data so the complete analyst experience can be demonstrated without requiring a production backend. The Python pipeline is independently capable of capturing audio and running it through the Nes2Net voice deepfake-detection model.

---

## Table of Contents

- [Overview](#overview)
- [Problem](#problem)
- [Solution](#solution)
- [Key Features](#key-features)
- [Application Flow](#application-flow)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Frontend Pages](#frontend-pages)
- [Risk Scoring](#risk-scoring)
- [Voice Detection Pipeline](#voice-detection-pipeline)
- [Telegram Alerts](#telegram-alerts)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Frontend](#running-the-frontend)
- [Running the Detection Pipeline](#running-the-detection-pipeline)
- [Testing / Demo Mode](#testing--demo-mode)
- [Deploying to Vercel](#deploying-to-vercel)
- [Backend Integration Roadmap](#backend-integration-roadmap)
- [Security and Privacy](#security-and-privacy)
- [Current Prototype Status](#current-prototype-status)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Modern generative-AI systems can clone a person's voice from a relatively small amount of audio. An attacker can use a cloned voice to impersonate an executive, employee, customer, or other trusted identity and attempt to:

- authorize high-value transactions,
- reset credentials,
- obtain sensitive information,
- request privileged access,
- manipulate employees,
- or bypass traditional voice-based verification.

VaaniX is designed as a **security-team-facing platform**, rather than a consumer call-screening application.

The central idea is to continuously analyze call audio and combine multiple signals into an actionable **impersonation risk score**. Security analysts can then monitor active calls, investigate suspicious activity, review alerts, analyze trends, and manage detection policies.

---

## Problem

Traditional caller verification can be vulnerable when an attacker successfully clones a trusted person's voice.

A security system therefore needs to look beyond a single voice characteristic and evaluate multiple signals, such as:

1. **Synthetic voice indicators** — evidence that the speech may have been generated or manipulated.
2. **Speaker verification** — whether the current speaker matches the enrolled identity.
3. **Prosody anomalies** — unusual characteristics in rhythm, pitch, timing, or speech behavior.
4. **Contextual risk** — whether the call's intent and surrounding context indicate a potentially dangerous request.

VaaniX combines these signals into one risk score that can drive alert severity and analyst actions.

---

## Solution

VaaniX provides a centralized security console containing:

- real-time-style call monitoring,
- risk scores and severity bands,
- synthetic voice / deepfake analysis,
- speaker verification information,
- security alerts,
- investigation workflows,
- historical call analysis,
- organization-wide analytics,
- enrolled voice profiles,
- configurable detection policies,
- integration status,
- reports,
- and administrative audit logs.

The current repository is intentionally structured as a **prototype/demo system**. The UI and interaction flows are implemented, while production authentication, live streaming, persistent storage, and API connectivity are planned integration points.

---

## Key Features

### 1. Security Overview Dashboard

The dashboard provides an organization-wide security snapshot, including:

- calls analyzed,
- risk overview,
- live signal visualization,
- spectral activity,
- recent high-severity activity,
- and quick access to security alerts.

The dashboard also contains simulated live activity to make the prototype feel like a continuously operating SOC console.

### 2. Live Call Monitoring

The Live Call Monitoring page provides a view of active enterprise call streams.

Analysts can:

- view active calls,
- identify calls under analysis,
- see critical calls,
- search by call ID,
- search by claimed identity,
- search by caller number,
- filter by severity,
- and open individual call details.

### 3. Call Analysis

Individual call views expose security evidence such as:

- overall risk score,
- risk band,
- call metadata,
- risk timeline,
- signal analysis,
- speaker verification,
- evidence,
- and analyst action controls.

### 4. Security Alerts

The Alerts section supports security triage with:

- critical / high / medium / low severity,
- open / investigating / escalated / resolved / dismissed states,
- searchable alert records,
- alert detail views,
- call association,
- identity association,
- and export actions.

### 5. Investigations

Analysts can manage cases created from suspicious activity.

Investigation records can be:

- searched,
- filtered by status,
- opened for detailed review,
- and tracked through their lifecycle.

Supported states include:

- Open
- In Progress
- Escalated
- Closed

### 6. Analytics

The analytics dashboard visualizes detection behavior over time, including:

- synthetic voice detection trend,
- average risk score,
- high-risk call trend,
- critical alert trend,
- speaker mismatch trend,
- risk by hour,
- risk by department,
- risk by call type,
- detection precision,
- detection recall,
- false-positive rate,
- and mean time to detect.

### 7. Voice Profiles

Voice Profiles represent protected speaker identities.

The UI is designed around **biometric embeddings rather than raw audio recordings**, allowing organizations to conceptually manage enrolled identities while applying retention and access-control policies.

Profiles can be searched and filtered by status.

### 8. Detection Policies

Security administrators can configure:

- critical risk thresholds,
- secondary-verification thresholds,
- audio retention periods,
- embedding retention,
- automatic escalation,
- and analyst notifications.

### 9. Integrations

The integrations section provides a centralized view of:

- voice infrastructure,
- APIs,
- fraud/risk engines,
- API credentials,
- synchronization state,
- and credential rotation actions.

### 10. Reports

The Reports section contains scheduled/on-demand reporting concepts for:

- security,
- detection,
- and compliance.

It also includes a generated-report history and export actions.

### 11. Audit Log

The audit log provides an administrative/analyst activity view with:

- timestamp,
- user,
- action,
- resource,
- IP address,
- result,
- search,
- filtering,
- pagination,
- and export functionality.

### 12. Authentication UI

The project includes a protected-login experience with a Google sign-in entry point.

**Important:** the current implementation simulates successful Google authentication locally. It is not connected to a real OAuth provider yet.

---

## Application Flow

```text
                    ┌─────────────────────┐
                    │   Enterprise Call   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Audio Capture     │
                    │ Virtual Audio Device│
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Voice Detection     │
                    │     Pipeline        │
                    └──────────┬──────────┘
                               │
                               ▼
             ┌──────────────────────────────────┐
             │ Multi-Signal Risk Assessment     │
             │                                  │
             │ • Synthetic voice score          │
             │ • Speaker mismatch               │
             │ • Prosody anomaly                 │
             │ • Contextual risk                 │
             └────────────────┬─────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   Risk Score 0-100  │
                    └──────────┬──────────┘
                               │
               ┌───────────────┼────────────────┐
               ▼               ▼                ▼
          Low / Elevated     High            Critical
               │               │                │
               └───────────────┴────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   VaaniX SOC      │
                    │      Console        │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
       Alerts            Investigations         Analytics
```

---

## Architecture

The repository currently contains three major parts:

### Frontend

The Next.js application is responsible for the security analyst experience.

```text
Next.js
   │
   ├── App Router
   ├── React components
   ├── Zustand authentication state
   ├── Recharts visualizations
   ├── Tailwind CSS
   └── deterministic mock data
```

### Voice Detection Pipeline

The Python pipeline is intentionally standalone.

```text
Audio source
    │
    ▼
capture.py
    │
    ▼
WAV recording
    │
    ▼
model_runner.py
    │
    ▼
Nes2Net model
    │
    ▼
Detection result
    │
    ├── printed verdict
    └── JSON result
```

The current pipeline does **not** directly communicate with the Next.js frontend.

### Telegram Alert Utility

A separate Telegram utility can send voice-clone alerts through a Telegram bot.

```text
Detection / Alert
       │
       ▼
alerts.py
       │
       ▼
Telegram Bot
       │
       ▼
Security recipient
```

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 16 | Web application framework |
| React 19 | UI |
| TypeScript | Type-safe development |
| Tailwind CSS 4 | Styling |
| Zustand | Client-side authentication state |
| Recharts | Analytics and data visualization |
| Framer Motion | UI animation |
| Lucide React | Icons |
| Radix UI | Accessible UI primitives |
| Sonner | Toast notifications |
| date-fns | Date/time utilities |

### Detection Pipeline

| Technology | Purpose |
|---|---|
| Python 3.10 | Pipeline runtime |
| sounddevice | Audio capture |
| Nes2Net | Voice deepfake detection |
| XLSR / wav2vec2 weights | Model front-end |
| PyTorch ecosystem | Model inference |
| fairseq | Model dependency |

### Alerting

| Technology | Purpose |
|---|---|
| Telegram Bot API | Security alert delivery |

---

## Project Structure

```text
VoxAegis/
│
├── public/
│   └── static assets
│
├── src/
│   ├── app/
│   │   ├── login/
│   │   └── (shell)/
│   │       ├── dashboard/
│   │       ├── live-calls/
│   │       ├── call-history/
│   │       ├── alerts/
│   │       ├── investigations/
│   │       ├── analytics/
│   │       ├── voice-profiles/
│   │       ├── reports/
│   │       └── settings/
│   │           ├── audit-log/
│   │           ├── integrations/
│   │           ├── policies/
│   │           └── team/
│   │
│   ├── components/
│   │   ├── alerts/
│   │   ├── calls/
│   │   ├── charts/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── shared/
│   │   ├── tables/
│   │   └── ui/
│   │
│   ├── data/
│   │   ├── constants.ts
│   │   ├── mock-alerts.ts
│   │   ├── mock-analytics.ts
│   │   ├── mock-calls.ts
│   │   ├── mock-investigations.ts
│   │   ├── mock-overview.ts
│   │   ├── mock-profiles.ts
│   │   ├── mock-reports.ts
│   │   └── mock-settings.ts
│   │
│   ├── hooks/
│   │   ├── use-live-call.ts
│   │   ├── use-risk-updates.ts
│   │   └── use-theme.ts
│   │
│   ├── lib/
│   │   ├── risk.ts
│   │   └── utils.ts
│   │
│   ├── store/
│   │   └── auth-store.ts
│   │
│   └── types/
│       ├── alert.ts
│       ├── call.ts
│       ├── common.ts
│       ├── investigation.ts
│       ├── settings.ts
│       └── voice.ts
│
├── voice_detection_pipeline/
│   ├── pipeline.py
│   ├── capture.py
│   ├── model_runner.py
│   ├── model_scripts/
│   ├── requirements.txt
│   ├── xlsr2_300m.pt
│   ├── wav2vec2_Nes2Net_X_best.pth
│   └── results/
│
├── telegram/
│   ├── alerts.py
│   ├── bot_listener.py
│   ├── get_chat_id.py
│   └── README.md
│
├── package.json
├── package-lock.json
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## Frontend Pages

| Route | Purpose |
|---|---|
| `/` | Redirects to login or dashboard |
| `/login` | Authentication entry point |
| `/dashboard` | Security overview |
| `/live-calls` | Active call monitoring |
| `/live-calls/[id]` | Detailed live-call analysis |
| `/call-history` | Historical calls |
| `/alerts` | Alert triage |
| `/investigations` | Security investigations |
| `/investigations/[id]` | Investigation details |
| `/analytics` | Detection analytics |
| `/voice-profiles` | Protected speaker profiles |
| `/reports` | Security/compliance reports |
| `/settings` | Organization settings |
| `/settings/policies` | Detection thresholds and retention |
| `/settings/integrations` | External integration configuration |
| `/settings/team` | Team administration |
| `/settings/audit-log` | Administrative audit records |

---

## Risk Scoring

VaaniX uses a 0–100 risk scale.

### Risk Bands

| Score | Risk Band |
|---:|---|
| 0–29 | Low |
| 30–59 | Elevated |
| 60–84 | High |
| 85–100 | Critical |

### Risk Fusion

The current frontend risk utility combines four inputs:

```text
Synthetic Voice Score       × 0.38
Speaker Mismatch Score      × 0.22
Prosody Anomaly Score       × 0.20
Contextual Risk Score       × 0.20
```

Speaker mismatch is calculated as:

```text
Speaker Mismatch = 100 - Speaker Match Score
```

Therefore:

```text
Risk =
    Synthetic Score × 0.38
  + Speaker Mismatch × 0.22
  + Prosody Anomaly × 0.20
  + Context Risk × 0.20
```

The final score is constrained to the range **0–100**.

> These weights are currently part of the prototype's risk-fusion logic and should be validated and calibrated against real production data before being used for operational decisions.

---

## Voice Detection Pipeline

The `voice_detection_pipeline/` directory contains a standalone inference system.

Its purpose is:

```text
Capture audio
     ↓
Save WAV
     ↓
Run Nes2Net inference
     ↓
Generate verdict
     ↓
Save JSON result
```

### Important

The pipeline currently operates independently of the frontend.

It does **not** currently provide:

- a REST API,
- a WebSocket stream,
- direct frontend communication,
- persistent database storage,
- or production call-platform integration.

This separation makes the model pipeline independently testable while keeping the frontend prototype easy to run.

### Supported Audio Input Concept

A virtual audio device is used to make system/call audio accessible to Python.

Examples:

- **macOS:** BlackHole
- **Windows:** VB-Cable

The pipeline documentation inside `voice_detection_pipeline/README.md` contains the detailed OS-specific setup instructions.

### Model Files

The pipeline expects two large model assets:

```text
xlsr2_300m.pt
wav2vec2_Nes2Net_X_best.pth
```

Together they require several gigabytes of storage.

These model assets should not be unnecessarily duplicated or committed to version control if the deployment environment can download them separately.

---

## Telegram Alerts

The `telegram/` directory contains a small bot-based alerting utility.

Typical workflow:

```bash
python get_chat_id.py
```

Preview an alert:

```bash
python alerts.py <chat_id>
```

Actually send an alert:

```bash
python alerts.py <chat_id> --send
```

Run the listener for button interactions:

```bash
python bot_listener.py
```

The bot can be used as an additional notification channel for security personnel.

---

## Getting Started

### Prerequisites

For the frontend:

- Node.js
- npm
- Git

For the voice pipeline:

- Python 3.10
- virtual audio device
- model checkpoints
- platform-specific audio permissions

### Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd VoxAegis
```

### Install frontend dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Environment Variables

The current frontend does not require environment variables for the demo UI.

When production services are connected, variables can be added through `.env.local` for local development and through the hosting provider for deployment.

A future production configuration may look conceptually like:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_WS_URL=wss://api.example.com/ws
```

Server-side secrets such as API keys, database credentials, OAuth secrets, and bot tokens should **never** be exposed through `NEXT_PUBLIC_*` variables.

---

## Running the Frontend

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Production server

```bash
npm run start
```

### Lint

```bash
npm run lint
```

---

## Testing / Demo Mode

The frontend currently uses deterministic mock datasets located under:

```text
src/data/
```

This includes mock data for:

- calls,
- alerts,
- investigations,
- analytics,
- overview KPIs,
- voice profiles,
- reports,
- and settings.

The mock datasets use deterministic generation where appropriate so the demo remains reproducible.

Some UI interactions intentionally simulate backend behavior with local state and toast messages.

For example:

- generating a report displays a simulated generation process,
- policy changes update local state,
- integration actions display simulated responses,
- API credential generation/rotation is simulated,
- authentication currently simulates successful Google sign-in,
- and live counters are simulated locally.

This is intentional for the current prototype stage.

---

## Deploying to Vercel

The Next.js frontend can be deployed directly to Vercel.

### Recommended settings

```text
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: Next.js default
Install Command: npm install
```

If the frontend is moved into a dedicated `frontend/` directory later, set the Vercel **Root Directory** to that folder.

After deployment, pushing new commits to the connected GitHub branch will trigger a new Vercel deployment.

---

## Backend Integration Roadmap

The frontend is structured so the mock-data layer can eventually be replaced with real services.

A production architecture can evolve toward:

```text
                     ┌───────────────────┐
                     │ Telecom / SIP /   │
                     │ Call Infrastructure│
                     └─────────┬─────────┘
                               │
                               ▼
                     ┌───────────────────┐
                     │ Audio Stream      │
                     │ Ingestion Layer   │
                     └─────────┬─────────┘
                               │
                               ▼
                 ┌──────────────────────────┐
                 │ FastAPI / WebSocket API  │
                 └────────────┬─────────────┘
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
        Audio/model      Risk engine      Database
        inference        / policy         / events
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                     ┌───────────────────┐
                     │    VaaniX       │
                     │    Next.js UI     │
                     └─────────┬─────────┘
                               │
                 ┌─────────────┼─────────────┐
                 ▼             ▼             ▼
              Analyst       Alerts       Reports
```

### Recommended backend responsibilities

A production backend should handle:

- call ingestion,
- audio streaming,
- model inference,
- speaker-profile matching,
- risk fusion,
- policy evaluation,
- alert creation,
- investigation persistence,
- authentication/authorization,
- audit logging,
- report generation,
- and real-time event delivery.

### Recommended API boundary

The current frontend should eventually consume endpoints similar to:

```text
GET    /calls
GET    /calls/{id}
GET    /calls/live
GET    /alerts
POST   /alerts/{id}/resolve
GET    /investigations
GET    /investigations/{id}
GET    /analytics
GET    /voice-profiles
POST   /voice-profiles
GET    /policies
PUT    /policies
GET    /audit-log
WS     /calls/{id}/stream
```

These are architectural examples, not currently implemented endpoints.

---

## Real-Time Call Integration

For a telecom deployment, the browser should generally **not be responsible for directly capturing or processing the telecom company's call audio**.

A more appropriate architecture is:

```text
Telecom network
      │
      ▼
Call/media infrastructure
      │
      ▼
Secure audio stream
      │
      ▼
Backend ingestion service
      │
      ├── Deepfake detection
      ├── Speaker verification
      ├── Prosody analysis
      └── Context/risk engine
      │
      ▼
Risk event
      │
      ├── WebSocket → VaaniX dashboard
      ├── Alert service → security team
      └── Database → investigation/history
```

This allows the telecom provider to keep the call stream within its controlled infrastructure while VaaniX functions as the security intelligence layer.

---

## Security and Privacy

Because voice information can be biometric and highly sensitive, a production implementation should include strong privacy and security controls.

### Recommended controls

- encryption in transit,
- encryption at rest,
- strict role-based access control,
- organization-level tenant isolation,
- least-privilege API credentials,
- short-lived authentication tokens,
- audit logging,
- configurable audio retention,
- configurable embedding retention,
- secure deletion,
- model access controls,
- rate limiting,
- secure secrets management,
- and monitoring of administrative actions.

### Voice profiles

The UI is designed around protected voice embeddings instead of displaying raw recordings as the primary identity representation.

However, **biometric embeddings must still be treated as sensitive data** even if they are not directly reversible into speech.

### Production authentication

The current local Google sign-in behavior is a placeholder and must be replaced with a real identity provider/OAuth implementation before production use.

---

## Current Prototype Status

### Implemented

- [x] Next.js application shell
- [x] Security dashboard
- [x] Live call monitoring UI
- [x] Call history
- [x] Alert management UI
- [x] Investigation management
- [x] Analytics dashboard
- [x] Voice profile management UI
- [x] Reports UI
- [x] Detection policy UI
- [x] Integration management UI
- [x] Team/settings pages
- [x] Audit log
- [x] Risk scoring utility
- [x] Responsive UI
- [x] Reusable UI components
- [x] Standalone voice detection pipeline
- [x] Telegram alert utility
- [x] Vercel-compatible Next.js build configuration

### Prototype / Not Yet Production-Connected

- [ ] Real Google OAuth
- [ ] Production database
- [ ] Real telecom call ingestion
- [ ] Real-time WebSocket backend
- [ ] Frontend ↔ Python pipeline API
- [ ] Persistent alert/investigation state
- [ ] Production report generation
- [ ] Production email/SMS/Telegram orchestration
- [ ] Production speaker enrollment
- [ ] Model-serving infrastructure
- [ ] Production-grade policy enforcement
- [ ] End-to-end authentication/authorization

---

## Future Improvements

### Real-time detection

Move from periodic/local simulation to true streaming inference.

### Backend service

Introduce a FastAPI service that exposes model inference and risk events.

### WebSockets

Stream live risk updates from the backend to the analyst dashboard.

### Database

Persist:

- calls,
- alerts,
- investigations,
- users,
- voice profiles,
- policies,
- reports,
- and audit events.

### Telecom integration

Connect the system to SIP/media infrastructure or a telecom provider's approved call-streaming interface.

### Model serving

Deploy the deepfake model behind a dedicated inference service so the frontend does not depend on local model execution.

### Better speaker verification

Combine deepfake detection with robust speaker verification and enrolled speaker embeddings.

### Explainable alerts

Provide analysts with clear evidence explaining why a call received its risk score.

### Feedback loop

Allow analysts to label alerts as:

- true positive,
- false positive,
- confirmed impersonation,
- legitimate call.

Those labels can later be used for evaluation and model improvement.

### Production authentication

Integrate enterprise identity providers such as Google Workspace, Microsoft Entra ID, Okta, or another approved SSO provider.

---

## Development Notes

### Deterministic Demo Data

The frontend uses a fixed demo time and seeded random generation for reproducible mock datasets.

This avoids inconsistent server/client rendering and makes screenshots and demonstrations repeatable.

### Component Architecture

Reusable components are grouped by responsibility:

```text
components/
├── calls/
├── alerts/
├── charts/
├── dashboard/
├── layout/
├── shared/
├── tables/
└── ui/
```

This keeps page-level files focused on composition and state management.

### Risk Logic

Centralized risk utilities live in:

```text
src/lib/risk.ts
```

This is the recommended place for shared risk-band and severity logic.

---

## Contributing

1. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Run linting:

```bash
npm run lint
```

5. Build the project:

```bash
npm run build
```

6. Commit your changes:

```bash
git add .
git commit -m "Add your feature"
```

7. Push the branch:

```bash
git push origin feature/your-feature
```

8. Open a pull request.

---

## License

This repository is currently a project/prototype repository. Add the appropriate open-source or proprietary license here before public distribution.

---

## Project Summary

**VaaniX turns voice-cloning detection into an enterprise security workflow.**

Instead of simply answering:

> "Is this voice AI-generated?"

the platform is designed to answer:

> **"How risky is this call, why is it risky, what evidence supports the decision, and what should the security team do next?"**

The long-term goal is to connect the detection pipeline to real telecom call infrastructure and provide security teams with a real-time, explainable, and auditable defense against voice-cloning impersonation attacks.

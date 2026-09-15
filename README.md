# VaaniX

> **AI-powered real-time voice integrity and impersonation monitoring platform**

VaaniX is a security operations dashboard for detecting, investigating, and responding to **voice-cloning and voice-impersonation attacks** during calls. It pairs a full Next.js SOC console with a real, working **live microphone deepfake-detection demo**, a standalone **Nes2Net voice detection pipeline**, and a **Telegram alerting** utility.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Live Detection (real, not mocked)](#live-detection-real-not-mocked)
- [Risk Scoring](#risk-scoring)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Voice Detection Server](#running-the-voice-detection-server)
- [Telegram Alerts](#telegram-alerts)
- [Prototype Status](#prototype-status)
- [License](#license)

---

## Overview

Generative-AI voice cloning lets an attacker impersonate an executive, employee, or customer to authorize payments, reset credentials, or extract sensitive information. VaaniX continuously scores calls on multiple signals — synthetic-voice likelihood, speaker verification, prosody anomalies, and contextual risk — and gives security analysts one console to monitor, investigate, and respond.

Most of the console runs on deterministic mock data so the full analyst workflow can be demoed without a production backend. The **Live Detection** page is the exception: it captures your microphone in the browser and sends real audio to a Python model server for an actual verdict.

---

## Features

| Page | What it does |
|---|---|
| **Dashboard** | Org-wide security snapshot: calls analyzed, risk overview, live signal waveform/spectrum, recent high-severity activity |
| **Live Calls** | Monitor active call streams; search by call ID, claimed identity, or caller number; filter by severity; drill into a call |
| **Live Call Detail** | Risk score, risk band, call metadata, risk timeline, signal analysis, speaker verification, evidence, and analyst actions |
| **Live Detection** | Real-time mic-based deepfake check — see [below](#live-detection-real-not-mocked) |
| **Alerts** | Triage by severity (critical/high/medium/low) and status (open/investigating/escalated/resolved/dismissed); alert detail view; export |
| **Investigations** | Case management with Open / In Progress / Escalated / Closed states, search, and filtering |
| **Voice Profiles** | Enrolled speaker identities modeled as biometric embeddings (not raw recordings), searchable and filterable by status |
| **Call History** | Searchable, filterable historical call records |
| **Analytics** | Trends for synthetic-voice detections, average risk, high-risk calls, critical alerts, speaker mismatches, risk by hour/department/call type, plus precision, recall, false-positive rate, and mean time to detect |
| **Reports** | Scheduled/on-demand security, detection, and compliance reports with generation history and export |
| **Settings → Policies** | Configure risk thresholds, secondary-verification thresholds, audio/embedding retention, auto-escalation, notifications |
| **Settings → Integrations** | View/manage voice infrastructure, APIs, fraud/risk engine connections, credentials, and sync state |
| **Settings → Team** | Team/user administration |
| **Settings → Audit Log** | Timestamped admin/analyst activity log with search, filtering, pagination, export |
| **Command Menu** | ⌘K-style global search/navigation across the app |
| **Notification Center** | In-app notification feed for alerts and system events |
| **Login** | Protected sign-in screen with a Google entry point (simulated locally — not wired to real OAuth yet) |

---

## Live Detection (real, not mocked)

Unlike the rest of the console, `/live-detection` is a working end-to-end feature:

1. The browser captures microphone audio (Web Audio API), shows a live level meter and animated mic orb, and buffers it into ~4s WAV chunks.
2. Each chunk is POSTed to the Next.js route `src/app/api/live-detection`.
3. That route proxies the audio to a local Python server (`voice_detection_pipeline/server.py`) running the Nes2Net deepfake-detection model.
4. The verdict (real vs. spoof, confidence, probabilities) streams back and renders live, with a rolling history of recent detections.

If the Python server isn't running, the page reports the detection engine as unreachable. The server also supports a stub mode (`VOICE_DETECTION_STUB=1`) that returns randomized scores without loading the ~5GB model — useful for UI development.

---

## Risk Scoring

VaaniX uses a 0–100 risk scale:

| Score | Band |
|---:|---|
| 0–29 | Low |
| 30–59 | Elevated |
| 60–84 | High |
| 85–100 | Critical |

Fusion formula (`src/lib/risk.ts`):

```text
Risk = Synthetic Voice Score × 0.38
     + Speaker Mismatch      × 0.22   (Speaker Mismatch = 100 − Speaker Match Score)
     + Prosody Anomaly       × 0.20
     + Contextual Risk       × 0.20
```

These weights are prototype defaults and should be recalibrated against real production data.

---

## Technology Stack

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand, Recharts, Framer Motion, Radix UI, Sonner, date-fns

**Voice Detection Server:** Python, Flask, PyTorch/fairseq, Nes2Net + XLSR/wav2vec2 weights, sounddevice

**Alerting:** Telegram Bot API

---

## Project Structure

```text
VoxAegis/
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── api/live-detection/        # proxies to the Python model server
│   │   └── (shell)/
│   │       ├── dashboard/  live-calls/  live-detection/
│   │       ├── call-history/  alerts/  investigations/
│   │       ├── voice-profiles/  analytics/  reports/
│   │       └── settings/ (policies, integrations, team, audit-log)
│   ├── components/   # calls, alerts, charts, dashboard, layout, live-detection, shared, tables, ui
│   ├── data/          # deterministic mock datasets
│   ├── hooks/         # use-live-detection, use-live-call, use-risk-updates
│   ├── lib/           # risk.ts, wav-encoder.ts, utils.ts
│   └── types/
│
├── voice_detection_pipeline/   # server.py, pipeline.py, capture.py, model_runner.py, model weights
├── telegram/                   # alerts.py, bot_listener.py, get_chat_id.py
└── package.json
```

---

## Getting Started

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd VoxAegis
npm install
npm run dev
```

Open `http://localhost:3000`. Other scripts: `npm run build`, `npm run start`, `npm run lint`.

---

## Running the Voice Detection Server

Required only for `/live-detection` to return real verdicts (every other page works without it):

```bash
cd voice_detection_pipeline
pip install -r requirements.txt
python server.py
# or, without the model downloaded:
VOICE_DETECTION_STUB=1 python server.py
```

It listens on `127.0.0.1:8765` by default (override with `VOICE_DETECTION_PORT`); the Next.js app talks to it via `VOICE_DETECTION_SERVER_URL`. See `voice_detection_pipeline/README.md` for model file setup and virtual-audio-device capture (`pipeline.py`/`capture.py`) as a separate, non-browser input path.

---

## Telegram Alerts

```bash
python telegram/get_chat_id.py                 # find your chat id
python telegram/alerts.py <chat_id>             # preview an alert
python telegram/alerts.py <chat_id> --send      # actually send it
python telegram/bot_listener.py                 # run the button-interaction listener
```

---

## Prototype Status

Implemented: full SOC console (dashboard, live calls, alerts, investigations, analytics, voice profiles, reports, settings, audit log), real-time mic-based live detection, standalone Nes2Net pipeline, Telegram alerting.

Not yet production-connected: real Google OAuth, production database, real telecom call ingestion, persistent alert/investigation state, production report generation, production speaker enrollment.

---

## License

This repository is currently a project/prototype. Add the appropriate license before public distribution.

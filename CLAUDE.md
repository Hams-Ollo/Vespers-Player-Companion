# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ollo's Player Companion** — a mobile-first D&D 5e character sheet and AI Dungeon Master web app. React 19 SPA + Express API proxy + Firebase Auth/Firestore + Google Gemini AI.

## Development Commands

```bash
# Full dev environment (both servers concurrently — preferred)
npm run dev:full

# Run separately
npm run dev          # Vite SPA on http://localhost:3000
npm run dev:server   # Express proxy on http://localhost:3001

# Production
npm run build        # Vite build → dist/
npm run preview      # Preview build on port 8080

# Upload D&D reference PDFs to Gemini File API (populates GEMINI_FILE_URI_* in .env)
npm run upload-pdfs
```

**Cloud Functions** (separate Node 20 project in `functions/`):
```bash
cd functions && npm run build          # TypeScript compile
cd functions && npm run serve          # Build + Firebase emulator
cd functions && npm run deploy         # Deploy to Firebase
```

**Firestore rules/indexes:**
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Architecture

### Two-Process Model

The app runs as two co-located processes that the Vite dev proxy stitches together:

1. **Vite SPA** (`index.tsx` → `App.tsx`) — React frontend on port 3000. Proxies `/api/*` to the Express server.
2. **Express proxy** (`server/index.js`) — runs on port 3001 (dev) / 8080 (production). Holds the `GEMINI_API_KEY` server-side only; all AI calls go through it. In production, this same process serves the static `dist/` build.

### AI Call Flow

All Gemini calls flow: **component → `lib/gemini.ts` → `/api/gemini/*` (Express) → Google Gemini API**. The browser never receives the API key. The proxy verifies Firebase ID tokens before forwarding. `lib/gemini.ts` exports `generateWithContext`, `createChatWithContext`, and `generatePortrait` — these are the only AI entry points for the frontend.

### Data Persistence Strategy

- **Authenticated users (Google):** Firestore via `lib/firestore.ts` + `lib/campaigns.ts`. Writes are debounced 500ms. Real-time `onSnapshot` listeners sync across tabs/devices.
- **Guest users (`guest-local-*` UIDs):** `localStorage` only under the key `vesper_chars`. No cloud calls.
- **First sign-in:** `CharacterContext` detects local characters and offers cloud migration via `migrateLocalCharacters()`.

### Context Provider Architecture

`App.tsx` wraps everything in three nested providers: `AuthProvider` → `CharacterProvider` → `CampaignProvider`. These are the primary state sources:

- `AuthContext` — Firebase auth state, user UID, auth loading
- `CharacterContext` — character CRUD, active character selection, cloud/local routing, save errors
- `CampaignContext` — campaign state, DM/player role detection, active campaign

### Routing (No Router Library)

Navigation is purely state-driven in `App.tsx`'s `AppContent`:
- No user → `LoginScreen`
- Active character → `Dashboard`
- No character + isDM + activeCampaign → `DMDashboard`
- Otherwise → `CharacterSelection`

### Key Files

| File | Role |
|------|------|
| `constants.tsx` | Canonical D&D 5e data: races, classes, spells, features, spell slots (~130KB) |
| `types.ts` | All TypeScript interfaces (`CharacterData`, `CampaignData`, etc.) |
| `utils.ts` | Stat calculation helpers (`recalculateCharacterStats`, `compressPortrait`, dice parsing) |
| `server/index.js` | Express proxy — Gemini endpoints, Firebase token verification, rate limiting, static SPA serving |
| `server/middleware/auth.js` | Firebase Admin token verification middleware |
| `server/middleware/rateLimit.js` | Per-user (20/min) + global (200/min) rate limiting |
| `lib/gemini.ts` | Frontend AI client — wraps proxy calls with auth token injection |
| `lib/firestore.ts` | Firestore CRUD + real-time character subscriptions |
| `lib/campaigns.ts` | Campaign-specific Firestore operations |
| `functions/src/index.ts` | Cloud Functions v2 — `onMemberCreated`/`onMemberDeleted` Firestore triggers sync `campaign.memberUids[]` |

### AI Models

Defined as constants in both `lib/gemini.ts` and `server/index.js`:
- **Text:** `gemini-2.5-flash`
- **Images (portraits):** `gemini-2.5-flash-image`

The `/api/gemini/live-token` endpoint hands authenticated users the raw API key for the Gemini Live Audio WebSocket (which can't be proxied via REST).

### Deployment

Push to `main` → Cloud Build (`cloudbuild.yaml`) runs automatically:
1. Docker multi-stage build (Firebase vars baked in as build args; `GEMINI_API_KEY` injected at runtime via Cloud Secret Manager)
2. Push image to Artifact Registry
3. Deploy to Cloud Run
4. Deploy Cloud Functions (with retry for IAM propagation delays)
5. Deploy Firestore security rules

### Environment Variables

Copy `.env.example` → `.env`. Required: `GEMINI_API_KEY`, all `VITE_FIREBASE_*` vars. Optional: `GEMINI_FILE_URI_*` (populated by `npm run upload-pdfs`) for rulebook-grounded AI answers.

The `GEMINI_API_KEY` is **never** exposed to the Vite build (`vite.config.ts` deliberately excludes it from `define`).

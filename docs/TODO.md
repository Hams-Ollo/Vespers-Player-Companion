# 📋 Developer Roadmap

> Living document tracking planned features, enhancements, and community requests for The Player's Companion.
>
> **Last updated:** 2026-02-11

---

## 🏷️ Priority Legend

| Label | Meaning |
|-------|---------|
| 🔴 **Critical** | Blocking issues or core missing functionality |
| 🟠 **High** | Important for next release |
| 🟡 **Medium** | Nice to have, improves UX or DX significantly |
| 🟢 **Low** | Polish, minor enhancements, long-term ideas |
| 🔵 **Community** | Requested by contributors or users |

---

## 🚀 Next Up (v0.3.0) — Cloud Persistence & Party Foundation

### 🔴 Critical

- [ ] **Backend API proxy** — Move Gemini API key to a server-side proxy so it’s not embedded in the client bundle
- [x] **Firestore cloud sync** — Persist characters to Firebase Firestore so data survives across devices/browsers. Uses `ownerUid` as partition key. localStorage remains as guest/offline fallback. _(v0.3.0 — 2026-02-11)_

### 🟠 High

- [x] **Firestore data schema design** — Collection: `characters` (top-level, keyed by character ID). Fields: `ownerUid`, `createdAt`, `updatedAt`. Security rules enforce per-user isolation. _(v0.3.0 — 2026-02-11)_
- [x] **Real-time Firestore listeners (`onSnapshot`)** — Characters sync live across devices via `CharacterContext` _(v0.3.0 — 2026-02-11)_
- [x] **Data migration helper** — First login detects localStorage characters, offers one-click "Import All" migration to Firestore _(v0.3.0 — 2026-02-11)_
- [ ] **Spellbook management** — Prepare/swap spells on long rest for prepared casters (Cleric, Druid, Wizard, Paladin)

### 🟡 Medium

- [ ] **Export/import character JSON** — Download character as `.json` file, import from file
- [ ] **Conditions tracker** — Track active conditions (Poisoned, Stunned, etc.) with mechanical effects on the dashboard
- [ ] **Subclass selection** — UI for choosing subclass at the appropriate level with feature integration

---

## 📦 v0.4.0 — Party System & Multiplayer

> _Depends on v0.3.0 Firestore integration._

### 🟠 High

- [ ] **Campaign join flow** — Replace the current stub (`alert("coming soon")`) with real Firestore lookup using `joinCode`
- [ ] **Shared party roster view** — See all characters in a campaign: name, class, level, HP, AC at a glance
- [ ] **Real-time party sync** — Firestore listeners so party view updates live when members change

### 🟡 Medium

- [ ] **Character visibility controls** — Owner can mark character as "visible to party" or private
- [ ] **Read-only party member sheets** — View other players' character sheets in read-only mode

---

## 📦 v0.5.0 — Dungeon Master Tool Suite

> _Depends on v0.4.0 Party System._

### 🟠 High — Core DM Dashboard

- [ ] **DM Mode toggle** — Campaign creator sees "DM Mode" switch in campaign view
- [ ] **Party overview panel (DM view)** — See all party members' HP, AC, active conditions at a glance
- [ ] **Initiative tracker** — Roll/input initiative, sorted turn order, current turn indicator, next/prev buttons
- [ ] **Combat encounter builder** — Add monsters (CR, HP, AC, attacks), mix with party in initiative order

### 🟡 Medium — Campaign Management

- [ ] **NPC registry** — Create/store NPCs with name, role, notes, location, disposition
- [ ] **Session notes / lore journal** — DM-side journal for world lore and session recaps with AI summarization
- [ ] **Quest tracker** — Quest arcs with status (active/completed/failed), objectives, rewards
- [ ] **Campaign hooks board** — Card/list of plot hooks and story threads
- [ ] **Turn timer** — Configurable per-turn countdown (optional)

### 🟢 Low — Advanced DM Features

- [ ] **Monster stat block database (SRD)** — Searchable monster database with full stat blocks
- [ ] **Encounter balancer** — CR calculator based on party size and level
- [ ] **DM-to-player messaging** — Push notes, images, or reveals to specific players
- [ ] **AI encounter generator** — Use Gemini to generate level-appropriate encounters
- [ ] **Map / location tracker** — Simple location graph or scene manager

---

## 📦 v0.6.0 — Higher-Level Character Creation

> _Allow players to create characters at any level from 1–20._

### 🟠 High

- [ ] **Level selection in Character Creation Wizard** — Choose starting level 1–20 in step 1
- [ ] **Cumulative HP calculation** — Sum of hit dice averages + CON modifier per level
- [ ] **ASI / Feat application per level** — Class-specific ASI levels (4,8,12,16,19 + Fighter/Rogue extras)
- [ ] **Subclass selection at appropriate level** — Level 1–3 depending on class
- [ ] **Spell slots & spells known by level** — Use existing `CLASS_FEATURES` and progression tables in constants.tsx
- [ ] **Class features accumulated through levels** — Compact multi-level choice UI (not 20 separate wizards)

### 🟡 Medium

- [ ] **Level-appropriate starting equipment & gold** — Scaled gold and gear for higher levels
- [ ] **"Recommended Build" quick button** — AI-suggested standard/popular choices for fast generation
- [ ] **Use deterministic logic from constants.tsx** — Drive core math from PHB tables; AI supplements with suggestions only
- [ ] **Multiclass support** — Allow characters to take levels in multiple classes, split hit dice, merge spell slots

---

## 🗺️ Long-term (v0.7.0+)

### 🟡 Medium

- [ ] **Death saves tracker** — Track successes/failures with auto-reset on stabilize or heal
- [ ] **Concentration tracker** — Flag active concentration spell, auto-prompt CON save on damage
- [ ] **Spell slot recovery UI** — Arcane Recovery (Wizard), Font of Magic (Sorcerer), Pact Magic short rest
- [ ] **Dark/light theme toggle** — Currently dark-only; add a light theme option

### 🟢 Low

- [ ] **PWA support** — Service worker + manifest for installable mobile app with offline support
- [ ] **Dice roll history** — Persistent log of all dice rolls in a session
- [ ] **Character comparison** — Side-by-side stat comparison between characters
- [ ] **Sound effects** — Optional dice roll sounds, level-up fanfare
- [ ] **i18n / localization** — Support for languages beyond English
- [ ] **Print-friendly character sheet** — CSS print stylesheet for paper export
- [ ] **Quick-reference rules card** — Common actions, conditions, and rules lookup

---

## 🔵 Community Requests

> Add community-requested features here. Include the GitHub issue # if applicable.

- [ ] **Create characters at any level (1–20)** — Users have asked to skip starting at level 1 for experienced campaigns. Tracked in Epic 9 / v0.6.0.
- [ ] _[Open an issue](https://github.com/Hams-Ollo/The-Players-Companion/issues) to suggest a feature!_

---

## ✅ Completed

> Move items here as they're finished. Include the version/date.

- [x] **Cloud Run deployment infrastructure** — Dockerfile (multi-stage), nginx.conf, .dockerignore, env var handling, deployment guide _(v0.2.3 — 2026-02-11)_
- [x] **CI/CD pipeline** — Cloud Build trigger on `main` branch, inline YAML with build-arg substitution, auto-deploy to Cloud Run _(v0.2.3 — 2026-02-11)_
- [x] **Firestore character persistence** — `lib/firestore.ts` service + `CharacterContext` provider, dual-mode (Firestore for Google users, localStorage for guests), debounced writes, migration banner, security rules + composite index _(v0.3.0 — 2026-02-11)_
- [x] **Firebase auth fixes** — Anonymous auth fallback to local guest session, Firebase authorized domains config _(v0.2.3 — 2026-02-11)_
- [x] **Wizard Spellbook Support** — Added Wizards to known-spell tables and improved AI forge parsing to prevent missing Grimoire data _(v0.2.2 — 2026-02-12)_
- [x] **Card Name Revert** — Reverted "Pouch" back to "Inventory" and "Legacy" to "Journal" for better intuitive navigation _(v0.2.2 — 2026-02-12)_
- [x] **Advanced Dice Roller** — Support for complex expressions (e.g., `2d6+1d4+2`) and Advantage/Disadvantage logic for d20 rolls with detailed UI _(v0.2.1 — 2026-02-12)_
- [x] **Error boundaries** — React error boundaries on all detail views and AI-powered modals _(v0.2.0 — 2026-02-11)_
- [x] **SettingsModal stat cascade** — Stat edits now recalculate AC, initiative, skills, saves, attacks _(v0.2.0 — 2026-02-11)_
- [x] **Tailwind build pipeline** — Replaced CDN with `@tailwindcss/vite` plugin, tree-shaken CSS _(v0.2.0 — 2026-02-11)_
- [x] **Data-driven spell selection** — Replaced AI-suggestion spell picker with PHB cantrip/spell lists _(v0.1.1 — 2026-02-11)_
- [x] **Spell slot progression tables** — Full/half/pact caster slots from PHB _(v0.1.1 — 2026-02-11)_
- [x] **Accessibility fixes** — `aria-label` on icon buttons, `htmlFor`/`id` on all form controls _(v0.1.1 — 2026-02-11)_
- [x] **Project documentation** — README, Architecture, API, Contributing docs _(v0.1.1 — 2026-02-11)_
- [x] **Starter equipment shop** — Roll starting gold, buy gear after character creation _(v0.1.0 — 2026-02-10)_
- [x] **Racial traits data** — Full PHB racial traits, languages, darkvision, racial spells _(v0.1.0 — 2026-02-10)_
- [x] **Class feature progression** — All 12 classes, levels 1–20 _(v0.1.0 — 2026-02-10)_
- [x] **Firebase authentication** — Google sign-in + anonymous guest mode _(v0.1.0 — 2026-02-10)_
- [x] **Gemini AI integration** — Portrait generation, DM chat, level-up assist, item lookup _(v0.1.0 — 2026-02-10)_
- [x] **Campaign manager** — Create/join with shareable codes _(v0.1.0 — 2026-02-10)_

---

## 💡 How to Propose a Feature

1. Check this list and [GitHub Issues](https://github.com/Hams-Ollo/The-Players-Companion/issues) for duplicates
2. Open a new issue with the `enhancement` label
3. Describe the **user story** ("As a player, I want to...")
4. Include any relevant PHB/SRD page references
5. The maintainers will triage and add it to this roadmap
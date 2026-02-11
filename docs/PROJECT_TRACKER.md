# 📊 Project Tracker

> Development tracking for The Player's Companion — organized by epics, features, user stories, and tasks.
>
> **Last updated:** 2026-02-11

---

## 🏷️ Status Legend

| Status | Icon | Meaning |
|--------|------|---------|
| Not Started | ⬜ | Planned but no work begun |
| In Progress | 🟨 | Actively being worked on |
| In Review | 🟦 | Complete, awaiting review/testing |
| Done | ✅ | Merged and shipped |
| Blocked | 🟥 | Waiting on dependency or decision |

---

## 📌 Epic 1: Core Character Management

> _Build a complete D&D 5e character sheet with creation, editing, and persistence._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ✅ | Feature | Character Creation Wizard (6-step) | @Hams-Ollo | Identity, stats, skills, spells, concept, review |
| ✅ | Task | Standard Array stat assignment | @Hams-Ollo | |
| ✅ | Task | Point Buy stat assignment | @Hams-Ollo | |
| ✅ | Task | Manual stat entry | @Hams-Ollo | |
| ✅ | Feature | Data-driven spell selection | @Hams-Ollo | PHB cantrip + 1st-level lists per class |
| ✅ | Task | Wizard Spellbook Support | @Hams-Ollo | Wizards correctly start with 6 spells at Lvl 1 |
| ✅ | Feature | Racial traits & bonuses | @Hams-Ollo | All PHB races + subraces |
| ✅ | Feature | Class feature progression | @Hams-Ollo | 12 classes, levels 1–20 |
| ✅ | Feature | Spell slot progression tables | @Hams-Ollo | Full/half/pact caster |
| ✅ | Feature | Starter equipment shop | @Hams-Ollo | Roll gold, buy gear post-creation |
| ✅ | Feature | Character selection & deletion | @Hams-Ollo | |
| ✅ | Task | localStorage persistence | @Hams-Ollo | `vesper_chars` key |
| ⬜ | User Story | As a player, I want to export/import my character as JSON | — | Download `.json`, import from file |
| ⬜ | User Story | As a player, I want my characters synced to the cloud | — | See Epic 6: Cloud Persistence |
| ⬜ | Feature | Multiclass support | — | Split hit dice, merge spell slots |
| ⬜ | Feature | Subclass selection UI | — | Choose at appropriate level |
| ⬜ | Feature | Create character at any level (1–20) | — | See Epic 9: Higher-Level Character Creation |

---

## 📌 Epic 2: Dashboard & Gameplay

> _Interactive dashboard for running a character during play sessions._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ✅ | Feature | Card-stack dashboard UI | @Hams-Ollo | Swipeable cards for each stat category |
| ✅ | Feature | Detail overlay views (7) | @Hams-Ollo | Vitals, Combat, Skills, Features, Spells, Inventory, Journal |
| ✅ | Feature | Dice roller | @Hams-Ollo | Advanced parser: Adv/Dis, complex expressions (2d6+4), crit/fail |
| ✅ | Feature | Rest system (short + long) | @Hams-Ollo | Hit dice recovery |
| ✅ | Feature | In-game equipment shop | @Hams-Ollo | Buy/sell from inventory |
| ✅ | Feature | Settings modal (stat editor) | @Hams-Ollo | Manual stat overrides |
| ✅ | User Story | As a player, I want stat edits to auto-update derived values | @Hams-Ollo | AC, initiative, skills, saves cascade via recalculateCharacterStats |
| ⬜ | User Story | As a player, I want to track active conditions | — | Poisoned, Stunned, etc. with effects |
| ⬜ | Feature | Death saves tracker | — | 3 successes / 3 failures |
| ⬜ | Feature | Concentration tracker | — | Flag active spell, prompt CON save |
| ⬜ | Feature | Spellbook management | — | Prepare/swap spells on long rest |
| ⬜ | Feature | Spell slot recovery UI | — | Arcane Recovery, Font of Magic, Pact Magic |
| ⬜ | Feature | Dice roll history log | — | Persistent session log |

---

## 📌 Epic 3: AI Integration

> _Leverage Google Gemini for intelligent assistance grounded in D&D rules._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ✅ | Feature | AI portrait generation | @Hams-Ollo | `gemini-2.5-flash-image` |
| ✅ | Feature | Ask the DM (multi-turn chat) | @Hams-Ollo | Grounded in uploaded PDFs |
| ✅ | Feature | AI-assisted level up | @Hams-Ollo | HP roll, ASI, new features |
| ✅ | Feature | Item/feature detail lookup | @Hams-Ollo | AI-powered rules text |
| ✅ | Feature | Journal AI chronicles | @Hams-Ollo | Session summary generation |
| ✅ | Task | Centralized Gemini client | @Hams-Ollo | `lib/gemini.ts` shared module |
| ✅ | Task | Rate limiting (2s throttle) | @Hams-Ollo | Closure-based, tamper-resistant |
| ✅ | Feature | Voice-to-text transcription | @Hams-Ollo | `TranscriptionButton` component |
| 🟥 | User Story | As a developer, I want the API key not exposed in the bundle | — | Blocked: needs backend proxy |
| ⬜ | Feature | Backend API proxy | — | Server-side Gemini key management |

---

## 📌 Epic 4: Authentication & Multiplayer

> _Firebase auth and campaign-based multiplayer features._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ✅ | Feature | Firebase Google sign-in | @Hams-Ollo | Modular Firebase API |
| ✅ | Feature | Anonymous guest mode | @Hams-Ollo | Fallback to local session |
| ✅ | Feature | Campaign manager | @Hams-Ollo | Create/join with shareable codes |
| ⬜ | User Story | As a DM, I want to see all players in my campaign | — | See Epic 7: Party System |
| ⬜ | Feature | Firestore character sync | — | See Epic 6: Cloud Persistence |
| ⬜ | Feature | Real-time campaign updates | — | See Epic 6: Cloud Persistence |

---

## 📌 Epic 5: Deployment & Infrastructure

> _Production deployment pipeline, containerization, and cloud hosting._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ✅ | Task | Dockerfile (multi-stage build) | @Hams-Ollo | node:20-alpine build → nginx:stable-alpine serve |
| ✅ | Task | nginx.conf for SPA serving | @Hams-Ollo | Port 8080, SPA routing, gzip, caching, security headers |
| ✅ | Task | .dockerignore | @Hams-Ollo | Exclude node_modules, .env, .git, docs |
| ✅ | Task | vite.config.ts env var handling | @Hams-Ollo | `getVar()` helper for Docker/Cloud Run build-time env injection |
| ✅ | Task | Remove legacy import map from index.html | @Hams-Ollo | Leftover from pre-Vite CDN setup |
| ✅ | Task | Cloud Run deployment guide | @Hams-Ollo | `docs/CLOUD_RUN_DEPLOY.md` |
| ✅ | Task | Firebase authorized domains config | @Hams-Ollo | Cloud Run `.run.app` domain added |
| ⬜ | Task | Backend API proxy for Gemini key | — | Server-side key management, unblocks Epic 3 security |
| ⬜ | User Story | As a developer, I want CI/CD pipeline | — | GitHub Actions: build, lint, deploy to Cloud Run |

---

## 📌 Epic 5b: Developer Experience & Quality

> _Code quality, build pipeline, testing, and documentation._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ✅ | Task | Project documentation suite | @Hams-Ollo | README, Architecture, API, Contributing |
| ✅ | Task | `.env.example` template | @Hams-Ollo | |
| ✅ | Task | Mermaid architecture diagrams | @Hams-Ollo | |
| ✅ | Task | Accessibility fixes (a11y) | @Hams-Ollo | aria-labels, htmlFor/id on forms |
| ✅ | Task | Dead code cleanup | @Hams-Ollo | Removed unused imports, interfaces |
| ✅ | Task | Tailwind build pipeline | @Hams-Ollo | Replaced CDN with `@tailwindcss/vite` plugin |
| ✅ | Task | Error boundaries | @Hams-Ollo | ErrorBoundary component on all detail views + AI modals |
| ⬜ | Task | `tsconfig` strict mode | — | Enable strict TypeScript checking |
| ⬜ | Task | Unit tests (Vitest) | — | Core utils, constants helpers |
| ⬜ | Task | E2E tests (Playwright) | — | Character creation flow |
| ⬜ | Feature | PWA support | — | Service worker, manifest |
| ⬜ | Feature | Dark/light theme toggle | — | Currently dark-only |

---

## 📌 Epic 6: Cloud Persistence (Phase 1)

> _Migrate from localStorage to Firestore so characters sync across devices and enable multiplayer. **This is the prerequisite for all multiplayer features.**_

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ⬜ | Task | Enable Firestore in Firebase project | — | Firebase Console → Build → Firestore |
| ⬜ | Task | Design Firestore data schema | — | Collections: `users`, `characters`, `campaigns`; use `uid` as partition key |
| ⬜ | Task | Firestore security rules | — | Players edit own characters, read party members'; DMs read all in campaign |
| ⬜ | Feature | Migrate character persistence to Firestore | — | Replace `localStorage.getItem('vesper_chars')` with Firestore CRUD |
| ⬜ | Feature | Migrate campaign persistence to Firestore | — | Replace `localStorage.getItem('vesper_campaigns')` with Firestore CRUD |
| ⬜ | Task | localStorage offline cache layer | — | Keep localStorage as fallback/cache, sync when online |
| ⬜ | Feature | Real-time Firestore listeners (`onSnapshot`) | — | Characters & campaigns sync live across devices |
| ⬜ | Task | Data migration helper | — | One-time import of existing localStorage data to Firestore on first login |
| ⬜ | Task | Per-user data partitioning | — | Tie characters to authenticated `uid`, not browser |

---

## 📌 Epic 7: Party System (Phase 2)

> _Multiplayer party features so friends can share characters within a campaign. **Depends on Epic 6 (Cloud Persistence).**_

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ⬜ | Feature | Campaign join flow (replace stub) | — | Use existing `joinCode` to look up campaign in Firestore, add member |
| ⬜ | Feature | Shared party roster view | — | See all characters in a campaign: name, class, level, HP, AC at a glance |
| ⬜ | Feature | Character visibility controls | — | Owner can mark character as "visible to party" or private |
| ⬜ | Feature | Real-time party sync | — | Firestore listeners so party view updates live when members change |
| ⬜ | User Story | As a player, I want to see my party members' characters | — | Read-only view of other players' sheets |
| ⬜ | User Story | As a DM, I want to see all players in my campaign | — | Full party overview with HP/AC/conditions |

---

## 📌 Epic 8: Dungeon Master Tool Suite (Phase 3)

> _Tools for DMs to manage campaigns, combat, NPCs, and lore. **Depends on Epic 7 (Party System).**_

### 8A: Core DM Dashboard

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ⬜ | Feature | DM Mode toggle | — | Campaign creator sees "DM Mode" switch in campaign view |
| ⬜ | Feature | Party overview panel (DM view) | — | See all party members' HP, AC, conditions at a glance |
| ⬜ | Feature | Initiative tracker | — | Roll/input initiative, sorted turn order, current turn indicator, next/prev |
| ⬜ | Feature | Combat encounter builder | — | Add monsters (CR, HP, AC, attacks), mix with party in initiative order |
| ⬜ | Feature | Turn timer | — | Configurable per-turn countdown (optional) |

### 8B: Campaign Management Tools

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ⬜ | Feature | NPC registry | — | Create/store NPCs with name, role, notes, location, disposition |
| ⬜ | Feature | Session notes / lore journal | — | DM-side journal for world lore, session recaps; AI summarization |
| ⬜ | Feature | Quest tracker | — | Quest arcs with status (active/completed/failed), objectives, rewards |
| ⬜ | Feature | Campaign hooks board | — | Card/list of plot hooks and story threads |

### 8C: Advanced DM Features (Long-term)

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ⬜ | Feature | Monster stat block database (SRD) | — | Searchable monster database with full stat blocks |
| ⬜ | Feature | Encounter balancer | — | CR calculator based on party size and level |
| ⬜ | Feature | DM-to-player messaging | — | Push notes, images, or reveals to specific players |
| ⬜ | Feature | AI encounter generator | — | Use Gemini to generate encounters for party level/size |
| ⬜ | Feature | Map / location tracker | — | Simple location graph or scene manager |

---

## 📌 Epic 9: Higher-Level Character Creation (Phase 4)

> _Allow players to create characters at any level from 1–20. **Complex due to cumulative level-up decisions.**_

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ⬜ | Feature | Level selection in Character Creation Wizard | — | Choose starting level 1–20 in step 1 |
| ⬜ | Task | Cumulative HP calculation | — | Sum of hit dice averages + CON modifier per level |
| ⬜ | Task | ASI / Feat application per level | — | Class-specific ASI levels (4,8,12,16,19 + Fighter extras) |
| ⬜ | Task | Subclass selection at appropriate level | — | Level 1–3 depending on class |
| ⬜ | Task | Spell slots & spells known by level | — | Use existing `CLASS_FEATURES` and spell slot tables in constants.tsx |
| ⬜ | Task | Class features accumulated through levels | — | Compact multi-level choice UI (not 20 separate wizards) |
| ⬜ | Task | Level-appropriate starting equipment & gold | — | Scaled gold and gear for higher levels |
| ⬜ | Feature | "Recommended Build" quick button | — | AI-suggested standard/popular choices for fast character generation |
| ⬜ | Task | Use deterministic logic from constants.tsx | — | Drive core math from PHB tables, not AI; AI supplements with suggestions |
| ⬜ | Task | Proficiency bonus auto-calculation | — | `Math.floor((level - 1) / 4) + 2` |

---

## 📌 Epic 10: Polish & Extras

> _UX improvements, quality-of-life features, and long-term ideas._

| Status | Type | Item | Owner | Notes |
|--------|------|------|-------|-------|
| ⬜ | Feature | Character comparison | — | Side-by-side stats |
| ⬜ | Feature | Print-friendly character sheet | — | CSS print stylesheet |
| ⬜ | Feature | Sound effects | — | Dice rolls, level-up fanfare |
| ⬜ | Feature | i18n / localization | — | Multi-language support |
| ⬜ | User Story | As a player, I want a quick-reference rules card | — | Common actions, conditions |

---

## 📈 Progress Summary

| Epic | Done | In Progress | Not Started | Total |
|------|------|-------------|-------------|-------|
| 1. Core Character Management | 12 | 0 | 5 | 17 |
| 2. Dashboard & Gameplay | 7 | 0 | 6 | 13 |
| 3. AI Integration | 8 | 0 | 2 | 10 |
| 4. Auth & Multiplayer | 3 | 0 | 3 | 6 |
| 5. Deployment & Infrastructure | 7 | 0 | 2 | 9 |
| 5b. Developer Experience | 7 | 0 | 4 | 11 |
| 6. Cloud Persistence (Phase 1) | 0 | 0 | 9 | 9 |
| 7. Party System (Phase 2) | 0 | 0 | 6 | 6 |
| 8. DM Tool Suite (Phase 3) | 0 | 0 | 14 | 14 |
| 9. Higher-Level Char Creation (Phase 4) | 0 | 0 | 10 | 10 |
| 10. Polish & Extras | 0 | 0 | 5 | 5 |
| **Total** | **44** | **0** | **66** | **110** |

---

## 📝 How to Update This Tracker

1. **New work item** — Add a row to the relevant epic table with ⬜ status
2. **Starting work** — Change status to 🟨 and add your GitHub handle as owner
3. **Ready for review** — Change status to 🟦
4. **Merged/shipped** — Change status to ✅
5. **Blocked** — Change status to 🟥 and add a note explaining the blocker
6. **New epic** — Add a new `## 📌 Epic N:` section following the existing format
7. **Update summary** — Recount the progress table after bulk changes
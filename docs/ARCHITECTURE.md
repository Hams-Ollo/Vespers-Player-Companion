# 🏗️ Architecture Guide

## Tech Stack

The application is built using a modern, lightweight frontend stack designed for performance and ease of development.

*   **Core Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **AI SDK**: [@google/genai](https://www.npmjs.com/package/@google/genai)
*   **Markdown Rendering**: `react-markdown` + `remark-gfm`

## Project Structure

```text
/
├── components/          # React Components
│   ├── details/         # Inner content for the Card Stacks (Vitals, Combat, etc.)
│   ├── ...              # Shared modals (DiceRoll, Settings, Shop, etc.)
│   ├── CardStack.tsx    # The core dashboard card container
│   └── Dashboard.tsx    # Main view controller
├── constants.tsx        # D&D 5e Rules Reference (Classes, Races, Items)
├── types.ts             # TypeScript Interfaces (CharacterData, Item, etc.)
├── utils.ts             # Helper functions (Stat calculation, Rate limiting)
└── App.tsx              # Root component & State/LocalStorage Manager
```

## Data Model

### `CharacterData`
The application state revolves around the `CharacterData` interface (defined in `types.ts`). This monolithic object contains everything about a character:
*   **Identity**: Name, Race, Class, Level, Portrait URL.
*   **Stats**: Strength, Dexterity, etc., including calculated modifiers.
*   **Inventory**: Array of `Item` objects, gold count.
*   **Journal**: Array of session notes.

### State Management
Currently, the app uses React's `useState` lifted to `App.tsx` for the source of truth.
*   **Persistence**: A `useEffect` hook in `App.tsx` subscribes to the `characters` state and serializes it to `localStorage` under the key `dnd-characters`.
*   **Updates**: Data updates are passed down via prop callbacks (`onUpdateData`).

## AI Integration Architecture

The application interfaces directly with the Google Gemini API via the client-side SDK.

### 1. Direct Client-Side Calls
For this specific demo architecture, API calls happen in the browser.
*   **Pros**: Zero backend infrastructure required; easy to host on static sites (Netlify/Vercel).
*   **Cons**: API Key is exposed to the client (mitigated by requiring user input or local `.env` only).

### 2. Rate Limiting
To prevent hitting API quotas during rapid testing, a custom utility `checkRateLimit()` in `utils.ts` enforces a maximum number of requests (e.g., 10) per sliding 1-minute window using LocalStorage to track timestamps.

### 3. Prompt Engineering
Prompts are constructed dynamically based on Character Data.
*   **Example (Item Detail):** The prompt injects the item name and type, asking specifically for Markdown formatting and tables for stats.
*   **Example (Level Up):** The prompt sends the current character class/level and asks for a JSON response containing specific choices (spells/feats).

## Styling System

*   **Glassmorphism**: The UI relies heavily on `backdrop-blur`, semi-transparent backgrounds (`bg-zinc-900/80`), and subtle borders to create depth.
*   **Semantic Colors**:
    *   **Red**: Vitals (Health)
    *   **Orange**: Combat (Aggression)
    *   **Blue**: Skills (Intellect/Utility)
    *   **Purple**: Magic/Traits (Mysticism)
    *   **Amber**: Inventory (Gold/Material)
*   **Fonts**: `Cinzel` is used for headings to evoke a fantasy feel, while `Inter` is used for UI text for readability.

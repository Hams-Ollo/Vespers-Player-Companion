# 🐉 Vesper's Card Sheet

![Status](https://img.shields.io/badge/Status-Active_Development-success)
![Tech](https://img.shields.io/badge/Stack-React_19_|_TypeScript_|_Tailwind-blue)
![AI](https://img.shields.io/badge/Powered_by-Google_Gemini-purple)

**Vesper's Card Sheet** is a modern, mobile-first Dungeons & Dragons 5e character sheet application. It reimagines the traditional spreadsheet-style character sheet as a tactile "Card Deck" dashboard, focusing on visual hierarchy, intuitive interactions, and powerful AI integration.

## ✨ Features

### 🎴 The Card Stack UI
Data is organized into 5 intuitive, color-coded stacks that expand into detailed overlays:
*   **❤️ Vitals (Red):** HP management, AC calculation, Initiative, and Hit Dice resting mechanics.
*   **⚔️ Combat (Orange):** Integrated weapon attacks, damage rolls, and class features (e.g., Sneak Attack).
*   **🧠 Skills (Blue):** Ability scores, saving throws, and skill checks with visual proficiency indicators.
*   **✨ Traits (Purple):** Class features and racial traits with expandable rules text.
*   **🎒 Inventory (Amber):** Gold tracking, equipment management, and an interactive shop.

### 🤖 AI-Powered Dungeon Master (Google Gemini)
*   **Portrait Artificer:** Generate high-fantasy character portraits based on your description or uploaded reference photos.
*   **Level Up Wizard:** AI analyzes your class and level to suggest new spells, feats, and stat improvements.
*   **Lore Master:** Click on any item or feature to get a detailed, Markdown-formatted rules description generated instantly.
*   **Journal Scribe:** Summarize your session notes into a coherent narrative chronicle.
*   **DM Chat:** A dedicated "Ask the DM" interface for rule queries and mechanic clarifications.

### 🎲 Interactive Systems
*   **3D Dice Logic:** Click any stat, skill, or attack to roll. Visual feedback for Critical Successes (Nat 20) and Fails.
*   **Character Forge:** A step-by-step wizard to create new characters using Standard Array, Point Buy, or Manual stat generation.
*   **Persistence:** All data is saved automatically to your browser's Local Storage.

---

## 📚 Documentation

We have detailed documentation available in the `docs/` folder:

*   **[🏗️ Architecture Guide](docs/ARCHITECTURE.md)**: Deep dive into the tech stack, component structure, and data flow.
*   **[🎮 User Guide](docs/USAGE.md)**: Instructions on setting up your API key, creating characters, and using the dashboard.
*   **[🤝 Contributing Guide](docs/CONTRIBUTING.md)**: How to set up the dev environment and guidelines for submitting pull requests.

---

## 🚀 Quick Start

### Prerequisites
*   Node.js (v18+ recommended)
*   A Google AI Studio API Key (Get it [here](https://aistudio.google.com/))

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/vespers-card-sheet.git
    cd vespers-card-sheet
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    GEMINI_API_KEY=your_google_ai_key_here
    ```

4.  **Run Local Server**
    ```bash
    npm run dev
    ```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

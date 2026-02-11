# 🤝 Contributing to Vesper's Card Sheet

We welcome contributions from the community! Whether you're a developer, a designer, or a D&D enthusiast with a great idea, here is how you can help.

## Development Setup

1.  **Fork the Repository** on GitHub.
2.  **Clone your fork** locally.
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Set up Environment**:
    Copy `.env.example` (if it exists) or create a `.env` file with your Gemini API Key:
    ```env
    GEMINI_API_KEY=your_key_here
    ```
5.  **Start Coding**:
    ```bash
    npm run dev
    ```

## Code Guidelines

*   **TypeScript**: We use strict TypeScript. Please define interfaces for new data structures in `types.ts`.
*   **Tailwind CSS**: Use utility classes for styling. Avoid custom CSS files unless necessary for complex animations.
*   **Components**: Keep components small and focused.
    *   `components/details/` is for specific stack views.
    *   `components/` root is for shared UI elements (Modals, Buttons).
*   **AI Safety**: Do not commit your `.env` file. Ensure `utils.ts` rate limiting is respected to avoid spamming the API during dev.

## Roadmap & Ideas 💡

Here are some areas we'd love help with:

*   **More Classes**: Currently, the `utils.ts` logic for AC and features is optimized for Rogues/Fighters. We need logic for Monks (Unarmored Defense), Barbarians (Rage damage), and Spellcasters (Spell slots).
*   **Spellbook**: A dedicated UI stack for managing known/prepared spells.
*   **Export/Import**: Ability to export character JSON to file and import it (backup).
*   **Mobile Polish**: Improvements to touch gestures (swipe between stacks?).

## Submitting a Pull Request

1.  Create a new branch: `git checkout -b feature/my-new-feature`.
2.  Commit your changes.
3.  Push to your fork.
4.  Open a Pull Request describing your changes and why they are awesome.

Thank you for helping us build the ultimate character sheet! 🎲

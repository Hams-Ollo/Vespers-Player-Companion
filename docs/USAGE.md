# 🎮 User Guide

## Getting Started

1.  **Launch the App**: Open the application in your browser (usually `http://localhost:3000`).
2.  **API Key**:
    *   If running locally with a `.env` file, the key is pre-loaded.
    *   The "Neural Link" status in the **Settings** menu will show Green if connected.

## Character Creation

Click **Forge New Hero** on the main screen to open the creation wizard.

1.  **Identity**: Choose your Name, Race, Class, Background, and Alignment.
2.  **Ability Scores**:
    *   **Standard Array**: Assign 15, 14, 13, 12, 10, 8 to your stats.
    *   **Point Buy**: Spend 27 points to customize your stats.
    *   **Manual**: Input your rolled stats directly.
3.  **Concept**: Enter a visual description. This is used by the AI to generate your portrait.
4.  **Forge**: Review your stats. The AI will take a few seconds to generate your portrait before dropping you into the dashboard.

## The Dashboard

The dashboard is your command center. Click on any **Stack** to open its detailed view.

### ❤️ Vitals
*   **Health**: Click "Damage" or "Heal" to adjust HP.
*   **Resting**: Click the `Moon` icon to take a Short or Long rest.
    *   *Short Rest*: Spend Hit Dice to heal.
    *   *Long Rest*: Reset HP and Spell Slots.
*   **Level Up**: Click the `Arrow Up` icon when you gain a level. The AI will guide you through new features.

### ⚔️ Combat
*   **Attack**: Click the "To Hit" box to roll a d20 + modifier.
*   **Damage**: Click the "Damage" box to roll weapon damage.
*   **Sneak Attack**: If you are a Rogue, expanding the Sneak Attack feature allows you to roll extra damage dice.

### 🧠 Skills
*   **Checks**: Click any Ability or Skill to roll a d20 check.
*   **Saves**: Click the Saving Throw section to roll saves.

### 🎒 Inventory
*   **Equip**: Toggle items between "Backpack" and "Equipped". Equipped items affect your AC and Attack list.
*   **Shop**: Click "Visit Merchant" to buy basic gear or sell loot.
*   **Inspect**: Click any item name to have the AI generate a detailed description and rules for that item.

### 📓 Journal
*   **Record**: Type notes and categorize them (NPC, Location, Note).
*   **Summarize**: Click the "Sparkles" icon to have AI read your notes and generate a narrative summary of your adventure so far.

## AI Features

### 🎨 Portrait Artificer
Click your character portrait in the top left to open the Artificer.
*   **Text Mode**: Describe a new look.
*   **Image Mode**: Upload a sketch or photo and have the AI reimagine it as a fantasy painting.

### 🧙‍♂️ Ask the DM
Click the `Message` icon in the header to chat with an AI Dungeon Master.
*   Ask about rules ("How does Grappling work?").
*   Ask about spells ("What is the range of Fireball?").
*   The DM responds in Markdown with bolded keywords and tables.

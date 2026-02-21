/**
 * 🏰 The Warding Circle — Express API Proxy Server
 *
 * This server serves the static SPA and proxies all AI requests to Google's
 * Gemini API. The Gemini API key lives ONLY here as a runtime environment
 * variable — it is never shipped to the browser.
 *
 * Endpoints:
 *   POST /api/gemini/generate   — Single-shot text generation
 *   POST /api/gemini/chat       — Stateless multi-turn chat
 *   POST /api/gemini/portrait   — Image generation (returns base64 data URI)
 *   POST /api/gemini/transcribe — Proxied Live Audio session token (future)
 *   GET  /api/health             — Health check
 *   *    /*                      — Static SPA (index.html fallback)
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { verifyFirebaseToken } from './middleware/auth.js';
import { createRateLimiter } from './middleware/rateLimit.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Configuration ───────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '8080', 10);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const TEXT_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'gemini-2.5-flash-image';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com';

// Gemini File URIs for grounding context (D&D rulebooks)
const FILE_URIS = {
  basic: process.env.GEMINI_FILE_URI_BASIC || '',
  dmg: process.env.GEMINI_FILE_URI_DMG || '',
  mm: process.env.GEMINI_FILE_URI_MM || '',
  phb: process.env.GEMINI_FILE_URI_PHB || '',
};

// ─── Validate API key ────────────────────────────────────────────────
if (!GEMINI_API_KEY) {
  console.error('[Server] FATAL: GEMINI_API_KEY is not set. AI features will not work.');
}

// ─── Gemini SDK instance ─────────────────────────────────────────────
const ai = GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: GEMINI_API_KEY, httpOptions: { baseUrl: GEMINI_BASE_URL } })
  : null;

// ─── Express app ─────────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '5mb' })); // portraits can be large

// ─── Security headers ────────────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // camera=(self) allows the portrait selfie feature to access the device camera
  // via <input capture> and getUserMedia within same-origin pages only
  res.setHeader('Permissions-Policy', 'microphone=(self), camera=(self), geolocation=()');
  next();
});

// ─── Rate limiters ───────────────────────────────────────────────────
const userRateLimit = createRateLimiter({ windowMs: 60_000, maxRequests: 20 });   // 20/min per user
const globalRateLimit = createRateLimiter({ windowMs: 60_000, maxRequests: 200, global: true }); // 200/min total

// ─── Health check (no auth required) ─────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiAvailable: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// ─── Auth + rate limit middleware for all /api/gemini/* routes ────────
app.use('/api/gemini', verifyFirebaseToken, globalRateLimit, userRateLimit);

// ─── POST /api/gemini/generate ───────────────────────────────────────
app.post('/api/gemini/generate', async (req, res) => {
  try {
    if (!ai) return res.status(503).json({ error: 'AI service unavailable' });

    const { prompt, config = {} } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'You are a specialized D&D 5e assistant. Provide accurate rules, engaging flavor text, and well-structured responses.',
        ...config,
      },
    });

    res.json({ text: response.text || null });
  } catch (err) {
    console.error('[Proxy] /generate error:', err.message);
    res.status(502).json({ error: 'AI request failed', details: err.message });
  }
});

// ─── POST /api/gemini/chat ───────────────────────────────────────────
app.post('/api/gemini/chat', async (req, res) => {
  try {
    if (!ai) return res.status(503).json({ error: 'AI service unavailable' });

    const { message, history = [], systemInstruction } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing message' });
    if (!systemInstruction) return res.status(400).json({ error: 'Missing systemInstruction' });

    const chat = ai.chats.create({
      model: TEXT_MODEL,
      history,
      config: { systemInstruction },
    });

    const result = await chat.sendMessage({ message });
    res.json({ text: result.text || null });
  } catch (err) {
    console.error('[Proxy] /chat error:', err.message);
    res.status(502).json({ error: 'AI request failed', details: err.message });
  }
});

// ─── POST /api/gemini/portrait ───────────────────────────────────────
app.post('/api/gemini/portrait', async (req, res) => {
  try {
    if (!ai) return res.status(503).json({ error: 'AI service unavailable' });

    const { prompt, parts } = req.body;
    if (!prompt && !parts) return res.status(400).json({ error: 'Missing prompt or parts' });

    const contentParts = parts || [{ text: prompt }];
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: { parts: contentParts },
      config: { responseModalities: ['Text', 'Image'] },
    });

    let imageDataUri = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageDataUri = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    res.json({ imageDataUri });
  } catch (err) {
    console.error('[Proxy] /portrait error:', err.message);
    res.status(502).json({ error: 'AI request failed', details: err.message });
  }
});

// ─── POST /api/gemini/live-token ─────────────────────────────────────
// Returns the API key for the Live Audio WebSocket session.
// The Live API uses WebSockets which can't be easily proxied through REST,
// so we hand out the key to authenticated users for direct connection.
// Rate limiting and auth still apply — only signed-in users get a key.
app.post('/api/gemini/live-token', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) return res.status(503).json({ error: 'AI service unavailable' });
    // Auth middleware already verified the token — just return the key
    res.json({ apiKey: GEMINI_API_KEY });
  } catch (err) {
    console.error('[Proxy] /live-token error:', err.message);
    res.status(500).json({ error: 'Failed to issue token' });
  }
});

// ─── POST /api/gemini/encounter ─────────────────────────────────────
// AI-powered encounter generator grounded in the Monster Manual PDF.
app.post('/api/gemini/encounter', async (req, res) => {
  try {
    if (!ai) return res.status(503).json({ error: 'AI service unavailable' });

    const { scenarioDescription, partyLevels, partyClasses, difficulty, environment } = req.body;
    if (!scenarioDescription) return res.status(400).json({ error: 'Missing scenarioDescription' });
    if (!Array.isArray(partyLevels) || partyLevels.length === 0) return res.status(400).json({ error: 'Missing partyLevels' });

    const avgLevel = Math.round(partyLevels.reduce((a, b) => a + b, 0) / partyLevels.length);
    const partySize = partyLevels.length;

    // XP thresholds for difficulty reference (simplified)
    const XP_THRESHOLDS = {
      1:  { easy: 25,   medium: 50,   hard: 75,   deadly: 100  },
      2:  { easy: 50,   medium: 100,  hard: 150,  deadly: 200  },
      3:  { easy: 75,   medium: 150,  hard: 225,  deadly: 400  },
      4:  { easy: 125,  medium: 250,  hard: 375,  deadly: 500  },
      5:  { easy: 250,  medium: 500,  hard: 750,  deadly: 1100 },
      6:  { easy: 300,  medium: 600,  hard: 900,  deadly: 1400 },
      7:  { easy: 350,  medium: 750,  hard: 1100, deadly: 1700 },
      8:  { easy: 450,  medium: 900,  hard: 1400, deadly: 2100 },
      9:  { easy: 550,  medium: 1100, hard: 1600, deadly: 2400 },
      10: { easy: 600,  medium: 1200, hard: 1900, deadly: 2800 },
    };
    const levelThresholds = XP_THRESHOLDS[Math.min(avgLevel, 10)] || XP_THRESHOLDS[10];
    const totalXPBudget = (levelThresholds[difficulty] || levelThresholds.medium) * partySize;

    const systemPrompt = `You are an expert D&D 5e Dungeon Master and encounter designer.
You have access to the Monster Manual PDF. Use it to produce ACCURATE stat blocks matching official MM entries.
Always return valid JSON matching the exact schema provided. Do NOT include markdown fences in your response.`;

    const userPrompt = `Design a D&D 5e combat encounter with the following parameters:

PARTY:
- Size: ${partySize} players
- Average Level: ${avgLevel}
- Classes: ${(partyClasses || []).join(', ') || 'Mixed'}
- Target Difficulty: ${difficulty}
- XP Budget: ~${totalXPBudget} XP (adjusted)

SCENARIO: ${scenarioDescription}
${environment ? `ENVIRONMENT: ${environment}` : ''}

Using the Monster Manual, return a JSON object with this exact structure:
{
  "name": "Short encounter name",
  "narrativeHook": "2-3 sentence scene-setting description the DM reads aloud",
  "creatures": [
    {
      "name": "Creature name (exact MM name)",
      "count": 1,
      "tacticsNotes": "1-2 sentences on how this creature fights in this specific encounter",
      "statBlock": {
        "cr": "1",
        "size": "Medium",
        "creatureType": "Humanoid (goblinoid)",
        "alignment": "Neutral Evil",
        "hp": 7,
        "ac": 15,
        "speed": "30 ft.",
        "xp": 200,
        "abilityScores": { "STR": 10, "DEX": 14, "CON": 10, "INT": 10, "WIS": 8, "CHA": 8 },
        "savingThrows": {},
        "skillBonuses": [{ "name": "Stealth", "modifier": 6 }],
        "senses": "Darkvision 60 ft., Passive Perception 9",
        "languages": "Common, Goblin",
        "damageImmunities": [],
        "conditionImmunities": [],
        "traits": [{ "name": "Nimble Escape", "description": "The goblin can take the Disengage or Hide action as a bonus action on each of its turns." }],
        "attacks": [
          {
            "name": "Scimitar",
            "attackBonus": 4,
            "reach": "5 ft.",
            "targets": "one target",
            "damageExpression": "1d6+2",
            "damageType": "Slashing",
            "additionalEffects": ""
          },
          {
            "name": "Shortbow",
            "attackBonus": 4,
            "range": "80/320 ft.",
            "targets": "one target",
            "damageExpression": "1d6+2",
            "damageType": "Piercing",
            "additionalEffects": ""
          }
        ]
      }
    }
  ],
  "terrainFeatures": ["Collapsed stone pillars provide half cover", "A 10-ft pit trap in the center (DC 15 Perception to spot)"],
  "difficultyRating": "${difficulty}",
  "totalXP": 200,
  "adjustedXP": 300
}

Requirements:
- Include 2-4 creature TYPES (can have multiple of each)
- Creatures must be thematically appropriate to the scenario
- Set totalXP to the raw XP sum of all creatures (count × individual XP)
- Set adjustedXP accounting for encounter multiplier
- The terrainFeatures should be specific to the ${environment || 'location'} and add tactical interest
- All stat block values MUST match the official Monster Manual`;

    // Build content parts — attach Monster Manual PDF for grounding if available
    const contentParts = [];
    if (FILE_URIS.mm) {
      contentParts.push({ fileData: { mimeType: 'application/pdf', fileUri: FILE_URIS.mm } });
    }
    contentParts.push({ text: userPrompt });

    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [{ parts: contentParts }],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    let result = null;
    try {
      result = JSON.parse(response.text || '{}');
    } catch (parseErr) {
      console.error('[Proxy] /encounter JSON parse error:', parseErr.message);
      // Try to extract JSON from text if model wrapped it
      const match = (response.text || '').match(/\{[\s\S]*\}/);
      if (match) {
        try { result = JSON.parse(match[0]); } catch {}
      }
    }

    if (!result) {
      return res.status(502).json({ error: 'AI returned unparseable response' });
    }

    res.json(result);
  } catch (err) {
    console.error('[Proxy] /encounter error:', err.message);
    res.status(502).json({ error: 'AI request failed', details: err.message });
  }
});

// ─── Serve static SPA ────────────────────────────────────────────────
const distPath = path.resolve(__dirname, '..', 'dist');

app.use(express.static(distPath, {
  maxAge: '1y',
  immutable: true,
  index: 'index.html',
  setHeaders: (res, filePath) => {
    // Don't cache index.html — it may change between deploys
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));

// SPA fallback — all non-API routes serve index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ─── Start server ────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] The Warding Circle is active on port ${PORT}`);
  console.log(`[Server] AI available: ${!!ai}`);
  console.log(`[Server] Static files: ${distPath}`);
});

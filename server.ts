import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '2mb' }));

const getAiClient = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const ALISTAIR_SYSTEM_INSTRUCTION = `You are Master Mixologist Alistair, the interactive AI bar mentor, sommelier, and cicerone for Bars R Us (com.barsrus.mixology.pub).
You have 30 years of experience running heritage speakeasies, Michelin-starred beverage programs, and hospitality academies.
Your tone is warm, articulate, authoritative, and encouraging—like a seasoned guild master mentoring an apprentice behind an oak backbar.

Guidelines:
1. Provide exact fluid-ounce (oz) and milliliter (ml) measurements, glassware specifications, ice styles, dilution ratios, and technique notes (Shake, Stir, Build, Muddle, Roll, Layer, Flame).
2. Explain flavor chemistry: acid-to-sugar balance, proof/ABV structure, aromatic bitters, botanical synergies, wine tannins/acidity, and beer IBU/malt profiles.
3. When asked about alcohol service laws or hospitality safety, cite state-specific server regulations, BAC dynamics, and Dram Shop duty-of-care best practices.
4. Keep responses well-structured, concise (around 120-220 words unless asked for a detailed syllabus), and directly actionable in the Virtual Bar.`;

// Streaming SSE Chat Endpoint for Master Mixologist Alistair
app.post('/api/ai/chat', async (req, res) => {
  const { message, history = [], contextInfo = '' } = req.body || {};

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Please provide a message for Master Mixologist Alistair.' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const ai = getAiClient();
    const formattedHistory = Array.isArray(history)
      ? history.slice(-10).map((msg: { sender: string; text: string }) => ({
          role: msg.sender === 'USER' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        }))
      : [];

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      history: formattedHistory,
      config: {
        systemInstruction: contextInfo
          ? `${ALISTAIR_SYSTEM_INSTRUCTION}\n\nCurrent Bar Station Context:\n${contextInfo}`
          : ALISTAIR_SYSTEM_INSTRUCTION,
      },
    });

    const streamResponse = await chat.sendMessageStream({
      message: message.trim(),
    });

    for await (const chunk of streamResponse) {
      const c = chunk as GenerateContentResponse;
      const textChunk = c.text;
      if (textChunk) {
        res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unexpected error communicating with Gemini API';
    console.error('Gemini API /api/ai/chat error:', errMsg);
    res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
    res.end();
  }
});

// Structured Pour Critique Endpoint
app.post('/api/ai/evaluate-pour', async (req, res) => {
  const { glass, technique, iceAdded, garnish, pouredIngredients, targetRecipeName } = req.body || {};

  try {
    const ai = getAiClient();
    const prompt = `Critique this bartender's current build in the Virtual Bar:
- Target Recipe: ${targetRecipeName || 'Original Custom House Creation'}
- Glassware: ${glass}
- Prep Technique Used: ${technique}
- Ice Added: ${iceAdded ? 'Yes' : 'No'}
- Garnish Applied: ${garnish || 'None'}
- Poured Ingredients: ${JSON.stringify(pouredIngredients || [])}

Provide a JSON assessment with palateBalance, technicalCritique, suggestedAdjustment, and alistairVerdict.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: ALISTAIR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            palateBalance: {
              type: Type.STRING,
              description: 'Assessment of sweet, sour, spirituous, and bitter balance.',
            },
            technicalCritique: {
              type: Type.STRING,
              description: 'Evaluation of glassware, dilution, technique, and proportions.',
            },
            suggestedAdjustment: {
              type: Type.STRING,
              description: 'One concrete tweak in oz or dashes to elevate the drink.',
            },
            alistairVerdict: {
              type: Type.STRING,
              description: 'A punchy 1-sentence guild master verdict.',
            },
          },
          required: ['palateBalance', 'technicalCritique', 'suggestedAdjustment', 'alistairVerdict'],
        },
      },
    });

    const jsonText = (response.text ?? '{}').trim();
    res.json(JSON.parse(jsonText));
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Failed to evaluate pour with Gemini API';
    console.error('Gemini API /api/ai/evaluate-pour error:', errMsg);
    res.status(500).json({ error: errMsg });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        ws: process.env.DISABLE_HMR === 'true' ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bars R Us server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

# SoundJury 🎧

> **Your Music. Brutally Reviewed.**

SoundJury is an AI-powered music critique platform for independent artists. Upload your track and lyrics, and receive a professional critique report from 5 simulated listener personas — all powered by your own LLM API keys.

---

## Features

- **Two-Stage AI Pipeline**: Gemini 1.5 Pro for audio analysis → your chosen LLM for the jury report
- **5 Critic Personas**: Casual Listener, Lyrics Purist, Genre Enthusiast, Music Producer, Playlist Curator
- **Multi-Provider**: Gemini, Claude (Sonnet), GPT-4o, or local Ollama
- **Privacy-First**: API keys stored in browser localStorage only — never sent to any server
- **Export to PDF**: Print-optimized report page
- **Dark Studio Aesthetic**: Professional design, not a SaaS template
- **Fully Stateless**: No database, no auth, no server-side storage

---

## Tech Stack

- **Framework**: Next.js (App Router, JavaScript/JSX)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Fonts**: Space Grotesk (headings) + Inter (body)
- **Deploy**: Vercel-ready

---

## Getting Started

```bash
cd soundjury
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Usage

1. **Configure Environment Variables**: Rename `.env.example` to `.env.local` and add your API keys.
2. Drag & drop an **MP3 or WAV** file (max 20MB)
3. Paste your **lyrics** (optional but recommended)
4. Click **Submit to the Jury →**
5. Watch the 4-step progress as the AI processes your track
6. Review your full report and **Export as PDF**

---

## API Keys Required (.env.local)

All keys are managed server-side via environment variables.

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` (required) | Used for Stage 1 audio analysis. [Get it here](https://aistudio.google.com/app/apikey). |
| `REPORT_PROVIDER` | `gemini`, `claude`, `openai`, or `ollama`. (Default: `gemini`) |
| `REPORT_API_KEY` | Your Anthropic or OpenAI key. (Leave blank for Gemini/Ollama). |
| `OLLAMA_MODEL` | E.g. `llama3.1`. (Only used if provider is `ollama`). |

> **Gemini is always required** — it's used for Stage 1 audio analysis.

---

## Project Structure

```
/app
  /page.jsx                    # Landing page
  /analyze/page.jsx            # Pipeline progress page
  /report/page.jsx             # Critique report page
  /api/analyze-audio/route.js  # Stage 1: Gemini audio analysis
  /api/generate-report/route.js # Stage 2: LLM report generation
/components
  /UploadZone.jsx              # Drag & drop audio upload
  /PersonaCard.jsx             # Individual critic card
  /JuryScore.jsx               # Animated circular score display
  /ProgressSteps.jsx           # 4-step pipeline progress UI
  /ReportExport.jsx            # PDF export button
/lib
  /llm-gateway.js              # Unified LLM provider abstraction
```

---

## Deploying to Vercel

```bash
npx vercel deploy
```

Set your `.env.local` variables in the Vercel dashboard.

---

## Security

API keys are configured entirely server-side via `.env.local` and are never exposed to the client. The frontend does not handle API keys.

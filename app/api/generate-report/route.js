import { generateWithLLM, parseJSON } from "@/lib/llm-gateway";

const REPORT_SYSTEM_PROMPT = `You are generating a professional music critique report for an independent artist.
You have audio analysis data and song lyrics. Generate a critique from 5 personas.

Personas:
1. The Casual Listener — catchiness, first impression, replay value
2. The Lyrics Purist — wordplay, storytelling, emotional depth in lyrics
3. The Genre Enthusiast — genre fit, uniqueness within the genre
4. The Music Producer — arrangement, mixing, mastering, production choices
5. The Playlist Curator — commercial viability, mood fit, skip probability

For each persona return:
- score: number out of 10
- loved: string
- bothered: string  
- suggestion: string (one specific actionable improvement)

Also return:
- jury_score: number (average of all 5 scores, one decimal)
- top_fixes: array of 3 strings (most important things to fix before releasing)
- top_strengths: array of 3 strings (strongest elements to double down on)
- overall_verdict: string (2-3 sentence honest summary)

Return ONLY valid JSON. No markdown, no explanation.

JSON structure:
{
  "personas": {
    "casual_listener": { "score": 0, "loved": "", "bothered": "", "suggestion": "" },
    "lyrics_purist": { "score": 0, "loved": "", "bothered": "", "suggestion": "" },
    "genre_enthusiast": { "score": 0, "loved": "", "bothered": "", "suggestion": "" },
    "music_producer": { "score": 0, "loved": "", "bothered": "", "suggestion": "" },
    "playlist_curator": { "score": 0, "loved": "", "bothered": "", "suggestion": "" }
  },
  "jury_score": 0.0,
  "top_fixes": ["", "", ""],
  "top_strengths": ["", "", ""],
  "overall_verdict": ""
}`;

export async function POST(request) {
  // Read all config from server-side env — nothing comes from the client
  const provider = process.env.REPORT_PROVIDER || "gemini";
  const geminiKey = process.env.GEMINI_API_KEY;
  const reportApiKey = process.env.REPORT_API_KEY || "";
  const ollamaModel = process.env.OLLAMA_MODEL || "llama3.1";

  // Determine which key to pass to the gateway
  let apiKey;
  if (provider === "gemini") {
    apiKey = geminiKey;
    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY is not configured in .env.local." },
        { status: 500 }
      );
    }
  } else if (provider === "ollama") {
    apiKey = ollamaModel;
  } else {
    // claude or openai
    apiKey = reportApiKey;
    if (!apiKey) {
      return Response.json(
        { error: `REPORT_API_KEY is not configured in .env.local for provider "${provider}".` },
        { status: 500 }
      );
    }
  }

  try {
    const body = await request.json();
    const { audioAnalysis, lyrics } = body;

    if (!audioAnalysis) {
      return Response.json({ error: "Audio analysis data is required." }, { status: 400 });
    }

    const userPrompt = `Here is the audio analysis data:
${JSON.stringify(audioAnalysis, null, 2)}

${lyrics ? `Here are the song lyrics:\n${lyrics}` : "No lyrics were provided. Focus your lyrics critique on what can be inferred from the track."}

Generate the full jury critique report as instructed.`;

    const rawResponse = await generateWithLLM({
      provider,
      apiKey,
      prompt: userPrompt,
      systemPrompt: REPORT_SYSTEM_PROMPT,
    });

    const report = parseJSON(rawResponse);
    if (!report || !report.personas || !report.jury_score) {
      return Response.json(
        { error: "Failed to parse report from LLM. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ report });
  } catch (err) {
    console.error("[generate-report]", err);
    return Response.json(
      { error: err.message || "Unexpected error during report generation." },
      { status: 500 }
    );
  }
}

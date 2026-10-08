const AUDIO_SYSTEM_PROMPT = `You are an expert audio engineer and music producer with 20 years of experience. 
Analyze this audio track like a professional and return ONLY valid JSON with these fields:
{
  "tempo_feel": "string",
  "mix_balance": "string",
  "production_quality": "string",
  "emotional_tone": "string",
  "genre_fit": "string",
  "standout_elements": "string",
  "weak_points": "string"
}
Return ONLY the JSON object. No explanation, no markdown.`;

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

function parseJSON(raw) {
  if (!raw) return null;
  try {
    let cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    return JSON.parse(cleaned);
  } catch {
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch { /* fall through */ }
    return null;
  }
}

export async function POST(request) {
  // Read key from server-side env — never from client
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured in .env.local." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile) {
      return Response.json({ error: "No audio file provided." }, { status: 400 });
    }
    if (audioFile.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: `File too large (${(audioFile.size / 1024 / 1024).toFixed(1)} MB). Maximum is 20 MB.` },
        { status: 413 }
      );
    }

    // Convert to base64
    const buffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(buffer).toString("base64");
    const mimeType = audioFile.type || "audio/mpeg";

    // Call Gemini multimodal API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiKey}`;
    const body = {
      system_instruction: { parts: [{ text: AUDIO_SYSTEM_PROMPT }] },
      contents: [
        {
          role: "user",
          parts: [
            { inline_data: { mime_type: mimeType, data: base64Audio } },
            { text: "Analyze this audio track and return the JSON as instructed." },
          ],
        },
      ],
      generationConfig: { 
        temperature: 0.3, 
        maxOutputTokens: 2048,
        response_mime_type: "application/json",
      },
    };

    let geminiRes;
    let retries = 3;
    let delay = 1000;
    
    while (retries > 0) {
      geminiRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (geminiRes.ok) break;
      
      if (geminiRes.status === 429 || geminiRes.status >= 500) {
        retries--;
        if (retries === 0) break;
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
      } else {
        break; // Don't retry on 400 Bad Request etc.
      }
    }

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}));
      const msg = errData?.error?.message || `Gemini API error: ${geminiRes.status}. The model might be overloaded.`;
      return Response.json({ error: msg }, { status: 502 });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    console.log("[analyze-audio] Raw Gemini output:", rawText);

    const audioAnalysis = parseJSON(rawText);
    if (!audioAnalysis) {
      return Response.json(
        { error: "Failed to parse audio analysis from Gemini. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ audioAnalysis });
  } catch (err) {
    console.error("[analyze-audio]", err);
    return Response.json(
      { error: err.message || "Unexpected error during audio analysis." },
      { status: 500 }
    );
  }
}

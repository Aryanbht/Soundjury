/**
 * SoundJury LLM Gateway
 * Single abstraction for all LLM providers.
 */

/**
 * parseJSON — strips ```json fences and parses safely.
 * @param {string} raw
 * @returns {object|null}
 */
export function parseJSON(raw) {
  if (!raw) return null;
  try {
    // Strip markdown code fences
    let cleaned = raw.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    return JSON.parse(cleaned);
  } catch {
    // Try to find first { ... } block
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch {
      return null;
    }
    return null;
  }
}

/**
 * generateWithLLM — unified LLM call.
 * @param {{provider: string, apiKey: string, prompt: string, systemPrompt: string}} opts
 * @returns {Promise<string>} raw text response
 */
export async function generateWithLLM({ provider, apiKey, prompt, systemPrompt }) {
  switch (provider) {
    case "gemini":
      return callGemini({ apiKey, prompt, systemPrompt });
    case "claude":
      return callClaude({ apiKey, prompt, systemPrompt });
    case "openai":
      return callOpenAI({ apiKey, prompt, systemPrompt });
    case "ollama":
      return callOllama({ modelName: apiKey || "llama3.1", prompt, systemPrompt });
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

async function callGemini({ apiKey, prompt, systemPrompt }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
  const body = {
    system_instruction: systemPrompt
      ? { parts: [{ text: systemPrompt }] }
      : undefined,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function callClaude({ apiKey, prompt, systemPrompt }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system: systemPrompt || undefined,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Claude API error: ${res.status}`);
  }

  const data = await res.json();
  return data?.content?.[0]?.text ?? "";
}

async function callOpenAI({ apiKey, prompt, systemPrompt }) {
  const messages = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
      max_tokens: 4096,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI API error: ${res.status}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

async function callOllama({ modelName, prompt, systemPrompt }) {
  const messages = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });

  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: modelName || "llama3.1",
      messages,
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status}. Is Ollama running at localhost:11434?`);
  }

  const data = await res.json();
  return data?.message?.content ?? "";
}

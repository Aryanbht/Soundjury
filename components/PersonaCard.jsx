"use client";

const PERSONA_META = {
  casual_listener: {
    name: "The Casual Listener",
    emoji: "🎧",
    role: "Catchiness · Replay Value · First Impression",
    color: "#C084FC",
    bg: "rgba(192,132,252,0.08)",
    border: "rgba(192,132,252,0.2)",
  },
  lyrics_purist: {
    name: "The Lyrics Purist",
    emoji: "📝",
    role: "Wordplay · Storytelling · Emotional Depth",
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.2)",
  },
  genre_enthusiast: {
    name: "The Genre Enthusiast",
    emoji: "🎸",
    role: "Genre Fit · Uniqueness · Scene Authenticity",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  music_producer: {
    name: "The Music Producer",
    emoji: "🎛️",
    role: "Arrangement · Mixing · Mastering",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
  },
  playlist_curator: {
    name: "The Playlist Curator",
    emoji: "📋",
    role: "Commercial Viability · Skip Probability · Mood",
    color: "#F472B6",
    bg: "rgba(244,114,182,0.08)",
    border: "rgba(244,114,182,0.2)",
  },
};

function ScoreBadge({ score, color }) {
  const safeScore = Math.min(10, Math.max(0, score || 0));
  const pct = (safeScore / 10) * 100;
  const size = 56;
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = ((100 - pct) / 100) * circ;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold" style={{ color, fontFamily: "var(--font-space-grotesk)" }}>
          {safeScore}
        </span>
      </div>
    </div>
  );
}

export default function PersonaCard({ personaKey, data }) {
  const meta = PERSONA_META[personaKey] || {
    name: personaKey,
    emoji: "👤",
    role: "",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
    border: "rgba(124,58,237,0.2)",
  };

  if (!data) return null;

  return (
    <div
      className="card-hover rounded-xl p-5 space-y-4"
      style={{
        background: meta.bg,
        border: `1px solid ${meta.border}`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
            style={{ background: `${meta.color}20`, border: `1px solid ${meta.color}30` }}
          >
            {meta.emoji}
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "#E2E8F0", fontFamily: "var(--font-space-grotesk)" }}>
              {meta.name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
              {meta.role}
            </p>
          </div>
        </div>
        <ScoreBadge score={data.score} color={meta.color} />
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: `${meta.color}20` }} />

      {/* Loved */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" style={{ color: "#10B981" }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#10B981" }}>
            Loved
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
          {data.loved || "No feedback provided."}
        </p>
      </div>

      {/* Bothered */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" style={{ color: "#EF4444" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#EF4444" }}>
            Bothered
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
          {data.bothered || "No issues noted."}
        </p>
      </div>

      {/* Suggestion */}
      <div
        className="rounded-lg px-3 py-2.5 space-y-1"
        style={{ background: `${meta.color}10`, border: `1px solid ${meta.color}20` }}
      >
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" style={{ color: meta.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: meta.color }}>
            Suggestion
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "#E2E8F0" }}>
          {data.suggestion || "Keep it up!"}
        </p>
      </div>
    </div>
  );
}

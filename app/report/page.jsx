"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PersonaCard from "@/components/PersonaCard";
import JuryScore from "@/components/JuryScore";
import ReportExport from "@/components/ReportExport";

const PERSONA_ORDER = [
  "casual_listener",
  "lyrics_purist",
  "genre_enthusiast",
  "music_producer",
  "playlist_curator",
];

export default function ReportPage() {
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [audioAnalysis, setAudioAnalysis] = useState(null);
  const [trackName, setTrackName] = useState("Unknown Track");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasReport = sessionStorage.getItem("sj_has_report");
    if (!hasReport) {
      router.replace("/");
      return;
    }

    try {
      const r = JSON.parse(sessionStorage.getItem("sj_report") || "{}");
      const a = JSON.parse(sessionStorage.getItem("sj_audio_analysis") || "{}");
      const name = sessionStorage.getItem("sj_track_name") || "Unknown Track";
      setReport(r);
      setAudioAnalysis(a);
      setTrackName(name);
    } catch {
      router.replace("/");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0A0F" }}>
        <div className="w-8 h-8 rounded-full border-2 border-transparent"
          style={{ borderTopColor: "#7C3AED", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!report) return null;

  const { personas, jury_score, top_fixes, top_strengths, overall_verdict } = report;

  return (
    <div className="min-h-screen" style={{ background: "#0A0A0F" }}>
      {/* Print-only header */}
      <div className="hidden print:block text-center py-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold">SoundJury Report</h1>
        <p className="text-sm text-gray-500 mt-1">{trackName}</p>
      </div>

      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none no-print"
        style={{
          background: "radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Navbar */}
      <nav className="no-print sticky top-0 z-50 flex items-center justify-between px-6 py-4 max-w-5xl mx-auto"
        style={{ borderBottom: "1px solid rgba(124,58,237,0.12)", backdropFilter: "blur(20px)", background: "rgba(10,10,15,0.85)" }}>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm transition-all hover:text-violet-400"
          style={{ color: "#94A3B8" }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          New Review
        </button>

        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7C3AED, #C084FC)" }}
          >
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <span className="font-bold text-sm" style={{ fontFamily: "var(--font-space-grotesk)", color: "#E2E8F0" }}>
            SoundJury
          </span>
        </div>

        <ReportExport trackName={trackName} />
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-10 space-y-14">
        {/* ── Hero Score Section ── */}
        <section className="text-center space-y-8">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "#C084FC" }}
            >
              🎤 &nbsp;{trackName}
            </div>
            <h1
              className="text-3xl md:text-4xl font-black mb-2"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "#E2E8F0" }}
            >
              Your Jury Report
            </h1>
            <p className="text-sm" style={{ color: "#64748B" }}>
              Reviewed by 5 AI-powered listener personas
            </p>
          </div>

          <JuryScore score={jury_score} />

          {/* Verdict */}
          {overall_verdict && (
            <div
              className="max-w-2xl mx-auto px-6 py-5 rounded-2xl text-left"
              style={{
                background: "rgba(124,58,237,0.07)",
                border: "1px solid rgba(124,58,237,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4" style={{ color: "#C084FC" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#C084FC" }}>
                  Overall Verdict
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
                {overall_verdict}
              </p>
            </div>
          )}
        </section>

        {/* ── Audio Analysis Card ── */}
        {audioAnalysis && Object.keys(audioAnalysis).length > 0 && (
          <section>
            <SectionHeader
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              }
              title="Sonic Analysis"
              subtitle="Gemini 1.5 Pro audio breakdown"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {Object.entries(audioAnalysis).map(([key, value]) => {
                const labels = {
                  tempo_feel: { label: "Tempo Feel", icon: "⚡" },
                  mix_balance: { label: "Mix Balance", icon: "⚖️" },
                  production_quality: { label: "Production", icon: "🎛️" },
                  emotional_tone: { label: "Emotional Tone", icon: "💜" },
                  genre_fit: { label: "Genre Fit", icon: "🎸" },
                  standout_elements: { label: "Standout Elements", icon: "⭐" },
                  weak_points: { label: "Weak Points", icon: "⚠️" },
                };
                const meta = labels[key] || { label: key.replace(/_/g, " "), icon: "•" };
                return (
                  <div
                    key={key}
                    className="px-4 py-3 rounded-xl space-y-1"
                    style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.14)" }}
                  >
                    <div className="text-xs font-medium" style={{ color: "#7C3AED" }}>
                      {meta.icon} {meta.label}
                    </div>
                    <p className="text-sm leading-snug" style={{ color: "#CBD5E1" }}>
                      {String(value)}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Jury Scores Summary ── */}
        {personas && (
          <section>
            <SectionHeader
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              title="Score Breakdown"
              subtitle="Individual scores from each critic"
            />
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {PERSONA_ORDER.map((key) => {
                const persona = personas[key];
                if (!persona) return null;
                const names = {
                  casual_listener: "Casual",
                  lyrics_purist: "Lyrics",
                  genre_enthusiast: "Genre",
                  music_producer: "Producer",
                  playlist_curator: "Curator",
                };
                const colors = {
                  casual_listener: "#C084FC",
                  lyrics_purist: "#60A5FA",
                  genre_enthusiast: "#F59E0B",
                  music_producer: "#10B981",
                  playlist_curator: "#F472B6",
                };
                const color = colors[key];
                const score = persona.score ?? 0;
                return (
                  <div
                    key={key}
                    className="flex flex-col items-center py-4 rounded-xl"
                    style={{ background: `${color}10`, border: `1px solid ${color}25` }}
                  >
                    <span className="text-2xl font-black" style={{ color, fontFamily: "var(--font-space-grotesk)" }}>
                      {score}
                    </span>
                    <span className="text-[11px] mt-1" style={{ color: "#94A3B8" }}>
                      {names[key]}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Persona Cards ── */}
        {personas && (
          <section>
            <SectionHeader
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              title="The Jury Speaks"
              subtitle="5 listener perspectives, unfiltered"
            />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {PERSONA_ORDER.map((key) =>
                personas[key] ? (
                  <PersonaCard key={key} personaKey={key} data={personas[key]} />
                ) : null
              )}
            </div>
          </section>
        )}

        {/* ── Before You Release ── */}
        {top_fixes && top_fixes.length > 0 && (
          <section>
            <SectionHeader
              icon={
                <svg className="w-5 h-5" style={{ color: "#EF4444" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
              title="Before You Release"
              subtitle="The jury's top priorities to address"
              accentColor="#EF4444"
            />
            <div className="mt-4 space-y-3">
              {top_fixes.map((fix, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 px-5 py-4 rounded-xl"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{ background: "rgba(239,68,68,0.2)", color: "#EF4444", fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#FCA5A5" }}>
                    {fix}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Your Strengths ── */}
        {top_strengths && top_strengths.length > 0 && (
          <section>
            <SectionHeader
              icon={
                <svg className="w-5 h-5" style={{ color: "#10B981" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              }
              title="Your Strengths"
              subtitle="Double down on these to stand out"
              accentColor="#10B981"
            />
            <div className="mt-4 space-y-3">
              {top_strengths.map((strength, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 px-5 py-4 rounded-xl"
                  style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)" }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{ background: "rgba(16,185,129,0.2)", color: "#10B981", fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#6EE7B7" }}>
                    {strength}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer ── */}
        <footer className="no-print text-center pt-6 pb-4 border-t" style={{ borderColor: "rgba(124,58,237,0.1)" }}>
          <p className="text-xs" style={{ color: "#374151" }}>
            SoundJury · AI-powered music critique · All feedback is AI-generated and for artistic development only.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #9F5FF5)",
              color: "#fff",
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            Review Another Track →
          </button>
        </footer>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle, accentColor = "#7C3AED" }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30`, color: accentColor }}
      >
        {icon}
      </div>
      <div>
        <h2
          className="text-lg font-bold leading-tight"
          style={{ color: "#E2E8F0", fontFamily: "var(--font-space-grotesk)" }}
        >
          {title}
        </h2>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

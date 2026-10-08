"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ProgressSteps from "@/components/ProgressSteps";

export default function AnalyzePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!sessionStorage.getItem("sj_has_state")) {
      router.replace("/");
      return;
    }

    runPipeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runPipeline = async () => {
    try {
      const fileName = sessionStorage.getItem("sj_file_name") || "track";
      const lyrics = sessionStorage.getItem("sj_lyrics") || "";

      // Get the actual File object from IndexedDB
      const audioFile = await getStoredFile();
      if (!audioFile) throw new Error("Audio file not found. Please go back and re-upload.");

      // ── Step 0: Upload ─────────────────────────────────────────────────
      setCurrentStep(0);
      await sleep(700);

      // ── Step 1: Gemini audio analysis ──────────────────────────────────
      setCurrentStep(1);
      const formData = new FormData();
      formData.append("audio", audioFile);
      // No API key sent — server reads from .env.local

      const audioRes = await fetch("/api/analyze-audio", {
        method: "POST",
        body: formData,
      });
      const audioData = await audioRes.json();
      if (!audioRes.ok || audioData.error) throw new Error(audioData.error || "Audio analysis failed.");
      const audioAnalysis = audioData.audioAnalysis;

      // ── Step 2: Assemble jury (visual beat) ────────────────────────────
      setCurrentStep(2);
      await sleep(700);

      // ── Step 3: Generate report ────────────────────────────────────────
      setCurrentStep(3);
      const reportRes = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioAnalysis, lyrics }),
        // No provider/apiKey — server reads from .env.local
      });
      const reportData = await reportRes.json();
      if (!reportRes.ok || reportData.error) throw new Error(reportData.error || "Report generation failed.");

      // ── Store & navigate ───────────────────────────────────────────────
      sessionStorage.setItem("sj_audio_analysis", JSON.stringify(audioAnalysis));
      sessionStorage.setItem("sj_report", JSON.stringify(reportData.report));
      sessionStorage.setItem("sj_track_name", fileName);
      sessionStorage.setItem("sj_has_report", "true");

      await sleep(500);
      router.push("/report");
    } catch (err) {
      console.error("[AnalyzePage]", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative"
      style={{ background: "#0A0A0F" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-12">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7C3AED, #C084FC)" }}
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#E2E8F0" }}
          >
            SoundJury
          </span>
        </div>

        {error ? (
          <div className="space-y-6 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <svg className="w-8 h-8" style={{ color: "#EF4444" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "#E2E8F0", fontFamily: "var(--font-space-grotesk)" }}>
                Something went wrong
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{error}</p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #7C3AED, #9F5FF5)", color: "#fff", fontFamily: "var(--font-space-grotesk)" }}
            >
              ← Back to Home
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2" style={{ color: "#E2E8F0", fontFamily: "var(--font-space-grotesk)" }}>
                The Jury is Deliberating
              </h2>
              <p className="text-sm" style={{ color: "#64748B" }}>
                Sit tight — this usually takes 30–60 seconds
              </p>
            </div>

            <ProgressSteps currentStep={currentStep} />

            {/* Animated waveform */}
            <div className="flex items-end justify-center gap-1 h-8 mt-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    width: "3px",
                    height: "4px",
                    background: `rgba(124,58,237,${0.3 + (i % 3) * 0.2})`,
                    borderRadius: "2px",
                    animation: `wave-bar ${0.6 + (i % 5) * 0.12}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes wave-bar { 0% { height: 4px; } 100% { height: 24px; } }`}</style>
    </div>
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getStoredFile() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") { resolve(null); return; }
    const req = indexedDB.open("soundjury", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("files");
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction("files", "readonly");
      const get = tx.objectStore("files").get("audio");
      get.onsuccess = () => resolve(get.result || null);
      get.onerror = () => resolve(null);
    };
    req.onerror = () => resolve(null);
  });
}

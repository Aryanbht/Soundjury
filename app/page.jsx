"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import UploadZone from "@/components/UploadZone";

export default function HomePage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = useCallback(async () => {
    setError("");

    if (!file) {
      setError("Please upload an audio file first.");
      return;
    }

    // Store state in sessionStorage before navigating
    sessionStorage.setItem("sj_file_name", file.name);
    sessionStorage.setItem("sj_file_size", file.size.toString());
    sessionStorage.setItem("sj_lyrics", lyrics);
    sessionStorage.setItem("sj_has_state", "true");

    // Store the actual File object in IndexedDB so the analyze page can access it
    await storeFileInIndexedDB(file);

    router.push("/analyze");
  }, [file, lyrics, router]);

  return (
    <div className="min-h-screen studio-grid relative overflow-hidden" style={{ background: "#0A0A0F" }}>
      {/* Ambient background glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(192,132,252,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
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
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-8 pb-20">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.25)",
              color: "#C084FC",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            5 AI Critics · Professional Feedback · Instant Report
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-4">
          <h1
            className="font-black leading-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "#E2E8F0" }}
          >
            Your Music.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #7C3AED, #C084FC, #7C3AED)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shine 3s linear infinite",
              }}
            >
               Brutally Reviewed.
            </span>
          </h1>
        </div>

        <p className="text-center text-lg mb-12" style={{ color: "#94A3B8" }}>
          Upload your track and lyrics. A panel of 5 AI-powered listener personas will critique 
          every dimension — from production to lyrics to commercial viability.
        </p>

        {/* Upload Card */}
        <div
          className="rounded-2xl p-6 md:p-8 space-y-6"
          style={{
            background: "#1A1A2E",
            border: "1px solid rgba(124,58,237,0.2)",
            boxShadow: "0 0 60px rgba(124,58,237,0.08)",
          }}
        >
          {/* Upload zone */}
          <div>
            <label
              className="block text-sm font-semibold mb-3"
              style={{ color: "#E2E8F0", fontFamily: "var(--font-space-grotesk)" }}
            >
              Your Track
            </label>
            <UploadZone file={file} onFileChange={setFile} />
          </div>

          {/* Lyrics */}
          <div>
            <label
              htmlFor="lyrics"
              className="block text-sm font-semibold mb-2"
              style={{ color: "#E2E8F0", fontFamily: "var(--font-space-grotesk)" }}
            >
              Song Lyrics{" "}
              <span className="text-xs font-normal" style={{ color: "#64748B" }}>
                (optional but recommended)
              </span>
            </label>
            <textarea
              id="lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder={"Paste your lyrics here...\n\nThe jury's Lyrics Purist will go deeper on wordplay,\nstorytelling, and emotional resonance."}
              rows={7}
              className="w-full px-4 py-3 rounded-xl text-sm leading-relaxed resize-none outline-none
                         transition-all focus:ring-1 focus:ring-violet-500"
              style={{
                background: "rgba(124,58,237,0.06)",
                border: "1px solid rgba(124,58,237,0.18)",
                color: "#E2E8F0",
                fontFamily: "var(--font-inter)",
              }}
            />
            <p className="text-xs mt-1.5 text-right" style={{ color: "#475569" }}>
              {lyrics.length} characters
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-2 px-4 py-3 rounded-xl"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#EF4444" }} fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M18.364 5.636l-12.728 12.728a9 9 0 0112.728-12.728zM5.636 5.636a9 9 0 0112.728 12.728L5.636 5.636z" />
              </svg>
              <p className="text-sm" style={{ color: "#FCA5A5" }}>{error}</p>
            </div>
          )}

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            id="analyze-btn"
            disabled={!file}
            className="w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all
                       duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40
                       disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: file
                ? "linear-gradient(135deg, #7C3AED, #9F5FF5)"
                : "rgba(124,58,237,0.2)",
              color: "#fff",
              fontFamily: "var(--font-space-grotesk)",
              boxShadow: file ? "0 0 30px rgba(124,58,237,0.35)" : "none",
            }}
          >
            {file ? "Submit to the Jury →" : "Upload a track to continue"}
          </button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {[
            { icon: "🎧", text: "Casual Listener" },
            { icon: "📝", text: "Lyrics Purist" },
            { icon: "🎸", text: "Genre Enthusiast" },
            { icon: "🎛️", text: "Music Producer" },
            { icon: "📋", text: "Playlist Curator" },
          ].map((p) => (
            <div
              key={p.text}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.15)",
                color: "#94A3B8",
              }}
            >
              {p.icon} {p.text}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ── IndexedDB helper ────────────────────────────────────────────────────────
function storeFileInIndexedDB(file) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("soundjury", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("files");
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("files", "readwrite");
      const store = tx.objectStore("files");
      store.put(file, "audio");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
}

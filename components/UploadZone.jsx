"use client";

import { useCallback, useRef, useState } from "react";

const MAX_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/wave", "audio/x-wav"];
const ACCEPTED_EXT = [".mp3", ".wav"];

function WaveformIcon() {
  return (
    <div className="flex items-end justify-center gap-[3px] h-8">
      {[3, 7, 12, 18, 14, 8, 16, 10, 5, 14, 18, 9, 6, 12, 7].map((h, i) => (
        <span
          key={i}
          style={{
            height: `${h}px`,
            width: "3px",
            background: "linear-gradient(to top, #7C3AED, #C084FC)",
            borderRadius: "2px",
            animation: `wave-bar ${0.8 + (i % 4) * 0.15}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function UploadZone({ file, onFileChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const validateFile = (f) => {
    if (!f) return "No file selected.";
    const ext = f.name.toLowerCase().slice(f.name.lastIndexOf("."));
    const validType = ACCEPTED_TYPES.includes(f.type) || ACCEPTED_EXT.includes(ext);
    if (!validType) return "Only MP3 and WAV files are supported.";
    if (f.size > MAX_SIZE) return `File too large (${(f.size / 1024 / 1024).toFixed(1)}MB). Maximum is 20MB.`;
    return null;
  };

  const handleFile = useCallback(
    (f) => {
      const err = validateFile(f);
      if (err) {
        setError(err);
        onFileChange(null);
      } else {
        setError("");
        onFileChange(f);
      }
    },
    [onFileChange]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);

  const onInputChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    onFileChange(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const sizeMB = file ? (file.size / 1024 / 1024).toFixed(2) : null;

  return (
    <div className="space-y-2">
      <div
        onClick={() => !file && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer
          flex flex-col items-center justify-center gap-4 min-h-[180px] p-8
          ${isDragging
            ? "border-violet-500 bg-violet-500/10 shadow-[0_0_40px_rgba(124,58,237,0.3)]"
            : file
            ? "border-violet-500/40 bg-violet-500/5 cursor-default"
            : "border-border hover:border-violet-500/50 hover:bg-violet-500/5"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".mp3,.wav,audio/mpeg,audio/wav"
          onChange={onInputChange}
          className="hidden"
          id="audio-upload"
        />

        {file ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <WaveformIcon />
            <div className="text-center">
              <p className="font-semibold text-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {file.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {sizeMB} MB · {file.type || "audio"}
              </p>
            </div>
            <button
              onClick={removeFile}
              className="mt-1 px-4 py-1.5 text-xs rounded-full border border-border hover:border-red-500/50 
                         hover:text-red-400 hover:bg-red-500/10 transition-all text-muted-foreground"
            >
              Remove file
            </button>
          </div>
        ) : (
          <>
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                          ${isDragging ? "bg-violet-500/20" : "bg-card border border-border"}`}
            >
              <svg
                className={`w-7 h-7 transition-colors ${isDragging ? "text-violet-400" : "text-muted-foreground"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <div className="text-center">
              <p
                className="font-semibold text-foreground text-base"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {isDragging ? "Drop it here" : "Drag & drop your track"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or{" "}
                <span className="text-violet-400 underline underline-offset-2">browse files</span>
              </p>
              <p className="text-xs text-muted-foreground/60 mt-2">MP3 or WAV · Max 20MB</p>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <svg className="w-4 h-4 text-red-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            />
          </svg>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

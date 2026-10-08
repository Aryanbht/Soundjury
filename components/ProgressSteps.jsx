"use client";

import { useEffect, useState } from "react";

const STEPS = [
  {
    id: "upload",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    label: "Uploading track...",
    sublabel: "Preparing your audio file",
  },
  {
    id: "audio",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    label: "Analyzing audio with Gemini...",
    sublabel: "Extracting production & sonic characteristics",
  },
  {
    id: "jury",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Assembling your jury...",
    sublabel: "5 critics are forming their opinions",
  },
  {
    id: "report",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    label: "Writing your report...",
    sublabel: "Compiling critique and recommendations",
  },
];

function CheckIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function ProgressSteps({ currentStep }) {
  // currentStep: 0=upload, 1=audio, 2=jury, 3=report
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setDotCount((d) => (d + 1) % 4), 400);
    return () => clearInterval(timer);
  }, []);

  const dots = ".".repeat(dotCount);

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {STEPS.map((step, i) => {
        const isDone = i < currentStep;
        const isActive = i === currentStep;
        const isPending = i > currentStep;

        return (
          <div
            key={step.id}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500`}
            style={{
              background: isActive
                ? "rgba(124,58,237,0.12)"
                : isDone
                ? "rgba(16,185,129,0.06)"
                : "rgba(255,255,255,0.02)",
              border: isActive
                ? "1px solid rgba(124,58,237,0.4)"
                : isDone
                ? "1px solid rgba(16,185,129,0.25)"
                : "1px solid rgba(255,255,255,0.05)",
              opacity: isPending ? 0.4 : 1,
            }}
          >
            {/* Icon circle */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
              style={{
                background: isDone
                  ? "rgba(16,185,129,0.2)"
                  : isActive
                  ? "rgba(124,58,237,0.25)"
                  : "rgba(255,255,255,0.05)",
                border: isDone
                  ? "1px solid rgba(16,185,129,0.4)"
                  : isActive
                  ? "1px solid rgba(124,58,237,0.5)"
                  : "1px solid rgba(255,255,255,0.1)",
                color: isDone ? "#10B981" : isActive ? "#C084FC" : "#64748B",
              }}
            >
              {isDone ? <CheckIcon /> : step.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-semibold"
                style={{
                  color: isDone ? "#10B981" : isActive ? "#E2E8F0" : "#64748B",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                {isActive ? `${step.label.replace("...", "")}${dots}` : step.label.replace("...", isDone ? "." : "...")}
              </div>
              {(isDone || isActive) && (
                <div className="text-xs mt-0.5" style={{ color: isDone ? "#10B981" : "#94A3B8" }}>
                  {isDone ? "Complete" : step.sublabel}
                </div>
              )}
            </div>

            {/* Spinner / check */}
            {isActive && (
              <div
                className="w-5 h-5 rounded-full border-2 border-transparent shrink-0"
                style={{
                  borderTopColor: "#7C3AED",
                  borderRightColor: "#C084FC",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            )}
            {isDone && (
              <div className="w-5 h-5 shrink-0" style={{ color: "#10B981" }}>
                <CheckIcon />
              </div>
            )}
          </div>
        );
      })}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

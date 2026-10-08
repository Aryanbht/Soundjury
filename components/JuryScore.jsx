"use client";

import { useEffect, useRef, useState } from "react";

export default function JuryScore({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  const safeScore = Math.min(10, Math.max(0, parseFloat(score) || 0));
  const percentage = (safeScore / 10) * 100;

  // Intersection observer to trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Animate score number
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 1500;
    const step = (safeScore / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= safeScore) {
        setAnimatedScore(safeScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(parseFloat(start.toFixed(1)));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, safeScore]);

  // SVG circle params
  const size = 220;
  const strokeWidth = 12;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = isVisible ? ((100 - percentage) / 100) * circ : circ;

  // Score color
  const getScoreColor = () => {
    if (safeScore >= 8) return "#10B981";
    if (safeScore >= 6) return "#7C3AED";
    if (safeScore >= 4) return "#F59E0B";
    return "#EF4444";
  };
  const scoreColor = getScoreColor();

  // Score label
  const getScoreLabel = () => {
    if (safeScore >= 9) return "Masterpiece";
    if (safeScore >= 8) return "Excellent";
    if (safeScore >= 7) return "Strong";
    if (safeScore >= 6) return "Solid";
    if (safeScore >= 5) return "Average";
    if (safeScore >= 4) return "Needs Work";
    return "Major Issues";
  };

  return (
    <div ref={ref} className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Glow filter */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />

          {/* Inner decorative ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r - 20}
            fill="none"
            stroke="rgba(124,58,237,0.08)"
            strokeWidth="1"
          />

          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={dash}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            filter="url(#glow)"
            style={{
              transition: isVisible ? "stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
            }}
          />
        </svg>

        {/* Center content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ pointerEvents: "none" }}
        >
          <div className="text-center">
            <div
              className="font-black leading-none"
              style={{
                fontSize: "52px",
                color: scoreColor,
                fontFamily: "var(--font-space-grotesk)",
                textShadow: `0 0 30px ${scoreColor}60`,
              }}
            >
              {animatedScore.toFixed(1)}
            </div>
            <div className="text-sm mt-1" style={{ color: "#94A3B8" }}>
              out of 10
            </div>
          </div>
        </div>
      </div>

      {/* Score label */}
      <div className="text-center space-y-1">
        <div
          className="text-2xl font-bold"
          style={{ color: scoreColor, fontFamily: "var(--font-space-grotesk)" }}
        >
          {getScoreLabel()}
        </div>
        <div className="text-sm" style={{ color: "#64748B" }}>
          Jury Score · Average of 5 critics
        </div>
      </div>
    </div>
  );
}

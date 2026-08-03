"use client";

import { useState } from "react";

const MAX_DAYS = 66;

/** Simplified side-profile brain, facing left. Diagrammatic, not anatomical.
 *  The temporal-lobe bulge and Sylvian fissure are what make it read as a brain. */
const CEREBRUM_PATH =
  "M 52,92 C 52,66 70,44 98,38 C 124,28 158,32 178,48 C 200,60 214,80 210,100 " +
  "C 206,118 192,128 174,130 C 166,136 154,138 146,134 C 140,144 124,150 108,148 " +
  "C 92,146 78,138 72,126 C 66,118 62,110 60,104 C 54,102 52,98 52,92 Z";

const CEREBELLUM_PATH =
  "M 172,132 C 190,126 208,134 208,146 C 208,160 190,166 174,160 C 166,156 164,146 168,138";

export default function HabitTransfer() {
  const [day, setDay] = useState(1);

  // Lally et al. modelled automaticity as an asymptotic exponential rise.
  const automaticity = 1 - Math.exp(-3 * (day / MAX_DAYS));
  const effort = 1 - automaticity;

  return (
    <div className="flex flex-col gap-3">
      <svg
        viewBox="0 0 260 180"
        className="w-full"
        role="img"
        aria-label={`Brain diagram: after ${day} days of the system running the behavior, control has shifted from the prefrontal cortex toward the basal ganglia.`}
      >
        <defs>
          <clipPath id="brainClip">
            <path d={CEREBRUM_PATH} />
          </clipPath>
          <radialGradient id="pfcGlow">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bgGlow">
            <stop offset="0%" stopColor="#5B8CFF" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#5B8CFF" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#5B8CFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Active regions, clipped inside the cerebrum */}
        <g clipPath="url(#brainClip)">
          <ellipse cx="80" cy="74" rx="34" ry="30" fill="url(#pfcGlow)" opacity={effort} />
          <ellipse cx="141" cy="97" rx="30" ry="25" fill="url(#bgGlow)" opacity={automaticity} />
        </g>

        {/* Cerebrum outline */}
        <path d={CEREBRUM_PATH} fill="none" stroke="rgba(255,255,255,0.34)" strokeWidth="1.7" />

        {/* Sylvian fissure — the notch that separates the temporal lobe */}
        <path
          d="M 62,102 C 82,98 106,104 124,116"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
        />

        {/* Cortical folds */}
        <g fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.15" clipPath="url(#brainClip)">
          <path d="M 74,72 C 92,62 108,74 126,66" />
          <path d="M 100,50 C 116,62 136,56 150,68" />
          <path d="M 156,46 C 164,60 182,58 192,72" />
          <path d="M 132,92 C 150,84 166,94 184,88" />
          <path d="M 88,128 C 102,122 114,130 128,126" />
        </g>

        {/* Cerebellum */}
        <path d={CEREBELLUM_PATH} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
        <g fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
          <path d="M 176,136 C 188,134 198,140 200,148" />
          <path d="M 175,146 C 186,144 195,150 197,156" />
        </g>

        {/* Brainstem */}
        <path
          d="M 150,136 C 153,150 149,164 143,174"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1.6"
        />

        {/* Region markers */}
        <circle cx="80" cy="74" r="3" fill="#FFFFFF" opacity={0.22 + effort * 0.78} />
        <circle cx="141" cy="97" r="3" fill="#5B8CFF" opacity={0.22 + automaticity * 0.78} />
      </svg>

      {/* Legend */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2" style={{ opacity: 0.45 + effort * 0.55 }}>
          <span
            className="shrink-0 rounded-full"
            style={{ width: "8px", height: "8px", background: "#FFFFFF" }}
          />
          <span className="lowercase" style={{ fontSize: "0.8125rem" }}>
            <span className="text-text-strong font-semibold">prefrontal cortex</span>
            <span className="text-muted"> — deliberate effort. fatigues.</span>
          </span>
        </div>
        <div className="flex items-center gap-2" style={{ opacity: 0.45 + automaticity * 0.55 }}>
          <span
            className="shrink-0 rounded-full"
            style={{ width: "8px", height: "8px", background: "#5B8CFF" }}
          />
          <span className="lowercase" style={{ fontSize: "0.8125rem" }}>
            <span className="text-text-strong font-semibold">basal ganglia</span>
            <span className="text-muted"> — automatic. doesn&apos;t.</span>
          </span>
        </div>
      </div>

      {/* Control */}
      <label className="flex flex-col gap-1">
        <span className="eyebrow flex justify-between">
          <span>days the system runs it</span>
          <span className="text-text-strong">{day}</span>
        </span>
        <input
          type="range"
          min={1}
          max={MAX_DAYS}
          step={1}
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          className="w-full"
        />
      </label>
    </div>
  );
}

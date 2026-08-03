"use client";

import { useMemo, useState } from "react";

/** Binomial PMF over k = 0..n, computed with the stable recurrence
 *  pmf(k+1) = pmf(k) · (n-k)/(k+1) · p/q  starting from pmf(0) = q^n. */
function binomialPmf(n: number, p: number): number[] {
  const q = 1 - p;
  const pmf = new Array<number>(n + 1);
  pmf[0] = Math.pow(q, n);
  for (let k = 0; k < n; k++) {
    pmf[k + 1] = pmf[k] * ((n - k) / (k + 1)) * (p / q);
  }
  return pmf;
}

const CHART_W = 320;
const CHART_H = 120;

export default function BinomialCalculator() {
  const [trials, setTrials] = useState(10);
  const [winPct, setWinPct] = useState(20);

  const p = winPct / 100;
  const pmf = useMemo(() => binomialPmf(trials, p), [trials, p]);
  const maxPmf = Math.max(...pmf);
  const expected = trials * p;
  const expectedK = Math.min(trials, Math.round(expected));
  const atLeastOne = 1 - Math.pow(1 - p, trials);

  const barGap = trials > 40 ? 0.5 : 1.5;
  const barW = (CHART_W - barGap * trials) / (trials + 1);

  const atLeastOneLabel =
    atLeastOne > 0.999 ? ">99.9%" : `${(atLeastOne * 100).toFixed(1)}%`;

  return (
    <div className="flex flex-col gap-4">
      {/* Distribution chart */}
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full"
        role="img"
        aria-label={`Binomial distribution of wins across ${trials} tries at ${winPct}% each`}
      >
        {pmf.map((v, k) => {
          const h = maxPmf > 0 ? (v / maxPmf) * (CHART_H - 14) : 0;
          const x = k * (barW + barGap);
          const isExpected = k === expectedK;
          return (
            <rect
              key={k}
              x={x}
              y={CHART_H - h}
              width={barW}
              height={h}
              rx={Math.min(2, barW / 3)}
              fill={isExpected ? "#FFFFFF" : "rgba(91,140,255,0.75)"}
            >
              <title>{`${k} wins: ${(v * 100).toFixed(1)}%`}</title>
            </rect>
          );
        })}
      </svg>

      {/* Readouts */}
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        <p className="lowercase" style={{ fontSize: "0.8125rem" }}>
          <span className="font-display font-semibold text-text-strong">
            {expected.toFixed(1)}
          </span>{" "}
          <span className="text-muted">expected wins</span>
        </p>
        <p className="lowercase" style={{ fontSize: "0.8125rem" }}>
          <span className="font-display font-semibold text-text-strong">
            {atLeastOneLabel}
          </span>{" "}
          <span className="text-muted">chance of at least one</span>
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="eyebrow flex justify-between">
            <span>chance of winning each try</span>
            <span className="text-text-strong">{winPct}%</span>
          </span>
          <input
            type="range"
            min={1}
            max={95}
            step={1}
            value={winPct}
            onChange={(e) => setWinPct(Number(e.target.value))}
            className="w-full"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="eyebrow flex justify-between">
            <span>number of tries</span>
            <span className="text-text-strong">{trials}</span>
          </span>
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={trials}
            onChange={(e) => setTrials(Number(e.target.value))}
            className="w-full"
          />
        </label>
      </div>
    </div>
  );
}

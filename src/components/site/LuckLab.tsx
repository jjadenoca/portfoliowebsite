"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================
   the luck field — a rotatable pseudo-3D particle simulation.
   particles = opportunities drifting through your life.
   glowing wells = bets you're making; they pull what's near.
   four levers reshape the field live:
     reach      → how many particles exist (city density)
     allocation → 1–3 wells splitting one shared pull budget
     edge       → how far/hard every well pulls (win % per try)
     tempo      → how fast everything drifts (attempt rate)
   Deliberately NOT a Galton board — no pegs, no bins.
   ============================================================ */

const FIELD_R = 210;
const FOV = 460;
const CAM_Z = 430;
const MAX_POOL = 240;

const WELL_SLOTS = [
  { x: 0, y: 0, z: 0, tint: [91, 140, 255] as const },
  { x: 132, y: -38, z: 58, tint: [155, 123, 255] as const },
  { x: -126, y: 46, z: -52, tint: [79, 214, 196] as const },
];

type Levers = {
  reach: number; // 0..1
  allocation: number; // 0..1
  edge: number; // 0..1
  tempo: number; // 0..1
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** allocation → how many bets and how the shared pull splits across wells */
function allocationSplit(allocation: number): {
  betsCount: number;
  wellStrength: [number, number, number];
} {
  const t1 = 0.34;
  const t2 = 0.67;
  if (allocation <= t1) {
    return { betsCount: 1, wellStrength: [1, 0, 0] };
  }
  if (allocation <= t2) {
    const p = (allocation - t1) / (t2 - t1);
    return {
      betsCount: 2,
      wellStrength: [lerp(1, 0.62, p), lerp(0, 0.95, p), 0],
    };
  }
  const p = (allocation - t2) / (1 - t2);
  return {
    betsCount: 3,
    wellStrength: [lerp(0.62, 0.42, p), lerp(0.95, 0.78, p), lerp(0, 0.9, p)],
  };
}

function particleCountFor(reach: number) {
  return Math.round(lerp(46, 220, reach));
}

function reachLabel(v: number) {
  if (v < 20) return "small town";
  if (v < 45) return "mid-size city";
  if (v < 75) return "dense city";
  return "megacity";
}

function tempoLabel(v: number) {
  if (v < 20) return "slow";
  if (v < 55) return "steady";
  if (v < 80) return "fast";
  return "relentless";
}

/* ---------------- the canvas simulation ---------------- */

function LuckField({
  leversRef,
  onReadout,
}: {
  leversRef: React.RefObject<Levers>;
  onReadout: (r: { caught: number; rate: number }) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onReadoutRef = useRef(onReadout);
  useEffect(() => {
    onReadoutRef.current = onReadout;
  }, [onReadout]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let cx = 0;
    let cy = 0;

    function layout() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H / 2;
    }

    // -------- particle pool --------

    type Particle = {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      cooldown: number;
    };

    function shellPoint() {
      const u = Math.random() * 2 - 1;
      const theta = Math.random() * Math.PI * 2;
      const r = FIELD_R * (0.45 + 0.55 * Math.random());
      const s = Math.sqrt(1 - u * u);
      return { x: r * s * Math.cos(theta), y: r * s * Math.sin(theta), z: r * u };
    }

    function respawn(p: Particle) {
      const s = shellPoint();
      p.x = s.x;
      p.y = s.y;
      p.z = s.z;
      const inward = 0.009;
      p.vx = -s.x * inward;
      p.vy = -s.y * inward;
      p.vz = -s.z * inward;
      p.cooldown = 70 + Math.random() * 50;
    }

    const pool: Particle[] = [];
    for (let i = 0; i < MAX_POOL; i++) {
      const s = shellPoint();
      pool.push({ x: s.x, y: s.y, z: s.z, vx: 0, vy: 0, vz: 0, cooldown: 0 });
    }

    // -------- camera --------

    let yaw = 0.5;
    let pitch = 0.32;
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartYaw = 0;
    let dragStartPitch = 0;
    let lastDragEnd = 0;

    function onDown(e: PointerEvent) {
      dragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartYaw = yaw;
      dragStartPitch = pitch;
      try {
        canvas!.setPointerCapture(e.pointerId);
      } catch {
        /* pointer capture is a nicety, not a requirement */
      }
    }

    function onMove(e: PointerEvent) {
      if (!dragging) return;
      yaw = dragStartYaw + (e.clientX - dragStartX) * 0.0072;
      pitch = Math.max(
        -0.85,
        Math.min(0.85, dragStartPitch + (e.clientY - dragStartY) * 0.0055)
      );
      if (reduced) {
        deriveState();
        render(0);
      }
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      lastDragEnd = performance.now();
    }

    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    // -------- projection --------

    function project(p: { x: number; y: number; z: number }) {
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const y1 = p.y * cosP - z1 * sinP;
      const z2 = p.y * sinP + z1 * cosP;
      const depth = z2 + CAM_Z;
      const scale = FOV / depth;
      return { sx: cx + x1 * scale, sy: cy + y1 * scale, scale, depth };
    }

    // -------- state derived from levers, refreshed every frame --------

    let particleCount = 120;
    let wellStrength: [number, number, number] = [1, 0, 0];
    let pullRadius = 100;
    let captureRadius = 14;
    let pullFactor = 0.02;
    let drift = 0.6;

    function deriveState() {
      const cfg = leversRef.current!;
      particleCount = particleCountFor(cfg.reach);
      wellStrength = allocationSplit(cfg.allocation).wellStrength;
      pullRadius = lerp(58, 152, cfg.edge);
      captureRadius = lerp(9, 20, cfg.edge);
      pullFactor = lerp(0.006, 0.034, cfg.edge);
      drift = lerp(0.22, 1.05, cfg.tempo);
    }

    // -------- capture bookkeeping --------

    let caught = 0;
    const captureTimes: number[] = [];
    const bursts: {
      x: number;
      y: number;
      z: number;
      life: number;
      tint: readonly number[];
    }[] = [];

    function doCapture(p: Particle, wellIdx: number) {
      caught++;
      captureTimes.push(performance.now());
      const w = WELL_SLOTS[wellIdx];
      bursts.push({ x: w.x, y: w.y, z: w.z, life: 1, tint: w.tint });
      respawn(p);
    }

    // -------- physics --------

    function step(dt: number) {
      if (!dragging && performance.now() - lastDragEnd > 900) {
        yaw += 0.00042 * dt;
      }
      if (dt <= 0) return;

      for (let i = 0; i < particleCount; i++) {
        const p = pool[i];
        if (p.cooldown > 0) p.cooldown -= dt;
        p.vx += (Math.random() - 0.5) * 0.008 * drift;
        p.vy += (Math.random() - 0.5) * 0.008 * drift;
        p.vz += (Math.random() - 0.5) * 0.008 * drift;

        for (let w = 0; w < WELL_SLOTS.length; w++) {
          const strength = wellStrength[w];
          if (strength < 0.02) continue;
          const well = WELL_SLOTS[w];
          const dx = well.x - p.x;
          const dy = well.y - p.y;
          const dz = well.z - p.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.0001;
          if (dist < captureRadius && p.cooldown <= 0) {
            doCapture(p, w);
            break;
          }
          if (dist < pullRadius) {
            const force = strength * pullFactor * (1 - dist / pullRadius);
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
            p.vz += (dz / dist) * force;
          }
        }

        p.vx *= 0.982;
        p.vy *= 0.982;
        p.vz *= 0.982;
        p.x += p.vx * dt * drift;
        p.y += p.vy * dt * drift;
        p.z += p.vz * dt * drift;

        const maxR = FIELD_R * 1.55;
        if (p.x * p.x + p.y * p.y + p.z * p.z > maxR * maxR) respawn(p);
      }

      for (let b = bursts.length - 1; b >= 0; b--) {
        bursts[b].life -= 0.035 * dt;
        if (bursts[b].life <= 0) bursts.splice(b, 1);
      }
    }

    // -------- render --------

    function nearestActiveTint(p: Particle) {
      let best = -1;
      let bestDist = Infinity;
      for (let w = 0; w < WELL_SLOTS.length; w++) {
        if (wellStrength[w] < 0.02) continue;
        const well = WELL_SLOTS[w];
        const dx = well.x - p.x;
        const dy = well.y - p.y;
        const dz = well.z - p.z;
        const d = dx * dx + dy * dy + dz * dz;
        if (d < bestDist) {
          bestDist = d;
          best = w;
        }
      }
      if (best === -1) return null;
      const dist = Math.sqrt(bestDist);
      const influence = Math.max(0, Math.min(1, 1 - dist / pullRadius));
      return { tint: WELL_SLOTS[best].tint, influence };
    }

    function render(dt: number) {
      // Translucent fill leaves motion trails; opaque fill for static frames
      if (dt <= 0 || reduced) {
        ctx!.fillStyle = "#0b0c0f";
        ctx!.fillRect(0, 0, W, H);
      } else {
        ctx!.fillStyle = "rgba(11,12,15,0.38)";
        ctx!.fillRect(0, 0, W, H);
      }

      type Projected = ReturnType<typeof project>;
      type Item =
        | { kind: "well"; idx: number; proj: Projected; depth: number }
        | { kind: "p"; p: Particle; proj: Projected; depth: number };

      const items: Item[] = [];
      for (let w = 0; w < WELL_SLOTS.length; w++) {
        if (wellStrength[w] < 0.02) continue;
        const proj = project(WELL_SLOTS[w]);
        items.push({ kind: "well", idx: w, proj, depth: proj.depth });
      }
      for (let i = 0; i < particleCount; i++) {
        const proj = project(pool[i]);
        items.push({ kind: "p", p: pool[i], proj, depth: proj.depth });
      }
      items.sort((a, b) => b.depth - a.depth);

      for (const it of items) {
        if (it.kind === "well") {
          const well = WELL_SLOTS[it.idx];
          const strength = wellStrength[it.idx];
          const r = pullRadius * it.proj.scale * (0.34 + strength * 0.22);
          const [tr, tg, tb] = well.tint;
          const grad = ctx!.createRadialGradient(
            it.proj.sx, it.proj.sy, 0,
            it.proj.sx, it.proj.sy, r
          );
          grad.addColorStop(0, `rgba(${tr},${tg},${tb},${0.3 * strength + 0.08})`);
          grad.addColorStop(0.6, `rgba(${tr},${tg},${tb},${0.1 * strength})`);
          grad.addColorStop(1, `rgba(${tr},${tg},${tb},0)`);
          ctx!.fillStyle = grad;
          ctx!.beginPath();
          ctx!.arc(it.proj.sx, it.proj.sy, r, 0, Math.PI * 2);
          ctx!.fill();

          ctx!.beginPath();
          ctx!.arc(it.proj.sx, it.proj.sy, r * 0.42, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(${tr},${tg},${tb},${0.5 * strength + 0.15})`;
          ctx!.lineWidth = 1.2;
          ctx!.stroke();
        } else {
          const p = it.p;
          const influence = nearestActiveTint(p);
          const baseR = Math.max(0.6, 2.1 * it.proj.scale);
          let alpha = Math.max(0.18, Math.min(0.95, 0.42 * it.proj.scale));
          let rr = 143;
          let gg = 176;
          let bb = 255;
          if (influence) {
            rr = lerp(rr, influence.tint[0], influence.influence * 0.85);
            gg = lerp(gg, influence.tint[1], influence.influence * 0.85);
            bb = lerp(bb, influence.tint[2], influence.influence * 0.85);
            alpha = Math.min(1, alpha + influence.influence * 0.5);
          }
          ctx!.beginPath();
          ctx!.arc(it.proj.sx, it.proj.sy, baseR, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${rr | 0},${gg | 0},${bb | 0},${alpha.toFixed(3)})`;
          ctx!.fill();
        }
      }

      for (const burst of bursts) {
        const proj = project(burst);
        const br = (1 - burst.life) * 30 * proj.scale + 4;
        const [tr, tg, tb] = burst.tint;
        ctx!.beginPath();
        ctx!.arc(proj.sx, proj.sy, br, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${tr},${tg},${tb},${(burst.life * 0.8).toFixed(3)})`;
        ctx!.lineWidth = 1.4;
        ctx!.stroke();
      }
    }

    // -------- readouts (throttled back into React) --------

    let lastReadoutUpdate = 0;
    function updateReadouts(now: number) {
      if (now - lastReadoutUpdate < 150) return;
      lastReadoutUpdate = now;
      while (captureTimes.length && now - captureTimes[0] > 10000) captureTimes.shift();
      onReadoutRef.current({ caught, rate: captureTimes.length });
    }

    // -------- loop --------

    let lastT = 0;
    let raf = 0;
    let running = false;

    function frame(now: number) {
      const dt = lastT ? Math.min(2.2, (now - lastT) / 16.67) : 1;
      lastT = now;
      deriveState();
      step(dt);
      render(dt);
      updateReadouts(now);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      lastT = 0;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    layout();
    deriveState();

    let io: IntersectionObserver | null = null;
    if (reduced) {
      render(0);
    } else {
      io = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { threshold: 0.15 }
      );
      io.observe(canvas);
    }

    const ro = new ResizeObserver(() => {
      layout();
      if (reduced) {
        deriveState();
        render(0);
      }
    });
    ro.observe(canvas);

    return () => {
      stop();
      io?.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [leversRef]);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-[380px] md:h-[460px] cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
      role="img"
      aria-label="A rotatable 3D field of drifting particles being pulled into glowing orbit wells — drag to look around"
    />
  );
}

/* ---------------- lever card ---------------- */

function LeverCard(props: {
  eyebrow: string;
  value: string;
  min: string;
  max: string;
  caption: string;
  sliderValue: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="tile reveal p-5 flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="eyebrow">{props.eyebrow}</span>
        <span
          className="font-display font-semibold text-text-strong lowercase whitespace-nowrap"
          style={{ fontSize: "1.05rem" }}
        >
          {props.value}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={props.sliderValue}
        onChange={(e) => props.onChange(Number(e.target.value))}
        className="w-full"
        aria-label={props.eyebrow}
      />
      <div
        className="flex justify-between font-mono lowercase text-muted"
        style={{ fontSize: "0.6875rem" }}
      >
        <span>{props.min}</span>
        <span>{props.max}</span>
      </div>
      <p className="text-muted lowercase" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
        {props.caption}
      </p>
    </div>
  );
}

/* ---------------- the lab ---------------- */

export default function LuckLab() {
  const [reach, setReach] = useState(72);
  const [allocation, setAllocation] = useState(50);
  const [edge, setEdge] = useState(38);
  const [tempo, setTempo] = useState(70);
  const [readout, setReadout] = useState({ caught: 0, rate: 0 });

  const leversRef = useRef<Levers>({
    reach: 0.72,
    allocation: 0.5,
    edge: 0.38,
    tempo: 0.7,
  });
  useEffect(() => {
    leversRef.current = {
      reach: reach / 100,
      allocation: allocation / 100,
      edge: edge / 100,
      tempo: tempo / 100,
    };
  }, [reach, allocation, edge, tempo]);

  const { betsCount } = allocationSplit(allocation / 100);
  const particles = particleCountFor(reach / 100);
  const betsReadout =
    betsCount === 1
      ? "1 focused bet"
      : betsCount === 3
        ? "3 bets, diversified"
        : "2 bets";

  return (
    <div className="flex flex-col gap-4">
      {/* engine tile */}
      <section className="tile reveal p-5 md:p-7">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-xl md:text-2xl font-semibold">
            what&apos;s in your orbit right now
          </h2>
          <span className="eyebrow">drag the field to look around</span>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border border-border"
          style={{
            background:
              "radial-gradient(60% 70% at 50% 42%, rgba(91,140,255,0.07), transparent 70%), var(--color-bg-alt)",
          }}
        >
          <LuckField leversRef={leversRef} onReadout={setReadout} />

          {/* top-right lever-derived stats */}
          <div className="pointer-events-none absolute right-4 top-3.5 flex gap-6 text-right">
            <div>
              <p className="eyebrow mb-0.5">particles</p>
              <p
                className="font-display font-semibold text-text-strong"
                style={{ fontSize: "1.05rem", fontVariantNumeric: "tabular-nums" }}
              >
                {particles}
              </p>
            </div>
            <div>
              <p className="eyebrow mb-0.5">orbits</p>
              <p
                className="font-display font-semibold text-text-strong"
                style={{ fontSize: "1.05rem", fontVariantNumeric: "tabular-nums" }}
              >
                {betsCount}
              </p>
            </div>
          </div>

          {/* bottom-left caption */}
          <div className="pointer-events-none absolute bottom-4 left-4 max-w-56 sm:max-w-64">
            <p className="eyebrow mb-0.5">reading the field</p>
            <p className="text-muted lowercase" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
              each glowing well is a bet you&apos;re making. particles drifting close
              enough get pulled in and caught.
            </p>
          </div>

          {/* bottom-right drag hint — hidden on mobile where it collides with the caption */}
          <p
            className="pointer-events-none absolute bottom-4 right-4 hidden sm:block font-mono lowercase text-muted"
            style={{ fontSize: "0.6875rem", letterSpacing: "0.02em" }}
          >
            ✦ drag to orbit
          </p>
        </div>

        {/* readout strip */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
          <div className="flex flex-col gap-1 bg-bg-alt px-4 py-3.5">
            <span className="stat-num" style={{ fontVariantNumeric: "tabular-nums" }}>
              {readout.caught}
            </span>
            <span className="eyebrow">opportunities caught</span>
          </div>
          <div className="flex flex-col gap-1 bg-bg-alt px-4 py-3.5">
            <span className="stat-num" style={{ fontVariantNumeric: "tabular-nums" }}>
              {readout.rate}
            </span>
            <span className="eyebrow">catches / 10s</span>
          </div>
          <div className="flex flex-col gap-1 bg-bg-alt px-4 py-3.5">
            <span className="stat-num" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}>
              {betsReadout}
            </span>
            <span className="eyebrow">how spread out you are</span>
          </div>
        </div>
      </section>

      {/* lever cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LeverCard
          eyebrow="reach"
          value={reachLabel(reach)}
          min="small town"
          max="dense city"
          caption="more people in range = more particles drifting through the field = more chances something catches."
          sliderValue={reach}
          onChange={setReach}
        />
        <LeverCard
          eyebrow="allocation"
          value={betsCount === 1 ? "1 focused bet" : `${betsCount} bets`}
          min="repeat one"
          max="diversify"
          caption="one shared pull. focus it into a single strong well, or split it across several — you can't do both at once."
          sliderValue={allocation}
          onChange={setAllocation}
        />
        <LeverCard
          eyebrow="edge"
          value={`${edge}% / try`}
          min="0%"
          max="100%"
          caption="how far each well reaches and how hard it pulls. a small lift here widens every well at once."
          sliderValue={edge}
          onChange={setEdge}
        />
        <LeverCard
          eyebrow="tempo"
          value={tempoLabel(tempo)}
          min="slow"
          max="fast"
          caption="how fast particles drift through. same reach, same edge — just more motion through the field."
          sliderValue={tempo}
          onChange={setTempo}
        />
      </div>
    </div>
  );
}

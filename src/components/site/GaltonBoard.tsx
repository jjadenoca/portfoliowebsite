"use client";

import { useEffect, useRef } from "react";

const ROWS = 9;
const BIN_COUNT = ROWS + 1;
const BALL_INTERVAL_MS = 260;
const MAX_ACTIVE = 22;
const BIN_CAP = 46; // reset once the tallest bin hits this many balls

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  row: number; // next peg row to interact with
  done: boolean;
  bin: number | null;
};

export default function GaltonBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = 1;

    // Board geometry, recomputed on resize
    let pegStartY = 0;
    let pegGapY = 0;
    let pegGapX = 0;
    let binTop = 0;
    let binH = 0;
    let ballR = 3;

    function layout() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      pegStartY = H * 0.1;
      binTop = H * 0.62;
      pegGapY = (binTop - pegStartY) / ROWS;
      pegGapX = (W * 0.82) / BIN_COUNT;
      binH = H - binTop - 6;
      ballR = Math.max(2.5, Math.min(3.5, W / 90));
    }

    function pegPos(row: number, i: number) {
      // row r has r+1 pegs, centered
      const y = pegStartY + row * pegGapY;
      const x = W / 2 + (i - row / 2) * pegGapX;
      return { x, y };
    }

    const bins = new Array<number>(BIN_COUNT).fill(0);
    const balls: Ball[] = [];
    let lastSpawn = 0;
    let raf = 0;
    let running = false;

    function spawn(now: number) {
      if (balls.length >= MAX_ACTIVE) return;
      lastSpawn = now;
      balls.push({
        x: W / 2 + (Math.random() - 0.5) * 2,
        y: pegStartY - pegGapY * 0.8,
        vx: 0,
        vy: 0,
        row: 0,
        done: false,
        bin: null,
      });
    }

    function step(now: number) {
      if (now - lastSpawn > BALL_INTERVAL_MS) spawn(now);

      for (const b of balls) {
        if (b.done) continue;
        b.vy = Math.min(b.vy + 0.14, 2.6);
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.92;

        // Interact with the next peg row when crossing it
        if (b.row < ROWS && b.y >= pegStartY + b.row * pegGapY) {
          const dir = Math.random() < 0.5 ? -1 : 1;
          b.vx += dir * (pegGapX / 2 / (pegGapY / 1.6)) * 1.1;
          b.row += 1;
        }

        // Landed in bins
        if (b.y >= binTop) {
          const idx = Math.max(
            0,
            Math.min(BIN_COUNT - 1, Math.round((b.x - W / 2) / pegGapX + (BIN_COUNT - 1) / 2))
          );
          bins[idx] += 1;
          b.done = true;
          b.bin = idx;
        }
      }

      // Drop finished balls from the active list
      for (let i = balls.length - 1; i >= 0; i--) {
        if (balls[i].done) balls.splice(i, 1);
      }

      // Reset the histogram once it fills up
      if (Math.max(...bins) >= BIN_CAP) bins.fill(0);
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      const accent = "#5B8CFF";
      const pegColor = "rgba(255,255,255,0.28)";
      const binColor = "rgba(91,140,255,0.75)";

      // Pegs
      for (let r = 0; r < ROWS; r++) {
        for (let i = 0; i <= r; i++) {
          const { x, y } = pegPos(r, i);
          ctx!.beginPath();
          ctx!.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx!.fillStyle = pegColor;
          ctx!.fill();
        }
      }

      // Histogram bars
      const maxBin = Math.max(BIN_CAP * 0.55, ...bins);
      const barW = pegGapX * 0.62;
      for (let i = 0; i < BIN_COUNT; i++) {
        const cx = W / 2 + (i - (BIN_COUNT - 1) / 2) * pegGapX;
        const h = (bins[i] / maxBin) * binH;
        ctx!.fillStyle = binColor;
        ctx!.beginPath();
        ctx!.roundRect(cx - barW / 2, H - 6 - h, barW, h, 2);
        ctx!.fill();
      }

      // Falling balls
      ctx!.fillStyle = accent;
      for (const b of balls) {
        ctx!.beginPath();
        ctx!.arc(b.x, b.y, ballR, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function frame(now: number) {
      step(now);
      draw();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      lastSpawn = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    layout();

    if (reduced) {
      // Static bell curve instead of animation
      const weights = [1, 3, 8, 16, 24, 24, 16, 8, 3, 1];
      for (let i = 0; i < BIN_COUNT; i++) bins[i] = weights[i] ?? 1;
      draw();
    } else {
      // Only animate while visible
      const io = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { threshold: 0.15 }
      );
      io.observe(canvas);

      const ro = new ResizeObserver(() => layout());
      ro.observe(canvas);

      return () => {
        stop();
        io.disconnect();
        ro.disconnect();
      };
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      aria-label="Animated Galton board — balls falling through pegs into a bell curve"
      role="img"
    />
  );
}

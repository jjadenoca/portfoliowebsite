"use client";

import { useEffect, useRef } from "react";

const ROWS = 9;
const BIN_COUNT = ROWS + 1;
const BALL_INTERVAL_MS = 240;
const MAX_ACTIVE = 24;

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  row: number; // next peg row to interact with
  bin: number | null; // assigned once past the last peg row
  done: boolean;
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
    let pegEndY = 0; // y of the last peg row
    let floorY = 0; // where the bottom of the lowest ball sits
    let ballR = 3;
    let stackStep = 5; // vertical distance between stacked balls
    let maxStack = 10; // balls per bin before reset

    function layout() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      ballR = Math.max(2.5, Math.min(3.6, W / 85));
      stackStep = ballR * 2 * 0.92;

      pegStartY = H * 0.08;
      pegEndY = H * 0.55;
      pegGapY = (pegEndY - pegStartY) / (ROWS - 1);
      pegGapX = (W * 0.82) / BIN_COUNT;
      floorY = H - 4;

      // How many balls fit in a bin column between the floor and just
      // below the last peg row (with a little headroom)
      maxStack = Math.max(
        6,
        Math.floor((floorY - (pegEndY + pegGapY)) / stackStep)
      );
    }

    function binCenterX(i: number) {
      return W / 2 + (i - (BIN_COUNT - 1) / 2) * pegGapX;
    }

    /** y of the center of the next ball to land in bin i */
    function stackTopY(count: number) {
      return floorY - ballR - count * stackStep;
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
        y: pegStartY - pegGapY,
        vx: 0,
        vy: 0,
        row: 0,
        bin: null,
        done: false,
      });
    }

    function step(now: number) {
      if (now - lastSpawn > BALL_INTERVAL_MS) spawn(now);

      for (const b of balls) {
        if (b.done) continue;
        b.vy = Math.min(b.vy + 0.14, 2.8);
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.9;

        // Bounce left/right off each peg row
        if (b.row < ROWS && b.y >= pegStartY + b.row * pegGapY) {
          const dir = Math.random() < 0.5 ? -1 : 1;
          b.vx += dir * (pegGapX / 2 / (pegGapY / 1.6)) * 1.05;
          b.row += 1;

          // Past the last row — lock in a bin from current position
          if (b.row === ROWS) {
            b.bin = Math.max(
              0,
              Math.min(
                BIN_COUNT - 1,
                Math.round((b.x - W / 2) / pegGapX + (BIN_COUNT - 1) / 2)
              )
            );
          }
        }

        // Below the pegs: steer toward the bin center and land ON the stack
        if (b.bin !== null) {
          const cx = binCenterX(b.bin);
          b.x += (cx - b.x) * 0.18;
          const landY = stackTopY(bins[b.bin]);
          if (b.y >= landY) {
            b.y = landY;
            b.x = cx;
            bins[b.bin] += 1;
            b.done = true;
          }
        }
      }

      // Settled balls are drawn from bins[], not the active list
      for (let i = balls.length - 1; i >= 0; i--) {
        if (balls[i].done) balls.splice(i, 1);
      }

      // Reset once any column fills its bin
      if (Math.max(...bins) >= maxStack) bins.fill(0);
    }

    function drawBall(x: number, y: number, color: string) {
      ctx!.beginPath();
      ctx!.arc(x, y, ballR, 0, Math.PI * 2);
      ctx!.fillStyle = color;
      ctx!.fill();
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      const falling = "#5B8CFF";
      const settled = "rgba(91, 140, 255, 0.72)";
      const pegColor = "rgba(255,255,255,0.28)";

      // Pegs
      for (let r = 0; r < ROWS; r++) {
        const y = pegStartY + r * pegGapY;
        for (let i = 0; i <= r; i++) {
          const x = W / 2 + (i - r / 2) * pegGapX;
          ctx!.beginPath();
          ctx!.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx!.fillStyle = pegColor;
          ctx!.fill();
        }
      }

      // Settled ball stacks
      for (let i = 0; i < BIN_COUNT; i++) {
        const cx = binCenterX(i);
        for (let j = 0; j < bins[i]; j++) {
          drawBall(cx, floorY - ballR - j * stackStep, settled);
        }
      }

      // Falling balls
      for (const b of balls) drawBall(b.x, b.y, falling);
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
      // Static bell-curve of stacked balls instead of animation
      const weights = [0.05, 0.15, 0.4, 0.75, 1, 1, 0.75, 0.4, 0.15, 0.05];
      for (let i = 0; i < BIN_COUNT; i++) {
        bins[i] = Math.max(1, Math.round((weights[i] ?? 0.1) * maxStack));
      }
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
      aria-label="Animated Galton board — balls falling through pegs and stacking into a bell curve"
      role="img"
    />
  );
}

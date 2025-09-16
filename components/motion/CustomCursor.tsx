"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";

type CursorSquaresProps = {
  targetRef: React.RefObject<HTMLElement | null>;
  color?: string; // CSS color value; defaults to a subtle neutral
  maxParticles?: number; // safety cap
  spawnEveryMs?: number; // throttle spawn
  size?: { min: number; max: number }; // px
  opacity?: number; // 0..1 base opacity
  lifespanMs?: number; // particle life
};

type Particle = {
  x: number;
  y: number;
  size: number;
  rot: number;
  born: number;
  life: number;
};

export default function CursorSquares({
  targetRef,
  color = "rgba(255,255,255,0.08)",
  maxParticles = 120,
  spawnEveryMs = 16,
  size = { min: 6, max: 12 },
  opacity = 1,
  lifespanMs = 800,
}: CursorSquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const target = targetRef.current;
    const canvas = canvasRef.current;
    if (!target || !canvas || reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = target.getBoundingClientRect();
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(target);

    const toLocalCoords = (e: MouseEvent) => {
      const rect = target.getBoundingClientRect();
      const x = (e.clientX - rect.left) * dpr;
      const y = (e.clientY - rect.top) * dpr;
      return { x, y };
    };

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastSpawnRef.current < spawnEveryMs) return;
      lastSpawnRef.current = now;

      const { x, y } = toLocalCoords(e);
      const jitter = () => rand(-6, 6) * dpr;
      const s = rand(size.min, size.max) * dpr;
      particlesRef.current.push({
        x: x + jitter(),
        y: y + jitter(),
        size: s,
        rot: rand(-0.6, 0.6),
        born: now,
        life: lifespanMs,
      });

      // safety cap
      if (particlesRef.current.length > maxParticles) {
        particlesRef.current.splice(0, particlesRef.current.length - maxParticles);
      }
    };

    target.addEventListener("mousemove", onMove);

    const loop = () => {
      const now = performance.now();
      // clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        const t = (now - p.born) / p.life;
        if (t >= 1) {
          particlesRef.current.splice(i, 1);
          continue;
        }
        // ease out opacity and slight upward drift
        const a = opacity * (1 - t) * (1 - t);
        const y = p.y - 10 * t; // subtle drift up
        ctx.save();
        ctx.translate(p.x, y);
        ctx.rotate(p.rot);
        ctx.fillStyle = color;
        ctx.globalAlpha = a;
        const s = p.size;
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      target.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [
    targetRef,
    reduced,
    color,
    maxParticles,
    spawnEveryMs,
    size.min,
    size.max,
    opacity,
    lifespanMs,
  ]);

  // Even if reduced motion, keep canvas mounted (empty) to avoid layout shifts
  return (
    <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-0" />
  );
}

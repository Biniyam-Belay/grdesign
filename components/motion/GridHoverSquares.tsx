"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@lib/hooks/useReducedMotion";

type GridHoverSquaresProps = {
  targetRef: React.RefObject<HTMLElement | null>;
  cellSize?: number; // CSS px per cell
  gap?: number; // gap inside each cell (CSS px)
  color?: string; // base fill color
  baseAlpha?: number; // max alpha per cell (0..1)
  fadeMs?: number; // time to fade a cell from 1 -> 0
  composite?: GlobalCompositeOperation; // blending mode
};

export default function GridHoverSquares({
  targetRef,
  cellSize = 36,
  gap = 10,
  color = "#ffffff",
  baseAlpha = 0.12,
  fadeMs = 700,
  composite = "soft-light",
}: GridHoverSquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const colsRef = useRef<number>(0);
  const rowsRef = useRef<number>(0);
  const cellWRef = useRef<number>(0); // device px
  const gapRef = useRef<number>(0); // device px
  const intensitiesRef = useRef<Float32Array>(new Float32Array(0));
  const reduced = useReducedMotion();

  useEffect(() => {
    const target = targetRef.current;
    const canvas = canvasRef.current;
    if (!target || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      const rect = target.getBoundingClientRect();
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));

      // compute grid
      const cellW = Math.max(1, Math.round(cellSize * dpr));
      const gapW = Math.max(0, Math.round(gap * dpr));
      const cols = Math.max(1, Math.floor(canvas.width / cellW));
      const rows = Math.max(1, Math.floor(canvas.height / cellW));
      colsRef.current = cols;
      rowsRef.current = rows;
      cellWRef.current = cellW;
      gapRef.current = gapW;
      intensitiesRef.current = new Float32Array(cols * rows);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(target);

    const toLocal = (e: MouseEvent) => {
      const rect = target.getBoundingClientRect();
      return { x: (e.clientX - rect.left) * dpr, y: (e.clientY - rect.top) * dpr };
    };

    const onMove = (e: MouseEvent) => {
      const { x, y } = toLocal(e);
      const cellW = cellWRef.current;
      const cols = colsRef.current;
      const rows = rowsRef.current;
      const col = Math.max(0, Math.min(cols - 1, Math.floor(x / cellW)));
      const row = Math.max(0, Math.min(rows - 1, Math.floor(y / cellW)));
      const idx = row * cols + col;
      const intensities = intensitiesRef.current;
      if (idx >= 0 && idx < intensities.length) intensities[idx] = 1;

      // subtle neighbor spread for a soft halo
      const setIfHigher = (r: number, c: number, v: number) => {
        if (r < 0 || c < 0 || r >= rows || c >= cols) return;
        const ii = r * cols + c;
        intensities[ii] = Math.max(intensities[ii], v);
      };
      const n1 = 0.35; // orthogonal neighbors
      const n2 = 0.2; // diagonal neighbors
      setIfHigher(row, col - 1, n1);
      setIfHigher(row, col + 1, n1);
      setIfHigher(row - 1, col, n1);
      setIfHigher(row + 1, col, n1);
      setIfHigher(row - 1, col - 1, n2);
      setIfHigher(row - 1, col + 1, n2);
      setIfHigher(row + 1, col - 1, n2);
      setIfHigher(row + 1, col + 1, n2);
    };

    target.addEventListener("mousemove", onMove);

    const loop = (ts: number) => {
      const ctx2 = ctx;
      const intensities = intensitiesRef.current;
      const cols = colsRef.current;
      const rows = rowsRef.current;
      const cellW = cellWRef.current;
      const gapW = gapRef.current;

      const dt = Math.min(64, ts - (lastTsRef.current || ts));
      lastTsRef.current = ts;

      ctx2.clearRect(0, 0, canvas.width, canvas.height);
      ctx2.globalCompositeOperation = composite;
      ctx2.fillStyle = color;

      const decay = fadeMs > 0 ? dt / fadeMs : 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const v = intensities[idx];
          if (v > 0.001) {
            // draw
            ctx2.globalAlpha = Math.max(0, Math.min(1, v * baseAlpha));
            const x = c * cellW + gapW / 2;
            const y = r * cellW + gapW / 2;
            const s = Math.max(1, cellW - gapW);
            ctx2.fillRect(x, y, s, s);
            // decay
            intensities[idx] = Math.max(0, v - decay);
          } else if (v !== 0) {
            intensities[idx] = 0;
          }
        }
      }

      if (!reduced) rafRef.current = requestAnimationFrame(loop);
    };

    if (!reduced) rafRef.current = requestAnimationFrame(loop);

    return () => {
      target.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [targetRef, cellSize, gap, color, baseAlpha, fadeMs, composite, reduced]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0" />;
}

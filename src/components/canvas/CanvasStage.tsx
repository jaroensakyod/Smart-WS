"use client";

import { useFabric } from "@/hooks/useFabric";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useRef } from "react";

type CanvasStageProps = {
  title?: string;
};

export function CanvasStage({ title = "Canvas Stage" }: CanvasStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeTool = useCanvasStore((state) => state.activeTool);
  const activeColor = useCanvasStore((state) => state.activeColor);
  const setColor = useCanvasStore((state) => state.setColor);
  const { isReady, objectCount, addRect, addText, clearCanvas } = useFabric({
    canvasRef,
    activeColor,
  });

  return (
    <section aria-label={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="text-sm text-zinc-200">{title}</div>
      <div className="mt-2 text-xs text-zinc-300" aria-label="active-tool-label">
        Active tool: {activeTool}
      </div>
      <div className="mt-1 text-xs text-zinc-300" aria-label="active-color-label">
        Active color: {activeColor}
      </div>
      <div className="mt-1 text-xs text-zinc-300" aria-label="canvas-ready-label">
        Canvas ready: {isReady ? "yes" : "no"}
      </div>
      <div className="mt-1 text-xs text-zinc-300" aria-label="object-count-label">
        Objects: {objectCount}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="canvas-actions">
        <button
          type="button"
          onClick={addRect}
          className="rounded-lg border border-white/15 bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
        >
          Add Rect
        </button>
        <button
          type="button"
          onClick={addText}
          className="rounded-lg border border-white/15 bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
        >
          Add Text
        </button>
        <button
          type="button"
          onClick={clearCanvas}
          className="rounded-lg border border-white/15 bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
        >
          Clear
        </button>
        <label className="ml-1 flex items-center gap-2 text-xs text-zinc-300">
          Color
          <input
            aria-label="color-picker"
            type="color"
            value={activeColor}
            onChange={(event) => setColor(event.currentTarget.value)}
            className="h-7 w-9 rounded border border-white/20 bg-transparent"
          />
        </label>
      </div>

      <canvas ref={canvasRef} aria-label="worksheet-canvas" className="mt-3 h-80 w-full rounded-lg bg-white" />
    </section>
  );
}

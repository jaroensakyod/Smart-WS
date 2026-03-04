"use client";

import { CanvasStage } from "@/components/canvas/CanvasStage";
import { useCanvasStore, type ToolType } from "@/store/useCanvasStore";

const TOOLS: ToolType[] = ["select", "rect", "circle", "text"];

export default function Home() {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const setTool = useCanvasStore((state) => state.setTool);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-10 text-zinc-100">
      <main className="w-full max-w-5xl rounded-2xl border border-white/10 bg-white/5 px-8 py-6 backdrop-blur">
        <h1 className="text-2xl font-semibold">Smart-WS Next.js Foundation</h1>
        <p className="mt-2 text-sm text-zinc-300">Phase 1 Step 3: Zustand canvas state is active.</p>

        <section className="mt-4" aria-label="tool-selector">
          <div className="mb-2 text-xs uppercase tracking-wide text-zinc-400">Tools</div>
          <div className="flex flex-wrap gap-2">
            {TOOLS.map((tool) => {
              const isActive = activeTool === tool;
              return (
                <button
                  key={tool}
                  type="button"
                  onClick={() => setTool(tool)}
                  className={[
                    "rounded-xl border px-3 py-1 text-sm transition",
                    isActive ? "border-white/40 bg-white/15" : "border-white/10 bg-white/5 hover:bg-white/10",
                  ].join(" ")}
                  aria-pressed={isActive}
                >
                  {tool}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-5">
          <CanvasStage title="Smart WS Canvas" />
        </div>
      </main>
    </div>
  );
}

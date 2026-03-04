import { useCanvasStore } from "@/store/useCanvasStore";

type CanvasStageProps = {
  title?: string;
};

export function CanvasStage({ title = "Canvas Stage" }: CanvasStageProps) {
  const activeTool = useCanvasStore((state) => state.activeTool);
  const activeColor = useCanvasStore((state) => state.activeColor);

  return (
    <section aria-label={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="text-sm text-zinc-200">{title}</div>
      <div className="mt-2 text-xs text-zinc-300" aria-label="active-tool-label">
        Active tool: {activeTool}
      </div>
      <div className="mt-1 text-xs text-zinc-300" aria-label="active-color-label">
        Active color: {activeColor}
      </div>
      <canvas aria-label="worksheet-canvas" className="mt-3 h-80 w-full rounded-lg bg-white" />
    </section>
  );
}

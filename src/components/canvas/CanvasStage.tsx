type CanvasStageProps = {
  title?: string;
};

export function CanvasStage({ title = "Canvas Stage" }: CanvasStageProps) {
  return (
    <section aria-label={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="text-sm text-zinc-200">{title}</div>
      <canvas aria-label="worksheet-canvas" className="mt-3 h-80 w-full rounded-lg bg-white" />
    </section>
  );
}

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { useFabric } from "@/hooks/useFabric";

const setDimensionsSpy = vi.fn();
const disposeSpy = vi.fn();

vi.mock("fabric", () => {
  class CanvasMock {
    private objects: unknown[] = [];
    public backgroundColor = "#ffffff";

    setDimensions = setDimensionsSpy;
    requestRenderAll = vi.fn();
    setActiveObject = vi.fn();
    getObjects = () => this.objects;
    on = vi.fn();
    off = vi.fn();

    add(object: unknown) {
      this.objects.push(object);
    }

    clear() {
      this.objects = [];
    }

    dispose = disposeSpy;
  }

  class RectMock {
    constructor(public config: Record<string, unknown>) {}
  }

  class TextboxMock {
    constructor(public text: string, public config: Record<string, unknown>) {}
  }

  return {
    Canvas: CanvasMock,
    Rect: RectMock,
    Textbox: TextboxMock,
  };
});

function HookHarness() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isReady, objectCount, addRect, addText, clearCanvas } = useFabric({
    canvasRef,
    activeColor: "#ff0000",
    resizeDebounceMs: 0,
  });

  return (
    <div>
      <div aria-label="ready">{isReady ? "yes" : "no"}</div>
      <div aria-label="count">{objectCount}</div>
      <button type="button" onClick={addRect}>
        add-rect
      </button>
      <button type="button" onClick={addText}>
        add-text
      </button>
      <button type="button" onClick={clearCanvas}>
        clear
      </button>
      <canvas ref={canvasRef} aria-label="fabric-canvas" />
    </div>
  );
}

describe("useFabric", () => {
  it("initializes, handles actions, resize, and cleanup", async () => {
    const { unmount } = render(<HookHarness />);

    await waitFor(() => expect(screen.getByLabelText("ready")).toHaveTextContent("yes"));
    await waitFor(() => expect(setDimensionsSpy).toHaveBeenCalled());

    fireEvent.click(screen.getByRole("button", { name: "add-rect" }));
    expect(screen.getByLabelText("count")).toHaveTextContent("1");

    fireEvent.click(screen.getByRole("button", { name: "add-text" }));
    expect(screen.getByLabelText("count")).toHaveTextContent("2");

    fireEvent.click(screen.getByRole("button", { name: "clear" }));
    expect(screen.getByLabelText("count")).toHaveTextContent("0");

    fireEvent(window, new Event("resize"));
    await waitFor(() => expect(setDimensionsSpy).toHaveBeenCalledTimes(2));

    unmount();
    expect(disposeSpy).toHaveBeenCalledTimes(1);
  });
});

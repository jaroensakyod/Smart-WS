import { beforeEach, describe, expect, it } from "vitest";
import { canvasStoreDefaults, useCanvasStore } from "@/store/useCanvasStore";

describe("useCanvasStore", () => {
  beforeEach(() => {
    useCanvasStore.setState({
      activeTool: canvasStoreDefaults.activeTool,
      activeColor: canvasStoreDefaults.activeColor,
    });
  });

  it("starts with expected defaults", () => {
    const state = useCanvasStore.getState();

    expect(state.activeTool).toBe("select");
    expect(state.activeColor).toBe("#000000");
  });

  it("updates activeTool via setTool", () => {
    useCanvasStore.getState().setTool("rect");

    expect(useCanvasStore.getState().activeTool).toBe("rect");
  });
});

import { create } from "zustand";

export type ToolType = "select" | "rect" | "circle" | "text";

type CanvasStoreState = {
  activeTool: ToolType;
  activeColor: string;
  setTool: (tool: ToolType) => void;
  setColor: (color: string) => void;
};

const DEFAULT_TOOL: ToolType = "select";
const DEFAULT_COLOR = "#000000";

export const useCanvasStore = create<CanvasStoreState>((set) => ({
  activeTool: DEFAULT_TOOL,
  activeColor: DEFAULT_COLOR,
  setTool: (tool) => set({ activeTool: tool }),
  setColor: (color) => set({ activeColor: color }),
}));

export const canvasStoreDefaults = {
  activeTool: DEFAULT_TOOL,
  activeColor: DEFAULT_COLOR,
};

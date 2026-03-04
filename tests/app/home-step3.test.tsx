import { fireEvent, render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { canvasStoreDefaults, useCanvasStore } from "@/store/useCanvasStore";

describe("Home Step3 integration", () => {
  beforeEach(() => {
    useCanvasStore.setState({
      activeTool: canvasStoreDefaults.activeTool,
      activeColor: canvasStoreDefaults.activeColor,
    });
  });

  it("changes tool state when user clicks toolbar button", () => {
    render(<Home />);

    expect(screen.getByLabelText("active-tool-label")).toHaveTextContent("select");
    expect(screen.getByLabelText("canvas-ready-label")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "rect" }));

    expect(screen.getByLabelText("active-tool-label")).toHaveTextContent("rect");
    expect(useCanvasStore.getState().activeTool).toBe("rect");

    fireEvent.change(screen.getByLabelText("color-picker"), { target: { value: "#ff0000" } });
    expect(screen.getByLabelText("active-color-label")).toHaveTextContent("#ff0000");
  });
});

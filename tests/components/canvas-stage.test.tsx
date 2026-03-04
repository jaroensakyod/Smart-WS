import { render, screen } from "@testing-library/react";
import { CanvasStage } from "@/components/canvas/CanvasStage";

describe("CanvasStage", () => {
  it("renders canvas container and canvas element", () => {
    render(<CanvasStage title="Smart WS Canvas" />);

    expect(screen.getByLabelText("Smart WS Canvas")).toBeInTheDocument();
    expect(screen.getByLabelText("worksheet-canvas")).toBeInTheDocument();
  });
});

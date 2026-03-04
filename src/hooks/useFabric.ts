"use client";

import { Canvas, Rect, Textbox } from "fabric";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

type UseFabricOptions = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  activeColor: string;
  baseWidth?: number;
  baseHeight?: number;
  resizeDebounceMs?: number;
};

type UseFabricResult = {
  isReady: boolean;
  objectCount: number;
  addRect: () => void;
  addText: () => void;
  clearCanvas: () => void;
};

const DEFAULT_WIDTH = 960;
const DEFAULT_HEIGHT = 640;
const DEFAULT_RESIZE_DEBOUNCE_MS = 120;

export function useFabric({
  canvasRef,
  activeColor,
  baseWidth = DEFAULT_WIDTH,
  baseHeight = DEFAULT_HEIGHT,
  resizeDebounceMs = DEFAULT_RESIZE_DEBOUNCE_MS,
}: UseFabricOptions): UseFabricResult {
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [objectCount, setObjectCount] = useState(0);

  const syncObjectCount = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    setObjectCount(canvas ? canvas.getObjects().length : 0);
  }, []);

  const addRect = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const rect = new Rect({
      left: 90,
      top: 90,
      width: 180,
      height: 120,
      fill: "rgba(255,255,255,0)",
      stroke: activeColor,
      strokeWidth: 2,
      rx: 8,
      ry: 8,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.requestRenderAll();
    syncObjectCount();
  }, [activeColor, syncObjectCount]);

  const addText = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const textbox = new Textbox("Text", {
      left: 120,
      top: 120,
      width: 240,
      fill: activeColor,
      fontSize: 28,
      fontFamily: "Inter, sans-serif",
    });

    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.requestRenderAll();
    syncObjectCount();
  }, [activeColor, syncObjectCount]);

  const clearCanvas = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    canvas.requestRenderAll();
    syncObjectCount();
  }, [syncObjectCount]);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element || fabricCanvasRef.current) return;

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    let isDisposed = false;

    try {
      const canvas = new Canvas(element, {
        width: baseWidth,
        height: baseHeight,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
        selection: true,
      });

      fabricCanvasRef.current = canvas;
      setTimeout(() => setIsReady(true), 0);

      const applyResize = () => {
        const parentWidth = element.parentElement?.clientWidth ?? baseWidth;
        const nextWidth = Math.max(320, parentWidth);
        const nextHeight = Math.max(240, Math.round((nextWidth / baseWidth) * baseHeight));
        canvas.setDimensions({ width: nextWidth, height: nextHeight });
        canvas.requestRenderAll();
      };

      const handleResize = () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(applyResize, resizeDebounceMs);
      };

      applyResize();
      window.addEventListener("resize", handleResize);

      return () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        window.removeEventListener("resize", handleResize);
        if (!isDisposed) {
          canvas.dispose();
          isDisposed = true;
        }
        fabricCanvasRef.current = null;
      };
    } catch {
      fabricCanvasRef.current = null;
      return;
    }
  }, [baseHeight, baseWidth, canvasRef, resizeDebounceMs, syncObjectCount]);

  return {
    isReady,
    objectCount,
    addRect,
    addText,
    clearCanvas,
  };
}

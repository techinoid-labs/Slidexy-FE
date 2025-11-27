
import type Konva from "konva";

// Return the canvas element for the stage so callers can create ImageBitmap
export const getStageCanvas = (
  stageRef: React.RefObject<Konva.Stage | null>
): HTMLCanvasElement | null => {
  const stage = stageRef.current;

  if (!stage) {
    console.warn("Stage ref is null");
    return null;
  }

  try {
    const canvas = stage.toCanvas();
    return canvas;
  } catch (err) {
    console.error("Failed to get stage canvas:", err);
    return null;
  }
};


import type Konva from "konva";

export const takeStageSnapshot = (
  stageRef: React.RefObject<Konva.Stage | null>
): string | null => {
  const stage = stageRef.current;

  if (!stage) {
    console.warn("Stage ref is null");
    return null;
  }

  try {
    const dataURL = stage.toDataURL({
      pixelRatio: window.devicePixelRatio || 2,
      mimeType: "image/png",
      quality: 1,
    });
    return dataURL;
  } catch (err) {
    console.error("Failed to take snapshot:", err);
    return null;
  }
};

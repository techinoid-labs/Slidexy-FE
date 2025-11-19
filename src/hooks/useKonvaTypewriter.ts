import { useEffect, useRef, RefObject } from 'react';
import Konva from 'konva';

interface UseKonvaTypewriterOptions {
  duration?: number; // milliseconds for fade in
  characterDelay?: number; // milliseconds between characters
  holdDuration?: number; // how long to show fully
  fadeOutDuration?: number; // milliseconds for fade out
  loopAnimation?: boolean; // whether to repeat
  startDelay?: number; // delay before animation starts
}

/**
 * Hook to apply typewriter animation to Konva Text elements
 * Characters fade in one by one, hold, then fade out
 */
export const useKonvaTypewriter = (
  textRefOrLayer: RefObject<Konva.Text | Konva.Layer> | Konva.Layer,
  options: UseKonvaTypewriterOptions = {}
) => {
  const {
    duration = 300,
    characterDelay = 100,
    holdDuration = 1500,
    fadeOutDuration = 300,
    loopAnimation = false,
    startDelay = 0,
  } = options;

  const charOpacitiesRef = useRef<number[]>([]);
  const animationRef = useRef<Konva.Animation | null>(null);
  const textNodeRef = useRef<Konva.Text | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Resolve text node and layer
    let textNode: Konva.Text | null = null;
    let layer: Konva.Layer | null = null;

    if (textRefOrLayer instanceof Konva.Layer) {
      layer = textRefOrLayer;
      // Find the first Text node in the layer
      const nodes = layer.getChildren();
      textNode = nodes.find((n) => n instanceof Konva.Text) as Konva.Text;
    } else if (textRefOrLayer.current instanceof Konva.Text) {
      textNode = textRefOrLayer.current;
      layer = textNode.getLayer();
    } else if (textRefOrLayer.current instanceof Konva.Layer) {
      layer = textRefOrLayer.current;
      const nodes = layer.getChildren();
      textNode = nodes.find((n) => n instanceof Konva.Text) as Konva.Text;
    }

    if (!textNode || !layer) {
      console.warn('[useKonvaTypewriter] Could not find Text node or Layer');
      return;
    }

    textNodeRef.current = textNode;
    layerRef.current = layer;

    const text = textNode.text();
    const textLength = text.length;

    // Initialize opacity array
    charOpacitiesRef.current = new Array(textLength).fill(0);

    const cycleDuration = duration + characterDelay * (textLength - 1) + holdDuration + fadeOutDuration;

    const animation = new Konva.Animation((frame: any) => {
      if (!hasStartedRef.current && frame.time < startDelay) {
        return; // Wait for startDelay
      }

      hasStartedRef.current = true;

      let time = frame.time - startDelay;

      // Loop the animation if enabled
      if (loopAnimation) {
        time = time % cycleDuration;
      } else {
        // Clamp time to prevent going past the animation
        time = Math.min(time, cycleDuration);
      }

      for (let i = 0; i < textLength; i++) {
        const charDelay = i * characterDelay;

        if (time < duration + characterDelay * textLength) {
          // Fade in phase with staggered character delays
          const charStartTime = charDelay;
          const charFadeTime = Math.max(0, time - charStartTime);
          charOpacitiesRef.current[i] = Math.min(1, charFadeTime / duration);
        } else if (time < duration + characterDelay * textLength + holdDuration) {
          // Hold phase - all visible
          charOpacitiesRef.current[i] = 1;
        } else {
          // Fade out phase - all characters fade out together
          const fadeOutStart = duration + characterDelay * textLength + holdDuration;
          const fadeOutTime = Math.max(0, time - fadeOutStart);
          charOpacitiesRef.current[i] = Math.max(0, 1 - fadeOutTime / fadeOutDuration);
        }
      }

      // Trigger redraw
      layer?.batchDraw?.();
    }, layer);

    animation.start();
    animationRef.current = animation;

    return () => {
      animation.stop();
      animationRef.current = null;
    };
  }, [duration, characterDelay, holdDuration, fadeOutDuration, loopAnimation, startDelay]);

  /**
   * Apply the character opacity to rendering context.
   * Call this in charRenderFunc prop of Konva Text
   */
  const applyCharOpacity = (context: CanvasRenderingContext2D, index: number) => {
    const opacity = charOpacitiesRef.current[index] ?? 0;
    context.globalAlpha = opacity;
  };

  return {
    applyCharOpacity,
    stop: () => animationRef.current?.stop(),
    start: () => animationRef.current?.start(),
  };
};

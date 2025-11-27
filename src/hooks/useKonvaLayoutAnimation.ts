import { useEffect, useRef } from 'react';
import Konva from 'konva';

interface LayoutAnimationOptions {
  type?: 'slideIn' | 'fadeIn' | 'scaleUp' | 'rotate' | 'bounce';
  duration?: number; // milliseconds
  delay?: number; // milliseconds before animation starts
  easing?: (t: number) => number; // easing function
}

/**
 * Easing functions for smooth animations
 */
const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * (t - 2)) * (2 * (t - 2)) + 1,
};

/**
 * Hook to apply entrance animations to Konva nodes
 * Creates smooth animations for nodes entering the stage
 */
export const useKonvaLayoutAnimation = (
  nodeRef: React.RefObject<Konva.Node> | Konva.Node,
  options: LayoutAnimationOptions = {}
) => {
  const {
    type = 'slideIn',
    duration = 600,
    delay = 0,
    easing: customEasing,
  } = options;

  const easing = customEasing || easings.easeOutCubic;
  const animationRef = useRef<Konva.Animation | null>(null);
  const startStateRef = useRef<any>({});
  const nodeRefCurrent = useRef<Konva.Node | null>(null);

  useEffect(() => {
    let node: Konva.Node | null = null;

    if (nodeRef instanceof Konva.Node) {
      node = nodeRef;
    } else if ('current' in nodeRef && nodeRef.current instanceof Konva.Node) {
      node = nodeRef.current;
    }

    if (!node) {
      console.warn('[useKonvaLayoutAnimation] Could not find Konva node');
      return;
    }

    nodeRefCurrent.current = node;
    const layer = node.getLayer();

    if (!layer) {
      console.warn('[useKonvaLayoutAnimation] Node has no layer');
      return;
    }

    // Store initial state
    const initialX = node.x();
    const initialY = node.y();
    const initialOpacity = node.opacity();
    const initialScaleX = node.scaleX?.() ?? 1;
    const initialScaleY = node.scaleY?.() ?? 1;
    const initialRotation = node.rotation?.() ?? 0;

    // Set animation start values based on animation type
    switch (type) {
      case 'slideIn':
        node.x(initialX - 100); // Start 100px to the left
        node.opacity(0);
        startStateRef.current = { x: initialX - 100, opacity: 0, targetX: initialX };
        break;

      case 'fadeIn':
        node.opacity(0);
        startStateRef.current = { opacity: 0 };
        break;

      case 'scaleUp':
        node.scaleX(0.5);
        node.scaleY(0.5);
        node.opacity(0);
        startStateRef.current = { scaleX: 0.5, scaleY: 0.5, opacity: 0 };
        break;

      case 'rotate':
        node.rotation(-90);
        node.opacity(0);
        startStateRef.current = { rotation: -90, opacity: 0 };
        break;

      case 'bounce':
        node.y(initialY - 50);
        node.opacity(0);
        startStateRef.current = { y: initialY - 50, opacity: 0, targetY: initialY };
        break;

      default:
        break;
    }

    layer.batchDraw();

    let hasStarted = false;

    const animation = new Konva.Animation((frame: any) => {
      // Wait for delay before starting animation
      if (!hasStarted && frame.time < delay) {
        return;
      }

      if (!hasStarted) {
        hasStarted = true;
      }

      const elapsedTime = Math.max(0, frame.time - delay);
      const progress = Math.min(1, elapsedTime / duration);
      const easeProgress = easing(progress);

      if (type === 'slideIn') {
        const startX = startStateRef.current.x;
        const targetX = startStateRef.current.targetX;
        node.x(startX + (targetX - startX) * easeProgress);
        node.opacity(easeProgress);
      } else if (type === 'fadeIn') {
        node.opacity(easeProgress);
      } else if (type === 'scaleUp') {
        const scale = 0.5 + (1 - 0.5) * easeProgress;
        node.scaleX(scale);
        node.scaleY(scale);
        node.opacity(easeProgress);
      } else if (type === 'rotate') {
        node.rotation(-90 + 90 * easeProgress);
        node.opacity(easeProgress);
      } else if (type === 'bounce') {
        const startY = startStateRef.current.y;
        const targetY = startStateRef.current.targetY;
        // Bounce easing: overshoot and come back
        const bounceProgress = easeProgress > 0.7
          ? 1 - Math.sin((easeProgress - 0.7) * Math.PI / 0.6) * 0.1
          : easeProgress / 0.7;

        node.y(startY + (targetY - startY) * bounceProgress);
        node.opacity(easeProgress);
      }

      layer?.batchDraw?.();

      // Stop animation when done
      if (progress >= 1) {
        animation.stop();
        animationRef.current = null;
      }
    }, layer);

    animation.start();
    animationRef.current = animation;

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, [type, duration, delay, easing]);

  return {
    stop: () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    },
    start: () => {
      if (animationRef.current) {
        animationRef.current.start();
      }
    },
  };
};

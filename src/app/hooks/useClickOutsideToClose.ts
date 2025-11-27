// hooks/useClickOutsideToClose.ts
import { useEffect, RefObject } from "react";

export const useClickOutsideToClose = (
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  isOpen: boolean = true
) => {
  useEffect(() => {
    // Only add listener if panel is open
    if (!isOpen) {
      console.log('[useClickOutsideToClose] Panel is closed, skipping listener');
      return;
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      
      console.log('[useClickOutsideToClose] Click detected');
      
      // Check if click is outside the panel
      if (ref.current && !ref.current.contains(target)) {
        console.log('[useClickOutsideToClose] Click is outside panel');
        
        // Check if click is on sidebar buttons
        const clickedElement = e.target as HTMLElement;
        const isSidebarButton = clickedElement.closest('[data-panel-trigger]');
        
        if (isSidebarButton) {
          console.log('[useClickOutsideToClose] Click is on sidebar button, ignoring');
          return;
        }
        
        // Check if click is on the canvas/stage area (allow element selection)
        const isCanvasArea = clickedElement.closest('canvas') || 
                             clickedElement.tagName === 'CANVAS';
        
        if (isCanvasArea) {
          console.log('[useClickOutsideToClose] Click is on canvas, ignoring');
          return;
        }
        
        console.log('[useClickOutsideToClose] Closing panel');
        onClose();
      } else {
        console.log('[useClickOutsideToClose] Click is inside panel');
      }
    };

    // Small delay to prevent immediate closing when opening
    console.log('[useClickOutsideToClose] Adding click listener with delay');
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
      console.log('[useClickOutsideToClose] Click listener added');
    }, 100);

    return () => {
      console.log('[useClickOutsideToClose] Cleaning up listener');
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, onClose, isOpen]);
};
// hooks/useClickOutsideToClose.ts
import { useEffect, RefObject } from "react";

export const useClickOutsideToClose = (
  ref: RefObject<HTMLElement | null>, // ← allow null
  onClose: () => void,
  deps: any[] = []
) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClose, ...deps]);
};
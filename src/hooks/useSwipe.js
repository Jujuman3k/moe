import { useRef } from 'react';

// Ignore controls and vertical scrolling; a swipe beginning at x=0 is valid.
export function useSwipe(onSwipeRight) {
  const start = useRef(null);
  const end = useRef(null);
  return {
    onTouchStart(event) {
      event.stopPropagation();
      start.current = null;
      end.current = null;
      if (event.target.closest('input, select, textarea, button, [role="slider"], [data-no-swipe]')) return;
      const touch = event.targetTouches[0];
      start.current = { x: touch.clientX, y: touch.clientY };
    },
    onTouchMove(event) {
      event.stopPropagation();
      const touch = event.targetTouches[0];
      end.current = { x: touch.clientX, y: touch.clientY };
    },
    onTouchEnd(event) {
      event.stopPropagation();
      if (start.current && end.current) {
        const dx = end.current.x - start.current.x;
        const dy = end.current.y - start.current.y;
        if (dx > 50 && dx > Math.abs(dy) * 1.5) onSwipeRight();
      }
      start.current = null;
      end.current = null;
    },
    onTouchCancel() { start.current = null; end.current = null; },
  };
}

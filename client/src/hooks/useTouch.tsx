import { useState, useCallback, useRef } from 'react';
import { Position, TouchState } from '../types/game';

export const useTouch = (onSwipe: (dx: number, dy: number) => void) => {
  const [touchState, setTouchState] = useState<TouchState>({
    startPos: null,
    startTime: 0,
    threshold: 35
  });

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    try {
      event.preventDefault();
    } catch (e) {
      // Passive event listener - preventDefault not allowed
    }
    const touch = event.touches[0];
    setTouchState(prev => ({
      ...prev,
      startPos: { x: touch.clientX, y: touch.clientY },
      startTime: Date.now()
    }));
  }, []);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    try {
      event.preventDefault();
    } catch (e) {
      // Passive event listener - preventDefault not allowed
    }
    if (!touchState.startPos) return;

    const touch = event.changedTouches[0];
    const endPos = { x: touch.clientX, y: touch.clientY };
    const dx = endPos.x - touchState.startPos.x;
    const dy = endPos.y - touchState.startPos.y;

    if (Math.abs(dx) >= touchState.threshold || Math.abs(dy) >= touchState.threshold) {
      if (Math.abs(dx) > Math.abs(dy)) {
        onSwipe(dx > 0 ? 1 : -1, 0);
      } else {
        onSwipe(0, dy > 0 ? 1 : -1);
      }
    }

    setTouchState(prev => ({
      ...prev,
      startPos: null,
      startTime: 0
    }));
  }, [touchState.startPos, touchState.threshold, onSwipe]);

  // Mouse support for desktop
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    setTouchState(prev => ({
      ...prev,
      startPos: { x: event.clientX, y: event.clientY },
      startTime: Date.now()
    }));
  }, []);

  const handleMouseUp = useCallback((event: React.MouseEvent) => {
    if (!touchState.startPos) return;

    const endPos = { x: event.clientX, y: event.clientY };
    const dx = endPos.x - touchState.startPos.x;
    const dy = endPos.y - touchState.startPos.y;

    if (Math.abs(dx) >= touchState.threshold || Math.abs(dy) >= touchState.threshold) {
      if (Math.abs(dx) > Math.abs(dy)) {
        onSwipe(dx > 0 ? 1 : -1, 0);
      } else {
        onSwipe(0, dy > 0 ? 1 : -1);
      }
    }

    setTouchState(prev => ({
      ...prev,
      startPos: null,
      startTime: 0
    }));
  }, [touchState.startPos, touchState.threshold, onSwipe]);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp
    }
  };
};

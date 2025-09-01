import React, { useRef, useEffect } from 'react';
import { GameState, COLORS, CELL_TYPES } from '../types/game';

interface MiniMapProps {
  gameState: GameState;
  className?: string;
}

export const MiniMap: React.FC<MiniMapProps> = ({ gameState, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get the actual canvas container size to maintain aspect ratio
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Use actual container size for high quality rendering
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Calculate minimap scale based on actual canvas size
    const minimapScale = Math.min(rect.width / gameState.worldSize, rect.height / gameState.worldSize);

    // Clear canvas
    ctx.fillStyle = COLORS.BLACK;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw explored areas
    for (let y = 0; y < gameState.worldSize; y++) {
      for (let x = 0; x < gameState.worldSize; x++) {
        const visitedTime = gameState.visitedMap[y][x];
        
        if (visitedTime > 0) {
          const rectX = x * minimapScale;
          const rectY = y * minimapScale;
          const rectSize = minimapScale;

          // Determine base color
          let baseColor: string;
          if (gameState.worldMap[y][x] === CELL_TYPES.OBSTACLE) {
            baseColor = COLORS.ROCK_COLOR;
          } else {
            baseColor = COLORS.DARK_GREEN;
          }

          // Apply fog of war effect
          let finalColor: string;
          if (gameState.moveCounter === visitedTime) {
            // Currently visible
            finalColor = baseColor;
          } else {
            // Explored but not currently visible - make it dimmer
            const rgb = hexToRgb(baseColor);
            if (rgb) {
              finalColor = `rgb(${Math.floor(rgb.r * 0.3)}, ${Math.floor(rgb.g * 0.3)}, ${Math.floor(rgb.b * 0.3)})`;
            } else {
              finalColor = COLORS.GRAY;
            }
          }

          ctx.fillStyle = finalColor;
          ctx.fillRect(rectX, rectY, rectSize, rectSize);

          // Draw seen apples that are still present
          const hasApple = gameState.seenApples.some(pos => pos.x === x && pos.y === y) &&
                           gameState.apples.some(apple => apple.position.x === x && apple.position.y === y);
          
          if (hasApple) {
            ctx.fillStyle = COLORS.RED;
            ctx.beginPath();
            ctx.arc(
              rectX + rectSize / 2,
              rectY + rectSize / 2,
              Math.max(1, rectSize / 3),
              0,
              2 * Math.PI
            );
            ctx.fill();
          }
        }
      }
    }

    // Draw player position
    const playerX = gameState.playerPosition.x * minimapScale;
    const playerY = gameState.playerPosition.y * minimapScale;
    
    ctx.fillStyle = COLORS.YELLOW;
    ctx.fillRect(playerX, playerY, minimapScale, minimapScale);

    // Draw border
    ctx.strokeStyle = COLORS.WHITE;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, rect.width, rect.height);

  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      className={`border-2 border-white ${className}`}
      style={{ 
        width: '90%',
        height: '90%',
        aspectRatio: '1/1'
      }}
    />
  );
};

// Helper function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

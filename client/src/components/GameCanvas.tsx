import React, { useRef, useEffect } from 'react';
import { GameState, COLORS, CELL_TYPES } from '../types/game';

interface GameCanvasProps {
  gameState: GameState;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get canvas size and calculate scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Calculate grid size based on available space
    const availableWidth = rect.width;
    const availableHeight = rect.height;
    const gridSize = Math.min(
      availableWidth / gameState.visibleGrid,
      availableHeight / gameState.visibleGrid
    );

    // Clear canvas
    ctx.fillStyle = COLORS.LIGHT_BLUE;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Calculate visible area
    const startX = gameState.playerPosition.x - Math.floor(gameState.visibleGrid / 2);
    const startY = gameState.playerPosition.y - Math.floor(gameState.visibleGrid / 2);

    // Calculate offset to center the grid
    const offsetX = (rect.width - gameState.visibleGrid * gridSize) / 2;
    const offsetY = (rect.height - gameState.visibleGrid * gridSize) / 2;

    // Draw visible grid
    for (let yOffset = 0; yOffset < gameState.visibleGrid; yOffset++) {
      for (let xOffset = 0; xOffset < gameState.visibleGrid; xOffset++) {
        const worldX = startX + xOffset;
        const worldY = startY + yOffset;

        const screenX = offsetX + xOffset * gridSize;
        const screenY = offsetY + yOffset * gridSize;

        // Check if within world bounds
        if (worldX >= 0 && worldX < gameState.worldSize && worldY >= 0 && worldY < gameState.worldSize) {
          // Draw terrain
          if (gameState.worldMap[worldY][worldX] === CELL_TYPES.OBSTACLE) {
            ctx.fillStyle = COLORS.ROCK_COLOR;
          } else {
            ctx.fillStyle = COLORS.DARK_GREEN;
          }
          ctx.fillRect(screenX, screenY, gridSize, gridSize);

          // Draw apple if present
          const apple = gameState.apples.find(a => a.position.x === worldX && a.position.y === worldY);
          if (apple) {
            // Apple body
            ctx.fillStyle = COLORS.RED;
            ctx.beginPath();
            ctx.arc(
              screenX + gridSize / 2,
              screenY + gridSize / 2,
              gridSize / 3,
              0,
              2 * Math.PI
            );
            ctx.fill();

            // Apple stem
            ctx.fillStyle = COLORS.BROWN;
            ctx.beginPath();
            ctx.arc(
              screenX + gridSize / 2,
              screenY + gridSize / 2 - gridSize / 4,
              3,
              0,
              2 * Math.PI
            );
            ctx.fill();
          }

          // Draw player
          if (worldX === gameState.playerPosition.x && worldY === gameState.playerPosition.y) {
            const playerSize = gridSize - 10;
            const playerX = screenX + (gridSize - playerSize) / 2;
            const playerY = screenY + (gridSize - playerSize) / 2;

            // Player body
            ctx.fillStyle = COLORS.BLUE;
            ctx.fillRect(playerX, playerY, playerSize, playerSize);

            // Player eyes
            const eyeSize = Math.max(3, gridSize / 15);
            const eye1X = screenX + gridSize / 2 - gridSize / 4;
            const eye2X = screenX + gridSize / 2 + gridSize / 4;
            const eyeY = screenY + gridSize / 2 - gridSize / 8;

            ctx.fillStyle = COLORS.WHITE;
            ctx.beginPath();
            ctx.arc(eye1X, eyeY, eyeSize, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(eye2X, eyeY, eyeSize, 0, 2 * Math.PI);
            ctx.fill();
          }
        } else {
          // Outside world bounds - draw black
          ctx.fillStyle = COLORS.BLACK;
          ctx.fillRect(screenX, screenY, gridSize, gridSize);
        }

        // Draw grid lines
        ctx.strokeStyle = COLORS.GRAY;
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX, screenY, gridSize, gridSize);
      }
    }

  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ 
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    />
  );
};

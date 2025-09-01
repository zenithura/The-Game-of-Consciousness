import { useState, useCallback, useEffect } from 'react';
import { GameState } from '../types/game';
import { GameEngine } from '../lib/gameEngine';
import { WorldGenerator } from '../lib/worldGenerator';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialState = WorldGenerator.createInitialGameState();
    return GameEngine.updateVisitedMap(initialState);
  });

  const movePlayer = useCallback((dx: number, dy: number) => {
    setGameState(prevState => GameEngine.movePlayer(prevState, dx, dy));
  }, []);

  const restartGame = useCallback(() => {
    setGameState(GameEngine.restartGame());
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gamePhase !== 'playing') {
        if (event.key === 'r' || event.key === 'R' || event.key === ' ') {
          restartGame();
        }
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          event.preventDefault();
          movePlayer(0, -1);
          break;
        case 's':
        case 'arrowdown':
          event.preventDefault();
          movePlayer(0, 1);
          break;
        case 'a':
        case 'arrowleft':
          event.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'd':
        case 'arrowright':
          event.preventDefault();
          movePlayer(1, 0);
          break;
        case 'r':
        case ' ':
          event.preventDefault();
          restartGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer, restartGame, gameState.gamePhase]);

  return {
    gameState,
    movePlayer,
    restartGame
  };
};

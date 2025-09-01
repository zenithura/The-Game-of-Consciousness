import React from 'react';
import { GameCanvas } from './GameCanvas';
import { GameUI } from './GameUI';
import { MiniMap } from './MiniMap';
import { useGameState } from '../hooks/useGameState';
import { useTouch } from '../hooks/useTouch';

export const Game: React.FC = () => {
  const { gameState, movePlayer, restartGame } = useGameState();
  const { touchHandlers } = useTouch(movePlayer);

  return (
    <div 
      className="w-screen h-screen bg-blue-200 flex flex-col lg:flex-row overflow-hidden"
      {...touchHandlers}
    >
      {/* Game View - Top half on mobile, Left half on desktop */}
      <div className="w-full h-1/2 lg:w-1/2 lg:h-full flex flex-col">
        {/* Header - Outside game canvas */}
        <div className="w-full bg-green-800 text-white p-2 flex-shrink-0">
          {/* First Row - Energy and Score */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold">ENERJİ</span>
              <div className="w-24 h-4 bg-gray-800 rounded overflow-hidden">
                <div 
                  className="h-full transition-all duration-300"
                  style={{ 
                    width: `${(gameState.energy / gameState.maxEnergy) * 100}%`,
                    backgroundColor: gameState.energy > 5 ? '#00ff00' : gameState.energy > 2 ? '#ffff00' : '#ff0000'
                  }}
                />
              </div>
              <span className="text-xs font-bold">{gameState.energy}</span>
            </div>

            <div className="bg-green-700 px-2 py-1 rounded border border-green-600">
              <span className="text-xs font-bold">SKOR: {gameState.score}</span>
            </div>
          </div>

          {/* Second Row - Apples and Controls */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">Elma: {gameState.apples.length}</span>
            <span className="text-xs">WASD/Oklar • Kaydır</span>
          </div>
        </div>

        {/* Game Canvas - Takes remaining space */}
        <div className="flex-1 relative">
          <GameCanvas 
            gameState={gameState}
          />
          
          {/* Game UI Overlay - Only modal screens */}
          <GameUI 
            gameState={gameState}
            onRestart={restartGame}
          />
        </div>
      </div>

      {/* Mini Map Panel - Bottom half on mobile, Right half on desktop */}
      <div className="w-full h-1/2 lg:w-1/2 lg:h-full bg-gray-900 p-4 pb-16 lg:pb-4 flex items-center justify-center">
        <MiniMap gameState={gameState} />
      </div>
    </div>
  );
};

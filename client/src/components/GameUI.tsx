import React from 'react';
import { GameState } from '../types/game';

interface GameUIProps {
  gameState: GameState;
  onRestart: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({ gameState, onRestart }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Win Screen */}
      {gameState.gamePhase === 'won' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center pointer-events-auto">
          <div className="bg-white p-8 rounded-2xl border-4 border-black text-center max-w-md mx-4">
            <h1 className="text-3xl font-bold text-green-600 mb-4">TEBRİKLER!</h1>
            <p className="text-lg mb-2">Tüm elmaları topladınız!</p>
            <p className="text-lg mb-4">Final Skor: {gameState.score}</p>
            <button
              onClick={onRestart}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-bold transition-colors"
            >
              Yeniden Başla
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState.gamePhase === 'lost' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center pointer-events-auto">
          <div className="bg-white p-8 rounded-2xl border-4 border-black text-center max-w-md mx-4">
            <h1 className="text-3xl font-bold text-red-600 mb-4">ENERJİ BİTTİ!</h1>
            <p className="text-lg mb-2">Final Skor: {gameState.score}</p>
            <p className="text-lg mb-4">Kalan Elma: {gameState.apples.length}</p>
            <button
              onClick={onRestart}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-bold transition-colors"
            >
              Yeniden Başla
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

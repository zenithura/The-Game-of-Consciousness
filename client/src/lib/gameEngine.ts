import { GameState, Position, Apple, CELL_TYPES } from '../types/game';

export class GameEngine {
  static updateVisitedMap(gameState: GameState): GameState {
    const { playerPosition, visibleGrid, worldSize, visitedMap, seenApples, apples, moveCounter } = gameState;
    const newVisitedMap = visitedMap.map(row => [...row]);
    const newSeenApples = [...seenApples];
    const newMoveCounter = moveCounter + 1;

    const startX = playerPosition.x - Math.floor(visibleGrid / 2);
    const startY = playerPosition.y - Math.floor(visibleGrid / 2);

    for (let yOffset = 0; yOffset < visibleGrid; yOffset++) {
      for (let xOffset = 0; xOffset < visibleGrid; xOffset++) {
        const worldX = startX + xOffset;
        const worldY = startY + yOffset;

        if (worldX >= 0 && worldX < worldSize && worldY >= 0 && worldY < worldSize) {
          newVisitedMap[worldY][worldX] = newMoveCounter;

          // Check for apples in visible area
          const apple = apples.find(a => a.position.x === worldX && a.position.y === worldY);
          if (apple && !newSeenApples.some(pos => pos.x === worldX && pos.y === worldY)) {
            newSeenApples.push({ x: worldX, y: worldY });
          }
        }
      }
    }

    return {
      ...gameState,
      visitedMap: newVisitedMap,
      seenApples: newSeenApples,
      moveCounter: newMoveCounter
    };
  }

  static movePlayer(gameState: GameState, dx: number, dy: number): GameState {
    if (gameState.energy <= 0 || gameState.gamePhase !== 'playing') {
      return gameState;
    }

    const newX = gameState.playerPosition.x + dx;
    const newY = gameState.playerPosition.y + dy;

    // Check world boundaries and obstacles
    if (
      newX < 0 || newX >= gameState.worldSize ||
      newY < 0 || newY >= gameState.worldSize ||
      gameState.worldMap[newY][newX] === CELL_TYPES.OBSTACLE
    ) {
      return gameState;
    }

    let newGameState = {
      ...gameState,
      playerPosition: { x: newX, y: newY },
      energy: gameState.energy - 1
    };

    // Update visited map
    newGameState = this.updateVisitedMap(newGameState);

    // Check for apple collection
    const appleIndex = newGameState.apples.findIndex(
      apple => apple.position.x === newX && apple.position.y === newY
    );

    if (appleIndex !== -1) {
      const newApples = [...newGameState.apples];
      newApples.splice(appleIndex, 1);

      // Remove from seen apples
      const newSeenApples = newGameState.seenApples.filter(
        pos => !(pos.x === newX && pos.y === newY)
      );

      newGameState = {
        ...newGameState,
        apples: newApples,
        seenApples: newSeenApples,
        energy: Math.min(newGameState.energy + 3, newGameState.maxEnergy),
        score: newGameState.score + 10
      };
    }

    // Check win/lose conditions
    if (newGameState.apples.length === 0) {
      newGameState.gamePhase = 'won';
    } else if (newGameState.energy <= 0) {
      newGameState.gamePhase = 'lost';
    }

    return newGameState;
  }

  static restartGame(): GameState {
    const newGameState = {
      ...this.createInitialGameState(),
      energy: 50,
      score: 0,
      gamePhase: 'playing' as const,
      moveCounter: 0,
      seenApples: []
    };

    return this.updateVisitedMap(newGameState);
  }

  private static createInitialGameState(): GameState {
    const worldSize = 50;
    const visibleGrid = 3;
    
    // Initialize empty world
    const worldMap: number[][] = Array(worldSize)
      .fill(null)
      .map(() => Array(worldSize).fill(CELL_TYPES.EMPTY));

    // Place obstacles
    const numObstacles = Math.floor(worldSize * worldSize * 0.08);
    for (let i = 0; i < numObstacles; i++) {
      let pos: Position;
      do {
        pos = {
          x: Math.floor(Math.random() * worldSize),
          y: Math.floor(Math.random() * worldSize)
        };
      } while (worldMap[pos.y][pos.x] !== CELL_TYPES.EMPTY);
      
      worldMap[pos.y][pos.x] = CELL_TYPES.OBSTACLE;
    }

    // Find valid player starting position
    let playerPosition: Position;
    do {
      playerPosition = {
        x: Math.floor(Math.random() * worldSize),
        y: Math.floor(Math.random() * worldSize)
      };
    } while (worldMap[playerPosition.y][playerPosition.x] !== CELL_TYPES.EMPTY);

    // Place apples
    const totalApples = Math.floor(worldSize * worldSize * 0.1);
    const apples: Apple[] = [];
    
    for (let i = 0; i < totalApples; i++) {
      let applePos: Position;
      do {
        applePos = {
          x: Math.floor(Math.random() * worldSize),
          y: Math.floor(Math.random() * worldSize)
        };
      } while (
        worldMap[applePos.y][applePos.x] !== CELL_TYPES.EMPTY ||
        (applePos.x === playerPosition.x && applePos.y === playerPosition.y) ||
        apples.some(apple => apple.position.x === applePos.x && apple.position.y === applePos.y)
      );

      apples.push({
        position: applePos,
        id: `apple-${i}`
      });
    }

    return {
      playerPosition,
      energy: 50,
      maxEnergy: 100,
      score: 0,
      apples,
      worldMap,
      visitedMap: Array(worldSize).fill(null).map(() => Array(worldSize).fill(0)),
      seenApples: [],
      moveCounter: 0,
      gamePhase: 'playing',
      worldSize,
      visibleGrid
    };
  }
}

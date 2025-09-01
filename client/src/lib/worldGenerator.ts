import { GameState, Apple, Position, CELL_TYPES } from '../types/game';

export class WorldGenerator {
  static generateWorld(worldSize: number): {
    worldMap: number[][];
    apples: Apple[];
    playerPosition: Position;
  } {
    // Initialize empty world
    const worldMap: number[][] = Array(worldSize)
      .fill(null)
      .map(() => Array(worldSize).fill(CELL_TYPES.EMPTY));

    // Place obstacles (8% of world)
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

    // Place apples (10% of world)
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

    return { worldMap, apples, playerPosition };
  }

  static createInitialGameState(): GameState {
    const worldSize = 50;
    const visibleGrid = 3;
    const { worldMap, apples, playerPosition } = this.generateWorld(worldSize);

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

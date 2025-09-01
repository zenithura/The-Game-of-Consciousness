export interface Position {
  x: number;
  y: number;
}

export interface Apple {
  position: Position;
  id: string;
}

export interface GameState {
  playerPosition: Position;
  energy: number;
  maxEnergy: number;
  score: number;
  apples: Apple[];
  worldMap: number[][];
  visitedMap: number[][];
  seenApples: Position[];
  moveCounter: number;
  gamePhase: 'playing' | 'won' | 'lost';
  worldSize: number;
  visibleGrid: number;
}

export interface TouchState {
  startPos: Position | null;
  startTime: number;
  threshold: number;
}

export const CELL_TYPES = {
  EMPTY: 0,
  OBSTACLE: 1
} as const;

export const COLORS = {
  BLACK: '#000000',
  WHITE: '#ffffff',
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0078ff',
  BROWN: '#8b4513',
  YELLOW: '#ffff00',
  GRAY: '#646464',
  LIGHT_BLUE: '#add8e6',
  DARK_GREEN: '#009600',
  LIGHT_GRAY: '#c8c8c8',
  ROCK_COLOR: '#a9a9a9'
} as const;

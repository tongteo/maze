export const MAZE_CONFIG = {
  SIZES: {
    SMALL: { width: 10, height: 10 },
    MEDIUM: { width: 15, height: 15 },
    LARGE: { width: 20, height: 20 },
  },
  DEFAULT_SIZE: 'MEDIUM',
} as const;

export type MazeSize = keyof typeof MAZE_CONFIG.SIZES;
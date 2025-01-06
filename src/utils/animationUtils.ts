export type AnimationSpeed = 'SLOW' | 'NORMAL' | 'FAST';

export const SPEED_VALUES: Record<AnimationSpeed, number> = {
  SLOW: 60,
  NORMAL: 40,
  FAST: 10
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
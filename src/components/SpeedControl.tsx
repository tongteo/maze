import React from 'react';
import { Button } from './Button';

export type AnimationSpeed = 'SLOW' | 'NORMAL' | 'FAST';

interface SpeedControlProps {
  speed: AnimationSpeed;
  onSpeedChange: (speed: AnimationSpeed) => void;
  disabled?: boolean;
}

const SPEED_LABELS: Record<AnimationSpeed, string> = {
  SLOW: '🐢 Slow',
  NORMAL: '🚶 Normal',
  FAST: '🏃 Fast'
};

export const SpeedControl: React.FC<SpeedControlProps> = ({ 
  speed, 
  onSpeedChange,
  disabled = false 
}) => {
  return (
    <div className="flex gap-2">
      {(Object.keys(SPEED_LABELS) as AnimationSpeed[]).map((speedOption) => (
        <Button
          key={speedOption}
          onClick={() => onSpeedChange(speedOption)}
          variant={speed === speedOption ? 'primary' : 'secondary'}
          disabled={disabled}
        >
          {SPEED_LABELS[speedOption]}
        </Button>
      ))}
    </div>
  );
};
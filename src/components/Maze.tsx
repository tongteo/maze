import React, { useState, useEffect } from 'react';
import { Cell as CellType } from '../types';
import { Cell } from './Cell';
import { generateMaze } from '../utils/mazeGenerator';
import { canMove } from '../utils/moveUtils';
import { findPath } from '../utils/astar';
import { delay, SPEED_VALUES, AnimationSpeed } from '../utils/animationUtils';
import { Button } from './Button';
import { SpeedControl } from './SpeedControl';
import { MAZE_CONFIG, MazeSize } from '../config/mazeConfig';

export const Maze: React.FC = () => {
  const [mazeSize, setMazeSize] = useState<MazeSize>('MEDIUM');
  const { width, height } = MAZE_CONFIG.SIZES[mazeSize];
  const [maze, setMaze] = useState<CellType[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [path, setPath] = useState<Set<string>>(new Set(['0,0']));
  const [solution, setSolution] = useState<{ x: number; y: number }[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>('NORMAL');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: width - 1, y: height - 1 });
  const [isSettingStart, setIsSettingStart] = useState(false);
  const [isSettingEnd, setIsSettingEnd] = useState(false);

  const createNewMaze = (size: MazeSize = mazeSize) => {
    const { width, height } = MAZE_CONFIG.SIZES[size];
    const newMaze = generateMaze(width, height);
    setMaze(newMaze);
    
    // Reset các vị trí về mặc định
    const newStartPos = { x: 0, y: 0 };
    const newEndPos = { x: width - 1, y: height - 1 };
    
    setStartPos(newStartPos);
    setEndPos(newEndPos);
    setPlayerPos(newStartPos);
    setPath(new Set([`${newStartPos.x},${newStartPos.y}`]));
    setSolution([]);
    setIsAnimating(false);
    setIsSettingStart(false);
    setIsSettingEnd(false);
  };

  const handleSolve = async () => {
    if (isAnimating) return;
    
    const solution = findPath(maze, playerPos, endPos);
    if (solution.length === 0) return;

    setIsAnimating(true);
    setSolution([]);

    for (let i = 0; i < solution.length; i++) {
      setSolution(solution.slice(0, i + 1));
      await delay(SPEED_VALUES[animationSpeed]);
    }

    setIsAnimating(false);
  };

  useEffect(() => {
    createNewMaze();
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isAnimating) return;
    
    const { x, y } = playerPos;
    let newX = x;
    let newY = y;

    switch (e.key) {
      case 'ArrowUp':
        newY = y - 1;
        break;
      case 'ArrowRight':
        newX = x + 1;
        break;
      case 'ArrowDown':
        newY = y + 1;
        break;
      case 'ArrowLeft':
        newX = x - 1;
        break;
      default:
        return;
    }

    if (canMove(maze, x, y, newX, newY)) {
      setPlayerPos({ x: newX, y: newY });
      setPath(prev => new Set(prev).add(`${newX},${newY}`));
      setSolution([]);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [maze, playerPos, isAnimating]);

  const handleSizeChange = (size: MazeSize) => {
    if (isAnimating) return;
    setMazeSize(size);
    createNewMaze(size);
  };

  const handleCellClick = (x: number, y: number) => {
    if (isAnimating) return;
    
    if (isSettingStart) {
      setStartPos({ x, y });
      setPlayerPos({ x, y });
      setPath(new Set([`${x},${y}`]));
      setIsSettingStart(false);
    } else if (isSettingEnd) {
      setEndPos({ x, y });
      setIsSettingEnd(false);
    }
    setSolution([]);
  };

  if (maze.length === 0) return null;

  const gridColsClass = `grid-cols-${width}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 mb-4">
        {(Object.keys(MAZE_CONFIG.SIZES) as MazeSize[]).map((size) => (
          <Button
            key={size}
            onClick={() => handleSizeChange(size)}
            variant={size === mazeSize ? 'primary' : 'secondary'}
            disabled={isAnimating}
          >
            {size}
          </Button>
        ))}
      </div>
      <div 
        className={`grid gap-0 border border-gray-800 ${gridColsClass}`}
        style={{ 
          gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
          maxWidth: '90vw',
          maxHeight: '90vh'
        }}
      >
        {maze.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={`${x}-${y}`}
              walls={cell.walls}
              isStart={x === startPos.x && y === startPos.y}
              isEnd={x === endPos.x && y === endPos.y}
              isPath={path.has(`${x},${y}`)}
              isSolution={solution.some(pos => pos.x === x && pos.y === y)}
              onClick={() => handleCellClick(x, y)}
              isSelectable={isSettingStart || isSettingEnd}
            />
          ))
        )}
      </div>
      <div className="flex flex-col items-center gap-2">
        <SpeedControl
          speed={animationSpeed}
          onSpeedChange={setAnimationSpeed}
          disabled={isAnimating}
        />
        <div className="flex gap-2">
          <Button onClick={() => createNewMaze()} disabled={isAnimating}>
            New Maze
          </Button>
          <Button 
            onClick={handleSolve} 
            variant="secondary"
            disabled={isAnimating}
          >
            {isAnimating ? 'Solving...' : 'Show Solution'}
          </Button>
          <Button 
            onClick={() => setIsSettingStart(true)}
            variant="secondary"
            disabled={isAnimating || isSettingEnd}
          >
            Set Start
          </Button>
          <Button 
            onClick={() => setIsSettingEnd(true)}
            variant="secondary"
            disabled={isAnimating || isSettingStart}
          >
            Set End
          </Button>
        </div>
      </div>
    </div>
  );
};
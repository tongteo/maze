import { Cell } from '../types';

export function canMove(maze: Cell[][], currentX: number, currentY: number, newX: number, newY: number): boolean {
  // Check if new position is within bounds
  if (newX < 0 || newX >= maze[0].length || newY < 0 || newY >= maze.length) {
    return false;
  }

  // Check if there's a wall between current and new position
  const currentCell = maze[currentY][currentX];
  
  if (newX > currentX && currentCell.walls.right) return false; // Moving right
  if (newX < currentX && currentCell.walls.left) return false; // Moving left
  if (newY > currentY && currentCell.walls.bottom) return false; // Moving down
  if (newY < currentY && currentCell.walls.top) return false; // Moving up

  return true;
}
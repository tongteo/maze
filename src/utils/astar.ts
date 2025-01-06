import { canMove } from './moveUtils';
import { Cell } from '../types';

interface Node {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: Node | null;
}

function manhattan(x1: number, y1: number, x2: number, y2: number): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function getNeighbors(node: Node, maze: Cell[][], end: { x: number; y: number }): Node[] {
  const { x, y } = node;
  const neighbors: Node[] = [];
  const directions = [
    { dx: 0, dy: -1 }, // up
    { dx: 1, dy: 0 },  // right
    { dx: 0, dy: 1 },  // down
    { dx: -1, dy: 0 }  // left
  ];

  for (const { dx, dy } of directions) {
    const newX = x + dx;
    const newY = y + dy;

    if (canMove(maze, x, y, newX, newY)) {
      neighbors.push({
        x: newX,
        y: newY,
        g: node.g + 1,
        h: manhattan(newX, newY, end.x, end.y),
        f: 0,
        parent: node
      });
    }
  }

  return neighbors;
}

export function findPath(maze: Cell[][], start: { x: number; y: number }, end: { x: number; y: number }): { x: number; y: number }[] {
  const openSet: Node[] = [];
  const closedSet = new Set<string>();
  
  const startNode: Node = {
    x: start.x,
    y: start.y,
    g: 0,
    h: manhattan(start.x, start.y, end.x, end.y),
    f: 0,
    parent: null
  };
  startNode.f = startNode.g + startNode.h;
  
  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;

    if (current.x === end.x && current.y === end.y) {
      const path: { x: number; y: number }[] = [];
      let node: Node | null = current;
      while (node) {
        path.unshift({ x: node.x, y: node.y });
        node = node.parent;
      }
      return path;
    }

    closedSet.add(`${current.x},${current.y}`);

    const neighbors = getNeighbors(current, maze, end);
    for (const neighbor of neighbors) {
      if (closedSet.has(`${neighbor.x},${neighbor.y}`)) continue;

      neighbor.f = neighbor.g + neighbor.h;
      
      const openNode = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);
      if (!openNode) {
        openSet.push(neighbor);
      } else if (neighbor.g < openNode.g) {
        openNode.g = neighbor.g;
        openNode.f = neighbor.f;
        openNode.parent = current;
      }
    }
  }

  return [];
}
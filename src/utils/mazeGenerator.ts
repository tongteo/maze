type Cell = {
  x: number;
  y: number;
  visited: boolean;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
};

export function generateMaze(width: number, height: number): Cell[][] {
  // Initialize the grid
  const grid: Cell[][] = Array(height)
    .fill(null)
    .map((_, y) =>
      Array(width)
        .fill(null)
        .map((_, x) => ({
          x,
          y,
          visited: false,
          walls: { top: true, right: true, bottom: true, left: true },
        }))
    );

  // Helper function to get unvisited neighbors
  const getUnvisitedNeighbors = (cell: Cell): Cell[] => {
    const neighbors: Cell[] = [];
    const { x, y } = cell;

    if (y > 0 && !grid[y - 1][x].visited) neighbors.push(grid[y - 1][x]); // top
    if (x < width - 1 && !grid[y][x + 1].visited) neighbors.push(grid[y][x + 1]); // right
    if (y < height - 1 && !grid[y + 1][x].visited) neighbors.push(grid[y + 1][x]); // bottom
    if (x > 0 && !grid[y][x - 1].visited) neighbors.push(grid[y][x - 1]); // left

    return neighbors;
  };

  // Remove walls between two cells
  const removeWalls = (current: Cell, next: Cell) => {
    const dx = next.x - current.x;
    const dy = next.y - current.y;

    if (dx === 1) {
      current.walls.right = false;
      next.walls.left = false;
    } else if (dx === -1) {
      current.walls.left = false;
      next.walls.right = false;
    }

    if (dy === 1) {
      current.walls.bottom = false;
      next.walls.top = false;
    } else if (dy === -1) {
      current.walls.top = false;
      next.walls.bottom = false;
    }
  };

  // Recursive backtracking algorithm
  const stack: Cell[] = [];
  const startCell = grid[0][0];
  startCell.visited = true;
  stack.push(startCell);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current);

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      next.visited = true;
      removeWalls(current, next);
      stack.push(next);
    }
  }

  // Thêm đường đi phụ bằng cách phá một số tường ngẫu nhiên
  const wallRemovalProbability = 0.1; // Tỷ lệ phá tường
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (Math.random() < wallRemovalProbability) {
        // Chọn ngẫu nhiên một hướng để phá tường
        const directions = ['right', 'bottom'] as const;
        const direction = directions[Math.floor(Math.random() * directions.length)];
        
        if (direction === 'right' && x < width - 1) {
          grid[y][x].walls.right = false;
          grid[y][x + 1].walls.left = false;
        } else if (direction === 'bottom' && y < height - 1) {
          grid[y][x].walls.bottom = false;
          grid[y + 1][x].walls.top = false;
        }
      }
    }
  }

  return grid;
}
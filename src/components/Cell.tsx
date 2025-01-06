import React from 'react';
import classNames from 'classnames';

type CellProps = {
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  isStart?: boolean;
  isEnd?: boolean;
  isPath?: boolean;
  isSolution?: boolean;
  onClick?: () => void;
  isSelectable?: boolean;
};

export const Cell: React.FC<CellProps> = ({ 
  walls, 
  isStart, 
  isEnd, 
  isPath, 
  isSolution,
  onClick,
  isSelectable 
}) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'w-6 h-6 relative transition-colors duration-200',
        {
          'bg-green-500': isStart,
          'bg-red-500': isEnd,
          'bg-yellow-200': isPath && !isStart && !isEnd,
          'bg-blue-300': isSolution && !isStart && !isEnd && !isPath,
          'cursor-pointer hover:bg-gray-200': isSelectable && !isStart && !isEnd,
        }
      )}
    >
      {walls.top && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-800" />}
      {walls.right && <div className="absolute top-0 right-0 bottom-0 w-0.5 bg-gray-800" />}
      {walls.bottom && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800" />}
      {walls.left && <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-gray-800" />}
    </div>
  );
};
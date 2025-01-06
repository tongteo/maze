import React from 'react';
import { Maze } from './components/Maze';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Maze Game</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <Maze />
        <div className="mt-4 text-center text-gray-600">
          Use arrow keys to navigate through the maze
        </div>
      </div>
    </div>
  );
}

export default App;
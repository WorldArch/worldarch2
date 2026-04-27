import React, { useState, useEffect, useCallback } from 'react';
const COLS = 24;
const ROWS = 9;
type CellType = 'player' | 'stream' | 'hazard' | 'goal' | 'neutral';
export function CharacterGrid() {
  const [playerPos, setPlayerPos] = useState({ x: 12, y: 8 });
  const [tick, setTick] = useState(0);
  const movePlayer = useCallback((dx: number, dy: number) => {
    setPlayerPos(prev => {
      const newX = Math.max(0, Math.min(COLS - 1, prev.x + dx));
      const newY = Math.max(0, Math.min(ROWS - 1, prev.y + dy));
      return { x: newX, y: newY };
    });
  }, []);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') movePlayer(0, -1);
      if (e.key === 'ArrowDown' || e.key === 's') movePlayer(0, 1);
      if (e.key === 'ArrowLeft' || e.key === 'a') movePlayer(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd') movePlayer(1, 0);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [movePlayer]);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(interval);
  }, []);
  const getCellType = (x: number, y: number): CellType => {
    if (x === playerPos.x && y === playerPos.y) return 'player';
    if (y === 0) return 'goal';
    // Row Logic for Obstacles
    if (y === 2 || y === 4 || y === 6) {
      // Streams (Moving Right)
      const offset = Math.floor(tick / 4) % COLS;
      const isStream = (x - offset + COLS) % 8 < 3;
      return isStream ? 'stream' : 'neutral';
    }
    if (y === 3 || y === 5 || y === 7) {
      // Hazards (Moving Left)
      const offset = Math.floor(tick / 2) % COLS;
      const isHazard = (x + offset) % 10 < 2;
      return isHazard ? 'hazard' : 'neutral';
    }
    return 'neutral';
  };
  // Collision detection
  useEffect(() => {
    const type = getCellType(playerPos.x, playerPos.y);
    if (type === 'hazard' || (playerPos.y > 0 && playerPos.y < 8 && type === 'neutral' && (playerPos.y % 2 === 0))) {
      // Collision with hazard or falling into gap in stream rows (even rows)
      setPlayerPos({ x: 12, y: 8 });
    }
    if (type === 'goal') {
      alert("SYNTHESIS_REACHED: COHERENCE_STABLE");
      setPlayerPos({ x: 12, y: 8 });
    }
  }, [tick, playerPos.x, playerPos.y]);
  return (
    <div className="flex flex-col items-center gap-4 bg-black p-4 border border-cyber-green/20">
      <div className="grid grid-cols-24 gap-1 w-fit bg-system-n">
        {Array.from({ length: ROWS }).map((_, y) => (
          <React.Fragment key={y}>
            {Array.from({ length: COLS }).map((_, x) => {
              const type = getCellType(x, y);
              let bgColor = 'bg-neutral-900';
              if (type === 'player') bgColor = 'grid-p';
              if (type === 'goal') bgColor = 'grid-p opacity-40';
              if (type === 'hazard') bgColor = 'grid-h';
              if (type === 'stream') bgColor = 'grid-s';
              if (type === 'neutral') bgColor = 'bg-[#111]';
              return (
                <div 
                  key={`${x}-${y}`} 
                  className={`w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] ${bgColor}`}
                >
                  {type === 'player' ? '█' : ''}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between w-full max-w-md font-mono text-[10px] opacity-60">
        <span>MODE: NEURAL_FROGGER</span>
        <span>POS: {playerPos.x},{playerPos.y}</span>
      </div>
    </div>
  );
}
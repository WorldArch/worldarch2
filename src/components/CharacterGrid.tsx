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
  const getCellType = useCallback((x: number, y: number): CellType => {
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
  }, [playerPos.x, playerPos.y, tick]);
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
  // Collision detection
  useEffect(() => {
    const type = getCellType(playerPos.x, playerPos.y);
    // Hazard collision or missing stream on water rows
    const isWaterRow = playerPos.y === 2 || playerPos.y === 4 || playerPos.y === 6;
    if (type === 'hazard' || (isWaterRow && type === 'neutral')) {
      setPlayerPos({ x: 12, y: 8 });
    }
    if (type === 'goal') {
      alert("SYNTHESIS_REACHED: COHERENCE_STABLE");
      setPlayerPos({ x: 12, y: 8 });
    }
  }, [tick, playerPos.x, playerPos.y, getCellType]);
  return (
    <div className="flex flex-col items-center gap-4 bg-black p-4 border border-cyber-green/20">
      <div className="grid grid-cols-24 gap-px w-fit bg-cyber-green/5 p-1 border border-cyber-green/10">
        {Array.from({ length: ROWS }).map((_, y) => (
          <React.Fragment key={`row-${y}`}>
            {Array.from({ length: COLS }).map((_, x) => {
              const type = getCellType(x, y);
              let bgColor = 'bg-neutral-900';
              if (type === 'player') bgColor = 'grid-p shadow-[0_0_10px_#55FF55]';
              if (type === 'goal') bgColor = 'grid-p opacity-20';
              if (type === 'hazard') bgColor = 'grid-h';
              if (type === 'stream') bgColor = 'grid-s opacity-80';
              if (type === 'neutral') bgColor = 'bg-[#0a0a0a]';
              return (
                <div
                  key={`cell-${x}-${y}`}
                  className={`w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center text-[10px] transition-colors duration-150 ${bgColor}`}
                >
                  {type === 'player' ? '█' : ''}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between w-full max-w-md font-mono text-[9px] uppercase tracking-wider opacity-60">
        <span className="text-cyber-pink">Mode: Neural_Frogger_V4</span>
        <span className="text-cyber-green">Pos: {playerPos.x.toString().padStart(2, '0')},{playerPos.y.toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
}
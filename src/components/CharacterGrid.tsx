import React, { useState, useEffect, useCallback } from 'react';

const COLS = 24;
const ROWS = 9;

type CellType = 'player' | 'stream' | 'hazard' | 'goal' | 'neutral';
type GameState = 'playing' | 'dead' | 'won';

export function CharacterGrid() {
  const [playerPos, setPlayerPos] = useState({ x: 12, y: 8 });
  const [tick, setTick] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');

  const resetGame = useCallback(() => {
    setPlayerPos({ x: 12, y: 8 });
    setGameState('playing');
  }, []);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return;
    setPlayerPos(prev => {
      const newX = Math.max(0, Math.min(COLS - 1, prev.x + dx));
      const newY = Math.max(0, Math.min(ROWS - 1, prev.y + dy));
      return { x: newX, y: newY };
    });
  }, [gameState]);

  const getCellType = useCallback((x: number, y: number): CellType => {
    if (x === playerPos.x && y === playerPos.y) return 'player';
    if (y === 0) return 'goal';
    if (y === 2 || y === 4 || y === 6) {
      const offset = Math.floor(tick / 4) % COLS;
      const isStream = (x - offset + COLS) % 8 < 3;
      return isStream ? 'stream' : 'neutral';
    }
    if (y === 3 || y === 5 || y === 7) {
      const offset = Math.floor(tick / 2) % COLS;
      const isHazard = (x + offset) % 10 < 2;
      return isHazard ? 'hazard' : 'neutral';
    }
    return 'neutral';
  }, [playerPos.x, playerPos.y, tick]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== 'playing') {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
          resetGame();
        }
        return;
      }
      if (e.key === 'ArrowUp' || e.key === 'w') movePlayer(0, -1);
      if (e.key === 'ArrowDown' || e.key === 's') movePlayer(0, 1);
      if (e.key === 'ArrowLeft' || e.key === 'a') movePlayer(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd') movePlayer(1, 0);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [movePlayer, resetGame, gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const type = getCellType(playerPos.x, playerPos.y);
    const isWaterRow = playerPos.y === 2 || playerPos.y === 4 || playerPos.y === 6;
    if (type === 'hazard' || (isWaterRow && type === 'neutral')) {
      setGameState('dead');
    }
    if (type === 'goal') {
      setGameState('won');
    }
  }, [tick, playerPos.x, playerPos.y, getCellType, gameState]);

  if (gameState === 'dead') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 bg-black p-8 border border-cyber-pink/40 min-h-[300px]">
        <div className="text-cyber-pink text-2xl font-black tracking-widest">[ SYSTEM BREACH ]</div>
        <div className="text-cyber-pink/60 text-xs font-mono tracking-wider">CONNECTION TERMINATED</div>
        <div className="text-white/30 text-[9px] font-mono tracking-widest mt-4 animate-pulse">PRESS ANY KEY TO REBOOT</div>
      </div>
    );
  }

  if (gameState === 'won') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 bg-black p-8 border border-cyber-green/40 min-h-[300px]">
        <div className="text-cyber-green text-2xl font-black tracking-widest">[ ACCESS_GRANTED ]</div>
        <div className="text-cyber-green/60 text-xs font-mono tracking-wider">SYNTHESIS_REACHED: COHERENCE_STABLE</div>
        <div className="text-white/30 text-[9px] font-mono tracking-widest mt-4 animate-pulse">PRESS ANY KEY TO REBOOT</div>
      </div>
    );
  }

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

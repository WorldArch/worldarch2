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
    setTick(0);
  }, []);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return;
    setPlayerPos(prev => {
      const newX = Math.max(0, Math.min(COLS - 1, prev.x + dx));
      const newY = Math.max(0, Math.min(ROWS - 1, prev.y + dy));
      return { x: newX, y: newY };
    });
  }, [gameState]);

  // Main Ticker
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(interval);
  }, [gameState]);

  // Input Listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== 'playing') {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(e.key)) {
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

  // Ride the stream - move player with water current
  useEffect(() => {
    if (gameState !== 'playing') return;
    const y = playerPos.y;
    if (y === 2 || y === 4 || y === 6) {
      if (tick % 4 === 0) {
        setPlayerPos(prev => {
          const offset = Math.floor(tick / 4) % COLS;
          const isStream = (prev.x - offset + COLS) % 8 < 3;
          if (isStream) {
            return { ...prev, x: (prev.x + 1 + COLS) % COLS };
          }
          return prev;
        });
      }
    }
  }, [tick, playerPos.y, gameState]);

  // Logic to determine cell appearance
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

  // Collision and Win Logic
  useEffect(() => {
    if (gameState !== 'playing') return;
    const { x, y } = playerPos;

    if (y === 0) {
      setGameState('won');
      return;
    }

    // Check stream rows directly (bypass getCellType player override)
    if (y === 2 || y === 4 || y === 6) {
      const offset = Math.floor(tick / 4) % COLS;
      const isStream = (x - offset + COLS) % 8 < 3;
      if (!isStream) setGameState('dead');
    }

    // Check hazard rows directly
    if (y === 3 || y === 5 || y === 7) {
      const offset = Math.floor(tick / 2) % COLS;
      const isHazard = (x + offset) % 10 < 2;
      if (isHazard) setGameState('dead');
    }
  }, [tick, playerPos, gameState]);

  // Screen Displays
  if (gameState === 'dead') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 bg-black p-8 border border-cyber-pink/40 min-h-[300px]">
        <div className="text-cyber-pink text-2xl font-black tracking-widest animate-pulse">[ SYSTEM BREACH ]</div>
        <div className="text-cyber-pink/60 text-xs font-mono tracking-wider uppercase">Connection Terminated // Node Lost</div>
        <div className="text-white/30 text-[9px] font-mono tracking-widest mt-4 uppercase">Press any key to reboot</div>
      </div>
    );
  }

  if (gameState === 'won') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 bg-black p-8 border border-cyber-green/40 min-h-[300px]">
        <div className="text-cyber-green text-2xl font-black tracking-widest">[ ACCESS_GRANTED ]</div>
        <div className="text-cyber-green/60 text-xs font-mono tracking-wider uppercase">Synthesis Reached // Coherence Stable</div>
        <div className="text-white/30 text-[9px] font-mono tracking-widest mt-4 animate-pulse uppercase">Press any key to reboot</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 bg-black p-4 border border-cyber-green/20 backdrop-blur-md">
      <div 
        className="grid gap-px bg-cyber-green/5 p-1 border border-cyber-green/10"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: ROWS }).map((_, y) => (
          <React.Fragment key={`row-${y}`}>
            {Array.from({ length: COLS }).map((_, x) => {
              const type = getCellType(x, y);
              let bgColor = 'bg-[#0a0a0a]';
              
              if (type === 'player') bgColor = 'bg-cyber-green shadow-[0_0_15px_#00FF66] z-10';
              if (type === 'goal') bgColor = 'bg-cyber-green/20';
              if (type === 'hazard') bgColor = 'bg-cyber-pink/60';
              if (type === 'stream') bgColor = 'bg-cyber-green/40';

              return (
                <div
                  key={`cell-${x}-${y}`}
                  className={`w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center transition-colors duration-100 ${bgColor}`}
                >
                  {type === 'player' && <span className="text-black text-[10px] font-bold">█</span>}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex justify-between w-full font-mono text-[9px] uppercase tracking-wider opacity-60">
        <span className="text-cyber-pink">Substrate_Runner_v4.2</span>
        <span className="text-cyber-green">Node_Loc: {playerPos.x.toString().padStart(2, '0')}:{playerPos.y.toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
}

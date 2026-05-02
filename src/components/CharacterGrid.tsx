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
    const x = playerPos.x;
    const y = playerPos.y;
    if (y === 0) {
      setGameState('won');
      return;
    }
    const isWaterRow = y === 2 || y === 4 || y === 6;
    if (isWaterRow) {
      const offset = Math.floor(tick / 4) % COLS;
      const isStream = (x - offset + COLS) % 8 < 3;
      if (!isStream) setGameState('dead');
    }
    if (y === 3 || y === 5 || y === 7) {
      const offset = Math.floor(tick / 2) % COLS;
      const isHazard = (x + offset) % 10 < 2;
            if (isHazard) setGameState('dead');
    }
  }, [tick, playerPos.x, playerPos.y, gameState]);

  if (gameState === 'dead') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 bg-black p-8 border border-cyber-pink/40 min-h-[300px]">
        <div className="text-cyber-pink text-2xl font-black tracking-widest">[ SYSTEM BREACH ]</div>
        <div className="text-cyber-pink/60 text-xs font-mono tracking-wider">CONNECTION TERMINATED</div>
        <div cl


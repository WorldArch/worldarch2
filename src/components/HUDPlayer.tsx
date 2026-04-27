import React, { useState, useEffect } from 'react';
import { Play, Square, SkipBack, SkipForward, Volume2, ListMusic } from 'lucide-react';
import { motion } from 'framer-motion';
const PLAYLIST = [
  { id: 1, title: 'NEON_DISTRICT', duration: '03:42' },
  { id: 2, title: 'SYNTH_PULSE_01', duration: '04:15' },
  { id: 3, title: 'KOWLOON_NIGHTS', duration: '02:58' },
];
export function HUDPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p + 0.5) % 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 max-w-7xl mx-auto w-full">
      {/* Controls */}
      <div className="flex items-center gap-4 bg-cyber-green/5 border border-cyber-green/20 px-6 py-3">
        <button onClick={() => setCurrentTrackIndex(prev => (prev - 1 + PLAYLIST.length) % PLAYLIST.length)}>
          <SkipBack className="w-4 h-4 hover:text-cyber-pink transition-colors" />
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 flex items-center justify-center bg-cyber-green text-system-bg hover:scale-105 transition-transform"
        >
          {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
        </button>
        <button onClick={() => setCurrentTrackIndex(prev => (prev + 1) % PLAYLIST.length)}>
          <SkipForward className="w-4 h-4 hover:text-cyber-pink transition-colors" />
        </button>
      </div>
      {/* Visualizer & Info */}
      <div className="flex-1 w-full space-y-2">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            <span className="text-[10px] tracking-[0.2em] font-bold">
              NOW_PLAYING: {PLAYLIST[currentTrackIndex].title}
            </span>
          </div>
          <span className="text-[10px] opacity-40 font-mono tracking-widest">
            {Math.floor(progress / 10).toString().padStart(2, '0')}:{(progress % 10).toString().padStart(2, '0')} / {PLAYLIST[currentTrackIndex].duration}
          </span>
        </div>
        <div className="h-1 bg-cyber-green/10 w-full relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-cyber-green shadow-[0_0_10px_#00ff41]" 
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
          {/* Frequency Bars */}
          <div className="absolute -top-6 left-0 right-0 flex items-end gap-[2px] opacity-20 pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-[2px] bg-cyber-green"
                animate={{ height: isPlaying ? [2, Math.random() * 20, 2] : 2 }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.02 }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Meta */}
      <div className="hidden lg:flex items-center gap-6 px-4 border-l border-cyber-green/20">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 opacity-40" />
          <div className="w-16 h-1 bg-cyber-green/20">
            <div className="w-3/4 h-full bg-cyber-green" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-cyber-green">
          <ListMusic className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase">PL_04</span>
        </div>
      </div>
    </div>
  );
}
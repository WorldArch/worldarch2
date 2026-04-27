import React, { useState, useEffect } from 'react';
import { Play, Square, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
const PLAYLIST = [
  { id: 1, title: 'Bubbles', duration: '03:42' },
  { id: 2, title: 'Neon_Pulse', duration: '04:15' },
  { id: 3, title: 'Sub_Trace', duration: '02:58' },
];
interface HUDPlayerProps {
  isVisible: boolean;
}
export function HUDPlayer({ isVisible }: HUDPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && isVisible) {
      interval = setInterval(() => {
        setProgress(p => (p + 0.1) % 100);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isVisible]);
  if (!isVisible) return null;
  const trackName = `SYSTEM // ${decodeURI(PLAYLIST[currentTrackIndex].title).toUpperCase()}`;
  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-fit flex flex-col items-center bg-system-bg border-b border-x border-cyber-green/40 p-2 shadow-[0_0_20px_rgba(0,255,65,0.1)]"
    >
      <div className="flex items-center gap-1 mb-2">
        <button 
          onClick={() => setCurrentTrackIndex(p => (p - 1 + PLAYLIST.length) % PLAYLIST.length)}
          className="p-btn scale-75 !px-2"
        >
          <SkipBack className="w-4 h-4 fill-current" />
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-btn scale-90"
        >
          {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        </button>
        <button 
          onClick={() => setIsPlaying(false)}
          className="p-btn scale-75 !px-2"
        >
          <Square className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setCurrentTrackIndex(p => (p + 1) % PLAYLIST.length)}
          className="p-btn scale-75 !px-2"
        >
          <SkipForward className="w-4 h-4 fill-current" />
        </button>
      </div>
      <div className="flex flex-col items-center gap-1 min-w-[240px]">
        <div className="flex justify-between w-full">
          <span className="text-[9px] font-black tracking-widest text-cyber-green hud-text">
            {trackName}
          </span>
          <span className="text-[9px] font-mono opacity-60">
            {Math.floor(progress).toString().padStart(3, '0')}%
          </span>
        </div>
        <div className="w-full h-0.5 bg-cyber-green/10 relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-cyber-green shadow-[0_0_8px_#00ff41]"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
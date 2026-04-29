import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';

// UPDATE: Added the 'url' property to point to your files in the worldarch2 public folder
const PLAYLIST = [
  { id: 1, title: 'Bubbles', duration: '03:42', url: '/Bubbles.mp3' },
  { id: 2, title: 'Soul_Breaks', duration: '02:15', url: '/soul%20breaks.mp3' },
  { id: 3, title: 'Iano_Choppers', duration: '01:58', url: '/iano%20choppers.mp3' },
  { id: 4, title: 'Ty_Who_2_Mashup', duration: '03:10', url: '/ty%20who%202%20(Mashup).mp3' },
  { id: 5, title: 'A0000002_18', duration: '00:45', url: '/A0000002%2018.WAV' },
  { id: 6, title: 'Instrumental_Master', duration: '04:20', url: '/(Instrumental).mp3' },
];


interface HUDPlayerProps {
  isVisible: boolean;
}

export function HUDPlayer({ isVisible }: HUDPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // NEW: Audio Engine Reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle Play/Pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying && isVisible) {
      audioRef.current.play().catch(e => console.log("Autoplay blocked until user clicks."));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isVisible, currentTrackIndex]);

  // Update Progress Bar based on actual audio time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, []);

  if (!isVisible) return null;

  const trackName = `SYSTEM // ${decodeURI(PLAYLIST[currentTrackIndex].title).toUpperCase()}`;

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-fit flex flex-col items-center bg-system-bg border-b border-x border-cyber-green/40 p-2 shadow-[0_0_20px_rgba(0,255,65,0.1)]"
    >
      {/* HIDDEN AUDIO ENGINE */}
      <audio 
        ref={audioRef} 
        src={PLAYLIST[currentTrackIndex].url}
        onEnded={() => setCurrentTrackIndex(p => (p + 1) % PLAYLIST.length)}
      />

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

        {/* STOP BUTTON: Pauses and Resets */}
        <button 
          onClick={() => {
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.currentTime = 0;
          }}
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';
export function HomePage() {
  const [isBooting, setIsBooting] = useState(false);
  const navigate = useNavigate();
  const handleBoot = () => {
    setIsBooting(true);
    // Simulate terminal boot sequence
    setTimeout(() => {
      navigate('/system');
    }, 1500);
  };
  return (
    <div 
      className="relative min-h-screen w-full bg-system-bg flex flex-col items-center justify-center cursor-pointer"
      onClick={handleBoot}
    >
      <div className="absolute inset-0 crt-overlay opacity-40 pointer-events-none" />
      <AnimatePresence>
        {!isBooting ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-10 text-center space-y-4"
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter hud-text animate-pulse">
              WORLDARCH
            </h1>
            <p className="text-cyber-green/40 text-[10px] tracking-[1em] uppercase">
              Click anywhere to initialize substrate
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-20 font-mono text-cyber-green text-xs space-y-1"
          >
            <p>> INITIALIZING_KERNEL_0x442</p>
            <p>> SYNCING_NEURAL_ARRAY...</p>
            <p>> DEPLOYING_HUD_OVERLAY...</p>
            <p className="animate-pulse">> ACCESS_GRANTED</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="brand-watermark !opacity-20">
        WA // SUBSTRATE_V4
      </div>
    </div>
  );
}
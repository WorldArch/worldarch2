import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
export function HomePage() {
  const [isBooting, setIsBooting] = useState(false);
  const navigate = useNavigate();
  const handleBoot = () => {
    if (isBooting) return;
    setIsBooting(true);
    // Simulate terminal boot sequence
    setTimeout(() => {
      navigate('/system');
    }, 1800);
  };
  return (
    <div
      className="relative min-h-screen w-full bg-system-bg flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      onClick={handleBoot}
    >
      <div className="absolute inset-0 crt-overlay opacity-40 pointer-events-none" />
      <AnimatePresence mode="wait">
        {!isBooting ? (
          <motion.div
            key="landing-ui"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
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
            key="booting-sequence"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-20 font-mono text-cyber-green text-xs space-y-1 w-64"
          >
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              {">"} INITIALIZING_KERNEL_0x442
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {">"} SYNCING_NEURAL_ARRAY...
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              {">"} DEPLOYING_HUD_OVERLAY...
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.8 }}
              className="animate-pulse text-white shadow-[0_0_10px_white]"
            >
              {">"} ACCESS_GRANTED
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="brand-watermark !opacity-20">
        WA // SUBSTRATE_V4
      </div>
    </div>
  );
}
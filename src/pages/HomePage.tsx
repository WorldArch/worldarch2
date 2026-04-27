import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Shield, Activity } from 'lucide-react';
export function HomePage() {
  return (
    <div className="relative min-h-screen w-full bg-system-bg overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 starfield opacity-40" />
      <div className="absolute inset-0 crt-overlay" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center space-y-8 p-6"
      >
        <div className="flex justify-center mb-12">
          <div className="relative group">
            <motion.h1 
              className="text-6xl md:text-8xl font-bold tracking-tighter hud-text animate-glitch"
              data-text="WORLDARCH"
            >
              WORLDARCH
            </motion.h1>
            <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-cyber-green opacity-50" />
          </div>
        </div>
        <p className="text-muted-foreground text-sm md:text-base tracking-[0.3em] uppercase mb-12">
          Substrate // Architectural Simulation System
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Link 
            to="/system"
            className="group relative px-12 py-4 bg-cyber-green text-system-bg font-bold tracking-widest hover:bg-cyber-green/90 transition-all flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            ACCESS_SYSTEM
            <div className="absolute -inset-1 border border-cyber-green opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-8 mt-24 opacity-40 max-w-xl mx-auto border-t border-cyber-green/20 pt-8">
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-[10px] tracking-widest">ENCRYPTED</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Activity className="w-5 h-5" />
            <span className="text-[10px] tracking-widest">STABLE</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-cyber-pink">
            <div className="w-2 h-2 rounded-full bg-cyber-pink animate-pulse" />
            <span className="text-[10px] tracking-widest">NODE_ALPHA</span>
          </div>
        </div>
      </motion.div>
      <footer className="absolute bottom-8 text-[10px] tracking-[0.5em] text-muted-foreground opacity-30">
        © 2025 WORLDARCH INDUSTRIES // SECURE TERMINAL
      </footer>
    </div>
  );
}
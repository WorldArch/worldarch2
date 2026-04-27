import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Activity, Zap, Cpu } from 'lucide-react';
const CHARACTERS = [
  { id: 'C-01', name: 'ARCH_OPERATOR', role: 'SYSTEM_ADMIN', density: 98, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
  { id: 'C-02', name: 'NEURAL_PIONEER', role: 'DATA_MINER', density: 84, url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600' },
  { id: 'C-03', name: 'FLUX_RUNNER', role: 'PROTOCOL_BREAKER', density: 92, url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600' },
  { id: 'C-04', name: 'SUBSTRATE_GHOST', role: 'ARCHITECT', density: 99, url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600' },
  { id: 'C-05', name: 'CORE_SENTINEL', role: 'SECURITY', density: 76, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600' },
  { id: 'C-06', name: 'VOID_NAVIGATOR', role: 'EXPLORER', density: 88, url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600' },
];
export function CharacterGrid() {
  const [activeBio, setActiveBio] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {CHARACTERS.map((char) => (
        <div key={char.id} className="relative group">
          <motion.div
            onClick={() => setActiveBio(activeBio === char.id ? null : char.id)}
            className="cursor-pointer border border-cyber-green/20 bg-system-bg overflow-hidden relative"
            whileHover={{ scale: 0.98 }}
          >
            <div className="aspect-[4/5] relative overflow-hidden">
              <img
                src={char.url}
                alt={char.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:grayscale group-hover:opacity-50"
              />
              <div className="absolute inset-0 pointer-events-none border-[0.5px] border-cyber-green/10" />
              <div className="absolute top-0 left-0 w-full h-[10%] bg-gradient-to-b from-cyber-green/10 to-transparent animate-scanline pointer-events-none" />
              {/* Profile Meta Overlay */}
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-system-bg/60 backdrop-blur-sm px-2 py-0.5 border border-cyber-green/20">
                <span className="text-[8px] font-bold tracking-tighter opacity-60">ID: {char.id}</span>
              </div>
            </div>
            <div className="p-3 border-t border-cyber-green/20">
              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <span className="text-[8px] text-cyber-pink font-bold tracking-widest">{char.role}</span>
                  <h3 className="text-xs font-bold tracking-tighter truncate">{char.name}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] opacity-40">COHERENCE</span>
                  <span className="text-[10px] font-mono text-cyber-green">{char.density}%</span>
                </div>
              </div>
            </div>
            {/* Neural Frequency SVG (Hover) */}
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-full h-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path
                  d="M0 5 L10 2 L20 8 L30 4 L40 7 L50 3 L60 9 L70 5 L80 8 L90 2 L100 5"
                  fill="none"
                  stroke="#00ff41"
                  strokeWidth="0.5"
                >
                  <animate attributeName="d" values="M0 5 L10 2 L20 8 L30 4 L40 7 L50 3 L60 9 L70 5 L80 8 L90 2 L100 5; M0 5 L10 8 L20 2 L30 7 L40 4 L50 9 L60 3 L70 5 L80 2 L90 8 L100 5; M0 5 L10 2 L20 8 L30 4 L40 7 L50 3 L60 9 L70 5 L80 8 L90 2 L100 5" dur="1s" repeatCount="indefinite" />
                </path>
              </svg>
            </div>
          </motion.div>
          <AnimatePresence>
            {activeBio === char.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 z-10 bg-system-bg/95 border border-cyber-green p-4 flex flex-col gap-4 overflow-hidden pointer-events-none"
              >
                <div className="flex items-center gap-2 border-b border-cyber-green/40 pb-2">
                  <User className="w-4 h-4" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Bio_Terminal</span>
                </div>
                <div className="space-y-3 font-mono text-[9px] uppercase">
                  <div className="flex justify-between">
                    <span className="opacity-40">Synaptic_Density:</span>
                    <span>High_Bandwidth</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-40">Node_Coherence:</span>
                    <span className="text-cyber-green">Stable</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-40">Origin_Trace:</span>
                    <span>Sector_G7</span>
                  </div>
                </div>
                <div className="mt-auto pt-2 border-t border-cyber-green/40 grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center gap-1 opacity-60">
                    <Activity className="w-3 h-3" />
                    <span className="text-[8px]">VIT_01</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-60">
                    <Zap className="w-3 h-3" />
                    <span className="text-[8px]">PWR_84</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-60">
                    <Cpu className="w-3 h-3" />
                    <span className="text-[8px]">LOGIC</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
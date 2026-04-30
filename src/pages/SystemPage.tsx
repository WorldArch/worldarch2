import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemSidebar } from '@/components/SystemSidebar';
import { HUDPlayer } from '@/components/HUDPlayer';
import { DesignGrid } from '@/components/DesignGrid';
import { FashionGrid } from '@/components/FashionGrid';
import { CharacterGrid } from '@/components/CharacterGrid';
import { SynthesisLab } from '@/components/SynthesisLab';
import { StarfieldCanvas } from '@/components/StarfieldCanvas';
import { Activity, Database, Cpu } from 'lucide-react';

type Section = 'SYNTHESIS' | 'CONCEPTS' | 'FASHION' | 'CHARACTER' | 'SYSTEM';

export function SystemPage() {
  const [activeSection, setActiveSection] = useState<Section>('SYNTHESIS');

  return (
    /* 
       Outer wrapper is locked to screen height (h-screen) 
       to prevent the whole browser window from bouncing. 
    */
    <div className="h-screen w-full bg-system-bg text-cyber-green relative flex overflow-hidden font-mono">
      <StarfieldCanvas />
      
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 crt-overlay pointer-events-none z-[50]" />
      
      {/* Fixed UI Elements */}
      <HUDPlayer isVisible={true} />
      
      <SystemSidebar
        activeSection={activeSection}
        onSectionChange={(s) => setActiveSection(s as Section)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pt-20 relative">
        
        {/* Persistent Header */}
        <header className="h-12 border-b border-cyber-green/20 flex items-center justify-between px-8 bg-black/40 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black tracking-widest uppercase opacity-60">
              SECTOR // {activeSection}
            </span>
            <Activity className="w-3 h-3 text-cyber-pink animate-pulse" />
          </div>
          
          <div className="flex items-center gap-6 opacity-40">
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3" />
              <span className="text-[9px]">DB_84%</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3" />
              <span className="text-[9px]">LOAD_12%</span>
            </div>
          </div>
        </header>

        {/* 
            Scrollable Container: 
            This is the "window" that allows the grids to scroll. 
        */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-7xl mx-auto px-6 py-8 min-h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                {activeSection === 'SYNTHESIS' && <SynthesisLab />}
                {activeSection === 'CONCEPTS' && <DesignGrid />}
                {activeSection === 'FASHION' && <FashionGrid />}
                {activeSection === 'CHARACTER' && <CharacterGrid />}
                
                {activeSection === 'SYSTEM' && (
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="p-4 border border-cyber-green/20 bg-cyber-green/5">
                        <p className="text-[10px] font-mono mb-2">MODULE_STATUS_0{i}</p>
                        <div className="h-1 bg-cyber-green/20 w-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-cyber-green" 
                            animate={{ x: ['-100%', '100%'] }} 
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Global Branding Overlay */}
        <div className="brand-watermark pointer-events-none opacity-20">
          WORLDARCH // OS_SUBSTRATE
        </div>
      </main>
    </div>
  );
}

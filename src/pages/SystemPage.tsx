import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemSidebar } from '@/components/SystemSidebar';
import { HUDPlayer } from '@/components/HUDPlayer';
import { DesignGrid } from '@/components/DesignGrid';
import { FashionGrid } from '@/components/FashionGrid';
import { CharacterGrid } from '@/components/CharacterGrid';
import { SynthesisLab } from '@/components/SynthesisLab';
import { StarfieldCanvas } from '@/components/StarfieldCanvas';
import { Activity, Database, Cpu, Terminal } from 'lucide-react';
type Section = 'SYNTHESIS' | 'CONCEPTS' | 'FASHION' | 'CHARACTER' | 'SYSTEM';
export function SystemPage() {
  const [activeSection, setActiveSection] = useState<Section>('SYNTHESIS');
  return (
    <div className="min-h-screen bg-system-bg text-cyber-green relative flex overflow-hidden">
      <StarfieldCanvas />
      <div className="absolute inset-0 crt-overlay pointer-events-none" />
      <HUDPlayer isVisible={true} />
      <SystemSidebar
        activeSection={activeSection}
        onSectionChange={(s) => setActiveSection(s as Section)}
      />
      <main className="flex-1 flex flex-col min-w-0 pt-20">
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
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-7xl mx-auto px-6 py-8 h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col h-full"
              >
                {activeSection === 'SYNTHESIS' && <SynthesisLab />}
                {activeSection === 'CONCEPTS' && <DesignGrid />}
                {activeSection === 'FASHION' && <FashionGrid />}
                {activeSection === 'CHARACTER' && <CharacterGrid />}
                {activeSection === 'SYSTEM' && (
                  <div className="grid grid-cols-2 gap-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="p-4 border border-cyber-green/20 bg-cyber-green/5">
                        <p className="text-[10px] font-mono mb-2">MODULE_STATUS_0{i}</p>
                        <div className="h-1 bg-cyber-green/20 w-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-cyber-green" 
                            animate={{ x: ['-100%', '100%'] }} 
                            transition={{ duration: 2, repeat: Infinity }}
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
        <div className="brand-watermark">
          WORLDARCH // OS_SUBSTRATE
        </div>
      </main>
    </div>
  );
}
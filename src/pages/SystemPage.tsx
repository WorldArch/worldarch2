import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemSidebar } from '@/components/SystemSidebar';
import { HUDPlayer } from '@/components/HUDPlayer';
import { DesignGrid } from '@/components/DesignGrid';
import { FashionGrid } from '@/components/FashionGrid';
import { Activity, Database, Cpu } from 'lucide-react';
type Section = 'CONCEPTS' | 'FASHION' | 'CHARACTER' | 'SYSTEM';
export function SystemPage() {
  const [activeSection, setActiveSection] = useState<Section>('CONCEPTS');
  return (
    <div className="min-h-screen bg-system-bg text-cyber-green selection:bg-cyber-green/30 relative flex overflow-hidden">
      <div className="absolute inset-0 starfield opacity-20 pointer-events-none" />
      <div className="absolute inset-0 crt-overlay pointer-events-none" />
      <SystemSidebar 
        activeSection={activeSection} 
        onSectionChange={(s) => setActiveSection(s as Section)} 
      />
      <main className="flex-1 flex flex-col min-w-0">
        {/* Persistent Header */}
        <header className="h-16 border-b border-cyber-green/20 flex items-center justify-between px-8 bg-system-bg/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-widest opacity-40 uppercase">Operation Mode</span>
              <span className="text-sm font-bold tracking-widest">PORTFOLIO_SURVEILLANCE</span>
            </div>
            <div className="h-8 w-[1px] bg-cyber-green/20" />
            <div className="flex items-center gap-2 text-cyber-pink">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-bold tracking-tighter">SYS_LIVE</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 opacity-40" />
              <span className="text-[10px] opacity-40">STORAGE: 84%</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 opacity-40" />
              <span className="text-[10px] opacity-40">CPU_LOAD: 12%</span>
            </div>
          </div>
        </header>
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-bold tracking-tighter mb-2 flex items-center gap-3">
                    <span className="opacity-20">//</span>
                    {activeSection}
                  </h2>
                  <div className="w-24 h-1 bg-cyber-green" />
                </div>
                {activeSection === 'CONCEPTS' && <DesignGrid />}
                {activeSection === 'FASHION' && <FashionGrid />}
                {activeSection === 'CHARACTER' && (
                  <div className="h-[60vh] border border-dashed border-cyber-green/20 flex items-center justify-center flex-col gap-4">
                    <Activity className="w-12 h-12 opacity-20" />
                    <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
                      Character Subsystem Offline // Awaiting Logic Patch
                    </p>
                  </div>
                )}
                {activeSection === 'SYSTEM' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="p-6 border border-cyber-green/20 bg-cyber-green/5 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] tracking-widest opacity-60 uppercase">Kernel_{i}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-cyber-green text-system-bg font-bold">READY</span>
                          </div>
                          <div className="h-1 w-full bg-cyber-green/10">
                            <motion.div 
                              className="h-full bg-cyber-green" 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.random() * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {/* Footer HUD */}
        <footer className="border-t border-cyber-green/20 bg-system-bg/95 p-4 z-10">
          <HUDPlayer />
        </footer>
      </main>
    </div>
  );
}
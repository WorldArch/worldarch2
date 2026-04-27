import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemSidebar } from '@/components/SystemSidebar';
import { HUDPlayer } from '@/components/HUDPlayer';
import { DesignGrid } from '@/components/DesignGrid';
import { FashionGrid } from '@/components/FashionGrid';
import { CharacterGrid } from '@/components/CharacterGrid';
import { Activity, Database, Cpu, Terminal } from 'lucide-react';
type Section = 'CONCEPTS' | 'FASHION' | 'CHARACTER' | 'SYSTEM';
const LOG_EVENTS = [
  "CACHE_PURGE_SUCCESSFUL",
  "NEURAL_LINK_ESTABLISHED",
  "SUBSTRATE_OPTIMIZED",
  "SYNAPTIC_ARRAY_RELOADED",
  "KERNEL_INTEGRITY_VERIFIED",
  "NODAL_DENSITY_SURGE_DETECTED",
  "VOID_SCAN_COMPLETE",
  "TRACE_CLEANUP_INITIATED"
];
export function SystemPage() {
  const [activeSection, setActiveSection] = useState<Section>('CONCEPTS');
  const [logs, setLogs] = useState<string[]>(["SYSTEM_INITIALIZED", "AWAITING_INPUT"]);
  const logEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      const event = LOG_EVENTS[Math.floor(Math.random() * LOG_EVENTS.length)];
      const timestamp = new Date().toLocaleTimeString([], { hour12: false });
      setLogs(prev => [...prev.slice(-15), `[${timestamp}] ${event}`]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);
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
              <span className="text-[10px] opacity-40 uppercase">STORAGE: 84%</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 opacity-40" />
              <span className="text-[10px] opacity-40 uppercase">CPU_LOAD: 12%</span>
            </div>
          </div>
        </header>
        {/* Content Area - UI RUBRIC CONFORMANCE */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10 flex justify-between items-end border-b border-cyber-green/10 pb-4">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tighter mb-2 flex items-center gap-3">
                      <span className="opacity-20">//</span>
                      {activeSection}
                    </h2>
                    <div className="w-24 h-1 bg-cyber-green" />
                  </div>
                  <span className="text-[10px] opacity-40 font-mono hidden md:block">SUBSTRATE_SECTOR_0{activeSection.length}</span>
                </div>
                {activeSection === 'CONCEPTS' && <DesignGrid />}
                {activeSection === 'FASHION' && <FashionGrid />}
                {activeSection === 'CHARACTER' && <CharacterGrid />}
                {activeSection === 'SYSTEM' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="p-6 border border-cyber-green/20 bg-cyber-green/5 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] tracking-widest opacity-60 uppercase font-bold">Kernel_{i}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-cyber-green text-system-bg font-bold">READY</span>
                          </div>
                          <div className="h-1 w-full bg-cyber-green/10">
                            <motion.div
                              className="h-full bg-cyber-green"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.random() * 100}%` }}
                              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Kernel Log Terminal */}
                    <div className="lg:col-span-1 border border-cyber-green/20 bg-system-bg/60 backdrop-blur-sm p-4 flex flex-col h-[500px]">
                      <div className="flex items-center gap-2 mb-4 border-b border-cyber-green/20 pb-2">
                        <Terminal className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-widest">KERNEL_LOG</span>
                      </div>
                      <div className="flex-1 font-mono text-[10px] overflow-y-auto space-y-2 opacity-80 custom-scrollbar pr-2">
                        {logs.map((log, i) => (
                          <div key={i} className={i === logs.length - 1 ? "text-cyber-green animate-pulse" : "text-cyber-green/60"}>
                            {log}
                          </div>
                        ))}
                        <div ref={logEndRef} />
                      </div>
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
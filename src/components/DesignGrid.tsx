import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
const DESIGNS = [
  { id: '1', title: 'ARCHITECTURE_MASTER', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200', tag: 'STRUCTURAL' },
  { id: '2', title: 'MATERIAL_AUDIT', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200', tag: 'SURFACE' },
  { id: '3', title: 'STROBE_ANALYSIS', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200', tag: 'LIGHTING' },
  { id: '4', title: 'EVOLUTION_TRACE', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200', tag: 'CORE' },
  { id: '5', title: 'FLUX_SCHEMA', url: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&q=80&w=1200', tag: 'DATA' },
  { id: '6', title: 'NODAL_NETWORK', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200', tag: 'CONNECT' },
];
export function DesignGrid() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);
  return (
    <div className="relative">
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-6 design-transition",
        selectedId && "opacity-20 blur-sm pointer-events-none"
      )}>
        {DESIGNS.map((item) => (
          <motion.div
            key={item.id}
            layoutId={`card-${item.id}`}
            onClick={() => setSelectedId(item.id)}
            className="group relative aspect-square border border-cyber-green/20 overflow-hidden cursor-pointer bg-cyber-green/5"
          >
            <img 
              src={item.url} 
              alt={item.title} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-system-bg to-transparent opacity-60" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[8px] tracking-[0.3em] opacity-40">{item.tag}</span>
                <h3 className="text-xs font-bold tracking-widest">{item.title}</h3>
              </div>
              <ZoomIn className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-cyber-green/40 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-system-bg/60 backdrop-blur-md z-[4999]"
              onClick={() => setSelectedId(null)}
            />
            <motion.div
              layoutId={`card-${selectedId}`}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] z-[5000] border-2 border-cyber-green bg-system-bg overflow-hidden shadow-[0_0_50px_rgba(0,255,65,0.3)]"
            >
              <img 
                src={DESIGNS.find(d => d.id === selectedId)?.url} 
                alt="Selected" 
                className="w-full h-full object-cover scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-system-bg via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-10 left-10 space-y-2">
                <span className="px-2 py-1 bg-cyber-green text-system-bg text-[10px] font-bold tracking-[0.5em]">ACTIVE_FOCUS</span>
                <h2 className="text-4xl font-bold tracking-tighter">
                  {DESIGNS.find(d => d.id === selectedId)?.title}
                </h2>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                className="absolute top-6 right-6 p-2 bg-cyber-green text-system-bg hover:scale-110 transition-transform"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
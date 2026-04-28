import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
const DESIGNS = [
  { id: '1', title: 'CHASSIS_GEOMETRY', tag: 'REF_01', desc: '[ WIDE CHASSIS ] 12% LATERAL FLARE', url: '/evolution-audit.png' },
  { id: '2', title: 'SURFACE_TOPOLOGY', tag: 'REF_02', desc: '[ CARBON_REINFORCED ] HIGH DENSITY', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200' },
  { id: '3', title: 'LIGHT_FLUX_MAP', tag: 'REF_03', desc: '[ OPTIC_ARRAY ] 450NM EMISSION', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200' },
  { id: '4', title: 'CORE_CHASSIS', tag: 'REF_04', desc: '[ INTERNAL_STRUT ] VERTICAL ALIGN', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200' },
];
export function DesignGrid() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {DESIGNS.map((item) => (
        <div 
          key={item.id}
          className="group cursor-pointer space-y-2"
          onClick={() => setSelectedId(item.id)}
        >
          <div className="aspect-video border border-cyber-green/20 overflow-hidden relative">
            <img src={item.url} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-[8px] font-bold tracking-widest text-cyber-green border border-cyber-green/40">
              {item.tag} // {item.title}
            </div>
          </div>
          <div className="flex justify-between border-b border-cyber-green/10 pb-1">
            <span className="text-[9px] font-mono text-cyber-green/60 uppercase">{item.desc}</span>
            <span className="text-[9px] font-black text-cyber-green opacity-40">SLIM_LINE</span>
          </div>
        </div>
      ))}
      <AnimatePresence>
        {selectedId && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
              onClick={() => setSelectedId(null)}
            />
            <motion.div 
              layoutId={selectedId}
              className="relative max-w-[950px] w-full bg-system-bg border border-cyber-green shadow-[0_0_50px_rgba(0,255,65,0.2)]"
            >
              <img 
                src={DESIGNS.find(d => d.id === selectedId)?.url} 
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-3xl font-black tracking-tighter text-cyber-green uppercase">
                    {DESIGNS.find(d => d.id === selectedId)?.title}
                  </h2>
                  <button onClick={() => setSelectedId(null)} className="p-btn !p-1"><X /></button>
                </div>
                <div className="border-l-4 border-cyber-green pl-4 font-mono text-xs opacity-80">
                  <p>{DESIGNS.find(d => d.id === selectedId)?.desc}</p>
                  <p className="mt-2 text-cyber-pink">STABILITY_CHECK: PASSED</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

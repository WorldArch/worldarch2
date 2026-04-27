import React from 'react';
import { motion } from 'framer-motion';
const FASHION_DATA = [
  { id: 1, title: 'CORE_VEST_V1', tag: 'OUTERWEAR', url: 'https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'NEURAL_HOOD', tag: 'HEADGEAR', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'TECH_CARGO_PANTS', tag: 'UTILITY', url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'VISUAL_INTERFACE', tag: 'OPTIC', url: 'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&q=80&w=800' },
  { id: 5, title: 'SIGNAL_BOOTS', tag: 'FOOTWEAR', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
  { id: 6, title: 'DATA_STRAP', tag: 'ACCESSORY', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
];
export function FashionGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {FASHION_DATA.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative space-y-4"
        >
          <div className="aspect-[3/4] border border-cyber-green/20 overflow-hidden bg-cyber-green/5">
            <img 
              src={item.url} 
              alt={item.title} 
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 border border-cyber-green/0 group-hover:border-cyber-green/40 transition-all m-2" />
          </div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] tracking-[0.3em] text-cyber-pink font-bold">{item.tag}</span>
              <h3 className="text-sm font-bold tracking-widest">{item.title}</h3>
            </div>
            <div className="text-[10px] opacity-40 font-mono">
              REV_2025
            </div>
          </div>
          <div className="h-[1px] w-0 bg-cyber-green group-hover:w-full transition-all duration-500 opacity-40" />
        </motion.div>
      ))}
    </div>
  );
}
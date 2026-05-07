import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
interface FashionItem {
  url: string;
  label: string;
}
export function FashionGrid() {
  const [items, setItems] = useState<FashionItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/fashion.json')
      .then(res => res.json())
      .then(data => {
        setItems(data.images);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fashion fetch failed", err);
        setLoading(false);
      });
  }, []);
  if (loading) return <div className="text-cyber-green animate-pulse">FETCHING_FASHION_DUMP...</div>;
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="group relative border border-cyber-green/20 bg-system-bg overflow-hidden"
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={item.url}
              alt={item.label}
              className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
            />
          </div>
          <div className="p-2 border-t border-cyber-green/20 flex justify-between items-center bg-black/80">
            <span className="text-[10px] font-black tracking-widest text-cyber-green">
              {item.label}
            </span>
            <span className="text-[8px] opacity-40">REV_2025</span>
          </div>
          <div className="absolute inset-0 border border-transparent group-hover:border-white/20 pointer-events-none transition-all" />
        </motion.div>
      ))}
    </div>
  );
}

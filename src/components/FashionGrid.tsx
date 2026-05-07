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
    // FIX: Added './' and 'images/' to match your GitHub structure
    fetch('./images/fashion.json')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        // Ensure this matches your JSON structure (e.g., if data is the array itself)
        const fashionData = Array.isArray(data) ? data : data.images;
        setItems(fashionData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fashion fetch failed", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-cyber-green animate-pulse p-4">FETCHING_FASHION_DUMP...</div>;

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="group relative border border-cyber-green/20 bg-[#050505] overflow-hidden"
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={item.url}
              alt={item.label}
              className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=IMAGE_NOT_FOUND';
              }}
            />
          </div>
          <div className="p-2 border-t border-cyber-green/20 flex justify-between items-center bg-black/80">
            <span className="text-[10px] font-black tracking-widest text-cyber-green uppercase">
              {item.label}
            </span>
            <span className="text-[8px] opacity-40">REV_2026</span>
          </div>
          {/* Industrial Overlay Effect */}
          <div className="absolute inset-0 border border-transparent group-hover:border-cyber-green/30 pointer-events-none transition-all" />
        </motion.div>
      ))}
    </div>
  );
}

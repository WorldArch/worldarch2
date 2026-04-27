import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Download, RefreshCw, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
interface IllustrationEaselProps {
  imageUrl: string | null;
  isGenerating: boolean;
}
export function IllustrationEasel({ imageUrl, isGenerating }: IllustrationEaselProps) {
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `fableforge-masterpiece-${Date.now()}.jpg`;
    link.target = "_blank";
    link.click();
    toast.success("Masterpiece saved to your vault!");
  };
  return (
    <div className="w-full h-full flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-[radial-gradient(#2D2B2A_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-95">
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center space-y-6 z-10"
          >
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#F38020"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-draw"
                  style={{ strokeDasharray: 283, strokeDashoffset: 283 }}
                />
                <foreignObject x="25" y="25" width="50" height="50">
                  <div className="w-full h-full flex items-center justify-center">
                    <Palette className="w-12 h-12 text-[#F38020] animate-bounce" />
                  </div>
                </foreignObject>
              </svg>
            </div>
            <p className="font-display text-3xl text-[#2D2B2A] italic animate-pulse">
              Stroking the canvas...
            </p>
          </motion.div>
        ) : imageUrl ? (
          <motion.div
            key="artwork"
            initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="w-full max-w-2xl relative group"
          >
            <div className="sketchy-box bg-white p-4 md:p-8 relative">
              <div className="aspect-[4/5] md:aspect-square border-4 border-[#2D2B2A] overflow-hidden rounded-sm relative bg-[#FDFBF7]">
                <img
                  src={imageUrl}
                  alt="FableForge Illustration"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge className="bg-[#F38020] text-white border-none font-bold uppercase tracking-widest shadow-md">
                    Original Work
                  </Badge>
                </div>
              </div>
              {/* Interaction Overlay */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="font-display text-xl text-[#2D2B2A] brush-underline">Hand-crafted Wonder</span>
                  <span className="text-xs text-muted-foreground font-serif uppercase tracking-tighter">Mixed Media • FableForge Studio</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={handleDownload}
                    className="sketchy-box border-[#2D2B2A] hover:bg-[#FDFBF7] transition-all"
                  >
                    <Download className="w-5 h-5 text-[#2D2B2A]" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-12 left-0 right-0 text-center">
              <p className="font-display text-muted-foreground italic text-lg">
                &ldquo;Refined in the Forge of Imagination&rdquo;
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-60 transition-all duration-500"
          >
            <div className="w-48 h-48 mx-auto sketchy-box flex items-center justify-center bg-white border-dashed">
              <ImageIcon className="w-20 h-20 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-4xl text-[#2D2B2A]">The Empty Easel</h2>
              <p className="font-serif italic text-xl">Describe a spark, and I shall build the fire.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
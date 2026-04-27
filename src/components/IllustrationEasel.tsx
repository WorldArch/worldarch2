import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Download, Palette, ShieldCheck, Sparkles } from 'lucide-react';
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
    toast.success("Masterpiece archived!");
  };
  return (
    <div className="w-full h-full flex items-center justify-center p-8 md:p-16 relative overflow-hidden bg-[radial-gradient(#2D2B2A_1px,transparent_1px)] [background-size:32px_32px] opacity-95">
      <div className="absolute inset-0 canvas-texture opacity-30 pointer-events-none" />
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center space-y-8 z-10"
          >
            <div className="relative w-56 h-56 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#F38020"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="animate-draw"
                  style={{ strokeDasharray: 283, strokeDashoffset: 283 }}
                />
                <foreignObject x="25" y="25" width="50" height="50">
                  <div className="w-full h-full flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Palette className="w-16 h-16 text-[#F38020]" />
                    </motion.div>
                  </div>
                </foreignObject>
              </svg>
            </div>
            <div className="space-y-2">
              <p className="font-display text-4xl text-[#2D2B2A] italic">Mixing Pigments...</p>
              <p className="font-serif text-muted-foreground italic text-lg">The story is taking shape on the parchment</p>
            </div>
          </motion.div>
        ) : imageUrl ? (
          <motion.div
            key="artwork"
            initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="w-full max-w-3xl relative group"
          >
            <div className="sketchy-box gold-leaf-border bg-white p-6 md:p-10 relative shadow-2xl">
              <div className="aspect-square border-4 border-[#2D2B2A] overflow-hidden rounded-sm relative bg-[#FDFBF7] shadow-inner">
                <img
                  src={imageUrl}
                  alt="FableForge Illustration"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 canvas-texture opacity-20 pointer-events-none" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge className="bg-[#F38020] text-white border-none font-bold uppercase tracking-widest shadow-lg px-3 py-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Authentic Fable
                  </Badge>
                </div>
                {/* Signature area */}
                <div className="absolute bottom-6 right-6 artisan-signature text-2xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] opacity-90">
                  FableForge
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between gap-6">
                <div className="flex flex-col">
                  <span className="font-display text-2xl text-[#2D2B2A] brush-underline pb-1">Hand-drawn Masterpiece</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-[#F38020]/10 text-[#F38020] border-[#F38020]/20 font-serif">
                      Medium: Storybook Sketch
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-serif uppercase tracking-widest">Mixed Media • London Studio</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={handleDownload}
                  className="btn-storybook h-14 px-8 bg-[#2D2B2A] hover:bg-[#403E3D] text-white shadow-xl"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Save to Vault
                </Button>
              </div>
            </div>
            <div className="absolute -bottom-16 left-0 right-0 text-center opacity-60">
              <p className="font-display text-muted-foreground italic text-xl">
                &ldquo;A tale captured in time and ink&rdquo;
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-8 opacity-40 hover:opacity-70 transition-all duration-700"
          >
            <div className="w-56 h-56 mx-auto sketchy-box flex flex-col items-center justify-center bg-white border-dashed bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]">
              <ImageIcon className="w-24 h-24 text-muted-foreground mb-4" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span className="font-serif italic text-sm">Empty Easel</span>
              </div>
            </div>
            <div className="space-y-4 max-w-sm mx-auto">
              <h2 className="font-display text-4xl text-[#2D2B2A]">The Unfinished Tale</h2>
              <p className="font-serif italic text-xl leading-relaxed">
                Describe a brave hero, a mystical land, or a curious beast to begin the forge.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
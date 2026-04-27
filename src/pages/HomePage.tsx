import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Paintbrush, Sparkles, BookOpen } from 'lucide-react';
import Masonry from 'react-masonry-css';
const MOCK_GALLERY = [
  "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1490312278390-ab6414ef8bb9?auto=format&fit=crop&q=80&w=800",
];
export function HomePage() {
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };
  return (
    <div className="min-h-screen bg-[#FDFBF7] selection:bg-[#F38020]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-20 lg:py-24 space-y-16">
          {/* Hero Section */}
          <header className="text-center space-y-6 max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full border-2 border-[#2D2B2A] bg-white text-sm font-bold uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 text-[#F38020]" />
              Artisan AI Studio
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-display text-[#2D2B2A] leading-none"
            >
              Fable <span className="text-[#F38020]">Forge</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground italic font-serif"
            >
              Where every whisper of imagination becomes a hand-drawn wonder.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <Link to="/studio" className="btn-storybook text-xl">
                Enter the Studio
                <Paintbrush className="ml-2 w-6 h-6" />
              </Link>
            </motion.div>
          </header>
          {/* Gallery Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b-2 border-[#2D2B2A] pb-4">
              <h2 className="text-3xl font-display text-[#2D2B2A]">The Illustrator's Vault</h2>
              <div className="flex items-center gap-2 text-sm font-bold font-serif uppercase tracking-widest text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                Latest Generations
              </div>
            </div>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex -ml-6 w-auto"
              columnClassName="pl-6 bg-clip-padding"
            >
              {MOCK_GALLERY.map((url, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="mb-6"
                >
                  <div className="sketchy-box overflow-hidden group">
                    <img 
                      src={url} 
                      alt={`Illustration ${i}`} 
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </motion.div>
              ))}
            </Masonry>
          </section>
          <footer className="text-center pt-12 border-t-2 border-[#2D2B2A]/10">
            <p className="text-muted-foreground font-serif italic">
              Note: FableForge uses high-whimsy AI algorithms. Request limits apply to preserve the magic.
            </p>
            <p className="text-xs mt-4 opacity-50">Powered by Cloudflare Agents & Imaginative Tools</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
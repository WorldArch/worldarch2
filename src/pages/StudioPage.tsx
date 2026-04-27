import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Sparkles, User, Palette, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}
export function StudioPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to the Forge, Storyteller. I am your Art Director. What whimsical scene shall we bring to life today?",
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);
    // Mock response
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Marvelous choice! I've sketched a "storybook style" rendition of your request. How does it look?`,
      };
      setMessages(prev => [...prev, assistantMsg]);
      setCurrentImage('https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=1200');
      setIsGenerating(false);
    }, 2000);
  };
  return (
    <div className="h-screen bg-[#FDFBF7] flex flex-col">
      {/* Studio Header */}
      <header className="h-16 border-b-2 border-[#2D2B2A] bg-white px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-[#F38020]" />
            <h1 className="text-2xl font-display">Illustration Studio</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-[#2D2B2A] font-serif italic px-3 py-1">
            Art Director Active
          </Badge>
        </div>
      </header>
      {/* Main Content Pane */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Chat Side (Art Director) */}
        <section className="w-full md:w-[400px] border-r-2 border-[#2D2B2A] flex flex-col bg-white/50 backdrop-blur-sm">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 border-[#2D2B2A] flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#F38020]' : 'bg-white'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-[#F38020]" />}
                  </div>
                  <div className={`p-4 sketchy-box ${msg.role === 'user' ? 'bg-muted' : 'bg-white'}`}>
                    <p className="text-sm font-serif leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {isGenerating && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-[#2D2B2A] bg-white flex items-center justify-center animate-bounce">
                    <Palette className="w-4 h-4 text-[#F38020]" />
                  </div>
                  <div className="p-4 sketchy-box bg-white italic font-serif">
                    Mixing pigments...
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t-2 border-[#2D2B2A] bg-white">
            <div className="relative">
              <Input
                placeholder="Describe your storybook scene..."
                className="pr-12 h-14 font-serif text-lg border-2 border-[#2D2B2A] rounded-xl focus-visible:ring-[#F38020]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button 
                onClick={handleSend}
                size="icon" 
                className="absolute right-2 top-2 h-10 w-10 bg-[#F38020] hover:bg-[#D14615] rounded-lg"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
        {/* Right: The Easel (Canvas) */}
        <section className="hidden md:flex flex-1 items-center justify-center p-8 bg-[#FDFBF7] relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
               style={{backgroundImage: 'radial-gradient(#2D2B2A 0.5px, transparent 0.5px)', backgroundSize: '16px 16px'}} />
          <AnimatePresence mode="wait">
            {currentImage ? (
              <motion.div
                key={currentImage}
                initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-2xl aspect-[4/5] md:aspect-square relative sketchy-box bg-white p-6"
              >
                <div className="w-full h-full border-2 border-[#2D2B2A]/20 overflow-hidden rounded-sm relative">
                  <img 
                    src={currentImage} 
                    alt="Latest Illustration" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[#F38020] text-white border-none font-bold uppercase">Original Work</Badge>
                  </div>
                </div>
                <div className="absolute -bottom-10 left-0 right-0 text-center font-display text-muted-foreground italic">
                  &ldquo;Refined in the Forge of Imagination&rdquo;
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center space-y-4"
              >
                <div className="w-32 h-32 mx-auto sketchy-box flex items-center justify-center bg-white opacity-40">
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="font-display text-2xl text-muted-foreground italic">Your blank parchment awaits...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Palette, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { LibrarySidebar } from '@/components/LibrarySidebar';
import { chatService, parseToolResult } from '@/lib/chat';
import { IllustrationEasel } from '@/components/IllustrationEasel';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import type { Message } from '../../worker/types';
export function StudioPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [currentArtwork, setCurrentArtwork] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState(chatService.getSessionId());
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    loadMessages();
  }, [activeSessionId]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingText]);
  const loadMessages = async () => {
    const res = await chatService.getMessages();
    if (res.success && res.data) {
      setMessages(res.data.messages);
      const lastToolMsg = [...res.data.messages].reverse().find(m => 
        m.toolCalls?.some(tc => tc.name === 'generate_illustration')
      );
      if (lastToolMsg) {
        const toolCall = lastToolMsg.toolCalls?.find(tc => tc.name === 'generate_illustration');
        const url = parseToolResult(toolCall);
        if (url) setCurrentArtwork(url);
      } else {
        setCurrentArtwork(null);
      }
    }
  };
  const handleSessionSelect = (id: string) => {
    chatService.setSession(id);
    setActiveSessionId(id);
  };
  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    const userMessage = input.trim();
    setInput('');
    setIsProcessing(true);
    setStreamingText('');
    const tempUserMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    try {
      await chatService.sendMessage(userMessage, undefined, (chunk) => {
        setStreamingText(prev => prev + chunk);
      });
      const res = await chatService.getMessages();
      if (res.success && res.data) {
        setMessages(res.data.messages);
        setStreamingText('');
        const lastMsg = res.data.messages[res.data.messages.length - 1];
        const toolCall = lastMsg.toolCalls?.find(tc => tc.name === 'generate_illustration');
        if (toolCall) {
          const url = parseToolResult(toolCall);
          if (url) {
            setCurrentArtwork(url);
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#F38020', '#FDFBF7', '#2D2B2A']
            });
          }
        }
      }
    } catch (err) {
      toast.error("The pigments have dried up. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen overflow-hidden bg-[#FDFBF7]">
        <LibrarySidebar onSessionSelect={handleSessionSelect} currentSessionId={activeSessionId} />
        <SidebarInset className="flex flex-col bg-transparent relative">
          <header className="h-16 border-b-2 border-[#2D2B2A] bg-white/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20 sticky top-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-[#2D2B2A]" />
              <div className="flex items-center gap-2">
                <Palette className="w-6 h-6 text-[#F38020]" />
                <h1 className="text-2xl font-display">Illustration Studio</h1>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:inline-flex border-[#2D2B2A] font-serif italic px-3 py-1">
              {isProcessing ? "Director is Painting..." : "Art Director Active"}
            </Badge>
          </header>
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full max-w-full">
            {/* Chat Pane */}
            <section className="w-full lg:w-[450px] flex flex-col bg-white/30 backdrop-blur-sm border-r-2 border-[#2D2B2A] overflow-hidden order-2 lg:order-1">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-8 pb-4">
                  {messages.length === 0 && !isProcessing && (
                    <div className="text-center py-12 space-y-4 opacity-40">
                      <Sparkles className="w-12 h-12 mx-auto text-[#F38020]" />
                      <p className="font-serif italic text-lg px-8">Every masterpiece begins with a single word. What shall we draw today?</p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-full border-2 border-[#2D2B2A] flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#F38020]' : 'bg-white'}`}>
                        {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-[#F38020]" />}
                      </div>
                      <div className={`p-5 sketchy-box max-w-[85%] ${msg.role === 'user' ? 'bg-[#FDFBF7]' : 'bg-white'}`}>
                        <p className="text-base font-serif leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {streamingText && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full border-2 border-[#2D2B2A] bg-white flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-[#F38020]" />
                      </div>
                      <div className="p-5 sketchy-box bg-white max-w-[85%]">
                        <p className="text-base font-serif leading-relaxed whitespace-pre-wrap">{streamingText}</p>
                      </div>
                    </div>
                  )}
                  {isProcessing && !streamingText && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full border-2 border-[#2D2B2A] bg-white flex items-center justify-center animate-bounce">
                        <Palette className="w-5 h-5 text-[#F38020]" />
                      </div>
                      <div className="p-4 sketchy-box bg-white italic font-serif text-sm">
                        Preparing the easel...
                      </div>
                    </motion.div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
              <div className="p-6 border-t-2 border-[#2D2B2A] bg-white shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
                <div className="relative">
                  <Input
                    placeholder="Describe your vision..."
                    className="pr-14 h-16 font-serif text-lg border-2 border-[#2D2B2A] rounded-xl focus-visible:ring-[#F38020] bg-[#FDFBF7]"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={handleSend}
                    size="icon"
                    disabled={isProcessing || !input.trim()}
                    className="absolute right-3 top-3 h-10 w-10 bg-[#F38020] hover:bg-[#D14615] rounded-lg transition-transform hover:scale-110 active:scale-95"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </section>
            {/* Easel Pane */}
            <section className="flex-1 min-h-0 bg-[#FDFBF7] overflow-hidden order-1 lg:order-2">
              <IllustrationEasel imageUrl={currentArtwork} isGenerating={isProcessing} />
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
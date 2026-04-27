import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Palette, ArrowLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { chatService, parseToolResult } from '@/lib/chat';
import { IllustrationEasel } from '@/components/IllustrationEasel';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import type { Message, ChatState } from '../../worker/types';
export function StudioPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [currentArtwork, setCurrentArtwork] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = chatService.getSessionId();
  useEffect(() => {
    loadMessages();
  }, [sessionId]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingText]);
  const loadMessages = async () => {
    const res = await chatService.getMessages();
    if (res.success && res.data) {
      setMessages(res.data.messages);
      // Look for latest artwork
      const lastToolMsg = [...res.data.messages].reverse().find(m => m.toolCalls?.some(tc => tc.name === 'generate_illustration'));
      if (lastToolMsg) {
        const toolCall = lastToolMsg.toolCalls?.find(tc => tc.name === 'generate_illustration');
        const url = parseToolResult(toolCall);
        if (url) setCurrentArtwork(url);
      }
    }
  };
  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    const userMessage = input.trim();
    setInput('');
    setIsProcessing(true);
    setStreamingText('');
    // Optimistic UI update
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
      // Refresh to get final state with tool results
      const res = await chatService.getMessages();
      if (res.success && res.data) {
        setMessages(res.data.messages);
        setStreamingText('');
        // Detect if a tool was just called
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
  const handleClear = async () => {
    if (confirm("Clear this canvas and start anew?")) {
      await chatService.clearMessages();
      setMessages([]);
      setCurrentArtwork(null);
      toast.success("Fresh parchment ready!");
    }
  };
  return (
    <div className="h-screen bg-[#FDFBF7] flex flex-col overflow-hidden">
      <header className="h-16 border-b-2 border-[#2D2B2A] bg-white px-6 flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-[#F38020]" />
            <h1 className="text-2xl font-display">Illustration Studio</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" onClick={handleClear} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-5 h-5" />
          </Button>
          <Badge variant="outline" className="hidden sm:inline-flex border-[#2D2B2A] font-serif italic px-3 py-1">
            Art Director Active
          </Badge>
        </div>
      </header>
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden max-w-7xl mx-auto w-full px-0 sm:px-4 lg:px-8 py-0 md:py-8 lg:py-10">
        {/* Left Pane: Chat */}
        <section className="w-full md:w-[400px] flex flex-col bg-white/50 backdrop-blur-sm md:rounded-l-3xl md:border-2 md:border-r-0 border-[#2D2B2A] overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 border-[#2D2B2A] flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#F38020]' : 'bg-white'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-[#F38020]" />}
                  </div>
                  <div className={`p-4 sketchy-box max-w-[85%] ${msg.role === 'user' ? 'bg-muted' : 'bg-white'}`}>
                    <p className="text-sm font-serif leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {streamingText && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-[#2D2B2A] bg-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#F38020]" />
                  </div>
                  <div className="p-4 sketchy-box bg-white max-w-[85%]">
                    <p className="text-sm font-serif leading-relaxed whitespace-pre-wrap">{streamingText}</p>
                  </div>
                </div>
              )}
              {isProcessing && !streamingText && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-[#2D2B2A] bg-white flex items-center justify-center animate-bounce">
                    <Palette className="w-4 h-4 text-[#F38020]" />
                  </div>
                  <div className="p-4 sketchy-box bg-white italic font-serif text-sm">
                    Mixing pigments...
                  </div>
                </motion.div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          <div className="p-4 border-t-2 border-[#2D2B2A] bg-white">
            <div className="relative">
              <Input
                placeholder="Describe a scene for the director..."
                className="pr-12 h-14 font-serif text-lg border-2 border-[#2D2B2A] rounded-xl focus-visible:ring-[#F38020]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isProcessing}
              />
              <Button
                onClick={handleSend}
                size="icon"
                disabled={isProcessing || !input.trim()}
                className="absolute right-2 top-2 h-10 w-10 bg-[#F38020] hover:bg-[#D14615] rounded-lg"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
        {/* Right Pane: Easel */}
        <section className="flex-1 bg-[#FDFBF7] md:rounded-r-3xl md:border-2 border-[#2D2B2A] overflow-hidden">
          <IllustrationEasel imageUrl={currentArtwork} isGenerating={isProcessing} />
        </section>
      </main>
    </div>
  );
}
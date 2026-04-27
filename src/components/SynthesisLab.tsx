import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatService, parseToolResult, formatTime } from '@/lib/chat';
import type { Message } from '../../worker/types';
import { Terminal, Send, Sparkles, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
export function SynthesisLab() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await chatService.getMessages();
        if (res.success && res.data?.messages) {
          setMessages(res.data.messages);
          const images = res.data.messages
            .filter(m => m.role === 'assistant' && m.toolCalls)
            .flatMap(m => m.toolCalls || [])
            .map(tc => parseToolResult(tc))
            .filter(Boolean) as string[];
          if (images.length > 0) {
            setActiveArtifact(images[images.length - 1]);
          }
        }
      } catch (err) {
        console.error("Failed to load neural history:", err);
      }
    };
    loadHistory();
  }, []);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);
  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);
    setStreamingText('');
    try {
      const res = await chatService.sendMessage(userMsg.content, undefined, (chunk) => {
        setStreamingText(prev => prev + chunk);
      });
      if (res.success) {
        const finalState = await chatService.getMessages();
        if (finalState.success && finalState.data?.messages) {
          const newMessages = finalState.data.messages;
          setMessages(newMessages);
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg?.toolCalls?.[0]) {
            const imageUrl = parseToolResult(lastMsg.toolCalls[0]);
            if (imageUrl) setActiveArtifact(imageUrl);
          }
        }
      }
    } catch (error) {
      console.error("Link disruption in neural trace:", error);
    } finally {
      setStreamingText('');
      setIsProcessing(false);
    }
  };
  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-220px)] min-h-[600px]">
      <div className="flex-1 flex flex-col border border-cyber-green/20 bg-system-bg/40 backdrop-blur-sm relative overflow-hidden">
        <div className="p-4 border-b border-cyber-green/20 flex items-center justify-between bg-cyber-green/5">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyber-green" />
            <span className="text-xs font-bold tracking-[0.2em]">NEURAL_TRACES</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
            <span className="text-[10px] opacity-60">LINK_ACTIVE</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex flex-col max-w-[85%]",
                msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className="flex items-center gap-2 mb-1 opacity-40">
                <span className="text-[9px] font-mono">{formatTime(msg.timestamp)}</span>
                <span className="text-[9px] font-bold tracking-widest uppercase">
                  {msg.role === 'user' ? 'OPERATOR' : 'CORE_INTEL'}
                </span>
              </div>
              <div className={cn(
                "p-3 text-sm leading-relaxed border",
                msg.role === 'user'
                  ? "bg-cyber-green/10 border-cyber-green/30 text-cyber-green"
                  : "bg-system-bg border-cyber-green/20 text-cyber-green/90"
              )}>
                {msg.content}
                {msg.toolCalls?.some(tc => tc.name === 'generate_illustration') && (
                  <div className="mt-3 pt-3 border-t border-cyber-green/20 flex items-center gap-2 text-[10px] text-cyber-pink animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    SYNTHESIS_PROTOCOL_ENGAGED
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {streamingText && (
            <div className="flex flex-col items-start mr-auto max-w-[85%]">
              <div className="flex items-center gap-2 mb-1 opacity-40">
                <span className="text-[9px] font-bold tracking-widest uppercase text-cyber-green animate-pulse">STREAMING...</span>
              </div>
              <div className="p-3 text-sm border bg-system-bg border-cyber-green/40 text-cyber-green/90">
                {streamingText}
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
        <div className="p-4 bg-system-bg border-t border-cyber-green/20 space-y-4">
          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ENTER_DIRECTIVE..."
              className="w-full bg-cyber-green/5 border border-cyber-green/30 px-4 py-3 text-sm font-mono text-cyber-green placeholder:text-cyber-green/30 focus:outline-none focus:border-cyber-green transition-all"
              disabled={isProcessing}
            />
            <button
              onClick={handleSend}
              disabled={isProcessing || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyber-green hover:bg-cyber-green/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-start gap-2 opacity-40">
            <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
            <p className="text-[9px] leading-tight uppercase tracking-tighter">
              Shared AI limits may apply to neural link bandwidth.
            </p>
          </div>
        </div>
      </div>
      <div className="lg:w-[45%] flex flex-col border border-cyber-green/20 bg-system-bg/40 backdrop-blur-sm relative">
        <div className="p-4 border-b border-cyber-green/20 flex items-center justify-between bg-cyber-pink/5">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-cyber-pink" />
            <span className="text-xs font-bold tracking-[0.2em] text-cyber-pink uppercase">Substrate_Viewer</span>
          </div>
          <span className="text-[10px] opacity-40 uppercase">Synth_Node_4</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="grid grid-cols-10 h-full border-l border-cyber-green/20">
              {Array.from({ length: 10 }).map((_, i) => <div key={i} className="border-r border-cyber-green/20 h-full" />)}
            </div>
          </div>
          <AnimatePresence mode="wait">
            {activeArtifact ? (
              <motion.div
                key={activeArtifact}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group w-full aspect-[4/5] max-w-sm border border-cyber-green/40 shadow-[0_0_30px_rgba(0,255,65,0.1)]"
              >
                <img src={activeArtifact} alt="Synthesized Artifact" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-cyber-green/40 animate-scanline" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-cyber-pink font-bold">COHERENCE_STABLE</span>
                      <div className="text-[10px] font-mono text-cyber-green/80 uppercase">
                        Ref_{activeArtifact.slice(-10)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center space-y-4 opacity-20">
                <div className="w-16 h-16 border-2 border-dashed border-cyber-green rounded-full mx-auto animate-spin-slow flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-[10px] tracking-[0.3em] font-bold uppercase">Awaiting Substrate Synthesis</p>
              </div>
            )}
          </AnimatePresence>
          {isProcessing && !activeArtifact && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-system-bg/60 backdrop-blur-sm">
              <div className="w-10 h-10 border-2 border-cyber-green border-t-transparent rounded-full animate-spin mb-4" />
              <span className="text-[10px] font-bold animate-pulse tracking-[0.4em] uppercase">Forging_Artifact</span>
            </div>
          )}
        </div>
        <div className="p-3 border-t border-cyber-green/20 flex justify-between items-center opacity-30">
          <div className="flex items-center gap-4">
            <span className="text-[8px] font-mono">NODE: 0x442</span>
            <span className="text-[8px] font-mono">LAYER: L2_SYNTH</span>
          </div>
          <span className="text-[8px] font-mono">BETA_V.0.9</span>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { Book, Plus, Trash2, BookOpen, Clock, Info } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { chatService } from '@/lib/chat';
import { toast } from 'sonner';
import type { SessionInfo } from '../../worker/types';
interface LibrarySidebarProps {
  onSessionSelect: (sessionId: string) => void;
  currentSessionId: string;
}
export function LibrarySidebar({ onSessionSelect, currentSessionId }: LibrarySidebarProps) {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const fetchSessions = async () => {
    const res = await chatService.listSessions();
    if (res.success && res.data) {
      setSessions(res.data);
    }
  };
  useEffect(() => {
    fetchSessions();
  }, [currentSessionId]);
  const handleNewStory = async () => {
    const res = await chatService.createSession();
    if (res.success && res.data) {
      onSessionSelect(res.data.id);
      toast.success("A fresh scroll unrolled!");
    }
  };
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Burn this tale? It cannot be recovered.")) {
      const res = await chatService.deleteSession(id);
      if (res.success) {
        fetchSessions();
        if (id === currentSessionId) {
          handleNewStory();
        }
        toast.success("The ink has faded away.");
      }
    }
  };
  return (
    <Sidebar className="border-r-2 border-[#2D2B2A] bg-white">
      <SidebarHeader className="p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Book className="w-6 h-6 text-[#F38020]" />
          <span className="font-display text-xl">The Library</span>
        </div>
        <Button 
          onClick={handleNewStory}
          className="w-full btn-storybook bg-[#F38020] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Story
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-serif italic px-4">Past Tales</SidebarGroupLabel>
          <SidebarMenu className="px-2 space-y-1">
            {sessions.map((session) => (
              <SidebarMenuItem key={session.id}>
                <SidebarMenuButton 
                  isActive={session.id === currentSessionId}
                  onClick={() => onSessionSelect(session.id)}
                  className={`group sketchy-shake h-auto py-3 px-3 border-2 transition-all duration-200 ${
                    session.id === currentSessionId 
                    ? 'border-[#2D2B2A] bg-accent text-accent-foreground' 
                    : 'border-transparent hover:border-[#2D2B2A]/20'
                  }`}
                >
                  <div className="flex flex-col items-start gap-1 w-full overflow-hidden">
                    <span className="font-display text-sm truncate w-full">{session.title}</span>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-tighter">
                      <Clock className="w-3 h-3" />
                      {new Date(session.lastActive).toLocaleDateString()}
                    </div>
                  </div>
                </SidebarMenuButton>
                <SidebarMenuAction 
                  onClick={(e) => handleDelete(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t-2 border-[#2D2B2A]/10 space-y-3">
        <div className="flex items-start gap-2 p-3 bg-[#F38020]/5 rounded-xl border border-[#F38020]/20">
          <Info className="w-4 h-4 text-[#F38020] shrink-0 mt-0.5" />
          <p className="text-[10px] font-serif text-muted-foreground leading-tight italic">
            Note: Requests are limited to preserve the magical energies across all storytellers.
          </p>
        </div>
        <div className="text-[10px] text-center opacity-40 font-serif">
          FableForge v1.0 • Masterpiece Library
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
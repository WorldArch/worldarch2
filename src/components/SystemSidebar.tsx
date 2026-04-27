import React from 'react';
import { LayoutGrid, Shirt, UserCircle, Cpu, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
interface SystemSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}
export function SystemSidebar({ activeSection, onSectionChange }: SystemSidebarProps) {
  const menuItems = [
    { id: 'CONCEPTS', icon: LayoutGrid, label: 'CONCEPTS' },
    { id: 'FASHION', icon: Shirt, label: 'FASHION' },
    { id: 'CHARACTER', icon: UserCircle, label: 'CHARACTER' },
    { id: 'SYSTEM', icon: Cpu, label: 'SYSTEM' },
  ];
  return (
    <aside className="w-16 md:w-20 border-r border-cyber-green/20 bg-system-bg flex flex-col items-center py-8 z-20">
      <div className="mb-12">
        <div className="w-8 h-8 border-2 border-cyber-green flex items-center justify-center animate-pulse">
          <span className="text-[10px] font-bold">WA</span>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className="group relative flex flex-col items-center gap-1"
          >
            <div className={cn(
              "p-2 transition-all duration-300",
              activeSection === item.id ? "text-cyber-green bg-cyber-green/10" : "text-muted-foreground hover:text-cyber-green"
            )}>
              <item.icon className="w-6 h-6" />
            </div>
            <span className={cn(
              "text-[8px] tracking-[0.2em] font-bold transition-opacity",
              activeSection === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              {item.label}
            </span>
            {activeSection === item.id && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-cyber-green shadow-[0_0_10px_#00ff41]"
              />
            )}
          </button>
        ))}
      </nav>
      <div className="mt-auto flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1 opacity-40">
          <Wifi className="w-4 h-4" />
          <span className="text-[8px] font-mono tracking-tighter">14MS</span>
        </div>
        <div className="rotate-180 [writing-mode:vertical-lr] text-[8px] tracking-[0.5em] font-bold text-muted-foreground opacity-20 py-4">
          WORLDARCH_OS_V4
        </div>
      </div>
    </aside>
  );
}
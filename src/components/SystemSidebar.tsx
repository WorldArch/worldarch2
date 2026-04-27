import React from 'react';
import { LayoutGrid, Shirt, UserCircle, Cpu, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
interface SystemSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}
export function SystemSidebar({ activeSection, onSectionChange }: SystemSidebarProps) {
  const menuItems = [
    { id: 'SYNTHESIS', icon: BrainCircuit, label: 'SYNTHESIS' },
    { id: 'CONCEPTS', icon: LayoutGrid, label: 'CONCEPTS' },
    { id: 'FASHION', icon: Shirt, label: 'FASHION' },
    { id: 'CHARACTER', icon: UserCircle, label: 'CHARACTER' },
    { id: 'SYSTEM', icon: Cpu, label: 'SYSTEM' },
  ];
  return (
    <aside className="w-[160px] border-r border-cyber-green/20 bg-system-bg flex flex-col py-6 z-20">
      <div className="px-6 mb-12">
        <div className="w-10 h-10 border border-cyber-green flex items-center justify-center font-black text-xs hover:bg-cyber-green hover:text-black cursor-pointer transition-all">
          WA
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "nav-unit",
              activeSection === item.id && "active"
            )}
          >
            <item.icon className="w-4 h-4 mr-3" />
            <span className="uppercase">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto px-6 text-[8px] font-mono opacity-20 uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180">
        Substrate_V.4.0.0
      </div>
    </aside>
  );
}
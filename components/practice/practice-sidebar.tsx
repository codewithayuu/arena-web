'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutGrid,
  Code2,
  GitBranch,
  Braces,
  MessageSquare,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarSeparator,
  useSidebar,
} from '@/components/smoothui/sidebar';

export interface PracticeSidebarProps {
  activeTab?: 'patterns' | string;
  defaultOpen?: boolean;
}

const NAV_ITEMS = [
  {
    href: '/practice/dsa-patterns',
    icon: Code2,
    label: 'DSA Patterns',
    tab: 'patterns',
  },
] as const;

const BOTTOM_ITEMS = [
  { href: '/practice/dsa-patterns', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/roadmaps', icon: GitBranch, label: 'Roadmaps' },
  { href: '/topic-list', icon: Braces, label: 'Topic List' },
] as const;

function PracticeSidebarInner({ activeTab }: { activeTab: PracticeSidebarProps['activeTab'] }) {
  const { open } = useSidebar();

  return (
    <Sidebar expandedWidth={216} collapsibleWidth={60} className="border-r border-white/10 bg-black">
      {/* Header Region */}
      <SidebarHeader className="flex items-center justify-between pb-2">
        <SidebarGroupLabel className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Practice
        </SidebarGroupLabel>
        <SidebarTrigger />
      </SidebarHeader>

      {/* Main Content Region */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {NAV_ITEMS.map(({ href, icon: Icon, label, tab }) => {
              const isActive = activeTab === tab;
              return (
                <SidebarMenuItem key={tab}>
                  <Link href={href} className="w-full">
                    <SidebarMenuButton isActive={isActive} tooltip={label}>
                      <Icon className="w-4 h-4 shrink-0" />
                      {open && <span className="truncate">{label}</span>}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarMenu>
            {BOTTOM_ITEMS.map(({ href, icon: Icon, label }) => (
              <SidebarMenuItem key={label}>
                <Link href={href} className="w-full">
                  <SidebarMenuButton tooltip={label}>
                    <Icon className="w-4 h-4 shrink-0" />
                    {open && <span className="truncate">{label}</span>}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Region */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Discussions">
              <MessageSquare className="w-4 h-4 shrink-0" />
              {open && <span className="truncate">Discussions</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function PracticeSidebar({ activeTab = 'patterns', defaultOpen = true }: PracticeSidebarProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen} storageKey="practice_sidebar_open">
      {NAV_ITEMS.length > 1 && (
        <div className="fixed inset-x-3 top-[4.75rem] z-40 md:hidden desktop:hidden">
          <nav
            aria-label="Practice sections"
            className="overflow-x-auto rounded-2xl border border-white/10 bg-black/90 p-1.5 shadow-xl shadow-black/30 backdrop-blur-xl [scrollbar-width:thin]"
          >
            <ul className="flex min-w-full w-max items-center justify-center gap-1">
              {NAV_ITEMS.map(({ href, label, tab }) => {
                const isActive = activeTab === tab;
                return (
                  <li key={tab} className="shrink-0">
                    <Link
                      href={href}
                      aria-current={isActive ? 'page' : undefined}
                      className={[
                        'flex min-h-10 items-center rounded-xl px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e83040]',
                        isActive
                          ? 'bg-[#e83040]/15 text-[#ff6977]'
                          : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white',
                      ].join(' ')}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
      <PracticeSidebarInner activeTab={activeTab} />
    </SidebarProvider>
  );
}

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type ComponentProps,
} from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Tooltip from "@/components/smoothui/tooltip";
import { cn } from "@/lib/utils";

export interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  state: "expanded" | "collapsed";
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export interface SidebarProviderProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  storageKey?: string;
  className?: string;
  children: ReactNode;
}

export function SidebarProvider({
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  storageKey = "smoothui_sidebar_state",
  className,
  children,
}: SidebarProviderProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  useEffect(() => {
    if (typeof window === "undefined" || !storageKey) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        setUncontrolledOpen(stored === "true");
      }
    } catch {}
  }, [storageKey]);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(value);
        try {
          if (storageKey) localStorage.setItem(storageKey, String(value));
        } catch {}
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange, storageKey]
  );

  const toggleSidebar = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const value: SidebarContextValue = {
    open,
    setOpen,
    toggleSidebar,
    state: open ? "expanded" : "collapsed",
  };

  return (
    <SidebarContext.Provider value={value}>
      <div className={cn("flex h-full", className)}>{children}</div>
    </SidebarContext.Provider>
  );
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsibleWidth?: number;
  expandedWidth?: number;
}

export function Sidebar({
  collapsibleWidth = 56,
  expandedWidth = 224,
  className,
  children,
  ...props
}: SidebarProps) {
  const { open } = useSidebar();
  const shouldReduceMotion = useReducedMotion();

  const width = open ? expandedWidth : collapsibleWidth;

  return (
    <motion.aside
      aria-label="Sidebar"
      data-state={open ? "expanded" : "collapsed"}
      initial={false}
      animate={{ width }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
      }
      className={cn(
        "hidden md:flex desktop:flex flex-col h-full bg-black border-r border-white/10 select-none overflow-hidden relative shrink-0",
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.aside>
  );
}

export function SidebarHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between p-3 pb-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col gap-1 px-2.5 py-1.5 overflow-y-auto overflow-x-hidden scrollbar-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-2.5 pt-2 border-t border-white/10 shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1 w-full", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useSidebar();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.span
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "text-xs font-semibold tracking-wider uppercase text-muted-foreground px-2 py-1 truncate",
            className
          )}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function SidebarMenu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul role="list" className={cn("flex flex-col gap-1 w-full", className)} {...props}>
      {children}
    </ul>
  );
}

export function SidebarMenuItem({
  className,
  children,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cn("relative list-none", className)} {...props}>
      {children}
    </li>
  );
}

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  tooltip?: string;
  asChild?: boolean;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, isActive, tooltip, children, ...props }, ref) => {
  const { open } = useSidebar();

  const buttonElement = (
    <button
      ref={ref}
      type="button"
      data-active={isActive ? "true" : undefined}
      className={cn(
        "flex items-center rounded-xl text-sm transition-all duration-150 outline-none select-none",
        open ? "w-full gap-3 px-3 py-2 text-left" : "w-full justify-center p-2.5",
        isActive
          ? "bg-[#e83040]/15 text-[#ff5466] border border-[#e83040]/35 font-medium shadow-xs"
          : "text-muted-foreground hover:text-white hover:bg-white/[0.06] border border-transparent",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );

  if (!open && tooltip) {
    return (
      <Tooltip content={tooltip} side="right" sideOffset={10}>
        {buttonElement}
      </Tooltip>
    );
  }

  return buttonElement;
});

SidebarMenuButton.displayName = "SidebarMenuButton";

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Sidebar"
      aria-expanded={open}
      className={cn(
        "flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/[0.06] transition-colors shrink-0 outline-none",
        className
      )}
      {...props}
    >
      {open ? (
        <ChevronLeft className="w-4 h-4 shrink-0" />
      ) : (
        <ChevronRight className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
}

export function SidebarSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("w-full h-px bg-white/10 my-2 shrink-0", className)}
      {...props}
    />
  );
}

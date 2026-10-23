'use client';

import * as React from 'react';
import { motion, AnimatePresence, type HTMLMotionProps, type Transition } from 'motion/react';
import { cn } from '@/lib/utils';
import { Slot } from '@/components/animate-ui/primitives/animate/slot';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be rendered inside a <Tabs /> provider.');
  }
  return context;
}

export interface TabsProps extends React.ComponentProps<'div'> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange: setControlledValue,
  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (val: string) => {
      if (!isControlled) {
        setUncontrolledValue(val);
      }
      setControlledValue?.(val);
    },
    [isControlled, setControlledValue]
  );

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.ComponentProps<'div'> {
  children: React.ReactNode;
}

export function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn('inline-flex items-center justify-center rounded-lg bg-zinc-900 p-1 text-zinc-400', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends HTMLMotionProps<'button'> {
  value: string;
  asChild?: boolean;
}

export function TabsTrigger({
  value,
  asChild = false,
  className,
  onClick,
  children,
  ...props
}: TabsTriggerProps) {
  const { value: activeValue, onValueChange } = useTabsContext();
  const isActive = activeValue === value;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      onValueChange(value);
    }
  };

  if (asChild) {
    return (
      <Slot
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? 'active' : 'inactive'}
        className={className}
        onClick={handleClick}
        {...props}
      >
        {children as React.ReactNode}
      </Slot>
    );
  }

  return (
    <motion.button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        isActive
          ? 'bg-zinc-800 text-white shadow-sm'
          : 'text-zinc-400 hover:text-zinc-200',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export interface TabsContentsProps extends React.ComponentProps<'div'> {
  transition?: Transition;
  children: React.ReactNode;
}

export function TabsContents({
  transition = { type: 'spring', stiffness: 300, damping: 32, bounce: 0, restDelta: 0.01 },
  className,
  children,
  ...props
}: TabsContentsProps) {
  return (
    <div className={cn('relative mt-2 overflow-hidden w-full', className)} {...props}>
      <AnimatePresence mode="wait" initial={false}>
        {children}
      </AnimatePresence>
    </div>
  );
}

export interface TabsContentProps extends HTMLMotionProps<'div'> {
  value: string;
  asChild?: boolean;
}

export function TabsContent({
  value,
  asChild = false,
  className,
  children,
  ...props
}: TabsContentProps) {
  const { value: activeValue } = useTabsContext();
  const isActive = activeValue === value;

  if (!isActive) return null;

  if (asChild) {
    return (
      <Slot
        role="tabpanel"
        data-state={isActive ? 'active' : 'inactive'}
        className={className}
        {...props}
      >
        {children as React.ReactNode}
      </Slot>
    );
  }

  return (
    <motion.div
      role="tabpanel"
      data-state={isActive ? 'active' : 'inactive'}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('w-full focus-visible:outline-none', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

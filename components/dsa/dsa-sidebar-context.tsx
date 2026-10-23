'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface DsaSidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCollapsed: () => void;
}

const DsaSidebarContext = createContext<DsaSidebarContextType | undefined>(undefined);

export function DsaSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Restore collapse state from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('courseMenu');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.['data-structures-and-algorithms']?.collapsed !== undefined) {
          setIsCollapsed(parsed['data-structures-and-algorithms'].collapsed);
        }
      }
    } catch {}
  }, []);

  const setCollapsedState = useCallback(
    (action: React.SetStateAction<boolean>) => {
      setIsCollapsed((prev) => {
        const next = typeof action === 'function' ? action(prev) : action;
        try {
          const stored = localStorage.getItem('courseMenu');
          const parsed = stored ? JSON.parse(stored) : {};
          parsed['data-structures-and-algorithms'] = {
            ...(parsed['data-structures-and-algorithms'] || {}),
            collapsed: next,
          };
          localStorage.setItem('courseMenu', JSON.stringify(parsed));
        } catch {}
        return next;
      });
    },
    []
  );

  const toggleCollapsed = useCallback(() => {
    setCollapsedState((prev) => !prev);
  }, [setCollapsedState]);

  return (
    <DsaSidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed: setCollapsedState,
        toggleCollapsed,
      }}
    >
      {children}
    </DsaSidebarContext.Provider>
  );
}

export function useDsaSidebar(): DsaSidebarContextType {
  const context = useContext(DsaSidebarContext);
  if (!context) {
    throw new Error('useDsaSidebar must be used within a DsaSidebarProvider');
  }
  return context;
}

export function useOptionalDsaSidebar(): DsaSidebarContextType | null {
  return useContext(DsaSidebarContext) ?? null;
}

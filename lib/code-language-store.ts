'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'mindflare_preferred_code_lang';
const EVENT_NAME = 'mindflare-code-lang-change';

export type SupportedLanguage =
  | 'python'
  | 'java'
  | 'cpp'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'javascript'
  | 'typescript';

// Normalized language key finder
export function normalizeLanguage(raw: string): SupportedLanguage | string {
  const l = (raw || '').toLowerCase().trim();
  if (l.includes('py')) return 'python';
  if (l.includes('java') && !l.includes('script')) return 'java';
  if (l.includes('cpp') || l.includes('c++')) return 'cpp';
  if (l.includes('cs') || l.includes('csharp') || l.includes('c#')) return 'csharp';
  if (l.includes('go')) return 'go';
  if (l.includes('rust') || l.includes('rs')) return 'rust';
  if (l.includes('ts') || l.includes('typescript')) return 'typescript';
  if (l.includes('js') || l.includes('javascript')) return 'javascript';
  return l;
}

// In-memory fallback
let currentLanguage: string = 'python';

function getStoredLanguage(): string {
  if (typeof window === 'undefined') return currentLanguage;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val) return val;
  } catch {}
  return currentLanguage;
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function setGlobalCodeLanguage(lang: string) {
  const normalized = normalizeLanguage(lang);
  currentLanguage = normalized;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, normalized);
    } catch {}
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: normalized }));
  }
  listeners.forEach((listener) => listener());
}

/**
 * Hook to read and update the globally synchronized preferred language.
 * When any code block updates it, every code block on the page immediately updates.
 */
export function usePreferredLanguage(initial = 'python'): [string, (lang: string) => void] {
  const storeLang = useSyncExternalStore(
    subscribe,
    getStoredLanguage,
    () => initial
  );

  const [lang, setLang] = useState<string>(storeLang || initial);

  useEffect(() => {
    setLang(storeLang || initial);
  }, [storeLang, initial]);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setLang(customEvent.detail);
      }
    };
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setLang(e.newValue);
      }
    });
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
    };
  }, []);

  const update = (newLang: string) => {
    setGlobalCodeLanguage(newLang);
    setLang(normalizeLanguage(newLang));
  };

  return [lang, update];
}

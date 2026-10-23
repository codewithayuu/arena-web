"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

export interface PersistOptions<T> {
  serialize?: (val: T) => string;
  deserialize?: (raw: string) => T;
}

/**
 * Robust SSR-safe React hook to persist state in localStorage across page reloads/refreshes.
 * Prevents active dropdowns, accordions, tabs, and filters from closing on reload.
 */
export function usePersistedState<T>(
  key: string,
  defaultValue: T,
  options?: PersistOptions<T>
): [T, (action: T | ((prev: T) => T)) => void, boolean] {
  const [state, setState] = useState<T>(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);
  const keyRef = useRef(key);
  keyRef.current = key;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  // On client mount, load persisted value exactly once per key
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        const nextVal = optionsRef.current?.deserialize
          ? optionsRef.current.deserialize(stored)
          : JSON.parse(stored);

        setState((prev) => {
          // If both are Sets with identical members, retain previous instance to avoid reflow
          if (prev instanceof Set && nextVal instanceof Set) {
            if (
              prev.size === nextVal.size &&
              [...prev].every((x) => nextVal.has(x))
            ) {
              return prev;
            }
          }
          if (Object.is(prev, nextVal)) {
            return prev;
          }
          return nextVal;
        });
      }
    } catch {
      // Fall back to default
    }
    setIsHydrated(true);
  }, [key]);

  const setPersistedState = useCallback(
    (action: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next =
          typeof action === "function" ? (action as (p: T) => T)(prev) : action;
        try {
          const serialized = optionsRef.current?.serialize
            ? optionsRef.current.serialize(next)
            : JSON.stringify(next);
          localStorage.setItem(keyRef.current, serialized);
        } catch {
          // Ignore write errors (quota, storage disabled)
        }
        return next;
      });
    },
    []
  );

  return [state, setPersistedState, isHydrated];
}

/**
 * Specialized hook for persisting Sets of strings (e.g. expanded accordion IDs)
 */
export function usePersistedSet(
  key: string,
  defaultValues: string[] = []
): [
  Set<string>,
  (action: Set<string> | ((prev: Set<string>) => Set<string>)) => void,
  boolean
] {
  const serializedDefaults = JSON.stringify(defaultValues);

  const initialSet = useMemo(
    () => new Set<string>(JSON.parse(serializedDefaults)),
    [serializedDefaults]
  );

  const options = useMemo<PersistOptions<Set<string>>>(
    () => ({
      serialize: (set: Set<string>) => JSON.stringify(Array.from(set)),
      deserialize: (raw: string) => {
        try {
          const arr = JSON.parse(raw);
          return Array.isArray(arr)
            ? new Set(arr)
            : new Set<string>(JSON.parse(serializedDefaults));
        } catch {
          return new Set<string>(JSON.parse(serializedDefaults));
        }
      },
    }),
    [serializedDefaults]
  );

  return usePersistedState<Set<string>>(key, initialSet, options);
}


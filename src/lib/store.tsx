"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { PlaceStatus } from "@/lib/types";
import { defaultPrefs, type Prefs } from "@/lib/scoring";

export type Mode = "ruhig" | "profi";

interface SavedItem {
  id: string;
  status: PlaceStatus;
  savedAt: number;
}

interface StoreValue {
  saved: SavedItem[];
  skipped: string[];
  hidden: string[];
  prefs: Prefs;
  mode: Mode;
  setMode: (m: Mode) => void;
  isSaved: (id: string) => boolean;
  isSkipped: (id: string) => boolean;
  isHidden: (id: string) => boolean;
  save: (id: string) => void;
  skip: (id: string) => void;
  hide: (id: string) => void;
  unhide: (id: string) => void;
  unskip: (id: string) => void;
  remove: (id: string) => void;
  setStatus: (id: string, status: PlaceStatus) => void;
  setPrefs: (p: Prefs) => void;
  ready: boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

const KEY = "uc.store.v1";

interface Persisted {
  saved: SavedItem[];
  skipped: string[];
  hidden: string[];
  prefs: Prefs;
  mode: Mode;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [prefs, setPrefsState] = useState<Prefs>(defaultPrefs);
  const [mode, setModeState] = useState<Mode>("ruhig");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<Persisted>;
        setSaved(p.saved ?? []);
        setSkipped(p.skipped ?? []);
        setHidden(p.hidden ?? []);
        setPrefsState({ ...defaultPrefs, ...(p.prefs ?? {}) });
        if (p.mode === "ruhig" || p.mode === "profi") setModeState(p.mode);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const data: Persisted = { saved, skipped, hidden, prefs, mode };
    window.localStorage.setItem(KEY, JSON.stringify(data));
  }, [saved, skipped, hidden, prefs, mode, ready]);

  const isSaved = useCallback((id: string) => saved.some((s) => s.id === id), [saved]);
  const isSkipped = useCallback((id: string) => skipped.includes(id), [skipped]);
  const isHidden = useCallback((id: string) => hidden.includes(id), [hidden]);

  const save = useCallback((id: string) => {
    setSkipped((s) => s.filter((x) => x !== id));
    setHidden((h) => h.filter((x) => x !== id));
    setSaved((s) =>
      s.some((x) => x.id === id)
        ? s
        : [...s, { id, status: "wunsch" as PlaceStatus, savedAt: Date.now() }],
    );
  }, []);

  const skip = useCallback((id: string) => {
    setSaved((s) => s.filter((x) => x.id !== id));
    setHidden((h) => h.filter((x) => x !== id));
    setSkipped((s) => (s.includes(id) ? s : [...s, id]));
  }, []);

  const hide = useCallback((id: string) => {
    setSaved((s) => s.filter((x) => x.id !== id));
    setSkipped((s) => s.filter((x) => x !== id));
    setHidden((h) => (h.includes(id) ? h : [...h, id]));
  }, []);

  const unhide = useCallback((id: string) => {
    setHidden((h) => h.filter((x) => x !== id));
  }, []);

  const unskip = useCallback((id: string) => {
    setSkipped((s) => s.filter((x) => x !== id));
  }, []);

  const remove = useCallback((id: string) => {
    setSaved((s) => s.filter((x) => x.id !== id));
  }, []);

  const setStatus = useCallback((id: string, status: PlaceStatus) => {
    setSaved((s) => s.map((x) => (x.id === id ? { ...x, status } : x)));
  }, []);

  const setPrefs = useCallback((p: Prefs) => setPrefsState(p), []);
  const setMode = useCallback((m: Mode) => setModeState(m), []);

  return (
    <StoreContext.Provider
      value={{
        saved, skipped, hidden, prefs, mode, setMode,
        isSaved, isSkipped, isHidden,
        save, skip, hide, unhide, unskip, remove, setStatus, setPrefs, ready,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

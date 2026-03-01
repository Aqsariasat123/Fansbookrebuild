// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Fix localStorage and matchMedia before themeStore module init
vi.hoisted(() => {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => {
        store.clear();
      },
      get length() {
        return store.size;
      },
      key: (index: number) => [...store.keys()][index] ?? null,
    },
    writable: true,
    configurable: true,
  });
  // matchMedia is not available in jsdom by default
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

import { useThemeStore } from '../stores/themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'dark' });
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should have a theme property', () => {
    const state = useThemeStore.getState();
    expect(state.theme).toBeDefined();
    expect(['light', 'dark', 'system']).toContain(state.theme);
  });

  it('should switch to light theme', () => {
    useThemeStore.getState().setTheme('light');
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('should switch to dark theme', () => {
    useThemeStore.getState().setTheme('dark');
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('should switch to system theme', () => {
    useThemeStore.getState().setTheme('system');
    expect(useThemeStore.getState().theme).toBe('system');
  });

  it('should persist theme to localStorage', () => {
    useThemeStore.getState().setTheme('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should update localStorage on each change', () => {
    useThemeStore.getState().setTheme('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    useThemeStore.getState().setTheme('system');
    expect(localStorage.getItem('theme')).toBe('system');
  });
});

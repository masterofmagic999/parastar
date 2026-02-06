/**
 * Global State Management with Zustand
 * Fast, simple state management for the proxy
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Browser state interface
interface Tab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isActive: boolean;
  isLoading?: boolean;
}

interface BrowserState {
  tabs: Tab[];
  activeTabId: string | null;
  history: string[];
  
  // Actions
  addTab: (url?: string) => void;
  removeTab: (tabId: string) => void;
  switchTab: (tabId: string) => void;
  updateTab: (tabId: string, updates: Partial<Tab>) => void;
  navigateTab: (tabId: string, url: string) => void;
  goBack: () => void;
  goForward: () => void;
}

// Settings state interface
interface Settings {
  theme: 'dark' | 'light' | 'auto';
  searchEngine: 'google' | 'duckduckgo' | 'brave';
  homepage: string;
  enableHistory: boolean;
  saveCookies: boolean;
  blockAds: boolean;
  enableJavaScript: boolean;
  cloakMode: boolean;
  cloakTitle: string;
  cloakFavicon: string;
}

interface SettingsState extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
  resetSettings: () => void;
}

// Proxy state interface
interface ProxyState {
  isInitialized: boolean;
  transport: 'wisp' | 'bare' | null;
  wispServer: string;
  bareServer: string;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'offline';
  
  setInitialized: (initialized: boolean) => void;
  setTransport: (transport: 'wisp' | 'bare') => void;
  setConnectionQuality: (quality: ProxyState['connectionQuality']) => void;
}

// Default settings
const defaultSettings: Settings = {
  theme: 'dark',
  searchEngine: 'google',
  homepage: 'https://www.google.com',
  enableHistory: true,
  saveCookies: true,
  blockAds: false,
  enableJavaScript: true,
  cloakMode: false,
  cloakTitle: 'My Drive - Google Drive',
  cloakFavicon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png',
};

// Browser Store
export const useBrowserStore = create<BrowserState>()(
  persist(
    (set, get) => ({
      tabs: [{
        id: '1',
        url: 'https://www.google.com',
        title: 'New Tab',
        isActive: true,
      }],
      activeTabId: '1',
      history: [],
      
      addTab: (url = 'https://www.google.com') => {
        const newTab: Tab = {
          id: Date.now().toString(),
          url,
          title: 'New Tab',
          isActive: true,
          isLoading: true,
        };
        
        set((state) => ({
          tabs: [
            ...state.tabs.map(t => ({ ...t, isActive: false })),
            newTab,
          ],
          activeTabId: newTab.id,
        }));
      },
      
      removeTab: (tabId: string) => {
        const { tabs } = get();
        if (tabs.length === 1) return;
        
        const tabIndex = tabs.findIndex(t => t.id === tabId);
        const newTabs = tabs.filter(t => t.id !== tabId);
        
        set((state) => {
          if (tabs[tabIndex].isActive && newTabs.length > 0) {
            const nextActiveIndex = Math.min(tabIndex, newTabs.length - 1);
            newTabs[nextActiveIndex].isActive = true;
            return {
              tabs: newTabs,
              activeTabId: newTabs[nextActiveIndex].id,
            };
          }
          return { tabs: newTabs };
        });
      },
      
      switchTab: (tabId: string) => {
        set((state) => ({
          tabs: state.tabs.map(t => ({
            ...t,
            isActive: t.id === tabId,
          })),
          activeTabId: tabId,
        }));
      },
      
      updateTab: (tabId: string, updates: Partial<Tab>) => {
        set((state) => ({
          tabs: state.tabs.map(t =>
            t.id === tabId ? { ...t, ...updates } : t
          ),
        }));
      },
      
      navigateTab: (tabId: string, url: string) => {
        set((state) => ({
          tabs: state.tabs.map(t =>
            t.id === tabId ? { ...t, url, isLoading: true } : t
          ),
          history: [...state.history, url],
        }));
      },
      
      goBack: () => {
        console.log('Go back');
      },
      
      goForward: () => {
        console.log('Go forward');
      },
    }),
    {
      name: 'browser-storage',
      partialize: (state) => ({
        tabs: state.tabs,
        history: state.history.slice(-100),
      }),
    }
  )
);

// Settings Store
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      updateSettings: (settings: Partial<Settings>) => {
        set((state) => ({ ...state, ...settings }));
      },
      
      resetSettings: () => {
        set(defaultSettings);
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);

// Proxy Store
export const useProxyStore = create<ProxyState>((set) => ({
  isInitialized: false,
  transport: null,
  wispServer: 'wss://wisp.mercurywork.shop/',
  bareServer: 'https://uv.holyubofficial.net/bare/',
  connectionQuality: 'offline',
  
  setInitialized: (initialized: boolean) => {
    set({ isInitialized: initialized });
  },
  
  setTransport: (transport: 'wisp' | 'bare') => {
    set({ transport });
  },
  
  setConnectionQuality: (quality: ProxyState['connectionQuality']) => {
    set({ connectionQuality: quality });
  },
}));

// UI State Store
interface UIState {
  sidebarOpen: boolean;
  quickLinksOpen: boolean;
  settingsOpen: boolean;
  showLoadingBar: boolean;
  
  toggleSidebar: () => void;
  toggleQuickLinks: () => void;
  toggleSettings: () => void;
  setLoadingBar: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  quickLinksOpen: false,
  settingsOpen: false,
  showLoadingBar: false,
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleQuickLinks: () => set((state) => ({ quickLinksOpen: !state.quickLinksOpen })),
  toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),
  setLoadingBar: (show: boolean) => set({ showLoadingBar: show }),
}));

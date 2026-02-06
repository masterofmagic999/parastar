'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, RotateCw, Home, Star, Plus, X, Settings } from 'lucide-react'

interface Tab {
  id: string
  url: string
  title: string
  isActive: boolean
}

function BrowserContent() {
  const searchParams = useSearchParams()
  const initialUrl = searchParams.get('url') || 'https://www.google.com'
  
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', url: initialUrl, title: 'New Tab', isActive: true }
  ])
  const [addressBarValue, setAddressBarValue] = useState(initialUrl)
  const [isLoading, setIsLoading] = useState(false)
  const [swReady, setSwReady] = useState(false)

  const activeTab = tabs.find(t => t.isActive)
  const [sessionId, setSessionId] = useState<string | null>(null)

  // Load saved tabs on mount
  useEffect(() => {
    const loadSavedTabs = async () => {
      try {
        const DatabaseConnection = (await import('@/lib/auth/connection')).default
        const TabSessionManager = (await import('@/lib/data/tab-sessions')).default
        
        const session = await DatabaseConnection.getCurrentSession()
        if (!session?.user) return

        const savedTabs = await TabSessionManager.getLatestSession(session.user.id)
        
        if (savedTabs && savedTabs.length > 0) {
          const restoredTabs = savedTabs.map(st => ({
            id: st.id || Date.now().toString(),
            url: st.url,
            title: st.pageTitle || 'New Tab',
            isActive: st.isActive
          }))
          
          setTabs(restoredTabs)
          const activeRestoredTab = restoredTabs.find(t => t.isActive) || restoredTabs[0]
          setAddressBarValue(activeRestoredTab.url)
          setSessionId(savedTabs[0].sessionId)
        }
      } catch (error) {
        console.error('Failed to load saved tabs:', error)
      }
    }

    loadSavedTabs()
  }, [])

  // Save tabs periodically and on unload
  useEffect(() => {
    const saveTabs = async () => {
      try {
        const DatabaseConnection = (await import('@/lib/auth/connection')).default
        const TabSessionManager = (await import('@/lib/data/tab-sessions')).default
        
        const session = await DatabaseConnection.getCurrentSession()
        if (!session?.user) return

        const tabsToSave = tabs.map(tab => ({
          url: tab.url,
          title: tab.title,
          isActive: tab.isActive
        }))

        const sid = await TabSessionManager.saveTabs(
          session.user.id,
          tabsToSave,
          sessionId || undefined
        )
        
        if (!sessionId) {
          setSessionId(sid)
        }
      } catch (error) {
        console.error('Failed to save tabs:', error)
      }
    }

    // Save tabs every 30 seconds
    const interval = setInterval(saveTabs, 30000)

    // Save tabs on page unload
    const handleUnload = () => {
      saveTabs()
    }

    window.addEventListener('beforeunload', handleUnload)

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleUnload)
      saveTabs() // Save on unmount
    }
  }, [tabs, sessionId])

  // Initialize Scramjet Service Worker
  useEffect(() => {
    const initializeProxy = async () => {
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          })
          
          await navigator.serviceWorker.ready
          setSwReady(true)
          console.log('Scramjet service worker registered')
        } catch (error) {
          console.error('Service worker registration failed:', error)
        }
      }
    }

    initializeProxy()
  }, [])

  const trackVisit = async (url: string, title?: string) => {
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const HistoryManager = (await import('@/lib/data/history')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      await HistoryManager.trackVisit(session.user.id, url, title)
    } catch (error) {
      console.error('Failed to track visit:', error)
    }
  }

  const createNewTab = () => {
    const newId = Date.now().toString()
    setTabs(prev => [
      ...prev.map(t => ({ ...t, isActive: false })),
      { id: newId, url: 'https://www.google.com', title: 'New Tab', isActive: true }
    ])
    setAddressBarValue('https://www.google.com')
  }

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return
    
    const tabIndex = tabs.findIndex(t => t.id === tabId)
    const newTabs = tabs.filter(t => t.id !== tabId)
    
    if (tabs[tabIndex].isActive && newTabs.length > 0) {
      const nextActiveIndex = Math.min(tabIndex, newTabs.length - 1)
      newTabs[nextActiveIndex].isActive = true
      setAddressBarValue(newTabs[nextActiveIndex].url)
    }
    
    setTabs(newTabs)
  }

  const switchTab = (tabId: string) => {
    setTabs(prev => prev.map(t => ({
      ...t,
      isActive: t.id === tabId
    })))
    const tab = tabs.find(t => t.id === tabId)
    if (tab) setAddressBarValue(tab.url)
  }

  const navigateToUrl = (url: string) => {
    let finalUrl = url.trim()
    
    if (!finalUrl.match(/^https?:\/\//i)) {
      if (finalUrl.match(/^[\w-]+(\.[\w-]+)+/)) {
        finalUrl = `https://${finalUrl}`
      } else {
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}`
      }
    }

    setTabs(prev => prev.map(t => 
      t.isActive ? { ...t, url: finalUrl } : t
    ))
    setAddressBarValue(finalUrl)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
    
    // Track the visit
    trackVisit(finalUrl)
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigateToUrl(addressBarValue)
  }

  const goBack = () => {
    // In real implementation, maintain history stack
    console.log('Navigate back')
  }

  const goForward = () => {
    // In real implementation, maintain history stack
    console.log('Navigate forward')
  }

  const reload = () => {
    if (activeTab) {
      navigateToUrl(activeTab.url)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Tab Bar */}
      <div className="bg-slate-800 border-b border-slate-700 flex items-center px-2 py-1">
        <div className="flex-1 flex items-center gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-t-lg min-w-[180px] max-w-[220px] cursor-pointer group
                ${tab.isActive 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-650'}
              `}
              onClick={() => switchTab(tab.id)}
            >
              <span className="flex-1 truncate text-sm">{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-slate-600 rounded p-1 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={createNewTab}
          className="ml-2 p-2 hover:bg-slate-700 rounded transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            className="p-2 hover:bg-slate-700 rounded transition-colors"
            title="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={goForward}
            className="p-2 hover:bg-slate-700 rounded transition-colors"
            title="Forward"
          >
            <ArrowRight size={18} />
          </button>
          <button
            onClick={reload}
            className={`p-2 hover:bg-slate-700 rounded transition-colors ${isLoading ? 'animate-spin' : ''}`}
            title="Reload"
          >
            <RotateCw size={18} />
          </button>
          <button
            onClick={() => navigateToUrl('https://www.google.com')}
            className="p-2 hover:bg-slate-700 rounded transition-colors"
            title="Home"
          >
            <Home size={18} />
          </button>
        </div>

        <form onSubmit={handleAddressSubmit} className="flex-1">
          <div className="glass-panel flex items-center px-4 py-2">
            <input
              type="text"
              value={addressBarValue}
              onChange={(e) => setAddressBarValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white"
              placeholder="Enter URL or search..."
            />
            <button type="button" className="ml-2 hover:text-cyan-400 transition-colors">
              <Star size={18} />
            </button>
          </div>
        </form>

        <button
          onClick={() => window.location.href = '/settings'}
          className="p-2 hover:bg-slate-700 rounded transition-colors"
          title="Settings"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Proxy Content Area */}
      <div className="flex-1 bg-white relative">
        {!swReady && (
          <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white">Initializing proxy...</p>
            </div>
          </div>
        )}
        
        {isLoading && swReady && (
          <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white">Loading page...</p>
            </div>
          </div>
        )}
        
        {activeTab && swReady && (
          <iframe
            key={activeTab.id}
            src={`/scramjet/service/${encodeURIComponent(activeTab.url)}`}
            className="w-full h-full border-none"
            title="Proxied Content"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          />
        )}
      </div>
    </div>
  )
}

export default function BrowserPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <BrowserContent />
    </Suspense>
  )
}

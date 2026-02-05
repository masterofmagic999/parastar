'use client'

import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Cookie, Shield, History, Bookmark, Key, Home } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.location.href = '/browser'}
            className="glass-panel px-4 py-2 mb-4 hover:bg-white/10 transition-colors inline-flex items-center gap-2"
          >
            <Home size={18} />
            Back to Browser
          </button>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <SettingsIcon className="text-cyan-400" size={32} />
            Settings
          </h1>
          <p className="text-slate-400">Manage your proxy preferences and data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-4 space-y-2 sticky top-6">
              {[
                { id: 'general', icon: SettingsIcon, label: 'General' },
                { id: 'cookies', icon: Cookie, label: 'Cookies' },
                { id: 'logins', icon: Key, label: 'Saved Logins' },
                { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks' },
                { id: 'history', icon: History, label: 'History' },
                { id: 'privacy', icon: Shield, label: 'Privacy' },
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-6">
              {activeTab === 'general' && <GeneralSettings />}
              {activeTab === 'cookies' && <CookieSettings />}
              {activeTab === 'logins' && <LoginSettings />}
              {activeTab === 'bookmarks' && <BookmarkSettings />}
              {activeTab === 'history' && <HistorySettings />}
              {activeTab === 'privacy' && <PrivacySettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GeneralSettings() {
  const [homepageUrl, setHomepageUrl] = useState('https://www.google.com')
  const [theme, setTheme] = useState('dark')
  const [enableJs, setEnableJs] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const SettingsManager = (await import('@/lib/data/settings')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) {
        window.location.href = '/login'
        return
      }

      const prefs = await SettingsManager.loadUserPreferences(session.user.id)
      setHomepageUrl(prefs.homepage_url || 'https://www.google.com')
      setTheme(prefs.theme || 'dark')
      setEnableJs(prefs.enable_javascript !== false)
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    setSuccessMsg('')
    
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const SettingsManager = (await import('@/lib/data/settings')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      await SettingsManager.saveUserPreferences(session.user.id, {
        homepage_url: homepageUrl,
        theme: theme,
        enable_javascript: enableJs
      })

      setSuccessMsg('Settings saved successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">General Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Homepage URL
          </label>
          <input
            type="url"
            value={homepageUrl}
            onChange={(e) => setHomepageUrl(e.target.value)}
            placeholder="https://www.google.com"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Theme
          </label>
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Enable JavaScript</h3>
            <p className="text-sm text-slate-400">Allow JavaScript execution on proxied sites</p>
          </div>
          <label className="relative inline-block w-12 h-6">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={enableJs}
              onChange={(e) => setEnableJs(e.target.checked)}
            />
            <div className="w-full h-full bg-slate-700 rounded-full peer peer-checked:bg-cyan-500 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
          </label>
        </div>

        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-400 text-sm">
            {successMsg}
          </div>
        )}

        <button 
          onClick={saveSettings}
          disabled={isSaving}
          className="btn-primary w-full py-3 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

function CookieSettings() {
  const mockCookies = [
    { domain: 'example.com', name: 'session_id', value: 'abc123***', expires: '2024-12-31' },
    { domain: 'reddit.com', name: 'token', value: 'xyz789***', expires: '2024-11-15' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Cookie Manager</h2>
        <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
          Clear All Cookies
        </button>
      </div>

      <div className="space-y-3">
        {mockCookies.map((cookie, idx) => (
          <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-cyan-400">{cookie.domain}</span>
                </div>
                <div className="text-sm text-slate-400 space-y-1">
                  <div>Name: <span className="text-white">{cookie.name}</span></div>
                  <div>Value: <span className="text-white">{cookie.value}</span></div>
                  <div>Expires: <span className="text-white">{cookie.expires}</span></div>
                </div>
              </div>
              <button className="text-red-400 hover:text-red-300 text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LoginSettings() {
  const mockLogins = [
    { domain: 'github.com', username: 'user@email.com', lastUsed: '2 days ago' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Saved Logins</h2>
        <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
          Clear All Logins
        </button>
      </div>

      <div className="space-y-3">
        {mockLogins.map((login, idx) => (
          <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">{login.domain}</div>
                <div className="text-sm text-slate-400">
                  Username: {login.username}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Last used: {login.lastUsed}
                </div>
              </div>
              <button className="text-red-400 hover:text-red-300 text-sm">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BookmarkSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Bookmarks</h2>
      <p className="text-slate-400">Bookmark management coming soon...</p>
      <button className="btn-primary">
        Go to Bookmarks
      </button>
    </div>
  )
}

function HistorySettings() {
  const [saveHistory, setSaveHistory] = useState(true)
  const [historyItems, setHistoryItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadHistory()
    loadHistorySetting()
  }, [])

  const loadHistorySetting = async () => {
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const SettingsManager = (await import('@/lib/data/settings')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      const prefs = await SettingsManager.loadUserPreferences(session.user.id)
      setSaveHistory(prefs.save_history !== false)
    } catch (error) {
      console.error('Failed to load history setting:', error)
    }
  }

  const loadHistory = async () => {
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const HistoryManager = (await import('@/lib/data/history')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      const items = await HistoryManager.fetchHistory(session.user.id, 20)
      setHistoryItems(items)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all history?')) return
    
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const HistoryManager = (await import('@/lib/data/history')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      await HistoryManager.clearAllHistory(session.user.id)
      setHistoryItems([])
    } catch (error) {
      console.error('Failed to clear history:', error)
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const HistoryManager = (await import('@/lib/data/history')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      await HistoryManager.deleteHistoryEntry(id, session.user.id)
      setHistoryItems(historyItems.filter(h => h.id !== id))
    } catch (error) {
      console.error('Failed to delete history item:', error)
    }
  }

  const toggleHistorySaving = async (enabled: boolean) => {
    setSaveHistory(enabled)
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const SettingsManager = (await import('@/lib/data/settings')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      await SettingsManager.saveUserPreferences(session.user.id, {
        save_history: enabled
      })
    } catch (error) {
      console.error('Failed to save history setting:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Browsing History</h2>
        <button 
          onClick={handleClearHistory}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Save Browsing History</h3>
            <p className="text-sm text-slate-400">Track visited pages for easy access</p>
          </div>
          <label className="relative inline-block w-12 h-6">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={saveHistory}
              onChange={(e) => toggleHistorySaving(e.target.checked)}
            />
            <div className="w-full h-full bg-slate-700 rounded-full peer peer-checked:bg-cyan-500 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
          </label>
        </div>

        {/* Recent History */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Recent History</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : historyItems.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No history yet</p>
          ) : (
            <div className="space-y-2">
              {historyItems.map((item) => (
                <div key={item.id} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{item.page_title || item.url}</div>
                    <div className="text-sm text-slate-400 truncate">{item.url}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Visited {item.visit_count || 1} time{(item.visit_count || 1) > 1 ? 's' : ''} • {new Date(item.last_visited).toLocaleString()}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="ml-4 text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PrivacySettings() {
  const [clearOnExit, setClearOnExit] = useState(false)
  const [saveCookies, setSaveCookies] = useState(true)
  const [blockAds, setBlockAds] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPrivacySettings()
  }, [])

  const loadPrivacySettings = async () => {
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const SettingsManager = (await import('@/lib/data/settings')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      const prefs = await SettingsManager.loadUserPreferences(session.user.id)
      setClearOnExit(prefs.clear_on_exit || false)
      setSaveCookies(prefs.save_cookies !== false)
      setBlockAds(prefs.block_ads || false)
    } catch (error) {
      console.error('Failed to load privacy settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSetting = async (key: string, value: boolean) => {
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const SettingsManager = (await import('@/lib/data/settings')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      await SettingsManager.saveUserPreferences(session.user.id, {
        [key]: value
      })
    } catch (error) {
      console.error('Failed to save privacy setting:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Privacy & Security</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Clear on Exit</h3>
            <p className="text-sm text-slate-400">Remove all data when logging out</p>
          </div>
          <label className="relative inline-block w-12 h-6">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={clearOnExit}
              onChange={(e) => {
                setClearOnExit(e.target.checked)
                saveSetting('clear_on_exit', e.target.checked)
              }}
            />
            <div className="w-full h-full bg-slate-700 rounded-full peer peer-checked:bg-cyan-500 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Save Cookies</h3>
            <p className="text-sm text-slate-400">Persist cookies between sessions</p>
          </div>
          <label className="relative inline-block w-12 h-6">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={saveCookies}
              onChange={(e) => {
                setSaveCookies(e.target.checked)
                saveSetting('save_cookies', e.target.checked)
              }}
            />
            <div className="w-full h-full bg-slate-700 rounded-full peer peer-checked:bg-cyan-500 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Block Ads</h3>
            <p className="text-sm text-slate-400">Attempt to block advertisements</p>
          </div>
          <label className="relative inline-block w-12 h-6">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={blockAds}
              onChange={(e) => {
                setBlockAds(e.target.checked)
                saveSetting('block_ads', e.target.checked)
              }}
            />
            <div className="w-full h-full bg-slate-700 rounded-full peer peer-checked:bg-cyan-500 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-700">
          <button className="w-full bg-red-500/20 text-red-400 rounded-lg px-4 py-3 hover:bg-red-500/30 transition-colors font-medium">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

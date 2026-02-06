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
  const [cookies, setCookies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [groupedCookies, setGroupedCookies] = useState<Record<string, any[]>>({})

  useEffect(() => {
    loadCookies()
  }, [])

  useEffect(() => {
    // Group cookies by domain
    const grouped = cookies.reduce((acc, cookie) => {
      if (!acc[cookie.domain]) {
        acc[cookie.domain] = []
      }
      acc[cookie.domain].push(cookie)
      return acc
    }, {} as Record<string, any[]>)
    setGroupedCookies(grouped)
  }, [cookies])

  const loadCookies = async () => {
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const CookieManager = (await import('@/lib/data/cookies')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      const allCookies = await CookieManager.getAllCookies(session.user.id)
      setCookies(allCookies)
    } catch (error) {
      console.error('Failed to load cookies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete all cookies?')) return
    
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const CookieManager = (await import('@/lib/data/cookies')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      await CookieManager.clearAllCookies(session.user.id)
      setCookies([])
    } catch (error) {
      console.error('Failed to clear cookies:', error)
    }
  }

  const handleDeleteCookie = async (cookieId: string) => {
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const CookieManager = (await import('@/lib/data/cookies')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      await CookieManager.deleteCookie(cookieId, session.user.id)
      setCookies(cookies.filter(c => c.id !== cookieId))
    } catch (error) {
      console.error('Failed to delete cookie:', error)
    }
  }

  const handleClearDomain = async (domain: string) => {
    if (!confirm(`Clear all cookies for ${domain}?`)) return
    
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const CookieManager = (await import('@/lib/data/cookies')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      await CookieManager.clearCookiesForDomain(session.user.id, domain)
      setCookies(cookies.filter(c => c.domain !== domain))
    } catch (error) {
      console.error('Failed to clear domain cookies:', error)
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Cookie Manager</h2>
        <button 
          onClick={handleClearAll}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Clear All Cookies
        </button>
      </div>

      {cookies.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No cookies stored</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedCookies).map(([domain, domainCookies]) => (
            <div key={domain} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-cyan-400 text-lg">{domain}</h3>
                <button
                  onClick={() => handleClearDomain(domain)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Clear Domain
                </button>
              </div>
              <div className="space-y-2">
                {domainCookies.map((cookie) => (
                  <div key={cookie.id} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-400 space-y-1">
                          <div>Name: <span className="text-white font-medium">{cookie.name}</span></div>
                          <div className="truncate">Value: <span className="text-white">{cookie.value}</span></div>
                          {cookie.expires && (
                            <div>Expires: <span className="text-white">{new Date(cookie.expires).toLocaleString()}</span></div>
                          )}
                          <div className="flex gap-2 text-xs">
                            {cookie.secure && <span className="text-green-400">🔒 Secure</span>}
                            {cookie.http_only && <span className="text-blue-400">📝 HttpOnly</span>}
                            {cookie.same_site && <span className="text-purple-400">SameSite: {cookie.same_site}</span>}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteCookie(cookie.id)}
                        className="ml-4 text-red-400 hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function LoginSettings() {
  const [logins, setLogins] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [masterPassword, setMasterPassword] = useState('')
  const [showMasterPasswordPrompt, setShowMasterPasswordPrompt] = useState(false)
  const [showAddLogin, setShowAddLogin] = useState(false)
  const [newLogin, setNewLogin] = useState({
    domain: '',
    username: '',
    password: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadLogins()
  }, [])

  const loadLogins = async () => {
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const SavedLoginsManager = (await import('@/lib/data/saved-logins')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) {
        window.location.href = '/login'
        return
      }

      const allLogins = await SavedLoginsManager.getAllLogins(session.user.id)
      setLogins(allLogins)
    } catch (error) {
      console.error('Failed to load logins:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLogin = async () => {
    if (!newLogin.domain || !newLogin.username || !newLogin.password) {
      alert('Please fill in all fields')
      return
    }

    if (!masterPassword) {
      setShowMasterPasswordPrompt(true)
      return
    }

    setIsSaving(true)
    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const SavedLoginsManager = (await import('@/lib/data/saved-logins')).default
      const { sanitizeDomain } = await import('@/lib/security/sanitize')
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      const sanitizedDomain = sanitizeDomain(newLogin.domain)

      await SavedLoginsManager.saveLogin(
        session.user.id,
        sanitizedDomain,
        newLogin.username,
        newLogin.password,
        masterPassword
      )

      await loadLogins()
      setShowAddLogin(false)
      setNewLogin({ domain: '', username: '', password: '' })
      alert('Login saved successfully!')
    } catch (error) {
      console.error('Failed to save login:', error)
      alert('Failed to save login. Please check your master password.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteLogin = async (loginId: string) => {
    if (!confirm('Are you sure you want to delete this login?')) return

    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const SavedLoginsManager = (await import('@/lib/data/saved-logins')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      await SavedLoginsManager.deleteLogin(loginId, session.user.id)
      setLogins(logins.filter(l => l.id !== loginId))
    } catch (error) {
      console.error('Failed to delete login:', error)
      alert('Failed to delete login')
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL saved logins? This cannot be undone.')) return

    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const SavedLoginsManager = (await import('@/lib/data/saved-logins')).default
      
      const session = await DatabaseConnection.getCurrentSession()
      if (!session?.user) return

      await SavedLoginsManager.deleteAllLogins(session.user.id)
      setLogins([])
      alert('All logins cleared')
    } catch (error) {
      console.error('Failed to clear logins:', error)
      alert('Failed to clear logins')
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Saved Logins</h2>
          <p className="text-sm text-slate-400 mt-1">Securely encrypted with AES-256</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddLogin(true)}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
          >
            Add Login
          </button>
          {logins.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Master Password Info */}
      {!masterPassword && logins.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">
            ⚠️ Set a master password to add or manage logins. Your master password encrypts all saved credentials.
          </p>
        </div>
      )}

      {/* Add Login Form */}
      {showAddLogin && (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 space-y-4">
          <h3 className="text-xl font-semibold mb-4">Add New Login</h3>
          
          <div>
            <label className="block text-sm text-slate-400 mb-2">Domain</label>
            <input
              type="text"
              value={newLogin.domain}
              onChange={(e) => setNewLogin({ ...newLogin, domain: e.target.value })}
              placeholder="example.com"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Username/Email</label>
            <input
              type="text"
              value={newLogin.username}
              onChange={(e) => setNewLogin({ ...newLogin, username: e.target.value })}
              placeholder="user@example.com"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Password</label>
            <input
              type="password"
              value={newLogin.password}
              onChange={(e) => setNewLogin({ ...newLogin, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
            />
          </div>

          {!masterPassword && (
            <div>
              <label className="block text-sm text-slate-400 mb-2">Master Password (for encryption)</label>
              <input
                type="password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                placeholder="Create a strong master password"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white"
              />
              <p className="text-xs text-slate-500 mt-1">
                This password encrypts your saved credentials. Remember it - it cannot be recovered!
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleAddLogin}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Login'}
            </button>
            <button
              onClick={() => {
                setShowAddLogin(false)
                setNewLogin({ domain: '', username: '', password: '' })
              }}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Logins List */}
      {logins.length === 0 ? (
        <div className="text-center py-12">
          <Key size={48} className="mx-auto mb-4 text-slate-600" />
          <p className="text-slate-400">No saved logins yet</p>
          <p className="text-sm text-slate-500 mt-2">
            Add your first login to securely save website credentials
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {logins.map((login) => (
            <div key={login.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-white text-lg">{login.domain}</div>
                  <div className="text-sm text-slate-400 mt-1">
                    Username: <span className="text-white">{login.username}</span>
                  </div>
                  {login.lastUsed && (
                    <div className="text-xs text-slate-500 mt-1">
                      Last used: {new Date(login.lastUsed).toLocaleString()}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => handleDeleteLogin(login.id)}
                  className="text-red-400 hover:text-red-300 text-sm px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-6">
        <h4 className="text-blue-400 font-medium mb-2">🔒 Security Information</h4>
        <ul className="text-sm text-slate-400 space-y-1">
          <li>• Passwords are encrypted with AES-256-GCM</li>
          <li>• Master password is never stored or sent to servers</li>
          <li>• Each encryption uses a unique salt and IV</li>
          <li>• Logins are stored securely in your database</li>
        </ul>
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

'use client'

import { useState } from 'react'
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
            placeholder="https://www.google.com"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Theme
          </label>
          <select className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none">
            <option>Dark</option>
            <option>Light</option>
            <option>Auto</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Enable JavaScript</h3>
            <p className="text-sm text-slate-400">Allow JavaScript execution on proxied sites</p>
          </div>
          <label className="relative inline-block w-12 h-6">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-full h-full bg-slate-700 rounded-full peer peer-checked:bg-cyan-500 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
          </label>
        </div>

        <button className="btn-primary w-full py-3">
          Save Changes
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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Browsing History</h2>
        <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
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
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-full h-full bg-slate-700 rounded-full peer peer-checked:bg-cyan-500 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Keep History For
          </label>
          <select className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none">
            <option>1 Week</option>
            <option>1 Month</option>
            <option>3 Months</option>
            <option>1 Year</option>
            <option>Forever</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function PrivacySettings() {
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
            <input type="checkbox" className="sr-only peer" />
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
            <input type="checkbox" className="sr-only peer" defaultChecked />
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
            <input type="checkbox" className="sr-only peer" />
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

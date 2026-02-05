'use client'

import { useState } from 'react'
import { Bookmark, Plus, Trash2, Edit2, ExternalLink, Folder, Home } from 'lucide-react'

interface BookmarkItem {
  id: string
  title: string
  url: string
  folder: string
  iconUrl?: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
    {
      id: '1',
      title: 'GitHub',
      url: 'https://github.com',
      folder: 'Development',
      iconUrl: '🐙'
    },
    {
      id: '2',
      title: 'Stack Overflow',
      url: 'https://stackoverflow.com',
      folder: 'Development',
      iconUrl: '📚'
    },
    {
      id: '3',
      title: 'Reddit',
      url: 'https://reddit.com',
      folder: 'Social',
      iconUrl: '🤖'
    },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', folder: 'default' })

  const folders = [...new Set(bookmarks.map(b => b.folder))]

  const handleAddBookmark = () => {
    if (newBookmark.title && newBookmark.url) {
      setBookmarks([...bookmarks, {
        id: Date.now().toString(),
        ...newBookmark
      }])
      setNewBookmark({ title: '', url: '', folder: 'default' })
      setShowAddModal(false)
    }
  }

  const handleDelete = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id))
  }

  const handleVisit = (url: string) => {
    window.location.href = `/browser?url=${encodeURIComponent(url)}`
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => window.location.href = '/browser'}
              className="glass-panel px-4 py-2 mb-4 hover:bg-white/10 transition-colors inline-flex items-center gap-2"
            >
              <Home size={18} />
              Back to Browser
            </button>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Bookmark className="text-cyan-400" size={32} />
              My Bookmarks
            </h1>
            <p className="text-slate-400">Quick access to your favorite sites</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Bookmark
          </button>
        </div>

        {/* Folders */}
        {folders.map(folder => {
          const folderBookmarks = bookmarks.filter(b => b.folder === folder)
          if (folderBookmarks.length === 0) return null

          return (
            <div key={folder} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Folder className="text-cyan-400" size={20} />
                <h2 className="text-xl font-semibold">{folder}</h2>
                <span className="text-sm text-slate-400">({folderBookmarks.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {folderBookmarks.map(bookmark => (
                  <div
                    key={bookmark.id}
                    className="glass-panel p-4 hover:scale-105 transition-transform cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{bookmark.iconUrl || '🌐'}</div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(bookmark.id)
                          }}
                          className="p-1 hover:bg-red-500/20 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-medium text-white mb-1 truncate">{bookmark.title}</h3>
                    <p className="text-sm text-slate-400 truncate mb-3">{bookmark.url}</p>
                    <button
                      onClick={() => handleVisit(bookmark.url)}
                      className="w-full bg-cyan-500/20 text-cyan-400 rounded-lg py-2 text-sm hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={14} />
                      Visit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {bookmarks.length === 0 && (
          <div className="glass-panel p-12 text-center">
            <Bookmark className="mx-auto mb-4 text-slate-600" size={64} />
            <h3 className="text-xl font-medium text-slate-400 mb-2">No bookmarks yet</h3>
            <p className="text-slate-500 mb-6">Start adding your favorite websites</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Add Your First Bookmark
            </button>
          </div>
        )}
      </div>

      {/* Add Bookmark Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add Bookmark</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newBookmark.title}
                  onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                  placeholder="My Favorite Site"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={newBookmark.url}
                  onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Folder
                </label>
                <input
                  type="text"
                  value={newBookmark.folder}
                  onChange={(e) => setNewBookmark({ ...newBookmark, folder: e.target.value })}
                  placeholder="Development"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-700 text-white rounded-lg py-3 hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBookmark}
                  className="flex-1 btn-primary"
                >
                  Add Bookmark
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

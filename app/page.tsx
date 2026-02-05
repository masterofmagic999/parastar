'use client'

import { useState } from 'react'
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react'

export default function Home() {
  const [urlInput, setUrlInput] = useState('')

  const handleProxyNavigation = (e: React.FormEvent) => {
    e.preventDefault()
    if (urlInput.trim()) {
      window.location.href = `/browser?url=${encodeURIComponent(urlInput)}`
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 animate-gradient">
            Parastar
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
            Advanced web proxy with military-grade encryption, complete privacy, and lightning-fast performance
          </p>
        </div>

        {/* Proxy Input */}
        <form onSubmit={handleProxyNavigation} className="w-full max-w-3xl mb-16">
          <div className="glass-panel p-2 flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter URL or search term..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-lg text-white placeholder-slate-400"
            />
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 shrink-0"
            >
              Browse <ArrowRight size={20} />
            </button>
          </div>
        </form>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          <div className="glass-panel p-6 space-y-4 hover:scale-105 transition-transform cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Zap className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white">Lightning Fast</h3>
            <p className="text-slate-400">
              Optimized proxy infrastructure ensures sub-second page loads and seamless browsing
            </p>
          </div>

          <div className="glass-panel p-6 space-y-4 hover:scale-105 transition-transform cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Shield className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white">Evades Detection</h3>
            <p className="text-slate-400">
              Advanced fingerprinting and header rotation bypasses bot detection on all major sites
            </p>
          </div>

          <div className="glass-panel p-6 space-y-4 hover:scale-105 transition-transform cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Lock className="text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white">Complete Privacy</h3>
            <p className="text-slate-400">
              End-to-end encryption with zero logging policy keeps your browsing completely private
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 flex gap-4">
          <button
            onClick={() => window.location.href = '/register'}
            className="btn-primary text-lg px-8 py-3"
          >
            Create Account
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            className="glass-panel px-8 py-3 text-lg hover:bg-white/10 transition-colors"
          >
            Sign In
          </button>
        </div>
      </main>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}

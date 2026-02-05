'use client'

import { useState } from 'react'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const [emailField, setEmailField] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsProcessing(true)

    try {
      const DatabaseConnection = (await import('@/lib/auth/connection')).default
      const result = await DatabaseConnection.resetUserPassword(emailField)
      
      if (result.error) {
        setErrorMsg(result.error.message || 'Failed to send reset email. Please try again.')
        return
      }
      
      setIsSubmitted(true)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Reset Password
          </h1>
          <p className="text-slate-400">
            {isSubmitted
              ? 'Check your email for reset instructions'
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {isSubmitted ? (
          <div className="glass-panel p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Mail className="text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white">Email Sent!</h3>
              <p className="text-slate-400">
                We've sent a password reset link to <strong>{emailField}</strong>
              </p>
              <p className="text-sm text-slate-500">
                Didn't receive it? Check your spam folder or try again.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-700">
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full glass-panel px-4 py-3 hover:bg-white/10 transition-colors"
              >
                Try Different Email
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3"
              >
                <ArrowLeft size={20} />
                Back to Login
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-8 space-y-6">
            <form onSubmit={handleResetSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    value={emailField}
                    onChange={(e) => setEmailField(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail size={20} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            {/* Additional Links */}
            <div className="space-y-3 pt-4 border-t border-slate-700">
              <button
                onClick={() => window.location.href = '/login'}
                className="flex items-center justify-center gap-2 w-full text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
              <p className="text-center text-sm text-slate-400">
                Don't have an account?{' '}
                <button
                  onClick={() => window.location.href = '/register'}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

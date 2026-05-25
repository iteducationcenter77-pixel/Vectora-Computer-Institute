'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiLockClosed, HiMail, HiArrowLeft } from 'react-icons/hi'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        setError(err.message === 'Invalid login credentials' ? 'Invalid email or password.' : err.message)
      } else {
        router.push('/admin/dashboard')
      }
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, #f0f4f1 0%, #e2eae5 100%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="w-full max-w-[396px]"
      >
        {/* Logo and Header area */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Image
              src="/vec-logo.png"
              alt="Vectora Logo"
              width={70}
              height={70}
              className="object-contain"
              priority
            />
          </div>
          <h1
            className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Vectora Admin
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1.5 font-medium">
            Sign in to access your administrative dashboard
          </p>
        </div>

        {/* Facebook-style login card */}
        <div
          className="bg-white rounded-xl p-7 space-y-4"
          style={{
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(22, 61, 42, 0.06)',
          }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-lg text-xs font-semibold text-red-600 bg-red-50 border border-red-100"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Email Address
              </label>
              <div className="relative">
                <HiMail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[46px] pl-10 pr-3.5 rounded-lg border border-gray-200 text-sm focus:border-[var(--purple-600)] focus:ring-2 focus:ring-purple-500/10 outline-none transition"
                  style={{ color: '#1a1a1a', background: '#fafafa' }}
                  placeholder="admin@vectora.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Password
              </label>
              <div className="relative">
                <HiLockClosed
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full min-h-[46px] pl-10 pr-3.5 rounded-lg border border-gray-200 text-sm focus:border-[var(--purple-600)] focus:ring-2 focus:ring-purple-500/10 outline-none transition"
                  style={{ color: '#1a1a1a', background: '#fafafa' }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[46px] rounded-lg text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
              style={{
                background: 'var(--purple-600)',
                border: 'none',
                boxShadow: '0 2px 4px rgba(99, 102, 241, 0.15)',
              }}
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          {/* Separator line */}
          <div className="border-t border-gray-100 my-4" />

          {/* Back link */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[var(--purple-600)] transition"
            >
              <HiArrowLeft size={12} /> Return to Vectora Home
            </Link>
          </div>
        </div>

        {/* Small copyright below card */}
        <p className="text-center text-[10px] text-gray-400 mt-6 font-medium">
          Vectora Computer Institute © 2026 · All Rights Reserved
        </p>
      </motion.div>
    </div>
  )
}

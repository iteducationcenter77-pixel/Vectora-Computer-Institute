'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { HiLockClosed, HiMail } from 'react-icons/hi'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) { setError(err.message) }
      else { router.push('/admin/dashboard') }
    } catch { setError('Login failed. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}>V</div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to manage your institute</p>
        </div>

        <form onSubmit={handleLogin} className="glass-card p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-lg text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <div className="relative">
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-glass !pl-10" placeholder="admin@vectora.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input-glass !pl-10" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full !justify-center">
            {loading ? 'Signing In...' : '🔐 Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiSearch, HiShieldCheck, HiExternalLink, HiX } from 'react-icons/hi'

interface CertResult {
  student_name: string; course: string; certificate_code: string
  issue_date: string; pdf_link: string; status: string
}

export default function VerifyPage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<CertResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true); setError(''); setResult(null); setSearched(true)
    try {
      const supabase = createClient()
      const { data, error: err } = await supabase
        .from('certificates').select('*')
        .eq('certificate_code', code.trim().toUpperCase()).single()
      if (err || !data) setError('Certificate not found. Please check the code and try again.')
      else setResult(data)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="pt-32 pb-20 min-h-screen flex flex-col">
      <div className="container-main max-w-3xl flex-1 flex flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs mb-4"
            style={{ background: 'rgba(22, 61, 42, 0.04)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}><HiShieldCheck /> Verify Certificate</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Certificate <span className="text-gradient-purple">Verification</span>
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">Enter your unique certificate code to verify its authenticity instantly.</p>
          <div className="section-divider mt-6" style={{ background: 'var(--gradient-purple)' }} />
        </motion.div>

        <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-lg" />
            <input type="text" value={code} onChange={e => setCode(e.target.value)}
              placeholder="e.g., VTCI-AI-2026-001" className="input-glass !pl-12 !py-4 !text-lg" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary !text-lg shrink-0">
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </motion.form>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-full bg-emerald-600/10 flex items-center justify-center">
                  <HiShieldCheck className="text-emerald-700 text-3xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-700" style={{ fontFamily: 'var(--font-heading)' }}>Certificate Verified ✓</h3>
                  <p className="text-sm text-[var(--text-muted)]">This certificate is authentic and valid</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Student Name', value: result.student_name },
                  { label: 'Course', value: result.course },
                  { label: 'Certificate Code', value: result.certificate_code },
                  { label: 'Issue Date', value: new Date(result.issue_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) },
                ].map(item => (
                  <div key={item.label} className="p-4 rounded-2xl border border-[var(--border-color)]" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-xs text-[var(--text-muted)] mb-1">{item.label}</p>
                    <p className="text-[var(--text-primary)] font-semibold text-lg">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <span className={`badge text-sm ${result.status === 'Verified' ? 'badge-verified' : 'badge-revoked'}`}>{result.status}</span>
                {result.pdf_link && (
                  <a href={result.pdf_link} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5 !px-5">
                    View Certificate PDF <HiExternalLink />
                  </a>
                )}
              </div>
            </motion.div>
          )}

          {error && searched && (
            <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <HiX className="text-red-500 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-red-500 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Certificate Not Found</h3>
              <p className="text-[var(--text-secondary)]">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!searched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-8">
            <p className="text-[var(--text-muted)] text-sm">Example codes: <span className="text-[var(--text-primary)] font-semibold font-semibold">VTCI-AI-2026-001</span>, <span className="text-[var(--text-primary)] font-semibold font-semibold">VTCI-WD-2026-002</span></p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiSearch, HiShieldCheck, HiExternalLink, HiX } from 'react-icons/hi'

interface CertResult {
  student_name: string; course: string; certificate_code: string
  issue_date: string; pdf_link: string; status: string
}

export default function CertificateVerify() {
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
        .from('certificates')
        .select('*')
        .eq('certificate_code', code.trim().toUpperCase())
        .single()

      if (err || !data) { setError('Certificate not found. Please check the code and try again.') }
      else { setResult(data) }
    } catch { setError('Something went wrong. Please try again later.') }
    finally { setLoading(false) }
  }

  return (
    <section className="section-padding relative" id="verify" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container-main max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs mb-4"
            style={{ background: 'rgba(22, 61, 42, 0.04)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}><HiShieldCheck /> Certificate Verification</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Verify Your <span className="text-gradient-purple">Certificate</span>
          </h2>
          <p className="text-[var(--text-secondary)]">Enter your unique certificate code to verify its authenticity.</p>
          <div className="section-divider mt-6" style={{ background: 'var(--gradient-purple)' }} />
        </motion.div>

        <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter Certificate Code (e.g., VTCI-AI-2026-001)"
              className="input-glass !pl-11" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary shrink-0">
            {loading ? '...' : 'Verify'}
          </button>
        </motion.form>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-600/10 flex items-center justify-center">
                  <HiShieldCheck className="text-emerald-700 text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-700" style={{ fontFamily: 'var(--font-heading)' }}>Certificate Verified ✓</h3>
                  <p className="text-xs text-[var(--text-muted)]">This certificate is authentic and valid</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Student Name', value: result.student_name },
                  { label: 'Course', value: result.course },
                  { label: 'Certificate Code', value: result.certificate_code },
                  { label: 'Issue Date', value: new Date(result.issue_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-2xl border border-[var(--border-color)]" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-xs text-[var(--text-muted)] mb-1">{item.label}</p>
                    <p className="text-[var(--text-primary)] font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className={`badge ${result.status === 'Verified' ? 'badge-verified' : 'badge-revoked'}`}>
                  {result.status}
                </span>
                {result.pdf_link && (
                  <a href={result.pdf_link} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2 !px-4 !text-sm">
                    View Certificate <HiExternalLink />
                  </a>
                )}
              </div>
            </motion.div>
          )}

          {error && searched && (
            <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <HiX className="text-red-500 text-3xl" />
              </div>
              <h3 className="text-lg font-bold text-red-500 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Not Found</h3>
              <p className="text-[var(--text-secondary)] text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

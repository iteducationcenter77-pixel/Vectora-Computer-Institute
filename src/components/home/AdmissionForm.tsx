'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiCheckCircle, HiBriefcase } from 'react-icons/hi'

export default function AdmissionForm() {
  const [form, setForm] = useState({ student_name: '', phone: '', email: '', course: '', address: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.student_name || !form.phone) return
    setLoading(true)
    try {
      const supabase = createClient()
      await supabase.from('admissions').insert([form])
      setSuccess(true)
      setForm({ student_name: '', phone: '', email: '', course: '', address: '', message: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  const courses = ['AI & Data Science', 'DCA', 'ADCA', 'PGDCA', 'Tally Prime', 'Graphic Design', 'Web Development', 'Digital Marketing', 'Cyber Security']

  return (
    <section className="section-padding relative" id="admission">
      <div className="container-main max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4"
            style={{ background: 'rgba(22, 61, 42, 0.04)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}><HiBriefcase /> Apply Now</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Online <span className="text-gradient-purple">Admission</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
          <div className="section-divider mt-6" style={{ background: 'var(--gradient-purple)' }} />
        </motion.div>

        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center">
            <HiCheckCircle className="text-emerald-700 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Application Submitted!</h3>
            <p className="text-sm text-[var(--text-secondary)]">We&apos;ll contact you soon. Thank you for choosing Vectora!</p>
          </motion.div>
        ) : (
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass-card p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.8rem] text-[var(--text-secondary)] mb-1.5 font-medium">Full Name *</label>
                <input type="text" required value={form.student_name} onChange={e => setForm({...form, student_name: e.target.value})}
                  className="input-glass" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-[0.8rem] text-[var(--text-secondary)] mb-1.5 font-medium">Phone Number *</label>
                <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="input-glass" placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.8rem] text-[var(--text-secondary)] mb-1.5 font-medium">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="input-glass" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-[0.8rem] text-[var(--text-secondary)] mb-1.5 font-medium">Select Course</label>
                <select value={form.course} onChange={e => setForm({...form, course: e.target.value})} className="input-glass">
                  <option value="">Choose a course</option>
                  {courses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[0.8rem] text-[var(--text-secondary)] mb-1.5 font-medium">Address</label>
              <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                className="input-glass" placeholder="Your address" />
            </div>
            <div>
              <label className="block text-[0.8rem] text-[var(--text-secondary)] mb-1.5 font-medium">Message (Optional)</label>
              <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                className="input-glass" placeholder="Any questions or comments..." rows={3} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !text-base !py-2.5">
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  )
}

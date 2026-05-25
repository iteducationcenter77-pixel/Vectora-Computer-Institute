'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiCheckCircle, HiBriefcase, HiUser, HiPhone, HiMail, HiAcademicCap, HiLocationMarker, HiChatAlt } from 'react-icons/hi'

const courses = [
  'AI & Data Science', 'DCA (Diploma in Computer Application)',
  'ADCA (Advanced Diploma)', 'PGDCA (Post Graduate Diploma)',
  'Tally Prime', 'Graphic Design', 'Web Development',
  'Digital Marketing', 'Cyber Security',
]

interface FormField {
  icon: React.ReactNode
  label: string
  required?: boolean
  children: React.ReactNode
}

function Field({ icon, label, required, children }: FormField) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
        <span className="text-[var(--purple-400)]">{icon}</span>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

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
      setTimeout(() => setSuccess(false), 6000)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <section className="section-padding relative" id="admission" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container-main max-w-2xl">

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="section-eyebrow mb-4"><HiBriefcase size={11} /> Apply Now</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Online <span className="text-gradient-purple">Admission</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
            Fill out the form below and we&apos;ll contact you within 24 hours to confirm your enrollment.
          </p>
          <div className="section-divider mt-6" style={{ background: 'var(--gradient-purple)' }} />
        </motion.div>

        {/* Success */}
        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <HiCheckCircle className="text-emerald-600 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Application Submitted! 🎉
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Thank you for choosing Vectora! We&apos;ll contact you within 24 hours.
            </p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass-card p-5 sm:p-8">

            <form onSubmit={handleSubmit} noValidate>
              {/* ── Row 1: Name + Phone ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <Field icon={<HiUser size={13} />} label="Full Name" required>
                  <input
                    type="text" required value={form.student_name}
                    onChange={e => set('student_name', e.target.value)}
                    className="input-glass" placeholder="e.g. Rahul Sharma"
                  />
                </Field>
                <Field icon={<HiPhone size={13} />} label="Phone Number" required>
                  <input
                    type="tel" required value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    className="input-glass" placeholder="+91 XXXXX XXXXX"
                  />
                </Field>
              </div>

              {/* ── Row 2: Email + Course ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <Field icon={<HiMail size={13} />} label="Email Address">
                  <input
                    type="email" value={form.email}
                    onChange={e => set('email', e.target.value)}
                    className="input-glass" placeholder="your@email.com"
                  />
                </Field>
                <Field icon={<HiAcademicCap size={13} />} label="Select Course">
                  <select value={form.course} onChange={e => set('course', e.target.value)} className="input-glass">
                    <option value="">Choose a course…</option>
                    {courses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              {/* ── Row 3: Address ── */}
              <div className="mb-5">
                <Field icon={<HiLocationMarker size={13} />} label="Address">
                  <input
                    type="text" value={form.address}
                    onChange={e => set('address', e.target.value)}
                    className="input-glass" placeholder="Village / Town, District, State"
                  />
                </Field>
              </div>

              {/* ── Row 4: Message ── */}
              <div className="mb-6">
                <Field icon={<HiChatAlt size={13} />} label="Message (Optional)">
                  <textarea
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    className="input-glass" rows={3}
                    placeholder="Any questions, preferred batch timing, or other details…"
                  />
                </Field>
              </div>

              {/* Note */}
              <p className="text-xs text-[var(--text-muted)] mb-4 text-center">
                Fields marked <span className="text-red-500 font-bold">*</span> are required. We respect your privacy and will not share your details.
              </p>

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                className="btn-primary w-full !justify-center !py-3 !text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting…' : 'Submit Application →'}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  )
}

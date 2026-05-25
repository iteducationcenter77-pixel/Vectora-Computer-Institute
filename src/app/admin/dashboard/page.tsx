'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiShieldCheck, HiAcademicCap, HiPhotograph, HiUserGroup, HiEye, HiHome, HiSpeakerphone } from 'react-icons/hi'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ certificates: 0, courses: 0, gallery: 0, admissions: 0, visitors: 0 })

  useEffect(() => {
    const f = async () => {
      const s = createClient()
      const [certs, courses, gallery, admissions, analytics] = await Promise.all([
        s.from('certificates').select('id', { count: 'exact', head: true }),
        s.from('courses').select('id', { count: 'exact', head: true }),
        s.from('gallery').select('id', { count: 'exact', head: true }),
        s.from('admissions').select('id', { count: 'exact', head: true }),
        s.from('site_analytics').select('visitor_count').eq('id', 1).single(),
      ])
      setStats({
        certificates: certs.count || 0,
        courses: courses.count || 0,
        gallery: gallery.count || 0,
        admissions: admissions.count || 0,
        visitors: analytics.data?.visitor_count || 0,
      })
    }
    f()
  }, [])

  const cards = [
    { label: 'Certificates', value: stats.certificates, icon: <HiShieldCheck />, color: 'from-green-500/20 to-green-600/5', text: 'text-green-600' },
    { label: 'Courses', value: stats.courses, icon: <HiAcademicCap />, color: 'from-purple-500/20 to-purple-600/5', text: 'text-purple-600' },
    { label: 'Gallery Images', value: stats.gallery, icon: <HiPhotograph />, color: 'from-blue-500/20 to-blue-600/5', text: 'text-blue-600' },
    { label: 'Admissions', value: stats.admissions, icon: <HiUserGroup />, color: 'from-yellow-500/20 to-yellow-600/5', text: 'text-yellow-700' },
    { label: 'Visitors', value: stats.visitors, icon: <HiEye />, color: 'from-pink-500/20 to-pink-600/5', text: 'text-pink-600' },
  ]

  const guide = [
    { icon: <HiShieldCheck />, title: 'Certificates', desc: 'Add, search, edit, and delete student certificates with auto-generated codes.' },
    { icon: <HiAcademicCap />, title: 'Courses', desc: 'Manage your course catalog with descriptions, fees, and images.' },
    { icon: <HiPhotograph />, title: 'Gallery', desc: 'Add images via Google Drive links organized by category.' },
    { icon: <HiHome />, title: 'Hero Images', desc: 'Manage the homepage hero section background images.' },
    { icon: <HiSpeakerphone />, title: 'Announcements', desc: 'Add scrolling announcements shown on the website.' },
    { icon: <HiUserGroup />, title: 'Admissions', desc: 'View and manage online admission form submissions.' },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle mb-8">Welcome to the Vectora admin panel.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="admin-card min-h-[150px] flex flex-col justify-between gap-4"
          >
            <div className={`icon-plate bg-gradient-to-br ${c.color} ${c.text} text-xl`}>{c.icon}</div>
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)] leading-none" style={{ fontFamily: 'var(--font-heading)' }}>{c.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-2 font-medium">{c.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="admin-card">
        <h2 className="card-title mb-5">Quick Guide</h2>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          {guide.map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] p-3">
              <div className="icon-plate !w-9 !h-9 !min-w-9 !min-h-9 text-base">{item.icon}</div>
              <p className="card-text !text-sm">
                <strong className="text-[var(--text-primary)]">{item.title}</strong> - {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

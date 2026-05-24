'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiShieldCheck, HiAcademicCap, HiPhotograph, HiUserGroup, HiEye } from 'react-icons/hi'

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
        certificates: certs.count || 0, courses: courses.count || 0,
        gallery: gallery.count || 0, admissions: admissions.count || 0,
        visitors: analytics.data?.visitor_count || 0,
      })
    }
    f()
  }, [])

  const cards = [
    { label: 'Certificates', value: stats.certificates, icon: <HiShieldCheck />, color: 'from-green-500/20 to-green-600/5', text: 'text-green-400' },
    { label: 'Courses', value: stats.courses, icon: <HiAcademicCap />, color: 'from-purple-500/20 to-purple-600/5', text: 'text-purple-400' },
    { label: 'Gallery Images', value: stats.gallery, icon: <HiPhotograph />, color: 'from-blue-500/20 to-blue-600/5', text: 'text-blue-400' },
    { label: 'Admissions', value: stats.admissions, icon: <HiUserGroup />, color: 'from-yellow-500/20 to-yellow-600/5', text: 'text-yellow-400' },
    { label: 'Visitors', value: stats.visitors, icon: <HiEye />, color: 'from-pink-500/20 to-pink-600/5', text: 'text-pink-400' },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Dashboard</h1>
        <p className="text-gray-400 mb-8">Welcome to the Vectora admin panel.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="admin-card">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center ${c.text} text-xl mb-3`}>{c.icon}</div>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="admin-card">
        <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Quick Guide</h2>
        <div className="space-y-3 text-sm text-gray-400">
          <p>📜 <strong className="text-white">Certificates</strong> — Add, search, edit, and delete student certificates with auto-generated codes.</p>
          <p>🎓 <strong className="text-white">Courses</strong> — Manage your course catalog with descriptions, fees, and images.</p>
          <p>🖼 <strong className="text-white">Gallery</strong> — Add images via Google Drive links organized by category.</p>
          <p>🎥 <strong className="text-white">Hero Slides</strong> — Manage the homepage hero section slides.</p>
          <p>📢 <strong className="text-white">Announcements</strong> — Add scrolling announcements shown on the website.</p>
          <p>📝 <strong className="text-white">Admissions</strong> — View and manage online admission form submissions.</p>
        </div>
      </div>
    </div>
  )
}

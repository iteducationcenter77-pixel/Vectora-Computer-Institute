'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { HiArrowRight, HiClock, HiCurrencyRupee } from 'react-icons/hi'
import { FaBrain, FaLaptop, FaLaptopCode, FaGraduationCap, FaCalculator, FaPalette, FaCode, FaBullhorn, FaShieldAlt, FaBook } from 'react-icons/fa'

interface Course { id: string; course_name: string; duration: string; fees: string; description: string; image: string }

const getCourseIcon = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('ai') || n.includes('data science')) return <FaBrain size={18} className="text-[var(--text-primary)]" />
  if (n.includes('pgdca')) return <FaGraduationCap size={18} className="text-[var(--text-primary)]" />
  if (n.includes('adca')) return <FaLaptopCode size={18} className="text-[var(--text-primary)]" />
  if (n.includes('dca')) return <FaLaptop size={18} className="text-[var(--text-primary)]" />
  if (n.includes('tally')) return <FaCalculator size={18} className="text-[var(--text-primary)]" />
  if (n.includes('graphic')) return <FaPalette size={18} className="text-[var(--text-primary)]" />
  if (n.includes('web')) return <FaCode size={18} className="text-[var(--text-primary)]" />
  if (n.includes('marketing')) return <FaBullhorn size={18} className="text-[var(--text-primary)]" />
  if (n.includes('cyber') || n.includes('security')) return <FaShieldAlt size={18} className="text-[var(--text-primary)]" />
  return <FaBook size={18} className="text-[var(--text-primary)]" />
}

const fallback: Course[] = [
  { id: '1', course_name: 'AI & Data Science', duration: '6 Months', fees: '₹15,000', description: 'Master AI, ML, and data science with hands-on projects.', image: '' },
  { id: '2', course_name: 'DCA', duration: '6 Months', fees: '₹5,000', description: 'Computer fundamentals, MS Office, internet basics.', image: '' },
  { id: '3', course_name: 'ADCA', duration: '12 Months', fees: '₹8,000', description: 'Advanced diploma with programming and databases.', image: '' },
  { id: '4', course_name: 'PGDCA', duration: '12 Months', fees: '₹12,000', description: 'Post graduate diploma in computer applications.', image: '' },
  { id: '5', course_name: 'Tally Prime', duration: '3 Months', fees: '₹4,000', description: 'Complete accounting with GST and payroll.', image: '' },
  { id: '6', course_name: 'Graphic Design', duration: '4 Months', fees: '₹6,000', description: 'Adobe Photoshop, Illustrator, CorelDRAW.', image: '' },
  { id: '7', course_name: 'Web Development', duration: '6 Months', fees: '₹10,000', description: 'Full-stack web development from scratch.', image: '' },
  { id: '8', course_name: 'Digital Marketing', duration: '3 Months', fees: '₹5,000', description: 'SEO, social media, Google Ads, analytics.', image: '' },
  { id: '9', course_name: 'Cyber Security', duration: '4 Months', fees: '₹8,000', description: 'Ethical hacking and network security.', image: '' },
]

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([])
  useEffect(() => {
    const f = async () => {
      const s = createClient()
      const { data } = await s.from('courses').select('*').eq('is_active', true).order('sort_order').limit(9)
      if (data?.length) setCourses(data)
    }
    f()
  }, [])

  const list = courses.length > 0 ? courses : fallback

  return (
    <section className="section-padding relative" id="courses">
      <div className="container-main">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs mb-4"
            style={{ background: 'rgba(22, 61, 42, 0.04)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}><FaGraduationCap /> Our Courses</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Explore Our <span className="text-gradient-purple">Programs</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-xl mx-auto">Industry-relevant courses to transform beginners into skilled professionals.</p>
          <div className="section-divider mt-6" style={{ background: 'var(--gradient-purple)' }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}>
              <div className="glass-card p-6 h-full flex flex-col justify-between group cursor-pointer border border-[var(--border-color)]">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {getCourseIcon(c.course_name)}
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>{c.course_name}</h3>
                  <p className="text-[0.825rem] text-[var(--text-secondary)] mb-5 line-clamp-2 leading-relaxed">{c.description}</p>
                </div>
                <div>
                  <div className="flex items-center gap-5 mb-4">
                    <span className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-medium"><HiClock className="text-emerald-700" size={14} /> {c.duration}</span>
                    <span className="flex items-center gap-2 text-xs text-[var(--gold-300)] font-semibold"><HiCurrencyRupee className="text-emerald-700" size={14} /> {c.fees}</span>
                  </div>
                  <a href="https://wa.me/918638373298" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[var(--text-primary)] font-semibold transition-colors hover:text-[var(--purple-500)] mt-auto pt-2">
                    Enroll Now <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
          <Link href="/courses" className="btn-secondary">View All Courses <HiArrowRight /></Link>
        </motion.div>
      </div>
    </section>
  )
}

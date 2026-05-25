'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiClock, HiCurrencyRupee, HiCheckCircle, HiArrowRight } from 'react-icons/hi'
import { FaBrain, FaLaptop, FaLaptopCode, FaGraduationCap, FaCalculator, FaPalette, FaCode, FaBullhorn, FaShieldAlt, FaBook } from 'react-icons/fa'

interface Course {
  id: string; course_name: string; duration: string; fees: string
  description: string; benefits: string[]; image: string; is_active: boolean
}

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
  { id: '1', course_name: 'AI & Data Science', duration: '6 Months', fees: '₹15,000', description: 'Master AI, ML, and data science with hands-on projects. Learn Python, TensorFlow, and real-world AI applications.', benefits: ['Python', 'Machine Learning', 'Deep Learning', 'Data Viz', 'Projects', 'Certificate'], image: '', is_active: true },
  { id: '2', course_name: 'DCA (Diploma in Computer Application)', duration: '6 Months', fees: '₹5,000', description: 'Comprehensive diploma covering computer fundamentals, MS Office, internet, and basic programming.', benefits: ['Computer Fundamentals', 'MS Office', 'Internet', 'Programming', 'Typing', 'Certificate'], image: '', is_active: true },
  { id: '3', course_name: 'ADCA (Advanced Diploma in Computer Application)', duration: '12 Months', fees: '₹8,000', description: 'Advanced diploma with in-depth training in office applications, programming, and databases.', benefits: ['Advanced Office', 'Programming', 'DBMS', 'Web Design', 'Tally', 'Hardware'], image: '', is_active: true },
  { id: '4', course_name: 'PGDCA (Post Graduate Diploma)', duration: '12 Months', fees: '₹12,000', description: 'Post graduate level diploma covering advanced programming, databases, and software engineering.', benefits: ['Advanced Programming', 'DBMS', 'Web Dev', 'Software Eng.', 'Project Work', 'PG Certificate'], image: '', is_active: true },
  { id: '5', course_name: 'Tally Prime', duration: '3 Months', fees: '₹4,000', description: 'Complete accounting with Tally Prime — GST, inventory, payroll, and financial reporting.', benefits: ['Tally Prime', 'GST', 'Inventory', 'Payroll', 'Reports', 'Certificate'], image: '', is_active: true },
  { id: '6', course_name: 'Graphic Design', duration: '4 Months', fees: '₹6,000', description: 'Professional graphic design with Adobe Photoshop, Illustrator, and CorelDRAW.', benefits: ['Photoshop', 'Illustrator', 'CorelDRAW', 'Logo Design', 'Print', 'Portfolio'], image: '', is_active: true },
  { id: '7', course_name: 'Web Development', duration: '6 Months', fees: '₹10,000', description: 'Full-stack web development — HTML, CSS, JavaScript, React, Node.js.', benefits: ['HTML & CSS', 'JavaScript', 'React', 'Node.js', 'Database', 'Projects'], image: '', is_active: true },
  { id: '8', course_name: 'Digital Marketing', duration: '3 Months', fees: '₹5,000', description: 'SEO, social media marketing, Google Ads, email marketing, and analytics.', benefits: ['SEO', 'Social Media', 'Google Ads', 'Email Marketing', 'Analytics', 'Certificate'], image: '', is_active: true },
  { id: '9', course_name: 'Cyber Security', duration: '4 Months', fees: '₹8,000', description: 'Ethical hacking, network security, penetration testing, and cybersecurity fundamentals.', benefits: ['Ethical Hacking', 'Network Security', 'Pen Testing', 'Tools', 'Cyber Laws', 'Certificate'], image: '', is_active: true },
]

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const f = async () => {
      const s = createClient()
      const { data } = await s.from('courses').select('*').eq('is_active', true).order('sort_order')
      if (data?.length) setCourses(data)
    }
    f()
  }, [])

  const list = courses.length > 0 ? courses : fallback

  return (
    <div className="pt-32 pb-20">
      <div className="container-main">
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="section-eyebrow mb-4"><FaGraduationCap /> All Courses</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Our <span className="text-gradient-purple">Programs</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-xl mx-auto">Choose from our wide range of industry-relevant courses.</p>
          <div className="section-divider mt-6" style={{ background: 'var(--gradient-purple)' }} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {list.map((c, i) => (
            <motion.div key={c.id} initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="glass-card course-card">
                <div className="course-card__top">
                  <div className="icon-plate">
                    {getCourseIcon(c.course_name)}
                  </div>
                  <div className="course-card__body">
                    <h2 className="course-card__title">{c.course_name}</h2>
                    <div className="meta-row">
                      <span className="meta-pill"><HiClock className="text-emerald-700" size={14} /> {c.duration}</span>
                      <span className="meta-pill !text-[var(--gold-300)]"><HiCurrencyRupee className="text-emerald-700" size={14} /> {c.fees}</span>
                    </div>
                  </div>
                </div>
                <p className="course-card__description">{c.description}</p>

                <AnimatePresence>
                  {expanded === c.id && c.benefits?.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="mb-4 overflow-hidden">
                      <p className="text-[0.7rem] text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold">What You&apos;ll Learn</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {c.benefits.map((b, j) => (
                          <div key={j} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] leading-snug">
                            <HiCheckCircle className="text-emerald-700 shrink-0 mt-0.5" /> <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="course-card__actions">
                  <button onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                    className="text-xs text-[var(--text-primary)] font-semibold transition-colors">
                    {expanded === c.id ? 'Show Less' : 'View Details'}
                  </button>
                  <a href="https://wa.me/918638373298" target="_blank" rel="noopener noreferrer"
                    className="btn-primary !py-1.5 !px-3.5 !text-xs">
                    Enroll Now <HiArrowRight />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

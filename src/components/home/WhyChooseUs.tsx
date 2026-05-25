'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { HiLightningBolt, HiTerminal, HiTrendingUp, HiBriefcase, HiDesktopComputer, HiShieldCheck, HiBadgeCheck } from 'react-icons/hi'

const features = [
  { icon: <HiLightningBolt />, title: 'Practical Learning', desc: 'Hands-on projects and real-world applications' },
  { icon: <HiTerminal />, title: 'AI Focused Education', desc: 'Cutting-edge AI & ML integrated curriculum' },
  { icon: <HiTrendingUp />, title: 'Industry Relevant', desc: 'Skills aligned with current market demands' },
  { icon: <HiBriefcase />, title: 'Internship Support', desc: 'Guided internship and placement assistance' },
  { icon: <HiDesktopComputer />, title: 'Smart Classrooms', desc: 'Modern labs with latest tech infrastructure' },
  { icon: <HiShieldCheck />, title: 'Certificate Verification', desc: 'Online verifiable digital certificates' },
]

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.max(1, Math.floor(end / 60))
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [inView, end])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function WhyChooseUs() {
  return (
    <section className="section-padding relative" id="why-us" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container-main">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="section-eyebrow mb-4"><HiBadgeCheck /> Why Choose Us</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Why Students <span className="text-gradient-purple">Love Us</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-xl mx-auto">We go beyond traditional teaching to create tech leaders of tomorrow.</p>
          <div className="section-divider mt-6" style={{ background: 'var(--gradient-purple)' }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}>
              <div className="glass-card feature-card group">
                <div className="icon-plate text-lg group-hover:scale-105 transition-transform duration-300">
                  {f.icon}
                </div>
                <div className="feature-card__copy">
                  <h3 className="card-title !text-[0.95rem] mb-1.5">{f.title}</h3>
                  <p className="card-text !text-[0.825rem]">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated Counters */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { end: 500, suffix: '+', label: 'Students Trained' },
            { end: 15, suffix: '+', label: 'Courses Available' },
            { end: 50, suffix: '+', label: 'Workshops Done' },
            { end: 98, suffix: '%', label: 'Satisfaction Rate' },
          ].map((s, i) => (
            <div key={i} className="glass-card stat-card text-center">
              <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                <Counter end={s.end} suffix={s.suffix} />
              </p>
              <p className="text-[0.7rem] uppercase tracking-wider text-[var(--text-muted)] font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

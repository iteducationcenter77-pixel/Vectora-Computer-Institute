'use client'

import { motion } from 'framer-motion'
import { HiCode, HiChip, HiLightningBolt, HiLightBulb } from 'react-icons/hi'

export default function AboutSection() {
  return (
    <section className="section-padding relative overflow-hidden" id="about">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs mb-6"
              style={{ background: 'rgba(22, 61, 42, 0.04)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <HiLightBulb /> About Us
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Empowering the{' '}
              <span className="text-gradient-purple">Next Generation</span>{' '}
              of Tech Leaders
            </h2>

            <div className="section-divider !ml-0 mb-6" style={{ background: 'var(--gradient-purple)' }} />

            <p className="text-[var(--text-secondary)] text-[0.925rem] leading-relaxed mb-4">
              <strong className="text-[var(--text-primary)] font-semibold">Vectora Computer Institute</strong> is a modern computer training centre focused on AI, programming, digital skills, and practical education. We believe in hands-on learning that prepares students for real-world challenges.
            </p>

            <p className="text-[var(--text-muted)] text-[0.875rem] leading-relaxed mb-6">
              Located in Howly, Assam, we offer industry-relevant courses designed to transform beginners into skilled professionals. Our curriculum is constantly updated to include the latest technologies including Artificial Intelligence, Machine Learning, and modern web development.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {['AI Focused', 'Practical Learning', 'Industry Ready', 'Certified'].map((tag) => (
                <span key={tag} className="px-3.5 py-1.5 rounded-full text-xs text-[var(--text-secondary)] font-medium"
                  style={{ background: 'rgba(22, 61, 42, 0.04)', border: '1px solid var(--border-color)' }}>
                  ✓ {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="glass-card p-6 relative overflow-hidden">
                <div className="space-y-4">
                  {/* Feature Items */}
                  {[
                    { icon: <HiChip className="text-lg" />, title: 'AI-Powered Education', desc: 'Curriculum designed around cutting-edge AI technologies' },
                    { icon: <HiCode className="text-lg" />, title: 'Hands-On Projects', desc: 'Learn by building real-world applications and systems' },
                    { icon: <HiLightningBolt className="text-lg" />, title: 'Fast-Track Career Growth', desc: 'Industry-aligned skills that employers actively seek' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.15 }}
                      className="flex gap-4 p-3 rounded-xl transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-0.5" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h4>
                        <p className="text-[0.825rem] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 w-16 h-16 rounded-xl bg-[var(--bg-tertiary)] backdrop-blur-sm border border-[var(--border-color)] flex items-center justify-center shadow-sm"
              >
                <HiChip size={26} className="text-[var(--text-primary)]" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-3 -left-3 w-14 h-14 rounded-xl bg-[var(--bg-secondary)] backdrop-blur-sm border border-[var(--border-color)] flex items-center justify-center shadow-sm"
              >
                <HiCode size={22} className="text-[var(--gold-300)]" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { HiArrowRight, HiShieldCheck } from 'react-icons/hi'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface HeroImage {
  id: string
  image_url: string
  is_active: boolean
  sort_order: number
}

const gradients = [
  'radial-gradient(ellipse at 20% 50%, rgba(22,61,42,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(50,83,63,0.05) 0%, transparent 50%), var(--bg-primary)',
  'radial-gradient(ellipse at 70% 60%, rgba(184,134,11,0.05) 0%, transparent 60%), radial-gradient(ellipse at 30% 30%, rgba(22,61,42,0.06) 0%, transparent 50%), var(--bg-primary)',
  'radial-gradient(ellipse at 50% 40%, rgba(22,61,42,0.06) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(184,134,11,0.04) 0%, transparent 50%), var(--bg-primary)',
]

const subtitles = [
  'Transform your career with cutting-edge AI and technology education at Vectora Computer Institute.',
  'From web development to cybersecurity — master the skills that matter in the digital age.',
  'Industry-relevant courses, hands-on projects, and certification that employers trust.',
]

export default function HeroSection() {
  const [bgImages, setBgImages] = useState<HeroImage[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [imgError, setImgError] = useState<Set<string>>(new Set())

  // Fetch hero background images from the hero_images table
  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('hero_images')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (data && data.length > 0) setBgImages(data)
    }
    load()
  }, [])

  // Auto-rotate every 30 seconds
  const advance = useCallback(() => {
    setCurrentIdx(prev => (prev + 1) % Math.max(bgImages.length, 1))
  }, [bgImages.length])

  useEffect(() => {
    if (bgImages.length <= 1) return
    const t = setInterval(advance, 30_000)
    return () => clearInterval(t)
  }, [advance, bgImages.length])

  const currentImage = bgImages[currentIdx]
  const hasImage = !!currentImage && !imgError.has(currentImage.id)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="hero">

      {/* ── Background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {hasImage ? (
            /* Photo from Google Drive — 65% opacity */
            <motion.div
              key={currentImage.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            >
              <img
                src={currentImage.image_url}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.40 }}
                onError={() => setImgError(prev => new Set(prev).add(currentImage.id))}
              />
              {/* Overlay so text is readable over the photo */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, rgba(251,247,240,0.45) 0%, rgba(251,247,240,0.60) 60%, var(--bg-primary) 100%)',
                }}
              />
            </motion.div>
          ) : (
            /* Gradient fallback */
            <motion.div
              key={`grad-${currentIdx}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0 }}
              style={{ background: gradients[currentIdx % gradients.length] }}
            />
          )}
        </AnimatePresence>

        {/* Slide dots — only show when there are multiple images */}
        {bgImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {bgImages.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setCurrentIdx(i)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === currentIdx ? 32 : 10,
                  background: i === currentIdx ? 'var(--purple-600)' : 'var(--border-color)',
                }}
                aria-label={`Show image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Floating blobs ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div className="absolute w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(22,61,42,0.04) 0%, transparent 70%)', top: '10%', right: '5%' }}
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(184,134,11,0.03) 0%, transparent 70%)', bottom: '10%', left: '5%' }}
          animate={{ y: [0, 20, 0], x: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 container-main text-center max-w-4xl pt-36">

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
          style={{ background: 'rgba(22,61,42,0.04)', border: '1px solid var(--border-color)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs text-[var(--text-secondary)] font-semibold" style={{ fontFamily: 'var(--font-body)' }}>
            Now Enrolling for 2026 Batch
          </span>
        </motion.div>

        {/* Heading with typewriter */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            <TypeAnimation
              sequence={[
                'Learn AI Today.',    2000,
                'Code Your Future.',  2000,
                'Build Digital Skills.', 2000,
                'Lead Tomorrow.',     2000,
              ]}
              wrapper="span" speed={40} repeat={Infinity} className="text-gradient-purple"
            />
            <br />
            <span className="text-[var(--text-secondary)] text-2xl md:text-3xl font-medium">
              Lead Tomorrow.
            </span>
          </h1>
        </motion.div>

        {/* Subtitle — cycles with image */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {subtitles[currentIdx % subtitles.length]}
          </motion.p>
        </AnimatePresence>

        {/* CTA buttons */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://wa.me/918638373298" target="_blank" rel="noopener noreferrer" className="btn-primary text-lg">
            Start Learning <HiArrowRight />
          </a>
          <Link href="/verify" className="btn-secondary text-lg">
            <HiShieldCheck /> Verify Certificate
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
          {[
            { value: '500+', label: 'Students Trained' },
            { value: '15+',  label: 'Courses' },
            { value: '100%', label: 'Practical' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gradient-purple" style={{ fontFamily: 'var(--font-heading)' }}>
                {stat.value}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="mt-16">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] tracking-widest uppercase">Scroll Down</span>
            <div className="w-5 h-8 rounded-full flex justify-center pt-1.5" style={{ border: '1px solid var(--border-color)' }}>
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-2 rounded-full" style={{ background: 'var(--purple-600)' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

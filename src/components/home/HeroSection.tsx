'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { HiArrowRight, HiShieldCheck } from 'react-icons/hi'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface HeroSlide {
  id: string
  heading: string
  subheading: string
  image_link: string
  button_text: string
  button_link: string
}

const fallbackSlides: HeroSlide[] = [
  {
    id: '1',
    heading: 'Learn AI Today. Lead Tomorrow.',
    subheading: 'Transform your career with cutting-edge AI and technology education at Vectora Computer Institute.',
    image_link: '',
    button_text: 'Start Learning',
    button_link: 'https://wa.me/918638373298',
  },
  {
    id: '2',
    heading: 'Code Your Future',
    subheading: 'From web development to cybersecurity — master the skills that matter in the digital age.',
    image_link: '',
    button_text: 'Explore Courses',
    button_link: 'https://wa.me/918638373298',
  },
  {
    id: '3',
    heading: 'Your Success Starts Here',
    subheading: 'Industry-relevant courses, hands-on projects, and certification that employers trust.',
    image_link: '',
    button_text: 'Get Started',
    button_link: 'https://wa.me/918638373298',
  },
]

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const fetchSlides = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (data && data.length > 0) {
        setSlides(data)
      }
    }
    fetchSlides()
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const slide = slides[currentSlide]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="hero">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            {slide.image_link ? (
              <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                style={{ backgroundImage: `url(${slide.image_link})`, opacity: 0.35 }}
              />
            ) : (
              <div className="absolute inset-0 animate-gradient" style={{
                background: currentSlide === 0
                  ? 'radial-gradient(ellipse at 20% 50%, rgba(22, 61, 42, 0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(50, 83, 63, 0.04) 0%, transparent 50%), var(--bg-primary)'
                  : currentSlide === 1
                  ? 'radial-gradient(ellipse at 70% 60%, rgba(184, 134, 11, 0.04) 0%, transparent 60%), radial-gradient(ellipse at 30% 30%, rgba(22, 61, 42, 0.05) 0%, transparent 50%), var(--bg-primary)'
                  : 'radial-gradient(ellipse at 50% 40%, rgba(22, 61, 42, 0.05) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(184, 134, 11, 0.03) 0%, transparent 50%), var(--bg-primary)',
                backgroundSize: '200% 200%',
              }} />
            )}
            {/* Soft Warm Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF9F6]/30 to-[var(--bg-primary)]" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(22,61,42,0.04) 0%, transparent 70%)', top: '10%', right: '5%' }}
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(184,134,11,0.03) 0%, transparent 70%)', bottom: '10%', left: '5%' }}
          animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-main text-center max-w-4xl pt-36">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
          style={{
            background: 'rgba(22, 61, 42, 0.04)',
            border: '1px solid var(--border-color)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs text-[var(--text-secondary)] font-semibold" style={{ fontFamily: 'var(--font-body)' }}>
            Now Enrolling for 2026 Batch
          </span>
        </motion.div>

        {/* Main Heading with Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            <TypeAnimation
              sequence={[
                'Learn AI Today.',
                2000,
                'Code Your Future.',
                2000,
                'Build Digital Skills.',
                2000,
                'Lead Tomorrow.',
                2000,
              ]}
              wrapper="span"
              speed={40}
              repeat={Infinity}
              className="text-gradient-purple"
            />
            <br />
            <span className="text-[var(--text-secondary)] text-2xl md:text-3.5xl font-medium">
              Lead Tomorrow.
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentSlide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed opacity-95"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {slide.subheading}
          </motion.p>
        </AnimatePresence>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://wa.me/918638373298"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-lg"
          >
            Start Learning <HiArrowRight />
          </a>
          <Link
            href="/verify"
            className="btn-secondary text-lg"
          >
            <HiShieldCheck /> Verify Certificate
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
        >
          {[
            { value: '500+', label: 'Students Trained' },
            { value: '15+', label: 'Courses' },
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

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-gray-500 tracking-widest uppercase">Scroll Down</span>
            <div className="w-5 h-8 rounded-full border border-purple-500/30 flex justify-center pt-1.5">
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-2 rounded-full bg-purple-400"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentSlide ? 'w-8 bg-purple-600' : 'w-3 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

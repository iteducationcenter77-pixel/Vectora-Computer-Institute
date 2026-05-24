'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'
import { FaCamera, FaGraduationCap, FaBrain, FaLaptop, FaFlask, FaAward } from 'react-icons/fa'

const placeholderIcons = [
  <FaCamera key="0" />, <FaGraduationCap key="1" />, <FaBrain key="2" />, <FaLaptop key="3" />,
  <FaFlask key="4" />, <FaAward key="5" />
]

interface GalleryItem { id: string; image_link: string; category: string; title: string }

export default function GalleryPreview() {
  const [images, setImages] = useState<GalleryItem[]>([])

  useEffect(() => {
    const f = async () => {
      const s = createClient()
      const { data } = await s.from('gallery').select('*').order('sort_order').limit(6)
      if (data?.length) setImages(data)
    }
    f()
  }, [])

  const placeholders = [
    { id: '1', category: 'Classes', title: 'Smart Classroom' },
    { id: '2', category: 'Events', title: 'Annual Tech Fest' },
    { id: '3', category: 'Workshops', title: 'AI Workshop' },
    { id: '4', category: 'AI Sessions', title: 'ML Training' },
    { id: '5', category: 'Classes', title: 'Lab Session' },
    { id: '6', category: 'Events', title: 'Certificate Ceremony' },
  ]

  const display = images.length > 0 ? images : placeholders.map(p => ({ ...p, image_link: '' }))

  return (
    <section className="section-padding relative" id="gallery">
      <div className="container-main">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs mb-4"
            style={{ background: 'rgba(22, 61, 42, 0.04)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}><FaCamera /> Gallery</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Life at <span className="text-gradient-purple">Vectora</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">Glimpses of our classrooms, events, workshops, and student activities.</p>
          <div className="section-divider mt-6" style={{ background: 'var(--gradient-purple)' }} />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {display.map((img, i) => (
            <motion.div key={img.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`relative group overflow-hidden rounded-2xl ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              style={{ aspectRatio: i === 0 ? '16/10' : '4/3' }}>
              {img.image_link ? (
                <img src={img.image_link} alt={img.title || img.category} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl animate-pulse text-[var(--text-secondary)]"
                  style={{ background: `linear-gradient(135deg, hsl(${120 + i * 10}, 15%, 95%), hsl(${120 + i * 10}, 15%, 90%))` }}>
                  {placeholderIcons[i % placeholderIcons.length]}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="text-white font-semibold text-sm">{img.title || 'Vectora'}</p>
                  <p className="text-[#FAF9F6] text-xs opacity-90">{img.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
          <Link href="/gallery" className="btn-secondary">View Full Gallery <HiArrowRight /></Link>
        </motion.div>
      </div>
    </section>
  )
}

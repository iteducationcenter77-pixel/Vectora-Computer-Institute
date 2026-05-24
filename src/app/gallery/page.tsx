'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiX } from 'react-icons/hi'
import { FaCamera, FaGraduationCap, FaBrain, FaLaptop, FaFlask, FaAward, FaMobile, FaDesktop, FaPalette, FaGlobe, FaShieldAlt, FaChartBar } from 'react-icons/fa'

interface GalleryItem { id: string; image_link: string; category: string; title: string }

const categories = ['All', 'Classes', 'Events', 'Workshops', 'Internship', 'AI Sessions']

const placeholderIcons = [
  <FaCamera key="0" />, <FaGraduationCap key="1" />, <FaBrain key="2" />, <FaLaptop key="3" />,
  <FaFlask key="4" />, <FaAward key="5" />, <FaMobile key="6" />, <FaDesktop key="7" />,
  <FaPalette key="8" />, <FaGlobe key="9" />, <FaShieldAlt key="10" />, <FaChartBar key="11" />
]

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [filter, setFilter] = useState('All')
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  useEffect(() => {
    const f = async () => {
      const s = createClient()
      const { data } = await s.from('gallery').select('*').order('sort_order')
      if (data?.length) setImages(data)
    }
    f()
  }, [])

  const placeholders: GalleryItem[] = Array.from({ length: 12 }, (_, i) => ({
    id: String(i), image_link: '', title: `Gallery Image ${i + 1}`,
    category: categories[1 + (i % (categories.length - 1))],
  }))

  const list = images.length > 0 ? images : placeholders
  const filtered = filter === 'All' ? list : list.filter(img => img.category === filter)

  return (
    <div className="pt-32 pb-20">
      <div className="container-main">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs mb-4"
            style={{ background: 'rgba(22, 61, 42, 0.04)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}><FaCamera /> Gallery</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Our <span className="text-gradient-purple">Gallery</span>
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">Explore moments from our classrooms, events, and workshops.</p>
          <div className="section-divider mt-6" style={{ background: 'var(--gradient-purple)' }} />
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? 'text-white shadow-lg'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              style={filter === cat ? { background: 'var(--gradient-purple)' } : { background: 'rgba(22, 61, 42, 0.04)', border: '1px solid var(--border-color)' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-2xl"
                onClick={() => setLightbox(img)}>
                {img.image_link ? (
                  <img src={img.image_link} alt={img.title || img.category}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full flex items-center justify-center text-5xl animate-pulse text-[var(--text-secondary)]"
                    style={{ aspectRatio: `${3 + (i % 3)}/${4 + (i % 2)}`, background: `linear-gradient(135deg, hsl(${120 + i * 10}, 15%, 95%), hsl(${120 + i * 10}, 15%, 90%))` }}>
                    {placeholderIcons[i % placeholderIcons.length]}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div>
                    <p className="text-white font-semibold text-sm">{img.title || 'Vectora'}</p>
                    <p className="text-[#FAF9F6] text-xs opacity-90">{img.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
              <button className="absolute top-6 right-6 text-white text-3xl" onClick={() => setLightbox(null)}><HiX /></button>
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} onClick={e => e.stopPropagation()}
                className="max-w-4xl max-h-[85vh] relative">
                {lightbox.image_link ? (
                  <img src={lightbox.image_link} alt={lightbox.title || ''} className="max-w-full max-h-[85vh] object-contain rounded-xl" />
                ) : (
                  <div className="w-96 h-96 rounded-xl flex items-center justify-center text-8xl text-[var(--text-secondary)]"
                    style={{ background: 'linear-gradient(135deg, hsl(120, 15%, 95%), hsl(120, 15%, 90%))' }}><FaCamera /></div>
                )}
                <div className="mt-4 text-center">
                  <p className="text-white font-semibold">{lightbox.title}</p>
                  <p className="text-[#FAF9F6] text-sm opacity-90">{lightbox.category}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

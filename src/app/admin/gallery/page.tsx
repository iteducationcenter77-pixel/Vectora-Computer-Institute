'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiPlus, HiTrash, HiX } from 'react-icons/hi'

interface GalleryItem { id: string; image_link: string; category: string; title: string }

const categories = ['Classes', 'Events', 'Workshops', 'Internship', 'AI Sessions']

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ image_link: '', category: 'Classes', title: '' })

  const fetchImages = async () => {
    const s = createClient()
    const { data } = await s.from('gallery').select('*').order('sort_order')
    if (data) setImages(data)
  }
  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchImages() }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const handleAdd = async () => {
    if (!form.image_link) return
    await createClient().from('gallery').insert([{ ...form, sort_order: images.length }])
    setShowModal(false); setForm({ image_link: '', category: 'Classes', title: '' }); fetchImages()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return
    await createClient().from('gallery').delete().eq('id', id)
    fetchImages()
  }

  const filtered = filter === 'All' ? images : images.filter(i => i.category === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="admin-page-title">Gallery</h1>
          <p className="admin-page-subtitle">{images.length} images</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary !py-2 !px-4 !text-sm"><HiPlus /> Add Image</button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...categories].map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-sm ${filter === c ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800 text-gray-400'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(img => (
          <div key={img.id} className="admin-card !p-2 group relative overflow-hidden">
            {img.image_link ? (
              <img src={img.image_link} alt={img.title} className="w-full rounded-lg object-cover" style={{ aspectRatio: '4/3' }} />
            ) : (
              <div className="w-full rounded-lg flex items-center justify-center text-4xl"
                style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, hsl(270, 50%, 12%), hsl(270, 70%, 6%))' }}>📸</div>
            )}
            <div className="p-2">
              <p className="text-sm text-white truncate">{img.title || 'Untitled'}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">{img.category}</span>
                <button onClick={() => handleDelete(img.id)} className="p-1 rounded hover:bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><HiTrash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="admin-card w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Add Image</h2>
                <button onClick={() => setShowModal(false)}><HiX size={20} className="text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm text-gray-400 mb-1">Image Link (Google Drive) *</label>
                  <input value={form.image_link} onChange={e => setForm({...form, image_link: e.target.value})} className="input-glass" placeholder="https://drive.google.com/uc?id=..." /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-glass">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select></div>
                <div><label className="block text-sm text-gray-400 mb-1">Title</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-glass" placeholder="Image title" /></div>
                <button onClick={handleAdd} className="btn-primary w-full !justify-center">Add Image</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

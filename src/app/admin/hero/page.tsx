'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi'

interface Slide { id: string; image_link: string; heading: string; subheading: string; button_text: string; button_link: string; is_active: boolean; sort_order: number }

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ image_link: '', heading: '', subheading: '', button_text: 'Start Learning', button_link: 'https://wa.me/918638373298', is_active: true, sort_order: 0 })

  const fetchSlides = async () => {
    const s = createClient()
    const { data } = await s.from('hero_slides').select('*').order('sort_order')
    if (data) setSlides(data)
  }
  useEffect(() => { fetchSlides() }, [])

  const openAdd = () => {
    setForm({ image_link: '', heading: '', subheading: '', button_text: 'Start Learning', button_link: 'https://wa.me/918638373298', is_active: true, sort_order: slides.length })
    setEditId(null); setShowModal(true)
  }

  const openEdit = (s: Slide) => {
    setForm({ image_link: s.image_link, heading: s.heading || '', subheading: s.subheading || '', button_text: s.button_text || '', button_link: s.button_link || '', is_active: s.is_active, sort_order: s.sort_order })
    setEditId(s.id); setShowModal(true)
  }

  const handleSave = async () => {
    const s = createClient()
    if (editId) await s.from('hero_slides').update(form).eq('id', editId)
    else await s.from('hero_slides').insert([form])
    setShowModal(false); fetchSlides()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return
    await createClient().from('hero_slides').delete().eq('id', id)
    fetchSlides()
  }

  const toggleActive = async (id: string, active: boolean) => {
    await createClient().from('hero_slides').update({ is_active: !active }).eq('id', id)
    fetchSlides()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Hero Slides</h1>
          <p className="text-sm text-gray-400">{slides.length} slides</p>
        </div>
        <button onClick={openAdd} className="btn-primary !py-2 !px-4 !text-sm"><HiPlus /> Add Slide</button>
      </div>

      <div className="space-y-4">
        {slides.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`admin-card ${!s.is_active ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{s.heading || 'No heading'}</h3>
                <p className="text-sm text-gray-400 mt-1">{s.subheading || 'No subheading'}</p>
                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                  <span>Button: {s.button_text}</span>
                  {s.image_link && <span>Has image</span>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => toggleActive(s.id, s.is_active)}
                  className={`px-2 py-1 rounded text-xs ${s.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                  {s.is_active ? 'Active' : 'Off'}
                </button>
                <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-purple-500/10 text-purple-400"><HiPencil /></button>
                <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"><HiTrash /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="admin-card w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{editId ? 'Edit' : 'Add'} Slide</h2>
                <button onClick={() => setShowModal(false)}><HiX size={20} className="text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm text-gray-400 mb-1">Heading</label>
                  <input value={form.heading} onChange={e => setForm({...form, heading: e.target.value})} className="input-glass" placeholder="Learn AI Today." /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Subheading</label>
                  <textarea value={form.subheading} onChange={e => setForm({...form, subheading: e.target.value})} className="input-glass" rows={2} /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Image URL (Google Drive)</label>
                  <input value={form.image_link} onChange={e => setForm({...form, image_link: e.target.value})} className="input-glass" placeholder="https://drive.google.com/uc?id=..." /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-400 mb-1">Button Text</label>
                    <input value={form.button_text} onChange={e => setForm({...form, button_text: e.target.value})} className="input-glass" /></div>
                  <div><label className="block text-sm text-gray-400 mb-1">Button Link</label>
                    <input value={form.button_link} onChange={e => setForm({...form, button_link: e.target.value})} className="input-glass" /></div>
                </div>
                <button onClick={handleSave} className="btn-primary w-full !justify-center">{editId ? 'Update' : 'Add'} Slide</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

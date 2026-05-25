'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiPlus, HiPencil, HiTrash, HiX, HiPhotograph, HiInformationCircle } from 'react-icons/hi'

interface Slide {
  id: string; image_link: string; heading: string; subheading: string
  button_text: string; button_link: string; is_active: boolean; sort_order: number
}

/**
 * Converts any Google Drive share URL to a direct-usable image URL.
 * Paste any of these formats and it will work:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?id=FILE_ID
 */
function toDirectUrl(url: string): string {
  if (!url) return ''
  if (url.includes('lh3.googleusercontent.com')) return url
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (idMatch) return `https://lh3.googleusercontent.com/d/${idMatch[1]}`
  return url
}

const defaultForm = { image_link: '', heading: '', subheading: '', button_text: 'Start Learning', button_link: 'https://wa.me/918638373298', is_active: true, sort_order: 0 }

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [imgPreviewError, setImgPreviewError] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchSlides = async () => {
    const s = createClient()
    const { data } = await s.from('hero_slides').select('*').order('sort_order')
    if (data) setSlides(data)
  }

  useEffect(() => { void fetchSlides() }, [])

  const openAdd = () => {
    setForm({ ...defaultForm, sort_order: slides.length })
    setEditId(null); setImgPreviewError(false); setShowModal(true)
  }

  const openEdit = (s: Slide) => {
    setForm({
      image_link: s.image_link, heading: s.heading || '',
      subheading: s.subheading || '', button_text: s.button_text || '',
      button_link: s.button_link || '', is_active: s.is_active, sort_order: s.sort_order
    })
    setEditId(s.id); setImgPreviewError(false); setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const s = createClient()
    // Auto-convert the Google Drive URL before saving
    const payload = { ...form, image_link: toDirectUrl(form.image_link) }
    if (editId) await s.from('hero_slides').update(payload).eq('id', editId)
    else await s.from('hero_slides').insert([payload])
    setSaving(false); setShowModal(false); fetchSlides()
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

  const previewUrl = toDirectUrl(form.image_link)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="admin-page-title">Hero Slides</h1>
          <p className="admin-page-subtitle">{slides.length} slide{slides.length !== 1 ? 's' : ''} — auto-rotate every 5 seconds on homepage</p>
        </div>
        <button onClick={openAdd} className="btn-primary !py-2 !px-4 !text-sm"><HiPlus /> Add Slide</button>
      </div>

      {/* How-to info box */}
      <div className="admin-card mb-6 flex gap-3 items-start" style={{ background: 'rgba(22,61,42,0.03)', border: '1px solid var(--border-color)' }}>
        <HiInformationCircle className="text-[var(--purple-400)] shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-[var(--text-secondary)]">
          <p className="font-semibold text-[var(--text-primary)] mb-1">How to add a Google Drive image</p>
          <ol className="space-y-1 list-decimal list-inside text-xs">
            <li>Open Google Drive → right-click your image → <strong>Share</strong></li>
            <li>Set access to <strong>&quot;Anyone with the link&quot;</strong> → Copy link</li>
            <li>Paste the copied link in the Image URL field — it will be converted automatically</li>
          </ol>
          <p className="mt-2 text-xs text-[var(--text-muted)]">Supported formats: <code className="bg-[var(--bg-tertiary)] px-1 rounded text-xs">drive.google.com/file/d/…</code>  <code className="bg-[var(--bg-tertiary)] px-1 rounded text-xs">drive.google.com/uc?id=…</code></p>
        </div>
      </div>

      {/* Slides list */}
      {slides.length === 0 ? (
        <div className="admin-card text-center py-16">
          <HiPhotograph className="mx-auto mb-3 text-4xl text-[var(--text-muted)]" />
          <p className="text-[var(--text-muted)] text-sm">No slides yet. Click <strong>Add Slide</strong> to create your first hero slide.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((s, i) => {
            const thumb = toDirectUrl(s.image_link)
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`admin-card ${!s.is_active ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="shrink-0 w-24 h-16 rounded-lg overflow-hidden border border-[var(--border-color)] flex items-center justify-center"
                    style={{ background: 'var(--bg-tertiary)' }}>
                    {thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    ) : (
                      <HiPhotograph className="text-2xl text-[var(--text-muted)]" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[var(--text-primary)] truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                      {s.heading || <span className="text-[var(--text-muted)] italic">No heading</span>}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5 line-clamp-2">{s.subheading || '—'}</p>
                    <div className="flex gap-3 mt-1.5 text-xs text-[var(--text-muted)]">
                      <span>Sort: {s.sort_order}</span>
                      <span>{s.image_link ? '🖼 Has image' : '🎨 Gradient only'}</span>
                      <span>Button: &quot;{s.button_text}&quot;</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => toggleActive(s.id, s.is_active)}
                      className={`px-2 py-1 rounded text-xs font-medium ${s.is_active ? 'bg-green-500/10 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                      {s.is_active ? 'Active' : 'Off'}
                    </button>
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-purple-500/10 text-purple-600"><HiPencil /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500"><HiTrash /></button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="admin-card w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {editId ? 'Edit' : 'Add'} Hero Slide
                </h2>
                <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><HiX size={20} /></button>
              </div>

              <div className="space-y-4">
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Google Drive Image URL
                  </label>
                  <input
                    value={form.image_link}
                    onChange={e => { setForm({ ...form, image_link: e.target.value }); setImgPreviewError(false) }}
                    className="input-glass"
                    placeholder="Paste Google Drive share link here…"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Paste any Drive share URL — it will be auto-converted. Leave empty for gradient background.
                  </p>
                </div>

                {/* Image Preview */}
                {previewUrl && (
                  <div className="rounded-lg overflow-hidden border border-[var(--border-color)]" style={{ maxHeight: 180 }}>
                    {imgPreviewError ? (
                      <div className="flex items-center gap-2 p-3 text-sm text-red-500" style={{ background: 'rgba(239,68,68,0.05)' }}>
                        <HiX /> Image failed to load — check the link or make sure it&apos;s shared publicly.
                      </div>
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full object-cover"
                        style={{ maxHeight: 180 }}
                        onError={() => setImgPreviewError(true)}
                      />
                    )}
                  </div>
                )}

                {/* Heading */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Heading</label>
                  <input value={form.heading} onChange={e => setForm({ ...form, heading: e.target.value })}
                    className="input-glass" placeholder="e.g. Learn AI Today. Lead Tomorrow." />
                </div>

                {/* Subheading */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Subheading</label>
                  <textarea value={form.subheading} onChange={e => setForm({ ...form, subheading: e.target.value })}
                    className="input-glass" rows={2} placeholder="Short description shown under the heading" />
                </div>

                {/* Button */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Button Text</label>
                    <input value={form.button_text} onChange={e => setForm({ ...form, button_text: e.target.value })} className="input-glass" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Button Link</label>
                    <input value={form.button_link} onChange={e => setForm({ ...form, button_link: e.target.value })} className="input-glass" />
                  </div>
                </div>

                {/* Sort order */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="input-glass" min={0} />
                </div>

                {/* Active toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 accent-[var(--purple-600)]" />
                  <span className="text-sm text-[var(--text-secondary)]">Active (show on homepage)</span>
                </label>

                <button onClick={handleSave} disabled={saving} className="btn-primary w-full !justify-center">
                  {saving ? 'Saving…' : (editId ? 'Update Slide' : 'Add Slide')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

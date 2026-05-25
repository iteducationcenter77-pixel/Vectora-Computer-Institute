'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiPlus, HiTrash, HiX, HiPhotograph, HiInformationCircle, HiCheckCircle, HiExclamation } from 'react-icons/hi'

interface HeroImage {
  id: string
  image_url: string
  sort_order: number
  is_active: boolean
  created_at: string
}

/** Convert any Google Drive share link to a direct lh3 image URL */
function toDirectUrl(url: string): string {
  if (!url.trim()) return ''
  if (url.includes('lh3.googleusercontent.com')) return url
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (idMatch) return `https://lh3.googleusercontent.com/d/${idMatch[1]}`
  return url
}

type PreviewStatus = 'idle' | 'ok' | 'error'

export default function AdminHeroImagesPage() {
  const [images, setImages] = useState<HeroImage[]>([])
  const [showModal, setShowModal] = useState(false)
  const [inputUrl, setInputUrl] = useState('')
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus>('idle')
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    const s = createClient()
    const { data } = await s.from('hero_images').select('*').order('sort_order')
    if (data) setImages(data)
  }

  useEffect(() => { void fetch() }, [])

  const handleUrlChange = (val: string) => {
    setInputUrl(val)
    setPreviewStatus('idle')
  }

  const handleSave = async () => {
    if (!inputUrl.trim() || previewStatus === 'error') return
    setSaving(true)
    const s = createClient()
    await s.from('hero_images').insert([{
      image_url: toDirectUrl(inputUrl),
      sort_order: images.length,
      is_active: true,
    }])
    setSaving(false)
    setShowModal(false)
    setInputUrl('')
    setPreviewStatus('idle')
    fetch()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this background image?')) return
    await createClient().from('hero_images').delete().eq('id', id)
    fetch()
  }

  const toggleActive = async (id: string, active: boolean) => {
    await createClient().from('hero_images').update({ is_active: !active }).eq('id', id)
    fetch()
  }

  const directUrl = toDirectUrl(inputUrl)

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="admin-page-title">Hero Background Images</h1>
          <p className="admin-page-subtitle">
            {images.filter(i => i.is_active).length} active image{images.filter(i => i.is_active).length !== 1 ? 's' : ''} — rotating every 30 seconds on homepage
          </p>
        </div>
        <button onClick={() => { setShowModal(true); setInputUrl(''); setPreviewStatus('idle') }}
          className="btn-primary !py-2 !px-4 !text-sm shrink-0">
          <HiPlus /> Add Image
        </button>
      </div>

      {/* Instructions card */}
      <div className="admin-card mb-6 flex gap-3 items-start"
        style={{ background: 'rgba(22,61,42,0.025)', border: '1px solid var(--border-color)' }}>
        <HiInformationCircle size={20} className="shrink-0 mt-0.5" style={{ color: 'var(--purple-400)' }} />
        <div className="text-sm">
          <p className="font-semibold text-[var(--text-primary)] mb-2">How to add images from Google Drive</p>
          <div className="space-y-1 text-xs text-[var(--text-secondary)]">
            <p>① Open Google Drive → right-click your photo → <strong>Share</strong></p>
            <p>② Change access to <strong>&ldquo;Anyone with the link&rdquo;</strong> → click <strong>Copy link</strong></p>
            <p>③ Paste the link here — it will be converted automatically ✓</p>
          </div>
        </div>
      </div>

      {/* Image grid */}
      {images.length === 0 ? (
        <div className="admin-card text-center py-20">
          <HiPhotograph className="mx-auto mb-4 text-5xl" style={{ color: 'var(--text-muted)' }} />
          <p className="font-semibold text-[var(--text-primary)] mb-1">No background images yet</p>
          <p className="text-sm text-[var(--text-muted)] mb-6">Add Google Drive images and they&apos;ll rotate on the hero section.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary mx-auto">
            <HiPlus /> Add First Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <motion.div key={img.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`admin-card !p-0 overflow-hidden group relative ${!img.is_active ? 'opacity-50' : ''}`}>
              {/* Image */}
              <div className="relative w-full" style={{ aspectRatio: '16/9', background: 'var(--bg-tertiary)' }}>
                <img
                  src={img.image_url}
                  alt={`Hero bg ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => toggleActive(img.id, img.is_active)}
                    className="p-2 rounded-full bg-white/90 text-xs font-semibold text-gray-800 hover:bg-white transition">
                    {img.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => handleDelete(img.id)}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition">
                    <HiTrash size={14} />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">Image {i + 1}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${img.is_active
                  ? 'bg-green-500/10 text-green-600'
                  : 'bg-gray-200 text-gray-500'}`}>
                  {img.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Image Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="admin-card w-full max-w-md" onClick={e => e.stopPropagation()}>

              {/* Modal header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
                  Add Background Image
                </h2>
                <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <HiX size={20} />
                </button>
              </div>

              {/* URL input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Google Drive Share Link
                </label>
                <input
                  value={inputUrl}
                  onChange={e => handleUrlChange(e.target.value)}
                  className="input-glass"
                  placeholder="Paste Google Drive share link here…"
                  autoFocus
                />
                <p className="text-xs text-[var(--text-muted)] mt-1.5">
                  Any share link format works — it&apos;s auto-converted ✓
                </p>
              </div>

              {/* Live preview */}
              {directUrl && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Preview</p>
                  <div className="rounded-lg overflow-hidden border border-[var(--border-color)] relative"
                    style={{ aspectRatio: '16/9', background: 'var(--bg-tertiary)' }}>
                    <img
                      key={directUrl}
                      src={directUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onLoad={() => setPreviewStatus('ok')}
                      onError={() => setPreviewStatus('error')}
                    />

                    {/* Status overlay */}
                    {previewStatus === 'ok' && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                        <HiCheckCircle size={12} /> Looks good!
                      </div>
                    )}
                    {previewStatus === 'error' && (
                      <div className="absolute inset-0 flex items-center justify-center text-center p-4"
                        style={{ background: 'rgba(239,68,68,0.06)' }}>
                        <div>
                          <HiExclamation className="mx-auto mb-1 text-red-500 text-2xl" />
                          <p className="text-xs text-red-600 font-medium">Image failed to load</p>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">Make sure the file is shared publicly</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving || !inputUrl.trim() || previewStatus === 'error'}
                className="btn-primary w-full !justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                {saving ? 'Adding…' : 'Add to Hero Section'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

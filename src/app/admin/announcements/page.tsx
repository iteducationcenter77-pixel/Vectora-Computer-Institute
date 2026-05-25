'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi'

interface Announcement { id: string; message: string; is_active: boolean }

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ message: '', is_active: true })

  const fetchData = async () => {
    const s = createClient()
    const { data } = await s.from('announcements').select('*').order('created_at', { ascending: false })
    if (data) setAnnouncements(data)
  }
  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchData() }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const openAdd = () => { setForm({ message: '', is_active: true }); setEditId(null); setShowModal(true) }
  const openEdit = (a: Announcement) => { setForm({ message: a.message, is_active: a.is_active }); setEditId(a.id); setShowModal(true) }

  const handleSave = async () => {
    const s = createClient()
    if (editId) await s.from('announcements').update(form).eq('id', editId)
    else await s.from('announcements').insert([form])
    setShowModal(false); fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return
    await createClient().from('announcements').delete().eq('id', id)
    fetchData()
  }

  const toggleActive = async (id: string, active: boolean) => {
    await createClient().from('announcements').update({ is_active: !active }).eq('id', id)
    fetchData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="admin-page-title">Announcements</h1>
          <p className="admin-page-subtitle">{announcements.length} announcements</p>
        </div>
        <button onClick={openAdd} className="btn-primary !py-2 !px-4 !text-sm"><HiPlus /> Add</button>
      </div>

      <div className="space-y-3">
        {announcements.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`admin-card flex items-center justify-between gap-4 ${!a.is_active ? 'opacity-50' : ''}`}>
            <p className="text-white flex-1">{a.message}</p>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => toggleActive(a.id, a.is_active)}
                className={`px-2 py-1 rounded text-xs ${a.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                {a.is_active ? 'Active' : 'Off'}
              </button>
              <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-purple-500/10 text-purple-400"><HiPencil /></button>
              <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"><HiTrash /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="admin-card w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{editId ? 'Edit' : 'Add'} Announcement</h2>
                <button onClick={() => setShowModal(false)}><HiX size={20} className="text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm text-gray-400 mb-1">Message *</label>
                  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="input-glass" rows={3}
                    placeholder="🎉 Admissions Open for 2026 Batch!" /></div>
                <button onClick={handleSave} className="btn-primary w-full !justify-center">{editId ? 'Update' : 'Add'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

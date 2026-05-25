'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi'

interface Course { id: string; course_name: string; duration: string; fees: string; description: string; benefits: string[]; image: string; is_active: boolean; sort_order: number }

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ course_name: '', duration: '', fees: '', description: '', benefits: '', image: '', is_active: true, sort_order: 0 })

  const fetch = async () => {
    const s = createClient()
    const { data } = await s.from('courses').select('*').order('sort_order')
    if (data) setCourses(data)
  }
  useEffect(() => {
    const timer = window.setTimeout(() => { void fetch() }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const openAdd = () => {
    setForm({ course_name: '', duration: '', fees: '', description: '', benefits: '', image: '', is_active: true, sort_order: courses.length })
    setEditId(null); setShowModal(true)
  }

  const openEdit = (c: Course) => {
    setForm({ course_name: c.course_name, duration: c.duration || '', fees: c.fees || '', description: c.description || '', benefits: (c.benefits || []).join(', '), image: c.image || '', is_active: c.is_active, sort_order: c.sort_order })
    setEditId(c.id); setShowModal(true)
  }

  const handleSave = async () => {
    const s = createClient()
    const payload = { ...form, benefits: form.benefits.split(',').map(b => b.trim()).filter(Boolean) }
    if (editId) await s.from('courses').update(payload).eq('id', editId)
    else await s.from('courses').insert([payload])
    setShowModal(false); fetch()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return
    await createClient().from('courses').delete().eq('id', id)
    fetch()
  }

  const toggleActive = async (id: string, active: boolean) => {
    await createClient().from('courses').update({ is_active: !active }).eq('id', id)
    fetch()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="admin-page-title">Courses</h1>
          <p className="admin-page-subtitle">{courses.length} total courses</p>
        </div>
        <button onClick={openAdd} className="btn-primary !py-2 !px-4 !text-sm"><HiPlus /> Add Course</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`admin-card ${!c.is_active ? 'opacity-50' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <h3 className="card-title flex-1 min-w-0">{c.course_name}</h3>
              <div className="flex flex-wrap gap-1.5 shrink-0">
                <button onClick={() => toggleActive(c.id, c.is_active)}
                  className={`badge ${c.is_active ? 'badge-verified' : 'bg-gray-500/10 text-gray-400'}`}>
                  {c.is_active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => openEdit(c)} className="admin-action-icon hover:bg-purple-500/10 text-purple-400" aria-label={`Edit ${c.course_name}`}><HiPencil /></button>
                <button onClick={() => handleDelete(c.id)} className="admin-action-icon hover:bg-red-500/10 text-red-400" aria-label={`Delete ${c.course_name}`}><HiTrash /></button>
              </div>
            </div>
            <p className="card-text !text-sm mb-4 line-clamp-3">{c.description}</p>
            <div className="meta-row text-xs">
              <span className="meta-pill">{c.duration}</span>
              <span className="meta-pill">{c.fees}</span>
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
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{editId ? 'Edit' : 'Add'} Course</h2>
                <button onClick={() => setShowModal(false)}><HiX size={20} className="text-gray-400" /></button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm text-gray-400 mb-1">Course Name *</label>
                  <input value={form.course_name} onChange={e => setForm({...form, course_name: e.target.value})} className="input-glass" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-400 mb-1">Duration</label>
                    <input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="input-glass" placeholder="6 Months" /></div>
                  <div><label className="block text-sm text-gray-400 mb-1">Fees</label>
                    <input value={form.fees} onChange={e => setForm({...form, fees: e.target.value})} className="input-glass" placeholder="₹10,000" /></div>
                </div>
                <div><label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-glass" rows={3} /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Benefits (comma separated)</label>
                  <input value={form.benefits} onChange={e => setForm({...form, benefits: e.target.value})} className="input-glass" placeholder="Python, ML, Projects" /></div>
                <div><label className="block text-sm text-gray-400 mb-1">Image URL</label>
                  <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="input-glass" placeholder="Google Drive link" /></div>
                <button onClick={handleSave} className="btn-primary w-full !justify-center">{editId ? 'Update' : 'Add'} Course</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

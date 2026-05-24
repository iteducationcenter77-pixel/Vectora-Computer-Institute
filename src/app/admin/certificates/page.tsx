'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiPlus, HiSearch, HiPencil, HiTrash, HiX, HiDownload } from 'react-icons/hi'

interface Cert { id: string; student_name: string; course: string; certificate_code: string; issue_date: string; pdf_link: string; status: string }

const courseAbbr: Record<string, string> = {
  'AI & Data Science': 'AI', 'DCA': 'DCA', 'ADCA': 'ADCA', 'PGDCA': 'PGDCA',
  'Tally Prime': 'TAL', 'Graphic Design': 'GD', 'Web Development': 'WD',
  'Digital Marketing': 'DM', 'Cyber Security': 'CS',
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Cert[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ student_name: '', course: 'AI & Data Science', certificate_code: '', issue_date: '', pdf_link: '', status: 'Verified' })

  const fetchCerts = async () => {
    const s = createClient()
    const { data } = await s.from('certificates').select('*').order('created_at', { ascending: false })
    if (data) {
      setCerts(data)
      const params = new URLSearchParams(window.location.search)
      if (params.get('add') === 'true') {
        const abbr = courseAbbr['AI & Data Science'] || 'GEN'
        const year = new Date().getFullYear()
        const seq = String(data.length + 1).padStart(3, '0')
        const code = `VTCI-${abbr}-${year}-${seq}`
        setForm({ student_name: '', course: 'AI & Data Science', certificate_code: code, issue_date: new Date().toISOString().split('T')[0], pdf_link: '', status: 'Verified' })
        setEditId(null)
        setShowModal(true)
      }
    }
  }

  useEffect(() => { fetchCerts() }, [])

  const generateCode = (course: string) => {
    const abbr = courseAbbr[course] || 'GEN'
    const year = new Date().getFullYear()
    const seq = String(certs.length + 1).padStart(3, '0')
    return `VTCI-${abbr}-${year}-${seq}`
  }

  const openAdd = () => {
    const code = generateCode('AI & Data Science')
    setForm({ student_name: '', course: 'AI & Data Science', certificate_code: code, issue_date: new Date().toISOString().split('T')[0], pdf_link: '', status: 'Verified' })
    setEditId(null); setShowModal(true)
  }

  const openEdit = (c: Cert) => {
    setForm({ student_name: c.student_name, course: c.course, certificate_code: c.certificate_code, issue_date: c.issue_date, pdf_link: c.pdf_link || '', status: c.status })
    setEditId(c.id); setShowModal(true)
  }

  const handleSave = async () => {
    const s = createClient()
    if (editId) {
      await s.from('certificates').update(form).eq('id', editId)
    } else {
      await s.from('certificates').insert([form])
    }
    setShowModal(false); fetchCerts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certificate?')) return
    const s = createClient()
    await s.from('certificates').delete().eq('id', id)
    fetchCerts()
  }

  const exportCSV = () => {
    const headers = ['Student Name', 'Course', 'Code', 'Issue Date', 'Status']
    const rows = certs.map(c => [c.student_name, c.course, c.certificate_code, c.issue_date, c.status])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'certificates.csv'; a.click()
  }

  const filtered = certs.filter(c =>
    c.student_name.toLowerCase().includes(search.toLowerCase()) ||
    c.certificate_code.toLowerCase().includes(search.toLowerCase()) ||
    c.course.toLowerCase().includes(search.toLowerCase())
  )

  const courses = Object.keys(courseAbbr)

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Certificates</h1>
          <p className="text-sm text-gray-400">{certs.length} total certificates</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="btn-secondary !py-2 !px-4 !text-sm"><HiDownload /> Export</button>
          <button onClick={openAdd} className="btn-primary !py-2 !px-4 !text-sm"><HiPlus /> Add Certificate</button>
        </div>
      </div>

      <div className="relative mb-6">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, code, or course..."
          className="input-glass !pl-10" />
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead><tr><th>Student</th><th>Course</th><th>Code</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="!text-white font-medium">{c.student_name}</td>
                <td>{c.course}</td>
                <td><code className="text-purple-300 text-xs bg-purple-500/10 px-2 py-1 rounded">{c.certificate_code}</code></td>
                <td>{new Date(c.issue_date).toLocaleDateString('en-IN')}</td>
                <td><span className={`badge ${c.status === 'Verified' ? 'badge-verified' : 'badge-revoked'}`}>{c.status}</span></td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-purple-500/10 text-purple-400"><HiPencil /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"><HiTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="text-center !text-gray-500 py-8">No certificates found</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="admin-card w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{editId ? 'Edit' : 'Add'} Certificate</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><HiX size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Student Name *</label>
                  <input type="text" value={form.student_name} onChange={e => setForm({...form, student_name: e.target.value})} className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Course *</label>
                  <select value={form.course} onChange={e => { setForm({...form, course: e.target.value, certificate_code: editId ? form.certificate_code : generateCode(e.target.value) }) }} className="input-glass">
                    {courses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Certificate Code *</label>
                  <input type="text" value={form.certificate_code} onChange={e => setForm({...form, certificate_code: e.target.value})} className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Issue Date *</label>
                  <input type="date" value={form.issue_date} onChange={e => setForm({...form, issue_date: e.target.value})} className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">PDF Link (Google Drive)</label>
                  <input type="url" value={form.pdf_link} onChange={e => setForm({...form, pdf_link: e.target.value})} className="input-glass" placeholder="https://drive.google.com/..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-glass">
                    <option value="Verified">Verified</option>
                    <option value="Revoked">Revoked</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <button onClick={handleSave} className="btn-primary w-full !justify-center">{editId ? 'Update' : 'Add'} Certificate</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

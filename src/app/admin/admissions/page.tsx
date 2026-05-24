'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { HiDownload, HiTrash } from 'react-icons/hi'

interface Admission { id: string; student_name: string; phone: string; email: string; course: string; address: string; message: string; status: string; created_at: string }

export default function AdminAdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([])
  const [filter, setFilter] = useState('All')

  const fetchData = async () => {
    const s = createClient()
    const { data } = await s.from('admissions').select('*').order('created_at', { ascending: false })
    if (data) setAdmissions(data)
  }
  useEffect(() => { fetchData() }, [])

  const updateStatus = async (id: string, status: string) => {
    await createClient().from('admissions').update({ status }).eq('id', id)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return
    await createClient().from('admissions').delete().eq('id', id)
    fetchData()
  }

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Course', 'Address', 'Status', 'Date']
    const rows = admissions.map(a => [a.student_name, a.phone, a.email || '', a.course || '', a.address || '', a.status, new Date(a.created_at).toLocaleDateString()])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'admissions.csv'; a.click()
  }

  const filtered = filter === 'All' ? admissions : admissions.filter(a => a.status === filter)
  const statuses = ['All', 'New', 'Contacted', 'Enrolled', 'Rejected']

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Admissions</h1>
          <p className="text-sm text-gray-400">{admissions.length} submissions</p>
        </div>
        <button onClick={exportCSV} className="btn-secondary !py-2 !px-4 !text-sm"><HiDownload /> Export CSV</button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm ${filter === s ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800 text-gray-400'}`}>
            {s} {s !== 'All' && <span className="ml-1 text-xs">({admissions.filter(a => a.status === s).length})</span>}
          </button>
        ))}
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Phone</th><th>Course</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((a, i) => (
              <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <td className="!text-white font-medium">
                  {a.student_name}
                  {a.email && <p className="text-xs text-gray-500">{a.email}</p>}
                </td>
                <td>{a.phone}</td>
                <td>{a.course || '-'}</td>
                <td>
                  <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)}
                    className={`badge cursor-pointer border-0 text-sm ${
                      a.status === 'New' ? 'badge-new' : a.status === 'Contacted' ? 'badge-contacted' : a.status === 'Enrolled' ? 'badge-enrolled' : 'badge-revoked'
                    }`}>
                    {['New', 'Contacted', 'Enrolled', 'Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="text-xs">{new Date(a.created_at).toLocaleDateString('en-IN')}</td>
                <td>
                  <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400"><HiTrash /></button>
                </td>
              </motion.tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="text-center !text-gray-500 py-8">No admissions found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

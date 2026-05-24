'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<string[]>([])

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('announcements')
        .select('message')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (data && data.length > 0) {
        setAnnouncements(data.map((a) => a.message))
      }
    }
    fetchAnnouncements()
  }, [])

  // Fallback announcements when Supabase isn't connected
  const displayAnnouncements = announcements.length > 0
    ? announcements
    : [
        'Admissions Open for 2026 Batch — Enroll Now!',
        'New AI & Data Science Course Launched — Limited Seats!',
        'Free Workshop on Web Development — Register Today!',
        'Internship Program Starting Soon — Apply Now!',
      ]

  return (
    <div className="announcement-bar text-sm" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="ticker">
        {[...displayAnnouncements, ...displayAnnouncements].map((msg, i) => (
          <span key={i} className="text-[#FAF9F6]/95 font-medium whitespace-nowrap flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            {msg}
          </span>
        ))}
      </div>
    </div>
  )
}

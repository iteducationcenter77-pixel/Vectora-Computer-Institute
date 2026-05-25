'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { HiHome, HiAcademicCap, HiPhotograph, HiShieldCheck, HiSpeakerphone, HiUserGroup, HiViewGrid, HiLogout, HiMenu, HiX, HiCollection } from 'react-icons/hi'

const navItems = [
  { name: 'Dashboard',     href: '/admin/dashboard',    icon: <HiViewGrid /> },
  { name: 'Certificates', href: '/admin/certificates', icon: <HiShieldCheck /> },
  { name: 'Courses',      href: '/admin/courses',      icon: <HiAcademicCap /> },
  { name: 'Gallery',      href: '/admin/gallery',      icon: <HiPhotograph /> },
  { name: 'Hero Images',  href: '/admin/hero-images',  icon: <HiCollection /> },
  { name: 'Announcements', href: '/admin/announcements', icon: <HiSpeakerphone /> },
  { name: 'Admissions',   href: '/admin/admissions',   icon: <HiUserGroup /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) return
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserEmail(user.email || 'Admin')
    }
    getUser()
  }, [isLoginPage])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (isLoginPage) return <>{children}</>

  return (
    <div className="flex min-h-screen admin-panel-wrapper" style={{ background: 'var(--bg-primary)' }}>

      {/* Mobile Top Header Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between px-4 z-40 md:hidden"
        style={{ backdropFilter: 'var(--glass-blur)' }}
      >
        <div className="flex items-center gap-2">
          <Image src="/vec-logo.png" alt="Vectora logo" width={28} height={28} className="w-7 h-7 object-contain" />
          <span className="text-sm font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Vectora Admin
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <HiX size={18} /> : <HiMenu size={18} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 flex flex-col h-screen w-64 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }}
      >
        {/* Sidebar Header — pinned */}
        <div className="shrink-0 flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <Image src="/vec-logo.png" alt="Vectora logo" width={36} height={36} className="w-9 h-9 object-contain" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-[var(--text-primary)] leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>Vectora Admin</p>
            <p className="text-[0.65rem] text-[var(--text-muted)] truncate max-w-[140px]">{userEmail}</p>
          </div>
        </div>

        {/* Nav — scrollable middle */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer — pinned */}
        <div className="shrink-0 px-3 py-4 space-y-0.5" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button onClick={handleLogout} className="admin-nav-item w-full" style={{ color: '#dc2626' }}>
            <HiLogout /> Logout
          </button>
          <Link href="/" className="admin-nav-item w-full" style={{ color: 'var(--text-muted)' }}>
            <HiHome /> View Website
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        {/* Mobile top bar spacer */}
        <div className="md:hidden h-16 shrink-0" />
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

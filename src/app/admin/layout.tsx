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

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-3 left-3 z-50 md:hidden p-2 rounded-lg shadow-sm"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <HiX size={20} /> : <HiMenu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 flex flex-col h-screen w-64 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }}
      >
        {/* Sidebar Header — pinned */}
        <div className="shrink-0 flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="w-10 h-10 rounded-lg bg-white border border-[var(--border-color)] flex items-center justify-center p-1.5 shadow-sm shrink-0">
            <Image src="/vec-logo.png" alt="Vectora logo" width={36} height={36} className="h-full w-full object-contain" />
          </div>
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
        <div className="md:hidden h-14 shrink-0" />
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

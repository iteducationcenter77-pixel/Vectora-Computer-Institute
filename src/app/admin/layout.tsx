'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { HiHome, HiAcademicCap, HiPhotograph, HiShieldCheck, HiSpeakerphone, HiUserGroup, HiViewGrid, HiLogout, HiMenu, HiX } from 'react-icons/hi'

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: <HiViewGrid /> },
  { name: 'Certificates', href: '/admin/certificates', icon: <HiShieldCheck /> },
  { name: 'Courses', href: '/admin/courses', icon: <HiAcademicCap /> },
  { name: 'Gallery', href: '/admin/gallery', icon: <HiPhotograph /> },
  { name: 'Hero Slides', href: '/admin/hero', icon: <HiHome /> },
  { name: 'Announcements', href: '/admin/announcements', icon: <HiSpeakerphone /> },
  { name: 'Admissions', href: '/admin/admissions', icon: <HiUserGroup /> },
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

  // Don't show sidebar on login page
  if (isLoginPage) return <>{children}</>

  return (
    <div className="flex min-h-screen admin-panel-wrapper" style={{ background: 'var(--bg-primary)' }}>
      {/* Mobile Toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg text-[var(--text-primary)]"
        style={{ background: 'var(--bg-tertiary)' }}>
        {sidebarOpen ? <HiX size={20} /> : <HiMenu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 z-40 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center font-bold text-white"
               style={{ fontFamily: 'var(--font-heading)' }}>V</div>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>Vectora Admin</p>
              <p className="text-[0.65rem] text-[var(--text-muted)] truncate max-w-[140px]">{userEmail}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}>
                {item.icon} {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button onClick={handleLogout} className="admin-nav-item w-full text-red-400 hover:!text-red-300 hover:!bg-red-500/10">
            <HiLogout /> Logout
          </button>
          <Link href="/" className="admin-nav-item w-full mt-1 text-gray-500">
            <HiHome /> View Website
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="flex-1 min-h-screen p-4 md:p-8 pt-16 md:pt-8">{children}</main>
    </div>
  )
}

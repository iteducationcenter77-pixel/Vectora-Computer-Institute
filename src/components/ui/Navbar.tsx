'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Verify Certificate', href: '/verify' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={false}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`relative w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3'
          : 'py-5'
      }`}
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: isScrolled ? '0 4px 15px -4px rgba(22, 61, 42, 0.04)' : 'none',
      }}
    >
      <div className="container-main flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group min-w-0" aria-label="Vectora Computer Institute home">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-lg bg-white border border-[var(--border-color)] flex items-center justify-center p-1.5 shadow-sm">
              <Image src="/vec-logo.png" alt="Vectora logo" width={36} height={36} className="h-full w-full object-contain" priority />
            </div>
          </div>
          <div className="min-w-0">
            <span className="block text-xl font-bold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              <span className="text-[var(--text-primary)]">Vectora</span>
            </span>
            <p className="text-[0.6rem] text-[var(--text-secondary)] tracking-widest uppercase leading-tight">Computer Institute</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold transition-colors duration-300 relative group"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--text-primary)] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          <a
            href="https://wa.me/918638373298"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !py-2.5 !px-5 !text-sm whitespace-nowrap"
          >
            Contact Us
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden text-[var(--text-primary)] text-2xl p-2 rounded-lg"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
            style={{
              background: 'var(--bg-primary)',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <div className="container-main py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold transition-colors py-2"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <a
                href="https://wa.me/918638373298"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !justify-center !text-center mt-2"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

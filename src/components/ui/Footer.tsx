'use client'

import Link from 'next/link'
import { FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa'

const footerLinks = [
  { title: 'Quick Links', links: [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Verify Certificate', href: '/verify' },
  ]},
  { title: 'Courses', links: [
    { name: 'AI & Data Science', href: '/courses' },
    { name: 'Web Development', href: '/courses' },
    { name: 'Graphic Design', href: '/courses' },
    { name: 'Digital Marketing', href: '/courses' },
  ]},
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#163D2A] to-[#234934] flex items-center justify-center font-bold text-white text-lg animate-gradient"
                style={{ fontFamily: 'var(--font-heading)' }}>
                V
              </div>
              <div>
                <span className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>Vectora</span>
                <p className="text-[0.55rem] text-[var(--text-secondary)] -mt-1 tracking-widest uppercase">Computer Institute</p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              A modern computer training centre focused on AI, programming, digital skills, and practical education.
            </p>
            <div className="flex gap-3">
              <a href="https://wa.me/918638373298" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[var(--purple-600)]/10 flex items-center justify-center text-[var(--purple-600)] hover:bg-[var(--purple-600)]/20 transition-all">
                <FaWhatsapp />
              </a>
              <a href="tel:+918638373298"
                className="w-9 h-9 rounded-lg bg-[var(--purple-600)]/10 flex items-center justify-center text-[var(--purple-600)] hover:bg-[var(--purple-600)]/20 transition-all">
                <FaPhoneAlt size={13} />
              </a>
              <a href="mailto:vectora.help@gmail.com"
                className="w-9 h-9 rounded-lg bg-[var(--gold-300)]/10 flex items-center justify-center text-[var(--gold-300)] hover:bg-[var(--gold-300)]/20 transition-all">
                <FaEnvelope size={13} />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4 tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                <FaMapMarkerAlt className="text-[var(--text-primary)] mt-1 shrink-0" />
                Howly, Assam (Near Dorika)
              </li>
              <li className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                <FaPhoneAlt className="text-[var(--text-primary)] shrink-0" size={13} />
                +91 8638373298
              </li>
              <li className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                <FaEnvelope className="text-[var(--text-primary)] shrink-0" size={13} />
                vectora.help@gmail.com
              </li>
              <li className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                <FaGlobe className="text-[var(--text-primary)] shrink-0" size={13} />
                cbceskillindia.in
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Vectora Computer Institute. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Empowering the future with technology education.
          </p>
        </div>
      </div>
    </footer>
  )
}

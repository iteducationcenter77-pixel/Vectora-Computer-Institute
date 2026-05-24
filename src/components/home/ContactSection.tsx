'use client'

import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaGlobe, FaWhatsapp } from 'react-icons/fa'

const contactInfo = [
  { icon: <FaMapMarkerAlt />, label: 'Address', value: 'Howly, Assam (Near Dorika)', color: 'purple' },
  { icon: <FaPhoneAlt size={14} />, label: 'Phone', value: '+91 8638373298', href: 'tel:+918638373298', color: 'green' },
  { icon: <FaEnvelope size={14} />, label: 'Email', value: 'vectora.help@gmail.com', href: 'mailto:vectora.help@gmail.com', color: 'blue' },
  { icon: <FaGlobe size={14} />, label: 'Website', value: 'cbceskillindia.in', href: 'https://cbceskillindia.in', color: 'gold' },
]

export default function ContactSection() {
  return (
    <section className="section-padding relative" id="contact" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container-main">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4"
            style={{ background: 'rgba(22, 61, 42, 0.04)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}><FaPhoneAlt size={11} /> Contact</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Get In <span className="text-gradient-purple">Touch</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">Have questions? We&apos;d love to hear from you.</p>
          <div className="section-divider mt-6" style={{ background: 'var(--gradient-purple)' }} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {contactInfo.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}>
                {c.href ? (
                  <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="glass-card p-5 flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-primary)] group-hover:scale-110 transition-transform">{c.icon}</div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-0.5 font-medium">{c.label}</p>
                      <p className="text-[var(--text-primary)] font-bold">{c.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="glass-card p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-primary)]">{c.icon}</div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-0.5 font-medium">{c.label}</p>
                      <p className="text-[var(--text-primary)] font-bold">{c.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            <motion.a href="https://wa.me/918638373298" target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="btn-primary w-full !justify-center !text-lg mt-4 flex items-center gap-2">
              <FaWhatsapp size={22} /> Chat on WhatsApp
            </motion.a>
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-sm" style={{ minHeight: '400px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.0!2d91.85!3d26.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDI3JzAuMCJOIDkxwrA1MScwLjAiRQ!5e0!3m2!1sen!2sin!4v1"
              width="100%" height="100%" style={{ border: 0, minHeight: '400px', filter: 'grayscale(0.1) opacity(0.9)' }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Vectora Computer Institute Location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

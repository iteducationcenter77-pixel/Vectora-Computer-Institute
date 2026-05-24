'use client'

import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/918638373298"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 rounded-full text-white font-semibold shadow-xl"
      style={{
        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
        fontFamily: 'var(--font-heading)',
        fontSize: '0.9rem',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(37, 211, 102, 0.4)' }}
      whileTap={{ scale: 0.95 }}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={22} />
      <span className="hidden sm:inline">Chat with us</span>
    </motion.a>
  )
}

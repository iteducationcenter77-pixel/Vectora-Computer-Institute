'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChat, HiX, HiArrowRight } from 'react-icons/hi'

const faqData = [
  { q: 'What courses do you offer?', a: 'We offer AI & Data Science, DCA, ADCA, PGDCA, Tally, Graphic Design, Web Development, Digital Marketing, and Cyber Security courses.' },
  { q: 'How do I verify my certificate?', a: 'Visit our Certificate Verification page and enter your unique certificate code (e.g., VTCI-AI-2026-001) to verify instantly.' },
  { q: 'What are the fees?', a: 'Fees range from ₹4,000 to ₹15,000 depending on the course. Visit our Courses page for detailed pricing.' },
  { q: 'Where are you located?', a: 'We are located in Howly, Assam (Near Dorika). Contact us at +91 8638373298.' },
  { q: 'How to enroll?', a: 'You can enroll online through our admission form or contact us directly on WhatsApp at +91 8638373298.' },
  { q: 'Do you provide certificates?', a: 'Yes! We provide verified digital certificates that can be authenticated online through our certificate verification system.' },
]

interface Message { from: 'bot' | 'user'; text: string }

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Hello! I\'m the Vectora assistant. How can I help you today?' },
  ])

  const handleFAQ = (q: string, a: string) => {
    setMessages(prev => [...prev, { from: 'user', text: q }, { from: 'bot', text: a }])
  }

  const showingFAQs = messages.length <= 2

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl"
        style={{ background: 'var(--gradient-purple)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open chat"
      >
        {open ? <HiX size={22} /> : <HiChat size={22} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-40 right-6 z-50 w-80 max-h-[500px] rounded-2xl overflow-hidden flex flex-col"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: '0 10px 40px rgba(99,102,241,0.08)' }}
          >
            {/* Header */}
            <div className="p-4 flex items-center gap-3" style={{ background: 'var(--gradient-purple)' }}>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                <HiChat className="text-white text-base" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>Vectora Assistant</p>
                <p className="text-white/60 text-xs">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                    m.from === 'user'
                      ? 'bg-purple-600 text-white rounded-br-sm'
                      : 'text-slate-800 rounded-bl-sm'
                  }`} style={m.from === 'bot' ? { background: 'rgba(99,102,241,0.06)' } : {}}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Buttons */}
            {showingFAQs && (
              <div className="p-3 space-y-2 max-h-48 overflow-y-auto" style={{ borderTop: '1px solid var(--border-color)' }}>
                <p className="text-xs text-slate-500 mb-2">Quick questions:</p>
                {faqData.map((faq, i) => (
                  <button key={i} onClick={() => handleFAQ(faq.q, faq.a)}
                    className="w-full text-left p-2 rounded-lg text-xs text-purple-700 hover:bg-purple-50 font-semibold transition-colors flex items-center gap-2">
                    <HiArrowRight className="shrink-0" /> {faq.q}
                  </button>
                ))}
              </div>
            )}

            {/* WhatsApp Fallback */}
            <div className="p-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <a href="https://wa.me/918638373298" target="_blank" rel="noopener noreferrer"
                className="block w-full text-center py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

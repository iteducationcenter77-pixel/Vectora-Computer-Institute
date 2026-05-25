'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChat, HiX, HiChevronDown, HiArrowRight } from 'react-icons/hi'

// ── FAQ knowledge base ──────────────────────────────────────────────
const faqs = [
  {
    category: '📚 Courses',
    items: [
      { q: 'What courses do you offer?', a: 'We offer: AI & Data Science, DCA, ADCA, PGDCA, Tally Prime, Graphic Design, Web Development, Digital Marketing, and Cyber Security. Visit our Courses page for full details!' },
      { q: 'What is the course duration?', a: 'Durations vary: DCA / Web Dev / AI — 6 months | ADCA / PGDCA — 12 months | Tally / Digital Marketing — 3 months | Graphic Design / Cyber Security — 4 months.' },
      { q: 'What are the course fees?', a: 'Fees range from ₹4,000 (Tally) to ₹15,000 (AI & Data Science). All fees include study materials and a verified certificate. Contact us for current offers.' },
    ],
  },
  {
    category: '📍 Location & Contact',
    items: [
      { q: 'Where is Vectora located?', a: 'We are located in Howly, Assam (Near Dorika). Easy to reach by bus or auto from Howly town center.' },
      { q: 'What is the contact number?', a: 'You can reach us at 📞 +91 8638373298. Also available on WhatsApp — just click the button below!' },
      { q: 'What is your email address?', a: 'Our email is 📧 vectora.help@gmail.com. You can also reach us at cbceskillindia.in' },
    ],
  },
  {
    category: '🏛️ Affiliation & Recognition',
    items: [
      { q: 'Are you affiliated with Skill India?', a: 'Yes! Vectora Computer Institute is affiliated with SCBCE Skill India, an initiative under the Government of India\'s Skill India Mission for skill development.' },
      { q: 'What is the affiliation?', a: 'We are affiliated with SCBCE (Skill Council for Business Correspondence & Environment) under Skill India. Our certificates are nationally recognized.' },
      { q: 'Are your certificates recognized?', a: 'Yes! Our certificates are recognized by SCBCE Skill India and can be verified online using your unique certificate code at vectora\'s verification page.' },
    ],
  },
  {
    category: '📝 Admission & Enrollment',
    items: [
      { q: 'How do I apply / enroll?', a: 'You can apply online through our Online Admission form on this website, or visit us directly at Howly, Assam, or WhatsApp us at +91 8638373298.' },
      { q: 'Is there an admission test?', a: 'No admission test required! Just fill out the form and our team will contact you within 24 hours to guide you through enrollment.' },
      { q: 'What documents are needed?', a: 'You\'ll need: Aadhaar card / ID proof, recent passport photo, and your previous mark sheets. Bring these when you visit us for registration.' },
    ],
  },
  {
    category: '🎓 Certificate',
    items: [
      { q: 'How do I verify my certificate?', a: 'Visit the "Verify Certificate" page on this website and enter your certificate code (e.g., VTCI-AI-2026-001) to verify instantly.' },
      { q: 'When will I get my certificate?', a: 'Certificates are issued after successful course completion. The exact timeline depends on your batch and exam schedule.' },
      { q: 'Is the certificate digital or physical?', a: 'We provide both! A verified digital certificate you can share online, and a physical printed certificate for your records.' },
    ],
  },
]

interface Message {
  id: number
  from: 'bot' | 'user'
  text: string
}

let msgId = 0

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: ++msgId, from: 'bot', text: 'Hello! 👋 I\'m the Vectora Assistant. Ask me anything about our courses, fees, location, affiliation, or admission process!' },
  ])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showFAQs, setShowFAQs] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
    }
  }, [messages, open])

  const handleQuestion = (q: string, a: string) => {
    setMessages(prev => [
      ...prev,
      { id: ++msgId, from: 'user', text: q },
      { id: ++msgId, from: 'bot', text: a },
    ])
    setActiveCategory(null)
    // Keep FAQ panel visible so users can ask more questions
  }

  const clearChat = () => {
    setMessages([{ id: ++msgId, from: 'bot', text: 'Chat cleared! How can I help you? 😊' }])
    setActiveCategory(null)
  }

  const currentCategory = faqs.find(f => f.category === activeCategory)

  return (
    <>
      {/* ── Toggle Button ── */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl"
        style={{ background: 'var(--gradient-purple)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open Vectora chat assistant"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><HiX size={22} /></motion.span>
            : <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><HiChat size={22} /></motion.span>
          }
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed bottom-40 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 20px 60px rgba(22,61,42,0.12)',
              height: 520,
            }}
          >
            {/* ── Header ── */}
            <div className="shrink-0 flex items-center justify-between px-4 py-3" style={{ background: 'var(--gradient-purple)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <HiChat className="text-white" size={16} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>Vectora Assistant</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                    <p className="text-white/70 text-[10px]">Online · Replies instantly</p>
                  </div>
                </div>
              </div>
              <button onClick={clearChat} className="text-white/60 hover:text-white text-[10px] border border-white/20 rounded px-1.5 py-0.5 transition">
                Clear
              </button>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5" style={{ background: 'var(--bg-secondary)' }}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.from === 'bot' && (
                    <div className="w-6 h-6 rounded-full shrink-0 mr-2 mt-0.5 flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ background: 'var(--gradient-purple)' }}>V</div>
                  )}
                  <div
                    className="max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                    style={m.from === 'user'
                      ? { background: 'var(--purple-600)', color: '#fff', borderBottomRightRadius: 4 }
                      : { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderBottomLeftRadius: 4 }
                    }
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* ── FAQ Panel ── */}
            <div className="shrink-0" style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', maxHeight: 200, overflowY: 'auto' }}>
              {/* FAQ toggle */}
              <button
                onClick={() => setShowFAQs(v => !v)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
              >
                <span>💬 Ask a question</span>
                <HiChevronDown className={`transition-transform ${showFAQs ? 'rotate-180' : ''}`} size={14} />
              </button>

              <AnimatePresence>
                {showFAQs && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {/* Category picker */}
                    {!activeCategory ? (
                      <div className="px-2 pb-2 space-y-1">
                        {faqs.map(cat => (
                          <button
                            key={cat.category}
                            onClick={() => setActiveCategory(cat.category)}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition hover:opacity-80"
                            style={{ background: 'rgba(22,61,42,0.04)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                          >
                            {cat.category}
                            <HiArrowRight size={12} className="text-[var(--text-muted)]" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      /* Questions in category */
                      <div className="px-2 pb-2">
                        <button
                          onClick={() => setActiveCategory(null)}
                          className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-1.5 transition"
                        >
                          ← Back to categories
                        </button>
                        <div className="space-y-1">
                          {currentCategory?.items.map((item, i) => (
                            <button
                              key={i}
                              onClick={() => handleQuestion(item.q, item.a)}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition hover:opacity-80"
                              style={{ background: 'rgba(22,61,42,0.04)', color: 'var(--purple-600)', border: '1px solid var(--border-color)' }}
                            >
                              {item.q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── WhatsApp footer ── */}
            <div className="shrink-0 px-3 py-2.5" style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
              <a
                href="https://wa.me/918638373298"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold text-white transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

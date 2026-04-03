'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Menu, X, Hexagon } from 'lucide-react'
import clsx from 'clsx'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/identities', label: 'Identities' },
  { href: '/credentials', label: 'Credentials' },
  { href: '/verify', label: 'Verify' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-4">
        <div className="glass-card px-6 py-3 flex items-center justify-between max-w-7xl mx-auto border-brand-800/40">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Hexagon className="w-8 h-8 text-brand-500 group-hover:text-brand-400 transition-colors" strokeWidth={1.5} />
              <Shield className="w-4 h-4 text-cyber-400 absolute inset-0 m-auto" strokeWidth={2} />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-white">Block</span>
              <span className="gradient-text">ID</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'bg-brand-600/30 text-brand-300 border border-brand-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/issue"
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-all duration-200 glow-indigo"
            >
              Issue Credential
            </Link>
          </div>

          {/* Mobile menu */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mx-4 mt-2"
          >
            <div className="glass-card p-4 flex flex-col gap-1 max-w-7xl mx-auto">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    'px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    pathname === link.href
                      ? 'bg-brand-600/30 text-brand-300'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/issue"
                onClick={() => setOpen(false)}
                className="mt-2 px-4 py-3 rounded-lg bg-brand-600 text-white text-sm font-semibold text-center"
              >
                Issue Credential
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Shield,
  Zap,
  Lock,
  Globe,
  CheckCircle,
  ArrowRight,
  Hexagon,
  Network,
  FileCheck,
  Users,
  ChevronDown,
} from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import { identityApi, Stats } from '@/lib/api'

const BlockchainScene = dynamic(() => import('@/components/three/BlockchainScene'), { ssr: false })

const features = [
  {
    icon: Shield,
    title: 'Tamper-Proof Credentials',
    desc: 'Every credential is anchored on-chain. Any tampering is immediately detectable, ensuring 100% authenticity.',
    color: 'text-brand-400',
    bg: 'bg-brand-600/10',
    border: 'border-brand-500/20',
  },
  {
    icon: Zap,
    title: 'Instant Verification',
    desc: 'Verify any credential in seconds — no calls, no emails, no waiting. Just a cryptographic proof.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-600/10',
    border: 'border-yellow-500/20',
  },
  {
    icon: Lock,
    title: 'Self-Sovereign Identity',
    desc: 'Users own their decentralized identifiers (DIDs). No institution can revoke your identity.',
    color: 'text-cyber-400',
    bg: 'bg-cyber-600/10',
    border: 'border-cyber-500/20',
  },
  {
    icon: Globe,
    title: 'Universal Standard',
    desc: 'Built on W3C Verifiable Credentials and DID standards, accepted by any compatible verifier globally.',
    color: 'text-blue-400',
    bg: 'bg-blue-600/10',
    border: 'border-blue-500/20',
  },
  {
    icon: Network,
    title: 'Decentralized Network',
    desc: 'No single point of failure. Your credentials live on a distributed ledger across thousands of nodes.',
    color: 'text-purple-400',
    bg: 'bg-purple-600/10',
    border: 'border-purple-500/20',
  },
  {
    icon: FileCheck,
    title: 'Role-Based Workflows',
    desc: 'Issuers manage their credential programs. Users collect and share their verified achievements.',
    color: 'text-pink-400',
    bg: 'bg-pink-600/10',
    border: 'border-pink-500/20',
  },
]

const steps = [
  { n: '01', title: 'Create DID', desc: 'Institutions and users create their decentralized identifier — a globally unique, cryptographic identity.' },
  { n: '02', title: 'Issue Credential', desc: 'Authorized issuers create signed Verifiable Credentials for their students or professionals.' },
  { n: '03', title: 'Store & Share', desc: 'Recipients hold their credentials and share them with any verifier — employers, universities, governments.' },
  { n: '04', title: 'Instant Verify', desc: 'Verifiers check the credential against the blockchain in real-time with cryptographic certainty.' },
]

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    identityApi.getStats().then(r => setStats(r.data.data)).catch(() => {})
  }, [])

  return (
    <div className="relative min-h-screen bg-dark-900 overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Scene */}
        <BlockchainScene />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-30" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-brand-500/30 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-cyber-400 animate-pulse" />
            <span className="text-sm text-slate-300 font-medium">Powered by W3C DID + Verifiable Credentials</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6"
          >
            <span className="text-white">Your Identity.</span>
            <br />
            <span className="gradient-text">Secured on Chain.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Issue, manage, and verify tamper-proof digital credentials. No fraud. No delays. No intermediaries —
            just cryptographic truth anchored on the blockchain.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-lg transition-all duration-300 glow-indigo hover:scale-105"
            >
              Launch Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/verify"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl glass-card border border-white/10 hover:border-brand-500/40 text-white font-semibold text-lg transition-all duration-300 hover:scale-105"
            >
              <CheckCircle className="w-5 h-5 text-cyber-400" />
              Verify a Credential
            </Link>
          </motion.div>

          {/* Live Stats */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
            >
              {[
                { label: 'Identities', value: stats.totalIdentities },
                { label: 'Credentials', value: stats.totalCredentials },
                { label: 'Verified', value: stats.validCredentials },
              ].map((s, i) => (
                <div key={i} className="glass-card p-4 border border-white/5">
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-slate-600" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-brand-400 text-sm font-semibold tracking-widest uppercase mb-3">Why BlockID?</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Built for the Future of Trust
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              A comprehensive identity infrastructure that eliminates fraud and enables instant trust.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`glass-card p-6 border ${f.border} hover:scale-[1.02] transition-all duration-300 group`}
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-cyber-400 text-sm font-semibold tracking-widest uppercase mb-3">The Process</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">Four simple steps from identity creation to instant verification.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-brand-500/40 to-transparent z-10 -translate-y-0.5" />
                )}
                <div className="glass-card p-6 border border-white/5 hover:border-brand-500/20 transition-all">
                  <div className="text-4xl font-black text-brand-600/30 mb-3 font-mono">{s.n}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border border-brand-500/20 gradient-border"
          >
            <h2 className="text-2xl font-black text-white mb-2 text-center">System Architecture</h2>
            <p className="text-slate-400 text-sm text-center mb-8">Full-stack blockchain identity infrastructure</p>

            <div className="space-y-3 font-mono text-sm">
              {[
                { label: 'Frontend', value: 'Next.js 14 + Tailwind + Framer Motion + Three.js', color: 'text-brand-300', bg: 'bg-brand-600/10', border: 'border-brand-500/20' },
                { label: '', value: '↓  REST API', color: 'text-slate-500', bg: '', border: 'border-transparent' },
                { label: 'Backend', value: 'Node.js + Express + TypeScript', color: 'text-cyber-300', bg: 'bg-cyber-600/10', border: 'border-cyber-500/20' },
                { label: '', value: '↓  Veramo Framework', color: 'text-slate-500', bg: '', border: 'border-transparent' },
                { label: 'Identity', value: 'DID:key + W3C Verifiable Credentials', color: 'text-purple-300', bg: 'bg-purple-600/10', border: 'border-purple-500/20' },
                { label: '', value: '↓  Storage', color: 'text-slate-500', bg: '', border: 'border-transparent' },
                { label: 'Storage', value: 'SQLite (dev) / Blockchain Anchoring (prod)', color: 'text-yellow-300', bg: 'bg-yellow-600/10', border: 'border-yellow-500/20' },
              ].map((row, i) => (
                <div key={i} className={`flex items-center gap-3 ${row.bg ? `px-4 py-3 rounded-lg border ${row.border}` : 'px-4 justify-center'}`}>
                  {row.label && <span className="text-slate-500 w-16 text-xs">{row.label}</span>}
                  <span className={row.color}>{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="glass-card p-12 border border-brand-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12)_0%,transparent_70%)] pointer-events-none" />
            <Hexagon className="w-12 h-12 text-brand-500 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Start Building Trust Today
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Join institutions issuing tamper-proof credentials and professionals owning their verified achievements.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/identities"
                className="px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all glow-indigo hover:scale-105"
              >
                Create Identity
              </Link>
              <Link
                href="/credentials"
                className="px-8 py-3 rounded-xl glass-card border border-white/10 hover:border-brand-500/30 text-white font-semibold transition-all hover:scale-105"
              >
                Browse Credentials
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Hexagon className="w-6 h-6 text-brand-500" strokeWidth={1.5} />
            <span className="font-bold text-white">Block<span className="gradient-text">ID</span></span>
          </div>
          <p className="text-slate-500 text-sm">Blockchain-powered identity infrastructure · W3C DID + VC Standard</p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyber-400 animate-pulse" />
            <span className="text-xs text-slate-500">System Online</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

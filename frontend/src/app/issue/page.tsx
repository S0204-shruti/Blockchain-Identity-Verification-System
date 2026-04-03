'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileCheck, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import { identityApi, credentialApi, Identity, Credential } from '@/lib/api'

const credentialTypes = [
  { value: 'UniversityDegreeCredential', label: 'University Degree' },
  { value: 'ProfessionalCertificateCredential', label: 'Professional Certificate' },
  { value: 'CourseCompletionCredential', label: 'Course Completion' },
  { value: 'SkillBadgeCredential', label: 'Skill Badge' },
  { value: 'EmploymentCredential', label: 'Employment Record' },
]

export default function IssuePage() {
  const [identities, setIdentities] = useState<Identity[]>([])
  const [form, setForm] = useState({
    issuerDid: '',
    subjectDid: '',
    type: 'UniversityDegreeCredential',
    subject: '',
    institution: '',
    expiresAt: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<Credential | null>(null)

  useEffect(() => {
    identityApi.getAll().then(r => setIdentities(r.data.data)).catch(() => {})
  }, [])

  const issuers = identities.filter(i => i.role === 'issuer')
  const users = identities.filter(i => i.role === 'user')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(null)
    try {
      const payload: any = { ...form }
      if (!payload.expiresAt) delete payload.expiresAt
      const r = await credentialApi.issue(payload)
      setSuccess(r.data.data)
      setForm({ issuerDid: '', subjectDid: '', type: 'UniversityDegreeCredential', subject: '', institution: '', expiresAt: '' })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to issue credential')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.08)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex p-4 rounded-2xl bg-brand-600/10 border border-brand-500/20 mb-5">
            <FileCheck className="w-10 h-10 text-brand-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Issue Credential</h1>
          <p className="text-slate-400">
            Create a signed, tamper-proof Verifiable Credential and anchor it to the blockchain.
          </p>
        </motion.div>

        {/* Success State */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card p-6 border border-cyber-500/30 mb-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 to-cyber-500" />
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-cyber-600/15 flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-cyber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-cyber-400 mb-1">Credential Issued Successfully!</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    The credential has been signed and anchored to the blockchain.
                  </p>
                  <div className="bg-dark-700/60 rounded-lg p-3 font-mono text-xs text-slate-300 mb-3 break-all">
                    {success.vcId}
                  </div>
                  <div className="flex gap-2">
                    <Link href="/credentials" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600/20 text-brand-300 text-xs font-medium hover:bg-brand-600/30 transition-all">
                      View Credentials <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button onClick={() => setSuccess(null)} className="px-4 py-2 rounded-lg glass-card border border-white/10 text-slate-400 text-xs font-medium hover:text-white transition-all">
                      Issue Another
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass-card p-6 border border-brand-500/20 gradient-border space-y-5"
        >
          <h2 className="text-lg font-bold text-white">Credential Details</h2>

          {/* Issuer */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Issuing Institution (DID)</label>
            <select
              value={form.issuerDid}
              onChange={e => {
                const issuer = issuers.find(i => i.did === e.target.value)
                setForm({ ...form, issuerDid: e.target.value, institution: issuer?.name || form.institution })
              }}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
            >
              <option value="">Select issuer…</option>
              {issuers.map(i => (
                <option key={i.did} value={i.did}>{i.name} ({i.alias})</option>
              ))}
            </select>
            {issuers.length === 0 && (
              <p className="text-xs text-amber-400 mt-1">No issuers found. <Link href="/identities" className="underline">Create one first</Link>.</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Credential Recipient (DID)</label>
            <select
              value={form.subjectDid}
              onChange={e => setForm({ ...form, subjectDid: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
            >
              <option value="">Select recipient…</option>
              {users.map(u => (
                <option key={u.did} value={u.did}>{u.name} ({u.alias})</option>
              ))}
            </select>
            {users.length === 0 && (
              <p className="text-xs text-amber-400 mt-1">No users found. <Link href="/identities" className="underline">Create one first</Link>.</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Credential Type</label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
            >
              {credentialTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Subject title */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Credential Title / Achievement</label>
            <input
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g. Bachelor of Science in Computer Science"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-500/50 transition-colors"
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Institution Name</label>
            <input
              value={form.institution}
              onChange={e => setForm({ ...form, institution: e.target.value })}
              placeholder="e.g. MIT University"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-500/50 transition-colors"
            />
          </div>

          {/* Expiry */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Expiry Date (optional)</label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={e => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500/50 transition-colors [color-scheme:dark]"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Info panel */}
          <div className="bg-brand-900/30 border border-brand-500/15 rounded-xl p-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-brand-300 font-semibold">What happens next: </span>
              The credential will be cryptographically signed by the issuer's DID key, wrapped as a W3C Verifiable Credential (JWT format), and anchored to the blockchain registry. The recipient can then share and verify it globally.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold transition-all glow-indigo text-base"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing & Anchoring…
              </>
            ) : (
              <>
                <FileCheck className="w-5 h-5" />
                Issue Verifiable Credential
              </>
            )}
          </button>
        </motion.form>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileCheck, Search, CheckCircle, XCircle } from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import CredentialCard from '@/components/ui/CredentialCard'
import { credentialApi, Credential } from '@/lib/api'
import clsx from 'clsx'

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'revoked'>('all')
  const [filterType, setFilterType] = useState('all')
  const [verifyModal, setVerifyModal] = useState<any>(null)

  const load = async () => {
    try {
      const r = await credentialApi.getAll()
      setCredentials(r.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleRevoke = async (id: string) => {
    if (confirm('Are you sure you want to revoke this credential? This action cannot be undone.')) {
      await credentialApi.revoke(id)
      load()
    }
  }

  const handleVerify = async (id: string) => {
    const r = await credentialApi.verify({ id })
    setVerifyModal(r.data.data)
  }

  const allTypes = ['all', ...Array.from(new Set(credentials.map(c => c.type)))]

  const filtered = credentials.filter(c => {
    const matchSearch =
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.institution.toLowerCase().includes(search.toLowerCase()) ||
      c.vcId.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    const matchType = filterType === 'all' || c.type === filterType
    return matchSearch && matchStatus && matchType
  })

  const typeLabel = (t: string) => ({
    UniversityDegreeCredential: 'Degree',
    ProfessionalCertificateCredential: 'Certificate',
    CourseCompletionCredential: 'Course',
    SkillBadgeCredential: 'Skill',
    EmploymentCredential: 'Employment',
    all: 'All Types',
  }[t] || t)

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-cyber-600/15 border border-cyber-500/20">
              <FileCheck className="w-6 h-6 text-cyber-400" />
            </div>
            <h1 className="text-3xl font-black text-white">Credentials</h1>
          </div>
          <p className="text-slate-400 ml-14">
            All issued Verifiable Credentials — tamper-proof, blockchain-anchored
          </p>
        </motion.div>

        {/* Summary Bar */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="glass-card p-4 text-center border border-white/5">
            <p className="text-2xl font-black text-white">{credentials.length}</p>
            <p className="text-xs text-slate-400 mt-1">Total</p>
          </div>
          <div className="glass-card p-4 text-center border border-cyber-500/20">
            <p className="text-2xl font-black text-cyber-400">{credentials.filter(c => c.status === 'valid').length}</p>
            <p className="text-xs text-slate-400 mt-1">Valid</p>
          </div>
          <div className="glass-card p-4 text-center border border-red-500/20">
            <p className="text-2xl font-black text-red-400">{credentials.filter(c => c.status === 'revoked').length}</p>
            <p className="text-xs text-slate-400 mt-1">Revoked</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by subject, institution or VC ID…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-700/60 border border-white/8 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-500/40 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'valid', 'revoked'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                  filterStatus === s
                    ? s === 'valid' ? 'badge-valid' : s === 'revoked' ? 'badge-revoked' : 'bg-brand-600/30 text-brand-300 border border-brand-500/30'
                    : 'glass-card border border-white/8 text-slate-400 hover:text-white'
                )}
              >
                {s}
              </button>
            ))}
            <div className="w-px h-6 bg-white/10 self-center" />
            {allTypes.map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  filterType === t
                    ? 'bg-brand-600/30 text-brand-300 border border-brand-500/30'
                    : 'glass-card border border-white/8 text-slate-400 hover:text-white'
                )}
              >
                {typeLabel(t)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card p-5 h-48 animate-pulse bg-white/2" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((cred, i) => (
              <CredentialCard
                key={cred.id}
                credential={cred}
                onRevoke={handleRevoke}
                onVerify={handleVerify}
                delay={i * 0.04}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full glass-card p-16 text-center border border-white/5">
                <FileCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No credentials match your filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verify Modal */}
      {verifyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setVerifyModal(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 max-w-md w-full border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${verifyModal.verified ? 'bg-cyber-500/20' : 'bg-red-500/20'}`}>
              {verifyModal.verified ? <CheckCircle className="w-8 h-8 text-cyber-400" /> : <XCircle className="w-8 h-8 text-red-400" />}
            </div>
            <h3 className={`text-xl font-bold text-center mb-2 ${verifyModal.verified ? 'text-cyber-400' : 'text-red-400'}`}>
              {verifyModal.verified ? 'Credential Verified ✓' : 'Verification Failed ✗'}
            </h3>
            <p className="text-slate-400 text-sm text-center mb-6">{verifyModal.reason}</p>
            <div className="space-y-2 mb-6">
              {Object.entries(verifyModal.checks).map(([k, v]: any) => (
                <div key={k} className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-xs text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {v ? <CheckCircle className="w-4 h-4 text-cyber-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                </div>
              ))}
            </div>
            <button onClick={() => setVerifyModal(null)} className="w-full px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all">
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

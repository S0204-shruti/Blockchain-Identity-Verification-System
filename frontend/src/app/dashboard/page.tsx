'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users, FileCheck, Shield, Activity, Plus, ArrowRight, TrendingUp,
  CheckCircle, XCircle, Hexagon
} from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import StatCard from '@/components/ui/StatCard'
import CredentialCard from '@/components/ui/CredentialCard'
import { identityApi, credentialApi, Stats, Identity, Credential } from '@/lib/api'

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [identities, setIdentities] = useState<Identity[]>([])
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [verifyModal, setVerifyModal] = useState<any>(null)

  const load = async () => {
    try {
      const [s, id, cr] = await Promise.all([
        identityApi.getStats(),
        identityApi.getAll(),
        credentialApi.getAll(),
      ])
      setStats(s.data.data)
      setIdentities(id.data.data)
      setCredentials(cr.data.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleRevoke = async (id: string) => {
    await credentialApi.revoke(id)
    load()
  }

  const handleVerify = async (id: string) => {
    const r = await credentialApi.verify({ id })
    setVerifyModal(r.data.data)
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-brand-600/15 border border-brand-500/20">
              <Activity className="w-6 h-6 text-brand-400" />
            </div>
            <h1 className="text-3xl font-black text-white">Dashboard</h1>
          </div>
          <p className="text-slate-400 ml-14">Overview of your blockchain identity infrastructure</p>
        </motion.div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-5 h-20 animate-pulse bg-white/2" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total Identities" value={stats.totalIdentities} icon={Users} color="indigo" delay={0} />
            <StatCard label="Issuers" value={stats.issuers} icon={Shield} color="purple" delay={0.05} />
            <StatCard label="Credentials Issued" value={stats.totalCredentials} icon={FileCheck} color="green" delay={0.1} />
            <StatCard label="Valid Credentials" value={stats.validCredentials} icon={CheckCircle} color="blue" delay={0.15} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Credentials */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Recent Credentials</h2>
              <Link href="/credentials" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="glass-card p-5 h-32 animate-pulse bg-white/2" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {credentials.slice(0, 4).map((cred, i) => (
                  <CredentialCard
                    key={cred.id}
                    credential={cred}
                    onRevoke={handleRevoke}
                    onVerify={handleVerify}
                    delay={i * 0.05}
                  />
                ))}
                {credentials.length === 0 && (
                  <div className="glass-card p-10 text-center border border-white/5">
                    <FileCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No credentials yet</p>
                    <Link href="/issue" className="mt-3 inline-block px-4 py-2 rounded-lg bg-brand-600/20 text-brand-300 text-sm">
                      Issue first credential
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="glass-card p-5 border border-white/5">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { href: '/identities', icon: Plus, label: 'Create Identity', sub: 'Register new DID', color: 'text-brand-400 bg-brand-600/10' },
                  { href: '/issue', icon: FileCheck, label: 'Issue Credential', sub: 'Sign & anchor VC', color: 'text-cyber-400 bg-cyber-600/10' },
                  { href: '/verify', icon: CheckCircle, label: 'Verify Credential', sub: 'Cryptographic check', color: 'text-blue-400 bg-blue-600/10' },
                ].map((a, i) => (
                  <Link key={i} href={a.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
                    <div className={`p-2 rounded-lg ${a.color}`}>
                      <a.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors">{a.label}</p>
                      <p className="text-xs text-slate-500">{a.sub}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 ml-auto group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Identities */}
            <div className="glass-card p-5 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-300">Identities</h3>
                <Link href="/identities" className="text-xs text-brand-400 hover:text-brand-300">View all</Link>
              </div>
              <div className="space-y-2">
                {identities.slice(0, 5).map((id, i) => (
                  <motion.div
                    key={id.did}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      id.role === 'issuer' ? 'bg-brand-600/20 text-brand-300' : 'bg-cyber-600/10 text-cyber-400'
                    }`}>
                      {id.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{id.name}</p>
                      <p className="text-xs text-slate-500 truncate font-mono">{id.did.slice(0, 24)}…</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${id.role === 'issuer' ? 'badge-issuer' : 'badge-user'}`}>
                      {id.role}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="glass-card p-5 border border-cyber-500/20">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">System Status</h3>
              {[
                { label: 'Blockchain Node', status: 'Online' },
                { label: 'DID Registry', status: 'Synced' },
                { label: 'VC Issuer', status: 'Active' },
                { label: 'Verifier', status: 'Ready' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-slate-400">{s.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-400 animate-pulse" />
                    <span className="text-xs text-cyber-400">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verify Result Modal */}
      {verifyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setVerifyModal(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 max-w-md w-full border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${verifyModal.verified ? 'bg-cyber-500/20' : 'bg-red-500/20'}`}>
              {verifyModal.verified
                ? <CheckCircle className="w-8 h-8 text-cyber-400" />
                : <XCircle className="w-8 h-8 text-red-400" />}
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

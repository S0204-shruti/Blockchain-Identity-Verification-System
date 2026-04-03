'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Shield, User, Copy, Check, Search, Filter } from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import { identityApi, Identity } from '@/lib/api'
import clsx from 'clsx'

export default function IdentitiesPage() {
  const [identities, setIdentities] = useState<Identity[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', alias: '', role: 'user' as 'issuer' | 'user' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'issuer' | 'user'>('all')

  const load = async () => {
    try {
      const r = await identityApi.getAll()
      setIdentities(r.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      await identityApi.create(form)
      setForm({ name: '', alias: '', role: 'user' })
      setShowForm(false)
      load()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create identity')
    } finally {
      setCreating(false)
    }
  }

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  const filtered = identities.filter(id => {
    const matchSearch = id.name.toLowerCase().includes(search.toLowerCase()) ||
      id.alias.toLowerCase().includes(search.toLowerCase()) ||
      id.did.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'all' || id.role === filterRole
    return matchSearch && matchRole
  })

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.08)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-xl bg-brand-600/15 border border-brand-500/20">
                <Users className="w-6 h-6 text-brand-400" />
              </div>
              <h1 className="text-3xl font-black text-white">Identities</h1>
            </div>
            <p className="text-slate-400 ml-14">Decentralized identifiers (DIDs) for issuers and credential holders</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all glow-indigo"
          >
            <Plus className="w-4 h-4" />
            Create DID
          </button>
        </motion.div>

        {/* Create Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <form onSubmit={handleCreate} className="glass-card p-6 border border-brand-500/20 gradient-border">
                <h2 className="text-lg font-bold text-white mb-5">Create New DID Identity</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Full Name</label>
                    <input
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Alice Johnson"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Alias (unique)</label>
                    <input
                      value={form.alias}
                      onChange={e => setForm({ ...form, alias: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="e.g. alice-j"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white text-sm font-mono placeholder-slate-500 focus:outline-none focus:border-brand-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Role</label>
                    <select
                      value={form.role}
                      onChange={e => setForm({ ...form, role: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
                    >
                      <option value="user">User (Credential Holder)</option>
                      <option value="issuer">Issuer (Institution)</option>
                    </select>
                  </div>
                </div>
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-sm transition-all"
                  >
                    {creating ? 'Creating DID…' : 'Create Identity'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 rounded-xl glass-card border border-white/10 text-slate-400 hover:text-white text-sm transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, alias or DID…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-700/60 border border-white/8 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand-500/40 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'issuer', 'user'] as const).map(r => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize',
                  filterRole === r
                    ? 'bg-brand-600/30 text-brand-300 border border-brand-500/30'
                    : 'glass-card border border-white/8 text-slate-400 hover:text-white'
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Identities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-5 h-40 animate-pulse bg-white/2" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((id, i) => (
              <motion.div
                key={id.did}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5 border border-white/5 hover:border-brand-500/20 transition-all group"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                    id.role === 'issuer' ? 'bg-brand-600/20 text-brand-300 border border-brand-500/20' : 'bg-cyber-600/10 text-cyber-400 border border-cyber-500/20'
                  )}>
                    {id.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{id.name}</p>
                    <p className="text-xs text-slate-500 font-mono truncate">@{id.alias}</p>
                  </div>
                  <span className={clsx('text-xs px-2 py-1 rounded-full font-medium', id.role === 'issuer' ? 'badge-issuer' : 'badge-user')}>
                    {id.role === 'issuer' ? <Shield className="w-3 h-3 inline mr-1" /> : <User className="w-3 h-3 inline mr-1" />}
                    {id.role}
                  </span>
                </div>

                {/* DID */}
                <div className="bg-dark-700/80 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate-500">Decentralized Identifier</p>
                    <button
                      onClick={() => copy(id.did, id.did)}
                      className="p-1 rounded text-slate-500 hover:text-white transition-colors"
                    >
                      {copied === id.did ? <Check className="w-3.5 h-3.5 text-cyber-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="font-mono text-xs text-slate-300 break-all leading-relaxed">{id.did}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Created {new Date(id.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-400" />
                    Active
                  </span>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full glass-card p-16 text-center border border-white/5">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No identities found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

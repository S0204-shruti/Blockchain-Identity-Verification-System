'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Search, Shield, Zap, FileCheck, AlertCircle } from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import { credentialApi, VerificationResult } from '@/lib/api'

export default function VerifyPage() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'id' | 'jwt'>('id')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const payload = mode === 'id' ? { id: input.trim() } : { vcJwt: input.trim() }
      const r = await credentialApi.verify(payload)
      setResult(r.data.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification request failed')
    } finally {
      setLoading(false)
    }
  }

  const CheckRow = ({ label, value }: { label: string; value: boolean }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${value ? 'badge-valid' : 'badge-revoked'}`}>
        {value ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
        {value ? 'Pass' : 'Fail'}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex p-4 rounded-2xl bg-cyber-600/10 border border-cyber-500/20 mb-6">
            <Shield className="w-10 h-10 text-cyber-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Verify Credential</h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Instantly verify any credential's authenticity using cryptographic proof. No middlemen, no delays.
          </p>
        </motion.div>

        {/* Features Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            { icon: Zap, label: 'Instant', desc: 'Real-time check' },
            { icon: Shield, label: 'Cryptographic', desc: 'Math-based proof' },
            { icon: FileCheck, label: 'On-Chain', desc: 'Immutable record' },
          ].map((f, i) => (
            <div key={i} className="glass-card p-4 text-center border border-white/5">
              <f.icon className="w-5 h-5 text-cyber-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">{f.label}</p>
              <p className="text-xs text-slate-500">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Verify Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 border border-brand-500/20 gradient-border mb-6"
        >
          {/* Mode tabs */}
          <div className="flex gap-2 mb-5">
            {(['id', 'jwt'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setInput(''); setResult(null); setError('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m
                    ? 'bg-brand-600/30 text-brand-300 border border-brand-500/30'
                    : 'text-slate-400 hover:text-white border border-transparent hover:bg-white/5'
                }`}
              >
                {m === 'id' ? 'By Credential ID' : 'By VC JWT Token'}
              </button>
            ))}
          </div>

          <form onSubmit={handleVerify}>
            <label className="block text-xs text-slate-400 mb-1.5">
              {mode === 'id' ? 'Credential UUID' : 'VC JWT Token'}
            </label>
            <div className="relative mb-4">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={
                  mode === 'id'
                    ? 'e.g. 550e8400-e29b-41d4-a716-446655440000'
                    : 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9…'
                }
                rows={mode === 'jwt' ? 4 : 2}
                className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all glow-indigo"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying on blockchain…
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Verify Credential
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className={`glass-card p-6 border ${result.verified ? 'border-cyber-500/30' : 'border-red-500/30'}`}
            >
              {/* Result header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${result.verified ? 'bg-cyber-500/20 glow-green' : 'bg-red-500/20'}`}>
                  {result.verified
                    ? <CheckCircle className="w-7 h-7 text-cyber-400" />
                    : <XCircle className="w-7 h-7 text-red-400" />}
                </div>
                <div>
                  <h3 className={`text-xl font-black ${result.verified ? 'text-cyber-400' : 'text-red-400'}`}>
                    {result.verified ? 'Credential is Authentic ✓' : 'Verification Failed ✗'}
                  </h3>
                  <p className="text-slate-400 text-sm">{result.reason}</p>
                </div>
              </div>

              {/* Checks */}
              <div className="glass-card p-4 border border-white/5 mb-4">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Verification Checks</p>
                <CheckRow label="Credential Exists on Chain" value={result.checks.exists} />
                <CheckRow label="Not Revoked" value={result.checks.notRevoked} />
                <CheckRow label="Not Expired" value={result.checks.notExpired} />
                <CheckRow label="Signature Valid" value={result.checks.signatureValid} />
              </div>

              {/* Credential details if available */}
              {result.credential && (
                <div className="bg-dark-700/50 rounded-xl p-4 space-y-2">
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Credential Details</p>
                  {[
                    { label: 'Subject', value: result.credential.subject },
                    { label: 'Institution', value: result.credential.institution },
                    { label: 'Type', value: result.credential.type.replace('Credential', '') },
                    { label: 'Issued', value: new Date(result.credential.issuedAt).toLocaleDateString() },
                    { label: 'Status', value: result.credential.status.toUpperCase() },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-slate-500">{label}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {result.verifiedAt && (
                <p className="text-xs text-slate-600 text-right mt-3">
                  Verified at {new Date(result.verifiedAt).toLocaleString()}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

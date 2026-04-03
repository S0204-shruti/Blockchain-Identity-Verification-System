'use client'

import { motion } from 'framer-motion'
import { Award, Calendar, Building2, CheckCircle, XCircle, Shield } from 'lucide-react'
import clsx from 'clsx'
import { Credential } from '@/lib/api'

interface CredentialCardProps {
  credential: Credential
  onRevoke?: (id: string) => void
  onVerify?: (id: string) => void
  delay?: number
}

const typeLabels: Record<string, string> = {
  UniversityDegreeCredential: 'University Degree',
  ProfessionalCertificateCredential: 'Professional Certificate',
  CourseCompletionCredential: 'Course Completion',
  SkillBadgeCredential: 'Skill Badge',
  EmploymentCredential: 'Employment',
}

export default function CredentialCard({ credential, onRevoke, onVerify, delay = 0 }: CredentialCardProps) {
  const isValid = credential.status === 'valid'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={clsx(
        'glass-card p-5 relative overflow-hidden group hover:border-brand-500/30 transition-all duration-300',
        'border',
        isValid ? 'border-white/6' : 'border-red-500/20'
      )}
    >
      {/* Top accent line */}
      <div
        className={clsx(
          'absolute top-0 left-0 right-0 h-0.5',
          isValid ? 'bg-gradient-to-r from-brand-500 to-cyber-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
        )}
      />

      {/* Watermark icon */}
      <div className="absolute -right-4 -bottom-4 opacity-5">
        <Shield className="w-28 h-28 text-white" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={clsx('p-2 rounded-lg', isValid ? 'bg-brand-600/15' : 'bg-red-600/15')}>
            <Award className={clsx('w-5 h-5', isValid ? 'text-brand-400' : 'text-red-400')} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-mono mb-0.5">{typeLabels[credential.type] || credential.type}</p>
            <h3 className="text-sm font-semibold text-white leading-tight">{credential.subject}</h3>
          </div>
        </div>
        <span className={clsx('px-2.5 py-1 rounded-full text-xs font-semibold', isValid ? 'badge-valid' : 'badge-revoked')}>
          {isValid ? '✓ Valid' : '✗ Revoked'}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span>{credential.institution}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span>Issued {new Date(credential.issuedAt).toLocaleDateString()}</span>
          {credential.expiresAt && (
            <span className="text-slate-500">· Expires {new Date(credential.expiresAt).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {/* VC ID */}
      <div className="bg-dark-700 rounded-lg px-3 py-2 mb-4">
        <p className="text-xs text-slate-500 mb-0.5">Credential ID</p>
        <p className="font-mono text-xs text-slate-300 truncate">{credential.vcId}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onVerify && (
          <button
            onClick={() => onVerify(credential.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand-600/20 hover:bg-brand-600/40 text-brand-300 text-xs font-medium transition-all border border-brand-500/20 hover:border-brand-500/40"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Verify
          </button>
        )}
        {onRevoke && isValid && (
          <button
            onClick={() => onRevoke(credential.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 text-xs font-medium transition-all border border-red-500/20 hover:border-red-500/30"
          >
            <XCircle className="w-3.5 h-3.5" />
            Revoke
          </button>
        )}
      </div>
    </motion.div>
  )
}

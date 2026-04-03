'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color?: 'indigo' | 'green' | 'blue' | 'purple'
  delay?: number
}

const colorMap = {
  indigo: {
    bg: 'bg-brand-600/10',
    border: 'border-brand-500/20',
    icon: 'text-brand-400',
    value: 'text-brand-300',
  },
  green: {
    bg: 'bg-cyber-500/10',
    border: 'border-cyber-500/20',
    icon: 'text-cyber-400',
    value: 'text-cyber-400',
  },
  blue: {
    bg: 'bg-blue-600/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-400',
    value: 'text-blue-300',
  },
  purple: {
    bg: 'bg-purple-600/10',
    border: 'border-purple-500/20',
    icon: 'text-purple-400',
    value: 'text-purple-300',
  },
}

export default function StatCard({ label, value, icon: Icon, color = 'indigo', delay = 0 }: StatCardProps) {
  const c = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={clsx('glass-card p-5 flex items-center gap-4', c.border, 'border')}
    >
      <div className={clsx('p-3 rounded-xl', c.bg)}>
        <Icon className={clsx('w-6 h-6', c.icon)} />
      </div>
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className={clsx('text-2xl font-bold', c.value)}>{value}</p>
      </div>
    </motion.div>
  )
}

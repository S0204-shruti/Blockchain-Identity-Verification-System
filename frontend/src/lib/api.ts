import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

export interface Identity {
  did: string
  alias: string
  name: string
  role: 'issuer' | 'user'
  createdAt: string
  credentials?: Credential[]
  issued?: Credential[]
}

export interface Credential {
  id: string
  vcId: string
  issuerDid: string
  subjectDid: string
  type: string
  subject: string
  institution: string
  issuedAt: string
  expiresAt?: string
  status: 'valid' | 'revoked'
  vcJwt: string
}

export interface VerificationResult {
  verified: boolean
  credential?: Credential
  reason: string
  checks: {
    exists: boolean
    notRevoked: boolean
    notExpired: boolean
    signatureValid: boolean
  }
  verifiedAt?: string
}

export interface Stats {
  totalIdentities: number
  issuers: number
  users: number
  totalCredentials: number
  validCredentials: number
  revokedCredentials: number
}

export const identityApi = {
  getAll: () => api.get<{ success: boolean; data: Identity[] }>('/api/identities'),
  getStats: () => api.get<{ success: boolean; data: Stats }>('/api/identities/stats'),
  getOne: (did: string) => api.get<{ success: boolean; data: Identity }>(`/api/identities/${encodeURIComponent(did)}`),
  create: (data: { name: string; alias: string; role: 'issuer' | 'user' }) =>
    api.post<{ success: boolean; data: Identity }>('/api/identities', data),
}

export const credentialApi = {
  getAll: () => api.get<{ success: boolean; data: Credential[] }>('/api/credentials'),
  getOne: (id: string) => api.get<{ success: boolean; data: Credential }>(`/api/credentials/${id}`),
  issue: (data: {
    issuerDid: string
    subjectDid: string
    type: string
    subject: string
    institution: string
    expiresAt?: string
  }) => api.post<{ success: boolean; data: Credential }>('/api/credentials/issue', data),
  verify: (data: { id?: string; vcJwt?: string }) =>
    api.post<{ success: boolean; data: VerificationResult }>('/api/credentials/verify', data),
  revoke: (id: string) => api.patch<{ success: boolean; data: any }>(`/api/credentials/${id}/revoke`),
}

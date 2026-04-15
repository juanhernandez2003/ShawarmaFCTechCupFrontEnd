import type { TournamentStatus } from '../../services/organizerService'

const normalizeState = (value: string) => value.trim().toUpperCase().replace(/\s+/g, '_')

export const formatCurrencyCop = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)

export const formatDate = (value: string | null): string => {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const formatDateTime = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const tournamentStatusLabel = (status: TournamentStatus): string => {
  const normalized = normalizeState(status)
  if (normalized === 'EN_CURSO' || normalized === 'ACTIVO') return 'En curso'
  if (normalized === 'FINALIZADO') return 'Finalizado'
  if (normalized === 'CONFIGURADO') return 'Configurado'
  if (normalized === 'BORRADOR') return 'Borrador'
  if (normalized === 'CANCELADO') return 'Cancelado'
  return status
}

export const paymentStatusLabel = (status: string): string => {
  const normalized = normalizeState(status)
  if (normalized === 'PENDIENTE') return 'Pendiente'
  if (normalized === 'APROBADO') return 'Aprobado'
  if (normalized === 'RECHAZADO') return 'Rechazado'
  return status
}

export const stateClassName = (status: string): string => {
  const normalized = normalizeState(status).toLowerCase()
  if (normalized === 'activo') return 'organizer-badge-en_curso'
  return `organizer-badge-${normalized}`
}

export const canStartTournament = (status: TournamentStatus): boolean => {
  const normalized = normalizeState(status)
  return normalized === 'CONFIGURADO' || normalized === 'BORRADOR'
}

export const canFinishTournament = (status: TournamentStatus): boolean => {
  const normalized = normalizeState(status)
  return normalized === 'EN_CURSO' || normalized === 'ACTIVO'
}

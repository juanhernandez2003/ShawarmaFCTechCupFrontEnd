import apiClient from './apiClient'

type UnknownRecord = Record<string, unknown>

export type TournamentStatus =
  | 'BORRADOR'
  | 'CONFIGURADO'
  | 'EN_CURSO'
  | 'FINALIZADO'
  | 'CANCELADO'
  | string

export interface OrganizerTournament {
  id: string
  nombre: string
  descripcion: string
  estado: TournamentStatus
  fechaInicio: string | null
  fechaFin: string | null
  equiposInscritos: number
  partidosJugados: number
  pagosPendientes: number
}

export interface OrganizerSummary {
  torneosActivos: number
  equiposInscritos: number
  partidosJugados: number
  pagosPendientes: number
}

export interface CreateTournamentPayload {
  nombre: string
  descripcion: string
  fechaInicio: string
  fechaFin: string
  cupoEquipos: number
  costoInscripcion: number
}

export interface TournamentConfiguration {
  reglamento: string
  cierreInscripciones: string
  canchas: string[]
  horarios: string[]
  sanciones: string[]
}

export interface Match {
  id: string
  equipoLocal: string
  equipoVisitante: string
  fechaHora: string
  cancha: string
  estado: string
  golesLocal: number | null
  golesVisitante: number | null
}

export interface CreateMatchPayload {
  equipoLocal: string
  equipoVisitante: string
  fechaHora: string
  cancha: string
}

export interface PendingPayment {
  id: string
  equipo: string
  monto: number
  fechaSolicitud: string | null
  estado: string
}

const isObject = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null

const pickList = (data: unknown, keys: string[]): unknown[] => {
  if (Array.isArray(data)) {
    return data
  }

  if (!isObject(data)) {
    return []
  }

  for (const key of keys) {
    const value = data[key]
    if (Array.isArray(value)) {
      return value
    }
  }

  return []
}

const toStringValue = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number') {
    return String(value)
  }
  return fallback
}

const toNullableString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim() !== '') {
    return value
  }
  return null
}

const toNumberValue = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) {
      return parsed
    }
  }
  return fallback
}

const normalizeTournament = (item: unknown): OrganizerTournament => {
  const tournament = isObject(item) ? item : {}

  return {
    id: toStringValue(tournament.id ?? tournament.torneoId),
    nombre: toStringValue(tournament.nombre ?? tournament.name, 'Sin nombre'),
    descripcion: toStringValue(tournament.descripcion ?? tournament.description),
    estado: toStringValue(tournament.estado ?? tournament.status, 'BORRADOR'),
    fechaInicio: toNullableString(tournament.fechaInicio ?? tournament.startDate),
    fechaFin: toNullableString(tournament.fechaFin ?? tournament.endDate),
    equiposInscritos: toNumberValue(
      tournament.equiposInscritos ?? tournament.teamsRegistered ?? tournament.equipos
    ),
    partidosJugados: toNumberValue(
      tournament.partidosJugados ?? tournament.matchesPlayed ?? tournament.partidos
    ),
    pagosPendientes: toNumberValue(
      tournament.pagosPendientes ?? tournament.pendingPayments ?? tournament.pagos
    ),
  }
}

const normalizeConfiguration = (item: unknown): TournamentConfiguration => {
  const configuration = isObject(item) ? item : {}
  return {
    reglamento: toStringValue(configuration.reglamento ?? configuration.rules),
    cierreInscripciones: toStringValue(
      configuration.cierreInscripciones ?? configuration.registrationCloseDate
    ),
    canchas: pickList(configuration.canchas ?? configuration.courts, ['canchas', 'courts']).map(
      value => toStringValue(value)
    ),
    horarios: pickList(configuration.horarios ?? configuration.schedules, ['horarios', 'schedules'])
      .map(value => toStringValue(value))
      .filter(Boolean),
    sanciones: pickList(configuration.sanciones ?? configuration.penalties, [
      'sanciones',
      'penalties',
    ])
      .map(value => toStringValue(value))
      .filter(Boolean),
  }
}

const normalizeMatch = (item: unknown): Match => {
  const match = isObject(item) ? item : {}
  return {
    id: toStringValue(match.id ?? match.partidoId),
    equipoLocal: toStringValue(match.equipoLocal ?? match.homeTeam ?? match.local, 'Por definir'),
    equipoVisitante: toStringValue(
      match.equipoVisitante ?? match.awayTeam ?? match.visitante,
      'Por definir'
    ),
    fechaHora: toStringValue(match.fechaHora ?? match.dateTime),
    cancha: toStringValue(match.cancha ?? match.court, 'Por definir'),
    estado: toStringValue(match.estado ?? match.status, 'PROGRAMADO'),
    golesLocal:
      match.golesLocal === null || match.homeGoals === null
        ? null
        : toNumberValue(match.golesLocal ?? match.homeGoals, 0),
    golesVisitante:
      match.golesVisitante === null || match.awayGoals === null
        ? null
        : toNumberValue(match.golesVisitante ?? match.awayGoals, 0),
  }
}

const normalizePayment = (item: unknown): PendingPayment => {
  const payment = isObject(item) ? item : {}
  return {
    id: toStringValue(payment.id ?? payment.pagoId),
    equipo: toStringValue(payment.equipo ?? payment.teamName, 'Equipo sin nombre'),
    monto: toNumberValue(payment.monto ?? payment.amount),
    fechaSolicitud: toNullableString(payment.fechaSolicitud ?? payment.requestDate),
    estado: toStringValue(payment.estado ?? payment.status, 'PENDIENTE'),
  }
}

const callGetWithFallback = async (urls: string[]) => {
  let lastError: unknown = null
  for (const url of urls) {
    try {
      return await apiClient.get(url)
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

const callPostWithFallback = async (urls: string[], payload?: unknown) => {
  let lastError: unknown = null
  for (const url of urls) {
    try {
      return await apiClient.post(url, payload)
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

const callPutWithFallback = async (urls: string[], payload?: unknown) => {
  let lastError: unknown = null
  for (const url of urls) {
    try {
      return await apiClient.put(url, payload)
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

export const extractApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!isObject(error)) {
    return fallback
  }

  const response = isObject(error.response) ? error.response : null
  const data = response && isObject(response.data) ? response.data : null
  if (data) {
    const detail = data.detalle ?? data.message ?? data.error
    if (typeof detail === 'string' && detail.trim() !== '') {
      return detail
    }
  }

  const message = error.message
  if (typeof message === 'string' && message.trim() !== '') {
    return message
  }

  return fallback
}

export const listarTorneosOrganizador = async (): Promise<OrganizerTournament[]> => {
  const response = await callGetWithFallback([
    '/api/tournaments/organizer',
    '/api/tournaments/managed',
    '/api/tournaments',
  ])
  const list = pickList(response.data, ['content', 'items', 'torneos', 'tournaments', 'data'])
  return list.map(normalizeTournament).filter(torneo => torneo.id !== '')
}

export const obtenerResumenOrganizador = async (): Promise<OrganizerSummary> => {
  try {
    const response = await callGetWithFallback([
      '/api/tournaments/organizer/summary',
      '/api/tournaments/summary',
    ])
    const summary = isObject(response.data) ? response.data : {}
    return {
      torneosActivos: toNumberValue(summary.torneosActivos ?? summary.activeTournaments),
      equiposInscritos: toNumberValue(summary.equiposInscritos ?? summary.registeredTeams),
      partidosJugados: toNumberValue(summary.partidosJugados ?? summary.matchesPlayed),
      pagosPendientes: toNumberValue(summary.pagosPendientes ?? summary.pendingPayments),
    }
  } catch {
    const tournaments = await listarTorneosOrganizador()
    return {
      torneosActivos: tournaments.filter(
        torneo => torneo.estado === 'EN_CURSO' || torneo.estado === 'ACTIVO'
      ).length,
      equiposInscritos: tournaments.reduce(
        (sum, tournament) => sum + tournament.equiposInscritos,
        0
      ),
      partidosJugados: tournaments.reduce((sum, tournament) => sum + tournament.partidosJugados, 0),
      pagosPendientes: tournaments.reduce((sum, tournament) => sum + tournament.pagosPendientes, 0),
    }
  }
}

export const crearTorneo = async (
  payload: CreateTournamentPayload
): Promise<OrganizerTournament> => {
  const response = await callPostWithFallback(
    ['/api/tournaments', '/api/tournaments/organizer'],
    payload
  )
  return normalizeTournament(response.data)
}

export const obtenerTorneo = async (torneoId: string): Promise<OrganizerTournament> => {
  const response = await callGetWithFallback([
    `/api/tournaments/${torneoId}`,
    `/api/tournaments/organizer/${torneoId}`,
  ])
  return normalizeTournament(response.data)
}

export const obtenerConfiguracionTorneo = async (
  torneoId: string
): Promise<TournamentConfiguration> => {
  const response = await callGetWithFallback([
    `/api/tournaments/${torneoId}/configuration`,
    `/api/tournaments/${torneoId}/settings`,
  ])
  return normalizeConfiguration(response.data)
}

export const guardarConfiguracionTorneo = async (
  torneoId: string,
  payload: TournamentConfiguration
): Promise<void> => {
  await callPutWithFallback(
    [`/api/tournaments/${torneoId}/configuration`, `/api/tournaments/${torneoId}/settings`],
    payload
  )
}

export const iniciarTorneo = async (torneoId: string): Promise<void> => {
  await callPostWithFallback([
    `/api/tournaments/${torneoId}/start`,
    `/api/tournaments/${torneoId}/iniciar`,
  ])
}

export const finalizarTorneo = async (torneoId: string): Promise<void> => {
  await callPostWithFallback([
    `/api/tournaments/${torneoId}/finish`,
    `/api/tournaments/${torneoId}/finalizar`,
  ])
}

export const listarPartidosTorneo = async (torneoId: string): Promise<Match[]> => {
  const response = await callGetWithFallback([
    `/api/tournaments/${torneoId}/matches`,
    `/api/tournaments/${torneoId}/partidos`,
  ])
  const list = pickList(response.data, ['content', 'items', 'matches', 'partidos', 'data'])
  return list.map(normalizeMatch).filter(match => match.id !== '')
}

export const registrarPartido = async (
  torneoId: string,
  payload: CreateMatchPayload
): Promise<Match> => {
  const response = await callPostWithFallback(
    [`/api/tournaments/${torneoId}/matches`, `/api/tournaments/${torneoId}/partidos`],
    payload
  )
  return normalizeMatch(response.data)
}

export const listarPagosPendientes = async (torneoId: string): Promise<PendingPayment[]> => {
  const response = await callGetWithFallback([
    `/api/tournaments/${torneoId}/payments/pending`,
    `/api/tournaments/${torneoId}/pagos/pendientes`,
  ])
  const list = pickList(response.data, ['content', 'items', 'payments', 'pagos', 'data'])
  return list.map(normalizePayment).filter(payment => payment.id !== '')
}

export const aprobarPago = async (torneoId: string, pagoId: string): Promise<void> => {
  await callPostWithFallback([
    `/api/tournaments/${torneoId}/payments/${pagoId}/approve`,
    `/api/tournaments/${torneoId}/pagos/${pagoId}/aprobar`,
    `/api/payments/${pagoId}/approve`,
  ])
}

export const rechazarPago = async (torneoId: string, pagoId: string): Promise<void> => {
  await callPostWithFallback([
    `/api/tournaments/${torneoId}/payments/${pagoId}/reject`,
    `/api/tournaments/${torneoId}/pagos/${pagoId}/rechazar`,
    `/api/payments/${pagoId}/reject`,
  ])
}

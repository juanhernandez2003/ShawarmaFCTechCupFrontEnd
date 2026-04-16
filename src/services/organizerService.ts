import apiClient from './apiClient'
import useAuthStore from '../store/authStore'

type UnknownRecord = Record<string, unknown>
type DateBoundary = 'start' | 'end'

export type TournamentStatus =
  | 'BORRADOR'
  | 'CONFIGURADO'
  | 'CREADO'
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
  estado?: TournamentStatus
}

export interface TournamentConfiguration {
  reglamento: string
  cierreInscripciones: string
  canchas: string[]
  horarios: string[]
  sanciones: string[]
  fechasImportantes?: string[]
  cierreInscripcionesFecha?: string
  cierreInscripcionesHora?: string
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

export interface MatchGoalRecord {
  id: string
  jugador: string
  minuto: number
}

export interface MatchSanctionRecord {
  id: string
  jugador: string
  minuto: number
  tipo: 'AMARILLA' | 'ROJA'
  descripcion: string
}

export interface MatchDetail extends Match {
  torneoId: string | null
  equipoLocalId: string | null
  equipoVisitanteId: string | null
  goles: MatchGoalRecord[]
  sanciones: MatchSanctionRecord[]
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
  capitan: string
  monto: number
  fechaSolicitud: string | null
  comprobante: string | null
  estado: string
}

export interface MatchResultPayload {
  golesLocal: number
  golesVisitante: number
}

export interface MatchGoalPayload {
  jugadorId: string
  minuto: number
}

export interface MatchSanctionPayload {
  jugadorId: string
  minuto: number
  tipoSancion: 'AMARILLA' | 'ROJA'
  descripcion: string
}

interface OrganizerIdentity {
  id: string
  email: string
}

interface TeamIdentity {
  id: string
  nombre: string
  capitanId: string
}

interface CaptainIdentity {
  id: string
  nombre: string
}

let organizerIdentityCache: OrganizerIdentity | null = null
let teamsCache: TeamIdentity[] | null = null
let captainsCache: CaptainIdentity[] | null = null

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/
const DATE_TIME_MINUTES_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
const DATE_TIME_SECONDS_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/

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

const normalizeLookup = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

const safeArrayFromValue = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => toStringValue(item).trim()).filter(Boolean)
  }
  if (typeof value !== 'string') {
    return []
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return []
  }

  try {
    const maybeJson = JSON.parse(trimmed)
    if (Array.isArray(maybeJson)) {
      return maybeJson.map(item => toStringValue(item).trim()).filter(Boolean)
    }
  } catch {
    // Keep parsing with fallback delimiters.
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }

  return trimmed
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

const pad = (value: number): string => String(value).padStart(2, '0')

const normalizeDateTimeString = (value: string, boundary: DateBoundary = 'start'): string => {
  const trimmed = value.trim()
  if (!trimmed) {
    return trimmed
  }

  if (DATE_ONLY_REGEX.test(trimmed)) {
    return `${trimmed}T${boundary === 'end' ? '23:59:59' : '00:00:00'}`
  }

  if (DATE_TIME_MINUTES_REGEX.test(trimmed)) {
    return `${trimmed}:00`
  }

  if (DATE_TIME_SECONDS_REGEX.test(trimmed)) {
    return trimmed
  }

  const normalizedBlank =
    trimmed.includes(' ') && !trimmed.includes('T') ? trimmed.replace(' ', 'T') : trimmed
  if (DATE_TIME_MINUTES_REGEX.test(normalizedBlank)) {
    return `${normalizedBlank}:00`
  }
  if (DATE_TIME_SECONDS_REGEX.test(normalizedBlank)) {
    return normalizedBlank
  }

  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) {
    return normalizedBlank
  }

  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(parsed.getSeconds())}`
}

const decodeJwtSubject = (token: string): string | null => {
  const parts = token.split('.')
  if (parts.length < 2) {
    return null
  }

  try {
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const decoded = atob(padded)
    const payload = JSON.parse(decoded) as UnknownRecord
    const subject = payload.sub
    return typeof subject === 'string' && subject.trim() !== '' ? subject : null
  } catch {
    return null
  }
}

const resolveSessionEmail = (): string | null => {
  const authState = useAuthStore.getState()
  const fromStore = authState.user?.correo
  if (typeof fromStore === 'string' && fromStore.trim() !== '') {
    return fromStore.trim()
  }
  if (typeof authState.token === 'string' && authState.token.trim() !== '') {
    return decodeJwtSubject(authState.token)
  }
  return null
}

const resolveOrganizerIdentity = async (): Promise<OrganizerIdentity> => {
  const currentEmail = resolveSessionEmail()
  if (
    organizerIdentityCache &&
    (!currentEmail ||
      normalizeLookup(organizerIdentityCache.email) === normalizeLookup(currentEmail))
  ) {
    return organizerIdentityCache
  }

  const response = await callGetWithFallback(['/api/users/organizers'])
  const organizers = pickList(response.data, ['content', 'items', 'organizers', 'users', 'data'])

  const mappedOrganizers = organizers
    .map(item => (isObject(item) ? item : null))
    .filter((item): item is UnknownRecord => item !== null)
    .map(item => ({
      id: toStringValue(item.id),
      email: toStringValue(item.email ?? item.correo),
    }))
    .filter(item => item.id !== '')

  if (mappedOrganizers.length === 0) {
    throw new Error('No fue posible encontrar organizadores registrados en el backend.')
  }

  let selectedOrganizer =
    currentEmail && currentEmail.trim() !== ''
      ? (mappedOrganizers.find(
          organizer => normalizeLookup(organizer.email) === normalizeLookup(currentEmail)
        ) ?? null)
      : null

  if (!selectedOrganizer && mappedOrganizers.length === 1) {
    selectedOrganizer = mappedOrganizers[0]
  }

  if (!selectedOrganizer) {
    throw new Error('No fue posible identificar el organizador autenticado para operar el torneo.')
  }

  organizerIdentityCache = selectedOrganizer
  return selectedOrganizer
}

const resolveOrganizerId = async (): Promise<string> => {
  const organizer = await resolveOrganizerIdentity()
  return organizer.id
}

const loadTeams = async (): Promise<TeamIdentity[]> => {
  if (teamsCache) {
    return teamsCache
  }

  const response = await callGetWithFallback(['/api/teams'])
  const teams = pickList(response.data, ['content', 'items', 'teams', 'equipos', 'data'])

  teamsCache = teams
    .map(item => (isObject(item) ? item : null))
    .filter((item): item is UnknownRecord => item !== null)
    .map(item => ({
      id: toStringValue(item.id ?? item.equipoId),
      nombre: toStringValue(item.nombre ?? item.name),
      capitanId: toStringValue(item.capitanId ?? item.captainId),
    }))
    .filter(item => item.id !== '' && item.nombre.trim() !== '')

  return teamsCache
}

const loadCaptains = async (): Promise<CaptainIdentity[]> => {
  if (captainsCache) {
    return captainsCache
  }

  const response = await callGetWithFallback(['/api/users/captains'])
  const captains = pickList(response.data, ['content', 'items', 'captains', 'users', 'data'])

  captainsCache = captains
    .map(item => (isObject(item) ? item : null))
    .filter((item): item is UnknownRecord => item !== null)
    .map(item => ({
      id: toStringValue(item.id),
      nombre: toStringValue(item.nombre ?? item.name),
    }))
    .filter(item => item.id !== '' && item.nombre.trim() !== '')

  return captainsCache
}

const resolveTeamId = async (nameOrId: string): Promise<string> => {
  const input = nameOrId.trim()
  if (!input) {
    throw new Error('Debe indicar un equipo valido para registrar el partido.')
  }

  const teams = await loadTeams()
  const byId = teams.find(team => team.id === input)
  if (byId) {
    return byId.id
  }

  const normalizedInput = normalizeLookup(input)
  const byName = teams.find(team => normalizeLookup(team.nombre) === normalizedInput)
  if (byName) {
    return byName.id
  }

  throw new Error(`No existe un equipo con el nombre "${nameOrId}".`)
}

const statusToBackend = (status?: TournamentStatus): string | undefined => {
  if (!status) {
    return undefined
  }
  const normalized = status.trim().toUpperCase()
  if (normalized === 'EN_CURSO') {
    return 'EN_CURSO'
  }
  if (normalized === 'FINALIZADO') {
    return 'FINALIZADO'
  }
  return 'CREADO'
}

const normalizeTournament = (item: unknown): OrganizerTournament => {
  const tournament = isObject(item) ? item : {}

  return {
    id: toStringValue(tournament.id ?? tournament.torneoId),
    nombre: toStringValue(tournament.nombre ?? tournament.name, 'Sin nombre'),
    descripcion: toStringValue(tournament.descripcion ?? tournament.description),
    estado: toStringValue(tournament.estado ?? tournament.status, 'CREADO'),
    fechaInicio: toNullableString(tournament.fechaInicio ?? tournament.startDate),
    fechaFin: toNullableString(tournament.fechaFin ?? tournament.endDate),
    equiposInscritos: toNumberValue(
      tournament.equiposInscritos ??
        tournament.teamsRegistered ??
        tournament.equipos ??
        tournament.cantidadEquipos
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
  const fallbackCourts = safeArrayFromValue(configuration.canchas)
  const fallbackSchedules = safeArrayFromValue(configuration.horarios)
  const fallbackSanctions = safeArrayFromValue(configuration.sanciones)

  return {
    reglamento: toStringValue(configuration.reglamento ?? configuration.rules),
    cierreInscripciones: toStringValue(
      configuration.cierreInscripciones ?? configuration.registrationCloseDate
    ),
    canchas: [
      ...pickList(configuration.canchas ?? configuration.courts, ['canchas', 'courts']).map(value =>
        toStringValue(value)
      ),
      ...fallbackCourts,
    ].filter(Boolean),
    horarios: [
      ...pickList(configuration.horarios ?? configuration.schedules, ['horarios', 'schedules']).map(
        value => toStringValue(value)
      ),
      ...fallbackSchedules,
    ].filter(Boolean),
    sanciones: [
      ...pickList(configuration.sanciones ?? configuration.penalties, [
        'sanciones',
        'penalties',
      ]).map(value => toStringValue(value)),
      ...fallbackSanctions,
    ].filter(Boolean),
    fechasImportantes: pickList(configuration.fechasImportantes ?? configuration.importantDates, [
      'fechasImportantes',
      'importantDates',
    ])
      .map(value => toStringValue(value))
      .filter(Boolean),
    cierreInscripcionesFecha: toStringValue(
      configuration.cierreInscripcionesFecha ?? configuration.registrationCloseDay
    ),
    cierreInscripcionesHora: toStringValue(
      configuration.cierreInscripcionesHora ?? configuration.registrationCloseHour
    ),
  }
}

const normalizeMatch = (item: unknown): Match => {
  const match = isObject(item) ? item : {}
  const homeTeam = isObject(match.equipoLocal) ? match.equipoLocal : null
  const awayTeam = isObject(match.equipoVisitante) ? match.equipoVisitante : null
  return {
    id: toStringValue(match.id ?? match.partidoId),
    equipoLocal: toStringValue(
      match.equipoLocalNombre ??
        match.homeTeamName ??
        homeTeam?.nombre ??
        homeTeam?.name ??
        match.equipoLocal ??
        match.homeTeam ??
        match.local,
      'Por definir'
    ),
    equipoVisitante: toStringValue(
      match.equipoVisitanteNombre ??
        match.awayTeamName ??
        awayTeam?.nombre ??
        awayTeam?.name ??
        match.equipoVisitante ??
        match.awayTeam ??
        match.visitante,
      'Por definir'
    ),
    fechaHora: toStringValue(match.fechaHora ?? match.fecha ?? match.dateTime),
    cancha: toStringValue(match.cancha ?? match.court, 'Por definir'),
    estado: toStringValue(match.estado ?? match.status, 'PROGRAMADO'),
    golesLocal:
      match.golesLocal === null || match.homeGoals === null || match.marcadorLocal === null
        ? null
        : toNumberValue(match.golesLocal ?? match.homeGoals ?? match.marcadorLocal, 0),
    golesVisitante:
      match.golesVisitante === null || match.awayGoals === null || match.marcadorVisitante === null
        ? null
        : toNumberValue(match.golesVisitante ?? match.awayGoals ?? match.marcadorVisitante, 0),
  }
}

const normalizeGoalRecord = (item: unknown): MatchGoalRecord | null => {
  const goal = isObject(item) ? item : null
  if (!goal) return null

  const minute = toNumberValue(goal.minuto, -1)
  if (minute < 0) return null

  return {
    id: toStringValue(goal.id ?? goal.golId ?? `${goal.jugadorNombre ?? 'goal'}-${minute}`),
    jugador: toStringValue(goal.jugadorNombre ?? goal.jugador ?? goal.playerName, 'Jugador'),
    minuto: minute,
  }
}

const normalizeSanctionRecord = (item: unknown): MatchSanctionRecord | null => {
  const sanction = isObject(item) ? item : null
  if (!sanction) return null

  const minute = toNumberValue(sanction.minuto, -1)
  if (minute < 0) return null

  const rawType = toStringValue(sanction.tipoSancion ?? sanction.tipo, '').toUpperCase()
  const normalizedType = rawType.includes('ROJA')
    ? 'ROJA'
    : rawType.includes('AMARILLA')
      ? 'AMARILLA'
      : null
  if (!normalizedType) return null

  return {
    id: toStringValue(sanction.id ?? sanction.sancionId ?? `${normalizedType}-${minute}`),
    jugador: toStringValue(
      sanction.jugadorNombre ?? sanction.jugador ?? sanction.playerName,
      'Jugador'
    ),
    minuto: minute,
    tipo: normalizedType,
    descripcion: toStringValue(sanction.descripcion ?? sanction.description),
  }
}

const normalizeMatchDetail = (item: unknown): MatchDetail => {
  const base = normalizeMatch(item)
  const match = isObject(item) ? item : {}
  const tournament = isObject(match.torneo) ? match.torneo : null
  const homeTeam = isObject(match.equipoLocal) ? match.equipoLocal : null
  const awayTeam = isObject(match.equipoVisitante) ? match.equipoVisitante : null

  const goles = pickList(match.goles, ['goles', 'goals', 'data'])
    .map(normalizeGoalRecord)
    .filter((goal): goal is MatchGoalRecord => goal !== null)

  const sanctions = pickList(match.sanciones, ['sanciones', 'sanctions', 'cards', 'data'])
    .map(normalizeSanctionRecord)
    .filter((sanction): sanction is MatchSanctionRecord => sanction !== null)

  return {
    ...base,
    torneoId: toNullableString(match.torneoId ?? tournament?.id),
    equipoLocalId: toNullableString(match.equipoLocalId ?? homeTeam?.id),
    equipoVisitanteId: toNullableString(match.equipoVisitanteId ?? awayTeam?.id),
    goles,
    sanciones: sanctions,
  }
}

const normalizePayment = (item: unknown): PendingPayment => {
  const payment = isObject(item) ? item : {}
  return {
    id: toStringValue(payment.id ?? payment.pagoId),
    equipo: toStringValue(
      payment.equipo ?? payment.teamName ?? payment.equipoNombre,
      'Equipo sin nombre'
    ),
    capitan: toStringValue(payment.capitan ?? payment.capitanNombre, 'Sin capitan'),
    monto: toNumberValue(payment.monto ?? payment.amount),
    fechaSolicitud: toNullableString(
      payment.fechaSolicitud ?? payment.requestDate ?? payment.fechaSubida
    ),
    comprobante: toNullableString(payment.comprobante ?? payment.receipt),
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

const callPostWithPayloadVariants = async (urls: string[], payloads: unknown[]) => {
  let lastError: unknown = null
  for (const payload of payloads) {
    try {
      return await callPostWithFallback(urls, payload)
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

const callPatchWithFallback = async (urls: string[], payload?: unknown) => {
  let lastError: unknown = null
  for (const url of urls) {
    try {
      return await apiClient.patch(url, payload)
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

const callPatchWithPayloadVariants = async (urls: string[], payloads: unknown[]) => {
  let lastError: unknown = null
  for (const payload of payloads) {
    try {
      return await callPatchWithFallback(urls, payload)
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
  if (response && typeof response.data === 'string' && response.data.trim() !== '') {
    return response.data
  }

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
    '/api/tournaments',
    '/api/tournaments/organizer',
    '/api/tournaments/managed',
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
  const organizerId = await resolveOrganizerId()
  const backendStatus = statusToBackend(payload.estado)

  const backendPayload: UnknownRecord = {
    nombre: payload.nombre.trim(),
    fechaInicio: normalizeDateTimeString(payload.fechaInicio, 'start'),
    fechaFin: normalizeDateTimeString(payload.fechaFin, 'end'),
    cantidadEquipos: payload.cupoEquipos,
    costo: payload.costoInscripcion,
  }

  if (backendStatus) {
    backendPayload.estado = backendStatus
  }

  const payloadVariants = [
    backendPayload,
    {
      name: payload.nombre,
      description: payload.descripcion,
      startDate: normalizeDateTimeString(payload.fechaInicio, 'start'),
      endDate: normalizeDateTimeString(payload.fechaFin, 'end'),
      teamLimit: payload.cupoEquipos,
      registrationCost: payload.costoInscripcion,
      status: payload.estado,
    },
  ]

  const response = await callPostWithPayloadVariants(
    [
      `/api/users/organizers/${organizerId}/tournament`,
      '/api/tournaments',
      '/api/tournaments/organizer',
    ],
    payloadVariants
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
    `/api/tournaments/${torneoId}`,
    `/api/tournaments/${torneoId}/settings`,
  ])
  return normalizeConfiguration(response.data)
}

export const guardarConfiguracionTorneo = async (
  torneoId: string,
  payload: TournamentConfiguration
): Promise<void> => {
  const organizerId = await resolveOrganizerId()
  const closeDateRaw =
    payload.cierreInscripciones ||
    (payload.cierreInscripcionesFecha && payload.cierreInscripcionesHora
      ? `${payload.cierreInscripcionesFecha}T${payload.cierreInscripcionesHora}`
      : '')

  const backendPayload = {
    reglamento: payload.reglamento,
    cierreInscripciones: closeDateRaw ? normalizeDateTimeString(closeDateRaw, 'start') : '',
    canchas: payload.canchas.join(', '),
    horarios: payload.horarios.join(', '),
    sanciones: payload.sanciones.join(', '),
  }

  try {
    await callPatchWithPayloadVariants(
      [
        `/api/users/organizers/${organizerId}/tournament/configure`,
        `/api/tournaments/${torneoId}/configuration`,
        `/api/tournaments/${torneoId}/settings`,
      ],
      [backendPayload, payload]
    )
  } catch {
    await callPutWithFallback(
      [`/api/tournaments/${torneoId}/configuration`, `/api/tournaments/${torneoId}/settings`],
      payload
    )
  }
}

const executeTournamentTransition = async (
  organizerEndpoint: string,
  legacyEndpoints: string[]
) => {
  try {
    await callPatchWithFallback([organizerEndpoint])
  } catch {
    await callPostWithFallback(legacyEndpoints)
  }
}

export const iniciarTorneo = async (torneoId: string): Promise<void> => {
  const organizerId = await resolveOrganizerId()
  await executeTournamentTransition(`/api/users/organizers/${organizerId}/tournament/start`, [
    `/api/tournaments/${torneoId}/start`,
    `/api/tournaments/${torneoId}/iniciar`,
  ])
}

export const finalizarTorneo = async (torneoId: string): Promise<void> => {
  const organizerId = await resolveOrganizerId()
  await executeTournamentTransition(`/api/users/organizers/${organizerId}/tournament/end`, [
    `/api/tournaments/${torneoId}/finish`,
    `/api/tournaments/${torneoId}/finalizar`,
  ])
}

export const listarPartidosTorneo = async (torneoId: string): Promise<Match[]> => {
  const response = await callGetWithFallback([
    `/api/matches/tournament/${torneoId}`,
    `/api/tournaments/${torneoId}/matches`,
    `/api/tournaments/${torneoId}/partidos`,
  ])
  const list = pickList(response.data, ['content', 'items', 'matches', 'partidos', 'data'])
  return list.map(normalizeMatch).filter(match => match.id !== '')
}

export const obtenerDetallePartido = async (partidoId: string): Promise<MatchDetail> => {
  const response = await callGetWithFallback([
    `/api/matches/${partidoId}`,
    `/api/partidos/${partidoId}`,
  ])
  return normalizeMatchDetail(response.data)
}

export const registrarPartido = async (
  torneoId: string,
  payload: CreateMatchPayload
): Promise<Match> => {
  const organizerId = await resolveOrganizerId()
  const [equipoLocalId, equipoVisitanteId] = await Promise.all([
    resolveTeamId(payload.equipoLocal),
    resolveTeamId(payload.equipoVisitante),
  ])

  const backendPayload = {
    torneoId,
    equipoLocalId,
    equipoVisitanteId,
    fecha: normalizeDateTimeString(payload.fechaHora, 'start'),
    cancha: payload.cancha.trim(),
  }

  const response = await callPostWithPayloadVariants(
    [`/api/users/organizers/${organizerId}/matches`, `/api/tournaments/${torneoId}/matches`],
    [backendPayload, payload]
  )
  return normalizeMatch(response.data)
}

const buildMissingEndpointError = (fallback: string): Error => {
  return new Error(`${fallback} Endpoint faltante en backend para rol organizador.`)
}

const isNotFoundError = (error: unknown): boolean => {
  if (!isObject(error)) return false
  const response = isObject(error.response) ? error.response : null
  return response?.status === 404
}

export const guardarResultadoPartido = async (
  torneoId: string,
  partidoId: string,
  payload: MatchResultPayload
): Promise<void> => {
  const organizerId = await resolveOrganizerId()
  try {
    await callPutWithFallback(
      [
        `/api/users/organizers/${organizerId}/matches/${partidoId}/result`,
        `/api/tournaments/${torneoId}/matches/${partidoId}/result`,
        `/api/matches/${partidoId}/result`,
      ],
      payload
    )
  } catch (error) {
    if (isNotFoundError(error)) {
      throw buildMissingEndpointError('No se pudo guardar el marcador del partido.')
    }
    throw error
  }
}

export const agregarGoleadorPartido = async (
  torneoId: string,
  partidoId: string,
  payload: MatchGoalPayload
): Promise<void> => {
  const organizerId = await resolveOrganizerId()
  try {
    await callPostWithFallback(
      [
        `/api/users/organizers/${organizerId}/matches/${partidoId}/goals`,
        `/api/tournaments/${torneoId}/matches/${partidoId}/goals`,
        `/api/matches/${partidoId}/goals`,
      ],
      payload
    )
  } catch (error) {
    if (isNotFoundError(error)) {
      throw buildMissingEndpointError('No se pudo registrar el goleador.')
    }
    throw error
  }
}

export const agregarSancionPartido = async (
  torneoId: string,
  partidoId: string,
  payload: MatchSanctionPayload
): Promise<void> => {
  const organizerId = await resolveOrganizerId()
  try {
    await callPostWithFallback(
      [
        `/api/users/organizers/${organizerId}/matches/${partidoId}/sanctions`,
        `/api/tournaments/${torneoId}/matches/${partidoId}/sanctions`,
        `/api/matches/${partidoId}/sanctions`,
      ],
      payload
    )
  } catch (error) {
    if (isNotFoundError(error)) {
      throw buildMissingEndpointError('No se pudo registrar la sancion del partido.')
    }
    throw error
  }
}

export const listarPagosPendientes = async (torneoId: string): Promise<PendingPayment[]> => {
  void torneoId
  const teams = await loadTeams()
  const captainById = new Map<string, string>()

  try {
    const captains = await loadCaptains()
    captains.forEach(captain => {
      captainById.set(captain.id, captain.nombre)
    })
  } catch {
    // Keep without captain labels if captains endpoint is unavailable.
  }

  const teamByName = new Map<string, TeamIdentity>()
  teams.forEach(team => {
    teamByName.set(team.nombre.trim().toLowerCase(), team)
  })

  const normalizeTeamPayment = (item: unknown, team?: TeamIdentity): PendingPayment => {
    const normalized = normalizePayment(item)
    const resolvedTeam = team ?? teamByName.get(normalized.equipo.trim().toLowerCase()) ?? null

    const captainName =
      resolvedTeam && resolvedTeam.capitanId
        ? (captainById.get(resolvedTeam.capitanId) ?? 'Sin capitan')
        : normalized.capitan

    return {
      ...normalized,
      equipo: normalized.equipo || resolvedTeam?.nombre || 'Equipo sin nombre',
      capitan: captainName,
    }
  }

  if (teams.length > 0) {
    const byTeamResponses = await Promise.all(
      teams.map(async team => {
        try {
          const response = await callGetWithFallback([
            `/api/payments/team/${team.id}`,
            `/api/teams/${team.id}/payments`,
          ])
          return { team, response }
        } catch {
          return null
        }
      })
    )

    const allPayments = byTeamResponses
      .flatMap(item => {
        if (!item) return []
        const list = pickList(item.response.data, ['content', 'items', 'payments', 'pagos', 'data'])
        return list.map(payment => normalizeTeamPayment(payment, item.team))
      })
      .filter(payment => payment.id !== '')

    if (allPayments.length > 0) {
      const deduplicated = new Map<string, PendingPayment>()
      allPayments.forEach(payment => {
        deduplicated.set(payment.id, payment)
      })
      return Array.from(deduplicated.values())
    }
  }

  const organizerId = await resolveOrganizerId()
  const fallbackResponse = await callGetWithFallback([
    `/api/users/organizers/${organizerId}/payments/pending`,
    `/api/tournaments/payments/pending`,
  ])
  const fallbackList = pickList(fallbackResponse.data, [
    'content',
    'items',
    'payments',
    'pagos',
    'data',
  ])
  return fallbackList
    .map(payment => normalizeTeamPayment(payment))
    .filter(payment => payment.id !== '')
}

export const aprobarPago = async (torneoId: string, pagoId: string): Promise<void> => {
  const organizerId = await resolveOrganizerId()
  try {
    await callPutWithFallback([
      `/api/users/organizers/${organizerId}/payments/${pagoId}/approve`,
      `/api/tournaments/${torneoId}/payments/${pagoId}/approve`,
    ])
  } catch {
    await callPostWithFallback([
      `/api/tournaments/${torneoId}/payments/${pagoId}/approve`,
      `/api/tournaments/${torneoId}/pagos/${pagoId}/aprobar`,
      `/api/payments/${pagoId}/approve`,
    ])
  }
}

export const rechazarPago = async (torneoId: string, pagoId: string): Promise<void> => {
  const organizerId = await resolveOrganizerId()
  try {
    await callPutWithFallback([
      `/api/users/organizers/${organizerId}/payments/${pagoId}/reject`,
      `/api/tournaments/${torneoId}/payments/${pagoId}/reject`,
    ])
  } catch {
    await callPostWithFallback([
      `/api/tournaments/${torneoId}/payments/${pagoId}/reject`,
      `/api/tournaments/${torneoId}/pagos/${pagoId}/rechazar`,
      `/api/payments/${pagoId}/reject`,
    ])
  }
}

export const marcarPagoEnRevision = async (torneoId: string, pagoId: string): Promise<void> => {
  const organizerId = await resolveOrganizerId()
  try {
    await callPutWithFallback(
      [
        `/api/users/organizers/${organizerId}/payments/${pagoId}/review`,
        `/api/tournaments/${torneoId}/payments/${pagoId}/review`,
        `/api/payments/${pagoId}/review`,
      ],
      { estado: 'EN_REVISION' }
    )
  } catch {
    await callPatchWithFallback(
      [
        `/api/users/organizers/${organizerId}/payments/${pagoId}/status`,
        `/api/tournaments/${torneoId}/payments/${pagoId}/status`,
        `/api/payments/${pagoId}/status`,
      ],
      { estado: 'EN_REVISION' }
    )
  }
}

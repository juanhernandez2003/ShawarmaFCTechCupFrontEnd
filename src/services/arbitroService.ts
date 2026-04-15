import apiClient from './apiClient'
import {
  type ArbitroLineups,
  type MatchSummary,
  alineaciones as fallbackLineups,
} from '../features/arbitro/arbitroData'

type UnknownRecord = Record<string, unknown>

export type RefereeMatchStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'FINISHED' | 'UNKNOWN'
export type TeamSide = 'LOCAL' | 'VISITANTE'
export type MatchAction =
  | 'start'
  | 'finish'
  | 'register_result'
  | 'register_goals'
  | 'register_sanctions'

export interface RefereeMatch extends MatchSummary {
  status: RefereeMatchStatus
  assignedToReferee: boolean
}

export interface RefereeMatchDetail extends RefereeMatch {
  canStart: boolean
  canFinish: boolean
  canRegisterEvents: boolean
}

export interface ResultPayload {
  golesLocal: number
  golesVisitante: number
}

export interface GoalPayload {
  jugador: string
  equipo: TeamSide
  minuto: number
}

export interface SanctionPayload {
  jugador: string
  tipo: 'AMARILLA' | 'ROJA'
  minuto: number
  motivo?: string
}

export interface ServiceActionResult {
  ok: boolean
  error: string | null
}

export interface FetchLineupsResult {
  lineups: ArbitroLineups
  fromBackend: boolean
  error: string | null
}

export interface FetchMatchesResult {
  matches: RefereeMatch[]
  fromBackend: boolean
  error: string | null
}

export interface FetchMatchDetailResult {
  match: RefereeMatchDetail | null
  fromBackend: boolean
  error: string | null
}

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null

const asNonEmptyString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() !== '' ? value.trim() : null

const asBoolean = (value: unknown): boolean | null => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const parsed = value.trim().toLowerCase()
    if (['true', '1', 'si', 'yes'].includes(parsed)) return true
    if (['false', '0', 'no'].includes(parsed)) return false
  }
  return null
}

const getRecordField = (record: UnknownRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (key in record) {
      return record[key]
    }
  }
  return null
}

const extractApiErrorMessage = (error: unknown): string => {
  if (!isRecord(error)) return 'Error desconocido de red.'

  const response = isRecord(error.response) ? error.response : null
  const responseData = response && isRecord(response.data) ? response.data : null

  const detalle = responseData ? asNonEmptyString(responseData.detalle) : null
  if (detalle) return detalle

  const message = responseData ? asNonEmptyString(responseData.message) : null
  if (message) return message

  const generic = asNonEmptyString(error.message)
  if (generic) return generic

  return 'Error desconocido de red.'
}

const normalizeStatus = (value: unknown): RefereeMatchStatus => {
  const status = asNonEmptyString(value)?.toUpperCase() ?? ''

  if (
    status.includes('ASSIGNED') ||
    status.includes('ASIGNADO') ||
    status.includes('PROGRAMADO') ||
    status.includes('SCHEDULED')
  ) {
    return 'ASSIGNED'
  }

  if (
    status.includes('IN_PROGRESS') ||
    status.includes('EN_CURSO') ||
    status.includes('LIVE') ||
    status.includes('STARTED')
  ) {
    return 'IN_PROGRESS'
  }

  if (
    status.includes('FINISHED') ||
    status.includes('FINALIZADO') ||
    status.includes('COMPLETED') ||
    status.includes('CERRADO')
  ) {
    return 'FINISHED'
  }

  return 'UNKNOWN'
}

const extractDateValue = (payload: UnknownRecord): string => {
  const value = getRecordField(payload, [
    'fecha',
    'date',
    'fechaPartido',
    'matchDate',
    'scheduledAt',
    'createdAt',
  ])
  return asNonEmptyString(value) ?? 'Sin fecha'
}

const extractFieldValue = (payload: UnknownRecord): string => {
  const direct = getRecordField(payload, ['cancha', 'field', 'venue', 'canchaNombre'])
  if (asNonEmptyString(direct)) {
    return asNonEmptyString(direct) ?? 'Sin cancha'
  }

  if (isRecord(direct)) {
    const nested = getRecordField(direct, ['nombre', 'name'])
    return asNonEmptyString(nested) ?? 'Sin cancha'
  }

  return 'Sin cancha'
}

const extractTeamName = (payload: unknown, fallback: string): string => {
  if (isRecord(payload)) {
    const value = getRecordField(payload, ['nombre', 'name', 'equipo', 'teamName'])
    return asNonEmptyString(value) ?? fallback
  }

  return asNonEmptyString(payload) ?? fallback
}

const extractScore = (payload: UnknownRecord): string => {
  const direct = getRecordField(payload, ['marcador', 'score', 'resultado'])
  if (asNonEmptyString(direct)) {
    return asNonEmptyString(direct) ?? 'Pendiente'
  }

  if (isRecord(direct)) {
    const localScore = getRecordField(direct, ['local', 'home', 'golesLocal', 'homeScore'])
    const awayScore = getRecordField(direct, ['visitante', 'away', 'golesVisitante', 'awayScore'])
    const local = Number(localScore)
    const away = Number(awayScore)
    if (!Number.isNaN(local) && !Number.isNaN(away)) {
      return `${local} - ${away}`
    }
  }

  const homeScore = Number(getRecordField(payload, ['homeScore', 'golesLocal']))
  const awayScore = Number(getRecordField(payload, ['awayScore', 'golesVisitante']))
  if (!Number.isNaN(homeScore) && !Number.isNaN(awayScore)) {
    return `${homeScore} - ${awayScore}`
  }

  return 'Pendiente'
}

const normalizeMatch = (
  item: unknown,
  index: number,
  defaultAssignedToReferee = true
): RefereeMatch | null => {
  if (!isRecord(item)) return null

  const local = extractTeamName(
    getRecordField(item, ['local', 'homeTeam', 'equipoLocal', 'teamHome']),
    'Equipo local'
  )
  const visitante = extractTeamName(
    getRecordField(item, ['visitante', 'awayTeam', 'equipoVisitante', 'teamAway']),
    'Equipo visitante'
  )

  const idValue = getRecordField(item, ['id', 'matchId', 'partidoId'])
  const id = asNonEmptyString(idValue) ?? `match-${index + 1}`

  const assignedFlag =
    asBoolean(getRecordField(item, ['assignedToReferee', 'asignadoArbitro', 'isAssigned'])) ??
    defaultAssignedToReferee

  return {
    id,
    local,
    visitante,
    fecha: extractDateValue(item),
    cancha: extractFieldValue(item),
    marcador: extractScore(item),
    status: normalizeStatus(getRecordField(item, ['status', 'estado', 'matchStatus'])),
    assignedToReferee: assignedFlag,
  }
}

const normalizeMatchesPayload = (
  payload: unknown,
  defaultAssignedToReferee = true
): RefereeMatch[] | null => {
  const candidates: unknown[] = [payload]

  if (isRecord(payload)) {
    const nestedCandidates = [
      payload.data,
      payload.content,
      payload.result,
      payload.matches,
      payload.partidos,
    ]
    for (const nested of nestedCandidates) {
      if (nested !== undefined && nested !== null) {
        candidates.push(nested)
      }
    }
  }

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) continue

    return candidate
      .map((item, index) => normalizeMatch(item, index, defaultAssignedToReferee))
      .filter((value): value is RefereeMatch => value !== null)
  }

  return null
}

const normalizeMatchDetailPayload = (
  payload: unknown,
  matchId: string
): RefereeMatchDetail | null => {
  const directMatch = normalizeMatch(payload, 0, false)
  const recordCandidate = isRecord(payload)
    ? payload
    : isRecord((payload as UnknownRecord | null)?.data)
      ? ((payload as UnknownRecord).data as UnknownRecord)
      : null

  const base = directMatch ?? (recordCandidate ? normalizeMatch(recordCandidate, 0, false) : null)
  if (!base) return null

  const source = recordCandidate ?? (isRecord(payload) ? payload : null)

  const canStartFlag = source
    ? asBoolean(getRecordField(source, ['canStart', 'puedeIniciar']))
    : null
  const canFinishFlag = source
    ? asBoolean(getRecordField(source, ['canFinish', 'puedeFinalizar']))
    : null
  const canRegisterFlag = source
    ? asBoolean(getRecordField(source, ['canRegisterEvents', 'puedeRegistrarEventos']))
    : null
  const assignedFlag = source
    ? asBoolean(getRecordField(source, ['assignedToReferee', 'asignadoArbitro', 'isAssigned']))
    : null

  const assignedToReferee = assignedFlag ?? base.assignedToReferee
  const status = base.status
  const canStart = canStartFlag ?? (assignedToReferee && status === 'ASSIGNED')
  const canFinish = canFinishFlag ?? (assignedToReferee && status === 'IN_PROGRESS')
  const canRegisterEvents =
    canRegisterFlag ?? (assignedToReferee && (status === 'IN_PROGRESS' || status === 'FINISHED'))

  return {
    ...base,
    id: base.id || matchId,
    assignedToReferee,
    canStart,
    canFinish,
    canRegisterEvents,
  }
}

const normalizePlayerName = (value: unknown, index: number): string => {
  if (typeof value === 'string' && value.trim() !== '') {
    return value.trim()
  }

  if (isRecord(value)) {
    const candidate = getRecordField(value, [
      'nombre',
      'name',
      'fullName',
      'jugador',
      'displayName',
      'correo',
      'email',
    ])
    const parsed = asNonEmptyString(candidate)
    if (parsed) return parsed
  }

  return `Jugador ${index + 1}`
}

const normalizePlayers = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((player, index) => normalizePlayerName(player, index))
  }
  return []
}

const normalizeTeamName = (value: unknown, fallback: string): string => {
  if (isRecord(value)) {
    const name = getRecordField(value, ['equipo', 'nombre', 'name', 'teamName'])
    return asNonEmptyString(name) ?? fallback
  }
  return asNonEmptyString(value) ?? fallback
}

const normalizeTeamLineup = (
  teamValue: unknown,
  fallbackTeamName: string
): { equipo: string; jugadores: string[] } | null => {
  if (!isRecord(teamValue)) return null

  const equipo = normalizeTeamName(teamValue, fallbackTeamName)
  const playersRaw = getRecordField(teamValue, ['jugadores', 'players', 'lineup', 'alineacion'])
  const jugadores = normalizePlayers(playersRaw)

  if (jugadores.length === 0) return null
  return { equipo, jugadores }
}

const normalizeFromDirectShape = (payload: unknown): ArbitroLineups | null => {
  if (!isRecord(payload)) return null

  const localTeam = normalizeTeamLineup(payload.local, 'Equipo local')
  const visitanteTeam = normalizeTeamLineup(payload.visitante, 'Equipo visitante')

  if (!localTeam || !visitanteTeam) return null

  return {
    local: localTeam,
    visitante: visitanteTeam,
  }
}

const normalizeFromHomeAwayShape = (payload: unknown): ArbitroLineups | null => {
  if (!isRecord(payload)) return null

  const home = normalizeTeamLineup(
    getRecordField(payload, ['homeTeam', 'localTeam', 'equipoLocal']),
    'Equipo local'
  )
  const away = normalizeTeamLineup(
    getRecordField(payload, ['awayTeam', 'visitorTeam', 'equipoVisitante']),
    'Equipo visitante'
  )

  if (!home || !away) return null

  return {
    local: home,
    visitante: away,
  }
}

const resolveRole = (team: UnknownRecord): 'LOCAL' | 'VISITANTE' | 'UNKNOWN' => {
  const roleValue = getRecordField(team, ['rol', 'role', 'side', 'tipo'])
  const role = asNonEmptyString(roleValue)?.toUpperCase() ?? ''
  if (role.includes('LOCAL') || role.includes('HOME')) return 'LOCAL'
  if (role.includes('VISIT') || role.includes('AWAY')) return 'VISITANTE'
  return 'UNKNOWN'
}

const normalizeFromTeamsArray = (payload: unknown): ArbitroLineups | null => {
  if (!isRecord(payload)) return null

  const teamsRaw = getRecordField(payload, ['teams', 'equipos', 'participants'])
  if (!Array.isArray(teamsRaw) || teamsRaw.length < 2) return null

  const teams = teamsRaw.filter(isRecord)
  if (teams.length < 2) return null

  let localCandidate: UnknownRecord | null = null
  let visitanteCandidate: UnknownRecord | null = null

  for (const team of teams) {
    const role = resolveRole(team)
    if (role === 'LOCAL' && !localCandidate) localCandidate = team
    if (role === 'VISITANTE' && !visitanteCandidate) visitanteCandidate = team
  }

  const local = normalizeTeamLineup(localCandidate ?? teams[0], 'Equipo local')
  const visitante = normalizeTeamLineup(visitanteCandidate ?? teams[1], 'Equipo visitante')
  if (!local || !visitante) return null

  return {
    local,
    visitante,
  }
}

const normalizeLineupsPayload = (payload: unknown): ArbitroLineups | null => {
  const candidates: unknown[] = [payload]

  if (isRecord(payload)) {
    const nested = [payload.data, payload.content, payload.result]
    for (const item of nested) {
      if (item !== undefined && item !== null) {
        candidates.push(item)
      }
    }
  }

  for (const candidate of candidates) {
    const direct = normalizeFromDirectShape(candidate)
    if (direct) return direct

    const homeAway = normalizeFromHomeAwayShape(candidate)
    if (homeAway) return homeAway

    const teamsArray = normalizeFromTeamsArray(candidate)
    if (teamsArray) return teamsArray
  }

  return null
}

const statusAllowsAction = (status: RefereeMatchStatus, action: MatchAction): boolean => {
  if (action === 'start') return status === 'ASSIGNED'
  if (action === 'finish') return status === 'IN_PROGRESS'
  return status === 'IN_PROGRESS' || status === 'FINISHED'
}

export const bloqueoAccionPartido = (
  match: RefereeMatchDetail | null,
  action: MatchAction
): string | null => {
  if (!match) return 'No se pudo cargar el detalle del partido.'
  if (!match.assignedToReferee)
    return 'No puedes operar este partido porque no esta asignado a tu cuenta.'

  if (action === 'start' && !match.canStart)
    return 'No se puede iniciar este partido en su estado actual.'
  if (action === 'finish' && !match.canFinish)
    return 'No se puede finalizar este partido en su estado actual.'
  if (action !== 'start' && action !== 'finish' && !match.canRegisterEvents) {
    return 'No se pueden registrar eventos para este partido en su estado actual.'
  }

  if (!statusAllowsAction(match.status, action)) {
    return 'La accion no esta permitida por el estado actual del partido.'
  }

  return null
}

export const validarResultadoPayload = (payload: ResultPayload): string | null => {
  if (!Number.isInteger(payload.golesLocal) || payload.golesLocal < 0) {
    return 'El marcador local debe ser un numero entero mayor o igual a 0.'
  }
  if (!Number.isInteger(payload.golesVisitante) || payload.golesVisitante < 0) {
    return 'El marcador visitante debe ser un numero entero mayor o igual a 0.'
  }
  return null
}

export const validarGoleadorPayload = (payload: GoalPayload): string | null => {
  if (!payload.jugador.trim()) return 'Debes indicar el nombre del goleador.'
  if (!['LOCAL', 'VISITANTE'].includes(payload.equipo)) {
    return 'Debes seleccionar el equipo del goleador.'
  }
  if (!Number.isInteger(payload.minuto) || payload.minuto < 0 || payload.minuto > 90) {
    return 'El minuto del gol debe ser un entero entre 0 y 90.'
  }
  return null
}

export const validarSancionPayload = (payload: SanctionPayload): string | null => {
  if (!payload.jugador.trim()) return 'Debes indicar el jugador sancionado.'
  if (!['AMARILLA', 'ROJA'].includes(payload.tipo)) return 'El tipo de sancion no es valido.'
  if (!Number.isInteger(payload.minuto) || payload.minuto < 0 || payload.minuto > 90) {
    return 'El minuto de la sancion debe ser un entero entre 0 y 90.'
  }
  return null
}

const postToFirstAvailable = async (endpoints: string[], payload?: unknown): Promise<void> => {
  let lastError = 'No se pudo completar la operacion.'

  for (const endpoint of endpoints) {
    try {
      await apiClient.post(endpoint, payload ?? {})
      return
    } catch (error: unknown) {
      lastError = extractApiErrorMessage(error)
    }
  }

  throw new Error(lastError)
}

export const obtenerPartidosAsignadosArbitro = async (): Promise<FetchMatchesResult> => {
  const endpoints = [
    '/api/referees/me/matches/assigned',
    '/api/referees/me/matches?status=ASSIGNED',
    '/api/arbitro/partidos/asignados',
    '/api/matches?status=ASSIGNED',
  ]

  let lastError: string | null = null

  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.get<unknown>(endpoint)
      const normalized = normalizeMatchesPayload(response.data, true)
      if (normalized !== null) {
        const filtered = normalized.filter(match => match.status !== 'FINISHED')
        return {
          matches: filtered,
          fromBackend: true,
          error: null,
        }
      }
      lastError = 'El formato de respuesta de partidos asignados no es compatible.'
    } catch (error: unknown) {
      lastError = extractApiErrorMessage(error)
    }
  }

  return {
    matches: [],
    fromBackend: false,
    error: lastError ?? 'No fue posible cargar los partidos asignados.',
  }
}

export const obtenerHistorialPartidosArbitrados = async (): Promise<FetchMatchesResult> => {
  const endpoints = [
    '/api/referees/me/matches/arbitrated',
    '/api/referees/me/matches?status=FINISHED',
    '/api/arbitro/partidos/arbitrados',
    '/api/partidos/arbitrados',
    '/api/matches?status=FINISHED',
  ]

  let lastError: string | null = null

  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.get<unknown>(endpoint)
      const normalized = normalizeMatchesPayload(response.data, true)
      if (normalized !== null) {
        return {
          matches: normalized,
          fromBackend: true,
          error: null,
        }
      }
      lastError = 'El formato de respuesta de historial no es compatible.'
    } catch (error: unknown) {
      lastError = extractApiErrorMessage(error)
    }
  }

  return {
    matches: [],
    fromBackend: false,
    error: lastError ?? 'No fue posible cargar el historial de partidos arbitrados.',
  }
}

export const obtenerDetallePartidoArbitro = async (
  matchId: string
): Promise<FetchMatchDetailResult> => {
  const endpoints = [
    `/api/referees/me/matches/${matchId}`,
    `/api/arbitro/partidos/${matchId}`,
    `/api/matches/${matchId}`,
  ]

  let lastError: string | null = null

  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.get<unknown>(endpoint)
      const normalized = normalizeMatchDetailPayload(response.data, matchId)
      if (normalized) {
        return {
          match: normalized,
          fromBackend: true,
          error: null,
        }
      }
      lastError = 'El formato del detalle del partido no es compatible.'
    } catch (error: unknown) {
      lastError = extractApiErrorMessage(error)
    }
  }

  return {
    match: null,
    fromBackend: false,
    error: lastError ?? 'No fue posible cargar el detalle del partido.',
  }
}

export const obtenerAlineacionesArbitro = async (matchId?: string): Promise<FetchLineupsResult> => {
  const endpoints: string[] = []

  if (matchId) {
    endpoints.push(
      `/api/matches/${matchId}/lineups`,
      `/api/matches/${matchId}/alineaciones`,
      `/api/partidos/${matchId}/alineaciones`
    )
  }

  endpoints.push(
    '/api/referees/me/next-match/lineups',
    '/api/arbitro/partidos/proximo/alineaciones'
  )

  let lastError: string | null = null

  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.get<unknown>(endpoint)
      const normalized = normalizeLineupsPayload(response.data)
      if (normalized) {
        return {
          lineups: normalized,
          fromBackend: true,
          error: null,
        }
      }
      lastError = 'El formato de alineaciones recibido no es compatible.'
    } catch (error: unknown) {
      lastError = extractApiErrorMessage(error)
    }
  }

  return {
    lineups: fallbackLineups,
    fromBackend: false,
    error: lastError ?? 'No se pudieron cargar alineaciones desde backend.',
  }
}

export const iniciarPartidoArbitro = async (
  match: RefereeMatchDetail | null
): Promise<ServiceActionResult> => {
  const bloqueo = bloqueoAccionPartido(match, 'start')
  if (bloqueo) return { ok: false, error: bloqueo }
  if (!match) return { ok: false, error: 'No se pudo identificar el partido.' }

  try {
    await postToFirstAvailable([
      `/api/referees/me/matches/${match.id}/start`,
      `/api/arbitro/partidos/${match.id}/iniciar`,
      `/api/matches/${match.id}/start`,
    ])
    return { ok: true, error: null }
  } catch (error: unknown) {
    return { ok: false, error: extractApiErrorMessage(error) }
  }
}

export const finalizarPartidoArbitro = async (
  match: RefereeMatchDetail | null
): Promise<ServiceActionResult> => {
  const bloqueo = bloqueoAccionPartido(match, 'finish')
  if (bloqueo) return { ok: false, error: bloqueo }
  if (!match) return { ok: false, error: 'No se pudo identificar el partido.' }

  try {
    await postToFirstAvailable([
      `/api/referees/me/matches/${match.id}/finish`,
      `/api/arbitro/partidos/${match.id}/finalizar`,
      `/api/matches/${match.id}/finish`,
    ])
    return { ok: true, error: null }
  } catch (error: unknown) {
    return { ok: false, error: extractApiErrorMessage(error) }
  }
}

export const registrarResultadoArbitro = async (
  match: RefereeMatchDetail | null,
  payload: ResultPayload
): Promise<ServiceActionResult> => {
  const validation = validarResultadoPayload(payload)
  if (validation) return { ok: false, error: validation }

  const bloqueo = bloqueoAccionPartido(match, 'register_result')
  if (bloqueo) return { ok: false, error: bloqueo }
  if (!match) return { ok: false, error: 'No se pudo identificar el partido.' }

  try {
    await postToFirstAvailable(
      [
        `/api/referees/me/matches/${match.id}/result`,
        `/api/arbitro/partidos/${match.id}/resultado`,
        `/api/matches/${match.id}/result`,
      ],
      payload
    )
    return { ok: true, error: null }
  } catch (error: unknown) {
    return { ok: false, error: extractApiErrorMessage(error) }
  }
}

export const registrarGoleadorArbitro = async (
  match: RefereeMatchDetail | null,
  payload: GoalPayload
): Promise<ServiceActionResult> => {
  const validation = validarGoleadorPayload(payload)
  if (validation) return { ok: false, error: validation }

  const bloqueo = bloqueoAccionPartido(match, 'register_goals')
  if (bloqueo) return { ok: false, error: bloqueo }
  if (!match) return { ok: false, error: 'No se pudo identificar el partido.' }

  try {
    await postToFirstAvailable(
      [
        `/api/referees/me/matches/${match.id}/goals`,
        `/api/arbitro/partidos/${match.id}/goleadores`,
        `/api/matches/${match.id}/goals`,
      ],
      payload
    )
    return { ok: true, error: null }
  } catch (error: unknown) {
    return { ok: false, error: extractApiErrorMessage(error) }
  }
}

export const registrarSancionArbitro = async (
  match: RefereeMatchDetail | null,
  payload: SanctionPayload
): Promise<ServiceActionResult> => {
  const validation = validarSancionPayload(payload)
  if (validation) return { ok: false, error: validation }

  const bloqueo = bloqueoAccionPartido(match, 'register_sanctions')
  if (bloqueo) return { ok: false, error: bloqueo }
  if (!match) return { ok: false, error: 'No se pudo identificar el partido.' }

  try {
    await postToFirstAvailable(
      [
        `/api/referees/me/matches/${match.id}/sanctions`,
        `/api/arbitro/partidos/${match.id}/sanciones`,
        `/api/matches/${match.id}/sanctions`,
      ],
      payload
    )
    return { ok: true, error: null }
  } catch (error: unknown) {
    return { ok: false, error: extractApiErrorMessage(error) }
  }
}
